# Naechste Session — LEISTUNGEN-Strang (20.07.2026)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, docs/strategie/LEISTUNGEN_IA_2026-07.md,
  docs/UNTERSEITEN_STIL.md, die betroffenen Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/Browser/Docs). Bei Unsicherheit: FRAGEN oder
  fail-closed. (Diese Session ist 3x an genau diesem Punkt gescheitert, siehe Lessons.)
- Erst Plan (TodoWrite), dann bauen. Station fuer Station mit Thomas.
- Laufend testen (tsc + vitest 168/168) + review-it bei groesseren Schritten. Nichts
  als "fertig" melden ohne im Browser verifiziertes Ergebnis (agent-browser).
- Autonom handeln, voller Browser-Zugang. Fuer Abnahme: deployen (vercel deploy --yes,
  NIE --prod) ODER Chrome vorn (osascript activate) + Thomas selbst klicken lassen.
- WORKING TREE ist GETEILT mit Fremd-Straengen (talos-choreo/fuchai, subpages/*,
  DESIGN.md, brand/*, Header/Footer, HomeMorph, preise-preview, viele PNGs). NUR
  eigene Leistungs-Dateien anfassen/committen, Fremdes NIE.

## DER ZENTRALE PUNKT — Hero zuerst mit Thomas KLAEREN, dann bauen
Thomas' Feedback am Ende dieser Session (WOERTLICH ernst nehmen):
> "wo ist das zahnrad und der text das dazu kommt so wie die anderen? der scheint
>  weg zu sein" + "die buchstaben website/leistungen sind zu gross".

Bedeutung: Der Leistungs-/Website-Hero soll aussehen wie die ANDEREN Unterseiten
(ueber-uns, kontakt): **Wort -> Figur (comp1 Zahnraeder) + Ink-Eyebrow + Crimson-
Statement + Subline** (= die SubpageHero-Choreografie) — UND zusaetzlich der
**Wisch/Malen-Effekt** (Paint-Reveal wie auf der Tipps-Seite).

Diese Session hat FALSCH abgebogen: den Paint-Hero (Tipps) EINGEBAUT, aber dabei die
Figur + den Text RAUSGEWORFEN (reiner Paint-Hero statt Kombination). Deshalb "wo ist
das Zahnrad". NAECHSTE SESSION: NICHT das eine gegen das andere tauschen, sondern
KOMBINIEREN. Vor dem Bauen mit Thomas final abstimmen, welche der Varianten:
  (A) SubpageHero (Wort->Zahnrad-Figur + Eyebrow/Statement/Subline) wie ueber-uns/
      kontakt, PLUS Paint-Reveal-Hook oben — der Paint mit dem ECHTEN Tipps-
      Mechanismus (nicht nachbauen), Figur + Text bleiben. (wahrscheinlich gewollt)
  (B) Nur SubpageHero (Figur + Text), gar kein Paint.
  (C) Nur Paint-Hero (Tipps-Stil), kein Zahnrad — DAS ist der aktuelle (abgelehnte) Stand.
Default-Annahme = (A). ERST fragen, DANN bauen. Nicht wieder raten.

Ausserdem: **Wort ist zu gross.** Bei welcher Loesung auch immer — die Wortgroesse
runter (SubpageHero-Wort nutzt buildWordFor mit F=min(150,max(64,vw*0.1)); Paint-Hero
nutzt CSS 22vw + Auto-Fit in demo.engine computeShifts). Kleiner einstellen.

## Was ECHT + WIEDERVERWENDBAR ist (nicht nochmal erfinden!)
- **Paint-Reveal FUNKTIONIERT jetzt korrekt** (Wisch -> Botschaft erscheint, organische
  Gooey-Kanten, Buchstaben-Scatter beim Scrollen). Es ist der 1:1 portierte TIPPS-
  Mechanismus, NICHT selbst gebaut:
  - components/subpages/paint-hero/demo.css      (Kopie von tipps-hero-demo, Reset auf
    .scene-main gescopt, damit er die .rr-Sektionen NICHT zerschiesst)
  - components/subpages/paint-hero/demo.engine.jstext (Kopie; EINZIGE Aenderung:
    computeShifts fittet lange Woerter "Leistungen"/"Website" auf allen Breiten auf
    Bildschirmbreite, nicht nur mobil)
  - components/subpages/PaintHeroClient.tsx       (Wrapper, 1:1 wie TippsHeroClient)
  - components/subpages/paintHeroHtml.ts          (baut HTML aus Wort + Botschaft,
    eigene Mask-/Filter-IDs mask-ph/gooey-ph)
  Verifiziert im Browser: Hub-Wisch zeigt "DEINE WEBSITE ARBEITET. AUCH NACHTS.",
  Website-Wisch "SIE GEHOERT DIR. NICHT UNS.", Scatter + Uebergang sauber, tsc gruen.
- **DER RICHTIGE WEG**: schau den KOMPLETTEN Code der Vorbild-Heroes an und REUSE/
  KOMBINIERE ihn, statt was Eigenes zu bauen:
  - Tipps-Hero (Paint):  app/relaunch-preview/tipps/page.tsx + components/subpages/
    tipps-hero-demo/{demo.css,demo.body.html,demo.engine.jstext} + TippsHeroClient.tsx
  - Ueber-uns-Hero (Figur+Text): app/relaunch-preview/ueber-uns/page.tsx +
    components/subpages/ueber-uns-demo/* + UeberUnsDemoClient
  - SubpageHero (Wort->Figur+Text, React): components/subpages/SubpageHero.tsx
    (comp1 Zahnrad, Eyebrow/Statement/Subline; das ist die "wie die anderen"-Variante)

## Was sonst FERTIG + GUT ist (nicht anfassen ausser Thomas will)
- Hub /relaunch-preview/leistungen: 9-Sektionen-Fluss steht. Bau-Moment (Website baut
  sich scroll-gekoppelt aus rr-Bloecken zusammen), NAVY Scharnier-Band (farbiger
  Moment, Off-White-Crimson + roter Punkt), EIN Teal-Reviews-Panel (echte 5,0/8, nur
  Rafael Danesh + Rene Rohrer, Dmitry ist Team -> raus), FAQ zweispaltig, Schluss-CTA.
- /relaunch-preview/leistungen/website: Bau-Seite (WasEntsteht/WieWirBauen/WasInklusive/
  FuerWenNicht/FAQ/CTA). /relaunch-preview/leistungen/talos: 3D-Deck (TalosPresentation)
  + FragTalos + SSR-Substanz + FAQ + CTA, genau EIN h1.
- Talos-Auftritt (components/relaunch/talos/TalosEntranceStage.tsx + Demo-Route
  /relaunch-preview/talos-entrance): fliegt von rechts rein, dreht sich zum User,
  winkt. Beine-Beschnitt gefixt (Kamera auf Figur-Mitte). OFFEN (Thomas-Entscheidung):
  winkt mit Arm auf Bildschirm-rechts = SEINE linke Hand; Thomas wollte SEINE rechte
  Hand -> spiegeln = Handflaechen-Twist neu loesen.
- Qualitaet: review-it GO (0 kritisch), tsc gruen, vitest 168/168, iOS-visualViewport-
  Fix drin, tote BauMomentSlot geloescht, Fraunces raus.

## Offen / UNKLAR
- Hero-Variante (A/B/C) + Wortgroesse — ZUERST mit Thomas klaeren (siehe oben).
- "bumper"-Text: Thomas erwaehnte "der bumper text stimmt nicht" — nie geklaert, was
  genau er mit "bumper" meint. Beim Hero-Gespraech mitfragen.
- Copy der Paint-Botschaften (reveal-msg) + Eyebrow/Statement sind Platzhalter-nah,
  final mit Thomas (Opus) schaerfen.
- Reveal-msg-Copy Hub/Website nur provisorisch ("Deine Website arbeitet. Auch nachts.")
- NICHT committet bzw. Commit-Stand siehe unten. Nicht gepusht.

## Lessons dieser Session (WICHTIG — verhindert das Neu-Machen)
- 3x falsch abgebogen, weil ich Thomas' Feedback zu frueh interpretiert + selbst was
  gebaut habe statt den vorhandenen, richtigen Code anzuschauen:
  1. Pinsel sah grob aus -> ich hab ihn ENTFERNT (falsch, er wollte ihn RICHTIG).
  2. Er wollte interaktiv -> ich hab eine EIGENE Wisch-Variante gebaut (falsch,
     der Tipps-Code existiert schon).
  3. Ich hab den Tipps-Paint eingebaut -> aber Figur + Text rausgeworfen (falsch,
     er will BEIDES wie die anderen Seiten).
  REGEL: Bei "mach es wie Seite X" ZUERST den KOMPLETTEN Code von X lesen und
  REUSEN/KOMBINIEREN, nichts erfinden. Bei Unsicherheit was genau gemeint ist,
  EINE praezise Frage stellen BEVOR man baut. Design visuell/im Browser gegen das
  Vorbild pruefen, nicht gegen die eigene Vorstellung.

## Relevante Dateien / Befehle
- Dev: `cd ~/dev/redrabbit && npm run dev -- --port 9000`
- Browser-QA: agent-browser (skills get core); 3D/Wisch braucht AKTIVEN Tab.
- tsc: `npx tsc --noEmit`  ·  Tests: `npx vitest run` (168/168)
- Routen: /relaunch-preview/leistungen , /leistungen/website , /leistungen/talos ,
  /talos-entrance ; Vorbild: /relaunch-preview/tipps , /ueber-uns
