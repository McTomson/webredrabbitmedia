# Naechste Session — SEO/GEO/LLM-Technik-Perfektion + Wert-Copy + SERP-Anzeigen (2026-08-09)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, brand/README.md + brand/decisions-log.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden. Gilt VERSCHAERFT fuer Rankings/Indexierung/Rechtstexte.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe. Bricht ein Tool ein -> STOPP + fixen, keine kaputten Daten. Nicht endlos haengen.

## Auftrag (Thomas 09.08.) — STRIKTE REIHENFOLGE
Ziel-Bild von Thomas: die Website so perfekt fuer Google/Bing/LLMs machen, "dass sie gar keine Wahl hat, als uns verdammt gut zu ranken". Live-Seite wird KOMPLETT ausgetauscht. Google muss alle Seiten korrekt indexieren + ranken, KEINE Probleme in der Search Console.

**Phase A — UNTER DER HAUBE (ZUERST, bevor Copy/Anzeigen). Das ist die Pflicht-Basis.**
1. **Interne Verlinkung / Gegenverlinkungen:** jede Seite sinnvoll ein- UND ausgehend verlinkt (Hub<->Spoke), keine Waisenseiten, konsistente + keyword-natuerliche interne Anker-Texte, Breadcrumbs, Menue + Footer ueberall (Site-Chrome-Standard [[reference_relaunch_site_chrome_kanonisch]]). Link-Graph pruefen (graphify + echtes Crawl).
2. **Indexierbarkeit — KRITISCHER LANDMINE-PUNKT:** ALLE `/relaunch-preview/*`-Seiten sind aktuell `robots: index:false, follow:false` (noindex). Beim Live-Austausch MUESSEN die finalen Seiten indexierbar werden (index:true) — sonst rankt NICHTS. Vor Go-Live systematisch pruefen: jede Seite noindex-Status, canonical selbst-referenziell + auf finale Domain, keine versehentlichen `/relaunch-preview/`-Canonicals live.
3. **sitemap.xml + robots.txt:** aktuell, alle gewollten Seiten drin, keine noindex-URLs in der Sitemap, robots.txt erlaubt Crawl der finalen Seiten.
4. **Strukturierte Daten (JSON-LD), valide + ECHTE Daten:** Organization, LocalBusiness (NAP konsistent), Service/Offer (Preise 1.250/2.850/4.900), FAQPage, BreadcrumbList, WebSite (Sitelinks-Searchbox). REGEL: kein fabriziertes aggregateRating, nur echte Google-Sterne [[feedback_redrabbit_rating_ehrlichkeit_echte_google_sterne]]. Rich-Results-Test bestehen.
5. **Meta/Head je Seite:** einzigartige title + description, OG/Twitter-Cards, korrekte canonical, ggf. hreflang de-AT.
6. **GEO/LLM (Bing, ChatGPT, Claude, Perplexity):** sauberes semantisches HTML (eine H1, sinnvolle H2/H3), Inhalte SSR-lesbar (nicht nur per JS), klare Frage->Antwort-Bloecke (FAQ) die LLMs zitieren koennen; ggf. llms.txt pruefen. E-E-A-T-Signale (echtes Gesicht, Cases).
7. **Core Web Vitals** (rankingrelevant): LCP/CLS/INP im gruenen Bereich halten (bestehende LCP-Poster/Font-Arbeit fortfuehren).
8. **Google Search Console (nach Live-Austausch):** Sitemap einreichen, Coverage/Indexierung pruefen, keine "noindex/Redirect/404/soft-404"-Fehler, URL-Inspection der Kernseiten, sauberer Umzug alt->neu (301-Redirects fuer geaenderte URLs, keine verwaisten alten URLs, keine Duplicate-Content-Fallen).

**Phase B — WERT-COPY (nachdem A steht):** die sichtbaren Texte positiv, neugierig-machend, klickstark auf den MEHRWERT ausrichten. Open-Loop-Hooks [[feedback_copy_open_loop_hooks]], Ton = auffordern/challengen statt beruhigen [[feedback_copy_auffordern_challengen_statt_beruhigen]], KI-Tells meiden, echte Umlaute. Skills: copywriting, marketing-psychology, cro; brand/ + content-engine/voice/house.md = Ton-Quelle. (Kein dediziertes SEO-Skill installiert — bewusst; general + brand.)

**Phase C — "ANZEIGEN richtig stellen" (nach A):** wie wir in Google/Bing/LLM-Ergebnissen erscheinen. Positionierung NICHT mehr ueber den Preis, sondern ueber den WERT/USP (Anti-Agentur, kein Risiko, Talos/Copilot, Ergebnis "damit das Telefon klingelt"). Je Seite/Anzeige **3 Beispiele** liefern.
- ZUERST MIT THOMAS KLAEREN: meint "Anzeigen" die SERP-Meta-Snippets (title+description, organisch) ODER echte Google/Bing-**Ads** (bezahlt) — oder beides? Danach je 3 Varianten.

## Kritische Landminen (nicht uebersehen)
- **noindex ueberall** auf /relaunch-preview (siehe A2) — die #1-Gefahr beim Live-Austausch.
- **Live-Austausch = Domain-/URL-Wechsel:** Redirects sauber, sonst Ranking-Absturz + Search-Console-Fehler. Alte Live-Struktur (main) vs. neue Relaunch-Struktur mappen.
- **lib/config.ts PRICING + brand/pricing.md der LIVE-Hauptseite** noch NICHT auf 1.250/2.850/4.900 angeglichen (decisions-log OFFEN) — vor Go-Live angleichen, sonst widerspruechliche Preise/Schema.

## Offen aus der Preisseiten-Session (mitnehmen)
1. **Handy-Abnahme durch Thomas** (v2.redrabbit.media/relaunch-preview/preise) — in-browser nicht pruefbar [[reference_mcp_chrome_resize_viewport_limit]].
2. **CTA-Button "Kostenlosen Entwurf holen"** (kostenlos+Entwurf = Regelbruch) im geteilten `components/relaunch/SiteClosing.tsx` — war FREMD-WIP (parallele Session), NICHT angefasst. Koordinierter Durchgang: auf Kante-Ton umstellen (z.B. Button prop-basiert machen, Default alt lassen, Preis-/Seiten-spezifisch "Hol dir deine Vorschlaege" o.ae.). Erst git status pruefen ob noch dirty.
3. **"~350 EUR"-Einrichtungs-Anker** (Preisseite Fundament) — Thomas' Praxiszahl; bei Bedarf gegen Markt absichern.
4. **"Designer-Team"** (Preisseite RisikoBand) — Konsistenz zur ueber-uns-Seite pruefen (kein Solo-vs-Team-Widerspruch).
5. Kosmetik: Website-Stufen-Fahrt (`DreiStufenMatrix`) ist mit den schlanken Stufen luftiger; Heading "Drei Pakete, ein Prinzip" ggf. schaerfen.

## Stand Preisseite (diese Session, LIVE auf v2)
- Commits `c312295` (Inhalt neu: Fundament separat via neue PreiseFundament.tsx, STUFEN nur Unterschied, Extras, ab-Logik, Talos=Copilot, Domain raus) + `4192360` (MehrwertRechner geloescht, Legacy-AGB app/agb auf 40% + 1.250). Details: brand/decisions-log.md Eintrag 2026-08-09. Typecheck gruen, Desktop in-browser verifiziert, kein Overflow.

## Deploy / Branch / Standing Constraints
- Branch `relaunch`, live v2.redrabbit.media (git push -> Auto-Deploy via post-commit-Hook; "up-to-date"-Falle: mit `git ls-remote origin relaunch` gegen HEAD pruefen). NIE `vercel --prod`.
- NIE `git add .`/`-u` — nur eigene Dateien mit explizitem Pfad. UNTRACKED-WIP-FALLE: `TalosChoreoStage.tsx` + `TalosApproachStage.tsx` + `talosMoodMotion.ts` (+ weitere untracked) NIE mitcommitten (brechen den Build). Vor jedem add `git status --short`.
- FREMD-WIP nicht anfassen: `components/relaunch/SiteClosing.tsx`, `app/relaunch-preview/faq/page.tsx`, `components/subpages/faq-demo/demo.body.html`, `docs/handoffs/NEXT_SESSION_leistungen.md`, `docs/seo-monitor-log.md` (Stand 09.08. dirty — vor Arbeit erneut pruefen).
- Keine Emojis. Echte Umlaute in User-Content, ASCII in Shell/Commits/Code. Kein "gratis"/"kostenlos" in sichtbarer Copy. Telefon nur hinter Anruf-Button.
- Commit-Trailer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` + `Claude-Session: https://claude.ai/code/session_01DW1kafYLq21SHob1YFsbkZ`.
- Visuelle Fixes erst "fertig" wenn auf Thomas' Geraet bestaetigt.
- City-/Staedte-Unterseiten kommen SPAETER (Thomas), nicht in diesem Strang bauen — aber die Technik-Basis (Sitemap/Verlinkung/Schema) so anlegen, dass sie sauber andocken.
