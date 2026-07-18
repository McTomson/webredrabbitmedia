# Naechste Session — TALOS (Stand 18.07.2026)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## Stand dieser Session

### THOMAS-URTEIL 18.07. (Ausgangspunkt der naechsten Session)
Talos v1 ist ihm NICHT gut genug: Unser Eigen-Rendering (Grau-Export + Code-
Materialien) wirkt flach/plastikhaft gegen das Spline-ORIGINAL (Chrom-Kopf mit
LED-Punkt-Augen, Carbon-Texturen, echte Reflexionen) — "da sind Welten".
Sein Wunsch: das Original (app.spline.design/file/be79bac1-4223-430e-85dd-19641de47ebe,
liegt in SEINEM Spline-Account) direkt verwenden und leicht anpassen.
URSACHE des Gaps (verifiziert): Free-GLTF-Export = NUR Geometrie, alle
Materialien/Texturen fallen weg; der Look lebt in Splines Material-System.

### Optionen fuer die naechste Session (mit Thomas entscheiden)
1. SPLINE-EMBED (Empfehlung): Original-Szene einbetten (Public URL/Viewer),
   Look 1:1, Anpassung im Editor (4 Material-Slots, logo-Objekt, Helm aus
   Primitiven). Wasserzeichen weg = Starter 12 USD/Mon (Free = Wasserzeichen;
   Preise im Account verifiziert 17.07.). Scroll-Regie: Spline-native
   Scroll-Events ODER externe Steuerung (Variables/API = Professional-Feature,
   pruefen!). Die gebaute Seite (Kapitel/Assistent/Gate) bleibt, nur die
   .tal-stage wird getauscht.
2. EIGEN-RENDERING AUFPOLIEREN: HDRI-Environment (drei <Environment>), Carbon-
   Normal-Map, Clearcoat-Chrom-Kopf, LED-Dot-Augen-Textur. 0 Kosten/Wasserzeichen,
   aber Material-Handwerk und erreicht das Original nur naeherungsweise.
3. VORRENDERN: Original als Video/Frames (Video-Export = Professional 20 USD
   oder Capture-Pipeline), exakter Look, verliert Interaktivitaet.

### Erledigt + verifiziert (Commits lokal auf relaunch, NICHT gepusht)
- `4b619a8` TALOS v1: /relaunch-preview/leistungen als 3D-Scroll-Praesentation.
  components/relaunch/talos/{talosController.ts,TalosStage.tsx,TalosPage.tsx},
  public/models/talos.glb (988 KB, dedup+weld+quantize, KEIN meshopt!),
  Spec docs/specs/TALOS_SEITE_SPEC.md. 7 Kapitel SSR, Assistent als
  Frag-Talos-Dialog, Capability-Gate + Poster-Fallback, Keyframe-Kamera,
  Idle/Blinzeln/Gruss/Cursor-Gaze, Mood-Sphere. QA: tsc + 168/168 vitest,
  Mobile 500px sauber, Soft-Nav leckfrei, ~52 fps Desktop.
- `d05e733` (Vor-Version): Leistungs-Hub mit Paint-Hero + Weiche + Assistent +
  Zahnraeder-Skulptur (Dateien ungenutzt im Repo: LeistungenStory.tsx,
  leistungen-hero-demo/) — Fallback, falls Talos-Route verworfen wird.
- Strategie: docs/strategie/LEISTUNGEN_ZUKUNFT_2026-07.md (ENTSCHEIDUNGEN-
  Abschnitt: Hybrid-Modell, Basis-Dashboard inklusive, Module Content/Empfang/
  Outreach, Preise OFFEN nie erfinden). Research im Session-Scratchpad weg —
  Kern steckt in Doku + Memory.
- Deploy: https://webredrabbitmedia-pqguhtogx-toms-projects-17d37f0b.vercel.app
  Mail an Thomas via /api/ops-alert verschickt (ging an t.uhlir@immo.red —
  Empfaenger dort serverseitig fix).

### Teuer erkaufte Lessons (NICHT neu entdecken)
1. useGLTF-Komponente MUSS in explizitem <Suspense fallback={null}> stehen,
   sonst stiller Remount-Loop (Modell unsichtbar, nur 2 Frames).
2. NIE Geometrien eines scene.clone(true) disposen — geteilt mit useGLTF-Cache;
   StrictMode-Doppel-Mount rendert danach leer. Nur eigene Materialien disposen.
3. Hintergrund-Tab liefert KEINE IntersectionObserver-Callbacks -> 3D-Gate
   feuert nie. QA-Tab IMMER aktivieren (osascript: active tab index + window
   index 1 + activate). Dritte Begegnung mit der Falle in diesem Projekt.
4. Browser-HTTP-Cache serviert altes GLB unter gleicher URL -> bei Asset-Tausch
   ?v=-Cache-Bust an die Modell-URL.
5. meshopt-komprimiertes GLB liess useGLTF ewig haengen (Decoder) -> quantize
   reicht (native GLTFLoader-Unterstuetzung, kein WASM).
6. Spline Free-Plan: GLTF nur Geometrie/grau; Web-Export mit Wasserzeichen;
   Video-Export Professional; Code-Export Enterprise. Im Account verifiziert.
7. Gmail-MCP-OAuth KAPUTT: Browser-Consent klappt (2x via Klick-Agent), aber
   lokaler Token-Exchange scheitert ("try again from your terminal") ->
   einmal interaktiv im Terminal neu einrichten (mcp-gmail account-switch).
   Workaround fuer Mails an Thomas: POST /api/ops-alert mit ADMIN_API_TOKEN
   aus .env.local (Muster in scripts/content-engine/trigger/run-daily.sh).

### RECHERCHE 18.07. ABENDS (im Spline-Account verifiziert, Browser)
DER WEG IST GEFUNDEN — Option 1b: react-three-fiber-CODE-EXPORT, auf dem
FREE-Plan verfuegbar, OHNE Spline-Engine (= kein Player, kein Wasserzeichen-
Overlay, keine Abokosten):
- Export > Code Export > Dropdown "react-three-fiber" > "Update Code Export"
  erzeugt ~32k Zeichen JSX: `useSpline('https://prod.spline.design/
  bN7MTDW-zSkVIOxf/scene.splinecode')` liefert nodes+materials in UNSEREN
  eigenen R3F-Canvas. Package: @splinetool/r3f-spline (+ @splinetool/loader).
  Damit passt das Original 1:1 in unsere bestehende TalosStage-Regie
  (Keyframes/Kamera/IdleDriver bleiben, nur Modell+Material-Quelle tauschen).
- Hinweis im Dialog: "This export doesn't use the Spline engine. Some visual
  differences might be noticeable." => ERSTER BAUSCHRITT: Side-by-side-
  Fidelity-Check r3f-Export vs. Editor (Matcap/Rainbow-Layer sind die
  Risikokandidaten). Fallback wenn zu anders: Viewer-Embed (Badge) / Starter.
- Self-Hosted-ZIP-Export existiert ebenfalls (self-contained, kein CDN-Fetch)
  — pruefen ob wir scene.splinecode selbst hosten koennen (Vercel public/),
  sonst haengt die Seite an prod.spline.design.
- Szenen-Struktur (wichtig fuer Regie): Bot > Top part (Head, Neck,
  Hand Instance, Hand, Body) + Bottom. Head hat Event "Look At" (Editor-only,
  kommt im r3f-Export NICHT mit — Cursor-Gaze machen wir selbst, hatten wir
  in v1 schon). Materialien: 3 Slots (Head, Parts, Body). Head-Material =
  Layer-Stack Rainbow 50 + Matcap 60 + Lighting 100 + Color — Look lebt in
  diesen Layern.
- GLTF-Export-Dialog bestaetigt schriftlich: nur Geometry, ALLE Material-
  Layer/Texturen/Animationen gehen verloren (Ursache des v1-Flops).
- LED-Punkt-Augen: eigenes Mesh unter Head? NICHT verifiziert — im Editor
  pruefen (fuer Blinzel-Regie).

### LOOK-ENTSCHEIDUNG (Thomas 18.07. spaet, VERBINDLICH)
Talos bleibt WEISS (so wie der r3f-Export ihn rendert — Thomas gefaellt er so;
Marmor-Assoziation ersetzt Bronze komplett, KEIN Umfaerben). Dazu:
1. TUERKIS-LED-AUGEN (Option A): weiche Leuchtaugen im schwarzen Visier,
   Farbton aus dem Tuerkis-Blau-Markenverlauf. Blinzeln, Cursor-Blickfolge,
   Laecheln beim Gruss, Mitneigen bei Fragen. WICHTIG: Das ORIGINAL hat
   bereits Punktmatrix-Augen (weisse Hexagon-Dots, Thomas-Screenshot 22:28) —
   vermutlich die "video"-Layer im Head-Material, die unser Loader nicht
   abspielt. Position also vorgezeichnet; wir bauen eigene tuerkise Augen
   (Emissive-Flaechen/Dots vor dem Visier) in unserer Regie.
2. GOLD-KAMMLINIE (Option B): EINE feine Goldlinie als Helmkamm-Buegel ueber
   dem Kopf (griechischer Anker). Keine rote LED zusaetzlich (nicht beides).
   Nie rote Augen (bedrohlich).
Mockups/Begruendung: Artifact "Talos in Weiss: Look-Optionen"
(claude.ai/code/artifact/7824b391-7881-4f1b-bdd6-5134036bed56).

### Plan "dezent griechischer" (ueberholt durch Look-Entscheidung oben; Bronze-Teil OBSOLET)
Alle Anpassungen auf einer KOPIE des Files (Spline speichert automatisch —
Original nie direkt anfassen): Datei duplizieren als "NEXBOT - Talos".
1. Bronze-Toenung statt Umbau: im Material-Layer-Stack den Color-Layer warm
   toenen (Head dezent bronze-chrom, Body-Carbon dunkelbronze), Matcap/
   Rainbow-Layer BEHALTEN — so bleibt die Detailqualitaet des Originals.
2. Schmaler Helmkamm (Crest) aus Primitiven auf dem Head-Pivot; optional
   feines Maeander-Band (griech. Schluesselmuster) als Image-Textur-Layer
   auf Schulter/Brustlinie. KEIN Hasen-Logo. Freundlich, kein Waechter.
3. r3f-Export zieht die Aenderungen der Kopie ueber deren eigene
   scene.splinecode-URL.

### Bewegungs-Konzept (laeuft in UNSEREM r3f-Rig, nicht in Spline)
Nodes sind benannt und einzeln transformierbar (Head, Neck, Hand, ...):
- Hero: Gruss-Geste (Arm heben + Winken, wie v1), danach Cursor-Blickfolge
  (Head-Yaw/Pitch, port von v1).
- Kapitel: Kamera-/Yaw-Keyframes wie v1; Frag-Talos: Kopfneigung zur Frage.
- Immer: dezente Idle-Atmung (Sinus auf Brust/Schultern), gelegentliches
  Augen-Pulsieren (falls Augen-Mesh existiert, sonst Emissive im Head-Layer).
- Abschluss: leichte Verbeugung + Winken. Reduced-Motion: statische Pose.

### Naechste konkrete Schritte
WEG IST ENTSCHIEDEN (Thomas 18.07. abends): Original-NEXBOT verwenden,
dezent griechischer machen, Bewegungen ueber unser Rig. Sketchfab-Alternativen
hat er verworfen ("zu kindisch oder zu gefaehrlich"). 12-USD-Frage ist mit dem
r3f-Export vermutlich obsolet (kein Spline-Player im Spiel) — offen lassen bis
Fidelity-Check bestanden.
1. FIDELITY-CHECK ZUERST: r3f-Export (siehe RECHERCHE-Abschnitt) in eine
   Test-Route haengen und side-by-side gegen den Editor-Look screenshotten.
   Besteht er, ist der Weg 0-Euro und wasserzeichenfrei. Faellt er durch:
   Viewer-Embed (Badge) zeigen und 12-USD-Frage an Thomas.
2. Datei-KOPIE "NEXBOT - Talos" anlegen, dann Plan "dezent griechischer"
   umsetzen (Bronze-Toenung der Layer, Helmkamm, optional Maeander-Band).
3. Seite umbauen: .tal-stage-Inhalt tauschen (r3f-Szene statt talos.glb),
   Bewegungs-Konzept (siehe oben) auf die benannten Nodes legen. Rest
   (Kapitel/Assistent/SSR/Gate) wiederverwenden. QA wie TALOS_SEITE_SPEC.md.
4. Danach weiter im Unterseiten-Strang: Preise-Seite (brand/PREISE_SEITE_BRIEF.md,
   NUR 950/2900/ab-4900), Artikel-Detailseiten, Modul-Detailseiten Welle 2.

### Blocker / Risiken
- NEXBOT-Lizenz "personal use" — vor Go-Live Modell-Tausch/Lizenz klaeren.
- Spline-Bezahlfrage ist Thomas-Entscheidung (nie ohne ihn upgraden).
- Dev-Server :9000 gelegentlich neu starten; Vercel NIE --prod; Branch nicht
  pushen ohne Ansage; fremde Straenge (DESIGN.md, brand/*, Header/Footer,
  HomeMorph, seo-monitor-log) NICHT committen.
