# Naechste Session — /leistungen/website Mobile-Umbau (Stand 2026-08-01 nachts, sehr spaet)

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
