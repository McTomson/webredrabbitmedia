# decisions-log.md — Marken-Entscheidungen (append-only, datiert)

Neueste oben. Nichts loeschen, nur ergaenzen. Bei Aenderung einer alten Entscheidung neuen Eintrag mit Verweis anlegen.

## 2026-06-15
- **Marken-Richtung = Option 3 "fair + selektiv" (Hybrid).** Kern (zugaenglich, risikofrei) bleibt, aufgeladen mit Menschlichkeit, Haltung/Feindbild und sanfter Selektivitaet. Option 2 (exklusiv-teuer) verworfen, weil sie dem Risiko-frei-USP widerspricht und Belege (8 Reviews, geringe Sichtbarkeit) Premium noch nicht tragen.
- **Preis/Risiko-Modell:** Design-Vorschlag bleibt OHNE Vorkasse. **Anzahlung erst, wenn der Kunde zusagt und den Auftrag erteilt.** 790 EUR wird zum Starter/One-Pager-Einstieg, hoehere Pakete darueber (Struktur noch zu definieren).
- **Cult-Brand-Wissen** aus NotebookLM (13 Videos) extrahiert und nach Eignung gefiltert (siehe `cult-brand-playbook.md`): sofort nutzen = Menschlichkeit/Imperfektion, Storytelling, Feindbild schaerfen; bedingt = Identitaet/In-Group, Wert an obere Motive koppeln; nur abgeschwaecht = Kapazitaets-Selektivitaet; Tabu = Fake-Scarcity, echte Exklusivitaet.
- **Second Brain angelegt:** Ordner `brand/` im Repo als Single Source of Truth, in `CLAUDE.md` verankert.
- **Preis-Architektur FIXIERT (Tomson 16.06, nach Research an 10 Agenturen + NotebookLM):** Agentur-Band 4.000-10.000, klar ueber Ein-Mann-Buden. Leiter: Starter 990-1.490 (One-Pager, untergeordnet) / Business ab ~2.900-3.500 / **Premium/Flaggschiff ab 4.900-6.900 (Held)** / Custom auf Anfrage (Anker, 10.000+). Wartungs-/Optimierungs-Abo OHNE Bindung (79-149/Mon). Verkaufs-Hebel: KMU.DIGITAL-Foerderung (bis 50%, max 6.000) kommunizieren. Details/Belege: brand/pricing.md. OFFEN-Mikro: exakter Premium-Boden (4.900 vs 6.900), Abo-Final. ERSETZT die fruehere "ab 3.800"-Annahme (war oberes Ein-Mann-Niveau, zu tief fuer Agentur-Anspruch).
- **PREMIUM-Preis: Websites ab 3.800 EUR (Tomson 15.06):** Das ist das eigentliche Geld-Verdienen-Produkt. Bewusst abheben + anders sein (Statements, Optik, eigene Seite als Aushaengeschild). 790 EUR nur noch One-Pager/Koeder, NICHT als Anker fuers Hauptprodukt. Konsequenz: hoeherer Beweis-/Politur-/Autoritaets-Anspruch, Verkauf von Outcome+Expertise statt "Website", Experten-Fuehrung statt nur Ausfuehren. Echte Zufriedenheits-Treiber (iterieren bis es passt, gratis Tipps, Over-Delivery) = Premium-Rechtfertiger, in messaging.md.
- **Markenwert "Premium, aber nicht ueberheblich" (Idee Tomson 15.06, zu verifizieren):** 790er-Starter/One-Pager bleibt (ggf. etwas teurer), damit auch kleine Kunden Qualitaet bekommen = bewusst nicht arrogant/elitaer. Differenzierung gegen snobby Hochpreis-Agenturen + passt zu Tomsons bodenstaendiger Art. STOLPERFALLE (ehrlich): 790 darf das 3.800er-Premium nicht billig ankern -> Starter klar separat/untergeordnet zeigen, Hero verkauft Premium-Outcome, nicht den Einstiegspreis.
- **Komplette Website-Neugestaltung + Beweis-Prinzip (Tomson 15.06):** web.redrabbit.media wird komplett neu gestaltet. Henne-Ei (sagen vs. beweisen) wird so geloest: **Die neue Seite IST der Beweis** (schnell, conversion-stark, rankt, transparent = Case Study in eigener Sache). Reihenfolge: erst leise beweisen (eigene Ergebnisse/Seite top machen), dann laut behaupten (v.a. Statement 4 erst wenn wir wirklich ranken). Grundregel: jede Aussage/Annahme muss belegbar sein, nichts halluzinieren.
- **Haltungs-Statements (Tomson-Auswahl 15.06):** 1,2,3,5 freigegeben; 4 freigegeben aber erst nutzen wenn eigene Seite rankt; 6 ok, klein halten. Details + Beweis-Audit in `manifesto-statements.md`.
- **Positionierung bleibt GENERISCH (Tomson 15.06):** Auftraege von allen Branchen gewollt. KEINE Nischen-Positionierung auf Immobilien. Immobilien nur als eigene Unterseite/Landingpage OK. -> Differenzierung kommt NICHT ueber die Vertikale, sondern ueber die Marken-Mechanik (Feindbild, Glaube/These, Stamm/In-Group, eigene benannte Methode, Story, polarisierende Haltung = Cult-Brand-Hebel). Ziel: ein WOW-Konzept, das wirklich anders ist, nicht 08/15.
- **Dmitri GANZ RAUS (Tomson 16.06):** kein 50/50-Partner mehr, Tomson alleiniger Inhaber. Weiterhin: nicht als Autor/Stimme verwenden; bestehende Artikel/Config/Schema bleiben unveraendert (kein Refactor), ausser Tomson will es.
- **Dmitri ab jetzt nicht mehr verwenden (Tomson 15.06):** Dmitry Pashlov wird fuer NEUE Inhalte/Bylines nicht mehr genutzt, Thomas Uhlir ist das Gesicht/der Autor. Bestehende Artikel, `lib/config.ts` und Schema bleiben UNVERAENDERT (kein Refactor, kein Loeschen). `voice/dmitry.md` entsprechend markiert.

## Offene Punkte (zu entscheiden)
- Paket-/Preisstruktur ueber dem 790-EUR-Starter (Tiers, Preise, Leistungen).
- Anzahlungs-Hoehe und ob "kein Risiko" in allen Tiers gilt.
- Schaerfegrad des Feindbilds fuer die konservative Zielgruppe.
- Social-Proof-Aufbau (echte Reviews + Case Studies mit Zahlen) als Premium-Voraussetzung.

## 2026-07-03 — Relaunch-Session mit Claude (Fable 5): Design-Grundsatzentscheidungen
- **Effekt = nahezu identische all-turtles-Reproduktion.** Ablauf, Art, Tempo-Staffelung, Scroll-Mechanik identisch nachbauen; nur die entstehenden BILDER muessen eigene sein (nicht deren Zahnraeder-Motive kopieren). Motive definiert Claude pro Sektions-Botschaft, Freigabe Tomson.
- **Morph-Material = Buchstaben des Schriftlogos "red rabbit"** (ganze Buchstaben UND Fragmente, wie bei all-turtles), die "wild" durch die Seite purzeln, Zusatzteile kommen von den Raendern, gestaffeltes Zusammensetzen zum Motiv. NICHT das Logo-Zeichen zerlegen.
- **Logo-Zeichen (Hasen-Symbol) bleibt komplett unangetastet.** Daneben entsteht ein Schriftlogo "red rabbit" analog zum gestapelten all-turtles-Wortlogo.
- **Wortmarke/Headline-Schrift = kontraststarke Fatface-Serif (Heldane-Stil, "Version 2").** Ziel: gleiche Schriften wie all-turtles (Heldane/Breit/Soehne, kommerziell). Bis zur Lizenz-Freigabe Fraunces als Platzhalter; Kauf nur mit explizitem Tomson-OK.
- **Verworfen:** Hasen-Choreografie (springender Hase, Panel-Piktogramme Telefon/Lupe/Blitz/Haken/Sprechblase aus dem Handoff 03.07), Balken/Punkte-Mosaik, Logo-Zerlegung. Handoff-Copy gilt nur als Rohstoff, Brand-Identitaet wird vor dem Website-Bau neu aufgebaut (Positionierung: konkrete Webdesign-Agentur, USP Sichtbarkeit Google+LLM/EEAT, AI-Content wie eigene Artikel-Engine, Kunden-Dashboard; Website muss nach 6.000+ Euro aussehen; 3 Pakete ab ~950).
- **Nachtrag 03.07 abends — Hero/Footer-Regie (Tomson):** Hero = Logo-Zeichen oben + Schriftlogo "red rabbit" FERTIG positioniert darunter; beim Scrollen zieht sich die Schrift erst ZUSAMMEN (Kontraktions-Anticipation wie all-turtles), dann zerfliegen die Buchstaben; Logo-Zeichen bleibt dabei stehen. Footer = Buchstaben kehren zurueck, setzen sich zusammen, danach blendet das Logo-Zeichen dazu ein. Assembly-Stil des Prototyps v1 fuer den Footer freigegeben ("gut fuers Footer, in der Art"). Exakte Zerteilung/Timing/Easing: Claude vermisst all-turtles und uebernimmt, keine weitere Definition durch Tomson noetig.
- **Nachtrag 03.07 spaet — Naturbruch-Regel (Tomson):** Zerteilung NUR an der duennsten Stelle der Form (Haarlinien-Gelenke, freie Luecken), nie durch dicke Striche; Buchstaben ohne duenne Stelle brechen nicht (fliegen ganz); Ueberlappung erlaubt. Grund: Natuerlichkeit erzeugt unbewusste Harmonie/Vertrauen. Eingearbeitet in docs/MORPH_SYSTEM_BAUPLAN.md (Regel 2) + Bauplan-Artifact.
- **04.07 frueh — Zerlege-Vorlage ABGENOMMEN + Prototyp v4:** Naturbruch-Teile final (14 Formen, 18 Instanzen fuer "red rabbit"): vertikale Schnitte exakt an den Kontaktkanten mit Pufferzonen (Clip-Regionen, keine Pixel-Radierung; Koordinaten in docs/MORPH_SYSTEM_BAUPLAN.md + Bauplan-Artifact SPEC). e=C-Schwung+Deckel (Querbalken beim Deckel), a=3 Teile, t/l/s ganz. G3 = VERMEHRUNG derselben Teile in kleineren Groessen (kein weiteres Schneiden). Scroll-Prototyp v4 mit den echten Teilen gebaut (Kontraktion->Bruch->Verteilung->Footer-Heimkehr), wartet auf Tomson-Review.

## 2026-07-04 (Nacht-Session, Fable 5): Lottie-Befund — Architektur der Morph-Engine fixiert
- v6-Prototyp NICHT freigegeben (Tomson): Kontraktion muss rotationsfrei auf horizontaler Ebene bleiben, Abstaende/Schriftgroesse/Wegflug-Verhalten nicht all-turtles-treu. Statt weiterer Prototyp-Politur: Tiefenanalyse.
- BEFUND: all-turtles-Morph ist eine handanimierte After-Effects-Animation (Lottie-JSON, lottie-web, per Scroll gescrubbt). Komplette Keyframe-Daten extrahiert und analysiert (9 JSONs in ~/dev/at-reference-lottie/, NICHT im Repo, Copyright).
- Gemessene Grammatik in docs/MORPH_SYSTEM_BAUPLAN.md §0: EIN Easing cubic-bezier(0.6,0,0.4,1) fuer alles; Kontraktion 0 Rotation, vertikal flach +-20px, horizontal 20-50px zum Zentrum; gerade 2-Punkt-Flugbahnen; Stagger ueber ~50% der Phase; Flugdauer konstant ~10/24 Frames (weiter = schneller); nur ~40% der Buchstaben rotieren beim Burst; Szenen halten statisch (Ruhepunkte); Scale = Vermehrungs-Mechanik.
- ENTSCHEIDUNG: red-rabbit-Engine = Keyframe-Choreografie-Player (Daten + Interpolator), KEINE Physik-Simulation. Choreo generativ nach Grammatik erzeugen, dann handtunen. Prototyp-v7-Politur entfaellt; Feel-Beweis erfolgt direkt in der Engine-Fassung (P1) mit den gemessenen Kurven.

## 2026-07-04 (Fortsetzung): Referenz-Praesentation = spherische 3D-Galerie (phantom.land-Vorbild)
- Tomson-Entscheidung: Unsere Arbeiten werden wie auf https://www.phantom.land/ praesentiert: Galerie in sphaerischer Dimension (Betrachter im Inneren einer Kugel), left-click-drag zum Umschauen mit smooth-scroll-artigem Easing (Lenis-Gefuehl), Tap auf eine Karte animiert die Detailseite ein.
- Technik-Vorgabe (aus Tomsons Referenz-Prompt): GSAP + Three.js; Verhalten und Stil so nah wie moeglich am Original; mit Chrome DevTools gegen das Original verifizieren. Nur geplant, Umsetzung in P2 (Referenzen-Sektion), nicht sofort.
- Verhaeltnis zu den 3 Panel-Konzepten vom selben Abend: Kugel-Galerie = Uebersicht/Buehne aller Arbeiten; Panel-Konzepte 01 (Immersion) / 02 (Vorher-Nachher-Regler) bleiben Kandidaten fuer die Case-DETAILSEITEN bzw. Homepage-Sektionen. Zuordnung offen, haengt an Referenz-Freigaben/Stueckzahl.
- Risiken notiert: WebGL-Last auf Mobile (Fallback noetig: 2D-Galerie/Grid + prefers-reduced-motion), Kugel wirkt erst ab ~15+ Kacheln voll (Bestand pruefen), SEO (WebGL-Inhalte zusaetzlich als crawlbare HTML-Liste rendern).

## 2026-07-04 (vormittag): Case-Bereiche = all-turtles 1:1, Technik vor Design-Pass
- Tomson-Entscheidung: Die Case-/Referenz-Bereiche der Homepage werden funktionell UND optisch wie die all-turtles-Case-Panels gebaut (Airtime/Carrot-Vorbild): volle Farbwelt pro Case, Eyebrow in Akzentfarbe, weisse Serif-Headline, riesiger angeschnittener Kunden-Anfangsbuchstabe Ton-in-Ton im Hintergrund, echte Produkt-Medien davor; horizontales Scrollen zwischen Panels, im Bereich dann vertikal.
- Vorgehen: ZUERST Struktur/Mechanik 1:1 nachbauen (Platzhalter-Inhalte), DANACH gemeinsamer Design-Pass Panel fuer Panel. Exakte Masse beim Bau am Original nachmessen (Methode: DevTools/Bundle-Analyse wie beim Lottie-Befund).
- Die 3 Panel-Konzepte vom 04.07 (Immersion/Regler/Werkschau) = Ideen-Reserve, nicht Bauvorlage. Portfolio-Uebersicht bleibt eigener Bereich (phantom.land-Kugel, P2b).

## 2026-07-04 (vormittag, Teil 2): Portfolio-Inhalte, Fonts, B2B-Namen, Platzhalter-Regel
- Kugel-Galerie: eigene Websites WIEDERHOLEN sich als Kacheln, bis genug echte Projekte da sind (Tomson-OK).
- Projektliste Portfolio (namentlich zeigen, Tomson 04.07): rero / heating-systems, lashesbydanesh, thermenwartung (thermewarten.at), rero-michael, Pizza-Seite, K2 (Seite www.villagegardencondo.com), Ristorante La Morra, Tino Jugler (Fliesenlegermeister), Global Insights (Michaela Ruderes), web.redrabbit selbst. Spaeter erweiterbar. (Ersetzt die aeltere Notiz "K2 bleibt draussen".)
- Case-Inhalte: Vorher/Nachher-Material existiert NICHT; gezeigt werden Ergebnisse. Zahlen + Kundenkommentare, die noch nicht belegt vorliegen, werden REALISTISCH als klar markierte "PLATZHALTER" gesetzt und vor Launch durch echte ersetzt/freigegeben.
- FONTS: KEIN Kauf, nur Gratis-Schriften (Tomson hatte mal eine Lizenz, unauffindbar, wird nicht erneuert). Fraunces (OFL) bleibt Display-Schrift, dazu freie Sans (z.B. Inter/andere OFL). Plan-Punkt "Font-Kauf-OK" GESTRICHEN.
- Conversion: bisheriger Abschluss = Formular oder Anruf; bleibt primaer (Details in P2-Spec).
- B2B-Referenz-Namen (Zusammenarbeiten/Webauftritte aus Tomsons Immobilien-Vergangenheit): SIGNA, 6B47, Tillmann & Kraus, MBT, Sans Souci, Die Vorsorgewohnungs GmbH, Phils.place. Darstellung: ALLE in EINER Farbe und EINER Schriftart, rein typografisch (keine Logos). Wo/wie im Gesamtkonzept: Vorschlag Fable = eigene "Vertraut von"-Zeile/Sektion, Platzierung wird im Homepage-Wireframe (P2) fixiert.
- Design-Guide: JA, eigenes Deliverable in P0 (DESIGN_SYSTEM.md + lebende Styleguide-Seite) fuer ALLE Seiten, nicht nur Homepage.
- Morph-Reassembly: Zerfall/Zusammensetzen in verschiedene Formationen pro Sektion = Kern des Keyframe-Systems (P1/P2); Formationen entwirft Fable pro Sektions-Botschaft, Tomson gibt einzeln frei.

## 2026-07-04: Anrede = DU
- Gesamte Website duzt, direkt ansprechen (Tomson 04.07). Ersetzt das bisherige Sie. Gilt fuer alle Seiten, Regionalseiten, FAQ, Formulare; Artikel-Engine-Voice pruefen und angleichen (content-engine/voice/house.md).

## 2026-07-04 (mittag): Drei Ebenen geklaert + User-Verhaltens-Recherche (NN/g u.a.)
- Recherche-Basis (Tomson-Auftrag "reverse engineering, nicht nur unser Stil"): NN/g-Studien = B2B-Kaeufer verlassen Seiten ohne Preise Richtung Mitbewerber, Preise zeigen = Vertrauens-Signal, 81% vergleichen ~3 Anbieter. KMU-Kaeufer-Kriterien in Rangfolge: Portfolio-Qualitaet, Branchen-Naehe, Preis-Transparenz, echte Bewertungen, Seriositaet/Greifbarkeit, Mobile-Speed.
- SEITENBAUM (existiert alles): /, /referenzen (Kugel + crawlbare Liste + Case-Detailseiten), /leistungen (+/webdesign,/seo,/ki-sichtbarkeit,/dashboard), /preise, /ueber-uns, /faq, /kontakt, /webdesign-[region] (9 BL + Staedte), /artikel. Von Tomson bestaetigt bis auf Menue-Detail.
- MENUE (schlank): Referenzen, Leistungen, Preise, Ueber uns, Kontakt. Preise IM Menue = Empfehlung aus Evidenz (staerkstes Bottom-Funnel-Signal); Startseite bekommt nur dezenten Preis-Teaser weit unten, KEINE Preistabelle oben (Tomson-Bedenken beruecksichtigt).
- STARTSEITEN-REIHENFOLGE (user-optimiert nach Kaeufer-Kriterien): Hero-Morph mit Klartext-Versprechen + CTA -> Case-Panels (Beweis zuerst!) -> B2B-Namenszeile -> Leistungs-/Nutzenblock kurz (Website + Google/KI-Sichtbarkeit + Dashboard) -> Ergebnis-Zahlen/Kommentare (PLATZHALTER-Regel) -> Preis-Teaser "ab 950" + KMU.DIGITAL -> Prozess "Entwurf ohne Vorkasse" (Risiko-USP) -> Kurz-FAQ -> Abschluss Formular + Telefon -> Footer-Reassembly.
- REGIONALSEITEN bestaetigt als Tomsons "SEO-Trick" = Local-Landing-Page-Standard: jede Seite = vollwertige regionale Startseite (H1 Webdesign + Region, lokale Referenzen/Bezuege, LocalBusiness-Schema, eigener Content, self-canonical), Ziel = Rankings + Auftraege aus der Region.
- NEUER EIGENER PUNKT: SEO/GEO/LLM-PLAYBOOK als eigenes Dokument (P4-Spec): Schema-Vollausbau, EEAT-Autorenseiten, llms.txt, AI-Overview-/LLM-Antwort-Optimierung (Q&A-Bloecke), interne Hub-Spoke-Verlinkung, Artikel-Cluster zu Pillar-Pages, GBP + echte Reviews, CWV-Budget, Kunden-Footer-Backlinks (footprint-vorsichtig), Syndication (Medium/Substack/YouTube). Tomson: "wir brauchen viel viel mehr SEO-Tricks".
- ARTIKEL: Engine laeuft unveraendert taeglich weiter; ZUSAETZLICH pro Leistungs-/Regionalseite 1 kuratierter Pillar-Artikel; keine zweite manuelle Posting-Routine.

## 2026-07-04 (mittag, Teil 2): Startseite = all-turtles-Struktur 1:1 (VERBINDLICH)
- Tomson-Korrektur: NICHT die user-optimierte Fable-Reihenfolge; Struktur+Aufbau exakt wie all-turtles, Anpassungen gering, nur Inhalte unsere. Neubau/Neupositionierung; alte Seite nur Info-Steinbruch; Handoff-MD nur Ideen, kritisch filtern.
- Homepage-Sektionsfolge live vermessen und als VERBINDLICHE Blaupause dokumentiert: docs/HOMEPAGE_BLAUPAUSE_ALLTURTLES.md (Hero-Claim+Wortmarke -> Morph -> 5 Leistungs-Szenen -> "Ein paar unserer Projekte" -> 3 Case-Panels in Farbwelten -> Zahlen-Statement -> Firmen-Namensliste in einer Farbe -> Riesen-CTA -> Footer-Reassembly).
- Meine Recherche-Reihenfolge vom Vormittag ist damit VERWORFEN fuer die Struktur; Evidenz fliesst nur in Mikro-Punkte (Preise als Menuepunkt/Seite, nicht als Homepage-Sektion).
- Offen fuer Tomson: (a) die 5 Leistungsbereiche bestaetigen (Vorschlag: Webdesign / Google-Sichtbarkeit / KI-Sichtbarkeit / Content & KI-Artikel / Dashboard & Betreuung), (b) Menue sichtbar vs. Burger-only, (c) welche 3 Referenzen in die Farb-Panels.

## 2026-07-04 (nachmittag): BAUSTART — Branch relaunch, P0 + P1-Skelett live verifiziert
- Branch `relaunch` angelegt (von feat/seo-monitor-und-brand-second-brain-Spitze, enthaelt brand/-Second-Brain; Begruendung: P0 braucht diese Dateien).
- P0 Design-System gebaut + im Browser verifiziert: Tokens (app/styleguide/styleguide.css, Scope .rr), Fonts Fraunces+Instrument Sans (lib/relaunch/fonts.ts), lebende /styleguide-Seite (noindex), Regeln docs/DESIGN_SYSTEM.md. Neutrals von all-turtles LIVE gesampelt (Weiss/#F3F4F5/Ink #252F3A-Logik -> unsere Ableitung #23262E), nichts geraten.
- P1-Engine-Skelett gebaut + live verifiziert (localhost:9000/relaunch-preview): Keyframe-Player (lib/relaunch/morph/grammar.ts — masterEase cubic-bezier(.6,0,.4,1) analytisch, sample(), buildHeroChoreo nach §0-Grammatik: Kontraktion OHNE Rotation flach zur Mitte, Burst radial mit ~40% Rotierern, Split bei p=0.52, klein=weiter/schneller), Naturbruch-Teile portiert (lib/relaunch/morph/pieces.ts, ABGENOMMENE Koordinaten, aendern nur mit neuer Abnahme), HeroMorph.tsx (Lenis, sticky Track 320vh, Font-Familie aus next/font-Hash aufgeloest, reduced-motion-Fallback).
- Tomson-Zusage bestaetigt: JEDE Design-Stufe geht als klickbare Vorschau an ihn (Gates), Inputs jederzeit, alles im decisions-log.
- VPS-Frage beantwortet: Website bleibt Vercel; IONOS-VPS nur fuer Hintergrund-Automationen NACH Launch (P5-Track); immo.red Mail/DNS NICHT umziehen, nur Subdomain auf den VPS.

## 2026-07-04 (nachmittag, Teil 2): NEUER P0-PUNKT — "Die Red Rabbit Methode" (eigenes Wort/Framework)
- Tomson-Wunsch: ein EIGENES, markenfaehiges Wort/Framework kreieren ("Red Rabbit Methode" o.ae.) — unsere Arbeitsweise als benannte Methode (Substanz aus: brand/cult-brand-playbook.md [NotebookLM, 13 Videos, Authentizitaet], SEO/GEO-Hooks, "Website die selbst arbeitet"-USP). Zweck: Wiedererkennung, Zitierbarkeit (LLMs zitieren benannte Methoden!), Verkaufsargument.
- Vorgehen: Fable erarbeitet 2-3 Namens- + Struktur-Vorschlaege (Methoden-Schritte, Wording, wie sie auf der Website/Unterseiten auftaucht) und legt sie Tomson VISUELL zur Entscheidung vor (wichtige Entscheidung = fragen).
- Tomson kuendigt an: "Inhalte" wird noch ein eigenes Entscheidungs-Thema (Copy-Themen, Artikel-Themen, Regionalseiten-Inhalte) — Vorschlaege vorbereiten, Entscheidungen bei ihm.

## 2026-07-05: P2 Homepage komplett nach Blaupause + Domain-Korrektur + Methode-Vorschlaege
- Homepage-Sektionsfolge fertig gebaut und im Browser verifiziert (/relaunch-preview): Ueberleitung -> 3 Case-Panels (Farbwelten petrol/nacht/puder, horizontale Fahrt mit Master-Easing, riesiger Initial Ton-in-Ton) -> Zahlen-Statement (PLATZHALTER markiert) -> Firmen-Liste 5x3 (8 Projekte + 7 B2B-Namen, eine Farbe) -> Riesen-CTA -> Footer-Wortmarken-Reassembly (Teile fliegen ein, Rotation endet exakt bei Ankunft).
- WICHTIGER FAKTEN-FIX (verifiziert per HTTP): thermenwartung.at gehoert allgas.at, UNSERE Domain ist thermewarten.at (projects.ts korrigiert). almtal-invest-Domain aktuell nicht aufloesbar -> Link fail-closed entfernt, Tomson fragen welche Domain live ist.
- Case-Panel-Auswahl (thermewarten / Almtal Invest / Lashes by Danesh) = VORSCHLAG, wartet auf Tomson-Gate. Nicht in der Firmen-Liste: K2/villagegardencondo + web.redrabbit (15er-Raster voll) — auf Wunsch tauschbar.
- "Red Rabbit Methode": 3 Vorschlaege visuell vorgelegt (Artifact 56e66763): 1. Die Red Rabbit Methode (Klartext/Bau/Sichtbarkeit/Selbstlauf, EMPFEHLUNG — Marke im Namen = jede LLM-Zitierung nennt uns), 2. Das Selbstlaeufer-Prinzip (USP-first), 3. Der Rote Faden (visuell stark, generisch-riskant). ENTSCHEIDUNG OFFEN (Tomson).
- Skill-Nutzung verbindlich dokumentiert (Handoff-Sektion "SKILLS — wann und wie"): frontend-design + ui-ux-pro-max Pflicht vor UI-Arbeit, emil-design-eng/impeccable fuer Polish, review-it nach Agenten-Merges, grill-me fuer Entscheidungsrunden.

## 2026-07-05 (nachmittag): TOMSON-ENTSCHEIDUNGEN — Methode, Preis-Held, Almtal-Domain
- METHODE ENTSCHIEDEN: Name = "Die Red Rabbit Methode" (Option 1). Inhaltlicher Kern = das Selbstlaeufer-Prinzip (aus Option 2): Websites, die nach dem Launch selbststaendig weiterarbeiten (Artikel, Bewertungen, Berichte). Definition MUSS noch ausgebaut/genauer beschrieben werden (naechste Entscheidungsrunde, Fable bereitet vor).
- SELBSTLAEUFER-STAFFELUNG nach Paket (Tomson 05.07., Details werden noch gemeinsam durchgegangen): Starter 950 = NICHT dabei, zubuchbar; Business 2.900 = Grundform dabei; Premium 5k+ = dabei (Aufsetzung/Anschluss inklusive, laufende Kosten koennen entstehen). Modular wie ein Baukasten: Kunde entscheidet, welche Hintergrund-Aufgaben dazukommen; buchbar monatlich ODER einmalig, teilweise im Paket. Grundidee: ein eigener "Harness", der im Hintergrund Aufgaben uebernimmt (Positionierung verbessern, mehr Leads, immer up to date).
- PREIS-HELD bestaetigt: Business 2.900 bleibt "Beliebteste Wahl".
- ALMTAL-DOMAIN von Tomson genannt und verifiziert: https://almtal-invest.vercel.app (Site-Titel "Tree House Apartments | Anleger-Immobilie im Salzkammergut") -> Link in projects.ts + CasePanels gesetzt. Hinweis fuer Launch: eigene Domain statt vercel.app waere fuers Schaufenster sauberer.
- CASE-PANELS: Tomson will sie SEHEN bevor er die 3er-Auswahl bestaetigt -> Screenshots als Artifact vorgelegt (naechster Schritt dieser Session).

## 2026-07-05 (abend): KURSKORREKTUR Case-Panels = THEMEN-Buehnen (Tomson)
- Die 3 Homepage-Panels zeigen NICHT 3 Referenz-Websites, sondern 3 THEMEN (all-turtles-Logik: "Essential tools for video at work"). Referenz-Screens wandern als Beweis-MATERIAL in die Panels; komplette Werkschau bleibt Kugel /referenzen; Firmen-Liste bleibt.
- Themen-Vorschlag v2 (Artifact 6ca8ed0a, wartet auf Tomson): 1. Webdesign & Handwerk (Petrol, Animation Hasenpfoten-Spur — Tomson-Idee statt at-Voegel) / 2. Dashboard & Selbstlauf (Nacht, lebendes Dashboard: Zahlen ticken; Harness-Leistungen belegbar aus webredrabbit/almtal/pumukel-Betrieb) / 3. Sichtbarkeit Google & KI (Puder, Animation: Suchanfrage tippt sich, KI-Antwort nennt Betrieb).
- Klarstellung an Tomson: Dashboard-Panel != Red Rabbit Methode; Methode = ganzer 4-Schritte-Weg (eigene Sektion + /methode-Seite), Panel 2 = sichtbarer Beweis von Schritt 4 (Selbstlauf).
- Tomson-Design-Mandat: all-turtles Farbwahl/Schrift/Animationen/Schreibweise im Detail studieren und uebernehmen wo passend; jede der 3 Panels braucht eine passende Animation. Tomson hat zusaetzlich eine eigene Referenz-Einbindungs-Idee (zeigt er noch).
- OFFEN (Tomson): Themen 1-3 bestaetigen, Headline-Wording, Animations-Ideen; danach Umbau CasePanels.tsx.

## 2026-07-05 (spaet): Themen-Panels v3 GEBAUT nach Live-Vermessung des Originals
- all-turtles-Case-Strecke live vermessen (Homepage): pro Case eigener Track (3550-4148px), sticky 100vh, Buehne 5531px (3 Viewports), LINEARE Fahrt (Smoothing=Lenis, kein Snapping); Slide 1 (Eyebrow 27px Breit-Sans cream gedimmt + Headline 135px Heldane weiss, x=215/y=263) steht in Ruhephase und fadet waehrend der Fahrt; Riesen-Wortmarke = SVG 503px hoch ton-in-ton mit Parallax; Medien = echte Autoplay-Loop-VIDEOS 437px gerundet, versetzt schwebend; Abschluss-Statement 41px Heldane + Link 20px Sans 500 KLEBT im Viewport (absolute right-0) und blendet ein; Sora-Voegel = buehnenfuellendes SVG das mitfaehrt; bg pro Case konstant (bg-airtime rgb(38,88,93)).
- CasePanels.tsx v3 danach neu gebaut (Themen statt Referenzen): Track 380vh/Panel, Ruhephase bis p=0.1, Buehne 300vw linear, Riesen-Thema-Wort Parallax 1.25x, Intro-Fade, Statement-Overlay mit Master-Easing; Panel 1 Hasenpfoten-Spur (Hopser-Paare, zart, faehrt mit Buehne wie Sora-Voegel), Panel 2 lebendes Dashboard (Zahlen/Balken, Demo-Daten; "Bewertungen +2" statt Score wegen Rating-Ehrlichkeits-Regel), Panel 3 KI-Antwort-Karte; PLATZHALTER-Karten fuer echtes Site-Material (Original nutzt Videos -> wir brauchen Scroll-Videos der Projekte). QA-Loop im Browser: Anschnitt-Bug (fehlende Ruhephase) + Pfoten-Groesse gefunden und gefixt; alle 3 Panels an 2-3 Scrollpunkten verifiziert. Build gruen.

## 2026-07-05 (abend, Tomson-Review): 60%-Diagnose — verbindliche Fix-Liste Richtung 1:1
- Tomson-Urteil nach Ansicht von /relaunch-preview: noch ~60% von all-turtles entfernt. Konkrete Deltas (verbindlich abzuarbeiten):
  1. MORPH-TEILE UNSCHARF: unsere Canvas-Teile wirken verpixelt/fransig; at-Teile sind saubere VEKTOREN (SVG). FIX: pieces-Rendering von Canvas auf inline-SVG (Vektor, scharf bei jeder Groesse/Rotation).
  2. FORMATIONEN FORMLOS: at-Szenen formen ERKENNBARE Piktogramme (2 Zahnraeder, Dokument-Icon) aus ordentlich entlang der Kontur gesetzten Buchstaben-Teilen; unsere Formationen wirken wie Buchstabensalat. FIX: Kontur-basierte Formationen (Teile entlang Pfad, Rotation = Tangente), Zielformen je Szene definieren.
  3. MOTIV-SEITE FALSCH: Szenen-Motiv muss LINKS stehen, Text RECHTS (at-Layout). FIX in ScenesMorph.
  4. MORPH-DRAMATURGIE: Teile gehen nach unten/allen Seiten WEG und finden beim Weiterscrollen wieder ZUSAMMEN zum Gebilde (Zerfall -> Reassembly pro Szene), nicht nur Ankunft.
  5. SCHRIFT: at nutzt Heldane (Serif) + Breit (Eyebrow-Sans) + System-Sans (Links) = Kauf-Fonts. Tomson will gleiche/aehnlichere. KEIN Font-Kauf-Budget (Regel 04.07.) -> freie Alternativen visuell vergleichen (Fraunces vs. Playfair Display u.a.), Tomson entscheidet. Buchstaben-/Wortabstaende und Positionen nachmessen.
  6. Tomson-Freigabe: notfalls deren Animationsdaten als Zwischenloesung verwenden ("nimm deren, wir machen spaeter eigene") — Umsetzung: extrahierte Keyframe-DATEN als exakte Zielwerte fuer UNSERE Engine mit UNSEREN Teilen (keine at-Dateien/Assets einbinden = Copyright-Grenze bleibt).
- Arbeitsweise bestaetigt: tiefes Research (Code/DOM/Fonts der at-Seite), Loop-QA, Design-Skills, GitHub-Repos, Gemini fuer Bild-Animationen falls noetig; grill-Runde nach der Analyse falls offene Entscheidungen.

## 2026-07-05 (nacht): Fix-Liste Punkte 1-3 UMGESETZT + verifiziert
- (1) VEKTOR-SCHAERFE: pieces.ts rendert Teile jetzt als inline-SVG (Canvas nur noch fuer Ink-BBox-Messung); Hero/Szenen/Footer konsumieren SVG-Divs. Zoom-verifiziert: Kanten gestochen wie at.
- (3) MOTIV LINKS, Text rechts (ScenesMorph umgestellt).
- (2) FORMATIONEN = PIKTOGRAMME: Sampler auf at-Logik umgebaut (SPACING 0.052 = lueckenlose Perlenkette; Kanten nur laengliche Teile mit Laengsachse in Kantenrichtung + rotOff fuer Hochkant-Teile; Punkt-Rollen [Browser-Buttons, Tipp-Punkte] bekommen runde Teile; Groessen uniform 0.92-1.08, Jitter +-7 Grad). Browser-Rahmen + Lupe im Browser verifiziert: Lupe sofort erkennbar.
- OFFEN aus Fix-Liste: (4) Szenen-Dramaturgie Zerfall->Reassembly pro Szene, (5) Font-Entscheidung (Vergleich Fraunces vs. freie Heldane-Alternativen, Tomson visuell), Zahnrad-/Dokument-Formen als weitere Motive, Hero-Timing gegen Original (Tomson liefert Scroll-VIDEO der at-Seite -> Frame-Analyse).

## 2026-07-05 (nacht, Teil 2): VIDEO-ANALYSE der at-Animation (Tomson-Aufnahme, 63s, 127 Frames)
Frames extrahiert nach scratchpad/at-video/. Drei harte Befunde gegen unseren Stand:
1. WORTMARKE: "all turtles" ist NICHT beide Zeilen zentriert: Zeile 1 ("all") sitzt EINGERUECKT ueber Zeile 2, Zeilenabstand sehr eng (Unterlaengen beruehren fast). Unsere zentrierte "red/rabbit"-Setzung ist falsch -> Wortmarken-Layout umbauen (buildWordLayout: Zeile-1-Einzug ~11% der Zeile-2-Breite, lineH enger). Tomson-Kritik #86/87 bestaetigt.
2. TEILE-DICHTE: Original arbeitet mit ~60-100 KLEINEN Teilen (~3% Viewportbreite), verteilt ueber den GANZEN Bildschirm, Zu-/Abgang ueber die RAENDER (Vermehrung: neue Teile schieben von aussen rein, ueberzaehlige verschwinden ueber den Rand). Unsere ~28 grossen Teile sind zu wenige und zu gross -> G3-Vermehrung hochdrehen, baseSize ~0.03*min, Zerfall fuellt ganzen Viewport.
3. FORMATIONEN sind KOMPAKT-DICHT (Kontur + Innenfuellung, stark ueberlappend), nicht duenne Kontur-Kette; Formen: 2 Zahnraeder, Gluehbirne (Startseite #89), Dokument etc.
- Antwort auf Tomsons Hilfsangebote: at-CSS-URL + kompletter Crawl NICHT noetig (Lottie-JSONs = die Animation als Rohdaten liegen schon in ~/dev/at-reference-lottie/, CSS/Fonts live vermessen); Video schliesst die Feel-Luecke. Sinnvollste Tomson-Hilfe ab jetzt: Gate-Urteile auf Previews + ggf. Referenz-Screenshot der Ziel-Wortmarken-Setzung "red rabbit".
NAECHSTE BAURUNDE (Reihenfolge): Wortmarken-Setzung -> Teile-Vermehrung/Dichte + Rand-Zu-/Abgang -> kompakte Formationen (Zahnrad/Gluehbirne/Dokument) -> Timing-Abgleich gegen Video-Frames -> Font-Vergleich (Tomson-Entscheidung).

## 2026-07-04 (spaet) — Morph-Engine v2 nach Original-Messdaten
- Formations-Kompositionen der 5 Szenen = exakte Zielkoordinaten aus dem all-turtles-Lottie (Tomson-Freigabe als Uebergangsloesung; keine at-Assets im Repo, nur Messwerte in lib/relaunch/morph/at-scenes.ts; eigene Kompositionen nach Launch).
- Szenen-Texte dem Motiv zugeordnet (NACHTRAG zur Reihenfolge vom 04.07.): Zahnraeder=Webdesign, Gluehbirne=Google-Sichtbarkeit, Dokument=Content & KI-Artikel, Chart=Dashboard & Betreuung, Kopf=KI-Sichtbarkeit. Grund: Motiv-Semantik (Artikel-Text neben Dokument statt neben Chart). Leistungs-REIHENFOLGE auf der Seite damit: Webdesign, Google, Content, Dashboard, KI. Reversibel, falls Tomson die alte Reihenfolge wichtiger ist als die Motiv-Passung.
- Footer = dunkel (var(--rr-dark)) mit grosser Wortmarke und Teile-Regen von oben (Original-Klammer).

## 2026-07-05 (frueh) — Formationen: Original-Teilformen von all-turtles verwenden (Tomson-Entscheidung)
- Nach Ablehnung aller Eigen-Kompositionen (vermessene Slots mit Fraunces-Teilen, geometrischer Komponist, 4 Buchstaben-Fuellstile im /morph-lab): Tomson entscheidet, fuer die Formations-Szenen die EXTRAHIERTEN ORIGINAL-TEILFORMEN aus dem at-Lottie zu verwenden, damit das Ergebnis identisch zum Original ist. Unsere Wortmarken-Teile eroeffnen (Burst), fliegen dann ab; deren Teile bauen die Motive.
- Einordnung: Uebergangsloesung; Copyright-Risiko bekannt; VOR LAUNCH Wiedervorlage "Ersatz durch eigene Teile".

## 2026-07-05 (nachts) — Statement-Typografie: Crimson Pro statt Fraunces
- Befund (live vermessen, 1440x900): all-turtles Statements = Heldane (Klim, kommerziell),
  64.2px / lh 1.11 / w400 / ls -1%; Eyebrow = Breit (kommerziell), 24.3px uppercase.
- Entscheidung: KEIN Font-Kauf (bestaetigt 04.07.). Freier Doppelgaenger per visuellem
  Vergleich (Spectral/Crimson Pro/EB Garamond/Source Serif/Lora/Fraunces): **Crimson Pro w500**
  (wie Heldane ein Kis-Antiqua-Abkoemmling). Fraunces bleibt NUR fuer die Wortmarke.
- Groessen an Messung angepasst: Statement clamp(34px,4.46vw,92px), Eyebrow-lg uppercase
  Instrument Sans clamp(15px,1.69vw,33px). Formation-Groesse: bei 1440x900 exakt gleich
  (554x481px vs 555x482px); Skalierung auf breiten Fenstern via k=min(vw/1920, vh/810).
- Farbtupfer (Tomson): genau EIN laengliches Teil der Zahnrad-Formation in Dunkelblau #1C2837.

## 2026-07-13 — Kanonische Hauptseite + Unterseiten-Rezept (Anti-Drift)
- **`/relaunch-preview` = die neue kanonische Hauptseite** des Relaunch (wird nur noch feinjustiert). Alle Unterseiten muessen dazu passen. Zwei offene Aenderungen an ihr: (1) FAQ auf die zweispaltige Variante, (2) Kundenliste im Stil der ueber-uns-Demo, aber auf WEISS statt Blau.
- **Vehikel:** Unterseiten sind echte Next-Routen UNTER `/relaunch-preview/` (z. B. `/relaunch-preview/kontakt`, `/relaunch-preview/about`). Am Ende gemeinsam durchklicken, dann live.
- **Wichtigstes Gesetz (Ursache aller bisherigen Ablehnungen):** Komponenten und die Morph-Maschine NIE in HTML nachbauen, immer die echten Bauteile importieren. Komponenten = echte `rr-*`-Klassen aus `styleguide.css`; Hero = `components/subpages/SubpageHero.tsx`, das die echte Maschine importiert (`buildWordLayout` + `grammar.ts` + `at-shapes-comp*.json`); Menue/Footer = `RelaunchMenu` + `FooterReassembly`. Schaerfe-Regel: Fragment in groesster Groesse rendern, CSS-transform nur verkleinern (Upscale = Matsch), kein Blur-/Gooey-Filter; Navy-Auge berechnet (groesstes Seitenverhaeltnis), `#1c2837`. SubpageHero verifiziert 13.07. pixelidentisch zur Kopf-Szene der Hauptseite.
- **Korrigierte Stil-Beschluesse (ersetzen die alten Demo-Annahmen):** Seitengrund WEISS `#ffffff` (kein Off-White; Off-White nur fuer Panels/FAQ). Eyebrow = `rr-eyebrow-lg` Ink, Grossbuchstaben, KEIN Rot, KEINE Klammern. Grosser Text = Crimson `rr-statement`. Testimonials = `rr-quote` Teal-Panel (der eine Farb-Moment), Sterne in GOLD `#f4b400` (Google-Look), nur echte Reviews. Schritt-Karten = `rr-card-soft--neutral` im Scroll-Stack (3-Farb-Trio nur fuer "3 verschiedene Dinge"). FAQ zweispaltig, Label Ink.
- **Copy-Ansatz:** Open-Loop-/Neugier-Luecke — Hook oben reisst eine Frage auf, Aufloesung erst am Ende (Dopamin); aus User-Sicht texten; Texte gemeinsam mit Thomas, Opus.
- **Unter der Haube Pflicht:** SSR-Text (H1 = Hero-Statement), JSON-LD (ContactPage/FAQPage/Organization/LocalBusiness, Reviews nur echt, kein erfundenes aggregateRating), Meta/OG + selbst-referenzielles Canonical, Speed (nur transform/opacity, wenig Client-JS). Ziel: gutes Ranking auf Google, Bing, LLMs.
- **In Arbeit:** Kontakt-Seite als erste Unterseite (`/relaunch-preview/kontakt`), Figur = Gluehbirne (comp2). Rezept vollstaendig in `docs/UNTERSEITEN_STIL.md`.
- **Offen zur Bestaetigung (nicht geraten):** Rating-Anzahl (design-system sagt 3 Rezensionen, `lib/reviews.ts` sagt reviewCount 8) und Starter-Preis (Brand-README 790 Euro vs. diese decisions-log 05.07. 950 Euro). Bis zur Klaerung fail-closed: Schema nutzt die 3 belegbaren, Copy nennt 790 mit Platzhalter-Markierung.

## 2026-07-24 — Talos-Modul-Preise FESTGELEGT (Thomas bestaetigt, "ja passt")
Erarbeitet mit 2 Research-Laeufen (docs/strategie/TALOS_MODUL_PREISE_RESEARCH_2026-07-24.md
+ TALOS_ADS_PREIS_RESEARCH_2026-07-24.md, Marktanker mit URLs). Alle Modul-Preise sind
EINFUEHRUNGSPREISE fuer Pilotkunden (ehrliches Label, gibt Spielraum nach Pilotphase zu
erhoehen). Nach 3-5 Pilotkunden testverkaufen, dann final festschreiben.

MODELL (Thomas-Entscheidung): Hybrid. Website einmalig (unveraendert 950 / 2.900 / ab 4.900),
darueber Talos-Module als Abo. Kein Prozent-/Credit-/Pro-Nachricht-Modell -> flache
Monatspauschale je Mitarbeiter (ist selbst das Verkaufsargument: "keine Kosten pro Klick,
Nachricht oder Minute"). KEINE 3 Zwangs-Pakete.

- **Talos Basis-Team: ab 360 EUR/Monat** (Einfuehrungspreis) · **Setup 290 EUR einmalig** ·
  alle Preise **zzgl. USt**. 360 ist die Untergrenze ("Talos startet als Team"). Inhalt:
  - **Schreiber:** 2 Beitraege/Woche (8/Monat), SEO/LLM/GEO/EEAT-optimiert, automatisch auf
    die Seite gepostet, inkl. Bilder UND Podcast-Vertonung zum Anhoeren.
  - **Empfang:** Anfrage-Erfassung + Terminbuchung + automatisches Nachfassen.
  - **Chatbot** auf der Seite.
- **Grosse Mitarbeiter (SOLO buchbar, liegen ohnehin bei ~290+):**
  - **Poster** (Social-Content: Bilder+Texte erzeugen + auf Kanaelen posten) — **290 EUR/Monat**.
    Bewusst NICHT mit dem Schreiber zusammengelegt (echte Produktion, andere Arbeit).
  - **Aussendienst** (sucht wo moeglich TAEGLICH automatisch passende Kunden, schreibt E-Mails
    als Draft ODER per Knopfdruck im Backend versendbar) — **290 EUR/Monat**.
  - **Ads-Mitarbeiter** (Google Ads + Meta, EIN Modul; Management durch uns) — **ab 390 EUR/Monat**
    (eine Plattform; zweite Plattform +~50 %). Auf der Seite nur "ab 390" zeigen, Staffel
    (bis 1.000 Budget 390 / 1.000-3.000 490-690 / ab 3.000 790-990) klaert der Verkauf im
    Gespraech. **Werbebudget laeuft KOMPLETT ueber das EIGENE Konto des Kunden, er zahlt Google/
    Meta direkt** — wir managen nur, kein Budget-Durchlauf, kein Aufschlag aufs Budget.
    Trust-Satz: "Fixpreis, keine Prozente vom Budget, dein Werbegeld bleibt auf deinem Konto."
- **Zusatz (nur im Team):** **Sichtbarmacher** (GEO/AEO) — **+120 EUR/Monat**.
- **Nur im Team (nicht solo):** Chatbot, Empfang, einzelner Schreiber (zu billig fuer solo,
  wuerden den 360-Boden untergraben).
- **KI-Telefon: RAUS** (Thomas 24.07., machen wir nicht).
- **Team-Rabatt: 10 % ab 2 Modulen.**
- **KMU.DIGITAL:** nur fuer **Website + Setup** (das ist das foerderbare Projekt), NICHT fuer
  die laufenden Abos. Ehrlich so kommuniziert.
- **Sonderanfertigung:** Projektpreis, "auf Anfrage" mit WARUM-Satz.

DARSTELLUNG auf der Preisseite:
- **Mehrwert-Rechner:** Talos-Team gegen "was diese Arbeit klassisch extern kostet" (verifizierte
  Marktanker, ehrliche Variante — NICHT erfundenes Angestellten-Gehalt). Live-Summe, Basis-Team
  fix 360, Add-ons zuschaltbar. Setup 290 + zzgl. USt + Einfuehrungspreis ausweisen.
- **Positionierung im blauen Talos-Panel:** "135 Jahre Erfahrung zusammen, unser gesamtes Wissen
  steckt in den Agenten, wir sitzen dahinter und ueberwachen Monat fuer Monat" (nicht nur eine KI).
- Nur die ausgereiften Module zeigen Preis; genuin individuelle ("auf Anfrage") mit WARUM-Satz.

MERKEN (Thomas, separat): Sales-One-Pager/Produktseiten mit Talos + Ads als eigenes Angebot —
beim naechsten Mal ansprechen (Memory project_redrabbit_sales_onepager_talos).
