# Tipps-Artikel-Tunnel — Spec (extrahiert aus ashleybrookecs.com/work, 16.07.2026)

Thomas-Entscheid: Artikel-Liste der Tipps-Seite = 1:1-Nachbau der /work-Galerie von
ashleybrookecs.com (ohne gelbe Deko-Punkte, unsere Schriften/Farben), Karten fliegen
beim Scrollen von hinten auf den Betrachter zu. Quelle verifiziert: HTML + Custom-Script
(4pf9nv.csb.app/script.js, Funktion `initProjectsScroll`) am 16.07. per curl gezogen.

## Original-Mechanik (verbindlich, Zahlen 1:1)

- Buehne: `content-wrapper { perspective: 250vw }`, darin `content { position:absolute;
  inset:0; transform-style:preserve-3d; transform-origin:50% 10% }` — sticky ueber die
  gesamte Scroll-Strecke des Wurzel-Elements (`start top top`, `end bottom bottom`, scrub 1).
- Items (`.media`-Aequivalent): `position:absolute; width:33%` (Mobile `80%`),
  `box-shadow:1px 1px 30px rgba(0,0,0,.08)`, `will-change:transform,opacity,filter`.
- Initial je Item: `xPercent:-50, yPercent:-50`, feste Zufallsposition
  `x=(random*0.6+0.2)*innerWidth`, `y=(random*0.6+0.2)*innerHeight`
  (Zufall EINMAL beim Mount wuerfeln, danach stabil; bei uns: seeded per Index,
  damit SSR/CSR nicht springen).
- Timeline pro Item i (Stagger `startTime = i * 0.5`):
  - z: von -3000 (erstes Item -2000) nach **+700**, duration 1.75, ease none.
  - Einblenden (ausser erstem Item): opacity 0->1 + blur(20px)->0, duration 1, power2.out, ab startTime.
  - Ausblenden (ausser letztem Item): opacity->0 + blur(20px), duration 0.6, power2.in,
    ab `startTime + 1.75 * 0.675`.
  - Erstes Item startet sichtbar (opacity 1, blur 0) bei z=-2000 — das ist der Moment
    "erstes Bild kommt klein von hinten, waehrend die Titel-Buchstaben wegfliegen".
  - pointer-events nur wenn opacity > 0.
- Maus-Parallaxe auf dem 3D-Container: rotationY = (mouseX/innerWidth - .5)*10,
  rotationX = -(mouseY/innerHeight - .5)*10, weich nachgefuehrt (quickTo ~0.5s power1;
  bei uns: rAF-Lerp).
- Scroll-Laenge des Wurzel-Elements bestimmt das Tempo: Timeline-Gesamtdauer =
  (n-1)*0.5 + 1.75 Einheiten; Wurzel-Hoehe ~ n * 60vh hat sich als Startwert bewaehrt (tunen).
- Umsetzung bei uns OHNE GSAP: eigener rAF-Loop + Scroll-Mapping + Lerp
  (Muster wie MorphSculpture/Engines; lenis ist als Dependency vorhanden).

## Karten-Design (Screenshot Thomas 16.07. + Original)

- Karte = featuredImage oben (leicht ueberstehend), darunter weisser Label-Streifen:
  Titel fett (DM Sans 700, Tinte), darunter Kategorie(n) in ROT, klein, uppercase,
  mit Punkt-Trennern; rechts im Streifen Pfeil-Icon (↗). Karten leicht gekippt
  (jede Karte eigene kleine Rotation, ~-3..3deg, seeded).
- Klick -> /relaunch-preview/tipps/[slug].
- Farben/Schriften: unsere (offwhite #fff Grund, Tinte #23262e, Rot #f12032,
  DM Sans/Instrument Sans; KEINE gelben Deko-Punkte des Originals).

## Filter-/Suchleiste (Thomas-Entscheid: rechts unten, dunkel, eckig)

- Fixe dunkle Leiste unten rechts (Navy #1c2837, KEIN radius — eckig, Original hat
  radius-small, wir bewusst eckig gemaess Thomas' Screenshot-Wunsch), horizontal
  scrollbar auf Mobile.
- Inhalt: "Alle" + die echten Kategorien aus getAllPosts (aktive = weiss/fett wie
  Original "ALL WORK") PLUS ein Suchfeld im selben Balken.
- Suchfeld: Platzhalter tippt sich langsam selbst (rotierende Stichwoerter, z.B.
  "SEO", "Was kostet eine Website", "KI-Sichtbarkeit"; LANGSAM, ruhig — tippt, wartet,
  loescht, naechstes Wort; prefers-reduced-motion: statischer Platzhalter).
- Filterlogik: Kategorie-Klick ODER Texteingabe filtert die Karten (Titel, Kategorie,
  Tags/Excerpt, case-insensitive). Bei Aenderung: Tunnel-Timeline mit der gefilterten
  Menge neu aufbauen, Scroll auf Tunnel-Anfang setzen (sanft), Wurzel-Hoehe anpassen.

## Seiten-Aufbau (app/relaunch-preview/tipps/page.tsx)

1. Chrome: RelaunchMenu (bleibt) + NEU rote Hasen-Wortmarke/Logo oben links auf Weiss
   (Link auf /relaunch-preview) — wie auf der Referenzen-Seite (GalleryChrome-Muster ansehen).
2. Hero: bestehender tipps-hero (Malen + Scatter + roter Punkt) BLEIBT. Uebergang:
   direkt nach dem Hero beginnt der Tunnel; erstes Item ist ab Tunnel-Start sichtbar
   klein hinten (siehe oben) — wirkt als "kommt schon waehrend die Buchstaben wegfliegen".
   Ggf. Hero-Auslauf (P_SCAT1=0.92, Rest-Padding der scene) verkuerzen, damit kein
   totes weisses Stueck zwischen Scatter und erster Karte liegt.
3. Tunnel-Sektion (neue Client-Komponente components/relaunch/… oder components/subpages/…,
   self-contained <style>, Prefix z.B. .rrtn-). Das bisherige rrt-Register + Lead +
   CTA-Sektion ENTFAELLT auf der Uebersicht (Artikel-Detailseiten unveraendert).
   FooterReassembly bleibt unten.
4. Mobile: Touch-Scroll MUSS funktionieren (kein Scroll-Hijacking; die Buehne ist
   sticky, gescrollt wird nativ), Karten width 80vw, Filterleiste unten fix,
   horizontal wischbar. 100dvh beachten.

## QA-Pflicht

tsc + Tests gruen; Browser: Hero->Tunnel-Uebergang, Karten-Flug fluessig, Klick auf
Karte oeffnet Artikel, Filter + Suche rebauen den Tunnel korrekt, Konsole sauber,
Soft-Navigation von/zu anderen Seiten leakfrei (isConnected-Guard-Muster bzw.
React-Cleanup); Mobile-Fenster: Touch-Scroll, Karten 80vw, Leiste wischbar.
