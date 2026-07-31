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

## STAND: Canvas-Reveal LAEUFT auf dem Geraet (bestaetigt Thomas 31.07. spaet)
Die Auto-Malanimation deckt den Satz auf dem iPhone auf (Canvas-2D war richtig, iOS-SVG-
Theorie war Nebensache — Kern war der Auto-Play-Trigger). Danach iterativ getunt (Commits
8cc1af7, 3bd305c, 99ac595): scharfe Kanten statt blurry Halo (drawReveal Radial voll bis
88% Radius), EIN durchgehender Pfad statt 3 getrennte, langsamer (DUR bis 11000ms),
wandernde Enthuellung (Blobs LIFE ~4.6s < Lauf -> hinten blendet aus), Satz groesser
(~35px, clamp(2rem,9vw,3.4rem), max-width 96vw), Pfad ueber fast den ganzen Screen
(x0.06-0.94, y0.09-0.71). Auto-Loop-Intervall 2500ms.

## GELOEST diese Session (Commit 86f99e8): scroll-getriebener Splash statt Auto-Loop
Referenz ashleybrookecs.com/about im Browser inspiziert: KEIN Finger-Malen (touch-action
auto, kein Canvas), sondern ein SCROLL-GETRIEBENER Gooey-Masken-Splash (mask url(#mask) +
filter url(#gooey), GSAP ScrollTrigger + Lenis). Genau das auf unseren Canvas-Pfad
uebertragen (Mobile/Tablet <=1024; Desktop bleibt SVG-Hover, unveraendert):
- **Reveal folgt dem Scrollen** statt Zeit: `scrollRevealA = Pm/P_PAINT` (P_PAINT=0.05 =
  erste 5% des gepinnten Scrollens). Runter = auf, hoch = zu -> ENDLOS-RUECKWEG automatisch
  (Feedback 1). Kein runAuto/autoLoop/heroFeed mehr auf Mobile.
- **Kein Vollbild-navy** (Feedback 2): der Reveal ist auf die Satz-Region begrenzt
  (`buildRevealPath` misst `.reveal-msg`, serpentiner Blob-Pfad; Raender bleiben off-white).
- **Kein schwarzer Screen beim Weiterscrollen** (Feedback 3): der bestehende `revealFade`
  heilt ueber das Budget hinaus; die Loop-Bedingung zeichnet EINE Solid-Fill-Frame beim
  Kantenfall revealFade->1 (`prevFade`) -> solide off-white, kein navy-Leck.
- Morph (Titel/Kopf/Story) hinter das Reveal-Budget geschoben (Pm-Remap in applyMain), damit
  der Titel waehrend des Splashs ruhig steht.

**Emulator-verifiziert** (scroll-getrieben -> im Hidden-Tab per Frame-Wake + Debug-Hebel
`window.__snapScroll=true` testbar, umgeht die smPm-Glaettung): a=0 off-white/Satz versteckt,
a=0.5 progressiver Mal-Wisch ueber den Satz, a=1 voll aufgedeckt mit Gooey-Kante, danach
solide off-white ohne navy-Leck. Diag: `window.__revealDiag()` liefert jetzt {a, fade,
pathLen, ...}. Der Emulator klemmt bei 1788px (Fenster-Mindestbreite) -> ECHTES Mobile-
Layout (Satzgroesse/-position) verifiziert Thomas am Geraet.

### Naechster konkreter Schritt: am Geraet bewerten + tunen
- P_PAINT=0.05 (Reveal-Budget) ggf. anpassen, wenn der Splash zu lang/kurz scrollt.
- buildRevealPath-Abdeckung (rows=3, cols=8, r-Faktor 0.78, padY 0.34) ggf. an die echte
  Mobile-Satzbox angleichen, falls Raender zu viel/zu wenig navy zeigen.

### Video-Fallback (NICHT noetig — Canvas laeuft; nur als Notnagel dokumentiert)
autoplay/muted/playsinline-Video der Desktop-Animation, falls je noetig. Aktuell obsolet.

## DANN: dieselbe Animations-Umstellung auf ALLEN anderen Seiten (Thomas: "da ist auch
ueberall das Problem"). Alle Seiten, die den Website-Demo-Hero-Mechanismus ODER die
SVG-Masken-Reveal-Technik nutzen (MorphSculpture/SubpageHero-Heroes der Unterseiten:
/leistungen, /leistungen/website, /preise, /ueber-uns, /kontakt, ...), muessen mobil auf
den iOS-sicheren Canvas-Reveal + die getunte Animation (Endlos-Ping-Pong, kein Full-Cover,
sauberes Scroll-Cleanup) umgestellt werden. Erst /leistungen/website fertig machen, dann
Muster ausrollen.

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
