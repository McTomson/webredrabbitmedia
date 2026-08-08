# Naechste Session — TALOS (Desktop-3D-Ladeproblem + Mobile/Tablet-Feinschliff)

## Arbeitsregeln (verbindlich)
- Lies ZUERST: diesen Handoff, MEMORY.md (Eintrag project_talos_kommandozentrale_pivot_2026_08_07), betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — verifizieren (Code/Browser/curl/Docs). Bei Unsicherheit fragen oder fail-closed.
- Geteilter Branch `relaunch`: `git fetch` zuerst; NUR eigene Dateien mit EXPLIZITEM Pfad stagen (NIE `git add .`/`-u`). ACHTUNG UNTRACKED-WIP-FALLE (diese Session passiert!): `TalosChoreoStage.tsx` + `TalosApproachStage.tsx` sind UNTRACKED WIP (importieren untracktes `talosMoodMotion.ts`) — committet man sie versehentlich, BRICHT der Vercel-Build ("Cannot find module ./talosMoodMotion"). Vor jedem Commit `git status --short` pruefen, dass keine `??`-Datei in den `git add` rutscht. Fremde WIP nie anfassen: app/relaunch-preview/faq/page.tsx, components/relaunch/SiteClosing.tsx, components/subpages/faq-demo/demo.body.html, docs/handoffs/NEXT_SESSION_leistungen.md, docs/seo-monitor-log.md.
- Keine Emojis; echte Umlaute in User-Content, ASCII in Shell/Commit/Code. Kein "gratis", kein Fachjargon in sichtbaren Texten.
- Deploy: git push -> v2-Auto-Deploy. NIE `vercel --prod`. Nach Push IMMER `vercel inspect` pruefen: Status muss **Ready** sein, NICHT **Error** (Build kann brechen -> dann liefert v2 den alten/kaputten Stand, 404 auf neue Assets). Kein `npm run build` bei laufendem dev.
- WICHTIG Browser-QA: der MCP/agent-Chrome hat **webgl2=false** -> laedt die 3D-Figur NICHT (reproduziert no-3D gut), FRIERT aber beim Scrollen auf der schweren Hero-Malflaeche ein (Top-Screenshot geht, tiefer nicht). Finale 3D-Abnahme = Thomas am echten Geraet.

## KERN-OFFENPUNKT: Desktop-Talos laedt bei Thomas nicht -> GEFIXT (b3e0b7b), Thomas-Abnahme offen
- Symptom war: Thomas' Laptop zeigt keinen 3D-Talos, nur das Dashboard-Fallback.
- Gesicherte Diagnose: eine Browser-Erweiterung (Adblocker/Privacy) blockiert den Fremd-Dienst `prod.spline.design`. In **Inkognito laeuft Talos** (Thomas: "es hat funktioniert"). Also KEIN Seiten-/Code-Bug — reine Browser-Blockade bei ihm.
- FIX (08.08., Commit b3e0b7b): Szene same-origin unter `public/hero/talos-scene.splinecode`, alle 6 Talos-Stages laden von `/hero/...` statt vom CDN. Verifiziert im Loader-Code: `@splinetool/loader` liest die Szene per `FileLoader.setResponseType("arraybuffer")` -> **Content-Type ist IRRELEVANT** (der Verdacht der Vorsession war falsch; octet-stream laedt identisch zu json). WASM (`process.wasm`/`ui.wasm`) kommt von **unpkg.com**, NICHT von spline.design -> vom spline-Blocker nicht betroffen. Die restlichen spline.design-Calls (api/hooks/relayserver) sind nur fuer Live-Interaktion, nicht fuer statisches Rendern noetig.
- TalosCompanionStage hat zusaetzlich einen **CDN-Fallback**: scheitert `/hero/...` (404 o.ae.), wird einmal `SCENE_FALLBACK` (Original-CDN) versucht, erst dann greift die scroll-gesteuerte Kommandozentrale.
- Warum der Vorsession-Self-Host scheinbar scheiterte: Confound (Build-Fehler 60d65fd -> Vercel lieferte alten CDN-Stand; danach direkt auf CDN zurueckrevertiert). Der Mechanismus selbst war nie sauber getestet.
- OFFEN: **Thomas muss im NORMALEN Fenster (mit Erweiterung) testen** — Talos muss jetzt reinlaufen/winken ohne Inkognito. Das ist die einzige echte Abnahme (MCP-Chrome kann 3D nicht rendern, webgl2=false). Falls unpkg beim ihm auch geblockt ist (unwahrscheinlich): WASM ebenfalls self-hosten (aus node_modules/@splinetool/modelling-wasm + ui-wasm nach public/, Loader-Basis-URL umbiegen) — nur wenn noetig.

## Stand (HEAD c1eb5ed, live v2) — was diese Session geaendert hat
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
