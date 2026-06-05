#!/bin/bash
# One-time YouTube Data-API consent. Everything runs under the CHANNEL owner
# rabbit.red.media@gmail.com (owns @RedRabbitLab AND its GCP project), so there is
# no cross-account problem.
#
# Prereqs done already / in the Google Console (as rabbit.red.media):
#   - YouTube Data API v3 enabled on project fourth-stock-468014-e5 (done via gcloud)
#   - OAuth consent screen: External + published (durable refresh token)
#   - OAuth client: Desktop app -> JSON downloaded to
#       ~/.config/redrabbit-youtube/client_secret.json
#
# This script only runs the browser consent and stores the refresh token.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"

CS="$HOME/.config/redrabbit-youtube/client_secret.json"
if [ ! -f "$CS" ]; then
  echo "FEHLT: $CS"
  echo "Bitte zuerst in der Google Console (Konto rabbit.red.media, Projekt fourth-stock-468014-e5)"
  echo "einen OAuth-Client 'Desktop-App' erstellen, JSON herunterladen und dorthin kopieren."
  exit 1
fi

echo "== OAuth-Consent (im Browser als rabbit.red.media@gmail.com) =="
echo "   Bei 'App nicht verifiziert': Erweitert -> trotzdem fortfahren -> Zulassen."
python3 "$HERE/youtube_auth.py"

echo ""
echo "FERTIG. Token: ~/.config/redrabbit-youtube/token.json"
echo "Sag mir 'youtube fertig', dann lade ich die Videos hoch."
