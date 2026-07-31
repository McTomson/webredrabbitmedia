# Naechste Session — Website-Hero Canvas-Reveal (2026-07-31)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/Browser/Docs). Bei Unsicherheit fragen oder fail-closed.
- Erst Plan (TodoWrite), dann ausfuehren. Laufend im Browser testen.
- Autonom, voller Browser-Zugriff. commit/push/deploy zwischen Schritten (Thomas will das).
- Nichts als "fertig" melden ohne verifiziertes Ergebnis.

## Kontext / Entschiedene Richtung
Mobile/Tablet-Ueberarbeitung der Relaunch-Unterseiten, Start mit `/leistungen/website`
(Host v2.redrabbit.media, lokal `/relaunch-preview/leistungen/website`, dev :9000).
Thomas' Grundsatz: Effekte behalten + fuer Mobile robust machen. NUR Mobile/Tablet (<=1024px),
Desktop unangetastet.

## DER OFFENE HAUPT-TASK: Hero-Mal-Reveal auf Canvas umbauen (Thomas: Option 3)
**Diagnose (verifiziert):** Der Hero (`components/subpages/website-demo/`) deckt beim "Malen"
eine navy-Ebene mit Satz hinter einem off-white Deck auf. Technik = CSS `mask:url(#mask-v1)`
auf `.layer-deck` (demo.css:101-104) -> SVG-`<mask id="mask-v1">` mit `<g class="blobs">`
+ Gooey-Filter (`feGaussianBlur`+`feColorMatrix`, demo.body.html:49-62). Blobs sind SVG-
`<circle>`, die die Engine live hinzufuegt (demo.engine.jstext:236-239, Particle-Klasse).
**iOS Safari rendert diese CSS-Maske->SVG-Maske->SVG-Filter-Kette NICHT** -> auf Thomas'
Geraet: roter Punkt schwirrt (JS/Canvas laeuft), aber NICHTS wird aufgedeckt + ein dunkler
Balken unten (navy-Ebene scheint durch, weil die kaputte Maske das Deck nicht abdeckt).
Im Emulator (Chrome) rendert die SVG-Maske sauber -> NICHT reproduzierbar im Emulator.
WICHTIG: Canvas-2D funktioniert auf Thomas' Geraet (der rote Punkt = Canvas). Der Fluid-Sim
nutzt schon `getContext("2d")` (demo.engine.jstext:90,178) -> Canvas ist der iOS-sichere Weg.

**Thomas' Entscheidung (Option 3, nur Mobile/Tablet <=1024px):**
1. Reveal auf Mobile auf **reines Canvas-2D** umbauen (Blobs als Canvas statt SVG-Maske).
   - Die Particle-Radien/Positionen existieren schon (demo.engine.jstext:231-287 loop, heroFeed:289).
   - Ansatz: ein `<canvas>` ueber `.layer-base` (navy+Satz), das das off-white Deck darstellt
     und per `globalCompositeOperation="destination-out"` an den Particle-Positionen Loecher
     erasiert (mit Blur fuer Gooey). Der Hero-Titel "Website" MUSS ueber dem Canvas bleiben
     (sonst wird er wegerasiert) — Titel-Kopplung an `.layer-deck` beachten.
   - Gooey-Look: `ctx.filter="blur(...)"` beim Erase ODER 2-Pass (alpha-threshold).
   - Auto-Animation laeuft schon (runAuto, per innerWidth<=1024 getriggert, demo.engine.jstext
     ~739) -> Punkt faehrt durch, deckt auf = "Film". Finger-Malen via vorhandene touch-Handler
     (demo.engine.jstext:266-269) soll dann auch gehen (Thomas-Wunsch).
2. **Automatischer Video-Fallback:** Falls Canvas auf dem Geraet wider Erwarten nicht laeuft,
   auf ein autoplay/muted/playsinline-Video umschalten. (Video ggf. aus der Desktop-Animation
   aufnehmen — ffmpeg vorhanden; agent-browser Frames -> mp4/webm.)
3. Desktop (>1024px) BLEIBT bei der SVG-Maske (funktioniert dort). Alles hinter `innerWidth<=1024`.

**Verifizierbar im Emulator:** Canvas-Rendering + Auto-Animation bei 390px (Breiten-getriggert).
NICHT im Emulator pruefbar: echtes iOS-Verhalten -> Thomas testet am Geraet (Screenshot/Video-Loop).

## Schon ERLEDIGT diese Session (committet + live auf v2)
- 7bbfefd Mobile-Feinschliff Morph/CasePanels/KundenSagen (Band, Chart-Zentrierung, Burger-Fokus,
  CTA "Alle Projekte", Problem/Loesung-Body unten, KundenSagen-Pfeile ohne Kreise).
- cd3ed62 Hero reveal-msg mobil nicht mehr abgeschnitten (demo.css @media<=640px).
- 9856f3d + 09c1248 Hero-Auto-Malanimation-Trigger robust (Touch-Erkennung + innerWidth<=1024).
  -> Auto-Play FEUERT jetzt (Punkt schwirrt), aber Reveal rendert nicht auf iOS = der offene Task.

## Danach (weitere "grundlegende Dinge", Thomas bestaetigt)
- **CSS-Scroll-Snap** pro Sektion, Mobile/Tablet: fester Stopp am ANFANG jeder Sektion
  (`scroll-snap-type:y mandatory` + `scroll-snap-align:start` + `scroll-snap-stop:always`),
  lange Sektionen frei scrollbar. Desktop-Snap ist Rad-basiert (ScrollExperience.tsx onWheel)
  und greift auf Touch NICHT -> CSS-Scroll-Snap ist der Touch-Weg. Effekt-Sektionen (Ablauf/
  Fundament/DreiStufen) behalten ihre Animation, Snap faengt nur den Anfang.
- **Vollbild-Sektionen** auf Mobile: aktuell schalten die einzigen 100vh-Sektionen
  (ReferenzenTeaser.tsx:31-38, SiteClosing.tsx:44-62) Vollhoehe unter 820px AB; Content-Sektionen
  haben nie 100vh (nur `--rr-section-y`). Hebel dort.
- Dann auf weitere Seiten + Homepage ausrollen (Homepage auch = Thomas bestaetigt).

## Relevante Dateien
- `components/subpages/website-demo/demo.engine.jstext` (Fluid/Reveal-Engine, ~861 Z.)
- `components/subpages/website-demo/demo.css` (Hero-CSS, Masken-Anwendung :101-104)
- `components/subpages/website-demo/demo.body.html` (Struktur + SVG-Maske :49-62)
- `components/subpages/WebsiteDemoClient.tsx` (React-Wrapper, portalt MorphSculpture)
- `app/relaunch-preview/leistungen/website/page.tsx` (Sektions-Reihenfolge)
- Snap: `components/relaunch/ScrollExperience.tsx`, `lib/relaunch/scroll-standard.ts` (MOBILE_BREAKPOINT=820)

## Deploy
`vercel deploy` -> `vercel inspect <url>` bis Ready -> `vercel alias set <url> v2.redrabbit.media`.
NUR eigene Dateien committen (fremde WIP im Tree). Post-commit-Hook pusht automatisch.
