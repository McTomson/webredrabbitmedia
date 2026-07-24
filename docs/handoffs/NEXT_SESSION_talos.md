# Naechste Session — TALOS-Leistungsseite (Stand 24.07.2026 abends, nach 3 Feedback-Runden)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. DESIGN-Feinschliff macht Fable selbst; Agenten fuer
  1:1-Klone (exakte Vorbild-Datei nennen!), Copy-Rohfassungen, mechanische Sweeps. Verschiedene LLM je Aufgabe.
- Autonom handeln, voller Browser-Zugriff. Committen/pushen/deployen erlaubt (Preview, NIE prod).
  Deploy NUR mit `vercel inspect <url>` Status **Ready** als "online" melden (SSO-302 luegt).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Hintergrund-Laeufen alle 15 Min Health-Check + Stichprobe.

## WICHTIG — QA bei eingefrorenem rAF (spart viel Zeit)
Der 3D-Companion laeuft ueber `renderer.setAnimationLoop` (rAF). Im MCP-/Hintergrund-Tab FRIERT rAF ein
(document.hidden=true) -> Werte aendern sich nicht, Screenshots zeigen nur das letzte Frame.
LOESUNG (schon eingebaut): `window.__talosCompanion.tick(dt=1/60, steps)` treibt Frames MANUELL
(Update+Render), WebGL rendert auch im Hintergrund. QA-Muster:
1. Warten bis Szene geladen (Spline remote): Loop `c.setProg(0.5); c.tick(1/60,4)` bis `state().opacity>0`.
2. Zu einer Station: `scrollTo(0, stationCenterY - innerHeight/2); c.tick(1/60,170)` (einschwingen), dann Screenshot.
3. QA-Hooks: `__talosCompanion.state()` (x/z/yaw/opacity), `.rig()` (rig.head.rotation.y = Kopf-Yaw),
   `.stations()`, `.setProg(p)/setProg(null)`, `.tick()`, `.tune()`, `.wave()`.
Kopf-zum-User-Check: `rig.head.rotation.y` soll die Koerper-Yaw (`state().yaw`) AUSGLEICHEN (Gegenzeichen).

## STAND — was ist erledigt + verifiziert + DEPLOYT (Ready)
Letzter Preview-Deploy (Ready via vercel inspect, 24.07. abends):
https://webredrabbitmedia-g4x5tv30s-toms-projects-17d37f0b.vercel.app/relaunch-preview/leistungen/talos
Commits (gepusht auf origin/relaunch): 09b240a (Runde 1) -> 0cf1040 (Runde 2) -> 57c99f4 (Runde 3).
tsc gruen, vitest 168/168, keine Konsolenfehler, jede Station im aktiven Browser sichtgeprueft.

Talos-Haltung (KANONISCH, so lassen, nur feintunen):
- KOPF schaut IMMER den USER an (Kamera), nie zur Bildmitte. Mechanik: Buehne setzt
  `motion.setHeadYaw(-Koerper-Yaw)` im Stand -> Kopf gleicht die Koerperdrehung aus und schaut Kamera an.
  Beim Gehen setHeadYaw(0) (Kopf in Laufrichtung); Hero setHeadYaw(-yaw) ausser beim Abgang.
- Koerper nur LEICHT angedeutet: STAND_BIAS = 0.24 (0.50 zeigte den Ruecken, 0.30 war zu subtil).
  Vorzeichen ist RICHTIG (empirisch bei 0.7 verifiziert): rechts -> negativer Yaw, links -> positiver.
- Kopf-Pitch hart gegen Hochschauen geklemmt: `clamp(0.05 - pointerY*0.1, -0.04, 0.2)` (talosMotion.ts).
- Nicken (FreigabePrinzip, gesture "nod") + einaeugiges Zwinkern (Kontrollraum, gesture "wink"), Loop ~10s.
- Groessen SIZE_Z {s:-420, sm:-200, m:-70, l:110, xl:220}. Hero offscreen via halfWidthAt(HERO_Z)+OFF_MARGIN 320.

Sektionen:
- Faehigkeiten (components/subpages/leistungen/talos/v2/Faehigkeiten.tsx): EXAKTER KundenGrid-Klon
  (Tipp-Effekt rAF 1:1, Typo desktop+tablet pixelidentisch), Plus-Marker unten rechts, Klick->Modal.
  Daten aus faehigkeiten-data.ts. Alte Varianten (Kachel/Aufklapp) + Test-Route sind GELOESCHT.
- FragTalos (FragTalosAnmoderation.tsx): IDENTISCH zur Diagnose-Quiz-Sektion (Wert-fuer-Wert), nur BLAU
  #0a72a0 statt Teal, Akzent Tuerkis #39c2d7, Off-White #f6f5f1. Scoped .rr .tlfrag-section .ft-*-Overrides,
  FragTalos.tsx selbst unveraendert. Station jetzt layer FRONT (stand sonst hinter dem Blau).
- InklusiveDashboard: rote Gruppen-Ueberschrift + sticky wie Website-Fundament (Runde 1).
- WerIstTalos: Headline auf EINEN Satz gekuerzt (Rest im Lead), Wrap rr-wrap (weniger mittig), Talos anchor 0.84.
- Stationen (page.tsx): WerIstTalos 0.84/l/back/appear .5; FreigabePrinzip 0.82/m/back/nod; Kontrollraum
  0.7/m/front/wink; Beweis 0.8/m/back/appear .45; FragTalos 0.82/m/front; SchlussCta 0.17/sm/front/wave.
- Bug behoben: schwebende Beine im Uebergang Kontrollraum->Beweis (back-Talos erschien zu frueh hinter dem
  opaken Frame) -> Beweis appear 0.45.

## OFFEN / naechste Schritte (auf Thomas-Feedback warten)
1. Thomas-Abnahme des 24.07.-Stands (3 Runden). Falls neue Punkte: gleiche Pipeline (parallele Agenten,
   review-it, Browser-QA mit tick()).
2. Hero-Abgang/Tempo + "Gruender"-Standzeit: nur teil-automatisch pruefbar (durchgehendes Scrollen friert
   rAF im QA-Tab). Thomas soll das Tempo-Gefuehl am Deploy selbst bestaetigen; scene-main aktuell 1850vh,
   P_EXIT1 0.98. Bei Bedarf scene-main-Hoehe weiter erhoehen.
3. Aufraeumen nach Thomas-OK: ungenutzte alte Talos-Sektionen/Buehnen (components/subpages/leistungen/talos/
   {WasTalosIst,Fundament,Module,Arbeitstag,FragTalosSection,TalosFaq,TalosCta}, TalosPresentation/TalosIntro/
   TalosHeroStage/TalosApproachStage/TalosChoreoStage, Routen talos-intro/talos-demo/talos-choreo).
4. Mobil-Konzept fuer den Companion (<900px aktuell aus).
5. Preise/Talos-Modulpreise: Thomas nennt Preise, nie erfinden (Website 950/2.900/ab 4.900 existieren).
6. ALLE Copy bleibt ENTWURF bis Thomas-Freigabe.

## Relevante Dateien
- Engine: components/relaunch/talos/{TalosCompanionStage.tsx, talosMotion.ts, talosRig.ts}
- Seite/Stationen: app/relaunch-preview/leistungen/talos/page.tsx
- Sektionen: components/subpages/leistungen/talos/v2/*.tsx (+ talos-v2.css)
- Vorbilder (fuer Klone): components/relaunch/KundenGrid.tsx (Firmen-Grid+Tipp),
  components/subpages/leistungen/website/v2/Diagnose.tsx (Quiz).
- Hero-Demo: components/subpages/talos-demo/{demo.body.html, demo.css, demo.engine.jstext}
- Review-Logs: docs/reviews/talos-feedback-runde{,2,3}-2026-07-24.md
- Dev: `npm run dev -- --port 9000` (Log /tmp/redrabbit-dev-9000.log). Kein `npm run build` bei laufendem dev.
- Geteilter Branch relaunch: vor Push `git fetch` + nur eigene Talos-Dateien stagen (NICHT seo-monitor-log,
  brand/, preise-*, Root-PNGs).
