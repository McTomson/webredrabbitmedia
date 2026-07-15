# Naechste Session — Referenzen (15.07.2026, Abend)

## NEUESTER STAND (15.07. Vormittag, Commit 856e6c2): 1:1-Raster statt Kugel
Thomas verwarf die Kugel-Optik -> Bundle-Analyse des Originals -> SphereGallery.tsx erneut neu: FLACHES Einheitszellen-Raster (Kachel 0.998, Haarlinien-Gaps), 2-Achsen-Pannen mit Wrap, Barrel-Distortion+Vignette als Post-Pass (Ortho-Kamera + RenderTarget + eigener Shader), analytisches Picking, Hover-Weisskarte per Opacity-Fade, Fokus mit Pan-Restore. Entscheidungen: NUR Galerie (keine phantom-Chrome), Klick = Whiteout+Panel. Zweiter Logic-Review: 2 Bugs gefixt (Hochformat-Wrap-Luecke, Pan-Restore). QA Desktop+Mobile gruen. WARNUNG: :9000 kann transient 503/404 CSS liefern (geteilter .next, Parallel-Session) — NICHT neu starten, kurz warten oder eigener Port. OFFEN: Thomas-Abnahme.

## Aelterer Stand: Sphaeren-Galerie (VERWORFEN, Commit 9b3c717)
Thomas hat entschieden: phantom.land-Nachbau statt Hasen-Lauf. UMGESETZT und fertig QA-getestet:
- components/relaunch/SphereGallery.tsx komplett neu (Ring-Layout 3x12, Screenshot-Texturen mit gebackenen DM-Sans-Labels, zeitbasierte Daempfung, Hover-Weisskarte, Klick-Zoom+Whiteout+Panel, Mobile-WebGL mit pan-y, Fallback-Grid).
- /relaunch-preview/referenzen = neue Seite (SSR H1 "Komm mit. Wir zeigen dir was." + Scrim, SEO-Liste aus SPHERE_PROJECTS, CTA zu /relaunch-preview/kontakt). Alte /referenzen-preview redirectet nur noch.
- review-it gelaufen: docs/reviews/referenzen-sphere-2026-07-15.md; neue Lessons L-referenzen-03 (rAF-Drosselung -> zeitbasierte Daempfung) + L-referenzen-04 (Textur-Rebuild vs. Hover) in docs/lessons.md.
- OFFEN: Thomas-Feedback zur Galerie; danach Feintuning (deferred: Tuning-Konstanten elevieren, inert-Fokus-Falle). Upscale-Batch GESTOPPT bei 81/125 (Hasen-Material bleibt fuer Easter Egg/404, siehe unten).
- QA-Falle: gedrosselte Hintergrund-Tabs (L-referenzen-03) — vor Browser-QA Tab aktivieren!

---
# Historie: Referenzen-Hasenlauf (15.07.2026, frueher)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md (Memory `project_referenzen_hasenlauf`!), betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.
- PARALLEL-SESSION-REGEL: Andere Sessions arbeiten im selben Repo (ueber-uns etc.). NUR eigene Dateien anfassen: app/relaunch-preview/referenzen/**, components/subpages/referenzen/**, public/relaunch/referenzen/**. Fremde Modified-Files (DESIGN.md, HomeMorph, Header/Footer, ...) NIE stagen/committen.

## Stand dieser Session (14./15.07., committet bis 5869e3a auf Branch relaunch, NICHT gepusht)

### Erledigt + verifiziert
- Seite /relaunch-preview/referenzen KOMPLETT gebaut: Canvas-Scroll-Scrub (125 WebP-Frames, gedaempft), H1-Hero (Copy V3 "Komm mit. Wir zeigen dir was." = Thomas-Wahl, ?v=1|2 als Alternativen), zentrierter Pump-Abschluss + CTA -> /relaunch-preview/kontakt, Menue-Link umgebogen. SSR/SEO verifiziert. review-it gelaufen (docs/reviews/referenzen-hasenlauf-2026-07-14.md), docs/lessons.md angelegt.
- Karten aktuell: Buehnen-Fly-Through (JS, gedaempfter Progress, rr-card-layer-Optik), Track 1150vh. Funktioniert technisch — ABER siehe "Offene Entscheidung".
- Frames: direkt aus Quell-Video ~/Downloads/Rabbit_hops_into_dark_hole_202607131445.mp4 (720p!). Wasserzeichen: Box unten rechts (alle Frames) + Box links oben (Frames 24-41) entfernt.
- Mobile-QA via agent-browser (Viewport 390x844x3 FUNKTIONIERT: `agent-browser set viewport 390 844 3`).

### GESTOPPT 15.07. auf Thomas-Anweisung — NICHT neu starten
Der Upscale-Batch wurde bei 81/125 bewusst gestoppt. Grund: Demos 1+2 haben Thomas nicht ueberzeugt, der Hasen-Lauf als Rueckgrat der Seite steht zur Disposition (Fable-Empfehlung: helle Showcase-Seite nach ueber-uns-Rezept statt Video). Richtungs-Entscheidung bei Thomas offen. Die fertigen keep-*.png bleiben im Scratchpad (evtl. Easter Egg/404). Urspruengliche Batch-Doku unten nur noch als Referenz:

### ~~LAUFEND~~ (historisch, Batch gestoppt)
- AI-Upscale-Batch: nohup-Prozess, Skript + Fortschritt im Session-Scratchpad der ALTEN Session: /private/tmp/claude-501/-Users-McTomson/88c91c1c-c546-471d-91bb-d6e4bbb299f2/scratchpad/ (build-frames-upscale.sh, progress.txt, frames-up/keep-*.png = 5120er Rohdaten, frames-1920/ = Staging). Upscayl CLI: /Applications/Upscayl.app/Contents/Resources/bin/upscayl-bin, Modell high-fidelity-4x, ~55s/Frame.
- Zustand pruefen: `cat .../progress.txt` + `pgrep -f frames-upscale`. Falls tot: Skript einfach neu starten (resumable). ERSTE 20 Frames brauchen einen ZWEITEN Lauf (staged geloescht, keeps fehlen — Skript holt sie automatisch nach).
- DANACH: build-frames-final.sh laufen lassen (Weisspunkt-Kurve + 2560er Desktop + 640er Mobile direkt nach public/relaunch/referenzen/frames/) — Kurve ist verifiziert gut. Dann FRAME_W/FRAME_H in ReferenzenLauf.tsx auf 2560/1440, tsc, Browser-QA, commit.
- WICHTIG QA: Waehrend Upscayl laeuft friert der Browser-Tab der Seite ein (GPU-Konkurrenz Vollbild-Canvas vs. Upscayl) -> Batch mit `pkill -STOP -f upscayl-bin` pausieren, testen, `pkill -CONT ...` fortsetzen.

### ENTSCHIEDEN 15.07. (Thomas): phantom.land-Nachbau
Demos 1+2 haben nicht ueberzeugt, Demo 3 wollte er nicht. NEUE RICHTUNG: Die Referenzen-Seite wird ein Nachbau der Sphaeren-Galerie von https://www.phantom.land/ — bewusster Stilbruch (dunkel, Vollbild-WebGL). Man steht IN einer Kugel, Projekt-Kacheln tapezieren die Innenwand, Drag/Scroll rotiert traege, Hover = weisse Meta-Karte, Klick = Szene hellt auf + Projekt oeffnet. Unsere Schriften (DM Sans), unsere 7 Screenshots (wiederholen bis genug Kacheln), mobile-friendly, three.js 0.185 + lenis (beide installiert, KEIN gsap noetig). Die Hasen-Seite (ReferenzenLauf.tsx + Frames) BLEIBT im Repo fuer spaetere Verwendung (Easter Egg/404). Verifiziert im Browser: phantom.land ist ein Next.js-Site mit EINEM WebGL2-Vollbild-Canvas, Labels in der 3D-Szene gerendert.

### Alte offene Entscheidung (OBSOLET, nur Historie)
Thomas findet Website-Screenshots als schwebende Karten im Film GRUNDSAETZLICH unstimmig (Position/Groesse/Form). Zwei Richtungs-Demos gebaut (~/dev/redrabbit/scratchpad/referenzen-demos/, Server dafuer: `cd ~/dev/redrabbit/scratchpad/referenzen-demos && python3 -m http.server 8765`):
- Demo 1 "Kino-Stationen" (http://localhost:8765/demo-1-kino-stationen.html): Video dunkelt ab, EIN Projekt uebernimmt als Filmtitel-Einblendung. Fable-Empfehlung.
- Demo 2 "Tunnel-Plakate" (http://localhost:8765/demo-2-tunnel-plakate.html): CSS-3D-Plakate an der Tunnelwand, ziehen perspektivisch vorbei, Klick holt sie nach vorn. Thomas' Roehren-Idee als buildbare Version.
Nach Entscheidung: gewaehltes Konzept in ReferenzenLauf.tsx umsetzen (die JS-Fenster-Infrastruktur CARDS[t0,t1] + updateCards ist wiederverwendbar).

### Bekannte Bugs / TODO
1. WANDERNDES WASSERZEICHEN Nr. 3: weisser Pfeil RECHTS (~x1150-1210, y465-640) in der Lauf-Phase (Frames ~45-75, Thomas-Screenshot 15.07. 00:17) — Spitze ragt ueber die delogo-Box (y<480). Fix: in build-frames-video.sh/final zweite enable-Box rechts erweitern (y ab ~440, h groesser) NUR fuer das Frame-Fenster; Frames scannen wie beim links-oben-Fix (Montage-Technik siehe Memory).
2. Karten-Screenshots laden lazy -> dunkler Ink-Flash beim Auftauchen. Fix: eager-preload sobald Stage aktiv.
3. robots noindex (Preview) — beim Live-Gang umdrehen; Karten-Links extern bis Projekt-Unterseiten existieren (kommen als eigener Auftrag).
4. Evtl. Demo-Server (Port 8765) + Dev-Server (9000, gehoert Parallel-Session) laufen noch.

### Relevante Dateien/Befehle
- Code: app/relaunch-preview/referenzen/page.tsx, components/subpages/referenzen/ReferenzenLauf.tsx
- Assets/Pipeline: public/relaunch/referenzen/, Session-Scratchpad-Skripte (Pfad oben)
- Doku: Memory project_referenzen_hasenlauf (Vollhistorie!), docs/reviews/referenzen-hasenlauf-2026-07-14.md, docs/lessons.md
- Seite: http://localhost:9000/relaunch-preview/referenzen
