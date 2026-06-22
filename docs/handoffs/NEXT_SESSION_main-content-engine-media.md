# Naechste Session — main / content-engine media (Gemini-Bilder voll headless) — Stand 2026-06-22 (Teil 2 gebaut, Kalibrierung offen)

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

## OFFEN — die letzten 20% (brauchen Thomas + Live-Gemini)
**Blocker, die NUR Thomas loesen kann (unvermeidbar):**
- **A. agent-browser ausfuehrbar machen.** npm-Paket ist installiert, aber der Auto-Classifier blockt das AUSFUEHREN von agent-browser durch den Agenten ("untrusted code"). Thomas: entweder `agent-browser`-Permission-Rule erlauben, ODER die Tests/den Login selbst per `!`-Prefix anstossen. (Im Nacht-Cron laeuft es spaeter unter launchd OHNE Classifier — der Block betrifft nur die interaktive Agenten-Ausfuehrung.)
- **B. Einmaliger Gemini-Login** (Agent darf keine Google-Credentials eingeben): `./scripts/content-engine/media/generate-images-gemini.sh login` → headed-Fenster → als `t.uhlir@immo.red` (/u/3/) einloggen → Fenster offen lassen bis Startseite → `agent-browser --session gemini-img close`. Profil persistiert unter `~/.agent-browser-profiles/gemini-immo`.

**Dann (Agent, sobald A+B erledigt):**
1. **`gemini_render` LIVE KALIBRIEREN** — die agent-browser↔Gemini-DOM-Schritte in `generate-images-gemini.sh` (klar markierte „CALIBRATION SEAM") sind eine Erstimplementierung. Auf einem eingeloggten Gemini-Chat `agent-browser --session gemini-img --profile ~/.agent-browser-profiles/gemini-immo snapshot -i` laufen lassen, die echten Refs/Rollen fuer (a) Prompt-Eingabefeld, (b) „Bild fertig"-Signal, (c) generiertes `<img>` ablesen und find/wait/eval in `gemini_render` + `gemini-extract.js` anpassen. Risiken: Google koennte headless-Chrome blocken (dann `--headed`/Attach an laufendes Chrome via `--cdp`), generierte Bilder evtl. als blob ohne canvas-Zugriff (dann Download-Pfeil-Weg statt canvas).
2. **End-to-end testen** an einem Test-Slug bis Hero+3 ctx sauber gestaged + via `apply-images-browser.ts` eingebettet sind. Loop bis stabil.
3. **In `run-media-check.sh` verdrahten:** den toten `images-only.ts`(Codex)-Aufruf durch `generate-images-gemini.sh` ERSETZEN, Reihenfolge BILDER VOR Podcast/Video (Hero fuers Video-Poster). Bei Fehler greift weiter das needs-images-Netz. ERST nach erfolgreichem e2e-Test wiring (nicht ungetestet in den Nacht-Job).

## ENTSCHEIDUNG fuer Thomas (Hook im Headless-Modus)
Der gewaehlte Hook wird heute NUR per Antwort-Nummer auf die Review-Mail kommuniziert und von einer Mensch-Session aufs Hero gesetzt — NIRGENDS maschinen-lesbar gespeichert (Marker = nur slug/date/status, kein `chosenHook`). Fuer VOLL headless habe ich als Default `hookCandidates[0]` gesetzt (override per Flag, needs-images-Netz erlaubt manuelles Nachbessern). **Frage an Thomas:** soll headless (a) immer Kandidat 1 nehmen, (b) den per Mail gewaehlten Hook speichern (dann /api/approve + Marker um `hookIndex` erweitern), oder (c) Bilder erst nach Hook-Wahl erzeugen? Bis geklaert: Default (a).

## Loose Ends (nicht blockierend)
- Pending-Marker `was-muss-vorbereitet-sein-bevor-eine-agentur-beauftragt-wird.json` hat `requestedAt:2026-06-20` → der media-checker (nur HEUTE-Marker) ignoriert ihn; der BaFG-Artikel ist als Text live, Medien nie produziert. Bei Bedarf manuell bebildern/Podcast.

## Relevante Dateien/Befehle
- Neu: `media/{decode-img.cjs, build-image-plan.ts, generate-images-gemini.sh, gemini-extract.js}`.
- Bestehend: `media/{apply-images-browser.ts, run-media.ts, image.ts, image/sketchInfographic.ts, generate-podcast-cli.sh, generate-video.sh}`, `trigger/run-media-check.sh`.
- Tests: `npx vitest run scripts/content-engine/media/` (25/25). Node direkt: `/opt/homebrew/bin/node` + `NODE_PATH="$PWD/node_modules"`.
- agent-browser Doku als Dateien (kein Binary-Run noetig): `$(npm config get prefix)/lib/node_modules/agent-browser/skill-data/core/`.
- Memory: `reference_redrabbit_daily_claude_enoexec_fix` (22.06-Updates), `feedback_notebooklm_immer_immo_red` (Gemini /u/3/).
