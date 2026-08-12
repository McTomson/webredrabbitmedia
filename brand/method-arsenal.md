# method-arsenal.md — Was man alles tut, um eine Seite zu pushen (Munition fuer Baustein 4)

Vollstaendiges Menue. Daraus destillieren wir spaeter die SIGNATUR-Methode (wenige, benannte Schritte = euer eigener Name). Ehrlich bewertet: H=hoher Hebel, M=mittel, L=marginal. [auto]=mit Claude/Code machbar, [manuell]=Handarbeit/extern, [Tool]=Drittanbieter noetig.

## A) Technisches Fundament (Pflicht)
- Core Web Vitals / echte Ladezeit (LCP, INP, CLS), mobile-first. H [auto/Tool]
- Saubere Indexierung: 404s fixen, duenne Seiten, self-Canonicals (= unsere SEO-Befunde). H [auto]
- Strukturierte Daten/Schema: LocalBusiness, Service, FAQ, Breadcrumb, Article, Author/Person. Sauber, KEINE erfundenen Ratings. H [auto]
- XML-Sitemap, robots.txt, **AI-Crawler erlauben** (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended). H [auto] (GEO-Pflicht 2026)
- llms.txt (vorhanden). M [auto]
- Bild-SEO: sprechende Dateinamen, ALT-Tags, WebP/AVIF, Kompression, width/height, lazy-load. M [auto]
- Barrierefreiheit WCAG / **BFSG/EAA (seit 2025 Gesetz)** - eigene Seite muss es vorleben. H [auto]

## B) On-Page / Content (Findbarkeit + AI-Zitate/GEO)
- Keyword-Research + Suchintention; Themencluster/Topical Authority (Pillar+Spokes, begonnen). H [auto]
- GEO/AEO: 40-60-Wort-Antwortblock oben, H2 als echte Frage, Entitaeten benennen, Primaerquellen mit Zahl zitieren, FAQ-Schema (3,2x haeufiger in AI Overviews). H [auto]
- Aktuelles Jahr im Titel + Frische-Updates (Refresh-Loop). M [auto]
- Echte, verifizierte Autoren (E-E-A-T): Author-Schema, Autorenseite, LinkedIn (Thomas). H [auto/manuell]
- Interne Verlinkung/Anker-Strategie; saubere Title/Meta/1x H1. M [auto]

## C) Off-Page / Autoritaet (= GROESSTE LUECKE: 0 Backlinks)
- **Digital PR / Backlinks** (2026 = Autoritaet statt Link-Counting): H [manuell]
  - **Eigene Datenstudie/Original-Research** (z.B. echte Preis-/Markt-Analyse "Website-Kosten Oesterreich") -> Journalisten/Blogs zitieren = Backlinks + GEO-Zitatquelle. STAERKSTER Hebel. H
  - Experten-Kommentar/Newsjacking zu aktuellen Themen (KI, BFSG-Gesetz). M
  - Kostenloses Tool als Link-Magnet. H
- Branchenverzeichnisse/Citations mit konsistenter NAP (Herold, firmenabc etc.), gezielt. M [manuell]
- **Entity-SEO**: als Marke erkannte Entitaet werden (Wikidata, konsistente Erwaehnungen, perspektiv. Knowledge Panel). H [manuell]
- **Konsens-Signal** (GEO): gleiche Positionierung ueber mehrere Quellen (Reddit, YouTube, Review-Sites, Presse) -> triggert AI-Citations. H [manuell]
- **Reddit-GEO**: 24% der Perplexity-Citations (Jan 2026) kommen aus Reddit -> gezielt echte Hilfe in relevanten Subs. M [manuell] (oft vergessen)

## D) Local + Reviews (= LUECKE: nur 8 Reviews)
- Google Business Profile voll optimieren (Kategorien, Fotos, Posts, Q&A, Services). H [manuell]
- **Review-Engine**: nach jedem Projekt automatisiert um echte Bewertung bitten -> 8 auf 30+. H [auto+manuell]
- Bing Places, Apple Business Connect. M [manuell]

## E) Conversion / CRO (= LUECKE: Liste ist fast nur Traffic-Holen)
- Conversion-Layout, klare CTAs, Above-the-fold-Klarheit. H [auto]
- Heatmaps/Session-Recording (MS Clarity gratis, Hotjar), A/B-Tests. M [Tool]
- Lead-Capture: kurzes Formular, mehrere Kontaktwege, WhatsApp, **Call-Tracking**. H [auto/Tool]
- Social Proof prominent (echte Reviews/Cases mit Zahlen). H [auto]

## F) Messung / Tracking (Basis fuer "monatelang ueberwachen + optimieren")
- GSC + **Bing Webmaster** + GA4 + GTM (server-side gegen Adblocker/iOS). H [auto/manuell]
- Conversion-Tracking (Formular, Call, WhatsApp). H
- Rank-Tracking + **AI-Citation-Monitoring** (woechentlich Queries durch ChatGPT/Perplexity/Gemini jagen). H [auto]
- Hinweis: Der **SEO-Monitor (bauen wir schon)** ist genau dieses laufende Ueberwachen -> erweiterbar um AI-Citation-Checks.

## G) Distribution (Content rausbringen, nicht nur publizieren)
- YouTube (@RedRabbitLab), Podcast (content-engine), Substack. M [auto+manuell]
- LinkedIn (Thomas = E-E-A-T + Reichweite). M [manuell]
- Newsletter/E-Mail, **Retargeting-Ads** (Tomson kommt aus Google Ads!). M [Tool]
- Repurposing: 1 Artikel -> Video, Carousel, Reddit-Antwort, LinkedIn-Post. M [auto]

## H) Extra-Tricks (aussergewoehnlich, machen die wenigsten)
- Original-Datenstudie als Link/GEO-Magnet (siehe C). H
- Kostenloses interaktives Tool ("Website-Kosten-Rechner" / "Sichtbarkeits-Check") = Lead-Magnet + Backlinks + PR. H
- **Beweis-auf-der-Seite**: live Lighthouse/Speed/Ranking zeigen ("teste die Seite deiner Agentur"). H (nur wenn eigene Seite top scort)
- Programmatic SEO SAUBER (Stadt-/Branchenseiten mit ECHT einzigartigem Inhalt statt Template-Duplikat = aktueller Fehler). M
- Anti-Portfolio/"Friedhof-Galerie". M (Marken-/Share-Hebel)

## WAS DU (laut deiner Liste) VERGESSEN HAST - ehrlich
1. **Backlinks/Off-Page komplett** - 0 Backlinks, in deiner Liste kommt Linkbuilding/Digital PR nicht vor. GROESSTE Luecke.
2. **Reviews systematisch** - nur 8, keine Review-Engine.
3. **Conversion/CRO** - deine Liste ist fast nur Akquise. Traffic ohne Conversion = Geld verbrennen.
4. **Eigene Seite zuerst reparieren** (404s, duenne Stadtseiten) - vor neuen Tricks die kaputte Basis fixen.
5. **AI-Crawler erlauben + AI-Citation-Monitoring** - GEO-Pflicht 2026.
6. **Barrierefreiheit (BFSG/EAA)** - seit 2025 Gesetz; eigene Seite muss es vorleben.
7. **Eigene Datenstudie** - staerkster Link/GEO-Hebel, fehlt.
