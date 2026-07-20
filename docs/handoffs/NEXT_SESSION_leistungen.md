# Naechste Session — LEISTUNGEN-Strang (Stand 20.07.2026 spaet)

## HERO-FINISH (das einzige offene, fokussiert bauen) — Weg B, Thomas 20.07. abgenommen
Ziel: Hero wie ueber-uns (Wort auf Deck + Wisch + Wort zerbricht in KLEINE Fragmente ->
FIGUR + Text scrollt) mit Figur = ZAHNRAD (comp1). Alles verifiziert:
- **über-uns-FIGUR-Engine ist NICHT einbettbar:** sie laeuft nur als KOMPLETTE eigenstaendige
  Seite. Hero-only rausgeloest -> Choreografie friert ein (data-active bleibt 0, kein
  htitle-transform, KEIN Konsolen-Fehler; strukturell an das volle Seiten-Body gekoppelt).
  Verifiziert am 20.07. Deshalb NICHT die ueber-uns-Engine hero-only einbetten.
- **Einbettbare Hero-Engine = die schlanke (tipps/leistungen-hero-demo, 383 Zeilen):** laeuft
  eingebettet (Wort steigt, Wisch, Buchstaben-Scatter, data-active=1), hat aber KEINE Figur.
  Aktuell auf /leistungen (leistungen-hero-demo) + /website (website-hero-demo) verdrahtet.
- **Weg B = Figur in die einbettbare Engine GRAFTEN:** aus der ueber-uns-Engine den Figur-Teil
  uebernehmen (COMP5->P build ~Z.351-367, normalizeEntry, measureHeadStarts ~Z.385-401,
  Assemble-Render ~Z.406-424 mit aA/Pm), headSvg in die demo.body.html, an den Scatter-
  Fortschritt der schlanken Engine haengen (statt/zus. zum Buchstaben-Scatter).
- **Zahnrad-Daten FERTIG gemappt:** scratchpad/gear_comp1.json (129 Fragmente, EYE=75,
  VB={116,126,879,788}). Mapping aus lib/relaunch/morph/at-shapes-comp1.json ist reiner
  Feld-Rename: x/y/rot/sx/sy=finale Figur, fromX->fx, fromY->fy, fromRot->fr, fromScale->fs,
  entryT->e, arriveT->a (KEINE fx=x-Kruecke noetig, die Daten haben ihr eigenes from-Feld!).
- **Klumpen-Problem (die eine Feinabstimmung):** in der ueber-uns-Engine rendert comp1 als
  dichter roter Klumpen statt sauberem Zahnrad. SubpageHero zeigt comp1 ALS sauberes Zahnrad,
  weil es jede Figur in EIGENER viewBox (-w/2..w/2) auf boxW=w*|sx|*k skaliert; die ueber-uns-
  Engine rendert den Pfad in GETEILTER viewBox in Natur-Einheiten*sx. -> Fragment-Groesse/
  Abstand-Verhaeltnis stimmt nicht. Fix: entweder pro Fragment eigene viewBox+box-Sizing wie
  SubpageHero (buildFigureStatic in components/subpages/SubpageHero.tsx ist die Vorlage), oder
  sx-Faktor empirisch angleichen. Standalone testen (Wegwerf-Route wie das geloeschte
  /gear-test: UeberUnsDemoClient + components/subpages/leistungen-figure-demo).
- **Referenz-Artefakte da:** components/subpages/leistungen-figure-demo/ = ueber-uns-Engine mit
  eingesetzten Zahnrad-Daten (laeuft standalone als VOLLES body, Klumpen-Figur) — Beleg, dass
  Daten + Pipeline stimmen, nur die Skalierung fehlt. Erst standalone das saubere Zahnrad
  hinbekommen, DANN in die einbettbare Engine graften, DANN /leistungen + /website verdrahten.
- Aktueller Seiten-Stand: /leistungen + /website zeigen die funktionierende Wort+Wisch-Version
  (ohne Figur), Inhalt fertig+committet (3eea8cb). Hero-Wiring NICHT committet.

## Arbeitsregeln (verbindlich)
- Lies ZUERST: diesen Handoff, docs/strategie/LEISTUNGEN_IA_2026-07.md, docs/UNTERSEITEN_STIL.md,
  die betroffenen Dateien, und die Memory [[feedback_subpage_hero_ueberuns_mechanik_standard]].
- NIE raten — immer verifizieren (Code/Browser). Bei Unsicherheit: EINE praezise Frage.
  (Der Hero ist 4x gescheitert, jedes Mal weil "wie ueber-uns" mit einem Ersatz beantwortet
  wurde statt den ECHTEN ueber-uns-Demo-Code zu lesen. Nicht nochmal.)
- Laufend im Browser gegen /relaunch-preview/ueber-uns pruefen. tsc + vitest gruen halten.
- Nur eigene Leistungs-Dateien anfassen/committen, Fremd-Straenge NIE. Lokal, nicht pushen.
- WORKING TREE geteilt mit Fremd-Straengen (talos-choreo, preise-preview, subpages/SubpageHero
  etc., PNGs). NUR Leistungs-Dateien.

## STAND
- Inhaltlich FERTIG + browser-verifiziert + lokal committet (91477fd, 3eea8cb):
  - Hub /relaunch-preview/leistungen: Produkt-zuerst. BauMoment -> WasDuBekommst (Fundament)
    -> Scharnierzeile (Pivot) -> **WasSieKann** (Dashboard-Funktionen in Klartext, "du gibst
    frei") -> TalosSlot (funktions-zuerst, Autonomie klargestellt, Talos als Gesicht danach)
    -> Referenzen (1 Teal) -> MehrAlsWebsite -> FAQ -> CTA. Wegweiser-Link auf Website-Seite.
  - Website /relaunch-preview/leistungen/website: Dach ueber alle Website-Leistungen.
    WasEntsteht -> WieWirBauen -> WasInklusive -> **FacetteNeu/FacetteRelaunch/FacetteDesign**
    -> SelbstOderMit -> DeineSeite -> NachDemLaunch -> FuerWenNicht -> SoArbeitenWir (1 Teal)
    -> FAQ (7) -> CTA.
  - Qualitaet: tsc gruen, 1 h1 je Seite, genau 1 Teal-Moment, kein sichtbares KI/AI, keine
    em-dash, keine Preise, echte Umlaute, echte Rezension (Rafael Danesh) 1:1, Mobile ok,
    reduced-motion ok. Code-Review 0 Findings. UX-Audit gelaufen (Produkt-zuerst umgesetzt).
  - Deploy (mit NOCH ALTEM Hero): https://webredrabbitmedia-64i7mxalc-toms-projects-17d37f0b.vercel.app

## OFFEN = DER HERO (einziger offener Punkt, Thomas 20.07. abgelehnt)
Thomas: "genau so der Aufbau wie bei ueber-uns, nur mit Zahnrad." + Dauer-Standard fuer ALLE
neuen Seiten (Memory [[feedback_subpage_hero_ueberuns_mechanik_standard]]).

AKTUELL FALSCH: Beide Heroes nutzen `SubpageHero` (components/subpages/SubpageHero.tsx). Der
rendert den Wisch (BrushReveal) als SEPARATES Band OBEN und das Wort->Zahnrad-Morph als
EIGENE Scroll-Sektion darunter -> oben nur leeres Wisch-Band, Wort erst beim Scrollen. Das
ist der abgelehnte Zustand.

RICHTIG = die ueber-uns-"painting"-Mechanik (EINE Sticky-Szene, alles zusammen):
components/subpages/ueber-uns-demo/{demo.css, demo.body.html, demo.engine.jstext} + Wrapper
UeberUnsDemoClient. Struktur (demo.body.html): main-sticky mit
  - layer-deck = grosses WORT (weisses Deck, oben sofort sichtbar)
  - layer-base = navy reveal-msg (Botschaft), per mask-v1 + gooey freigewischt (cursor-dot,
    Hinweis "Maus ueber das Bild bewegen") -> Wort UND Wisch in DERSELBEN Ansicht
  - dann Wort zerfaellt (Golden-Angle-Burst) -> FIGUR setzt sich zusammen, Text (eyebrow/
    statement/story) scrollt seitlich.

### Rezept (so bauen, NICHT neu erfinden)
1. ZUERST anschauen wie **kontakt-demo** die Figur getauscht hat: kontakt nutzt dieselbe
   ueber-uns-Szene, aber eine Gluehbirne statt Kopf. components/subpages/kontakt-demo/ vs
   ueber-uns-demo diffen -> das ist der exakte Praezedenzfall fuer einen Figur-Wechsel.
2. Pro Seite den Demo-Ordner kopieren: `website-hero-demo`, `leistungen-hero-demo`. Je einen
   *DemoClient wie UeberUnsDemoClient/KontaktDemoClient. Server-Page liest demo.* pro Request
   (fs.readFileSync IN der Komponente) und uebergibt an den Client. (Muster: ueber-uns/page.tsx,
   kontakt/page.tsx.)
3. Anpassen: Wort ("Website" / "Leistungen"), reveal-msg (Wisch-Botschaft), Text (eyebrow/
   statement/story) — Copy mit Thomas/Opus, Hausregeln.
4. FIGUR = ZAHNRAD (comp1). Die Engine baut die Figur aus einem inline Fragment-Array `COMP5`
   (demo.engine.jstext, Zeile ~7), via `const P=COMP5.map(...)` (Z.351). comp5 = Kopf. Fuer
   das Zahnrad die Fragmentdaten von **comp1** (lib/relaunch/morph/at-shapes-comp1.json,
   comp1 = das Zahnrad, im Browser verifiziert) in das COMP5-Format bringen (Felder
   d/x/y/rot/sx/sy/fx/fy/fr/fs/e/a). ACHTUNG: at-shapes-comp1.json hat ein ANDERES Schema
   (x/y/rot/sx/sy/d + op/hidden, KEINE fx/fy/fr/fs/e/a) -> Mapping/Ableitung noetig (fx/fy =
   Endposition, e/a = Ein-/Zusammenbau-Timing wie in subpageStage.ts synthetisiert). Am
   saubersten: schauen woher ueber-uns COMP5 generiert wurde (Mess-Skript?) bzw. wie
   kontakt-demo seine Figurdaten hat. K12 (Z.750) nutzt NUR 4 bespoke Zahnrad-Arm-Pfade fuers
   ">>", NICHT die volle Figur — nicht verwechseln.
5. Ausserdem comp5-spezifisch anpassen: `EYE=1` (Z.350, Navy-Fragment = groesstes
   Seitenverhaeltnis; fuer comp1 neu bestimmen wie HomeMorph: max(W/H,H/W)) und `VB` (Z.340,
   viewBox der Figur; fuer das Zahnrad passend setzen).
6. `SubpageHero`-Einbindung aus beiden page.tsx entfernen (der .rr-Wrapper-Block mit
   <SubpageHero ...>), durch den neuen *DemoClient ersetzen. SubpageHero selbst ist Fremd-
   Strang, nicht loeschen.
7. DEMO-first (Thomas-Regel demo-vor-umbau): ERST die Website-Seite bauen, im Browser gegen
   /ueber-uns gegenpruefen, Thomas zeigen, DANN auf Leistungen uebertragen. Nicht blind fertig
   melden.

## Relevante Befehle
- Dev: `cd ~/dev/redrabbit && npm run dev -- --port 9000`  (NIE gleichzeitig `next build`!)
- Browser-QA: agent-browser (`agent-browser set viewport 1440 900`, `... set media reduced-motion`,
  `... set viewport 390 844` fuer Mobile). Hero real durchscrollen (KEINE __subMorphU-Hooks,
  die taeuschen — Thomas scrollt real).
- tsc: `npx tsc --noEmit`  ·  Tests: `npx vitest run`
- Vorbild: /relaunch-preview/ueber-uns , /relaunch-preview/kontakt
