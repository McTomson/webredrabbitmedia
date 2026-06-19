#!/bin/bash
# Media-Checker: laeuft alle 30 Minuten. Sucht genehmigte Artikel-Marker.
# Sobald einer gefunden wird: startet den headless Teil (Bilder), schickt
# eine macOS-Benachrichtigung zum Starten der Browser-Session (NotebookLM/Substack),
# und setzt einen Tages-Stempel damit es nicht doppelt triggert.
#
# Install:
#   cp scripts/content-engine/trigger/com.redrabbit.mediachecker.plist ~/Library/LaunchAgents/
#   launchctl load ~/Library/LaunchAgents/com.redrabbit.mediachecker.plist

set -uo pipefail

NVM_MAJOR="$(cat "$HOME/.nvm/alias/default" 2>/dev/null | tr -dc '0-9.')"
NVM_BIN="$(ls -d "$HOME"/.nvm/versions/node/v${NVM_MAJOR:-20}*/bin 2>/dev/null | sort -V | tail -1)"
export PATH="${NVM_BIN:-$HOME/.nvm/versions/node/v20.20.0/bin}:/opt/homebrew/bin:/opt/homebrew/sbin:$HOME/.local/bin:$PATH"

# Self-locating: run from the dedicated BOT worktree (always on main), NOT the shared human checkout
# ~/dev/redrabbit which sits on a dirty feature branch. Root cause of the 16.06 media-no-show: this
# checker ran from the shared checkout on a feature branch and never saw the approval marker that was
# committed to main. Resolving REPO from the script path means it runs wherever the plist points it
# (the worktree). Then ff-only-merge in the latest origin/main so freshly approved markers/articles
# become visible WITHOUT clobbering an in-flight daily run (ff-only fails-safe -> skip + retry in 30m).
SELF="${BASH_SOURCE[0]}"
while [ -L "$SELF" ]; do SELF="$(cd "$(dirname "$SELF")" && pwd)/$(readlink "$SELF")"; done
REPO="$(cd "$(dirname "$SELF")/../../.." && pwd)"
cd "$REPO" || exit 1
[ -f .env.local ] && set -a && . ./.env.local && set +a

# Pull in the latest main so a marker approved since the last daily reset is visible. ff-only is
# safe in this bot worktree: if the daily run is mid-pipeline with uncommitted tracked changes the
# merge refuses and we simply skip this tick (retry in 30 min) instead of corrupting anything.
git fetch origin main >/dev/null 2>&1 && git merge --ff-only origin/main >/dev/null 2>&1 || true

WORK="scripts/content-engine/.work"
mkdir -p "$WORK"
STAMP="$WORK/media-triggered-$(date +%F)"
LOG="$WORK/media-check-$(date +%F).log"

exec >>"$LOG" 2>&1
echo "==== media-check $(date) ===="

# Schon heute getriggert — nichts tun.
if [ -f "$STAMP" ]; then
    echo "Heute schon getriggert. Abbruch."
    exit 0
fi

# Nur den Marker von HEUTE pruefen (requestedAt == heute).
# Alte offene Marker von anderen Tagen werden bewusst ignoriert.
TODAY="$(date +%F)"
MEDIA_DIR="content-engine/.media-requests"
SLUG=""

if [ -d "$MEDIA_DIR" ]; then
    for marker in "$MEDIA_DIR"/*.json; do
        [ -f "$marker" ] || continue
        # Robust JSON parse via node. The old grep '"requestedAt":"..."' required NO space after the
        # colon, but the marker is pretty-printed ('"requestedAt": "..."') -> it never matched, so no
        # media ever triggered (co-root-cause 16.06). node JSON.parse is whitespace-agnostic.
        requested="$(node -e 'const fs=require("fs");try{process.stdout.write(String(JSON.parse(fs.readFileSync(process.argv[1],"utf8")).requestedAt||""))}catch(e){}' "$marker" 2>/dev/null)"
        status="$(node -e 'const fs=require("fs");try{process.stdout.write(String(JSON.parse(fs.readFileSync(process.argv[1],"utf8")).status||""))}catch(e){}' "$marker" 2>/dev/null)"
        if [ "$requested" = "$TODAY" ] && [ "$status" = "requested" ]; then
            SLUG="$(basename "$marker" .json)"
            break
        fi
    done
fi

if [ -z "$SLUG" ]; then
    echo "Kein offener Media-Request fuer heute ($TODAY). Warte weiter."
    exit 0
fi

echo "Offener Media-Request fuer heute gefunden: $SLUG"

# Stempel setzen — nicht doppelt triggern.
touch "$STAMP"

# Bilder headless generieren (kein Browser noetig).
echo "Generiere Bilder fuer $SLUG ..."
if npx tsx scripts/content-engine/images-only.ts "$SLUG" --hero 2>&1; then
    echo "Bilder fertig."
else
    echo "WARN: Bilder fehlgeschlagen (weiter mit Notification)."
fi

# --- Podcast headless erzeugen (NotebookLM-MCP + Pool-Notebook, kein Browser) ---
# Loest den frueheren manuellen "npm run media"-Schritt ab. Schlaegt etwas fehl,
# faellt das Skript sauber auf die alte Browser-Session-Notification zurueck.
echo "Podcast (NotebookLM, headless) fuer $SLUG ..."
GP_OUT="$(scripts/content-engine/media/generate-podcast.sh "$SLUG" 2>&1)"
echo "$GP_OUT"
PODCAST_FILE="$(printf '%s\n' "$GP_OUT" | grep -oE '^PODCAST_FILE=.*' | head -1 | sed 's/^PODCAST_FILE=//')"

if [ -n "$PODCAST_FILE" ] && [ -f "$PODCAST_FILE" ]; then
    echo "Podcast da ($PODCAST_FILE). Medien-Tail (einbetten + push + Mail) ..."
    # run-media bettet den Podcast ein, pusht, schickt die Fertig-Mail und LOESCHT den Marker.
    # Video/Substack bewusst weggelassen (brauchen Browser) -> separater Schritt.
    if npx tsx scripts/content-engine/media/run-media.ts --slug "$SLUG" --podcast "$PODCAST_FILE" --no-images 2>&1; then
        echo "Medien-Tail fertig. Artikel hat jetzt Podcast live."
        osascript -e "display notification \"Podcast fuer '$SLUG' ist automatisch live. Video/Bilder ggf. noch manuell.\" with title \"Red Rabbit Media\" subtitle \"Podcast auto-publiziert\" sound name \"Glass\"" 2>/dev/null || true
        echo "==== fertig $(date) ===="
        exit 0
    fi
    echo "WARN: run-media fehlgeschlagen — Fallback auf Browser-Session-Notification."
else
    echo "WARN: Podcast-Generierung lieferte keine Datei — Fallback auf Browser-Session-Notification."
fi

# Fallback: manuelle Browser-Session noetig (Pool leer, MCP-Auth weg, Timeout, ...).
osascript <<APPLESCRIPT 2>/dev/null || true
display notification "Artikel \"$SLUG\": Auto-Podcast unvollstaendig. Bitte Claude Code starten und 'npm run media' ausfuehren (NotebookLM + YouTube + Substack)." with title "Red Rabbit Media" subtitle "Manuelle Media-Session noetig" sound name "Glass"
APPLESCRIPT

echo "Fallback-Notification gesendet. Warte auf Browser-Session."
echo "==== fertig $(date) ===="
