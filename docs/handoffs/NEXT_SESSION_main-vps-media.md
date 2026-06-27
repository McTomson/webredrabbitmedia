# VPS-Medien-Migration — ABGESCHLOSSEN (Stand 2026-06-27/28)

## Status: FERTIG + live verifiziert
Die schwere Gemini-Browser-Bildlast laeuft jetzt headless auf dem IONOS-VPS; der Mac wird davon nie
mehr ueberlastet. Erster Artikel komplett VPS-bebildert + live. **0 API-Kosten** (Bilder via gratis
Gemini, Plan gecacht/Mac-Abo; kein claude/Anthropic-Key auf dem VPS).

## Architektur (live)
- **Mac = Text + Plan + Podcast/Video + Einbetten.** `run-media-check.sh` baut den Art-Director-Plan
  (`build-image-plan.ts`, claude-Abo, leicht), delegiert das RENDERN an den VPS, holt die PNGs zurueck
  und bettet lokal ein (`apply-images-browser.ts`, browser-frei). Podcast/Video via notebooklm-py CLI.
- **VPS = nur Bild-Rendern.** `genimg.sh <slug> --render-only` -> `generate-images-gemini.sh` rendert
  die 4 PNGs headless via Gemini (Nano-Banana-2) und legt sie in Staging (kein apply). Launcher
  selbst-bereinigend. Lauf via `setsid` (NIE nohup — stirbt mit SSH).
- **Fallback:** schlaegt die VPS-Delegation an irgendeiner Stelle fehl (VPS down, Render-Fehler), faellt
  `run-media-check.sh` automatisch auf lokales Rendern zurueck (Meltdown-Fixes greifen) -> nie Totalausfall.

## Commits (alle auf main)
- `f820e75` generate-images: `--render-only` + Reload-Loop (Phase 2 laedt Konversation mehrfach neu, je
  ~14s-Fenster vor dem /glic-Hijack) + 5 Retries (Hero-Generierung flaky).
- `757dc4d` run-media-check: `render_images_via_vps` (Mac plant, VPS rendert, Mac bettet ein) + Fallback.
- Frueher: `8ecbbab` (7 Headless/Linux-Bugfixes), `9c00285`/`0bb51f0` (heutiger Artikel Bilder+Podcast+Video).
Details: `LESSONS_LEARNED.md` (2x Eintrag 2026-06-27).

## Schluessel-Erkenntnis (falls Bilder mal scheitern)
Headless Gemini entfuehrt die Seite ~14s nach Submit zu `/glic` (0-Breite-Body, keine `<img>`). Das Bild
bleibt server-seitig in `/app/<id>`. Loesung im Code: ID merken -> settle -> Konversation in FRISCHER
Session mehrfach neu laden -> blob-Bild extrahieren. Bei Re-Login: VNC-Methode (Memory
`reference_vps_redrabbit_media_setup`). Hero ist das Sorgenkind (komplexer Prompt) -> mehr Retries.

## Offen (klein, kein Stress)
- 2 stale Marker (`wie-lange-dauert...`, `was-muss-vorbereitet...`, requestedAt non-today) — vom Checker
  ohnehin ignoriert; bei Gelegenheit `git rm` + Artikel-Medien-Vollstaendigkeit pruefen.
- Beim ERSTEN echten Tageslauf zuschauen, dass die VPS-Delegation greift (Log: „VPS rendert..." vs
  „LOKALER Fallback"). Health-Check/Heartbeat unveraendert aktiv.
- VPS-Test-Reste in `/home/redrabbit/bin/` (probe*.sh, gtest.sh) sind harmlos.
