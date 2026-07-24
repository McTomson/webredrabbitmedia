# Naechste Session — TALOS-Leistungsseite (Stand 24.07.2026, spaet)

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
