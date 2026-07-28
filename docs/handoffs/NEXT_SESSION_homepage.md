# NEXT_SESSION — Homepage-Relaunch (v2.redrabbit.media)

Stand: 28.07.2026 spaet, letzter Commit `ad1c717` (Site-Vereinheitlichung, alles LIVE).

## NEU 28.07. abends: Site-Vereinheitlichung (Grill-Session)
- **ZUERST LESEN: `docs/DESIGN_STANDARD.md`** — seit 28.07. die EINE kanonische Quelle
  (Farben, 2 Buttons, Eyebrow "( Thema )", Abstaende, Bumper-System, Mobile-Regel).
  Plan/Herleitung: `docs/handoffs/PLAN_vereinheitlichung_2026-07-28.md`.
- Umgesetzt in `af064de` + `ad1c717`: ein Off-White #F4F4F2 ueberall, Navy-Reste weg,
  rr-btn-frame GELOESCHT (nur noch sweep+outline, --light auf dunkel), Menue ohne
  Eck-Klammern (roter Punkt-Hover), CornerLogo ab 2 Viewport-Hoehen, geteiltes
  `SiteClosing` (Texte: `brand/copy-closing-cta.md`) + echte FooterReassembly auf allen
  Seiten (Nachbauten in ueber-uns/kontakt/faq-Demos entfernt), zentrales
  `lib/relaunch/scroll-standard.ts` (Bumper-Dwell, 820px-Degradation), Preise-Bumper
  hell + "( Was du bekommst )", Abstaende auf --rr-section-y.
- OFFEN: (a) Mobile-Degradation nur code-verifiziert — visueller Geraete-Test bei
  Thomas' Abnahme; (b) Talos-Fahrt-Slides tragen noch ihre eigenen Slide-Eyebrows,
  keine ( Thema )-Zeile; (c) components/subpages/leistungen/talos/TalosCta.tsx ist
  verwaist, kann weg; (d) Thomas' visuelle Gesamt-Abnahme steht aus.

## Wo wir arbeiten
- **Ordner:** `~/dev/redrabbit` — **Branch `relaunch`** (geteilt, gepusht). Vor Arbeit: `git fetch` + `git log --oneline -8`.
- **Live-Test-Site:** **https://v2.redrabbit.media/** — das ist die **Branch-Domain von `relaunch`**. Homepage = `app/relaunch-preview/page.tsx`, via `middleware.ts` an der Wurzel ausgeliefert (kein `/relaunch-preview` in der URL). `web.redrabbit.media` = alte Live-Site, **unberührt lassen**.

## Deploy + Verifikation (WICHTIG)
- `git push origin relaunch` loest automatisch einen **Vercel-Preview-Build** aus (~3 Min). Danach zeigt v2 die neue Fassung.
- v2 hat jetzt **`Cache-Control: no-store`** (middleware, nur `v2.*`): ein **normales Neuladen** zeigt sofort frisch. (Frueher lieferte der Edge-Cache alte HTML aus -> "keine Aenderung"-Verwirrung.)
- **Live pruefen IMMER mit EINEM EINDEUTIGEN Marker**, nicht mit einem String der schon vorher da war:
  `curl -s https://v2.redrabbit.media/ | grep -F "<neuer-einmaliger-Text-aus-diesem-Deploy>"`
  plus `vercel ls` (oberste Zeile Ready). Siehe [[reference_v2_deploy_und_relaunch_untracked_wip]].

## Git-Hygiene (Falle!)
- Working Tree hat **~74 untracked WIP-Files** (Talos-/Subpage-Strang). **NIE `git add .` / `git add components`** — das committet fremde Arbeit. **Immer `git add -u`** (nur getrackte Aenderungen), dann `git reset -q docs/seo-monitor-log.md` (pre-existing, nicht unseres).

## Design-System (25.-28.07., verbindlich)
- Farben: Rot **#F12032** (nur Akzent/Buttons/Logo), Dunkel **#23262E** (ersetzt alles Navy/Blau), Paper **#FFF**, Off-White **#F4F4F2**. **KEIN Tuerkis/Blau** mehr (zentrale Tokens in `app/styleguide/styleguide.css` + hardcodete Hexe gefegt). Ecken: `border-radius: 0`.
- Fonts: **DM Sans** (Headlines), **Crimson Pro** (Hero-Statement), **Instrument Sans** (Body/UI).
- Zielgruppe: oesterr. **Mittelstand/KMU breit** — NICHT "Handwerker" verengen. Copy aus `brand/copy-homepage.md` + `brand/positioning.md`, nie raten. Keine erfundenen Gadgets/Zahlen; Beweise = echte Google-Rezensionen (Danesh, Rohrer) + echte Lighthouse-Werte aus `components/Portfolio.tsx`.

## Homepage-Komponenten (`components/relaunch/`)
- `HomeMorph.tsx` — Hero (grosser Crimson-Claim auf #F4F4F2) + 5 Leistungs-Szenen; alle Morph-Teile ROT (Navy-Slot entfernt).
- `CasePanels.tsx` — 3 Panels **Problem / Loesung / Beweis** als **horizontaler Pan** (runter -> nach rechts durch 100vw-Fenster -> runter). Snap-Dwell (Fenster kleben lang, `smoothstep((f-0.4)/0.2)`, Track-Hoehe `N*190vh`). Riesen-Themenwort faehrt mit (Parallax 1.18x). Beweis-Fenster 2 = Text + **`LighthouseCarousel`** (rechts, offen+2-spaltig, 3 Kunden, echte Portfolio-Werte, dunkel). Beweis-Fenster 3 = **KundenSagen dunkel** (via `.ks-ondark`-Override in styleguide.css).
- `LighthouseCarousel.tsx` — neu; Score-Ringe animieren bei IntersectionObserver, langsames Auto-Carousel (9s), aufklappbare Erklaerungen.
- `HomeClosing.tsx` — Off-White-Abschluss-CTA (Zeilenumbrueche) + Button-Paar (roter Sweep + `rr-btn-outline` "Anrufen"). `KundenGrid.tsx` — Off-White + Klick-Label "Alle Projekte ansehen". `FooterReassembly.tsx` — dunkel #23262E.

## Offen / zuletzt
- Letzter Feinschliff (`5cf7180`): Riesenwort faehrt mit, Text groesser/breiter, Lighthouse offen+2-spaltig, KundenSagen-Kacheln lesbar. **Wartet auf Thomas' visuelle Bestaetigung** (Kacheln lesbar? Lighthouse-2-Spalten passt ganz rein?).
- Naechster Block: "allgemein ein paar Dinge aendern" (Thomas 28.07.) — Details kommen von Thomas.

Related memory: [[reference_v2_deploy_und_relaunch_untracked_wip]], [[feedback_redrabbit_zielgruppe_keine_handwerker_verengung]], [[reference_relaunch_site_chrome_kanonisch]].
