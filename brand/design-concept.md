# design-concept.md — Optik/Interaktions-Konzept neue Seite (Draft v0.1)

Aus Tiefen-Analyse der 3 Referenzen (Tomson-Auswahl 15.06). Ziel-Gefuehl: "wow, die koennen was, keine 08/15".

## Referenz-Analyse (visuell + technisch)
- **all-turtles.com (Tomsons Favorit):** Weiss, riesige High-Contrast-SERIF (Font "Heldane"), Body = System-Sans, EIN warmer Rot-Akzent (fast unser Rot), generative rote Typo-Kunst (Mandala aus Buchstaben), scroll-getriebene Typo-Animation (Logo skaliert beim Scrollen). Tech: **Next.js + next/font**. Edel durch Typo + Raum + Bewegung, nicht durch Effekt-Gewitter. Editorial + Charakter.
- **silberpuls.de:** Weiss, kraeftige runde SANS (Font "Satoshi", 72px), Schwarz/Weiss, **Award-Badges direkt im Hero** (Sofort-Trust), dunkle Rounded-Cards. Tech: **Framer**. Bold + trust-lastig.
- **designatives.com:** Weiss, MASSIVE Grotesk-SANS (Font "Rebond Grotesque", ~120px), Schwarz/Weiss, viel Whitespace, schwere Scroll-Motion. Maximal Typo + Bewegung.

## Gemeinsame DNA (= was den "die koennen was"-Effekt macht)
1. Ueberdimensionale, selbstbewusste Typografie als Hero (40-120px). Type IST das Design.
2. Reduzierte Palette: weisser Hintergrund, fast-schwarzer Text, EIN Akzent (all-turtles = Rot, wie RR).
3. Viel Whitespace = premium, souveraen.
4. Scroll-getriebene Bewegung (Typo skaliert, Reveals, Smooth Scroll) = der Interaktions-Wow.
5. Premium-Custom-Fonts, NICHT System-Default.
6. (silberpuls) Trust/Award-Badges frueh = Beweis sofort.

## Empfehlung fuer Red Rabbit (Synthese)
**Editorial-Bold auf weisser Flaeche, EIN Rot (das Red-Rabbit-Rot), riesige Typo, viel Raum, scroll-getriebene Bewegung.** Konkret:
- **Headlines = oversized Display-SERIF** (a la all-turtles: distinktiv, premium, waermer/menschlicher als reine Sans) + **Body = saubere moderne Sans** (legibel, "tech"). Serif+Sans-Mix ist der distinktivste der drei und Tomsons Favorit.
- **Palette:** Weiss / fast-Schwarz (Schiefer) / Red-Rabbit-Rot als einziger Akzent.
- **Signatur-Element (unser eigener Wow):** all-turtles hat die generative rote Typo-Kunst. RR-Twist = artful rotes Motiv (Hase/Geschwindigkeit) PLUS **Live-Performance-Beweis** (echter Speed-Score, Vorher/Nachher) im Hero. = "schoen UND gefunden" als Design gewordene Marke. Genau unser USP visuell.
- **Trust frueh** (von silberpuls geklaut): echte Referenz-Logos / Badges gleich im Hero.
- **Interaktionen:** Smooth-Scroll, scroll-getriggerte Reveals, skalierende/maskierte Typo, Magnetic-Buttons, dezenter Custom-Cursor. Souveraen, nicht verspielt.

## Tech (machbar im bestehenden Next.js-Stack)
- Premium-Serif via next/font (lizenziert Heldane/GT Super ODER gratis Fraunces / "Editorial New"-Alternativen).
- Motion: **GSAP + ScrollTrigger + Lenis** (Smooth Scroll) ODER Framer Motion. 
- ACHTUNG/ehrlich: Motion darf die **Core Web Vitals NICHT killen**. Eine langsame "Performance-Agentur"-Seite waere Marken-Selbstmord. Performance-Budget Pflicht, Animationen GPU-schonend, Lighthouse bleibt top.

## all-turtles Hero-Animation — GESEHEN & verstanden (Frame fuer Frame)
Mechanik (live verifiziert): Der Logotype "all turtles" steht zentriert/gross. Beim Scrollen ist die Sektion **gepinnt**, und der Scroll-Fortschritt treibt eine **Disassemblierung**: die einzelnen Buchstaben/Fragmente fliegen auseinander und driften nach aussen (man scrollt "durch" das Logo). Smooth durch **Lenis** (Smooth-Scroll, verifiziert). Tech-Rezept: **GSAP + ScrollTrigger (pin + scrub) + Lenis**, Logo als Einzel-Teile (SVG), jedes Teil mit eigenem transform (translate/rotate/scale) auf Scroll-Progress gemappt. Machbar in Next.js.

## WIE all-turtles ES TECHNISCH MACHT (Code inspiziert 16.06) — DEFINITIV
- **KEIN canvas, KEIN WebGL, KEIN Video** fuer das Morph (Videos auf der Seite = nur Case-Study-Produktvideos).
- Das morphende rote Motiv ist EIN grosses **Inline-SVG mit ~705 einzelnen `<path>`** (jede Buchstaben-Scherbe = ein Pfad).
- Jede Scherbe wird per Code (transform: translate/rotate/scale) zwischen DESIGNTEN Anordnungen interpoliert, gekoppelt an den Scroll-Fortschritt. Smooth via **Lenis**. Next.js. Kein THREE/GSAP/Lottie-Global (Animation gebundelt, vermutlich Framer Motion/eigene rAF).
- **Der "Wow" = DESIGNER-Handwerk:** ein Mensch hat dieselben ~Pfade in jede Ziel-Form (Logotype, Gluehbirne, Zahnrad, Kopf) arrangiert. Code morpht nur zwischen diesen fixen, gestalteten Keyframes.
- **Konsequenz fuer RR:** Partikel-Physik/WebGL war der FALSCHE Ansatz. Richtig = Set fixer, SOLIDER roter Vektor-Teile (Scherben/Pinselstriche/Hasen-Teile), die ein Designer in M Keyframe-Bilder anordnet; Code interpoliert Transforms pro Teil auf Scroll. Symbol ist dadurch automatisch SOLID (gefuellte Vektoren, keine Punkt-Luecken). Machbar im Next.js-Stack (Framer Motion/GSAP + Lenis), OHNE WebGL. Abhaengigkeit = DESIGN der Keyframe-Anordnungen (Tomsons Award-Designer).

## all-turtles GESAMT-Prinzip (ganze Seite gesehen) — die "Morph-Engine"
EIN konsistentes rotes Material (immer dieselben Buchstaben-Formen) verwandelt sich beim Scrollen fortlaufend in ein zum Abschnitt PASSENDES Icon:
- Hero-Logotype -> zerfaellt in Fragmente -> **Gluehbirne** (Brand/Design: "Strong brands soar. Weak brands fizzle.") -> **Wachstums-Pfeil/Diagramm** (Finance: "When it comes to money, we can help") -> **Kopf/Gehirn** (Team: "The better the team... so you won't need us.").
- Layout-Muster: links editoriale Serif-Copy, rechts das morphende rote Icon. Plus farbige Vollbild-Case-Sektionen (z.B. tuerkis "AIRTIME") mit Card, die von rechts reinfaehrt + Riesen-Hintergrund-Buchstabe.
- Das ist der eigentliche Wow: eine Substanz, unendlich viele bedeutungsvolle Formen, ein Rot.
- WICHTIG (Ehrlichkeit, kein Copycat): ihr spezieller Blackletter-Buchstaben-Look ist IHRE Signatur. Wir uebernehmen die TECHNIK/Idee (morphendes rotes Material), NICHT ihren Look. Unser Material = Red-Rabbit-eigene Formen (Hase + saubere/moderne Formen).

## RR Hero-Choreografie (Tomsons Idee, ausgearbeitet) — Teile -> ganzes Hasen-Logo -> Transformation
1. **Start:** Serif-Tagline oben. Darunter NUR Fragmente des Hasen-Logos (z.B. Ohren/Teile am Rand verstreut) = der umgekehrte Endzustand von all-turtles.
2. **Scroll (gepinnt, gescrubbt):** Die Fragmente **fliegen zusammen und setzen sich zum kompletten Red-Rabbit-Logo** zusammen (das befriedigende Gegenteil von all-turtles "Order aus Chaos").
3. **Transformation (Ende):** Das fertige Logo **verwandelt sich** - Empfehlung: der Hase "spurtet" los (Speed = schnelle Websites) und wird zu einem roten Strich/Streak, der die naechste Sektion einleitet. Alternativen: Logo skaliert, man scrollt "hinein"; oder Hase wird zum Cursor, der auf den Live-Speed-Beweis zeigt.
4. **Bedeutung (nicht Deko):** Fragmente->ganz = "wir bringen die Teile zusammen"; Hase spurtet = Performance/Tempo. Die Bewegung BEWEIST "die koennen was".

## Die Hasen-Idee praezise erklaert (3 Varianten)
- **Variante A - Logo-Assembly (Hero-Opener):** Hero startet mit verstreuten roten Fragmenten -> sie fliegen zusammen zum kompletten Hasen-Logo -> Hase spurtet los/Streak. (Gegenteil von all-turtles' Explosion.)
- **Variante B - Morph-Engine (all-turtles-Prinzip, RR-eigen):** Der Hase ist die "Heimat-Form". Pro Abschnitt morpht DASSELBE rote Material vom Hasen in ein passendes Icon und zurueck: Lupe/Pin ("gefunden werden") -> Tacho/spurtender Hase ("Speed/Performance") -> 4 Formen ("die Methode") -> Haendedruck/Schild/Haken ("kein Risiko"). Der Hase ist der wiederkehrende Identitaets-Anker, der sich staendig neu formt.
- **Variante C - Pfoten-Abdruecke (literal):** Rote Hasen-Spuren/Abdruecke fuehren den Nutzer die Seite hinunter (Scroll-Leitfaden); an Schluesselstellen setzen sich die Abdruecke zum Logo/Icon zusammen. Verspielter.
- **Empfehlung:** Hero = A, durch die Seite = B (Hase als Form-Wandler), C optional als verbindender roter Faden. B ist am naechsten an dem, was Tomson an all-turtles liebt (sinnvolles Dauer-Morphing), kohaerent und einzigartig RR.
- **Tech-Zusatz fuer Morphing:** SVG-Path-Morph (GSAP MorphSVGPlugin oder Flubber) zwischen vordefinierten Formen, an Scroll-Progress gekoppelt. Ehrlich: viele komplexe SVG-Morphs koennen schwer werden -> optimierte Pfade + Performance-Budget Pflicht.

## Gesamt-Seitenaufbau (was wir von wem nehmen)
- Hero: editoriale Serif-Tagline + die Hasen-Logo-Choreografie (all-turtles-Signatur, RR-eigen) + **Award/Referenz-Badges frueh** (von silberpuls). Idealerweise Live-Speed-Score sichtbar (RR-USP).
- Danach: grosse editoriale Typo-Sektionen mit viel Whitespace + scroll-Reveals (Problem/Feind -> Methode 1-4 -> Beweis/Cases -> Preis -> FAQ -> Kontakt). Ein Rot als einziger Akzent durchziehen.
- Selbstbewusste Groesse + Ruhe (designatives/all-turtles), Trust-Dichte (silberpuls), aber unser Ton (premium, nicht ueberheblich).

## Bewegungs-/Render-Stil (Tomson-Korrekturen 15.06)
- Das Motiv ist NICHT statisch zentriert: es **wandert** (links -> rechts, abwaerts), zerfaellt unterwegs und setzt sich an NEUER Stelle neu zusammen (wie all-turtles' Fluss).
- Es geht **NIEMALS ueber Schrift/Text** - laeuft neben dem Text.
- Rechtecke/Konfetti = VERWORFEN (billige all-turtles-Kopie). Wir brauchen einen EIGENEN, aesthetischen Partikel-Stil.
- Render-Stil-Kandidaten (Prototyp brand/prototypes/morph-styles-compare.html, 3 nebeneinander):
  - **A 3D-Kugel-Schwarm** (Tomsons Idee): weiche plastische Kugeln, Schwarm-Bewegung (Voegel/Bienen), reassemble.
  - **B Partikel-Netz**: feine Punkte + duenne Verbindungslinien (Konstellation), techy/Performance/KI.
  - **C Fluessige Tropfen**: verschmelzende Blobs (Tinte/Quecksilber), edel, eigenstaendig.
- [offen] Tomson waehlt Stil A/B/C (oder Mischung).
- **NIVEAU-ENTSCHEIDUNG (Tomson 15.06): flache Canvas-Kreise = Anfaenger, VERWORFEN.** Ziel = Award/Awwwards-Level. Technik = **WebGL / Three.js GPU-Partikel + Curl-Noise-Stroemungsfeld** (FBO/GPGPU), echte Murmuration (Vogelschwarm), tausende weiche Partikel mit Tiefe. Prototyp v2: brand/prototypes/webgl-murmuration.html (15.000 Partikel, Curl-Noise, Maus-Parallaxe). In Produktion sauber als Komponente + Performance-Budget (statischer Fallback/prefers-reduced-motion).

## Performance-Pflicht (unabhaengige harte Wahrheit)
Diese Motion darf LCP/CWV NICHT killen. Tagline + Inhalt rendern sofort (nicht hinter Animation gaten), Animation nur Enhancement, nur GPU-transforms, SVG optimiert, prefers-reduced-motion respektieren. Eine langsame Performance-Agentur-Seite = Selbstwiderspruch.

## Offen
- [offen] Transformations-Ende: Hase spurtet/Streak (Empfehlung) vs. Hineinzoomen vs. Cursor-zu-Speed-Beweis?
- [offen] Tomson: Serif-Editorial (all-turtles-Linie) ODER Bold-Sans (silberpuls/designatives)?
- [offen] Welches konkrete Element liebst du (Riesen-Typo? generatives Motiv? Award-Badges? Live-Speed-Proof?)
- [offen] Font-Wahl final, Farbwerte (das genaue RR-Rot definieren).
