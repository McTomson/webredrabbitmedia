# Bundesland-Landingpages: SEO/GEO-Research + Spec (Stand 2026-08-09)

Research fuer die Frage: Wie muessen Bundesland-Landingpages gebaut sein, damit Google sie
NICHT auf einen Canonical kollabiert / als Doorway flaggt, sie in den Bundeslaendern organisch
ranken, und LLMs (ChatGPT/Perplexity) uns bei "beste Agentur <Bundesland>" nennen — ohne
cringe ("wir sind die Besten in der Steiermark") und ohne erfundene Standorte.

Quellen: 2 Research-Straenge (Technik-Tiefenresearch Google-Docs/SEJ/Aleyda Solis; GEO/LLM
Ahrefs/Profound/Semrush/Google-Mai-2026-GEO-Guidance). Volltext:
`scratchpad/research_bundesland_technical.md`, `scratchpad/research_bundesland_geo_llm.md`.
last30days-Strang lieferte nur Teilabdeckung (Wait-Loop, kein File) — Substanz ist durch die
beiden anderen Straenge abgedeckt (beide enthalten aktuelle 2026-Signale: Dec-2025 Core Update,
Mai-2026 Google-GEO-Guidance, 2026-05-15 Spam-Policy).

---

## TEIL 1 — Ist-Zustand unserer aktuellen Regional-Seiten (Audit, main-Branch)

9 Bundesland-Routen (`app/webdesign-steiermark` usw.) aus `lib/regional-content.ts` ueber die
gemeinsame `RegionalLandingPage`-Komponente. Konkrete Probleme:

1. **ROTER ALARM — erfundene Standort-Signale (Policy-Risiko).** 4 Seiten (Steiermark, Kaernten,
   Salzburg, Niederoesterreich) tragen `LocalBusiness`-Schema mit erfundener Regional-Adresse +
   Graz-Koordinaten, dazu tote `geo.region`/`ICBM`-Meta-Tags. Wir sitzen in Wien. Das ist
   Structured-Data-Misrepresentation (Manual-Action-Risiko) und, gespiegelt in GBP, Suspension-
   Grund. MUSS weg.
2. **Doorway-Muster.** Home kopiert + Adjektive getauscht = exakt Googles benanntes Doorway-
   Beispiel ("multiple pages targeted at specific regions/cities that funnel users to one page").
3. **Templated statt echt unique.** Gleiche Sektionsstruktur, mit Regional-Adjektiven gefuellt;
   2 der 9 Regionen nicht mal voll ausgebaut. Keine echten regionalen Fakten/Referenzen/FAQ.
4. **790 EUR** in 18 Dateien = veralteter Preis (soll 1.250 / "ab"-Logik).
5. Im Relaunch existieren diese Seiten noch NICHT — wir bauen sie sauber neu.

---

## TEIL 2 — Was die Research sagt (verdichtet)

### A. Duplicate/Canonical (warum "Google denkt, wir haben die Seite schon")
- Google kann den erklaerten Canonical **ueberschreiben**, wenn Inhalte near-identical sind →
  "Duplicate, Google chose different canonical", Region-Seiten fliegen aus dem Index.
- **Staerkstes Gegenmittel:** self-referencing Canonical pro Seite (zeigt auf SICH, nicht Home)
  + wirklich unique Hauptinhalt. Sitemap allein ist ein schwaches Signal.
- **Kein offizieller Wortzahl-Schwellenwert.** Die "300–500 Woerter unique/Seite" sind SEO-
  Branchen-Heuristik, nicht Google-Regel. Unique sein MUSS: Title/H1, Haupt-Content-Block,
  lokaler Proof, lokale FAQ. Nav/Footer/CTA geteilt ist ok — es zaehlt das VERHAELTNIS
  unique-zu-Boilerplate.

### B. Doorway (aktuelle Google-Spam-Policy, Stand 2026-05-15)
- Wortlaut nennt direkt unser aktuelles Muster als Doorway-Abuse. Praezedenz: HVAC-Firma mit
  hunderten near-identical Ortsseiten verlor >80% Rankings nach Maerz-2024 Core Update.
- Auch verboten: "blocks of text that list cities/regions" = Keyword-Stuffing. Also NICHT jeden
  Bezirk in eine Textwand kippen.

### C. Korrektes Schema (statt Fake-LocalBusiness)
- Sitewide **`Organization`** mit EINER echten Wien-Adresse. `LocalBusiness` NUR fuer die echte
  Wien-Seite.
- Regionale Abdeckung ueber **`areaServed`** (`AdministrativeArea`, z.B. "Steiermark") auf
  `Organization`/`Service` — nie eine neue Adresse erfinden. (`serviceArea` ist superseded.)

### D. Ranking ohne Standort vor Ort — was geht / was nicht
- **Geht:** organisches Ranking fuer "Webdesign Steiermark" via Content-Tiefe, interne Links,
  Marke, Backlinks, ehrliches `areaServed`.
- **Geht NICHT:** Map-Pack / lokales 3-Pack in Graz — braucht echte GBP-verifizierte Praesenz.
  Ambition = organisch/informational, nicht Map-Pack.
- **Tote Signale:** `geo.region`/`ICBM`-Meta (ignoriert), `hreflang` (nicht fuer Sub-Land-
  Regionen, eine Sprache) — beide weglassen.

### E. GEO/LLM — wie wir bei "beste Agentur <Bundesland>" auftauchen
- **Haupt-Hebel ist OFF-PAGE, nicht die eigene Seite.** LLMs zitieren fuer "best X in <place>"
  ueberwiegend Drittquellen: Clutch/DesignRush/GoodFirms/Sortlist, GBP, LinkedIn, Reddit/Quora,
  und "beste Webagentur <Region> 2026"-Listicles. WKO/regionale Verzeichnisse sind das AT-
  Pendant.
- Eigene Seite KANN zitiert werden, aber praktisch nur, wenn sie fuer die Query schon organisch
  Top-10 rankt (seoClarity: 99,5% der AI-Overview-Quellen ranken bereits Top-10). Hohe Huerde.
- **On-Page-GEO-Hygiene (macht die Seite zitierfaehig, notwendig aber nicht hinreichend):**
  Frage-basierte H2/H3; Answer-first-Absatz (40–60 Woerter, steht allein); FAQ 5–7 Q&A mit
  FAQPage-Schema (zuverlaessigstes Zitat-Format); Fakten/Zahlen/Daten statt Superlative;
  Vergleichstabellen; sauberes semantisches HTML (kein div-Salat); sichtbares Update-Datum;
  robots.txt fuer GPTBot/ClaudeBot/PerplexityBot/Google-Extended offen (haben wir schon).
- **Anti-Cringe = Anti-Spam = Anti-schlecht-fuer-Menschen sind DASSELBE.** Ehrliches Framing
  ("Wien-basiert, remote-first, arbeiten in ganz Oesterreich; vor Ort nach Termin") erfuellt
  gleichzeitig On-Page-Qualitaet UND Spam-Vermeidung UND deinen Anti-Cringe-Wunsch. Kein
  Zielkonflikt.
- **Skip (Google debunkt selbst):** llms.txt, "content chunking", "AI-only schema", "AI-Voice".

### F. Messung (billig/manuell, passend fuer unsere Groesse)
- 15–30 Prompts (pro Bundesland "beste Webagentur X" + vergleichend + problem-gerahmt), manuell
  in privater Session ueber ChatGPT-mit-Suche/Perplexity/AI-Overviews/Gemini, monatlich, je
  Prompt 2–3x (nicht-deterministisch). Loggen: genannt j/n, Position, welche Quelle das Zitat
  brachte. Kein bezahltes Tool noetig; Ahrefs Brand Radar Free (10 Queries/Monat) als Zusatz.

---

## TEIL 3 — Spec: Wie JEDE Bundesland-Seite gebaut sein muss (Vorschlag, im grill-me finalisieren)

**Pro Seite verpflichtend:**
1. Eigene URL + self-canonical auf sich selbst.
2. Unique Title/Meta/H1 im Muster "Webdesign <Region>" (nicht generisch mit Region injiziert).
3. Unique Haupt-Content-Block (Ziel 300–500+ Woerter, die man fuer eine andere Region NEU
   schreiben muesste, nicht find-replace): echter regionaler Markt-Kontext, typische Branchen
   der Region, echte regionale Referenzen/Projekte falls vorhanden, ehrliche Logistik ("kommt
   ihr vor Ort?").
4. Regionale FAQ (5–7, echte regionsspezifische Fragen inkl. Foerderungen/vor-Ort) + FAQPage-
   Schema.
5. Answer-first-Absaetze unter frage-basierten H2 (GEO-zitierfaehig).
6. Schema: `Organization` (echte Wien-Adresse) + `Service`/`areaServed: [diese Region]` +
   FAQPage + BreadcrumbList. KEIN Fake-LocalBusiness, KEINE geo-Meta.
7. Hub-and-Spoke: eine Hub-Seite (/webdesign oder /regionen) verlinkt alle Regionen; jede Region
   verlinkt zurueck zum Hub + auf /preise + /leistungen + 1–2 passende Blog-Artikel.
8. Preise aktuell (1.250 / "ab"-Logik), kein 790.
9. Sichtbares Update-Datum, gepflegt.

**Off-Page (Thomas, parallel — der eigentliche LLM-Hebel):** in 2–3 echte "beste Webagentur/
Werbeagentur <Bundesland>"-Listicles + Verzeichnisse pro Region (Clutch/DesignRush/Sortlist/
WKO regional), NAP konsistent, LinkedIn-Company-Page aktiv, Reviews die Service+Ort nennen.

---

## TEIL 4 — Offene Entscheidungen fuer grill-me (bevor gebaut wird)
- Welche Bundeslaender zuerst (alle 9 vs. Prioritaets-Set)? Staedte-Seiten auch?
- Echte regionale Referenzen: haben wir pro Region echte Kunden/Projekte? (Datengrundlage fuer
  echte Uniqueness — sonst fehlt der Kern.)
- URL-Struktur: bestehende `/webdesign-steiermark` behalten (Live-SEO) vs. `/webdesign/steiermark`
  (Hub-Struktur)? Migrations-/Redirect-Folgen.
- Verhaeltnis zur Live-Seite: die 9 alten Seiten bleiben live bis Go-Live; werden sie ersetzt
  oder ergaenzt? Fake-Schema auf der LIVE-Seite SOFORT entschaerfen (Policy-Risiko) oder erst
  beim Go-Live?
- Wie viel echter Content pro Region ist realistisch lieferbar (wer schreibt, House-Voice)?

---

## TEIL 5 — GELOCKTE ENTSCHEIDUNGEN aus grill-me (Thomas, 2026-08-09)

1. **Umfang:** ALLE 9 Bundeslaender im ersten Durchgang. Harte Bedingung: jede Seite genuine
   unterschiedliche Substanz (kein find-replace), sonst Doorway.
2. **URL:** bestehende Slugs behalten (`/webdesign-steiermark` usw.). Kein Redirect, Equity bleibt.
3. **Fake-Schema auf LIVE:** wird ERST beim Go-Live entschaerft (Thomas akzeptiert das Rest-Risiko
   bis dahin). Die NEUEN Relaunch-Seiten bekommen von Anfang an das saubere Schema.
4. **Ziel-Platzierung:** organische Google-Treffer + LLM-Nennungen (machbar). Karten-3-Pack NICHT
   Ziel ausserhalb Wien (braucht echtes Buero, nicht ehrlich machbar). Wien-Karte via sauberes GBP
   = Thomas Off-Page.
5. **Template:** Relaunch-Design-Shell (Menue/Footer/Schrift/Optik geteilt) + content-reiches
   Regional-Template (frage-basierte H2, Answer-first, echte Kunden, FAQ). NICHT die animierte Home
   1:1 x9 (waere Doorway + wenig crawlbarer Text).
6. **Angebot bleibt UNIVERSAL** — NICHT auf regionale Nischen (z.B. "Zahnaerzte Steiermark")
   verengen. Deckt sich mit dem Zielgruppen-Grundsatz. Region-Unterscheidung kommt aus echten
   Kunden + ehrlichem Vor-Ort-Framing + regionaler Praxis-FAQ, nicht aus einer Nischen-Branche.
7. **Framing:** Wien-basiert, remote-first, "auf Wunsch vor Ort in ganz Oesterreich" (Thomas: wir
   sind mobil, Mitarbeiter koennen ueberall vor Ort sein, nicht ausgeschlossen). Ehrlich, kein
   erfundenes Buero.
8. **"Geo-Signale" (die ECHTEN, statt totem geo-Meta):** areaServed-Schema + Region in Title/H1/URL
   + echter regionaler Content + Hub-Linking + Off-Page. Das ist der ehrliche Ersatz fuer den
   toten geo.region/ICBM-Tag.
9. **Kunden-Daten:** Ich baue mit Platzhaltern (Content aus aktuellen echten Seiten portiert), echte
   Kunden ersetzen VOR Go-Live. NIE erfundene Kunden live. Reale Zuordnungen (Thomas, provisorisch,
   zu bestaetigen): Steiermark=Michael/rero-michael, Niederoesterreich=Rohra (Handwerker/Fliesen),
   Oberoesterreich=Dasha Lashes/lashesbydanesh. "Kunden in jedem Bundesland vorhanden" — Rest folgt.
10. **Hub:** eine `/webdesign`-Uebersichtsseite verlinkt alle 9 Regionen; jede Region zurueck zum
    Hub + auf /preise + /leistungen + 1-2 passende Blog-Artikel.

**Bau-Sequenz (Thomas-Regel Demo-vor-Umbau + visuell bestaetigen):** ZUERST EINE Referenz-Seite
(Steiermark) im Relaunch-Design fertig bauen -> Thomas bestaetigt auf seinem Screen -> dann die
anderen 8 + Hub nachziehen. Nicht alle 9 blind bauen.

---

## TEIL 6 — MIGRATIONS-RISIKO + One-Pager-Reframing (Research 09.08., HOCH-STAKES)

**Ausloeser:** /webdesign-steiermark ist die TOP-IMPRESSIONS-Seite (Search Console). Darf beim
Austausch NICHT verloren gehen.

**Ist-Analyse der Live-Seite (empirisch):** ~3.115 Woerter, keyword-dicht (steiermark x72, graz x30,
leoben x12, bruck x9, kapfenberg x9, knittelfeld x4, seo x22), Region-Ueberschriften, Branchen-Block,
Portfolio mit 6 echten Kunden (ReRo, Thermewarten, LashesbyDanesh, La Morra, K2, Aircraft), Region-FAQ.
DAS ist der Grund fuers Ranking.

**Verdikt (Research research_bundesland_migration.md):** Die erste home-basierte Version (~500 Woerter,
design-lastig) 1:1 einzuspielen = zwei unabhaengig belegte Ranking-Killer gestapelt auf der #1-Seite:
1. Text bei rankender Seite schrumpfen (1000->100 Woerter = Ranking-Absturz, Redesign-Fehler Nr.1).
2. 9 Template-Klone = Doorway (HVAC-Fall: -80% Rankings/-63% Traffic in 30 Tagen).
Google: nach Umbau ~1 Monat Re-Crawl + 2-3 Monate Re-Ranking -> Fehler ist monatelang teuer.

**One-Pager-Reframing (Thomas, wichtig):** Die alte Seite ist ein ONE-PAGER (Preise+Portfolio+Branchen+
Testimonials alles auf einer Seite) -> daher die vielen Woerter. Der Relaunch verteilt das auf mehrere
Seiten. Also braucht die Region-Seite NICHT alle 3.115 Woerter, sondern den REGION-SPEZIFISCHEN Anteil
(Warum Steiermark, echte regionale Referenzen, Branchen, Region-FAQ, Vor-Ort-Logistik). Generisches
(Preise/Prozess) lebt auf /preise, /leistungen. Gleichzeitig: User NICHT mit Textwand erschlagen.

**Offene Kernfrage -> Research laeuft (research_bundesland_ux_text.md):** wie genug region-eigene
crawlbare Substanz zum Ranken OHNE Text-Wueste? Progressive Disclosure (Akkordeon/FAQ/details =
crawlbar aber eingeklappt), scannbare Struktur, verteilter Content + internes Linking. Mehrere
Loesungen inkl. Foren, geprueft auf Anwendbarkeit.

**Sichere Migration (fix):** gleiche URL + gleicher Title/H1-Keyword (Kontinuitaet); Content-Paritaet
auf REGION-SPEZIFISCHER Ebene (nicht schrumpfen bei dem, was rankt); echte Referenzen + Region-FAQ +
Keywords (steiermark/graz/leoben/bruck/kapfenberg/knittelfeld) erhalten; auf Staging pruefen; GSC
Re-Index anfordern; woechentlich Impressions/Position + Duplikat-Report; Rollback-Trigger vorab
(ploetzlicher Absturz <48h = technisch; langsamer Rueckgang >30% ueber 2+ Wochen = Content -> Snapshot
zurueck).
