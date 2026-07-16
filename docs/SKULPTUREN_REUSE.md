# Skulpturen der Hauptseite sauber auf Unterseiten uebernehmen

> Stand 14.07.2026. Zweck: verbindliches Rezept, wie die Fragment-Skulpturen der
> Startseite (`/relaunch-preview`) 1:1 auf Unterseiten wiederverwendet werden —
> auf jeder Seite eine ANDERE Skulptur. Diese Datei existiert auch, damit der
> Stand eine Kontext-Kompaktierung ueberlebt.

## Die 5 Skulpturen (comp-Index)

Datenquelle je Skulptur: `lib/relaunch/morph/at-shapes-comp{1..5}.json` (Feld `pieces`,
je ~40-175 Fragmente). Index in `COMPS = [comp1..comp5]` (stage.ts):

| Index | comp | Motiv | Fragmente |
|---|---|---|---|
| 0 | comp1 | Zahnraeder (Webdesign) | 129 |
| 1 | comp2 | Gluehbirne (Google) | 173 |
| 2 | comp3 | Dokument | 163 |
| 3 | comp4 | Chart | 42 |
| 4 | comp5 | Kopf (KI) | 175 |

## Kernbefund (gecheckt, nicht geraten)

Die alte Demo (`scratchpad/ueber-uns-gesamt-demo.html`, portiert nach
`components/subpages/ueber-uns-demo/*`) zeichnet die Skulptur mit einer EIGENEN,
NACHGEBAUTEN Maschine — NICHT mit dem Code der Hauptseite. Darum weicht sie ab
(Groesse, Ueberlappungen, Sauberkeit, Navy-Teil, Hintergrund).

Die Fragment-DATEN sind identisch (byte-genau: Demo-`COMP5` == `at-shapes-comp5.json`).
Der Unterschied liegt allein im RENDERER:

| | Hauptseite (`HomeMorph.tsx` + `stage.ts`) | Demo-Nachbau (`demo.engine.jstext`) |
|---|---|---|
| DOM | pro Fragment ein eigenes `<div><svg viewBox="-w/2 -h/2 w h" preserveAspectRatio="none">` | alle Fragmente in EINEM `<svg viewBox="120 110 770 910">` |
| Groesse je Teil | `slotScale = jp.w*|sx|*k / p.w` (exakt normiert auf `jp.w*|sx|*k` px) | roh `scale(sx)` im geteilten viewBox |
| Gesamtgroesse | `kBase = min(vw/1920, vh/1080)` **× Camera-Zoom** (comp5: 1.35) | svg auf `86vh` gefittet, KEIN Camera-Zoom |
| Schaerfe | Normierung: Element bei MAX-Timeline-Scale rendern, CSS nur runterskalieren | keine |
| Navy-Teil | berechnet: groesstes Seitenverhaeltnis `max(W/H,H/W)`, `W=w*|sx|,H=h*|sy|` -> genau EIN Teil `#1c2837` | war hart `EYE=26` (falsch), inzwischen auf Index 1 gepatcht |
| hidden | echtes `hidden`-Feld (comp5: leer) | hatte erfundenes `HIDE={27}` |
| Hintergrund | `--rr-paper: #ffffff` (Weiss) | `--offwhite: #f6f5f1` (Grau-Weiss) — falsch, soll #ffffff sein |

Konkret nachgerechnet (comp5): Fragmente 1, 26, 27 sind drei fast gleiche Balken
im Stirnbereich (1 und 27 je 41×105, nur 64px auseinander). Die Demo versteckte 27,
weil ihre Maschine sie haesslich stapelt. Die Hauptseite packt 27 via `slotScale`+Camera
sauber ein. -> Der Matsch entsteht durch die Demo-Maschine, nicht durch die Daten.

## Das echte Render-Rezept (aus HomeMorph.tsx, verbatim uebernehmen)

Pro Skulptur `comp` (= `COMPS[index]`):

1. Navy-Index bestimmen:
   `asp(jp) = max(W/H, H/W)` mit `W=jp.w*|sx|, H=jp.h*|sy|`; `navyIdx = argmax` (bei
   Gleichstand kleinster Index).
2. Pro Fragment `jp`:
   - Basisgroesse `elW=jp.w*|sx|*kBase`, `elH=jp.h*|sy|*kBase`, `kBase=min(vw/1920,vh/1080)`.
   - Element-HTML:
     `<svg width="100%" height="100%" viewBox="${-jp.w/2} ${-jp.h/2} ${jp.w} ${jp.h}" preserveAspectRatio="none"><g transform="scale(${sx<0?-1:1} ${sy<0?-1:1})"><path d="${jp.d}" fill="${idx===navyIdx?'#1c2837':'#F12032'}"/></g></svg>`
   - Element-CSS: `position:absolute;left:50%;top:50%;width:${p.w}px;height:${p.h}px;margin-left:${-p.w/2}px;margin-top:${-p.h/2}px`.
3. Schaerfe-Normierung: pro Fragment ueber die Timeline den MAX `scale` bestimmen; wenn `m>1`,
   alle Timeline-Scales durch `m` teilen und `p.w*=m; p.h*=m` (bei groesster Nutzung rendern,
   CSS skaliert nur runter).
4. Layout/Bewegung via `stage.ts`: `buildStagePlan(pool, {w,h})` -> `timelines`, `cameras`.
   Pro Frame: `st=sampleTimeline(timeline,u); el.transform=translate(st.x,st.y) rotate(st.rot) scale(st.scale)`.
5. Camera pro Szene: ein Wrapper-`<div>` je Szene; `c=cameras[s](u); wrap.transform=translate(c.tx,c.ty) scale(c.k)`.

## Zerfall/Einflug: Demo-Vollbild-Scatter (Thomas 14.07.)

Wichtig fuer ALLE Unterseiten: der gehaltene Zustand kommt aus stage.ts
(hauptseiten-identisch), aber Einflug UND Aufloesung folgen der DEMO-Choreografie,
NICHT stage.ts. stage.ts laesst die Fragmente aus geclusterten `fromX/fromY`
einfliegen (enge Diagonale) — Thomas hat das abgelehnt. Richtig ist der
Vollbild-Streu-Zerfall: jedes Fragment startet knapp OFFSCREEN am naechsten
Viewport-Rand (Slot in Einflug-Richtung `fromX-x, fromY-y` verlaengert) und fliegt
gestaffelt (`entryT..arriveT`, auf [0,1] normiert) herein. Umgesetzt in
`MorphSculpture.tsx` (build(): pro Fragment `hold` via sampleTimeline(uHold) +
`off` via Rand-Projektion mit fixer Halte-Kamera; render(): progress->aA/bB,
lerp hold<->off wie Demo `renderHead`). Kamera bleibt beim Scatter fix im
Halte-Zustand (Kopf baut sich an Ort und Stelle zusammen).

## Plan fuer Unterseiten (beschlossen 14.07.)

- Die Demo liefert Aufbau/Scroll/Story/Pinsel/Sektionen 1:1 (approved). NUR die
  Skulptur-Zeichnung wird durch den echten Renderer ersetzt.
- Ein wiederverwendbares Modul rendert `COMPS[index]` exakt wie oben, getrieben vom
  Scroll-Fortschritt der Demo (Einflug -> Halten -> Aufloesen). Pro Seite anderer Index.
- Hintergrund der Unterseiten: `#ffffff` (nicht #f6f5f1).

## WICHTIG (Betriebsregeln, Thomas 14.07.)

- KEINE automatischen Commits/Deploys/Auto-Play. Thomas entscheidet jeden Schritt.
- "compounden" = automatische Kontext-Kompaktierung; Stand darum hier persistiert.
- Nicht raten — checken (Code lesen, Werte nachrechnen, QA per Screenshot).
