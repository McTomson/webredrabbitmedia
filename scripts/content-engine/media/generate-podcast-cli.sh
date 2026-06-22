#!/bin/bash
# generate-podcast-cli.sh <slug>
# ---------------------------------------------------------------------------
# Produces a NotebookLM "Audio Overview" (.m4a) for an ALREADY-PUBLISHED article,
# fully headless via the notebooklm-py CLI. No browser, NO pool, NO `claude`/MCP.
#
# WHY this replaces generate-podcast.sh (the MCP+pool+claude path): that path broke
# twice (21.-22.06) because (a) the nvm auto-updater leaves a broken `claude` stub that
# the MCP wrapper depends on, and (b) the pre-created notebook pool runs dry. The CLI
# has none of those dependencies: it creates its own notebook and uses its own auth
# (`notebooklm login` -> ~/.notebooklm/...), exactly like generate-video.sh.
#
# Audio tolerates a URL source, but we feed the cleaned full text (extract-body.ts) for
# consistency with the video path and to avoid any crawl flakiness.
#
# One fresh notebook per article, deleted again after a verified download (auto-cleanup).
#
# Output:  prints  PODCAST_FILE=<absolute .m4a/.mp3 path>  on success.
# Exit:    0 ok | 2 CLI missing / not authed | 3 generation/download failed | 1 usage
# ---------------------------------------------------------------------------
set -uo pipefail

SLUG="${1:?Usage: generate-podcast-cli.sh <slug>}"

SELF="${BASH_SOURCE[0]}"
while [ -L "$SELF" ]; do SELF="$(cd "$(dirname "$SELF")" && pwd)/$(readlink "$SELF")"; done
REPO="$(cd "$(dirname "$SELF")/../../.." && pwd)"
cd "$REPO" || exit 1
[ -f .env.local ] && set -a && . ./.env.local && set +a

export PATH="$HOME/.local/bin:$PATH"
export DISABLE_AUTOUPDATER=1
NLM="${NOTEBOOKLM_BIN:-notebooklm}"

DEST="$REPO/scripts/content-engine/.work/${SLUG}-podcast"
mkdir -p "$DEST"

# Idempotent: reuse an already-downloaded audio if present.
EXISTING="$(ls -t "$DEST"/*.m4a "$DEST"/*.mp3 2>/dev/null | head -1 || true)"
if [ -n "$EXISTING" ] && [ "$(du -k "$EXISTING" 2>/dev/null | cut -f1)" -gt 200 ]; then
    echo "PODCAST_FILE=$EXISTING"
    exit 0
fi

if ! command -v "$NLM" >/dev/null 2>&1; then
    echo "ERROR: notebooklm CLI nicht gefunden ($NLM). pip install 'notebooklm-py[browser]'." >&2
    exit 2
fi
if ! "$NLM" list --json >/dev/null 2>&1; then
    echo "ERROR: notebooklm CLI nicht authentifiziert. 'notebooklm login' als t.uhlir@immo.red noetig." >&2
    exit 2
fi

# 1) Clean full article text. Title = notebook name.
BODY="$DEST/body.txt"
if ! npx tsx scripts/content-engine/media/extract-body.ts "$SLUG" > "$BODY" 2>/dev/null || [ ! -s "$BODY" ]; then
    echo "ERROR: Artikeltext fuer $SLUG nicht extrahierbar/leer." >&2
    exit 3
fi
TITLE="$(head -1 "$BODY")"; [ -z "$TITLE" ] && TITLE="Podcast $SLUG"
echo "Artikeltext: $(wc -c < "$BODY" | tr -d ' ') Zeichen — Notebook: $TITLE"

# 2) Fresh notebook.
NB_ID="$("$NLM" create "$TITLE" --json 2>/dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);process.stdout.write(j.id||j.notebook_id||j.notebook?.id||"")}catch(e){}})')"
[ -z "$NB_ID" ] && { echo "ERROR: Notebook-Anlage fehlgeschlagen (keine id)." >&2; exit 3; }
echo "Notebook: $NB_ID"

CLEANUP_OK=0
cleanup() { [ "$CLEANUP_OK" = "1" ] && [ -n "${NB_ID:-}" ] && "$NLM" delete -n "$NB_ID" -y >/dev/null 2>&1 || true; }
trap cleanup EXIT

# 3) Add cleaned full text as the only source.
if ! "$NLM" source add "$(cat "$BODY")" --type text --title "Artikel ${SLUG}" -n "$NB_ID" >/dev/null 2>&1; then
    echo "ERROR: source add (Volltext) fehlgeschlagen." >&2
    "$NLM" delete -n "$NB_ID" -y >/dev/null 2>&1 || true
    exit 3
fi
sleep 25  # let NotebookLM index the source

# 4) Generate the audio overview (German) and wait.
echo "Audio-Generierung (deep-dive, de) — kann bis ~30 Min dauern ..."
"$NLM" generate audio -n "$NB_ID" --language de --wait --timeout 1800 --json >"$DEST/gen.json" 2>&1
GEN_RC=$?
tail -3 "$DEST/gen.json"
if [ "$GEN_RC" -ne 0 ] || grep -qiE '"status"[[:space:]]*:[[:space:]]*"(failed|error)"|GENERATION_FAILED' "$DEST/gen.json"; then
    echo "ERROR: Audio-Generierung fehlgeschlagen (rc=$GEN_RC)." >&2
    exit 3
fi

# 5) Download (path positional). Status can lie; a real file is the truth.
OUT="$DEST/${SLUG}.m4a"
"$NLM" download audio "$OUT" -n "$NB_ID" >/dev/null 2>&1 || true
if [ ! -f "$OUT" ]; then
    "$NLM" download audio --all "$DEST/" >/dev/null 2>&1 || true
    FOUND="$(ls -t "$DEST"/*.m4a "$DEST"/*.mp3 2>/dev/null | head -1 || true)"
    [ -n "$FOUND" ] && [ "$FOUND" != "$OUT" ] && { mv "$FOUND" "$OUT" 2>/dev/null || OUT="$FOUND"; }
fi

# 6) Integrity check.
[ -f "$OUT" ] || { echo "ERROR: Audio-Download lieferte keine Datei." >&2; exit 3; }
KB="$(du -k "$OUT" 2>/dev/null | cut -f1)"
[ "${KB:-0}" -lt 200 ] && { echo "ERROR: Audio-Datei zu klein (${KB}KB) — vermutlich leer/trunkiert." >&2; exit 3; }

CLEANUP_OK=1
echo "Audio fertig (${KB}KB)."
echo "PODCAST_FILE=$OUT"
