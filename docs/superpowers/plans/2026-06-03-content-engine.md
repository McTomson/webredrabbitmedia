# Content-Engine Implementation Plan (Red Rabbit "Tipps")

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **Sprache:** Prosa Deutsch, Code/Pfade/Commits Englisch (CLAUDE.md). **Conventional Commits.**
> **Mehr-Session:** Jede Phase ist eigenständig lauffähig + testbar. Fortschritt via Checkboxen. Bezug-Spec: `docs/superpowers/specs/2026-06-03-tipps-content-automation-design.md` (v4 SCOPE-LOCK §25-27) + Strategie-Briefing `...-erkenntnisse-und-premortem.md`.

**Goal:** Ein wartbares, weitgehend autonomes System, das täglich/qualitätsgesteuert einen exzellenten, menschlich klingenden, quellen-gestützten "Tipps"-Artikel (+ Bild, Podcast, Video) zu aktuell gesuchten Themen erzeugt, risk-based reviewt, publiziert, deployt und bei Suchmaschinen einreicht — eine Agentur ersetzend.

**Architecture:** Pur Claude Code als Orchestrator (sequenzielle 4-Rollen-Redaktion via Subagenten) + datei-basiertes Memory (`content-engine/`) als geteilter Zustand + Git/Vercel als Publish + launchd als Trigger. Zwei entkoppelte Spuren: Spur 1 Content (robust, headless), Spur 2 Medien (NotebookLM-CLI/YouTube-API/Substack, abbruch-tolerant). Risk-based Review-Routing: nur riskante Artikel in die Email-Queue, sichere auto.

**Tech Stack:** Next.js App Router + MDX (bestehend), Node/TypeScript Glue, Python `notebooklm-py` (Medien-CLI), launchd (Trigger), bestehende `lib/indexnow.ts` + SMTP (`SMTP_*`), Vercel (Deploy), Google Search Console + YouTube Data API.

---

## Scope Check & Subsystem-Aufteilung

Master-Plan mit 7 Phasen. Phase 0-3 = der gelockte schlanke Kern (Spur 1, lauffähig autonom). Phase 4-6 = Medien, Orchestrierung-Verschärfung, Monitoring/Lernen. Jede Phase liefert testbare Software.

| Phase | Liefert (eigenständig nutzbar) | Spur |
|---|---|---|
| 0 | Fundament: Repo aus iCloud, Zugänge, Bestätigungen, Baseline | — |
| 1 | `content-engine/` Memory + Manifest + Voice/Guardrails/Queue | Extra |
| 2 | Artikel-Engine (4 Rollen) → gültige MDX im Repo (dry-run, kein Publish) | 1 |
| 3 | Bild + Quality/Risk-Gate + Email-Review-Routing + Publish + IndexNow | 1 |
| 4 | Medien: NotebookLM Audio+Video → YouTube + Substack + Einbettung | 2 |
| 5 | Orchestrierung: launchd-Trigger (idempotent, Lock, Catch-up), headless-Lauf | — |
| 6 | Monitoring/Lernen: GSC-Frühindikatoren, Kill-Switch, `lessons.md`-Loop | — |

---

## Prerequisites — Inputs vom User (Phase 0 sammelt diese aktiv)

Diese Dinge kann nur der User liefern; sie blockieren bestimmte Phasen:

1. **365 Fragen/Themen** (Form: CSV/MD/Liste) → blockt Phase 1 (Queue) & 2.
2. **Voice-Anker:** 2-3 "beste" bestehende Artikel als Stil-Vorbild + 1-2 LinkedIn-Posts; Klärung Thomas vs. Dmitry = getrennte Stimmen oder eine Hausstimme → blockt Phase 1 (`voice/`).
3. **Erster Meinungs-Batch:** einige rohe Meinungen/Erfahrungen (Chat/Voice-Memo-Transkript) → blockt Phase 2 (sonst leerer Pool → Artikel hält).
4. **Zugänge/OAuth:** Google Search Console (Domain verifizieren), YouTube Data API (OAuth-Client), Substack-Login, NotebookLM (Google-Login), Analytics (GA4/Plausible installiert? prüfen) → blockt Phase 0/4/6.
5. **Codex-Bild-Bestätigung:** ist Codex-Bildgenerierung gratis + automatisierbar? Welcher Zugang (ChatGPT Plus / Codex CLI / API)? → blockt Phase 3.
6. **Daten-Asset-Go:** "Red Rabbit Marktanalyse Website-Kosten AT 2026" aus öffentlichen Quellen + eigenem Winkel aufbauen — ja? → stärkt Phase 2 (Differenzierung).

---

## Datei-/Verzeichnis-Struktur (Decomposition-Lock)

```
content-engine/                      # Memory + System-Wissen (Phase 1)
  README.md                          # MANIFEST: jeder Agent liest das ZUERST
  guardrails.md                      # Nordstern + harte Verbote
  conventions.md                     # Benennung, Output-Pfade, MDX-Schema, Commit-Stil
  roles/{researcher,writer,editor,finalizer}.md
  voice/{thomas,dmitry}.md
  opinions/pool.md                   # gebatchte rohe Meinungen (verbrauchte markiert)
  knowledge/{sources.md,data-assets/}
  topics/queue.yaml                  # Themen + Status todo/drafting/review/published
  lessons.md                         # Lessons aus Freigaben (wächst)
  performance/                       # GSC-Snapshots (Phase 6)

scripts/content-engine/              # Glue-Code (TypeScript/Python/Shell)
  pipeline.ts                        # Orchestrator-Einstieg (ruft Rollen, Gates)
  gate.ts                            # Quality + Risk-Scoring + Sperren
  image/brand-postprocess.ts         # deterministische Marken-Schicht
  media/notebooklm_cli.py            # Wrapper um notebooklm-py (Persist-Auth)
  media/audiogram.sh                 # ffmpeg-Fallback-Video
  email/send-review.ts               # Review-Email via SMTP
  trigger/run-daily.sh               # launchd-Wrapper (Lock, Catch-up, Bedingungen)
  trigger/com.redrabbit.contentengine.plist

app/api/approve/route.ts             # signierter Einmal-Token Freigabe-Endpoint (Phase 3)
app/tipps/[slug]/page.tsx            # MODIFY: related-posts verbessern, draft-noindex
components/blog/TldrBox.tsx          # NEW (Phase 3, GEO)
components/blog/DataTable.tsx        # NEW (Phase 3, GEO)
content/blog/*.mdx                   # Output der Engine
```

**Verantwortlichkeiten:** `pipeline.ts` orchestriert nur (Retry/Fallback hier, nicht in Rollen). `gate.ts` = einzige Stelle für Quality/Risk-Logik. Medien isoliert unter `media/`. Memory rein deklarativ (kein Code).

---

## Phase 0 — Fundament (keine Engine, aber alles blockierend)

**Deliverable:** Arbeitsfähiges, nicht-iCloud Repo + verifizierte Zugänge + Baseline-Bericht. Danach hängt nichts mehr.

### Task 0.1: Repo aus iCloud bewegen
**Files:** ganzes Projekt → `~/dev/redrabbit`
- [ ] **Step 1:** Klären, ob verschieben oder klonen (Spec §19.1: Entscheidung = verschieben). Backup-Hinweis an User.
- [ ] **Step 2:** `git status` im iCloud-Checkout prüfen (alles committed/gepusht?). Falls dirty: erst sichern.
- [ ] **Step 3:** Projekt nach `~/dev/redrabbit` verschieben (oder frisch klonen von origin). `node_modules` neu `npm install`.
- [ ] **Step 4:** Verifizieren: `cd ~/dev/redrabbit && git status` (kein iCloud-Hang) + `npm run build` läuft.
- [ ] **Step 5:** Ab hier ist `~/dev/redrabbit` das Arbeits-Repo. Spec/Plan dorthin mitnehmen. Commit der bisher ungecommitteten `docs/superpowers/`-Dateien.

### Task 0.2: Baseline messen (Frühindikatoren-Fundament)
- [ ] **Step 1:** Google Search Console für Domain einrichten/verifizieren; Sitemap einreichen.
- [ ] **Step 2:** Aktuellen Stand notieren: indexierte Seiten, GSC-Impressions, bestehende Rankings, ist GA4/Plausible installiert?
- [ ] **Step 3:** Baseline-Notiz nach `content-engine/performance/baseline-2026-06.md` (wird in Phase 1 angelegt; vorerst sammeln).
- [ ] **Step 4:** 3-6-Monats-Ziel BEDINGT auf diese Baseline reformulieren (in Spec notieren).

### Task 0.3: Zugänge + Bestätigungen einholen
- [ ] **Step 1:** YouTube Data API OAuth-Client anlegen (Quota prüfen: ~6 Uploads/Tag reichen).
- [ ] **Step 2:** Bild-Generator = **`codex` CLI `imagegen`-Skill** (Terminal, headless via Shell-Aufruf aus der Pipeline). **GATE GRÜN:** automatisierbar BESTÄTIGT + Kosten geklärt — läuft über ChatGPT-Plus-Limit des Users = **0€ extra**. Pipeline ruft `codex` per Shell fürs Motiv; deterministische Marken-Nachbearbeitung erzwingt den einheitlichen Look. (Fallback HTML→PNG-Vorlage bleibt vorhanden, aktuell nicht nötig.)
- [ ] **Step 3:** `notebooklm-py` lokal installieren + Persist-Auth einrichten; **Machbarkeits-Probe**: 1 Test-Notebook → Audio + Video (deutsch) generieren + downloaden. Datei-Integrität prüfen (nicht leer/trunkiert).
- [ ] **Step 4:** Inputs 1-3 (365-Liste, Voice-Anker, Meinungs-Batch) vom User anfordern/ablegen.
- [ ] **Step 5:** **Bestehende Workflows lesen + einarbeiten** (NICHT neu erfinden): `.agent/workflows/podcast-einbinden.md` (existierender Podcast-/Substack-Prozess → Phase 4) + `.agent/workflows/seo-texte-leitfaden.md` (bestehender SEO-/Schreib-Leitfaden → Phase 1 voice/conventions). Auch `MEMORY.md`/`LESSONS_LEARNED.md` (Projekt-Memory, geteilt mit Codex) berücksichtigen.

### Task 0.4: Headless-Spike (KRITISCH — Fundament der ganzen Architektur, Spec §24)
**Begründung:** Alles ruht auf "launchd ruft `claude` headless, 0€ über Abo". Wird das nie früh getestet, bauen Phasen 2-6 auf Sand. Erst grün → weiterbauen.
- [ ] **Step 1:** Bare Shell-Script, das `claude -p "<multi-step prompt>"` **nicht-interaktiv** aufruft (genau wie launchd später).
- [ ] **Step 2:** Verifizieren: Auth besteht ohne interaktive Session; ein mehrstufiger Prompt läuft durch.
- [ ] **Step 3:** Token-Verbrauch + etwaige Rate-Limit-/ToS-Signale protokollieren. Ergebnis nach `content-engine/performance/headless-spike.md`.
- [ ] **Step 4:** **Gate:** rot (ToS/Limit/Auth bricht) → Architektur anpassen (Trigger-Modell), BEVOR Phase 2 startet.

### Task 0.5: Engine-Tooling (TS-Runtime + Test-Runner — fehlt aktuell komplett)
**Files:** Modify `package.json`
- [ ] **Step 1:** `vitest` + `tsx` als devDeps installieren (oder Äquivalent).
- [ ] **Step 2:** npm-Scripts `test` (vitest) + `engine` (tsx Einstieg) ergänzen.
- [ ] **Step 3:** Dokumentieren, wie `run-daily.sh` (Phase 5) die `.ts`-Glue headless ausführt (`npx tsx`).
- [ ] **Step 4:** Dummy-Test grün, Commit. (Hinweis: `googleapis`+`nodemailer` sind bereits installiert — kein neues Dep für YouTube/GSC/SMTP.)

### Task 0.6: Secrets & Headless-Auth-Inventar
- [ ] **Step 1:** Alle Credentials inventarisieren: YouTube/GSC-OAuth-Tokens, NotebookLM/Substack-Cookies, Approval-Token-Signing-Secret, SMTP.
- [ ] **Step 2:** Ablage definieren (`.env.local` nicht committed; Cookie-Stores außerhalb Repo) + wie `run-daily.sh` sie **non-interaktiv** liest.
- [ ] **Step 3:** Klären, wie OAuth/Cookie-Auth einen launchd-Kontext ohne interaktiven Login überlebt (Refresh-Token; Re-Auth-Alarm als erwartetes Ereignis).

### Task 0.7: Substack-Machbarkeitsprobe (analog NotebookLM, vor Phase 4)
- [ ] Browser-Automation-Probe: 1 Test-Post-Entwurf in Substack anlegen (Persist-Auth). Ergebnis dokumentieren; bei Unmöglichkeit Phase 4 anpassen (Substack manuell statt auto).

**Verifikation Phase 0:** Repo läuft ohne Hang; `npm run build` grün; **Headless-Spike grün (Token-Zahl bekannt)**; `vitest` läuft; GSC aktiv; NotebookLM-CLI lädt Audio+Video; Substack-Probe-Ergebnis da; Secrets-Inventar dokumentiert.

---

## Phase 1 — Memory `content-engine/` (das "1 Extra")

**Deliverable:** Vollständiges, von Agenten lesbares Wissens-/Koordinations-Verzeichnis. Eigenständig nützlich als Redaktions-Handbuch.

### Task 1.1: Manifest + Guardrails + Conventions
**Files:** Create `content-engine/README.md`, `guardrails.md`, `conventions.md`
- [ ] **Step 1:** `README.md` schreiben (Manifest: wo liegt was, Lese-Reihenfolge, "jeder Agent liest das ZUERST", Verweis auf alle Unterordner).
- [ ] **Step 2:** `guardrails.md`: Nordstern (echter Mehrwert, Agentur-Ersatz), harte Verbote (keine unbelegten Preis-/Rechtsaussagen, keine erfundenen Meinungen/Autoren, kein Publish ohne echtes Meinungs-/Quellen-Element).
- [ ] **Step 3:** `conventions.md`: MDX-Frontmatter-Schema (aus `lib/blog/posts.ts` `BlogPost`-Interface übernehmen: title, slug, excerpt, featuredSnippet(+Title), author, publishedAt, updatedAt, category, tags, featuredImage, sources, keyTakeaways, conclusionStats, autoGenerateFAQs/customFAQs), Slug-/Datei-Benennung, Bild-Pfad `/images/blog/`, Commit-Stil.
- [ ] **Step 4:** Commit `feat(content-engine): add memory manifest, guardrails, conventions`.

### Task 1.2: Rollen-Definitionen
**Files:** Create `content-engine/roles/{researcher,writer,editor,finalizer}.md`
- [ ] **Step 1:** Pro Rolle: Aufgabe, erlaubte Tools (researcher: WebSearch/Firecrawl + `knowledge/`; writer: `voice/`+`opinions/`; editor: De-AI-Checkliste+`guardrails.md`; finalizer: Template-Regeln), Input-Dateien, Output-Format, Übergabe an nächste Rolle.
- [ ] **Step 2:** De-AI-Checkliste in `editor.md` (Listen-Manie, Floskeln, gleichförmige Absätze, Em-Dash-Flut, Weichspüler — variieren).
- [ ] **Step 3:** Commit.

### Task 1.3: Voice-Profile (braucht Input 2)
**Files:** Create `content-engine/voice/{thomas,dmitry}.md`
- [ ] **Step 1:** Aus den 2-3 besten bestehenden Artikeln + LinkedIn-Posts Stil extrahieren: Tonfall, Satzbau, typische Wendungen, Standpunkte, Vokabular, Tabus. Auf REALE Personen gemappt (kein Fake).
- [ ] **Step 2:** Falls Hausstimme gewünscht: eine gemeinsame `voice/house.md` zusätzlich.
- [ ] **Step 3:** Commit.

### Task 1.4: Themen-Queue + Opinion-Pool (braucht Inputs 1+3)
**Files:** Create `content-engine/topics/queue.yaml`, `opinions/pool.md`, `knowledge/sources.md`
- [ ] **Step 1:** 365 Themen in `queue.yaml` importieren; pro Eintrag: frage, cluster, status: todo, winnability: unknown, is_pillar: bool.
- [ ] **Step 2:** Leichten "wird das gesucht?"-Check definieren (Autocomplete/PAA, kein schweres Tool) + simplen Winnability-Hinweis (lokal/Long-Tail bevorzugt).
- [ ] **Step 3:** **Pillar-first-Ordnung (Spec §19.8):** je Cluster die Pillar-Frage markieren + zuerst einplanen, Supporting danach.
- [ ] **Step 4:** **Duplikat-/Kannibalisierungs-Index (Spec §19.11):** simple Liste vorhandener `content/blog/*`-Slugs+Titel; Orchestrator prüft neues Thema dagegen (kein Doppel-Targeting). Bewusst leichtgewichtig (Slug/Titel-Ähnlichkeit, kein schweres Tool).
- [ ] **Step 5:** Ersten Meinungs-Batch in `pool.md` ablegen (Format: thema-bezug → rohe Meinung; Feld `used: false`).
- [ ] **Step 6:** Commit.

**Verifikation Phase 1:** Ein Mensch (oder Agent) kann allein aus `content-engine/` verstehen, wie gearbeitet wird, wo alles liegt, was jede Rolle tut. `queue.yaml` valide, `pool.md` gefüllt.

---

## Phase 2 — Artikel-Engine (Spur 1, dry-run)

**Deliverable:** `pipeline.ts` erzeugt aus einem Queue-Thema eine **gültige MDX-Datei** im Hausstil mit echten Quellen + Meinungs-Inject — noch OHNE Publish (dry-run, Datei landet, kein git push). End-to-end testbar.

> Hinweis: LLM-Schritte werden per Sample-Lauf + Inspektion verifiziert (nicht klassisch TDD); deterministischer Glue-Code (Parsing, Frontmatter-Validierung, Slug, Datei-Schreiben) per TDD.

### Task 2.1: Frontmatter-Validator (TDD)
**Files:** Create `scripts/content-engine/frontmatter.ts`, Test `scripts/content-engine/frontmatter.test.ts`
- [ ] **Step 1:** Failing test: valides Frontmatter-Objekt → ok; fehlendes Pflichtfeld (z.B. `featuredSnippet`) → Fehler.
- [ ] **Step 2:** Test laufen, fehlschlagen sehen.
- [ ] **Step 3:** Validator implementieren (gegen `BlogPost`-Interface aus `lib/blog/posts.ts`).
- [ ] **Step 4:** Tests grün.
- [ ] **Step 5:** Commit.

### Task 2.2: Rollen-Orchestrierung (eigener Sub-Plan — das Herzstück, zerlegt)
**Files:** Create `scripts/content-engine/pipeline.ts`, `content-engine/conventions.md` (Handoff-Schema)

- [ ] **2.2a — Aufruf-Mechanik festlegen:** WIE ruft das deterministische `pipeline.ts` eine LLM-Rolle? Entscheidung: Subprozess `claude -p` pro Rolle (headless, wie Spike 0.4) ODER Workflow/Agent-Tool. Eine Mini-Implementierung beweist den Aufruf (Rolle bekommt Input-Datei + Rollen-MD, gibt Output-Datei).
- [ ] **2.2b — Handoff-Schema definieren** (in `conventions.md`): exaktes Format der Übergabe-Artefakte zwischen Rollen (z.B. JSON: `{topic, research[], draft_md, frontmatter, flags[]}`); jede Rolle liest Vorgänger-Output, schreibt eigenes.
- [ ] **2.2c — Researcher-Task:** Prompt-Contract (Input: Thema+`knowledge/`; Output: Fakten+Quellen-Liste, Pass/Fail-Signal "genug belegte Fakten?"). Sample-Lauf + Inspektion.
- [ ] **2.2d — Writer-Task:** Prompt-Contract (Input: research+`voice/`+`opinions/`; Output: draft_md im Hausstil mit Meinungs-Inject). Sample.
- [ ] **2.2e — Editor-Task:** Prompt-Contract (Input: draft; De-AI-Checkliste + `guardrails.md`; Output: bereinigter draft + Flags). Sample.
- [ ] **2.2f — Finalizer-Task:** Prompt-Contract (Output: vollständiges valides Frontmatter (Task 2.1) + interne Links + TL;DR + Tabellen-Hinweise). Sample.
- [ ] **2.2g — Retry/Fallback-Policy im Orchestrator** (zentral, nicht in Rollen): was passiert bei Rolle-Fail/leerem Pool/Quellen-Mangel → Halt mit Grund, kein halber Output. Lock + Idempotenz (Slug-für-Datum existiert? → skip).
- [ ] **2.2h — Token-/Zeit-Verbrauch des vollen Laufs messen** → `performance/headless-spike.md` ergänzen. Commit.

### Task 2.4: End-to-End Golden-Thread-Test (Phase-2-Tor — Pipeline kann scheitern obwohl jede Rolle besteht)
**Files:** Create `scripts/content-engine/pipeline.e2e.test.ts`
**Reihenfolge-Hinweis:** läuft konzeptionell NACH Task 2.3 (Daten-Asset); Nummerierung folgt Einfügereihenfolge.
**Stub-Vertrag für vorgezogenes Gate:** der 2.4-Test nutzt einen minimalen Gate-Stub mit fixem Contract `gate(article) -> {pass: boolean, flags: string[]}` (Default `pass:true`), bis Task 3.2 die echte Logik liefert — danach Stub durch echtes `gate.ts` ersetzen.
- [ ] **Step 1:** Failing test: fixes Seed-Thema → `pipeline.ts` laufen lassen → assert: Frontmatter valide (Task 2.1) + `sources.length >= 1` + Gate-Pass (Stub, s.o.) + Meinungs-Element vorhanden.
- [ ] **Step 2:** Test fehlschlagen sehen, Pipeline so weit bringen dass er besteht.
- [ ] **Step 3:** Als wiederholbares Phase-2-Done-Gate verankern (nicht nur einmalige manuelle Inspektion). Commit.

### Task 2.3: Daten-Asset (Spec §9/§23 — bewusste Entscheidung statt stiller Cut)
**Entscheidung:** Spec macht §9 zum Pass/Fail-Blocker. Lean-v1-Auflösung: Wir bauen das **recherchierte** Marktanalyse-Asset (öffentliche AT-Quellen + eigener Winkel) — das erfüllt das "echtes, quellen-gestütztes, wiederverwendbares" Kriterium OHNE auf interne Zahlen warten zu müssen. Wenn NICHT einmal das gelingt → Differenzierungs-Strategie ändern, nicht mit synthetischen Daten skalieren. Pro aktivem Cluster mind. 1 Asset (Spec §6.2), sonst Cluster pausieren.
**Files:** Create `content-engine/knowledge/data-assets/marktanalyse-website-kosten-at-2026.md`
- [ ] **Step 1:** Öffentliche AT-Preisspannen recherchieren (mit Quellenangabe), zu Marktübersicht aggregieren + eigenen Winkel. Preis-Framing: mit Marktspanne führen (hoch ankern), eigene Zahlen als Beleg für anderes.
- [ ] **Step 2:** Researcher-Rolle nutzt dieses Asset; jeder preisnahe Artikel zieht ein einzigartiges Element.
- [ ] **Step 3:** Commit.

**Verifikation Phase 2:** Aus einem Queue-Thema entsteht reproduzierbar eine valide, gut klingende MDX mit Quellen + Meinung; rendert lokal (`npm run dev` → `/tipps/<slug>`); Token-Budget pro Artikel bekannt.

---

## Phase 3 — Bild, Gate, Risk-Routing, Publish

**Deliverable:** Vollständige Spur 1 autonom: Bild + Quality/Risk-Gate + (risk-based) Email-Review oder Auto-Publish + git push + Vercel-Deploy + IndexNow. Erster echter Artikel kann live gehen.

### Task 3.0: Draft-/noindex-Mechanismus entwerfen (existiert heute NICHT — Reviewer bestätigt)
**Files:** Modify `lib/blog/posts.ts`, `app/tipps/[slug]/page.tsx`
- [ ] **Step 1:** Frontmatter-Feld `status: draft|published` einführen.
- [ ] **Step 2:** `getAllPosts`/`generateStaticParams` schließen `draft` aus (kein Build/Index unfreigegebener Artikel) — kein verwaister indexierter Slug.
- [ ] **Step 3:** Falls Draft-Vorschau nötig: separater Preview-Pfad mit `robots: noindex`. Test: Draft nicht in Sitemap/Static-Params.

### Task 3.1: Bild-Generierung + Marken-Standard
**Files:** Create `scripts/content-engine/image/brand-postprocess.ts`
- [ ] Bild via Codex (Fallback Gemini) zum Artikel-Thema; fixierter Art-Direction-Prompt. Dann deterministische Marken-Nachbearbeitung (Rahmen/Logo/Farbgrading, 1200x630 für OG). Sprechender Dateiname + Alt-Text. KEIN EXIF-GPS. Output `/public/images/blog/<slug>.png`. Verifikation: 3 Bilder = einheitlicher Look.

### Task 3.2: Quality + Risk-Gate (TDD für Scoring)
**Files:** Create `scripts/content-engine/gate.ts` + Test
- [ ] Quality: ≥500 unique Wörter, Differenzierung, Quellen vorhanden, ≥1 echtes Daten-/Meinungs-Element. Risk-Score: Preis-/Rechtsaussagen, unsichere Quelle, niedrige Confidence → Flags. **Harte Sperre:** unbelegte Preis-/Rechtsaussage → Stopp. TDD: bekannte Beispiele → erwartete Scores/Flags. Sample-Texte als Fixtures.

### Task 3.3: Risk-based Review-Routing + Email + Approval-Endpoint
**Files:** Create `scripts/content-engine/email/send-review.ts`, `app/api/approve/route.ts`
- [ ] **Step 1:** Risk niedrig → Auto-Publish-Pfad. Risk hoch → Review-Email (gerenderter Artikel + Bild + [später Medien-Links] + signierter Einmal-Token-Link). SMTP `SMTP_*` + `nodemailer` (bereits installiert) wiederverwenden.
- [ ] **Step 2:** **Token-State-Store festlegen (Vercel ist stateless!):** Approval = signierter Token (HMAC mit Secret), Einmaligkeit über einen **Consumed-Marker als Commit im Repo** (`content-engine/topics/queue.yaml` Status-Flip von `review`→`published` IST der Single-Use-Beweis; ein bereits publizierter Slug akzeptiert keinen zweiten Approve). Ablauf via Timestamp im Token. Kein externer KV nötig.
- [ ] **Step 3:** `app/api/approve/route.ts`: Token verifizieren → Status-Flip → triggert Publish (Task 3.4). Entwürfe bleiben `draft` (Task 3.0) bis dahin.

### Task 3.4: Publish + Deploy + IndexNow + On-Page-AI-Label
**Files:** Modify `app/tipps/[slug]/page.tsx`, `lib/blog/posts.ts`, nutze `lib/indexnow.ts`
- [ ] **Step 1:** Status `draft`→`published`, MDX commit + git push (von `~/dev/redrabbit`) → Vercel deployt.
- [ ] **Step 2:** Nach Live: `lib/indexnow.ts`-Ping + GSC. Verifikation: Artikel live, Schema valide (Rich Results Test), IndexNow 200.
- [ ] **Step 3:** **On-Page-AI-Kennzeichnung (Spec §23, EU-AI-Act):** dezenter Hinweis "KI-unterstützt, redaktionell geprüft" im Artikel-Footer/Frontmatter — nicht nur auf YouTube.

### Task 3.5: Rollback / Un-Publish (Akzeptanzkriterium, Spec §23 — fehlte komplett)
**Files:** Create `scripts/content-engine/rollback.ts`
- [ ] **Step 1:** Helper: gegebenen Slug auf `draft` zurücksetzen ODER git-revert des Publish-Commits.
- [ ] **Step 2:** De-Index: GSC-Removal anstoßen + Sitemap-Aktualisierung (Artikel raus). Test an einem Wegwerf-Artikel.

**Verifikation Phase 3:** Ein Thema → kompletter autonomer Lauf bis Live (sicherer Artikel auto; riskanter via Email-Freigabe). Bild einheitlich, Gate greift, kein Draft indexiert, AI-Label sichtbar, Rollback an Testartikel bewiesen.

---

## Phase 4 — Medien (Spur 2, entkoppelt)

**Deliverable:** Aus dem Artikel(-Entwurfstext) Audio + Video, auf YouTube + Substack, zurück in die Seite eingebettet.

- [ ] **4.1** `media/notebooklm_cli.py`: Entwurfstext als Source → Audio + Video (deutsch) generieren, downloaden, **Integritätsprüfung** (Größe/Dauer/Codec). Re-Auth als erwartetes Ereignis (Alarm + manueller Schnell-Login). Fallback `media/audiogram.sh` (ffmpeg) bei Video-Fehlschlag.
- [ ] **4.2** YouTube-Upload via Data API (OAuth), Beschreibung mit Artikel-Backlink, **AI-Kennzeichnung** ("altered content").
- [ ] **4.3** Substack-Post via Browser-Automation (Persist-Auth; ToS-/Sperr-Risiko dokumentiert, sparsam).
- [ ] **4.4** Audio/Video in Artikelseite einbetten (MDX-Komponente) → re-deploy. Bei fehlenden Medien: Artikel ohne Medien publizieren (graceful degradation), Email vermerkt "Medien ausstehend".
- [ ] **Verifikation:** Video/Audio live + verlinkt + eingebettet; Fallback nachweislich funktionsfähig.

---

## Phase 5 — Orchestrierung (launchd, headless, idempotent)

**Deliverable:** Selbstheilender Trigger, der die Pipeline unbeaufsichtigt startet, wenn der Mac an ist.

- [ ] **5.1** `trigger/run-daily.sh`: prüft "heutiger Artikel da?"; Bedingungen (Netz, ggf. Strom); **Lock** gegen Doppellauf; **Catch-up** für verpasste Tage; ruft `claude` headless mit dem Pipeline-Skill. Qualitätsgesteuert: kein Publish wenn Gate/Pool nicht besteht → hält.
- [ ] **5.2** `trigger/com.redrabbit.contentengine.plist` (launchd LaunchAgent, StartCalendarInterval + Catch-up via StartInterval). Wechselnde Uhrzeiten.
- [ ] **5.3** Token-Budget-Guard: bei Limit auf morgen schieben, nie halb publizieren.
- [ ] **5.4** **Idempotenz-Key:** "Artikel für Datum/Thema existiert?" via `queue.yaml`-Status + Slug-Konvention (nicht nur Lock-File). Doppellauf am selben Tag = no-op.
- [ ] **5.5** **Error-Alerting:** headless-Fehler um 3 Uhr muss den User erreichen → Alarm-Email via SMTP (eigener Kanal, nicht nur Review-Mail) bei Crash/Re-Auth-Bedarf/Kill-Switch.
- [ ] **Verifikation:** Trigger läuft headless durch, idempotent (kein Doppel), Catch-up nach simuliertem Ausfall, hält bei leerem Pool, Alarm-Email bei simuliertem Fehler kommt an.

---

## Phase 6 — Monitoring + Lernen (Frühindikatoren, Kill-Switch, lessons-Loop)

**Deliverable:** Das System überwacht sich + sammelt Wissen, ohne Richtung zu verlieren.

- [ ] **6.0** **Analytics sicherstellen:** falls Task 0.2 ergab "kein GA4/Plausible" → jetzt installieren (sonst sind Klicks/Leads nicht messbar, KPI-Kette bricht).
- [ ] **6.1** GSC-API-Abruf (OAuth) → `performance/`-Snapshots: Indexierungs-Rate (KPI #1), Impressions, erste Position-20-Auftritte, Klicks. KPI = Indexierung → Klicks → Leads (nicht Rankings).
- [ ] **6.2** **Kill-Switch / Frühindikatoren:** niedrige Indexierungs-Rate → Velocity runter/Stopp + Alarm.
- [ ] **6.3** `lessons.md`-Loop: aus Freigabe-Korrekturen (was du änderst/ablehnst) Regeln ableiten → fließt in `voice/`+`guardrails.md`. Manuell kuratiert, nicht magisch.
- [ ] **6.4** **Lead-Capture (KPI-Endpunkt, eigene kleine Aufgabe):** pro Artikel-Typ eine passende Conversion-Aktion (kontextueller CTA, kostenloser Website-Check, Preis-Anfrage). Tracking-Event in GA4. Ohne diese Brücke ist "Leads" = 0 (Spec §6.7). Komponente + Einbau ins Template, nicht nur Notiz.
- [ ] **Verifikation:** Nach 4-6 Wochen Live-Betrieb: Indexierungs-Rate sichtbar, mind. erste Impressions, lessons.md gewachsen, Kill-Switch getestet.

---

## Akzeptanzkriterien (Definition of Done = "alle Anforderungen erfüllt")

- Aus einem Queue-Thema entsteht autonom ein menschlich klingender, quellen-gestützter Artikel mit Meinungs-Inject, der das Quality/Risk-Gate besteht.
- Risk-based Routing funktioniert: sichere Artikel auto, riskante via Email-Freigabe (signierter Token).
- Bild einheitlich (Marken-Standard), 0€-Generator bestätigt.
- Medien (Audio+Video) live auf YouTube + Substack + eingebettet, mit robustem Fallback.
- launchd-Trigger läuft unbeaufsichtigt, idempotent, selbstheilend, qualitätsgesteuert (hält bei leerem Pool/Limit).
- Memory wächst (lessons), Frühindikatoren + Kill-Switch aktiv, KPIs = Indexierung→Klicks→Leads.
- Keine unbelegten Preis-/Rechtsaussagen live; AI-Kennzeichnung; Entwürfe nie indexiert; Rollback-Pfad vorhanden.
- Läuft auf `~/dev/redrabbit` (nicht iCloud); 0€ über den Claude-Plan hinaus (ToS/Token geklärt).

## Mehr-Session-Hinweise

- Jede Phase einzeln committen + verifizieren; Checkboxen pflegen. Nächste Session: offene Checkbox = Einstieg.
- Spätere Phasen (4-6) bei Erreichen in eigene Detail-Pläne verfeinern (Tasks dort sind bewusst gröber — Details ändern sich mit Lernen aus 0-3).
- Strategie-Ausbau (Programmatic, Outreach, Multi-Daten-Assets) NICHT vor stabilem Kern (Spec §26).
