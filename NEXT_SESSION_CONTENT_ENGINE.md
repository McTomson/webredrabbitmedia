# NEXT SESSION — Content-Engine (Stand 2026-06-05)

Lies zuerst: `MEMORY.md` (Abschnitt "Content-Engine Stand 2026-06-05"), `LESSONS_LEARNED.md`
(2026-06-05), und `~/.claude/projects/-Users-McTomson/memory/project_redrabbit_content_engine.md`.
Arbeitsverzeichnis: `~/dev/redrabbit`. Branch `feat/content-engine` == `main` (beide aktuell, gepusht).

## Was schon LIVE ist (nicht neu bauen)
- Wartungsvertrag-Artikel (`/tipps/website-wartungsvertrag-sinnvoll`): 5 Bilder + 22-Min-Podcast, live.
- Taegliche Review-Email: funktioniert echt (Gmail-SMTP `thomas.uhlir@gmail.com` -> `t.uhlir@immo.red`),
  1-Klick Freigeben/Ablehnen scharf. `POST /api/review-notify` (Bearer ADMIN_API_TOKEN aus `.env.local`).
- Taegliche Automatik: launchd `com.redrabbit.contentengine` installiert + geladen.
- Vercel-Stau geloest (`-9000` Git getrennt). Deploy = `git push origin main`.
- KI-Hinweis-Satz aus allen Artikeln + Engine entfernt (User-Wunsch, dauerhaft).

## HAUPTZIEL naechste Session (User-Wortlaut)
"dass du sowohl auf substack als auch auf youtube den artikel hochladen kannst" — **nur den ersten
Artikel (Wartungsvertrag) als Test.** Also: end-to-end Upload-Faehigkeit fuer beide Kanaele beweisen.

### 1. Video -> YouTube @RedRabbitLab
- NotebookLM-Notebook `696aae82-321b-4a09-b148-03beeee084bd` (User-Chrome, authuser=3) hat evtl. schon
  eine Video-Overview (Studio, "Website-Wartung..."). Sonst neu generieren (Studio -> "Video").
- Herunterladen (Studio-Eintrag 3-Punkte -> Herunterladen) -> landet in `~/Downloads`.
- YouTube-Upload zunaechst **UNLISTED** (oeffentlich = explizite Freigabe-Pflicht; User prueft erst).
- Titel-Stil wie sein Vorbild: z.B. "Website-Wartungsvertrag: sinnvoll oder Abzocke? (Oesterreich 2026)".
- Beschreibung = kurze Artikel-Zusammenfassung + am ENDE der Backlink-Block (siehe unten).
- Nach User-OK: oeffentlich schalten + Video auf der Artikelseite einbetten.

### 2. Podcast/Artikel -> Substack @RedRabbitLab (redrabbitlab.substack.com)
- Neue Episode/Post wie seine bestehenden (voller Artikel + Audio + FAQ), ZUSAETZLICH der Backlink-Satz
  + Block. (Seine bisherigen Substack-Posts haben den Backlink noch nicht.)

### 3. BACKLINK-BLOCK (ans Ende JEDER Beschreibung, SEO-Ziel) — exakt dieses Muster vom User:
```
mehr infos unter:
https://web.redrabbit.media/tipps/website-wartungsvertrag-sinnvoll
https://web.redrabbit.media
https://redrabbit.media
```

## Weitere offene Punkte (mit User abstimmen)
- **Automatik-Selbstwecken (Option A):** `pmset repeat wakeorpoweron MTWRFSU 09:15:00` einrichten, damit
  der Mac sich weckt und der 09:17-Job laeuft. User-OK: "nur Computer an, kein Terminal offen" — das passt,
  launchd braucht kein Terminal. Server-Variante (B) nur falls Mac oft KOMPLETT aus (bricht 0-Euro-Modell).
- **Bild-Stil verfeinern:** User ist mit den aktuellen Bildern noch nicht 100% zufrieden. Vor weiteren
  Auto-Artikeln Stil-Richtung klaeren, dann regenerieren (`images-only.ts <slug>`).
- **Steuer (#12) + BFSG (#266):** Text approved-Stil + je 5 Bilder (verschoben).
- **Test-Lauf Automatik:** optional `run-daily.sh` ueberwacht laufen lassen (erzeugt #53), um die Kette
  end-to-end zu beweisen. ACHTUNG: erzeugt echten Entwurf + Mail + Push.

## Werkzeuge / Befehle
- Bilder auf bestehenden Artikel: `node_modules/.bin/tsx scripts/content-engine/images-only.ts <slug>`
- Voller Artikel: `node_modules/.bin/tsx scripts/content-engine/pipeline.ts <id|--next> --emit [--reuse-research] [--no-image]`
- Email-Vorschau rendern: `... render-email-preview.ts <slug> <out.html>`
- Review-Mail senden: `curl -X POST .../api/review-notify -H "Authorization: Bearer <ADMIN_API_TOKEN>" -d '{"slug":"..."}'`
- codex-Bild: pinnt `-m gpt-5.4`, Timeout 600s (in `image.ts`).
- Deploy: `git push origin main` (Auto-Deploy echtes Projekt; `-9000` ist getrennt).
- Automatik aus: `launchctl unload ~/Library/LaunchAgents/com.redrabbit.contentengine.plist`

## Harte Regeln
0-Euro ueber die Abos. KEIN Gedankenstrich "–". KEIN KI-Hinweis in Artikeln. Bild-Dateinamen versionieren.
Vor Browser-`cmd+v` frisch `pbcopy` + per Screenshot pruefen. Oeffentlich posten/hochladen = erst Freigabe.
Niemals raten, immer testen/verifizieren.
