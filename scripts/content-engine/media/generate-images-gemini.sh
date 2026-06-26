#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# generate-images-gemini.sh <slug>        — headless Gemini image generation
# generate-images-gemini.sh login         — one-time headed Google/Gemini login
#
# Replaces the dead Codex image path (images-only.ts, out of credits ~till mid-July)
# with Gemini-in-browser, driven HEADLESS via agent-browser (CDP), so the nightly
# media job can bebildern an approved article with NO human and NO claude session.
#
# Produces, into scripts/content-engine/.work/<slug>-staging/:
#   hero.png  (hero photo WITH the handwritten brand hook baked in)
#   ctx1.png ctx2.png ctx3.png  (context photos, no hook, no gradient)
# then runs apply-images-browser.ts <slug> which renders the SVG infographic locally,
# copies the staged photos into public/images/blog/, inserts them after their H2s and
# sets featuredImage. The infographic is NOT generated here (local SVG, no browser).
#
# Idempotent: a valid staged PNG (>20KB) is reused, so a partial run resumes cheaply.
# Fail-closed: if the HERO cannot be produced, exit non-zero WITHOUT touching the article,
# so the Teil-1 `needs-images` marker / Hero-Guard safety net keeps the slug flagged.
#
# Requires (one-time, by Thomas — the agent may not enter Google credentials):
#   npm i -g agent-browser && agent-browser install
#   ./generate-images-gemini.sh login      (headed; log in as t.uhlir@immo.red, /u/3/)
# ─────────────────────────────────────────────────────────────────────────────
set -uo pipefail

# --- PATH: homebrew + nvm node bin + ~/.local/bin + npm global bin (agent-browser) ---
NVM_MAJOR="$(cat "$HOME/.nvm/alias/default" 2>/dev/null | tr -dc '0-9.')"
NVM_BIN="$(ls -d "$HOME"/.nvm/versions/node/v${NVM_MAJOR:-20}*/bin 2>/dev/null | sort -V | tail -1)"
NPM_GLOBAL_BIN="$(npm config get prefix 2>/dev/null)/bin"
export PATH="${NVM_BIN:-$HOME/.nvm/versions/node/v20.20.0/bin}:/opt/homebrew/bin:/opt/homebrew/sbin:$HOME/.local/bin:${NPM_GLOBAL_BIN}:$PATH"
export DISABLE_AUTOUPDATER=1

# --- Self-locate the repo root (works from worktree / symlink, like the other triggers) ---
SELF="${BASH_SOURCE[0]}"
while [ -L "$SELF" ]; do SELF="$(cd "$(dirname "$SELF")" && pwd)/$(readlink "$SELF")"; done
REPO="$(cd "$(dirname "$SELF")/../../.." && pwd)"
cd "$REPO" || { echo "FATAL: repo root nicht gefunden"; exit 1; }
[ -f .env.local ] && set -a && . ./.env.local && set +a

# --- Config ---
GEMINI_URL="${GEMINI_URL:-https://gemini.google.com/app}"   # dedicated agent-browser profile = single account (t.uhlir@immo.red) -> /app
GEMINI_PROFILE="${GEMINI_PROFILE:-$HOME/.agent-browser-profiles/gemini-immo}"
RENDER_TIMEOUT_MS="${RENDER_TIMEOUT_MS:-200000}"   # Gemini image render ~60-120s; allow headroom
SESSION="gemini-img"
DECODE="scripts/content-engine/media/decode-img.cjs"
EVAL_EXTRACT="scripts/content-engine/media/gemini-extract.js"   # the in-page extraction script

mkdir -p "$(dirname "$GEMINI_PROFILE")"

if ! command -v agent-browser >/dev/null 2>&1; then
    echo "FATAL: agent-browser nicht installiert. Einmalig (durch Thomas): npm i -g agent-browser && agent-browser install"
    exit 3
fi
AB=(agent-browser --session "$SESSION" --profile "$GEMINI_PROFILE")

# ── One-time headed login ────────────────────────────────────────────────────
if [ "${1:-}" = "login" ]; then
    echo "Oeffne Gemini HEADED zum einmaligen Login (Konto t.uhlir@immo.red, /u/3/) ..."
    echo "Nach erfolgreichem Login dieses Fenster offen lassen bis die Startseite da ist, dann: agent-browser --session $SESSION close"
    "${AB[@]}" --headed open "$GEMINI_URL"
    exit $?
fi

SLUG="${1:-}"
[ -n "$SLUG" ] || { echo "Usage: $0 <slug> | login"; exit 2; }

# Cleanup: agent-browser-Daemon + Chrome bei JEDEM Exit dieses Skripts schliessen (Erfolg ODER Fehler),
# damit ein fehlgeschlagener/abgebrochener Render keine verwaisten chrome-150-Prozesse hinterlaesst,
# die sich ueber Laeufe hinweg stapeln (beobachtet 2026-06-26: ~90 Orphan-Chrome -> Last 74). NUR im
# Normal-Pfad (der einmalige `login` oben haelt den Browser bewusst offen und endet vorher per exit).
trap '"${AB[@]}" close --all >/dev/null 2>&1 || true' EXIT

STAGE="scripts/content-engine/.work/${SLUG}-staging"
mkdir -p "$STAGE"
LOG="$STAGE/gemini-images.log"
echo "==== generate-images-gemini $SLUG $(date) ====" | tee -a "$LOG"

# ── 1. Build plan + fully-assembled Gemini prompts (single source of truth) ──
PLAN_RAW="$(npx tsx scripts/content-engine/media/build-image-plan.ts "$SLUG" 2>>"$LOG")"
PLAN_JSON="$(printf '%s\n' "$PLAN_RAW" | sed -n 's/^GEMINI_PLAN=//p' | head -1)"
if [ -z "$PLAN_JSON" ]; then
    echo "FATAL: build-image-plan lieferte keinen Plan (siehe $LOG)" | tee -a "$LOG"
    exit 4
fi

# Emit one line per image: TAG<TAB>OUT<TAB>PROMPT_BASE64  (base64 avoids all quoting issues).
# read-loop instead of `mapfile` — macOS /bin/bash is 3.2 and has no mapfile.
IMG_LINES=()
while IFS= read -r _l; do IMG_LINES+=("$_l"); done < <(printf '%s' "$PLAN_JSON" | /opt/homebrew/bin/node -e '
let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
  const j=JSON.parse(s);
  for(const im of j.images){
    process.stdout.write(im.tag+"\t"+im.out+"\t"+Buffer.from(im.prompt,"utf8").toString("base64")+"\n");
  }
});')
if [ "${#IMG_LINES[@]}" -eq 0 ]; then
    echo "FATAL: Plan enthielt keine Bilder" | tee -a "$LOG"; exit 4
fi

# ── 2. Per image: idempotent skip, else render via Gemini ────────────────────
valid_png() { [ -f "$1" ] && [ "$(stat -f%z "$1" 2>/dev/null || echo 0)" -gt 20480 ]; }

# gemini_render <prompt> <outfile>  — drive Gemini headless to produce ONE image.
# ┌─ CALIBRATION SEAM ─────────────────────────────────────────────────────────┐
# │ The agent-browser <-> Gemini DOM steps below are a FIRST IMPLEMENTATION and │
# │ MUST be calibrated against the live, logged-in Gemini page once (selectors  │
# │ for the prompt box, the "image done" signal, and the generated <img>). Run  │
# │ `agent-browser --session gemini-img --profile <p> snapshot -i` on a Gemini  │
# │ chat to read the real refs/roles, then adjust find/wait/eval accordingly.   │
# │ Everything OUTSIDE this function (plan, idempotency, decode, apply, fail-    │
# │ closed) is already verified and does not depend on the calibration.         │
# └────────────────────────────────────────────────────────────────────────────┘
# Open Gemini and confirm the page is ACTUALLY loaded there before proceeding. On a COLD
# agent-browser daemon `open` returns nonzero with "Could not configure browser (os error 35)"
# YET the browser still finishes launching ~16s later (verified 23.06 — manual patient open
# succeeded while the script's `open || return 1` gave up). So we do NOT trust the exit code:
# we poll get-url until we are on gemini.google.com (up to ~120s), which absorbs the slow
# cold-start instead of treating the transient configure error as a fatal render failure.
_ensure_gemini_loaded() {
    local t=0 url=""
    "${AB[@]}" open "$GEMINI_URL" >>"$LOG" 2>&1 || true
    until printf '%s' "$url" | grep -q "gemini.google.com" || [ "$t" -ge 24 ]; do
        sleep 5; t=$((t+1))
        url="$("${AB[@]}" get url 2>/dev/null | grep -E '^https?://' | tail -1)"
    done
    printf '%s' "$url" | grep -q "gemini.google.com"
}

# Retry wrapper: transiente Gemini/agent-browser-Aussetzer kommen vor (v.a. beim ERSTEN Bild nach
# Daemon-Kaltstart — beobachtet 22.06: Hero-Render-Timeout, danach auf Anhieb ok). Bis zu 3 Versuche.
gemini_render() {
    local prompt="$1" outfile="$2" attempt
    for attempt in 1 2 3; do
        if _gemini_render_once "$prompt" "$outfile"; then return 0; fi
        echo "  Render-Versuch $attempt fuer $(basename "$outfile") fehlgeschlagen$( [ "$attempt" -lt 3 ] && echo ', neuer Versuch ...' || echo ' (aufgegeben)')" | tee -a "$LOG"
        sleep 3
    done
    return 1
}

_gemini_render_once() {
    local prompt="$1" outfile="$2"
    local dataurl_file; dataurl_file="$(mktemp /tmp/gemini-dataurl.XXXXXX)"

    # Fresh page = fresh conversation (clean context per image; profile keeps us logged in).
    # Resilient open: tolerates the cold-start os-error-35 by verifying we landed on Gemini.
    _ensure_gemini_loaded || return 1
    "${AB[@]}" wait --load networkidle >>"$LOG" 2>&1 || true

    # Type the prompt into Gemini's contenteditable input and submit.
    # Primary: semantic role; fallback: the Quill editor / contenteditable used by Gemini (CSS
    # selectors are passed DIRECTLY as the target, there is no `find css` subcommand).
    if ! "${AB[@]}" find role textbox fill "$prompt" >>"$LOG" 2>&1; then
        "${AB[@]}" fill 'div[contenteditable="true"]' "$prompt" >>"$LOG" 2>&1 \
            || "${AB[@]}" fill '.ql-editor' "$prompt" >>"$LOG" 2>&1 || return 1
    fi
    "${AB[@]}" press Enter >>"$LOG" 2>&1 || true

    # Wait until a generated image (blob:/data: <img>) appears in the response, or timeout.
    "${AB[@]}" wait --fn "(() => { const im=[...document.querySelectorAll('img')].find(i=>/^(blob:|data:image)/.test(i.currentSrc||i.src)); return !!im && (im.naturalWidth>256); })()" --timeout "$RENDER_TIMEOUT_MS" >>"$LOG" 2>&1 || {
        echo "  WARN Render-Timeout/keine Bild-Erkennung ($outfile)" | tee -a "$LOG"; return 1; }

    # Extract the generated image as a PNG data URL (canvas.toDataURL) to stdout, via the repo
    # extraction script piped over stdin (eval supports --stdin / -b, NOT --file).
    "${AB[@]}" eval --stdin <"$EVAL_EXTRACT" >"$dataurl_file" 2>>"$LOG" || { echo "  WARN eval-extract fehlgeschlagen" | tee -a "$LOG"; return 1; }

    # Decode -> sized PNG. Fail-closed: decode rejects garbage/empty (no partial written).
    NODE_PATH="$REPO/node_modules" /opt/homebrew/bin/node "$DECODE" "$dataurl_file" "$outfile" >>"$LOG" 2>&1 || {
        echo "  WARN decode fehlgeschlagen ($outfile)" | tee -a "$LOG"; rm -f "$dataurl_file"; return 1; }
    rm -f "$dataurl_file"
    return 0
}

# Pre-warm the daemon ONCE: pay the slow cold-start here (outside any per-image retry budget) so
# every per-image render below opens a warm, fast daemon. Non-fatal: if this can't reach Gemini the
# per-image _ensure_gemini_loaded still retries, and the hero fail-closed guard catches a real outage.
if _ensure_gemini_loaded; then
    echo "  prewarm: Gemini geladen (Daemon warm)" | tee -a "$LOG"
else
    echo "  WARN prewarm: Gemini nicht erreichbar — pro-Bild-Retry greift, Hero-Guard sichert ab" | tee -a "$LOG"
fi

FAILED=0
for line in "${IMG_LINES[@]}"; do
    TAG="${line%%$'\t'*}"; rest="${line#*$'\t'}"
    OUT="${rest%%$'\t'*}"; PROMPT_B64="${rest#*$'\t'}"
    OUTFILE="$STAGE/$OUT"
    if valid_png "$OUTFILE"; then
        echo "  $TAG: vorhanden, ueberspringe (idempotent)" | tee -a "$LOG"; continue
    fi
    PROMPT="$(printf '%s' "$PROMPT_B64" | base64 --decode)"
    echo "  $TAG: generiere via Gemini ..." | tee -a "$LOG"
    if gemini_render "$PROMPT" "$OUTFILE"; then
        echo "  $TAG: OK -> $OUTFILE" | tee -a "$LOG"
    else
        echo "  $TAG: FEHLGESCHLAGEN" | tee -a "$LOG"; FAILED=$((FAILED+1))
    fi
done
"${AB[@]}" close >>"$LOG" 2>&1 || true

# ── 3. Fail-closed: the HERO is mandatory. Without it, do NOT touch the article. ──
if ! valid_png "$STAGE/hero.png"; then
    echo "FATAL: Hero nicht erzeugt — Artikel bleibt unveraendert, needs-images-Netz greift." | tee -a "$LOG"
    exit 5
fi
[ "$FAILED" -gt 0 ] && echo "WARN: $FAILED Kontextbild(er) fehlten — fahre mit vorhandenen fort." | tee -a "$LOG"

# ── 4. Apply: hero + staged ctx + local infographic into the MDX ──
echo "  Einbetten via apply-images-browser ..." | tee -a "$LOG"
if npx tsx scripts/content-engine/media/apply-images-browser.ts "$SLUG" >>"$LOG" 2>&1; then
    echo "FERTIG: $SLUG bebildert (Hero+Infografik+Kontext)." | tee -a "$LOG"
    echo "IMAGES_OK=$SLUG"
    exit 0
fi
echo "FATAL: apply-images-browser fehlgeschlagen (siehe $LOG)" | tee -a "$LOG"
exit 6
