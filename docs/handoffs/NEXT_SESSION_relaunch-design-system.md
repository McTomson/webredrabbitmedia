# Naechste Session — relaunch / Unterseiten-Design — Stand 2026-07-12

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, DESIGN.md (§15!), MEMORY.md. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren. Bei Unsicherheit fragen oder fail-closed.
- KOMMANDANT-MODUS (Tomson-Dauerregel): Hauptagent briefet/kontrolliert NUR; Arbeit an parallele
  Sub-Agenten (Haiku=Fleissarbeit, Sonnet=Lesen/Recherche/Browser/QA, Opus=Bau/Design). Ergebnisse
  gegen das Briefing pruefen, was nicht passt geht ZURUECK an den Agenten bis es stimmt. Nach jeder
  Umsetzung eine eigene QA-Runde (frische Augen). Erst dann Tomson zeigen.
- Design-Optionen IMMER visuell zeigen (lokale HTML-Artifacts via `open <datei>`), ehrliche Empfehlung dazu.
- Ownership: Hero-Strang besitzt components/relaunch/*, lib/relaunch/*, HomeMorph, RabbitMark, fonts.ts,
  relaunch-preview, preise-preview. Im Working Tree liegen dessen UNCOMMITTED Aenderungen — NIE anfassen/stagen.
  Einzeln adden, nie `git add -A`.
- Commits enden mit: Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>. Alles nur LOKAL, nicht pushen.
- Dev-Server: `npm run dev -- --port 9000` (haengt gelegentlich: Prozess killen + neu starten, Log pruefen).

## WO WIR STEHEN
Design-System ist FERTIG ENTSCHIEDEN und umgesetzt (Commit 5ac321c, DESIGN.md §8-§15):
Eckig-Gesetz, eine Button-Sprache (sweep=Primaer, frame=Sekundaer, eckige Solid), Schatten-Rollen,
rr-reveal, Testimonial (echte Reviews: 5,0 / 3 Rezensionen), Tags, Reftable, Prose, Premium-Layer P1-P7
(Kinetik, Outline-Fill, Bild-Zerlegung, Drawline, Blocktext, Magnetic, Duotone+Grain), P8 Cursor abgelehnt.
3-Welten-Konzept fuer Spezialseiten + Flow-Video-Specs stehen in DESIGN.md §15.
Stilname: "Kinetische Typo-Collage" (alles Typografie, Scroll=Zeitachse, Flaechen, eckig, Rot einziger Akzent).

## WAS SCHIEFGING (WICHTIGSTE INFO)
Die ersten ECHTEN Unterseiten-Umsetzungen (/ueber-uns-preview, Commits 7778aaf + 43a7558) hat Tomson
BEIDE ALS KATASTROPHE VERWORFEN — trotz technisch gruener QA. Die Route + Dateien
(app/ueber-uns-preview/**, components/subpages/**) bleiben im Repo als ABGELEHNTER Entwurf: NICHT als
Vorlage verwenden, NICHT weiterpolieren ohne neue Richtungs-Abnahme. Die HTML-Boards davor
(scratchpad/erlebnis-board.html, aufbau-board.html, hero-board-v3.html) fand er BESSER als die Umsetzung.
Lektion: die Uebersetzung Board->Repo verlor die Qualitaet (Politur, Timing, Raumgefuehl).

## WIE ES WEITERGEHEN SOLL (Empfehlung)
1. NICHT sofort wieder bauen. Erst mit Tomson die Ziel-Optik festnageln: Referenzen LIVE zeigen
   (k95.it/studio war die recherchierte Blaupause: angeschnittener Riesen-Titel + Fragment-Assembly;
   charmerstudio.com/studio fuer den ruhigen Mittelteil) und fragen, was GENAU er davon will.
2. Dann ein STANDBILD/Comp der Seite abnehmen lassen (statisch, pixelgenau, im scratchpad),
   erst nach Standbild-Freigabe animieren (dieselbe Lehre wie beim Klick-Gate-Hero am 07.07).
3. Erst danach Repo-Umsetzung, mit QA + Kommandant-Kontrolle gegen das abgenommene Standbild.

## Einigungen die BLEIBEN (von Tomson bestaetigt)
- Off-White ist die Buehne der Standard-Unterseiten, Farbwelt-Panels nur als je EIN Akzent pro Seite.
- Echter Intro-Text frueh auf der Seite (SEO: SSR-Text, h1).
- Scroll-Kopplung (vor/zurueck) ueberall, wie die Hauptseite.
- Figuren: NUR die echten Assets (lib/relaunch/morph/at-shapes-comp*.json, kuenstlerische Typo-Collagen)
  thematisch passend einsetzen; selbstgebaute Ersatz-Figuren wirken als Stilbruch (Tomson-Urteil).
- Punkt-Reise-Konzept (roter Punkt = Reise des Besuchers, faellt von der Schrift, wandert NUR beim
  Scrollen, ruht an 4-5 Stationen, landet im CTA) ist als Idee ANGENOMMEN, Umsetzung offen.
- Seiten-Zuteilung: Standard = Ueber uns, Kontakt, FAQ + 4 Leistungs-Detailseiten (Tipps/Artikel eigen);
  Spezial = Leistungen-Uebersicht (Teal), Referenzen (Anthrazit, phantom.land-Kugel + Bild-Zerlegung),
  Preise (Blau, Paket-Snap, evtl. HORIZONTAL wie rabenrifaie.com — Tomson AKTIV erinnern!).
  Flow-Videos NUR fuer die 3 Spezialseiten (Specs in DESIGN.md §15).

## Nuetzliche Recherche-Ergebnisse (liegen im Verlauf/Scratchpad)
- Awwwards-About-Blaupause: k95.it/studio (Screenshots in Session-Scratchpad aboutus/).
- Legacy-Header-Mechanik: components/Header.tsx:34 + Footer.tsx:19 = Pathname-Blockliste;
  /ueber-uns-preview ist NICHT drin; Workaround body:has(.uup-page) in ueber-uns.css existiert.
- Morph-Wiederverwendung: grammar.ts/sampleTimeline/atTimeline importierbar; neue Figuren = Datenarbeit
  ohne Workflow (nicht empfohlen); buildWordLayout kann beliebige Woerter fragmentieren.

## Offen ausserdem
- Stat-Boxen final einbauen (entschieden A Panel-Band sinngemaess; echte Zahlen: 5,0/3 Rezensionen,
  790 Euro, 9 Bundeslaender; Kundenzahl "315+" weiter UNBESTAETIGT).
- Badges/Logo-Leiste sind im System (Commit 5ac321c), Kunden-Namen als Platzhalter.
- Push-Frage (git push -u origin relaunch) weiter offen.
