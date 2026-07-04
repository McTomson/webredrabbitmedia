# Relaunch-Plan web.redrabbit.media — Stand 2026-07-03

Beschlossen in der Grill-Session Tomson + Claude (Fable 5). Entscheidungen im Detail: `brand/decisions-log.md` (Eintrag 2026-07-03).

## Ziel
Website, die beweist, dass Red Rabbit Websites ueber 6.000 Euro bauen kann, organisch Kunden gewinnt (Google + LLM-Sichtbarkeit), und als staerkste eigene Referenz dient. Vorbild all-turtles.com: nahezu identische Reproduktion von Ablauf, Aufbau, Motion und Typo-Hierarchie, mit eigenen Texten und eigenen Kunstwerken.

## Fixierte Entscheidungen (2026-07-03)
- **Design:** Fatface-Serif-Schriftlogo "red rabbit" (Heldane-Stil); Logo-Zeichen (Hase) bleibt unangetastet. Morph-Material = ganze Buchstaben + Fragmente des Schriftlogos, purzeln wild durch die Seite, setzen sich gestaffelt zu eigenen Motiven zusammen (Motive definiert Claude pro Sektions-Botschaft, Tomson gibt frei). Ergebnis-Bilder eigen, Choreografie identisch zu all-turtles.
- **Fonts:** Ziel = Originale (Heldane/Breit/Soehne, Klim u.a.). Kauf NUR mit Tomson-OK (Kosten in Bauphase klaeren). Bis dahin Fraunces + Inter als Platzhalter.
- **Preise:** 950 (Starter One-Pager) / 2.900 (Business) / ab 4.900 (Premium, "beliebteste Wahl") + Wartungs-Abo ohne Bindung. KMU.DIGITAL-Foerderung aktiv kommunizieren.
- **Dashboard-USP:** Kunden-Dashboard (GA4, Search Console, Meta) gratis ab Business, Add-on beim Starter. Technik-Basis: eigenes Dashboard existiert schon.
- **Positionierung:** konkrete, authentische Webdesign-Agentur; USP = Sichtbarkeit (Google + KI/LLM/EEAT) als Fundament, AI-Content-Ausstattung (wie eigene Artikel-Engine), eigenes Team/custom, kein Risiko bis zur Zusage. Handoff-Copy vom 03.07 nur Rohstoff; Brand wird in P0 neu aufgebaut.
- **Regionalseiten:** 9 Bundeslaender + 10-15 Staedte MIT echter Substanz (self-canonical, eigene Inhalte, LocalBusiness-Schema). Keine Doorway-Masse.
- **Hosting:** Live-Site bleibt Vercel (Domain/URLs/301s bleiben -> Index, Links, Bewertungen bleiben erhalten). IONOS-VPS uebernimmt Automationen (Artikel-Engine, Monitoring) in separatem Track nach Launch.
- **SEO-Sofort-Fixes (Canonical Klagenfurt, 404-Footer, Fake-Rating):** auf Tomson-Entscheidung ERST mit dem Relaunch live. RISIKO dokumentiert: kostet Ranking-Zeit; bei Relaunch-Dauer >3 Wochen erneut vorlegen.
- **Bau-Ort:** Branch `relaunch` im bestehenden Repo, Vercel-Preview pro Stand. Kein neues Repo.
- **Arbeitsteilung:** Fable 5 = Brand, Design-System, Morph-Engine, Homepage-Design, Reviews. Opus/Sonnet-Subagenten = mechanische Umsetzung nach Spezifikation (Unterseiten, Regionalseiten, Migration). Token-Spar-Prinzip: teuerstes Modell nur fuer Design-kritisches.

## Phasen + Gates (jedes Gate = klickbare Vercel-Preview, Tomson gibt frei)
- **P0 Brand-Fundament (Fable):** Positionierung/Messaging neu, Schriftlogo-Spezifikation, Farb-/Typo-System, Copy-Leitplanken. Output: `brand/`-Dateien ueberarbeitet. **Gate 1a.**
- **P1 Morph-Engine-Prototyp (Fable):** all-turtles-Choreografie exakt vermessen (Szenen-Keyframes, Stagger, Scroll-Scrub, Rotation im Flug), Engine in Next.js (GSAP ScrollTrigger + Lenis, SVG-Transforms, kein WebGL), Hero + 1 Szene mit red-rabbit-Lettern. Performance-Pflicht: Inhalt sofort sichtbar, Animation nur Enhancement, prefers-reduced-motion, mobiler Fallback. **Gate 1b.**
- **P2 Homepage komplett (Fable, Opus als Zuarbeit):** alle Sektionen + Copy + Conversion-Layer (mehrstufiger Entwurf-Flow, WhatsApp/Telefon, Preis-Teaser, echte Referenz-Namen). **Gate 2.**
- **P2b Referenz-Praesentation (Tomson-Entscheidung 04.07):** spherische 3D-Galerie nach Vorbild https://www.phantom.land/ — Betrachter im Kugel-Inneren, GSAP + Three.js, left-click-drag mit Lenis-artigem Easing, Karten-Tap animiert Detailseite ein; mit Chrome DevTools gegen das Original kalibrieren. Pflicht dabei: crawlbare HTML-Liste als SEO-Unterbau, Mobile-/reduced-motion-Fallback (2D-Grid), Kugel braucht ~15+ Kacheln (Assets-Frage). Case-Detailseiten/Homepage-Sektionen: Panel-Konzepte 01 Immersion + 02 Vorher-Nachher-Regler (Artifact 04.07) als Kandidaten. **Teil von Gate 2.**
- **P3 Unterseiten (Opus nach Spez, Fable-Review):** Leistungen (+ Webdesign/SEO/KI-Sichtbarkeit), Preise, Referenzen, Ueber uns, FAQ, Kontakt. **Gate 3.**
- **P4 Regional + SEO/LLM (Opus, Fable-Stichprobe):** Regionalseiten-Neuaufbau (jede = vollwertige regionale Startseite/Landingpage), Schema, interne Verlinkung, llms.txt, EEAT-Signale, Sitemap, hier gehen auch die Alt-Bugs mit raus (Canonical, 404, Fake-Rating). Grundlage: eigenes **SEO/GEO/LLM-PLAYBOOK** (eigenes Dokument, wird vor P4 von Fable erstellt; Tomson 04.07: "viel mehr SEO-Tricks" als eigener Punkt). **Gate 4 = Launch-Freigabe.**
- **P5 Launch + Betrieb:** Merge auf main, 301-Mapping, GSC-Ueberwachung 14 Tage, danach VPS-Track (Engine-Umzug).

## Zeitplan (realistisch, Sessions statt Kalendertage)
P0+P1 zusammen 2-3 Arbeitssessions. P2 danach 2 Sessions. P3+P4 je 1-2 Sessions (parallelisierbar via Subagenten). Launch-Ziel: Ende Juli 2026.

## Tomson liefert (blockiert sonst spaetere Phasen, nicht P0/P1)
1. ~~Referenz-Freigaben~~ ERLEDIGT 04.07: Projektliste steht (rero, danesh, thermenwartung, rero-michael, Pizza-Seite, K2/villagegardencondo, La Morra, Tino Jugler, Global Insights, web.redrabbit; Kacheln duerfen sich in der Kugel wiederholen). Echte Case-Zahlen folgen; bis dahin realistische, KLAR MARKIERTE Platzhalter (Zahlen + Kommentare), Austausch vor Launch.
2. Google-Business-Profil-Link (echte Reviews fuer Schema).
3. Bio + Foto Tomson.
4. ~~Font-Kauf-OK~~ ENTSCHIEDEN 04.07: KEIN Font-Kauf, nur Gratis-Schriften (Fraunces bleibt).
5. Eine belegbare Kundenzahl (80+ Projekte? aktuell widerspruechlich 164/152/315/800+).
6. VPS-Zugang/Specs (erst fuer P5).
7. B2B-Namen bestaetigt (SIGNA, 6B47, Tillmann & Kraus, MBT, Sans Souci, Die Vorsorgewohnungs GmbH, Phils.place) — rein typografische Darstellung, eine Farbe, eine Schrift.

## Risiken
1. Verschobene SEO-Fixes = laufender Ranking-Verlust (Tomson-Entscheidung, Wiedervorlage bei >3 Wochen).
2. Morph-Qualitaet haengt an Designer-Keyframes; Plan: iterative visuelle Freigaben statt ein grosser Wurf.
3. Fehlende Case-Zahlen schwaechen Premium-Beweis (Preisleiter 4.900 braucht Beleg).
4. Performance vs. Motion: hartes Budget LCP < 2,5 s mobil, sonst wird gekuerzt.
