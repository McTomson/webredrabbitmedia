# Naechste Session — /leistungen/website Mobile-Umbau (Stand 2026-08-01 nachts, sehr spaet)

## NACHTRAG 2026-08-02 (Folge-Session)
- **B (Paket-Stopp) ERLEDIGT + LIVE auf v2, aber ANDERS als unten geplant.** Erst als
  gepinnte Crossfade-Station mit kompakten Karten gebaut (ecc155c) -> Thomas hat das als
  ungewolltes REDESIGN abgelehnt: "das einzige was ich wollte war das da ein stop ist, mehr
  nicht, kein neues design". Zurueckgesetzt (03e61ee) auf das Original-Design (gestapelte
  Pakete, voller Accordion, alle Merkmale) und den Stopp REIN ADDITIV per nativem CSS
  scroll-snap ergaenzt (website.css, mobile-only): `html{scroll-snap-type:y proximity}` +
  `.fmx__stufe{scroll-snap-align:start; scroll-snap-stop:always}`. LEHRE: kleine konkrete
  Bitte = genau das, kein Umbau (Memory feedback_minimal_nur_das_erbetene_kein_redesign).
  DEVICE-CHECK offen: haelt es sauber an jedem Paket UND scrollt der Rest (Hero/Ablauf/
  Dashboard/Vollbild-Sektionen) am Handy weiter normal (globales html-Snap)? Falls dort
  Ruckeln: snap enger fassen.
- **C (Talos-Hand) weiter getuned + LIVE (6e5cc8f):** Mobile-Canvas-Aspect von ~0.78 auf ~1.0
  (width clamp(300px,86vw,450px) / height clamp(300px,48vh,430px)). Hebel ist bewusst das
  Canvas-Aspect, NICHT die Kamera (TalosEntranceStage liest camPos/camTgt nur beim Mount +
  vertikales FOV ist fix -> Winkarm ist ein HORIZONTALES Problem). Am Geraet final bestaetigen.
- **Video-Idee: erst besprochen/verworfen, dann von Thomas UMGEDREHT -> UMGESETZT.** Ich hatte
  von Video abgeraten (Scroll-Kopplung, SEO, LCP). Thomas will es trotzdem: auf MOBILE/TABLET
  das Video statt Canvas, Desktop bleibt Canvas. Entscheidungen (02.08.): nur Mobile; Video
  gepinnt + faded beim Scrollen (bleibt am Ort); Zahnrad-Figur + Story-Text bleiben als
  Abschnitt DRUNTER (kein Inhaltsverlust).
  UMGESETZT (aeec5e8 + dccf51d):
  - Video optimiert: 4,4 MB -> 324 KB, stumm (-an), nahtloser Crossfade-Loop, **CFR 30fps /
    Main-Profil / yuv420p / faststart** (Quelle war krumme VFR ~52fps -> iOS-Dekodierfehler).
    public/hero/website-hero-mobile.mp4 + Poster public/hero/website-hero-poster.jpg.
  - `WebsiteHeroSwitch.tsx` (Weiche): SSR/Desktop = Demo unveraendert; useLayoutEffect schaltet
    mobil VOR dem Paint um -> kein Flash, Demo-Engine bootet mobil nie. `MobileVideoHero.tsx`:
    Video (autoplay/muted/loop/playsInline, muted-PROPERTY per ref gesetzt = React-Eigenheit,
    Poster, Off-White-BG) gepinnt + Fade, darunter MorphSculpture comp0 progress0.55 + Story.
  - **iOS-Falle:** Stromsparmodus (gelbe Batterie im Foto) BLOCKT Video-Autoplay generell ->
    Poster (aufgedeckter Satz) zeigt dann die Botschaft, erster Touch startet nach.
  - **Reveal-Zickzack (buildRevealPath, 8da2c43) ist mobil jetzt UNGENUTZT** (Video statt
    Canvas). Harmloser toter Code; bei Bedarf entfernen.
- **>>> BLOCKER, HIER ZUERST (02.08. Abend, Thomas: "problem nicht geloest"): v2.redrabbit.media
  liefert ALLE statischen Assets als 404** (Video, Poster, sogar favicon.png/file.svg) ->
  auf dem Handy schwarzer "nicht abspielbar"-Screen. Die DEPLOYMENT ist FEHLERFREI: dieselbe
  Deployment auf den .vercel.app-Aliassen serviert alles 200 (Video CFR-Format live bestaetigt).
  Isoliert: reines v2.redrabbit.media-CUSTOM-DOMAIN-/Edge-Problem, NICHT Code/Video.
  - Funktionierender Test-Link (gleicher Build): https://webredrabbitmedia-mctomson-toms-projects-17d37f0b.vercel.app/relaunch-preview/leistungen/website
  - Was probiert: `vercel alias set` (mehrfach, zeigt v2->62l2q3qob per `vercel inspect`, aber
    v2 servt trotzdem 404 mit x-vercel-cache HIT + x-matched-path /404); Query-Param-Cachebust
    (404); no-cache-Header (404); frischer Alias v3.redrabbit.media (scheitert: kein DNS/Cert).
  - Memory-Hinweis: v2 wird per Git-Push-Preview gefuettert (reference_v2_deploy...), nicht per
    CLI-Alias -> evtl. wartet v2 auf die Git-Preview ODER die Domain-Edge haengt.
  - NAECHSTE SCHRITTE: (1) pruefen ob v2 sich selbst gefangen hat (curl v2 favicon.png). (2)
    Falls nicht: Vercel-Dashboard -> Domain v2.redrabbit.media Cache purgen / Domain neu
    zuweisen / pruefen an welche Deployment/Environment v2 wirklich haengt (Prod vs Preview).
    (3) NICHT `vercel --prod` (das trifft web.redrabbit.media = Live-Seite!).
  - OFFEN unabhaengig von v2: das VIDEO selbst am iPhone (ohne Stromsparmodus) bestaetigen —
    laeuft die Schleife, sitzt der Fade beim Scrollen, ist die Figur/Story drunter ok.
- **Pinsel-Reveal ERLEDIGT + LIVE (8da2c43):** buildRevealPath in demo.engine.jstext neu —
  statt zeilenweise links->rechts jetzt Zickzack (vertikaler Serpentin nach rechts), zur
  Mitte breiter (widthK), stabile Hash-Asymmetrie (kein Math.random). Deckung OFFLINE zu 100%
  verifiziert (scratchpad-Skript, kein Browser noetig, da reine Geometrie). Am Geraet Look
  bestaetigen; Parameter (cols=11,rowsN=4,baseR=cell*1.24,widthK=0.72+0.6*sin) leicht drehbar.
- **Doppel-Punkt beim Malen BEHOBEN + LIVE (3d3e6fa):** War KEIN Hero-Bug. RelaunchMenu.tsx
  rendert den site-weiten roten Maus-Cursor an der ECHTEN Mausposition (ungeglaettet -> laeuft
  voraus); der Hero hat zusaetzlich seinen geglaetteten Pinsel-Punkt -> zwei rote Punkte. Fix
  in RelaunchMenu onMove: ueber `.main-sticky.painting` (aktive Hero-Mal-Flaeche) den globalen
  Punkt ausblenden (dort ist der Pinsel der Cursor). Diagnose kam von Thomas (Farbe rot +
  Position "vor dem Pinsel") -> kein Raten. Am Geraet bestaetigen (nur noch 1 Punkt).
- **A (Zurueckscroll-Overlap-Bug) WEITER OFFEN — nicht angefasst.** Emulator friert bei dieser
  schweren Seite ein/crasht den Tab (auch eine leichte Hero-only-Testroute crasht — die rAF-
  Loops der Engine reichen). Animierten Zurueckscroll-Bug hier nicht reproduzierbar. Fuer A:
  Handy-Aufnahme von Thomas (Frames per ffmpeg) ODER an einem Nicht-Emulator-Browser.
  Vermutung weiter: Rueckwaerts-Reset von Morph/Reveal (smPm-Glaettung + __sculptProgress)
  raeumt die Formen nicht sauber hinter die Reveal-Schrift. NICHT blind anfassen.

## Arbeitsregeln (verbindlich)
- Lies ZUERST diesen Handoff, MEMORY.md, betroffene Dateien. Nicht ohne Kontext loslegen.
- NIE raten — immer verifizieren (Code/Browser/decisions-log). Preise/Marken-Begriffe NIE erfinden (decisions-log ist Quelle).
- Erst Plan, dann bauen. Laufend im Browser bei 500px testen. commit/push/deploy ZWISCHEN Schritten.
- Visuelle Fixes erst "fertig", wenn Thomas es auf SEINEM Geraet bestaetigt.
- Branch `relaunch` GETEILT: `git fetch` + `git log` vor Arbeit, NUR eigene Dateien mit Pfad committen (NIE `git add .`/`-u`). Fremde WIP nicht anfassen: app/relaunch-preview/faq/page.tsx, components/relaunch/SiteClosing.tsx, faq-demo/demo.body.html, docs/handoffs/NEXT_SESSION_leistungen.md, docs/seo-monitor-log.md.
- Deploy: `vercel deploy --yes` -> letzte URL -> `vercel alias set <url> v2.redrabbit.media`.
- Dev-Server neu starten falls verklemmt: `lsof -ti tcp:9000 | xargs kill -9` dann `npm run dev -- --port 9000` (Hintergrund). Er verklemmt bei dieser schweren Seite gern; ~21s bis ready.

## Emulator-Faehigkeiten (wichtig)
- `resize_window(500,1000)` -> ~606px CSS-Breite -> Mobile-Media-Queries -> SEKTIONEN-Layout PRUEFBAR.
- ABER: rAF + CSS-Transitions + 3D-Canvas sind im Hidden-Tab EINGEFROREN. Scroll-getriebene Animationen (Ablauf, Dashboard-Pan) + 3D-Talos rendern NICHT von selbst. Test: `window.dispatchEvent(new Event('scroll'))` nach `window.scrollTo(...)` treibt die rAF-`render()` manuell; Transition-Zielwerte per `el.style.transition='none'`. Finger-Scroll + 3D nur am Geraet.
- Screenshots timen bei geladenem 3D-Talos oft aus (Renderer traege). DOM-Abfragen (getComputedStyle, rects) funktionieren dann noch.

## ERLEDIGT + LIVE auf v2 (diese Session, alles gepusht, HEAD 7bd391c)
1. **Ablauf mobil = horizontale Kreiskette** (07f8b9a) — Desktop-Szene auf Mobile freigeschaltet (prefersReducedMotion + svh).
2. **Copilot-Dashboard mobil = gepinnte Auto-Scroll-Szene + Talos-Overlay** (6a85a4b, Talos-Breite 7bd391c) — vertikal scrollen pannt das Dashboard automatisch nach rechts (rAF translateX), Talos blendet in der 2. Haelfte ein, liegt UEBER dem Dashboard. FUNKTIONIERT am Geraet (Thomas bestaetigt). OFFEN: Talos' ausgestreckte Hand ist am Geraet noch nicht GANZ drin (Canvas 7bd391c auf clamp(250px,66vw,390px) verbreitert -> "mehr sichtbar, aber noch nicht alles"). 3D-Framing via camPos/camTgt in `TalosEntranceStage`; evtl. Canvas noch breiter ODER Kamera nur fuer diese Instanz zoomen (Achtung: camPos/camTgt sind fuer Desktop+Mobile dieselbe Instanz — Mobile-only nur ueber Canvas-Aspect steuerbar, nicht ueber die geteilten Kamera-Props).
3. **SoBauenWir + Diagnose auf Mobile ausgeblendet** (edd45d0) — `.rr-hide-mobile` in website.css.
4. **Pakete**: Rand-Padding gefixt + **Preise mit "ab"** (7ef5cc4 + 7bd391c): ab 1.250 / ab 2.850 / ab 4.900 (PREISE-Map in DreiStufenMatrix). Akkordeon war schon da.
5. **Vollbild-Sektionen** (e770297) — `.rr-fullscreen-mobile` (min-height 100svh + zentriert) an KundenSagen/ReferenzenTeaser/WebsiteFaq/SiteClosing-Wrapper in page.tsx.
6. **Fundament mobil = zwei Wisch-Decks je Gruppe** (74c05ef) — "Was auf der Seite steckt" / "Was im Hintergrund fuer dich mitlaeuft", je horizontales Deck. `.lwa__deck` Desktop display:contents (Reveal unveraendert), Mobile flex scroll-snap.
7. **Diagnose-Popup** (175b6a8) — Button "Welches Paket passt zu mir?" in der Paket-Intro oeffnet Modal (inline position:fixed) mit `<Diagnose />`. Escape/Backdrop/X schliessen. NOCH NICHT am Geraet bestaetigt (Runtime-Oeffnen konnte lokal nicht getestet werden, Server war eingefroren) — beim naechsten Mal am Geraet pruefen: oeffnet sauber, Fonts korrekt, mittig?
8. **Begriff "Copilot" statt "Cockpit"** (decisions-log e5ee6de) — Thomas 01.08. gekippt. NICHT wieder aufrollen.

## OFFEN — HIER WEITERMACHEN (Thomas' Prioritaet)
- **A) HERO-BUG beim Zurueckscrollen (WICHTIG, zuerst).** Beim Hochscrollen zum Hero legen sich die roten Morph-Formen (das Wort->Zahnrad-Figur-Morph) UEBER die Reveal-Schrift ("Schoen kann fast jeder. Die Frage ist: ruft bei dir auch wer an?") — kaputte Ueberlappung (Thomas Geraete-Foto). Steckt im **Hero-Morph-Motor** `components/subpages/website-demo/demo.engine.jstext` (der fragile, stundenlang gebaute Teil — NICHT blind anfassen, mit laufendem Dev-Server reproduzieren + verifizieren). Vermutung: der Rueckwaerts-Zustand (scroll up) resettet das Morph/Reveal-Zusammenspiel nicht sauber. Zusammenhang: scrollRevealA (P_PAINT=0.05) + MorphSculpture/Figur. Reproduzieren: Hero runter, dann wieder hoch scrollen.
- **B) Stop bei JEDEM Paket (Starter/Business/Premium).** Aktuell stehen die 3 Pakete auf Mobile gestapelt-statisch (DreiStufenMatrix `.fmx__static`). Thomas will je Paket eine bildschirmfuellende Station MIT Halt (wie beim Ablauf die 4 Schritte = gepinnte Kreiskette, ODER scroll-snap pro Stufe + 100svh je Stufe). Muster: entweder die Desktop-Fahrt (StufenFahrt, snapUnits) auch mobil aktivieren (analog Ablauf-Freischaltung), ODER jede `.fmx__stufe` mobil auf min-height:100svh + scroll-snap-align. Verifiziert bauen.
- **C) Talos-Hand ganz zeigen** (Punkt 2 oben) — Canvas-Breite/Framing weiter tunen bis die Hand komplett drin ist. Geraete-Check.
- **D) Diagnose-Popup am Geraet bestaetigen** (Punkt 7).
- **E) OPTIONAL / Thomas' Idee (Feasibility bestaetigt = mittel-schwer, machbar): Hero-Reveal im Pinsel-Stil.** Statt links->rechts: Pfad wie ein Pinselstrich — Start oben-links, Zickzack nach unten, in der Mitte breiter dann schmaler, leicht asymmetrisch/zufaellig, sodass die Schrift wie handgemalt aufgedeckt wird. Machbar: der Canvas-Mal-Mechanismus existiert (buildRevealPath -> drawRevealScroll in demo.engine); nur die Pfad-Generierung neu (Zickzack+variable Breite+Jitter). Erst bauen, wenn Thomas es ausdruecklich will; ein paar Geraete-Runden fuers Feintuning.
- **F) Konsistenz (eigene Runde): "Cockpit" -> "Copilot"** auf /preise (Merkmal "Dein Cockpit" in allen Paketen) + ueberall sonst.

## Relevante Dateien
- Hero-Motor: `components/subpages/website-demo/demo.engine.jstext` (Zeile 7 ist eine 76k-Zeichen-Datenzeile -> via `sed` lesen, nicht Read). Debug: `window.__revealDiag()`.
- Sektionen: `components/subpages/leistungen/website/v2/` — `TalosDashboard.tsx` (Copilot-Auto-Scroll, Talos-Overlay), `DreiStufenMatrix.tsx` (Pakete + Preise + Diagnose-Popup + PREISE-Map + StufenFahrt fuer die Stop-Frage), `fundament-varianten/VarianteA.tsx` (2 Wisch-Decks), `Ablauf.tsx` (Kreiskette-Muster fuer B), `Diagnose.tsx` (im Popup). Seite: `app/relaunch-preview/leistungen/website/page.tsx`. Utilities: `.rr-hide-mobile` + `.rr-fullscreen-mobile` in `website.css`.
