# Naechste Session — relaunch (Stand 2026-07-04 abend, Session-Ende nach Baustart)

## ARBEITSMODELL (Tomson-Mandat 04.07., verbindlich)
- **Du (Fable 5) bist SUPERVISOR:** planst, machst Design-Kritisches selbst, spawnst fuer alles andere Subagenten via Agent-Tool mit model-Override — Opus 4.8 fuer komplexe Mechanik nach Spec, Sonnet fuer Massenarbeit nach Muster (token-sparend: teuerstes Modell nur wo noetig; Zuteilung: docs/TASK_SPECS_RELAUNCH.md). JEDES Agenten-Ergebnis reviewst DU (Code + Browser-QA + Akzeptanzkriterien; review-it/QA wo sinnvoll) BEVOR es gemerged wird. Erster Durchlauf dieses Modells war erfolgreich (Kugel-Galerie).
- **Autonomie:** voll autonom in Loops arbeiten (Browser, Skills, MCPs, Internet, GitHub-Recherche nach hilfreichen Repos, parallele Agenten, Hintergrund-Builds — alles erlaubt, ohne nachzufragen). AUSNAHME = Tomson-Entscheidungen: Design-Entscheidungen, Funktions-Entscheidungen, alles mit grossem Einfluss. Diese IMMER aktiv anzeigen mit Optionen + Empfehlung (visuell/interaktiv bei Design, Fable-Niveau, keine generischen Menues). Grenzen: kein Botschutz-Umgehen, keine Account-Anlage, kein Font-Kauf, nichts Destruktives, NIE Credentials eingeben.
- **Nie raten, keine Halluzinationen:** verifizieren (Code/Browser/Messung/Docs) oder fail-closed; fehlende Fakten = klar markierte PLATZHALTER.
- **Laufend testen** (Browser-Screenshots, Builds) + Kurs pruefen; **Doku permanent aktuell halten:** brand/decisions-log.md (datiert), dieser Handoff, Memory (~/.claude/projects/-Users-McTomson/memory/), Graphify laeuft via post-commit automatisch. Obsidian wird bewusst NICHT befuellt (Repo = Single Source of Truth, Entscheidung 04.07. frueh).

## SKILLS — wann und wie (Tomson-Mandat 05.07., verbindlich)
Volles Inventar: `~/.claude/skills/DESIGN-SKILLS-CATALOG.md` (+ CLAUDE.md-Projektregel). Fuer den Relaunch gilt:
- **Vor JEDER UI-/Sektions-Arbeit laden:** `frontend-design` (Anti-Generik, Umsetzung) + `ui-ux-pro-max` (Review-Checkliste: Kontrast 4.5:1, Touch-Targets 44px, reduced-motion, kein Overflow). Beide sind Projektpflicht (CLAUDE.md).
- **Motion-/Polish-Pass (Hero-Feintuning, Kugel-Feel):** `emil-design-eng`; fuer harte Qualitaets-Audits `impeccable` (audit/polish/harden).
- **Bestehende Alt-Seiten aufwerten (P3-Migration /artikel):** `redesign-existing-projects`.
- **Groessere Meilensteine reviewen:** `review-it` (nach jedem Agenten-Merge zusaetzlich zur Fable-Kontrolle sinnvoll).
- **Plan-/Entscheidungsrunden mit Tomson:** `grill-me` (eine Frage, mit Empfehlung); Session-Abschluss IMMER via `session-end`.
- **Referenz-Bilder/Assets:** `imagegen-frontend-web`/`brandkit` NUR wenn der etablierte Gemini-Browser-Flow nicht passt (Runbook bevorzugen).
- **Brand-/Copy-Arbeit:** `brand` + brand/-Ordner zuerst lesen. NICHT verwenden: `stitch-*` (kein Stitch im Relaunch), `graphify`-Skill nur fuer Wissens-Ingest (Code-Graph laeuft via CLI).
- Regel: Skill VOR der Arbeit laden, nicht danach; Ergebnis gegen die Skill-Checkliste pruefen, Befunde ins Review.

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## Projekt-Sonderregeln (Tomson, verbindlich)
- Design-Entscheidungsfragen IMMER mit visuellen, INTERAKTIVEN HTML-Beispielen (Artifacts) — und auf Fable-Niveau, keine generischen "Kindergarten-Menues" (Tomson-Kritik 04.07.). Bei Bedarf Internet-Inspiration holen.
- Detail-Grafikarbeit selbst im Zoom-Loop verifizieren bis 100% sauber, ERST DANN zeigen.
- grill-me-Stil: eine Frage nach der anderen, immer mit Empfehlung; ehrlich widersprechen.
- Keine Emojis, keine Gedankenstriche, echte Umlaute, Du-Anrede in aller Website-Copy.
- Keine erfundenen Fakten: fehlende Zahlen/Kommentare = realistisch gesetzte, KLAR MARKIERTE Platzhalter.

## PFLICHT-LEKTUERE vor jeder Arbeit (Reihenfolge)
1. `docs/TASK_SPECS_RELAUNCH.md` — komplette Rest-Inventur + LLM-Zuteilung + Ablauf pro Arbeitspaket
2. `docs/HOMEPAGE_BLAUPAUSE_ALLTURTLES.md` — VERBINDLICHE Homepage-Sektionsfolge (live vermessen)
3. `docs/MORPH_SYSTEM_BAUPLAN.md` §0 — Lottie-Befund: exakte Keyframe-Grammatik (DER Durchbruch)
4. `docs/RELAUNCH_PLAN_2026-07.md` + `brand/decisions-log.md` (Eintraege 03.-04.07.) — alle Entscheidungen
5. Referenz-Daten: `~/dev/at-reference-lottie/` (9 Original-Lottie-JSONs, NUR Studium, NIE verwenden/committen)

## Stand 04.07. (diese Session — Grill abgeschlossen, Planung KOMPLETT)
### Durchbruch
all-turtles-Morph = handanimiertes LOTTIE (After Effects), per Scroll gescrubbt. Alle Keyframes extrahiert + Grammatik gemessen (EIN Easing cubic-bezier(.6,0,.4,1) fuer alles; Kontraktion ohne Rotation, flach ±20px vertikal, 20-50px horizontal; gerade 2-Punkt-Flugbahnen; Stagger; Dauer konstant, weiter=schneller; nur ~40% rotieren beim Burst). Konsequenz: Engine = Keyframe-Choreografie-Player, KEINE Physik. Prototyp-Politur beendet.

### Fixierte Entscheidungen 04.07. (nicht neu diskutieren)
- Homepage-Struktur = all-turtles 1:1 (Blaupause-Doc), Anpassungen minimal. Fable-Recherche-Reihenfolge VERWORFEN.
- 5 Leistungs-Szenen bestaetigt: Webdesign / Google-Sichtbarkeit / KI-Sichtbarkeit / Content & KI-Artikel / Dashboard & Betreuung — Statements problem-first (Entwuerfe im decisions-log/Chat 04.07.).
- Positionierungs-Klammer bestaetigt: **"Die Website, die selbst arbeitet"** (AI-Automationen im Hintergrund als Extra-USP: Artikel-Engine, Auto-Reviews, Auto-Reports, Monitoring — alles durch eigenen Betrieb belegbar).
- Anrede: DU. Sichtbares schlankes Menue Desktop (Referenzen, Leistungen, Preise, Ueber uns, Kontakt) + Burger mobil. Preise als Seite/Menuepunkt, NICHT als Homepage-Sektion.
- Portfolio: eigener Bereich mit phantom.land-Kugel-Galerie (Three.js+GSAP, Kacheln duerfen sich wiederholen) + crawlbare Liste; Projektliste steht (rero, danesh, thermenwartung, rero-michael, Pizza-Seite, K2/villagegardencondo, La Morra, Tino Jugler, Global Insights, web.redrabbit).
- B2B-Namen (SIGNA, 6B47, Tillmann & Kraus, MBT, Sans Souci, Vorsorgewohnungs GmbH, Phils.place): rein typografisch, eine Farbe/Art, in der Firmen-Listen-Sektion (all-turtles macht es exakt so).
- FONTS: KEIN Kauf. Fraunces (OFL) + freie Sans. Punkt erledigt.
- Regionalseiten = vollwertige regionale Landingpages (Local-SEO-Standard). SEO/GEO/LLM-Playbook = eigenes Dokument vor P4.
- Artikel-Engine laeuft unveraendert; zusaetzlich 1 Pillar-Artikel pro Leistungs-/Regionalseite; keine zweite Posting-Routine.
- Handoff-MD vom 03.07. (redrabbit-website-handoff.md) = nur Ideen-Steinbruch, kritisch filtern.

### BAUSTAND 05.07 NACHMITTAG (P2 Homepage + P3 Unterseiten FERTIG, gepusht bis 8f9ebea)
- P2 Homepage KOMPLETT nach Blaupause auf /relaunch-preview (b79dc69): Ueberleitung, 3 Case-Panels (Farbwelten, horizontale Fahrt mit Master-Easing, Riesen-Initial), Zahlen-Statement (PLATZHALTER markiert), Firmen-Liste 5x3, Riesen-CTA, Footer-Wortmarken-Reassembly (buildReassembly in grammar.ts). Browser-verifiziert, Build gruen.
- P3 Unterseiten von Opus-Agent gebaut, Fable-Review bestanden (Umlaut-Fix 150 Stellen eingefordert, 14d0fc5), gemerged 8f9ebea: /leistungen (+4 Unterseiten mit FAQ-JSON-LD), /preise (950/2.900/ab 4.900, Entwurf-ohne-Vorkasse prominent), /ueber-uns (Bio/Foto PLATZHALTER), /faq (14 Fragen), /kontakt (neues Formular an bestehende /api/contact, DSGVO-Checkbox client-seitig). Adresse+Oeffnungszeiten gegen Impressum/layout.tsx verifiziert.
- FAKTEN-FIX projects.ts: thermenwartung.at gehoert allgas.at -> UNSERE Domain thermewarten.at; almtal-invest-Domain nicht aufloesbar -> Link fail-closed raus (Tomson fragen!).
- "Red Rabbit Methode": 3 Vorschlaege als Artifact vorgelegt (56e66763-3f60-4e0b-92c2-8fffc9100ecf), ENTSCHEIDUNG OFFEN.
- LESSON NEU: (1) Pipe maskiert Build-Exit ("| tail; echo $?" zeigt tail-Exit!) -> Build in Log-Datei, EXIT separat. (2) Wiederkehrend korruptes Teil-node_modules unter .claude/worktrees/node_modules laesst JEDEN Worktree-Build scheitern ("Can't resolve ../lib/is-error") -> vor Worktree-Builds loeschen, Ursache offen. (3) Styleguide-Seite hat noch 5 ASCII-Umlaute (selbst fixen, intern).
- OFFENE TOMSON-FRAGEN: Case-Panel-Auswahl bestaetigen (thermewarten/Almtal/Danesh), almtal-Domain, B2B-Einzeiler pruefen, Business vs Premium als hervorgehobenes Paket, Methode-Entscheidung.

### BAUSTAND 04.07 ABEND (historisch)
- Branch `relaunch` existiert (gepusht). Commits: Second-Brain-Docs, Planungs-Docs, P0 Design-System (993d10a), P1 Hero-Morph (e8d3a4a), P1b 5 Leistungs-Szenen (798695d).
- LIVE VERIFIZIERT: /styleguide (Design-System komplett), /relaunch-preview (Hero: Kontraktion ohne Rotation -> Burst -> Naturbruch-Zerfall; danach 5 Szenen: Browser/Lupe/Sprechblase/Artikel/Chart-Formationen mit Assembly-Grammatik). Lupe klar erkennbar.
- LESSON: Tailwind-Preflight `img{max-width:100%}` macht Teile unsichtbar (Buehne 0 breit) -> immer `max-width:none` auf Morph-Teilen.
- ERLEDIGT ZUSAETZLICH: Kugel-Galerie (Opus-Agent, von Fable reviewt+gefixt+gemerged, d3a6e19): /referenzen-preview mit Three.js-Kugel (40 Kacheln, Drag mit Traegheit, Klick-Zoom+Overlay, 2D-Fallback, crawlbare SSR-Liste). LESSON: Repo-Build braucht jetzt NODE_OPTIONS=--max-old-space-size=6144 (steht im build-Script; Ursache: 200+ Seiten + three.js).
- OFFEN P1: Footer-Reassembly, Hero-Feintuning gegen Original, Mobile-Pass. OFFEN P2b: Feel-Tuning Kugel (Drag-Daempfung vs. phantom.land), echte Site-Screenshots als Texturen. NEU P0: "Red Rabbit Methode" (eigenes Framework-Wort, 2-3 Vorschlaege visuell) + danach Grill-Thema "Inhalte".
- Tomson-Dauerregel NEU: autonome Loops, fragen NUR bei wichtigen Entscheidungen; laufend testen; Memory/Doku immer aktuell (memory/feedback_relaunch_autonomie_loop_regeln.md).

### NAECHSTE SESSION: BAUEN (P0+P1 nach TASK_SPECS Reihenfolge S1)
1. Branch `relaunch` anlegen (VORHER klaeren: Branch feat/seo-monitor-und-brand-second-brain traegt evtl. uncommittete brand/-Dateien).
2. P0: Design-System/Guide + /styleguide-Seite (Fable), Messaging in brand/ finalisieren, Wortmarken-Spec formalisieren.
3. P1: Keyframe-Player + Hero-Choreo nach §0-Grammatik (Fable). -> Vercel-Preview Gate 1.
4. Subagenten spawnen per Agent-Tool mit model-Override (opus/sonnet) exakt nach TASK_SPECS-Zuteilung; Fable reviewt JEDES Ergebnis gegen die Akzeptanzkriterien.
5. Tomson liefert (nachfragen wenn nicht da): Bio + Foto, Google-Business-Link, belegbare Kundenzahl.

### Blocker / Risiken
- Verschobene SEO-Fixes kosten weiter Rankings (mit Relaunch beheben; Wiedervorlage falls >3 Wochen).
- Echte Case-Zahlen fehlen -> Platzhalter-Regel aktiv, vor Launch ersetzen/rausnehmen.
- WebGL-Kugel: Mobile-Performance + SEO-Fallback sind PFLICHT-Bestandteil der Opus-Spec.

### Artifacts dieser Session
- Scroll-Prototyp v6 (historisch): https://claude.ai/code/artifact/a046696a-b5f0-4d01-98f9-4569c515290d
- Bauplan: https://claude.ai/code/artifact/0b26de08-2844-40bf-9d8a-818b03fdf7e6
- 3 Panel-Konzepte (Ideen-Reserve, NICHT Bauvorlage): https://claude.ai/code/artifact/031c21a5-4c3d-4a18-9a89-53ab51c741de
