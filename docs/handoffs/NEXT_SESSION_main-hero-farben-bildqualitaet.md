# Hero-Farbrotation + Bildinhalt — ABGESCHLOSSEN (2026-06-28)

## Status: FERTIG + live verifiziert (commits c3ee35e, 66c6464)

Thomas' drei Wuensche umgesetzt, mit QA + echtem VPS-Render bewiesen.

### 1. Hero-Farbrotation (Gelb -> Gruen -> Blau -> Orange -> Rot)
- `HERO_GRADIENTS` in `image.ts` auf 5 Farben in dieser Reihenfolge (Blau = die bewaehrte turquoise->blau-Hero).
- **Bug 1 behoben:** `pickHeroColorIndex` nutzte `heroes.length % N`, aber `recordMotif` kappt `heroes` auf 12 -> `12 % 4 = 0` dauerhaft fix. Jetzt dedizierter UNBEGRENZTER `colorCursor` (advance-on-pick, idempotent via gemini-meta.json-Pin).
- **Bug 2 behoben (versteckt):** der VPS-Flow `run-media.ts` committete `recent-image-motifs.json` NICHT -> Cursor-Fortschritt ging bei jedem `git reset --hard` verloren. Jetzt im git-add aufgenommen.
- Hook-Tinte passt sich der Helligkeit der linken Verlaufsfarbe an (dunkles Espresso-Braun auf Gelb/Orange, creme sonst) — alle 5 verifiziert.

### 2. Infografik-Stil
- Unveraendert (lokale SVG `sketchInfographic`). Nicht angefasst.

### 3. Bildinhalt realistisch statt surreal
- Klarstellung Thomas: nicht Pixel-Schaerfe, sondern der INHALT (KI-Bilder wirkten surreal/unlogisch, z.B. Lego+Multitool+Loeffel-Stillleben).
- Art-Director-Prompt (`buildImagePlan`) + `BRAND_PHOTO_STYLE`: harte REALISMUS-PFLICHT, abstrakte Objekt-Stillleben verboten, reale Szenen mit Menschen Pflicht.
- Verifiziert am selben Artikel: Lego-Stillleben -> Beratungsgespraech / Entwickler am Monitor / Cafe-Besitzerin.

## QA + Live
- VPS-Render vor Push: turquoise (alte Palette, da VPS `build-image-plan.ts` den Gradient aus seiner committeten `image.ts` ableitet). Nach Push: VPS baut "yellow #F7C948" -> gelber Hero gerendert + verifiziert.
- Live-Artikel `welches-system-...` neu bebildert (gelb + realistisch), eingebettet, gepusht (66c6464).
- Naechster automatischer Tagesartikel startet bei Gelb (colorCursor 0) und rotiert weiter.

## Wichtigste Lektion (siehe LESSONS_LEARNED 2026-06-28)
Die Bild-PALETTE propagiert nur ueber git auf den VPS (nicht ueber den geshippten Plan) — `generate-images-gemini.sh:100` ruft `build-image-plan.ts` auf dem VPS auf, das den Gradient aus der VPS-`image.ts` ableitet. Jeder Zustand, der vor `git reset --hard` steht und ueberleben muss, MUSS committet werden.
