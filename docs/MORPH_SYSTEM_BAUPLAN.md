# Morph-System Bauplan — die all-turtles-Grammatik (vermessen 2026-07-03, Keyframes extrahiert 2026-07-04)

Reproduzierbares Schema fuer den Buchstaben-Zerfall-Effekt. Quelle: Live-Vermessung all-turtles.com (705 SVG-Pfade, Szenen-Screenshots, Groessen-/Rotations-/Dichte-Statistik) + komplette Keyframe-Extraktion der Original-Animation (04.07., §0). Ziel: mit diesem Bauplan laesst sich der Stil auf beliebige Woerter, Logos und Motive anwenden, ohne dass ein Betrachter einen Fremdkoerper erkennt.

## 0. TECHNIK-BEFUND 04.07. (hart gemessen — ersetzt alle frueheren Motion-Vermutungen)

**all-turtles ist KEINE Code-Physik. Es ist eine handanimierte After-Effects-Animation, als Lottie-JSON exportiert und per Scroll gescrubbt.** Beweis: alle SVG-Elemente tragen `__lottie_element_*`-Clip-IDs; Player = lottie-web (SVG-Renderer); Scrub = `goToAndStop(progress * totalFrames)` mit `progress = clamp01((innerHeight - rect.top - 0.1*h) / (1.5*h))` pro Sektion (aus dem Next.js-Bundle dekompiliert). Deshalb wirkt es organisch: ein Motion-Designer hat jedes Teil von Hand gesetzt.

**Extrahierte Original-Daten: `~/dev/at-reference-lottie/` (9 Lottie-JSONs; anim_0.json = Hero-Morph 1920x1080, 24fps, 153 Frames). NUR Studienmaterial — NIE ins Repo committen, NIE Assets daraus verwenden (Copyright all-turtles).**

Architektur des Hero-Morphs: 6 Szenen-Precomps hart hintereinander (Frames 0-18 Wortmarke+Kontraktion+Burst mit 17 Layern = ganze Buchstaben; 18-45 Fragment-Transit, 130 Layer; 45-69 Motiv 1, 174 Layer; 69-93: 164; 93-119: 43; 119-153: 176). Szenen fliegen ein (Keyframes enden ~Frame 21 der Szene) und HALTEN dann statisch bis zum Schnitt — eingebaute Ruhepunkte. Vermehrung 17 -> 130 -> 174 bestaetigt.

Die Keyframe-Grammatik (gemessen ueber 600+ Layer):
1. **EIN Easing fuer ALLES: cubic-bezier(0.6, 0, 0.4, 1).** 259 von 260 gemessenen Positions-Keyframes tragen exakt i.x=0.4 / o.x=0.6. Das ist DIE Signatur des Gefuehls: weicher Anlauf, weiche Ankunft, nie linear, nie bouncy.
2. **Kontraktion (Frame 2-5, nur ~3 von 16 Hero-Frames): NULL Rotation.** Alle 17 Buchstaben bleiben exakt waagrecht auf ihrer Ebene. Vertikal: obere Zeile +20px runter, untere -20px rauf (FLACHER Fixbetrag, keine Proportion). Horizontal: zum Wortzentrum, 20-50px je nach Abstand (aussen mehr, Deckel ~50px bei 1920er Flaeche). Tomsons v6-Kritik war exakt richtig.
3. **Burst (Frame 5-15):** vom Kontraktionspunkt direkt radial raus; NUR 7 von 17 Buchstaben rotieren dabei (±22 bis ±73 Grad), der Rest fliegt aufrecht. Zielpunkte individuell, bis ~470px.
4. **Jedes Teil hat in jeder Phase genau 2 Positions-Keyframes = GERADE Flugbahn** (alle Spatial-Tangents 0, keine Kurvenpfade). Die Organik entsteht NUR aus (a) Stagger der Startzeiten (ueber ~50% der Phase verteilt), (b) individueller Rotation im Transit (129/130 Teile, median |78| Grad, max 168, Richtungen ~50/50), (c) dem einen Easing. Rotations-Keyframes liegen ZEITGLEICH mit Positions-Keyframes: die Drehung endet exakt bei Ankunft.
5. **Flugdauer ~konstant (~10 von 24 Frames), unabhaengig von der Distanz** (Korrelation Distanz-Dauer ~0): weiter = schneller, nicht laenger unterwegs. Assembly-Szenen: Starts eng (Frame 2-7), Ankuenfte gestaffelt (16-21), Dauer ~14 Frames.
6. **Scale wird in Motiv-Szenen aktiv benutzt** (Szene 2: 73/174 Layer skalieren, z.B. 100 -> 63..138), um dieselben Teile ins Motiv einzupassen — die technische Form der "Vermehrung".
7. Positionierung: Layer-Anchor relativ zum Kompositions-Zentrum (960, 526) — identisch zu unserem buildWord-Ansatz (Zentrum + Offset).

**Konsequenz fuer red rabbit (Architektur-Entscheidung 04.07.):** Die Engine wird ein KEYFRAME-CHOREOGRAFIE-PLAYER, keine Physik-Simulation. Choreografie = Datenstruktur (pro Teil: Keyframes t/x/y/rot/scale), Interpolation mit cubic-bezier(0.6,0,0.4,1), Scroll-zu-Frame-Mapping wie oben. Choreo generativ nach dieser Grammatik erzeugen (Skript), dann von Hand tunen — oder als eigenes Lottie authoren. Gefuehl exakt reproduzierbar, Engine trivial.

## 1. Material
- EINE kontraststarke Fatface-Display-Serif (all-turtles: Heldane; wir: Fraunces-Platzhalter, Ziel Heldane-Lizenz).
- Alle Stuecke sind Glyphen oder Glyphen-Teile der Wortmarke. Nichts Fremdes (keine Formen, Icons, Partikel).
- EINE Markenfarbe, flache Fuellung, keine Schatten/Verlaeufe. Wir: #F12032 (aus Logo gesampelt).

## 2. Zerteilungs-Logik (der Schluessel)
**NATURBRUCH (Kern-Regel, Tomson final 03.07 nacht):** Bruch = klarer VERTIKALER Schnitt EXAKT auf der Kante des geraden Elements (Stammkante), sauber und schnurgerade; kein Ansatz-Stummel des anderen Teils bleibt stehen. Technik (final, pixelperfekt verifiziert 04.07): CLIP-REGIONEN pro Teil (Vereinigung von Rechtecken, Grenzen exakt auf den gemessenen Kontaktkanten, r-Kante bei 29.4 wegen Haarlinien-Ueberhang). KEINE Pixel-Radierung (zerstoert Anti-Aliasing, erzeugt Zacken). Der Canvas/SVG-Clip rendert die Schnittkante als glatte gerade Linie. Referenz-Implementierung + exakte Koordinaten aller 14 Teile: Bauplan-Artifact (SPEC-Array in bauplan.html). Keine krummen Trennpfade, keine Diagonalschnitte, keine Zufallslinien. Der Stamm behaelt alle Serifen. Zerlege-Plan Fraunces: r = Stamm + Arm-Tropfen. e = C-Schwung (inkl. unterem Keil) + Deckel (Querbalken gehoert KOMPLETT zum Deckel), 2 Teile. a = Haken + Bauch-Mond + Stamm (3 Teile). d = C-Mond + Stamm. b = Stamm + Bogen. i = Punkt + Stamm (freie Luecke). t, l, s bleiben ganz. Teile duerfen ueberlappen (kein Collision-Avoidance) und sich fuer Motive VERMEHREN (weitere Kopien derselben Teile kommen von aussen ins Bild).

**Zerfalls-Kaskade in Generationen** (Groessen gemessen, relativ zur Buchstabenhoehe H):
- G0: Wortmarke komplett (Ruhezustand Hero/Footer).
- G1: ganze Buchstaben. ~1.0 H. (Wortmarken-Szene = 17 Stuecke bei "all turtles", 16 bei "red rabbit".)
- G2: Buchstaben-Haelften, geschnitten am natuerlichen Gelenk (Stamm|Bogen, Punkt|Stamm, ueber|unter Querbalken). ~0.5 H.
- G3: kleine Strich-Baender (S-Kurven, Kommas, Haken, Serifen-Fuesse). 0.1-0.25 H. Das ist der grosse Pool (~700 Teile), Material der Motiv-Szenen.
- Beim Scrollen zerfaellt es progressiv G0 -> G1 -> G2 -> G3 (Screenshots belegen die Reihenfolge); Reassembly = Kaskade rueckwaerts.

## 3. Rotations-Regeln (gemessen)
- ~85% der Stuecke aufrecht: 0 Grad oder 180-Grad-Flip.
- ~12% diagonal: 30-60 Grad.
- 0% Quer-90-Grad, 0% beliebige Dauerrotation im Ruhezustand.
- Im Flug interpoliert die Rotation weich zum Zielwinkel; kein Kreiseln.

## 4. Verteilungs-Logik
- Gleichmaessige Dichte ueber die ganze Flaeche (Naechster-Nachbar-Median 31-35 px bei 1920 Breite), keine Klumpen, Mitte leicht ausgespart wenn dort Inhalt steht.
- Stueckzahl waechst mit dem Zerfall (17 -> 85 -> 167 auf dem Schirm), Groessen mischen sich (alle Generationen gleichzeitig sichtbar).
- Raender duerfen Stuecke anschneiden.

## 5. Bewegungs-Regeln
- 100% scroll-gescrubbt: Position = Funktion des Scroll-Fortschritts. Kein Timer, Rueckwaertsscrollen spult exakt zurueck. Smooth-Layer: Lenis.
- Translation dominiert; Rotation dezent; Scale nur in Motiv-Szenen (Einpassung).
- **Anticipation (KORRIGIERT 04.07, §0.2):** vor dem Zerfall zieht sich die Wortmarke zusammen — horizontal zum Wortzentrum (20-50px, aussen mehr), Zeilen vertikal flach ±20px ineinander. KEINE Rotation waehrend der Kontraktion (v6-Fehler).
- **Burst:** kurz relativ zur Gesamtstrecke; nur ~40% der Buchstaben rotieren beim Rausfliegen (±22-73 Grad), Rest bleibt aufrecht.
- **Stagger (KORRIGIERT 04.07, §0.4/0.5):** Startzeiten ueber ~50% der Phase gestaffelt; Flugdauer pro Teil ~konstant, weitere Distanz = hoehere Geschwindigkeit (nicht laengere Dauer). Flugbahnen sind GERADE Linien.

## 6. Szenen-Logik (Motive)
- Jede Szene = Teilmenge des Pools, geordnet nach EINEM strengen System: Radialsymmetrie in Ringen (Zahnraeder), Saeulen-Stapel + Diagonale (Balkendiagramm mit Pfeil), Baseline-Reihe (Wortmarke), Kontur-Nachzeichnung.
- Im Ruhezustand einer Szene gelten wieder die Rotations-Regeln (aufrecht dominiert, tangential bei Ringen).
- Motiv = einfache, erkennbare Silhouette mit Bedeutung zur Sektions-Botschaft.

## 7. Wiederverwendungs-Rezept
1. Wort in der Display-Serif setzen.
2. Pro Buchstabe Schnittplan nach Strich-Gelenken definieren (G1/G2/G3-Zerlegung).
3. Szenen als Anordnungs-Systeme waehlen (radial/spaltig/linear/Kontur) und Stuecke daraus zuteilen.
4. Choreografie als Keyframe-Daten authoren (§0): pro Teil 2-Punkt-Flugbahnen, Stagger, Rotations-Zuteilung (~40-90% je Phase), EIN Easing cubic-bezier(0.6,0,0.4,1); Scroll-zu-Frame-Mapping pro Sektion.
5. Performance: Inhalt nie hinter Animation gaten, nur transform/opacity, prefers-reduced-motion = Ruhebilder.

## Offene Messwerte (in Engine-Phase nachziehen)
- ~~Exakte Easing-Kurven~~ ERLEDIGT 04.07: cubic-bezier(0.6, 0, 0.4, 1) universell (aus Lottie-JSON, §0.1).
- Mobile-Verhalten von all-turtles: eigenes Mobile-Lottie existiert (365x812, anim_page-..._7.json in ~/dev/at-reference-lottie/) — bei Bedarf analysieren.
- Footer-Reassembly: eigenes kleines Lottie (259x106, 68 Frames, anim_875-..._8.json) — Wortmarke setzt sich dort separat zusammen.
