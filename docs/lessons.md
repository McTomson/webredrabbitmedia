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
