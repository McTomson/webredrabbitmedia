#!/bin/bash
# Daily content-engine trigger (launchd). Idempotent, locked, self-healing.
# Generates the next draft article, pushes to main (Vercel deploys), and emails Thomas
# a review link. Quality-gated: if the pipeline halts (no sources / empty pool), nothing ships.
#
# Env (from ~/dev/redrabbit/.env.local, sourced below):
#   ADMIN_API_TOKEN   used to call /api/review-notify
#   SITE_URL          default https://web.redrabbit.media
#   ALERT_TO          optional, where crash alerts go (defaults to git user email)
set -uo pipefail

# launchd starts this with a minimal PATH and `bash -lc` does NOT source ~/.zshrc,
# where nvm puts node/claude on PATH. Without this the pipeline dies with
# `spawnSync claude ENOENT`. Resolve the nvm default-alias major (e.g. "20") and pick
# its newest install; that bin holds the `claude` CLI the pipeline shells out to.
# (codex lives in /opt/homebrew/bin, added below regardless.)
NVM_MAJOR="$(cat "$HOME/.nvm/alias/default" 2>/dev/null | tr -dc '0-9.' )"
NVM_BIN="$(ls -d "$HOME"/.nvm/versions/node/v${NVM_MAJOR:-20}*/bin 2>/dev/null | sort -V | tail -1)"
export PATH="${NVM_BIN:-$HOME/.nvm/versions/node/v20.20.0/bin}:/opt/homebrew/bin:/opt/homebrew/sbin:$HOME/.local/bin:$PATH"

REPO="$HOME/dev/redrabbit"
cd "$REPO" || exit 1
[ -f .env.local ] && set -a && . ./.env.local && set +a
SITE_URL="${SITE_URL:-https://web.redrabbit.media}"

WORK="scripts/content-engine/.work"
mkdir -p "$WORK"
LOCK="$WORK/daily.lock"
STAMP="$WORK/last-run-$(date +%F)"
LOG="$WORK/daily-$(date +%F).log"

exec >>"$LOG" 2>&1
echo "==== run-daily $(date) ===="

# Idempotency: one article per calendar day.
if [ -f "$STAMP" ]; then echo "Heute schon gelaufen, Abbruch."; exit 0; fi

# Lock against concurrent runs (stale lock older than 2h is ignored).
if [ -f "$LOCK" ] && [ "$(find "$LOCK" -mmin -120 2>/dev/null)" ]; then echo "Lock aktiv, Abbruch."; exit 0; fi
echo $$ > "$LOCK"
trap 'rm -f "$LOCK"' EXIT

alert() {
  local msg="$1"
  echo "ALERT: $msg"
  # best-effort crash alert via the deployed mailer (reuses review-notify is not ideal; just log)
}

# Always work on main for the daily publish.
git checkout main >/dev/null 2>&1 || { alert "git checkout main fehlgeschlagen"; exit 1; }
git pull --ff-only origin main >/dev/null 2>&1 || echo "WARN: git pull nicht ff"

# Generate next draft (quality-gated). On halt, exit cleanly without shipping.
# --no-image: ship TEXT ONLY for review. Images (hero + infographic + context photos) are now
# generated later, in the media step (run-media.ts) AFTER Thomas approves the text, together with
# podcast + video. No point spending expensive image generation on text he might reject.
if ! npx tsx scripts/content-engine/pipeline.ts --next --emit --no-image; then
  echo "Pipeline hat gehalten oder Fehler. Nichts publiziert."
  exit 0
fi

# Figure out which slug was just written (newest draft in content/blog).
SLUG="$(git status --porcelain content/blog | grep -E '\.mdx$' | head -1 | sed -E 's#.*content/blog/([^/]+)\.mdx#\1#')"
if [ -z "$SLUG" ]; then echo "Kein neuer Artikel erkannt."; exit 0; fi
echo "Neuer Artikel: $SLUG"

git add content/blog public/images/blog content-engine/topics/status.json
git commit -q -m "feat(blog): add draft $SLUG (daily engine run)" || { echo "Nichts zu committen"; exit 0; }
git push origin main || { alert "git push fehlgeschlagen"; exit 1; }

# Wait for Vercel to deploy the new draft, then send the review email via the deployed route.
echo "Warte auf Deploy ..."
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 20 "$SITE_URL/tipps/$SLUG")
  [ "$code" = "200" ] && break
  sleep 12
done

if [ -n "${ADMIN_API_TOKEN:-}" ]; then
  curl -s -X POST "$SITE_URL/api/review-notify" \
    -H "Authorization: Bearer $ADMIN_API_TOKEN" -H 'Content-Type: application/json' \
    -d "{\"slug\":\"$SLUG\"}" && echo " review-mail ausgeloest"
else
  echo "WARN: ADMIN_API_TOKEN fehlt, keine Review-Mail gesendet."
fi

touch "$STAMP"
echo "==== fertig $(date) ===="
