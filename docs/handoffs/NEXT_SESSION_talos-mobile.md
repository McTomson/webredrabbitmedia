# Naechste Session — TALOS (Desktop-3D-Ladeproblem + Mobile/Tablet-Feinschliff)

## Arbeitsregeln (verbindlich)
- Lies ZUERST: diesen Handoff, MEMORY.md (Eintrag project_talos_kommandozentrale_pivot_2026_08_07), betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — verifizieren (Code/Browser/curl/Docs). Bei Unsicherheit fragen oder fail-closed.
- Geteilter Branch `relaunch`: `git fetch` zuerst; NUR eigene Dateien mit EXPLIZITEM Pfad stagen (NIE `git add .`/`-u`). ACHTUNG UNTRACKED-WIP-FALLE (diese Session passiert!): `TalosChoreoStage.tsx` + `TalosApproachStage.tsx` sind UNTRACKED WIP (importieren untracktes `talosMoodMotion.ts`) — committet man sie versehentlich, BRICHT der Vercel-Build ("Cannot find module ./talosMoodMotion"). Vor jedem Commit `git status --short` pruefen, dass keine `??`-Datei in den `git add` rutscht. Fremde WIP nie anfassen: app/relaunch-preview/faq/page.tsx, components/relaunch/SiteClosing.tsx, components/subpages/faq-demo/demo.body.html, docs/handoffs/NEXT_SESSION_leistungen.md, docs/seo-monitor-log.md.
- Keine Emojis; echte Umlaute in User-Content, ASCII in Shell/Commit/Code. Kein "gratis", kein Fachjargon in sichtbaren Texten.
- Deploy: git push -> v2-Auto-Deploy. NIE `vercel --prod`. Nach Push IMMER `vercel inspect` pruefen: Status muss **Ready** sein, NICHT **Error** (Build kann brechen -> dann liefert v2 den alten/kaputten Stand, 404 auf neue Assets). Kein `npm run build` bei laufendem dev.
- WICHTIG Browser-QA: der MCP/agent-Chrome hat **webgl2=false** -> laedt die 3D-Figur NICHT (reproduziert no-3D gut), FRIERT aber beim Scrollen auf der schweren Hero-Malflaeche ein (Top-Screenshot geht, tiefer nicht). Finale 3D-Abnahme = Thomas am echten Geraet.

## KERN-OFFENPUNKT (ZUERST): Desktop-Talos laedt bei Thomas nicht
- Symptom: Thomas' Laptop zeigt keinen 3D-Talos, nur das Dashboard-Fallback.
- Gesicherte Diagnose: eine Browser-Erweiterung (Adblocker/Privacy) blockiert den Fremd-Dienst `prod.spline.design`. In **Inkognito laeuft Talos** (Thomas: "es hat funktioniert"). Die Szene/das CDN ist online (curl HTTP 200, 1,3MB). Also KEIN Seiten-/Code-Bug — reine Browser-Blockade bei ihm.
- Versuch diese Session: Szene selbst hosten (public/hero/talos-scene.splinecode, same-origin) -> Build-Fehler (untracked WIP mitcommittet) gefixt, dann deployte es, ABER Talos lud trotzdem NICHT (Verdacht Content-Type: CDN liefert `application/json`, unser Vercel-Static `application/octet-stream` -> @splinetool/loader mochte es nicht). Auf Thomas' Wunsch "mach es wie frueher" -> **zurueck auf CDN** (Commit c1eb5ed). Damit Desktop wie urspruenglich, aber bei Thomas weiter durch die Erweiterung blockiert.
- NAECHSTE SESSION — zwei Wege (Empfehlung a):
  a) **Self-Host RICHTIG**: .splinecode als `application/json` (oder was der Loader erwartet) ausliefern — via `vercel.json` headers fuer `/hero/*.splinecode`, ODER die Szene unter `.json`-Endung/eine API-Route serven. DANN AM ECHTEN Browser MIT Erweiterung testen (nicht nur curl!). Loest es fuer ALLE Nutzer mit Blockern und macht die Seite robuster (kein CDN-Ausfallrisiko). Erst Content-Type verifizieren (Netzwerk-Tab), dann Thomas testen lassen.
  b) Thomas whitelistet `spline.design` in seinem Blocker (schnell, aber loest es nicht fuer echte Besucher mit Blockern).
- NICHT wieder blind self-hosten ohne Content-Type-Fix + echten Browser-Test.

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
