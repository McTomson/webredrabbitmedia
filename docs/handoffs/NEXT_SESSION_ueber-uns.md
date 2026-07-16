# NEXT SESSION — Unterseite /relaunch-preview/ueber-uns (Kopf-Skulptur + Flow)

> Stand 14.07.2026, Session-Ende. Sprache: Deutsch mit Thomas. Dev-Server:
> `npm run dev -- --port 9000` (laeuft aktuell als PID 7360, Next 15.5.19).
> ZUERST diese Datei + `docs/SKULPTUREN_REUSE.md` lesen.

## Ziel (unveraendert)
`scratchpad/ueber-uns-gesamt-demo.html` 1:1 als Next-Seite `/relaunch-preview/ueber-uns`.
Aufbau/Scroll/Story/Pinsel/Sektionen = 1:1 aus der Demo. NUR die Kopf-Skulptur wird
durch den ECHTEN Renderer der Hauptseite ersetzt (`MorphSculpture`, comp=4 = Kopf/comp5),
damit sie scharf + identisch zur `/relaunch-preview`-Startseite ist. Flow des Zerfalls/
Einflugs soll wie die DEMO sein: Fragmente fliegen VOLLBILD von allen Raendern ein,
halten als sauberer Kopf, loesen sich als Vollbild-Konfetti auf. Kuenftige Unterseiten:
jeweils ANDERE Skulptur (comp0=Zahnraeder,1=Gluehbirne,2=Dokument,3=Chart,4=Kopf).

## Dateien (ALLE noch UNTRACKED/uncommittet)
- `app/relaunch-preview/ueber-uns/page.tsx` — Server-Comp, liest Demo-Teile beim Build.
- `components/subpages/UeberUnsDemoClient.tsx` — 'use client'. Injiziert CSS via `<style>`,
  Body via `dangerouslySetInnerHTML` (useMemo-STABILER Container!), Engine als echtes
  `<script>`; portalt `<MorphSculpture comp={4}/>` in `.main-sticky` (rAF-Retry fuers Ziel).
- `components/subpages/MorphSculpture.tsx` — wiederverwendbarer Renderer (nutzt stage.ts).
- `components/subpages/ueber-uns-demo/{demo.css, demo.body.html, demo.engine.jstext}`.
- `app/sculpture-test/page.tsx` — QA-Route `?comp=0..4`, Slider setzt `window.__sculptProgress`.
- `docs/SKULPTUREN_REUSE.md` — Rezept + Scatter-Doku.

## Was gesichert funktioniert (in Chrome-MCP auf :9000 verifiziert)
- Port 1:1 laeuft; Engine bootet (placeUeDots-Crash gefixt: Guard gegen NaN-fontSize).
- Portal rendert 175 comp5-Fragmente in `.main-sticky` (1 Navy-Balken + 174 rot).
- Vorschau-Chrome ausgeblendet (`.demobar/.hint/.autobtn/.cursor-dot { display:none }` in demo.css).
- Vollbild-Scatter: jedes Fragment startet knapp offscreen am NAECHSTEN Viewport-Rand
  (Slot in Richtung `fromX-x,fromY-y` verlaengert), fliegt gestaffelt herein. Auflösung =
  Vollbild-Konfetti. Verifiziert per Screenshot.
- Opacity-Gating: geparkte/ausgeflogene Fragmente `visibility:hidden` (bei progress 0:
  0 sichtbare Fragmente, Seitenanfang sauber weiss).
- Halte-Plateau: progress 0.5–0.6 = voll zusammengebaut -> Kopf haelt sauber waehrend
  Story-Text scrollt.

## BEWIESEN (aus dem Code, nicht geraten)
Der GEHALTENE Kopf ist mathematisch identisch zur Hauptseite:
- `stage.ts` `atTimeline()`: `slot = {x:X(jp.x,s), y:Y(jp.y,s), rot:jp.rot, scale:slotScale}` —
  rein deterministisch aus dem JSON, KEIN RNG. Szenen-Layout-Offset nutzt `c.pieces`
  (nicht den Pool). Also unabhaengig von der Pool-Zusammensetzung.
- `HomeMorph.tsx` Z.170-174 baut comp-Fragmente Zeile-fuer-Zeile GENAUSO wie MorphSculpture
  (`<svg viewBox=-w/2..><g scale(sign)><path d=jp.d>`). Nur Wortmarken-Teile (else-Zweig)
  unterscheiden sich, die betreffen den Kopf nicht.

## GELOEST 15.07. nachts — Runde 3 (Thomas-Video "fehler 12.mov")

1. **Fixe Zeichen-Gruppe (8 Teile) poppte auf und blieb:** comp5-Teile 13,20,22,24,26,
   28,30,32 haben `entryT==arriveT==0` + `ip>0` ("Reveal am Slot" — auf der Hauptseite
   erscheinen sie einfach, der Austausch-Partner verdeckt es). Im Scatter -> degeneriertes
   Fenster -> Sofort-Sprung auf den Slot. Fix (MorphSculpture): synthetisches Flugfenster
   `e2 = ip/displayFrames`, `a2 = e2+0.35`.
2. **Malen wiederhergestellt:** `.layer-base display:none` (mein Runde-2-Fix) war zu grob —
   toetete den Gooey-Paint-Reveal. REVERTIERT. Navy-Flash richtig gefixt: `data-active="0"`
   im HTML, Engine-Boot setzt `1` -> `mask:url(#mask-v1)` greift erst, wenn das masksvg
   (steht im HTML NACH dem Deck) sicher geparst ist. Flash-Mechanik: Streaming-Parse mit
   noch fehlender Mask-Referenz = leere Maske = Deck unsichtbar = Navy blitzt.
3. Verifiziert (Chrome-MCP): Malen enthuellt Botschaft; Start weiss; progress 0.1 ohne
   Fix-Cluster; Halt 167/167. tsc gruen.

## GELOEST 15.07. frueh — DREI weitere echte Ursachen (nach Thomas-Re-Test)

Der 14.07.-Fix unten war notwendig, aber NICHT hinreichend. Thomas' Re-Test zeigte
drei verbliebene, ECHTE Bugs — alle gefunden und browser-/maschinell verifiziert:

1. **Kopf hatte 8 falsche Extra-Teile:** stage.ts gibt Teilen mit endlichem
   Sichtbarkeitsfenster (`op < displayFrames`, Reveal-Austauschpaare 13/14, 20/21,
   22/23, 24/25, 26/27, 28/29, 30/31, 32/33) ein `o->0`-Segment; HomeMorph wendet
   `st.o` an (Z.226), MorphSculpture ignorierte `o` -> 8 Phantome doppelt gestapelt.
   Fix: build() filtert Teile mit `sampleTimeline(tl,uHold).o<=0.001` raus (167 statt
   175). MASCHINELL BEWIESEN: Hauptseite 167 sichtbare vs Subpage 167, Median-
   Positionsabweichung 0.08px (Signatur-Vergleich via localStorage, centroid-normiert).
2. **Fragmente "poppten" mitten im Bild auf:** Hauptseite scrollt via Lenis
   (lerp 0.075) -> u springt nie; die Demo-Engine folgt dem ROHEN Scroll -> bei
   Radticks teleportierten Fragmente. Fix: MorphSculpture glaettet den Anzeige-
   Fortschritt selbst (shownP lerp 0.09/Frame, Snap bei <0.0004; erster Frame direkt).
3. **Navy-Flash beim Laden:** `.layer-base` (navy + Blabla-Satz) blitzte vor dem
   Engine-Boot auf. Engine liest layer-base nie -> `display:none !important` in
   demo.css (Thomas-Entscheidung 15.07.: blauer Intro RAUS).

GIF des verifizierten Ablaufs: ~/Downloads/ueber-uns-kopf-flow.gif. tsc gruen.

## GELOEST 14.07. abends (Folgesession) — BEIDE Probleme hatten EINE Doppel-Ursache

1. **Doppel-Kopf:** `#headSvg` (Demo-Naeherungs-Kopf, 175 Fragmente) war NIE ausgeblendet —
   der Kommentar in UeberUnsDemoClient behauptete es nur. Demo-Kopf + MorphSculpture-Portal
   renderten GLEICHZEITIG (350 Fragmente) -> "dicht/unscharf/fremde Teile". Fix:
   `#headSvg { display:none !important; }` in demo.css (Engine-Guard in measureHeadStarts
   faengt das 0x0-Rect ab).
2. **"Thomas sieht keine Veraenderung":** page.tsx las demo.css/body/engine via
   `fs.readFileSync` auf MODULEBENE — Next watched fs-Reads nicht, ALLE Edits an demo.*
   (inkl. der Fix-Runden der Vorsession am Progress-Mapping!) blieben im laufenden
   Dev-Server unsichtbar. Fix: Reads in die Komponente verschoben (pro Request in Dev,
   Build-Zeit in Prod unveraendert).
3. Browser-verifiziert (Chrome-MCP, :9000): Start weiss/sauber, Einflug Vollbild-Streu,
   Halt = pixelgleich zur Hauptseite (Screenshot-Vergleich gleicher Viewport), Aufloesung
   Konfetti, danach sauber. Blauer Intro taucht im Desktop-Flow nirgends mehr auf.
4. QA-Falle: MCP-Tab im HINTERGRUND -> Chrome pausiert rAF -> Engine steht, __sculptProgress
   bleibt 0. Vor Scroll-QA Tab per osascript in den Vordergrund holen.

## OFFENE PROBLEME (HISTORISCH — Stand vor der Folgesession, siehe GELOEST oben)

### 1. Thomas sieht KEINE Veraenderung / Kopf wirkt "dichter, nicht identisch zum Original"
Thomas' Kernbeschwerde ueber mehrere Runden: der ueber-uns-Kopf wirke dichter / "zu viele
Teile" / unscharf, NICHT identisch zum Hauptseiten-Kopf (seine Bilder 127=Original sauber
vs 128=meins dicht). Meine Fixes (Gating+Plateau) haben Lugen + Mid-Transition-Dichte
behoben, aber den HALTE-Kopf NICHT veraendert (der war schon = Hauptseite). Darum sagt
er evtl. "keine Veraenderung".
- MOEGLICHKEIT A: Er vergleicht Mid-Transition-Frames (jetzt durch Plateau besser) — dann
  ist es geloest und er muss HART neu laden (Cmd+Shift+R; Browser-Cache).
- MOEGLICHKEIT B: Es gibt doch einen echten subtilen Unterschied. TODO neue Session:
  RIGOROSER PIXEL-DIFF. `/relaunch-preview` comp5 im Halt vs `/sculpture-test?comp=4`
  bei `window.__sculptProgress=0.55`, gleiche Viewport-Groesse, uebereinanderlegen.
  Verdaechtig: MorphSculpture-Pool LAESST die 18 Wortmarken-Teile WEG (HomeMorph hat sie).
  JSDoc behauptet das aendere die comp-Timelines nicht — EMPIRISCH gegenpruefen (einmal
  MorphSculpture-Pool mit 18 Dummy-Wortmarken-Teilen davor bauen und Halt vergleichen).
  Wenn identisch -> A stimmt; wenn anders -> Pool-Reihenfolge/Index ist die Ursache.

### 2. Blauer Start (Thomas-Entscheidung noetig)
Hero startet mit navy Ebene (`layer-base`, `--navy #1c2837`, Text "Gibt es die ueberhaupt:
eine Agentur ohne Blabla?"), dann wird die weisse `layer-deck` mit "Ueber uns" aufgedeckt.
Ist so in der Demo. Thomas nennt es Bug. Frage an ihn: (A) blauen Intro RAUS, Start direkt
weiss, oder (B) behalten, nur Uebergang glaetten. NOCH NICHT beantwortet.

## Technik: MorphSculpture-Scatter (fuer Weiterarbeit)
- build(): pro Fragment `hold = sampleTimeline(timelines[i], uHold)`;
  `off` = hold entlang `(fromX-x, fromY-y)` bis knapp ueber naechsten Viewport-Rand
  (Kamera-projiziert, `camHold = cameras[comp](uHold)`), Rand-Puffer
  `+ max(p.w,p.h)*fromScale + 160`; `spin = fromRot-rot`, `fscale = fromScale`,
  `e2/a2 = entryT/arriveT` (auf [0,1] normiert wie Demo normalizeEntry).
- render(): `assembleT=clamp(p/0.5)`, `dissolveT=clamp((p-0.6)/0.4)`, Halte-Band 0.5–0.6.
  Lerp hold<->off mit easeOutCubic; `visibility:hidden` wenn geparkt (e==0 assemble)
  bzw. ausgeflogen (e==1 dissolve). Kamera fix im Halt (kein Schwenk beim Scatter).
- Engine-Mapping (demo.engine.jstext): `__sculptProgress = bB>0 ? 0.55+bB*0.45 : aA*0.55`
  (0..0.55 = Zusammenbau, 0.55..1 = Aufloesung; haelt bei 0.55 waehrend Story-Text).

## QA-Hinweise
- Chrome-MCP funktioniert (tabs_context -> navigate -> computer/javascript_tool).
- agent-browser war kaputt (schwarze Screenshots).
- VORSICHT: schwere `javascript_tool`-Evals mit `requestAnimationFrame`-Schleifen FRIEREN
  den Renderer ein (CDP-Timeout 45s). Nur EINZELmessungen mit `setTimeout`.
- Betriebsregeln Thomas: KEINE auto-Kontext-Kompaktierung ohne Erlaubnis; nie raten, immer
  im Browser/Code nachschauen; commiten/deployen/auto-play erlaubt.

## Erste Schritte neue Session
1. `npm run dev -- --port 9000` sicherstellen; Thomas HART neu laden lassen (Cache).
2. Pixel-Diff Halt Hauptseite vs sculpture-test (Problem 1) — Ursache empirisch klaeren.
3. Thomas A/B fuer blauen Start fragen (Problem 2).
4. Dann committen (Conventional Commit), sobald Kopf abgenommen.
