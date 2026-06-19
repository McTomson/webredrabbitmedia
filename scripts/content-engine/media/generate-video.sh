#!/bin/bash
# generate-video.sh <slug>
# ---------------------------------------------------------------------------
# Produces a NotebookLM "Video Overview" (.mp4) for an ALREADY-PUBLISHED article,
# fully headless via the notebooklm-py CLI. No browser.
#
# WHY a separate tool (and not the MCP, like the podcast): the NotebookLM MCP can
# only generate AUDIO. Video needs the `notebooklm` CLI (notebooklm-py), which has
# its OWN auth (`notebooklm login` -> ~/.notebooklm/profiles/default/storage_state.json),
# separate from the MCP. The CLI can create a notebook, add a source, generate + download.
#
# WHY full-text paste (THE critical lesson, proven 2026-06-19): video generation
# FAILS with a URL-crawl source (GENERATION_FAILED, reproduced twice) and SUCCEEDS
# with the full article text as a `--type text` source. Audio tolerates a URL, video
# does NOT. So we feed the cleaned article text (extract-body.ts), never the URL.
#
# WHY --format explainer: cinematic (Veo 3) is AI-Ultra-gated; our account is PRO.
#
# One fresh notebook per article (never mix articles -> hallucination across sources),
# deleted again after a successful, integrity-checked download (auto-cleanup).
#
# Output:  prints  VIDEO_FILE=<absolute .mp4 path>  on success.
# Exit:    0 ok | 2 CLI missing / not authed | 3 generation/download failed | 1 usage
# ---------------------------------------------------------------------------
set -uo pipefail

SLUG="${1:?Usage: generate-video.sh <slug>}"

# Resolve repo root from this script's real location (survives symlinks / launchd).
SELF="${BASH_SOURCE[0]}"
while [ -L "$SELF" ]; do SELF="$(cd "$(dirname "$SELF")" && pwd)/$(readlink "$SELF")"; done
REPO="$(cd "$(dirname "$SELF")/../../.." && pwd)"
cd "$REPO" || exit 1
[ -f .env.local ] && set -a && . ./.env.local && set +a

# notebooklm-py CLI lives in the user bin; pin the toolchain to avoid auto-update traps.
export PATH="$HOME/.local/bin:$PATH"
export DISABLE_AUTOUPDATER=1
NLM="${NOTEBOOKLM_BIN:-notebooklm}"

DEST="$REPO/scripts/content-engine/.work/${SLUG}-video"
OUT="$DEST/${SLUG}.mp4"
mkdir -p "$DEST"

# Idempotent re-runs: if a valid mp4 already exists for this slug, reuse it.
if [ -f "$OUT" ] && [ "$(du -k "$OUT" 2>/dev/null | cut -f1)" -gt 100 ]; then
    echo "VIDEO_FILE=$OUT"
    exit 0
fi

# Preconditions: CLI present + authenticated. Fail-closed (caller falls back), never guess.
if ! command -v "$NLM" >/dev/null 2>&1; then
    echo "ERROR: notebooklm CLI nicht gefunden ($NLM). pip install 'notebooklm-py[browser]'." >&2
    exit 2
fi
if ! "$NLM" list --json >/dev/null 2>&1; then
    echo "ERROR: notebooklm CLI nicht authentifiziert. 'notebooklm login' als t.uhlir@immo.red noetig." >&2
    exit 2
fi

# 1) Clean full article text (NOT the URL — that is the failure mode). Title is the notebook name.
BODY="$DEST/body.txt"
if ! npx tsx scripts/content-engine/media/extract-body.ts "$SLUG" > "$BODY" 2>/dev/null; then
    echo "ERROR: Artikeltext fuer $SLUG nicht extrahierbar." >&2
    exit 3
fi
if [ ! -s "$BODY" ]; then
    echo "ERROR: Extrahierter Artikeltext ist leer ($BODY)." >&2
    exit 3
fi
TITLE="$(head -1 "$BODY")"
[ -z "$TITLE" ] && TITLE="Video $SLUG"
echo "Artikeltext: $(wc -c < "$BODY" | tr -d ' ') Zeichen — Notebook: $TITLE"

# 2) Fresh notebook for this article.
NB_ID="$("$NLM" create "$TITLE" --json 2>/dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);process.stdout.write(j.id||j.notebook_id||j.notebook?.id||"")}catch(e){}})')"
if [ -z "$NB_ID" ]; then
    echo "ERROR: Notebook-Anlage fehlgeschlagen (keine id)." >&2
    exit 3
fi
echo "Notebook: $NB_ID"

# Best-effort cleanup of the per-article notebook on ANY exit AFTER a successful,
# integrity-checked download (set CLEANUP_OK=1 right before exit 0). Never delete a
# notebook whose video we could not verify — keep it so a retry can still fetch the mp4.
CLEANUP_OK=0
cleanup() {
    if [ "$CLEANUP_OK" = "1" ] && [ -n "${NB_ID:-}" ]; then
        "$NLM" delete -n "$NB_ID" -y >/dev/null 2>&1 || true
    fi
}
trap cleanup EXIT

# 3) Add the cleaned article text as the notebook's only source (FULL TEXT, not URL).
#    "$(cat …)" is shell-safe for arbitrary article content (command-substitution output is
#    not re-scanned for $ / backtick / quote expansion).
echo "Quelle (Volltext) hinzufuegen ..."
if ! "$NLM" source add "$(cat "$BODY")" --type text --title "Artikel ${SLUG}" -n "$NB_ID" >/dev/null 2>&1; then
    echo "ERROR: source add (Volltext) fehlgeschlagen." >&2
    # Notebook ist leer (kein Source, kein Video) -> nichts zu behalten, gleich aufraeumen.
    "$NLM" delete -n "$NB_ID" -y >/dev/null 2>&1 || true
    exit 3
fi
# Let NotebookLM index the source before generating (indexing is async, ~5-30s).
sleep 25

# 4) Generate the video overview (explainer, German) and wait for completion.
echo "Video-Generierung (explainer, de) — kann bis ~30 Min dauern ..."
"$NLM" generate video -n "$NB_ID" --format explainer --style auto --language de --wait --timeout 1800 --json >"$DEST/gen.json" 2>&1
GEN_RC=$?
tail -3 "$DEST/gen.json"
# Fehler = Nicht-Null-Exit ODER expliziter failed/error-Status im JSON. KEIN nacktes 'fail'/'error'
# (ein Artikeltitel wie "... haeufige Fehler beim Webdesign" wuerde das sonst faelschlich ausloesen).
if [ "$GEN_RC" -ne 0 ] || grep -qiE '"status"[[:space:]]*:[[:space:]]*"(failed|error)"|GENERATION_FAILED' "$DEST/gen.json"; then
    echo "ERROR: Video-Generierung fehlgeschlagen (rc=$GEN_RC). Quelle = Volltext? Konto PRO/explainer?" >&2
    exit 3
fi

# 5) Download the mp4 (path is POSITIONAL, not --output). Status can lie; a real file is the truth.
echo "Download mp4 ..."
"$NLM" download video "$OUT" -n "$NB_ID" >/dev/null 2>&1 || true
if [ ! -f "$OUT" ]; then
    # Fallback: grab the latest video artifact into the dest dir, then normalize its name to
    # the canonical $DEST/${SLUG}.mp4 so a later idempotent re-run finds it (and doesn't
    # re-burn a 30-min generation).
    "$NLM" download video --all "$DEST/" >/dev/null 2>&1 || true
    FOUND="$(ls -t "$DEST"/*.mp4 2>/dev/null | head -1 || true)"
    if [ -n "$FOUND" ] && [ "$FOUND" != "$OUT" ]; then
        mv "$FOUND" "$OUT" 2>/dev/null || OUT="$FOUND"
    fi
fi

# 6) Integrity check: file present, non-trivial size, recognized as media. Never pass an empty/truncated mp4.
if [ ! -f "$OUT" ]; then
    echo "ERROR: Video-Download lieferte keine Datei." >&2
    exit 3
fi
KB="$(du -k "$OUT" 2>/dev/null | cut -f1)"
if [ "${KB:-0}" -lt 100 ]; then
    echo "ERROR: Video-Datei zu klein (${KB}KB) — vermutlich leer/trunkiert." >&2
    exit 3
fi
if ! file "$OUT" 2>/dev/null | grep -qiE 'mp4|ISO Media|MPEG'; then
    echo "WARN: Dateityp nicht eindeutig als Video erkannt ($(file -b "$OUT" 2>/dev/null)) — fahre dennoch fort (Groesse ok)."
fi

CLEANUP_OK=1   # integrity verified -> safe to delete the per-article notebook on exit
echo "Video fertig (${KB}KB)."
echo "VIDEO_FILE=$OUT"
