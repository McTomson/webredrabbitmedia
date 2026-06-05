#!/bin/bash
# One-time YouTube Data-API setup. Run this once; afterwards uploads are headless.
# Thomas runs this himself because it needs a Google login (gcloud + consent),
# which an automated agent is not allowed to do.
set -e

PROJECT="claude-email-manager-484501"
HERE="$(cd "$(dirname "$0")" && pwd)"

echo "== 1/3 gcloud login (als t.uhlir@immo.red) =="
gcloud auth login

echo "== 2/3 YouTube Data API v3 aktivieren =="
gcloud config set project "$PROJECT"
gcloud services enable youtube.googleapis.com

echo "== 3/3 OAuth-Consent (im Browser als rabbit.red.media@gmail.com anmelden) =="
echo "Wenn die 'App ist nicht verifiziert'-Warnung kommt: Erweitert -> trotzdem fortfahren -> Zulassen."
python3 "$HERE/youtube_auth.py"

echo ""
echo "FERTIG. Token liegt in ~/.config/redrabbit-youtube/token.json"
echo "Sag mir Bescheid, dann lade ich das Wartungsvertrag-Video hoch."
