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

## Stand SESSION 06.08. Abend (erledigt + verifiziert, HEAD 480f3ff == remote)
Vier Perf-Commits, alle live auf v2, alle verifiziert (Desktop-Screenshots unveraendert, Typo identisch, 49 interne Links = 200, keine Konsolen-Fehler ausser MetaMask-Extension-Rauschen):
- **f66db35 + 8ab6d4c — Phase A LCP-Poster** auf 5 Video-Heroes (ueber-uns, kontakt, tipps, preise, talos): server-gerendertes `<img class="reveal-poster">` im demo.body.html (nur Mobile via `@media (hover:none)`, z-index=Video-z, faded synchron ueber `revealPoster`-Ref in der Engine). LCP-Element ist jetzt das Poster (paintet aus dem HTML), CLS runter. **website BEWUSST AUSGELASSEN** (Canvas/z1-`insertBefore(video,deck)`-Layering ist DOM-Order-sensitiv und fragil -> Regressionsrisiko; sein Video funktioniert schon).
- **9abdd31 — Analytics verzoegert**: `components/DeferredThirdParties.tsx` laedt GA4+GTM erst bei erster Interaktion ODER 3s nach load (statt afterInteractive). Entfernt ~283KB Analytics-JS aus dem Ladefenster. TBT ueber-uns ~2.040 -> ~780ms. Keine Events verloren (dataLayer-Queue), keine visuelle Aenderung. In `app/layout.tsx` verdrahtet.
- **480f3ff — Fonts selbst-hosten**: `app/fonts-selfhosted.css` (@font-face aus Googles CSS 1:1, woertliche Namen, Variable Fonts als weight-range, self-hosted aus `public/fonts/*.woff2` = 10 Files/348KB), global in layout importiert, DM-Sans-latin preloadet. Der render-blockierende externe Google-`<link>` auf 12 EIGENEN Seiten entfernt (faq + Experiment-Seiten unveraendert). Ergebnis: **FCP warm 2,4s -> 1,3-1,6s** (externe Fonts raus aus dem kritischen Pfad, verifiziert `render-blocking: googleapis=false`). Typo pixel-identisch (Screenshot).

### Gemessen v2 (mobil, Lighthouse-Sim) — MIT STARKEM MASCHINEN-RAUSCHEN
- Baseline vor Session: ueber 38-43, Homepage 33.
- Jetzt (best-of): ueber ~56, kontakt ~70, tipps ~58; FCP warm 1,3-1,6s; CLS niedrig/0.
- WICHTIG: lokale Lighthouse-Sim schwankt brutal (TBT 250-2960ms je nach CPU-Last). **Die maßgebliche Zahl kommt aus `pagespeed.web.dev` (Google-Infra) — Thomas soll die selbst ziehen**, dann sauberer Startwert.

## DIE DECKE = LCP + TBT aus Hydration (nicht mehr FCP/Fonts)
FCP ist mit dem Font-Umbau gebrochen. Neuer Blocker: **LCP 4,7-9,5s + TBT** kommen aus der **Hydration der schweren Hero-JS** (die ~119KB Inline-Engine wird als String-Prop an den Client-DemoClient gegeben und in `useEffect` NACH der Hydration als `<script>` ausgefuehrt -> Main-Thread blockiert -> LCP-Poster paintet spaet = "render delay"). Observed LCP ist real ~0,8s; die Sim bestraft die JS-Ausfuehrung.

## NAECHSTER HEBEL (riskant, Thomas-Bestaetigung noetig) = ENGINE-BOOT VERZOEGERN
Analog zum Analytics-Defer: der Poster steht schon im HTML und paintet sofort; die schwere Engine (Video-Mount + Scroll-Animation + Canvas/Paint) muss NICHT im Metrik-Fenster booten.
- **Idee**: In `*DemoClient.tsx` (UeberUnsDemoClient etc.) den Engine-`<script>`-Inject aus dem sofortigen `useEffect` heraus HINTER erste Interaktion (`pointerdown/scroll/mousemove/touchstart`) ODER `requestIdleCallback`/`load+delay` legen. Desktop bootet dann bei erster Mausbewegung (quasi sofort, unsichtbar); Mobile bei erstem Scroll/Touch oder nach idle. Der Poster/Erstzustand bleibt sichtbar bis dahin.
- **RISIKO**: beruehrt Desktop-Timing (Hover-Paint startet minimal spaeter) + Scroll-Math wenn Boot nach bereits erfolgtem Scroll passiert. GENAU testen (Desktop-Hover-Paint, Scroll-Position, Auto-Play, MorphSculpture/Talos-Portal-Timing). Erst 1 Seite (ueber-uns) als Prototyp, messen, dann ausrollen. Rueckrollbar.
- Sekundaer, falls Engine-Defer nicht reicht: **Inline-Engine als externe deferred `.js`** (raus aus dem HTML/Flight-String), **kritisches CSS** (styleguide.css 67KB render-blocking -> `experimental.optimizeCss`/Critters), moderne Browser targeten (Polyfill-Chunk droppen).
- Font-PRELOAD als Tuning-Knopf: das `<link rel=preload>` fuer DM-Sans (62KB) KONKURRIERT evtl. mit dem LCP-Poster auf der Leitung. Testen: Preload droppen (Font laedt via display:swap nach CSS) -> evtl. bessere LCP, dafuer minimaler FOUT auf dem Hero-Titel (Thomas-Abwaegung).
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
