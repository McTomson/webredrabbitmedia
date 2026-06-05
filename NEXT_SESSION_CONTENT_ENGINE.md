# NEXT SESSION — Content-Engine (Stand 2026-06-05, Abend)

Lies zuerst: `MEMORY.md` (Abschnitt "Content-Engine 2026-06-05 Abend"), `LESSONS_LEARNED.md`
(2026-06-05 Abend), und `~/.claude/projects/-Users-McTomson/memory/handoff_2026_06_05_content_engine_media.md`.
Arbeitsverzeichnis `~/dev/redrabbit`. Branch `main` (gepusht, aktuell, HEAD `4cd12bc` oder neuer).

## DER GROSSE FORTSCHRITT HEUTE: autonomer Kern + YouTube headless laufen

### 1. Tagesautomatik funktioniert wirklich (PATH-Bug gefixt)
- Ursache der toten Laeufe: launchd-PATH ohne nvm -> `spawnSync claude ENOENT`. Gefixt in
  `scripts/content-engine/trigger/run-daily.sh` (nvm-default-major bin + homebrew in PATH).
- BEWIESEN: Am 13:36 hat die Engine selbst Artikel #53 erzeugt ("Was ist der technologische
  Unterschied zwischen statischer und dynamischer Website?"), gepusht, deployt, Review-Mail
  geschickt. User hat per Mail freigegeben -> `/api/approve` hat `status: published` per
  GitHub-Commit gesetzt (commit `d57b7a8`) + IndexNow. **Komplett ohne Chat/mich.**

### 2. YouTube Data-API Upload ist VOLLSTAENDIG eingerichtet (headless, dauerhaft)
- Konto: **rabbit.red.media@gmail.com** (Kanal-Besitzer; Kanal "Red Rabbit Lab",
  id `UC6hInJDtZeD8YSOwuvV60yA`).
- GCP-Projekt: **blissful-answer-468100-v3** ("n8n workflows"), YouTube Data API v3 aktiviert.
- OAuth Desktop-Client erstellt; Consent-Screen Extern + veroeffentlicht.
- Secrets AUSSERHALB Repo: `~/.config/redrabbit-youtube/client_secret.json` +
  `token.json` (Refresh-Token, Scopes `youtube.upload` + `youtube` = verwalten). NIE committen.
- Skripte: `scripts/content-engine/upload/{youtube_auth.py,youtube_upload.py,youtube_setup.sh,README.md}`.
- BEWIESEN: Wartungsvertrag-Video hochgeladen + auf **public** geschaltet + Beschreibung
  (Umlaute) gefixt: https://youtu.be/f8QS2zGI-K8 . Eingebettet im Artikel via neuer
  `VideoEmbed`-Komponente (mdx-components registriert).
- **Upload-Befehl (headless, repeatable):**
  `python3 scripts/content-engine/upload/youtube_upload.py --file <mp4> --title "..." --description-file <txt> --privacy public --category 27 --tags "..."`
- WICHTIG kuenftig: direkt mit `--privacy public` hochladen (kein Nachschalten noetig).

### 3. Final-Email-Feature live
- `/api/published-notify` (Bearer ADMIN_API_TOKEN) -> Mail mit allen Links (Artikel+Podcast,
  YouTube, Substack). Gebaut, getestet (40/40 vitest), deployt, fuer Wartungsvertrag gesendet.
  Template `buildPublishedEmail` in `lib/reviewEmail.ts`.

## NEUER ABLAUF, den der User WILL (umbauen)
Freigabe beim **Text** (Hook + Artikel), NICHT erst nach den Medien. Danach erzeugt die Engine
selbst Bilder/Podcast/Video, veroeffentlicht (Website + Substack + YouTube), pusht/deployt, und
schickt am Ende nur die **Info-Mail mit Link** (keine zweite Freigabe). Aktuell erzeugt die
Pipeline Medien VOR der Review-Mail, und `/api/approve` setzt nur `status: published`. Das muss
umgebaut werden: Review-Mail genehmigt den Text -> dann Medien-Pipeline + Multi-Channel-Post.

## OFFEN fuer naechste Session
1. **#53-Medienpaket** (User will es): Podcast + Video (NotebookLM, eigenes Notebook), Podcast
   einbetten, Video zu YouTube (direkt public), Substack-Beitrag, Final-Mail. (#53 ist schon als
   Website-Artikel live.)
2. **Substack-Bild + -Audio**: file_upload-Tool blockt lokale Datei -> Web-Upload. Bild/Audio
   muss der User per Drag reinziehen, ODER neuer Weg. Hero liegt unter
   `public/images/blog/<slug>-hero.png`, Podcast unter `public/audio/<slug>-podcast.mp3`.
3. **pmset Selbst-Wecken**: `sudo pmset repeat wakeorpoweron MTWRFSU 09:15:00` (User, sudo).
4. **Approve-Flow auf Text-Stage umbauen** (siehe oben) + Substack/YouTube ins Auto-Posting.
5. **Bild-Stil** der Artikel-Bilder verfeinern (User unzufrieden), dann `images-only.ts`.
6. **Steuer #12 + BFSG #266** (verschoben).

## HARTE TOOL-GRENZEN (nicht erneut dagegenlaufen)
- `file_upload` akzeptiert KEINE lokalen Pfade mehr -> kein Browser-Datei-Upload (Substack
  Audio/Bild, YouTube-Web-Upload). DARUM YouTube nur via Data-API.
- `accounts.google.com` ist fuer Browser-Automatik gesperrt -> Google-Consent muss der User tun.
- Substack-Publish-Klick: haengt auf einem EINGEFRORENEN Tab (Diagnose). Auf FRISCHEM Tab geht
  der Klick-Durchlauf inkl. Tags. Substack hat KEINE API.

## HARTE REGELN
0-Euro ueber Abos. KEIN Gedankenstrich. KEIN KI-Hinweis. **User-sichtbarer Text (Substack,
YouTube-Beschreibung) IMMER mit echten Umlauten ä/ö/ü/ß, NIE ae/oe/ue** (zweimal falsch gemacht).
Oeffentlich posten/hochladen = im Zweifel kurz bestaetigen. Niemals raten, immer testen.
