# NEXT_SESSION — Relaunch v2 (Site-Vereinheitlichung + Scroll-Gefuehl)

Stand: 29.07.2026 ~02:15, letzter Commit `4a6d592` (ALLES LIVE auf v2, verifiziert).

## Wo wir arbeiten
- **Ordner:** `~/dev/redrabbit` — **Branch `relaunch`** (geteilt). Vor Arbeit: `git fetch` + `git log --oneline -8`.
- **Live-Test:** https://v2.redrabbit.media/ (Branch-Domain, no-store; normales Reload zeigt frisch).
  Homepage = app/relaunch-preview/page.tsx, via middleware an der Wurzel. web.redrabbit.media = alte Live-Site, TABU.
- **KANONISCH: `docs/DESIGN_STANDARD.md`** — die EINE Quelle (Farben, 2 Buttons, ( Thema )-Eyebrow,
  Abstaende, Bumper, Soft-Snap, Mobile-Regel). Herleitung: docs/handoffs/PLAN_vereinheitlichung_2026-07-28.md.

## Was heute Nacht passiert ist (28.07. abends - 29.07. frueh)
1. Site-Vereinheitlichung komplett (af064de): ein Off-White #F4F4F2, Navy-Reste weg, nur noch
   rr-btn-sweep + rr-btn-outline (+--light auf dunkel; rr-btn-frame GELOESCHT), ( Thema )-Eyebrow
   ueberall (.rr-eyebrow-theme, Klammern aus CSS), Menue ohne Eck-Klammern (roter Punkt-Hover),
   CornerLogo ab 2 Viewport-Hoehen, geteiltes SiteClosing (Texte: brand/copy-closing-cta.md;
   letzte Zeile mit rotem Punkt + Pause) + echte FooterReassembly ueberall (Demo-Nachbauten raus),
   Abstaende auf --rr-section-y (Zwei-Klassen-Regel), zentrales lib/relaunch/scroll-standard.ts.
2. Soft-Snap site-weit (4659bd7): components/relaunch/ScrollExperience.tsx auf ALLEN Seiten,
   data-rr-snap an Sektionen / data-rr-snap-exempt an Sticky-Strecken; Homepage teilt die
   HomeMorph-Lenis via window.__rrLenis. Boot per setTimeout (rAF friert in Hintergrund-Tabs!).
3. Feedback-Runde 2 (e9cc58f): lerp 0.065 site-weit, Snap 35%/1.1s; /leistungen/website:
   Diagnose-Quiz lesbar (hell + dunkle Schrift), Off-White-Wechselrhythmus (Zuordnungstabelle im
   page.tsx-Kommentar), 12-Punkte-Ledger = gepinnte Halte-Strecke (~142vh/Punkt, snapUnits).
4. Figuren-Tempo (4a6d592): 6 Demo-Heroes 1150vh -> 1600vh (+39%), Homepage-Morph U_SPAN*260
   (+73% ggue. Original). Talos-Abgang 2400vh unveraendert.
5. Preise: ScrollBumper hell + label="Was du bekommst"; Starter-Fenster startet offen
   (PreiseMatrix + DreiStufenMatrix, defaultActive erste Stufe).

## OFFEN (Thomas' Abnahme steht KOMPLETT aus)
- Thomas hat den Stand nach 4a6d592 noch NICHT visuell bestaetigt. Erste Frage an ihn:
  Scroll-Tempo/Einrasten/Figuren-Tempo jetzt gut? Stellschrauben: ScrollExperience.tsx
  (SITE_LERP 0.065, CATCH_RATIO 0.35, SNAP_DURATION 1.1), Demo-Hoehen, U_SPAN-Faktor.
- EINE Seite hat laut Thomas noch WEISSEN Grund statt Off-White — Screenshot ging verloren,
  Seite unbekannt. Ihn fragen welche, dann fixen (Muster: leistungen/website/page.tsx-Rhythmus).
- Talos-Talente-Fahrt: eigene Slide-Eyebrows, noch keine ( Thema )-Zeile. TalosCta.tsx verwaist.
- Mobile-Degradation nur code-verifiziert — Geraete-Test bei Abnahme.

## Arbeitsmodus (von Thomas festgelegt)
- AUTONOM bis fertig: Fable orchestriert, Agenten bauen (Sonnet mechanisch, Opus komplex),
  ALLES selbst verifizieren (tsc, grep-Beweise, Browser lokal Port 9000, Live-Marker).
  Nicht stoppen und fragen, ausser bei echten Entscheidungen. Grill-me fuer neue Vorhaben.
- TOKEN-SPAREND: kein TaskOutput-block auf Agenten (Transkript-Dump!), auf Notifications
  warten (kostet 0), grep/curl statt Datei-Lesen, wenige gezielte Screenshots.
- Design-/Scrollfragen: NN/g-Recherche liegt vor (Soft-Snap statt hartem Trapping, nie
  Fliesstext im Snap, 1 Viewport/Panel, ein Tempo site-weit).

## Fallen (teuer bezahlt, nicht wiederholen)
- git: NUR `git add -u` + explizite neue Dateien; docs/seo-monitor-log.md + NEXT_SESSION_leistungen.md
  NICHT committen (fremd modifiziert). ~74 fremde untracked WIP-Files.
- Dev-Server Port 9000: nach Massen-Edits ggf. korrupt (Tailwind/styled-jsx fehlen) ->
  kill + rm -rf .next + neu starten. KEIN npm run build waehrend dev laeuft. Max EIN tsc
  (8 GB RAM, Parallel-tsc = Swap-Tod).
- Browser-QA: Hintergrund-Tabs frieren rAF ein (Morphs/Lenis/Stepper wirken tot; Snap-Fahrt
  laeuft nicht) — rAF-Strecken nur im sichtbaren Tab beurteilen.
- Screenshots: Thomas' Bilder liegen in ~/Screenshots (defaults: location=~/Screenshots,
  show-thumbnail=false — REVERTIERT manchmal! Dann wieder setzen + killall cfprefsd).
  Bei gepastetem NSIRD-Temp-Pfad: ls -t ~/Screenshots/*.png | head; Altbestand in
  ~/Screenshots/rescue/. NIE aus der Vorschau-Ecke ziehen lassen.
- Write-Tool-Falle dieser Session: NEU erstellte Dateien AUSSERHALB des Repos verschwanden
  teils wieder — kritische Dateien per Bash-Heredoc + ls-Verifikation.
- Live-Check IMMER mit EINDEUTIGEM Marker + Hintergrund-until-Loop (Muster in dieser Session).
