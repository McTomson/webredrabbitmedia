# Hero-Session TODO — Wortmarken-Font-Swap auf DM Sans

Von: Design-System-Session. Stand: 2026-07-06.
Zweck: Thomas hat die Wortmarke final entschieden. Der Swap in der Hero-Animation
betrifft `pieces.ts` / `HomeMorph` und bleibt bei euch (Hero-Session). Diese Notiz
ist der genaue Auftrag. Die verbindliche Spec steht in `DESIGN.md` §3 + §3.1.

## Entscheidung (final, Tomson 2026-07-06)

- **Font:** DM Sans, **Bold (700)** — ersetzt Fraunces in der Wortmarke UND in allen Ueberschriften.
- **Anordnung:** "red rabbit" **nebeneinander, eine Zeile** (NICHT mehr gestapelt/zweizeilig).
  **Klarer** Wort-Abstand zwischen "red" und "rabbit" (~0.9em bei Display-Groesse — kleiner liest
  sich als ein Wort "redrabbit", das hat Thomas ausdruecklich abgelehnt). "media" faellt weg.
- **Gewicht:** beide Woerter gleich fett (kein duennes "rabbit").
- **Farbe:** Wortmarke **komplett rot** (`--rr-red`). **Kein** einzelner andersfarbiger Buchstabe
  in der Wortmarke (wurde als "Kinderschokolade" verworfen). Der EINE Navy-Teil bleibt ausschliesslich
  in den Szenen-Formationen, nie in der Wortmarke.
- **Hase:** eigenstaendig, immer rot, im Hero **ueber** der Wortmarke (nicht links angedockt).

## Konkrete Aenderungen bei euch

1. **`lib/relaunch/fonts.ts`** — DM Sans laden (next/font/google, weight 700, evtl. 400/500 fuer UI),
   Variable z.B. `--font-dmsans`.
2. **`app/styleguide/styleguide.css`** — erst NACH dem Swap `--rr-font-display` von Fraunces auf
   `var(--font-dmsans)` umstellen (sonst brechen die display-type-Rollen / der Morph auseinander).
   `font-variation-settings: "opsz" 144 ...` in den `.rr-display-*`-Rollen entfernen (DM Sans hat
   diese Fraunces-Achsen nicht). Design-System-Session kann diesen CSS-Teil uebernehmen, sobald ihr
   das Signal gebt — bitte kurz abstimmen, damit wir uns nicht in styleguide.css ueberschreiben.
3. **`lib/relaunch/morph/pieces.ts`** — die `PIECES`-Clip-Rects sind Fraunces-glyph-spezifisch
   ("Naturbruch-Regel", Schnitt nur an den duennsten Stellen). Fuer die DM-Sans-Glyphen `r/e/d/a/b/i/t`
   neu vermessen/tunen. DM Sans ist geometrischer/gleichmaessiger als Fraunces, die Gelenke sitzen anders.
4. **`lib/relaunch/morph/*` `buildWordLayout()`** — von zwei Zeilen ("red" ueber "rabbit", ~11% Indent)
   auf **eine Zeile** "red rabbit" mit Wort-Abstand umstellen. Hero-Choreo/Reassembly entsprechend
   auf die einzeilige Geometrie anpassen.
5. **Fracture-Farbe:** alle Wortmarken-Scherben rot lassen (kein Navy-Teil in der Wortmarke).

## Visuelle Referenz (was Thomas abgesegnet hat)

Interaktiver finaler Hero-Nachbau (DM Sans Bold, nebeneinander, rot, Hase drueber, mit Auflösen):
Artifact-Serie der Design-System-Session (Font-Vergleich, Auflösen-Labor, 4 Finalisten, Hero-Mock).
Das Ergebnis: "red rabbit" eine Zeile, DM Sans Bold, komplett rot, Hase eigenstaendig darueber.

## Abnahmekriterium: Harmonie bleibt (Tomson 2026-07-06)

Der aktuelle Effekt (Buchstaben fliegen weg, die naechsten kommen rein) gefaellt Thomas
ausdruecklich gut und **muss genauso harmonisch bleiben**. Der Font-Swap darf das Timing/Gefuehl
nicht verschlechtern. Nach dem DM-Sans-Tuning gegen den Ist-Zustand gegenpruefen: gleicher
weicher Fluss, keine harten Spruenge, gleiches Master-Easing. Erst dann ist der Swap fertig.

## Warnung

Nicht `--rr-font-display` flippen, bevor `pieces.ts` + `buildWordLayout` auf DM Sans getunt sind —
sonst rendert der Morph mit falscher Geometrie. Reihenfolge: fonts.ts -> pieces/layout -> dann Token.
