# Content-Engine v2 — Skills, Wissensbasis, Distribution & Self-Improvement

Datum: 2026-06-09
Status: Umsetzungsplan für Claude Code. Aufbauend auf der bestehenden Engine
(`content-engine/`, `scripts/content-engine/pipeline.ts`) und dem Premortem
(`docs/superpowers/specs/2026-06-03-content-automation-erkenntnisse-und-premortem.md`).
Zweck: konkrete Skill-Landkarte + Build-Reihenfolge, damit die nächste Session
weiß, was zu bauen ist und in welcher Reihenfolge.

---

## 0. Getroffene Entscheidungen (nicht neu hinterfragen)

- **Budget: strikt 0 €.** Keine Abos, kein bezahlter API. Folgen für Bilder + Syndication unten.
- **Google-Account: bestehender t.uhlir** für NotebookLM-Automatisierung. (Account-Sperr-Risiko bewusst akzeptiert; siehe §9 Schutz.)
- **Video: für jeden Artikel.** (Risiko Massen-Upload + dünne Slideshows bewusst akzeptiert; Schutz in §8.)
- **Tempo: 1 Artikel/Tag sofort**, kein Test-Segment. → Deshalb ist der Kill-Switch (§7) Pflicht, nicht optional.

---

## 1. Leitprinzipien (die ehrlichen Wahrheiten, gegen die alles geprüft wird)

1. **Der Moat ist nicht die Pipeline.** Die Fabrik (4-Rollen-Pipeline) ist gelöst und liefert gute Artikel (verifiziert am Live-Artikel). Der Wettbewerbsvorsprung sind: (a) proprietäre Daten-Assets, (b) echte Meinungen von Thomas, (c) der Mess→Lessons-Loop. Energie dorthin, nicht in Pipeline-Politur.
2. **Backlinks sind Domain-Ebene, nicht pro Artikel.** Kein Massen-Push, kein Spinning. Nicht 365 Backlinks bauen — ~30–80 gute Domain-Links *einmal* + topical authority (die 365 Artikel) + interne Verlinkung.
3. **Automatisierbar UND sicher = Distribution (Reichweite/GEO).** Echter Ranking-Link = wenig Volumen, verdient, halb-manuell. Diese zwei nie verwechseln.
4. **"Unentdeckbar machen" ist das falsche Ziel.** Google bestraft Wert-Defizit, nicht KI. Substanz (eigene Daten + echte Meinung + gelöste Nutzerfrage) schlägt jeden Humanizer.
5. **Vault gehört dir, NotebookLM ist nur Werkzeug davor.** Wissen/Moat in versionierten Dateien, nicht in einer Google-Blackbox.

---

## 2. Skill-Landkarte

Legende: `BEHALTEN` (existiert), `NEU` (fehlt, bauen), `CODE` (deterministisch, kein LLM-Skill), `NICHT` (bewusst weglassen).

### Tier 0 — Fundament (blockt sonst alles)
- **NEU — Knowledge-Ingestion:** Link/YouTube/PDF → Markdown in den Vault. Link via vorhandenem `defuddle`-Skill; YouTube via Transcript (`youtube-transcript-api`, 0 €); PDF → Text. Ablage in `content-engine/knowledge/` bzw. Obsidian-Vault.
- **NEU — Retrieval:** Writer/Researcher fragt den Vault beim Schreiben ab. Klein anfangen: strukturiertes Markdown + Grep/Keyword. Erst bei größerem Korpus lokaler Vektor-Store (sqlite-vec/Chroma, Embeddings lokal auf M1).
- **NEU — Keyword/SERP + Winnability:** freie Quellen (Autocomplete, PAA, GSC, Bing Webmaster), Top-10 ziehen (defuddle), Winnability-Score. Fallback-Kette zwingend (Premortem §6.9). **Der fragilste Baustein.**
- **NEU — Indexierungs-/KPI-Skill:** GSC abfragen → indexiert? Klicks? Leads? **KPI #1 = Indexierungsrate, dann Klicks, dann Leads — NICHT Rankings.** Speist den Loop und den Kill-Switch.

### Tier 1 — Qualitäts-Loop
- **NEU — `/interview-me` (adaptiert):** Claude interviewt Thomas, kitzelt echte Anekdoten/Meinungen raus → schreibt in `content-engine/opinions/pool.md` (im Pool-Format, Guardrails-konform). In einer Session 30–50 Meinungen batchen (Premortem §6.3). Quelle: `abubakarsiddik31/claude-skills-collection`, nur diesen einen Skill übernehmen.
- **NEU — LLM-Judge / Eval (als Subagent):** benotet den Entwurf gegen `guardrails.md` als Rubrik. Rubrik muss *konkrete Evidenz* prüfen (Zitate vorhanden? Zahlen belegt? logische Ordnung? kein Gedankenstrich?), nicht vage Adjektive. Chain-of-Thought im Eval-Prompt. **Getrennter Subagent, NICHT der Writer selbst (Self-Enhancement-Bias).** Letzte Instanz bleibt Thomas + GSC-Zahlen.
- **BEHALTEN/ausbauen — Lessons-Curator:** abgelehnte Entwürfe + Thomas-Korrekturen → `lessons.md` → bestätigte Regeln nach `voice/house.md`/`guardrails.md`. Abgelehnte Traces = Golden-Set für die Judge-Kalibrierung ("Data-Flywheel").

### Tier 2 — Distribution / Autorität (#1-Risiko aus dem Premortem)
- **CODE — Interne Verlinkung (im Finalizer):** jeder Artikel verlinkt thematisch auf die passende Regio-/Geld-Seite (`/webdesign-wien` etc.) und auf verwandte `/tipps`-Artikel. Voll automatisierbar, 0 €, größter kontrollierbarer Hebel. **Sofort umsetzen.**
- **NEU — Authority-/Backlink-Skill (halb-automatisch, einmalig pro Ziel):**
  - Verzeichnisse (dofollow): Clutch, Sortlist, DesignRush, GoodFirms, ProvenExpert, Trustpilot.
  - Webdesign-Galerien (dofollow, thematisch perfekt): Awwwards, CSS Winner, CSS Light, SiteInspire, BestCSS, CSS Design Awards, Lapa Ninja — pro Portfolio-Projekt einreichen.
  - AT-Citations: WKO Firmen A-Z, Herold, firmenabc.at, wlw, Google Business Profile (konsistente NAP).
  - Skill bereitet Einreichungen vor (Browser-Formular), Thomas bestätigt.
- **CODE/Prozess — Client-Footer-Links:** "Website von Red Rabbit Media" (Marken-Anker, NICHT Keyword-Anker, variiert) ins Auslieferungs-Template jeder Kundenseite. 315+ Projekte = potenziell 315 dofollow-Links. Größter schneller Gewinn.
- **NEU — Syndication (Spur 1, 0 € via Plattform-APIs/Browser):** pro Artikel eigener Winkel (KEIN Duplikat) auf LinkedIn, Medium, Xing. Meist nofollow → Reichweite/Marke/GEO, nicht Ranking-Juice. Mit `canonical`/Quellenhinweis.
- **NEU — PR-Outreach-Prep (Spur 2, halb-manuell):** Daten-Asset als Köder; Agent baut Prospect-Liste AT-Medien/Blogs + personalisierten Pitch + Tracking, Thomas klickt "senden". Der einzige Weg zu echten dofollow-Redaktions-Links.

### Tier 3 — Medien
- **BEHALTEN/umbauen — Podcast + Video via teng-lin/notebooklm-py** (statt PleasePrompto, weil Video-fähig; siehe §9).
- **BEHALTEN — YouTube-Upload** (Data-API, public, "synthetic content"-Flag setzen).
- **NEU — Infografik-als-SVG/HTML:** Daten-Infografiken als Code rendern (exakte Zahlen, Branding, 0 €), NICHT mit Bildmodell malen. Ersetzt die schwachen AI-Infografiken.

### Bestehend & bleibt
Research, Writer, Editor, Finalizer (Rollen), `gate.ts` (CODE, kein LLM), Orchestrator (`pipeline.ts`), Heartbeat (launchd-plists).

### NICHT bauen / weglassen
- Framework-Migration (CrewAI/LangGraph) — dateibasierte Pipeline reicht.
- Skill-Collections horten — jeder Skill = Kontextkosten + Drift. Nur `/interview-me` übernehmen.
- Massen-Backlink-Automatik / Text-Spinning — Deindexierungs-Risiko.
- NotebookLM als "Gehirn" — nur als Werkzeug.
- Per-Region-Content-Artikel (Doorway-Risiko). Regionen NUR über interne Verlinkung.
- Humanizer-"Beat-the-Detector"-Skills — Symptom-Doktorei. (Floskel-Sperrliste darf in `guardrails.md` einfließen.)

---

## 3. Sofort-Fixes am bestehenden Artikel-Output (schnell, echtes Signal)

1. **Alt-Texte reparieren:** aktuell steht der rohe englische Generierungs-Prompt im Alt-Text ("Close-up of a graphic designer's hands … no readable text"). → Deutsch + Geo-Keyword, beschreibend. Im Bild-/Finalizer-Schritt fixen.
2. **Quellen verlinken:** McKinsey/Forrester/Glassdoor/WKO werden genannt, aber nicht verlinkt. Ausgehende Links auf die echten Studien → stärkt E-E-A-T + GEO-Zitierbarkeit. In `finalizer`-Regeln aufnehmen.

---

## 4. AI-Kennzeichnung — Entscheidung dokumentieren

Repo widerspricht sich: `guardrails.md #11` ("AI-Kennzeichnung Pflicht") vs. `MEMORY` ("KEIN KI-Hinweis"). Live-Seite zeigt **keinen** sichtbaren Hinweis (nur "Fachlich geprüft").

Entscheidung: **kein leser-sichtbarer KI-Hinweis.** Compliance über *maschinenlesbare* Markierung (Metadaten/C2PA), die EU-AI-Act-Art.-50 ggf. erfüllt, ohne Banner.
- EU AI Act Art. 50 greift ab **August 2026**; maschinenlesbare Markierung für Bestand bis **2. Dez 2026**.
- Scope für kommerziellen Blog ("öffentliches Interesse") juristisch unklar.
- **TODO: anwaltlich bestätigen.** `guardrails.md #11` entsprechend auf "maschinenlesbare Markierung statt sichtbarem Hinweis" anpassen, Widerspruch zu MEMORY auflösen.

---

## 5. Wissensbasis-Architektur (Vault-first)

```
Vault (Obsidian, in Git versioniert)  =  Quelle der Wahrheit / Moat
  ├── Artikel-Korpus (Stil-Beispiele für Writer)
  ├── knowledge/        (recherchierte Fakten, Quellen)
  ├── knowledge/data-assets/  (proprietäre Daten = Linkmagnet + Differenzierung)
  ├── opinions/pool.md  (echte Meinungen aus /interview-me)
  └── lessons.md        (gelernte Regeln)
        │
        │  Ingestion: Link→defuddle, YouTube→Transcript, PDF→Text
        ▼
NotebookLM (teng-lin, t.uhlir)  =  Linse/Werkzeug DAVOR
  ├── Recherche-Synthese (pro Cluster ein Notebook)
  └── Podcast + Video erzeugen
```

Reihenfolge zwingend: **erst Vault + Ingestion (läuft lokal, 0 €, kein Account-Risiko), dann NotebookLM additiv obendrauf.** Bricht NotebookLM, steht der Vault trotzdem.

---

## 6. Build-Reihenfolge (konkret abarbeitbar)

1. **Interne Verlinkung im Finalizer** (CODE, sofort, größter freier Hebel).
2. **Sofort-Fixes** Alt-Text + Quell-Links (§3).
3. **Knowledge-Ingestion + Retrieval** (Tier 0) — Vault-Struktur, defuddle/YouTube-Transcript, Writer greift zu.
4. **`/interview-me` adaptieren** → Meinungs-Pool füllen (30–50 batchen).
5. **Keyword/SERP + Winnability** mit Fallback-Kette.
6. **Indexierungs-/KPI-Skill + Kill-Switch** (§7).
7. **LLM-Judge-Subagent** gegen `guardrails.md`.
8. **Authority-Skill + Client-Footer-Links + Citations/Galerien** (Tier 2, einmalig).
9. **Syndication** (eigener Winkel pro Plattform).
10. **teng-lin-Integration** für Podcast/Video; Infografik-als-SVG.
11. **PR-Outreach-Prep** (zuletzt, braucht fertiges Daten-Asset).

Schritte 1–7 laufen lokal/0 €/kein Account-Risiko. Erst 10 bringt die fragile Browser-Schicht.

---

## 7. Self-Improvement-Loop (ohne Drift) — Pflicht, weil kein Test-Segment

- **Rubrik:** `guardrails.md` + `gate.ts` = "was ist gut", evidenz-basiert.
- **LLM-Judge:** Vorsortierung, getrennter Subagent, nie letzte Instanz.
- **Ground-Truth:** Thomas-Approve/Reject + GSC (Indexierung→Klicks→Leads).
- **Flywheel:** Rejects → Golden-Set → Judge-Kalibrierung; Korrekturen → `lessons.md` → `guardrails`/`voice`.
- **KILL-SWITCH (da 1/Tag sofort, kein Test-Segment):** harte Leading-Indicators in GSC. Wenn nach Woche 4–6 die **Indexierungsrate** unter Schwelle fällt (z.B. < 60 % der publizierten Artikel indexiert) → Produktion automatisch pausieren, Qualität/Velocity prüfen, BEVOR 180 Artikel live sind. Das ersetzt das ausgelassene Test-Segment.

---

## 8. Video für jeden Artikel — mit Schutz

Entscheidung steht (jeder Artikel). Realität + Schutzmaßnahmen:
- Beschreibungs-Link = **nofollow** (kein Ranking-Juice). Wert = Video-Suchfläche + On-Page-Verweildauer + GEO + Marke.
- **"Synthetic/altered content"-Flag auf YouTube setzen** (Pflicht).
- **Massen-Upload-Schutz:** Upload-Velocity drosseln (nicht 50 auf einmal), Titel/Beschreibung pro Video variieren, kein identisches Template — sonst YouTube-Spam-Flag.
- Empfehlung im Hinterkopf behalten: falls YouTube drosselt oder Grenznutzen sichtbar null → auf selektiv (Traffic-Artikel) umstellen.

---

## 9. NotebookLM-Integration

- **Primär: `teng-lin/notebooklm-py`** (Python/CLI/Skill, kann Audio + **Video** + Infografik/Slides, Downloads MP3/MP4). Account: **t.uhlir**.
- **Fallback: `PleasePrompto/notebooklm-mcp`** (TypeScript MCP, nur Audio) falls teng-lin bricht.
- **Risiko (akzeptiert):** undokumentierte Google-APIs → können ohne Vorwarnung brechen; Account-Sperr-Risiko. **Schutz:** Vault-first (§5) heißt, ein Ausfall stoppt nur Medien, nicht die Text-Pipeline. Medien-Schritt bleibt entkoppelt (bestehender `.media-requests`-Marker-Mechanismus).

---

## 10. Bilder bei strikt 0 € / M1 8GB — ehrliche Grenze

- Lokales FLUX.2/Qwen-Image **nicht möglich** auf M1/8GB.
- **Daten-Infografiken → SVG/HTML-Code** (exakt, Branding, 0 €). Qualitätssprung.
- **Hero-/Stimmungsbilder:** bestehenden Generierungsweg behalten, aber Prompting verbessern + Alt-Text fixen. "Mindestens Nano-Banana-2 lokal" ist bei 0 €/8GB nicht erreichbar — bewusst akzeptierte Grenze.

---

## 11. Offene Vorab-Punkte (vor Voll-Skalierung klären)

- Lead-/Conversion-Mechanik pro Artikel-Typ (Premortem §6.7) — noch undefiniert.
- Mehrere Daten-Assets je Cluster (Premortem §6.2) — vor Skalierung ≥1 pro aktivem Cluster.
- AI-Label anwaltlich bestätigen (§4).
- Bing-Webmaster-Sitemap einreichen (Pflicht für ChatGPT-Sichtbarkeit/GEO).

---

## 12. Quellen (Web-Recherche, Juni 2026)

- Agent Skills / progressive disclosure: anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- NotebookLM-API-Status: autocontentapi.com/blog/does-notebooklm-have-an-api
- teng-lin/notebooklm-py: github.com/teng-lin/notebooklm-py
- Google Spam/Link-Schemes: developers.google.com/search/docs/essentials/spam-policies
- LinkedIn/Medium nofollow: silverbackstrategies.com/blog/does-your-website-benefit-from-medium-and-linkedin-seo-tactics/
- Directory-Links 2026 (Clutch dofollow): editorial.link/directory-link-building/
- CSS-Galerien/Awards: csslight.com/blog/top-css-galleries-and-web-design-awards-for-website-submission
- Ranken ohne Backlinks / topical authority: editorial.link/rank-without-backlinks/
- Lokale Ranking-Faktoren 2026: localdominator.co/local-search-ranking-factors/
- LLM-as-a-Judge kalibrieren: langchain.com/articles/llm-as-a-judge
- Google bestraft Wert-Defizit nicht Menge: rankability.com/data/does-google-penalize-ai-content/
- GEO 2026: aimagicx.com/blog/generative-engine-optimization-chatgpt-perplexity-2026
- EU AI Act Art. 50: artificialintelligenceact.eu/article/50/
- Parasite SEO 2026 White-Hat/Risiko: junia.ai/blog/parasite-seo

*Ende. Dieses Dokument ist der Bauplan für Content-Engine v2. Es ergänzt das Premortem,
ersetzt es nicht. Kernbotschaft: Fabrik steht — bauen wir die drei Nicht-Fabrik-Hebel
(Wissens-Loop, Distribution/Autorität, Messung) und die Sofort-Fixes.*
