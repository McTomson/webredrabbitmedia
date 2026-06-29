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

# Concurrency-Lock: der headless Bildschritt dauert viele Minuten. OHNE Lock startet der 30-Min-
# launchd-Tick einen ZWEITEN Lauf, waehrend der erste noch rendert -> mehrere agent-browser-Daemons
# + Chrome-Instanzen stapeln sich (beobachtet 2026-06-26: parallele Laeufe -> ~180 chrome-Prozesse,
# Last 74). Ein PID-Lock (stale nach 90 Min => ueberlebt auch einen -9-Kill) macht ueberlappende
# Ticks zu No-Ops. Liegt VOR dem date-Stamp, weil der Stamp manuell oft entfernt wird.
# ATOMAR via mkdir (POSIX-garantiert: nur EIN Prozess kann das Verzeichnis anlegen). Ein einfacher
# "if -f LOCK; then ... ; echo $$ > LOCK" hat ein Race-Fenster (pruefen-dann-schreiben) -> zwei fast
# gleichzeitige Ticks rutschen beide durch (beobachtet 2026-06-26: Watcher + launchd-Tick gleichzeitig
# -> erneut Browser-Stau). mkdir schliesst das Fenster.
LOCKDIR="$WORK/media-check.lock.d"
if ! mkdir "$LOCKDIR" 2>/dev/null; then
    # Lock existiert. Stale (>90 Min, z.B. nach -9-Kill)? Dann uebernehmen, sonst abbrechen.
    if [ "$(find "$LOCKDIR" -mmin -90 2>/dev/null)" ]; then
        echo "Media-Lauf laeuft bereits (Lock aktiv) — Abbruch."
        exit 0
    fi
    rmdir "$LOCKDIR" 2>/dev/null
    mkdir "$LOCKDIR" 2>/dev/null || { echo "Lock-Race verloren — Abbruch."; exit 0; }
fi
echo $$ > "$LOCKDIR/pid" 2>/dev/null || true
trap 'rmdir "$LOCKDIR" 2>/dev/null || rm -rf "$LOCKDIR" 2>/dev/null' EXIT

# Last-Schutz: bei extremer Systemlast kommt der headless Render ohnehin nicht durch und stapelt nur
# Browser. Dann diesen Tick ueberspringen OHNE Stamp -> der naechste Tick versucht es erneut, sobald
# die Maschine ruhiger ist (verhindert den Grind-bei-Last-74 vom 2026-06-26).
LOAD1="$(sysctl -n vm.loadavg 2>/dev/null | awk '{print $2}' | tr ',' '.')"
if awk -v a="${LOAD1:-0}" 'BEGIN{exit !(a+0 > 12)}'; then
    echo "Systemlast $LOAD1 zu hoch (>12) — Media-Tick uebersprungen, Retry beim naechsten Tick."
    echo "(Headless-Gemini-Render braucht eine ruhige Maschine; verifiziert 2026-06-26: bei Last 16-30"
    echo " laufen die ctx-Renders in den Timeout, bei Last <8 gelingt der Hero in Sekunden.)"
    exit 0
fi

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

# Bilder: die SCHWERE Gemini-Browser-Last laeuft auf dem IONOS-VPS (Mac wurde davon ueberlastet, 27.06).
# Aufteilung (0 API-Kosten, alles unter dem claude-Abo): der MAC baut NUR den Art-Director-Plan
# (`claude -p`, leicht), schickt ihn zum VPS; der VPS rendert die PNGs headless via Gemini (claude-frei,
# gratis) und schickt sie zurueck; der MAC bettet lokal ein (browser-frei: copy + SVG-Infografik + MDX).
# Faellt bei JEDEM Fehler auf lokales Rendern zurueck (Meltdown-Fixes greifen) -> nie ein Totalausfall.
render_images_via_vps() {
    local slug="$1"
    local stage="scripts/content-engine/.work/${slug}-staging"
    local SSH="ssh -o ConnectTimeout=20 -o BatchMode=yes ionos"
    command -v ssh >/dev/null 2>&1 || return 1
    $SSH true 2>/dev/null || { echo "  VPS nicht erreichbar — Fallback lokal."; return 1; }

    # 1) Plan lokal bauen (Mac, claude-Abo). build-image-plan schreibt plan.json + gemini-meta.json.
    mkdir -p "$stage"
    echo "  Plan bauen (Mac, claude-Abo) ..."
    npx tsx scripts/content-engine/media/build-image-plan.ts "$slug" >/dev/null 2>&1 || { echo "  Plan-Bau fehlgeschlagen."; return 1; }
    [ -f "$stage/plan.json" ] || { echo "  keine plan.json."; return 1; }

    # 2) VPS auf main + Plan hinschicken (tar ueber ssh, da Schreibrechte als redrabbit via sudo).
    $SSH 'sudo -u redrabbit bash -lc "cd ~/projects/webredrabbitmedia && git fetch -q origin && git reset --hard -q origin/main"' >/dev/null 2>&1 || { echo "  VPS-git fehlgeschlagen."; return 1; }
    # WICHTIG: absolute VPS-Pfade. `~` wuerde in `sudo -u redrabbit tar -C ~/...` zu /root expandieren
    # (root-Shell VOR sudo), nicht /home/redrabbit -> Permission denied (verifiziert 27.06).
    local VWORK="/home/redrabbit/projects/webredrabbitmedia/scripts/content-engine/.work"
    tar czf - -C scripts/content-engine/.work "${slug}-staging/plan.json" "${slug}-staging/gemini-meta.json" 2>/dev/null \
        | $SSH "sudo -u redrabbit tar xzf - -C $VWORK" 2>/dev/null || { echo "  Plan-Transfer fehlgeschlagen."; return 1; }
    $SSH "sudo -u redrabbit rm -f $VWORK/${slug}-staging/*.png" 2>/dev/null

    # 3) VPS rendert (--render-only), synchron auf RENDER_OK pollen (bis ~25 Min).
    # Grosszuegiges Limit (2026-06-29): ein flaky ctx-Bild (der /glic-Hijack) kann viele Retries
    # brauchen -> ein einzelner Lauf dauerte ~19 Min. Das alte 12-Min-Limit loeste faelschlich
    # "Timeout" aus und fiel auf LOKALES Rendern zurueck (genau die Mac-Ueberlast, die der VPS-Umzug
    # vermeiden soll). Der VPS-Render belastet den Mac nicht, also kostet ein laengeres Warten nichts.
    # Frueh abbrechen, wenn der Render-Prozess stirbt (kein Sinn, 25 Min auf eine Leiche zu warten).
    echo "  VPS rendert (Gemini headless) ..."
    $SSH "sudo -u redrabbit bash -lc 'setsid bash /home/redrabbit/bin/genimg.sh $slug --render-only </dev/null >/home/redrabbit/logs/genimg.out 2>&1 &'" 2>/dev/null
    local ok=0 i
    for i in $(seq 1 150); do
        sleep 10
        $SSH "grep -q 'RENDER_OK=$slug' /home/redrabbit/logs/genimg.out" 2>/dev/null && { ok=1; break; }
        $SSH "grep -q 'FATAL:' /home/redrabbit/logs/genimg.out" 2>/dev/null && { echo "  VPS-Render FATAL."; return 1; }
        # nach einer Anlaufzeit: bricht der Render-Prozess weg, nicht bis zum Limit warten
        [ "$i" -gt 6 ] && ! $SSH "pgrep -f generate-images-gemini >/dev/null 2>&1" 2>/dev/null && { echo "  VPS-Render-Prozess beendet ohne RENDER_OK."; return 1; }
    done
    [ "$ok" = 1 ] || { echo "  VPS-Render Timeout (>25 Min)."; return 1; }

    # 4) PNGs zurueck (VPS -> Mac staging).
    $SSH "sudo -u redrabbit tar czf - -C $VWORK ${slug}-staging" 2>/dev/null \
        | tar xzf - -C scripts/content-engine/.work 2>/dev/null || { echo "  PNG-Rueckholung fehlgeschlagen."; return 1; }
    [ -f "$stage/hero.png" ] && [ "$(wc -c < "$stage/hero.png" 2>/dev/null | tr -d ' ')" -gt 20480 ] || { echo "  Hero kam nicht zurueck."; return 1; }

    # 5) Lokal einbetten (browser-frei).
    echo "  Einbetten (lokal, browser-frei) ..."
    npx tsx scripts/content-engine/media/apply-images-browser.ts "$slug" >/dev/null 2>&1 || { echo "  apply fehlgeschlagen."; return 1; }
    [ -f "public/images/blog/${slug}.png" ] || return 1
    return 0
}

echo "Generiere Bilder fuer $SLUG (VPS-Render, Mac bettet ein) ..."
if render_images_via_vps "$SLUG"; then
    echo "Bilder fertig (VPS-Render + lokales Einbetten)."
elif scripts/content-engine/media/generate-images-gemini.sh "$SLUG" 2>&1; then
    echo "Bilder fertig (LOKALER Fallback — VPS war nicht verfuegbar)."
else
    echo "WARN: Bilder fehlgeschlagen (weiter; Hero-Guard + needs-images greifen)."
fi

# HERO-GUARD: fehlt nach dem Bildschritt das Hero (Gemini-Login abgelaufen / Google-Block / Render-
# Timeout), LAUT alarmieren. Wir brechen NICHT ab (Podcast/Video laufen trotzdem); der needs-images-
# Marker weiter unten haelt den Bildschritt offen, bis er nachgezogen ist.
HERO="public/images/blog/${SLUG}.png"
if [ ! -f "$HERO" ]; then
    echo "ALARM: Hero-Bild fehlt ($HERO) — Gemini-Bildschritt fehlgeschlagen (Login? Google-Block?). Profil pruefen: generate-images-gemini.sh login."
    osascript -e "display notification \"Artikel '$SLUG': Bilder FEHLEN (Gemini-Bildschritt). Login/Profil pruefen.\" with title \"Red Rabbit Media\" subtitle \"Bilder fehlen — Hero kaputt\" sound name \"Basso\"" 2>/dev/null || true
fi

# --- Podcast headless erzeugen (notebooklm-py CLI, kein Browser, KEIN claude/Pool) ---
# Umgestellt 22.06 von generate-podcast.sh (MCP+Pool+claude) auf generate-podcast-cli.sh:
# der MCP-Pfad brach 21.-22.06 zweimal (kaputter nvm-claude-Stub + leerer Notebook-Pool).
# Die CLI legt ihr eigenes Notebook an und hat eigene Auth -> keine dieser Abhaengigkeiten.
echo "Podcast (NotebookLM CLI, headless) fuer $SLUG ..."
GP_OUT="$(scripts/content-engine/media/generate-podcast-cli.sh "$SLUG" 2>&1)"
echo "$GP_OUT"
PODCAST_FILE="$(printf '%s\n' "$GP_OUT" | grep -oE '^PODCAST_FILE=.*' | head -1 | sed 's/^PODCAST_FILE=//')"

# --- Video headless erzeugen (notebooklm-py CLI, Volltext-Quelle, kein Browser) ---
# Best-effort: ein Video-Fehler darf den Podcast-Versand NIE abbrechen. Die wichtigste
# Lektion (19.06) steckt im Skript: Video MUSS aus Volltext entstehen (URL-Crawl scheitert).
echo "Video (NotebookLM CLI, headless) fuer $SLUG ..."
GV_OUT="$(scripts/content-engine/media/generate-video.sh "$SLUG" 2>&1)"
echo "$GV_OUT"
VIDEO_FILE="$(printf '%s\n' "$GV_OUT" | grep -oE '^VIDEO_FILE=.*' | head -1 | sed 's/^VIDEO_FILE=//')"
[ -n "$VIDEO_FILE" ] && [ -f "$VIDEO_FILE" ] || { echo "WARN: kein Video — fahre ggf. Podcast-only fort."; VIDEO_FILE=""; }

# Mindestens eine Mediendatei? Dann den deterministischen Tail EINMAL fahren (ein commit/push/Mail),
# mit allem was vorliegt. run-media bettet ein, laedt das Video oeffentlich auf YouTube (klickbares
# Marken-Poster -> Video, Artikel-Link in der Beschreibung), pusht, mailt und LOESCHT den Marker.
if { [ -n "$PODCAST_FILE" ] && [ -f "$PODCAST_FILE" ]; } || [ -n "$VIDEO_FILE" ]; then
    RM_ARGS=(--slug "$SLUG" --no-images)
    [ -n "$PODCAST_FILE" ] && [ -f "$PODCAST_FILE" ] && RM_ARGS+=(--podcast "$PODCAST_FILE")
    [ -n "$VIDEO_FILE" ] && RM_ARGS+=(--video "$VIDEO_FILE")
    echo "Medien-Tail (einbetten + YouTube + push + Mail) ... ${RM_ARGS[*]}"
    if npx tsx scripts/content-engine/media/run-media.ts "${RM_ARGS[@]}" 2>&1; then
        WHAT="Podcast"; [ -n "$VIDEO_FILE" ] && { [ -n "$PODCAST_FILE" ] && WHAT="Podcast + Video" || WHAT="Video"; }
        echo "Medien-Tail fertig. Artikel hat jetzt $WHAT live."
        # TRIGGER WASSERDICHT (22.06): run-media hat den Marker geloescht ("fertig"). Fehlt aber das
        # Hero (Codex leer), ist der Artikel NICHT fertig -> Bilder muessen noch via Gemini-Browser
        # rein. Frueher wurde hier still beendet und der Gemini-Schritt nie ausgeloest. Jetzt: einen
        # PERSISTENTEN needs-images-Marker neu anlegen, damit die naechste Claude+Chrome-Session (oder
        # generate-images-gemini.sh) den Bildschritt zuverlaessig nachzieht. Plus laute Notification.
        if [ ! -f "public/images/blog/${SLUG}.png" ]; then
            mkdir -p "$MEDIA_DIR"
            node -e 'const fs=require("fs");const f=process.argv[1],slug=process.argv[2];fs.writeFileSync(f,JSON.stringify({slug,status:"needs-images",reason:"codex-leer",requestedAt:new Date().toISOString().slice(0,10)},null,2))' \
                "$MEDIA_DIR/${SLUG}.json" "$SLUG" 2>/dev/null || true
            echo "NEEDS-IMAGES: Marker fuer $SLUG behalten — Gemini-Bildschritt steht aus."
            osascript -e "display notification \"$WHAT fuer '$SLUG' live, aber BILDER fehlen (Codex leer) -> Gemini-Bildschritt nachziehen.\" with title \"Red Rabbit Media\" subtitle \"Bilder ausstehend (needs-images)\" sound name \"Basso\"" 2>/dev/null || true
        else
            osascript -e "display notification \"$WHAT fuer '$SLUG' ist automatisch live. Substack-Draft ggf. noch manuell.\" with title \"Red Rabbit Media\" subtitle \"Medien auto-publiziert\" sound name \"Glass\"" 2>/dev/null || true
        fi
        echo "==== fertig $(date) ===="
        exit 0
    fi
    echo "WARN: run-media fehlgeschlagen — Fallback auf Browser-Session-Notification."
else
    echo "WARN: Weder Podcast noch Video erzeugt — Fallback auf Browser-Session-Notification."
fi

# Fallback: manuelle Browser-Session noetig (Pool leer, MCP-Auth weg, Timeout, ...).
osascript <<APPLESCRIPT 2>/dev/null || true
display notification "Artikel \"$SLUG\": Auto-Medien unvollstaendig. Bitte Claude Code starten und 'npm run media' ausfuehren (NotebookLM + YouTube + Substack)." with title "Red Rabbit Media" subtitle "Manuelle Media-Session noetig" sound name "Glass"
APPLESCRIPT

echo "Fallback-Notification gesendet. Warte auf Browser-Session."
echo "==== fertig $(date) ===="
