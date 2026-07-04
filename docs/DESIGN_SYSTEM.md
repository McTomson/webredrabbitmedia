# red rabbit Design-System (P0) — Regeln fuer ALLE Relaunch-Seiten

Lebende Referenz: `/styleguide` (noindex). Tokens: `app/styleguide/styleguide.css` (Scope `.rr`).
Quellen: Live-Messung all-turtles.com 04.07. (Typo-Stufen 135/89/74/47/41/27/23/20/16 px, Ink-Logik,
Flaechenlogik Weiss/#F3F4F5/#192836) + Lottie-Extraktion (Master-Easing). NICHTS davon ist geraten.

## Unverhandelbare Regeln
1. **EIN Easing fuer alles:** `cubic-bezier(0.6, 0, 0.4, 1)` (`--rr-ease`). Dauern nur 200/420/700ms. Kein Bounce, kein Linear.
2. **Ein-Rot-Prinzip:** #F12032 ist der einzige Akzent auf Marken-Flaechen. Eigene Farbwelten existieren NUR in Case-Panels (eine pro Referenz).
3. **Ink statt Schwarz:** Text #23262E, Sekundaer #5A5E68. Reines #000 ist verboten.
4. **Typo-Rollen statt Freestyle:** display-1 (Case-Headline), display-2 (CTA), statement (5 Punkte), claim (Hero), sub, eyebrow(-lg), body-lg/body/meta. Display-Rollen = Fraunces (`opsz` 144), alles andere = Instrument Sans. Keine weiteren Schriften, keine weiteren Groessen.
5. **Luft:** Sektionen `clamp(96px, 12vw, 180px)` vertikal. Im Zweifel mehr Weissraum, nie enger.
6. **Du-Anrede, echte Umlaute, keine Emojis, keine KI-Tells** in jeder Zeile Copy.
7. **prefers-reduced-motion** = Endzustaende. Inhalt nie hinter Animation gaten (SSR-Text immer da).
8. **Buttons:** primary (Rot, Pill), secondary (Ink-Outline), ondark (Weiss). Textlink mit Pfeil fuer "Zum Projekt". Nichts anderes.
9. Fokus-Zustaende sichtbar (outline Rot, offset 3px). Formularfehler = rote Border + Klartext-Hinweis.
10. Neue Komponenten NUR aus diesen Tokens; wer eine neue Farbe/Groesse braucht, aendert ERST dieses Dokument (mit Begruendung im decisions-log).

## Fonts
- Fraunces (Google, OFL) via `lib/relaunch/fonts.ts`, Variable `--font-fraunces`, Achsen opsz/SOFT/WONK; Display immer `opsz 144, SOFT 0, WONK 0`.
- Instrument Sans (Google, OFL), Variable `--font-grotesk`.
- ENTSCHEIDUNG 04.07.: kein Font-Kauf. Heldane/Soehne-Aehnlichkeit ueber Fraunces-Tuning.

## Case-Farbwelten (Startset, im Design-Pass pro Referenz final)
- Welt 1 Petrol `#0B3F3B` + Akzent `#FFD784`
- Welt 2 Nacht `#17181D` + Akzent `#F12032`
- Welt 3 Puder `#F3E8E4` + Akzent `#8C2F42`
Regeln pro Welt: Eyebrow-lg in Serif (Kundenname klein), display-1 Headline, sub, Textlink, riesiger
Anfangsbuchstabe Ton-in-Ton (dunklere/hellere Stufe derselben Welt), echte Produkt-Medien davor.

## Anwendung
- Seiten unter dem neuen System tragen die Klasse `rr` + Font-Variablen (siehe /styleguide `page.tsx`).
- Altes Header/Footer-Chrome wird pro Relaunch-Route in `components/Header.tsx`/`Footer.tsx` (pathname-Check) unterdrueckt, bis das neue Chrome (P2) steht.
- Naechster Ausbau (P1/P2): Morph-Engine-Tokens (Szenen-Farben = Markenrot), neues Nav-Chrome, Case-Panel-Komponente, Firmen-Listen-Komponente (rr-companyrow existiert).
