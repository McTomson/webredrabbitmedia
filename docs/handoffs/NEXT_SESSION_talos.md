# Naechste Session — TALOS Leistungs-Praesentation (Stand 19.07.2026)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, docs/specs/TALOS_COPY_2026-07.md,
  docs/specs/TALOS_SEITE_SPEC.md, docs/strategie/LEISTUNGEN_ZUKUNFT_2026-07.md,
  docs/DESIGN_SYSTEM.md, die betroffenen Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/Browser/Docs). Bei Unsicherheit: fragen
  oder fail-closed, nie einen Wert erfinden. Gilt scharf fuer Copy/Preise.
- Erst Plan (TodoWrite), dann ausfuehren. Station fuer Station vorgehen (Thomas-
  Wunsch: pro Session eine Sache durchdenken + bauen, nicht alles auf einmal).
- Fable = Dirigent: Bau/Recherche an passende Sub-Agenten delegieren (Copy = Opus,
  Code/Extraktion/Review = Sonnet), Ergebnisse selbst gegen die harten Regeln
  pruefen und QA + review-it selbst fahren. Multi-Agent hat diese Session gut
  funktioniert (2 Bau-Agenten + review-it, alle Bugs gefunden).
- Laufend testen (tsc + vitest 168/168) + review-it bei groesseren Schritten.
  Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- QA im EIGENEN AKTIVEN Chrome-Tab (Hintergrund-Tab friert rAF/IO ein — osascript-
  Aktivierung). ABER Thomas nicht dauernd den Fokus klauen: fuer Abnahme lieber
  deployen (vercel deploy --yes, NIE --prod) und Link schicken.
- Branch relaunch, LOKAL — nicht pushen ohne Ansage. Dev: npm run dev -- --port 9000.
- Copy-Regeln: echte Umlaute (ä ö ü ß), kein Wort "KI" im sichtbaren Text,
  Telefon nur als tel:-Link/"Anrufen"-Button (nie Klartext), Preise NUR
  950 / 2.900 / ab 4.900 (nie 790), kein Gedankenstrich, keine KI-Tells.
  Eckig-Gesetz: border-radius:0 fuer UI (Rund nur Umlaut-Punkte/roter Punkt/
  Spinner/Toggle/Radio). Fremde Straenge (DESIGN.md, brand/*, Header/Footer,
  HomeMorph, seo-monitor-log) nicht committen.

## Stand dieser Session (was gebaut ist)
Talos-Praesentation als Scroll-Praesentation auf ISOLIERTER Route
`/relaunch-preview/talos-intro` (Demo vor Umbau; NICHT die echte Leistungsseite).
Commits lokal auf relaunch: bis `b64cd5c`. tsc + 168/168 vitest gruen.
Live: https://webredrabbitmedia-70ch8hzbx-toms-projects-17d37f0b.vercel.app/relaunch-preview/talos-intro

Dateien:
- `components/relaunch/talos/TalosSplineDemo.tsx` — Fidelity-Demo (three-spline-
  Buehne, Augen/Motion-Spielwiese, QA-Hooks __setYaw/__setCam). Route /talos-demo.
- `components/relaunch/talos/talosRig.ts` — baut Augen (Honigwaben, kalibriert) +
  Rig auf der geladenen Original-Szene. KEINE Gold-Kammlinie mehr (verworfen).
- `components/relaunch/talos/talosMotion.ts` — Bewegungs-Regie (Gruss mit
  Handflaeche-nach-vorn, Cursor-Blickfolge, Idle-Atmung, Verbeugung, Blinzeln).
- `components/relaunch/talos/talosSections.ts` — Stationen: Copy + Kino-Kamera-
  Keyframe pro Station + Card-Seite.
- `components/relaunch/talos/TalosPresentation.tsx` — die Praesentation: fixe
  three-spline-Buehne + Kamera-Choreografie pro Station + Snap-Sektionen +
  eckige Glass-Cards + Fly-in-Auftakt. Route /talos-intro.
- `components/relaunch/talos/TalosIntro.tsx` — aeltere Auftakt-Einzeldemo,
  durch TalosPresentation abgeloest (ungenutzt, kann spaeter raus).
- `docs/specs/TALOS_COPY_2026-07.md` — freigegebene message-first Copy (Bau-Vorlage).
- ALT (noch in der ECHTEN Leistungsseite aktiv): `TalosPage.tsx` + `TalosStage.tsx`
  + `talosController.ts` (r3f, graue talos.glb). Enthaelt den fertigen 5-Fragen-
  Frag-Talos-Assistenten (Logik 1:1 wiederverwendbar!) und Reveals/Reduced-Motion.

### Technische Kernfakten (nicht neu entdecken)
- Buehne laeuft auf `three-spline` (= three@0.149, isoliert per webpack
  NormalModuleReplacementPlugin), Loader @splinetool/loader, Szene
  prod.spline.design/bN7MTDW-zSkVIOxf/scene.splinecode. Kein Wasserzeichen, 0 Euro.
- Visier hat KEINE UV-Koordinaten -> Original-Augen-Textur (Thomas lieferte sie:
  ~/Downloads/Untitled Image.png, 654x330) NICHT mappbar; Augen per Raycast-Dots
  nachgebaut, gegen Original-Render kalibriert (Abstand ±15.5, Honigwaben).
- Nodes benannt/einzeln steuerbar (Head, Neck, arm1/elbow1/forearm1, Hand2, Body...).
  Beine NOCH NICHT gerigged (fuer die Kniefall-Landung noetig).
- QA-Hooks im Browser: window.__talos, __talosMotion, __setYaw(rad), __setCam(px,py,pz,tx,ty,tz,fov).
- Kamera-Keyframes pro Station in talosSections.ts (HERO_CAM/LEFT_NEAR/... ).
- review-it-Fixes drin: Fly-in an rig-Load gegated; gemeinsamer teardown() bei
  Ladefehler UND Unmount; scrollToId reduced-motion-fest.

## WICHTIGE RICHTUNG (Thomas 19.07. — leitend fuer die naechsten Sessions)
1. **PRIORITAET: Der Kunde muss sofort und EINFACH checken, was wir machen
   (Websites bauen).** Wir sind noch weit weg von einer coolen, informativen
   Seite. Nicht in Roboter-Spektakel verlieren — Substanz + Klarheit zuerst.
2. **Seiten-Chrome fehlt komplett** und muss rein (die Praesentation ist Teil der
   echten Red-Rabbit-Seite unter /leistungen): Hamburger-Menue (RelaunchMenu),
   Footer (FooterReassembly), und das Logo links oben soll nach etwas Scrollen
   erscheinen (RabbitMark, rot). Muster: app/relaunch-preview/leistungen/page.tsx
   und tipps/page.tsx. Einbau erst wenn die Praesentation abgenommen ist bzw.
   beim Umbau in die echte Seite.
3. **"2-Buttons"-Konzept wieder aufgreifen:** Thomas erinnert sich an ein Konzept
   mit 2 Buttons (Details unklar) — vermutlich ein Einstieg wie "Los geht's" vs.
   "Ich will mich umschauen", wo Talos Fragen stellt, um herauszufinden was der
   Kunde braucht. NAECHSTE SESSION mit Thomas klaeren, welches Konzept genau.
   Verwandt: der fertige 5-Fragen-Frag-Talos-Assistent (in TalosPage), der
   verworfene Klick-Gate-Hero (docs/handoffs/klick-gate-attempt.patch), brand/.
4. **Intro/Fly-in ist noch NICHT gut:** Talos "schwebt einfach nur senkrecht"
   herein. Muss ueberarbeitet werden. Referenz-Choreografie zum Anschauen/
   Adaptieren (spaeter): https://www.fuch.ai/ (Roboter dort). Ausserdem
   gewuenscht (frueher): Superman-Landung — reinfliegen, in der Luft aufrichten,
   runter, auf EIN Knie landen (kniend), dann aufstehen + winken, DANN erst die
   Info-Card. Braucht Bein-Rigging.
5. **Bewegungen sind noch sehr einfach** — spaeter verfeinern (an fuch.ai orientieren).
6. Talos gehoert AUF die Leistungsseite (nicht Unterseite verstecken) — aber die
   Botschaft "wir bauen Websites" muss ihn tragen, nicht umgekehrt.

## Naechste konkrete Schritte (mit Thomas Station fuer Station)
1. Mit Thomas das "2-Buttons"/"umschauen"-Einstiegskonzept klaeren, DANN Hero/
   Auftakt danach umbauen (message-first bleibt, aber evtl. mit Auswahl-Einstieg).
2. Choreografie-Feintuning pro Station (Kamera zu nah/weit/hoch — Thomas' Auge).
3. Frag-Talos-Assistent (5 Fragen) aus TalosPage in die Praesentation portieren
   (Logik existiert, nur ins neue Layout/Glass-Card bringen).
4. Fly-in ueberarbeiten (weg vom senkrechten Schweben; Richtung Kniefall-Landung /
   fuch.ai-Stil). Beine riggen.
5. Bewegungen verfeinern.
6. Seiten-Chrome einbauen (Menue/Footer/Logo-nach-Scroll) — spaetestens beim
   Umbau in die echte /leistungen-Seite (TalosPage/TalosStage/talosController
   dann ersetzen; SSR-Text/noindex/Assistent behalten).

## Offene Design-Entscheidungen (Thomas)
- Tuerkiser Strich an Talos' Sprechzeilen (Augenfarbe als Stimme) behalten oder
  Ink/Rot? (Ein-Rot-Prinzip vs. Talos-Identitaet.)
- Tempo/Snap-Haerte (aktuell weiches proximity-Snapping).
- Kamera-Framings pro Station (Werte in talosSections.ts leicht aenderbar).

## Lessons dieser Session
- Multi-Agent-Orchestrierung + review-it hat sich bewaehrt: Opus fuer Copy
  (fing Preis-/house.md-Fallen selbst ab), Sonnet fuer Design-Token-Extraktion
  und Code-Review (fand 3 echte Bugs: Fly-in-Race, Zombie-Loop, reduced-motion).
- Augen-Feintuning war zeitintensiv (viele Iterationen). Bei look-kritischen
  3D-Details frueh die echte Referenz (Screenshot/Textur) vom Kunden holen und
  Proportionen MESSEN statt schaetzen — hat am Ende schnell konvergiert.
- Visier ohne UVs = keine Textur mappbar; alles per Raycast-Geometrie.
- Fokus-Klau nervt Thomas: fuer Abnahmen deployen statt live im Browser zeigen.

## Blocker / Risiken
- NEXBOT "personal use"-Lizenz vor Go-Live klaeren (Modell-Tausch/Lizenz).
- Spline-Bezahlfrage ist Thomas-Entscheidung (r3f-Weg ist 0 Euro, aber Fidelity-
  Weg bleibt Free).
- Dev-Server :9000 gelegentlich neu starten. tsc haengt gelegentlich (Dev-Server-
  Konkurrenz) — im Hintergrund laufen lassen.
