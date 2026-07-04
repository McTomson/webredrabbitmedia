# Naechste Session — relaunch (2026-07-05 frueh, Session-Ende nach Morph-Runde v3 + Stil-Tests)

## SOFORT-AUFTRAG (Tomson-Anweisung 05.07. frueh, WOERTLICH umsetzen)
Baue die Zahnrad-Szene **1:1 IDENTISCH zum all-turtles-Original**, indem du DEREN Original-Teilformen verwendest:
1. **Teil-Formen extrahieren:** Aus `~/dev/at-reference-lottie/anim_0.json` (comp_1 = Zahnraeder, 129 Shape-Layer) die VEKTOR-PFADE jedes Teils ziehen (ty="sh", ks.k.v/i/o = Bezier-Vertices; Gruppen-Transform "tr" beachten) und als SVG-Pfade dumpen. Der vorhandene Parser `tools/parse-at-lottie.py` hat bereits Layer-Iteration + Transform-Mathematik — um Pfad-Export erweitern (neues Skript `tools/extract-at-shapes.py`, Output z.B. `lib/relaunch/morph/at-shapes-comp1.json`). Faerbung: UNSER Rot #F12032.
2. **Choreografie (Tomson-Vorgabe):** Die Seite beginnt mit UNSEREN "red rabbit"-Wortmarken-Teilen (wie jetzt: Ruhe -> Kontraktion -> Burst, Teile verteilen sich gross im Bild). Dann fliegen unsere Teile AUS dem Bild (bzw. nur solche, die deren Teilen aehnlich sehen, duerfen bleiben — einfachste Umsetzung: alle unsere raus), und DEREN 129 Teile fliegen von aussen herein und bauen das Zahnrad EXAKT an den vermessenen Slots (at-scenes.ts comp_1, at-timing.json Rhythmus). Ergebnis-Standbild muss vom Original-Frame f_0022 praktisch ununterscheidbar sein — DAS ist das Abnahme-Kriterium (Overlay-Vergleich!).
3. Erst NUR Szene 1 (Zahnraeder) bauen + Tomson-Abnahme des Standbilds + der Bewegung. Dann erst die Szenen 2-5 genauso (comp_2..comp_5 Shapes extrahieren).
4. **WICHTIG - Copyright-Kontext (einmal notieren, nicht diskutieren):** Bisherige Regel war "nur Messdaten, keine at-Assets". Tomson hat am 05.07. explizit entschieden, fuer die Formationen die Original-Teilformen zu verwenden, damit das Ergebnis identisch ist ("alles was wir brauchen fuer das Zahnrad von denen nehmen wir"). Als Uebergangsloesung umsetzen; im decisions-log als Tomson-Entscheidung mit Datum dokumentieren; vor LAUNCH muss ein Ersatz durch eigene Teile erneut aufs Tapet (Wiedervorlage!).

## WARUM dieser Weg (Lernkurve der Session 04.07./05.07., NICHT wiederholen)
- Vermessene at-SLOTS + UNSERE Fraunces-Teile darauf = Chaos (Teil-Formen passen nicht zur Komposition). Tomson-Urteil: 45%.
- Eigene geometrische Komposition (Ringe+Zaehne) = von Tomson abgelehnt ("nicht gut").
- Buchstaben-Silhouetten-Fueller in 4 Stilen (/morph-lab: city/kalligramm/mikro/grid) = von Tomson abgelehnt ("nicht schoen").
- Gemini-Referenzbilder (brand/prototypes/relaunch-2026-07/motiv-refs/) = Zahnraeder gut erkennbar, aber Tomson will das IDENTISCHE at-Ergebnis. => Deshalb jetzt deren Original-Teile.
- Die BEWEGUNGS-Engine ist nah dran und bleibt: HomeMorph + stage.ts (Burst verteilt gross im Bild wie Original f_0011, Rand-Einfluege nach at-timing.json, Nicht-Aufpoppen-Regel, Text steigt von unten auf der Gegenseite). NICHT neu bauen — nur die Teil-Quellen (SVGs) und Slot-Zuordnung tauschen.

## ARBEITSMODELL (verbindlich, unveraendert)
- Fable 5 = Supervisor: plant, macht Design-Kritisches selbst, reviewt JEDES Agenten-Ergebnis (Code + Browser-QA) vor Merge. Opus 4.8 = komplexe Mechanik nach ausgekauter Spec (versteht Komplexitaet NICHT selbst — Spec muss jede Entscheidung vorgeben). Sonnet = Mess-/Massenarbeit nach Muster. Token sparen: Fable nur wo noetig (Tomson-Vorgabe, Fable-Kontingent knapp!).
- Autonom in Loops (Browser, Skills, MCPs, parallele Agenten); fragen NUR bei Tomson-Entscheidungen (Design/Funktion/Grosses). Visuelle Entscheidungen IMMER als Bilder/interaktiv vorlegen.
- Nie raten, immer verifizieren; fail-closed; Doku laufend (brand/decisions-log.md datiert, dieser Handoff, Memory).
- Session-Abschluss IMMER via session-end Skill.

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite/TaskCreate), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## Stand dieser Session (04.07. abend bis 05.07. frueh)
### Erledigt + verifiziert (alles gepusht, Branch relaunch, bis 91c9982)
- **Engine v2+v3 komplett:** HomeMorph = EINE durchgehende Buehne (HeroMorph/ScenesMorph geloescht). Tomsons 3 Regeln umgesetzt: (R1) nie mehr Teile aus dem Nichts — 18 Wortmarken-Teile bersten und verteilen sich GROSS im Bild (Original-Verhalten f_0011), Zusatz-Teile fliegen von AUSSERHALB ein, gestaffelt nach vermessenem Original-Rhythmus (lib/relaunch/morph/at-timing.json, tools/parse-at-timing.py); (R2) Nachbarabstands-Kappung gegen Verklumpen; (R3) Text steigt von unten auf der Gegenseite. 61 FPS, tsc gruen, Mobile-Layout ok.
- Messdaten komplett: at-scenes.ts (Slots aller 5 Szenen), at-formations.json, at-timing.json (Entry/Arrive je Teil; ACHTUNG: comp_1-Einflugpunkte liegen mit Kamera-Korrektur ANDERS als ohne — Details im Sonnet-Bericht, Methodik in tools/parse-at-timing.py dokumentiert).
- /morph-lab Testseite (Standbild-Abnahme ohne Scroll) + letterfill.ts (4-Stil-Buchstaben-Packer) + compose.ts (geometrischer Komponist) + Gemini-Referenzbilder motiv-refs/ (2 Zahnrad-Varianten, via agent-browser --profile gemini-immo erzeugt, Canvas-Extraktion funktioniert).
- Videos fuer Tomson: ~/dev/at-reference-videos/unsere-version-v2-morph-engine-2026-07-04.mp4 + unsere-version-v3-teile-logik-2026-07-04.mp4.
### Offen / UNKLAR
- **Tomson-Urteil zum Gesamtstand: 45%.** Kern-Problem = FORMATIONS-OPTIK (Standbilder), nicht Bewegung. Alle bisherigen Eigen-Kompositionen abgelehnt -> Sofort-Auftrag oben.
- Spaeter-Liste (Tomson-Video-Befunde 1:00/1:02): B2B-Logos/Schrift, Footer-Detail-Typografie/Farbe, Schrift-Positionen der Case-Panels.
- Offene Tomson-Fragen aus Vorsessions: Case-Panel-Auswahl, "Red Rabbit Methode"-Definition ausbauen, Kugel-Texturen.
### Naechste konkrete Schritte
1. tools/extract-at-shapes.py (Sonnet-Agent, Spec im Sofort-Auftrag) -> at-shapes-comp1.json
2. HomeMorph/stage.ts: Szene-1-Teile = at-SVG-Pfade (statt Fraunces-Klone); unsere 18 fliegen raus statt zu Slots
3. Overlay-Vergleich Standbild vs f_0022 (praktisch deckungsgleich!) + Bewegungs-Video -> Tomson-Gate
4. Bei Abnahme: comp_2..5 genauso; decisions-log-Eintrag; Wiedervorlage "eigene Teile vor Launch"
### Blocker / Risiken
- Copyright der at-Teilformen (siehe Sofort-Auftrag Punkt 4 — dokumentieren, Wiedervorlage vor Launch).
- Recorder staucht Zeitachse unter Last (agent-browser record) -> Tempo normalisieren (setpts) oder Tomson live scrollen lassen. Lenis vs. window.scrollTo = Race -> Wheel-Events dispatchen; Stills: 2x scrollTo + warten.
- `npm run build` zerschiesst dev-.next -> dev auf :9000 danach neu starten.
### Relevante Dateien/Befehle
- Engine: components/relaunch/HomeMorph.tsx, lib/relaunch/morph/{stage.ts,grammar.ts,pieces.ts,at-scenes.ts,at-timing.json,scene-content.ts}
- Parser: tools/parse-at-lottie.py, tools/parse-at-timing.py; Quelle NUR lesen: ~/dev/at-reference-lottie/anim_0.json
- Referenz: ~/dev/at-reference-videos/ (frames-original/f_0011=Burst-Streuung, f_0022=Zahnraeder-Ziel!)
- Lab: http://localhost:9000/morph-lab (dev: `npm run dev -- --port 9000`)
