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

REPO="$HOME/dev/redrabbit"
cd "$REPO" || exit 1
[ -f .env.local ] && set -a && . ./.env.local && set +a

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

# Pending-Marker pruefen.
PENDING="$(npx tsx scripts/content-engine/media/pending.ts 2>/dev/null | grep 'OFFEN' | head -1)"
if [ -z "$PENDING" ]; then
    echo "Kein offener Media-Request. Warte weiter."
    exit 0
fi

SLUG="$(echo "$PENDING" | awk '{print $2}')"
echo "Offener Media-Request gefunden: $SLUG"

# Stempel setzen — nicht doppelt triggern.
touch "$STAMP"

# Bilder headless generieren (kein Browser noetig).
echo "Generiere Bilder fuer $SLUG ..."
if npx tsx scripts/content-engine/pipeline.ts --images-only --slug "$SLUG" 2>&1; then
    echo "Bilder fertig."
else
    echo "WARN: Bilder fehlgeschlagen (weiter mit Notification)."
fi

# macOS-Benachrichtigung: Browser-Session starten.
osascript <<APPLESCRIPT 2>/dev/null || true
display notification "Artikel \"$SLUG\" ist freigegeben. Bitte Claude Code starten und 'npm run media' ausfuehren (NotebookLM + YouTube + Substack)." with title "Red Rabbit Media" subtitle "Media-Session benoetigt" sound name "Glass"
APPLESCRIPT

echo "Notification gesendet. Warte auf Browser-Session."
echo "==== fertig $(date) ===="
