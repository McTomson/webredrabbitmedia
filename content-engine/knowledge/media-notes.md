# media-notes.md — verbindliche Regeln fuer Spur 2 (Podcast/Video), Phase 4

## Konten (Thomas ist in Chrome eingeloggt, Stand 2026-06-04)
- Substack: https://redrabbitlab.substack.com/
- NotebookLM: https://notebooklm.google.com/
- YouTube: https://www.youtube.com/@RedRabbitLab
- **Zwei-Stufen-Auth-Modell:** (1) JETZT/Demo + Ersteinrichtung ueber die bestehende
  Chrome-Session moeglich (kein Passwort noetig, solange Chrome laeuft). (2) Fuer Dauer-
  Autonomie (Lauf ohne Thomas am Rechner): persistente Auth aus diesen Sessions ableiten
  (NotebookLM-MCP-Cookies via setup_auth, YouTube Data API OAuth-Refresh-Token). Browser-
  Session = jetzt, Tokens/Cookies = dauerhaft.


## NotebookLM (KRITISCH)
- **Pro Artikel ein NEUES Notebook erstellen.** Niemals mehrere Artikel im selben Notebook
  mischen. Sonst vermischen sich Quellen/Infos und der Podcast/Video-Inhalt wird verfaelscht
  (Halluzination ueber Artikelgrenzen hinweg). Regel von Thomas, 2026-06-03.
- Ablauf je Artikel: neues Notebook -> NUR den einen Artikel-Entwurfstext als Source ->
  Audio Overview (deutsch) + Video Overview generieren -> downloaden -> Notebook kann danach
  archiviert/geloescht werden. (`scripts/content-engine/media/notebooklm_cli.py` muss das
  pro Lauf frisch anlegen, kein Wiederverwenden.)
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
