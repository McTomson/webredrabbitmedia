# Naechste Session — TALOS (Desktop-3D-Ladeproblem + Mobile/Tablet-Feinschliff)

## Arbeitsregeln (verbindlich)
- Lies ZUERST: diesen Handoff, MEMORY.md (Eintrag project_talos_kommandozentrale_pivot_2026_08_07), betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — verifizieren (Code/Browser/curl/Docs). Bei Unsicherheit fragen oder fail-closed.
- Geteilter Branch `relaunch`: `git fetch` zuerst; NUR eigene Dateien mit EXPLIZITEM Pfad stagen (NIE `git add .`/`-u`). ACHTUNG UNTRACKED-WIP-FALLE (diese Session passiert!): `TalosChoreoStage.tsx` + `TalosApproachStage.tsx` sind UNTRACKED WIP (importieren untracktes `talosMoodMotion.ts`) — committet man sie versehentlich, BRICHT der Vercel-Build ("Cannot find module ./talosMoodMotion"). Vor jedem Commit `git status --short` pruefen, dass keine `??`-Datei in den `git add` rutscht. Fremde WIP nie anfassen: app/relaunch-preview/faq/page.tsx, components/relaunch/SiteClosing.tsx, components/subpages/faq-demo/demo.body.html, docs/handoffs/NEXT_SESSION_leistungen.md, docs/seo-monitor-log.md.
- Keine Emojis; echte Umlaute in User-Content, ASCII in Shell/Commit/Code. Kein "gratis", kein Fachjargon in sichtbaren Texten.
- Deploy: git push -> v2-Auto-Deploy. NIE `vercel --prod`. Nach Push IMMER `vercel inspect` pruefen: Status muss **Ready** sein, NICHT **Error** (Build kann brechen -> dann liefert v2 den alten/kaputten Stand, 404 auf neue Assets). Kein `npm run build` bei laufendem dev.
- WICHTIG Browser-QA: der MCP/agent-Chrome hat **webgl2=false** -> laedt die 3D-Figur NICHT (reproduziert no-3D gut), FRIERT aber beim Scrollen auf der schweren Hero-Malflaeche ein (Top-Screenshot geht, tiefer nicht). Finale 3D-Abnahme = Thomas am echten Geraet.

## KERN-OFFENPUNKT (ZUERST, NOCH OFFEN): Desktop-Talos-Figur fehlt bei Thomas am Laptop
Symptom (Thomas 08./09.08.): Auf dem **Laptop/Desktop fehlt die 3D-Figur komplett** (Screenshot zeigt die Kommandozentrale/Dashboard OHNE Roboter), **am Handy laeuft Talos**. Thomas: "es war da, hat funktioniert, seit dem Mobile-Umbau weg" -> er vermutet eine **Regression aus meinem Mobile-Umbau**, nicht (nur) den Blocker. NICHT zerreden — sein Einwand ist ernst zu nehmen.

### Was diese Session gemacht + verifiziert wurde
1. **Szene same-origin** (b3e0b7b): `public/hero/talos-scene.splinecode`, alle 6 Stages laden `/hero/...` statt CDN. + CDN-Fallback (`SCENE_FALLBACK`) in TalosCompanionStage. Content-Type-Verdacht der Vorsession WIDERLEGT (Loader liest arraybuffer).
2. **WASM same-origin** (ddc6446): Der Spline-Loader holt seine 3D-Runtime (`process.wasm` aus @splinetool/modelling-wasm@1.12.98, `ui.wasm` aus @splinetool/ui-wasm@1.12.98) FEST von **unpkg.com** — die letzte Fremd-Quelle im Ladepfad. Beide wasm gespiegelt unter `public/hero/wasm/`; `lib/relaunch/splineWasmProxy.ts` = idempotenter fetch-Proxy, der unpkg->/hero/wasm umleitet. In ALLEN 6 Stages vor `new SplineLoader()` aufgerufen. Assets LIVE verifiziert (200, valides+kompilierbares wasm, aus dem v2-Seitenkontext geprueft).
3. **TEMP-Diagnose** (8ed9abc, MUSS WIEDER RAUS): `[RRTALOS]`-console.log an Gate/Load-Start/Erfolg/Fehler in TalosCompanionStage.

### Harte Code-Pruefung (git diff pre-mobile 073b89f -> HEAD)
- Der **Desktop-Hero-Pfad ist funktional IDENTISCH** vor/nach dem Mobile-Umbau. heroZFor/heroEndFracFor/HERO_MOBILE_DY greifen nur bei `vw<=1180`; auf Desktop loesen alle Zweige exakt zu den alten Werten auf (endX/halfW/writeWalkPose unveraendert).
- deviceMemory-Gate: Perf-Commit `0f031f1` hatte `isMobile || mem<=4` -> spaeter entschaerft auf `mem<=4 && innerWidth<900` (61c8c73). Desktop wird nur noch von `!webgl2` abgeschaltet. Also KEINE Desktop-Regression im Gate gefunden.
- Lazy-Wrapper (`TalosCompanionStageLazy` = `dynamic(ssr:false)`) ist desktop-sicher.
- FAZIT: Im Code KEINE offensichtliche Desktop-Regression gefunden, die die Figur ausblendet -> es haengt am **Laden** (Szene/wasm) ODER an **Positionierung** ODER die Komponente **mountet nicht**. Nur Thomas' Maschine kann das entscheiden.

### Thomas' Konsole (Laptop, wiederholt): was drin steht und was NICHT
- Drin: MetaMask + eine Wallet-Erweiterung (contentscript.js "Resetting the streams", MaxListeners-Spam), `Error: <circle> attribute r: Expected length, "NaN"` (x37-45), CSP blockt `vercel.live/_next-live/feedback.js` (Preview-Overlay, irrelevant), CSS-Preload-Warnung. Seiten-CSP HAT `'unsafe-eval'` -> wasm NICHT per CSP blockiert.
- NICHT drin: KEIN blockierter spline.design/unpkg/Szene/wasm-Request, KEIN Szene-Ladefehler. ABER: declarativeNetRequest-Blocker koennen Requests STILL abwuergen (ohne Konsolen-Fehler) -> Abwesenheit beweist nichts.
- `<circle> r NaN` = separater kosmetischer Bug aus `components/relaunch/LighthouseCarousel.tsx:51` (`r={radius}`, radius wird NaN), verwendet in `CasePanels.tsx`. NICHT die Ursache der fehlenden WebGL-Figur. Getrennt fixen (radius/size gegen NaN guarden).

### ERSTER SCHRITT NAECHSTE SESSION (bevor irgendwas anderes)
Thomas kann KEINE Konsolen-Snippets tippen ("hab keine Ahnung wie das geht"), aber er KANN die Konsole kopieren+einfuegen. Die `[RRTALOS]`-Logs sind DAFUER live deployt (8ed9abc). **Thomas bitten: Talos-Seite Cmd+Shift+R, 3s warten, ganze Konsole schicken.** Dann die `[RRTALOS]`-Zeilen lesen — sie sagen EINDEUTIG:
- `gate {webgl2,mem,w,lowMem,stationsOnly}` -> kann sein Browser 3D? schlaegt ein Gate zu?
- `WebGL ok -> lade 3D-Szene` + `loader.load START url=/hero/... (same-origin)` -> Loader laeuft an.
- `Szene GELADEN -> Talos wird gebaut` -> Laden OK => dann ist es **Positionierung/Sichtbarkeit** (Talos rendert, aber unsichtbar/ausserhalb) -> Positionierung auf seinem konkreten Viewport pruefen.
- `loader.load FEHLER url=... err=...` -> **hier haengt's**, mit Fehlermeldung (wasm? Netzwerk? Parsing?).
- `beide Quellen weg -> Dashboard-Fallback` -> Szene UND CDN weg (Blocker greift trotz same-origin? dann tiefer graben, evtl. blockt Blocker breiter).
- **GAR KEINE `[RRTALOS]`-Zeile** -> die Komponente mountet nicht (Lazy-Chunk-Fehler / Error-Boundary) -> dort ansetzen.
Je nach Ergebnis gezielt fixen. **DANACH die RRTALOS-console.logs wieder entfernen (Revert der Diagnose-Zeilen in 8ed9abc).**

### Falls Thomas' Konsole nicht reicht: echten WebGL-Browser nutzen
Der MCP/agent-Chrome hat `webgl2=false` -> kann die 3D-Figur NIE rendern (zeigt immer Dashboard-Fallback, NICHT repraesentativ). Fuer eine echte visuelle Abnahme einen WebGL-faehigen Browser suchen (agent-browser-Skill mit echtem Chrome? oder Thomas' Screenshots). Reine Netzwerk-/Asset-Checks per curl/fetch reichen NICHT fuer die Render-Frage.

## NEBENSTRANG (09.08., FERTIG + live): Preisseite umgebaut (Commit b9a6a1e)
- Buchbare Talos-Zusatz-Module RAUS: Mehrwert-Rechner (MehrwertRechner.tsx, jetzt verwaist/ungenutzt) + Fahrt-Teil der Talos-Talente entfernt. TalosTalenteFahrt.tsx = jetzt nur noch das schlanke Talos-Panel (3D-Station + Positionierung bleiben, Thomas-Entscheid "Talos behalten, nur Extras raus"). Zusatzleistungen = "auf Anfrage".
- Alle Preise "ab" (Starter ab 1.250 / Business ab 2.850 / Premium ab 4.900). "1-2 grafische Vorschlaege" statt "ein Entwurf" site-weit. 40 % Anzahlung in AGB (§2/§4, relaunch). FAQ-Preise 950/2.900 -> 1.250/2.850 (chirurgisch via git apply --cached, fremde WIP unberuehrt). Entscheidung in brand/decisions-log.md (2026-08-08).
- OFFEN/FLAG: LIVE-Legacy-AGB `app/agb/AGBClient.tsx` hat die 40 %-Klausel NICHT (bewusst nicht angefasst = sofort geltende Rechtstexte). Mit Thomas klaeren, ob nachziehen. Kosmetik: `<circle> r NaN` in LighthouseCarousel/CasePanels guarden.

## Stand Mobile/Tablet (frueher, live v2) — was der Mobile-Umbau geaendert hat
- **Mobile/Tablet-Hero** (TalosCompanionStage): heroZFor (Handy <=700 z=-1700 kleiner, Tablet <=1180 -400, Desktop -130 unveraendert), heroEndFracFor (Handy 0.42 = rechts), HERO_MOBILE_DY -55 (tiefer, auch im Stations-Fallback wg. Y-Pop), gespiegelte Stand-Haltung (standBias), Winkhand mobil "other". Walk-in bleibt auf allen Geraeten.
- **Handy/Tablet Mal-Reveal RAUS** (demo.engine.jstext): der navy "Zeichenbrett-Schwung" war der Inhalt des Videos talos-hero-mobile.mp4 (Mal-Reveal). Auf Touch (noHover) jetzt KEIN Video + KEIN Auto-Malen; layer-base ausgeblendet; off-white Deck + Titel, dann Story. Poster-img + Preload entfernt. Desktop-Live-Malen unberuehrt.
- **Kontrollraum mobil** = gepinnte Pan-Szene (Browser 200%, 3+3 Panels spaltenweise). **Faehigkeiten-Modal** mobil unter Hamburger. (Runde 1, 08.08.)
- **Scroll-Tempo** (scroll-standard.ts, alle Fahrten): BUMPER_TRACK 190->150, DWELL_WIDTH 0.2->0.32, DWELL_START 0.4->0.25; HomeMorph U_INTRO 1.6->1.0; rideUnits() = linear <=1180px (Stops raus Handy/Tablet).
- **no-3D-Fallback** (TalosCompanionStage): Dashboard scroll-gesteuert (is-dash nur wenn __sculptProgress in [P_FRAME0,P_FRAME1]), NICHT mehr dauerhaft oben angepinnt (war der Bug). deviceMemory<=4-Gate nur noch <900px (Desktop laedt 3D immer, ausser WebGL fehlt echt).
- review-it (Logic+Simplify) GO nach 1 MAJOR-Fix; Log docs/reviews/talos-hero-mobile-2026-08-08.md.

## Offen Mobile/Tablet (nach dem 3D-Ladeproblem) — am Geraet abnehmen
- Ob Talos mobil/tablet richtig kommt (Thomas: "ob er dort kommt weiss ich nicht") — nach dem Desktop-Fix am Geraet pruefen.
- Kontrollraum-Pan, Bereiche-Grids 1-spaltig, WertAnker-Tabelle, Popup unter Menue — visuelle Feinabnahme.
- Deferred MINOR (Logic-Review): heroZFor/endFrac pro Frame gelesen -> harter Sprung bei Geraete-Rotation exakt waehrend Hero-Scroll (Randfall).

## Relevante Dateien
- 3D/Loader: components/relaunch/talos/TalosCompanionStage.tsx (SCENE_URL Z.36, no3d-Zweig + startNo3dDashboard), talosMotion.ts, talosRig.ts. Weitere Stages mit SCENE_URL: TalosEntranceStage/Intro/HeroStage/Presentation/SplineDemo (+ untracked WIP Choreo/Approach — NICHT committen).
- Hero-Engine: components/subpages/talos-demo/demo.engine.jstext (noHover-Zweig), demo.body.html, demo.css.
- Scroll: lib/relaunch/scroll-standard.ts. Sektionen: components/subpages/leistungen/talos/v2/*.
- Dev: `npm run dev -- --port 9000`.
