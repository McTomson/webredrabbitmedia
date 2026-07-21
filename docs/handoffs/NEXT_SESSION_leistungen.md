# Naechste Session — LEISTUNGEN-Strang (21.07.2026 abend)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, docs/lessons.md,
  docs/reviews/leistungen-ueberblick-2026-07-21.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/Browser/vermessen). Bei Unsicherheit: fragen oder fail-closed.
- Erst Plan (TodoWrite), dann ausfuehren.
- **Arbeitsmodus (Thomas 21.07.): PARALLELE Sub-Agenten mit anderen LLMs (Sonnet baut,
  fuer Copy ggf. Opus); die Hauptsession (Fable) ist DESIGN-LEAD + UEBERWACHER:
  briefen, kontrollieren, korrigieren, QA — nicht alles selbst bauen (Token sparen).**
- Laufend Browser-QA mit ECHTEM Scrollen (agent-browser), tsc + vitest gruen halten.
  `review-it` nach groesseren Schritten.
- Nur Leistungs-Strang-Dateien anfassen (Fremd-Straenge: website/v2, website-demo,
  talos-choreo, SubpageHero, kontakt/ueber-uns-Demos = TABU). Commits lokal, nicht pushen.
- Haus-Stimme: Du-Anrede, NIE Gedankenstrich, kein sichtbares "KI", keine Preise,
  echte Umlaute im sichtbaren Content.

## Stand dieser Session (21.07., alles browser-verifiziert, lokal committet)
- Hero = ueber-uns-Klon (leistungen-hero2-demo + LeistungenHero2Client), Zahnrad via
  MorphSculpture comp={0} + navyPiece={false}. KERN-ERKENNTNIS: Figur kommt NICHT aus
  der Engine (#headSvg ist per CSS aus), sondern aus MorphSculpture-Portal, getrieben
  ueber window.__sculptProgress. NIE Fragmentdaten in die Engine mappen.
- Seiten-Flow nach Schnitt: Hero -> LeistungenUeberblick (6 Punkte, pixelperfektion-
  Raster vermessen: 1230er-Container, 553x450-Bilder, Paar/Interlude/Paar/Einzel,
  rechte Spalte +100px, Reveal 0.6s gestaffelt) -> Scharnierzeile -> TalosSlot ->
  Referenzen -> FAQ -> CTA. BauMoment/WasDuBekommst/WasSieKann/MehrAlsWebsite RAUS.
- Copy-Kern: "Eine normale Website kriegst du ueberall. Unsere hat eine
  Kommandozentrale." 6 Punkte in Haus-Stimme. Punkt 06 -> Link /leistungen/talos.
- 6 Stimmungsbilder unter public/relaunch/leistungen/ (Unsplash/Pexels; 02+06 sind
  die schwaechsten, spaeter durch echte Screens ersetzen).
- Review (3 Agenten) + Fixes: Overlap -84vh transparent (exakt Zerfallsbeginn DIS0=0.92,
  Herleitung in leistungen-ueberblick.css dokumentiert), __sculptProgress Reset/Delete,
  toter CSS 615->240 Zeilen, Gedankenstrich aus Meta-Description. 2 Haiku-Findings
  nach Verifikation verworfen (im Review-Log).

## NAECHSTE AUFGABEN = Thomas-Feedback 21.07. abend (in dieser Reihenfolge)
1. **Roter Mal-Punkt im Hero fehlt.** Die ueber-uns-Demo hatte einen roten Punkt als
   Cursor beim Malen (.cursor-dot); der Chrome-Ausblende-Block in
   leistungen-hero2-demo/demo.css versteckt ihn (display:none) — diese Session wurde
   stattdessen cursor:auto gesetzt. Thomas will den ROTEN PUNKT ZURUECK: .cursor-dot
   fuer diese Seite wieder aktivieren (nur .demobar/.hint/.autobtn versteckt lassen,
   cursor:none im painting-Zustand wiederherstellen). Gegen /ueber-uns vergleichen
   (dort ist er auch versteckt — NUR unsere Datei anfassen).
2. **Duenne horizontale Linie auf Hoehe der Ueberblick-Karten entfernen** (Screenshot
   Thomas: Hairline links+rechts neben Karte 01 ueber die volle Breite). Ursache im
   Browser lokalisieren (Kandidaten: Rest der Demo-CSS? border irgendwo? mask-Kante?)
   — NICHT raten, per DevTools/eval das Element finden, dann fixen.
3. **TalosSlot interaktiv machen** ("So sieht das in echt aus" / Anfrage-23-Uhr-Karte):
   rechts daneben eine Website-Darstellung (Mockup-Rahmen); Talos erscheint darin von
   unsichtbar -> sichtbar, WINKT mit der rechten Hand, ist INTERAKTIV: Kopf folgt der
   Maus, zwinkert, gerne 1-2 weitere kleine Reaktionen. Vorher pruefen, was es an
   Talos-Assets/Renderern schon gibt (components/relaunch/talos/*, talos-choreo,
   /leistungen/talos-Seite) — WIEDERVERWENDEN, nicht neu erfinden. Demo-vor-Umbau:
   erst kleine Fidelity-Demo zeigen.
4. **Referenzen-Sektion 1:1 wie finsight.framer.ai Testimonials** (Vorbild live
   ansehen + vermessen wie beim pixelperfektion-Block!): Titel "Was unsere Kunden
   sagen" mittig; beim Scrollen wandert der Titel nach oben und das Kundenzitat
   erscheint gross darunter; darunter Avatar-Reihe, Klick auf Avatar wechselt das
   Zitat (aktiver Avatar farbig/gross, Name+Rolle darueber), Pfeile links/rechts.
   UNSERE Schrift; Farbe statt deren Blau: dezentes Rot ODER Grau ODER andere
   Markenfarbe — Thomas ist unsicher ("Rot vielleicht zu aggressiv") -> 2-3 gerenderte
   Farb-Varianten zeigen (Regel: Designfragen visuell). NUR echte Google-Reviews
   verwenden (Rafael Danesh, Dmitry Pashlov, Rene Rohrer; kein erfundenes Rating).
   Ersetzt die bisherige Referenzen-Sektion; Ein-Teal-Moment-Regel beachten (der
   Teal-Moment lebt aktuell in Referenzen — wohin damit? Mit Thomas klaeren oder
   TalosSlot als Teal-Traeger).
5. Danach: Thomas-Abnahme Gesamtseite, dann /leistungen/website- und talos-Hero
   nach demselben Klon-Rezept.

## Offen / Risiken
- EXIF-Credit in punkt-04-website.jpg vor Live-Gang strippen (alle Stock-Bilder).
- Geparkte Idee (NICHT ungefragt bauen): Fragebogen "Finde raus, was du brauchst".
- Vorbestehender Fremd-Fehler: website/v2/Ablauf.tsx styled-jsx ohne 'use client'.
- Dev-Server: `npm run dev -- --port 9000` (nie parallel `next build`).

## Befehle/Vorbilder
- Seite: http://localhost:9000/relaunch-preview/leistungen · Vorbild-Hero: /ueber-uns
- Vorbild Aufgabe 4: https://finsight.framer.ai/ (Testimonial-Sektion)
- tsc: `npx tsc --noEmit` · Tests: `npx vitest run` · QA: agent-browser, echtes Scrollen
