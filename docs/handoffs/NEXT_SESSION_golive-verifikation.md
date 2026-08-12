# Naechste Session — GO-LIVE-VERIFIKATION: alles nochmals pruefen (2026-08-12)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md (Eintrag project_redrabbit_golive_vollzogen_2026_08_12), docs/SERP_VORSCHAU_2026-08-12.md, docs/KI_SICHTBARKEIT_MONITOR.md. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe. Bricht ein Tool ein: STOPP + fixen.
- ORCHESTRIERUNG: Fable 5 plant/prueft nur; Code schreiben NUR Subagenten (model opus fuer Code, sonnet fuer Research/Mechanik), Executor in isolierten Worktrees (lokaler Checkout traegt fremde Parallel-WIP, NIE fremde Dateien stagen).

## Stand (Go-Live vollzogen 12.08. frueh/vormittags)
- Neue Site LIVE auf web.redrabbit.media (main = 0fffac1: Go-Live-Merges 80a02cb + Bot-Artikel). relaunch = 2d05f61.
- Apex redrabbit.media + www: Vercel-308 auf web.redrabbit.media (IONOS A-Records auf 216.198.79.1, Mail-Records unangetastet), live verifiziert.
- Verifiziert waren bereits: Kernseiten 200 + index,follow, Redirect-Map (Staedte/Branchen/alte Leistungs-Unterseiten/relaunch-preview), Sitemap 82 URLs, Consent-Script + GTM im SSR, Draft-Artikel 200+noindex, Testmail 200 via IONOS, IndexNow 202, GSC-Sitemap + 3 URL-Pruefungen, Home-Titel-Fix + Canonicals.

## MISSION: Kompletter Gegencheck durch FRISCHE Augen (nichts glauben, alles messen)
1. **Live-Sweep ueber ALLE 82 Sitemap-URLs** (Agent, curl): Status 200, title vorhanden und nicht Platzhalter, meta robots index,follow (ausser bewusste noindex), canonical korrekt auf web.redrabbit.media/<pfad>, og:image erreichbar. Abweichungen als Tabelle.
2. **Redirect-Sweep**: alle 87 alten Sitemap-URLs (docs/SEO_GEO_AUDIT... bzw. alte sitemap in Session-Notizen; sonst Liste aus next.config.ts Redirects + alte Slugs) -> erwartetes Ziel, keine Ketten, keine 404. Plus Apex/www/http-Varianten -> 308 auf web.
3. **noindex-Kontrolle**: /leistungen und /leistungen-hub, Varianten-/Testseiten (menue-varianten, talos-*, styleguide, design-system, morph-lab, sculpture-test, subpage-hero-test), Draft-Artikel: ALLE noindex? Und NICHT in sitemap.xml?
4. **Funktions-Checks im Browser**: Kontakt-Popup absenden (Testdaten, Mail-Eingang office@ pruefen lassen), Cookie-Banner erscheint + "Alle akzeptieren" laedt GTM/Clarity (Netzwerk-Tab: clarity.ms erst NACH Zustimmung), Talos-3D laedt, Menue/Footer-Links klicken (keine 404, Leistungs-Hub NICHT verlinkt).
5. **Schema-Check**: JSON-LD auf Home/Preise/Wien/Artikel parsen (Organization/Service/FAQPage/BreadcrumbList/Article valide, KEIN aggregateRating ausser lib/reviews-Bestand).
6. **Diff-Check Code**: grep -rn "relaunch-preview" app components lib (nur Kommentare erlaubt); grep 790 (nur erlaubte Stellen: keine); Preise 1.250/2.850/ab 4.900 auf /preise sichtbar.
7. **Artikel-Automatik**: naechster Bot-Lauf (07:53 taeglich) gruen? Freigabe-Link aus Review-Mail funktioniert (Draft 200 + noindex), nach Freigabe wird Artikel indexierbar?
8. **GSC/Bing-Nachlauf**: GSC Coverage auf neue 404/Soft-404 pruefen, weitere Kernseiten per URL-Pruefung anstossen (Kontingent!), Bing Webmaster Tools mit Thomas anmelden (IndexNow-Key liegt), GBP-NAP checken.
9. **Befund-Report an Thomas**: gruen/gelb/rot Tabelle, Fixes nur nach Standard (Opus-Executor, Worktree, tsc+eslint+build, push relaunch UND main nachziehen).

## Offene Thomas-Punkte (erinnern, nicht selbst entscheiden)
- Abnahmen auf seinem Geraet: Talos-USP-Wortlaut (Home/Ueber-uns), Wien-Seite (Mobile+3D), Cookie-Banner-Optik, /preise-Kernantwort.
- GF + Beteiligungsverhaeltnisse fuer Offenlegung; LinkedIn linkedin.com/in/thomasuhlir bestaetigen (sameAs).
- 8 Bundesland-Titles ueber 60 Zeichen: kuerzen oder lassen?
- BaFG-Artikel draft lassen oder freigeben.

## Landminen
- Lokaler Checkout ~/dev/redrabbit: fremde Parallel-WIP (faq/page.tsx, SiteClosing.tsx, faq-demo, styleguide.css u.a.) NIE stagen; Arbeit nur in frischen Worktrees von origin.
- KEIN npm run build bei laufendem next dev. Vercel-Builds brauchen 15-20 Min (VERCEL_SUPPORT_LARGE_FUNCTIONS=1 aktiv; dashboard-Route 1 GB = spaeterer Aufraeum-Punkt).
- generate_lead-Event fehlt noch in LeadDialog.tsx (fremde WIP-Datei) — nachziehen sobald deren Stand committet ist.
- v2.redrabbit.media lebt noch als Testdomain (noindex-Header) — spaeter stilllegen.
- IONOS "Verwendungsart Weiterleitung" ist unzuverlaessig — Apex-Sachen immer ueber Vercel-Domains.
