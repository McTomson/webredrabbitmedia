# Naechste Session — content-engine / Red Rabbit (Stand 2026-06-15, Abend)

## Arbeitsregeln (verbindlich)
- **Lies ZUERST alles Relevante**: diesen Handoff, Repo-`CLAUDE.md`, `~/CLAUDE.md`, `~/.claude/CLAUDE.md`,
  `MEMORY.md` + verlinkte Memory-Files unter `~/.claude/projects/-Users-McTomson/memory/`, sowie die Runbooks
  `content-engine/knowledge/media-notes.md`, `.agent/workflows/bilder-gemini-browser.md`,
  `.agent/workflows/podcast-einbinden.md`, und (NEU) `brand/README.md` bei Marken-/Copy-/Design-Arbeit.
  Nicht loslegen ohne Kontext.
- **NIE raten — immer verifizieren** (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed.
  Gilt verschaerft fuer alles, was live/veroeffentlicht wird oder externe IDs betrifft (YouTube-ID via
  oEmbed gegenpruefen; Clipboard kann zwischen pbcopy und Browser-Paste ueberschrieben werden -> nach
  jedem Embed-Paste VISUELL kontrollieren).
- **Kurz gegenpruefen, was die letzte Session gemacht hat** (Stichproben, Tests, Browser).
- Erst Plan (TodoWrite/TaskCreate), dann ausfuehren. Skills + parallele Sub-Agenten nutzen wo es hilft.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt zu fragen. Grenze: kein
  Botschutz-Umgehen, keine Account-Anlage, **nichts unwiderruflich Destruktives** (Loeschen) ohne OK,
  **Veroeffentlichen im Namen des Users (Substack/YouTube public) -> pro Schritt OK holen.**
- Laufend testen + bei groesseren Schritten review. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Render-Laeufen ALLE ~15 MIN Health-Check. Bricht ein Tool 2-3x -> STOPP + andere Methode.

## PFLICHT-KONTEN
- **NotebookLM + Gemini + alle Google-Dienste = `t.uhlir@immo.red`** (Konto-Switcher authuser=3, NICHT
  thomas.uhlir@gmail.com). YouTube = Kanal "Red Rabbit Lab" (@redrabbitlab) via OAuth-Token
  `~/.config/redrabbit-youtube/token.json`. Substack = `redrabbitlab.substack.com` ("Tom").
- **Tägliche Review-Mail geht an `t.uhlir@immo.red`** (nicht das alte Gmail).

## Stand 15.06 — alles committet + gepusht (main bis `e9a1311`), 168 Tests gruen
### ERLEDIGT + verifiziert
- **DAILY-MAIL-AUSFALL behoben** (`f12d0c4`): GSC-Indexierungs-Check (`getIndexationStatus` in
  `lib/dashboard/google.ts`) hatte KEINEN Timeout und hing 3h+ -> blockierte `run-daily.sh` (Lock
  gehalten) -> kein Artikel, keine Mail. Fix: `withTimeout`+15s-Cap+Fail-safe-Schwelle, portabler
  perl-`pgtimeout`-Wächter in run-daily.sh (420s), Test `google.test.ts`. Heutigen Lauf nachgeholt ->
  Artikel `welche-versteckten-kosten-gibt-es-bei-der-website-erstellung` generiert, von Thomas
  freigegeben + PUBLISHED. Details: Memory `reference_redrabbit_daily_mail_hang_fix`.
- **AUTO-ALERT "jeden Tag ein Signal"** (`3319bb7`, live-getestet): neue Route `app/api/ops-alert/route.ts`
  (Admin, Vercel-SMTP, slug-frei) + `run-daily.sh` `notify()` (dedupt pro Tag). Bei Pipeline-Halt/Fehler/
  Mail-5xx/Token-fehlt kommt jetzt eine "[Red Rabbit Ops] ..."-Status-/Alarm-Mail statt Stille. Verifiziert:
  Test-POST -> HTTP 200, Mail an t.uhlir@immo.red.
- **SUBSTACK-CROSS-POST: 4 Entwuerfe fertig** (Teaser + Link, NICHT Voll-Text — Substack hat kein
  Canonical-Feld, Voll-Text wuerde die eigene Domain kannibalisieren; keine Inline-Bilder, Video+Thumbnail
  reicht). Pro Entwurf: Titel+Untertitel, Rubrik "Red Rabbit Websiten infos", verifiziertes YouTube-Embed,
  2-Absatz-Teaser + Original-Link. Posts: budget 202102439 / relaunch 202103806 / teurer 202104387 /
  unterhalt 202104582. Mechanik+Lessons: Memory `reference_substack_import_und_gemini_download`.
- **NOTEBOOKLM AUTO-CLEANUP als Regel** in `content-engine/knowledge/media-notes.md`: pro Artikel angelegtes
  Notebook nach bestaetigtem Download+Embed+Commit via MCP `remove_notebook` loeschen (nur nach Save, nie blind).

### OFFEN / NAECHSTE SCHRITTE
1. **Substack: die 4 Entwuerfe reviewen + veroeffentlichen** — bewusst Thomas ueberlassen (Publish in seinem
   Namen). Optional: Podcast-mp3 als Substack-Audio nachladen (separate Funktion, nicht im Teaser). Alten
   leeren "Untitled"-Testentwurf (202031517) ggf. loeschen (nicht autonom gemacht).
2. **MEDIEN fuer neuen Artikel** `welche-versteckten-kosten-gibt-es-bei-der-website-erstellung`: ist published,
   hat Medien-Marker in `content-engine/.media-requests/` -> Podcast+Video (NotebookLM, deutsch) + Bilder
   (Hero+Infografik+3 Kontext, Gemini) produzieren wie die 4 Backlog-Artikel. Runbook: media-notes.md +
   bilder-gemini-browser.md. Beim Lauf die NEUE NotebookLM-Auto-Cleanup-Regel anwenden.
3. **Optional**: Bestands-NotebookLM-Notebooks aufraeumen — erst `list_notebooks` zeigen, dann Thomas OK holen
   (Loeschen endgueltig). KI-Floskel-Einstieg steckt noch in 3 Nicht-Backlog-Artikeln (website-wartungsvertrag-
   sinnvoll, website-selbst-erstellen-vs-agentur, warum-ist-eine-website-mit-dem-tag-des-live).

### NICHT ANFASSEN (parallele Workstreams, uncommitted im Tree)
- `brand/` (Brand Second-Brain), `app/dashboard/seo-monitor/`, `content-engine/seo-monitor/`,
  `lib/dashboard/seoMonitor.ts`, `docs/seo-monitor-log.md`, Aenderungen in `CLAUDE.md` + `DashboardTabs.tsx`
  gehoeren anderen Sessions/Codex. Nicht committen, nicht reverten.

### Relevante Dateien/Befehle
- `scripts/content-engine/trigger/run-daily.sh` (Daily-Orchestrator + pgtimeout + notify),
  `lib/dashboard/google.ts` (withTimeout/getIndexationStatus), `app/api/ops-alert/route.ts`,
  `app/api/review-notify/route.ts`, `scripts/content-engine/media/run-media.ts` + `videoPoster.ts`.
- Daily manuell nachholen: `bash scripts/content-engine/trigger/run-daily.sh` (idempotent via Tagesstempel
  `scripts/content-engine/.work/last-run-$(date +%F)`; Logs `.work/daily-$(date +%F).log`).
- YT-ID pruefen: `curl -s "https://www.youtube.com/oembed?url=https://youtu.be/<id>&format=json"`.
- Tests: `npx vitest run` (168 gruen). Graph: `graphify update . --no-cluster --force`.
