# Naechste Session — relaunch / Design-System — 2026-07-07

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, DESIGN.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Immer meine ehrliche Design-Empfehlung dazusagen (Thomas will das explizit) + Design-Skills nutzen.

## Kontext
Fortsetzung des **Design-System-Ausbaus** fuer web.redrabbit.media, Element fuer Element mit Thomas.
Ich bin die **Design-System-Session** (Branch `relaunch`). Paralleler **Hero/Morph-Strang** laeuft separat
(`NEXT_SESSION_relaunch.md`). Ownership laut `PARALLEL_design-system_2026-07-05.md`:
- **Mir gehoeren NUR:** `app/styleguide/styleguide.css`, `app/design-system/page.tsx`, `DESIGN.md`.
- Hero besitzt `components/relaunch/*`, `lib/relaunch/morph/*`, `HomeMorph.tsx`, `RabbitMark.tsx`, `fonts.ts`,
  `relaunch-preview`. **NIE anfassen/committen. Nur meine 3 Dateien stagen.**
- Commit-Ende: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- **Alle Design-System-Commits sind nur LOKAL, NICHT gepusht.** Letzte: `877543f` (FAQ) ← `75f2e4e` (Dropdown)
  ← `58edc85` (Formular-Karten) ← `863c839` (Karten).
- Dev-Server: `npm run dev -- --port 9000` → Abnahme-Seite `http://localhost:9000/design-system`.

## Der Arbeits-Loop (bewaehrt)
1. Neues Element → **3–5 Vorschlaege** als lokales HTML-Artifact, mit `open <datei>` in Thomas' Browser zeigen
   (er findet publizierte Artifacts nicht; `open` ist zuverlaessig).
   Artifact-Bau: `printf '<!doctype html>...<meta charset="utf-8">...' > x.html` **(charset PFLICHT, sonst Umlaut-Mojibake)**
   → `head -n 280 scratchpad/buttons-vergleich.html >> x.html` (Font-Head DM Sans/Crimson/Instrument + Tokens)
   → `_snippet.html`-Body anhaengen. Verifizieren via `agent-browser open ... && screenshot --full`.
2. Thomas entscheidet → in `styleguide.css` (`.rr`-Scope, Tokens) + `page.tsx` (neue `<Section>`) + `DESIGN.md`
   (nummerierter Abschnitt) einbauen. `tsc --noEmit` + `eslint <datei>` gruen. Commit nur meiner 3 Dateien.

## STIL-ANKER (WICHTIG — Thomas-Korrektur 07.07: „orientier dich am SEITENSTIL, nicht am Button")
Echte Seite (`relaunch-preview`) = **Farbwelt-Panels**, gemessen/verifiziert (nicht raten):
- Tokens: `--rr-world-1-bg #1d8c98` (Teal), `--rr-world-2-bg #2d2d2d` (Anthrazit), `--rr-world-3-bg #0a8aba` (Blau).
  Off-White Text `#f6f5f1`. Navy `--rr-navy #1c2837`. Rot `#f12032` = einziger Akzent.
- Riesige **DM Sans**-Headlines (bis 120px), **Crimson Pro** fuer Serif-Statement-Momente, kleine rote Eyebrows.
  Alles eckig (radius 0), reichlich Weissraum.

## ERLEDIGT & im System (Details DESIGN.md §8–§14)
- **Buttons** `rr-btn-sweep` + `rr-btn-frame` (§8, Sektion 13)
- **Karten** `rr-card-slide/-layer/-focus-row/-book` (§10, Sektion 15, `863c839`)
- **Formular-Karten** `rr-formcard-neu` (Neumorph ECKIG, Submit `rr-btn-frame--red--fill`) + `rr-formcard-split` (§11, Sektion 16, `58edc85`)
- **Dropdown** `rr-select` jetzt eckig=Standard + `rr-select-frame` (Eck-Rahmen schliesst vollen roten Rahmen ohne Luecken)=Akzent (§12, Sektion 04c, `75f2e4e`)
- **FAQ** `rr-faq--panel` / `--editorial` / `--chat` (natives `<details>` + grid-rows-Reveal) (§13, Sektion 17, `877543f`)
- **Verworfen** (getestet, Prototypen in scratchpad, NICHT ins System): animiertes Faecher-System + durchblaetterbarer
  Karten-Stapel (aus Thomas-React-Vorlagen adaptiert) — nicht scannbar fuer lange FAQ.
- **Entscheidungs-Status:** DESIGN.md §14.

## OFFEN — HIER WEITERMACHEN
1. **Zahlen-/Stat-Boxen: 5 Vorschlaege SIND GEZEIGT, noch NICHT entschieden.** Artifact `scratchpad/stats.html`
   (A Panel-Band / B Editorial-Split / C Bento / D Hairline-Reihe / E Ticker-Bar, mit Count-up). Meine Empfehlung:
   **A · Panel-Band** (Startseite), B fuer narrative Stellen. → Thomas' Entscheidung + **echte Zahlen** einholen
   (315+ Kunden = Platzhalter! nur 790 € und 9 Bundeslaender sind real; Kundenzahl + Reaktionszeit muss Thomas
   liefern — **erfundene Zahlen verboten**, Rating-Ehrlichkeit-Regel). Dann als `rr-stats` einbauen.
2. **Danach:** Testimonial/Zitat (**nur echte Google-Reviews mit Namen**), Badges/Tags, Kunden-Logo-Leiste.
3. **Ganz offen:** Fragment-/Mechanik-Karte (Zahnraeder) aus Karten-Runde 3 — geparkt.

## Merken / Trigger
- **PREISSEITE:** Sobald wir zur Preisseite kommen, Thomas AKTIV erinnern: er will sie evtl. **horizontal
  (seitwaerts scrollen)** wie `https://www.rabenrifaie.com/`. (Memory `project_redrabbit_preisseite_horizontal`.)
- **Push offen:** Thomas fragen, ob `relaunch` gepusht werden soll (`git push -u origin relaunch`) fuer die
  Vercel-Preview. Bisher alles nur lokal.
- **Kontext/Kompakt:** Auto-Kompaktierung feuert bei ~96,7 % (1M-Modell). Nicht abschaltbar; selbst steuern mit
  `/compact` bzw. `/clear`, `/context` zeigt den Stand. Thomas will den Zeitpunkt selbst bestimmen.

## Fallstricke
- `/design-system` **resetet Scroll auf 0** (Morph-Route) → agent-browser Viewport-/Element-Screenshots oft leer.
  Verifizieren via `tsc` + DOM-Check (`agent-browser eval`) + Computed-Style + notfalls Standalone-Mini-Render.
- CSS-Custom-Property als Inline-Style in JSX: `style={{ ["--tx" as string]: "150px" }}` (tsc-sauber).
- Native `<details>` in der Server-Component ist ok (KEINE Event-Handler an Server-Component-Props → sonst 500).
