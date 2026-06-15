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

# Portable hard timeout (macOS ships no coreutils `timeout`/`gtimeout`). Runs the command in its
# OWN process group (setsid) and kills the WHOLE group on expiry, so a hung node/tsx subtree can't
# survive. Returns 124 on timeout. Belt-and-suspenders guard so a stalled network/LLM step can
# never again freeze the unattended daily run and block the review mail (root cause 15.06: the GSC
# indexation check hung 3+ h holding the lock -> no article, no mail).
pgtimeout() {
  local secs="$1"; shift
  perl -e '
    use POSIX qw(setsid);
    my $secs = shift @ARGV;
    my $pid = fork();
    die "fork: $!" if !defined $pid;
    if ($pid == 0) { setsid(); exec @ARGV or die "exec: $!"; }
    local $SIG{ALRM} = sub { kill("-TERM", $pid); sleep 3; kill("-KILL", $pid); exit 124; };
    alarm($secs);
    waitpid($pid, 0);
    my $rc = $? >> 8;
    alarm(0);
    exit($rc);
  ' "$secs" "$@"
}

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

# Notify Thomas via the deployed ops-alert route (this box holds NO SMTP creds — mail only ships
# through Vercel). Guarantees a daily signal: on success the review mail ships; on halt/failure THIS
# does, so a silent no-mail day (root cause 15.06) can't recur. Best-effort (never aborts the run)
# and de-duped per kind per day via a marker, so the 3h catch-up ticks can't spam repeat mails.
# Payload JSON is built by node so a message with quotes/newlines can't break the request.
notify() {
  local kind="$1" subject="$2" message="$3"
  echo "NOTIFY[$kind]: $subject — $message"
  local marker="$WORK/notified-$kind-$(date +%F)"
  [ -f "$marker" ] && { echo "($kind heute schon gemeldet, kein Doppelversand)"; return 0; }
  if [ -z "${ADMIN_API_TOKEN:-}" ]; then echo "WARN: ADMIN_API_TOKEN fehlt, keine Ops-Mail."; return 0; fi
  local payload
  payload=$(SUBJECT="$subject" MESSAGE="$message" KIND="$kind" node -e 'process.stdout.write(JSON.stringify({subject:process.env.SUBJECT,message:process.env.MESSAGE,kind:process.env.KIND}))' 2>/dev/null)
  if [ -n "$payload" ] && curl -s -o /dev/null -w '%{http_code}' --max-time 25 \
       -X POST "$SITE_URL/api/ops-alert" \
       -H "Authorization: Bearer $ADMIN_API_TOKEN" -H 'Content-Type: application/json' \
       -d "$payload" | grep -q '^200$'; then
    touch "$marker"; echo "Ops-Mail ausgeloest ($kind)"
  else
    echo "WARN: Ops-Mail fehlgeschlagen ($kind) — Catch-up versucht erneut."
  fi
}

alert() { notify "alert" "Tageslauf-Fehler" "$1"; }

# Always work on main for the daily publish.
git checkout main >/dev/null 2>&1 || { alert "git checkout main fehlgeschlagen"; exit 1; }
git pull --ff-only origin main >/dev/null 2>&1 || echo "WARN: git pull nicht ff"

# Safety net for internal cluster linking. The primary path adds links per-publish inside
# run-media.ts, but an article published outside the approve->media flow (e.g. a direct status
# edit) would otherwise go live without cluster links. This relink is deterministic + idempotent
# (no LLM, no cost) and only commits when something actually changed. Drafts are never linked.
if npx tsx scripts/content-engine/knowledge/backfill_cluster_links.ts; then
  # Scope to .mdx via git pathspec (quoted, git expands the glob, not the shell): relinkAll only
  # ever rewrites *.mdx, so this commits exactly the link changes and never sweeps a stray non-mdx
  # file or a pre-existing manual edit into the unattended commit.
  if [ -n "$(git status --porcelain -- 'content/blog/*.mdx')" ]; then
    git add -- 'content/blog/*.mdx'
    if git commit -q -m "fix(blog): refresh internal cluster links (daily safety net)"; then
      # Fail loud: a swallowed safety-net push would otherwise cascade into the pipeline's own
      # push failing (local ahead of a diverged remote) with a misleading generic alert.
      git push origin main || { alert "Safety-net cluster-link push fehlgeschlagen"; exit 1; }
      echo "Cluster-Links aktualisiert + gepusht"
    fi
  else
    echo "Cluster-Links bereits aktuell"
  fi
fi

# Refresh the indexation kill-switch BEFORE generating, so the pipeline's pre-emit kill-switch read
# reflects today's coverage. Non-blocking: if GSC creds are absent or the check errors, the existing
# flag is left untouched (fail-safe — a missing/stale flag counts as inactive) and we still publish.
# Hard 7-min cap: the TS layer already bounds each GSC URL to ~15s, but the outer guard ensures
# even a total auth/network stall can't wedge the daily run. On timeout/error the existing
# kill-switch flag is left untouched (fail-safe — a missing/stale flag counts as inactive).
pgtimeout 420 npx tsx scripts/content-engine/dashboard/check_indexation.ts || echo "WARN: Indexierungs-Check fehlgeschlagen/timeout, Kill-Switch unverändert (fail-safe)."

# Generate next draft (quality-gated). On halt, exit cleanly without shipping.
# --no-image: ship TEXT ONLY for review. Images (hero + infographic + context photos) are now
# generated later, in the media step (run-media.ts) AFTER Thomas approves the text, together with
# podcast + video. No point spending expensive image generation on text he might reject.
if ! npx tsx scripts/content-engine/pipeline.ts --next --emit --no-image; then
  echo "Pipeline hat gehalten oder Fehler. Nichts publiziert."
  # Daily-signal guarantee: even on a no-article day Thomas gets one mail explaining why, instead of
  # silence. NOT stamped, so the 3h catch-up still retries a transient halt; notify() de-dupes so he
  # gets at most one such mail per day.
  notify "halt" "Heute kein neuer Artikel" "Die Content-Pipeline hat heute angehalten — kein neues Thema in der Queue, Quality-Gate, oder der Indexierungs-Kill-Switch ist aktiv. Es wurde nichts publiziert. Der Catch-up versucht es im Tagesverlauf erneut. Log: $LOG"
  exit 0
fi

# Figure out which slug was just written (newest draft in content/blog).
SLUG="$(git status --porcelain content/blog | grep -E '\.mdx$' | head -1 | sed -E 's#.*content/blog/([^/]+)\.mdx#\1#')"
if [ -z "$SLUG" ]; then echo "Kein neuer Artikel erkannt."; exit 0; fi
echo "Neuer Artikel: $SLUG"

# Include vault.md: the pipeline's --emit backflow appends verified facts there; without staging
# it the knowledge SoT drifts uncommitted in the working tree (caused a dirty-tree surprise 11.06).
git add content/blog public/images/blog content-engine/topics/status.json content-engine/knowledge/vault.md
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
  # curl exits 0 even on HTTP 5xx, so check the STATUS CODE, not curl's exit. -o<file> sends the body
  # to a file (portable; macOS head has no `-n -1`), -w prints just the code to stdout.
  RESPFILE="$WORK/.review-resp-$$"
  CODE=$(curl -s -o "$RESPFILE" -w '%{http_code}' --max-time 30 -X POST "$SITE_URL/api/review-notify" \
    -H "Authorization: Bearer $ADMIN_API_TOKEN" -H 'Content-Type: application/json' \
    -d "{\"slug\":\"$SLUG\"}")
  BODY=$(cat "$RESPFILE" 2>/dev/null); rm -f "$RESPFILE"
  if [ "$CODE" = "200" ]; then
    echo "review-mail ausgeloest: $BODY"
  else
    # Article exists + is pushed, so we still stamp (a re-run would generate a DUPLICATE article);
    # but the mail failed -> alert so the day isn't silent and Thomas can approve from the dashboard.
    echo "FEHLER: Review-Mail HTTP $CODE — $BODY"
    notify "alert" "Review-Mail-Versand fehlgeschlagen" "Der Artikel '$SLUG' wurde erstellt und nach main gepusht, aber der Versand der Review-Mail schlug fehl (HTTP $CODE: $BODY). Bitte im Dashboard freigeben. Log: $LOG"
  fi
else
  echo "WARN: ADMIN_API_TOKEN fehlt, keine Review-Mail gesendet."
  notify "alert" "Review-Mail nicht gesendet (Token fehlt)" "Artikel '$SLUG' wurde erstellt, aber ADMIN_API_TOKEN fehlt -> keine Review-Mail moeglich. Bitte im Dashboard freigeben. Log: $LOG"
fi

touch "$STAMP"
echo "==== fertig $(date) ===="
