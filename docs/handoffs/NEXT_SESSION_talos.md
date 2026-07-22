# Naechste Session — TALOS-Leistungsseite (Stand 23.07.2026 frueh)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, docs/specs/TALOS_COPY_V2_2026-07-22_ENTWURF.md,
  MEMORY.md, die betroffenen Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/Browser/Docs). Gilt scharf fuer Copy/Preise.
- Erst Plan (TodoWrite), dann ausfuehren. DESIGN MACHT FABLE SELBST (Thomas 23.07.:
  "am besten ist wenn du das design uebernimmst nicht sonnet oder opus") — Agenten nur
  fuer 1:1-Klone abgenommener Mechaniken und Copy-Mechanik, nie fuer Design-Entscheide.
- Copy-Regeln: echte Umlaute, kein "KI", Du-Anrede, kein Gedankenstrich, Preise NUR
  950/2.900/ab 4.900 bzw. Talos-Preise NIE erfinden (Preisseite spaeter), Telefon nur
  tel:-Button, border-radius 0 (rund nur Punkte/Kreise), Eyebrow-Klammern via CSS.
- QA im AKTIVEN Chrome-Tab (Hintergrund-Tab friert rAF ein -> osascript aktivieren).
  Fuer Thomas-Abnahmen deployen (Push baut Vercel-Preview; Status NUR via `vercel ls`
  Ready melden). Dev: npm run dev -- --port 9000.

## GRUNDSATZ-ENTSCHEIDUNGEN (Grill 22.07. + Feedback 23.07., NICHT neu aufrollen)
- Seite auf Basis der Website-Seite; Vollbild-Praesentation (TalosPresentation) ersetzt.
- Hero = talos-demo-Klon (Wort "Talos" + Mal-Erklaerzeile "Er steckt in jeder Website,
  die wir bauen. Ohne Aufpreis." + Wisch + Wort zerlegt sich) — Talos GEHT scroll-
  gekoppelt von links herein, dreht sich, winkt rechts, Dashboard-Fenster (hell, 3
  Mini-Widgets) baut sich um ihn, Abgang rechts. HERO_MODE="fly" existiert als
  Alternative, falls Thomas das Gehen doch nicht gefaellt (talos-intro-Flug).
- COMPANION-PRINZIP (Thomas 23.07.): Talos begleitet die GANZE Seite wie auf
  /talos-intro. components/relaunch/talos/TalosCompanionStage.tsx = EINE fixe
  3D-Ebene (z30, pointer-events none): Hero-Choreo + danach Stationen per Markup
  `data-talos-station data-talos-anchor="0..1" data-talos-size="s|m|l|xl"
  data-talos-gesture="wave|wave2|bow" data-talos-yaw="rad"` (Wrapper in page.tsx).
  Er GEHT sichtbar zwischen Stationen (Beine+Armschwung), ohne Station blendet er aus,
  Position wird VOR dem Einblenden gesetzt (nie Teleport im Sichtbaren). Blick-Regel:
  nie aus dem Bildschirm hinaus (FACE_TURN=+1.05 = Dreiviertel; -1.5 waere falsch).
  Mobil <900px: Stationen aus. QA-Hooks: __talosCompanion.state()/stations()/setProg().
- Sektionen = 1:1-Klone abgenommener Website-Mechaniken (tl-*-Klassen in
  talos-v2.css, Website-Dateien unberuehrt): InklusiveDashboard=Sticky-Ledger
  (VarianteA), Kontrollraum=Navy-Browser-Frame mit tl-kr__stage-void (Talos steht
  drin), Onboarding=Kreis-Kette 3 Schritte (Ablauf-Klon), Faehigkeiten=6 Karten
  (Schreiber/Empfang/Aussendienst/Poster/Sichtbarmacher/Sonderanfertigung, Namen
  sind ARBEITSTITEL), FragTalosAnmoderation bindet bestehenden FragTalos ein.
- Copy = docs/specs/TALOS_COPY_V2_2026-07-22_ENTWURF.md (Opus-ENTWURF, Thomas hat
  NICHT freigegeben; gemeinsamer Copy-Durchgang + Namens-Entscheid stehen aus).
- Preise: NUR auf der Preisseite (Website-Fixpreise + Talos-Faehigkeiten, klar
  getrennt); auf der Talos-Seite nur die Logik (monatlich/kuendbar/nachbuchbar).
- Beruhigungs-Ton ist Gesetz: "du bekommst eine wunderschoene Website; Mitarbeiter
  nur wenn du willst". Beruhigungs-Bumper = Belief-Szene im Hero-Klon.

## Stand (Commits lokal+gepusht: 1524f1d, a6fbb96, da9844d; tsc gruen, 168/168)
- Alles oben gebaut und im Browser sichtgeprueft: Hero gross + Wink + Fenster,
  WerIstTalos-Close-up (xl, Struktur sichtbar), Kontrollraum mit Talos im Frame,
  Beweis-Vorbeigehen, FragTalos rechts, CTA-Abschiedswink links auf Navy.
- Deploy: Push baut Vercel-Preview automatisch (Status pruefen!).

## Offen / Naechste Schritte
1. THOMAS-SICHTUNG des Companion-Prinzips (Deploy-Link schicken). Feintuning der
   Stationen (anchor/size je Sektion, WerIstTalos-Kopf-Anschnitt, Hero endX -170
   vs. Eyebrow-Ueberlappung) NUR mit seinem Feedback.
2. Design-Polish durch Fable: Faehigkeiten-Karten (Sonderanfertigung Navy-invers?),
   Abstaende, Talos-Sprechzeilen-Rhythmus, Augen-Akzent pro Faehigkeit (setEyeColor,
   nur dezent, Ein-Rot-Prinzip beachten).
3. Gemeinsamer Copy-Durchgang (Hero-Headline-Wahl, Faehigkeits-Namen, FAQ-Feinschliff,
   heikle Automatik-Frage), DANN Freigabe-Vermerk in die Spec-Datei.
4. Aufraeumen nach Thomas-OK: alte Talos-Sektionen (components/subpages/leistungen/
   talos/{WasTalosIst,Fundament,Module,Arbeitstag,FragTalosSection,TalosFaq,TalosCta}),
   TalosPresentation/TalosIntro/TalosHeroStage/TalosApproachStage (ungenutzt gebaut,
   Fundus), talos-intro/talos-demo/talos-choreo-Routen, TalosHeroPlaceholder/
   BeruhigungsBumper (ersetzt durch Demo-Klon).
5. Spaeter: Preisseite (Talos-Preise von Thomas), Menue-Eintrag prueft "Bei jeder
   Website dabei · Talos" bleibt korrekt.

## Technik-Lessons (nicht neu entdecken)
- Offscreen-Kanten IMMER aus dem Kamera-Frustum rechnen (aspect-abhaengig), fixe
  Weltkoordinaten sind bei breiten Viewports noch im Bild.
- Engine glaettet Scroll intern: nach scrollTo(instant) hinkt __sculptProgress nach;
  echte Wheel-Ticks fuer QA verwenden.
- talosMotion schreibt Kopf/Oberkoerper/arm.z absolut pro Frame — eigene Zusaetze
  entweder auf UNBERUEHRTE Achsen (arm.x Armschwung) oder NACH motion.update
  additiv (topPart-Vorlage).
- Companion + Demo teilen sich window.__sculptProgress; Hero aktiv solange
  #sceneMain.bottom > 0.
