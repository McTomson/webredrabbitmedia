# Naechste Session — Content-Engine Medien-Automatik (Video headless + Trigger-Verdrahtung) — 2026-06-19

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, `content-engine/knowledge/media-notes.md`, CLAUDE.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## Repo / Umgebung (KRITISCH)
- Arbeits-Repo = **Bot-Worktree `~/dev/redrabbit-daily`** (immer `main`). NIE `~/dev/redrabbit` (geteilter Mensch-Checkout, oft Feature-Branch → launchd-Jobs sehen main-Marker nicht). Symlinks nicht loeschen.
- Vercel deployt automatisch nach Push auf main. Live = `https://web.redrabbit.media`, Artikel unter `/tipps/<slug>`.
- launchd-Bot-Jobs: `com.redrabbit.contentengine` (Tagesartikel+Review-Mail), `com.redrabbit.mediachecker` (alle 30 Min, Marker→Medien), `com.redrabbit.reminder`. Trigger-Scripts in `scripts/content-engine/trigger/`, self-locating + `git merge --ff-only origin/main`.
- **Konten:** NotebookLM + Gemini = `t.uhlir@immo.red` (authuser=3, Workspace "RED Real Estates Development GmbH"). YouTube-Upload via OAuth-Token `~/.config/redrabbit-youtube/token.json` (Kanal @RedRabbitLab, browserunabhaengig). Substack = redrabbitlab.substack.com.

## Stand dieser Session (alles live + verifiziert, ausser markiert)
Artikel `wie-sieht-der-genaue-ablauf-bei-der-erstellung-einer` ist **medien-komplett live**: Hero+Hook, 3 Kontextbilder, Infografik, **Podcast** (headless), **Video** (YouTube public `youtu.be/CAt7KLTSGX4`, klickbares Marken-Poster→Video, Artikel-Link in Beschreibung, VideoEmbed). **Substack-Draft** liegt fertig (Rubrik "Red Rabbit Websiten infos", Teaser, Artikel-+Video-Link) — Thomas gibt frei. Commits dieser Session: `2cbf5c0` (Podcast-Automatik) … `f70ed85`.

### Was schon HEADLESS automatisch laeuft
- **Podcast:** `scripts/content-engine/media/generate-podcast.sh <slug>` (Pool leerer Notebooks `content-engine/knowledge/podcast-notebook-pool.json` → NotebookLM-MCP add_source(url)/generate_audio/poll-via-download → `PODCAST_FILE=…`). In `run-media-check.sh` verdrahtet (Marker→Podcast→`run-media`→einbetten/push/Mail/Marker; Fallback=Notification). Pool aktuell **2 freie Notebooks**.
- **`run-media.ts`** (deterministischer Tail): Flags `--podcast <mp3/m4a>` `--video <mp4>` `--no-images` `--no-push` `--no-mail` `--video-title` `--podcast-title`. Branded-Poster aus Hero `public/images/blog/<slug>.png`, YouTube public + Artikel-Link, VideoEmbed, Cluster-Links, commit+push, Schluss-Mail, **loescht Marker**.

### Video ist JETZT headless-faehig (Kern-Durchbruch heute)
- Werkzeug: **`notebooklm-py` CLI** (`~/.local/bin/notebooklm`), installiert (`pip install --user "notebooklm-py[browser]" rookiepy` + `python3 -m playwright install chromium`). **Auth bereits erledigt** (`notebooklm login` als t.uhlir@immo.red → `~/.notebooklm/profiles/default/storage_state.json`). GETRENNT von der Podcast-MCP. Bei Cookie-Ablauf: `notebooklm login` erneut (Thomas meldet sich im Chromium-Fenster an — Agent darf keine Google-Credentials eingeben).
- **WICHTIGSTE LEKTION (empirisch bewiesen 19.06):** Video-Generierung **SCHEITERT mit URL-Crawl-Quelle** (`GENERATION_FAILED`, 2x), **GELINGT mit Volltext-Paste**. Audio kommt mit URL klar, Video NICHT. → IMMER Volltext.
- **Cinematic (Veo 3) = Ultra-gated** → auf PRO nur `--format explainer`.
- Headless-Ablauf (auch in `media-notes.md`):
  ```
  notebooklm create "<titel>" --json                                  # neue Notebook-id
  notebooklm source add "$(cat /tmp/body.txt)" --type text -n <id>     # VOLLTEXT (Frontmatter+Bild/Player-Zeilen strippen)
  notebooklm generate video -n <id> --format explainer --style auto --language de --wait --timeout 1800 --json
  notebooklm download video <out.mp4> -n <id>                          # Pfad POSITIONAL, nicht --output!
  tsx scripts/content-engine/media/run-media.ts --slug <slug> --video <out.mp4> --video-title "<title>" --no-images
  notebooklm delete -n <id> -y                                         # Notebook nach Integritaetspruefung loeschen
  ```
- `notebooklm use <id>` dann `notebooklm artifact list` zeigt Status (completed/failed). Status/`get_audio_status` luegt teils → ein erfolgreicher Download ist die Wahrheit.

## Naechste konkrete Schritte (DAS hier bauen + QA)
1. **`scripts/content-engine/media/generate-video.sh <slug>`** bauen — analog `generate-podcast.sh`:
   - Body sauber (gray-matter: Frontmatter raus, `![..]`-Zeilen + `SimpleAudioPlayer`/`VideoEmbed` raus, Titel voranstellen) → Volltext.
   - `create` → `source add --type text` → `generate video --format explainer --language de --wait` → `download video <out> -n` → druckt `VIDEO_FILE=<pfad>`.
   - Notebook am Ende `notebooklm delete -n <id> -y` (Auto-Cleanup; NUR nach Integritaetspruefung: mp4 nicht leer/trunkiert via `du -m`/`file`).
   - Hart: `export PATH="$HOME/.local/bin:$PATH"`, `DISABLE_AUTOUPDATER=1`, grosszuegiges Timeout, fail-closed (kein leeres mp4 weiterreichen).
2. **`run-media-check.sh`** erweitern: nach Podcast-Block `generate-video.sh` aufrufen, dann `run-media --podcast <m4a> --video <mp4> --no-images` in EINEM Lauf (sonst doppelter commit/push/Mail). Bei Video-Fehler NICHT abbrechen → Podcast trotzdem publizieren, Video-Fehler nur loggen/Notification. Fallback-Notification erhalten.
3. **QA + `/review-it`:**
   - `bash -n` beider Scripts; tsc/build wo sinnvoll.
   - **End-to-end an einem ECHTEN Artikel** (naechster Tagesartikel ODER Test-Slug) bis Podcast UND Video nachweislich live: curl HTTP 200 auf mp3+mp4, VideoEmbed im MDX, YouTube-URL erreichbar, Artikel-Link in `…-yt-desc.txt`. Nicht "sieht gut aus" — verifizieren.
   - `/review-it` ueber die neuen Scripts + run-media-check-Aenderung (Logic/Security/Simplify), Findings abarbeiten.
   - Parallel-Agenten fuer unabhaengige Checks (ein Agent Trigger-Logik, einer generate-video-Robustheit).
4. **Empfehlung Vereinheitlichung:** Podcast von MCP-Pool auf `notebooklm-py`-CLI umstellen (`generate audio` + `download audio`) → dann braucht NICHTS mehr einen Pool; pro Artikel EIN Notebook fuer Audio+Video, danach loeschen. Eliminiert das Pool-Nachfuellen und vereinheitlicht alles auf die CLI. (Falls beibehalten: Pool bei <2 frei im Browser nachfuellen.)

## Danach (separater Schritt — unattended Bilder + Substack)
- **Gemini-Bilder unattended:** aktuell interaktiver Browser (claude-in-chrome, Clipboard-Extraktion). Fuer launchd-unattended `agent-browser` (CDP zur eingeloggten Chrome) — fragil. Baustein da: `scripts/content-engine/media/apply-images-browser.ts` (Staging `…-staging/{hero,ctx1,ctx2,ctx3}.png` + gecachter `plan.json` → Infografik rendern + einbetten). Gemini-Lessons: NEUER CHAT pro Bild (Folge-Prompts haengen), Bild erst ~40s nach Titel als full-res `<img>` im DOM, Hero MUSS `<slug>.png` ohne Version (run-media/videoPoster), Heading ä↔ae fixen (Art-Director liefert ASCII), Hook nur im EINEN Prompt, cremeweiss bei Tuerkis-Verlauf. Prompts kommen aus `buildImagePlan` (image.ts) → HERO_PHOTO_STYLE (Verlauf rotiert) + BRAND_PHOTO_STYLE.
- **Substack unattended:** keine API → `agent-browser`. Editor `https://redrabbitlab.substack.com/publish/post?type=newsletter`, **Rubrik PFLICHT** ("Red Rabbit Websiten infos"), nur Teaser+Weiterlesen-Link (canonical-Schutz), Snippet via `tsx scripts/content-engine/media/distribution.ts --slug <slug>`. Felder EINZELN klicken (Untertitel-Klick verfehlt sonst → Text landet im Titel). NUR Draft, Thomas publisht.

## Blocker / Risiken
- NotebookLM-Video kann Google-seitig zeitweise `failed` liefern (Last) — Retry; PRIMAER aber Volltext-Quelle pruefen.
- claude-in-chrome-Tab: Downloads SANDBOXED → Bilder via Clipboard, Video/Audio via CLI/MCP (server-seitig). Nie grosse Dateien ueber den Tab laden.
- Auth-Ablauf notebooklm-py → `notebooklm login` (braucht Thomas). MCP-Auth getrennt.
- run-media `git add` nur content/blog/*.mdx + public/{audio,images,videos} → eigene Script-Aenderungen separat committen.

## Relevante Dateien/Befehle
- Scripts: `scripts/content-engine/media/{generate-podcast.sh, apply-images-browser.ts, run-media.ts, videoPoster.ts, mdxMedia.ts, distribution.ts}`, `scripts/content-engine/trigger/run-media-check.sh`, `scripts/content-engine/{image.ts, images-only.ts}`, `scripts/content-engine/upload/youtube_upload.py`.
- Doku: `content-engine/knowledge/media-notes.md` (KANON, zuerst lesen), `CLAUDE.md`, `.agent/workflows/bilder-gemini-browser.md`.
- Memory: `reference_redrabbit_video_ursache_und_ablauf.md`, `reference_redrabbit_podcast_headless_auto.md`, `feedback_notebooklm_immer_immo_red.md`.
- CLI: `export PATH="$HOME/.local/bin:$PATH"; notebooklm --help` (create, source add, generate video|audio, download video|audio, artifact list, delete, list, use).
