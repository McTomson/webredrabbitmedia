# Naechste Session — Hero-Farbrotation + Bildqualitaet (2026-06-28)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, LESSONS_LEARNED.md, Memory `reference_vps_redrabbit_media_setup`, die betroffenen Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/Browser/Render). Bei Unsicherheit: fragen oder fail-closed.
- Erst Plan (TodoWrite), dann ausfuehren. Skills + parallele Sub-Agenten nutzen wo sinnvoll.
- Laufend testen + QA. Nichts als „fertig" melden ohne verifiziertes (live angeschautes) Ergebnis.
- Bei langen Render-Laeufen alle ~15 Min Health-Check.
- **Thomas: KEINE Extra-/API-Kosten.** Bilder via gratis Gemini, Plan via claude-Abo. Kein Anthropic-Key auf den VPS.
- **Bilder rendern laeuft auf dem VPS** (siehe `render_images_via_vps` in run-media-check.sh + Memory). Zum Testen einzelner Heros: Plan lokal bauen, zum VPS shippen, `genimg.sh <slug> --render-only`, PNG zurueckholen, anschauen. Genauer Ablauf unten.

## Ziel (3 Wuensche von Thomas, 28.06)
1. **Hero-Hintergrundfarbe rotieren** — aktuell faktisch immer Blau/Violett. Gewuenschte Rotation: **Gelb → Gruen → Blau → Orange → Rot**, im SELBEN Stil wie jetzt (Farbverlauf links→rechts + handschriftlicher Hook oben-links, Subjekt im Vordergrund unveraendert).
2. **Infografik-Stil beibehalten** — Thomas mag den aktuellen Infografik-Stil (Creme-Hintergrund, handgezeichnete Boxen, gruene/rote Kreise, schwarze Faustregel-Leiste). Das ist die LOKALE SVG (`renderInfographik` in image.ts) — NICHT aendern, nur sicherstellen dass sie weiter so genutzt wird.
3. **Bildqualitaet** — Thomas findet die (Kontext-)Bilder werden schlechter. Ursache + Fix untersuchen.

## Diagnose (in DIESER Session bereits gemacht — verifiziert)
### Farbrotation ist KAPUTT
- Palette `HERO_GRADIENTS` in `scripts/content-engine/image.ts:41` hat 4 Farben: turquoise-blue, teal-green, golden-yellow-amber, soft-violet-indigo. KEIN Orange, KEIN Rot.
- `pickHeroColorIndex()` (image.ts:55) = `readMotifLog().heroes.length % 4`. Rotiert NUR wenn der Motif-Log waechst.
- **Bug:** Der neue Headless-Flow (`media/build-image-plan.ts` + `media/apply-images-browser.ts`) ruft `recordMotif()` NICHT auf (grep = 0 in beiden). Der Motif-Log `content-engine/knowledge/recent-image-motifs.json` steht bei **12 heroes** → Index = `12 % 4 = 0` = turquoise-blue, dauerhaft fix. (Frueher wuchs der Log via einen separaten finalize-Schritt; im neuen Flow fehlt das.)
- `recordMotif()` ist in image.ts:93 definiert, wird aber nur im ALTEN Pfad (image.ts:138, generatePhoto/pipeline) aufgerufen.

### Bildqualitaet
- `media/decode-img.cjs:53`: `.resize(1200, null, { withoutEnlargement: false })` — skaliert Geminis 1024px-Output auf 1200px HOCH → Interpolations-Unschaerfe. png quality 90, compressionLevel 9.
- Konstant (kein „Verfall"), aber ein realer Schaerfe-Verlust. Geminis Roh-Output selbst kann auch schwanken.

## Konkrete Schritte
### A. Farbrotation fixen + Palette erweitern
1. `image.ts` HERO_GRADIENTS auf die 5 Wunschfarben in Reihenfolge setzen: **gelb, gruen, blau, orange, rot** — passende Hex je links/rechts im bestehenden warm-freundlichen Verlaufs-Stil waehlen (z.B. gelb #F7C948→#E8951C, gruen #13B5A6→#1F9E5A, blau #19B5AE→#2E6FD2, orange #FF9E40→#F2660A, rot #F2585B→#D32F3A — QA-pruefen!).
2. **Motif-Log im neuen Flow wachsen lassen:** `recordMotif()` nach erfolgreichem Einbetten aufrufen — am sinnvollsten in `apply-images-browser.ts` (am Ende, wenn Hero+ctx eingebettet sind), ODER in `build-image-plan.ts` direkt nach dem Pinnen von colorIdx (Achtung Idempotenz bei Reruns: nur EINMAL pro Artikel zaehlen — am besten an die `gemini-meta.json`-Existenz koppeln, die schon „einmal pro Artikel" markiert). Wichtig: build-image-plan laeuft auf dem MAC (claude-Abo) — dort ist image.ts/recordMotif verfuegbar.
3. **Ink-Kontrast pruefen:** `heroStyleWithHook` (build-image-plan.ts:45) leitet die Hook-Tinte aus der Luminanz der LINKEN Verlaufsfarbe ab (creme-weiss auf dunkel, Espresso-Braun auf hell). Bei Gelb/Orange (hell) muss dunkle Tinte kommen, bei Rot/Blau/Gruen (mittel-dunkel) creme. QA: Hook muss auf JEDER der 5 Farben in 1-2s lesbar sein.

### B. Bildqualitaet
1. Schnell-Fix testen: `withoutEnlargement: true` (kein Hochskalieren — 1024px bleibt nativ, keine Upscale-Unschaerfe). Trade-off: Bild dann 1024 statt 1200 breit (Display etwas kleiner). Alt vs neu vergleichen.
2. Pruefen ob Gemini/Nano-Banana groesseren Output kann (Prompt „high resolution"/Seitenverhaeltnis) — sonst ist 1024 das Maximum und Upscaling der einzige Weg auf 1200.
3. Kontextfoto-Prompts (image.ts HERO_PHOTO_STYLE / build-image-plan Kontext) auf „sharp, high detail" pruefen. Alt-Artikel-Bilder mit neuen vergleichen, um „Verfall" zu objektivieren (evtl. subjektiv/Komposition statt Pixel).

### C. QA (PFLICHT, live anschauen)
- Pro Farbe EINEN Test-Hero rendern (VPS) und anschauen: stimmt die Farbe? Ist der Hook lesbar? 5 Farben = ~5 Renders.
- Test-Render eines Heros (Beispiel): Plan bauen `npx tsx scripts/content-engine/media/build-image-plan.ts <slug>` (setzt colorIdx aus Motif-Log — zum gezielten Testen einer Farbe ggf. Motif-Log temporaer setzen ODER eine Test-Override fuer colorIdx einbauen), Staging zum VPS (tar/ssh, siehe render_images_via_vps), `genimg.sh <slug> --render-only`, hero.png via tar zurueck, mit Read anschauen.
- NICHT live schalten bevor alle 5 Farben + Hook-Kontrast geprueft sind.

## Relevante Dateien
- `scripts/content-engine/image.ts` — HERO_GRADIENTS, pickHeroColorIndex, recordMotif, readMotifLog, HERO_PHOTO_STYLE, renderInfographik.
- `scripts/content-engine/media/build-image-plan.ts` — colorIdx-Pinning (Zeile ~100-117), heroStyleWithHook (Ink-Kontrast).
- `scripts/content-engine/media/apply-images-browser.ts` — Einbetten (guter Ort fuer recordMotif).
- `scripts/content-engine/media/decode-img.cjs` — Resize/Qualitaet.
- `content-engine/knowledge/recent-image-motifs.json` — der Motif-Log (steht bei 12).
- VPS-Render: `render_images_via_vps` in `scripts/content-engine/trigger/run-media-check.sh`; Launcher `/home/redrabbit/bin/genimg.sh <slug> --render-only`.

## Stand des Systems (alles live + ok, NICHT kaputt machen)
- VPS-Bild-Automatisierung laeuft (28.06 erster Echtlauf erfolgreich: „VPS rendert..."). Mac plant, VPS rendert, Mac bettet ein, Fallback lokal. 0 API-Kosten.
- Heutiger Artikel `welches-system-ist-das-beste-fuer-eine-firmenwebsite` komplett live (Bilder+Podcast+Video).
- Commits bis `d5fe78a`. Bot-Jobs aktiv. Repos sauber+synchron.
