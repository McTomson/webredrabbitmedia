# Erkenntnisse & Pre-Mortem: Content-Automation Red Rabbit Media

Datum: 2026-06-03
Status: Strategie-Briefing für die weitere Planung (Claude Code)
Bezugsdokument: `2026-06-03-tipps-content-automation-design.md` (das eigentliche Spec)
Zweck: Dieses Dokument fasst die kritische Analyse + Web-Recherche zusammen, korrigiert
falsche Annahmen im Spec und liefert eine ehrliche Pre-Mortem ("in 6 Monaten gescheitert —
warum?") mit konkreten Gegenmaßnahmen. Es ist als Denk- und Planungsgrundlage gedacht,
NICHT als fertiger Bauplan.

---

## 0. Kontext in einem Absatz

Red Rabbit Media (Webdesign-Agentur, AT) will über `/tipps`-Artikel zu echten Google-Fragen
(z.B. "wie viel kostet eine website") organisch Kunden gewinnen. Es gibt **kein Redaktions-
team, keine Schreiber**. Ziel: so autonom wie möglich, Mensch nur 1–2 Min/Artikel. Ein
Versuch vor ~6 Monaten ist gescheitert. Das Spec ist operativ reif (3 Review-Runden), hat
aber strategische blinde Flecken, die unten benannt werden. Stack: Next.js App Router, MDX,
Vercel. Vorgabe: möglichst 0 €, kein monatliches Tool-Abo (Frase/Surfer etc. → selbst bauen).

---

## 1. Die bewiesene Methodik (Web-Recherche, Stand Juni 2026)

Über alle seriösen Quellen deckungsgleich:

- **30/70-Regel:** KI macht ~30 % (Recherche + Rohentwurf), 70 % ist Mensch (Redigieren,
  Strategie, **eigene Daten/Insights/Meinung einbringen**). Konsens der Top-Performer 2026.
- **Die scharfe Trennlinie:** Voll-KI-Content ohne menschliche Substanz = ~0 Traffic.
  KI-Entwurf + menschliche Experten-Bearbeitung = rankt. Beleg: Bankrate publizierte hunderte
  KI-Artikel, von Fachleuten geprüft/angepasst → ~125.000 organische Besucher/Monat;
  unbearbeitete KI-Artikel derselben Art: keine Sichtbarkeit.
- **Was die 70 % konkret ausmachen** (nicht "schön schreiben"): echte Daten in den ersten
  100 Wörtern, reale Frage statt Keyword beantworten, Trust-Signale, eine Meinung/Erfahrung,
  die nur ihr habt. Deckt sich exakt mit Googles E-E-A-T-"Experience"-Signal.

**Harte Konsequenz:** Ein Skill, der die 365 Artikel komplett allein schreibt UND published,
baut präzise den Bankrate-Failure-Modus nach. Der Skill darf **nicht der Autor** sein. Er
muss **Rechercheur + Editor + Publisher** sein. Der Mensch liefert das eine Nicht-Automatisierbare:
proprietäres Datum + echte Meinung. "Kein Team" ≠ "kein menschlicher Input" — der Input muss
nur auf die höchstwertigen ~2 Minuten reduziert werden.

---

## 2. Zwei verschiedene Maschinen — NICHT verwechseln (zentraler Punkt)

Das Spec vermischt zwei bewiesene, aber grundverschiedene Methoden:

**Maschine A — Editorial-SEO at Scale.** Ein starker Artikel pro Keyword. Das ist, was im
Spec beschrieben ist. Funktioniert nachweislich — **aber nur mit dem 70 %-Menschen-Anteil**.
Nicht voll autonom. "wie viel kostet eine website" ist ein A-Thema.

**Maschine B — Programmatic SEO.** Template + Datensatz → hunderte Seiten aus EINEM Datensatz.
**Das ist die einzige Methode, die solo/autonom skaliert** (Nomad List: 1 Gründer, 1.000
Städte-Seiten; Flyhomes: 10k→425k Seiten in 3 Monaten). Geht aber nur bei *gemusterten*
Anfragen mit Datenform: "Webdesign Kosten [Branche]", "Website erstellen lassen [Stadt]",
"[CMS A] vs [CMS B]". Ein einzelnes generisches Thema ist KEIN Programmatic-Thema.

**Pflicht-Arbeitsschritt vor allem anderen — A/B-Sortierung der 365 Themen:**
Jedes Thema wird klassifiziert: lässt es sich in eine Datenform pressen → **Maschine B**
(echte Autonomie). Wenn nicht → **Maschine A** (mit 2-Min-Inject). Erst diese Sortierung
macht das Autonomie-Versprechen messbar. Sie löst auch den "365× unique data"-Einwand:
Programmatic braucht nur EINEN Datensatz für hunderte Seiten; die Einzigartigkeit kommt aus
der Variable (Stadt/Branche), nicht aus 365 Einzelstudien.

> **Erwartung dämpfen:** Die wenigsten der 365 Themen werden echte Programmatic-Themen sein.
> Realistisch ist der Großteil Maschine A. Das heißt: der "2-Min-Mensch-Inject" ist NICHT
> die Ausnahme, sondern der Normalfall. Die Planung muss um diesen Engpass herum gebaut werden,
> nicht um die Hoffnung auf Voll-Autonomie (siehe Pre-Mortem §6.3).

---

## 3. Build statt Buy: "Frase selbst nachbauen"

Entscheidung des Users: kein Monats-Abo, selbst bauen. Machbar zu ~90 %.

Frase/Surfer im Kern = SERP-Top-10 ziehen → häufige Fragen/Unterthemen extrahieren → Brief →
Draft → gegen Top-10 optimieren. Alles mit Claude + eigenem Stack baubar.

**Die ehrliche Ausnahme — der eine harte Teil:** Frase zahlt für *Live-Google-SERP-Daten +
Keyword-Schwierigkeit*. Das ist die einzige Komponente, die ohne Geld fummelig + teils
ToS-Grauzone (Scraping) wird. Kostenlose Quellen (aus Spec §19.5, korrekt): Google Keyword
Planner (gratis via Ads-Konto), Search Console, Autocomplete + "People Also Ask", Bing
Webmaster. Damit ~80 % von Frases Nutzen, weniger präzise.

**Pipeline-Bausteine der Eigenbau-Lösung (für die technische Planung):**
1. **Keyword/SERP-Intelligence** — freie Quellen abfragen, Top-10 holen, PAA + Autocomplete
   sammeln, Winnability-Score. *(Der fragilste Baustein — Fallback zwingend, siehe Pre-Mortem.)*
2. **Brief-Generator** — aus SERP + PAA eine Struktur/Outline + Pflicht-Fragen.
3. **Recherche-Agent** — echte AT-Fakten + Quellen sammeln, aus dem Daten-Asset (§5) ziehen.
4. **Autor-Agent** — Hausstil (few-shot aus besten bestehenden Artikeln), bindet Meinungs-Inject ein.
5. **Lektor-Agent** — KI-Verräter raus, Stil variieren.
6. **Fakten-/Qualitäts-Gate** — Quellen-Zwang, harte Sperre für unbelegte Preis-/Rechtsaussagen.
7. **SEO/GEO-Finalizer** — Schema, FAQ, TL;DR, interne Links, Frontmatter.
8. **Publish-Schicht** — MDX → Repo → Vercel → IndexNow → GSC. *(Trivial, voll eigen.)*

Baustein 1 selbst bauen ist die einzige echte Arbeit + das einzige echte Risiko. Rest ist
Claude-Orchestrierung. Frameworks falls nötig: Claude Agent SDK / CrewAI / LangGraph.

---

## 4. Meinungs-Inject: Variante (b), nicht (a)

Zwei Optionen standen im Raum:

- **(a) KI stellt die Meinung des Users nach** → E-E-A-T-Falle. Erfundene Meinung = keine
  "Experience" = wertlos/riskant. **Verworfen.**
- **(b) User tippt rohe Meinung ins Chatfenster, System poliert** (Rechtschreibung, Satzbau,
  Ton) → **richtig.** Echte Erfahrung, nur sauber gemacht. Einer der 70 %-Hebel, die ranken.

**Umsetzung (Hybrid):** Schreibstil aus bestehenden Texten klonen (klingt nach dem User),
aber die *Haltung/Aussage* kommt IMMER aus dem rohen Input des Users. Stil automatisiert,
Substanz vom Menschen. → siehe Pre-Mortem §6.3 für den Skalierungs-Engpass dieses Schritts.

---

## 5. Daten-Asset-Strategie: Netz-Recherche + eigene Daten kombinieren

User-Situation: hat echte Projektdaten (800–1.400 € Websites), will aber (a) allgemein bleiben
und (b) Preise *erhöhen*, also nicht die eigenen niedrigen Zahlen plakativ rausposaunen.

**Lösung — "Red Rabbit Marktanalyse Website-Kosten Österreich 2026":**
Öffentlich recherchierte AT-Preisspannen (mit Quellenangabe: easycom, frida-grün, Herold,
mikas u.a.) zu einer Marktübersicht aggregiert + eigener proprietärer Winkel obendrauf.
Legitim, zitierfähig, Linkmagnet-Potenzial.

**Preis-Erhöhungs-Framing (wichtig):** NICHT mit den eigenen niedrigen Zahlen führen. Mit der
**Marktspanne** führen (Recherche: simple Business-Site 1.500–5.000 €, Agenturen bis 25.000 €).
Das ankert den Leser hoch und rechtfertigt höhere Preise. Eigene Daten als Beweis für *etwas
anderes* einstreuen (was Kosten wirklich treibt, Zeitaufwand, Ergebnis-Daten von Kundenseiten),
nicht als "wir sind billig". Bleibt ehrlich (echte Daten) UND dient der Preisstrategie.

**Recht:** öffentliche Zahlen mit Quelle zitieren = ok. Konkurrenz-Texte 1:1 kopieren = nein.
Eigene Daten als "unsere Erhebung" labeln.

> **Kritische Einschränkung (Pre-Mortem §6.2):** EIN Daten-Asset reicht nicht für 365 Artikel.
> Eine Preisstudie ist das unique Element in ~15–25 preisnahen Artikeln, danach läuft sie
> trocken. Es braucht MEHRERE Daten-Assets, je Themen-Cluster eines, BEVOR skaliert wird.

---

# 6. PRE-MORTEM: "Es ist Dezember 2026. Trotz allem gescheitert. Warum?"

Ehrliche Vorab-Obduktion. Die Reihenfolge ist nach Tötungs-Wahrscheinlichkeit sortiert.
Die ersten drei liegen ALLE außerhalb der Content-Fabrik — genau deshalb übersieht man sie.

### 6.1 — Autorität nie gebaut (wahrscheinlichste Todesursache, IDENTISCH zu Versuch 1)
Wir haben die ganze Energie in die Schreib-/Publish-Maschine gesteckt. Aber die diagnostizierte
Ursache von Versuch 1 war "keine echten Backlinks/Autorität". Die zitierte Erfolgsstory hatte
**700 referring domains**. Unser Plan hat dafür nur Verzeichnislinks (WKO, FirmenABC) — schwach.
Dez 2026: 180 exzellente Artikel, immer noch Seite 3, weil 0 neue starke Backlinks.
**Gegenmaßnahme (JETZT einplanen, eigener Workstream):** Aktiver Link-Earning-/Digital-PR-Loop.
Das Daten-Asset (§5) ist der Köder — aber jemand/etwas muss es aktiv an AT-Medien, Blogs,
Branchenportale streuen (Outreach, HARO-Äquivalent, Gastbeiträge, Studie-PR). Ohne diesen
Loop ist die Content-Maschine ein Auto ohne Räder.

### 6.2 — Differenzierung läuft bei Artikel ~30 trocken
EIN Daten-Asset kann nicht das unique Element in 200 thematisch verschiedenen Artikeln sein.
Nach den preisnahen Themen werden Artikel über SEO-Tipps, Hosting, BFSG, Performance etc. wieder
dünn → genau das "scaled content"-Signal, das Google abstraft.
**Gegenmaßnahme:** VOR der Skalierung mehrere Daten-Assets je Cluster aufbauen (z.B. eigene
Ladezeit-/Conversion-Benchmarks aus Kundenseiten, Förder-/Recht-Übersicht AT, Tool-Vergleiche).
Daten-Fundament als Pass/Fail-Gate ernst nehmen (Spec §23) — kein Skalieren ohne ≥1 Asset pro
aktivem Cluster.

### 6.3 — Der menschliche Single-Point-of-Failure: der tägliche Meinungs-Inject
"2 rohe Sätze pro Artikel" klingt winzig — aber bei 1/Tag ist das eine tägliche Pflicht für
immer. Monat 2: echtes Leben, User überspringt, System stallt ODER beginnt Meinungen zu faken
→ Drift in den Failure-Modus.
**Gegenmaßnahme:** Meinungen BATCHEN, nicht täglich abfragen. In einer Session 30–50 Meinungen/
Erfahrungen zu kommenden Themen diktieren (Voice-Memo → Transkript reicht). System zieht aus
diesem Pool. Klare Regel definieren bei leerem Pool: Artikel HÄLT (publiziert nicht ohne echtes
Inject) statt zu faken. Der Engpass ist Mensch-Verfügbarkeit, nicht Token.

### 6.4 — Indexierung, nicht Ranking, ist der stille Killer
Google indexiert Massen-Content zunehmend gar nicht erst ("discovered – currently not indexed").
Wir optimieren Ranking-Qualität und merken erst spät, dass 140 von 180 Artikeln nie im Index
waren.
**Gegenmaßnahme:** Indexierungs-Rate als KPI #1 (nicht Rankings) ab Tag 1 in der GSC tracken.
IndexNow + Sitemap + interne Verlinkung sind Pflicht, aber Indexierung muss aktiv überwacht +
bei niedriger Quote sofort gebremst werden (Velocity runter, Qualität rauf).

### 6.5 — Du rankst, aber AI Overviews fressen die Klicks (Erfolg ohne Traffic)
Gartner −25 % klassisches Suchvolumen (Spec §3). Platz 3 für "was kostet eine website", aber
das AI Overview beantwortet es, niemand klickt. Selbst Erfolg = kein Traffic = kein Lead.
**Gegenmaßnahme:** KPI darf NICHT "Rankings" sein, sondern **Klicks + Leads**. Themen bevorzugen,
bei denen AI Overviews schwach sind oder kommerzielle Intent-Klicks überleben (lokal, Vergleich,
"... lassen", Preis-Anfragen). Und GEO-on-page so bauen, dass ihr IM AI-Answer zitiert werdet
MIT Markennennung + Klick-Grund.

### 6.6 — Themenliste nie auf Gewinnbarkeit gefiltert (Garbage in)
365 Themen aus dem Kopf des Users. Wenn 300 davon Head-Terms sind, die HubSpot DE / t3n / große
Agenturen besitzen, oder fast null Volumen haben, läuft die Maschine perfekt und produziert
unrankbaren Content.
**Gegenmaßnahme:** Winnability-Filter als HARTES Gate vor Generierung. Jedes Thema: Volumen-
Schätzung + SERP-Stärke-Check (wer rankt da?). Long-Tail/lokal/niedrige-Schwierigkeit zuerst.
Themen ohne Gewinn-Chance gar nicht erst schreiben.

### 6.7 — Traffic kommt, aber keine Leads (kein Conversion-Mechanismus)
Selbst mit Klicks: ohne durchdachte Lead-Capture/CTA für den informationssuchenden Leser ist
"Leads" als KPI = 0. Spec flaggt es (§23), aber es ist undefiniert.
**Gegenmaßnahme:** Lead-Mechanik VOR dem Launch definieren (kontextueller CTA, Mini-Tool/Rechner,
Angebots-Trigger). Pro Artikel-Typ eine passende Conversion-Aktion. "Tipps"-Leser ≠ Käufer —
es braucht eine Brücke (z.B. kostenloser Website-Check, Preisrechner).

### 6.8 — Wartungs-/Verfalls-Schuld (der Korpus rottet)
180 Artikel = 180 Dinge, die veralten, brechen, falsche Fakten/Preise entwickeln. Der
Refresh-Loop (Spec §8.5) konkurriert mit der Neu-Produktion; nichts ist dafür budgetiert.
**Gegenmaßnahme:** Refresh-Kapazität von Anfang an einplanen (z.B. nach 50 Artikeln: 1 Tag/Woche
Produktion pausiert, alte verbessern). Auto-Veralten-Check (Datum, Preisangaben, tote Links).

### 6.9 — Die SERP-Scraping-Schicht bricht / wird geblockt
Der eine bewusst akzeptierte harte Teil (§3). Wenn Google das Scraping in Monat 2 blockt, stirbt
die Keyword-/SERP-Intelligenz und Artikel werden blind geschrieben.
**Gegenmaßnahme:** Fallback-Hierarchie definieren: Keyword Planner API → GSC-Daten → Bing
Webmaster → manuell. System muss bei Scraping-Ausfall NICHT blind weiterschreiben, sondern
warnen + auf freie API-Quelle umschalten.

### 6.10 — Feedback-Loop zu langsam → 180 schlechte Artikel live, bevor man's merkt
SEO-Rückmeldung dauert 3–6 Monate. Ist die Strategie falsch, erfährt man es bei Monat 6 mit
180 Live-Artikeln — zu spät, evtl. sitewide Qualitäts-Signal-Schaden.
**Gegenmaßnahme:** Frühe Leading-Indicators (Indexierungs-Rate, Impressions, erste Position-20-
Auftritte nach Woche 4–6) mit hartem Kill-Switch. Velocity sanft rampen (Spec §18: 1/Tag).
Überlegen, ob ein kleines Test-Segment (z.B. 20 Artikel, 6 Wochen messen) VOR Voll-Skalierung
das Blast-Radius-Risiko eindämmt.

### 6.11 — Marke/Autor als Entität existiert im Web nicht (E-E-A-T + AI-Zitierbarkeit)
Für AI-Zitate + E-E-A-T müssen Autor und Marke als *Entitäten* im Web existieren (konsistente
Nennungen, LinkedIn, Erwähnungen, NAP). Nur auf eigener Domain publizieren baut keine
Entitäts-Autorität.
**Gegenmaßnahme:** Off-Site-Entitäts-Signale parallel aufbauen (Autoren-Profile, konsistente
Nennungen, Google Business, ggf. Branchen-Interviews). Gehört zum Autoritäts-Workstream (§6.1).

### 6.12 — Recht/AI-Act-Haftung skaliert mit
Bei 365 Artikeln ist eine falsche auto-publizierte Preis-/Rechtsaussage (DSGVO/BFSG/€) eine
echte Haftung. Das Fakten-Gate muss BEWIESEN funktionieren, nicht angenommen.
**Gegenmaßnahme:** Fakten-Gate vor Skalierung an Stichproben härten. AI-Kennzeichnung auf
Artikeln (EU-AI-Act). Harte Sperre für unbelegte Preis-/Rechtsaussagen testen, nicht nur deklarieren.

---

## 7. Was wir VERGESSEN hatten (Zusammenfassung der blinden Flecken)

1. **Autorität/Backlink-Engine** — die eigentliche Todesursache, immer noch nur als
   Verzeichnis-Checkliste, nicht als aktiver Workstream. (#1 Risiko)
2. **Mehrere Daten-Assets** statt einem — Differenzierung kollabiert sonst bei ~Artikel 30.
3. **Meinungs-Inject als Mensch-SPOF** — muss gebatcht werden, sonst stallt es im Alltag.
4. **Indexierung als KPI #1** — wurde komplett von "Ranking" überdeckt.
5. **AI-Overview-Klick-Kannibalisierung** — KPI muss Klicks/Leads sein, nicht Rankings.
6. **Winnability-Filter** auf die Themenliste — sonst Garbage in, Garbage out.
7. **Conversion-Mechanik** für informationssuchende Leser — sonst Traffic ohne Leads.
8. **Wartungs-/Refresh-Budget** — der Korpus rottet sonst.
9. **Entitäts-/Off-Site-Autorität** für AI-Zitierbarkeit.

---

## 8. Was JETZT zu tun ist (priorisiert, vor jeglicher Skalierung)

**Reihenfolge ist Absicht — die strategischen Blocker zuerst, die Maschine zuletzt.**

1. **Baseline messen** (Phase 0): aktuelle GSC-Daten, indexierte Seiten, bestehende Rankings,
   Domain-Autorität/Backlink-Stand, ist GA4/Plausible installiert? 3-6-Monats-Ziel BEDINGT auf
   diese Baseline formulieren, nicht absolut versprechen.
2. **Themenliste → Winnability-Filter + A/B-Sortierung** (§2, §6.6): welche der 365 sind
   überhaupt gewinnbar, und welche sind echte Programmatic-Themen (autonom) vs. Maschine-A
   (2-Min-Inject)? Macht das Autonomie-Versprechen zum ersten Mal real.
3. **Daten-Fundament als Pass/Fail-Gate** (§5, §6.2): ≥1 echtes, quellen-gestütztes,
   wiederverwendbares Asset PRO aktivem Cluster. Existiert es nach fixer Timebox nicht →
   Differenzierungs-Strategie ändern, NICHT mit synthetischen Daten weiterfahren.
4. **Autoritäts-/Link-Workstream definieren** (§6.1) — der ohne den alles andere wertlos ist.
   Mindestens: 1 Linkmagnet-Asset + Outreach-Plan an AT-Medien/Blogs.
5. **Meinungs-Pool batchen** (§6.3): erste 30–50 User-Meinungen in einer Session sammeln,
   bevor die Maschine läuft.
6. **EINEN Artikel komplett von Hand durchbauen** als Blaupause ("wie viel kostet eine website"):
   zeigt live, welche Pipeline-Teile trivial sind, wo SERP hakt, wie Daten-Asset + Meinungs-
   Inject zusammenspielen. Erst wenn DIESES eine Resultat top ist, wird automatisiert.
7. **KPIs umstellen** auf Indexierungs-Rate → Klicks → Leads (nicht Rankings). Kill-Switch +
   Leading-Indicators definieren (§6.4, §6.5, §6.10).
8. **Token-/ToS-Klärung** (Spec §24): ist headless-Abo-Nutzung ToS-konform? Gemessene
   Token-Zahl pro Artikel VOR Phase D. Wenn API nötig: echte €/Artikel kalkulieren.

Erst danach: die Pipeline aus §3 bauen, Velocity sanft rampen, Mess-Loop laufen lassen.

---

## 9. Offene Entscheidungen für den User

- **Build-Tiefe:** SERP-Schicht strikt selbst bauen (0 €, Scraping-Risiko) bestätigt?
  Fallback-Quellen-Hierarchie ok (§6.9)?
- **Daten-Assets:** Welche echten Datenquellen existieren über Preise hinaus (Ladezeiten,
  Conversion, Projektzahlen)? Bestimmt, wie viele Cluster überhaupt differenzierbar sind.
- **Autorität:** Wer macht das Link-Outreach? (Mensch-Aufwand, nicht automatisierbar.)
  Ohne Antwort hier bleibt #1-Risiko offen.
- **Conversion:** Welche Lead-Mechanik auf den Artikeln (CTA / Website-Check / Preisrechner)?
- **Test-Segment vor Voll-Skalierung** (§6.10) — ja/nein?

---

## 10. Quellen (Web-Recherche Juni 2026)

- Surfer SEO — 2026 AI SEO Workflow: https://surferseo.com/blog/2026-ai-seo-workflow/
- HubSpot — AI SEO: https://blog.hubspot.com/marketing/ai-seo
- SE Ranking — AI Content Experiment (Voll-KI vs. bearbeitet): https://seranking.com/blog/ai-content-experiment/
- Diggity Marketing — AI Overviews SEO Case Study (Bankrate-Muster): https://diggitymarketing.com/ai-overviews-seo-case-study/
- Frase — Best AI SEO Agents 2026 (Pipeline-Abdeckung): https://www.frase.io/blog/best-ai-seo-agents-2026
- Rankability — AI SEO Content Tools 2026: https://www.rankability.com/blog/best-seo-content-optimization-tools/
- SEOmatic — Programmatic SEO Examples: https://seomatic.ai/blog/programmatic-seo-examples
- Omnius — Programmatic SEO Case Study (67→2100 signups): https://www.omnius.so/blog/programmatic-seo-case-study
- Firecrawl — Open Source Agent Frameworks 2026: https://www.firecrawl.dev/blog/best-open-source-agent-frameworks
- AT-Marktpreise (Daten-Asset-Recherche): easycom.at/website-kosten, frida-gruen.at, herold.at, mikas.at

---

*Ende. Dieses Dokument ergänzt das Spec, ersetzt es nicht. Kernbotschaft: Die Content-Fabrik
ist das gelöste Problem. Die drei wahrscheinlichsten Todesursachen (Autorität, trocken-
laufende Differenzierung, menschlicher Inject-Engpass) liegen ALLE außerhalb der Fabrik und
müssen ZUERST adressiert werden.*
