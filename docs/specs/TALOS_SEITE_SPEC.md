# Spec: TALOS — /relaunch-preview/leistungen als Scroll-Praesentation (17.07.2026)

Thomas-Vorgaben (verbindlich): "unglaubliche neue Art der User Experience",
wie eine Praesentation beim Scrollen, interaktiv und animiert; Talos (Roboter)
begruesst im Hero und fuehrt durch die Seite (dreht sich, aendert Perspektive,
ist in jeder Sektion praesent); minimalistisch-griechisch, freundlich, subtil;
Seite DARF vom Haupt-Theme abweichen. Referenz-Gefuehl: hashgraphvc.com.
Kein Wasserzeichen, keine Abokosten -> EIGENES Rendering (Three.js), NICHT
Spline-Player.

## Assets & Technik (entschieden, Fakten verifiziert)

- Modell: `assets-src/talos/nexbot_robot_character_concept.gltf` (Spline-Free-
  Export, 4 MB roh, 50 Meshes / 131 Nodes, KEINE Materialien/Animationen —
  wir liefern Material + Bewegung im Code). Pipeline: `gltf-transform` /
  `gltfjsx --transform` -> komprimiertes .glb (Ziel < 800 KB) nach
  `public/models/talos.glb`. Lizenz-Status: NEXBOT "personal use" — fuer den
  geschuetzten Preview ok (Thomas-Entscheid), vor Go-Live Modell-Tausch oder
  Lizenz klaeren (im Abschluss-Report ausweisen).
- Stack: `three` + `@react-three/fiber` + `@react-three/drei` (einzige neuen
  Dependencies; kein GSAP — eigene rAF/Lerp-Regie wie im Projekt ueblich).
- Seite bleibt Route `app/relaunch-preview/leistungen/page.tsx` (Server-
  Komponente, SSR-Text komplett, robots noindex). Der bisherige Paint-Hero
  und LeistungenStory werden ERSETZT (Thomas erlaubt Theme-Abweichung);
  Code der alten Version bleibt im Git-Verlauf (d05e733).

## Talos-Look (im Code, nicht im Modell)

- Material: mattes Bronze (MeshStandardMaterial, metalness ~0.85, roughness
  ~0.45, Farbton warm #a5763a-Richtung), KEIN glaenzendes Schwarz-Chrom —
  Forschung: mattes warmes Material = staerkster Freundlichkeits-Hebel.
  Akzent-Teile (Gelenke/Details) dunkles Ink #23262e. Augen/Visier: weiches
  Licht-Emissive, Off-White; bei Interaktion kurz waermer.
- Griechisch (Thomas 17.07., Referenzbild Bronze-Hoplit): KEIN Hasen-Logo
  auf der Brust. Ruestungs-Anmutung minimalistisch aus eigener Geometrie am
  jeweils passenden Node: korinthischer Helm mit Kamm (Extrude/Lathe,
  dunkles Bronze/Ink), angedeutete Schulterplatten (gewoelbte Schalen),
  Pteryges-Lamellen-Rock als schlichte Streifen an der Huefte, Beinschienen-
  Wirkung ueber dunklere Material-Zone an den Unterschenkeln. Keine
  Gravuren/Ornamente (nicht machbar aus Primitiven — volle Ruestung wie im
  Referenzfoto = spaetere Ausbaustufe via generiertem 3D-Modell, im
  Abschluss-Report ausweisen). Leicht gealterte Bronze (Roughness-Variation)
  statt Neuglanz, freundliche Gesamtwirkung hat Vorrang vor Martialik.
- NACHSCHAERFUNG Thomas 17.07. (verbindlich, sticht alles Martialische):
  Talos ist HELFER, nicht Waechter — Ruestung dezent/klein, Posen offen und
  zugewandt (Kopfneigung, Gruss), Kamera nie einschuechternd von unten,
  warmes weiches Licht und warme Augen, langsame sanfte Bewegungen,
  Sprechzeilen im Ton eines hilfsbereiten Kollegen. Bei Konflikt gewinnt
  Freundlichkeit, Ruestung wird reduziert.
- Buehne: Studio-Weiss (#ffffff) wie die Marke; Stimmung pro Kapitel ueber
  Licht/weiche Riesen-Gradient-Sphere an der Kamera (ATMOS-Technik) —
  Bronze-Waerme im Hero, kuehler-klar im Fundament, warm im Team, Navy-Abend
  im CTA. Rot bleibt UI-exklusiv (Progress, CTA, kleine Akzente), NIE auf
  Bronze als Textfarbe.

## Die Regie (Scroll = Timeline, alles scrubbing, reversibel)

Fixe 3D-Buehne (position:fixed, volle Hoehe, z hinter Text-Layern), Seite
scrollt normal (kein Hijacking, Touch frei). Ein zentraler Progress p aus
scrollY / Gesamtstrecke, gelerpt (~0.07). Referenz-Zahlen aus der
hashgraph-Vermessung (research-hashgraph-mechanik.md) als Startwerte fuer
das Scroll-Gefuehl: Velocity-Lerp 0.15, Friction 0.92; optionales sanftes
Einrasten auf Kapitel-Anker NACH Scroll-Idle (~1,6s ease, nur Desktop,
abschaltbar, nie waehrend aktivem Scroll — Touch bleibt komplett frei). Keyframe-Tabelle pro Kapitel:
{p-Bereich, camPos, camTarget, talosYaw, talosPose(Node-Winkel), lightMood,
textState}. Interpolation lerp/slerp mit masterEase-Charakter. Talos-Grund-
Idle: sanftes Bobbing + Atmen (Scale 1.002) + Kopf folgt dezent dem Cursor
(Desktop, max ~8 Grad, gelerpt); prefers-reduced-motion: statische Posen,
harte Kapitel-Schnitte, kein Idle.

Kapitel (SSR-Text ist die Wahrheit, 8-15 Woerter pro Talos-Zeile, Sprech-
zeilen erscheinen als kurze Zitate neben ihm):

0. HERO — Talos frontal, leicht unter Augenhoehe (freundlich), hebt die Hand
   zum Gruss (Arm-Node-Rotation), Augen blinzeln. H1 (SSR, DM Sans):
   "Deine Website bekommt einen Mitarbeiter." Sub (Crimson): "Das ist Talos.
   Er arbeitet ab dem ersten Tag." Scroll-Hinweis. KEIN Klick noetig.
1. WER IST TALOS — Kamera faehrt naeher, Talos dreht sich leicht, zeigt auf
   sich. 3 kurze Zeilen nacheinander (scroll-getaktet): passt auf deine
   Website auf / nimmt an, was reinkommt / sorgt dafuer, dass etwas passiert.
2. FUNDAMENT — Talos tritt zur Seite (Kamera schwenkt), die 6 Inklusiv-
   Haekchen erscheinen als Karten-Zeilen (Aufklapp-Details bleiben). Zeile:
   "Das ist bei jeder Website von uns drin. Keine Extra-Rechnung."
3. FAEHIGKEITEN — Kern-Kapitel: pro Faehigkeit dreht Talos in neue Pose +
   Kamera-Perspektive wechselt (Profil links: Schreiben mit Selbsttipp-Demo;
   Profil rechts: Empfang mit Termin-Demo). Danach ruhige "lernt er gerade"-
   Reihe (Vertrieb, Ruf, Sichtbarkeit — auf Anfrage). Freigabe-Prinzip als
   eigene Mini-Szene: "Nichts geht raus ohne dich. Ein Klick von dir genuegt."
4. EIN ARBEITSTAG — Uhrzeiten-Timeline (06:00/09:15/12:30/17:40/22:41),
   Talos im Hintergrund wechselt je Uhrzeit die Pose; Licht wandert von
   Morgen zu Nacht (Mood-Sphere). Das ist die Verstaendnis-Szene.
5. FRAG TALOS — der 5-Fragen-Assistent, umgebaut als Dialog mit Talos
   (er neigt den Kopf bei jeder Frage; Fragen/Logik/Ergebnis wie gebaut,
   Ausstieg bleibt). Talos schaut zur aktiven Frage.
6. MASSARBEIT + BEWEIS + START — kurz: "Braucht dein Betrieb etwas, das es
   nicht gibt? Wir bauen es." + Beweis-Satz mit live gezaehlter Artikelzahl
   (getAllPosts, SSR) + 3 Schritte + CTA-Panel (Entwurf ohne Vorkasse,
   Anrufen-Button ohne Klartext-Nummer). Talos verbeugt sich leicht/winkt
   zum Abschied. Aufloesung des Hero-Versprechens.

Orientierung: schmale Kapitel-Punkte rechts (Desktop), Scroll-Progress-Linie,
"Anrufen" fix erreichbar. KI-Ehrlichkeit: Talos wird als "dein digitaler
Mitarbeiter" bezeichnet, Roboter-Form = eingebaute Transparenz; das Wort
"KI" im sichtbaren Text vermeiden.

## Performance (hart, Zielgeraet altes Android)

- LCP-Schutz: SSR liefert sofort Text + leichtes Poster (statisches Talos-
  Render als WebP); 3D laedt via dynamic import (ssr:false) + IO/Idle, blendet
  weich ein. Seite ist OHNE JS/WebGL vollstaendig lesbar (alle Texte SSR).
- R3F: dpr={[1, 1.75]} gecappt, frameloop="demand" + invalidate bei Scroll/
  Maus/Idle-Tick, Canvas pausiert wenn Tab hidden; powerPreference
  "high-performance"; keine Schatten-Orgien (1 Key + 1 Fill + Ambient,
  contact shadow gebacken/fake).
- Schwache Geraete (deviceMemory <= 4 oder keine WebGL2 oder
  prefers-reduced-motion): statisches Poster + normale Scroll-Reveals der
  Texte — Seite bleibt vollwertig. (Vorgerenderte Frame-Sequenz = spaeterer
  Ausbau, nicht Teil dieses Pakets.)
- Modell-Budget < 800 KB glb; Gesamt-JS-Zuwachs dokumentieren.

## QA-Pflicht vor "fertig"

1. tsc + vitest gruen (python3-Wrapper); eslint sauber.
2. curl-SSR: H1, alle Kapitel-Texte, Beweis-Zahl im HTML ohne JS.
3. Eigener Vordergrund-Tab: Hero-Gruss laeuft, Scroll-Regie vor/zurueck
   fluessig (kein Ruckeln, kein Sprung), Kapitel-Posen sitzen, Assistent
   durchspielbar, Konsole sauber, kein Querscroll; 500px-Fenster: einspaltig,
   Touch-Scroll frei, 3D laeuft ODER Fallback greift sauber.
4. Soft-Navigation leistungen -> faq -> leistungen: WebGL-Kontext sauber
   entsorgt (kein "too many contexts"), rAF-Loops enden (isConnected-Muster),
   Listener weg.
5. FPS-Stichprobe via Performance-Panel/JS-Sampler (Desktop >= 50, klar
   dokumentieren was Mobile-Emulation zeigt).
6. review-it (code-reviewer) + Fixes vor Abgabe; Vercel-Preview-Deploy
   (vercel deploy --yes, NIE --prod).
