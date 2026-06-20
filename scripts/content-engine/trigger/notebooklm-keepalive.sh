#!/bin/bash
# notebooklm-keepalive.sh
# ---------------------------------------------------------------------------
# Keeps the notebooklm-py CLI session (the headless VIDEO auth) warm so it does
# not silently expire between articles. Every authenticated CLI call rewrites
# ~/.notebooklm/profiles/default/storage_state.json with refreshed Google cookies
# (verified: a single `notebooklm list` bumps the file mtime). Run weekly via
# launchd so the rolling cookies never age out during a quiet stretch.
#
# If the session HAS expired, this is the early-warning tripwire: it notifies
# (macOS banner + alert file) so Thomas re-runs `notebooklm login` BEFORE the next
# article needs a video — instead of discovering it only when a video silently
# gets skipped. Exit 0 always (a keepalive must never be treated as a hard failure).
# ---------------------------------------------------------------------------
set -uo pipefail

export PATH="$HOME/.local/bin:/opt/homebrew/bin:$PATH"
export DISABLE_AUTOUPDATER=1
NLM="${NOTEBOOKLM_BIN:-notebooklm}"
STATE="$HOME/.notebooklm/profiles/default/storage_state.json"
ALERT="$HOME/.notebooklm/keepalive-alert.txt"
LOG="$HOME/.notebooklm/keepalive.log"
mkdir -p "$HOME/.notebooklm"

stamp() { date "+%Y-%m-%d %H:%M:%S"; }

if ! command -v "$NLM" >/dev/null 2>&1; then
    echo "$(stamp) FEHLT: notebooklm CLI nicht gefunden" >>"$LOG"
    exit 0
fi

if "$NLM" list --json >/dev/null 2>&1; then
    # Success: the call refreshed the cookie file. Clear any stale alert.
    echo "$(stamp) OK (Sitzung aufgefrischt$( [ -f "$STATE" ] && echo ", state $(stat -f '%Sm' "$STATE" 2>/dev/null)" ))" >>"$LOG"
    rm -f "$ALERT" 2>/dev/null || true
    exit 0
fi

# Failure: auth gone. Leave a durable alert + a banner so it gets fixed proactively.
echo "$(stamp) AUTH ABGELAUFEN -> 'notebooklm login' als t.uhlir@immo.red noetig" | tee -a "$LOG" >"$ALERT"
osascript -e 'display notification "NotebookLM-Login abgelaufen. Bitte einmal: notebooklm login (t.uhlir@immo.red). Sonst wird beim naechsten Artikel das Video uebersprungen (Podcast laeuft weiter)." with title "Red Rabbit Media" subtitle "Video-Auth auffrischen" sound name "Glass"' 2>/dev/null || true
exit 0
