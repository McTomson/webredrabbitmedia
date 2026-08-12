# Naechste Session — FINALCHECK vor Live: SEO + E-E-A-T + GEO/LLM komplett (2026-08-11)

## STATUS-UPDATE 11.08. spaet: FINALCHECK IM KERN DURCHGEZOGEN (Commits f8c7a22..e16e8c5, alle auf v2 SSR-verifiziert)
- Research (3 Sonnet) -> docs/SEO_GEO_FINALCHECK_CHECKLISTE_2026-08-11.md; Voll-Audit (3 Sonnet) -> docs/SEO_GEO_AUDIT_BEFUNDE_2026-08-11.md.
- UMGESETZT + verifiziert: ueber-uns wieder noindex (Landmine war verletzt!), 790-EUR/164-Claims aus layout.tsx+organization.ts, echte h1 auf 7 Kernseiten (faq-demo offen: Parallel-Session-WIP!), OG-Bild global 1200x630 (public/og/og-image-redrabbit.jpg) + twitter:card + explizit auf Referenzen/8 Regionen, Descriptions alle 130-158, robots-Doppelquelle raus, llms.txt erweitert + llms-full.txt neu, IndexNow (Key public/aae688....txt + scripts/indexnow-ping.mjs + docs/INDEXNOW_RUNBOOK.md — PING ERST BEIM LIVE-GANG), MedienG-Offenlegung + ECG-Gewerbe "Webdesign und IT-Dienstleistungen" (Preview+Live-Komponente synchron), GEO-Kernantwort-Absaetze (/preise sichtbar im RisikoBand, 8 Regionen sr-only), /preise->Kosten-Ratgeber-Link, Zuletzt-aktualisiert-Anzeige (nur echtes updatedAt) + dateModified war schon da.
- THOMAS-ENTSCHEIDE (nicht neu aufrollen): "8 bleibt" (aggregateRating/sichtbare Zahlen unveraendert, Risiko 2x benannt); Regionen-Testimonials = echte Kunden mit Zustimmung; BaFG-Artikel bleibt draft.
- OFFEN (Thomas-Input): Geschaeftsfuehrer + Beteiligungsverhaeltnisse fuer Offenlegung (grosse Website!), LinkedIn-Link fuer sameAs (erinnern!).
- OFFEN (Arbeit): CWV — Lighthouse lokal: /preise Score 0.40 (TBT 2,5s, 3MB, Spline/3D + Chunks 1255-*/ebda9f70-*), Tirol LCP 7,5s (Unused JS 1,1s), Home/ueber-uns 0.60/0.65; Fix = 3D lazy-on-interaction + Route-JS pruefen — Eingriff in Talos-Strang NUR mit Thomas-Go. Leistungs-Hub neu-vs-streichen-Vorschlag (Hub ist komplett unverlinkt, streichen = 0 Linkbrueche). faq-demo h1 nachziehen wenn Parallel-WIP committet. Thomas-Abnahme /preise-Kernantwort-Absatz auf seinem Geraet.
- BEIM LIVE-TAUSCH: noindex oeffnen, Sitemap neue Pfade, IndexNow-Ping, /leistungen-HUB dauerhaft noindex halten.

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## ORCHESTRIERUNGS-REGEL (Thomas 11.08., verbindlich fuer diese Session)
- **Fable 5 = NUR Orchestrator**: planen, brainstormen, briefen, ueberwachen, Ergebnisse checken. Fable programmiert NICHT selbst.
- **Ausfuehren/Programmieren = Subagenten** mit `model: "opus"` (= Opus 4.8) fuer anspruchsvolle Code-Arbeit oder `model: "sonnet"` fuer Research/mechanische Arbeit. NIE Fable als Executor (Token sparen).
- Jedes Agenten-Ergebnis wird vom Orchestrator GEPRUEFT (Browser/curl/git diff), bevor es als fertig gilt.
- last30days-Skill: IMMER als Sonnet-Subagent (Memory-Regel).

## Mission
Letzter grosser Schritt VOR dem Live-Gang (danach nur noch eigener Talos-Ausbau):
Die Seite soll "top top top" sein fuer Google, Bing UND die KI-Suchen (ChatGPT,
Perplexity, Gemini, Copilot). Ablauf in 3 Phasen:

### Phase 1 — RESEARCH (parallel, Sonnet-Agenten)
- `last30days` (Sonnet-Subagent!) zu SEO/GEO/AEO/LLM-Optimierung: was ist Stand
  August 2026 wirklich wirksam (llms.txt? Schema-Neuerungen? Bing/Copilot-Signale?
  KI-Crawler-Zugriff GPTBot/PerplexityBot/Google-Extended?).
- Parallel-Agent: Best-Practice-Audit-Checklisten E-E-A-T 2026 (Autor-Seiten,
  sameAs, Organisations-Signale, echte Reviews).
- Parallel-Agent: Konkurrenz-Check, was Top-Rankende Webagenturen AT technisch
  eingebaut haben.
- Ergebnis: EINE priorisierte Massnahmen-Checkliste, mit Thomas kurz abstimmen.

### Phase 2 — VOLL-AUDIT der eigenen Seite (Agenten pruefen, Orchestrator verifiziert)
Systematisch JEDE Seite unter app/relaunch-preview/* gegen die Checkliste:
- SEO-Basis: title/description/canonical/hreflang, H1-Struktur, interne
  Verlinkung (Kosten-Artikel <-> /preise Cross-Links: Stand pruefen!), sitemap.xml,
  robots.txt, 404/Redirects.
- Schema/JSON-LD: Organization, LocalBusiness, Service, FAQPage, BreadcrumbList,
  Article (Blog) — NUR echte Daten (Rating-Ehrlichkeits-Regel, kein fabriziertes
  aggregateRating).
- E-E-A-T: Autoren/Ueber-uns-Signale, Impressum, echte Google-Reviews-Einbindung.
- GEO/LLM: Inhalte KI-lesbar (klare Fragen/Antworten — die neue Preise-Matrix ist
  dafuer schon gut), llms.txt erwaegen, KI-Crawler in robots.txt NICHT blockieren.
- Core Web Vitals: Lighthouse pro Kernseite, LCP-Poster, Fonts.
- OG/SOCIAL: **Link-Vorschaubild FEHLT (Thomas-Auftrag!)** — og:image + twitter:card
  fuer alle Kernseiten einbauen, sobald Thomas das Bild liefert (Gemini-Browser-
  Runbook; Prompt hat Thomas bekommen, 1200x630). Bis dahin Metadata-Geruest bauen.

### Phase 3 — UMSETZEN + GEGENCHECKEN
- Massnahmen von Executor-Agenten (opus/sonnet) bauen lassen, Orchestrator prueft
  jede einzeln (SSR-HTML via curl, Rich-Results-Test-Logik, Browser).
- LANDMINE bleibt: /relaunch-preview ist ueberall noindex — beim Live-Tausch
  indexierbar machen. NICHT vorher.

## LEISTUNGSSEITE (Thomas 11.08., WICHTIG)
- Der /leistungen-HUB soll NICHT indexiert werden (auch nach Live-Gang zunaechst
  noindex!) — er wird neu gemacht ODER faellt ganz weg, Entscheidung offen.
- Die UNTERSEITEN von /leistungen (website, talos, ...) BLEIBEN und werden normal
  behandelt/indexiert.
- Naechste Session: dem Hub explizit dauerhaftes noindex verpassen (getrennt von
  der relaunch-preview-Pauschale), interne Links auf den Hub pruefen (Menue/Footer
  duerfen nicht auf eine Geisterseite zeigen), und Thomas einen kurzen Vorschlag
  machen: Hub neu (was waere drauf?) vs. streichen (Menue direkt auf Unterseiten).

## Stand dieser Session (11.08., Preise-Strang FERTIG bis auf 1 Punkt)
- Erledigt + deployed (v2): Abstands-Root-Cause gefixt (styleguide margin:0
  Spezifitaet — LESSONS_LEARNED 11.08.), Scroll-Stops ueberall zurueck
  (rideUnits=snapUnits, keine Breiten-Weiche mehr), Sektionen fensterhoch
  (sc-full-Muster), Hero-Tablet-Band gefixt, Bumper = Belief-Stups-Mechanik 1:1
  von der Website-Seite + CTA "Hol dir die kostenlosen Vorschlaege",
  Paket-Punkte als Kundenfragen 5/6/7 (Research: docs/PAKETE_RESEARCH_2026-08-11.md),
  Premium = Richtungs-Option statt Automatik, nichts Laufendes gratis.
- OFFEN aus dem Preise-Strang: **Talos-Panel** auf /preise navy -> #f4f4f2 +
  klaeren, warum die Talos-3D-Figur nicht anzeigt (metallische Figur auf hellem
  Grund pruefen; 3D-Abnahme NUR auf Thomas' Geraet, MCP-Chrome kann kein WebGL).
- OFFEN klein: Paket-Frage "Wie lange dauert's?" waere laut Research Top-Kunden-
  frage — nur einbauen, wenn Thomas sich auf Zeitangaben festlegt (fail-closed).
- Motion-Abnahmen offen bei Thomas: Bumper-Stups auf seinem Geraet in mehreren
  Fensterbreiten.

## Blocker / Risiken
- PARALLEL-SESSION auf `relaunch` (Bundesland-Seiten). Vor Arbeit git fetch +
  git log -15; NUR eigene Dateien committen; Fremd-WIP (faq/page.tsx,
  SiteClosing.tsx, faq-demo, NEXT_SESSION_leistungen.md, seo-monitor-log.md)
  NIE stagen.
- KEIN `npm run build` bei laufendem `next dev` (Build killt Dev-Server).
- Preise-Guard: 1.250 / 2.850 / ab 4.900 — NIE 790.
- Haus-Stimme: NIE Gedankenstrich in Kunden-Copy (content-engine/voice/house.md).

## Relevante Dateien / Befehle
- SEO-Basis bisher: fruehere Fixes 6fb74aa/4a0a498 (Schema/Meta), docs/SEO_OFFSITE_CHECKLIST.md,
  Research-Files im scratchpad (evtl. weg — neu erheben ist ok).
- Preise: app/relaunch-preview/preise/page.tsx + components/subpages/preise/*.
- Dev: `npm run dev -- --port 9200`; Deploy: Commit auf `relaunch` -> Hook pusht,
  v2 baut. Verifizieren: `git ls-remote origin relaunch` gegen HEAD.
- Preise-URL: https://v2.redrabbit.media/relaunch-preview/preise
