# Naechste Session — Red Rabbit Relaunch: Leistungsseite REDESIGN (Stand 20.07.2026)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, die unten genannten Doku-/Code-Dateien, die betroffenen Komponenten. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden. GILT VERSCHAERFT FUER PREISE (das "6 EUR" ist UNBESTAETIGT, siehe unten).
- Erst einen Plan machen (TodoWrite), dann ausfuehren. Design-Optionen als gerendertes HTML/Artifact zeigen, nicht als Text-Essay.
- Design-Skills nutzen (frontend-design + ui-ux-pro-max sind Projekt-Pflicht; dazu impeccable/emil-design-eng/design-taste). Bau/Recherche an Sonnet-Agenten, Copy an Opus. Jeden Agenten-Diff selbst gegen die Vorgabe pruefen.
- Autonom, voller Zugriff inkl. Browser. Laufend gegen localhost:9000 testen (`npm run dev -- --port 9000`) + review-it bei groesseren Schritten. Nichts als "fertig" melden ohne browser-verifiziertes Ergebnis (Mobile + Desktop, kein horizontales Scrollen/Clipping).
- Relaunch-Muster: committen LOKAL, NICHT pushen. Umlaute echt in User-Content, ASCII in Code/Commits/Pfaden. Kein Gedankenstrich, keine Emojis.

## GOAL
Leistungsseite `app/relaunch-preview/leistungen/page.tsx` (localhost:9000/relaunch-preview/leistungen) neu gestalten. Thomas-Feedback (20.07): "nicht schlecht, aber die Abstaende dazwischen passen nicht, und der Text klingt nach KI-blabla, neu schreiben nach unseren Regeln". DREI Baustellen: (A) Hero-Spacing/Text-Cutoff fixen, (B) Copy komplett neu (Anti-KI, Red-Rabbit-Stimme), (C) Seiten-Aufbau so, dass ein Laie AN DER HAND GEFUEHRT wird und versteht: "oh, ich bekomme eine Website MIT einem Mitarbeiter/Agenten, und kann weitere dazubuchen, die Arbeit fuer mich machen. Cool." Leicht + vertraulich, aber fuehrend.

## DER KERN (Positionierung — DAS ist das Besondere)
Red Rabbit macht Websites (wie andere auch) ABER das Alleinstellungsmerkmal: der Kunde bekommt ein BACKEND mit AGENTEN. Nicht nur WordPress-Style Texte/Bilder aendern, sondern echte Mitarbeiter-Agenten je Bereich: einer ueberwacht dass alles laeuft, einer schreibt Blogbeitraege UND schaltet sie live, einer bearbeitet Anfragen + leitet weiter, usw. EIN Agent ist standardmaessig dabei; weitere kann der Kunde MONATLICH dazubuchen. Die Leistungsseite verkauft dieses monatliche Agenten-Abo.
- KANONISCH: `docs/strategie/LEISTUNGEN_ZUKUNFT_2026-07.md` (§6 = verbindlich, nicht neu aufrollen) + `docs/strategie/LEISTUNGEN_IA_2026-07.md` (Struktur, "KORREKTUR 19.07 (spaet)" = aktuell bindender Flow) + `docs/specs/LEISTUNGEN_SEITE_SPEC.md` (Copy-Nichtverhandelbares).
- Basis (im einmaligen Website-Preis inklusive, unsichtbar bepreist): Hosting, Dashboard mit Klartext-Analytics (Talos = "der mitarbeitende Teil"), Content-Editing light ("Mini-WordPress"), Uptime-Alarm, Speed-/SEO-Report + 1 inkludierter Agent.
- Bezahlte Monats-Module (aktiv verkauft): "Der Schreiber" (Content: Artikel + Social, 1-Klick-Freigabe), "Der Empfang" (Terminbuchung + Anfragen + Auto-Follow-up; Chatbot bewusst NOCH NICHT drin), Outreach-B2B (nur auf Anfrage, TKG/UWG-Rechtscheck noetig; Technik = Pumukel). Vermerkt-nicht-aktiv: Ruf-/Sichtbarkeits-/Conversion-Mitarbeiter.
- ⭐ LUECKE ZUM FIXEN: die aktuelle Seite (`components/subpages/leistungen/WasSieKann.tsx`, `TalosSlot.tsx`) zieht die Linie "1 Agent inklusive, mehr als bezahltes Monats-Add-on" NICHT explizit. Genau das muss das Redesign klarmachen (Thomas' Hauptwunsch).

## DIE 3 WEBSITE-TYPEN + PREIS-REGEL (HART)
3 Arten: One-Pager (Salespage), Business-Page (mehrere Seiten), "auf Anfrage". Doku: **Starter 950 EUR** (One-Pager), **Business 2.900 EUR** (Multi-Page, "beliebteste Wahl", Dashboard inkl.), **Premium ab 4.900 EUR** (umfangreich/custom), + **Custom-Zeile ohne Preis** (grosse/besondere Projekte, Shops, Sonderfunktionen individuell).
- REGEL (woertlich Brief + Spec): "Preise/Zahlen sind autoritativ. Nur 950 / 2.900 / ab 4.900 verwenden. Nie 790." (ACHTUNG: `CLAUDE.md` nennt noch veraltet "790 Starter" — UEBERHOLT, ignorieren, 950 gilt.)
- ⚠️ Thomas sagte "auf anfrage ba 6 euro glaub ich" — dieses "6 EUR" EXISTIERT NIRGENDS in der Doku (er war selbst unsicher). Koennte 6000, ein Monats-Modul-Preis, oder Verwechslung sein. NICHT erfinden, NICHT auf die Seite -> ZUERST Thomas fragen was "6 EUR" meint, bevor irgendeine Zahl ausser 950/2900/ab-4900 erscheint.

## COPY-REGELN (der "klingt nach KI"-Fix)
- Site-Copy = DU-Anrede ("wir"=Agentur, "du"=Kunde), `docs/UNTERSEITEN_STIL.md` §6. (Blog dagegen = Sie, `content-engine/voice/house.md` — NICHT die Leistungsseiten-Stimme.)
- HARTE VERBOTE ueberall: kein Gedankenstrich (–), kein "nicht nur… sondern auch", keine Dreierfiguren/rule-of-three, kein "in der heutigen schnelllebigen Welt", kein Buzzword-Hochglanz, keine makellos ausbalancierten Werbesaetze, keine Emojis, echte Umlaute. Wort "KI" NICHT sichtbar (Faehigkeit statt Technik framen). Telefonnummer nie im Klartext (nur Button + tel:).
- Open-Loop-Hook: oben Neugier-Luecke aufreissen ("Moment, was?!"), bewusst offen, Aufloesung erst am Ende.
- GUTE-Copy-Referenz (ueber-uns-Hero, `components/subpages/ueber-uns-demo/demo.body.html`): kurze konkrete Saetze, ein echter spezifischer Missstand statt abstrakter Behauptung, keine Adjektive die verkaufen. Beispiel: "Stundensaetze, die niemand nachrechnen kann. Projekte, die sich ziehen, weil es sich lohnt, sie zu ziehen. Und am Ende eine Website, die zwar huebsch aussieht, aber niemand findet sie." DAS ist die Latte.

## HERO-FIX (praezise Stellen — siehe Memory relaunch-subpage-hero-kanonisch)
Der Leistungs-Hero ist NICHT SubpageHero.tsx, sondern ein eigener Klon `components/subpages/leistungen-hero2-demo/{demo.css, demo.body.html, demo.engine.jstext}` (+ Wrapper `LeistungenHero2Client.tsx`, bootet nur + portalt die Zahnrad-Figur via MorphSculpture comp=0). Text-Cutoff-Ursache: Copy wurde verbatim (zu lang) in ein fixes maskiertes Fenster gekippt, das auf kurze ueber-uns-Absaetze getunt war. Fix an DREI Stellen gemeinsam:
- Copy kuerzen/chunken: `demo.body.html` `.text-move`-Block (~L26-39).
- Fenster/Masken/Margins: `demo.css` — `.text-window{height:78vh}` + mask-Stops (12%/86%) + `.t-eyebrow/.t-statement/.t-ch/.t-close` margins (~L132-162).
- Scroll->Opacity-Math: `demo.engine.jstext` `measureStory`/`applyStoryText` (~L428-449).
- NICHT im React-Wrapper suchen (keine Spacing-Logik). Klon-Ordner ist Leistungs-eigen -> retunen beruehrt ueber-uns nicht. Die 5 kanonischen Hero-Root-Causes leben in `MorphSculpture.tsx` (siehe Memory).

## WETTBEWERBER-IDEEN (neuzeitwerber.de — studieren, klauen erlaubt)
URLs: /website-erstellen-lassen/, /ki-automatisierung/, /ki-website/, /ki-kundenservice/. Uebertragbar: (1) Selbst-Check-Liste ("hast du diese Symptome?") VOR dem Pitch = Verkauf als Diagnose; (2) Ehrlichkeits-Framing weit oben "nimmt dir Arbeit ab, ersetzt keine Menschen" (deckt sich mit unserer Spec-Regel, nur klarer); (3) konkrete ROI-Rechnung (Stunden gespart x Stundensatz) macht "spart Zeit" greifbar; (4) "fuer wen (noch) nicht"-Sektion (Ehrlichkeit, haben wir geplant aber nicht auf der Seite).

## VORSCHLAG SEITEN-AUFBAU (Startpunkt, mit Thomas schaerfen)
1. Hero (fix, s.o.): Hook "Eine Website, die fuer dich arbeitet" + eine Zeile, die die Neugier-Luecke aufreisst (was heisst "arbeitet"?).
2. Aha-Moment: Website vs. "Website + Mitarbeiter" — passiv (steht nur da) vs. aktiv (erledigt Aufgaben). Kurz, bildlich.
3. Was IMMER dabei ist (Basis): Website + Dashboard/Talos + 1 Agent inklusive. Klarmachen: schon mehr als WordPress.
4. Die 3 Website-Typen (Starter/Business/Premium 950/2900/ab-4900 + Custom auf Anfrage), "beliebteste Wahl" markiert.
5. Deine Mitarbeiter zum Dazubuchen (KERN!): Der Schreiber / Der Empfang / Outreach (+ "weitere auf Anfrage"). Je Modul: was es DIR abnimmt (nicht wie es technisch geht). Monatlich, skaliert.
6. Selbst-Check ("brauchst du das?") + ROI-Gefuehl.
7. So laeuft es ab (kurze Schritte) + "fuer wen (noch) nicht".
8. FAQ (Link zur FAQ-Unterseite) + Referenzen (Link zur Referenzen-Seite) + CTA (Anrufen-Button/Formular).
Scroll-Effekte erlaubt (auch horizontal zum Info-Trennen), solange sie fuehren statt ablenken.

## Stand / Was liegt vor
- WIP gesichert lokal (nicht gepusht): Commit `075b511` "wip(relaunch): Leistungsseite-Stand vor Redesign gesichert". Davor df1b859/3eea8cb/91477fd (Hero auf Klon-Engine + Zahnrad, Produkt-zuerst-Reframe).
- UNTRACKED (bewusst nicht committet, ANSEHEN!): `14_typing_*.png` (8 Screenshots, vmtl. Junk), `app/preise-preview/` (evtl. echte neue Preis-Seite-Arbeit!), `app/relaunch-preview/leistungen-hero2/` (alternativer Hero-Versuch!).
- Fruehere Hero-Fix-Versuche (SubpageHero Zwei-Sektionen) von Thomas abgelehnt; der aktuelle Klon-Ansatz loest die "zwei zerrissene Teile"-Beschwerde. OFFEN ist NUR noch: Copy-Laenge/Spacing + Copy-Qualitaet + Seiten-Aufbau.

## ZUERST LESEN (Reihenfolge)
1. Memory: relaunch-subpage-hero-kanonisch + reference_ueber_uns_template_rezept + feedback_ai_tells_schreibstil + feedback_copy_open_loop_hooks + project_redrabbit_leistungen_architektur_2026_07_17.
2. Docs: `docs/strategie/LEISTUNGEN_IA_2026-07.md` + `docs/strategie/LEISTUNGEN_ZUKUNFT_2026-07.md` §6 + `docs/specs/LEISTUNGEN_SEITE_SPEC.md` + `docs/UNTERSEITEN_STIL.md` + `brand/README.md` + `brand/PREISE_SEITE_BRIEF.md`.
3. Code: `app/relaunch-preview/leistungen/page.tsx`, `components/subpages/leistungen/*`, `components/subpages/leistungen-hero2-demo/*`, `components/subpages/MorphSculpture.tsx`.
4. Wettbewerber-URLs oben.
Dann Plan (TodoWrite), 1-2 offene Punkte mit Thomas klaeren (v.a. "6 EUR"?), dann bauen + browser-verifizieren.
