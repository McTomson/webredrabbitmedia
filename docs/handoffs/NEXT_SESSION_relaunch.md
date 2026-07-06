# Naechste Session — relaunch (Hero/Morph + Wortmarke) — Stand 2026-07-06 (nach Neustart nahtlos weiter)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe. Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben.
- KEINE Emojis. User-Content mit echten Umlauten.

## Setup nach Neustart (zuerst)
- Projekt: `~/dev/redrabbit`, Branch `relaunch`. Dev-Server: `npm run dev -- --port 9000` → http://localhost:9000/relaunch-preview
- Falls `node_modules` fehlt: `npm install`.
- Browser-QA: **agent-browser** verwenden (nicht die Chrome-Extension — deren committete localhost-Navigation haengt an einer Permission-Freigabe im Extension-Panel). `agent-browser open http://localhost:9000/relaunch-preview`.

## PARALLEL-SESSION-STRUKTUR (WICHTIG, fremde Handoffs nicht ueberschreiben)
Auf Branch `relaunch` laufen zwei Straenge (siehe `docs/handoffs/PARALLEL_design-system_2026-07-05.md`):
- **Design-System-Session** besitzt: `app/design-system/page.tsx`, `app/styleguide/styleguide.css`, `DESIGN.md`. Handoff: `NEXT_SESSION_relaunch-design-system.md` (NICHT anfassen).
- **Hero/Morph-Session (DIESE)** besitzt: `components/relaunch/HomeMorph.tsx`, `FooterReassembly.tsx`, `lib/relaunch/morph/*`, `lib/relaunch/fonts.ts`, `RabbitMark.tsx`.
- GRENZUEBERSCHREITUNG (bewusst, committet): Der Font-Swap MUSSTE `app/styleguide/styleguide.css` (Display-Token) + `app/relaunch-preview/page.tsx` (dmsans-Variable) mitaendern. Die Design-System-Session muss wissen: `--rr-font-display` ist jetzt **DM Sans** (nicht Fraunces), weight 700, opsz-Achsen raus. `.rr-claim`/`.rr-statement` bleiben bewusst Crimson-Serif (styleguide.css Zeile ~113 override).

## Was diese Session gemacht hat (ALLES committet + im Browser verifiziert)

### Commit f0110f4 — Display-Font Fraunces → DM Sans (Auftrag aus HERO_font-swap_dm-sans.md = ERLEDIGT)
- `lib/relaunch/fonts.ts`: DM Sans variabel (`--font-dmsans`), Fraunces aus Display-Slot ausgemustert.
- `app/styleguide/styleguide.css`: `--rr-font-display` → DM Sans, weight 700, `font-variation-settings: normal`.
- `lib/relaunch/morph/pieces.ts`: `buildWordLayout` zweizeilig gestapelt → **einzeilig nebeneinander**, Zentrierung ueber echte Ink-BBox (2 Paesse). Weight 700 in `renderPiece`.
- `app/relaunch-preview/page.tsx`: `dmsans.variable` eingehaengt.
- `components/relaunch/FooterReassembly.tsx`: einzeilige Marke breiter → F breitengefuehrt gedeckelt (kein overflow-Clipping mobil).

### Commit fab62e4 — Tomson-Feedback (5 Punkte), alle gefixt
1. **Navy-Akzent**: war 3/2/9/7/3 (4efde41 faerbte JEDE Instanz der Balken-Form). Jetzt GENAU EIN wandernder dunkelblauer Traveler durch alle 5 Figuren (Mechanismus aus revertiertem 189f3c7 wiederhergestellt). `HomeMorph.tsx`: `navyIdxByScene`, Szenen-Teile alle rot, `navyEl`/`navyRest`/`navyHide` + `NAVY_HOLD=[2.55,3.55,4.55,5.55,6.35]`. Verifiziert: `navyVisible==1` an jedem Hold UND Uebergang (inkl. altem 0-Frame u≈3.85).
2. **Formation "zwei Knoedel"**: `stage.ts` `wordmarkSegs` leitete Burst-Winkel aus Position ab; einzeilig ⇒ cy≈0 ⇒ Kollaps links/rechts. Jetzt **Golden-Angle** (`GOLDEN=Math.PI*(3-Math.sqrt(5))`, `wmAngle`-Map) ⇒ harmonische Radial-Verteilung. Im Shatter-Frame bestaetigt.
3. **Buchstaben-Gaps (e/d/b)**: `pieces.ts` `renderPiece` — Clip-Rechtecke um `M=2.4` inflatiert (Ueberlappung an Schnittkanten), Canvas UND SVG (`infl`-Array). DM-Sans-Glyphen jetzt luecken los solide. Bei 2,3x gezoomt bestaetigt.
4. **Groesse**: Hero-Lockup `HomeMorph.tsx` F = clamp(52, 10.5vw, 132) (war 15vw/200). Footer `FooterReassembly.tsx` desiredF = clamp(56, 9.2vw, 128) (war 13vw/210).
5. **Wortabstand**: `pieces.ts` `SPACE_EM` 0.9 → 0.42.

## Offen / zu klaeren (mit Tomson)
- **Groesse = Geschmackssache**: aktuell Hero 10.5vw/132, Footer 9.2vw/128. Aenderung = je EIN clamp-Wert (oben). Nicht raten — Tomson schauen lassen.
- **prefers-reduced-motion-Fallback** in `FooterReassembly.tsx` (`reduced`-Zweig) rendert die Marke noch **zweizeilig** `red<br/>rabbit`. Fuer Konsistenz auf einzeilig umstellen (nur reduced-motion betroffen). Bewusst NICHT als Last-Minute-Edit gemacht.
- **Mobil-Pixel-Screenshot der Footer-Marke** NICHT als echtes Bild gemacht (agent-browser-Viewport fuer Chromium nicht umstellbar). Fit rechnerisch mit echten DM-Sans-Metriken verifiziert (360–1600px passt). Echter Mobil-Shot → Chrome-Extension (Tomsons localhost-Freigabe noetig) oder DevTools-Device-Mode.

## QA-Harness (wiederverwenden)
- `window.__morphU = <u>` erzwingt Morph-Fortschritt (Lenis-unabhaengig). Figuren-Holds = NAVY_HOLD (gear 2.55, bulb 3.55, block 4.55, dash 5.55, face 6.35). Shatter ~u 0.75–1.2.
- `window.__uScroll = <0..U_SPAN>` erzwingt Gesamt-Scroll. Intro-Lockup sichtbar: `__uScroll≈1.5` (U_INTRO=1.6).
- Nach QA: `delete window.__morphU; delete window.__uScroll`.
- Navy zaehlen: `document.querySelectorAll('path[fill="#1C2837"]')` → nur der Traveler ist navy; visible-Count muss ueberall 1 sein.
- QA-ARTEFAKT: bei erzwungenem `__morphU` ohne passenden Scroll ueberlagert das Intro-Statement die Szenen-Statements — KEIN Bug (im echten Scroll weg).

## Naechste konkrete Schritte
1. Dev-Server hoch, `relaunch-preview` oeffnen, Tomson Wortmarke + Morph final abnehmen lassen (v.a. Groesse).
2. Falls OK: pushen (s.u.). Sonst Groesse/Abstand per Einzelwert nachziehen.
3. Optional: reduced-motion-Footer-Fallback auf einzeilig angleichen.

## Git-Zustand
- Branch `relaunch`, sauberer Arbeitsbaum. Session-Commits: **f0110f4**, **fab62e4** (beide lokal, ueberleben den Neustart).
- **NICHT gepusht** (kein Upstream). Remote `origin https://github.com/McTomson/webredrabbitmedia.git`. Zum Pushen: `git push -u origin relaunch`.
- graphify post-commit-Hook laeuft lokal (kein API-Cost).
