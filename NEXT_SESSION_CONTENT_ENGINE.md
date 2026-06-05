# NEXT SESSION — Content-Engine (Stand 2026-06-05, Spaet-Abend)

Lies zuerst: `MEMORY.md`, `LESSONS_LEARNED.md`, und
`~/.claude/projects/-Users-McTomson/memory/handoff_2026_06_05_content_engine_media.md`.
Arbeitsverzeichnis `~/dev/redrabbit`, Branch `main` (gepusht).

## DER FESTE ABLAUF (so ist er entschieden, nicht neu hinterfragen)

Taeglich automatisch:
1. Naechste der 365 Fragen nehmen (Queue), Artikel schreiben (4-Rollen-Pipeline, mit Bildern).
2. **Mail 1 an Thomas: nur der Text.** Er liest, klickt "Genehmigen".
3. Freigabe (`/api/approve`) setzt `status: published` UND legt still einen Medien-Marker
   `content-engine/.media-requests/<slug>.json` an (KEINE zweite Mail, das war frueher Mail 2,
   vom User ausdruecklich gestrichen, er will die Auto-Loesung).
4. Eine Medien-Sitzung (Browser noetig) erkennt den Marker und macht: NotebookLM neues Notebook,
   Artikel-URL als Quelle, Podcast (Audio) + Video (Erklaervideo, Klassisch, Deutsch) erzeugen,
   herunterladen, Podcast auf die Website einbetten, Video direkt PUBLIC auf YouTube, Video in den
   Artikel einbetten, Substack-Beitrag mit eingebettetem YouTube-Video + Backlink, alles pushen.
5. **Mail 2 (Schluss) an Thomas: fertig + alle Links** (`/api/published-notify`).

## WAS HEUTE GEBAUT + BEWIESEN WURDE (05.06 Spaet-Abend)

- **2-Mail-Flow live deployt:** `/api/approve` legt jetzt bei Freigabe den Medien-Marker an
  (ghPut, sha optional fuer neue Datei). Mail-2-Idee (Zwischen-Mail) wurde gebaut und wieder
  ENTFERNT (media-notify-Route + buildMediaStartedEmail geloescht), weil der User den schlanken
  2-Mail-Ablauf bevorzugt. `/api/media-trigger` (signierter Marker-Link) bleibt als manueller
  Fallback. Token-Typ `media` in approvalToken ergaenzt.
- **Voll-Auto-Kette END-TO-END bewiesen** mit Artikel #105
  (`wie-veraendern-ki-technologien-die-erstellung-von-modernen-websites`): Pipeline -> push ->
  Review-Mail -> User-Freigabe -> `status: published` (`f282aca`) -> Marker automatisch angelegt
  (`f8b453f`). Genau der gewuenschte Trigger.
- **Medien-Orchestrator** `scripts/content-engine/media/run-media.ts` (npm `media`): erledigt den
  deterministischen Teil NACH den NotebookLM-Downloads: Podcast kopieren+einbetten, Video PUBLIC
  zu YouTube (Python-Uploader), Video einbetten, commit+push, Schluss-Mail, Marker loeschen.
  Reine Helfer `mdxMedia.ts` (embedPodcast/embedVideo/parseYoutubeId) + Tests (8). npm
  `media:pending` listet offene Marker (`pending.ts`).
- **YouTube-Uploader startklar verifiziert** (Token refresht, Scopes upload+youtube). Kuenftig
  immer `--privacy public`.
- **Wartungsvertrag-Irritation geloest:** YouTube-Video in den bestehenden Substack-Beitrag
  eingebettet (Paste auf LEERER Zeile bettet ein, Paste ueber Auswahl macht nur Link). Beitrag
  aktualisiert (kein erneuter Newsletter bei Update eines veroeffentlichten Posts).

## HARTE GRENZEN (Tools, nicht umgehbar)

- NotebookLM-MCP ist NICHT fuer Red Rabbit eingerichtet (authenticated:false, fremdes Notebook).
  Podcast+Video laufen ueber den eingeloggten BROWSER (t.uhlir, authuser=3), nicht headless.
- Chrome-MCP ist kein konfigurierter MCP-Server -> headless `claude -p` kann Substack/NotebookLM
  NICHT steuern. Der Medien-Schritt braucht eine echte Sitzung (Browser). Darum: Text voll-auto,
  Medien in einer Sitzung (Spur 2 der Spec: "Claude-geplanter Task, laeuft wenn Mac an").
- `file_upload`-Tool nimmt keine lokalen Pfade -> kein Datei-Upload ins Browser-Feld (YouTube
  daher nur Data-API; Substack-Audio nicht moeglich, darum YouTube-Einbettung als Standard).
- Substack hat keine API. NotebookLM-Video ~40 Min, Web-UI-only.

## OFFEN / NAECHSTE HEBEL

- Recurring Medien-Trigger haerten: ein taeglicher Claude-Task (Cron) der Marker abarbeitet
  (Browser-Zugang in Cron-Sitzung verifizieren, bevor man sich darauf verlaesst).
- `sudo pmset repeat wakeorpoweron MTWRFSU 09:15:00` (Selbst-Wecken, User/sudo).
- Bild-Stil verfeinern (User unzufrieden), dann `images-only.ts`.
- Steuer #12 + BFSG #266 (verschoben).

## HARTE REGELN
0-Euro ueber Abos. KEIN Gedankenstrich. KEIN KI-Hinweis. User-sichtbarer Text IMMER echte Umlaute
(ä/ö/ü/ß). Oeffentlich posten = im Ergebnis kurz benennen. Niemals raten, immer testen. Voller
Browser-Zugang ist erteilt, nicht jedes Mal nachfragen.
