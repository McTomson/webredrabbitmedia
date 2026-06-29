# Naechste Session — Daily-Pipeline / Medien (Stand 2026-06-29)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, LESSONS_LEARNED.md, Memory `reference_redrabbit_daily_mail_hang_fix` + `reference_vps_redrabbit_media_setup`, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Render). Bei Unsicherheit: fragen oder fail-closed.
- Erst Plan, dann ausfuehren. Laufend testen + QA. Nichts als „fertig" ohne live-verifiziertes Ergebnis.
- Bei langen Render-/Hintergrund-Laeufen alle ~15 Min Health-Check. Push nach main nur mit OK.
- KEINE Extra-/API-Kosten (Bilder gratis Gemini auf VPS, Plan via claude-Abo, kein Anthropic-Key am VPS).

## Stand dieser Session (alles erledigt + live)
- **Heutiger Artikel `was-sind-die-vorteile-von-modernen-frameworks-wie-next` komplett live** (Text, gelber Hero, 3 realistische Kontextbilder, Infografik, Podcast, Video YouTube `LxP6E8-5bqo` + selbst-gehostet). Commits bis `cfa6bef`. Keine offenen Marker.
- **Behoben (commit 82045b7):** Zeitzonen-Marker-Bug — nachts (00:00-02:00 CEST) freigegebene Artikel bekamen nie Medien, weil `approve/route.ts` (Vercel=UTC) `requestedAt` als UTC-Datum schrieb, der media-checker (Mac) aber gegen lokale Zeit vergleicht. Jetzt Wien-Datum. + VPS-Render-Poll 12->25 Min (flaky ctx-Bild brauchte ~19 Min, alter Timeout loeste Mac-ueberlastenden lokalen Fallback aus).
- **Bestaetigt (commits gestern c3ee35e/66c6464):** Hero-Farbrotation laeuft produktiv. `colorCursor` committet = **1** -> der NAECHSTE Tagesartikel muss **gruen** sein (Reihenfolge Gelb->Gruen->Blau->Orange->Rot). Realismus-Regel im Art-Director liefert reale Szenen statt surrealem Stillleben.

## Was beim naechsten Tageslauf zu pruefen ist
1. **Naechster Artikel = gruener Hero?** (Rotation produktiv beobachten.) Falls wieder gelb: `colorCursor` im committeten `content-engine/knowledge/recent-image-motifs.json` pruefen + ob `run-media.ts` ihn mit-committet.
2. **Wenn ein Artikel KEINE Bilder hat** (Hero live 404): zuerst `cat content-engine/.media-requests/<slug>.json` -> stimmt `requestedAt` mit `date +%F`? Der Zeitzonen-Fix sollte das ab jetzt verhindern; falls doch wieder daneben -> Marker-Datum korrigieren + Medien manuell nachziehen (Rezept in LESSONS 2026-06-29).
3. **Bei „VPS-Render Timeout":** NICHT sofort lokal fallbacken — `ssh ionos "tail /home/redrabbit/logs/genimg.out"` + `pgrep generate-images` am VPS; laeuft er noch, warten. Lokalen Render killen (Eltern zuerst), VPS fertig rendern lassen.

## Offen / kein Stress
- Keine kritischen offenen Punkte. Der noch aus 18.06 stammende TODO „Vercel npm install -> npm ci" (docs/OPERATIONS_RUNBOOK.md §4) ist unabhaengig und optional.
