#!/bin/zsh
# Red Rabbit Content-Engine Dashboard - Desktop launcher
# Opens the dashboard at /dashboard and starts the local dev server if it is not running.
# node/npm live under nvm, which a Finder-launched script does not inherit, so PATH is set explicitly.

export PATH="/Users/McTomson/.nvm/versions/node/v20.20.0/bin:$PATH"
REPO="$HOME/dev/redrabbit"
URL="http://localhost:9000/dashboard"

cd "$REPO" || { echo "Repo nicht gefunden: $REPO"; sleep 4; exit 1; }

# Server already up? (curl blocks during first dev-compile, that is fine.)
if ! curl -s -o /dev/null "$URL" 2>/dev/null; then
  echo "Starte Dashboard-Server (einmalig, erster Aufruf ~30-60s)..."
  nohup npm run dev -- --port 9000 > /tmp/rr_dashboard.log 2>&1 &
  for i in {1..90}; do
    sleep 1
    if curl -s -o /dev/null "$URL" 2>/dev/null; then break; fi
  done
fi

curl -s -o /dev/null "$URL" 2>/dev/null   # warm the route so the browser shows it instantly
open "$URL"
echo ""
echo "Dashboard geoeffnet: $URL"
echo "Dieses Fenster kann jetzt geschlossen werden (der Server laeuft im Hintergrund weiter)."
