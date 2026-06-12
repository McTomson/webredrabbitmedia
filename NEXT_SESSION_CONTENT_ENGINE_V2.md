# NEXT SESSION — Content-Engine v2 (Übergabe, Stand 2026-06-11)

ZUERST LESEN. Nahtlos weitermachen. Verbindlicher Plan: `docs/superpowers/plans/2026-06-09-content-engine-v2-REVISED.md`
(§0-§16). Diese Datei ist der Schnelleinstieg + die detaillierte To-do-Liste.

---

## STAND 2026-06-12 (Teil 2) — Ehrlichkeit-Pivot + GATE-Messung

**Rating-Entscheidung GEAENDERT (Owner):** auf Ehrlichkeit umgestellt. Fabriziertes 315/4,9-Schema bleibt ENTFERNT (NICHT reverten). Neue SoT `lib/reviews.ts`: strukturiertes aggregateRating + sichtbare Sterne NUR aus echten Google-Reviews (rendert nichts, bis echte Zahlen eingetragen sind). Alle Fake-Rating-Claims raus (4.8/4.9-Sterne, "315 Bewertungen/Votes") aus 8 Bundesland-SERP-Titeln, Hero, BlogCTA, SidebarAbout, About, Schema, chatgpt-summary. Kundenzahl konsistent von rundem "315+" auf spezifisches **164** (Kunden, NICHT Bewertungen — glaubwuerdiger laut Trust-Psychologie). Fake-conclusionStats in 2 Seed-Artikeln gefixt (315+/4.9/+315% raus). Commits `76e8c79`, `26e114e`, `10c02bf` (live). Memory: [[feedback_redrabbit_rating_ehrlichkeit_echte_google_sterne]].

**GATE-Messung (§14, neues Tool `npm-style`: `npx tsx scripts/content-engine/dashboard/gate_report.ts [days]`):** 90 Tage = 5051 Impressionen, **2 Klicks**, Ø-Position **47,4**. Wir sind WEIT vom GATE — Disziplin (kein Skalieren) bestaetigt. Kosten-Cluster bekommt kommerzielle Impressionen ("was kostet... österreich" Pos 18, "alternative zu teurer agentur" Pos 9, "homepage festpreis vs agentur" Pos 10), aber Autoritaet/Distribution fehlt = der Hebel. "thomas uhlir" nur Pos 19 = schwache Entitaet.

**ERLEDIGT 12.06 (Teil 3): ECHTE Google-Sterne live.** Vom öffentlichen Google-Profil (Red Rabbit GmbH) verifiziert: 5,0 aus 8. In `lib/reviews.ts` gesetzt → aggregateRating rendert auf Homepage (layout.tsx LocalBusiness) + Regionalseiten + tipps; sichtbare Badges (Hero/Sidebar/CTA) zeigen 5,0/5 · 8 Google-Bewertungen. 3 erfundene About-Testimonials ersetzt durch 2 ECHTE (Rafael Danesh, Rene Rohrer; Dmitry raus), wortwörtlich, nichts erfunden. Commit `46a3c26`. Tageslauf hat sich erholt (Draft `was-kostet-ein-professioneller-website-relaunch` sauber erzeugt, keine Fake-Stats). OFFEN Google: Adresse im Profil aktualisieren (alt); Review-Zahl monatlich nachziehen, wenn mehr kommen (oder Business-Profile-API).

**BRAUCHT THOMAS (Entscheidungen/Logins — hier blockiert):**
1. **Google-Business-Adresse aktualisieren** (Profil zeigt noch alte Adresse) — nur Thomas. Rating selbst ist erledigt (5,0/8 echt live).
2. **`lib/regional-content.ts` Regional-Projektzahlen (187/179/168/164/156/145/142/134/128)** uebersteigen z.T. die Gesamtzahl 164 → echte Regionalverteilung geben ODER ich entferne die Zahlen.
3. **Mehrdeutige Artikel-Prozente** (+215%, +145%, +38%, +35%, -72% in conclusionStats) — echte Eigenwerte, illustrative Branchenwerte, oder raus?
4. **Slug-Hygiene (Phase 0 #5):** bereit, die abgeschnittenen URLs umzubenennen (mit 301). Aendert LIVE indexierte URLs → kurzes Go noetig. Vorschlag: grafikdesign-vs-webdesign, statische-vs-dynamische-website, ki-website-erstellung, generative-engine-optimization. Cost-Cluster-Slugs bleiben (Pilot-Stabilitaet).
5. **Distribution:** Medium-Login (`rabbit.red.media@gmail.com`) + falschen Entwurf `medium.com/p/08c1450d849f/edit` verwerfen + neu importieren + Freigabe; LinkedIn; Reddit/SOS.
6. **Bing-Webmaster + Wikidata/Crunchbase** (Entitaet) — Accounts.
7. **Bilder** (verschoben, gemerkt): Cost-Cluster-Heroes off-brand → Marken-Stil via Gemini.

**Watch:** Heutiger Tageslauf scheiterte (Finalizer `claude` CLI ETIMEDOUT, 4x Backoff erschoepft) — nichts publiziert. Wenn morgen wieder: Timeout-Config der Rollen pruefen.

---

## STAND 2026-06-12 (Session-Ende) — SOFORT-NÄCHSTE-SCHRITTE

Diese Session (Forts.): Quality-Scan (Punkt 4) + dessen Funde abgearbeitet — 1 H1/Seite, 20 Titel ≤60, Meta-Cap, /llms.txt, Pillar-Hub→Spoke (3→11), Skip-Nav-a11y, Indexierungs-Hook, conventions.md-Regeln (Regression-Schutz), **Money-Page-OG-Bug gefixt** (`4cde3f7`). Distribution gestartet.

**ZUERST git-Hygiene:** beim Session-Ende liefen launchd-Läufe (run-daily `--next --emit` + run-media-check). `git fetch origin main` + `git log --oneline -5` prüfen; bei Divergenz `git pull --rebase` (run-daily konnte evtl. einen Draft nicht pushen). NIE force/amend auf Gepushtes.

**Dann die drei offenen Stränge:**
1. **Medium-Distribution fertigstellen:** Login = `rabbit.red.media@gmail.com` (verifiziert). Der OG-Fix ist jetzt deployed → der frühere Medium-Entwurf `medium.com/p/08c1450d849f/edit` ist FALSCH (Startseiten-OG) → **NEU importieren** via `medium.com/p/import` mit `https://web.redrabbit.media/tipps/was-kostet-eine-website`, Titel/Bild/canonical prüfen (müssen jetzt artikelspezifisch sein), alten Entwurf verwerfen. Veröffentlichen ERST nach User-Freigabe (Login macht User). Dann LinkedIn-Teaser (User hat bestehenden „Unpopuläre Meinung"-Entwurf — NICHT überschreiben). Plan: `docs/distribution-plan.md`.
2. **Bilder verbessern (User: „das ist furchtbar"):** Cost-Cluster-Artikelbilder sind off-brand (Vollrot + Clipart-3D). Neu im Marken-Stil (cinematic Foto + handschriftlicher Hook) via Gemini-Browser, Pillar zuerst als Stil-Check, **versionierte Dateinamen** (Vercel-Cache!). Stil/Scope mit User abstimmen. Referenz: `~/.claude/.../feedback_bildstil_cinematic_hook_redrabbit`.
3. **Messen + Phase-3-GATE:** GSC/GA4 (Indexierung, Striking-Distance, Conversion) beobachten; erst bei Ranking-/Anfrage-Beweis breiter skalieren.

---

## PROMPT FÜR NÄCHSTE SESSION (copy-paste an Claude)

> Arbeite am Projekt `~/dev/redrabbit` (Red Rabbit Media, Next.js 15 Content-Engine). Lies ZUERST `NEXT_SESSION_CONTENT_ENGINE_V2.md`, `MEMORY.md`, `LESSONS_LEARNED.md`, `docs/runbooks/notebooklm-headless.md` und den verbindlichen Plan `docs/superpowers/plans/2026-06-09-content-engine-v2-REVISED.md`. **Phase 0, 1, 2 sind fertig+deployed. Phase 3 (#1-Hebel: bidirektionale interne Cluster-Verlinkung) ist FERTIG+deployed:** On-Page-internal_links-Befund von 19 auf 0, Ø-Score 100; `scripts/content-engine/lib/clusterLinks.ts` (deterministisch, idempotent, Marker `{/* cluster-links:start/end */}`, /tipps/-Pfade), `npm run cluster:relink`, Auto-Verlinkung im run-media-Hook + tägliches Safety-Net in run-daily.sh; year_in_title via 2026-Titel + `evergreen:true`-Opt-out im On-Page-Audit; key_takeaways ergänzt. WICHTIG (Architektur-Falle): `app/tipps/{slug}/page.tsx` (z.B. `was-kostet-eine-website`) ist eine HARTCODIERTE Seite, die die MDX-Route überschreibt — solche Slugs sind aus Backfill+Audit ausgeschlossen und manuell verlinkt. **Phase 4 (Medien headless) — TEIL bewiesen:** Der headless NotebookLM-MCP erzeugt+lädt Podcasts end-to-end (`generate_audio`→`get_audio_status`→`download_audio`, 40-MB-.m4a verifiziert), ABER NUR wenn der MCP als **t.uhlir@immo.red (BEZAHLT)** eingeloggt ist — alle früheren Fehler waren das falsche Konto, kein kaputtes Werkzeug. YouTube-Spam-Schutz (`containsSyntheticMedia`) live. **NÄCHSTER SCHRITT: entweder (a) Phase-4 produktiv machen — Red-Rabbit-Cluster-Notebooks unter t.uhlir@immo.red NEU anlegen (das Kosten-Pilot-Notebook 3eccf288 ist eine Waise auf dem Gratis-gmail-Konto!), MCP per re_auth auf t.uhlir@immo.red, dann headless-Podcast in run-media verdrahten; ODER (b) höher-wertiger Hebel: Phase-3-Rest = Kosten-Cluster depth-first (Pillar+fehlende Spokes) + Distribution (LinkedIn/Medium/Reddit/Newsletter) + auf Ranking-Beweis warten = GATE zur Breite.** Frag Thomas, welcher Weg. Arbeite autonom, nutze parallele Agenten + Skills (frontend-design, ui-ux-pro-max bei UI; review-it nach Code-Blöcken — NICHT bei reiner Doku/Trivialfix), teste IMMER (Build + `npm test`) UND kontrolliere IMMER im Browser (frischer Tab!), kein Raten — verifizieren. Erst committen/pushen/deployen wenn grün. Light Mode, Apple-Design, keine Emojis, Deutsch, echte Umlaute im User-Content.

> Bewährte Arbeitsregeln: nur EIN Dev-Server auf 9000 (`pkill -f "dev/redrabbit/node_modules/.bin/next"`); `next build` NUR ohne laufenden Dev-Server + nach `rm -rf .next`; `next build` lintet → KEIN `any` in lib/; localhost nur über FRISCHEN Browser-Tab; **gerendert ≠ Datei? ZUERST hartcodierte Route (`app/tipps/{slug}/`) prüfen, dann .next-Cache.** **launchd-RACE:** `com.redrabbit.contentengine` (run-daily, 02:00) + `com.redrabbit.mediachecker` (alle 30 Min) committen/pushen INS SELBE Repo — vor jedem Push `git fetch`, bei Divergenz `git pull --rebase`, NIE force-push/amend auf bereits gepushte Commits, Arbeitsbaum bei Pausen sauber halten, nicht mitten in laufendem run-daily git-Surgery (erst `ps` prüfen). NotebookLM: Konto t.uhlir@immo.red (bezahlt); headless-MCP-Fehler "chat input/more-menu not found" = fast immer falsches Konto → `re_auth`; Cookies laufen ab → periodisch re_auth (nur Mensch tippt Passwort); Browser-Klick-Fallback braucht ECHTEN Klick (synthetisches JS-click feuert Angular nicht).

---

## DETAILLIERTE TO-DO-LISTE (nach Priorität)

### A) Phase 3 — DER EINE bewiesene Cluster (Kosten), depth-first — DAS ist die Hauptarbeit
1. **Bidirektionale interne Cluster-Verlinkung (HÖCHSTER HEBEL, zuerst).** On-Page-Audit zeigt 19/21 Artikel mit <2 internen Links. Bauen: beim Publish verlinkt der neue Artikel passende ältere Artikel im selben Cluster UND die älteren bekommen automatisch einen Rück-Link auf den neuen. Cluster-bewusst (nicht nur /kontakt). Deterministisch, kein User-Input nötig. Bestehende Bestands-Artikel nachverlinken (einmaliger Lauf). Danach On-Page-Score im Dashboard prüfen (sollte steigen).
2. ~~GEO-Lücken (Jahr im Titel, Antwort-Block, FAQ)~~ ERLEDIGT: alle Titel haben "2026"; zusätzlich 20 zu lange Titel auf ≤60 gekürzt (`d75cf9a`); genau 1 H1/Seite (`6cb8194`).
3. **Pillar + fehlende Spokes** (Kosten-Cluster): Pillar-Hub→Spoke-Verlinkung ERLEDIGT (Money-Page 3→11 Spokes, `d75cf9a`); Spoke↔Spoke komplett (Auto-Linker). OFFEN/läuft automatisch: fehlende Kosten-Spokes sind als `todo` in queue.yaml → der Tageslauf schreibt sie nach und nach (kein Massen-Generieren). Winnability-First via Striking-Distance, sobald GSC-Daten da sind.
4. **Qualitäts-Tools** (Plan §15) — ERLEDIGT 11.06 (Commits `62f4d63`+`e5f1d4a`, review-it GO). `npm run quality:scan [-- --quick|--geo|--a11y]` → vier resiliente Scanner (links/schema/geo/a11y) → gitignored `content-engine/.quality-report.json` → read-only Sektion "Qualitäts-Scan" im Verbesserungen-Tab. lychee installiert (brew), foglift-scan=devDep (gratis-Scan, KEIN Key; rate-limited nach ~8 URLs → degradiert). pa11y NICHT installiert (Chromium=Ballast §15), opt-in `npm i -D pa11y`. **schema-dts VERWORFEN: OOM-crasht `next build`-Type-Check (Schema-Sicherheit jetzt via Runtime-Scanner).** Runbook `docs/runbooks/quality-scan.md`, Review `docs/reviews/quality-scan-2026-06-11.md`. 143 Tests grün. NÄCHSTER offener Punkt hier = #5 (Distribution, braucht User-Freigaben) oder #3 (Pillar+Spokes).
5. **Distribution Pilot** — VORBEREITET (`docs/distribution-plan.md`): canonical-sicherer Medium-Import, LinkedIn-Entwurf, echter Reddit-Ansatz, Reihenfolge. OFFEN: braucht User-Freigabe + Login (kein autonomes öffentliches Posten). Zusätzlich erledigt: `/llms.txt` (`901e657`) + Skip-Nav-a11y (`cfcc6fe`).
6. **Messen + auf Beweis warten = GATE zur Breite:** Indexierung, Striking-Distance, Klicks, Conversion. ERST nach Ranking-/Anfrage-Beweis Phase 5.

### B) Phase 2 — Reste (Moat füllen)
7. **Meinungs-Pool füllen (BRAUCHT THOMAS):** gebündelte `/interview-me`-Sitzung pro Cluster, zuerst Kosten (1). Dashboard "Wissen & Moat" zeigt die Lücken (4 Cluster ohne Meinung). Wochen-Mail erinnert automatisch.
8. **NotebookLM: restliche Cluster-Notebooks + Methodik-Notebook** anlegen (Methode siehe Lessons/Memory: UI-Bulk-Paste, NICHT headless-MCP). Pro Cluster `npm run notebooklm:plan` → URLs → in NotebookLM-UI einfügen → `npm run notebooklm:record`. Methodik-Notebook = SEO/Schreibstil-Rohquellen, daraus ins `playbook.md` destillieren.
9. **NotebookLM-Synthesen in den Vault destillieren:** geerdete Antworten aus den Cluster-Notebooks als Vault-Fakten ablegen (Quelle = Pillar-Artikel/Notebook).

### C) Kleinere offene Punkte
10. ~~`check_indexation` in den launchd-Tageslauf einhängen~~ ERLEDIGT 11.06: `run-daily.sh` ruft vor der Pipeline `check_indexation.ts` (nicht-blockierend, fail-safe) → Kill-Switch bleibt automatisch frisch.
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
