# Naechste Session — Scroll-Standard site-weit (2026-07-29 abends)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## Stand dieser Session

**Kontext:** Thomas ist die Startseite `/relaunch-preview/leistungen/website` mit mir Bild fuer Bild
durchgegangen (7 Screenshots) und hat 7 Bereiche markiert, wo das Scrollen falsch war: (1) Hero-
Ankunft, (2)+(3) die 4 "Ehrlich gesagt"-Statements, (4) SoBauenWir, (5) Diagnose, (6) Ablauf,
(7) Fundament. Sein Kernwunsch ueberall: **kein kuenstliches Verlangsamen**, aber **Pflicht-Stopp**
sobald ein neuer Bereich im Bild ist — "egal wie schnell/viel ich scrolle". Bei den 4 Statements
zusaetzlich: 1 Scroll = genau 1 Statement weiter (nicht anteilig/verschwommen).

Wir haben uns auf (1)-(3) als ersten Schritt geeinigt ("lern wie ich es meine"), er hat das Ergebnis
live geprueft und freigegeben. Danach hat er in einer zweiten Runde 2 weitere Baustellen gemeldet
(Bild aus Walkthrough, "muss 2x scrollen" bei Statement 0->1, UND: Sticky-Effekt soll GANZ raus aus
der ganzen Seite, nicht nur hier) — auch die sind gefixt+verifiziert+freigegeben ("supper passt jetzt").

### Erledigt + verifiziert (committet `7a2e5db`, Branch `relaunch`, GEPUSHT)
- `components/relaunch/ScrollExperience.tsx`:
  - `SITE_LERP` 0.065 -> **1** (Kommentar im Code erklaert warum: oberes Ende des dokumentierten
    Lenis-lerp-Bereichs 0..1, de facto kein spuerbares Nachziehen mehr — das war der "sticky"-Effekt).
  - Neuer Hook `window.__rrDynamicSnapTops` (Typ-Deklaration in `types.d.ts`): Seiten registrieren
    hier ihre eigenen Scroll-Checkpoints INNERHALB eines `data-rr-snap-exempt`-Tracks.
  - Neue Funktion `finishDynamicBoundary()`: wenn eine Geste auf eine dynamische Kante zielt, wird
    IMMER zu Ende gefahren (nicht distanz-gegatet wie der generische Idle-Snap `trySnap`).
  - `trySnap()` bewusst UNVERAENDERT bzgl. dynamischer Kanten gelassen (erster Versuch hatte sie mit
    reingenommen — das zog dann faelschlich rueckwaerts zur naechstgelegenen statt vorwaerts zur
    Gesten-Kante; Fund + Fix in derselben Session, siehe LESSONS_LEARNED.md 2026-07-29 abends).
- `app/relaunch-preview/leistungen/website/page.tsx`: Hero+Belief-Wrapper traegt jetzt zusaetzlich
  `data-rr-snap` (Ankunft haelt einmal, bevor die Wisch/Zahnrad-Animation losgeht).
- `components/subpages/website-demo/demo.engine.jstext`: neue Funktion `beliefCheckpointTops()`,
  registriert die 4 Statement-Mitten (`B_CENTERS`) als `window.__rrDynamicSnapTops`.
- `types.d.ts`: `Window.__rrDynamicSnapTops?: () => number[]` deklariert.
- Alles mehrfach live per Browser-Automation bewiesen (nicht nur behauptet): vorwaerts+rueckwaerts,
  schwacher (2-Tick) UND starker (15-Tick) Scroll, mit `console.log`-Instrumentierung live
  mitgelesen und wieder entfernt. `npx tsc --noEmit` = 0 Fehler. Keine Konsolen-Errors.
- Kanonisch dokumentiert: `docs/DESIGN_STANDARD.md` § "Scroll & Bumper" (volle Regel dort).

### Offen / naechste konkrete Schritte (in dieser Reihenfolge)
1. **Bild 4-7 auf DERSELBEN Seite** (SoBauenWir, Diagnose, Ablauf, Fundament) — laufen schon ueber
   normales `data-rr-snap` (Thomas fand den Stop bei Ablauf/"03" schon "super"). Pruefen ob
   `SITE_LERP=1` allein das gemeldete Traege behebt, oder ob dort noch ein eigenes Scroll-Scrubbing
   sitzt (z.B. GSAP ScrollTrigger mit `scrub`) das zusaetzlich angefasst werden muss. Component-Pfade:
   `components/subpages/leistungen/website/v2/{SoBauenWir,Diagnose,Ablauf,fundament-varianten/VarianteA,DreiStufenMatrix,TalosDashboard}.tsx` (grep nach `ScrollTrigger`/`scrub`/`useScroll` als erster Schritt).
2. **SITE-WEIT ausrollen** (Thomas will das explizit, nicht nur diese eine Seite):
   - `components/relaunch/HomeMorph.tsx` (Homepage) hat eine EIGENE Lenis-Instanz mit
     hartcodiertem `lerp: 0.065` (Zeile ~96) — bisher NICHT angefasst. Auf densel­ben Standard
     bringen (lerp=1 oder das, was sich nach Punkt 1 als richtiger Referenzwert erweist).
   - Alle anderen Seiten mit `data-rr-snap-exempt`-Tracks + eigenem scroll-gebundenem
     Mehr-Schritt-Inhalt (falls vorhanden: Preis-Matrix, Talos-Fahrten, CasePanels) auf das
     `window.__rrDynamicSnapTops`-Muster pruefen/umbauen statt eigener Wheel-Listener.
3. Nach jeder Aenderung: gleiche Verifikations-Technik wie in dieser Session (siehe unten), NICHT
   blind auf Thomas' Live-Test warten — er hat aber weiterhin das letzte Wort vor "fertig".

### Standing-Regel (dauerhaft, siehe docs/DESIGN_STANDARD.md — NICHT nur fuer diese eine Aufgabe)
1. Kein kuenstliches Verlangsamen/Sticky-Scrubbing mehr irgendwo auf der Site.
2. Pflicht-Stopp pro Sektion beim Reinscrollen, egal wie schnell/viel gescrollt wird.
3. Scroll-gebundene Mehr-Schritt-Animationen IMMER ueber `window.__rrDynamicSnapTops`, NIE einen
   zweiten eigenen Wheel-Listener/Lenis-Konsumenten (Race-Gefahr, siehe Lesson unten).

### Verifikations-Technik, die diesmal funktioniert hat (3 Fallen vermieden)
1. Zum Testpositionieren IMMER echte Scroll-Gesten (Tool-`scroll`-Action), NIE `window.scrollTo()`
   per JS — das desynct Lenis' internen `targetScroll`/`animatedScroll`.
2. Nach JEDER Code-Aenderung an ScrollExperience.tsx / demo.engine.jstext einen ECHTEN
   `navigate()`/Hard-Reload machen — Next Fast-Refresh reicht nicht, um `useEffect`-Closure-State
   (Timer, Boundary-Variablen) neu zu booten, man testet sonst gegen alten Code.
3. Debug-Logs als `console.log("text=" + wert)` (String-Konkatenation), NICHT `console.debug()`
   (wird vom Consolen-Reader-Tool nicht zurueckgegeben) und NICHT Objekt-Argumente (kommen nur als
   Platzhalter `Object` an).
Volldetail: `LESSONS_LEARNED.md` Eintrag 2026-07-29 abends; Memory `feedback_scroll_snap_verifikation_unreliable` (Update-Abschnitt oben in der Datei).

### Blocker / Risiken
- Keine bekannten. `npm run lint` wurde in dieser Session NICHT separat gelaufen (nur `tsc --noEmit`)
  — vor dem naechsten grossen Schritt einmal nachholen.
- Andere Straenge haben parallel WIP im selben Working Tree (faq/kontakt/ueber-uns page.tsx,
  SiteClosing.tsx, diverse demo.body.html, Talos-Choreo-Dateien, docs/specs/FUCHAI_CHOREOGRAFIE) —
  NICHT anfassen, gehoert nicht zu diesem Strang. Vor Arbeit `git status` pruefen.

### Relevante Dateien/Befehle
- `components/relaunch/ScrollExperience.tsx` (Kern-Engine, Kommentare oben im File sind aktuell)
- `components/subpages/website-demo/demo.engine.jstext` (Statement-Checkpoints)
- `app/relaunch-preview/leistungen/website/page.tsx`
- `types.d.ts`
- `docs/DESIGN_STANDARD.md` § "Scroll & Bumper" (kanonisch)
- Dev-Server: `npm run dev -- --port 9000`, Seite `http://localhost:9000/relaunch-preview/leistungen/website`
- Typecheck: `npx tsc --noEmit -p .` (dauert bei diesem Projekt mehrere Minuten, im Hintergrund laufen lassen)
