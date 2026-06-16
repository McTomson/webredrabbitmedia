# Nächste Session — Red Rabbit Content-Engine / Medien (Stand 2026-06-16 spät)

## Arbeitsregeln (verbindlich)
- Lies ZUERST: diesen Handoff, CLAUDE.md, LESSONS_LEARNED.md, `content-engine/knowledge/media-notes.md`,
  `.agent/workflows/bilder-gemini-browser.md`, und die globalen Memories
  [[feedback_medien_flow_immer_automatisch]], [[reference_redrabbit_daily_mail_hang_fix]],
  [[reference_redrabbit_media_produktion_runbook]]. Nicht ohne Kontext loslegen.
- **NIE raten — immer verifizieren** (Code/DB/Browser/Docs). Bei Unsicherheit fragen oder fail-closed.
- **MEDIEN-FLOW IMMER AUTOMATISCH (Thomas-Dauerregel 16.06):** nach Freigabe den GANZEN Flow durchziehen
  (Bilder → Podcast → Video → YouTube-public → Substack-Draft), **NICHT bei jedem Schritt fragen**. Nur bei
  echtem Fehler/Hang melden. YouTube=public auto, Substack=Draft (Thomas publisht final).
- Autonom handeln, voller Browser-Zugang. Lange Browser-Läufe: nicht in Schleifen kämpfen (Runbook-Lessons).
- Alle launchd-Bot-Jobs laufen aus dem Worktree `~/dev/redrabbit-daily` (immer main) — NIE `~/dev/redrabbit`.

## OFFEN — als Erstes: Medien für den heutigen Artikel fertigstellen
**Artikel:** `was-kostet-eine-massgeschneiderte-e-commerce-website` (status: published, von Thomas freigegeben).
**Bilder sind FERTIG + live** (Hero gelb mit Hook + Infografik Preis-Treppe + 3 Kontextfotos, alle gepusht).
**Es fehlen NOCH: Podcast + Video + Substack-Draft.** Automatisch durchziehen (Runbook media-notes.md):
1. NotebookLM (Tab eingeloggt als t.uhlir@immo.red / authuser=3): **1 NEUES Notebook** für diesen Artikel,
   NUR diesen Artikel als Quelle (URL
   `https://web.redrabbit.media/tipps/was-kostet-eine-massgeschneiderte-e-commerce-website` oder Text-Paste).
   Audio Overview + Video Overview **deutsch** generieren (Audio 2-10 Min, Video länger, ~30s pollen; bei
   Video-Hang frisches Notebook).
2. Podcast (m4a) + Video (mp4) herunterladen.
3. `npx tsx scripts/content-engine/media/run-media.ts --slug was-kostet-eine-massgeschneiderte-e-commerce-website
   --podcast <m4a> --video <mp4>` → bettet `<SimpleAudioPlayer>` ein, lädt Video **public** auf YouTube
   (venv `~/.config/redrabbit-youtube/`), bettet `<VideoEmbed>` ein, commit/push, Mail, Marker gelöscht.
4. Substack-Draft (Teaser+Link, kein Voll-Text wegen Kannibalisierung; Rubrik Pflicht). Bleibt Draft.
- NotebookLM-MCP ist `authenticated:false` (headless) → Browser-Weg. Marker:
  `content-engine/.media-requests/was-kostet-...json` (status requested) — nach Fertigstellung löschen.
- Codex-Bilder-Fallback ist tot (Limit bis ~14.07) → künftige Artikel-Bilder via Gemini-Browser.

## ERLEDIGT diese Session (16.06) — alles committet+gepusht (main)
- **Daily-Mail dauerhaft gefixt:** Ursache war `git checkout main` im geteilten Checkout auf dirty Feature-
  Branch. Fix: Bot-Worktree `~/dev/redrabbit-daily` (immer main) + run-daily self-locating + `reset --hard`
  + RunAtLoad + `caffeinate` + `pmset repeat wakeorpoweron 07:48`. Verifiziert (Artikel+Mail+Freigabe live).
- **Media-Checker-Fix:** lief auf falschem Branch + kaputter JSON-Parser → freigegebene Artikel bekamen nie
  Medien. Self-locating + ff-merge + node JSON.parse. Auch run-remind gefixt (gleiche Bug-Klasse).
- **Bild-Variations-System** in der Engine (`image.ts`): inhaltsgetrieben, Archetypen rotieren (max 1× Laptop),
  Verlauf-Farbe + Infografik-Format rotieren, Wiederhol-Sperre (`recent-image-motifs.json`). + Runbook + Lessons.
- **Heutiger Artikel:** alle Bilder live (gelber Hero, Infografik, 3 Kontextfotos).
- **Medien-Flow-Dauerregel** in CLAUDE.md/media-notes.md verankert (automatisch, nicht fragen).
- Außerhalb redrabbit (globale Memory): thermewarten.at-Backlink live (world4you-Konto 50137300 TXT),
  lashesbydanesh-Recovery — siehe globalen Handoff NEXT_SESSION_redrabbit_backlinks.md.

## Relevante Befehle/Pfade
- Worktree: `~/dev/redrabbit-daily` (bot, main). Mensch: `~/dev/redrabbit` (Feature-Branches).
- launchd: com.redrabbit.contentengine / .mediachecker / .reminder (alle plists → Worktree-Pfad).
- Triage „keine Tagesmail": Tageslog `scripts/content-engine/.work/daily-$(date +%F).log` ERSTE Fehlerzeile.
