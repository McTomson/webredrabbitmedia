# Brief: Preise-Seite web.redrabbit.media

Stand 2026-07-06. Zweck: vollständige Bauvorlage für die Preise-Seite, damit sie sauber
designt werden kann (intern oder extern). Erarbeitet mit den Skills `pricing`, `offers`,
`cro`, `marketing-psychology`, `copywriting`, `site-architecture`. Fakten aus `brand/`
(pricing.md, positioning.md, messaging.md) + Live-`app/preise/page.tsx` (autoritativ).

REGEL: Preise/Zahlen sind autoritativ. Nur 950 / 2.900 / ab 4.900 verwenden. Nie 790.
Keine erfundenen Kundenzahlen, keine Fake-Reviews, kein Fake-Countdown. Keine Emojis,
kein Gedankenstrich, echte Umlaute.

---

## 1. Wozu die Seite dient (Job-to-be-done des Besuchers)

Wer eine Preisseite öffnet, ist NICHT am Anfang der Reise, sondern kurz vor oder mitten
in der Kaufentscheidung. Er will in Sekunden drei Dinge klären:

1. **"Kann ich mir das leisten / lohnt sich das?"** (Preis-Einordnung, Angst vor Abzocke)
2. **"Was genau bekomme ich dafür?"** (Leistung, Abgrenzung, kein Baukasten)
3. **"Was ist das Risiko, wenn es schiefgeht?"** (Vertrauen, Rückzugsmöglichkeit)

Zielkonflikt, den die Seite lösen muss: Der KMU-Kunde (Handwerk, Gastro, Beauty, Immo)
ist **preissensibel UND misstrauisch gegen Agenturen** (Stundensatz-Lotterie, versteckte
Kosten, Abo-Fallen). Er hat schlechte Erfahrungen oder Bekannte mit schlechten Erfahrungen.
Die Seite gewinnt nicht über den niedrigsten Preis, sondern über **Klarheit + Risiko-Umkehr
+ spürbare Qualität**. Genau das ist die Marken-Positionierung "fair + selektiv".

Emotionaler Startzustand des Besuchers: leichte Anspannung ("gleich kommt eine böse Zahl").
Aufgabe der Seite: diese Anspannung ZUERST nehmen (Versprechen + kein Risiko), DANN Preise.

## 2. Ziel & Erfolgskennzahl der Seite

- **Primärziel:** qualifizierte Anfrage über den kostenlosen Entwurf (niederschwellig,
  kein "Kaufen"). Sekundär: Anruf.
- **Messgröße:** Anfrage-Conversion (Klick auf "Kostenlosen Entwurf holen" / Formular),
  Scroll-Tiefe bis Paket-Sektion, FAQ-Interaktion (welche Einwände offen sind).
- **Nicht das Ziel:** sofortiger Abschluss auf der Seite. Der Entwurf-erst-Prozess IST
  der Funnel. Die Preisseite qualifiziert und nimmt die Kaufangst.

## 3. Wer der Nutzer ist (Kurz-Persona)

- Inhaber/Geschäftsführer eines österreichischen KMU (5-50 MA), oft selbst am Werkzeug/Tresen.
- Kauft selten Websites, kann Leistung schwer beurteilen, orientiert sich an Vertrauen +
  Referenzen + Bauchgefühl "die verstehen mein Geschäft".
- Preis-Anker im Kopf: entweder "Website kostet 500 vom Neffen" ODER "Agenturen kosten
  5-stellig und ziehen einen ab". Die Seite muss den REALEN Wert dazwischen plausibel machen.
- Entscheidet mobil (viel Traffic vom Handy) UND wird später am Desktop nochmal draufschauen.

## 4. Informationsarchitektur: Sektions-Reihenfolge (und WARUM)

Reihenfolge ist bewusst conversion-getrieben (cro + marketing-psychology). Von oben nach unten:

| # | Sektion | Zweck / psychologischer Hebel |
|---|---------|-------------------------------|
| 1 | **Hero / Versprechen** | Klarheit + Ton zuerst, Preis-Schock vermeiden. "Du weißt vorher, woran du bist." Setzt Erwartung: transparent, kein Risiko. |
| 2 | **Risiko-Umkehr (prominent)** | Stärkster USP ZUERST, VOR den Zahlen. "Erst überzeugt, dann bezahlt." Nimmt die Kaufangst, bevor die Zahl kommt (Loss-Aversion entschärfen). |
| 3 | **Die drei Pakete** | Anchoring + Dreier-Regel. Business als Held ("beliebteste Wahl") = die Mitte wird zur naheliegenden Wahl. |
| 4 | **Was in JEDEM Paket steckt / Prozess** | Wert über Ergebnis (gefunden werden, Anfragen), nicht über Feature-Zahl. Zeigt "so läuft das ab" = Sicherheit. |
| 5 | **Betreuung ohne Bindung + Förderung** | Differenzierer gegen Abo-Falle ("mit Leistung halten, nicht mit Vertrag") + KMU.DIGITAL macht den Preis leistbar. |
| 6 | **Einwand-Behandlung / Preis-FAQ** | Die Kaufbremsen offen abräumen, NAHE der Entscheidung. "Für wen wir NICHT sind" = selbstbewusste Selektivität. |
| 7 | **Abschluss-CTA** | Nach abgeräumten Einwänden konvertieren. Niederschwellig ("Entwurf holen", nicht "kaufen"). |
| 8 | **Footer (Reassembly)** | Wie Homepage, Markenschluss. |

Optional (nur mit Beleg/Tomson-OK): eine **Vergleichstabelle** unter den Karten (Feature x
Paket), ein **Mini-Preisrechner** ("One-Pager oder mehrseitig? Mit Betreuung?"), eine
**Prozess-Timeline** (Anfrage → Entwurf → Feedback → Launch).

## 5. Sektion-für-Sektion: was rein muss

### 1. Hero
- Eyebrow "Preise". Große Serif-Headline (Versprechen, kein Preis). Intro (1-2 Sätze).
- Zwei CTAs: primär "Kostenlosen Entwurf holen", sekundär "Pakete ansehen" (Anker-Sprung).
- Headline-Optionen: A "Klare Pakete. Kein Risiko bis zur Zusage." / B "Du weißt vorher,
  was es kostet. Und siehst zuerst, was du bekommst." / C "Drei Pakete, ein Prinzip:
  erst überzeugt, dann bezahlt."

### 2. Risiko-Umkehr
- Eigener, visuell abgesetzter Block (Navy, wie das Homepage-Statement).
- "Dein Risiko: null" + "Erst überzeugt, dann bezahlt." + der belegte Satz:
  "Du bekommst zuerst einen echten Entwurf zu sehen, ohne Vorkasse. Gefällt er dir und du
  erteilst den Auftrag, fällt eine Anzahlung an. Bis dahin liegt das Risiko bei uns, nicht
  bei dir."

### 3. Pakete (autoritativ, wörtlich)
- **Starter 950 €** — "Der faire Einstieg für alle, die schlank und schnell online wollen."
  Features: One-Pager · Individuelles Design, kein Baukasten · sauber auf allen Geräten ·
  Kontaktformular und Anruf-Wege · SEO-Grundlagen · DSGVO-konform.
- **Business 2.900 € (FEATURED, "Beliebteste Wahl")** — "Die solide Website für Betriebe,
  die gefunden werden wollen." Features: Mehrseitige Website · alles aus Starter ·
  erweiterte SEO + lokale Sichtbarkeit · Dashboard gratis dabei · Struktur für Anfragen.
- **Premium ab 4.900 €** — "Das Flaggschiff, wenn deine Website wirklich arbeiten soll."
  Features: umfangreiche individuelle Website · Performance/Conversion · SEO + KI-Sichtbarkeit
  · Content/KI-Artikel-Anbindung · Dashboard inklusive · persönliche Begleitung mit Priorität.
- Je Karte 1 CTA "{Paket} anfragen" → /kontakt. Featured = stärkster Button.
- Custom-Zeile darunter: "Große oder besondere Projekte, etwa Shops oder Sonderfunktionen,
  planen wir individuell. Sprich uns einfach an, dann finden wir den passenden Rahmen."

### 4./5. Betreuung + Förderung
- "Wartungs-Abo ohne Bindung" (jederzeit kündbar, "mit Leistung halten, nicht mit Vertrag").
- "KMU.DIGITAL kann mitzahlen" (unbeziffert, wie Live; optional "bis 50 %, max. 6.000 €"
  NUR mit Tomson-OK).

### 6. Preis-FAQ (Einwände)
Ist das teuer? · Warum kein Baukasten? · Warum Entwurf ohne Vorkasse? · Was wenn der Entwurf
nicht gefällt? · Fixpreis oder Zusatzkosten? · Was heißt "ab 4.900"? · Laufende Kosten? ·
Förderung? · (optional, mit OK) "Für wen seid ihr NICHT die richtige Agentur?"
Volltext-Antworten liegen in der Content-Spec / Live-`app/preise/page.tsx`.

### 7. Abschluss-CTA
- Klar, niederschwellig: "Hol dir deinen Entwurf. Ohne Vorkasse, ohne Risiko." + Anfrage-Button
  + Telefonnummer. (Headline evtl. kürzen, s. offene Punkte.)

## 6. Preis-Darstellung & Anchoring (Skill: pricing)

- **3 Tiers, Mitte featured** ist bewusst und richtig (Kompromiss-Effekt: Menschen meiden
  Extreme, wählen die Mitte). Business ist der strategische Anker.
- **Preise SICHTBAR zeigen** (nicht "auf Anfrage"). Sichtbarer Preis = Vertrauen; "auf Anfrage"
  signalisiert bei KMU "wird teuer/undurchsichtig". Nur Premium "ab" (offen nach oben).
- **Preis groß und selbstbewusst** setzen (nicht kleingedruckt verstecken). Wer sich für den
  fairen Preis schämt, wirkt teuer.
- **Kein monatlich/jährlich-Toggle** (das ist Projektgeschäft, kein Abo). Betreuung separat.
- **Anker nach oben:** Premium "ab 4.900" + Custom-Hinweis lassen 2.900 vernünftig wirken.
- Optional: unter den Karten ein Satz, der den Wert relativiert ("Eine Website, die ein Jahr
  lang Anfragen bringt, kostet weniger als eine Zeitungsanzeige, die einmal läuft.") — nur
  wenn belegbar/ehrlich, nicht behaupten.

## 7. Angebot & Risiko-Umkehr (Skill: offers)

Der eigentliche Hebel dieser Marke ist NICHT der Preis, sondern die **Garantie-Struktur**:
- **Risiko-Umkehr = Kern-Asset.** "Entwurf zuerst, zahlen erst bei Zusage" ist eine echte
  Guarantee, die 95 % der Agenturen nicht bieten. Sie gehört groß und prominent, nicht ins
  Kleingedruckte.
- **Value-Framing über Ergebnis:** verkauft wird "gefunden werden + Anfragen", nicht
  "5 Unterseiten". Jedes Feature in Nutzen übersetzen.
- **"So lange, bis es passt"** (Iterieren bis zufrieden, belegt in messaging.md) ist ein
  zweites Garantie-Element und sollte sichtbar sein (FAQ + evtl. eigener Trust-Punkt).
- **Kein künstlicher Bonus-Stack** (passt nicht zur ehrlichen Marke). Stattdessen echte
  Inklusiv-Leistungen sauber zeigen (Dashboard, DSGVO, Betreuung ohne Bindung).

## 8. Kaufpsychologie-Hebel (Skill: marketing-psychology) — ehrlich eingesetzt

- **Loss Aversion entschärfen:** Risiko-Umkehr VOR dem Preis (Punkt 2 der IA).
- **Anchoring:** Premium/Custom als hoher Anker; Business als Kompromiss-Mitte.
- **Social Proof:** ECHTE Referenzen/Logos (thermewarten, danesh, almtal) und, sobald
  vorhanden, echte Google-Bewertungen. NIE erfundene Zahlen (Marken-Regel).
- **Authority/Kompetenz:** Dashboard-Screenshot, Prozess-Transparenz, "so bauen wir".
- **In-Group / Selektivität:** "Für wen wir NICHT sind" macht die Marke begehrenswerter,
  ohne den Kunden zu beleidigen (Feindbild = Baukasten/alte Agenturen, nie der Handwerker).
- **VERBOTEN (Dark Patterns):** Fake-Countdown, "nur noch 2 Plätze"-Lüge, Fake-Rabatt,
  Zwangs-Newsletter. Widerspricht der Marke und ist rechtlich heikel.

## 9. Conversion-/UX-Regeln (Skill: cro)

- **Above the fold** (mobil zuerst): Versprechen + 1 klarer CTA. Kein Preis-Schock oben.
- **Ein primärer CTA-Typ** durchgängig ("Entwurf holen"), sekundär Telefon. Nicht 5 gleich
  laute Buttons.
- **Sticky-CTA mobil** (kleiner Balken unten "Entwurf holen") erwägen — hebt Conversion auf
  langen Seiten deutlich. Dezent, nicht nervig.
- **Featured-Karte** klar hervorheben (Rahmen/Schatten/Badge), aber die anderen nicht
  "abwerten".
- **FAQ nahe der Entscheidung** (vor dem finalen CTA), als Accordion, SSR + FAQ-Schema
  (Rich Snippet, SEO).
- **Ladezeit/Performance:** Motion darf die Interaktion nie blockieren; Preise müssen ohne JS
  lesbar sein (SSR). Reduced-motion respektieren.
- **Klarheit vor Cleverness:** die Zahl, die Leistung, das Risiko müssen in <10 Sek. erfassbar
  sein. Keine Copy, die man zweimal lesen muss.

## 10. Visuelle Direktion — KOHÄRENT zum Relaunch (verbindlich)

Damit die Seite wie die neue Startseite wirkt (nicht generisch):

- **Chrome:** RelaunchMenu (Burger) oben, FooterReassembly unten. Kein altes Header/Footer.
- **Typo:** DM Sans Bold für Display/Preise (`--rr-font-display`), Crimson-Serif für
  Statements/Claims (`--rr-font-serif`), Space Grotesk für UI/Eyebrows.
- **Farbe:** Paper-Weiß Grund, **Navy `#1c2837`** für Statement-/CTA-Bänder (Rhythmus wie
  Homepage), **Rot `#f12032`** als EINZIGER Akzent (Häkchen, Held-Button, Eyebrow-Punkt).
- **Raum:** all-turtles-Luft (`--rr-section-y`, großzügige Abstände). Lieber zu viel Weißraum
  als zu dicht.
- **Buttons (WICHTIG — die neuen Stile nutzen, nicht die flachen Default-Buttons):**
  - Haupt-CTA im Hero + Abschluss: **`rr-btn-metal--red`** (taktiler Druckknopf) ODER
    **`rr-btn-draw`** (Line-Draw-Hover) — DAS sind die Signatur-Buttons des Relaunch.
    (Tomson-Entscheidung Button-Stil A/B/C war offen; hier final wählen.)
  - Sekundär/Karten-CTA: `rr-btn-metal--light` / `rr-btn-metal--navy` je nach Grund.
  - Der flache `rr-btn--primary` war der Fehler im ersten Entwurf: zu generisch.
- **Motion (Signatur des Relaunch):** Scroll-Reveals (rise + fade) mit Master-Easing
  `cubic-bezier(.6,0,.4,1)`, gestaffelte Karten, taktiler Button-Druck. Reduced-motion-safe.
  Optional starke Idee: EIN Motiv aus dem Homepage-Morph aufgreifen (z. B. der Preis "baut
  sich" aus Fragmenten zusammen, oder das Navy-Teil als Akzent) — sparsam, als ein Moment.
- **Design-Tokens Quelle:** `app/styleguide/styleguide.css` (nicht neu erfinden).

## 11. Was starke Preisseiten gemeinsam haben (Referenz-Muster)

6 echte Referenzen geöffnet + verifiziert (06.07.): **Designjoy** (produktisiertes Design-Abo),
**Awesomic** (Design-Abo), **Designtiger.at** + **Luseo.at** (österr. Webagenturen),
**Linear** + **Basecamp** (Best-in-class SaaS).

**Wiederkehrende Bausteine (Häufigkeit von 6):**
1. Sichtbare Preise statt "auf Anfrage" (5/6) — nur die oberste Stufe bleibt offen ("Deluxe/Custom").
2. Ein hervorgehobenes "beliebtes" Tier als Anker (4/6).
3. FAQ am Seitenende zur Einwand-Räumung (5/6).
4. Social Proof mit konkreter Zahl ("40+ Projekte" / "4.000+" / "2.026 letzte Woche") (5/6).
5. Explizites Kern-Versprechen gegen die Branchen-Angst ("Fixpreis ohne versteckte Kosten",
   "Festpreise statt Stundensätze", "Flat statt Per-Seat") (5/6).
6. Feature-Liste/Vergleich zur Wert-Rechtfertigung (5/6; Designjoy verzichtet bewusst).
7. "Pausieren/kündigen jederzeit" bzw. Trial/Rückerstattung als Risiko-Reduktion (4/6).
8. 3-4 Tiers als Standard-Leiter (2 nur als Radikal-Simpel-Statement) (5/6).
9. Klare handlungsorientierte CTAs (6/6).
10. Reduzierte, ruhige Optik mit viel Weißraum — KEIN Anbieter setzt auf laute Farben/Motion (6/6).
11. Order-Bump/Add-on (Gründer-Paket, Annual-Discount) (3/6).
12. Prozess-/Timeline-Transparenz ("Live in 2-3 Wochen", 4-Schritt-Ablauf) (2/6, beide Agenturen).

**5 Ideen, die für "fair + selektiv, ehrlich, kein Vorkasse" besonders passen (mit Beleg):**
1. **Risiko-Umkehr ganz oben, als Badge neben jedem Preis** — Designjoy stellt "75% zurück nach
   einer Woche" prominent zur Preiskarte. Übersetzung: "0 € bis zum ersten Entwurf" sichtbar an
   jeder Karte. Österr. Agenturen verlangen 50% Anzahlung (Luseo) → hier hast du echte weiße Fläche.
2. **"Für wen wir NICHT bauen"-Sektion** — KEINE der 6 Seiten macht das. Passt exakt zu "selektiv",
   erhöht die Conversion der richtigen Leads. Ehrliche Ausschluss-Liste (billigster Preis / Baukasten
   / in 3 Tagen live = nicht wir).
3. **Prozess-Transparenz als eigener Block** (bei Luseo als wirksam bestätigt) — Zeitleiste +
   EXPLIZIT wann welche Zahlung fällig ist ("0 € bis zum ersten Entwurf"). Macht "kein Risiko"
   greifbar statt behauptet.
4. **Fixpreis-Pakete mit offener Top-Stufe** (Designtiger/Luseo-Muster) — deckt sich mit eurem
   Modell (950/2.900/ab 4.900). Optional branchennahe Paketnamen statt Starter/Business/Premium.
5. **Charakter statt Konzern-Logo-Wand** (Basecamp: "27 Jahre profitabel, schuldenfrei") — eine
   kleine, selektive Agentur wirkt mit fremden Großkonzern-Logos unglaubwürdig. Besser echte
   lokale KMU-Testimonials mit Gesicht/Ort + ehrliche Kapazitätsgrenze ("wir nehmen nur X Projekte
   pro Quartal") = ehrliche Verknappung statt Fake-Scarcity.

**Aus den Referenzen zusätzlich zu vermeiden:** reine "auf-Anfrage"-Seiten (wirken bei KMU wie
versteckte Kosten), 50%-Vorkasse-Norm kopieren (die brichst du ja gerade), Konzern-Logo-Wände,
überladene 40-Zeilen-Vergleichstabellen.

## 12. Was NICHT auf die Seite soll

- Erfundene Preise (nie 790), erfundene Kundenzahlen (164/315/800 widersprüchlich → gar keine
  behaupten), Fake-Reviews/-Rating.
- Dark Patterns: Fake-Scarcity, Countdown, künstlicher Rabatt, Zwangs-Opt-in.
- Überladene Vergleichstabelle mit 40 Häkchen (KMU überfordert → Absprung).
- Feature-Verkauf statt Ergebnis. Hochglanz-Bla, Dreierfiguren, "nicht nur… sondern auch".
- Gedankenstrich "–", Emojis, ae/oe/ue in User-Content.
- Arroganz gegenüber der Zielgruppe (Feindbild ist der Baukasten, nie der Handwerker).

## 13. Trust-Elemente (belegt — müssen rein)

Kein Vorkasse für den Entwurf · Anzahlung erst bei Auftragszusage · Dashboard ab Business
gratis · Betreuung ohne Bindung, jederzeit kündbar · KMU.DIGITAL-förderbar · Fixpreis-Einstieg
statt Stundensatz · "so lange, bis es passt" · echte Referenzen (thermewarten, danesh, almtal).

## 14. Mess- & Testideen (nach Launch)

- A/B: Hero-Headline A vs. C; Risiko-Umkehr vor vs. nach den Preisen.
- Sticky-Mobil-CTA an/aus.
- Preis mit/ohne Wert-Relativierung darunter.
- Welche FAQ am häufigsten geöffnet wird = welcher Einwand ungelöst ist → Copy nachschärfen.

## 15. Handoff-Notiz für den Designer

Diese Seite ist eine UNTERSEITE im Relaunch-Design-System (`.rr`-Scope, `styleguide.css`).
Sie muss sich wie die neue Startseite anfühlen: gleiche Schriften, Farben, Weißraum,
Motion, gleiches Menü + Footer. Der ERSTE Entwurf (2026-07-06) war zu generisch (flache
Default-Buttons, kein Signatur-Moment) und ist NICHT die Referenz. Ziel: Premium, ruhig,
selbstbewusst, ehrlich. Inhalt/Preise sind fixiert (oben), die GESTALTUNG ist die Aufgabe.
