# Naechste Session — relaunch (Stand 2026-07-04 mittag)

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

### BAUSTAND 04.07 ABEND (Session hat begonnen zu bauen!)
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
