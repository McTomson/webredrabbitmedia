# /leistungen/website — Mobile/Tablet FERTIG (02.08.) + Vorlage fuer die anderen Subpages

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/Browser/curl/Docs). Bei Unsicherheit fragen oder fail-closed.
- Branch `relaunch` ist GETEILT: `git fetch` + `git log` vor Arbeit, NUR eigene Dateien mit Pfad committen (NIE `git add .`/`-u`). Fremde WIP nicht anfassen.
- **Desktop darf sich NICHT aendern.** Mobile/Tablet = max-width:1024 (= `useCanvas`/Touch-Pfad).
- Visuelle Fixes erst "fertig", wenn Thomas es auf SEINEM Geraet bestaetigt.
- Deploy: `vercel deploy --yes` -> `vercel alias set <url> v2.redrabbit.media`. NIE `vercel --prod` (trifft web.redrabbit.media LIVE).
- Keine Emojis, echte Umlaute im Content.
- Dev-Server `:9000` verklemmt gern -> `lsof -ti tcp:9000 | xargs kill -9`, dann `npm run dev -- --port 9000`.

## Stand: /leistungen/website ist auf Mobile/Tablet FERTIG (bis Commit 6d1b385, live auf v2)

### Was in dieser Session gemacht/gefixt wurde
1. **Hero: Video ersetzt nur das Maus-Malen** (Touch/Mobile), der Canvas-Hero bleibt sonst komplett (Wort "Website" unten, Buchstaben, Aufloesen, rote Teile -> Zahnrad, Text von unten). KANONISCHES REZEPT: `~/.claude/.../memory/reference_runbook_video_ersetzt_canvas_malen.md`. Kurz: im `useCanvas`-Zweig von `demo.engine.jstext` ein `<video>` (z1, ueber revealCanvas, unter Wort) einhaengen; Deckkraft `(1-fade)`; im `playing`-Handler das Canvas solid off-white fuellen, `drawRevealScroll` ueberspringen, und **`.layer-base` + `.cursor-dot` + `#hint` + `[data-auto]` ausblenden**. Graziöse Degradierung: faellt das Video aus, bleibt der gemalte Canvas.
2. **Blaues Hintergrundbild weg**: das navy `.layer-base` (#23262e) schien beim Zahnrad durch -> bei laufendem Video `display:none` (Commit f946c78).
3. **Scrollweg 1/3 kuerzer** auf Mobile/Tablet: `.scene-main` 1600vh -> **1067vh** fuer `@media (max-width:1024px)` in `demo.css`. Timings sind Bruchteile der Szenen-Hoehe -> Choreografie identisch, nur die Strecke schrumpft. Desktop unveraendert (Commit 6d1b385).
4. Verwaiste `MobileVideoHero`/`WebsiteHeroSwitch` (verworfener Voll-Tausch) geloescht — sonst bricht der Vercel-Build (Next type-checkt auch ungenutzte Dateien).
5. **v2-404-Falle GELOEST**: v2.redrabbit.media servte alle /public-Assets als 404 — Ursache war die MIDDLEWARE (der v2-Rewrite praefixierte auch statische Dateien auf /relaunch-preview). Fix in `middleware.ts`: Pfade mit Datei-Endung vom Rewrite ausnehmen (Commit 2033c5c). NICHT Domain/Edge.
6. (Frueher, gleiche Seite) Paket-Stopp per scroll-snap, Talos-Hand Canvas-Aspect ~1.0, Doppel-Punkt-Fix (site-weiter Menue-Cursor ueber Mal-Flaeche aus).

### Falle beim Testen (Zeitfresser)
Der Automations-Chrome (Claude-in-Chrome) **dekodiert das mp4 NICHT** (readyState bleibt 0) und **friert bei der schweren Hero-Engine beim Scrollen ein**. Lokaler `next dev` laedt das mp4 im `<video>` auch nicht. => Video-WIEDERGABE nur am GERAET pruefbar. Logik lokal verifizieren: `localStorage.rrCanvasRevealBP=1024` (erzwingt Touch/Canvas-Pfad), dann `video.dispatchEvent(new Event('playing'))` -> pruefen dass `.layer-base`/`.cursor-dot` auf display:none gehen. NICHT scrollen (Freeze). Frames aus Thomas' Screen-Recordings mit ffmpeg ziehen = beste Diagnose.

## Mobile/Tablet-REGELN (auf die anderen Subpages uebertragen)
- **Breakpoint** Mobile/Tablet = `max-width:1024px` (deckt sich mit `useCanvas`/Touch).
- **Hero-Scrollweg** dort ~1/3 kuerzer als Desktop (`.scene-main` je Engine: 1600vh -> ~1067vh). Pro Subpage-Engine einzeln, da jede ihre eigene `<subpage>-demo/demo.css` hat.
- **Hero-Video** ersetzt das Maus-Malen (Rezept oben) — ABER erst wenn Thomas das Video je Seite geliefert hat (`public/hero/<seite>-hero-mobile.mp4`). Bis dahin AUSLASSEN.
- **iOS-Video-Encoding**: CFR 30fps, H.264 Main, yuv420p, +faststart, stumm.
- Sektionen: unwichtige auf Mobile ausblenden (`rr-hide-mobile`), Kern-Sektionen `rr-fullscreen-mobile` (100svh, zentriert). Je Seite anders — mit Thomas klaeren.

## OFFEN / NAECHSTE AUFGABE: die restlichen Subpages auf Mobile/Tablet ueberarbeiten
Subpage-Heroes mit Demo-Engine (jede eine eigene `components/subpages/<name>-demo/`):
ueber-uns, kontakt, preise, leistungen (Hub, `leistungen-hero2-demo`), talos, tipps, faq (ohne Morph).
Aufgabe: dieselben Mobile/Tablet-Regeln anwenden (Scrollweg kuerzer, Sektions-Handling), **Video zunaechst AUSLASSEN** (Thomas macht die Videos noch fuer alle). Erst Thomas befragen (siehe Prompt).

Fakten: HEAD 6d1b385 gepusht + live auf v2. Nur eigene Dateien angefasst; fremde WIP unberuehrt.
