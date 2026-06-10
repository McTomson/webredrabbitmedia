# Content-Engine v2 (REVIDIERT) — Schadensabwehr, Wissens-Vault, Mess-Loop, GEO

Datum: 2026-06-09
Status: Umsetzungsplan, ersetzt den ersten v2-Entwurf vom selben Tag
(`2026-06-09-content-engine-v2-skills-distribution-plan.md`). Verifiziert gegen
den echten Code-Stand (`scripts/content-engine/`, `content/blog/`, `app/`) und
an einem Live-Artikel (`was-ist-der-unterschied-...-grafikdesign...`).

---

## 0. Verifizierter Ausgangsstand (nicht geraten)

- Fabrik fertig und gut: 5-Rollen-Pipeline, deterministisches `gate.ts`, Anti-KI-Voice durchgesetzt, KI-Hinweis im Code entfernt.
- ~18 Artikel live, 365 in der Queue, ~9 in Review.
- Traffic-Realitaet: `baseline-2026-06.md` = ~11 Klicks in 3 Monaten. Domain hat faktisch keine Autoritaet. Das ist der Kontext fuer ALLE Entscheidungen.
- Medien: Bilder, YouTube-Upload, Video-Embed fertig. NotebookLM rein manuell im Browser.
- Moat noch nicht gebaut: `opinions/pool.md` = 3 Eintraege, `lessons.md` leer, kein Retrieval, kein Vault-Zugriff im Researcher, kein Prompt-Caching.

## 0a. Getroffene Entscheidungen (User, 09.06, fix)

- **1 Artikel/Tag bleibt.** Risiko (scaled content abuse) bewusst akzeptiert. Deshalb ist der Kill-Switch (§6) Pflicht.
- **Ziel: GEO UND SERP zusammen.** Annahme des Users: jeder Tag ein neues Thema, Ranking verbessert sich mit wachsendem Traffic. Wird durch §5 (Auswahl-Logik) praezisiert, nicht ersetzt.
- **Moat = web-verifizierter Wissens-Vault, ADDITIV.** Web-Recherche bleibt wie jetzt (funktioniert gut, Quellen werden sauber geholt). Vault fliesst nur zusaetzlich ein, wo eigenes Wissen da ist. Luecken gehen wie bisher ins Netz. Neues fliesst zurueck. Kein erfundenes Daten-Asset (nur ~10 echte Projekte).

---

## 1. P0 — Schadensabwehr: fabriziertes Bewertungs-Schema (ZUERST)

Befund (im Code verifiziert): RR hat ~10 echte Kundenseiten, der Code behauptet aber:
- `app/layout.tsx:193` `reviewCount:"315"`, `ratingValue:"4.9"`
- `app/webdesign-steiermark` 179, `app/webdesign-niederoesterreich` 164, `app/webdesign-salzburg` 134
- `app/tipps/page.tsx:7` Titel "315+ Votes"; `layout.tsx` Meta/OG "315 zufriedene Kunden"

Risiko: Google Review-Snippet-Spam-Policy (Verlust Sterne-Rich-Results + Manual-Action-Risiko fuers gesamte Schema), UWG (irreführende Werbung AT). Untergraebt die gesamte E-E-A-T-Strategie.

**Entscheidung des Users (10.06, gegen meine ausdrueckliche Empfehlung):** AggregateRating mit der hohen Zahl (315+/4,9) BLEIBT als Vertrauens-Hebel ("fake it till you make it"). RR hat nur eine Handvoll echte Reviews. Mein dokumentierter Einwand: fabriziertes Review-Markup ist der zuverlaessigste Manual-Action-Ausloeser + UWG-Risiko + GEO-Widerspruchssignal; es beschaedigt genau das Trust-Kapital, das die Engine aufbauen soll. Echte namentliche Testimonials wirken staerker als eine runde Fantasiezahl.

Aktion (abgeschwaecht auf Userwunsch): (1) Markup bleibt. (2) Echte namentliche Testimonials ergaenzen. (3) MINIMUM Konsistenz: Bundesland-Zahlen (179+164+134) muessen zur Gesamtzahl passen, "315" nicht direkt neben 4 Testimonials stellen (Inkonsistenz ist der eigentliche Verraeter). (4) Parallel echte Google-/ProvenExpert-Reviews aktiv einsammeln, damit die Zahl mit der Zeit ehrlich wird. KEIN Generieren zusaetzlicher Fake-Reviews.

---

## 2. Sofort-Fixes am Artikel-Output (1 Nachmittag, echtes Signal)

Am Live-Artikel bestaetigt:
1. **Alt-Texte:** Kontextbilder tragen rohen englischen Prompt als Alt (`images-only.ts:85` nutzt `item.concept` direkt). Fix: deutscher, beschreibender Alt-Text + Geo-/Thema-Keyword. Doppelt wichtig, weil Artikel ueber WCAG selbst Alt-Texte verletzen.
2. **Quellen rendern:** `post.sources` (Frontmatter) wird nirgends angezeigt. Quellen-Komponente am Artikelende bauen (Liste mit Links).
3. **Ausgehende Links in der Prosa erzwingen:** Finalizer-Regel: jede genannte Studie/Institution (McKinsey, Forrester, NNG, WKO, RIS) wird beim ersten Vorkommen auf die echte Quelle verlinkt. Staerkt E-E-A-T + GEO-Zitierbarkeit.
4. ~~**Prompt-Caching in `roles.ts`**~~ — VERWORFEN (verifiziert 10.06 via claude-code-guide): `claude -p` nutzt KEIN Prompt-Caching ueber getrennte Prozesse (jeder Rollen-Call = eigener Prozess = eigener HTTP-Request = kein gemeinsamer Cache; keine CLI-Flags dafuer). Echtes Caching ginge nur per Portierung auf das Agent SDK (Python, Conversation-Reuse) = grosser Umbau, verstoesst gegen "additiv/nicht destabilisieren". Bei 1 Artikel/Tag = ein paar Cent. ENTSCHEIDUNG: Status quo behalten, erst messen (`claude -p --output-format json | jq .usage`), nicht optimieren.

---

## 3. Wissens-Vault (additiv) mit Frische-Pruefung

Architektur (Reihenfolge zwingend, laeuft lokal/0 EUR):
- Ablage `content-engine/knowledge/` als strukturiertes Markdown. Jeder Fakt: `aussage`, `quelle (URL)`, `geprueft_am`, `recheck_nach` (TTL).
- **Retrieval additiv:** Researcher fragt ZUERST den Vault (Grep/Keyword reicht bei dieser Groesse), nutzt Treffer als Beleg, holt nur Luecken aus dem Web wie bisher. Web-Ablauf bleibt unveraendert.
- **Frische:** Fakt ueber `recheck_nach` gilt als stale → vor Wiederverwendung kurz gegen Netz gegengecheckt, sonst nicht zitierbar. Verhindert stilles Veralten.
- **Rueckfluss:** jeder publizierte Artikel + neu verifizierte Fakten werden Vault-Quellen. Korpus waechst mit jedem Artikel, Artikel werden konsistent zueinander.
- Vektor-Store (sqlite-vec/Chroma lokal) erst bei groesserem Korpus, nicht jetzt.

Akzeptanz: Researcher zieht belegbar Vault-Treffer vor Web; stale-Fakt wird nachweislich re-verifiziert; neuer Artikel landet automatisch im Vault.

---

## 4. Mess-Loop (GSC) als Steuerung des Tagesslots

Statt blind Queue-Reihenfolge steuert die GSC-API, WAS jeden Tag entsteht. 1/Tag-Tempo bleibt.
- **Striking-Distance:** GSC-Anfragen auf Position 8-20 mit Impressionen, wenig Klicks = schnellste Seite-1-Gewinne. Diese Themen priorisieren.
- **Aktualisieren statt nur neu:** Artikel, der auf Pos 11 klebt → Update (frische Vault-Zahlen, neues `updatedAt`, neue interne Links, IndexNow-Ping) statt naechstes Thema. Oft schneller auf Seite 1 als ein Neuer.
- **Tagesslot-Logik:** entscheidet pro Tag „neu schreiben" vs. „bestehenden Treffer aktualisieren" anhand GSC-Signal.

Akzeptanz: Tagesslot liest GSC und begruendet die Auswahl im Log.

---

## 5. Auswahl- und Verlinkungs-Logik (topical authority)

- **Tiefe vor Breite, Cluster-Wellen:** pro Cluster (7 vorhanden) erst Pillar-Seite, dann 5-10 Spokes, alle untereinander verlinkt, dann naechster Cluster. Statt 365 verwaiste Inseln.
- **Winnability-First:** Long-Tail/geringer-Wettbewerb/hohe-Absicht zuerst (freie Quellen: Autocomplete, PAA, GSC). Fruehe Gewinne = fruehe Klicks = Flywheel-Start. Head-Terms spaeter.
- **Interne Links bidirektional beim Publish:** neuer Artikel verlinkt nach aussen UND passende aeltere Artikel bekommen automatisch einen Link auf den neuen (eingehende interne Links noetig fuer Crawl/Ranking). Cluster-bewusst, nicht nur `/kontakt`.

---

## 6. GEO als erste Klasse (winnbar ohne Autoritaet)

- **Zitierfaehiger Antwort-Block** ganz oben pro Artikel (40-60 Woerter, direkte Antwort auf Titelfrage). Bereits als `featuredSnippet` im Frontmatter vorhanden → auch sichtbar/strukturiert rendern. Das ziehen LLMs + Featured Snippets.
- **Entity-Autoritaet:** `sameAs` (LinkedIn etc.) fuer Thomas + Dmitry ins Person-Schema, damit Google/LLMs sie als Entitaeten erkennen.
- **Bing-Webmaster-Sitemap einreichen** (Pflicht fuer ChatGPT-Sichtbarkeit). `llms.txt` ergaenzen.
- **Syndication GEO-gerichtet:** eigener Winkel auf die Quellen, die LLMs stark gewichten (Reddit, Quora, LinkedIn-Artikel), nicht nur Medium. Mit canonical.

---

## 7. Kill-Switch (Pflicht, weil 1/Tag ohne Test-Segment)

- KPI #1 = Indexierungsrate, dann Klicks, dann Leads (NICHT Rankings).
- Wenn nach Woche 4-6 Indexierungsrate unter Schwelle (z.B. < 60% indexiert) → Produktion automatisch pausieren, bevor 180 Artikel live sind.
- Ground-Truth: Thomas-Approve/Reject + GSC. Rejects → Golden-Set → Lessons-Curator → `lessons.md` → `guardrails`/`voice`.

---

## 8. Build-Reihenfolge

1. P0 Schema-Fix (§1).
2. Sofort-Fixes Alt-Text, Quellen rendern + ausgehende Links, Prompt-Caching (§2).
3. Vault + Frische-Pruefung + additives Retrieval (§3).
4. GSC-Loop: Striking-Distance + Aktualisieren als Tagesslot-Steuerung (§4) + Kill-Switch (§7).
5. Cluster-Wellen + Winnability-First + bidirektionale interne Links (§5).
6. GEO: Antwort-Block sichtbar, `sameAs`, Bing-Sitemap, llms.txt, Syndication (§6).

Medien (NotebookLM-Automatisierung, Infografik-als-SVG, Video selektiv statt fuer jeden) bleibt entkoppelt und kommt nach 1-6, weil es die fragile Browser-Schicht ist und den geringsten Ranking-Wert hat.

---

## 9. Bewusst NICHT bauen

- Massen-Backlinks, Text-Spinning, PBNs, Parasite-Hosting (schwarz, nicht grau; Reputationsrisiko fuer Geschaeft).
- Framework-Migration (CrewAI/LangGraph).
- Per-Region-Content-Artikel (Doorway-Risiko); Regionen nur ueber interne Verlinkung.
- Humanizer/Beat-the-Detector.
- (UEBERHOLT durch §10) Frueher: Video fuer JEDEN Artikel weglassen. User-Entscheidung 10.06: Podcast + Infografik + Video fuer jeden, weil headless video-faehiger NotebookLM-MCP existiert (s. §10).

---

---

## 10. Ergaenzungen aus dem Grilling (10.06, verifiziert)

**Leitlinie: nichts Funktionierendes neu bauen oder kaputt machen. Alles unten ist additiv.**
Nicht anfassen: Pipeline, gate.ts, Rollen, run-media.ts, beide launchd-Jobs, Embeds, Marker-Mechanismus, 3-Mail-Flow.

### 10.1 Ziel des Users (praezisiert)
Maximal freihaendig: "Rechner an → eine Mail bestaetigen → Rest laeuft headless automatisch." Aktuell autonom: Text (launchd 07:53), Bilder (media-check), YouTube-Upload, Einbettung, Commit, 3 Mails. NICHT headless heute: NotebookLM Podcast/Video-Erzeugung + Download + Substack (braucht Browser-Sitzung; Notification "bitte Claude Code starten").

### 10.2 Medien headless schliessen (der EINE echte Umbau)
- **Verifiziert:** video-faehiger headless NotebookLM-MCP existiert (`roomi-fields/notebooklm-mcp`: Video+Audio+Infografik+Report, REST+MCP, headless nach einmaligem sichtbarem Login via persistentem Chrome-Profil; auch `jacob-bd/notebooklm-mcp-cli`).
- **Architektur:** primaer = video-faehiger MCP (Audio+Video headless), Fallback = bestehender `notebooklm-mcp@latest` (nur Audio) wenn primaer bricht. Genau das "beides/Fallback" des Users, aber zweiter Baustein ist der video-MCP, kein zweiter Audio-Server.
- **Vorbehalte (nicht verschweigen):** Erst-Login braucht einmal Display; unter der Haube undokumentierte NotebookLM-Interna ueber persistentes Profil = Account-Sperr-Risiko (geringer als rohe API, weil real-user-naeher). VOR Produktiv ECHTER Test, nicht blind vertrauen. Account: t.uhlir.
- **Media-Checker:** statt macOS-Notification faehrt er die Medien-Kette selbst headless (Audio+Video via MCP → Download → run-media.ts). Aus Notification-Schritt wird Auto-Run-Schritt. Das erfuellt 10.1.
- **Substack:** kein Publish-API. NICHT auto-publizieren. Stattdessen Entwurf automatisch anlegen (Browser-Automation: Titel/Text/Audio) + Bearbeiten-Link in die Schluss-Mail. User klickt einmal "Veroeffentlichen". Risiko klein, ein Klick.
- **YouTube-Spam-Schutz Pflicht:** Tempo drosseln, Titel/Beschreibung pro Video variieren, "synthetic/altered content"-Flag.

### 10.3 NotebookLM als Wissensquelle (Zusatzziel des Users)
- Verifiziert: MCP kann `add_source` + `ask_question`, video-faehige zusaetzlich Reports/Infografiken. NotebookLM wird damit Recherche-Synthese-Maschine, die geerdete, zitierbare Antworten in den Vault (§3) einspeist ("Linse davor"), headless. Verzahnt mit dem Verbesserungs-Loop (§7).

### 10.4 Lead-Mechanik (entschieden)
- KEIN harter Verkaufsblock im Artikel (User: "koennte zu viel sein"). Bestehender dezenter End-CTA ("Kostenloses Erstgespraech vereinbaren") + Seiten-Kontakt-Hinweise bleiben, mehr nicht.

### 10.5 Distribution / externes Signal (vom User zuerst nicht verstanden, jetzt erklaert)
- Domain mit ~11 Klicks rankt mit Inhalt+intern allein langsam, externes Signal fehlt. Footer-Link-Hebel tot (~10 Kundenseiten). Realistischer, automatisierbarer Hebel OHNE jemanden anzuschreiben: **Syndication** = Artikel/eigener Winkel zusaetzlich auf LinkedIn-Artikel, Medium, ggf. wo LLMs stark einlesen, mit Rueck-Link + canonical. Meist nofollow → Zweck ist Reichweite/Marke/GEO-Sichtbarkeit, nicht Ranking-Juice. User will KEIN Presse-Outreach.

### 10.6 URL-/Slug-Hygiene (verifizierter Fund)
- Lange Auto-Slugs sind abgeschnittene Fragen, enden mitten im Wort (`...-statischen-und`, `...-warum-ersetzt`, `...-funktionalem`). Kurze (`was-kostet-eine-website`) sind gut. Fix: ab jetzt kurze keyword-fokussierte Slugs erzeugen; bestehende indexierte NUR mit 301-Redirect aendern (sonst Equity-Verlust).

### 10.7 OFFEN, als eigene Grill-/Research-Schritte (Reihenfolge folgt)
- **Lokales Dashboard (Next.js, beschlossen):** Analyse-Zentrale, ueberwiegend informativ + wenige SICHERE Aktionen (Re-Ping IndexNow, "Medien jetzt starten"-Notfall, spaeter "Artikel aktualisieren"); Veroeffentlichen bleibt im Mail-Flow. NICHT ueber MCP (Web-App ruft APIs direkt serverseitig; MCP ist der Agent-Weg). Untertabs gegen Ueberladung: Ueberblick / Inhalt / Suche(GSC) / Traffic(GA4) / Technik(PageSpeed) / spaeter Verteilung. Inkrementell bauen: erst Ueberblick+GSC+GA4 (~80% Nutzen), Rest nachruesten. Gilt fuer ALLE Seiten, nicht nur Blog.
  - **Auth (User: ja, einrichten):** einmaliges Google-Cloud-Service-Konto mit Lesezugriff auf GSC- + GA4-Property.
  - **Gratis APIs (verifiziert):** GSC (Klicks/Impressionen/Position/CTR/Indexierung = Rueckgrat Suche), GA4 Data API (Sitzungen/Verweildauer=avg engagement time/Kontakt-Events = Rueckgrat Verhalten), PageSpeed Insights (Labor-CWV) + Vercel Speed Insights (Feld-CWV, Hobby gratis 1 Projekt; Vercel Web Analytics auf Hobby PAUSIERT nach Schonfrist → GA4 bleibt Rueckgrat), Bing Webmaster (Bing-Index/Klicks; wichtig fuer ChatGPT/Copilot), IndexNow/Indexing.
  - **Keyword/Frage-Research (verifiziert, gratis):** staerkstes "wie oft angezeigt"-Signal = GSC-Impressionen (eigene echte Daten). Ergaenzend Google Keyword Planner (gratis mit Ads-Konto, Volumen-Spannen, kein Spend), Google Trends, Autocomplete + PAA.
  - **LLM-Check (verifiziert):** keine gratis verlaessliche API. 0-Euro-Weg = launchd-Heartbeat (woechentlich) + Browser-Automation auf Perplexity/ChatGPT-Web-UI, Marken-/Themenfragen, pruefen ob redrabbit zitiert (Perplexity weist Quellen mit Link aus). Bezahlte Alternative Perplexity Sonar API ~1-2 Cent/Frage → woechentlich ~1-2 EUR/Monat, taeglich ~6-12 EUR/Monat. Keine Schein-Metrik bauen.
  - **Aggregation + Empfehlungen (Kernwert):** Agent liest GSC+GA4+PageSpeed zusammen und leitet konkrete Vorschlaege ab (Pos-11-Artikel aktualisieren; Query mit Impressionen aber ohne Seite → Artikel bauen; langsame Seite → CWV fixen). Bruecke Messen→Handeln, verzahnt mit GSC-Loop (§4) + Verbesserungs-Loop (§7).
  - **Vergessen, jetzt drin:** (a) Conversion-Tracking als GA4-Event (Kontakt-/Erstgespraech-Klicks) = "Anfragen pro Artikel", sonst unsichtbar; (b) Seiten-Suche (BlogFilter) protokollieren als gratis Intent-Signal (was Besucher suchen, das noch fehlt).
- **Blog-SEO-Tiefenausbau:** LLM/GPT/Bing-Optimierung, Keyword-Verwendung in H1/Title/URL, Heading-Struktur, Quellen rendern, Antwort-Block. Tiefen-Audit ausstehend.
- **Verifizierte Google-2026-Ranking-Hebel ohne Presse-Outreach, automatisch:** Research-Aufgabe. Hypothesen aufstellen + gegen echte 2026-Policies/Faelle pruefen (nicht raten). Out-of-box, aber white-hat genug, dass es die Outreach-Domain nicht gefaehrdet.

---

---

### 10.8 Bilder: Browser-primaer + Nachbesserung (User 10.06)
- **Generierungs-Weg:** kuenftig PRIMAER ueber Browser (Gemini-Weg, gratis) statt Codex; Codex/`image.ts`-`generatePhoto` nur Fallback. Bestehende Codex-Pipeline NICHT wegwerfen, als Fallback behalten (Architektur-Prinzip).
- **Nachbesserung (Pflicht-Faehigkeit):** Thomas muss einzelne Bilder gezielt verbessern koennen ("passt nicht, neu mit dieser Richtung"). Also pro Bild ein Re-Generate mit Feedback, ohne den Artikel-Text anzufassen (baut auf `images-only.ts` auf, das genau das schon kann: nur Bilder neu, Text bleibt). Im Dashboard als Aktion + ueber Mail/Browser ausloesbar.
- Alt-Text-Fix (DE statt engl. Prompt) ist bereits in `image.ts` + `images-only.ts` umgesetzt (Phase 0).

## 11. Verifizierte Ranking-Hebel (Web-Research 10.06, Band: weiss/hellgrau/etwas-grau, KEIN dunkelgrau/schwarz)

Quellen am Ende. Jeder Hebel: Band, automatisierbar?, Stand.

### 11.1 Topical authority via Cluster-Tiefe (#1 Hebel, VERIFIZIERT)
- Daten: neue Seiten brauchen 20-50 eng verwandte Artikel + starke interne Verlinkung + laufende Updates, dann setzen Signale ein. 25+ Artikel in EINEM eng vernetzten Cluster → 40-70% mehr Keyword-Rankings in 3-6 Monaten. Compounding: erste 10 langsam, naechste 20 leichter, naechste 30 ueberproportional. LLM-Crawler nutzen interne Link-Topologie ebenfalls als Autoritaets-Signal.
- Band weiss. Automatisierbar ja. Stand: bestaetigt die Cluster-Wellen + zweistufige Pillar-Entscheidung (§5, Q3). DEPTH-FIRST ist damit verifiziert richtig, nicht 365 Inseln.

### 11.2 GEO on-page (VERIFIZIERT, grossteils schon gebaut)
- 40-60-Wort-Selbstantwort am Anfang jeder Sektion; H2 als Nutzerfrage; Entitaeten explizit benennen; JSON-LD; PRIMAERQUELLEN zitieren ("Statistics + Cite Sources" = laut Princeton-Paper wirksamste Einzeltaktik); FAQ-Schema = 3,2x wahrscheinlicher in Google AI Overviews; "2026" in Titel/Headings = ~30% mehr Citations; GPTBot/OAI-SearchBot in robots erlauben.
- Band weiss. Automatisierbar ja (Finalizer-Regeln). Stand: FAQ-Schema, featuredSnippet, robots-LLM-Bots schon da. LUECKEN: Antwort-Block sichtbar rendern, Jahr "2026" in Titel, ausgehende Quell-Links (§2).

### 11.3 Plattform-Quellen kennen (VERIFIZIERT, steuert Distribution)
- ChatGPT zitiert zu 47,9% Wikipedia/enzyklopaedisch. Perplexity zieht 46,5% aus REDDIT + gewichtet Frische stark. Google AI Overviews 97% aus den Top-20-Organic (= klassisches SEO bleibt Voraussetzung fuer AI Overviews).

### 11.4 Reddit-/Community-Seeding (OUT-OF-BOX, VERIFIZIERT, dein groesster GEO-Hebel)
- Weil Perplexity fast die Haelfte seiner Citations aus Reddit zieht: echte, hilfreiche Antworten in relevanten AT/DE-Subreddits (r/de, r/Austria, r/Unternehmer, r/webdev), mit sparsamem Link. Band: hellgrau bis etwas-grau (echte Teilnahme = ok; Spam waere dunkelgrau = NICHT). Automatisierbar semi: Agent findet passende Threads + entwirft echte Fachantwort, Thomas gibt frei/postet. Stand: neu.

### 11.5 Reaktive Digital-PR via "Source of Sources" (LEGAL-WEISS, passt zu "kein Presse-Outreach")
- SOS (frei, HARO-Nachfolger), Help a B2B Writer, PressPlugs: JOURNALISTEN fragen, du antwortest als Experte → Zitat + echter dofollow-Redaktions-Link. Das ist KEIN Anschreiben von Presse (Thomas' Verbot), sondern Antworten auf Anfragen. Der einzige realistische Weg zu echten Ranking-Links.
- Band weiss. Automatisierbar semi: Agent ueberwacht die SOS-Mails, entwirft massgeschneiderte Experten-Antwort, Thomas ein Klick senden. Stand: neu.

### 11.6 Scaled-content-abuse SICHER bleiben (VERIFIZIERT, Schutz fuer 1/Tag)
- Abgestraft (Maerz/Mai 2026) wurden: 50-500 Artikel/Tag, duenne Tiefe, KEINE first-hand experience, identische Struktur, near-duplicate, Template-Variable-Tausch. SICHER bleibt: jede Seite beantwortet eine DISTINKTE Frage, echte Daten-Differenzierung, menschliche redaktionelle Pruefung, echte Erfahrung/Meinung.
- KONSEQUENZ: euer Gate + distinkte 365-Fragen + Quellen + Voice sind auf der sicheren Seite SOLANGE der first-hand/Meinungs-Anteil echt ist. `opinions/pool.md` fast leer ist damit nicht nur Qualitaets-, sondern POLICY-Risiko → `/interview-me` wird Pflicht, nicht Kuer. Band weiss.

### 11.7 Frische-Loop als GEO-Doppelnutzen (VERIFIZIERT)
- Jahr-Signale +30% Citations, Perplexity gewichtet Frische. Der "Aktualisieren statt nur neu"-Loop (§4) ist damit zugleich GEO-Hebel: "2026" in Titel/Heading, updatedAt pflegen, IndexNow-Ping.

### 11.8 Quellen
- editorial/topical authority: digitalapplied.com/blog/internal-linking-strategy-topical-authority-playbook-2026, clickrank.ai/topical-authority
- scaled content abuse 2026: digitalapplied.com/blog/scaled-content-abuse-google-march-update, developers.google.com/search/docs/essentials/spam-policies
- GEO/Citations: pixelmojo.io/blogs/geo-playbook-get-cited, frase.io/blog GEO playbook, Princeton GEO paper (Statistics+Cite)
- Reddit/Perplexity: medium.com Reddit GEO Playbook 2026
- Reaktive PR: presswhizz.com/blog/best-haro-alternatives, harolinkbuilding.com (Source of Sources frei)

---

---

## 12. /interview-me: Speicherung + Erinnerung (beschlossen)

- **Speicherort:** `content-engine/opinions/pool.md` (existiert, Format: id, thema/cluster, raw Meinung, used:false). Liegt im Repo = automatisch Obsidian-Inhalt. NICHT Graphify (das ist Code-Graph; Meinungen = Markdown + Grep, wie §3).
- **Abruf:** Writer/Researcher zieht Meinungen per Retrieval (§3) nach cluster/thema. Pool fuellt sich → Thomas beantwortet mit der Zeit weniger.
- **Erinnerung (schon halb gebaut):** Gate kennt bereits Flag `opinion_missing`. Daran haengen: Pipeline trifft Thema ohne Pool-Meinung → haelt → Review-Mail sagt "Meinung fehlt zu X, 2 Min Interview?". Natuerliche Just-in-time-Erinnerung, keine Extra-Mechanik. ZUSAETZLICH: pro Cluster vorab gebuendelte Interview-Sitzung (30-50 Meinungen), damit Vorrat da ist.
- **Format der Sitzung:** ich interviewe eine Frage nach der anderen in Thomas' Stil, schreibe Antworten guardrails-konform in den Pool.

## 13. Distribution + Entitaet erweitert + bewusst verworfen

**Verworfen (gegen Userwunsch gepruefte Idee):** Homepage in API-Listen (API-mega-list, public-apis) eintragen fuer Backlinks = Link-Schema, fast alle nofollow/wertlos, thematisch unpassend (Dev-Verzeichnis fuer Webdesign-Agentur sieht unnatuerlich aus), faellt in "kein Dunkelgrau". NUR legitim, wenn ein ECHTES freies Tool gebaut wird (z.B. Website-Kosten-Rechner, Barrierefreiheits-Schnelltest) → dann GitHub-Repo = echter High-DA-Link aus echtem Wert. Optional, nur bei realem Tool.

**Syndication (eigener Winkel, canonical, meist nofollow → Reichweite/Marke/GEO):**
- LinkedIn (Profil + Firmenseite) - doppelt wichtig, Top-ChatGPT-Citation-Quelle.
- Medium (canonical zurueck aufs Original, kein Duplikat-Schaden).
- Xing (AT/DE), Quora (LLMs lesen Antworten), Reddit (§11.4, Perplexity-Hauptquelle).

**Verzeichnisse/Citations (teils echte dofollow):** Clutch, Sortlist, DesignRush; AT: WKO Firmen A-Z, Herold, firmenABC (saubere lokale NAP-Signale).

**Entitaet (statt Wikipedia-Bumerang):** Wikipedia fuer kleine Agentur scheitert an Relevanzkriterien (Loeschung + Spam-Markierung), erst nach echter Presse. SOFORT: Wikidata-Eintrag Firma + Gruender, LinkedIn-Unternehmensseite, Crunchbase, Google-Unternehmensprofil, alle per `sameAs` im Schema verknuepft → baut Entitaets-Autoritaet, die Google KG + LLMs nutzen.

**Beim gruendlichen Nachdenken noch vergessen (3 echte Hebel):**
- **Eigene Audience / Newsletter (Substack):** einziger Verteilweg, der EUCH gehoert, nicht Google-abhaengig. Jeder Artikel gewinnt Abonnenten → Wiederbesucher + Shares → compoundiert. War nirgends im Plan.
- **YouTube als eigene Suchmaschine:** Videos werden eh hochgeladen → Titel/Beschreibung/Tags/Kapitel fuer YouTube-Suche optimieren (2.-groesste Suchmaschine), fast kein Mehraufwand.
- **SVG-Infografiken in Bildersuche + Pinterest (AT/DE):** Daten-Infografiken sind perfekte Bild-Assets, zusaetzliche Entdeckungsflaeche fuer ~0 Aufwand.

---

---

## 14. Pre-Mortem (10.06): 6 Monate spaeter ist es gescheitert, warum?

Nach Wahrscheinlichkeit geordnet, nicht nach Drama. Jeweils Ursache → was wir JETZT tun.

1. **Stille (wahrscheinlichster Tod).** 180 Artikel, immer noch ~15 Klicks. Kein Penalty, nur Ignoranz: neue Domain ohne externes Signal wird ignoriert, egal wie gut der Text. Ursache = Distribution liegen gelassen (muehsam, halb-manuell). JETZT: Distribution als fester gemessener Schritt; NICHT breit skalieren bevor EIN Cluster nachweislich rankt; kleiner gewinnbarer Cluster komplett in die Tiefe + erster Ranking-Beweis vor Breite.
2. **Leiser Betriebs-Tod.** Fragile Kette (launchd, Browser, MCP-Cookies, undokum. APIs, Vercel) bricht ueber 6 Monate leise, autonom merkt es keiner, 3 Wochen Stillstand. JETZT: Totmann-Alarm (kein Artikel in 24h / Indexierung faellt / Medien-Rueckstau waechst) + Dashboard "letzter-Lauf-Gesundheit". Stille laut machen.
3. **Traffic ohne Anfragen (Eitelkeit).** Rankt evtl., aber rein informativ + schwacher Conversion-Pfad → Besucher, null Kunden. JETZT: Conversion-Events ab Tag 1, kommerziell-nahe Cluster zuerst, messen welcher Cluster Anfragen bringt vs. nur Schueler/Konkurrenz.
4. **Google-Strafe (einziger lauter Tod).** Zwei Ausloeser gleichzeitig: fabriziertes Review-Schema (User behaelt = groesstes selbstverschuldetes Risiko) + leerer Meinungs-Pool → generischer KI-Text = abgestraftes Muster (Maerz/Mai 2026). JETZT: Pool VOR Skalierung fuellen; Kill-Switch echt verdrahten nicht nur dokumentieren.
5. **Minimal-Aufwand frisst den Moat (subtilster).** System braucht regelmaessig 3 User-Inputs: Interview-Meinungen, Reddit/SOS-Antworten, Substack-Klick. "Fast nichts tun" → diese werden uebersprungen → Text laeuft, aber Moat (echte Meinung) + Distribution (Links/Reichweite) verhungern. JETZT: ehrlich = vollstaendig freihaendig widerspricht echtem Moat. Inputs winzig + gebuendelt + terminiert + nicht still ueberspringbar (opinion_missing-Gate haelt an, Absicht).
6. **Qualitaets-Drift in Gleichfoermigkeit.** Eiltempo-Freigaben, lessons.md nie gefuettert, Judge kalibriert auf eigene Vorliebe, Texte werden blasser/aehnlicher, Verbesserungs-Loop wird Selbstbestaetigung. JETZT: echtes Reject-Signal bleibt echt, Judge getrennter Subagent, periodischer Mensch-Stichprobentest.

**Quintessenz:** die drei User-Festlegungen (1/Tag sofort, fabriziertes Schema, maximal freihaendig) erhoehen den Pre-Mortem-Schaden am staerksten. Gegengewichte Pflicht: Kill-Switch + Totmann-Alarm + voller Meinungs-Pool vor Skalierung + EIN bewiesener Cluster vor Breite. Der eine Meta-Hebel: **Disziplin statt Tempo am Anfang** (ein Cluster komplett + Distribution + Messung bis Ranking-/Anfrage-Beweis, DANN Vollgas) defusiert Stille, Conversion-Blindheit, Penalty und Drift gleichzeitig.

---

---

## 15. Architektur-Prinzip + Werkzeuge + Dashboard-Schutz (10.06)

**Build-Order-Entscheidung (User akzeptiert):** ERST ein kleiner gewinnbarer Cluster komplett in die Tiefe + Distribution + Messung als Beweis (Ranking, idealerweise Anfrage), DANN breit skalieren. 1/Tag bleibt im Tempo, aber konzentriert auf einen Cluster statt gestreut.

**Architektur-Prinzip (verbindlich fuer alles Neue):**
- **Single Source of Truth:** Wissen/Meinungen/Lessons = Markdown im Vault (Repo/Obsidian); Pipeline-Zustand = topics/queue.yaml + status.json; keine zweite divergierende Quelle.
- **Modular + additiv:** jede neue Faehigkeit = eigenes Skript/Modul, das die SoT LIEST, nicht den Kern mutiert. Erweiterungen duerfen die laufende Fabrik nie destabilisieren. Nahtloser Ausbau muss jederzeit moeglich sein, ohne Umbau des Bestehenden.
- **Dashboard = read-only ueber SoT + wenige sichere idempotente Aktionen.** Nicht via MCP.

**Werkzeuge (verifiziert auf GitHub, EMPFOHLEN, schliessen echte Luecken):**
- **mcp-gsc** (AminForou): fertiger Search-Console-MCP fuer SEO mit Claude. Agent + Dashboard lesen GSC daraus. Spart GSC-Plumbing.
- **bestehendes Next.js-GSC-Dashboard** (Next.js+Flask: Traffic/Keywords/URL-Inspection/Sitemap/AI-Analyse) als BASIS statt Neubau.
- **foglift-scan** (npm): einzige GEO/AEO-native CLI, bewertet Zitierfaehigkeit. Fuellt GEO-Block + Judge.
- **Lychee**: Broken-Link-Checker → Pre-Mortem-Risiko kaputte Auto-Links, Technik-Tab.
- **schema-dts**: typisiertes JSON-LD → verhindert Schema-Fehler (wie frueher Cockpit-Crash).
- **axe-core / pa11y**: Barrierefreiheit → BaFG-Glaubwuerdigkeit + Alt-Text/WCAG-Maengel automatisch finden.
- Referenz: github.com/amplifying-ai/awesome-generative-engine-optimization.

**Werkzeuge ABGELEHNT (Ballast/Destabilisierung):** n8n (schwere neue Abhaengigkeit, gefaehrdet Stabilitaet; launchd+Skripte laufen), Plausible/Matomo/OpenPanel (GA4+GTM schon live → zweiter Analytics-Stack = Ballast), monolithische GEO-SaaS (paid).

**Dashboard-Schutz (Pre-Mortem #2/#4/#5 operativ):**
- **Penalty-/Anomalie-Detektor:** GSC-API manual-actions-Endpoint + Erkennung Traffic-Absturz/Deindexierung/fallende Indexierungsrate → Alarm wenn Google abstraft oder etwas einbricht.
- **Totmann-Alarm:** kein Artikel in 24h / Medien-Rueckstau waechst → Alarm. Stille laut machen.
- **Aufgaben-Fläche + Erinnerungsmail** fuer die 3 User-Inputs (Interview via opinion_missing-Gate, Reddit/SOS-Entwuerfe, Substack-Klick), maximal vorbereitet, per Klick. Sichert Pre-Mortem #5.

---

---

## 16. Definitive Bau-Reihenfolge (ersetzt §8)

Prinzip: erst Schadensabwehr + Fundament + Schutz, dann EIN bewiesener Cluster, erst danach Breite. Jede Phase additiv, SoT-treu, ohne den laufenden Betrieb zu destabilisieren.

### Phase 0 — Schadensabwehr + Sauberkeit (sofort, kein Skalieren, geringes Risiko)
1. **Schema-Konsistenz** (§1): 315/4,9 bleibt auf Userwunsch; Bundesland-Zahlen (179/164/134) zur Gesamtzahl konsistent machen; "315" nicht direkt neben wenige Testimonials. Mein Einwand bleibt dokumentiert.
2. **Alt-Texte Deutsch** (`images-only.ts:85`, statt englischem `concept` → DE + Thema/Geo-Keyword).
3. **Quellen rendern** (Komponente am Artikelende aus `post.sources`) + **ausgehende Quell-Links** im Finalizer erzwingen.
4. ~~Prompt-Caching~~ VERWORFEN (s. §2.4, bringt bei `-p` nichts).
5. **Slug-Hygiene**: neue Artikel kurze keyword-Slugs; bestehende NUR mit 301-Redirect. NOCH OFFEN (Renames brauchen 301 auf Live-URLs; 37 abgeschnittene Slugs in queue.yaml + ~4 published).
6. **`cluster`-Feld** (1-7) + `category`-Normalisierung, 21 Artikel nachgetragen.

**STATUS 10.06 (erledigt + verifiziert: tsc grün, 48/48 Tests, `next build` grün, review-it 3 Agenten):**
- ERLEDIGT: DE-Alt-Texte (image.ts+images-only.ts, mit Fallback-Kette), Quellen-Render (ArticleSources.tsx + JSON-LD citation), ausgehende Quell-Links (finalizer.md), cluster-Feld + category-Normalisierung (21 Artikel, types via queue.yaml), getRelatedPosts cluster-Scoring + page.tsx daran angebunden, gate.ts/review-notify Risk-Routing robuster (cluster 6 + Wort-Fallback), http(s)-Schutz fuer Quellen-URLs.
- OFFEN in Phase 0: Slug-Hygiene (301-Renames, separat + vorsichtig).
- Verworfen: Prompt-Caching (s.o.).

### Phase 1 — Mess- + Schutz-Fundament (vor dem Skalieren)
7. **mcp-gsc** anbinden + Google-Cloud-Service-Konto (GSC + GA4 Lesezugriff).
8. **Dashboard v1** (Next.js-Basis, read-only): Tab Überblick (Queue-Stand, letzter-Lauf-Gesundheit), Tab Suche (GSC), Tab Traffic (GA4). **Totmann-Alarm** (kein Artikel 24h) + **Penalty/Anomalie-Detektor** (GSC manual-actions + Traffic-Absturz/Deindex). **Conversion-Events** (GTM/GA4) fuer Kontakt/Erstgespraech.
9. **Kill-Switch** verdrahten (Indexierungsrate < Schwelle → Produktion pausiert).
   Beweis: Dashboard zeigt echte GSC/GA4-Zahlen, Alarm feuert bei Stille, Kill-Switch getestet.

### Phase 2 — Moat-Fundament (vor dem Skalieren, nur fuer Pilot-Cluster)
10. **/interview-me**-Skill + Speicherung `opinions/pool.md` + Erinnerung via `opinion_missing`-Gate. Erste gebuendelte Sitzung: Meinungen NUR fuer den Pilot-Cluster.
11. **Vault + Frische-TTL + Retrieval** additiv vor dem Researcher (Web-Recherche bleibt).
    Beweis: Pool hat Pilot-Cluster-Meinungen, Researcher zieht Vault zuerst, stale-Recheck laeuft.

### Phase 3 — DER EINE bewiesene Cluster (Pilot, depth-first)
12. Pilot = **Kosten-Cluster** (hat schon 8 Artikel = Vorsprung, kommerziell nah). Cornerstone/Pillar + fehlende Spokes; interne Verlinkung (Sidebar + deterministische In-Body + Hub-Update); GEO sichtbar (Antwort-Block, "2026" im Titel, FAQ-Schema); Qualitaet via **foglift-scan** + **Lychee** + **schema-dts** + **axe-core/pa11y**.
13. **Distribution Pilot**: LinkedIn/Medium-Syndication, Reddit-Seeding (echt), Source-of-Sources-Monitoring, Newsletter-Signup, Infografik → Bildersuche/Pinterest.
14. **Messen + warten auf Beweis**: Indexierung, Striking-Distance, Klicks, Verweildauer, Conversion.
    Beweis (GATE zur Breite): Pilot indexiert, messbare Ranking-Bewegung, idealerweise 1 Anfrage. ERST DANN Phase 5.

### Phase 4 — Medien headless schliessen (parallel moeglich, der eine echte Umbau)
15. video-faehiger MCP (roomi-fields) + Audio-MCP-Fallback, **echter Test auf DEDIZIERTEM Account** (nicht t.uhlir-primaer), Media-Checker faehrt headless statt Notification, Substack = Auto-Draft + Link. YouTube-Spam-Schutz.
    Beweis: nach Freigabe-Mail laeuft Medien headless durch, Podcast selbst-gehostet, Substack-Draft + Link in Mail.

### Phase 5 — Breit skalieren (NUR nach Phase-3-Beweis)
16. Cluster-Wellen ueber restliche Cluster; GSC-Loop uebernimmt Steuerung (Striking-Distance + Aktualisieren); Dashboard-Tabs Technik + Verteilung; restliche /interview-me-Sitzungen; Aufgaben-Fläche + Erinnerungsmails fuer die 3 User-Inputs.

---

*Ende. Kernbotschaft: Fabrik steht und liefert gute Artikel. Zuerst die Selbst-Sabotage abstellen
(fabriziertes Schema, kaputte Alt-Texte, abgeschnittene Slugs, verschenkte Quellen-Links), dann die additiven Hebel:
headless Medien schliessen, web-verifizierter Vault + NotebookLM-Synthese + /interview-me-Pool (Policy-Schutz),
GSC-Mess-Loop + Dashboard, Cluster-Tiefe (#1-Hebel), GEO, und Distribution ueber Reddit/Source-of-Sources/LinkedIn/Newsletter
plus Entitaet ueber Wikidata. Verworfen: API-Listen-Backlinks (Link-Schema), Wikipedia (Relevanz fehlt noch).*
