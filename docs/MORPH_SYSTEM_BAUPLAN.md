# Morph-System Bauplan — die all-turtles-Grammatik (vermessen 2026-07-03)

Reproduzierbares Schema fuer den Buchstaben-Zerfall-Effekt. Quelle: Live-Vermessung all-turtles.com (705 SVG-Pfade, Szenen-Screenshots, Groessen-/Rotations-/Dichte-Statistik). Ziel: mit diesem Bauplan laesst sich der Stil auf beliebige Woerter, Logos und Motive anwenden, ohne dass ein Betrachter einen Fremdkoerper erkennt.

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
- Translation dominiert; Rotation dezent; Scale nur minimal.
- **Anticipation:** vor dem Zerfall zieht sich die Wortmarke zusammen (horizontal zum Wortzentrum UND Zeilen vertikal ineinander, starke Ueberlappung; letzte 30% der Kontraktion: leichte Einzeldrehungen bis ~10 Grad).
- **Burst:** kurz relativ zur Gesamtstrecke (bei all-turtles ~200 Scrollpixel nach ~500 px Kontraktion), danach langsames Weiterdriften.
- **Stagger:** jedes Stueck hat ein eigenes Zeitfenster (Versatz bis ~40% der Phase); kleine Stuecke (G3) bewegen sich schneller und weiter als grosse (G1).
- Groessere Distanz = spaeteres, schnelleres Stueck. Wirkung: organisch statt uniform.

## 6. Szenen-Logik (Motive)
- Jede Szene = Teilmenge des Pools, geordnet nach EINEM strengen System: Radialsymmetrie in Ringen (Zahnraeder), Saeulen-Stapel + Diagonale (Balkendiagramm mit Pfeil), Baseline-Reihe (Wortmarke), Kontur-Nachzeichnung.
- Im Ruhezustand einer Szene gelten wieder die Rotations-Regeln (aufrecht dominiert, tangential bei Ringen).
- Motiv = einfache, erkennbare Silhouette mit Bedeutung zur Sektions-Botschaft.

## 7. Wiederverwendungs-Rezept
1. Wort in der Display-Serif setzen.
2. Pro Buchstabe Schnittplan nach Strich-Gelenken definieren (G1/G2/G3-Zerlegung).
3. Szenen als Anordnungs-Systeme waehlen (radial/spaltig/linear/Kontur) und Stuecke daraus zuteilen.
4. Scroll-Mapping: Kontraktion 0-22%, Burst 22-42%, Drift/Szenen 42-100%; Stagger + Groessen-Geschwindigkeits-Kopplung anwenden.
5. Performance: Inhalt nie hinter Animation gaten, nur transform/opacity, prefers-reduced-motion = Ruhebilder.

## Offene Messwerte (in Engine-Phase nachziehen)
- Exakte Easing-Kurven (braucht Wheel-Event-Aufzeichnung statt scrollTo, Lenis ignoriert Springen).
- Fragment-Nachzuegler von den Raendern (Menge/Timing).
- Mobile-Verhalten von all-turtles (reduzierte Stueckzahl?).
