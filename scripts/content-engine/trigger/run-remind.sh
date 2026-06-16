#!/bin/bash
# Weekly task reminder for Thomas (launchd). Sources .env.local for SMTP, then sends the
# "offene Anstoesse" email. Idempotent-safe: sending twice in a week is harmless.
set -uo pipefail

NVM_MAJOR="$(cat "$HOME/.nvm/alias/default" 2>/dev/null | tr -dc '0-9.' )"
NVM_BIN="$(ls -d "$HOME"/.nvm/versions/node/v${NVM_MAJOR:-20}*/bin 2>/dev/null | sort -V | tail -1)"
export PATH="${NVM_BIN:-$HOME/.nvm/versions/node/v20.20.0/bin}:/opt/homebrew/bin:/opt/homebrew/sbin:$HOME/.local/bin:$PATH"

# Self-locating: run from the bot worktree (always main), never the shared human checkout on a
# feature branch (same class of bug that broke run-daily + media-check on 16.06). See
# CLAUDE.md / LESSONS_LEARNED: launchd bot scripts MUST resolve their repo from the script path.
SELF="${BASH_SOURCE[0]}"
while [ -L "$SELF" ]; do SELF="$(cd "$(dirname "$SELF")" && pwd)/$(readlink "$SELF")"; done
REPO="$(cd "$(dirname "$SELF")/../../.." && pwd)"
cd "$REPO" || exit 1
[ -f .env.local ] && set -a && . ./.env.local && set +a
git fetch origin main >/dev/null 2>&1 && git merge --ff-only origin/main >/dev/null 2>&1 || true

npm run --silent remind
