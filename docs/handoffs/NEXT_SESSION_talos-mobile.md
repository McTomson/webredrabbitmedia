# Naechste Session — TALOS-Seite MOBILE + TABLET (08.08.2026)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft.
- Autonom handeln, voller Zugriff inkl. Browser (Grenze: kein Botschutz-Umgehen, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Geteilter Branch `relaunch`: vor Arbeit `git fetch` + `git log -15`; NUR eigene Dateien mit explizitem Pfad stagen (NIE `git add .`/`-u`). Fremde WIP nie anfassen (M: faq/page.tsx, SiteClosing.tsx, faq-demo/demo.body.html, NEXT_SESSION_leistungen.md, seo-monitor-log.md).
- Keine Emojis; echte Umlaute in User-Content, ASCII in Shell/Commit/Code-Kommentar. Kein Wort "gratis", kein Fachjargon (KMU/SEO/Analytics) in sichtbaren Texten.
- Deploy: git push -> v2-Auto-Deploy LEBT (baut selbst + setzt v2-Alias). NIE `vercel --prod`. Online nur bei `vercel inspect` Ready melden. Kein `npm run build` bei laufendem dev.
- WICHTIG Umgebung: MCP-Browser + agent-browser FRIEREN auf der Talos-3D-Seite regelmaessig ein; localhost hat im QA-Chrome gespeicherten Zoom (~55%, innerWidth != Fensterbreite). Mobile-QA daher: eigene Wege suchen (z.B. Companion ist <900px eh AUS -> mobil weniger Freeze-Risiko) und finale Abnahme IMMER Thomas am Geraet (Screenshots schicken lassen).

## Aufgabe dieser Session
Die umgebaute Talos-Seite (`app/relaunch-preview/leistungen/talos/page.tsx`) fuer MOBILE + TABLET fertig machen: alle neuen Sektionen pruefen/tunen, nichts abgeschnitten, nichts ueberlappend, Reihenfolge + Lesbarkeit gut. Thomas gibt ggf. konkrete Punkte zu Beginn.

## Stand der Vorsession (07.08. spaet, HEAD `f10fe26` == origin, live auf v2)
Talos-Pivot "Kommandozentrale" KOMPLETT gebaut + von Thomas iterativ abgenommen (Desktop). Seiten-Aufbau jetzt:
1. Hero-Strecke (unveraendert, 1 Story-Absatz neu)
2. KennstDuDas (5 Serif-Fragen)
3. WerIstTalos (Kommandozentrale-Antwort; Station back)
4. Bereiche: 9 Karten in 3 Gruppen (machen 2 / wissen 4 als 2x2 / gefunden 3) — `Bereiche.tsx` + `bereiche-data.ts`
5. Kontrollraum (Panels = Bereichs-Namen; Station front wink)
6. WertAnker (Navy-Rechnung + Haken-Klaerung)
7. **TalosPanorama** (NEU): horizontale 2-Fenster-Fahrt VorherNachher -> TalosTest (Klon CasePanels-Mechanik; degradiert <=820px zu vertikal — MOBILE-VERHALTEN PRUEFEN!)
8. Faehigkeiten (Grid + Modal)
9. TalosFaqV2, SiteClosing (Station anchor 0.8 size s wave), Footer
GESTRICHEN (Thomas): FreigabePrinzip, Onboarding, FragTalosAnmoderation, Beweis + InklusiveDashboard (Dateien liegen noch, Aufraeum-Etappe).
Fixes: Cursor-Punkt z-index 100000 (war unter Lead-Popup 10000); Wave-Hand auf "primary" gedreht; SiteClosing Talos rechts klein.

## Mobile-/Tablet-Checkliste (bekannte Punkte)
1. **TalosPanorama degraded** (<=820px): beide Sektionen vertikal — visuell pruefen (Abstaende via .tl-pan--flat).
2. **Bereiche-Gruppen**: mobil 1 Spalte (tl-br__grid + --2 -> 1fr unter 768px) — Kartenhoehe/says-Zeilen pruefen.
3. **WertAnker-Tabelle**: unter 560px eine Spalte (Preis unter Posten) — Lesbarkeit.
4. **KennstDuDas/VorherNachher/Quiz**: clamp-Groessen auf schmal pruefen.
5. **Companion/3D**: <900px ist der Companion AUS (bekannt) — Hero nutzt mobil Video/Poster (talos-hero-poster.jpg preload <=1024px). Stationen irrelevant mobil.
6. **Kontrollraum**: <=860px stage-void wird 140px-Streifen unten — ggf. mobil ausblenden?
7. Tablet 769-1180: Bereiche 2-spaltig; Panorama aktiv (>820) — Fahrt auf Tablet testen (Touch!). Memory: Scroll-Antrieb ist positionsbasiert (touch-tauglich, wie CasePanels auf Mobile bewiesen).
8. Lead-Popup mobil: Cursor-Thema irrelevant (Touch), aber Oeffnen/Scrollen im Popup pruefen.

## OFFEN aus Thomas' Feedback-Runde (nicht mobile, gelegentlich)
- Copy Wort-fuer-Wort-Korrekturen durch Thomas (bereiche-data.ts, FAQ auf neue Story nachziehen + kuerzen).
- Beweis-ERSATZ: 1 Satz Vertrauens-Anker an bestehender Stelle (Vorschlag: Kontrollraum-says "Diese Seite hier laeuft uebrigens schon mit mir.") — Thomas hat noch nicht entschieden.
- Bumper-CTA im Hero sagt "Hol dir den kostenlosen Entwurf" (Website-CTA) — auf Talos-Kontext drehen?
- VorherNachher: Preisaenderungs-Beispiel kommt 3x auf der Seite (Kennst du das? / Karte Inhalte / VorherNachher) — eine Stelle austauschen.
- WertAnker-Marktpreise vor PRODUCTION-Go-Live einzeln belegen.
- Aufraeum-Etappe: ungenutzte v2-Dateien (FreigabePrinzip, Onboarding, FragTalosAnmoderation, Beweis, InklusiveDashboard, TalosHeroPlaceholder) + toter tl-ink-*-CSS-Block.

## Relevante Dateien
- Seite: app/relaunch-preview/leistungen/talos/page.tsx
- Sektionen: components/subpages/leistungen/talos/v2/{KennstDuDas,Bereiche,bereiche-data,Kontrollraum,WertAnker,TalosPanorama,VorherNachher,TalosTest,WerIstTalos,Faehigkeiten,TalosFaqV2}.*
- Styles: components/subpages/leistungen/talos/v2/talos-v2.css (Ownership-Datei; Namespaces tl-kd/tl-br/tl-wa/tl-vn/tl-qz/tl-pan)
- Hero: components/subpages/talos-demo/ (demo.body.html Story), Mobile-Poster /hero/talos-hero-poster.jpg
- 3D: components/relaunch/talos/{TalosCompanionStage.tsx (Stationen + Gesten), talosMotion.ts}
- Horizontal-Vorbild: components/relaunch/CasePanels.tsx (dort ist auch das MOBILE-Verhalten der Fahrt vorgemacht: bleibt horizontal, positionsbasiert)
- Review-Log: docs/reviews/talos-pivot-kommandozentrale-2026-08-07.md; Dev: `npm run dev -- --port 9000`
