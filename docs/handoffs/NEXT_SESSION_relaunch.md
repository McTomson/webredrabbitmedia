# Naechste Session — relaunch (2026-07-04)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## Projekt-Sonderregeln (Tomson, verbindlich — aus Session 03./04.07.)
- Design-Entscheidungsfragen IMMER mit visuellen HTML-Beispielen (Artifacts) vorlegen, nie nur Text.
- Detail-Grafikarbeit selbst im Zoom-Loop verifizieren bis 100% sauber, ERST DANN zeigen (Tomson ist nicht die QA).
- grill-me-Stil: eine Frage nach der anderen, immer mit Empfehlung; ehrlich und direkt widersprechen, kein Schoenreden.
- Keine Emojis, keine Gedankenstriche, echte Umlaute in User-Content.

## Stand dieser Session (03.-04.07.2026, Fable 5 Design-Session)

### Erledigt + verifiziert
- **Kompletter Plan steht:** `docs/RELAUNCH_PLAN_2026-07.md` (Phasen P0-P5 mit Gates, Zeitplan, Risiken, Tomson-Lieferliste). Alle Entscheidungen datiert in `brand/decisions-log.md` (Eintraege 2026-07-03/04).
- **all-turtles-Grammatik vermessen + als Bauplan dokumentiert:** `docs/MORPH_SYSTEM_BAUPLAN.md` (7 Regeln, Parameter-Tabelle, Zerfalls-Kaskade G0-G3, Naturbruch-Regel). Live vermessen: 705 Pfade, Groessen 18/62/152px, 86% aufrecht, Dichte 31-35px, Szenen = strenge Ordnungssysteme (radial/spaltig/linear), Fonts = Heldane/Breit/Soehne.
- **Zerlege-Vorlage ABGENOMMEN (Tomson, nach 6 Korrektur-Runden):** 14 Naturbruch-Teile fuer r,e,a,d,b,i,t. Bruch = vertikaler Schnitt EXAKT an der Beruehrungskante, Stammkanten schnurgerade, Pufferzonen gegen AA-Saeume. e = C-Schwung + Deckel (Querbalken beim Deckel!), a = 3 Teile, t/l/s bleiben ganz. G3 = VERMEHRUNG derselben Teile (kein weiteres Schneiden). Exakte Clip-Koordinaten: SPEC-Array in `brand/prototypes/relaunch-2026-07/bauplan-v10.html` + PIECES-Objekt in `scroll-prototyp-v6.html`.
- **Scroll-Prototyp v6 gebaut + kalibriert:** `brand/prototypes/relaunch-2026-07/scroll-prototyp-v6.html`. Ablauf (Tomsons Regie): Logo oben fix + Wortmarke aus den 18 Teilen -> Kontraktion mittig-mittig (15%/38%, lesbar, kontrolliert) -> Buchstaben loesen sich ERST als Ganzes, dann brechen die Teile -> flaechige Verteilung (kleine Teile schneller/weiter) -> Footer-Heimkehr + Logo-Einblendung. Schrift-Rendering scharf (devicePixelRatio). Artifact-URLs: Prototyp https://claude.ai/code/artifact/a046696a-b5f0-4d01-98f9-4569c515290d · Bauplan https://claude.ai/code/artifact/0b26de08-2844-40bf-9d8a-818b03fdf7e6
- Memory aktualisiert: `~/.claude/projects/-Users-McTomson/memory/project_webredrabbit_relaunch_2026_07.md` + 2 neue Dauerregeln (visuelle Designfragen, Pixel-Loop).

### Fixierte Kern-Entscheidungen (nicht neu diskutieren)
Nahezu identische all-turtles-Reproduktion (Ablauf identisch, BILDER eigen); Fatface-Serif-Schriftlogo (Ziel Heldane-Lizenz, bis dahin Fraunces; Kauf nur mit Tomson-OK); Logo-Zeichen (Hase) bleibt KOMPLETT unangetastet; Markenrot #F12032 (aus Logo gesampelt, themenfix); Preise 950/2.900/ab 4.900 + Abo ohne Bindung; Dashboard gratis ab Business; Regional: 9 Bundeslaender + 10-15 Staedte mit Substanz; Hosting: Site bleibt Vercel (Domain/URLs/301 -> Index+Links+Bewertungen erhalten), IONOS-VPS nur Automationen (nach Launch); Bau auf Branch `relaunch`, Vercel-Previews als Gates; SEO-Sofort-Fixes erst MIT Relaunch (Tomson-Entscheidung GEGEN Empfehlung; Wiedervorlage falls >3 Wochen); Arbeitsteilung: Fable 5 = Design-kritisches + Review, Opus 4.8 = mechanische Umsetzung nach Spezifikation.

### Naechste konkrete Schritte (diese Reihenfolge)
1. **Prototyp-v6-Feedback abholen:** Tomson hat v6 noch nicht abgenommen (letzte Iteration: Schaerfe + Kontraktion + Buchstaben-zuerst-Verteilung). Kurz zeigen, Feedback, ggf. 1 Kalibrier-Runde.
2. **grill-me fortsetzen — die 4 offenen Inhalts-Fragen** (visuell aufbereiten!): (a) Panels: Referenzen oder Leistungen? (b) Panel-Farbwelten pro Referenz wie all-turtles ja/nein (verlaesst Ein-Rot-Prinzip bewusst)? (c) Welche Referenz-Assets existieren (Screenshots/Videos/Freigaben)? (d) Engine wiederverwendbar fuer Kundenprojekte + schriftunabhaengig?
3. **Tomson-Lieferliste einsammeln** (blockiert P2+): Referenz-Freigaben + echte Case-Zahlen, Google-Business-Link, Bio + Foto, EINE belegbare Kundenzahl, Font-Kauf-OK (Heldane-Preis vorher recherchieren), Kontaktdaten bestaetigen.
4. **Konkreten Umsetzungs-Plan fuer Opus 4.8 schreiben:** praezise Task-Specs pro Phase (P0 Brand-Texte, P1 Engine, P2 Homepage, P3 Unterseiten, P4 Regional/SEO) mit Akzeptanzkriterien; Design-kritisches (Engine-Kern, Hero, Design-System) bleibt bei Fable 5. Opus-Tasks via Agent-Tool mit model-Override starten, Fable reviewt jedes Ergebnis.
5. **Branch `relaunch` anlegen** (von main), Prototypen + Docs dort weiterfuehren, Vercel-Preview einrichten.
6. P1-Engine: Choreografie-Feinmessung bei all-turtles (Wheel-Events statt scrollTo — Lenis ignoriert Springen; echte Easing-Kurven, Rand-Nachzuegler, Mobile-Verhalten), dann GSAP+Lenis-Fassung.

### Blocker / Risiken
- Verschobene SEO-Fixes kosten laufend Rankings (Canonical Klagenfurt -> Homepage, 404-Footer, Fake-Rating 4,8/315 im Code).
- Referenz-Zahlen fehlen -> Premium-Beweis (4.900er) schwach.
- Heldane-Lizenzkosten unbekannt -> vor Font-Frage recherchieren (Klim Type, Weblizenz traffic-abhaengig).
- Branch `feat/seo-monitor-und-brand-second-brain` traegt weitere uncommittete brand/-Dateien aus frueherer Session (Second Brain) — vor Branch-Wechsel klaeren/committen.

### Relevante Dateien/Befehle
- Plan: `docs/RELAUNCH_PLAN_2026-07.md` · Bauplan: `docs/MORPH_SYSTEM_BAUPLAN.md` · Entscheidungen: `brand/decisions-log.md`
- Prototypen: `brand/prototypes/relaunch-2026-07/` (scroll-prototyp-v6.html = Referenz-Implementierung inkl. PIECES-Koordinaten; lokal testen: `python3 -m http.server 8899` im Ordner, NICHT file://)
- Handoff-Rohstoff (Copy/Positionierung, teils verworfen): `~/Library/Application Support/Claude/local-agent-mode-sessions/e0aa2881-9215-447c-ab17-864d6ef5de75/16684f46-ac82-4407-a99e-a350a849a559/local_30f7e505-1170-4a76-a408-9c924a364fa8/outputs/redrabbit-website-handoff.md` (Panel-Icons + Hasen-Choreo daraus sind VERWORFEN)
- Graphify vor Code-Aufgaben: `graphify query "<Begriff>" --graph graphify-out/graph.json` (Auto-Update via post-commit hook)
- MCP-Anomalie dieser Session: programmatisches scrollTo feuert irgendwann keine Scroll-Events mehr im Chrome-MCP; Workaround im Prototyp: rAF-Loop + `window.__render()`-Hook.
