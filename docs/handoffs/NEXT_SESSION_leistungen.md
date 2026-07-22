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

## ERLEDIGT 21.07. spaetabend (Folgesession, alle 4 Feedback-Punkte, browser-verifiziert)
1. Roter Mal-Punkt zurueck im Hero (.cursor-dot wieder aktiv, cursor:none beim Malen).
2. "Linie" aufgeklaert: war die Ablauf-Timeline der WEBSITE-Unterseite mit kaputten
   styled-jsx-Styles; 'use client'-Fix kam von der Parallel-Session, rendert jetzt
   korrekt als Kreis-Kette. Hub hat keine Linie (dokumentweiter DOM-Scan leer).
3. TalosSlot: Browser-Mockup-Rahmen (.lht-browser: Navy-Leiste, roter Punkt,
   "deine-website.at"-Pille, Skeleton-Inhalt) um die bestehende TalosEntranceStage —
   Figur erscheint, winkt, folgt Maus, blinzelt (kam gratis aus talosMotion).
4. KundenSagen (ersetzt Referenzen): 1:1 nach vermessener finsight-Spec (42px-Preset,
   Kacheln 123px/19px-Radius, aktiv farbig +30px hoch, Name an aktiver Kachel,
   instant-Cut, zyklische Pfeile), Marken-Navy-Grund, Initialen-Kacheln.
   AKZENT-ENTSCHEIDUNG Thomas 21.07.: gedaempftes Rot #c94f5c (= Default --ks-accent).
   NUR 2 echte Reviews (Danesh, Rohrer) — Dmitry Pashlov ist TEAM, kein Kunde
   (Code-Doku), dritte Kachel erst bei echter dritter Rezension.

## OFFEN fuer naechste Session
- Thomas-Abnahme der Gesamtseite (Hero -> 6 Punkte -> Scharnier -> Talos-Mockup ->
  KundenSagen -> FAQ -> CTA).
- Teal-Moment: alte Referenzen-Sektion war der eine Teal-Traeger, KundenSagen ist
  Navy — mit Thomas klaeren, ob TalosSlot den Teal-Akzent uebernimmt.
- Talos-Blickfolge reagiert auf die GANZE Seite (window.pointermove) — Begrenzung
  auf den Mockup-Bereich braeuchte Eingriff in TalosEntranceStage (Talos-Strang).
- Dritte echte Google-Rezension besorgen -> TESTIMONIALS-Array in KundenSagen.tsx.
- Danach: /leistungen/website- + talos-Hero nach Klon-Rezept.

## Offen / Risiken
- EXIF-Credit in punkt-04-website.jpg vor Live-Gang strippen (alle Stock-Bilder).
- Geparkte Idee (NICHT ungefragt bauen): Fragebogen "Finde raus, was du brauchst".
- Vorbestehender Fremd-Fehler: website/v2/Ablauf.tsx styled-jsx ohne 'use client'.
- Dev-Server: `npm run dev -- --port 9000` (nie parallel `next build`).

## Befehle/Vorbilder
- Seite: http://localhost:9000/relaunch-preview/leistungen · Vorbild-Hero: /ueber-uns
- Vorbild Aufgabe 4: https://finsight.framer.ai/ (Testimonial-Sektion)
- tsc: `npx tsc --noEmit` · Tests: `npx vitest run` · QA: agent-browser, echtes Scrollen
