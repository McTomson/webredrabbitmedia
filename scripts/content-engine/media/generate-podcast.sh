#!/bin/bash
# generate-podcast.sh <slug>
# ---------------------------------------------------------------------------
# Produces a NotebookLM "Audio Overview" (.m4a) for an ALREADY-PUBLISHED article,
# fully headless via the notebooklm MCP + a pre-created POOL notebook. No browser.
#
# Why a pool: the notebooklm MCP cannot CREATE a notebook headless (only register
# existing ones) and cannot clear a notebook's sources. A podcast needs a notebook
# containing ONLY the one article (else the audio mixes articles). So we pre-create
# a handful of empty notebooks in the browser ONCE (see podcast-notebook-pool.json),
# and each run consumes one slot, adding the article as its single source.
#
# Why poll-by-download: get_audio_status returns "ready" PREMATURELY (verified
# 2026-06-19). The only trustworthy "ready" signal is a download_audio that actually
# writes a file. So we retry the download with backoff and treat "file on disk" as done.
#
# Output:  prints  PODCAST_FILE=<absolute .m4a path>  on success.
# Exit:    0 ok | 2 pool empty/missing | 3 audio not ready after timeout | 1 usage
# ---------------------------------------------------------------------------
set -uo pipefail

SLUG="${1:?Usage: generate-podcast.sh <slug>}"

# Resolve repo root from this script's real location (survives symlinks / launchd).
SELF="${BASH_SOURCE[0]}"
while [ -L "$SELF" ]; do SELF="$(cd "$(dirname "$SELF")" && pwd)/$(readlink "$SELF")"; done
REPO="$(cd "$(dirname "$SELF")/../../.." && pwd)"
cd "$REPO" || exit 1
[ -f .env.local ] && set -a && . ./.env.local && set +a

POOL="content-engine/knowledge/podcast-notebook-pool.json"
DEST="$REPO/scripts/content-engine/.work/${SLUG}-podcast"
ARTICLE_URL="${SITE_URL:-https://web.redrabbit.media}/tipps/${SLUG}"
export DISABLE_AUTOUPDATER=1   # pin toolchain; avoids the nvm-claude auto-update ENOEXEC trap
# Resolve a WORKING claude. The nvm auto-updater periodically leaves a stub `claude.exe` that throws
# "native binary not installed" (observed 2026-06-22, it broke every headless podcast for 2 days),
# and that nvm bin sits FIRST on the launchd PATH, shadowing the working Homebrew claude. So pick the
# first candidate whose `--version` actually succeeds, preferring Homebrew, instead of trusting `claude`.
resolve_claude() {
    for c in "${CLAUDE_BIN:-}" /opt/homebrew/bin/claude "$(command -v claude 2>/dev/null)"; do
        [ -n "$c" ] && [ -x "$c" ] && "$c" --version >/dev/null 2>&1 && { echo "$c"; return 0; }
    done
    return 1
}
CLAUDE_BIN="$(resolve_claude)" || { echo "ERROR: kein funktionierendes claude gefunden (nvm-Stub kaputt + Homebrew fehlt?)." >&2; exit 4; }
echo "claude: $CLAUDE_BIN ($("$CLAUDE_BIN" --version 2>/dev/null | head -1))"
NLM_ALLOW_ADD="mcp__notebooklm__add_source mcp__notebooklm__generate_audio"
NLM_ALLOW_DL="mcp__notebooklm__download_audio"
mkdir -p "$DEST"

# If a podcast .m4a already exists for this slug, reuse it (idempotent re-runs).
EXISTING="$(ls -t "$DEST"/*.m4a 2>/dev/null | head -1 || true)"
if [ -n "$EXISTING" ]; then
    echo "PODCAST_FILE=$EXISTING"
    exit 0
fi

# Pop the first unused pool notebook and mark it spent by this slug.
NB_URL="$(node -e '
const fs=require("fs"); const f=process.argv[1], slug=process.argv[2];
let pool; try{pool=JSON.parse(fs.readFileSync(f,"utf8"))}catch(e){process.stderr.write("POOL_MISSING");process.exit(2)}
const slot=(pool.notebooks||[]).find(n=>!n.used);
if(!slot){process.stderr.write("POOL_EMPTY");process.exit(2)}
slot.used=true; slot.slug=slug; slot.usedAt=new Date().toISOString().slice(0,10);
pool.updatedAt=new Date().toISOString().slice(0,10);
fs.writeFileSync(f,JSON.stringify(pool,null,2)+"\n");
process.stdout.write(slot.url);
' "$POOL" "$SLUG" 2>/dev/null)" || {
    echo "ERROR: podcast notebook pool empty or missing ($POOL). Refill needed." >&2
    exit 2
}
echo "Pool-Notebook: $NB_URL"

# Count remaining free slots so the caller can warn when the pool runs low.
FREE="$(node -e 'try{const p=JSON.parse(require("fs").readFileSync(process.argv[1]));process.stdout.write(String((p.notebooks||[]).filter(n=>!n.used).length))}catch(e){process.stdout.write("0")}' "$POOL")"
echo "Pool-Restplaetze frei: $FREE"

# 1) Add the article as the notebook's only source, then kick off audio generation.
#    No custom_prompt (it breaks the Generate button via UI drift).
echo "Quelle hinzufuegen + Audio-Generierung starten ..."
"$CLAUDE_BIN" -p "Use ONLY notebooklm tools. Step 1: call mcp__notebooklm__add_source with type=url, content=\"$ARTICLE_URL\", notebook_url=\"$NB_URL\", title=\"Podcast-Quelle ${SLUG}\". Step 2: call mcp__notebooklm__generate_audio with notebook_url=\"$NB_URL\" and NO custom_prompt. Then reply with exactly: DONE." \
    --allowedTools "$NLM_ALLOW_ADD" >/dev/null 2>&1 || true

# 2) Poll-by-download: get_audio_status is unreliable, so just attempt the download on a
#    backoff. The MCP writes the .m4a into $DEST on success; that file is the ground truth.
# NotebookLM-Render kann unter Last ueber 20 Min dauern (am 2026-06-19 real 21 Min gemessen),
# daher grosszuegiges Limit ~28 Min, sonst bricht die Automatik bei langsamen Renders ab.
echo "Warte auf Audio-Render (Poll via Download-Versuch, bis ~28 Min) ..."
FILE=""
for i in $(seq 1 28); do
    sleep 60
    "$CLAUDE_BIN" -p "Call mcp__notebooklm__download_audio with notebook_url=\"$NB_URL\", destination_dir=\"$DEST\". Reply with exactly: TRIED." \
        --allowedTools "$NLM_ALLOW_DL" >/dev/null 2>&1 || true
    FILE="$(ls -t "$DEST"/*.m4a 2>/dev/null | head -1 || true)"
    if [ -n "$FILE" ] && [ -f "$FILE" ]; then
        echo "Audio fertig nach ~${i} Min."
        break
    fi
    echo "  noch nicht fertig (Versuch ${i}) ..."
done

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
    echo "ERROR: Audio-Overview nach Timeout nicht herunterladbar ($NB_URL)." >&2
    exit 3
fi

echo "PODCAST_FILE=$FILE"
