# PRODUCT.md — Red Rabbit Media (Relaunch web.redrabbit.media)

> Kontext-Datei fuer den Impeccable-Design-Skill. Dokumentiert die BESTEHENDE Marken-
> Identitaet (Quellen: `brand/`, `docs/DESIGN_STANDARD.md`) — sie erfindet nichts neu.
> Kanonische Marken-Wahrheit bleibt `brand/README.md` + `brand/decisions-log.md`
> (append-only). Bei Widerspruch gewinnen die brand/-Dateien; hier nachziehen.
> Angelegt via `/impeccable init` (2026-08-11).

## Register

**brand** — Design IST das Produkt. Die Website ist das Aushaengeschild und die
Verkaufsmaschine der Agentur ("die eigene Seite als bester Beweis"). Bewertet wird an
Wirkung, Haltung, Premium-Anmutung und Conversion, nicht an App-Ergonomie.

Hinweis: Einzelne Bereiche koennen tool-artig sein (Leistungs-Hub, spaeter evtl.
Rechner). Register bleibt pro Seite auf "product" ueberschreibbar, Default ist brand.

## Target Users (Stamm)

Oesterreichischer Mittelstand / KMU, branchen-OFFEN (Handwerk, Gastronomie, Dienst-
leister, Aerzte/Kanzleien, Immobilien u.a.), regional Wien + alle Bundeslaender. Eher
konservativ, preisbewusst, misstrauisch gegen "abgehoben/teuer".

- **FUER:** Betriebe, die ihr Geschaeft ernst nehmen, in Ergebnisse investieren wollen,
  keine Zeit/Lust auf Technik haben, Done-for-you + Vertrauen suchen.
- **BEWUSST NICHT FUER:** reine Schnaeppchenjaeger, "mach schnell billig"-Leute,
  Kontrollfreaks, die jedes Detail diktieren wollen (bei Premium fuehren WIR).
- Geeint NICHT ueber die Branche, sondern ueber den gemeinsamen Anspruch.
- **Copy-Guard:** Zielgruppe NIE auf Handwerker verengen.

Nutzer-Kontext beim Besuch: sucht auf Google/KI nach "Website/Homepage erstellen lassen",
will gefunden werden und Anfragen bekommen, will keine Technik-Vorlesung und kein Risiko.
Gewuenschte Emotion: Vertrauen + "die verstehen mein Geschaeft" + ein Stich Ehrgeiz
(deine Website soll so gut sein wie deine Arbeit).

## Product Purpose

Betriebe aus der digitalen Unsichtbarkeit holen: hochwertige, schnelle, DSGVO-konforme
Websites, die bei Google UND in der KI-Suche gefunden werden und verkaufen — ohne Agentur-
Bullshit, ohne Risiko fuer den Kunden. Kategorie-Umdeutung: "Wir sind keine Webdesigner.
Wir sind Performance-Marketer, die Websites bauen." Modell: Entwurf ohne Vorkasse,
Anzahlung erst bei Auftragszusage, Premium-Fixpreis (konkrete Tiers im decisions-log).

## Brand Personality (Marken-Ton)

Drei Worte: **fair, scharf, premium.**

- Premium, aber nicht ueberheblich (auch der Kleine kriegt Qualitaet).
- Scharf gegen die Branche, warm zum Kunden. Haltung ja, Arroganz nein.
- Ehrlich / kein Risiko: erst Ergebnis, dann Geld.
- Grosszuegig: echte Tipps gratis, kein Nickel-and-Dime. Over-Delivery.
- Performance-DNA (Google Ads/SEO/KI), nicht Deko. Persoenlich: echtes Gesicht (Tomson),
  kein gesichtsloses Agentur-Konstrukt.

Marken-Richtung (entschieden 2026-06-15): Option 3 "fair + selektiv" — Kern zugaenglich/
fair/risikofrei, aufgeladen mit Menschlichkeit, Story, klarer Haltung/Feindbild.

## Anti-References (so NICHT — visuell wie inhaltlich)

Visuell (Thomas 2026-08-11):
- **Nicht wie 08/15-Webagentur:** kein Stockfoto-Hero + drei Icon-Karten + Verlauf-Buttons.
- **Nicht wie SaaS-Template:** kein Inter + Lila/Blau-Gradient + generisches Feature-Grid.
- **Nicht wie Billig-Baukasten:** nichts, was nach Wix/Jimdo-Vorlage riecht (ist Feindbild).
- **Nicht zu brav/steril:** kein corporate-glattes Nichts ohne Kante.

Inhaltlich (Feindbild aus markenkern.md):
- Dekorateure (huebsch, null Anfragen) · Baukaesten/Herold (billig, unsichtbar) ·
  Stundensatz-Agenturen (teuer, Meeting-Marathon) · KI-Pfuscher (Muell in 5 Minuten).

## Strategic Design Principles

- **Beweis-Prinzip:** Die eigene Seite MUSS top sein — sie ist der Beweis der Behauptung.
  Jeder Design-Kompromiss untergraebt die Verkaufslogik.
- **Keine erfundenen Zahlen/Gadgets.** Beweise = echte Google-Reviews + echte Lighthouse-
  Werte. Kein fabriziertes aggregateRating, keine widerspruechlichen Kundenzahlen.
- **Haltung sichtbar machen** ueber Statements, Optik und Kante — nicht ueber Aggression.
- **Risiko-Abbau ist der Conversion-Motor:** "Entwurf ohne Vorkasse" muss ueberall spuerbar
  bleiben, nicht im Kleingedruckten verschwinden.
- **Keine KI-Tells** in Copy: kein Gedankenstrich, keine Dreierfiguren, echte Umlaute,
  keine Emojis. Du-Ansprache.
- **Telefon nie im Klartext** — nur hinter tel:-Anruf-Button.

## Accessibility Target

**WCAG AA + BaFG-tauglich** (Thomas 2026-08-11). Ihr verkauft BaFG-Konformitaet aktiv
(Salzburg-FAQ) — die eigene Seite muss es vorleben: Body-Kontrast >= 4.5:1, sichtbare
Fokus-States, volle Tastaturbedienbarkeit, semantische Struktur, `prefers-reduced-motion`
respektiert. Der `audit`-Lauf misst gegen dieses Ziel.

## Canonical Design Source

Das visuelle System ist bereits streng festgelegt in **`docs/DESIGN_STANDARD.md`**
(Farben, 3 Schrift-Rollen, border-radius:0, genau 2 Buttons, Eyebrow-Standard, Abstaende,
Scroll-/Bumper-System). DESIGN.md (via `/impeccable document`) haelt dasselbe im Skill-
Format fest — DESIGN_STANDARD.md bleibt bei Widerspruch die Wahrheit.
