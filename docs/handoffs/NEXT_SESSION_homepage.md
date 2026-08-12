# Naechste Session — Homepage-Relaunch / Soft-Snap (29.07.2026 abends)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## Stand dieser Session (29.07. Vormittag-Nachmittag)

**Wichtigster Punkt zuerst: das Soft-Snap-Stoppen ist laut Thomas WEITERHIN kaputt.**
Trotz zwei verifizierten Fixes (siehe unten) hat Thomas nach dem Live-Test auf v2 gesagt:
"das mit dem stoppen hast du nicht hingebkommen warum auch immer versteh ich nicht".
Er hat NICHT gesagt WO/WIE es noch scheitert — das ist die erste offene Frage naechste Session.
Automatisierte Browser-Verifikation dieses konkreten Verhaltens ist NICHT verlaesslich
(siehe Memory [[feedback_scroll_snap_verifikation_unreliable]] fuer den vollen Befund) —
nicht nochmal stundenlang versuchen, es per Skript zu "beweisen". Stattdessen: Thomas
gezielt fragen WELCHE Seite/WELCHER Uebergang genau, idealerweise mit Screenshot/GIF wie
letztes Mal, oder einen sichtbaren Debug-Overlay einbauen (kleine On-Screen-Anzeige mit
scrollY/bestDist/exempt-Status), damit er selbst sieht was die Engine gerade tut.

### Erledigt + verifiziert (Commits `beb2798` → `ac29b60` → `6a3e39a` → `0c9890a`, alle live auf v2)
1. **Off-White ueberall** (`beb2798`): alle 11 Demo-Hero-Klone (`components/subpages/*-demo/demo.css`)
   hatten `--offwhite:#ffffff` (Legal-Seiten + Subpage-Heroes rein weiss statt Off-White #f4f4f2) —
   auf allen 11 korrigiert.
2. **Talos-Talente-Fahrt** (`beb2798`): fehlende rote `( Thema )`-Eyebrow ergaenzt
   (`components/subpages/preise/TalosTalenteFahrt.tsx`).
3. **data-rr-snap auf ~20 bisher unmarkierten Sektionen** (`beb2798`): Preise-, Leistungen-,
   /leistungen/website-, /leistungen/talos-Komponenten hatten das Attribut schlicht nicht
   (SoBauenWir, Diagnose, Ablauf, ReferenzenTeaser, DreiStufenMatrix, TalosDashboard, KundenSagen,
   WebsiteFaq, LeistungenUeberblick, Scharnierzeile, LeistungenFaq, BetreuungFoerderung,
   MehrwertRechner, PreiseFaq, PreiseMatrix, RisikoBand, Beweis, Faehigkeiten,
   FragTalosAnmoderation, InklusiveDashboard, Kontrollraum, TalosFaqV2). Bei echten
   Sticky-Tracks (Ablauf, Onboarding, FreigabePrinzip, WerIstTalos) korrekt `data-rr-snap-exempt`
   auf den TALLEN Root gesetzt, nicht auf das innere `position:sticky`-Element (das waere
   architektonisch falsch — dessen eigenes BoundingRect ist waehrend des Pins nur ~100vh).
4. **ScrollExperience.insideExempt()-Bug gefunden+gefixt** (`beb2798`): blockierte Einrast-Checks
   bis zur LETZTEN Pixelreihe eines gepinnten Tracks. Die naechste Sektion beginnt aber genau
   dort, wo der Track endet (z.B. Homepage KundenGrid direkt nach CasePanels) — ihr Snap konnte
   nie greifen, weil `insideExempt()` bis zum letzten Pixel "true" blieb. Fix: `exempt` gilt jetzt
   nur bis `bottom - vh*CATCH_RATIO` (Tail-Ausschnitt in Catch-Reach-Groesse).
5. **CATCH_RATIO 0.35 → 0.6** (`ac29b60`): Thomas scrollt mit Trackpad-Schwung, ein normaler Wisch
   legt oft mehrere hundert Pixel zurueck und ueberspringt einen schmalen Fangbereich komplett.
   → TROTZDEM laut Thomas' Feedback offenbar nicht ausreichend geloest, siehe oben.
6. **DreiStufenMatrix (Preis-Matrix /leistungen/website) zur Mini-Bildschirm-Fahrt umgebaut**
   (`6a3e39a`): Starter/Business/Premium liefen vorher normal untereinander (kein Stop pro Stufe).
   Jetzt eigene 100vh-Sticky-Fahrt (snapUnits-Dwell, Muster ScrollBumper/CasePanels), jede Stufe
   = eigener Bildschirm-Stop. **Echter Bug dabei gefunden**: `<style jsx>` in der AEUSSEREN
   Komponente (`DreiStufenMatrix`) griff NIE auf Klassen, die von einer INNEREN Kind-Komponente
   (`StufenFahrt`) gerendert werden — styled-jsx scoped strikt pro Funktionskoerper, nicht pro
   Datei. Fuehrte zu einem komplett weissen/leeren Bildschirm mitten in der Fahrt. Fix: plain
   globales `<style>`-Tag INNERHALB von `StufenFahrt` selbst (Projekt-Konvention sowieso, siehe
   `LESSONS_LEARNED.md` "styled-jsx im Relaunch meiden"). **Falls kuenftig weitere Komponenten
   in Unter-Komponenten aufgesplittet werden: IMMER pruefen, in welcher Funktion das `<style jsx>`
   sitzt vs. welche Funktion die Ziel-Klasse rendert.**
7. **ReferenzenTeaser, SiteClosing (ausser `compact`/Kontakt-Variante), KundenSagen auf 100vh +
   vertikal zentriert** (`6a3e39a`): waren kurze Bloecke mit viel Leerraum drumherum, sollen jetzt
   als eigene volle Bildschirmseite wirken. Mobil (≤820px) faellt der Zwang wieder weg.
8. **BackToTop-Button** (`6a3e39a` + Fix `0c9890a`): neue Komponente `components/relaunch/BackToTop.tsx`,
   Gegenstueck zu `CornerLogo` (oben links → Startseite), unten links → scrollt zum Seitenanfang.
   Site-weit auf allen 18 Content-Seiten eingebunden (`app/relaunch-preview/**/page.tsx`).
   **Deploy-Falle**: erster Push (`6a3e39a`) brach den Vercel-Build — `(window as any).__rrLenis`
   verletzt `@typescript-eslint/no-explicit-any` als HARTEN Fehler in `next build` (ESLint-Errors
   stoppen den Build, `npx tsc --noEmit` prueft NUR Typen, NICHT Lint-Regeln — beide muessen
   lokal laufen, nicht nur tsc!). Fix in `0c9890a`: echten Typ aus `types.d.ts`
   (`Window.__rrLenis?: import('lenis').default`) genutzt statt `as any`.

### Offen / UNKLAR
- **Soft-Snap-Stop fuehlt sich fuer Thomas weiterhin falsch/nicht vorhanden an** — Ursache nicht
  gefunden, siehe Praeambel oben. Naechster Schritt: Thomas przise fragen (welche Seite? welcher
  genaue Uebergang? passiert es bei JEDEM Scroll oder nur manchmal?), dann ggf. Debug-Overlay.
- Preis-Matrix-Fahrt (Punkt 6) und die 100vh-Bloecke (Punkt 7) sind von Thomas noch NICHT
  live abgenommen — er wurde am Ende der Session danach gefragt, Antwort steht aus.
- Mobile-Degradation der neuen Preis-Matrix-Fahrt (`isBumperDegraded()`, faellt auf normale
  Stufen-Stapelung zurueck) nur code-verifiziert, kein Geraete-Test.
- Ob das Muster "kurze Bloecke = 100vh + Stop" noch auf weitere Seiten/Komponenten ausgerollt
  werden soll, ist noch nicht final geklaert — Thomas wollte es erstmal an den 3 gezeigten
  Beispielen sehen (Preis-Matrix, Talos-Dashboard-Uebergang), bevor es site-weit generalisiert wird.

### Naechste konkrete Schritte
1. Thomas fragen: WELCHE Seite/WELCHER Uebergang stoppt beim Trackpad-Scrollen immer noch nicht?
   Am besten wieder mit durchnummerierten Screenshots wie letztes Mal (Muster hat gut funktioniert
   um das Problem einzugrenzen).
2. Falls weiterhin unklar: temporaeren Debug-Overlay in `ScrollExperience.tsx` einbauen (z.B. fixed
   kleine Box unten rechts mit `scrollY / naechstes Snap-Ziel-Top / Distanz / exempt?`), damit
   Thomas selbst live sehen kann was die Engine gerade rechnet, statt dass ich es interpretiere.
3. Preis-Matrix-Fahrt + 100vh-Bloecke: Abnahme von Thomas einholen, bei Bedarf nachjustieren.
4. Falls Abnahme positiv: Muster (100vh + Stop fuer duenne Bloecke) auf weitere Seiten ausrollen,
   wo aehnliche "Textinseln" vorkommen — noch nicht systematisch durchsucht.

### Blocker / Risiken
- Keine harten Blocker. Hauptrisiko: ohne przise Reproduktion vom Snap-Problem droht wieder
  stundenlanges Blind-Tuning von Konstanten ohne Wirkung (CATCH_RATIO wurde schon einmal verdoppelt,
  offenbar nicht die (alleinige) Ursache).

### Relevante Dateien/Befehle
- `components/relaunch/ScrollExperience.tsx` — Snap-Engine (IDLE_MS, CATCH_RATIO, SNAP_DURATION,
  insideExempt-Tail-Fix).
- `components/subpages/leistungen/website/v2/DreiStufenMatrix.tsx` — neue Mini-Fahrt + Bugfix-Beispiel.
- `components/relaunch/BackToTop.tsx` — neue Komponente.
- Lokal: `npm run dev -- --port 9000` (laeuft ggf. schon). Vor JEDEM Push: `npx tsc --noEmit`
  UND `npx eslint <geaenderte Dateien>` (nicht nur tsc — siehe Deploy-Falle oben).
- Live-Check: `vercel ls`, dann `vercel inspect --logs <url> | grep Commit` um den Deploy-Commit
  zu bestaetigen, dann v2.redrabbit.media pruefen.

## Wo wir arbeiten
- **Ordner:** `~/dev/redrabbit` — **Branch `relaunch`** (geteilt). Vor Arbeit: `git fetch` + `git log --oneline -8`.
- **Live-Test:** https://v2.redrabbit.media/ (Branch-Domain, no-store; normales Reload zeigt frisch).
  Homepage = app/relaunch-preview/page.tsx, via middleware an der Wurzel. web.redrabbit.media = alte Live-Site, TABU.
- **KANONISCH: `docs/DESIGN_STANDARD.md`** — die EINE Quelle (Farben, 2 Buttons, ( Thema )-Eyebrow,
  Abstaende, Bumper, Soft-Snap, Mobile-Regel). Herleitung: docs/handoffs/PLAN_vereinheitlichung_2026-07-28.md.

## Arbeitsmodus (von Thomas festgelegt)
- AUTONOM bis fertig: Fable orchestriert, Agenten bauen (Sonnet mechanisch, Opus komplex),
  ALLES selbst verifizieren (tsc + eslint, grep-Beweise, Browser lokal Port 9000, Live-Marker via
  `vercel inspect --logs | grep Commit`). Nicht stoppen und fragen, ausser bei echten Entscheidungen
  oder wenn ein Screenshot-Interview noetig ist um ein vages Problem einzugrenzen (hat sich diese
  Session bewaehrt: gezielte AskUserQuestion + durchnummerierte Screenshots statt raten).
- TOKEN-SPAREND: kein TaskOutput-block auf Agenten (Transkript-Dump!), auf Notifications
  warten (kostet 0), grep/curl statt Datei-Lesen, wenige gezielte Screenshots.
- Design-/Scrollfragen: NN/g-Recherche liegt vor (Soft-Snap statt hartem Trapping, nie
  Fliesstext im Snap, 1 Viewport/Panel, ein Tempo site-weit).

## Fallen (teuer bezahlt, nicht wiederholen)
- **NEU: `npx tsc --noEmit` allein reicht NICHT vor dem Push** — prueft nur Typen, nicht die
  ESLint-Regeln, die `next build` auf Vercel hart durchsetzt (z.B. `no-explicit-any`). Immer
  zusaetzlich `npx eslint <geaenderte Dateien>` laufen lassen, sonst bricht der Vercel-Build
  fuer geaenderte/neue Dateien (ist diese Session passiert, kostete einen Extra-Zyklus).
- **NEU: styled-jsx scoped strikt pro Funktionskoerper** — wenn eine Komponente eine Kind-
  Komponente rendert, greift `<style jsx>` der Eltern-Komponente NIE auf Klassen des Kindes.
  Bei mehreren Funktionen in einer Datei: das `<style>`-Tag muss in DERSELBEN Funktion stehen wie
  das JSX-Element, dessen Klasse es stylen soll — sonst lieber plain globales `<style>` (Projekt-
  Konvention ohnehin).
- **NEU: Soft-Snap-Verhalten NICHT per automatisiertem Browser-Test "beweisen" wollen** —
  siehe Memory [[feedback_scroll_snap_verifikation_unreliable]]. Kostet Stunden, liefert falsche
  Sicherheit. Code-Logik isoliert pruefen (Funktions-Rueckgabewerte an bekannten Positionen), fuer
  das gefuehlte Ergebnis IMMER auf Thomas' Live-Test warten.
- git: NUR explizite Dateien `git add` (kein `-u`/`-A`) — `docs/seo-monitor-log.md` +
  `docs/handoffs/NEXT_SESSION_leistungen.md` NICHT committen (fremd modifiziert, von einer anderen
  parallelen Session/Prozess). ~74 fremde untracked WIP-Files ebenfalls nicht anfassen.
- Dev-Server Port 9000: nach Massen-Edits ggf. korrupt (Tailwind/styled-jsx fehlen) ->
  kill + rm -rf .next + neu starten. KEIN npm run build waehrend dev laeuft. Max EIN tsc
  (8 GB RAM, Parallel-tsc = Swap-Tod).
- Browser-QA: Hintergrund-Tabs frieren rAF ein (Morphs/Lenis/Stepper wirken tot; Snap-Fahrt
  laeuft nicht) — rAF-Strecken nur im sichtbaren Tab beurteilen. Bei parallelen Sub-Agenten, die
  ebenfalls claude-in-chrome nutzen: Tab-Kollisionen moeglich (diese Session beobachtet — ein
  Hintergrund-Agent und die Hauptsession haben sich denselben Tab "geklaut"). Bei UI-Verifikation
  durch Agenten: nach Moeglichkeit sequenziell statt parallel zur eigenen Browser-Nutzung.
- **Screenshots: WIEDER auf Werkseinstellung zurueckgesetzt (29.07., diese Session)** — kein
  `location`-Default, `show-thumbnail` an, Bilder landen auf `~/Desktop`. Frueherer Stand
  (`~/Screenshots`-Ordner, `show-thumbnail=false`) war zwischenzeitlich aktiv, ist jetzt wieder
  entfernt. Bei "Claude findet Screenshot nicht": ZUERST `defaults read com.apple.screencapture`
  komplett pruefen (beide Keys!), nicht nur `location`.
- Live-Check IMMER mit `vercel inspect --logs <url> | grep Commit` GEGEN DIE COMMIT-SHA pruefen,
  nicht nur "Status Ready" — ein gruener Status kann von einem AELTEREN Commit sein, wenn der neue
  Build noch laeuft oder fehlgeschlagen ist (diese Session: ein Deploy schlug fehl, `vercel ls`
  zeigte das erst nach explizitem Nachfragen des Users).
