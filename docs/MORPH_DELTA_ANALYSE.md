# Morph-Delta-Analyse: unsere Version vs. all-turtles (Video-Vergleich 05.07.2026)

Quellen: Tomson-Videos (Original 63s: scratchpad/at-video/f_*.jpg | unsere Version 54s: scratchpad/rr-video/r_*.jpg, beide 2fps) + extrahierte Lottie-Keyframes. Dieses Dokument ist die VERBINDLICHE Arbeitsliste fuer die naechste Engine-Runde. Tomson-Urteil: aktuell ~25% des Originals.

## Die 8 konkreten Unterschiede (Frame-Vergleich)

1. **Teile-Anzahl.** Original: 60-100 Teile gleichzeitig sichtbar. Wir: 12-30. Der Screen wirkt bei uns LEER (r_0012: 12 Teile verstreut = "billig"-Eindruck). FIX: Pool 100-120, Vermehrung ueber Klone.
2. **Teile-Groesse.** Original: einheitlich ~2,5-4% der Viewportbreite, alle Teile aehnlich schwer. Wir: im Hero zu gross, in den Szenen winzig (r_0020: Splitter + fette Punkte gemischt). FIX: baseSize ~0.032*vmin ueberall, Groessenband eng (0.85-1.1).
3. **Raumfuellung im Zerfall.** Original: Teile fuellen den GANZEN Bildschirm inkl. Raendern; neue Teile schieben von aussen REIN, ueberzaehlige verschwinden ueber den Rand (Tomson: "kommen aus dem Nichts dazu"). Wir: duenn, zentrumslastig, grosse Leerflaechen. FIX: Zerfall = Verteilung ueber ganzen Viewport + Rand-Spawn/-Exit.
4. **Form-Kompaktheit.** Original-Formationen (Zahnraeder, Gluehbirne, Dokument) sind KOMPAKT (~30-40% Viewportbreite) und DICHT (Kontur + Innenfuellung, stark ueberlappend, f_0022 wirkt fast solide). Wir: Formen zu gross aufgeblasen (~60vw) und innen hohl. FIX: scale 0.42*vmin, Innenfuellungs-Punkte je Form, Ueberlappung zulassen.
5. **Dramaturgie ohne Leere.** Original: die Phasen UEBERLAPPEN — waehrend eine Form zerfaellt, sammeln sich schon Teile der naechsten; es gibt NIE einen leeren Moment. Wir: Zerfall -> leerer Screen -> Aufbau. FIX: Szenen-Uebergang = direkter Morph Form->Form (Teil behaelt Sichtbarkeit, fliegt zur naechsten Rolle), kein "alle weg, alle her".
6. **Form-Sprache der Teile.** Original: kraeftige s-Kurven und Serifen-Balken, optisch aehnliches Gewicht, keine Mini-Splitter. Wir: inhomogen. FIX: Teile-Set kuratieren (die 2-3 kleinsten Fragmente aus dem Pool nehmen bzw. nur vergroessert einsetzen).
7. **Wortmarke.** GEFIXT 05.07.: Zeile 1 eingerueckt, enger Zeilenabstand (wie "all/turtles").
8. **Timing/Traegheit.** Original: Fahrt wirkt schwerer/gedaempfter (Lenis-Lerp niedriger), Ankuenfte satt. Abgleich nach Engine-Umbau gegen beide Videos.

## Was Tomson liefern kann (Antwort auf seine Frage)
- Genau das, was er getan hat: VIDEOS + konkrete Screenshots mit Ansagen. Das funktioniert; mehr Rohdaten braucht es nicht (Lottie-Keyframes + CSS + Fonts liegen komplett vor).
- Schnelle Gate-Urteile auf jede neue Preview-Stufe (10-Sekunden-Antwort reicht: "Richtung stimmt / Punkt X falsch").
- Font-Entscheidung (Fraunces behalten vs. Heldane kaufen) — steht aus.
- NICHT noetig: CSS-Links, Crawls, generierte Anordnungs-Bilder.

## Umsetzungs-Reihenfolge (naechste Engine-Runde, Fable)
1. ScenesMorph-Kern: Pool 100-120 kleine Teile, kompakte gefuellte Formen, Morph Form->Form ohne Leere, Rand-Spawn.
2. Hero-Zerfall: fuellt ganzen Screen, Teile-Vermehrung beim Burst (Klone spawnen sichtbar), Uebergang in Szene 1 ohne Leerlauf.
3. Timing-Pass gegen beide Videos (Frame-Overlays).
4. Danach neues Tomson-Video unserer Version als Gegenprobe.

## NACHTRAG 05.07. spaet: Formations-Komposition = aus den Original-Daten uebernehmen (Tomson-Freigabe)
ANTWORT auf "wie bekommst du die Gluehbirne wie ein Kuenstler hin": GAR NICHT selbst komponieren und KEINE Gemini-Vorlage noetig. Die at-Formationen sind handkomponierte After-Effects-Arbeit, und wir BESITZEN ihre exakten Zielkoordinaten: in den extrahierten Lottie-JSONs (~/dev/at-reference-lottie/anim_*.json) steht fuer jeden Halte-Frame jeder Szene Position/Rotation/Scale JEDES Teils. Umsetzung naechste Runde:
1. Parser-Skript: pro Szene den statischen Halte-Frame auslesen -> Liste {x,y,rot,scale} (normiert auf 1920x1080) -> als Daten-Arrays in formations.ts (ersetzt die algorithmischen build()-Funktionen). Unsere 14 Naturbruch-Teile werden auf die at-Teil-Slots gemappt (aehnlichste Form: Balken->Balken, s-Kurve->Schwung).
2. Damit stimmen automatisch: Dichte/Packung (Kuenstler-Komposition), Teil-Anzahl (~150-200), Groessenvarianz (Z-Tiefe), Kompaktheit.
3. KLAR MARKIERT als Uebergangsloesung (Tomson: "nimm deren, wir machen spaeter eigene") — at-Assets selbst werden NICHT eingebunden, nur Messdaten als Zielkoordinaten; eigene Kompositionen folgen nach Launch-Freigabe.
4. Aus LLM-Fremdanalyse uebernommen (deckt sich mit Video): Formationen ALTERNIEREN links/rechts (Zahnraeder links, Birne RECHTS, Dokument links, Chart rechts, Kopf links), Text jeweils gegenueber; Z-Tiefen-Effekt (Groesse+leichte Unschaerfe vorn); Footer-Reassembly = Teile REGNEN von OBEN herab (nicht radial); Partikel-Anzahl 150-200.
5. ScenesMorph: Seiten-Alternierung einbauen (aktuell alles links = falsch fuer Szenen 2/4).
