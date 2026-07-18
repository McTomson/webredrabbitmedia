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

### Naechste konkrete Schritte
1. Mit Thomas den Weg entscheiden (Embed vs. Polieren vs. Vorrendern) inkl.
   12-USD-Frage. Danach VOR dem Bau pruefen: Kann der Viewer-Embed extern
   gesteuert werden (Scroll->Kamera) oder muss die Regie in den Spline-Editor?
2. Look-Anpassung im Editor (Bronze? Oder Original-Schwarz-Chrom lassen?
   Thomas fragen — sein Referenzbild war Bronze-Hoplit, das ORIGINAL ist
   schwarz-chrom; "etwas anpassen" praezisieren).
3. Seite umbauen: .tal-stage-Inhalt tauschen, Rest (Kapitel/Assistent/SSR/
   Gate) wiederverwenden. QA-Programm wie in TALOS_SEITE_SPEC.md.
4. Danach weiter im Unterseiten-Strang: Preise-Seite (brand/PREISE_SEITE_BRIEF.md,
   NUR 950/2900/ab-4900), Artikel-Detailseiten, Modul-Detailseiten Welle 2.

### Blocker / Risiken
- NEXBOT-Lizenz "personal use" — vor Go-Live Modell-Tausch/Lizenz klaeren.
- Spline-Bezahlfrage ist Thomas-Entscheidung (nie ohne ihn upgraden).
- Dev-Server :9000 gelegentlich neu starten; Vercel NIE --prod; Branch nicht
  pushen ohne Ansage; fremde Straenge (DESIGN.md, brand/*, Header/Footer,
  HomeMorph, seo-monitor-log) NICHT committen.
