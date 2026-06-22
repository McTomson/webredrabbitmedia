# Naechste Session — main / content-engine media — Stand 2026-06-22 (Teil 2 FERTIG + live verifiziert)

## TL;DR — Gemini-Bilder voll headless laeuft
Die naechtliche Bilderzeugung ist jetzt **voll automatisch ueber Gemini headless** (Ersatz fuer den toten Codex). Heute end-to-end verifiziert: agent-browser bleibt ueber das persistente Profil bei Gemini eingeloggt (kein Fenster, keine Claude-Session), Hero MIT handschriftlichem Hook + 3 Kontextfotos + Infografik werden erzeugt und eingebettet. In `run-media-check.sh` verdrahtet. Commits bis `26cf5d5`. **Einzige laufende Wartung:** wenn Google das Gemini-Login irgendwann ausloggt, feuert der Hero-Guard (Notification „Bilder fehlen") + das needs-images-Netz haelt den Bildschritt offen → einmal `scripts/content-engine/media/generate-images-gemini.sh login` neu einloggen (Konto t.uhlir@immo.red).

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, `content-engine/knowledge/media-notes.md`, `.agent/workflows/bilder-gemini-browser.md`, CLAUDE.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite/TaskCreate), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, kein Eingeben von Google-Credentials, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.

## Repo / Umgebung (KRITISCH)
- Arbeits-Repo = **Bot-Worktree `~/dev/redrabbit-daily`** (immer `main`). NIE `~/dev/redrabbit`. Vercel deployt nach Push auf main. Live = `https://web.redrabbit.media`, Artikel `/tipps/<slug>`.
- **Konten:** NotebookLM + Gemini = `t.uhlir@immo.red`. **Gemini-Browser-Index: `https://gemini.google.com/u/3/app`** (bare `/app` = falsches gmail-Konto). YouTube via OAuth-Token. Substack = redrabbitlab.substack.com.
- **`claude`/`grep`-FALLE (22.06 ENDGUELTIG ROOT-CAUSED):** Der Shell-Snapshot definiert `grep` als FUNKTION, die grep via `$CLAUDE_CODE_EXECPATH` als `ugrep` ausfuehrt. Zeigt diese Var auf den kaputten 500-Byte nvm-`claude.exe`-Stub, spammt JEDES `grep` "native binary not installed" in den Output. FIX (gemacht): nvm-Stub → Symlink auf echte Homebrew-claude.exe (`ln -sf /opt/homebrew/lib/node_modules/@anthropic-ai/claude-code/bin/claude.exe ~/.nvm/versions/node/v20.20.0/lib/node_modules/@anthropic-ai/claude-code/bin/claude.exe`). Bei Wiederkehr (Auto-Update) erneut symlinken. Diagnose: `type grep`, `file $CLAUDE_CODE_EXECPATH`. Details: LESSONS_LEARNED.md 2026-06-22.
- **`claude -p` laeuft wieder** (Homebrew-claude 2.1.126, verifiziert PONG/exit0) → der Art-Director `buildImagePlan` funktioniert. KEIN deterministischer Plan-Fallback noetig.
- **macOS `/bin/bash` = 3.2** → in `#!/bin/bash`-Scripts KEIN `mapfile`/`readarray`/`declare -A`. Read-Loop nutzen. Vor Commit unter `/bin/bash <script>` testen (nicht nur `bash -n`).

## Was diese Session gebaut + VERIFIZIERT hat (committet)
Teil 2 (Gemini-Bilder headless) ist zu ~80% gebaut. Drei neue Dateien, alle testbaren Teile gruen:
1. `scripts/content-engine/media/decode-img.cjs` — data-URL/base64 → PNG (sharp resize 1200), fail-closed bei Garbage/zu klein. **Getestet** (data-URL, JSON-quoted, bare-base64, Garbage-Reject).
2. `scripts/content-engine/media/build-image-plan.ts` — single source of truth: baut/cached `staging/plan.json` via `buildImagePlan` und gibt die FERTIG ASSEMBLIERTEN Gemini-Prompts als JSON aus (`GEMINI_PLAN=...`): Hero (mit eingebackenem Hook + rotierendem Verlauf, Hook-Tinte luminanz-adaptiv = creme-weiss/Espresso-Braun) + ctx1-3 (BRAND_PHOTO_STYLE). Hook-Quelle: `hookCandidates[0]` (Default) — override per `--hook-index N` / `--hook "text"` / `--no-hook`. **Getestet** gegen beide Live-Artikel (Prompts korrekt, Hook-Tinte korrekt ueber alle 4 Verlaeufe).
3. `scripts/content-engine/media/generate-images-gemini.sh <slug>` — Orchestrator: plan → pro Bild Gemini-Render via agent-browser → decode → `apply-images-browser.ts`. Idempotent (valides PNG >20KB wird uebersprungen), fail-closed (ohne Hero bleibt Artikel unangetastet, needs-images-Netz greift). Subcommand `login` fuer den einmaligen headed Google-Login. **Verifiziert** (bash-3.2-Syntax, Plan-Parse/base64-Roundtrip unter /bin/bash 3.2, vitest 25/25). Eslint/`buildImagePlan` gruen.
4. `scripts/content-engine/media/gemini-extract.js` — In-Page-Extraktion: groesstes generiertes blob:/data:-`<img>` → canvas.toDataURL('png').

## ERLEDIGT diese Session (committet + gepusht, bis `26cf5d5`) — Teil 2 LIVE
- **agent-browser installiert** (Chrome-for-Testing 150) + **Gemini-Login** im dedizierten Profil `~/.agent-browser-profiles/gemini-immo`. Headless-Login bleibt erhalten (verifiziert).
- **`gemini_render` live kalibriert + bestaetigt:** Eingabe `find role textbox fill`, Submit `press Enter`, Warten `wait --fn` (blob:/data:-img, naturalWidth>256), Extraktion `gemini-extract.js` (groesstes blob-img → canvas.toDataURL, same-origin = nicht tainted), decode → 1200px-PNG. URL = `/app`.
- **Hero MIT Hook verifiziert:** Gemini rendert den handschriftlichen Hook (luminanz-adaptive Tinte). Voller Script-Lauf (Hero+ctx1-3+Infografik eingebettet) exit 0, headless.
- **In `run-media-check.sh` verdrahtet:** Codex-Aufruf ersetzt durch `generate-images-gemini.sh "$SLUG"` (Bilder VOR Podcast/Video). Hero-Guard + needs-images-Netz bleiben als Fallback.

## OFFEN / optional (kein Blocker)
1. **Naechsten echten Tagesartikel beobachten:** bei der naechsten Freigabe pruefen, dass der Nacht-Job die Bilder zieht UND `chosenHook` korrekt im MDX landet (approve-with-hook ist unit-getestet, der echte Mail-Klick→GitHub-Commit→chosenHook noch nicht live durchlaufen).
2. **Robustheit gegen Google-Logout:** falls das Profil-Login mal verfaellt, feuert der Hero-Guard (Notification) + needs-images-Netz → `generate-images-gemini.sh login` neu einloggen. Optional spaeter zusaetzlich `agent-browser state save` als Cookie-Backup.
3. **agent-browser-Exec interaktiv:** der Auto-Classifier blockt das Ausfuehren durch den Agenten ohne explizite User-Autorisierung; im launchd-Nacht-Cron laeuft es ohne Classifier.

## Hook im Headless-Modus — ENTSCHIEDEN + GEBAUT (commit `347a7b5`)
Thomas 22.06: ein Klick auf Hook-Button 1/2/3 in der Review-Mail ist ZUGLEICH die Freigabe UND die Hook-Wahl. Umgesetzt + unit-getestet (141/141): `approvalToken` traegt optionalen 1-basierten Hook-Index; `reviewEmail` rendert pro Kandidat einen gruenen „Freigeben mit Hook N"-Button (ersetzt den einzelnen Approve-Button, wenn Hooks da sind); `/api/approve` liest den Index, schreibt `chosenHook` ins Artikel-Frontmatter beim Publish + in den Media-Marker; `build-image-plan.ts` bevorzugt `frontmatter.chosenHook` vor Kandidat 1. Reine Logik verifiziert; der LIVE-Loop (echter Mail-Klick → GitHub-Commit → chosenHook) wird erst durch eine echte Freigabe end-to-end durchlaufen — beim naechsten Tagesartikel pruefen, ob `chosenHook` korrekt im MDX landet.

## Loose Ends (nicht blockierend)
- Pending-Marker `was-muss-vorbereitet-sein-bevor-eine-agentur-beauftragt-wird.json` hat `requestedAt:2026-06-20` → der media-checker (nur HEUTE-Marker) ignoriert ihn; der BaFG-Artikel ist als Text live, Medien nie produziert. Bei Bedarf manuell bebildern/Podcast.

## Relevante Dateien/Befehle
- Neu: `media/{decode-img.cjs, build-image-plan.ts, generate-images-gemini.sh, gemini-extract.js}`.
- Bestehend: `media/{apply-images-browser.ts, run-media.ts, image.ts, image/sketchInfographic.ts, generate-podcast-cli.sh, generate-video.sh}`, `trigger/run-media-check.sh`.
- Tests: `npx vitest run scripts/content-engine/media/` (25/25). Node direkt: `/opt/homebrew/bin/node` + `NODE_PATH="$PWD/node_modules"`.
- agent-browser Doku als Dateien (kein Binary-Run noetig): `$(npm config get prefix)/lib/node_modules/agent-browser/skill-data/core/`.
- Memory: `reference_redrabbit_daily_claude_enoexec_fix` (22.06-Updates), `feedback_notebooklm_immer_immo_red` (Gemini /u/3/).
