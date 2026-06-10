#!/bin/bash
# Weekly task reminder for Thomas (launchd). Sources .env.local for SMTP, then sends the
# "offene Anstoesse" email. Idempotent-safe: sending twice in a week is harmless.
set -uo pipefail

NVM_MAJOR="$(cat "$HOME/.nvm/alias/default" 2>/dev/null | tr -dc '0-9.' )"
NVM_BIN="$(ls -d "$HOME"/.nvm/versions/node/v${NVM_MAJOR:-20}*/bin 2>/dev/null | sort -V | tail -1)"
export PATH="${NVM_BIN:-$HOME/.nvm/versions/node/v20.20.0/bin}:/opt/homebrew/bin:/opt/homebrew/sbin:$HOME/.local/bin:$PATH"

REPO="$HOME/dev/redrabbit"
cd "$REPO" || exit 1
[ -f .env.local ] && set -a && . ./.env.local && set +a

npm run --silent remind
