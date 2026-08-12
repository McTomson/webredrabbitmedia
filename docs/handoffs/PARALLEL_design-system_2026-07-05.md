# Parallel-Session Handoff — Design-System / DESIGN.md (Relaunch)

Stand: 2026-07-05 nachts. Autor: Hero-/Morph-Session (läuft parallel weiter).
Zweck: Eine zweite Claude-Session soll die **Design-System-Arbeit** übernehmen,
ohne mit der Hero-/Morph-Session zu kollidieren.

## 0. TL;DR — Ownership-Split (WICHTIG gegen Konflikte)

Beide Sessions arbeiten im selben Repo `~/dev/redrabbit`, Branch **`relaunch`**,
gegen denselben Dev-Server auf **:9000**. Damit nichts kollidiert, gilt strikte
Datei-Aufteilung:

| Diese (Hero-)Session besitzt | Deine (Design-System-)Session besitzt |
|---|---|
| `components/relaunch/HomeMorph.tsx` | `app/design-system/page.tsx` |
| `lib/relaunch/morph/*` (pieces.ts, stage.ts, grammar.ts …) | `app/styleguide/styleguide.css` |
| `app/relaunch-preview/page.tsx` | `DESIGN.md` |
| die Hero-/Wortmarken-Animation | neue Komponenten-Dateien fürs Design-System |

**Nicht** in die HomeMorph/morph-Dateien schreiben — die ändert die Hero-Session
laufend. Bei der Font-Frage (siehe §4) gibt es eine Überschneidung: du baust die
Font-**Vergleiche/Specimens** im Design-System, aber der eigentliche
Wortmarken-**Font-Swap in der Hero-Animation** bleibt bei der Hero-Session,
weil er `pieces.ts` (Fraunces-spezifische Clip-Rects) betrifft.

### Git-Koordination
- Beide pushen auf `origin/relaunch`. **Vor jedem Push**: `git pull --rebase origin relaunch`.
  Da wir disjunkte Dateien bearbeiten, rebased das sauber ohne Merge-Konflikte.
- Nie `git checkout .` / `reset --hard` (der Daily-Bot nutzt ein separates Worktree
  `~/dev/redrabbit-daily`, aber dieses hier ist der geteilte Checkout — nicht hart resetten).

## 1. Aktueller Stand (was ist live)

Preview-Route: `http://localhost:9000/design-system` und `.../relaunch-preview`.
Letzte relevante Commits auf `relaunch`:
- `698c2c1` feat: Design-System Button/Card/Toggle-Varianten (Sektionen 09-12)
- `460184c` / `c59fbac` / `16142de` … Hero-Politur (Hero-Session, nicht anfassen)

Design-System-Seite (`app/design-system/page.tsx`) hat nummerierte Sektionen,
jede mit einem Freigabe-Tag **„Zur Freigabe · Ja / Nein"**. Aktuell u.a.:
Marken-Fundament, Farben, Typografie, Buttons (04), Links (04b), Dropdown (04c),
Motion, Bausteine, Spacing, „Was noch fehlt" (08), sowie neu **09 Buttons-Metallisch,
10 Buttons-Line-Draw, 11 Cards-Soft, 12 Toggle**.

## 2. Konventionen der Design-System-Seite (unbedingt einhalten)

- **Tokens** liegen in `app/styleguide/styleguide.css` unter dem `.rr`-Scope.
  Kern: `--rr-red:#f12032`, `--rr-red-deep:#c81222`, `--rr-ink:#23262e`,
  `--rr-navy:#1c2837`, `--rr-surface:#F4F4F2`; Easing `--rr-ease:cubic-bezier(0.6,0,0.4,1)`;
  `--rr-t-fast/med/slow`; Shadow-Tokens `--rr-shadow-btn/-hover/-red/-pop`.
  Fonts: `--rr-font-display` (Fraunces), `--rr-font-serif` (Crimson Pro),
  `--rr-font-ui` (Instrument Sans / Grotesk für UI).
- Neue Komponenten-CSS **scoped** anlegen (`.rr-...`), Farben über CSS-Vars variieren.
- Jede neue Showcase-Sektion bekommt das Tag „Zur Freigabe · Ja / Nein" + kurze
  deutsche Überschrift, gleicher Aufbau wie bestehende Sektionen.
- **Schreibstil-Sonderfall:** Diese Seite verwendet durchgängig **ASCII-Umlaute**
  (`fuer`, `Flaeche`, `Pruefen`) als Hausstil (interne noindex-Dev-Seite). Neue Copy
  im selben Stil halten — NICHT nur einzelne Sektionen auf echte Umlaute umstellen
  (Inkonsistenz). Nur „ganz oder gar nicht" umstellen, und das nur auf Thomas-Ansage.
- Globale Regeln (aus ~/CLAUDE.md): **keine Emojis**, **kein Gedankenstrich „–"**
  in Copy (normaler Bindestrich). Bei UI-Arbeit die Design-Skills nutzen
  (`emil-design-eng`, `design-taste`, `ui-ux-pro-max`).

## 3. Dev-Server + Browser-QA (so verifizierst du)

- Server läuft auf :9000 (`npm run dev -- --port 9000`). Wenn er hängt
  (curl timeout, 000): `lsof -nP -iTCP:9000 -sTCP:LISTEN -t` → node-PID `kill -9`,
  dann `NODE_OPTIONS=--max-old-space-size=6144 nohup npm run dev -- --port 9000 &`,
  Route warmlaufen lassen (erster Compile 20-30s). **Es darf nur EIN next-server
  auf :9000 laufen** (sonst Port-Kollision).
- Browser-QA mit `agent-browser --session <name>` (eigener Session-Name wählen,
  z.B. `dswork`, damit du der Hero-Session nicht ins Fenster fährst):
  `set viewport 1440 900` / `open <url>` / `wait --load networkidle` / `eval '<js>'`
  / `screenshot <pfad>`. Verifiziere immer Desktop 1440x900 UND Mobile 390x844,
  kein horizontaler Scroll (`scrollWidth==clientWidth`), tsc `npx tsc --noEmit` == 0.
- Hover-Animationen prüfbar via `eval` (dispatch mouseover / Klasse setzen) + Screenshot.

## 4. DIE FONT-/LOGO-ENTSCHEIDUNG (dein Hauptthema)

Thomas hat das echte Logo geliefert: `~/Desktop/redrabbitmedialogo.ai`
(ist ein PDF; rendern mit `pdftoppm -png -r 200 -f 1 -l 1 <ai> <out>`).
Referenz-Render liegt im Repo: `docs/handoffs/assets/real-logo-redrabbitmedia.png`.

**Befund (wichtig):** Das echte Marken-Wortbild „red rabbit media" ist ein
**fetter, geometrischer Sans-Serif**, **nebeneinander** (einzeilig „red rabbit",
darunter „media"), in **Schwarz** (klein #222222 / groß #000000), Mark in Pantone
1788 C (unser Rot). Doppelstöckiges „a", runde geometrische Formen.

**Widerspruch zum aktuellen Stand:** Die Hero-Wortmarke nutzt aktuell **Fraunces
(Serif), gestapelt (2 Zeilen), in Rot** — das passt NICHT zum echten Logo. Genau
darum ist Thomas bei Fraunces unsicher.

**Was Thomas will:** (a) „red rabbit" nebeneinander vs. gestapelt entscheiden,
(b) evtl. den echten Logo-Font verwenden (der dann wie jetzt zerfällt),
(c) beides als Vergleich im Design-System / DESIGN.md, damit er wählen kann.

**Deine Aufgabe (Design-System-Seite):**
1. Neue Sektion „Wortmarke · Font-Vergleich" auf `/design-system`:
   - das echte Logo (Bild-Referenz oben) zeigen,
   - „red rabbit" gerendert in Kandidaten-Fonts nebeneinander: aktueller Stand
     (Fraunces, Serif) vs. geometrische Sans-Kandidaten. Freie Google-Fonts, die
     dem Logo nahekommen: **Poppins**, **Montserrat**, **DM Sans**, evtl.
     **Plus Jakarta Sans** / **Manrope**. Jeweils in Bold/Black, einzeilig UND
     zweizeilig, in Schwarz und in Rot, damit Thomas vergleichen kann.
   - Empfehlung: den nächstliegenden Kandidaten markieren.
2. Höchste Treue-Option dokumentieren: „red rabbit" im Logo ist **vektorisiert
   (Outlines, kein eingebetteter Font)**. Der exakteste Weg wäre, die Outlines aus
   der .ai zu **tracen** (wie damals `RabbitMark` via potrace) und als definitive
   Wortmarke zu nutzen. Das ist die brand-treueste Lösung, aber aufwändiger.
3. **Font-Swap in der Hero-Animation NICHT selbst bauen** — nur die Specimens/
   Empfehlung liefern. Der Swap betrifft `lib/relaunch/morph/pieces.ts`
   (Clip-Rects sind Fraunces-spezifisch, müssen pro Font neu getunt werden) und
   bleibt bei der Hero-Session, sobald Thomas den Font gewählt hat.

## 5. Offene Entscheidungen (warten auf Thomas)

- Font: Fraunces-Serif behalten ODER auf Logo-Sans wechseln; nebeneinander vs. gestapelt.
- Buttons/Cards/Toggle (Sektionen 09-12): Ja/Nein je Sektion + welche Farb-/Stil-Variante.
- Toggle-Look: aktuell 1:1 die Vorlage (Hebel-Knopf, wirkt im Ruhezustand wie ein
  Pin). Ggf. konventionelleren Toggle anbieten.
- „Was noch fehlt" (Sektion 08): Form-Inputs, Cards (Standard), Accordion/FAQ,
  Badges, Tooltip, Modal — auf Thomas-OK bauen.

## 6. Was diese (Hero-)Session parallel macht (nicht doppeln)

Hero/Morph-Feinschliff in `HomeMorph.tsx`: Wortmarken-Größe, Statement-Zentrierung,
Fade-/Aufstiegs-Reihenfolge des Hasenkopfs, Positionierung. Wenn du dort etwas
brauchst, hier vermerken / an die Hero-Session melden, nicht selbst editieren.
