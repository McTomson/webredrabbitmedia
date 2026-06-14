# Naechste Session — content-engine media (2026-06-14)

> STATUS 14.06 (Folge-Session): BEIDE offenen Punkte ERLEDIGT.
> - **Video-Thumbnail-Feature gebaut + live**: `scripts/content-engine/media/videoPoster.ts` (sharp:
>   Hero 16:9 + dunkler Scrim + YouTube-Play-Badge + Logo oben rechts), in run-media.ts verdrahtet
>   (Poster VOR Upload gebaut, als YouTube-Custom-Thumbnail gesetzt via youtube_upload.py --thumbnail),
>   getestet (videoPoster.test.ts, 164 Tests gruen), code-reviewed (stderr-Fix). Pilot kurFCoj0ebs
>   nachgezogen.
> - **Backlog (4 Artikel) komplett live** auf Konto t.uhlir@immo.red (NotebookLM PRO, authuser=3):
>   Heroes via Gemini (Gradient+Hook) erzeugt, Podcast+Video (deutsch, Erklaervideo) produziert,
>   YouTube public + branded Thumbnail, eingebettet, gepusht, Mail, Marker geleert.
>   YouTube: unterhalt=I7j24Rjbt8w / warum-teurer=LF0Nx4l5n0k / relaunch=l_2WlRRXpbY / budget=v0neaQbM23g.
> - **NEUE DAUERREGEL Hook** (Thomas 14.06): Hook muss STANDALONE das Thema tragen (taucht ohne Titel
>   im Netz auf). "wie viel budget?" zu kontextlos -> besser "website: wie viel budget?". In
>   generateHooks (pipeline.ts) + Runbook + Memory [[feedback_bildstil_cinematic_hook_redrabbit]] fix.
>   Die 4 Backlog-Hooks liefen noch mit den kurzen Versionen (vom User so freigegeben). Ab naechster Welle anwenden.
> Offene Folgepunkte unten sind damit erledigt; Datei bleibt als Referenz.


## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## PFLICHT-KONTEN (Grund-Wissen, immer anwenden)
- **NotebookLM + alle Google-Dienste (Gemini etc.) = `t.uhlir@immo.red`.** IMMER. Im Konto-Switcher (oben rechts) umschalten, auch wenn ein anderes Konto aktiv ist. NICHT `thomas.uhlir@gmail.com`. (Pilot 14.06 lief versehentlich unter thomas.uhlir@gmail.com — User: "diesmal ok, danach nicht mehr".)
- **YouTube = Kanal "Red Rabbit Lab" (@redrabbitlab)**, Upload laeuft technisch ueber OAuth-Token `~/.config/redrabbit-youtube/token.json` (kontounabhaengig vom Browser; Ziel-Kanal 14.06 via channels.list verifiziert = UC6hInJDtZeD8YSOwuvV60yA).
- Runbooks (immer abrufen): `content-engine/knowledge/media-notes.md` (Abschnitt "RUNBOOK Podcast + Video" + "KONTEN"), `.agent/workflows/bilder-gemini-browser.md`, Repo-`CLAUDE.md` (Abschnitt "Content-Engine: Bild- & Medien-Produktion"). Memory: [[reference_redrabbit_media_produktion_runbook]], [[feedback_lange_renders_15min_check]].

## Stand dieser Session (14.06)
### Erledigt + verifiziert
- Heutiger Artikel **zu-welchen-zeitpunkten-muss-die-website-bezahlt-werden** ist KOMPLETT live:
  - 5 Bilder via Gemini/SVG (Hero mit Tuerkis→Blau-Verlauf + Hook "website gleich zahlen?", Infografik aus echtem 6.000-€-Beispiel, 3 Kontextfotos).
  - Podcast + Video via NotebookLM (deutsch) erzeugt, **YouTube public: https://youtu.be/kurFCoj0ebs** (@redrabbitlab, KI-gekennzeichnet), Video self-hosted (`public/videos/<slug>-video.mp4` + poster.jpg), beide eingebettet (`<SimpleAudioPlayer>` + `<VideoEmbed>`). Commit `501f9c0`, gepusht.
- **BUG gefixt:** `scripts/content-engine/media/mdxMedia.ts` `insertAfterH1` gab MDX UNVERAENDERT zurueck wenn keine Body-H1 da ist (unsere Artikel rendern den Titel aus Frontmatter → es gibt NIE eine Body-H1) → jeder Podcast/Video-Embed wurde still verschluckt. Jetzt Fallback: einfuegen direkt nach dem Frontmatter-Block. Tests gruen (mdxMedia 8/8). Pilot nachtraeglich eingebettet.
- Codex-Modell-Fix: `gpt-5.4` ist tot (ChatGPT-Konten) → `gpt-5.5` in `image.ts`. Bild-Policy: **Gemini-Browser primaer, Codex Fallback**. Hook-Schablonen-Satz ("In meiner taeglichen Arbeit als Strategie-Berater…") aus house.md/writer.md verbannt. Hook-Email-Feature: Engine schlaegt 3 Hooks in der Freigabe-Mail vor (frontmatter `hookCandidates`).

### Offen / Naechste konkrete Schritte
1. **BACKLOG Medien-Produktion (4 Artikel, Marker in `content-engine/.media-requests/`)** — auf Konto **t.uhlir@immo.red**:
   - `warum-sind-manche-webdesign-agenturen-deutlich-teurer-als-andere`
   - `was-kostet-ein-professioneller-website-relaunch`
   - `wie-viel-budget-muss-fuer-ein-neues-web-projekt`
   - `wie-viel-kostet-eine-website-im-unterhalt`
   Pro Artikel: **(a)** Erst pruefen welche Bilder fehlen — User sagt bei 3 davon (Warum-teurer, Relaunch, Budget) fehlen BILDER; bei "Was kostet eine Website im Unterhalt" fehlen Video+Podcast. `ls public/images/blog/<slug>*` + `grep '!\[' content/blog/<slug>.mdx`; fehlende Hero/Infografik/Kontext via Gemini (Runbook) nachziehen. **(b)** Podcast+Video via NotebookLM (deutsch, 1 neues Notebook/Artikel). **(c)** `npx tsx scripts/content-engine/media/run-media.ts --slug <slug> --podcast <mp3> --video <mp4> --no-images --video-title "<Artikel-Titel>" --podcast-title "<...> (Podcast)"`. **WICHTIG:** `--no-images` IMMER (sonst ueberschreibt Codex/images-only die Gemini-Bilder). Podcast-Download ist `.m4a` → vorher `ffmpeg -i in.m4a -codec:a libmp3lame -q:a 2 out.mp3`. 15-Min-Check waehrend Render.
2. **NEUES FEATURE: Video-Poster/Thumbnail neu (User-Wunsch 14.06)** — der jetzige Poster ist das erste NotebookLM-Frame (zeigt gross "NotebookLM" / "Launch ist erst der Anfang"). Soll weg. Stattdessen:
   - Basis = das **Hero-Bild des Artikels** (Gradient + Hook), aber **leicht ANGEPASST**, damit es NICHT wie ein 3. Hero-Duplikat wirkt — User: "Bilder sollen im Artikel nur EINMAL vorkommen, auch das Hero". Also der Poster ist eine eigene, abgewandelte Variante, nicht 1:1 das Hero.
   - **Red-Rabbit-Logo oben rechts** drauf (Asset: `public/images/logo.png`, alt: `logo.webp`/`logo-alt.webp`).
   - **YouTube-Play-Button GROSS mittig** drueber.
   - Das wird der YouTube-Thumbnail UND der self-hosted Video-Poster. Hook = der Artikel-Hook.
   - Umsetzen in `run-media.ts`: den ffmpeg-Frame-Schritt (Zeile ~143-149) ersetzen durch ein sharp-Composite (Hero-PNG + Logo top-right + Play-Kreis mittig → poster.jpg). Zusaetzlich YouTube-Custom-Thumbnail setzen: `youtube_upload.py` um `thumbnails().set()` (YouTube Data API) erweitern und das gleiche Bild hochladen.
   - **Pilot nachziehen:** denselben neuen Poster + YouTube-Thumbnail fuer `zu-welchen-zeitpunkten-...` / Video `kurFCoj0ebs` nachtraeglich erzeugen+setzen.
   - Constraint pruefen: jedes Bild erscheint im Artikel nur einmal (Hero einmal; Poster ist eigenstaendig, taucht nur im VideoEmbed auf, nicht zusaetzlich inline).

### Blocker / Risiken
- NotebookLM-MCP ist `authenticated:false`/headless → NICHT nutzbar; alles ueber Chrome-Browser. Video-Overview gibt es NUR im Browser (MCP kann nur Audio).
- run-media `uploadToYoutube` ist nicht idempotent → bei erneutem Lauf doppelter YouTube-Upload. Fuer Re-Runs `--no-push`/manuell, oder nur Embed/Poster-Schritt separat.
- Grosse Binaries (Video 47MB/Podcast 20MB) gehen via run-media in den git-Push (public/videos, public/audio) — ist so gewollt (self-hosting), aber Repo waechst.

### Relevante Dateien/Befehle
- `scripts/content-engine/media/run-media.ts` (Orchestrator), `mdxMedia.ts` (Embeds, gefixt), `scripts/content-engine/upload/youtube_upload.py` (+ `youtube_auth.py`), `image.ts`/`images-only.ts` (Bilder), `image/sketchInfographic.ts` (Infografik-SVG).
- Staging vom Pilot: `~/.config/redrabbit-youtube/staging/` (m4a/mp3/mp4) — als Referenz/Format-Vorlage.
- Backlog-Stand: `ls content-engine/.media-requests/` (4 offene Marker).
