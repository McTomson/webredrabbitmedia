# Naechste Session — Relaunch-Unterseiten (16.07.2026)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## Stand dieser Session

### Erledigt + verifiziert (Commit 8d6ff82 auf Branch `relaunch`, LOKAL, nicht gepusht)
- **/relaunch-preview/ueber-uns FERTIG + von Thomas abgenommen.** 5 Root Causes gefixt
  (KANONISCH dokumentiert in Memory `reference_ueber_uns_template_rezept` + docs/SKULPTUREN_REUSE.md):
  1. Demo-Kopf `#headSvg` war nie versteckt (Doppel-Renderer), 2. `fs.readFileSync` auf
  Modulebene = stale Dev-Server, 3. stage.ts-`o`-Feld ignoriert (8 Phantom-Teile; Filter
  `hold.o<=0.001` -> 167/175, maschinell bewiesen 0.08px Median), 4. kein Scroll-Lerp
  (MorphSculpture lerpt jetzt selbst 0.09/Frame), 5. Reveal-am-Slot-Teile (entryT==arriveT)
  sprangen fix ins Bild -> synthetisches Flugfenster e2=ip/dur.
- **/relaunch-preview/kontakt NEU gebaut** (Template-Kopie `components/subpages/kontakt-demo/`
  + `KontaktDemoClient` + MorphSculpture comp={1} Gluehbirne): Hook "Was passiert, wenn du
  auf Absenden drueckst?" (Aufloesung erst unten), "(Keine Sorge)"-Statements, blaues
  Typing-Grid "(Was hier nicht passiert)" (13x "Kein ..."), FAQ "Bevor du drueckst.",
  Formular -> POST /api/contact (Payload wie KontaktForm.tsx, Honeypot `website`),
  Mail/Tel-Zeile, kein Adress-Block (Grill-Entscheide Thomas 15.07.).
- **Mobil (beide Template-Seiten):** 100dvh statt 100vh (Titel lag hinter Mobile-URL-Leiste),
  Engine fittet Titel <768px exakt auf 96vw (generisch je Wort), VIS mobil 0.8,
  fonts.ready-Nachmessung. **Malen am Handy:** passive touchmove-Listener (malen WAEHREND
  scrollen) + Auto-Paint-Loop alle 9s solange oben. `const COMP5` in die IIFE verschoben
  (Soft-Nav-Kollisionsschutz, Review-Fund).
- **/relaunch-preview/tipps + /tipps/[slug] REDESIGN-PREVIEW** (rrt-*-scoped CSS,
  `components/subpages/tipps-preview.css`): Register-Index (nummerierte Reihen nach
  6 Themen, Serif-Lead "(Neu)") + Artikel-Template (Schnellantwort-Kasten, Crimson-Lesetext,
  nummerierte H2s, Navy-Takeaways, Stats, FAQ, Quellen, Weiterlesen). Rendert echte
  MDX-Artikel mit `components:{}` (bewusst OHNE altes Tailwind-Mapping).
  Beispiel: /relaunch-preview/tipps/was-kostet-eine-website. **WARTET AUF THOMAS-REVIEW.**
- **/faq:** FAQPage-JSON-LD ergaenzt (14 Fragen, im HTML verifiziert). Seite existierte schon.
- **Rechtliches:** existiert komplett (impressum/datenschutz/agb/cookie-einstellungen, live).
  Red Rabbit GmbH, Grabnergasse 8/8, FN 516936a — NICHT mit immo.red verwechseln (andere GmbH).
- **Footer beider Template-Seiten:** alle #-Platzhalter verdrahtet (Nav, 9 Regionen,
  Rechtliches, Social); ueber-uns bCta -> kontakt, pCta -> referenzen.
- Vercel-Preview-Deploys laufen (`vercel deploy --yes`, NIE --prod). Letzter Stand:
  https://webredrabbitmedia-95z5qgbei-toms-projects-17d37f0b.vercel.app
  Deployment Protection AN -> Thomas loggt sich am Handy ein ODER lockert selbst
  (Settings -> Deployment Protection). `.vercelignore` enthaelt graphify-out (108MB-Falle!).
- 168 Tests gruen, tsc gruen.

### Offen / UNKLAR
- **Tipps-Review durch Thomas** (Design-Richtung Register-Index ok? Hero-Spruch?).
  Bei Gefallen: echtes /tipps ersetzen (SEO-Metadata/JSON-LD der Live-Seite uebernehmen,
  generateStaticParams, Podcast/Video/CTA-Embeds einzelner Artikel im neuen Stil mappen).
- **Kontakt-Abnahme am Handy** durch Thomas (Malen + Formular echt testen).
- **Preise-Seite:** Thomas-Entscheidung HORIZONTAL (Ref rabenrifaie.com, Memory
  `project_redrabbit_preisseite_horizontal`) vs. vertikal im Template. Brief liegt:
  brand/PREISE_SEITE_BRIEF.md. Skulptur-Kandidat comp3 (Chart).
- **Leistungsseiten:** comp0 Zahnraeder (Webdesign), comp2 Dokument (Content) frei.
- Parallel-Session Referenzen (Hasen-Lauf) laeuft separat — deren Dateien NICHT anfassen.
- Uncommitted Reste fremder Straenge (DESIGN.md, Footer/Header/HomeMorph, brand/*,
  preise-preview, subpage-hero-test, QA-PNGs im Root) bewusst NICHT committet.

### Naechste konkrete Schritte
1. Thomas' Feedback zu Tipps + Kontakt einsammeln, Punkte fixen.
2. Danach Preise-Seite (erst Grill: horizontal/vertikal, Pakete, Zahlen).
3. Bei Abnahme: /tipps live umziehen; irgendwann Branch pushen (nur auf Thomas' Ansage).

### Blocker / Risiken
- Dev-Server auf :9000 haengt sich gelegentlich auf (curl-Timeout als Test; Neustart:
  `kill <pid>; nohup npm run dev -- --port 9000 > /tmp/redrabbit-dev.log 2>&1 &`).
- QA-Fallen: MCP-Hintergrund-Tab pausiert rAF (Tab per osascript aktivieren!);
  Chrome merkt sich Zoom pro Origin (localhost:9000 stand auf 67% -> innerWidth luegt);
  demo.*-Dateien werden pro Request gelesen (Fix ist drin), aber Engine-Aenderungen
  brauchen Reload.

### Relevante Dateien/Befehle
- Template-Rezept: docs/SKULPTUREN_REUSE.md, docs/UNTERSEITEN_STIL.md,
  Memory `reference_ueber_uns_template_rezept` (KANONISCH).
- Seiten: app/relaunch-preview/{ueber-uns,kontakt,tipps}/, components/subpages/
  {ueber-uns-demo,kontakt-demo}/, MorphSculpture.tsx, *DemoClient.tsx, tipps-preview.css.
- QA: /sculpture-test?comp=0..4 (Slider/window.__sculptProgress).
- Deploy: `cd ~/dev/redrabbit && vercel deploy --yes` (Preview; NIE --prod ohne Thomas).
