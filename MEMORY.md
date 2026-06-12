# MEMORY.md

Project memory for `webredrabbitmedia`.

Update this file at the end of every session when project state, recurring context, active decisions, or operational notes changed.

This file is shared project memory for Codex and Claude Code. Both tools should read and update `MEMORY.md` and `LESSONS_LEARNED.md` so they stay on the same project state.

## Stand 2026-06-11 (Teil 11) — SEO-Batch: Titel, H1, Meta, llms.txt, Pillar, a11y (main `cfcc6fe`)

Diese Session (Fortsetzung Teil 10) hat den Quality-Scan genutzt, um echte Funde abzuarbeiten:

- **Genau 1 H1 pro Artikel** (`6cb8194`, live verifiziert): MDX-Bodies hatten eine doppelte `# Titel`-H1. `stripLeadingTitleH1()` in `lib/blog/posts.ts` entfernt sie zentral; `mdx-components` rendert `#` jetzt als `<h2>`. conventions.md verbietet Body-H1 (Regression-Schutz).
- **20 zu lange Titel gekürzt** (`d75cf9a`): alle ≤60 Zeichen, Keyword vorn, „2026" + „Österreich" (wo lokal) behalten, Marketing-Klammern raus, Kosten-Titel differenziert. Anker via `cluster:relink` aktualisiert. conventions.md `title`-Regel = ≤60/keyword-first/keine Klammern (Regression-Schutz).
- **Meta-Descriptions auf ~155 gekappt** (`901e657`): `clampDescription()` in posts.ts (Wort-Grenze), nur Meta-Tags (excerpt/Cards bleiben voll). Live 266→156.
- **`/llms.txt`** (`901e657`): `app/llms.txt/route.ts`, llmstxt.org-Map (publizierte Artikel + Bundesländer + Kontakt), auto-aktuell (revalidate 1h).
- **Pillar Hub→Spoke** (`d75cf9a`): Money-Page `was-kostet-eine-website` verlinkt jetzt 11 statt 3 Spokes (bespoke Seite, Links manuell) + 2 Gedankenstriche „–" im Prosatext gefixt.
- **Indexierungs-Kill-Switch im Tageslauf** (`c647607`, #10): `run-daily.sh` ruft `check_indexation` vor der Pipeline (nicht-blockierend).
- **Skip-Navigation** (`cfcc6fe`, WCAG 2.4.1): „Zum Inhalt springen" im Root-Layout, sr-only bis Fokus, Ziel `main#main-content`. JS-verifiziert.
- **Distribution (#5) VORBEREITET, NICHT gepostet:** `docs/distribution-plan.md` (canonical-sicherer Medium-Import, LinkedIn-Entwurf, echter Reddit-Ansatz). Öffentliches Posten braucht User-Freigabe + Login.
- **Kosten-Cluster:** Spoke↔Spoke-Verlinkung komplett (Auto-Linker); fehlende Kosten-Spokes sind bereits als `todo` in queue.yaml → Tageslauf produziert sie. Kein Massen-Generieren.
- Stand: 153 Tests grün, Build grün, alle live-verifiziert (1 H1 in Prod, Kurztitel, llms.txt, Skip-Link). **Fabriziertes 4.8/315-Schema unangetastet (Userwunsch).**
- **OG-Bug Money-Page gefixt** (`4cde3f7`): `/tipps/was-kostet-eine-website` (bespoke) setzte nur title+description → erbte Root-OG (Startseiten-og:title/url/image). Jetzt eigenes og:title/url/image + self-canonical (verifiziert). Betraf JEDES Social-Sharing der Money-Page + Medium-Import.
- **Distribution gestartet (Medium):** Login = **rabbit.red.media@gmail.com** (verifiziert, [[reference_redrabbit_medium_account]]). Import via `medium.com/p/import` getestet → erzeugte Entwurf `medium.com/p/08c1450d849f/edit` mit FALSCHEM Inhalt (Startseiten-OG, vor dem OG-Fix). **Dieser Entwurf ist falsch → nach OG-Deploy NEU importieren, alten Entwurf verwerfen.** Veröffentlichen erst nach User-Freigabe. Plan: `docs/distribution-plan.md`.
- **OFFEN — Bilder verbessern (User: „das ist furchtbar"):** die Cost-Cluster-Artikelbilder sind off-brand (Vollrot-Panel + Clipart-3D-Grafik), NICHT der Marken-Stil (cinematic Foto + handschriftlicher Hook, [[feedback_bildstil_cinematic_hook_redrabbit]]). Neu generieren via Gemini-Browser, Pillar zuerst als Stil-Check, versionierte Dateinamen (Vercel-Cache!). Scope/Stil mit User abstimmen.
- **WARNUNG Session-Ende:** beim Beenden liefen launchd-Prozesse (run-daily `--next --emit` + run-media-check). Nächste Session ZUERST `git fetch` + `git log` prüfen: falls run-daily einen Draft committet aber wegen Divergenz nicht pushen konnte (lokaler Commit ahead/diverged), per `git pull --rebase` reconciliieren.

## Stand 2026-06-11 (Teil 10) — Qualitäts-Scan (Punkt 4) fertig + review-it GO (main `e5f1d4a`)

ZUERST `NEXT_SESSION_CONTENT_ENGINE_V2.md` + `docs/runbooks/quality-scan.md`.

- **Punkt 4 (To-do-Liste A4 / Plan §15) KOMPLETT:** vier resiliente Qualitäts-Scanner (links/schema/geo/a11y), additiv, graziös degradierend → gitignored SoT `content-engine/.quality-report.json` → read-only Sektion "Qualitäts-Scan" im Verbesserungen-Tab. `npm run quality:scan [-- --quick|--geo|--a11y|--only=|--limit=|--base=]`. lychee installiert (brew, akzeptiert 403/429=Bot-Sperre), foglift-scan=devDep (gratis, kein Key, rate-limited ~8 URLs/Lauf→degradiert, liefert "Multiple H1/Title too long"-Befunde), pa11y opt-in (`npm i -D pa11y`, Chromium=Ballast). 143 Tests grün, Build grün, Browser verifiziert.
- **WICHTIGE LEHRE: schema-dts (Plan-Wunsch) VERWORFEN** — `WithContext<BlogPosting>`-Typisierung OOM-crasht den `next build`-Type-Check (2GB-Heap, SIGABRT nach "Compiled successfully"). Schema-Sicherheit jetzt via Runtime-Scanner gegen die deployte Seite. Auch: `next build | tail` verschluckt den Exit-Code (pipefail nötig). Details [[handoff_2026_06_11_redrabbit_phase2_komplett]] + LESSONS_LEARNED Teil 9.
- review-it (3 Agenten): GO, kein CRITICAL/MAJOR-Blocker; alle Befunde gefixt (`e5f1d4a`): O(n²)-Read, scanSchema-Timer-Leak, a11y-Teildaten-Ehrlichkeit, Aggregation→lib, --base/Slug-Härtung. Log `docs/reviews/quality-scan-2026-06-11.md`.
- NÄCHSTER Punkt: To-do #5 Distribution (braucht User-Freigaben) ODER #3 Pillar+Spokes. Phase 4 (headless Medien produktiv) bleibt offen (Notebooks unter t.uhlir@immo.red, siehe unten).

## Stand 2026-06-11 (Teil 9 / Session-Ende 2) — Phase 3 fertig, Phase 4 headless bewiesen (main `fa4d639`)

ZUERST `NEXT_SESSION_CONTENT_ENGINE_V2.md` lesen (copy-paste-Prompt) + `docs/runbooks/notebooklm-headless.md`.

- **Phase 3 KOMPLETT abgeschlossen + deployed:** Alle On-Page-Audit-Befunde geschlossen (Ø-Score **100**): internal_links 19→0 (bidirektionale Cluster-Verlinkung, siehe Teil 7/8); year_in_title via "2026" in 2 Titeln (5-Seiten, 10-Fehler) + `evergreen:true`-Opt-out (Grafikdesign-vs-UX) im Audit (`onpage.ts` + `frontmatter.ts`); key_takeaways-Block ergänzt (10-Seiten). Auto-Verlinkung verifiziert: der Live-Tageslauf propagierte meine Titel-Änderung selbst in alle Anker.
- **Phase 4 (Medien headless) — Mechanik BEWIESEN, noch nicht produktiv verdrahtet:** Der bestehende `notebooklm-mcp@2.0.0` erzeugt+lädt Podcasts end-to-end headless (`generate_audio`→`get_audio_status`(ready)→`download_audio` → echte 40-MB-.m4a), ABER NUR als **t.uhlir@immo.red (BEZAHLT)** eingeloggt. **Alle früheren "chat input/more-menu not found"-Fehler = falsches Konto (MCP hing am Gratis-/LinkedIn-Konto), NICHT veraltete Selektoren/kaputtes Werkzeug.** YouTube-Spam-Schutz `containsSyntheticMedia` live (`youtube_upload.py`, default true). Runbook `docs/runbooks/notebooklm-headless.md` (Symptom→Ursache, Patch-Prozedur, Browser-Klick-Fallback). MCP wrappt nur Audio; NotebookLM kann Video inzwischen NATIV ("Videoübersicht"), aber nicht über diesen MCP.
- **OFFEN für Phase-4-Produktiv:** Cluster-Notebooks müssen unter t.uhlir@immo.red liegen. Kosten-Pilot `3eccf288` ist eine WAISE auf thomas.uhlir@gmail.com (Versehen) → neu anlegen. Dann headless-Podcast in run-media verdrahten. Siehe [[reference_notebooklm_account_redrabbit]] (korrigiert).
- **Operatives:** launchd-RACE real (run-daily 02:00 + mediachecker alle 30 Min committen/pushen ins selbe Repo) → IMMER `git fetch` vor Push, bei Divergenz `git pull --rebase`. `run-daily.sh` committet jetzt auch `vault.md` (Backflow lief sonst uncommittet). Offene Medien-Marker: warum-sind-manche-webdesign-agenturen (freigegeben, wartet auf Medien-Lauf), wie-viel-kostet-...-unterhalt.

## Stand 2026-06-11 (Teil 7) — Phase 3 #1-Hebel: interne Cluster-Verlinkung LIVE (main `0e3717e`)

- **Bidirektionale interne Cluster-Verlinkung gebaut + deployed.** `scripts/content-engine/lib/clusterLinks.ts` (deterministisch, spiegelt `getRelatedPosts`-Scoring Kategorie+3/Cluster+2/Tag+1, nur publizierte Artikel, chirurgische Marker-basierte Block-Injektion `{/* cluster-links:start/end */}`, single-run-idempotent, Frontmatter byte-genau, Anker MDX-escaped, Slug-Guard, Block ans Body-Ende). Block-Titel "Das könnte Sie auch interessieren" mit `/tipps/{slug}`-Links.
- **`npm run cluster:relink`** (Backfill, idempotent) hat 17 publizierte Artikel verlinkt. **run-media-Hook**: neue Artikel + Cluster-Nachbarn werden beim Publish im selben Commit verlinkt (`git add content/blog/*.mdx`).
- **Ergebnis verifiziert:** On-Page-internal_links-Befund von 19 auf **0** Artikel, Dashboard-Ø-Score **96**, alle 15 Link-Ziele 200 (keine 404), im Browser an MDX-Artikeln + hartcodierter Seite + Dashboard bestätigt. review-it (3 Agenten): 3 MAJOR (MDX-Injection, tote+fragile Footer-Regex) + Minors alle gefixt; Decision-Log `docs/reviews/cluster-links-2026-06-11.md`.
- **3 Blindspots gelöst:** (1) `was-kostet-eine-website` = hartcodierte Route `app/tipps/{slug}/page.tsx` (MDX-Body tot) → manuell verlinkt + aus Backfill/Audit ausgeschlossen [[siehe LESSONS Teil 7]]; (2) On-Page-Audit überspringt jetzt Drafts + hartcodierte Slugs; (3) Idempotenz/Whitespace gefixt.
- **OFFENE Phase-3-Reste (nächster Schritt):** On-Page-Audit zeigt nur noch `year_in_title:3` (3 Artikel ohne aktuelles Jahr im Titel) + `key_takeaways:1`. Dann Kosten-Cluster depth-first (Pillar+Spokes), Distribution, Ranking-Beweis = GATE zur Breite. NEXT_SESSION_CONTENT_ENGINE_V2.md hat die volle Liste.

## Stand 2026-06-11 (Teil 6) — Tracking, Playbook/Audit, Erinnerung, NotebookLM-Pilot (main `18c3af3`)

ZUERST `NEXT_SESSION_CONTENT_ENGINE_V2.md` lesen — enthält den copy-paste-Prompt + die detaillierte To-do-Liste.

- **Tracking komplett (deployed):** `generate_lead` feuert jetzt auf ALLEN Formularen (vorher nur /kontakt → eine echte Anfrage war unerfasst). Neu: `contact_form_open` (CTA-Intent, `ContactFormProvider`), `scroll_depth` + `outbound_click` (global via `components/AnalyticsListener.tsx` im Layout). Analytics-Tab: Karten "Verhalten" + "Kontakt-Interesse pro Seite" (`lib/dashboard/google.ts`). GA4 hat Latenz; vergangene Submits erscheinen nicht rückwirkend. **OFFEN (manuell): `generate_lead` in GA4 als Schlüsselereignis markieren.**
- **Methodik-Schicht:** `content-engine/knowledge/playbook.md` (angewandte SEO/GEO/Stil-Regeln, SoT, vom Finalizer gelesen) + On-Page-Audit `lib/dashboard/onpage.ts`. Neuer Dashboard-Tab **"Verbesserungen"** (`/dashboard/verbesserungen`): schwächste-Artikel-zuerst, häufigste Lücken, Methodik-Hebel mit Verifizierungs-Status (allgemein vs. an-unseren-Daten — letzteres braucht Traffic). **Größter Befund: 19/21 Artikel haben <2 interne Links = #1-Hebel → nächster Schritt bidirektionale Cluster-Verlinkung.**
- **Wochen-Erinnerung (gegen Pre-Mortem #5):** `npm run remind` + launchd `com.redrabbit.reminder` (Mo 08:30, GELADEN) → Mail mit Interview-Lücken + "Methodik destillieren" + größter On-Page-Lücke.
- **NotebookLM-Kosten-Pilot LIVE:** Konto t.uhlir@immo.red (MCP via `re_auth` umgestellt). Notebook `3eccf288-a944-4d2d-95e4-dcc71358e5ef` "Red Rabbit – Kosten" mit 12 Cluster-1-Artikeln befüllt, geerdete zitierte Antwort verifiziert (KMU 1.500-6.000€, Starter ab 790€, Stundensatz 80-150€), im Manifest + Dashboard. **METHODE (wichtig): headless-MCP add_source/ask_question scheitert ("chat input not found"), stattdessen UI-Bulk-Paste (Websites → alle URLs auf einmal → Einfügen, Import async) + In-App-Chat + `npm run notebooklm:record`.**
- **Dashboard hat jetzt 5 Tabs:** Überblick, Search Console, Analytics, Wissen & Moat, Verbesserungen. Dev-Tab-Lag = Erst-Kompilierung, Launcher wärmt vor.
- **Desktop-Icon "Red Rabbit Dashboard"** (`scripts/dashboard-launcher.command` + Desktop): öffnet `/dashboard`, startet Server + wärmt alle Tabs vor.
- **NÄCHSTER SCHRITT (empfohlen): Phase 3 — bidirektionale interne Cluster-Verlinkung** (höchster Hebel, deterministisch, kein User-Input). Dann Kosten-Cluster depth-first + Distribution + Ranking-Beweis (GATE zur Breite). Vollständige Liste in NEXT_SESSION.

## Stand 2026-06-10 (Teil 5) — Phase 2 Moat-Fundament LIVE (deployed, main `e825e3a`)

- **Wissens-Vault (§3, additiv):** `scripts/content-engine/lib/vault.ts` (parse/search/isStale/format/appendFacts) + `content-engine/knowledge/vault.md` (REPO-versioniert = Wissens-SoT, NICHT gitignored). 21 Fakten aus publizierten Artikeln geseedet (`npm run vault:backfill`). Frische-TTL (`recheck_nach`, default +180 Tage): veraltete Fakten sind nicht zitierbar bis neu bestätigt. **Pipeline additiv verdrahtet:** `researcherPrompt` bekommt Vault-Treffer (zuerst Vault, dann Web für Lücken); `--emit` schreibt verifizierte `research.facts` zurück in den Vault (dedup, try/catch-umhüllt → bricht Publish nie ab). 14 Vault-Unit-Tests.
- **/interview-me-Skill** (`~/.claude/skills/interview-me/SKILL.md`): interviewt Thomas eine Frage nach der anderen, schreibt echte Meinungen guardrail-konform in `content-engine/opinions/pool.md`. `opinion_missing`-Flag erzeugt jetzt einen handlungsfähigen Hinweis in der Review-Mail (§12); `loadOpinion` matcht Thema-ID ODER Cluster (für gebündelte Cluster-Sitzungen).
- **Dashboard-Tab "Wissen & Moat"** (`/dashboard/wissen`, `lib/dashboard/knowledge.ts`): Vault-Fakten/stale, Meinungs-Coverage pro Cluster, **Interview-Backlog mit copy-paste `/interview-me <n>`-Befehlen**, Recheck-fällig-Liste, NotebookLM-Status. Apple-Stil, read-only über SoT. Browser-verifiziert (alle 7 Cluster, Badges gedeckt/Meinung-fehlt). 5 Tests (parseOpinionClusters).
- **NotebookLM Cluster-Anreicherung:** `npm run notebooklm:plan` berechnet offene Quell-URLs pro Cluster + Manifest, `notebooklm:record` schreibt Ergebnis zurück. **Node kann MCP nicht aufrufen** → Agent führt `add_notebook`/`add_source` über MCP-Tools aus. **OFFEN: Live-Pilot Kosten-Cluster braucht EINMALIGEN NotebookLM-Login** (`mcp__notebooklm__setup_auth`, get_health war `authenticated:false`, öffnet Browser, Nutzer-Aktion).
- **Desktop-Icon "Red Rabbit Dashboard"** (`scripts/dashboard-launcher.command` + Desktop-Kopie): öffnet `localhost:9000/dashboard`, startet Dev-Server falls nötig (nvm-PATH hardcoded, sonst node nicht gefunden im Finder).
- **Verifiziert:** tsc grün, **87/87 Tests**, `next build` grün, alle 4 Dashboard-Tabs HTTP 200 + Browser-Visualtest des Wissen-Tabs. review-it (3 Agenten) lief auf `e825e3a`. **NÄCHSTE SCHRITTE:** NotebookLM-Login + Pilot-Anreicherung Kosten; Phase 3 (Kosten-Cluster depth-first + gebündelte /interview-me-Sitzung Cluster 1 + Distribution + Ranking-Beweis vor Breite).

## Stand 2026-06-10 (Teil 4) — Dashboard GSC+GA4-Tabs LIVE (deployed), Phase-0-Deploy verifiziert

- **Phase-0-Deploy war erfolgreich + ist live** (vorige Session war fälschlich unsicher): Quellen-Sektion + JSON-LD citation rendern auf allen Pipeline-Artikeln (live geprüft an `wie-setzen-sich-die-kosten...`). Die "Deploy hängt"-Sorge kam nur vom Test des Slugs `was-kostet-eine-website`, der eine hartkodierte Eigenroute `app/tipps/was-kostet-eine-website/page.tsx` hat (nutzt ArticleSources NICHT). Siehe LESSONS_LEARNED Teil 4.
- **Dashboard GSC+GA4-Tabs gebaut + deployed** (main `cd3ca56`): geteiltes `app/dashboard/layout.tsx` (Tab-Nav Überblick/Search Console/Analytics + Prod-Guard für alle Unterrouten), `lib/dashboard/google.ts` (GSC+GA4 via OAuth-Token, typisierte unconfigured/error-Degradierung, safeErrorMessage redigiert Token), `lib/dashboard/format.ts` (de-AT), `app/dashboard/ui.tsx` (geteilte Light-Mode-Bausteine + RangeSwitch/DASH_RANGES/parseRange), `search/page.tsx` (KPIs, **Striking-Distance Pos 8–20**, Top-Queries/Seiten, 7/28/90-Tage), `analytics/page.tsx` (KPIs, Top-Seiten, Kanäle). Light Mode, Marke Rot, tabular-nums. In Prod via notFound versteckt; lokal `npm run dev -- --port 9000` → /dashboard.
- **Verifiziert:** Build grün, 48/48 Tests, alle 3 Tabs HTTP 200 mit echten Daten (GSC ~4.800 Impr./Pos ~45 + gefüllte Striking-Distance; GA4 29 Nutzer/68 Sitzungen/51,5% Engagement). review-it (3 Agenten) GO, Härtungen angewandt: `docs/reviews/dashboard-gsc-ga4-2026-06-10.md`. **Browser-Visualtest auf localhost wurde vom Chrome-Permission-Dialog 2x abgelehnt — offen, falls User localhost freigibt.**
- **Apple-Redesign + Chrome-Fix (main `6499a0e`, deployed):** Dashboard im Apple/macOS-Stil — linke Sidebar (`DashboardNav`), Off-White `#f5f5f7`, SF-Pro-System-Font, `rounded-2xl`-Karten + Haarlinien, Apple-Segmented-Control. Marketing-Header/-Footer auf `/dashboard` ausgeblendet (Header.tsx/Footer.tsx `usePathname().startsWith('/dashboard')` → null). Browser-Visualtest aller 3 Tabs gemacht (frischer Tab nötig, siehe LESSONS Teil 4). GitHub-Trend-Empfehlung für künftige Charts: **Tremor**.
- **Kill-Switch LIVE (main `8b8b8f4`):** `check_indexation.ts` (npm `engine:indexation`) misst Indexierung via GSC-URL-Inspection (Property MIT `/`!), schreibt `.indexation.json` + `.kill-switch.json` (gitignored). `pipeline.ts` bricht bei aktivem Switch VOR `--emit` ab. Health-Karte zeigt Kill-Switch- + Indexierungs-Signal (aktuell 14/18=78%, inaktiv). 19 Health-Unit-Tests. End-to-end + Browser-Alarm verifiziert. OFFEN: check_indexation in launchd-Tageslauf vor `npm run engine` einhängen.
- **Verlaufs-Sparklines (main `07e7a93`):** Klicks/Impressionen über Zeit im Search-Tab (`getSearchConsoleTimeseries` + dependency-freie SVG-`Sparkline`). Browser-verifiziert.
- **Conversion-Events LIVE (main `45f4203`):** GA4 `generate_lead` feuert in `ContactFormHighEnd.tsx` (page_path → Anfragen pro Artikel); GA4-Tab zeigt "Anfragen"-KPI + "Anfragen pro Seite". `sendGAEvent` von @next/third-parties, try/catch-umhüllt. Daten kommen mit echten Submits.
- **PHASE-1-MESS-FUNDAMENT KOMPLETT** (GSC/GA4-Tabs, Striking-Distance, Verlauf, Gesundheits-/Penalty-/Totmann-Alarm, Kill-Switch, Conversions). **NÄCHSTE SCHRITTE:** Phase 2 (/interview-me + Vault) → Phase 3 Pilot-Cluster Kosten beweisen. Optional: check_indexation in launchd einhängen; Tremor-Charts.

## Stand 2026-06-10 (Teil 3) — Content-Engine v2: Phase 0 deployed, Phase 1 Mess-Fundament steht

- **Verbindlicher Plan:** `docs/superpowers/plans/2026-06-09-content-engine-v2-REVISED.md` (Abschn. 0-16). Schnelleinstieg: `NEXT_SESSION_CONTENT_ENGINE_V2.md`.
- **Phase 0 (deployed):** DE-Alt-Texte, sichtbare Quellen (ArticleSources + JSON-LD citation), ausgehende Quell-Links (finalizer), `cluster`-Feld 1-7 (Quelle queue.yaml) + category-Normalisierung (21 Artikel), getRelatedPosts +2-Cluster + page.tsx daran, gate/review-notify Risk = cluster 6 + Wort-Fallback, http(s)-Schutz Quellen-URLs. Review: `docs/reviews/phase0-content-engine-v2-2026-06-10.md`. Prompt-Caching verworfen (claude -p cached nicht über getrennte Prozesse).
- **Phase 1 (begonnen):** Dashboard `app/dashboard` + `lib/dashboard/overview.ts` (Überblick, noindex, in Prod via notFound versteckt ausser DASHBOARD_ENABLED). **GSC+GA4 OAuth-Anbindung funktioniert E2E** (Besitzer-Konto thomas.uhlir@gmail.com, weil Personal-Gmail keine Service-Accounts als GSC-Nutzer erlaubt). Creds in `~/.config/redrabbit-dashboard/` (oauth_client.json, token.json) + `.env.local` (GA4_PROPERTY_ID=519842891 = die LIVE-Property von mehreren). Skripte: `scripts/content-engine/dashboard/google_auth.ts`, `verify_google.ts`.
- **NÄCHSTE SCHRITTE:** GSC- + GA4-Tabs bauen → Striking-Distance → Penalty/Totmann-Alarm → Kill-Switch → Conversion-Events. Dann Phase 2 (/interview-me + Vault), Phase 3 Pilot-Cluster Kosten beweisen, erst dann breit.
- **KRITISCH:** Fabriziertes AggregateRating (315 Reviews) bleibt auf Userwunsch GEGEN dokumentierte Empfehlung (Plan §1). OFFEN: Slug-Hygiene (37 truncated + 301), YouTube-Warndreieck prüfen.

## Stand 2026-06-10 (Teil 2) — Substack live, Steuer/BFSG/Unterhalt bebildert, Pipeline-Fixes

- **Substack: beide Posts live mit Video** (#313 + Kosten), Rubrik "Red Rabbit Websiten infos".
- **Researcher-Timeout gefixt** (`pipeline.ts`, 320->600s u.a.) -> Tageslauf stirbt nicht mehr an
  langsamer Web-Recherche. Heutiger Artikel "wie-viel-kostet-eine-website-im-unterhalt" lief durch,
  Review-Mail kam, vom User freigegeben+published.
- **run-media zukunftssicher**: Video wird jetzt selbst-gehostet (kein YouTube-Broken-Link mehr bei
  kuenftigen Artikeln). `mdxMedia.embedVideo` + `run-media.ts` (MP4+ffmpeg-Poster nach public/videos).
- **Bilder ergaenzt (gratis via Gemini, cinematic+Hook):** Steuer (#12) + BFSG (#266) je 3 Inline-Bilder;
  wie-viel-kostet-im-unterhalt: Hero (war kaputt/400) + 3 Inline-Bilder. **Alle 5 aktuellen Artikel
  haben jetzt Hero + 3 Inline-Bilder, live verifiziert (Optimizer 200).**
- **OFFEN:** (1) `sudo pmset repeat wakeorpoweron MTWRFSU 07:50:00` (nur User; aktuell KEIN Wake-Plan
  gesetzt -> 07:53-Slot wartet bei Schlaf auf 3h-Catch-up). (2) wie-viel-kostet-im-unterhalt hat noch
  KEINEN Podcast/Video (Medien-Schritt via `npm run media`, NotebookLM-Browser; Codex-Bilder ab 11.06.).
  (3) Steuer/BFSG sind weiterhin `status: draft` (nur Text+Bilder, keine Freigabe/Medien).
- Lehren: siehe LESSONS_LEARNED 2026-06-10 Teil 2.

## Stand 2026-06-10 — Beide Artikel: Video selbst-gehostet + je 3 Inline-Bilder (live verifiziert)

Behoben (User meldete: fehlende Bilder + Video als Broken Link auf #313 + Kosten):
- **Video selbst-gehostet** statt YouTube-Embed (war live 404 + bei content-gefiltertem Browser geblockt).
  MP4 + Poster jetzt unter `public/videos/`, `VideoEmbed` auf `src`+`poster` (Commit `05cf3f9`).
- **Je 3 cinematic Inline-Bilder** pro Artikel ergaenzt (vorher nur Hero), Stil = Hero (warm-cine,
  Protagonist/in Oberkoerper als roter Faden), platziert nach passenden `##` Sektionen, deutsche
  Alt-Texte. Gratis via Gemini (Nano Banana / Pro), Codex-Credits leer bis 11.06. (Commit `a3c7869`).
- **Live visuell verifiziert** (per JS-scrollIntoView, da Lenis-Smooth-Scroll synthetische Scrolls
  ignoriert): Inline-Bilder rendern, Video spielt als HTML5-Player mit Poster, kein YouTube-iframe mehr.
  Alle Assets HTTP 200, code-reviewer ohne Findings. Details/Fallen siehe LESSONS_LEARNED 2026-06-10.
- OFFEN bleibt weiterhin nur: **Substack-Posts** fuer beide Artikel (siehe Abschnitt 2026-06-09).

## Stand 2026-06-09 (spaet) — Zwei Artikel komplett vertont/bebildert, nur Substack offen

- **Zwei Artikel KOMPLETT live + verifiziert** (Hero-Bild + Podcast DE + YouTube PUBLIC, eingebettet):
  - `warum-ist-eine-website-mit-dem-tag-des-live` (#313): YouTube `youtu.be/txty09JwV4E`, Hook-Bild "online. und jetzt?".
  - `wie-setzen-sich-die-kosten-fuer-eine-website-zusammen`: YouTube `youtu.be/wbSf4vf8B4E`, Hook-Bild "was kostet das wirklich?".
  - Schluss-Mails fuer beide raus (api/published-notify, an t.uhlir@immo.red). Marker entfernt.
- **NUR OFFEN: Substack-Posts.** #313-Entwurf fertig+gespeichert (`redrabbitlab.substack.com/publish/post/201359416`,
  Rubrik gesetzt, Titel/Untertitel/Body+Backlink), aber "Weiter"-Button advancierte nicht ueber die
  Browser-Extension (der echte Button ist `ref_52` "Next", nicht das Label `ref_16`). Kosten-Post noch
  nicht begonnen. Details + Plan: Auto-Memory `handoff_2026_06_09_zwei_artikel_medien_substack_offen`.
- **Neuer Bildstil = Standard:** cinematic Foto + handschriftlicher Hook (Person nur Oberkoerper, aktiv,
  themenpassend); KEINE Clipart-Icons, kein Vollrot, keine hellen Stockfotos. Erzeugt **gratis via
  Gemini-Browser (Nano Banana 2)**, weil **Codex-Bild-Credits leer bis 11.06.2026 11:00**.

## Stand 2026-06-09 — Pipeline-Resilienz + Tooling (Graphify/Obsidian)

- **Content-Engine haengte tagelang (Artikel #262, #313):** Ursache war `runClaude`-Retry ohne Delay bei
  ETIMEDOUT. **GEFIXT** (`scripts/content-engine/lib/roles.ts`): 4 Versuche, exponentielles Backoff
  15s/30s/60s, `Atomics.wait`-Sleep. Tests 48/48 gruen. Details in LESSONS_LEARNED.md.
- **#262 (DSGVO) = `skip`** in `content-engine/topics/status.json` (Researcher von Safety-Filter blockiert).
- **#313 fertig:** "Warum ist eine Website mit dem Tag des Live-Gangs nicht fertig? [Oesterreich 2026]"
  (1865 Woerter, 4 Quellen, status `review`, als Draft live, Review-Mail raus an t.uhlir@immo.red).
  OFFEN: User-Freigabe -> dann Medien (Browser noetig).
- **Daily-Slot jetzt 07:53** (frueher 09:17) -> Review-Mail ~08:10. Neuer launchd-Job
  `com.redrabbit.mediachecker` (alle 30 Min): erkennt freigegebene Artikel ohne Medien, generiert Bilder
  headless, schickt macOS-Notification fuer Browser-Schritt. Triggert max 1x/Tag, nur fuer HEUTIGEN Marker.
- **Graphify installiert** (Code-Wissens-Graph, 100% lokal, 0 API): `graphify-out/graph.json` (492 Nodes).
  Auto-Update via `.git/hooks/post-commit` (code-only). Abfrage: `graphify query/path/explain`. NIE
  `--backend claude`/`label` (= API-Kosten). Skill global in `~/.claude/skills/graphify/`.
- **Obsidian-Tooling:** Obsidian v1.12.7, `~/claude-obsidian` (Vault-Repo geklont), kepano/obsidian-skills
  (5 Skills) projekt-lokal in `.agents/` (gitignored), `skills-lock.json` committed.

## Content-Engine 2026-06-06 (Nacht) — VOLLER autonomer Durchlauf bewiesen (#105)

- **Ende-zu-Ende-Durchlauf live + verifiziert** mit Artikel #105
  (`wie-veraendern-ki-technologien-die-erstellung-von-modernen-websites`): Pipeline -> push ->
  Review-Mail (Mail 1) -> User-Freigabe -> `/api/approve` setzt `published` + legt still
  Medien-Marker `content-engine/.media-requests/<slug>.json` an -> Podcast+Video via NotebookLM
  (Browser, t.uhlir) -> `run-media`: Podcast eingebettet + Video PUBLIC auf YouTube
  (youtu.be/rXnZF19dwMc) + eingebettet + push -> Substack veroeffentlicht mit Video
  (redrabbitlab.substack.com/p/wie-verandern-ki-technologien-die) -> Schluss-Mail (Mail 2) mit allen Links.
- **Neue Werkzeuge (getestet, deployed):** `/api/approve` legt Medien-Marker an (2-Mail-Flow, Mail 2
  verworfen); `/api/media-trigger` (signierter Marker-Link, manueller Fallback);
  `scripts/content-engine/media/run-media.ts` (npm `media`) = deterministischer Medien-Tail nach
  NotebookLM-Downloads; `mdxMedia.ts` (embedPodcast/embedVideo/parseYoutubeId, 8 Tests); `pending.ts`
  (npm `media:pending`). 48 vitest + tsc + Build gruen.
- **VideoEmbed abgehaertet:** Lite-Embed ("use client", Poster+Klick, Poster hide-on-error,
  youtu.be-Fallback-Link). Grund: Client-Blocker (YouTube-Domains in manchem Chrome geblockt).
- **Substack-Veroeffentlichen (Browser): Rubrik ist PFLICHT;** YouTube nur per Paste auf leerer
  Zeile; Erst-Publish mit Video haengt -> Text publizieren, Video per Aktualisieren nachziehen.
- **Offen:** unbeaufsichtigter recurring Medien-Trigger (braucht geplante Browser-Sitzung,
  NotebookLM/Substack haben keine API); `sudo pmset repeat wakeorpoweron MTWRFSU 09:15:00` (User);
  Bild-Stil verfeinern. Tagesautomatik launchd scharf (09:17 + 3h-Catch-up, Mac muss an sein).

## Content-Engine 2026-06-05 Abend (autonomer Kern + YouTube headless LIVE)

- **Tagesautomatik gefixt + bewiesen:** PATH-Bug behoben (`run-daily.sh` setzt nvm-default-bin +
  homebrew in PATH; launchd hatte `spawnSync claude ENOENT`). Engine erzeugte 13:36 selbst
  Artikel #53, gepusht/deployt/Review-Mail; User per Mail freigegeben -> `/api/approve` setzte
  `status: published` (Commit `d57b7a8`) + IndexNow. Komplett autonom.
- **YouTube Data-API headless KOMPLETT** (Konto rabbit.red.media@gmail.com, Kanal "Red Rabbit Lab"
  `UC6hInJDtZeD8YSOwuvV60yA`, GCP-Projekt `blissful-answer-468100-v3`, API v3 an, Desktop-OAuth,
  Consent veroeffentlicht). Secrets in `~/.config/redrabbit-youtube/{client_secret.json,token.json}`
  (NIE committen; Scopes youtube.upload + youtube). Skripte `scripts/content-engine/upload/`.
  Wartungsvertrag-Video public + eingebettet: https://youtu.be/f8QS2zGI-K8 (Komponente `VideoEmbed`).
  Kuenftig direkt `--privacy public`.
- **Final-Email** `/api/published-notify` (`buildPublishedEmail` in `lib/reviewEmail.ts`) live.
- **Substack** (keine API): Beitrag via Browser gebaut (Text+Backlink), User publizierte (Post
  200749827). Kein natives Audio/Titelbild (file_upload blockt lokale Datei->Web; User zieht rein).
- **Naechstes:** #53-Medienpaket; Approve-Flow auf Text-Stage umbauen (User will: Text freigeben ->
  Engine macht Medien+postet+Info-Mail); pmset Selbst-Wecken; Bild-Stil. Details:
  `NEXT_SESSION_CONTENT_ENGINE.md`.
- **Tool-Grenzen:** file_upload nimmt keine lokalen Pfade (kein Browser-Datei-Upload). accounts.
  google.com fuer Automatik gesperrt. User-sichtbarer Text IMMER echte Umlaute, nie ae/oe/ue.

## Current State

- GitHub repo: `https://github.com/McTomson/webredrabbitmedia`
- Local temporary checkout used in this session: `/private/tmp/webredrabbitmedia-9000`
- Local dev URL used in this session: `http://localhost:9000`
- Framework: Next.js

## Operational Notes

- Use `npm run dev -- --port 9000` to start the site on port `9000`.
- Run `npm install` after a fresh clone before starting the dev server.
- Do not rely on copied `node_modules` from another checkout; it can drift from `package-lock.json`.
- For frontend/UI work, use `frontend-design` and `ui-ux-pro-max` before implementation or review.
- Treat responsive behavior, accessibility basics, and brand-consistent visual quality as required checks for UI changes.
- Admin/API mutation routes use `ADMIN_API_TOKEN` or `INDEXING_API_TOKEN`; send it as `Authorization: Bearer <token>` or `x-api-key`.
- Contact form SMTP configuration must come from environment variables. Never add fallback passwords or credentials to source code.
- Audio proxy is intentionally allowlisted. Current allowed hosts are managed in `lib/api-security.ts`.
- `app/robots.ts` is the canonical robots source. Do not re-add `public/robots.txt`, because it conflicts with the App Router route.
- Remaining audit note: `npm audit --omit=dev` reports 3 moderate `postcss` findings through `next`, currently with no available fix.
- Codex and Claude Code must use the same project memory files: `CLAUDE.md`, `MEMORY.md`, and `LESSONS_LEARNED.md`.
- Responsive verification on 2026-06-02 passed 30 checks across `/`, `/tipps`, `/tipps/website-kosten-oesterreich-2026`, `/kontakt`, and `/webdesign-wien` at 320, 375, 390, 768, 1024, and 1440 widths: no horizontal overflow failures and no broken image URLs.
- Header desktop navigation should start at `lg`, not `md`, because the full nav plus CTAs is too wide for 768px tablets.
- Avoid horizontal reveal animations (`fade-left`/`fade-right`) for AOS content; `AOSWrapper` maps them to `fade-up` to prevent temporary `scrollWidth` overflow.
- Do not add extreme offscreen positioning to `sr-only` content; Tailwind `sr-only` is enough and avoids layout measurement side effects.
- Regional hidden SEO content follows the same rule as homepage SEO content: use `sr-only` without manual `left: -10000px` offsets.
- Keep carousel tracks clipped to a 100% layout width. The About mobile testimonial carousel should translate one 100%-wide slide at a time, not expand the flex track to all slides.
- Footer SEO link rows need explicit wrap/overflow safety because long regional/city link lists can otherwise widen tablet and desktop layouts.
- ESLint is expected to run without warnings. The large `app/[slug]/cluster-content.ts` file has a local unused-vars rule disable because it contains templated regional content functions with intentionally unused placeholders.
- Current npm audit status on 2026-06-02: `next@16.2.7` is the latest registry version, but `npm audit --omit=dev` still reports 3 moderate `postcss` findings through `next` with no available fix.
- Deployment note from 2026-06-02:
  - GitHub `main` was pushed through commit `e442816`.
  - A Vercel production deployment is Ready at `https://webredrabbitmedia-9000.vercel.app`.
  - The first local Vercel upload failed with an API `Internal Server` JSON response during file upload; adding `.vercelignore` reduced upload size and the second deploy completed.
  - The existing custom domain `https://web.redrabbit.media` still points to a different/existing Vercel project and was not aliased to the new `webredrabbitmedia-9000` project, because the new project may not have the existing production environment variables.
  - Before moving `web.redrabbit.media`, identify the existing Vercel project or migrate required env vars (`SMTP_*`, `INDEXNOW_API_KEY`, admin token, analytics IDs as applicable) to the target project.
- Production follow-up on 2026-06-03:
  - `https://web.redrabbit.media` serves the hardened audio-proxy behavior (`http://127.0.0.1...` returns `{"error":"Audio URL is not allowed"}`), so the live domain has at least that new code path.
  - `https://web.redrabbit.media/api/indexnow` still reports `configured:false` and `protected:false`; `INDEXNOW_API_KEY` and admin token are not active in that live runtime.
  - Existing IndexNow key file is present and live: `/245ee51aa890fe982c6cbaa475db1255.txt`.
  - Attempts to manage Vercel env via CLI/API were inconclusive: `vercel env add` returned exit 0 but printed only `Retrieving project…`, `vercel env pull` produced no env file, and Vercel API requests intermittently failed DNS for `api.vercel.com`.
  - Next production step: use Vercel dashboard or a stable API session to set `ADMIN_API_TOKEN` and `INDEXNOW_API_KEY=245ee51aa890fe982c6cbaa475db1255`, then redeploy and verify `/api/indexnow` reports `configured:true` and `protected:true`.

## Content-Engine Projekt (2026-06-03)

- NEU: Autonome "Tipps"-Content-Maschine geplant. Vollständige Spec + Pre-Mortem + 7-Phasen-
  Umsetzungsplan unter `docs/superpowers/` (Branch `docs/content-engine-plan`).
- WICHTIG: Dieser Arbeits-Checkout liegt jetzt unter `~/dev/redrabbit` (frisch von GitHub
  geklont, RAUS aus dem iCloud-Desktop, wo git hängt). Hier weiterarbeiten, nicht im iCloud-Ordner.
- `content-engine/` = datei-basiertes Memory der Maschine (topics/voice/opinions/performance).
- Voice: `content-engine/voice/house.md` v2 aus Thomas' ECHTEN Mails. Register=Sie. HARTE REGEL:
  NIE Gedankenstrich "–" (sein Top-KI-Tell), keine Dreierfiguren/Hochglanz. Die bestehenden
  content/blog-Artikel sind KI-Gloss = nur SEO-Struktur-Vorlage, NICHT Ton-Vorbild.
- Baseline (GSC verifiziert): ~11 Klicks/3 Monate = nahe Null. KPIs: Indexierung→Klicks→Leads.
- Schon vorhanden (nicht neu bauen): GA4 (G-09FNC6THTD), Google Indexing API, IndexNow, SMTP.
- Bild: `codex` CLI `imagegen` (headless, 0€ über ChatGPT-Plus-Limit).
- Offen vor Bau Phase 1/2: Meinungs-Batch vom User, Headless-Spike (Task 0.4), vitest/tsx (0.5).
- Detaillierter Handoff in `~/.claude/projects/-Users-McTomson/memory/project_redrabbit_content_engine.md`.

## Content-Engine Stand (2026-06-04)

- **Engine GEBAUT + DEPLOYED.** Branch `feat/content-engine` (HEAD `3074897`, gepusht). `main` (`6cb905b`)
  hat die 3 Demo-Artikel als Drafts live (noindex). 36 Unit-Tests gruen.
- **Pipeline** (`scripts/content-engine/`): 4-Rollen-Redaktion headless via `claude -p`
  (Researcher web → Quellen-verify → Writer → Editor → Finalizer → Validator + Reparatur),
  `gate.ts` Quality/Risk, `image.ts` Multi-Bild, `lib/*`. Lauf: `tsx scripts/content-engine/pipeline.ts <slug-or-id|--next> [--emit] [--reuse-research] [--no-image]`.
- **3 Artikel live** (Drafts, noindex, je `/tipps/<slug>`): website-wartungsvertrag-sinnvoll (Text+Stil
  approved + photoreal Hero + Sketch-Infografik), website-kosten-steuerlich-absetzbar-oesterreich,
  bfsg-barrierefreiheit-website-pflicht-strafen. Steuer+BFSG haben noch ALTEN Text-Stil + 1 altes Bild.
- **1-Tap-Freigabe LIVE + bewiesen**: `/api/approve` (Token→GitHub-Flip draft→published→IndexNow),
  `/api/review-notify` (admin, sendet via SMTP). Vercel-Env gesetzt: APPROVAL_SECRET, ADMIN_API_TOKEN,
  INDEXNOW_API_KEY, SITE_URL, GITHUB_TOKEN. FEHLT: SMTP-Creds (Ionos-Passwort vom User) fuer Auto-Mail.
- **Bild-Stilsystem (approved):** Hero photoreal (Codex, Mensch, kein Text), Infografik handgezeichneter
  Sketch (SVG, Hand-Fonts), 3 Kontextfotos photoreal. Versionierte Dateinamen (Cache!).
- **OFFEN:** (1) Vercel-Build-Queue war gestaut, neue Wartungsvertrag-Bilder verifizieren sobald live;
  (2) Multi-Bild-Pipeline (gebaut) END-TO-END testen (1 Artikel, 4 Codex-Calls ~8min); (3) Steuer+BFSG
  Text neu (approved Stil) + 5 Bilder; (4) Auto-Mail (SMTP-Passwort); (5) Medien Phase 4 (NotebookLM/
  Substack/YouTube, User in Chrome eingeloggt, 1 Notebook pro Artikel); (6) launchd installieren.

## Content-Engine Stand (2026-06-05) — GROSSER FORTSCHRITT, Medien + Email LIVE

- **Vercel-Stau ENDGUELTIG behoben (Wurzel):** Das Duplikat-Projekt `webredrabbitmedia-9000` war ans
  GLEICHE GitHub-Repo gekoppelt -> jeder Push baute auf dem Hobby-1-Slot-Plan ZWEI Builds, ein haengender
  `-9000`-Build blockierte den Slot 30+ Min. **`-9000` Git-Verbindung im Vercel-Dashboard getrennt.**
  Ab jetzt: `git push origin main` deployt sauber nur das echte Projekt. (Empfehlung: `-9000` ganz loeschen.)
- **Deploy-Weg ab jetzt:** `git push origin main` (Auto-Deploy echtes Projekt). `vercel --prod` (lokaler
  Upload) war Workaround waehrend `-9000` noch dranhing, nicht mehr noetig.
- **main konsolidiert:** war 5 Commits hinter feat -> `git merge -s ours origin/main` (feat-Inhalt behalten)
  + gepusht. main == aktueller Stand (Podcast, 5 Bilder, kein KI-Hinweis) + Engine-Code. feat+main beide
  aktuell. **Daily-Job + Freigabe-Flow brauchen main=aktuell, das ist jetzt so.**
- **Codex-Bildmodell:** codex hat Default `gpt-5.4 -> gpt-5.5` auto-migriert (langsam, 4-8min/Bild, lief in
  260s-Timeout). Fix in `image.ts`: `-m gpt-5.4` gepinnt + Timeout 600s (~2.5min/Bild). `image_gen` lehnt
  `reasoning.effort minimal` AB. Fotos laufen jetzt PARALLEL (`images-only.ts` + Pipeline-Bildstufe).
- **Multi-Bild-Pipeline BEWIESEN + LIVE:** `images-only.ts` (Bildstufe auf bestehenden Artikel anwenden).
  Wartungsvertrag hat 5 Bilder live: Hero-Foto + Sketch-Infografik + 3 Kontextfotos, je unter der richtigen
  H2. **User: Bild-Stil noch nicht final, muss verfeinert werden (spaeter).**
- **Taegliche Review-Email LIVE + ECHT GETESTET:** `/api/review-notify` HTTP 200, Mail real zugestellt.
  **SMTP-Setup: immo.red ist Google Workspace (KEINE App-Passwoerter), darum privates Gmail
  `thomas.uhlir@gmail.com` mit App-Passwort.** Vercel-Env: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587,
  SMTP_USER+SMTP_FROM=thomas.uhlir@gmail.com, SMTP_PASSWORD=<encrypted, in Vercel>, SMTP_TO=t.uhlir@immo.red.
  1-Klick Freigeben/Ablehnen live (`/api/approve` validiert Token, APPROVAL_SECRET gesetzt).
- **KI-Hinweis ENTFERNT (User-Wunsch):** "Dieser Artikel wurde KI-unterstuetzt erstellt und redaktionell
  geprueft." aus allen Artikeln + Pipeline raus (Finalizer haengt ihn nicht mehr an, `ensureSingleDisclosure`
  strippt ihn). BFSG behielt nur den Rechtsberatungs-Hinweis.
- **Podcast LIVE:** NotebookLM-Podcast (22:11 Min, deutsch, "Wann Website-Wartungsvertraege reine Abzocke
  sind") aus SAUBERER Volltext-Quelle (NICHT URL-Import, der zieht Menue/Footer-Muell). m4a -> 96k mono mp3
  (14.4MB, ffmpeg) -> `public/audio/website-wartungsvertrag-sinnvoll-podcast.mp3` -> `<SimpleAudioPlayer>`
  nach H1. Live (HTTP 206). NotebookLM-Notebook-ID `696aae82-321b-4a09-b148-03beeee084bd` (authuser=3,
  Konto thomas.uhlir). Eine Video-Overview wurde evtl. gestartet (im Studio "Website-Wartung... vor 1 Min").
- **Taegliche Automatik INSTALLIERT:** `~/Library/LaunchAgents/com.redrabbit.contentengine.plist` geladen
  (`launchctl list` zeigt com.redrabbit.contentengine). Laeuft `run-daily.sh` (09:17 + 3h Catch-up,
  idempotent 1 Artikel/Tag, naechstes Thema #53). Pausieren: `launchctl unload <plist>`.

### OFFEN fuer naechste Session (User-Vorgaben siehe HANDOFF unten)
1. **Video** zu Ende: NotebookLM Video-Overview herunterladen -> YouTube @RedRabbitLab UNLISTED hochladen
   mit Backlink-Beschreibung -> User prueft -> oeffentlich + auf Artikelseite einbetten.
2. **Substack-Post**: Podcast/Artikel als Episode mit Backlink-Block posten.
3. **BACKLINK-BLOCK** (aus Users YouTube-Vorbild, fuer BEIDE Kanaele ans Ende der Beschreibung):
   `mehr infos unter:` + `https://web.redrabbit.media/tipps/<artikel>` + `https://web.redrabbit.media`
   + `https://redrabbit.media`. Ziel = SEO-Backlinks auf den Artikel.
4. **Automatik-Verlaesslichkeit:** User OK = "nur Computer an, kein Terminal offen noetig" (launchd ist ein
   LaunchAgent, braucht kein Terminal). Naechste Session: `pmset` Selbst-Wecken 09:15 einrichten (Option A,
   nur wenn Mac am Strom). Server (B) nur falls Mac oft ganz aus = bricht 0-Euro-Modell.
5. **Bild-Stil verfeinern** (User nicht 100% zufrieden), dann Bilder neu.
6. **Steuer (#12) + BFSG (#266):** Text approved-Stil + je 5 Bilder (verschoben).
7. **HAUPT-ZIEL naechste Session (User-Wortlaut):** "dass du sowohl auf substack als auch auf youtube den
   artikel hochladen kannst" — End-to-end Upload-Faehigkeit fuer beide Kanaele.

### Infra-Fakten (fuer naechste Session)
- Vercel-Token: `~/Library/Application Support/com.vercel.cli/auth.json`. team_rGF9lfj041ih8UY1IBcLqDHO,
  projectId prj_qspNVCz7YdHRUfjGgnNxrSTsNoNR (webredrabbitmedia, Domain web.redrabbit.media). Hobby=1 Build.
- NotebookLM-MCP NICHT authentifiziert (eigener headless-Browser). Stattdessen User-Chrome (authuser=3).
- Clipboard-Falle: User kopiert auf seinem Mac -> ueberschreibt pbcopy. Vor jedem cmd+v im Browser frisch
  pbcopy machen + per Screenshot pruefen (einmal landete sein App-Passwort im NotebookLM-Feld, geloescht).

## Session-End Checklist

- Update this file with any new stable project context.
- Update `LESSONS_LEARNED.md` with any debugging or setup lessons.
- Keep Codex and Claude Code aligned by recording shared decisions here instead of relying on tool-local chat history.
- Keep notes concise and dated.
- Do not store secrets or credentials here.
