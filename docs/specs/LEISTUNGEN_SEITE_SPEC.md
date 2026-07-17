# Spec: /relaunch-preview/leistungen — "Die Website, die ein Team ist" (17.07.2026)

Verbindliche Spec fuer die neue Leistungs-Hub-Seite. Entscheidungs-Grundlage:
`docs/strategie/LEISTUNGEN_ZUKUNFT_2026-07.md` (Abschnitt ENTSCHEIDUNGEN) und das
von Thomas abgenommene Konzept v3 (Session-Scratchpad `leistungen-konzept.html`,
Research in `research-scrollstory-patterns.md`, `research-ia-module.md`,
`research-personifizierung.md`).

## Nicht verhandelbar (Haus-Regeln)

- Stil-Gesetz: `docs/UNTERSEITEN_STIL.md` (Farben, Fonts, Eckig-Gesetz, Motion-
  Signatur, SSR-Pflicht). Weiss als Grund, Rot einziger Akzent, Navy dunkel,
  Teal NUR fuer den einen Testimonial-/Farb-Moment, border-radius 0.
- Copy: DU-Anrede, frech-ehrlich, echte Umlaute, KEIN Gedankenstrich, keine
  Emojis, keine Dreierfiguren-Rhetorik. Telefonnummer NIE im Klartext, nur
  "Anrufen"-Button mit tel:-Link (Nummer aus FooterReassembly-Fakten).
- Preise: NUR 950 / 2.900 / ab 4.900 (wie FAQ-Seite), NIE 790. Keine erfundenen
  Zahlen, keine erfundenen Bewertungen. Modul-Abo-Preise existieren noch NICHT:
  Module verweisen auf "besprechen wir persoenlich" / Anfrage.
- KI-Ehrlichkeit: Die Kollegen sind Automationen. Kein "ersetzt Mitarbeiter"-
  Framing, sondern "nimmt dir Arbeit ab". Der Hase als Figur macht die
  Nicht-Menschlichkeit sichtbar (EU-AI-Act-freundlich). Formulierungen wie
  "diese Website schreibt ihre Beitraege selbst" sind ok (belegbar), das Wort
  "KI" auf der Seite vermeiden (Capabilities-Regel: Ergebnisse verkaufen).
- robots: `{ index: false, follow: false }` wie alle Preview-Seiten.

## Seiten-Architektur (Muster = FAQ-Seite + Tipps-Seite)

`app/relaunch-preview/leistungen/page.tsx` als Server-Komponente:
1. Fonts-Links wie faq/page.tsx (DM Sans, Instrument Sans, Crimson Pro).
2. `RelaunchMenu` im `.rr`-Font-Wrapper (background transparent) + kleine rote
   `RabbitMark` oben links (32px, Link auf /relaunch-preview) wie auf der
   Tipps-Seite.
3. HERO: neues Demo-Verzeichnis `components/subpages/leistungen-hero-demo/`
   als Kopie von `faq-demo` (Rohteile-Pattern, Reads IN der Komponente!):
   Pinsel-Hero, Titel "Leistungen." mit rotem Schlusspunkt und Buchstaben-
   Scatter (P_SCAT-Muster), reveal-msg im Pinselstrich: "Eine Website. Oder
   ein Team." (Arbeitsstand, darf verbessert werden). KEINE Skulptur im Hero
   (die Zahnraeder kommen in Kapitel 1). Engine-Teardown-Guards (isConnected)
   und Client-Cleanup wie bei den anderen Demos (booted-Ref NICHT zuruecksetzen).
   Der Hero muss unten sauber in Weiss auslaufen, damit die Story andocken kann
   (kein totes Riesen-Stueck: Scene-Hoehe eher wie faq als wie tipps waehlen).
4. STORY: neue Client-Komponente `components/relaunch/LeistungenStory.tsx`
   (Muster TippsTunnel: self-contained, eigener Style-Block, Prefix `.rrls-`,
   kein GSAP, IntersectionObserver + rAF nur wo noetig, reduced-motion:
   alles statisch sichtbar). Inhalt siehe unten.
5. `FooterReassembly` unten (im .rr-Wrapper, wie Tipps-Seite).
6. JSON-LD: Service-Liste (ItemList der Leistungen) via `components/JsonLd.tsx`,
   nur echte Fakten.
7. `RelaunchMenu`-Eintrag "Leistungen" auf `/relaunch-preview/leistungen`
   umstellen (bisher alte Live-Seite).

## Story-Inhalt (Kapitel, aus Konzept v3)

Alle Texte sind Arbeitsstand: Opus darf sie im Haus-Ton verbessern, Fakten und
Struktur sind fix. Ein Gedanke pro Viewport, Headline + max 2 Zeilen, grosszuegiger
Weissraum (~96px Desktop / 48px Mobile zwischen Sektionen), Reveals dezent
(opacity/transform, masterEase).

### Kapitel 0 — Weiche (direkt nach dem Hero)
- Crimson-Statement (die h1 bleibt im Hero-SSR; hier h2):
  "Du kannst eine Website haben. Oder eine, die fuer dich arbeitet."
- Zwei Tueren (rr-card-soft-Optik, eckig):
  A "Nimm mich an die Hand" -> klappt den Assistenten auf (smooth, kein Modal).
  B "Ich schau mich selbst um" -> scrollt zu Kapitel 1.
- ASSISTENT (eingeklappt, oeffnet unter der Weiche): 5 Fragen, eine pro Screen,
  Fortschritts-Punkte, zurueck-Moeglichkeit, jederzeit sichtbarer Ausstieg
  "Ich weiss schon, was ich will" -> Link /relaunch-preview/kontakt.
  Fragen + Ergebnis-Logik exakt wie Konzept v3:
  1. Schon eine Website? (alt/neu)
  2. Termine/Anfragen online? (ja/nein/"weiss nicht, was bringt das?")
  3. Regelmaessig Neues ohne selbst zu schreiben? (ja/nein/"weiss nicht")
  4. Sehen was die Seite bringt? (ja/egal)
  5. Wie gross? (klein/ordentlich/gross/"keine Ahnung, beratet mich")
  Ergebnis: Haekchen-Liste NUR der gewaehlten Teile (Website immer; Empfang wenn
  Frage 2 ja/weiss-nicht; Schreiber wenn Frage 3 ja/weiss-nicht) mit je einem
  Satz; bei "weiss nicht" wird der Nutzen-Satz eingebaut. Abschluss-Zeile
  "So starten die meisten Betriebe." + CTA "Kostenlosen Entwurf genau dafuer
  anfragen" -> /relaunch-preview/kontakt. Kein LocalStorage, kein Tracking.

### Kapitel 1 — Das Fundament (die Website)
- Eyebrow "Das Fundament" (rr-eyebrow-lg, Ink, keine Klammern).
- Statement: "Zuerst: die Website selbst. Da ist alles Wichtige schon drin."
- SIGNATUR-MOMENT: Zahnraeder-Skulptur via `components/subpages/MorphSculpture.tsx`
  mit comp-Index 0 (= comp1 Zahnraeder, laut docs/SKULPTUREN_REUSE.md fuer
  Leistungen reserviert). Scroll-gekoppelt wie auf ueber-uns/kontakt (Rezept
  SKULPTUREN_REUSE.md befolgen, NICHT nachbauen). Botschaft daneben/danach:
  "Sie arbeitet von Anfang an." Wenn die Integration von MorphSculpture in
  dieser Seite unsauber wird: lieber weglassen als nachbauen (Stil-Gesetz §0)
  und im Ergebnis-Report vermerken.
- Die 6 Inklusiv-Punkte als ruhige zweispaltige Haekchen-Liste mit
  Aufklapp-Details (natives details/summary, rr-faq-Optik oder eigene schlanke
  .rrls-Variante): Hosting / Selbst aendern / Klartext-Zahlen / Waechter /
  Monats-Check / Pflege. Texte aus Konzept v3, im Haus-Ton.
- Abschlusszeile: "Keine Extra-Rechnung. Kein Wartungsvertrag. Drin."
  + dezenter Hinweis "Pakete und Fixpreise stehen auf der Preisseite"
  (Link auf bestehende Live-/preise, bis die neue Preisseite existiert —
  gleiche Logik wie im Menue).

### Kapitel 2 — Das Team (Kern-Inszenierung)
- Statement: "Und jetzt der Teil, den es nur bei uns gibt."
  Intro-Zeile: "Deine Website kann Kollegen einstellen."
- SPLIT-SCREEN-STICKY pro Kollege (Desktop: Figur links sticky bei ~top 16vh,
  Beats rechts scrollen durch; Mobile: Figur oben, Beats darunter, kein sticky
  wenn zu eng). Figur = `RabbitMark` gross (ca. 140-200px hoch):
  - Kollege 01 "Der Schreiber" (Arbeitstitel): RabbitMark ROT #F12032.
    Claim: "Sorgt dafuer, dass auf deiner Seite etwas passiert. Jede Woche."
    3 Beats (je min-height ~50vh, Reveal beim Eintritt):
    1. "Er schreibt ueber dein Handwerk." + Selbsttipp-Demo (rotierende
       Artikel-Titel, Muster TippsTunnel-Suchfeld: langsam, reduced-motion
       statisch): "Was kostet eine Therme in Oberoesterreich?" /
       "Heizung entlueften: so geht es richtig." / "Foerderung 2026: das steht
       dir zu."
    2. "Du gibst mit einem Klick frei." + Aufklapper "Wie das genau
       funktioniert" (Freigabe-Mail-Erklaerung).
    3. "Google liest mit. Und die neuen Antwortmaschinen auch."
  - Kollege 02 "Der Empfang" (Arbeitstitel): RabbitMark NAVY #1c2837.
    Claim: "Nimmt an, was reinkommt. Auch wenn du am Dach stehst."
    3 Beats: Termine buchen sich selbst / Keine Anfrage bleibt liegen
    (+ Aufklapper wie oben) / "Du entscheidest, wie viel er darf."
    (Freigabe oder Autopilot).
- Danach ruhige Reihe "auf Anfrage" (gedashte Karten, Ink-Text, klein):
  Der Vertriebler (sucht und kontaktiert Wunschkunden) / Der Rufhueter
  (Google-Bewertungen) / Der Sichtbarmacher (dass dich auch die Antwort-
  maschinen empfehlen). Je RabbitMark klein in Ink-Soft #5a5e68, 40px.
  Zeile darunter: "Und das Team lernt staendig neue Faehigkeiten dazu."
- WICHTIG: Jeder Kollege traegt sichtbar den Zusatz "dein digitaler Kollege"
  o.ae., damit klar ist: Automation, kein Mensch.

### Kapitel 3 — Massarbeit
- Kurz: "Und wenn du etwas brauchst, das es nicht gibt? Dann bauen wir es."
  1 Absatz (Shops, Portale, Rechner, Schnittstellen, alles eigenprogrammiert,
  kein Baukasten) + Sekundaer-CTA "Erzaehl uns davon" (rr-btn-frame) ->
  /relaunch-preview/kontakt.

### Kapitel 4 — Beweis + Start
- Beweis-Satz mit echtem Wert: Artikel-Anzahl LIVE aus `getAllPosts()`
  (lib der Tipps-Seite) zaehlen, SSR: "Uebrigens: Diese Website hier hat den
  Schreiber selbst. Schau in seine N Artikel." Link -> /relaunch-preview/tipps.
  (KEINE hart codierte Zahl.)
- Die 3 Schritte (rr-card-soft --neutral): Du meldest dich / Du siehst deinen
  Entwurf, ohne Vorkasse / Erst dann entscheidest du.
- Schluss-CTA-Panel: "Zeig uns deinen Betrieb. Wir zeigen dir dein Team."
  Primaer rr-btn-sweep--red -> /relaunch-preview/kontakt, daneben
  "Anrufen"-Button (tel:, Label ohne Nummer).
- Der Schluss loest den Hero-Hook auf (Open-Loop-Regel).

### Orientierung
- Dezente Kapitel-Punkte rechts (fixed, Desktop only, >=900px), 5 Punkte
  (Weiche/Fundament/Team/Massarbeit/Start), aktiver Punkt rot, Klick scrollt.
  Mobile: weglassen.

## QA-Pflicht (vor "fertig")

1. `npx tsc --noEmit` + `npx vitest run` gruen (ggf. via python3-subprocess-
   Wrapper wegen Shell-Hook-Noise).
2. `curl http://localhost:9000/relaunch-preview/leistungen` -> 200, SSR-Text
   (h1, Kapitel-Statements, Beweis-Satz mit Artikelzahl) im HTML.
3. Eigener Browser-Tab (NICHT Thomas' Tab, Tab im Vordergrund halten wegen
   rAF-Drossel): Hero malt + scattert, Weiche funktioniert, Assistent
   durchspielbar inkl. zurueck/Ausstieg, Sticky-Team haelt, Aufklapper gehen,
   Konsole sauber, KEIN Querscroll; Fenster schmal (~500px) fuer Mobile-Check:
   alles einspaltig, Touch-Scroll frei (kein Scroll-Hijacking).
4. Soft-Navigation leistungen -> faq -> leistungen ohne Fehler/Leaks.
5. Menue-Link fuehrt auf die neue Seite; alle Links auf der Seite antworten 200.
