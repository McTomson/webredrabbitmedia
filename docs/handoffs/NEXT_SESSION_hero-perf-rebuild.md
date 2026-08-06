# Naechste Session — Hero-Umbau / Mobile-Perf Richtung 98% (06.08.2026)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code lesen, curl, ffprobe, Lighthouse, Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden. (Beispiel diese Session: der Font-`<link>` schien "sicher entfernbar" — war er NICHT, weil demo.css die Fonts per literalem Namen nutzt. Erst verifiziert, dann NICHT entfernt.)
- Erst Plan (TodoWrite), dann ausfuehren. Parallele Sub-Agenten fuer mechanische/breite Arbeit nutzen.
- Branch `relaunch` ist GETEILT. `git fetch` zuerst. NUR eigene Dateien mit explizitem Pfad committen — NIE `git add .` / `git add -u`.
- FREMDE WIP NIE anfassen/committen: `app/relaunch-preview/faq/page.tsx`, `components/relaunch/SiteClosing.tsx`, `components/subpages/faq-demo/demo.body.html`, `docs/handoffs/NEXT_SESSION_leistungen.md`, `docs/seo-monitor-log.md`.
- Keine Emojis. Echte Umlaute in User-Content, ASCII in Shell/Pfaden/Commits. Commit-Messages enden mit den Co-Authored-By/Claude-Session-Zeilen.
- Deploy: `git push origin relaunch` -> Vercel baut committeten Tree (~3 Min) -> v2. NIE `vercel --prod` (trifft Live web.redrabbit.media). Push-Auth via `gh auth setup-git` (Remote ist HTTPS, kein SSH-Key).
- Desktop-Verhalten darf sich NICHT aendern (Mobile = `hover:none` / `max-width:1024`). Video/Perf nur am echten Geraet final verifizierbar -> Thomas bestaetigt auf SEINEM iPhone.
- CACHE-FALLE v2/iPhone: vor jeder "abgeschnitten/kaputt?"-Diagnose per curl den Server-Stand pruefen UND Thomas mit `?v=N`/privatem Tab testen lassen.
- Dev-/Test-Server: `next dev` (:9000) ODER `npm run build && next start` (:9100) — NIE build bei laufendem dev (killt dev). Port frei: `lsof -ti tcp:PORT | xargs kill -9`.

## Messmethode (etabliert)
- PSI-API-Quota (anonym) ist schnell erschoepft -> stattdessen lokal Lighthouse gegen v2:
  `CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npx --yes lighthouse@12 "<url>" --only-categories=performance --chrome-flags="--headless=new --no-sandbox" --throttling-method=simulate --output=json --output-path=<f> --quiet`
- Achtung Maschinen-Rauschen: 2-3 Laeufe, Median. Lokaler `next start`-Score ist optimistischer als v2 (keine Netz-Latenz) — der FAIRE Vergleich zur Baseline ist Lighthouse gegen v2.
- Baseline (v2, mobil, VOR dieser Session): Homepage 33, ueber-uns 31, TBT ~3,4s, LCP 7-10s.

## Stand dieser Session (erledigt + verifiziert)
- ALLE 7 Hero-Videos fertig (ueber-uns, kontakt, tipps, talos, faq, preise, website): Handy-Format 496x812 -> oben 16px gecroppt = 496x796 (entfernt eingebrannte rote Eck-Klammer), iOS-Spec encodiert, natuerliche Groesse (`top:0;height:auto;aspect-ratio:496/796`), Poster aus Mittelframe. Tools im scratchpad der Session.
- Roter Fokus-Rahmen um Burger-Menue entfernt (alle Bildschirme) — `RelaunchMenu.tsx`.
- Talos: Mobile-Aus-Versuch ZURUECKGENOMMEN (verursachte leere weisse Box auf /leistungen/website). Talos rendert wieder auf allen Viewports; `dynamic(ssr:false)`-Bundle-Split fuer three-spline BLEIBT (desktop-sicher, three nicht im Initial-Chunk) via `TalosCompanionStageLazy.tsx`.
- Perf-Fixes LIVE: `initFluid` (SVG-Partikel-rAF) auf Mobile aus (6 Video-Engines), AOS auf Relaunch/v2 gar nicht geladen (dynamischer aos-Import, Alt-Site unberuehrt), `/hero/*` immutable Cache-Header, Poster-`fetchpriority`-Preload auf allen Video-Seiten.
- Ergebnis v2 mobil JETZT: Homepage ~78, ueber-uns ~57-60, talos ~67. **TBT praktisch geloest** (ueber-uns 3.630 -> 110ms). CLS ueber-uns 0.
- HEAD: 3c7edbb (== remote).

## Offen / Naechste konkrete Schritte — HERO-UMBAU Richtung 98%
Der verbleibende Blocker ist LCP 7-8s, strukturell. Ursachen (gemessen): 4 render-blockierende CSS-Dateien (~30KB gzip, groesste 100KB roh), 127KB Inline-Engine-Script (blockt Parse), externe render-blockierende Google-Fonts, LCP-Element (Video) wird per JS erst nach all dem erzeugt.

FOKUS mobil/tablet (dort gemessen + Video-Heros), aber CSS/Font/Script-Fixes helfen Desktop mit; Desktop-Live-Paint bleibt funktional gleich.

- **Phase A (groesster Hebel): LCP-Element server-rendern.** Poster als echtes `<img>` in die Hero-HTML (mobil-only, `fetchpriority=high`, feste Maße = CLS-sicher), Video legt sich drueber. Existiert im HTML -> paintet sobald CSS da ist, unabhaengig vom Inline-Script. (faq's demo.body.html = fremde WIP -> separat/klaeren.)
- **Phase B: Inline-Engine auslagern/deferren.** 127KB-Script als externe `.js` mit `defer`; schwere Messung (getImageData/Reflows) auf Mobile hinter ersten Paint / `requestIdleCallback`.
- **Phase C: Render-blockierendes CSS senken.** Kritisches Hero-CSS inlinen + Rest deferren (Next `experimental.optimizeCss`/Critters) oder demo.css verschlanken.
- **Phase D (Risiko-Feld): Fonts sauber selbst-hosten.** demo.css nutzt Font-NAMEN (`"DM Sans"` etc.). Dieselben Namen als selbst-gehostetes `@font-face` hinterlegen -> DANN kann der render-blockierende Google-`<link>` raus, ohne die Typo zu brechen. Mit Fallback-Namen absichern.
- **Phase E: moderne Browser targeten** (39KB Polyfill-Chunk droppen).
- **Phase F: pro Seite messen + nachziehen.**
Jede Phase einzeln auf v2 messen, rueckrollbar.

## Weitere offene Punkte (Website, nicht Perf) — mit Thomas priorisieren
- Geraete-QA: alle 7 Hero-Videos am iPhone (nichts abgeschnitten/lesbar); Talos-Box auf /leistungen/website nach Fix c204626 pruefen (falls dort weiterhin weiss -> iOS-WebGL-Renderproblem der Spline-Szene selbst, separater Strang).
- 9x `/webdesign-<bundesland>`-Footer-Links 404en auf v2 (Rewrite-Artefakt; live 200). Entscheidung: Middleware ausnehmen / lassen / aus Relaunch-Footer nehmen.
- Preise-Seite: Talos-Talente "Bald verfuegbar", Fahrt-Felder=Preise + Rechner-Brutto verifizieren; Preis-Konsistenz (1.250/2.850) ueber alle Seiten.
- Sales-One-Pager mit Talos + Ads (Thomas' Idee, noch nicht gebaut).
- GO-LIVE: Relaunch nur auf v2 (intern/noindex) — Sprung auf Live web.redrabbit.media (Redirects, Migration, SEO) ist der eigentliche "fertig"-Meilenstein.
- Kontakt-Formular real absenden/ankommen testen; Tablet-Verhalten der Heros.

## Relevante Dateien/Befehle
- Hero-Engines: `components/subpages/<name>-demo/demo.engine.jstext` (per fs.readFileSync SSG -> bei Aenderung REBUILD noetig), zugehoerig `demo.body.html` + `demo.css`.
- Video-Seiten (Head/Preload): `app/relaunch-preview/{ueber-uns,preise,tipps,kontakt}/page.tsx`, `.../leistungen/{talos,website}/page.tsx`.
- Talos: `components/relaunch/talos/{TalosCompanionStage,TalosEntranceStage,TalosCompanionStageLazy}.tsx`.
- Global: `app/layout.tsx` (Analytics GTM+GA4, AOSInit), `components/AOSInit.tsx`, `next.config.ts` (headers/images), `middleware.ts` (v2-Rewrite + Cache).
- Video-Encode-Rezept: `ffmpeg -y -i SRC -an -c:v libx264 -profile:v main -level 4.0 -pix_fmt yuv420p -r 30 -vsync cfr -movflags +faststart -vf "crop=496:796:0:16" OUT` ; Poster aus Mittelframe (`-ss dur/2`, sonst schlaegt EOF-nahes Seek fehl).
