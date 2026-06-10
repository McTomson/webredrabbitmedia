# NEXT SESSION — Content-Engine v2 (Übergabe, Stand 2026-06-10)

ZUERST LESEN. Nahtlos weitermachen, NICHT vom Kurs abweichen. Der verbindliche Plan ist
`docs/superpowers/plans/2026-06-09-content-engine-v2-REVISED.md` (Abschnitte 0 bis 16). Diese
Datei ist nur der Schnelleinstieg.

## Wo wir stehen

Branch `feat/content-engine-v2-phase0` (auf main gemergt + deployed am 2026-06-10).

PHASE 0 fertig + verifiziert (tsc, 48 Tests, `next build`, review-it 3 Agenten = GO):
- Deutsche Alt-Texte statt englischer Prompts (image.ts, images-only.ts), mit Fallback-Kette.
- Quellen sichtbar am Artikelende (components/blog/content/ArticleSources.tsx) + JSON-LD citation.
- Ausgehende Quell-Links Pflicht im Finalizer (roles/finalizer.md).
- `cluster`-Feld (1 bis 7, Quelle queue.yaml) + category auf kanonische Labels normalisiert (21 Artikel).
  pipeline.ts setzt category+cluster sauber. getRelatedPosts: +2 bei gleichem Cluster, page.tsx daran angebunden.
- Risk-Routing robuster (gate.ts + review-notify: cluster 6 + Wort-Fallback). http(s)-Schutz für Quellen-URLs.
- Verworfen verifiziert: Prompt-Caching (claude -p cached nicht über getrennte Prozesse; nur per SDK-Port = destabilisierend; erst messen).
- Review-Log: `docs/reviews/phase0-content-engine-v2-2026-06-10.md`.

PHASE 1 begonnen, Mess-Fundament STEHT + verifiziert:
- Lokales Dashboard `app/dashboard/page.tsx` + `lib/dashboard/overview.ts` (Überblick-Tab: Queue 365, Live-Artikel, Review, Cluster-Tabelle, Medien-Queue, letzter-Lauf). noindex, force-dynamic, in Produktion versteckt (notFound ausser DASHBOARD_ENABLED gesetzt). Lokal: `npm run dev -- --port 9000` → localhost:9000/dashboard.
- GSC + GA4 ANBINDUNG FUNKTIONIERT (end-to-end mit echten Daten geprüft). Personal-Gmail kann keine Service-Accounts als GSC-Nutzer adden → OAuth mit Besitzer-Konto thomas.uhlir@gmail.com (Muster wie YouTube).
  - Skripte: `scripts/content-engine/dashboard/google_auth.ts` (OAuth-Login, RR_NO_OPEN=1 für Automatisierung) + `verify_google.ts` (E2E-Check).
  - Creds AUSSERHALB Repo: `~/.config/redrabbit-dashboard/oauth_client.json` + `token.json` (refresh_token, scopes analytics.readonly + webmasters.readonly). `.env.local` (gitignored): DASHBOARD_OAUTH_CLIENT, DASHBOARD_TOKEN, GSC_SITE_URL=https://web.redrabbit.media, GA4_PROPERTY_ID=519842891.
  - GA4: mehrere Properties existieren, die LIVE ist **519842891** (account 380548873; andere leer). NICHT verwechseln.

## NÄCHSTE SCHRITTE (in dieser Reihenfolge, nicht abweichen)

ERLEDIGT 2026-06-10 (Teil 4, main `52bdfa7`, deployed + verifiziert):
- [x] **1. GSC-Tab + GA4-Tab** — `lib/dashboard/google.ts` (getSearchConsoleData, getAnalyticsData, getVisibilityTrend), `app/dashboard/{layout,ui,DashboardTabs}.tsx` + `search/`, `analytics/`. Light Mode, review-it GO (`docs/reviews/dashboard-gsc-ga4-2026-06-10.md`).
- [x] **2. Striking-Distance-Liste** (Pos 8–20, Impr>=5) im Search-Tab.
- [x] **3. Penalty-/Anomalie + Totmann-Alarm** — `lib/dashboard/health.ts` (rein, 14 Unit-Tests): Pipeline-Dead-Man (Artikel-Alter), Tageslauf-Fehler, GSC-Woche/Woche-Impressionseinbruch, Indexierungs-Lücke. Gesundheits-Karte im Überblick.

- [x] **4. Kill-Switch** — `scripts/content-engine/dashboard/check_indexation.ts` misst Indexierung via GSC-URL-Inspection-API (Property MIT Schrägstrich!), schreibt `content-engine/.indexation.json` + `.kill-switch.json` (beide gitignored). Unter Schwelle (RR_INDEXATION_MIN=0.6, min. 5 Artikel) → Flag aktiv. `pipeline.ts` prüft `readKillSwitch()` VOR `--emit` und bricht sauber ab. Dashboard-Gesundheitskarte zeigt Kill-Switch- + Indexierungs-Signal. `lib/dashboard/health.ts` + 19 Unit-Tests. Aktuell: 14/18 indexiert (78%), Switch inaktiv. **NOCH NICHT verdrahtet: check_indexation.ts in den täglichen launchd-Lauf einhängen (vor `npm run engine`).**

- [x] **5. Conversion-Events** — GA4 `generate_lead` feuert in `ContactFormHighEnd.tsx` bei erfolgreichem Submit (mit page_path → "Anfragen pro Artikel"). Dashboard GA4-Tab: "Anfragen"-KPI + "Anfragen pro Seite"-Karte (`getAnalyticsData` 4. Report, eventName=generate_lead). Aktuell 0 (Event neu, Daten kommen mit echten Submits + GA4-Lag). Optional in GA4 als Conversion markieren (GA4-UI).

PHASE-1-MESS-FUNDAMENT KOMPLETT. OFFEN/optional:
- check_indexation in den launchd-Tageslauf vor `npm run engine` einhängen (Kill-Switch automatisch aktuell halten).
- Tremor-Charts statt der Inline-Sparklines, falls reichere Visualisierung gewünscht.
6. Dann PHASE 2 (Moat): `/interview-me`-Skill → opinions/pool.md (Erinnerung via `opinion_missing`-Gate); Vault + Frische-TTL + additives Retrieval. **Pilot-Cluster = Kosten (1).**
7. Dann PHASE 3: EIN Cluster komplett (Kosten) in die Tiefe + interne Cluster-Verlinkung + GEO-Block + Distribution (Reddit, Source-of-Sources, LinkedIn, Newsletter), messen, BEWEIS abwarten, ERST DANN breit skalieren (Phase 5).

## Verbindliche Entscheidungen (NICHT neu aufrollen)
- 1 Artikel/Tag bleibt. Ziel: GEO UND SERP. Moat = web-verifizierter Vault, additiv (Web-Recherche bleibt).
- Ranking-Band: weiss/hellgrau/etwas-grau, KEIN dunkelgrau/schwarz. KEIN Presse-Outreach (aber Source-of-Sources = Journalisten fragen, ist ok).
- Medien: Podcast + Infografik + Video für jeden Artikel; headless via video-fähigem NotebookLM-MCP geplant; Substack als Draft + Link (kein Auto-Publish); Podcast immer selbst gehostet.
- Bilder künftig primär über Browser (Gemini), Codex als Fallback; Thomas will Bilder nachbessern können (images-only.ts-Basis).
- Werkzeuge beschlossen: mcp-gsc, bestehendes Next.js-GSC-Dashboard als Basis, foglift-scan, Lychee, schema-dts, axe-core/pa11y. ABGELEHNT: n8n, Plausible/Matomo.
- Lead-Mechanik: kein harter In-Artikel-CTA, bestehender dezenter End-CTA reicht.

## KRITISCH / RISIKEN (im Plan dokumentiert)
- **Fabriziertes Bewertungs-Schema (315 Reviews/4,9) bleibt auf Userwunsch GEGEN meine ausdrückliche Empfehlung** (Manual-Action- + UWG-Risiko). Mein Einwand steht in Plan §1. Nicht stillschweigend ausbauen, keine zusätzlichen Fake-Reviews erzeugen.
- Pre-Mortem (Plan §14): wahrscheinlichster Tod = Stille (keine Distribution) und leiser Betriebs-Tod (kein Totmann-Alarm). Deshalb erst EIN Cluster beweisen, dann skalieren.

## OFFEN / gemeldet
- Slug-Hygiene: 37 abgeschnittene Slugs in queue.yaml + ~4 published. Braucht 301-Redirects (next.config.ts redirects() Pattern existiert) + vorsichtige Renames. Separater, ruhiger Schritt.
- YouTube zeigt ein Warndreieck (Status unklar, evtl. abgelaufenes Upload-Token oder Kanal-Hinweis) — noch prüfen.
- Überflüssiger OAuth-Client "redrabbit-dashboard" (156408625286-psdusvbajs...) in GCP angelegt, ungenutzt, kann gelöscht werden (wir nutzen den bestehenden Desktop-Client).
