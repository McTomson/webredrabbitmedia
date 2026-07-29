# Naechste Session — Kontakt-Seite (30.07.2026)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## Stand dieser Session (29./30.07., Vorsession: /relaunch-preview/ueber-uns)

Diese Session hat NICHT an Kontakt gearbeitet, sondern an `/relaunch-preview/ueber-uns` (siehe
Commit `1b022c5` auf Branch `relaunch`, gepusht). Die Ueber-uns-Fixes sind aber das direkte
Vorbild fuer die Kontakt-Session, weil Kontakt auf demselben Template basiert
([[reference_ueber_uns_template_rezept]], `project_kontakt_seite_template.md`) und denselben
Bug-Pattern teilt.

### Erledigt + verifiziert (Ueber-uns, zum 1:1-Uebertragen auf Kontakt relevant)
1. **Echtes `<h1>` statt `<div role="heading" aria-level="1">`** im Hero-Titel
   (`components/subpages/ueber-uns-demo/demo.body.html`). CSS hat global `*{margin:0}`
   (`demo.css` Zeile ~13), also KEIN visueller Unterschied beim Tag-Swap — sicher uebertragbar.
   **Kontakt hat exakt denselben Bug:** `components/subpages/kontakt-demo/demo.body.html` Zeile 20
   `<div class="hero-title" id="htitle" role="heading" aria-level="1" aria-label="Kontakt">...</div>`
   — noch nicht gefixt.
2. **`alternates.canonical` + Person/FAQPage-JSON-LD** in `app/relaunch-preview/ueber-uns/page.tsx`
   ergaenzt (fehlten komplett, obwohl die ALTE Platzhalter-Seite `app/ueber-uns/page.tsx` schon ein
   Person-Schema + canonical hatte — war eine echte Regression durch den Relaunch-Umbau).
   **Kontakt-Metadata** (`app/relaunch-preview/kontakt/page.tsx`) hat AKTUELL bewusst
   `robots: { index: false, follow: false }` (noindex, macht bei WIP Sinn) und KEIN canonical —
   pruefen, ob/wann das auf indexierbar + eigenes canonical umgestellt werden soll, und ob ein
   FAQPage-Schema fuer die dortige FAQ-Sektion sinnvoll ist (Kontakt hat auch `scene-faq`).
3. **Kundenliste (`scene-partner`) auf Ueber-uns + Hauptseite (`KundenGrid.tsx`) von Rot auf
   Weiss/Off-White umgestellt** (Thomas' expliziter Wunsch, Referenz-Screenshot von der
   Hauptseite), K2 Dach- & Bau (kein echter Kunde) raus, Global Insights (ruderes-insights.at) rein,
   Tipp-Animation schreibt jetzt einen ANDEREN Namen statt denselben zurueck ("durcheinander").
   **WICHTIG — NICHT blind auf Kontakt uebertragen:** Kontakt hat zwar auch eine Section mit
   `id="scenePartner"`/Klasse `scene-partner` (gleicher Demo-Klon, gleicher Tipp-Mechanismus),
   aber mit KOMPLETT ANDEREM Inhalt — kein Kundenliste-Grid, sondern das
   "(Was hier nicht passiert)"-Raster mit Pool `["Kein Verkaufsanruf","Kein Newsletter",...]`
   (siehe `components/subpages/kontakt-demo/demo.engine.jstext` Zeile ~594). Ob dieses Raster
   auch auf Weiss umgestellt werden soll (visuelle Konsistenz) oder bewusst als roter Akzent-Block
   bleibt (anderes Konzept: "das tun wir NICHT" statt "das haben wir bewiesen"), ist eine offene
   Design-Frage fuer Thomas, keine automatische Uebernahme.
4. Toter Link `href="#projekte"` (Ausschnitt-Kundenliste, ohne passendes Anker-Ziel) auf
   `/relaunch-preview/referenzen` korrigiert — Kontakt-Seite hat kein Aequivalent, nicht relevant dort.
5. Scroll-Standard-Rollout (Pflicht-Stopp `data-rr-snap`/`-exempt` direkt an den `<section>`-Tags,
   SITE_LERP=1, siehe `docs/DESIGN_STANDARD.md` § Scroll & Bumper) ist auf Kontakt bereits
   VOLLSTAENDIG durchgezogen (`components/subpages/kontakt-demo/demo.body.html` — alle 5
   Sections haben schon `data-rr-snap`), anders als der halbfertige Zustand, in dem Ueber-uns diese
   Session angetroffen wurde. Hier also nichts offen.

### Separat gefundene, NICHT angefasste Themen (eigene Runden, nicht automatisch mit-erledigen)
- **Dmitry/Pashlov-Referenzen in 12 Dateien projektweit** (u.a. `app/layout.tsx` globales
  Organization/Person-Schema, `components/About.tsx`, mehrere Testimonial-/Referenzen-Komponenten,
  Content-Engine-Pipeline). Thomas 30.07.: Dmitry ist nicht mehr im Team. In Beitraegen/Artikeln
  darf er bleiben (historisch), aber aktive Behauptungen (Tech-Lead-Rolle im Schema, evtl. aktuelle
  Testimonials) sollten geprueft werden. NICHT ungefragt anfassen.
- **"K2 Dach- & Bau" (kein echter Kunde) steht noch in 4 weiteren Dateien:**
  `components/Portfolio.tsx`, `components/subpages/referenzen/ReferenzenLauf.tsx`,
  `lib/relaunch/projects.ts`, `components/subpages/leistungen-figure-demo/demo.engine.jstext`.
  Vermutlich echte Projekt-Eintraege (Case-Study-Text/Bilder), nicht nur ein Name in einer Liste —
  groesserer Eingriff als die Kundenliste-Pools. Mit Thomas abstimmen, bevor geloescht wird.
- **Vier `<title>`-Tags im SSR-HTML** von `/relaunch-preview/ueber-uns` (`<title></title>`,
  2x `<title>Red Rabbit</title>`, dann der echte Titel) — wahrscheinlich ein Next.js
  Metadata-Streaming-Artefakt, noch nicht tief untersucht ob nach Hydration wirklich nur einer im
  DOM landet. Falls Zeit: `curl` gegen `/relaunch-preview/kontakt` gegenchecken, ob dasselbe Muster
  dort auftritt (waere dann ein generisches Next-Verhalten, kein Route-spezifischer Bug).
- **Kontakt-FAQ-Realismus-Check** (analog zur Ueber-uns-FAQ-Kritik dieser Session): noch nicht
  geprueft, ob die Kontakt-FAQ ("Bevor du drueckst.") die Fragen abdeckt, die echte Interessenten
  vor dem Absenden des Formulars wirklich haben (z. B. Reaktionszeit, was nach dem Absenden passiert,
  ob unverbindlich). `project_kontakt_seite_template.md` nennt keine expliziten FAQ-Inhalte —
  im Code nachsehen (`components/subpages/kontakt-demo/demo.body.html` Sektion `scene-faq`).

### Naechste konkrete Schritte
1. `project_kontakt_seite_template.md` (Claude-Memory) + dieses Handoff vollstaendig lesen —
   Kontakt-Seite wartet laut dortiger Notiz seit 15.07. auf Thomas-Abnahme, war zwischenzeitlich
   nur teilweise ueberarbeitet (siehe uncommitteter Diff unten). Zuerst den AKTUELLEN Stand im
   Browser zeigen/abgleichen, nicht von der 15.07.-Beschreibung ausgehen (die ist vermutlich stale).
2. Echtes `<h1>` fixen (Punkt 1 oben) — exakt dasselbe Muster wie bei Ueber-uns, 5-Minuten-Fix.
3. Mit Thomas klaeren: (a) canonical + noindex-Status der Kontakt-Seite (aktuell bewusst noindex?
   oder vergessen zurueckzustellen?), (b) ob das "(Was hier nicht passiert)"-Raster auch weiss
   werden soll oder als roter Akzent bleibt, (c) FAQ-Realismus.
4. Formular-Funktionalitaet real testen (POST /api/contact) — laut Memory bisher NUR
   Validierungs-UI getestet, nie ein echter POST (haette echte Anfrage ausgeloest).

### Blocker / Risiken
- Working Tree hat aktuell einen KLEINEN uncommitteten Diff auf genau den beiden Kontakt-Dateien
  (`app/relaunch-preview/kontakt/page.tsx`, `components/subpages/kontakt-demo/demo.body.html`) —
  nur der Scroll-Standard-Wrapper-Kommentar/Div, keine inhaltliche Aenderung, NICHT von dieser
  Session. Vor eigener Arbeit `git diff` gegenchecken, ob das noch so daliegt oder von einer
  anderen Session inzwischen committet wurde (Memory: Branch `relaunch` ist geteilt, IMMER erst
  `git fetch` + `git log -15`).
- Repo hat ~74 fremde untracked WIP-Dateien im Root/Screenshot-Ordnern — NICHT anfassen/loeschen,
  nur eigene Dateien gezielt staged committen (kein `git add -A`/`git add .`).

### Relevante Dateien/Befehle
- `npm run dev -- --port 9000` (Dev-Server; war diese Session einmal komplett eingefroren und
  brauchte einen manuellen Neustart — falls `curl`/Browser auf ALLEN Routen timeout, nicht an
  einzelner Route debuggen, sondern Server neu starten).
- `app/relaunch-preview/kontakt/page.tsx`, `components/subpages/kontakt-demo/{demo.css,demo.body.html,demo.engine.jstext}`, `components/subpages/KontaktDemoClient.tsx`.
- `npx tsc --noEmit` vor jedem Commit (dauert teils >120s, im Hintergrund laufen lassen).
- Deploy: Push auf `relaunch` triggert automatisch Vercel-Preview auf v2.redrabbit.media (noindex
  via middleware.ts, ~2-4 Min Build). `vercel ls --yes` zeigt Build-Status, erst bei "Ready" als
  live melden.
