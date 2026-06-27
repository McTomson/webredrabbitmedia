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
# Node-Binary portabel aufloesen (Mac: /opt/homebrew/bin/node, Linux/VPS: nvm) — NIE hart kodieren,
# sonst scheitert das Plan-Parsing/Decode auf dem VPS (beobachtet 2026-06-27: "Plan enthielt keine Bilder").
NODE_BIN="$(command -v node || echo /opt/homebrew/bin/node)"

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
IMG_SETTLE_S="${IMG_SETTLE_S:-42}"   # Wartezeit bis ein abgesendetes Bild server-seitig fertig ist,
                                     # bevor wir die Konversation in einer frischen Session laden (s.u.)
# RENDER_ONLY=1 (oder 2. Argument `--render-only`): NUR die PNGs nach STAGE rendern, KEIN apply/Einbetten.
# Fuer den VPS-als-reiner-Render-Worker (Mac baut den Plan via claude-Abo + bettet lokal ein; der VPS
# macht nur die schwere Gemini-Browser-Last und schickt die PNGs zurueck). plan.json wird mitgeliefert,
# also ruft der VPS NIE claude (build-image-plan reused den gecachten Plan) -> 0 API-Kosten.
RENDER_ONLY="${RENDER_ONLY:-0}"
[ "${2:-}" = "--render-only" ] && RENDER_ONLY=1
SESSION="gemini-img"
DECODE="scripts/content-engine/media/decode-img.cjs"
EVAL_EXTRACT="scripts/content-engine/media/gemini-extract.js"   # the in-page extraction script

mkdir -p "$(dirname "$GEMINI_PROFILE")"

if ! command -v agent-browser >/dev/null 2>&1; then
    echo "FATAL: agent-browser nicht installiert. Einmalig (durch Thomas): npm i -g agent-browser && agent-browser install"
    exit 3
fi
AB=(agent-browser --session "$SESSION" --profile "$GEMINI_PROFILE")
# Zweite Session NUR zum frischen Laden der fertigen Konversation in Phase 2. Auf DERSELBEN Session
# (gemini-img) nach close --all neu zu oeffnen reattached an einen halb-toten Kontext -> das Bild wird
# nicht gefunden (verifiziert 2026-06-27); ein FRISCHER Session-Name laedt sauber (wie der bewiesene
# probe7-Flow). Gleiches Profil ist ok, weil gemini-img vorher geschlossen wird (kein Profil-Doppellock).
SESSION_LOAD="gemini-load"
ABLOAD=(agent-browser --session "$SESSION_LOAD" --profile "$GEMINI_PROFILE")
# Letzte verwendete Konversations-ID — jedes Bild MUSS eine neue Konversation bekommen, sonst extrahiert
# ein Folgebild faelschlich das Bild des vorigen (verifiziert 2026-06-27: identische md5 bei /app-Reuse).
_LAST_CID=""

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
while IFS= read -r _l; do IMG_LINES+=("$_l"); done < <(printf '%s' "$PLAN_JSON" | "$NODE_BIN" -e '
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
# Dateigroesse portabel (Mac: stat -f%z, Linux: stat -c%s) -> `wc -c` funktioniert auf beiden.
# (Vorher hart `stat -f%z`, das auf dem Linux-VPS Dateisystem-Info statt Groesse liefert -> valid_png
# immer false -> Hero-Guard schlaegt faelschlich an + apply-images wird uebersprungen; verifiziert 2026-06-27.)
valid_png() { [ -f "$1" ] && [ "$(wc -c < "$1" 2>/dev/null | tr -d ' ')" -gt 20480 ]; }

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
# Stale Chrome-Profil-Lock entfernen. Beim Wechsel zwischen den zwei Sessions (gemini-img <-> gemini-load)
# auf demselben Profil bleibt nach close --all oft die SingletonLock-Datei liegen -> der naechste Chrome
# bricht mit "Failed to create SingletonLock: File exists (17)" ab (verifiziert 2026-06-27 VPS). Chrome
# legt die Dateien beim Start neu an; Entfernen ist sicher, SOLANGE nur EIN Browser das Profil nutzt
# (wir schliessen die jeweils andere Session immer vorher).
_unlock_profile() { rm -f "$GEMINI_PROFILE"/Singleton* 2>/dev/null || true; }

_ensure_gemini_loaded() {
    local t=0 url=""
    _unlock_profile
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
    # 5 Versuche: v.a. der Hero (komplexer Prompt: Verlauf + handschriftlicher Hook) faellt in Geminis
    # GENERIERUNG gelegentlich aus — eine FRISCHE Generierung (neue Konversation) ist dann noetig, nicht
    # laengeres Pollen (verifiziert 2026-06-27: Hero brauchte 3 Anlaeufe). 5 statt 3 -> hoehere Trefferquote;
    # plus das needs-images-Netz (Marker bleibt offen, Checker alle 30 Min) macht es eventual-reliable.
    for attempt in 1 2 3 4 5; do
        if _gemini_render_once "$prompt" "$outfile"; then return 0; fi
        echo "  Render-Versuch $attempt fuer $(basename "$outfile") fehlgeschlagen$( [ "$attempt" -lt 5 ] && echo ', neuer Versuch ...' || echo ' (aufgegeben)')" | tee -a "$LOG"
        # KRITISCH (2026-06-26): Browser-Daemon zwischen Fehlversuchen schliessen. Bei Systemlast wirft
        # `open` os-error-35, der Daemon laesst aber oft einen halb-toten Chrome zurueck; der naechste
        # Versuch oeffnet einen WEITEREN -> innerhalb EINES Laufs stapeln sich Dutzende chrome-150
        # (beobachtet: ~130 -> Last 74). close --all toetet den Rest, der naechste Versuch startet sauber
        # mit genau EINEM Browser. Kappt den Stau an der Wurzel.
        "${AB[@]}" close --all >>"$LOG" 2>&1 || true
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

    # ── Phase 1: Prompt auf /app absenden + Konversations-ID einsammeln ──
    # Type the prompt into Gemini's contenteditable input and submit.
    # Primary: semantic role; fallback: the Quill editor / contenteditable used by Gemini (CSS
    # selectors are passed DIRECTLY as the target, there is no `find css` subcommand).
    if ! "${AB[@]}" find role textbox fill "$prompt" >>"$LOG" 2>&1; then
        "${AB[@]}" fill 'div[contenteditable="true"]' "$prompt" >>"$LOG" 2>&1 \
            || "${AB[@]}" fill '.ql-editor' "$prompt" >>"$LOG" 2>&1 || { rm -f "$dataurl_file"; return 1; }
    fi
    "${AB[@]}" press Enter >>"$LOG" 2>&1 || true

    # Konversations-ID (/app/<id>) einsammeln. Gemini vergibt sie ~2-12s nach dem Absenden; get-url
    # flackert, daher mehrfach pollen.
    local _cid="" _curl _k
    for _k in $(seq 1 15); do
        sleep 2
        _curl="$("${AB[@]}" get url 2>/dev/null | grep -Eo '^https?://[^ ]*' | tail -1)"
        _cid="$(printf '%s' "$_curl" | grep -Eo '/app/[a-z0-9]+' | head -1)"
        # nur eine NEUE Konversations-ID akzeptieren (nicht die des vorigen Bildes)
        if [ -n "$_cid" ] && [ "$_cid" != "$_LAST_CID" ]; then break; fi
        _cid=""
    done
    if [ -z "$_cid" ]; then
        echo "  WARN keine (neue) Konversations-ID nach Submit ($outfile)" | tee -a "$LOG"; rm -f "$dataurl_file"; return 1
    fi
    _LAST_CID="$_cid"

    # ── Phase 2: warten bis das Bild server-seitig fertig ist, dann FRISCH laden ──
    # KRITISCH (verifiziert 2026-06-27 auf dem VPS, headless): ~14s nach dem Absenden entfuehrt Gemini die
    # Seite von /app/<id> zur /glic-Oberflaeche (0-Breite-Body, KEINE <img>) -> jede Detektion/Extraktion
    # auf der LIVE-Seite scheitert (sah aus wie Crash/Timeout, war eine Navigation). Das generierte Bild
    # bleibt server-seitig in der Konversation. Loesung: ID merken, kurz warten (Bild fertig), Session
    # schliessen und die Konversation in einer FRISCHEN Session laden -> das fertige 1024px-blob-Bild
    # rendert in ~3s (vor dem erneuten /glic-Hijack) und wird per Canvas (same-origin) extrahiert.
    sleep "$IMG_SETTLE_S"
    "${AB[@]}" close --all >>"$LOG" 2>&1 || true

    # Auf das fertige Bild pollen — mit WIEDERHOLTEM Neu-Laden der Konversation. Ein frischer Load gibt nur
    # ein ~14s-Fenster, bevor Gemini erneut zu /glic hijackt; war das Bild da noch nicht fertig (v.a. der
    # komplexere Hero mit Hook braucht laenger als der Settle), scheitert EIN einzelner Load. Daher laden
    # wir die Konversation mehrfach neu (jeweils neues un-hijacktes Fenster) und pruefen kurz nach jedem
    # Load. So bekommt das Bild mehrere Chancen, im Fenster sichtbar zu sein. eval-Fehler/leer = "noch nicht
    # da" (resilient). (Verifiziert 2026-06-27: Einzel-Load liess den Hero gelegentlich 3x durchfallen.)
    local _det_b64; _det_b64="$(printf '%s' '(() => { const im=[...document.querySelectorAll("img")].find(i=>/^(blob:|data:image)/.test(i.currentSrc||i.src) && (i.naturalWidth||0)>256); return !!im; })()' | base64 | tr -d '\n')"
    local _got=0 _ld _jp
    for _ld in $(seq 1 7); do
        "${ABLOAD[@]}" close --all >>"$LOG" 2>&1 || true
        sleep 2
        _unlock_profile
        "${ABLOAD[@]}" open "https://gemini.google.com${_cid}" >>"$LOG" 2>&1 || true
        for _jp in 1 2 3 4; do          # schnelles Pollen im un-hijackten Fenster (~12s)
            sleep 3
            if "${ABLOAD[@]}" eval -b "$_det_b64" 2>>"$LOG" | grep -qiw true; then _got=1; break; fi
        done
        [ "$_got" = 1 ] && break
        sleep 6                          # dem Server Zeit geben, dann neues Fenster
    done
    if [ "$_got" != 1 ]; then
        echo "  WARN Bild nicht gefunden in Konversation ${_cid} ($outfile, ${_ld} Loads)" | tee -a "$LOG"; "${ABLOAD[@]}" close --all >>"$LOG" 2>&1 || true; rm -f "$dataurl_file"; return 1
    fi

    # Extract the generated image as a PNG data URL (canvas.toDataURL) to stdout, via the repo
    # extraction script piped over stdin (eval supports --stdin / -b, NOT --file). Aus der LADE-Session.
    "${ABLOAD[@]}" eval --stdin <"$EVAL_EXTRACT" >"$dataurl_file" 2>>"$LOG" || { echo "  WARN eval-extract fehlgeschlagen" | tee -a "$LOG"; "${ABLOAD[@]}" close --all >>"$LOG" 2>&1 || true; rm -f "$dataurl_file"; return 1; }
    "${ABLOAD[@]}" close --all >>"$LOG" 2>&1 || true

    # Decode -> sized PNG. Fail-closed: decode rejects garbage/empty (no partial written).
    NODE_PATH="$REPO/node_modules" "$NODE_BIN" "$DECODE" "$dataurl_file" "$outfile" >>"$LOG" 2>&1 || {
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

# ── 3b. Render-only (VPS-Worker): PNGs liegen in STAGE, KEIN Einbetten. Der Aufrufer (Mac) holt sie ab. ──
if [ "$RENDER_ONLY" = "1" ]; then
    echo "RENDER_ONLY: $(ls "$STAGE"/*.png 2>/dev/null | wc -l | tr -d ' ') PNG(s) in $STAGE — kein apply." | tee -a "$LOG"
    echo "RENDER_OK=$SLUG"
    exit 0
fi

# ── 4. Apply: hero + staged ctx + local infographic into the MDX ──
echo "  Einbetten via apply-images-browser ..." | tee -a "$LOG"
if npx tsx scripts/content-engine/media/apply-images-browser.ts "$SLUG" >>"$LOG" 2>&1; then
    echo "FERTIG: $SLUG bebildert (Hero+Infografik+Kontext)." | tee -a "$LOG"
    echo "IMAGES_OK=$SLUG"
    exit 0
fi
echo "FATAL: apply-images-browser fehlgeschlagen (siehe $LOG)" | tee -a "$LOG"
exit 6
