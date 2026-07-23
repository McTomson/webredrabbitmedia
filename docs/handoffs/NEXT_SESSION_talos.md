# Naechste Session — TALOS-Leistungsseite (Stand 23.07.2026 mittags, nach Feedback-Runde 1)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, docs/specs/TALOS_COPY_V2_2026-07-22_ENTWURF.md
  (inkl. REVISION-Block am Ende), MEMORY.md, die betroffenen Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/Browser/Docs). Bei Unsicherheit fragen oder fail-closed.
- Erst Plan (TodoWrite), dann ausfuehren. Bei Design-Fragen Optionen VISUELL zeigen.
- **DESIGN MACHT FABLE SELBST** (Thomas 23.07. woertlich: "am besten ist wenn du das design
  uebernimmst nicht sonnet oder opus"). Agenten NUR fuer: 1:1-Klone abgenommener Mechaniken
  (exakte Vorbild-Datei nennen!), Copy-Rohfassungen (Opus), mechanische Sweeps. Fable prueft alles.
- Autonom arbeiten, voller Browser-Zugriff; committen/pushen/deployen erlaubt (Preview, NIE prod).
  Deploy NUR mit `vercel inspect <url>` Status **Ready** als "online" melden (SSO-302 luegt).
- QA im AKTIVEN Chrome-Tab (Hintergrund-Tab friert rAF ein -> osascript aktivieren; nach
  scrollTo(instant) hinkt __sculptProgress nach, Engine glaettet -> echte Wheel-Ticks nutzen).
- Copy-Regeln: echte Umlaute, kein "KI" (Talos = digitaler Mitarbeiter/Kollege), Du-Anrede,
  kein Gedankenstrich, keine Emojis, border-radius 0 (rund nur Punkte/Kreise/Donut), Preise
  NIE erfinden (Website 950/2.900/ab 4.900 existieren; Talos-Faehigkeits-Preise = Preisseite,
  auf dieser Seite NUR die Logik monatlich/einzeln/kuendbar), Telefon nur tel:-Button,
  Eyebrow-Klammern via .wd-eyebrow-CSS. ALLE Copy ist ENTWURF bis Thomas freigibt.
- Dev: nohup npm run dev -- --port 9000 (Thomas beendet ihn gelegentlich; Log /tmp/redrabbit-dev-9000.log).
- Fremde Straenge NICHT committen (seo-monitor-log, brand/, preise-preview, PNGs im Root...).

## ARCHITEKTUR (steht, NICHT neu erfinden — Thomas hat sie iterativ geformt)
1. **Seite**: app/relaunch-preview/leistungen/talos/page.tsx. Sektionen in
   components/subpages/leistungen/talos/v2/ (+ talos-v2.css). Chrome = RelaunchMenu +
   CornerLogo + FooterReassembly (kanonisch, nicht anfassen).
2. **Hero** = Klon-Ordner components/subpages/talos-demo/ (demo.body.html/.css/.engine.jstext),
   gerendert von components/subpages/TalosDemoClient.tsx (nur CSS+HTML+Engine-Script, KEIN Portal).
   Ablauf: Wort "Talos" + Mal-Erklaerzeile -> Buchstaben fliegen weg -> Talos GEHT scroll-
   gekoppelt von links rein -> dreht sich, winkt rechts -> Navy-Dashboard-Fenster (.tlh-frame,
   1:1-Klon des wda-Fensters, sichtbar via Klasse `is-dash` auf #mainSticky) -> Story-Text
   laeuft MASKIERT IM weissen Feld rechts -> Abgang rechts. Scene-Main 1495vh (bewusst langsam).
   HERO_MODE="fly" existiert als Schalter in TalosCompanionStage, falls Thomas Gehen ablehnt.
3. **Companion** = components/relaunch/talos/TalosCompanionStage.tsx — EINE fixe 3D-Ebene fuer
   die GANZE Seite (Talos begleitet wie /talos-intro; Thomas-Wunsch). Kern-Mechanik:
   - Hero-Modus solange #sceneMain.bottom > 0 (liest window.__sculptProgress), danach Stationen.
   - Stationen per Markup-Wrapper in page.tsx: data-talos-station + data-talos-anchor (0..1)
     + data-talos-size (s|m|l|xl -> Naehe/Groesse via z) + data-talos-gesture (wave|wave2|bow)
     + data-talos-layer (back=hinter dem Text z12 / front=vor der Flaeche z30)
     + data-talos-appear (Score-Schwelle gegen zu fruehes Erscheinen) + data-talos-yaw.
   - Er GEHT sichtbar zwischen Stationen (Beine + Arm-Gegenschwung + Vorlage), ohne Station
     weiches Ausblenden, Position wird VOR Einblenden gesetzt (nie Teleport).
   - HARTE THOMAS-REGELN eingebaut: Blick-Sperre (Kopf folgt Maus nie aus dem Bild, onGaze
     clampt nx nach curX-Seite) + STAND_BIAS (Haltung im Stand immer leicht zur Bildmitte).
   - Inhalts-Wrapper in page.tsx ist TRANSPARENT + z20 (weiss kommt vom body) — .tl-section
     hat deshalb bewusst KEIN background; Sektionen mit eigenem Grund (Ledger --surface,
     Kontrollraum navy, CTA navy) verdecken die back-Ebene -> dort ist er front oder absent.
   - QA-Hooks: __talosCompanion.state()/stations()/setProg()/tune(). Mobil <900px Stationen aus.
4. **Sektionen** (Reihenfolge in page.tsx): Hero-Demo (inkl. Beruhigungs-Bumper = Belief-Szene)
   -> WerIstTalos (Sticky 200vh, Station l/back/appear .5, Talos rechts hinter Text)
   -> InklusiveDashboard (Sticky-Ledger-Klon, 4 Punkte, 88vh je Punkt, KEINE Station)
   -> Faehigkeiten (6 Karten: Schreiber/Empfang/Aussendienst/Poster/Sichtbarmacher/
      Sonderanfertigung — ARBEITSTITEL) -> FreigabePrinzip (Sticky 180vh, Station m/back,
      Verbeugung, Klaerungs-Kasten) -> Onboarding (Kreis-Ketten-Klon, 3 Schritte)
   -> Kontrollraum (Navy-Frame-Klon, Station m/front, Talos in tl-kr__stage-void)
   -> Beweis -> FragTalosAnmoderation (+ bestehender FragTalos; Station s/back)
   -> TalosFaqV2 (9 Fragen) -> TalosSchlussCta (Station m/front, Abschieds-Wink).
5. **Copy-Stand**: docs/specs/TALOS_COPY_V2_2026-07-22_ENTWURF.md; Sektionen 2+3 als
   REVISION 23.07. am Dateiende (integriert: "Kein Tool, kein Abo..." + Login/Dashboard/
   Kommandozentrale/"so bekommst du das sonst nirgends"). NICHT freigegeben.

## Commits (alle GEPUSHT auf origin/relaunch)
Talos-Strang: 1524f1d, a6fbb96, da9844d, 495caa3, ef5fa72, b9702b5 (Session 23.07.),
dann Runde 24.07.: f8a5afd + 893a330 (Raender/Hero/Polish) + 9beaa73 (dieser Handoff).
ACHTUNG: relaunch ist ein GETEILTER Branch (parallele Preise-Session pusht auch dorthin).
Vor dem Pushen immer `git pull --rebase --autostash`; NUR eigene Talos-Dateien committen
(components/{relaunch/talos,subpages/talos-demo,subpages/leistungen/talos}, page.tsx,
docs/handoffs/NEXT_SESSION_talos.md). NIE seo-monitor-log.md, brand/, preise-*, Root-PNGs.
Letzter verifizierter Ready-Deploy (Stand 24.07., Runde Raender/Hero/Polish):
https://webredrabbitmedia-jfehncfcl-toms-projects-17d37f0b.vercel.app/relaunch-preview/leistungen/talos
tsc gruen, vitest 168/168, Konsole sauber, Hero + Sektionen im Browser sichtgeprueft.

## OFFEN — hier weitermachen
0. **ERLEDIGT 24.07. (Commits f8a5afd + 893a330, gepusht)**: (a) Raender vereinheitlicht —
   WerIstTalos auf rr-narrow (war der einzige Kanten-Ausreisser, 1680px); alle Sektionen
   jetzt Textkante 367px @1913vw, Onboarding bewusst 489px = exakt das wd-abl-Vorbild
   (Website-Seite selbst streut 357/367/417/489, Talos-Seite ist damit einheitlicher als
   das Vorbild). (b) Hero-Ueberdeckung geloest: END_X -545 (linke Fensterkante) + Frustum-
   Clamp in applyHero (schmale Viewports), .tlh-panels padding-left clamp(170px,17.5vw,340px)
   -> ALLE Panel-Texte voll lesbar, Talos steht als eigene Spalte neben den Karten.
   (c) Polish: Sonderanfertigung navy-invers mit Tuerkis-Labels (#39c2d7, KEIN Rot auf
   Navy), tl-card__block-CSS nachgezogen, Sprechzeilen-Gruppen enger (.tl-says + .tl-says),
   Wer-ist-Talos-Sticky passt in EINEN Viewport (Titel gedeckelt clamp(30px,3.3vw,60px),
   Spalte 58%). Browser-verifiziert, tsc gruen, vitest 168/168.
1. **Thomas-Feedback zur neuen Runde einholen/umsetzen.** Noch offen aus seiner Liste:
   Kontrollraum-Sticky pruefen; "sticky wo sinnvoll" ggf. auf weitere Sektionen
   (Faehigkeiten? Beweis?) ausdehnen.
2. **Design-Polish Fable (Rest)**: Augen-Akzent pro Faehigkeit (rig.setEyeColor, dezent —
   braeuchte eine Station bei den Faehigkeiten, aktuell hat die Sektion keine).
3. **Gemeinsamer Copy-Durchgang mit Thomas**: Headline-Varianten waehlen, Faehigkeits-Namen
   final, FAQ-Feinschliff (Frage 9 = Automatik-Frage, Variante A eingebaut), dann Freigabe-
   Vermerk in die Spec. Danach Beweis-Zahl (26 echte Beitraege) verifiziert halten.
4. **Aufraeumen nach Thomas-OK**: alte Talos-Sektionen components/subpages/leistungen/talos/
   {WasTalosIst,Fundament,Module,Arbeitstag,FragTalosSection,TalosFaq,TalosCta}, ungenutzte
   Buehnen (TalosPresentation/TalosIntro/TalosHeroStage/TalosApproachStage), Platzhalter
   (TalosHeroPlaceholder, BeruhigungsBumper), Routen talos-intro/talos-demo/talos-choreo.
5. **Spaeter**: Preisseite (Website-Fixpreise + Talos-Faehigkeiten, Thomas nennt Preise;
   evtl. HORIZONTAL, siehe Memory), Mobil-Konzept fuer den Companion (<900px aktuell aus).

## Technik-Lessons (nicht neu entdecken)
- Offscreen-Kanten IMMER aus dem Kamera-Frustum rechnen (aspect-abhaengig).
- talosMotion schreibt Kopf/Oberkoerper/arm.z absolut pro Frame — Zusaetze nur auf
  unberuehrte Achsen (arm.x = Armschwung) oder NACH motion.update additiv (topPart-Vorlage).
- Bot-Yaw: +1.05 = Dreiviertel nach rechts mit sichtbarem Gesicht; +1.5 = hartes Profil;
  -1.5 = schaut nach links raus (VERBOTEN).
- Vercel: `vercel ls` ohne TTY liefert NUR URLs (kein Status!) -> `vercel inspect <url>`.
- Der Hero-Frame-Agent, Ledger-/Kreis-/Navy-Klone: bei "wie Sektion X" IMMER die exakte
  Vorbild-Datei lesen+kopieren+umbenennen (tl-/tlh-Praefixe), Website-Dateien nie anfassen.
