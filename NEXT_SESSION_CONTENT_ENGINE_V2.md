# NEXT SESSION — Content-Engine v2 (Übergabe, Stand 2026-06-11)

ZUERST LESEN. Nahtlos weitermachen. Verbindlicher Plan: `docs/superpowers/plans/2026-06-09-content-engine-v2-REVISED.md`
(§0-§16). Diese Datei ist der Schnelleinstieg + die detaillierte To-do-Liste.

---

## PROMPT FÜR NÄCHSTE SESSION (copy-paste an Claude)

> Arbeite am Projekt `~/dev/redrabbit` (Red Rabbit Media, Next.js 15 Content-Engine). Lies ZUERST `NEXT_SESSION_CONTENT_ENGINE_V2.md`, `MEMORY.md`, `LESSONS_LEARNED.md` und den verbindlichen Plan `docs/superpowers/plans/2026-06-09-content-engine-v2-REVISED.md`. **Phase 0, 1 und 2 (Moat-Fundament) sind fertig, getestet, deployed.** Konkret live: GSC/GA4-Dashboard mit 5 Tabs (Überblick, Search Console, Analytics, **Wissen & Moat**, **Verbesserungen**); Wissens-Vault (`scripts/content-engine/lib/vault.ts` + `content-engine/knowledge/vault.md`, additives Retrieval im Researcher + Rückfluss bei Publish); `/interview-me`-Skill + `opinion_missing`-Erinnerung in der Review-Mail; Methodik-Playbook (`content-engine/knowledge/playbook.md`, wird vom Finalizer gelesen) + deterministischer On-Page-Audit (`lib/dashboard/onpage.ts`); volles Conversion-/Verhaltens-Tracking (generate_lead auf ALLEN Formularen, contact_form_open, scroll_depth, outbound_click via `components/AnalyticsListener.tsx`); wöchentliche Erinnerungs-Mail (launchd `com.redrabbit.reminder`, Mo 08:30); NotebookLM-Kosten-Pilot live (Notebook mit 12 Artikeln, im Dashboard sichtbar). Dashboard lokal: Desktop-Icon "Red Rabbit Dashboard" ODER `npm run dev -- --port 9000` → `localhost:9000/dashboard` (in Prod via notFound versteckt). **NÄCHSTER SCHRITT (empfohlen, höchster Hebel): Phase 3 — bidirektionale interne Cluster-Verlinkung** (mein On-Page-Audit zeigt: 19/21 Artikel haben <2 interne Links = der #1-Ranking-Hebel, deterministisch baubar ohne User-Input). Danach restliche Phase 3 (Kosten-Cluster depth-first + Distribution + Ranking-Beweis als GATE zur Breite). Details + vollständige To-do-Liste stehen unten in dieser Datei. Arbeite autonom, nutze parallele Agenten + Skills (frontend-design, ui-ux-pro-max bei UI; review-it nach jedem Block), teste IMMER (Build + `npm test`) UND kontrolliere IMMER im Browser (frischer Tab für localhost!), kein Raten — verifizieren. Erst committen/pushen/deployen wenn grün. Light Mode, Apple-Design, keine Emojis, Konversation auf Deutsch, echte Umlaute im User-Content. Bei Fertigstellung benachrichtigen + erklären, wie die Wissensbasis wächst.

> Bewährte Arbeitsregeln: nur EIN Dev-Server auf 9000 (`pkill -f "dev/redrabbit/node_modules/.bin/next"`); `next build` NUR ohne laufenden Dev-Server + nach `rm -rf .next` (sonst .next-Konflikt → EXIT 1); `next build` lintet → KEIN `any` in lib/ (tsc allein fängt das nicht); localhost im Browser nur über FRISCHEN Tab; Dashboard-Tabs sind im Dev erst nach Erst-Kompilierung schnell (Launcher wärmt vor).

---

## DETAILLIERTE TO-DO-LISTE (nach Priorität)

### A) Phase 3 — DER EINE bewiesene Cluster (Kosten), depth-first — DAS ist die Hauptarbeit
1. **Bidirektionale interne Cluster-Verlinkung (HÖCHSTER HEBEL, zuerst).** On-Page-Audit zeigt 19/21 Artikel mit <2 internen Links. Bauen: beim Publish verlinkt der neue Artikel passende ältere Artikel im selben Cluster UND die älteren bekommen automatisch einen Rück-Link auf den neuen. Cluster-bewusst (nicht nur /kontakt). Deterministisch, kein User-Input nötig. Bestehende Bestands-Artikel nachverlinken (einmaliger Lauf). Danach On-Page-Score im Dashboard prüfen (sollte steigen).
2. **GEO-Lücken schließen:** 3 Artikel ohne Jahr "2026" im Titel (siehe Verbesserungen-Tab); Antwort-Block sichtbar; FAQ vollständig.
3. **Pillar + fehlende Spokes** im Kosten-Cluster (queue.yaml cluster:1). Winnability-First (Striking-Distance im Search-Tab nutzen).
4. **Qualitäts-Tools** (im Plan §15 beschlossen): foglift-scan (GEO/AEO-CLI), Lychee (Broken-Link), axe-core/pa11y (Barrierefreiheit), schema-dts. In den Verbesserungen-Tab/Audit integrieren.
5. **Distribution Pilot** (braucht teils User): LinkedIn/Medium-Syndication (canonical), Reddit-Seeding (echt, kein Spam), Source-of-Sources-Monitoring, Newsletter-Signup, Infografik → Bildersuche/Pinterest.
6. **Messen + auf Beweis warten = GATE zur Breite:** Indexierung, Striking-Distance, Klicks, Conversion. ERST nach Ranking-/Anfrage-Beweis Phase 5.

### B) Phase 2 — Reste (Moat füllen)
7. **Meinungs-Pool füllen (BRAUCHT THOMAS):** gebündelte `/interview-me`-Sitzung pro Cluster, zuerst Kosten (1). Dashboard "Wissen & Moat" zeigt die Lücken (4 Cluster ohne Meinung). Wochen-Mail erinnert automatisch.
8. **NotebookLM: restliche Cluster-Notebooks + Methodik-Notebook** anlegen (Methode siehe Lessons/Memory: UI-Bulk-Paste, NICHT headless-MCP). Pro Cluster `npm run notebooklm:plan` → URLs → in NotebookLM-UI einfügen → `npm run notebooklm:record`. Methodik-Notebook = SEO/Schreibstil-Rohquellen, daraus ins `playbook.md` destillieren.
9. **NotebookLM-Synthesen in den Vault destillieren:** geerdete Antworten aus den Cluster-Notebooks als Vault-Fakten ablegen (Quelle = Pillar-Artikel/Notebook).

### C) Kleinere offene Punkte
10. `check_indexation` in den launchd-Tageslauf einhängen (vor `npm run engine`), damit der Kill-Switch automatisch aktuell bleibt.
11. **Slug-Hygiene:** ~37 abgeschnittene Slugs in queue.yaml + ~4 published → kurze keyword-Slugs, bestehende NUR mit 301-Redirect (next.config.ts redirects()).
12. **Entität/Distribution:** Bing-Webmaster-Sitemap einreichen, `llms.txt` ergänzen, Wikidata-Eintrag + `sameAs` (LinkedIn/Crunchbase) im Person/Org-Schema.
13. **GA4 manuell:** `generate_lead` als Schlüsselereignis markieren (GA4 → Verwalten → Ereignisse), damit es als Conversion zählt.

### D) Aufgeschoben (gemerkt, später)
14. **Content-Gap-Check gegen Konkurrenz** (Thomas: "später, nur zur Info"): Striking-Distance-Query → top-rankende Seiten holen → Lücken-Analyse → unseren Artikel ergänzen. Phase 3+.
15. **Phase 4 — Medien headless:** video-fähiger NotebookLM-MCP, Media-Checker headless, Substack Auto-Draft. ACHTUNG: der headless notebooklm-MCP `add_source`/`ask_question` ist aktuell unzuverlässig (siehe Lessons).

---

## WO WIR STEHEN (fertig + verifiziert)

Letzter Commit `18c3af3` (+ Launcher-Update). 89 Tests grün, tsc grün, `next build` grün, alle Dashboard-Tabs browser-verifiziert.

**Phase 0** (fertig): DE-Alt-Texte, Quellen-Render + JSON-LD, ausgehende Quell-Links, cluster-Feld + category. Offen: Slug-Hygiene.

**Phase 1** (fertig + deployed): GSC/GA4-Dashboard (Überblick/Search/Analytics), Striking-Distance, Verlaufs-Sparklines, Gesundheits-/Penalty-/Totmann-Alarm, Indexierungs-Kill-Switch, Conversion-Events. OAuth-Creds außerhalb Repo (`~/.config/redrabbit-dashboard/`), `.env.local` (GSC_SITE_URL, GA4_PROPERTY_ID=519842891). Offen: check_indexation in launchd.

**Phase 2** (fertig + diese Session erweitert):
- **Vault:** `scripts/content-engine/lib/vault.ts` (parse/search/isStale/format/appendFacts, Frische-TTL +180d), `content-engine/knowledge/vault.md` (21 Fakten geseedet, REPO-versioniert). Researcher fragt zuerst den Vault, Rückfluss bei `--emit`. `npm run vault:backfill`.
- **/interview-me:** Skill `~/.claude/skills/interview-me/SKILL.md`, schreibt nach `content-engine/opinions/pool.md`. `opinion_missing` → Hinweis in Review-Mail. `loadOpinion` matcht Thema-ID ODER Cluster.
- **Methodik-Playbook:** `content-engine/knowledge/playbook.md` (SoT für Handwerk, vom Finalizer gelesen). On-Page-Audit `lib/dashboard/onpage.ts`.
- **Dashboard-Tabs:** "Wissen & Moat" (`/dashboard/wissen` — Vault, Meinungs-Coverage, Interview-Backlog, NotebookLM-Status) + "Verbesserungen" (`/dashboard/verbesserungen` — On-Page-Audit schwächste-zuerst, häufigste Lücken, Methodik-Hebel-Verifizierungs-Status).
- **Tracking:** `generate_lead` auf ALLEN Formularen (ContactForm-Modal + HighEnd), `contact_form_open` (CTA-Intent), `scroll_depth`, `outbound_click` (global via `components/AnalyticsListener.tsx`). Analytics-Tab: "Verhalten" + "Kontakt-Interesse pro Seite". GA4 G-09FNC6THTD, GTM-MQXGT8FL (global, alle Seiten).
- **Erinnerung:** `npm run remind` + launchd `com.redrabbit.reminder` (Mo 08:30, GELADEN) → Mail mit Interview-Lücken + "Methodik destillieren" + größte On-Page-Lücke.
- **NotebookLM-Kosten-Pilot:** Konto t.uhlir@immo.red, Notebook `3eccf288-a944-4d2d-95e4-dcc71358e5ef` "Red Rabbit – Kosten" mit 12 Cluster-1-Artikeln, geerdete Antwort verifiziert, im Manifest (`content-engine/knowledge/notebooklm-manifest.json`) + Dashboard.

## BRAUCHT THOMAS (User-Inputs, Wochen-Mail erinnert)
- `/interview-me`-Sitzungen (Meinungs-Pool füllen) — Policy-Schutz + Moat.
- NotebookLM: neue Gold-Quellen sammeln + Cluster-Notebooks befüllen (UI), dann "destillieren" sagen.
- Distribution-Freigaben (Reddit/Source-of-Sources/LinkedIn), Substack-Klick.
- NotebookLM-Konto: muss t.uhlir@immo.red sein (MCP `get_health` prüfen, sonst `re_auth`).

## WICHTIGE BEFEHLE / DATEIEN
- `npm test` · `npx tsc --noEmit` · `npx next build` (Dev-Server vorher killen + `rm -rf .next`)
- `npm run engine -- <id|--next> [--emit]` · `npm run vault:backfill` · `npm run notebooklm:plan` · `npm run notebooklm:record <c> <url> <srcs...>` · `npm run remind -- --dry-run`
- Dashboard: Desktop-Icon "Red Rabbit Dashboard" oder `scripts/dashboard-launcher.command`
- Graphify: `graphify query "X" --graph graphify-out/graph.json` (NIE `--backend claude`)

## VERBINDLICHE ENTSCHEIDUNGEN (nicht neu aufrollen)
1 Artikel/Tag; Ziel GEO+SERP; Moat = web-verifizierter Vault, additiv. Fabriziertes 315-Review-Schema bleibt auf Userwunsch (mein Einwand dokumentiert, KEINE zusätzlichen Fake-Reviews). Band weiss bis hellgrau, kein Presse-Outreach (Source-of-Sources ok). EIN Cluster beweisen VOR Breite (Disziplin statt Tempo). NotebookLM-Struktur: pro Cluster ein Notebook + separates Methodik-Notebook. Methodik-Hebel erst Hypothese, dann an UNSEREN GSC-Daten verifizieren.
