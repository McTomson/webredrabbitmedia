# Naechste Session — Subpages Mobile/Tablet + Hero-Videos (Branch relaunch)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, `docs/handoffs/NEXT_SESSION_website-hero-canvas.md` (das Original-Video-Rezept), MEMORY.md, die Memories `reference_runbook_video_ersetzt_canvas_malen.md`, `reference_hero_video_ios_und_v2_domain_falle.md`, `reference_relaunch_ios_svgmask_und_emulator_touch.md`. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code lesen / curl / ffprobe). Bei Unsicherheit fragen oder fail-closed.
- Branch `relaunch` ist GETEILT: `git fetch` + `git log` vor Arbeit, NUR eigene Dateien mit explizitem Pfad committen (NIE `git add .`/`-u`). Fremde WIP NICHT anfassen: `app/relaunch-preview/faq/page.tsx`, `components/relaunch/SiteClosing.tsx`, `components/subpages/faq-demo/demo.body.html`, `docs/handoffs/NEXT_SESSION_leistungen.md`, `docs/seo-monitor-log.md` (+ diverse untracked WIP).
- **Desktop darf sich NICHT aendern.** Mobile/Tablet = `max-width:1024px` (Scroll) bzw. `hover:none` (Video, Touch).
- Deploy: einfach `git push origin relaunch` → Vercel baut den COMMITTETEN Baum (~3 min) → live auf v2.redrabbit.media. NIE `vercel --prod` (trifft web.redrabbit.media LIVE). `vercel deploy` aus dem Arbeitsbaum meiden — er laedt untracked fremde WIP mit und kann den Build brechen.
- **Video-Wiedergabe ist nur am GERAET (Thomas' iPhone) pruefbar** — Automations-Chrome dekodiert das mp4 nicht. Ich verifiziere nur: Engine referenziert das Video, Asset liefert 200, Seite 200. Feel/Playback bestaetigt Thomas.
- Keine Emojis, echte Umlaute im Content. Erst "fertig", wenn Thomas es am Geraet bestaetigt.
- Dev-Server `:9000` verklemmt gern → `lsof -ti tcp:9000 | xargs kill -9`, dann `npm run dev -- --port 9000`. Kein `npm run build` bei laufendem dev.

## Stand dieser Session (alles committet + gepusht + live auf v2, HEAD ff2444c)
Kette: 5592697 → 6036675 → a51d758 → 50eaed4 → c4c7c54 → 84b2cc1 → dd19963 → ff2444c.

### NEU 04.08. (2) — Video-Layer-Fix nach Geraete-Feedback (ab58a10)
Thomas' iPhone-Test: (a) Statement-Text abgeschnitten (Video per `cover` zu gross skaliert -> Seiten-Crop), (b) das grosse Wort unten (`.layer-deck` z2, z.B. "Über uns.") war vom Video verdeckt ("sollte davor sein"). WICHTIG gelernt: `.layer-deck` hat `background:var(--offwhite)` = OPAK -> Video MUSS z4 (ueber dem Deck) bleiben, sonst unsichtbar (z1 getestet+verworfen). Fix in allen 6 Engines: `object-fit:contain` (voller Text, kein Crop) + `object-position:center top` (Video oben = Statement-Bereich) + `background:transparent` (untere Letterbox gibt das Deck-Wort frei). Live v2, wartet auf erneuten Geraete-Test. OFFEN: **website** (image 1) hatte auch Crop, aber website-Engine = Canvas-Reveal (Video z1 unter Canvas, `cover` noetig fuer Alignment) -> NICHT mit contain anfassen, separates Thema.

### NEU 04.08. — ALLE Hero-Videos eingebaut (ff2444c)
Thomas hat alle Videos geliefert. Encodiert (iOS-Spec H264/Main/L40/yuv420p/30fps CFR/+faststart/stumm, 498x656) nach `public/hero/<seite>-hero-mobile.mp4` + `-poster.jpg` und in die 5 SVG-Masken-Engines eingebaut (identisches Muster wie preise, via `scratchpad/integrate.py`, node --check gruen): ueber-uns, kontakt, tipps (tipps-hero-demo), talos (Route /relaunch-preview/leistungen/talos), faq. Preis-Hero-Video auf die NEUE Aufnahme (`Preis Aufnahme.mov`) getauscht. Nur `demo.engine.jstext` je Seite geaendert — KEIN html/css; `faq-demo/demo.body.html` (fremde WIP) NICHT angefasst. Video liegt z4 (in allen 5 Engines frei, gegen demo.css geprueft), `_hideArtifacts` blendet Cursor(z6)/hint/autobtn sofort aus, `!revealVideo`-Guard schaltet Auto-Malen ab. **Playback wie immer nur am Geraet pruefbar — Thomas testet alle 6 am iPhone.**

### ERLEDIGT + verifiziert
1. **Hero-Scrollweg ~5 Fingerscrolls** auf allen Hero-Seiten. Kalibrierung: 1067vh = 8 Scrolls → 5/8 = **667vh**. Einheitlich `@media (max-width:1024px){ .scene-main{height:667vh} }` in jeder `components/subpages/<seite>-demo/demo.css` (website, ueber-uns, kontakt, preise, leistungen-hero2, talos). Timings sind Bruchteile der Szenen-Hoehe → Choreografie identisch, nur Strecke kuerzer. Desktop unveraendert. Der Block steht VOR dem Reduced-Motion-Block (dessen height:auto muss gewinnen).
2. **Abschluss-Block fensterhoch am Handy/Tablet** — site-weit EINE Regel in `app/styleguide/styleguide.css` (ganz unten): `@media (max-width:820px){ .rr-section.sc-full{ min-height:100vh; min-height:100svh } }`. Hoehere Spezifitaet als das `min-height:0` des geteilten `SiteClosing`. Greift auf allen Unterseiten (laden styleguide.css); **Home ausgenommen** (laedt styleguide.css nicht — nutzt HomeClosing). `compact`-Abschluesse (kontakt-Form-Variante hat KEIN compact; echte compact-Nutzer) haben kein `sc-full` → bleiben klein. Geteiltes SiteClosing.tsx NICHT angefasst (fremde WIP).
3. **ueber-uns Sektionen**: Thomas-Entscheidung = alle "behalten wie jetzt" (nichts ausblenden/fullscreen). Nur Scroll + Abschluss gelten.
4. **Preis-Hero-Video** (Touch/Tablet/Mobile) eingebaut, Video von Thomas: `public/hero/preise-hero-mobile.mp4` (+ `preise-hero-poster.jpg`). Engine `components/subpages/preise-demo/demo.engine.jstext`.

### OFFENER PUNKT (Thomas prueft am Geraet)
- **Preis-Video Playback**: erster Bau spielte NICHT (Screen-Recording zeigte den ruckelnden Auto-Mal-Fallback, roter Cursor-Punkt, navy Botschaft — `'playing'` feuerte nie). Fix in 84b2cc1: Mal-Artefakte SOFORT aus (roter Cursor liegt z6 UEBER dem Video z4!), Auto-Malen aus sobald Video existiert, Poster als Sofort-Bild, Optik an Video-EXISTENZ statt an `'playing'` gekoppelt, robuste iOS-Wiedergabe (muted-Attribut, webkit-playsinline, load(), Play-Trigger auf loadeddata/canplay + touchstart/touchend/pointerdown/click/scroll). **Noch NICHT am Geraet bestaetigt.** Falls nur ein Standbild (Poster) kommt → iOS blockt Autoplay hart, dann naechster Schritt (z.B. Play strikt an erste Nutzer-Geste, evtl. sichtbarer Play-Hint).

## NAECHSTE AUFGABE (04.08.): Geraete-Test + evtl. FAQ neu
- **Thomas testet alle 6 Hero-Videos am iPhone** (ueber-uns, kontakt, tipps, talos, faq, preise-neu). Falls eines nur ein Standbild/Poster zeigt → iOS blockt Autoplay hart, dann Play strikt an erste Nutzer-Geste koppeln (evtl. sichtbarer Play-Hint). Rezept/Fallen unten.
- **FAQ evtl. neu bauen**: Thomas sagte "eventuell muessen wir faq neu machen". Das FAQ-Video ist bereits im faq-Hero (faq-demo/demo.engine.jstext). `faq-demo/demo.body.html` bleibt fremde WIP — falls FAQ inhaltlich neu gebaut wird, das mit dem WIP-Eigentuemer klaeren.
- Falls spaeter weitere/ersetzte Videos kommen: `scratchpad/encode.sh` (Mapping anpassen) + `scratchpad/integrate.py` (idempotent, ueberspringt Engines die schon `revealVideo` haben) wiederverwenden.

## (ERLEDIGT 04.08.) Recipe fuer Hero-Videos — falls nochmal gebraucht
**Thomas lieferte ALLE Videos** fuer die Mobile/Tablet-Version. Pro Seite:

1. **Encodieren (iOS-Spec, exakt wie das Website/Preis-Video):**
   ```
   ffmpeg -y -i "<quelle>" -vf "fps=30,format=yuv420p" -fps_mode cfr \
     -c:v libx264 -profile:v main -level 4.0 -preset veryslow -crf 24 \
     -movflags +faststart -an public/hero/<seite>-hero-mobile.mp4
   ffmpeg -y -i "<quelle>" -vframes 1 -q:v 4 public/hero/<seite>-hero-poster.jpg
   ```
   Ziel-Specs (mit `ffprobe` gegenpruefen): h264 / Main / level 40 / yuv420p / 30fps / +faststart / stumm. Gerade Maße.
2. **In die Engine einbauen** — Muster = die Preis-Integration (`preise-demo/demo.engine.jstext`, Commits c4c7c54 + 84b2cc1). ACHTUNG, WICHTIG: die Engines sind NICHT alle gleich gebaut.
   - `website-demo` nutzt einen `revealCanvas`/`useCanvas`-Apparat (eigenes Video-Rezept, siehe NEXT_SESSION_website-hero-canvas.md).
   - `preise-demo` (und vermutlich ueber-uns/kontakt/leistungen-hero2/talos) ist die aeltere Template-Version mit **SVG-Masken-Paint** (`blobsGroup`, `paintMaxY`, `layer-base`(navy)/`layer-deck`(Wort), `noHover`-Auto-Reveal, `fade` in applyMain). Dort wird das Video im `noHover`-Boot-Zweig als `<video>` (z4, ueber der Mal-Flaeche) eingehaengt, Deckkraft `(1-fade)`, Mal-Artefakte SOFORT aus, Auto-Malen aus wenn Video da. **Pro Seite die Engine-Struktur zuerst pruefen** (grep `useCanvas|revealCanvas|noHover|blobsGroup|applyMain`), dann das passende Muster anwenden — nicht blind kopieren.
   - z-Reihenfolge im Sticky (preise-Beispiel): layer-base 1, layer-deck/Wort 2, story-grid/Skulptur 3, hint 5, cursor 6, autobtn 7 → Video z4. Pro Seite in `demo.css` gegenpruefen.
3. **Verifizieren**: `node --check` auf einer .js-Kopie der jstext; push; nach ~3 min curl: Seite referenziert `/hero/<seite>-hero-mobile.mp4`, Asset 200. Dann Thomas am Geraet.

Betroffene Hero-Seiten (Video sobald geliefert): ueber-uns, kontakt, leistungen (Hub, `leistungen-hero2-demo`), talos, tipps (`tipps-hero-demo`, kurzer 240vh-Hero — pruefen ob Video-Mechanik ueberhaupt passt). **faq** = fremde WIP, nicht anfassen. **website** hat sein Video schon.

## Relevante Dateien
- Scroll: `components/subpages/<seite>-demo/demo.css` (@max-width:1024 .scene-main).
- Abschluss fensterhoch: `app/styleguide/styleguide.css` (unten, .rr-section.sc-full).
- Preis-Video-Engine: `components/subpages/preise-demo/demo.engine.jstext`.
- Video-Assets: `public/hero/<seite>-hero-mobile.mp4` + `-poster.jpg`.
- Rezept-Original: `docs/handoffs/NEXT_SESSION_website-hero-canvas.md` + Memory `reference_runbook_video_ersetzt_canvas_malen.md`.
