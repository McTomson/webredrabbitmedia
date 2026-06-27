# Naechste Session — VPS-Medien-Umzug (RedRabbit) — 2026-06-27

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, die Memory `reference_vps_redrabbit_media_setup`, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe. Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben.
- **Thomas: KEINE Extra-/API-Kosten.** Text via Claude-Abo (`claude`-CLI), Medien via gratis Google (Gemini/NotebookLM). Niemals Anthropic-API-Key auf den VPS.

## Ziel
RedRabbit-**Medien**-Produktion (headless-Chrome-Bilder + Podcast/Video) vom ueberlasteten Mac auf den **IONOS-VPS** umziehen. Mac macht weiter den **Artikel-Text** (laeuft seit Netz-Fix stabil), VPS macht die **Medien**. Pumukel auf dem VPS NICHT anfassen.

## Stand dieser Session — ERLEDIGT + verifiziert
- **Mac-Zuverlaessigkeit gefixt + gepusht:** (a) Tageslauf wartet bis 60 Min auf Netz (commit `4c886a7`) — verifiziert: 26.+27.06 kam der Artikel + Review-Mail vollautomatisch. (b) Medien-Meltdown unmoeglich gemacht: atomarer mkdir-Lock + Last-Schutz (>12 skip) + Cleanup-Trap + **Browser zwischen Render-Retries schliessen** (commits `452b55f`,`4580600`,`7624130`,`7a3f8d0`). Beweis: Mac-Checker hat 26.06 die Medien selbst sauber zu Ende gebracht (chrome-150 blieb 0).
- **VPS-Infra fertig (alles QA-verifiziert):** isolierter User `redrabbit` auf `ssh ionos` (AlmaLinux 9, 6 Kerne, ~3,3 GB frei, Last ~0). Node 20 (nvm), agent-browser 0.27 + Chrome-150 (**headless 0,45s**). Repo geklont: `/home/redrabbit/projects/webredrabbitmedia`, `npm install` ok. GitHub Deploy-Key mit Schreibzugriff (id 155609789).
- **DURCHBRUCH: Gemini-Login funktioniert HEADLESS auf dem VPS** (Datacenter-IP von Google akzeptiert). Verifiziert: `agent-browser open gemini.google.com/app` → URL `/app` (eingeloggt als Thomas), Eingabefeld da. Profil: `/home/redrabbit/.agent-browser-profiles/gemini-immo`.

## OFFEN — naechste konkrete Schritte (in Reihenfolge)
1. **generate-images auf VPS zum Laufen bringen.** Test lief stumm aus — Ursache fast sicher: per `nohup &` ueber SSH gestartet → starb mit der SSH-Sitzung (NICHT Skript-Bug; Login+Chrome funktionieren). Richtig starten: `setsid`/systemd-run/cron, ODER direkt im Vordergrund testen:
   `ssh ionos 'sudo -u redrabbit bash -lc ". ~/.nvm/nvm.sh; cd ~/projects/webredrabbitmedia; timeout 240 bash scripts/content-engine/media/generate-images-gemini.sh <slug>"'`
   (Hinweis: Bash-Tool-Timeout 2 Min — lange Laeufe detached + separat pollen.) Erwartung: hero.png in `.work/<slug>-staging/`.
2. **`.env.local` + YouTube-Token auf den VPS** (Mac→scp), **OHNE Anthropic-Key**. Mac-Quelle: `~/dev/redrabbit-daily/.env.local` (Klassifizierer blockt Lesen — ggf. gezielt nur noetige Keys: Gmail-SMTP, SITE_URL, HEARTBEAT_URL, YouTube). YouTube-OAuth: `~/.config/redrabbit-youtube/` → VPS. (Braucht der Tail: Mail + YouTube-Upload.)
3. **NotebookLM-Login auf VPS** (Podcast/Video) — gleiche VNC-Methode wie Gemini (siehe unten). notebooklm-py CLI im redrabbit-Home installieren.
4. **media-checker als cron/systemd-timer auf VPS** (alle 30 Min, wie der Mac-launchd-Job) + **Mac-checker deaktivieren** (`launchctl unload ~/Library/LaunchAgents/com.redrabbit.mediachecker.plist`). Dann End-to-End-Test mit einem offenen Marker.
5. **Voller End-to-End-Medientest** auf dem VPS (offener Marker → Bilder+Podcast+Video → einbetten → YouTube → push → Mail → Marker weg), live verifizieren.

## VNC-Login-Methode (fuer Re-Login Gemini/NotebookLM, falls Google ausloggt)
1. `ssh ionos 'sudo -u redrabbit bash /home/redrabbit/bin/start-login-browser.sh'` (startet Xvnc :99 + headful Chrome auf Gemini-Login; VNC-Pass `rabbit27`, nur localhost). Fuer NotebookLM die URL im Skript anpassen.
2. Mac-Tunnel: `ssh -f -N -L 5999:localhost:5999 ionos` → Finder `Cmd+K` → `vnc://localhost:5999` → Pass `rabbit27`.
3. `@` laesst sich per VNC nicht tippen → E-Mail serverseitig: `ssh ionos 'sudo -u redrabbit bash -lc "DISPLAY=:99 xdotool type t.uhlir@immo.red"'`. **Passwort tippt Thomas** via VNC. Screenshot zur Kontrolle: `DISPLAY=:99 import -window root /tmp/x.png` + scp + Read.
4. Danach: headful Chrome sauber killen (`pkill -TERM -f user-data-dir=...gemini-immo`, 5s, dann -9), `Singleton*` im Profil loeschen, Xvnc (`pkill -9 -f "Xvnc :99"`) + Mac-Tunnel beenden. Dann headless testen.

## Blocker / Risiken
- **Google-Logout-Risiko:** evtl. loggt Google die VPS-Session irgendwann aus → Re-Login via VNC noetig. Damit rechnen, Health-Check einbauen (Hero-Guard meldet es schon).
- **RAM knapp** (~3,3 GB frei): nur EIN Browser gleichzeitig (Lock sorgt dafuer). Bei Engpass Swap erhoehen.
- **Stale Marker:** lokal liegen 2 alte Marker (`wie-lange-dauert...`, `was-muss-vorbereitet...`) zusaetzlich zum heutigen — Checker ignoriert nicht-heutige (requestedAt!=heute), also harmlos; bei Gelegenheit aufraeumen.
- **Heutiger 27.06-Artikel** `wie-viel-eigene-zeit-muss-in-das-website-projekt`: Text live + freigegeben, Medien-Marker offen → der (reparierte) **Mac**-Checker zieht sie nach, solange der VPS-Umzug nicht fertig ist. Pruefen ob durch.

## Relevante Dateien / Befehle
- VPS: `ssh ionos` (root); Arbeit als `sudo -u redrabbit bash -lc "..."`. Repo: `/home/redrabbit/projects/webredrabbitmedia`. Logs: `/home/redrabbit/logs/`.
- Memory: `reference_vps_redrabbit_media_setup` (alle Details, Pfade, Pumukel-Caveat).
- Medien-Skripte: `scripts/content-engine/media/generate-images-gemini.sh`, `.../generate-podcast-cli.sh`, `.../generate-video.sh`, `.../run-media.ts`; Trigger: `scripts/content-engine/trigger/run-media-check.sh` (hat jetzt Lock+Last-Schutz).
- Mac-Repo: `~/dev/redrabbit-daily` (BOT-Worktree, immer main). Deploy: Vercel auto nach Push.
