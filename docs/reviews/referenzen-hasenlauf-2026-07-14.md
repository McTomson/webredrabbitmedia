# Review — Referenzen-Unterseite "Hasen-Lauf" (uncommittet, Branch relaunch)

**Date**: 2026-07-14
**Reviewer**: review-it skill, 3 parallele Agenten (Logic / Security / Simplify)
**Scope**: app/relaunch-preview/referenzen/page.tsx (neu), components/subpages/referenzen/ReferenzenLauf.tsx (neu), components/relaunch/RelaunchMenu.tsx (1 Zeile)
**Stack**: ui (Next.js 15 App Router, Canvas-Scroll-Scrub)
**Verdict**: CONDITIONAL -> nach Fixes GO

## Findings — Accepted (2, beide sofort gefixt)
- MAJOR — ReferenzenLauf.tsx (resize-Setup): iOS-Adressleisten-Kollaps aendert 100dvh ohne zuverlaessiges window-resize-Event -> Canvas-Backing-Store desynct von der Buehne. Fix: zusaetzlicher `window.visualViewport.resize`-Listener (+ Cleanup). (Logic, Konfidenz 80)
- MINOR — ReferenzenLauf.tsx (Cleanup): ImageBitmap-Erkennung per Duck-Typing + doppeltem `as`-Cast. Fix: `f?.img instanceof ImageBitmap`. (Simplify)

## Findings — Rejected (0)

## Findings — Deferred (1, informativ)
- Logic (Konfidenz ~60, unter Schwelle): Karten-vh-Positionen sind gegen das DESKTOP-Frame-Timing getunt; Mobile-Sequenz (/m/, identische Frames, nur kleiner) hat dasselbe Pacing, daher vermutlich unkritisch. Bei echtem Geraete-Test gegenpruefen.

## Explizit sauber (von Reviewern durchgetrace't)
- Security: 0 Findings (v-Param = geschlossene Enum-Auswahl ohne Reflection; target=_blank mit noopener noreferrer; CSS-Konstanten statisch; noindex fuer Preview-Route korrekt; keine Secrets).
- rAF-Lifecycle, StrictMode-Doppel-Effekte, cancelled-Guards, ImageBitmap.close-Timing, mapProgressToFrame-Grenzen, Next-15-searchParams-Promise, reduced-motion-Hydration: alle korrekt.
- Simplify: kein totes CSS, keine ungenutzten Refs/Exports, keine Muster-Neuerfindung ggue. kontakt/preise-preview.
