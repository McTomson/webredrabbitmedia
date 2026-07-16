# UNTERSEITEN_STIL.md — Kanonisches Rezept für die Unterseiten

Verbindliche Vorlage für die **Unterseiten** von web.redrabbit.media (Kontakt, Über uns,
FAQ, Leistungs-Detailseiten). Ziel: jede Unterseite sieht aus wie ein Teil der Hauptseite,
weil sie **dieselben echten Bauteile** verwendet — nicht nachgebaut.

> **Quellen der Wahrheit (in dieser Reihenfolge):**
> 1. **`/relaunch-preview`** = die neue kanonische Hauptseite (Beschluss 2026-07-13). Alles muss
>    dazu passen. Live ansehen: `http://localhost:9000/relaunch-preview`.
> 2. **`app/styleguide/styleguide.css`** + **`/design-system`** (live) = alle `rr-*`-Komponenten,
>    verbatim. Die Komponente wird **eingebunden, nicht nachgebaut**.
> 3. **`DESIGN.md`** (Repo-Root) = Tokens, Regeln, Rationale.
>
> Nie raten — Werte hier nicht ableiten, sondern in styleguide.css / relaunch-preview nachlesen.

---

## 0. Das eine Gesetz gegen das Driften (WICHTIGSTE REGEL)

**Nie eine Komponente oder die Morph-Maschine in HTML/JS nachbauen. Immer das echte Bauteil
importieren.** Ein handgebautes Lookalike weicht zwangsläufig ab (Farbe, Schärfe, Timing) — genau
daran sind die früheren Demos gescheitert. Konkret:

- Komponenten (Buttons, Formular, Karten, FAQ, Zitat) = die echten `rr-*`-Klassen aus
  `styleguide.css`, Markup 1:1 aus `/design-system`.
- Der Wort→Figur-Hero = `components/subpages/SubpageHero.tsx`, das die echte Maschine importiert
  (`buildWordLayout`, `grammar.ts`, `at-shapes-comp*.json`). **Kein selbst gerechneter Morph.**
- Menü + Footer = `RelaunchMenu` + `FooterReassembly` (aus `components/relaunch/`).

**Schärfe-Regel (der Grund, warum Nachbauten pixeln):** Jedes Fragment wird in seiner **größten**
Timeline-Größe gerendert; CSS-`transform` darf nur **verkleinern**, nie vergrößern (Upscale =
Matsch). Diese Normierung steckt in HomeMorph/SubpageHero — nie wieder ein Fragment klein rendern
und hochskalieren. **Kein Blur-/Gooey-Filter** auf der Figur.

---

## 1. Vehikel & Routing

- Unterseiten sind **echte Next-Routen unter `/relaunch-preview/`** (z. B.
  `app/relaunch-preview/kontakt/page.tsx`, `.../about/page.tsx`). So werden sie am Ende gemeinsam
  durchgeklickt und live gestellt.
- Die Seite ist eine **Server-Komponente** (`export const metadata`, kein `"use client"`);
  Interaktivität nur in importierten Client-Komponenten. Text bleibt **SSR** (SEO/LLM lesen ihn).
- Muster (bestes Vorbild: `app/preise-preview/page.tsx`):
  `<div className={`rr ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`} style={{background:'#ffffff'}}>`
  , import `styleguide.css`, oben `<RelaunchMenu />`, unten `<FooterReassembly />`.
- Das globale Chrome (`components/Header.tsx`/`Footer.tsx`) wird durch die Prefix-Sperre
  `startsWith('/relaunch-preview')` **automatisch** unterdrückt — nichts daran ändern.
- Seiten-lokales CSS als `<style>{XX_CSS}</style>` mit eigenem Prefix (z. B. `kt-`); **nicht**
  `styleguide.css` oder `components/relaunch/subpages.css` editieren (Ownership).

---

## 2. Farbrollen (aus styleguide.css `.rr`)

| Rolle | Wert | Einsatz |
|---|---|---|
| **Grund** | Weiß `#ffffff` (`--rr-paper`) | Standard-Hintergrund JEDER Sektion. **Kein Off-White als Seitengrund.** |
| **Text** | Ink `#23262e` (`--rr-ink`) | Fließtext/Überschriften; `--rr-ink-soft #5a5e68` sekundär |
| **Akzent (einzig)** | Rot `#f12032` | Der einzige Akzent (roter Schlusspunkt, Primär-CTA, i-Punkt). Sparsam. |
| **Dunkel** | Navy `#1c2837` (`--rr-navy`) | Footer-Grund, Menü-Overlay; **genau EIN** Morph-Fragment pro Figur (das längste). |
| **Farbwelt Teal** | `#1d8c98` (`--rr-world-1-bg`) | Testimonial-Panel (`rr-quote`) = **der eine** Farb-Moment der Seite. Text darauf `#f6f5f1`. |
| **Off-White** | `#f4f4f2`/`#f6f5f1` | NUR für Panels/Flächen (FAQ, Karten), **nicht** als Seitengrund. |
| **Panel-Blau** | `#0a72a0` | Nur Kunden-/Preis-Welt (Kundenliste). Off-White-Text darauf 4,90:1. Rot NIE als Text auf Blau. |

---

## 3. Fonts & Typo-Rollen (aus styleguide.css)

| Rolle | Font (Variable) | Klasse |
|---|---|---|
| Display / Wortmarke / große Headlines | **DM Sans Bold** (`--font-dmsans`) | `rr-display-1/2` |
| **Prominenter Text / Statements / Zitate** | **Crimson Pro 500** (`--font-crimson`) | `rr-statement`, `rr-claim`, `rr-quote__text` |
| UI / Body / Eyebrows / Formulare / Meta | **Instrument Sans** (`--font-grotesk`) | `rr-eyebrow-lg`, `rr-field`, `rr-meta` |

**Merksätze:** der große, tragende Satz ist **immer Crimson** (`rr-statement`). Der kleine Label-Text
oben ist **`rr-eyebrow-lg`: Ink, Großbuchstaben, KEIN Rot, KEINE Klammern** (Beschluss 2026-07-13).
Fraunces retired. Keine Emojis, echte Umlaute, kein Gedankenstrich, DU-Anrede.

---

## 4. Hero = Standard-Fragment-Assembly (auf JEDER Unterseite)

Der Hero ist Pflicht-Signatur jeder Unterseite: großes Wort unten angeschnitten → beim Scrollen
schrumpft/zerbricht es → die roten Fragmente fliegen von überall ein und **formen die Figur**
(scroll-gekoppelt, reversibel). Gebaut mit **`SubpageHero`**:

- Props: `word` (das Seitenwort), `comp` (Figur), Eyebrow + Statement (SSR, neben der Figur).
- Ein Ink-Eyebrow (`rr-eyebrow-lg`) + das große **Crimson-Statement = die `<h1>`** stehen neben der
  Figur (Seite pro Page wählbar; Kontakt = Figur links, Text rechts).
- Figur je Seite (echte Assets `at-shapes-comp*.json`):

| comp | Motiv | Thema | Beispiel-Seite |
|---|---|---|---|
| comp1 | Zahnräder | Webdesign | Leistung Webdesign |
| comp2 | Glühbirne | Google/Sichtbarkeit | **Kontakt** |
| comp3 | Dokument | Content | Leistung Content |
| comp4 | Chart | Dashboard | Leistung Betreuung |
| comp5 | Kopf | KI / Person | **Über uns** |

- Navy-Auge = **genau ein** Fragment, berechnet (größtes Seitenverhältnis), `#1c2837`. Nie hart
  verdrahten. Schärfe-Regel aus §0. reduced-motion: fertige Figur statisch zeigen.

---

## 5. Komponenten-Muster (echte Klassen)

- **Formular (weiß, kein Farbkasten):** `rr-form`/`rr-form__row`/`rr-form__group`, `rr-label`+`rr-field`
  (`rr-field--textarea`), `rr-help`/`rr-error`, Dropdown = `rr-select-native`, Absende-Button
  `rr-btn-sweep rr-btn-sweep--red`. Submit-Logik/Endpunkt von `components/relaunch/ContactFormRR.tsx`
  übernehmen (nicht editieren). Labels über dem Feld, `aria-describedby` für Hilfe/Fehler.
- **Karten / „So läuft's":** `rr-card-soft` (`__eyebrow` + `__label`). Schritte = alle
  `--neutral` (eine Farbe; Nummer + Scroll tragen die Abfolge). Die 3-Farb-Trio
  (`--red/--navy/--neutral`) NUR wenn Karten **drei verschiedene Dinge** zeigen (z. B. Leistungen).
  Scroll-Karten-Stack (Karte schiebt sich nach hinten, nächste kommt vor) = eigene Client-Komponente,
  nur transform/opacity, reduced-motion → gestapelt.
- **Testimonials = Teal-Farb-Moment:** `rr-quote` (Teal-Panel), `__mark`/`__text`/`__attr`
  (`__name`/`__stars`/`__src`). **Sterne in Gold** überschreiben (`#f4b400`, Google-Look, mehr
  Vertrauen). **Nur echte Google-Reviews** (Rafael Danesh, Dmitry Pashlov, Rene Rohrer), keine
  erfundenen Zahlen. Intro nimmt die kleine Anzahl ehrlich vorweg.
- **FAQ — zweispaltig:** links sticky ein **Ink**-Label „FAQ" (`rr-eyebrow-lg`) + große DM-Sans-H2
  mit **rotem Schlusspunkt** (einziger Akzent); rechts das echte `rr-faq`-Akkordeon (natives
  `<details>/<summary>`, `rr-faq--editorial`, Hairline zeichnet sich beim Scroll ein). Mobile
  einspaltig. `components/relaunch/Faq.tsx` nutzen, wenn es die Optik liefert.
- **Buttons:** Primär `rr-btn-sweep--red`, Sekundär `rr-btn-frame`. Max. diese zwei Effekt-Stile.
- **Menü/Footer:** `RelaunchMenu` + `FooterReassembly` (echte Kontaktfakten kommen daraus:
  Red Rabbit GmbH, Grabnergasse 8/8 1060 Wien, office@redrabbit.media, +43 676 9000 955).

---

## 6. Copy-Ansatz (Open-Loop-Hooks, Thomas 2026-07-13)

- Aus **User-Sicht** texten (lokaler Betrieb AT: was will er, welche Probleme, welcher Hook zieht ihn).
- **Neugier-Lücke:** oben ein Hook, der eine Frage aufreißt („Moment, was?!"), bewusst offen.
  Im Verlauf aufbauen, **Auflösung erst am Ende** (Schluss-Statement + CTA) → Dopamin.
- Agentur = „wir", Kunde = „du". Keine Floskeln, keine Emojis, kein Gedankenstrich, echte Umlaute.
- Texte gehen **gemeinsam mit Thomas** durch. Copy immer mit Opus. Nur echte Fakten (5,0/3 Google).

---

## 7. Motion-Signatur

- **Scroll = Zeitachse** (scrub, vor/zurück reversibel), eine Kurve überall:
  `masterEase = cubic-bezier(0.6,0,0.4,1)` (`--rr-ease`). Nur `transform`/`opacity` animieren.
- `prefers-reduced-motion: reduce` **immer**: CSS-Kill-Switch **und** JS-Zweig (statischer
  End-Zustand). Beide Ebenen.
- Premium sparsam: pro Seite ein Signatur-Moment (der Hero) + evtl. der Karten-Stack; sonst nur
  dezente Scroll-Reveals (`rr-reveal`).

---

## 8. Eckig-Gesetz

`border-radius: 0` für **alle** UI-Komponenten. Rund nur: Umlaut-Punkte, fallender roter Punkt/Cursor,
Mini-Indikatoren (Spinner, `rr-error::before`), Toggle-Knob, Radio-Dot.

---

## 9. Unter der Haube (SEO / LLM / Speed) — Pflicht

- **SSR-Text**: H1 (= das Crimson-Hero-Statement) und aller Fließtext stehen im server-gerenderten
  HTML (Crawler/LLMs lesen sie, obwohl der Morph client-seitig ist). Genau ein `<h1>`, Sektionen `<h2>`.
- **JSON-LD** via `components/JsonLd.tsx`: ContactPage (contactPoint aus den Footer-Fakten), FAQPage
  (aus den Q&A), Organization/LocalBusiness. Reviews nur echt; **kein erfundenes aggregateRating**
  (bei Zahl-Konflikt fail-closed die belegbaren 3, `lib/reviews.ts` beachten).
- **Meta + Open Graph** + selbst-referenzielles `canonical` pro Seite (kein globales Canonical).
- **Speed**: wenig Client-JS, nur transform/opacity, `will-change` sparsam, Bilder `next/image`+lazy,
  keine neuen schweren Libs. Ziel: gutes Ranking auf Google, Bing und in LLMs.

---

## 10. Checkliste „neue Unterseite fertig?"

1. Route `app/relaunch-preview/<seite>/page.tsx`, Server-Komponente, `.rr` + 3 Fonts, weiß, styleguide.css.
2. `RelaunchMenu` oben, `FooterReassembly` unten (globales Chrome greift nicht — ok).
3. Hero = `SubpageHero` (passende comp), Ink-Eyebrow + Crimson-H1 (SSR), scharfe Figur, Navy-Auge berechnet.
4. Sektionen aus echten `rr-*`-Bauteilen (§5), weiß, EIN Teal-Testimonial-Moment, Gold-Sterne.
5. FAQ zweispaltig (Ink-Label), Karten neutral, Formular ohne Farbkasten.
6. Copy nach §6 (Hook oben, Auflösung unten, User-POV, echte Fakten, Platzhalter markiert).
7. SEO/Schema/Speed nach §9.
8. Verifizieren **im echten Vordergrund-Browser** (`agent-browser`): lädt ohne Konsolenfehler,
   Figur setzt sich scharf zusammen wie `/relaunch-preview`, kein Querscroll (Desktop+Mobile),
   Kontrast/Fokus ok, SSR-Text per `curl` im HTML, Stil identisch zur Hauptseite.
