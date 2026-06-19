# media-notes.md — verbindliche Regeln fuer Spur 2 (Podcast/Video), Phase 4

## BILDER (Entscheidung Thomas 2026-06-14): Gemini-Browser PRIMAER, Codex Fallback
Artikel-Bilder werden **primaer ueber Gemini im Browser** (Nano Banana, gratis, eingeloggtes
Konto) in einer Claude+Chrome-Session erzeugt. Codex (`images-only.ts`) ist nur noch Fallback.
Hero PFLICHT mit **Tuerkis->Blau-Farbverlauf** (horizontal, harmonisch) + handschriftlichem
**Hook-Text** (cremeweiss, Negativraum). Genaue Prompts + Ablauf:
`.agent/workflows/bilder-gemini-browser.md`. Cron bleibt Text-only; Bilder nach Freigabe in Session.

## Konten (Thomas ist in Chrome eingeloggt, Stand 2026-06-04)
- Substack: https://redrabbitlab.substack.com/
- NotebookLM: https://notebooklm.google.com/
- YouTube: https://www.youtube.com/@RedRabbitLab
- **Zwei-Stufen-Auth-Modell:** (1) JETZT/Demo + Ersteinrichtung ueber die bestehende
  Chrome-Session moeglich (kein Passwort noetig, solange Chrome laeuft). (2) Fuer Dauer-
  Autonomie (Lauf ohne Thomas am Rechner): persistente Auth aus diesen Sessions ableiten
  (NotebookLM-MCP-Cookies via setup_auth, YouTube Data API OAuth-Refresh-Token). Browser-
  Session = jetzt, Tokens/Cookies = dauerhaft.


## KONTEN (PFLICHT, Grund-Wissen, Thomas 14.06)
- **NotebookLM + alle Google-Dienste (Gemini etc.) = `t.uhlir@immo.red`.** IMMER. Auch wenn im
  Browser ein anderes Google-Konto aktiv ist, vor der Arbeit auf t.uhlir@immo.red umschalten
  (Konto-Switcher oben rechts). NICHT thomas.uhlir@gmail.com verwenden.
- **YouTube = `medi.redrabbit@gmail.com`** (User-Angabe; technisch laeuft der Upload ueber das
  OAuth-Token in `~/.config/redrabbit-youtube/token.json`, kontounabhaengig vom Browser-Login).
  Kanal @RedRabbitLab. Vor dem ersten Upload den Ziel-Kanal verifizieren (channels.list mine=true),
  Adresse medi.redrabbit vs rabbit.red.media mit User abgleichen.

## RUNBOOK Podcast + Video (IMMER zuerst lesen, nicht neu herleiten)
Ausloeser = **Freigabe** (approve-Route legt `content-engine/.media-requests/<slug>.json` an,
status `requested`). Der Media-Checker verarbeitet nur den Auftrag von HEUTE -> alte Auftraege
bleiben liegen (Backlog moeglich, pruefen mit `ls content-engine/.media-requests/`).
- **PODCAST = JETZT HEADLESS AUTOMATISCH (NEU 2026-06-19).** Der media-checker erzeugt den Podcast
  nach Freigabe selbst, ohne Browser, via `scripts/content-engine/media/generate-podcast.sh`:
  nimmt ein leeres **Pool-Notebook** aus `content-engine/knowledge/podcast-notebook-pool.json`,
  `add_source(url)` -> `generate_audio` -> Download, dann `run-media`. Kein manueller "npm run media"
  mehr. Faellt nur bei Fehler (Pool leer / MCP-Auth weg / Timeout) auf die Browser-Notification zurueck.
  - **WARUM Pool:** die MCP kann headless KEIN Notebook anlegen und KEINE Quellen loeschen. Daher
    leere Notebooks vorab im Browser anlegen (NotebookLM Home -> "Neu erstellen") und mit `used:false`
    in die Pool-JSON eintragen. Bei niedrigem Vorrat nachfuellen (Konto t.uhlir@immo.red).
  - **`get_audio_status` luegt** (meldet `ready` zu frueh) -> nur ein erfolgreicher `download_audio`
    ist die Wahrheit. Render kann >20 Min dauern (21 Min am 19.06 gemessen).
- **VIDEO Overview gibt es weiterhin NUR im Browser** (kein MCP-Tool) -> bleibt manuelle/Browser-Stufe.
  Genauso **Gemini-Hero/Kontextbilder** (Codex-Fallback tot bis ~14.07) und **Substack-Draft**.
- **1 NEUES Notebook pro Artikel** (nie mischen, sonst Halluzination ueber Artikelgrenzen). NUR den
  einen Artikel als Quelle (Text-Paste oder Artikel-URL). Audio + Video Overview **deutsch**.
- Fehlgeschlagene Video-Generierung **haengt** -> frisches Notebook (NotebookLM-"Vergiftung").
- Danach deterministischer Schwanz: `scripts/content-engine/media/run-media.ts --slug <slug>
  --podcast <m4a/mp3> --video <mp4> [--substack <url>]` -> kopiert Podcast + bettet
  `<SimpleAudioPlayer>` ein, laedt Video **oeffentlich auf YouTube** (Python Data-API, venv
  `~/.config/redrabbit-youtube/venv`), bettet `<VideoEmbed>` ein, commit/push, Mail 2, Marker geloescht.
- **YouTube (oeffentlich) + Substack-Draft: AUTOMATISCH durchziehen, NICHT pro Schritt fragen** (Thomas 16.06, Dauerregel). YouTube=public auto, Substack=Draft (Thomas publisht final). Nur bei echtem Fehler/Hang melden.

## NotebookLM (KRITISCH)
- **Pro Artikel ein NEUES Notebook erstellen.** Niemals mehrere Artikel im selben Notebook
  mischen. Sonst vermischen sich Quellen/Infos und der Podcast/Video-Inhalt wird verfaelscht
  (Halluzination ueber Artikelgrenzen hinweg). Regel von Thomas, 2026-06-03.
- Ablauf je Artikel: neues Notebook -> NUR den einen Artikel-Entwurfstext als Source ->
  Audio Overview (deutsch) + Video Overview generieren -> downloaden ->
  **Notebook PFLICHT-LOESCHEN nach erfolgreichem Lauf** (`notebooklm_cli.py` legt pro Lauf frisch
  an, kein Wiederverwenden).
- **AUTO-CLEANUP (Regel Thomas 15.06): jedes pro Artikel angelegte Notebook automatisch wieder
  loeschen, sobald Podcast UND Video heruntergeladen, integritaetsgeprueft, eingebettet und
  committet sind.** Sonst sammeln sich Hunderte Notebooks an. Loeschen via NotebookLM-MCP
  `remove_notebook` (notebook_id aus `add_notebook`/`list_notebooks` merken). SICHERHEIT:
  Loeschen ist ENDGUELTIG -> NUR loeschen wenn die mp3/mp4 nachweislich gespeichert sind (erst
  Integritaetspruefung, dann loeschen); im Zweifel behalten. NIE fremde/aeltere Notebooks
  blind massenloeschen -> bei Bestands-Aufraeumung erst Liste zeigen + Thomas bestaetigen lassen.
- Integritaetspruefung nach Download: Datei nicht leer/trunkiert (Groesse/Dauer/Codec).
- Re-Auth (Cookie-Ablauf) ist ein ERWARTETES Ereignis -> Alarm-Email an Thomas, kein Crash.

## YouTube
- Data API v3 mit OAuth-Refresh-Token (dauerhaft autonom nach Ersteinrichtung).
- Beschreibung mit Backlink auf den Artikel. AI-Kennzeichnung ("altered/synthetic content").
- Quota reicht fuer ~6 Uploads/Tag.

## Substack
- Kein offenes Upload-API -> Browser-Automation mit persistenter Session.
- Audio-URL danach via Proxy einbetten (`/api/audio-proxy?url=...`, siehe
  .agent/workflows/podcast-einbinden.md). Persist-Auth, sparsam, ToS-Risiko dokumentiert.

## Einbettung zurueck in den Artikel
- `<SimpleAudioPlayer src="/api/audio-proxy?url=<substack-mp3>" title="..." />` direkt nach
  dem Frontmatter (vor der ersten H2).
- Fehlt Medien noch: Artikel ohne Medien publizieren (graceful degradation), Email vermerkt
  "Medien ausstehend". Medien werden spaeter nachgereicht + re-deployed.
