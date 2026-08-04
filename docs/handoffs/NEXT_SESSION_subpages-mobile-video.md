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

## >>> HIER STARTEN (Stand 04.08. Abend, HEAD 4e8c2b8) <<<

### ZIEL (Thomas woertlich)
"Wir machen die Videos NEU — sie muessen nur so sein, dass sie NICHT abgeschnitten sind." Gewuenschter Look pro Hero-Seite (Mobile): Statement-Text **mittig**, wirkt als kaeme es **von oben herunter**, **vollflaechig** (randlos), das **grosse Wort unten bleibt** (Talos./Website./...), **Video laeuft hinter Logo/Menue** (Logo+Menue liegen drueber). Referenz: Thomas' Bild "IMG_8747" (zentrierter Text auf Navy).

### KERN-PROBLEM (verifiziert, das ist der Knoten)
Thomas' bisherige Aufnahmen sind **~500x656 px (fast quadratisch, 3:4)**. Ein Handy ist **hoch+schmal (~9:19.5)**. Damit gilt bei der Anzeige:
- `object-fit:cover` (vollflaechig) → schneidet die **Seiten** ab (breite Textzeilen wie "RUFT BEI DIR AUCH" weg). Rechnung: cover skaliert nach Hoehe, Text 82% wird 617px auf 430px-Schirm → immer abgeschnitten, egal wie man positioniert.
- `object-fit:contain` (nichts abgeschnitten) → **klein mit Rand oben/unten** (Letterbox), Thomas findet es zu klein/leer.
**Kein object-fit loest das mit quadratischen Videos.** DIE LOESUNG IST DAS VIDEO-FORMAT.

### LOESUNG (der Weg, auf den wir uns geeinigt haben)
Thomas nimmt die Videos im **HANDY-FORMAT (hochkant, phone-aspect)** neu auf. Dann `object-fit:cover` (vollflaechig) → **kein Crop**, Text mittig, von oben, Wort unten, hinter Logo/Menue. Sobald das Video ~9:19.5 ist, fuellt cover exakt ohne abzuschneiden.

### SACKGASSEN (NICHT nochmal reinlaufen — hier habe ich Zeit verbrannt)
1. **`?record=1`-Aufnahmeseite / Paint am Handy rendern**: Die SVG-Masken-Paint-Animation **laeuft NICHT in Handy-Breite** (genau DER Grund, warum es die Videos gibt — iOS/SVG-Maske). Mein Versuch, sie im Geraete-Modus abspielbar zu machen, scheiterte (blobsChildren=0, kein Blob). NICHT weiter versuchen, die Paint am Handy/mobile-CSS zum Laufen zu bringen. (Die experimentellen ?record=1-Aenderungen wurden zurueckgesetzt, ueber-uns ist sauber = 4e8c2b8.)
2. **Blind an object-fit/object-position/crop rumdrehen**: bringt nichts, weil das Video-Format das Problem ist. Erst neues Format, dann anzeigen.

### CACHE-FALLE (wichtig!)
v2 cached hart auf dem iPhone. Mehrere "abgeschnitten"-Screenshots von Thomas waren die **alte gecachte Version** (cover), obwohl auf dem Server schon contain deployt war. IMMER mit `?v=N` (neuer Query-Param) oder **privatem Tab** pruefen lassen, sonst jagt man Phantome.

### WIE THOMAS AUFNIMMT (sein Constraint)
Sein Browserfenster geht **nicht schmaeler als ein Handy** (~500px min). Optionen fuer phone-aspect:
- Chrome **Geraete-Modus** (DevTools > Handy-Symbol > iPhone) — rendert Handy-Groesse im breiten Fenster. ABER: die Paint laeuft dort nicht (siehe Sackgasse 1) — er muesste also die NORMALE (Desktop-)Seite mit funktionierender Paint aufnehmen und dabei einen **hochkant-Bereich** mit `Cmd+Shift+5` (Ausgewaehlten Bereich) um den Blob croppen.
- Damit der Text in den schmalen hochkant-Bereich passt: ggf. Statements **schmaeler umbrechen (max 3 Woerter/Zeile)** — das ist wenig Arbeit, in `components/subpages/<seite>-demo/demo.body.html`, Klasse `.reveal-msg` (aktuelle Texte stehen weiter unten im Handoff-Verlauf / einfach grep 'reveal-msg').

### KONKRETE NAECHSTE SCHRITTE
1. Mit Thomas 1 Satz klaeren: Wie genau nimmt er auf (Desktop-Paint + hochkant-Region croppen)? Und braucht er dafuer schmaelere Statements (≤3 Woerter/Zeile)?
2. Falls ja: `.reveal-msg` in den 7 Hero-Seiten schmaeler umbrechen (nur `<br>`, Worte NICHT aendern, echte Umlaute). Betrifft auch Desktop-Umbruch — kurz gegenchecken.
3. Thomas liefert 1 Test-Video (ueber-uns) im Handy-Format → mit `ffmpeg` iOS-Spec encodieren (H264/Main/L40/yuv420p/30fps CFR/+faststart/-an, gerade Maße) nach `public/hero/ueber-uns-hero-mobile.mp4` + Poster.
4. Anzeige umstellen auf **vollflaechig ohne Crop**: `object-fit:cover; object-position:center` (bei phone-aspect Video = kein Crop), Video hinter Logo/Menue (die liegen z>Video). Grosses Wort unten sichtbar lassen — entweder Video-Hoehe endet knapp ueber dem Wort (z.B. `height:~84vh; top:0`) ODER Wort-Ebene ueber dem Video. **Am Geraet pruefen (Cache!).**
5. Passt ueber-uns → gleiche Behandlung + Videos fuer die anderen 6.

### AKTUELLER TECHNISCHER STAND (HEAD 4e8c2b8, live v2)
- Alle 7 Hero-Videos sind die **normalisierten ~82%-Crop-Versionen** (aus b5dfb8d), Anzeige `object-fit:contain` + `background:transparent`.
- `object-position`: **ueber-uns = `center`** (4e8c2b8), die anderen 6 = **`center top`** (uneinheitlich, weil ueber-uns der Test war — beim Umbau vereinheitlichen).
- website nutzt `contain` (0f63168), neues zentriertes Video drin.
- Dev-Server lief auf `:9000` (fuer den ?record-Versuch) — kann gestoppt werden.
- Diese contain-Version schneidet NICHTS ab (per PIL-Render verifiziert), wirkt aber Thomas zu klein → daher der Neu-Aufnahme-Plan.

---

## Stand dieser Session (alles committet + gepusht + live auf v2, HEAD ff2444c)
Kette: 5592697 → 6036675 → a51d758 → 50eaed4 → c4c7c54 → 84b2cc1 → dd19963 → ff2444c.

### NEU 04.08. (3) — Textgroesse vereinheitlicht + Loading + Website getauscht (b5dfb8d, 0f63168)
Geraete-Feedback: Textgroessen uneinheitlich (tipps zu klein), Seiten laden langsam. Messung (PIL/scipy): Cap-Height ist ueberall identisch (26px) — nur die Textblock-BREITE variiert (tipps 52% .. preise 88%). Fix: jedes Video datengetrieben auf ~82% Textbreite zugeschnitten (crop zentriert auf Text, gegen ALLE Paint-Frames auf Nicht-Clipping geprueft via `scratchpad/crop_preview2.py`, zoom 1.0-1.58x), dann 498x656 iOS-Spec. preise blieb (war schon 88%). Loading: `preload=auto`->`metadata` in allen 7 Engines. WEBSITE: neue Aufnahme `website video .mov` (zentrierter Text) getauscht + auf ~82% normalisiert + Engine `cover`->`contain`+top+transparent (SICHER: website-Video ist z1-Overlay, Wort z2 drueber, Canvas wird beim Play statische off-white Basis -> contain bricht Reveal nicht). Tools: `scratchpad/measure2.py` (Textmessung), `crop_preview2.py` (crop+clip-check), `encode_norm.sh`. Alle 7 live v2 0f63168, verifiziert (Seite+mp4 200, contain+preload-metadata deployt). **Final am iPhone bestaetigen.**

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
