# Naechste Session — Website-Hero Canvas-Reveal (Stand 2026-07-31 abends)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/Browser/Docs). Bei Unsicherheit fragen oder fail-closed.
- Erst Plan, dann ausfuehren. Laufend im Browser testen.
- Autonom, voller Browser-Zugriff. commit/push/deploy zwischen Schritten (Thomas will das).
- Nichts als "fertig" melden ohne verifiziertes Ergebnis.

## ERLEDIGT diese Session: Canvas-2D-Reveal (Commit 9be8372, gepusht)
Der Hero-Mal-Reveal von `/leistungen/website` laeuft auf Mobile/Tablet (innerWidth<=1024)
jetzt ueber **Canvas-2D** statt SVG-Maske (iOS-Fix, Thomas' Option 3). Desktop (>1024)
bleibt bei der SVG-Maske.

**Wie:** Die Engine setzt bei schmalem Viewport die Klasse `.canvas-reveal` auf
`.main-sticky`. CSS reagiert (eine Wahrheitsquelle): SVG-Maske aus, `.layer-deck`
Hintergrund transparent. Ein `<canvas.reveal-canvas>` (z-index 1, zwischen layer-base
navy und layer-deck Titel) fuellt off-white und erasiert per
`globalCompositeOperation="destination-out"` weiche Radial-Gradient-Loecher an den
Pinsel-Positionen -> layer-base (navy + Satz "Schoen kann fast jeder...") scheint durch.
KEIN `ctx.filter` (auf iOS unzuverlaessig) -> Radial-Gradients bilden den Gooey-Look nach.
`revealFade` (aus applyMain) heilt die Loecher beim Wegscrollen exakt wie die SVG-Maske.

**Verifiziert (Emulator + Unit):**
- Erase-Technik: destination-out radial -> Pixel von off-white(244,244,242,255) auf (0,0,0,0). OK.
- Layering: mit ausgeblendetem Canvas erscheint der navy layer-base + Satz voll & korrekt
  positioniert, KEIN dunkler Balken. OK.
- Desktop-Regression: ohne Klasse bleibt `mask:url(#mask-v1)` aktiv, Deck off-white. OK.
- Graceful degrade: getContext scheitert -> Klasse weg, SVG-Pfad greift wieder.

**NICHT im Emulator verifizierbar (Lesson):** die ANIMIERTE Bewegung. Der Automations-Tab
laeuft mit `visibilityState:"hidden"` -> `requestAnimationFrame` pausiert -> Partikel
wachsen nie. Auf einem SICHTBAREN Geraet laeuft rAF normal. Debug am Geraet:
`window.__revealDiag()` (Partikel-Zahl/fade/painting/useCanvas) in der Safari-Konsole.
Canvas-Pfad auf beliebigem Geraet/Emulator erzwingbar: `localStorage.setItem('rrCanvasRevealBP','2000')`
+ Reload (sonst Schwelle 1024). Zum Zuruecksetzen `removeItem`.

## OFFEN — ZUERST: Geraete-Verifikation mit Thomas
Thomas soll auf seinem iPhone `/leistungen/website` (v2.redrabbit.media) oeffnen und
Screenshot/Video schicken: Deckt die Auto-Malanimation jetzt den Satz auf? Ist der dunkle
Balken weg? Malt der Finger? Wenn JA -> fertig. Wenn NEIN -> `window.__revealDiag()`-Ausgabe
holen und den **Video-Fallback** bauen (Option 3 Punkt 2, siehe unten). NICHT vorab bauen.

### Video-Fallback (nur falls Canvas am Geraet scheitert — bewusst zurueckgestellt)
Der Canvas-Pfad nutzt nur universell iOS-sichere APIs (Canvas-2D, destination-out,
Radial-Gradient) -> sollte laufen. Falls doch nicht: autoplay/muted/playsinline-Video der
Desktop-Animation aufnehmen (agent-browser Frames -> ffmpeg -> webm/mp4) und im Canvas-Modus
statt/ueber dem Canvas einblenden. Umschalt-Hook: an die Stelle, wo getContext scheitert,
ODER eine leichte "hat der Canvas je erasiert?"-Pruefung.

## DANACH (weitere "grundlegende Dinge", Thomas bestaetigt)
- **CSS-Scroll-Snap** pro Sektion, Mobile/Tablet: fester Stopp am ANFANG jeder Sektion
  (`scroll-snap-type:y mandatory` + `scroll-snap-align:start` + `scroll-snap-stop:always`),
  lange Sektionen frei scrollbar. Desktop-Snap ist Rad-basiert (ScrollExperience.tsx onWheel)
  und greift auf Touch NICHT -> CSS-Scroll-Snap ist der Touch-Weg. Effekt-Sektionen behalten
  ihre Animation, Snap faengt nur den Anfang.
- **Vollbild-Sektionen** auf Mobile: aktuell schalten nur ReferenzenTeaser.tsx / SiteClosing.tsx
  Vollhoehe unter 820px; Content-Sektionen haben nie 100vh. Hebel dort.
- Dann auf weitere Seiten + Homepage ausrollen (Homepage auch = Thomas bestaetigt).

## Relevante Dateien
- `components/subpages/website-demo/demo.engine.jstext` — Canvas-Reveal: CANVAS_BP/useCanvas
  (~Z.45), fitMask Canvas-Sizing (~Z.86), initFluid Canvas+drawReveal (~Z.256), Particle-Umbau,
  loop drawReveal-Call, applyMain revealFade (~Z.571), boot useCanvas+Klasse (~Z.821).
- `components/subpages/website-demo/demo.css` — `.reveal-canvas`, `.canvas-reveal`-Regeln,
  Desktop-Maske jetzt `:not(.canvas-reveal)` gegated (~Z.100).
- `components/subpages/WebsiteDemoClient.tsx` — React-Wrapper (unveraendert).
- `app/relaunch-preview/leistungen/website/page.tsx` — liest die 3 demo-Dateien pro Request.

## Deploy
Push triggert Preview-Build (git-relaunch-Alias). v2.redrabbit.media ist MANUELLER Alias ->
nach "Ready": `vercel alias set <ready-deploy-url> v2.redrabbit.media`. NUR eigene Dateien
committen (fremde WIP im Tree: faq/page.tsx, SiteClosing.tsx, faq-demo/demo.body.html u.a.).
