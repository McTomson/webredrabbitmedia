# Naechste Session — Leistungen/Website-Unterseite (2026-07-22)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## Scope-Abgrenzung
- MEINE Seite = NUR /relaunch-preview/leistungen/website (+ deren Varianten-Vorschau-Routen).
- Der Hub /relaunch-preview/leistungen gehoert einem ANDEREN Strang (Ausnahme: KundenSagen.tsx ist geteilt, Aenderungen dort betreffen beide — war von Thomas so beauftragt).
- Working Tree geteilt mit Fremd-Straengen (talos-choreo, preise-preview, PNGs etc.) — NUR eigene Dateien committen.

## Stand dieser Session (Feedback-Runden 2-4, alle Commits LOKAL auf Branch relaunch, nicht gepusht)
Commits: e15914a, 7b21aba (Runde 2 + review-it GO), 42dde8c, 9215152 (Runde 3 Promotion),
57a1787 (Runde 4), 98aca30 (Talos-Wink-Fix). QA je Runde: tsc gruen, vitest 168/168,
Browser-Durchlaeufe, Konsole sauber. review-it-Protokoll: docs/reviews/website-feedback2-e15914a.md.

**Live-Seite ist jetzt:** Hero (Zahnrad, roter Mal-Punkt, 19vw) → Belief-Bumper → SoBauenWir →
Diagnose (Teal-Quiz, Hover-Fuellung #0f5a63 + Pfeil) → Ablauf (Kreis-Kette, Text tiefer) →
Fundament Sticky-Ledger (WEISS, rote Punkte) → **DreiStufenMatrix** (Stufen-Variante B, sticky
Stufe + 2-Spalten-Merkmale aufklappbar, Business MEISTGEWÄHLT) → **TalosDashboard** (Dashboard-
Variante A: Navy-Browser-Frame, Klicks-Panel als normales Panel unten rechts, Talos rechts/tief
mit sichtbaren Fuessen, erscheint NACH dem Dashboard, winkt bei Entrance UND Klick mit dem
Gegen-Arm) → KundenSagen (weiss, Google-G, Crossfade, Rot-Filter-Avatare) → ReferenzenTeaser →
FAQ → SchlussCta. Alle 9 Sektions-Eyebrows im "(...)"-wd-eyebrow-Stil.

**TalosEntranceStage-API (additiv, Defaults = alle anderen Talos-Seiten unveraendert):**
`waveOnClick`, `greetArm ("primary"|"other")`, `autoplayDelayMs`, `camPos/camTgt/camFov`.
TalosDashboard nutzt: waveOnClick, greetArm="other", autoplayDelayMs={900},
camPos=[30,190,1150], camTgt=[0,140,12]. QA-Hooks: __talosEntrance.wave()/wave2()/isWaving()/camera.
WICHTIGE LESSONS: (1) Default-Kamera rahmt nur den Oberkoerper — Ganzkoerper braucht eigene
cam-Werte; Slot-CSS aendert NICHTS an der vertikalen Kadrierung (FOV fix). (2) Der Gegen-Arm
(arm/elbow/forearm/Hand) haengt an einer bereits X-gespiegelten Modell-Instanz — fuer die
Spiegel-Geste IDENTISCHE lokale Offsets wie der Primaer-Arm verwenden, NICHT negieren
(Doppel-Spiegelung = Hand kippt falsch).

## Offen / Naechste konkrete Schritte
0. ERLEDIGT 22.07. (Runde 5, Commit 3f90b9a): Kreis-Wahl obsolet — Thomas behaelt die Kreise,
   neu: 1px-Navy-Hairline (rgba(28,40,55,.30)) in ALLEN Zustaenden + 400vh Scroll-Strecke
   (ein Scroll je Schritt) + Intro unter der Ablauf-Ueberschrift. Ausserdem: SoBauenWir-Copy neu,
   DreiStufen-Kopf zu Starter/Business/Premium, SchlussCta ("klingelt", Anrufen statt Preise,
   mehr Luft), Fundament Off-White #f6f5f1, Eyebrow-Klammern als ::before/::after (Literale raus),
   __talosEntrance instanz-sicher, KundenSagen: Rene-Zitat 1:1-Wortlaut. WICHTIG Rezensionen:
   Google-Profil hat nur 3 (2 verwendbar, Dmitry=Team nie als Kundenstimme); positioning.md korrigiert.
   OFFENE THOMAS-THEMEN aus Runde 5: Starter-Inhalt/Monatskosten der Module (Preise NIE erfinden,
   gemeinsamer Copy-Durchgang steht aus); Vorschlaege Founder-Element + frueheres Vertrauenssignal
   liegen unbeantwortet.
2. Danach Varianten-Aufraeumen (nach Thomas-OK): Routen fundament-/stufen-/dashboard-/ablauf-/
   diagnose-/kreise-varianten + alte DreiStufen.tsx/KollegeAnreisser.tsx/Testimonials.tsx/
   Fundament.tsx entfernen. Die ablauf-varianten (Zahlen-Stack/Sticky-Split/Band) und
   diagnose-varianten (Typo/Bogen/Split) wurden NICHT gewaehlt — Thomas will Kreise behalten
   und Diagnose-Layout behalten; Routen existieren noch als Fundus.
3. Review-Vormerkungen (docs/reviews/website-feedback2-e15914a.md): Eyebrow-Klammern als
   ::before/::after robuster machen; __talosEntrance nicht instanz-namespaced (nur QA-relevant).
4. Deploy-Preview (vercel deploy --yes) steht aus — Thomas hat bisher nur lokal abgenommen.
5. Nicht gepusht — bewusst, wie im ganzen Relaunch-Strang.

## Blocker / Risiken
- Keine. Dev-Server: cd ~/dev/redrabbit && npm run dev -- --port 9000 (Thomas beendet ihn
  gelegentlich — vor Browser-Checks pruefen).

## Relevante Dateien/Befehle
- Seite: app/relaunch-preview/leistungen/website/page.tsx
- Sektionen: components/subpages/leistungen/website/v2/ (DreiStufenMatrix, TalosDashboard,
  Ablauf, Diagnose, SoBauenWir, fundament-varianten/VarianteA=Fundament) + ../KundenSagen.tsx (geteilt!)
- Talos: components/relaunch/talos/{TalosEntranceStage.tsx,talosMotion.ts}
- Kreis-Designs: components/subpages/leistungen/website/v2/kreise-varianten/KreiseVarianten.tsx
- tsc: npx tsc --noEmit · Tests: npx vitest run · Eyebrow-Stil: website.css (.wd-eyebrow)
