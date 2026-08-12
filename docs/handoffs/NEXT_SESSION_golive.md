# Naechste Session — GO-LIVE: web.redrabbit.media auf die neue Seite tauschen (2026-08-12)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, docs/SEO_GEO_AUDIT_BEFUNDE_2026-08-11.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## ORCHESTRIERUNG (Thomas, verbindlich)
- Fable 5 = NUR Orchestrator (planen, briefen, JEDES Ergebnis pruefen via Browser/curl/git diff). Programmieren NUR Subagenten: model "opus" fuer Code, model "sonnet" fuer Research/Mechanik.
- Login-Schritte: Fable OEFFNET die jeweilige Seite im Browser, THOMAS loggt ein (Google, Bing, IONOS, Vercel, world4you). Keine Passworteingaben durch Agenten.

## MISSION
Die alte Live-Seite auf web.redrabbit.media durch die neue (aktuell /relaunch-preview) ersetzen. Domain bleibt web.redrabbit.media (SEO-Fundament traegt, Memory reference_relaunch_golive_domain_modell). redrabbit.media Apex -> 301 auf web.redrabbit.media. v2.redrabbit.media existiert produktiv NICHT weiter.

## ARCHITEKTUR-ENTSCHEID (Thomas 12.08., eingeplant)
- Website bleibt auf VERCEL (CDN, Auto-Deploys, Previews). NICHT auf den VPS umziehen.
- Alles Automatische/24-7 (spaeter: Outreach, Chat-Beantwortung, Worker) kommt auf den bestehenden VPS als eigene Dienste hinter einer Subdomain (z.B. api.redrabbit.media). Website redet per API/Webhook mit dem VPS.
- Beim DNS-Termin (IONOS/world4you) die api-Subdomain gleich mit vorbereiten, damit spaeter kein zweiter DNS-Termin noetig ist. WICHTIG: world4you A/MX-Records NIE anfassen (Memory-Regel), nur neue Eintraege/Redirects.

## PHASE 0 — Vorbereitung (alles VOR dem Tausch, Session + Executor)
1. **Redirect-Map alt->neu** komplett bauen + als Middleware/next.config-Redirects (301/308, KEINE Ketten, Varianten slash/www/http): alle alten Live-URLs erheben (alte sitemap.xml + GSC-Top-URLs + Backlink-Ziele), gegen neue Pfade mappen. Redirects bleiben DAUERHAFT im Code (min. 1 Jahr, nie "aufraeumen").
2. **Pfad-Hebung**: /relaunch-preview/* -> Root-Pfade (Praefix raus), ALLE internen Links/Canonicals/Sitemap auf Go-Live-Pfade, noindex ENTFERNEN (die grosse Landmine — erst in diesem Schritt!). AUSNAHME: /leistungen-HUB bleibt dauerhaft noindex UND unverlinkt (Thomas 12.08.: wird spaeter neu gemacht, niemand soll ihn finden; Footer zeigt seit b6ba79f auf leistungen/website, Menue klappt nur auf). Alte Root-Seiten (app/leistungen, app/webdesign-wien alt, SEOContent-Landingpages...) pruefen: ersetzen oder redirecten, KEINE Duplikate.
3. **Mails produktiv**: Lead-Formulare/Popups auf IONOS office@ (project_lead_popups_ionos_versand: fertig bis auf SMTP_TO Production!) — SMTP_TO auf echte Adresse, Testmail rein UND raus verifizieren (echte Zustellung, nicht nur 200er-Response).
4. **USP-Block Talos (Thomas-Wortlaut als Basis, Haus-Stimme, kein Gedankenstrich)**: expliziter Vergleichs-Absatz auf Home/Ueber-uns + llms-full.txt, sinngemaess: "Im Gegensatz zu herkoemmlichen Webagenturen ist bei jeder Website Talos dabei, dein Copilot: ein eigener Bereich, in dem du siehst, ob du gefunden wirst, woher deine Besucher kommen und wer sich meldet." Kundennutzen betonen (heute entscheidend, weil man sonst blind ist). Formulierung Thomas zeigen.
5. **SSR-Bot-Stichprobe**: curl mit GPTBot/ClaudeBot-UA auf Kernseiten (Text sichtbar, nicht JS-Shell).
6. Offene Reste einarbeiten: Offenlegung um Geschaeftsfuehrer + Beteiligungsverhaeltnisse ergaenzen (THOMAS-INPUT, grosse Website = Pflicht!); sameAs LinkedIn (Kandidat existiert im Menue: linkedin.com/in/thomasuhlir — von Thomas bestaetigen lassen); faq-demo h1 nachziehen sobald Parallel-WIP committet.

## PHASE 1 — Der Tausch
1. Deploy-Plan mit Thomas: Zeitpunkt, Vercel-Projekt/Branch (relaunch -> main merge oder Branch-Umhaengen — Ist-Zustand in Vercel erst PRUEFEN, nicht raten), Rollback-Weg notieren.
2. Apex-301 redrabbit.media -> web.redrabbit.media einrichten (world4you: NUR Redirect/neue Records, NIE A/MX bestehende anfassen). IONOS-Anteile laut reference_immo_red_hosting_topology pruefen.
3. Nach dem Tausch sofort verifizieren: Kernseiten 200 + Inhalt, Redirect-Stichproben (alte URLs -> 301 -> neue), robots.txt, sitemap.xml, og:image, Formular-Testmail.

## PHASE 2 — Google + Tracking (Thomas loggt ein, Fable oeffnet + prueft)
1. **GSC**: neue sitemap.xml einreichen; Top 10-20 Kernseiten per URL-Pruefung einzeln zur Indexierung anfragen (Kontingent! Rest ueber Sitemap); Live-Test Rendering pruefen. Realistisch: Kernseiten Stunden-Tage, volle Re-Indexierung Wochen.
2. **Tracking-Stack wie almtal** (reference_almtal_dashboard_leads_ops als Vorbild): GA4 + Google Tag Manager + **Consent Mode v2 (PFLICHT seit 2024, ueber CMP)** + Microsoft Clarity als Heatmap (kostenlos, seit 10/2025 Consent-API-Pflicht fuer EWR -> als Vendor im Consent-Banner deklarieren). KEIN Server-Side-Tracking (Overkill fuer diese Groesse, Research 12.08.). Bestehenden CookieBanner pruefen ob CMV2-faehig.
3. **Bing Webmaster Tools**: verifizieren, Sitemap, IndexNow-Ping abfeuern (Key liegt: public/aae688....txt, Script scripts/indexnow-ping.mjs, docs/INDEXNOW_RUNBOOK.md). Bing speist ChatGPT/Copilot — das ist der LLM-Hebel Nr. 1.
4. **Google Business Profile**: NAP-Konsistenz (Grabnergasse 8/8-Frage vereinheitlichen), Leistungsbeschreibungen aktuell — wichtig fuer Gemini. Herold/firmen.at NAP checken.

## PHASE 3 — Sichtbarkeit zeigen + KI-Monitoring (Thomas' expliziter Wunsch)
1. **SERP-Vorschau je Seite**: fuer jede Kernseite zeigen, wie sie bei Google aussieht (Title/Description-Rendering; site:-Abfragen + GSC-Darstellung). Als kleines Markdown/HTML-Uebersichtsblatt fuer Thomas aufbereiten.
2. **KI-Sichtbarkeits-Baseline**: 5-8 Standard-Prompts definieren ("website erstellen lassen wien", "webagentur steiermark empfehlung", "was kostet eine website oesterreich", je Zielgruppe/Bundesland) und in ChatGPT/Claude/Perplexity/Gemini durchtesten; Ergebnis dokumentieren (Datum, genannt ja/nein, Position, Kontext) -> docs/KI_SICHTBARKEIT_MONITOR.md, monatlich wiederholen. Bing Webmaster Tools liefert seit 06/2026 zusaetzlich kostenlose KI-Sichtbarkeits-Metriken.
3. Erwartung ehrlich managen: KI-Empfehlungsraten fuer lokale Firmen sind generell niedrig; Hebel = Bing-Index + GBP + echte Bewertungen + Dritt-Erwaehnungen (Verzeichnisse, Kunden-Backlinks — project_redrabbit_kunden_backlinks_seo) + frische Inhalte. Kein Bezahl-Tool noetig.
4. **404- und Ranking-Monitoring**: GSC Coverage + Performance erste 2 Wochen engmaschig, dann woechentlich bis Woche 12; 404s nachredirecten.

## THOMAS-LOGINS (Fable oeffnet, Thomas tippt)
Google (GSC, GA4, GTM, Business Profile), Bing Webmaster Tools, Vercel (Domains/Env), IONOS (SMTP/Domains), world4you (nur Redirect-Regel). Zugaenge sagt Thomas zu ("du musst mir nur die seiten oeffnen").

## OFFENE THOMAS-INPUTS (VOR Go-Live)
1. Geschaeftsfuehrer-Name + Beteiligungsverhaeltnisse fuer Offenlegung (Pflicht bei grosser Website!).
2. LinkedIn linkedin.com/in/thomasuhlir als offizielles sameAs bestaetigen.
3. Abnahme auf seinem Geraet: /preise-Kernantwort-Absatz, Bumper-Motion, Talos-3D (+ Talos-Panel-Farbe offen aus Preise-Strang).
4. BaFG-Artikel: draft lassen oder freigeben?

## LANDMINEN / REGELN
- noindex-Oeffnung NUR im Tausch-Schritt (P0.2), nie vorher. /leistungen-HUB bleibt noindex+unverlinkt.
- Preise-Guard 1.250/2.850/ab 4.900, NIE 790. Kein Gedankenstrich in Kunden-Copy. Kein fabriziertes Rating ("8 bleibt"-Entscheid: sichtbare Zahlen NICHT anfassen, Memory project_redrabbit_gbp_reviews_sameas_status).
- Parallel-Sessions auf relaunch: git fetch + log zuerst, NUR eigene Dateien stagen (WIP-Liste im Audit-Handoff).
- KEIN npm run build bei laufendem next dev.
- CWV: /preise Score 0.40 (Spline/3D 3MB) — Optimierung (3D lazy-on-interaction) NUR mit Thomas-Go, eigener Schritt, kein Go-Live-Blocker.
- Danach geplant (NICHT diese Session): Dashboard, Outreach/Chat-Systeme auf VPS.

## Stand 12.08. (Vorleistung dieser Session)
Finalcheck SEO/E-E-A-T/GEO komplett umgesetzt + auf v2 SSR-verifiziert (Commits f8c7a22..b6ba79f): Details im STATUS-UPDATE von NEXT_SESSION_seo-geo-perfektion.md + docs/SEO_GEO_AUDIT_BEFUNDE_2026-08-11.md + docs/SEO_GEO_FINALCHECK_CHECKLISTE_2026-08-11.md. Go-Live-Research (Redirects/GSC/LLM/Tracking) mit Quellen: von dieser Checkliste abgedeckt, Rohdaten im Session-Verlauf 12.08.
