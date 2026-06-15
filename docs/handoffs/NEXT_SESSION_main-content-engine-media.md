# Naechste Session — content-engine media (2026-06-15)

> **UPDATE 15.06 (Reliability-Fix, Commit `f12d0c4`):** Die tägliche Review-Mail blieb heute aus.
> Ursache: der GSC-Indexierungs-Check (`getIndexationStatus` in `lib/dashboard/google.ts`) hatte
> KEINEN Timeout und hing 3h+ -> `run-daily.sh` blockiert (Lock gehalten), kein Artikel, keine Mail.
> Behoben: `withTimeout`+15s-Cap+Fail-safe-Schwelle in google.ts, portabler perl-`pgtimeout`-Wächter
> in `run-daily.sh` (420s), Test `google.test.ts`. Lauf nachgeholt -> Draft
> `welche-versteckten-kosten-gibt-es-bei-der-website-erstellung` (Commit `da86852`), Review-Mail an
> **t.uhlir@immo.red** ausgelöst (ok:true). Empfänger der DAILY-Mail = immo.red (nicht das alte Gmail).
> Details + Triage: Memory `reference_redrabbit_daily_mail_hang_fix`.
>
> **AUTO-ALERT GEBAUT (Commit `3319bb7`, live-getestet):** Garantie "jeden Tag genau ein Signal" — neue
> Route `app/api/ops-alert/route.ts` (Admin, Vercel-SMTP) + `run-daily.sh` `notify()` (dedupt pro Tag).
> Bei Pipeline-Halt/Fehler/Mail-5xx/Token-fehlt kommt jetzt eine kurze Status-/Alarm-Mail ("[Red Rabbit
> Ops] ...") statt Stille. Verifiziert: Test-POST an deployte Route -> HTTP 200, Mail an t.uhlir@immo.red.
>
> **NEUER MEDIEN-BACKLOG:** der heute generierte+freigegebene Artikel
> `welche-versteckten-kosten-gibt-es-bei-der-website-erstellung` ist PUBLISHED und hat einen Medien-Marker
> in `content-engine/.media-requests/` -> braucht noch Podcast+Video+Bilder (NotebookLM-Lauf wie die 4
> Backlog-Artikel, Runbook unten). Noch nicht produziert.

## Arbeitsregeln (verbindlich)
- **Lies ZUERST ALLE relevanten MD-Files** (Thomas-Wunsch): diesen Handoff, das Repo-`CLAUDE.md`,
  `~/CLAUDE.md`, `~/.claude/CLAUDE.md`, `MEMORY.md` + die verlinkten Memory-Files unter
  `~/.claude/projects/-Users-McTomson/memory/`, sowie die Runbooks
  `content-engine/knowledge/media-notes.md`, `.agent/workflows/bilder-gemini-browser.md`,
  `.agent/workflows/podcast-einbinden.md`, `content/blog/CLAUDE.md` falls vorhanden. Nicht loslegen ohne Kontext.
- **NIE raten — immer verifizieren** (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed,
  nie einen Wert erfinden. Gilt verschaerft fuer alles, was live/veroeffentlicht wird.
- **Kurz gegenpruefen, was die letzte Session gemacht hat**, ob es wirklich in Ordnung ist (Stichproben:
  Artikel live im Browser ansehen, Bilder/Embeds/Thumbnails kontrollieren, Tests laufen lassen).
- Erst einen Plan machen (TaskCreate/TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft (Infografik/Embedding lief gut parallel).
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen. Grenze: kein
  Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung; **Veroeffentlichen (Substack/
  YouTube public) im Namen des Users -> pro Schritt OK holen** (genereller Backlog-OK lag fuer 14.06 vor).
- Laufend testen + bei groesseren Schritten review. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Render-Laeufen ALLE ~15 MIN Health-Check + Stichprobe. Bricht ein Tool wiederholt
  ein (2-3x) -> STOPP + andere Methode oder kurz abstimmen, nicht endlos den gleichen Klick wiederholen.

## PFLICHT-KONTEN (Grund-Wissen, immer anwenden)
- **NotebookLM + Gemini + alle Google-Dienste = `t.uhlir@immo.red`** (im Konto-Switcher = **authuser=3**,
  Label "Arbeit", Workspace "RED Real Estates Development GmbH", NotebookLM zeigt "PRO", Gemini-Modell "Pro").
  NICHT `thomas.uhlir@gmail.com` (das ist der Default-Switcher-Account und war 14.06 versehentlich aktiv).
  Im Switcher umstellen, auch wenn ein anderes Konto aktiv ist. Gemini-URL haengt am Konto: `/u/3/app`.
- **YouTube** = Kanal "Red Rabbit Lab" (@redrabbitlab, UC6hInJDtZeD8YSOwuvV60yA). Upload technisch ueber
  OAuth-Token `~/.config/redrabbit-youtube/token.json` (kontounabhaengig vom Browser).
- **Substack** = Publikation **redrabbitlab.substack.com** ("Substack von Tom" / Publikation
  "Red Rabbit Websiten infos", Autor "Tom"). Im Browser eingeloggt.

## Stand 14.06 (diese Session) — alles committet + gepusht (main, bis `8100b81`), 164 Tests gruen, Tree clean
### ERLEDIGT + verifiziert
- **NEUES FEATURE Video-Thumbnail LIVE**: `scripts/content-engine/media/videoPoster.ts` (sharp:
  Hero 16:9 + dunkler Scrim + grosser YouTube-Play-Badge + Red-Rabbit-Logo oben rechts). In
  `run-media.ts` verdrahtet: Poster wird VOR dem Upload aus dem Hero gebaut und als YouTube-Custom-
  Thumbnail gesetzt (`youtube_upload.py --thumbnail` neu, plus `--thumbnail-only --video-id` zum
  Nachziehen bestehender Videos). Tests `videoPoster.test.ts`, code-reviewed (stderr-Forward-Fix).
- **PILOT** zu-welchen-zeitpunkten-... komplett live, neuer Branded-Poster + YT-Thumbnail (kurFCoj0ebs).
- **BACKLOG 4 Artikel komplett live** (Podcast+Video deutsch via NotebookLM, YouTube public + Branded-
  Thumbnail, self-hosted, eingebettet, gepusht, Marker geleert) auf Konto t.uhlir@immo.red:
  - wie-viel-kostet-eine-website-im-unterhalt — YT `I7j24Rjbt8w`
  - warum-sind-manche-webdesign-agenturen-deutlich-teurer-als-andere — YT `LF0Nx4l5n0k`
  - was-kostet-ein-professioneller-website-relaunch — YT `l_2WlRRXpbY`
  - wie-viel-budget-muss-fuer-ein-neues-web-projekt — YT `v0neaQbM23g`
- **VOLLE BILD-PARITAET fuer alle 4 Backlog-Artikel** = Hero (Tuerkis->Blau-Verlauf + Hook) + 1 Infografik
  (lokaler SVG-Renderer `image/sketchInfographik.ts`, echte Artikel-Zahlen) + 3 Kontextfotos (Gemini,
  dokumentarisch). Infografik + Kontextfoto-Einbettung lief ueber **parallele general-purpose Agenten**.
- **HOOK-DAUERREGELN** (Thomas 14.06, in `pipeline.ts` generateHooks + `bilder-gemini-browser.md` +
  Memory `feedback_bildstil_cinematic_hook_redrabbit`): Hook muss (1) **STANDALONE das Thema tragen**
  (taucht ohne Titel im Netz auf) und (2) **korrektes, sinnvolles Deutsch** sein (kein Telegramm-Fragment;
  "wie viel budget?" war "Bammish"/kein Deutsch). (3) **Workflow: erst 3 Hooks vorschlagen -> User waehlt
  -> DANN Bild rendern** (nicht mehrfach neu rendern). Backlog-Hooks final: "was macht webdesign so teuer?"
  / "lohnt sich ein website-relaunch?" / "was darf meine website kosten?" / "was kostet eine website pro jahr?".
- **BONUS**: verbotener KI-Floskel-Einstieg "In meiner taeglichen Arbeit als Strategie-Berater bei Red
  Rabbit Media..." in den 4 Backlog-Artikeln entfernt (jeder Einstieg anders umformuliert).

### OFFEN / NAECHSTE SCHRITTE
1. **SUBSTACK-Cross-Post der 4 Artikel (als ENTWUERFE, Thomas-Wunsch "erst als Entwuerfe")** — DAS ist der
   einzige offene Punkt. Thomas' letzte Frage dazu: *"kannst du das nochmal versuchen? und wird dann auch
   der Podcast dort gepostet?"* -> bei naechster Session beantworten + umsetzen:
   - **WICHTIG/LESSON**: der Substack-URL-Import (`redrabbitlab.substack.com/publish/import`, "Paste the URL
     Here") ist ein **Bulk-RSS-Import** — er findet den ganzen Site-Feed ("22 Posts gefunden") und wuerde
     ALLE importieren (dupliziert die 8 schon vorhandenen Cross-Posts). NICHT auf "Importieren" klicken fuer
     selektive Posts. Fuer nur die 4 -> **manuell im Editor komponieren** (Erstellen -> Artikel):
     Titel + Untertitel (aus Frontmatter), Body (von der Live-Seite uebernehmen), Bilder, **Rubrik PFLICHT**
     ("RUBRIK AUSWAEHLEN"-Dropdown), canonical auf den Original-Artikel, als Entwurf speichern (auto-save).
     Quirks aus Memory: YouTube-Embed nur per Paste auf leerer Zeile; Erst-Publish-mit-Video haengt ->
     Text publizieren, Video per Aktualisieren nachziehen.
   - **Podcast auf Substack**: Substack hat eine eigene **Podcast/Audio-Funktion** (separat). Der manuelle
     Cross-Post bringt NICHT automatisch den selbst-gehosteten `<SimpleAudioPlayer>`. Optionen klaeren:
     (a) den YouTube-Video-Link einbetten (enthaelt das Audio nicht separat), (b) die mp3 als Substack-
     Audio/Podcast hochladen, (c) nur Text+Bilder+YouTube-Embed. Mit Thomas abstimmen, bevor man baut.
   - Ein **leerer Test-Entwurf** (post 202031517 "newsletter in Bearbeitung") wurde 14.06 angelegt und nicht
     befuellt — kann geloescht werden.
2. Optional: Pilot zu-welchen-zeitpunkten-... hat Hero+Infografik+3 Kontextfotos schon; pruefen ob er die
   gleiche Hook-Standalone-Regel braucht (Pilot-Hook "website gleich zahlen?" ist ok).
3. Optional: gleicher KI-Floskel-Einstieg steckt noch in 3 weiteren Artikeln ausserhalb des Backlogs
   (warum-ist-eine-website-mit-dem-tag-des-live, website-wartungsvertrag-sinnvoll,
   website-selbst-erstellen-vs-agentur) — bei Gelegenheit auch entschaerfen.

### LESSONS / verlaessliche Methoden (gegen Zeitverlust)
- **Gemini-Bild-Download zuverlaessig** (die inline-Toolbar-Download-Position springt je nach Caption-Laenge,
  daher unzuverlaessig; CORS blockt JS-`fetch`-Download): Bild generieren -> ~16-25s warten ->
  **auf das Bild klicken (oeffnet den Editor/Vollbild mit "Speichern" oben rechts)** -> dort den
  **Download-Pfeil oben rechts (~x=1281,y=33)** klicken -> Datei landet in `~/Downloads/Gemini_Generated_Image_*.png`.
  Pro Bild per Bash die neueste Datei holen + nach `public/images/blog/<slug>-ctxN-v1.png` (sharp resize 1200x675).
- Gemini-Pro-Renders dauern ~16-28s; "kein Text"-Warnungen im Caption sind meist Fehlalarm (Skizzen/Papier
  blurry = ok). Bei Kontextfotos im Prompt "KEIN Text, keine lesbare Schrift" + keine Bildschirm-mit-Text-Szenen.
- **Hero-Hook**: Gemini setzt den Hook handschriftlich ins Bild (Tuerkis #19B5AE -> Blau #2E6FD2 Verlauf,
  Person rechts, Hook links). Danach Poster via `videoPoster.ts` + YT-Thumbnail via
  `youtube_upload.py --thumbnail-only --video-id <ID> --thumbnail <poster.jpg>`.
- **NotebookLM Podcast+Video**: 1 neues Notebook/Artikel, Quelle = Live-Artikel-URL, Audio-Overview + Video-
  Overview (Erklaervideo, Deutsch) parallel starten; ~5 bzw ~10-15 Min; Download via Studio-Eintrag
  3-Punkte -> "Herunterladen". Audio kommt als `.m4a` -> `ffmpeg -i in.m4a -codec:a libmp3lame -q:a 2 out.mp3`.
  Tail: `npx tsx scripts/content-engine/media/run-media.ts --slug <slug> --podcast <mp3> --video <mp4>
  --no-images --video-title "<exakter Frontmatter-Titel>" --podcast-title "<Titel> (Podcast)"`.
  **`--no-images` IMMER** (sonst ueberschreibt images-only die Gemini-Bilder). **Titel direkt als String
  uebergeben, NICHT per `sed` aus dem Frontmatter** (BSD-sed liess 14.06 das `title: "`-Praefix stehen ->
  Bug; per node/gray-matter sauber lesen oder direkt eintippen).
- run-media `uploadToYoutube` ist NICHT idempotent -> bei Re-Run doppelter YouTube-Upload. Fuer Re-Embeds
  nur Poster/Thumbnail-Schritt separat, oder `--no-push`.

### Relevante Dateien/Befehle
- `scripts/content-engine/media/run-media.ts` (Orchestrator), `videoPoster.ts` (+ Test), `mdxMedia.ts`,
  `scripts/content-engine/upload/youtube_upload.py` (+ `youtube_auth.py`),
  `scripts/content-engine/image/sketchInfographik.ts` (Infografik-SVG), `pipeline.ts` (generateHooks).
- Staging der Medien: `~/.config/redrabbit-youtube/staging/`. Kontextfoto-Staging: `~/ctx-staging/`.
- Backlog-Marker: `ls content-engine/.media-requests/` (aktuell leer = alle 4 erledigt).
- Tests: `npx vitest run` (164 gruen). Graph: `graphify update . --no-cluster --force` (kein API-Cost).
