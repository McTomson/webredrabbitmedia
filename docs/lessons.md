# Project Lessons

> Auto-managed by `/review-it` skill. Manual edits OK but follow format.
> Active Anti-Patterns are injected into every review's reviewer briefings.
> Accepted Tradeoffs are listed as "don't re-flag" in briefings.
> Future Considerations are matched against current diff and injected if relevant.

## Active Anti-Patterns

### L-referenzen-01 — 100dvh-Canvas ohne visualViewport-Listener
**When**: Jede Vollbild-Canvas/Buehne mit `height: 100dvh` + JS-berechneter Backing-Store-Groesse.
**Pattern to avoid**: Nur `window.addEventListener("resize", ...)` — iOS Safari feuert beim Adressleisten-Kollaps (der 100dvh aendert) nicht zuverlaessig ein window-resize.
**Why**: Canvas-Backing-Store desynct von der sichtbaren Buehne -> falsche Skalierung/Beschnitt bis zur naechsten Rotation. (Review referenzen-hasenlauf 14.07.2026)
**Check**: Bei dvh + Canvas immer zusaetzlich `window.visualViewport?.addEventListener("resize", ...)` inkl. Cleanup.

### L-referenzen-02 — Scroll-QA gegen scroll-smooth/Lenis
**When**: Browser-Automation/QA auf Seiten mit `html.scroll-smooth` oder Lenis.
**Pattern to avoid**: `window.scrollTo(...)` setzen und sofort messen — die Position wird animiert (oder von Lenis zurueckgekaempft), Messung zeigt veraltete Werte.
**Why**: Fuehrt zu falschen "Scrub kaputt"-Diagnosen. (QA referenzen 14.07.2026; Lenis-Variante schon frueher in LESSONS_LEARNED.md)
**Check**: QA-Scrolling mit echten Wheel-Events (computer scroll), danach 1-2s warten, dann messen.

### L-referenzen-03 — rAF-Animationen zeitbasiert daempfen, nie per Frame
**When**: Jede rAF-Loop mit Lerp/Damping (WebGL, Canvas, Scroll-Nachlauf).
**Pattern to avoid**: `wert += (ziel - wert) * 0.08` pro Frame — Chrome drosselt rAF in inaktiven Tabs/verdeckten Fenstern auf ~1fps, die Transition kriecht dann minutenlang (wirkt wie "haengt"); QA-Screenshots zeigen eingefrorene Zwischenzustaende.
**Why**: Sphaeren-Galerie 15.07.2026: Whiteout kehrte nach Panel-Schliessen scheinbar nie zurueck — war reine Tab-Drosselung, kein Bug.
**Check**: Daempfungen als `1 - Math.exp(-k * dt)` mit dt-Clamp; bei QA pruefen ob der getestete Tab AKTIV ist (Hintergrund-Tab = gedrosselt, Screenshots gehen trotzdem).

### L-referenzen-04 — Async-Textur-Rebuild darf Interaktionszustand nicht ueberschreiben
**When**: WebGL/Canvas-Komponenten, die Texturen nach Bild-Load neu backen.
**Pattern to avoid**: Beim Rebuild stumpf die Default-Variante zuweisen (`map = normal`), obwohl der Zustand (hovered/selected) gerade eine andere Variante zeigt.
**Why**: Logic-Review 15.07.2026: Kachel blieb nach Screenshot-Nachladen dauerhaft dunkel trotz Hover.
**Check**: Rebuild-Callbacks muessen den aktuellen Interaktionszustand beruecksichtigen (`map = i === hovered ? hover : normal`).

## Accepted Tradeoffs

### T-referenzen-01 — Karten-vh-Werte gegen Desktop-Timing getunt
**Date**: 2026-07-14
**Reviewer-Finding was**: Mobile koennte anderes Karten-vs-Tunnel-Timing haben (Konfidenz ~60).
**User-Decision**: /m/-Frames sind dieselbe Sequenz (nur kleiner), Pacing identisch; wird beim echten Geraete-Test verifiziert statt vorab umgebaut.
**Don't re-flag**: Karten-top-vh-Werte in ReferenzenLauf.tsx, solange /d/ und /m/ dieselbe Frame-Sequenz sind.

## Future Considerations

### F-referenzen-01 — Preview-Routen sind noindex
**Impact**: Beim Live-Gang des Relaunch muessen robots-Flags der /relaunch-preview/*-Seiten auf index umgestellt und Projekt-Unterseiten /referenzen/<slug> gebaut werden (Karten-Links dann von extern auf intern umstellen).
**Check**: Bei Review von Launch-Commits pruefen, ob noindex-Flags und externe Karten-Links noch Uebergangszustand sind.
**Source**: Review referenzen-hasenlauf 14.07.2026 / Memory project_referenzen_hasenlauf.

### L-referenzen-05 — Ortho-Picking muss camera.zoom einrechnen
**When**: Analytisches Picking (Screen-UV -> Weltkoordinaten) mit THREE.OrthographicCamera, wenn camera.zoom animiert wird (Intro-, Grab-, Fokus-Zoom).
**Pattern to avoid**: Weltkoordinaten nur aus camera.left/right/top/bottom rechnen — updateProjectionMatrix() skaliert den sichtbaren Frustum zusaetzlich durch zoom.
**Why**: Klicks waehrend des Intro-Zooms trafen die falsche/keine Zelle (CRITICAL, Review c399f0c).
**Check**: Jede pick/unproject-Formel gegen camera.zoom testen (Klick in der ersten Sekunde nach Mount).

### L-referenzen-06 — setTimeout-Navigation im Effect-Cleanup canceln
**When**: Verzoegertes router.push (Transition-Whiteout) aus einem useEffect-Scope.
**Pattern to avoid**: Timeout-ID nicht speichern — nach Unmount feuert push trotzdem und ueberschreibt die vom Nutzer gewaehlte Navigation.
**Check**: Jeder window.setTimeout mit Navigation braucht clearTimeout im Cleanup.

### L-leistungen-01 — Overlap-Sektionen ueber Scroll-Choreografien: transparent + hergeleitet
**When**: Eine normale Sektion soll eine Sticky-Scroll-Szene ueberlappen (margin-top negativ), wie scene-belief auf ueber-uns.
**Pattern to avoid**: Den Overlap-Wert 1:1 von einer anderen Seite kopieren UND der Sektion einen deckenden Hintergrund geben — ein weisser Block schneidet die noch laufende Choreografie (Story-Text, Figuren-Zerfall) hart ab.
**Why**: Leistungen 21.07.: -130vh von ueber-uns uebernommen, Sektion weiss -> Zahnrad wurde horizontal gekappt statt zu zerfallen. ueber-uns funktioniert nur, weil belief TRANSPARENT ist.
**Check**: margin aus den Phasen-Konstanten der Ziel-Szene herleiten (Overlap-Start = gewuenschtes Pm: margin = Pm*(H-100vh)+100vh-H) und die ueberlappende Sektion transparent halten, solange die Szene animiert.

### L-leistungen-02 — window-globale Kopplungswerte bei Mount setzen, bei Unmount loeschen
**When**: Engine und React-Komponente koppeln ueber eine window-Globale (z.B. __sculptProgress), und mehrere Seiten nutzen dieselbe Globale.
**Pattern to avoid**: Nur schreiben, nie aufraeumen — bei Soft-Navigation liest die naechste Seite den Alt-Wert der vorigen (Figur flasht in fremder Pose), bis deren Engine (hinter fonts.ready) erstmals schreibt.
**Why**: Logic-Review 21.07., LeistungenHero2Client.
**Check**: Vor Engine-Boot Startwert setzen, im Effect-Cleanup `delete window.<global>`; beim Mount nie auf fremdes Aufraeumen verlassen.

### T-leistungen-01 — Drei fast identische Demo-Clients
**Date**: 2026-07-21
**Reviewer-Finding was**: UeberUnsDemoClient / KontaktDemoClient / LeistungenHero2Client sind ~105 LOC nahezu identisch; gemeinsame Basis wuerde Duplikation halbieren.
**User-Decision**: Bewusste Duplikation — kontakt/ueber-uns sind Fremd-Straenge (Arbeitsregel: nur eigene Strang-Dateien anfassen). Konsolidierung nur, wenn ein Strang ohnehin alle drei Seiten bearbeitet.
**Don't re-flag**: Die Struktur-Duplikation der *DemoClient/*Hero2Client-Wrapper, solange die Fremd-Strang-Regel gilt.
