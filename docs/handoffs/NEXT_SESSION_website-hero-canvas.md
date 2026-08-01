# Naechste Session — /leistungen/website Mobile (Stand 2026-08-01 nachts)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/Browser/Docs). Bei Unsicherheit fragen oder fail-closed.
- Erst Plan, dann ausfuehren. Laufend im Browser testen. commit/push/deploy ZWISCHEN Schritten (Thomas will das).
- Nichts als "fertig" melden ohne verifiziertes Ergebnis; visuelle Fixes erst fertig, wenn Thomas es auf SEINEM Geraet bestaetigt.
- Branch `relaunch` ist GETEILT: `git fetch` + `git log` vor Arbeit, NUR eigene Dateien mit Pfad committen (NIE `git add .`/`-u`). Fremde WIP im Tree: app/relaunch-preview/faq/page.tsx, components/relaunch/SiteClosing.tsx, faq-demo/demo.body.html, docs/handoffs/NEXT_SESSION_leistungen.md, docs/seo-monitor-log.md.

## GROSSER UNTERBAU-GEWINN (merken!): Mobile IST im Emulator sichtbar
Das agent-browser/claude-in-chrome-Fenster laesst sich per `resize_window` auf **min. 500px CSS-Breite** verkleinern (OS-Minimum; 414 wird auf 500 geklemmt). 500px triggert die Mobile-Media-Queries (<=768/<=860/<=1024). Damit sind die SEKTIONEN-Layouts (reine CSS-Media-Queries) im Emulator VERIFIZIERBAR — Sektionen NICHT mehr blind bauen. Ablauf: resize auf 500x1000 -> `sec.scrollIntoView` zur Ziel-Sektion -> screenshot.
- ABER: rAF-getriebene Animationen bleiben im Hidden-Tab pausiert (Screenshot weckt 1 Frame); Touch wird weiter FALSCH gemeldet (maxTouchPoints=0). Fuer den Canvas-Hero-Reveal weiter `localStorage rrCanvasRevealBP=2000` erzwingen.

## ERLEDIGT diese Session (alles live auf v2.redrabbit.media, gepusht)
1. **Hero-Reveal scroll-getrieben** (86f99e8): kein zeitgesteuertes Auto mehr; `scrollRevealA = Pm/P_PAINT` (P_PAINT=0.05). Runter=auf, hoch=zu (Endlos-Rueckweg automatisch), begrenzt auf Satz-Region (kein Vollbild-navy), revealFade heilt sauber (kein schwarzer Screen). Vorbild ashleybrookecs.com/about (im Browser inspiziert: kein Finger-Malen, scroll-getriebener Gooey-Masken-Splash).
2. **Reveal gleichmaessig** (00b7955): Offscreen-Maske (`revealMaskCanvas`) — Kreise erst flach zu EINER Maske verschmelzen (source-over, Kerne alpha 1 -> kein Compounding), dann in EINEM destination-out-Zug loeschen. Behebt das graue Hell-Dunkel-Muster; nur Aussenkante gooey.
3. **Desktop-Schutz** (b86a3c7): useCanvas jetzt an ECHTES Touch gekoppelt, NICHT nur Breite: `innerWidth<=CANVAS_BP && (maxTouchPoints>0 || ontouchstart || pointer:coarse || forceOverride)`. Grund: Thomas' Retina-Laptop meldet CSS-Breite <=1024 -> wurde faelschlich als Tablet behandelt, Canvas erschien auf dem Desktop. Jetzt: Nicht-Touch = IMMER SVG-Hover-Reveal (die stundenlang gebaute Desktop-Funktion), egal wie schmal. Auto-Play-Gate ebenso auf `isTouchDevice`. Lesson aktualisiert: [[reference_relaunch_ios_svgmask_und_emulator_touch]].
4. **Ablauf Schritt 3 Copy gestrafft** (b1b1b1d, Thomas freigegeben): langer Absatz -> knappe Stichsaetze, gleiche Risiko-Umkehr.
5. **Fundament (VarianteA) auf Mobile = horizontales Karten-Deck** (6b09e5e): 12 gestapelte Punkte -> Wisch-Deck (scroll-snap-x, weisse Dashboard-Karten ~82% mit Peek, Sticky X/12-Bar). Nur `@media (max-width:860px)` + IntersectionObserver-rootMargin vertikal->horizontal. Desktop-Ledger unberuehrt. Bei 500px verifiziert (Zaehler laeuft beim Wischen mit).

## OFFEN — HIER WEITERMACHEN (Thomas: "schritt fuer schritt durchgehen")
**ZUERST: Thomas' Geraete-Feedback zu Fundament abwarten** (Karten-Groesse? Ruhe? 1 Punkt pro Karte oder 2? Farbe?). Er sagt "passt, mach die anderen" ODER Aenderungswuensche. NICHT ungefragt ausrollen.

Dann, Sektion fuer Sektion (jede bei 500px pruefen, commit/push/deploy, Geraete-Check):
- **A) Muster ausrollen** auf die anderen Multi-Item-Sektionen mit demselben Wisch-Deck:
  - `Ablauf.tsx` (5 Schritte) -> ein Schritt pro Karte, grosse Nummer.
  - `DreiStufenMatrix.tsx` -> ein Paket pro Karte.
  - ggf. Diagnose / SoBauenWir pruefen (auch gestaucht?).
  - Referenz-Vorbild fuer die gute Optik = `TalosDashboard.tsx` ("wda", Browser-Frame + Karten), das Thomas gefaellt.
- **B) Grundlegend (Thomas bestaetigt), noch OFFEN:** (1) CSS-Scroll-Snap pro Sektion auf Touch (`scroll-snap-type:y` + `scroll-snap-align:start` + `scroll-snap-stop:always`) — ScrollExperience.tsx ist RAD-basiert, greift auf Touch NICHT; VORSICHT mit dem gepinnten Hero (scene-main, data-rr-snap-exempt). (2) Sektionen bildschirmfuellend auf Mobile (min-height:100svh, zentriert) — aktuell nur ReferenzenTeaser/SiteClosing <820px. (3) Danach auf ALLE anderen Unterseiten + Homepage ausrollen.
- **C) Hero-Rollout:** dieselbe scroll-getriebene Canvas-Reveal-Mechanik auf allen Seiten mit SVG-Masken-Hero (MorphSculpture/SubpageHero-Heroes: /leistungen, /preise, /ueber-uns, /kontakt...) — mobil auf Canvas umstellen. Erst wenn /leistungen/website komplett rund ist.

## Kuerzen-Frage (Thomas' Frage, beantwortet)
Meistens NICHT loeschen, sondern STRUKTUR (2026-Konsens: horizontale Karten-Slider / progressive disclosure, nicht Textwand). Nur die laengsten Texte straffen — Ablauf Schritt 3 erledigt. Fundament-Copy bleibt (nur Struktur). Wenn eine Sektion zu voll wirkt: 2 Punkte pro Karte statt 1 anbieten, NICHT eigenmaechtig Anzahl kuerzen (Copy = Thomas' Hoheit, vorher zeigen).

## Relevante Dateien
- Hero: `components/subpages/website-demo/demo.engine.jstext` (P_PAINT, buildRevealPath, drawRevealScroll + Offscreen-Maske, applyMain Pm-Remap ~Z.560, boot useCanvas/isTouchDevice ~Z.945). Debug: `window.__revealDiag()` {a,fade,pathLen,...}; Force-Canvas `localStorage rrCanvasRevealBP=2000`.
- Sektionen: `components/subpages/leistungen/website/v2/` — Fundament=`fundament-varianten/VarianteA.tsx` (Muster fuer Karten-Deck!), `Ablauf.tsx`, `DreiStufenMatrix.tsx`, `TalosDashboard.tsx` (Optik-Vorbild). Seite: `app/relaunch-preview/leistungen/website/page.tsx`.
- styled-jsx im Relaunch meiden (neue Komponenten), ABER bestehende Sektionen nutzen es schon -> dort im @media anpassen, nicht neu bauen.

## Deploy
`vercel deploy --yes` -> letzte stdout-Zeile = URL -> `vercel alias set <url> v2.redrabbit.media`. Push triggert zusaetzlich einen Preview-Build (post-commit-Hook auto-pusht + graphify). Dev-Server: `npm run dev -- --port 9000` (KEIN `npm run build` bei laufendem dev).
