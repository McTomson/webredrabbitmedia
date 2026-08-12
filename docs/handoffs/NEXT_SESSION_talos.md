# Naechste Session — TALOS-Leistungsseite

## >>> STATUS-UPDATE 07.08. spaet: PIVOT KOMMANDOZENTRALE GEBAUT + LIVE AUF v2 <<<
- **Thomas' Pivot:** Talos = Kommandozentrale der Website (WordPress-artig selbst aendern + Bereiche mit Auto-Daten: Besucher, Klicks/Heatmap, Google-Suchbegriffe, KI-/ChatGPT-Sichtbarkeit, Bewertungen, Technik, Anfragen; Assistent/LLM = Phase 2 "Kommt bald"). Ziel-APIs: null Wartung, aktualisiert sich selbst; Setup-Modell: WIR legen Gmail/Zugaenge an. Konzept-Artifact freigegeben, Copy in Thomas' Ton.
- **GEBAUT + committed `a636ba7` (auf `b82c300`), live auf v2** (git-Auto-Deploy LEBT WIEDER, Build ly0onnjcg, per Inhalt verifiziert): Seite neu = Hero (unveraendert, nur 1 Story-Absatz) -> KennstDuDas (NEU) -> WerIstTalos (umgetextet) -> Bereiche 9 Karten (NEU, Herzstueck; ChatGPT-Karte "Das hat sonst fast keiner" — NICHT "keiner", UWG!) -> Kontrollraum (Panels=Bereiche) -> WertAnker (NEU, Navy-Rechnung "ueber 2.000 EUR" + Haken-Klaerung) -> VorherNachher (NEU) -> TalosTest (NEU, 3-Fragen-Quiz) -> Faehigkeiten -> Bestand. InklusiveDashboard raus (Datei liegt noch, Aufraeum-Etappe).
- **Review-it GO** (docs/reviews/talos-pivot-kommandozentrale-2026-08-07.md); tsc+Lint gruen; Desktop-QA komplett (Quiz, Lead-Popup preset talos, Companion-Stationen intakt).
- **OFFEN:** (1) Thomas-Abnahme am Geraet, v.a. MOBILE/TABLET visuell (MCP-Browser friert/crasht auf der 3D-Seite — Breakpoints 3->2->1 nur per Code-Review geprueft); (2) Wort-fuer-Wort-Korrekturen der Copy durch Thomas (bereiche-data.ts!); (3) WertAnker-Marktpreise vor PRODUCTION-Go-Live nochmal gegen Anbieter belegen; (4) spaeter: echtes Dashboard-Produkt bauen (Tier A+C zuerst; Gemini-Flash-Gratis-Tier fuer Assistent, Kundendaten nur Bezahl-Pfad wegen Training-Klausel).

## Alter Kontext (Vorsession)
- **Aufgabe war:** Wir bearbeiten die Talos-Seite weiter. Erst zuhoeren, dann Plan (TodoWrite), dann tun.
- **ZUERST LESEN:** dieser Handoff komplett (v.a. der rAF-Freeze-QA-Block unten — spart massiv Zeit), MEMORY.md, und die Talos-Memories: `project_talos_leistungen_3d_2026_07_17`, `reference_talos_companion_stage_kanonisch`, `reference_talos_kopf_zum_user_und_qa_tick`, `reference_talos_entrancestage_kamera_spiegelung`, `project_redrabbit_sales_onepager_talos`.
- **Seite/Routen:** Haupt = `app/relaunch-preview/leistungen/talos/page.tsx`. Weitere Talos-Routen existieren (talos-choreo, talos-demo, talos-entrance, talos-intro) — vor Aenderung klaeren welche gemeint ist.
- **Kontext erledigt:** Die Lead-Popups + IONOS-office@-Mailversand sind FERTIG und live auf v2 (Marken-Dropdown `LeadSelect.tsx`, kraeftiger CTA, E-Mail verifiziert). Nur Go-Live auf Production offen (Thomas-Entscheidung). Siehe `NEXT_SESSION_lead-popups.md`. Nicht mit Talos vermischen.

## DEPLOY-METHODE (WICHTIG, 07.08. geaendert)
- **git push -> v2 Auto-Deploy war ausgefallen** (nach manuellem `vercel --prod` + Host-Settings-Aenderung baute Vercel fuer neue `relaunch`-Pushes keine Preview mehr). NAECHSTE SESSION: erst pruefen ob's wieder von selbst baut (kleiner Push, `vercel ls` beobachten). Falls nicht, zuverlaessiger Workaround:
  1. `git worktree add --detach <tmp-dir> <sha>` (sauberer Stand, fremder WIP bleibt draussen),
  2. `.vercel/project.json` in den Worktree kopieren,
  3. dort `vercel deploy --yes` (Preview, baut in der Cloud), Preview-URL merken,
  4. `vercel alias set <preview-url> v2.redrabbit.media`, danach Worktree `git worktree remove --force`.
- **NIE `vercel --prod`** (trifft die LIVE-Seite web.redrabbit.media). Online-Meldung nur bei `vercel inspect <url>` Status **Ready**.
- Waehrend der 07.08.-Session lief ein manueller Production-Build unter Thomas' Account (nicht von mir) — im Zweifel rueckfragen bevor an Production etwas passiert.

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/Browser). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst Plan (TodoWrite), dann ausfuehren. Skills + parallele Sub-Agenten wo sinnvoll; verschiedene LLM je Aufgabe.
- Autonom, voller Browser-Zugriff. Committen/pushen/deployen erlaubt (Preview, NIE prod). Deploy NUR mit
  `vercel inspect <url>` Status **Ready** als "online" melden (SSO-302 luegt).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" ohne verifiziertes Ergebnis.

## WICHTIG — QA bei eingefrorenem rAF (spart viel Zeit)
Der Companion laeuft ueber `renderer.setAnimationLoop` (rAF). Im MCP-/Hintergrund-Tab FRIERT rAF ein,
UND die Scroll->Fortschritt-Quelle friert ein. Loesungen:
- Hero: `window.__talosCompanion.setProg(p)` erzwingt die Hero-Pose; `tick(1/60, steps)` treibt Frames.
- Stationen: laufen ueber DOM-Rects -> `setProg(null)` + `scrollTo(y)` + `tick(1/60, ~300)` funktioniert.
- **QA-Pin NIE im User-Tab lassen** (`setProg` nagelt die Pose fest -> User sieht Falsch-Pose). Immer
  einen SEPARATEN Tab fuer QA-Pinning; danach `setProg(null)` + Reload. Hooks: state()/rig()/stations()/tick().

## STAND — erledigt + verifiziert + DEPLOYT (Preview)
Commits auf origin/relaunch: 249b190 (Kopf-zum-User 0.5 + Faehigkeiten-Popup) -> 974dfc9 (Companion-Choreografie).
tsc gruen, review-it GO. Letzter Preview-Deploy per `vercel inspect` Ready (Link im Chat).

### Companion-Choreografie (page.tsx data-talos-station + TalosCompanionStage.tsx)
- `appear` (data-talos-appear) = Zentriertheits-Schwellwert: Station aktiv erst wenn `bestScore >= appear`
  (TalosCompanionStage.tsx:318). Hoeher = spaeter/zentrierter erscheinen.
- Stationen (Reihenfolge): WerIstTalos (anchor .78, l, back, appear .5) -> [FreigabePrinzip+Onboarding OHNE]
  -> Kontrollraum (.7, m, front, appear .55, wink) -> Beweis (.8, m, front, appear .45) -> FragTalos (.82, m,
  front, appear .45) -> [FAQ ohne] -> SchlussCta (.17, sm, front, wave).
- Gewuenschtes Verhalten (Thomas Bilder 53-56, verifiziert): weg bei FreigabePrinzip/Onboarding, erscheint erst
  am Kontrollraum, sichtbar durch Beweis + FragTalos, faengt bei FragTalos an zu verschwinden.
- Beweis + FragTalos + Kontrollraum = **front** (nicht back): sonst schneidet der Navy-Frame/das Blau beim
  Uebergang den Koerper an (Body-Cut-Bug, Bild 48-51 behoben).

### Weitere Werte
- Kopf schaut immer den User an: `userLookYaw` netto ~0.5 (USER_LOOK 0.5, REF 0.35), gespiegelt links/rechts.
  Dezent 0.2 war "wieder falsch". STAND_BIAS 0.24.
- SIZE_Z: s -420, sm -200, m **-150**, l **40**, xl 220 (m/l eine Spur kleiner).
- Hero-Abgang: scene-main 2400vh.
- Doppelklick auf Talos -> zyklische Geste (Winken/Nicken/Zwinkern/Verbeugen/anderer Arm). window-dblclick +
  projizierte X+Y-Trefferbox (Canvas pointer-events:none). GESTURES-Array in TalosCompanionStage.tsx.

### Faehigkeiten-Popup (Faehigkeiten.tsx + faehigkeiten-data.ts)
Wie Website-"Drei Pakete" (DreiStufenMatrix): links Name + Tagline, rechts "Das kann er konkret" = konkrete
Faehigkeiten (je 6) als Klick-Akkordeon mit +/x-Zeichen; Trennlinie; "Beschreibung" = ZWEI getrennte
Spalten-Akkordeons (Detail bleibt in Feldbreite, spannt NICHT ueber beide). Kein 01/06, Modal rechteckig
(960px), alles eingeklappt per Default. Invers-Karte (Sonderanfertigung) navy/tuerkis.

## OFFEN / naechste Schritte
1. Thomas-Abnahme des 24.07.-Stands. Feel-Checks: Groesse ("eine Spur kleiner" ok?), Doppelklick-Geste,
   Abgang-Tempo (2400vh), und ob das Verschwinden bei FragTalos exakt genug "dort beginnt" (ggf. appear/Fade
   feiner tunen).
2. **Faehigkeiten-Copy ist ENTWURF** (kurz + koennen[], je 6, aus der Rolle abgeleitet) -> Thomas korrigiert
   Wort fuer Wort in faehigkeiten-data.ts.
3. Aufraeumen nach OK: ungenutzte alte Talos-Sektionen/Routen (siehe frueherer Handoff-Punkt).
4. Mobil-Konzept fuer den Companion (<900px aktuell aus).
5. Talos-Modulpreise: Thomas nennt, nie erfinden.

## Relevante Dateien
- Engine: components/relaunch/talos/{TalosCompanionStage.tsx, talosMotion.ts, talosRig.ts}
- Seite/Stationen: app/relaunch-preview/leistungen/talos/page.tsx
- Sektionen: components/subpages/leistungen/talos/v2/*.tsx (+ talos-v2.css), faehigkeiten-data.ts
- Vorbilder (Klone): components/relaunch/KundenGrid.tsx, components/subpages/leistungen/website/v2/{Diagnose,DreiStufenMatrix}.tsx
- Hero-Demo: components/subpages/talos-demo/{demo.body.html, demo.css, demo.engine.jstext}
- Review-Logs: docs/reviews/talos-*.md
- Dev: `npm run dev -- --port 9000`. Kein `npm run build` bei laufendem dev.
- Geteilter Branch relaunch: vor Push `git fetch`/`ls-remote`, nur eigene Talos-Dateien stagen (NICHT
  seo-monitor-log, preise-*, brand/, Root-PNGs).
