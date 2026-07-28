# DESIGN_STANDARD — Red Rabbit Relaunch (KANONISCH)

Festgelegt 28.07.2026 (Grill-Session Thomas). Dies ist die EINE verbindliche Quelle fuer alle
Relaunch-Seiten. Bei Widerspruch zu aelteren Docs gilt DIESE Datei. Aenderungen nur nach
Entscheidung von Thomas, dann hier nachziehen. Plan/Herleitung:
`docs/handoffs/PLAN_vereinheitlichung_2026-07-28.md`.

## Farben
- Rot `#F12032` (`--rr-red`): NUR Akzent, Buttons, Logo, Eyebrow.
- Dunkel `#23262E` (`--rr-navy`): ALLE dunklen Flaechen und dunkler Text. Kein anderes Dunkel,
  kein Navy, kein Tuerkis/Blau — nirgends, auch nicht als Fallback.
- Off-White `#F4F4F2` (`--rr-surface`): Grundflaeche ALLER Seiten. Das einzige Off-White.
  (`#F6F5F1` ist abgeschafft.)
- Weiss `#FFFFFF` (`--rr-paper`): nur als bewusste Wechsel-Flaeche im Sektions-Rhythmus.

## Typografie (3 Rollen, streng)
- DM Sans (`--rr-font-display`, 700): alle Headlines.
- Crimson Pro (`--rr-font-serif`, 500): Hero-/Statement-Saetze.
- Instrument Sans (`--rr-font-ui`): Body, UI, Buttons, Eyebrows. (`--rr-font-sans` = Alias darauf.)
- Gleicher Texttyp = gleiche Schrift auf JEDER Seite. Keine hardcodierten `--font-*`-Vars in
  Komponenten-CSS — immer die `--rr-font-*`-Tokens.

## Formen
- `border-radius: 0` ueberall (Flaechen, Buttons, Karten). Einzige Ausnahme: der runde rote
  Punkt (Cursor-Punkt, Menue-Hover-Punkt).

## Buttons — es gibt genau ZWEI
- Primaer: `rr-btn-sweep rr-btn-sweep--red` (dunkler Grund: `--light`-Variante).
- Sekundaer: `rr-btn-outline` (dunkler Grund: `rr-btn-outline--light`).
- `rr-btn-frame` (Eck-Klammern) ist ABGESCHAFFT. `rr-btn`-Familie nur fuer Formulare/Utility.
- Alle Buttons mit sichtbarem `:focus-visible`.
- Button-Labels ohne eckige Klammern ("Anrufen", nicht "[ ANRUFEN ]"). Telefon nie im Klartext,
  nur hinter tel:-Link.

## Eyebrow — EIN Standard
- Rote Grossbuchstaben-Zeile MIT runden Klammern: `( Thema )` — Klasse `.rr-eyebrow-theme`
  (Klammern via ::before/::after, Vorbild wd-eyebrow). Gilt ueberall: Homepage-Panels
  ("( Das Problem )"), Preise-Bumper, Unterseiten.
- Eck-Klammer-Aesthetik (Menue-Reticle, frame-Button) ist abgeschafft — anderes Element als die
  runden Klammern.

## Site-Chrome
- Menue: Kookie-Mechanik, Punkte OHNE Eck-Klammern; Hover/Fokus/Aktiv = kleiner roter Punkt.
- CornerLogo oben links: unsichtbar bis ~2 Bildschirmhoehen Scroll, dann 1,2s-Fade; Klick → Home.
- Footer: `FooterReassembly` (ECHTE Komponente, keine Nachbauten) auf jeder Inhaltsseite.

## Abschluss-Block (jede Inhaltsseite)
- Aufbau wie Homepage: linksbuendig, Headline-Stil HomeClosing, Button-Paar, danach
  FooterReassembly. Text PRO SEITE angepasst (Thema aufgreifen), max. Wortzahl wie Homepage-CTA.
  Rechtsseiten: nur Footer.

## Abstaende — Zwei-Klassen-Regel
- Klasse A (normale Sektionen): `--rr-section-y` = clamp(96px, 12vw, 180px), oben = unten.
  KEIN Hardcoding.
- Klasse B (Vollbild-Strecken: Bumper, Horizontal-Pan, Hero): 100vh, buendig OHNE
  Zwischenabstand; einheitliches Innen-Padding der Fenster.
- Uebergang A↔B: exakt Klasse-A-Abstand.

## Scroll & Bumper — EIN System
- Ein Site-Tempo (Lenis ~0.1), eine Easing-Kurve, zentrale Dwell-Konstanten.
- Bumper-Regel: 1 Scroll-Schwung = 1 Fenster, haelt — NUR fuer Kurz-Inhalte (Wort, Headline,
  1-2 Saetze). Lange Absaetze nie im Snap gefangen (NN/g-belegt).
- Jede Bumper-Strecke traegt oben die rote `( Thema )`-Zeile.
- Mobile (<= ~820px): Bumper/Pan degradieren zu normalem vertikalem Scrollen (Muster:
  reduced-motion-Fallbacks). `prefers-reduced-motion` immer respektieren.
- AUSNAHME: kanonische Subpage-Heroes (Wisch-Reveal + MorphSculpture) sind KEIN Bumper und
  bleiben unangetastet.

## Copy-Regeln (Kurzfassung)
- Zielgruppe: oesterr. Mittelstand/KMU breit (NICHT Handwerker-verengt). Quelle:
  brand/copy-homepage.md + brand/positioning.md.
- Keine erfundenen Zahlen/Gadgets; Beweise = echte Reviews + echte Lighthouse-Werte.
- Keine KI-Tells (kein Gedankenstrich, keine Dreierfiguren), echte Umlaute, keine Emojis.

## Demo-Ordner-Regel
- Referenz: ueber-uns-demo. Farb-/Button-/Palette-Aenderungen werden in ALLE Demo-Kopien
  gespiegelt und per diff verifiziert.
