# Operations-Runbook — Red Rabbit Content-Engine

**Zweck:** Ein Fremder (oder eine frische Claude-Session) soll das System mit dieser Datei allein
verstehen, neu starten und Störungen diagnostizieren können — ohne Vorwissen. Bus-Faktor-Absicherung.
Stand 2026-06-18. Keine Secrets hier — nur, WO sie liegen.

---

## 1. Was das System tut
Ein automatisierter Content-/SEO-Motor für **web.redrabbit.media** (Next.js auf Vercel). Täglich:
generiert die Pipeline einen Artikel-Entwurf (4-Rollen-Newsroom über headless `claude`), pusht ihn
nach `main` (Vercel deployt), schickt Thomas eine **Review-Mail**. Nach seiner Freigabe wird der
Artikel veröffentlicht und der **Medien-Flow** (Bilder/Podcast/Video/Substack) angestoßen.

## 2. Wo es läuft (Maschinen & Repos)
- **Läuft auf Thomas' Mac** via launchd (NICHT in der Cloud). Mac muss an/wach sein (siehe Job-Setup).
- **Bot-Worktree `~/dev/redrabbit-daily`** — IMMER auf `main`. ALLE launchd-Jobs laufen aus diesem
  Worktree. `node_modules` + `.env.local` sind aus `~/dev/redrabbit` hierher **gesymlinkt**.
  → **NIE löschen** (zerstört Symlinks). NIE auf einen Feature-Branch stellen.
- **Mensch-Checkout `~/dev/redrabbit`** — hier arbeitet Thomas auf Feature-Branches. Quelle der Symlinks.
- **GitHub:** `McTomson/webredrabbitmedia`. **Vercel** deployt jeden Push auf `main` automatisch.
- Vercel-Commit-Identität muss `131015834+McTomson@users.noreply.github.com` sein (sonst kein Deploy).

## 3. Die drei launchd-Jobs (`~/Library/LaunchAgents/`)
| Label | Plan | Script | Tut |
|---|---|---|---|
| `com.redrabbit.contentengine` | 07:53 + alle 3h Catch-up + RunAtLoad | `scripts/content-engine/trigger/run-daily.sh` | Artikel-Entwurf + Push + Review-Mail |
| `com.redrabbit.mediachecker` | alle 30 min (1800s) | `scripts/content-engine/trigger/run-media-check.sh` | Erkennt Freigabe-Marker → Bilder headless (Codex) + Notification |
| `com.redrabbit.reminder` | Mo 08:30 | `scripts/content-engine/trigger/run-remind.sh` | Wöchentliche Interview-Erinnerungs-Mail |

`run-daily.sh` ist idempotent (1 Artikel/Tag via `.work/last-run-<datum>`-Stamp), gelockt
(`.work/daily.lock`), self-locating (findet sein Repo via `$BASH_SOURCE` → Bot-Worktree),
`git reset --hard origin/main` zu Beginn, `caffeinate` hält den Mac wach. Paarung: `pmset repeat
wakeorpoweron 07:48` weckt den Mac.

Neu laden nach plist-Änderung: `launchctl unload <plist> && launchctl load <plist>`.

## 4. Toolchain & Dependencies (was schon kaputtging — wichtig)
- **node** via nvm (`v20.x`), **tsx** für die TS-Skripte, **`claude`** (Pipeline-LLM), **`codex`** (Bilder).
- **`claude`-Binary:** Es gibt ZWEI: nvm-global (`~/.nvm/.../bin/claude`) und Homebrew
  (`/opt/homebrew/bin/claude`, native Mach-O, brew-managed, `autoUpdatesProtectedForNative`).
  **17.06-Ausfall:** ein Claude-Auto-Update zerschoss die nvm-Binary (shebang-loser Stub) →
  `execFileSync('claude')` ENOEXEC (`Unknown system error -8`) → Pipeline hielt im Researcher.
  **Schutz (mehrschichtig, in `run-daily.sh`):**
  1. **Guard:** geht `claude --version` nicht, fällt PATH auf die erste funktionierende Binary zurück.
  2. **Pin:** `export CLAUDE_BIN="$(command -v claude)"` → `roles.ts` nutzt genau diese (statt PATH).
  3. `DISABLE_AUTOUPDATER=1` für den Lauf.
  - Jeder Tageslauf loggt die Toolchain (`Toolchain: node … | CLAUDE_BIN=… (version)`).
  - Details/Diagnose: Memory `reference_redrabbit_daily_claude_enoexec_fix`.
- **Vercel-Build:** nutzt aktuell `npm install` (vercel.json), NICHT `npm ci`. 32/33 deps sind `^`-Ranges
  → Builds nicht 100% reproduzierbar. **OFFEN (Risiko-Pin):** auf `npm ci` umstellen, ABER zuerst das
  Lockfile resyncen — `package-lock.json` ist aktuell NICHT in sync (`npm i --package-lock-only` fügt
  optionale Plattform-Deps hinzu). Procedure: lokal `npm install`, `git add package-lock.json`, Test-Deploy
  auf Preview, dann `vercel.json` `installCommand` → `npm ci`. Nicht blind machen (Kundenseite).

## 5. Accounts, Tokens, Secrets — WO sie liegen (nicht die Werte)
- **`~/dev/redrabbit/.env.local`** (via Symlink im Bot-Worktree): `SITE_URL`, `ADMIN_API_TOKEN`
  (für `/api/review-notify` + `/api/ops-alert`), `DASHBOARD_OAUTH_CLIENT`, `DASHBOARD_TOKEN`,
  `GSC_SITE_URL`, `GA4_PROPERTY_ID`. **`HEARTBEAT_URL`** hier eintragen (siehe §7).
- **Mail-Versand:** läuft NICHT lokal, sondern über die deployten Vercel-Routes (`nodemailer`/SMTP
  als Vercel-Env). Lokale Box hat KEINE SMTP-Creds. Empfänger Daily/Ops-Mail = **t.uhlir@immo.red**.
- **YouTube-Upload:** OAuth-Token `~/.config/redrabbit-youtube/token.json`. Kanal **@RedRabbitLab**,
  Konto **medi.redrabbit@gmail.com**.
- **NotebookLM + Gemini (Bilder/Podcast/Video):** Browser-Session, Konto **t.uhlir@immo.red**.
- **Substack:** redrabbitlab.substack.com (Browser-Login Thomas).
- **world4you** (Kunden-Hosting/DNS, FTP-Uploads): mehrere Konten — Memory
  `reference_world4you_konten_domains` (heating-systems/rero = Konto 50239936).
- **UptimeRobot:** Konto t.uhlir@immo.red (API-Key in `~/.claude/settings.json` mcpServers). FREE-Plan
  → KEINE Heartbeat-Monitore (nur HTTP). Für Dead-Man-Switch siehe §7.
- **Vercel:** Projekt webredrabbitmedia, Team-Token via CLI-auth. **Supabase** (andere Kundenprojekte):
  Token in settings.json mcpServers.

## 6. Täglicher Ablauf (end-to-end)
1. `run-daily.sh` (07:53/Catch-up): Guard+Pin → `git reset --hard origin/main` → Cluster-Link-Safety-Net
   → Indexierungs-Kill-Switch-Check (7-min-Cap) → `pipeline.ts --next --emit --no-image`.
2. Pipeline: Researcher → Quellen verifizieren → Writer → Editor (setzt `flags`) → Finalizer → Hooks.
   Schreibt `content/blog/<slug>.mdx` (`status: draft` = **noindex**), `setStatus(review)`, plus
   **`.work/<slug>/gate.json`** (`runGate` → risk/flags).
3. Commit + Push `main` → Vercel deployt (Draft ist erreichbar, aber noindex).
4. `run-daily.sh` ruft `/api/review-notify` mit `{slug, flags, risk}` (aus gate.json) → **Review-Mail**
   mit Freigeben-/Ablehnen-/Vorschau-Link + Hook-Auswahl. High-Risk → „bitte gegenlesen"-Warnung.
5. Thomas klickt **Freigeben** → `/api/approve?token=…` setzt `status: published` (per GitHub-API-Commit)
   → Vercel deployt → noindex fällt weg + IndexNow-Ping. Legt `content-engine/.media-requests/<slug>.json`
   (`status: requested`) an.
6. `mediachecker` (alle 30 min) sieht den Marker → Bilder (Codex headless) + macOS-Notification. Browser-
   Session (Claude) macht Podcast/Video/Substack über `media/run-media.ts`. Dauerregel: nach Freigabe den
   GANZEN Medien-Flow automatisch (Memory `feedback_medien_flow_immer_automatisch`).

## 7. Robustheits-Features & offene Setups
- **Risk-Gate → Review-Mail (aktiv):** s. §6.4. Vorher kam die Mail immer als `risk:low`.
- **Externer Heartbeat / Dead-Man-Switch (TEILS OFFEN):** `run-daily.sh` pingt `HEARTBEAT_URL` nur bei
  gesundem Ende (Artikel ODER sauberer Halt), NICHT auf Crash-Pfaden. Bleibt der Ping aus (Mac aus/launchd
  tot/früher Crash) → externer Dienst alarmiert. **UptimeRobot-Free kann KEINE Heartbeats** → Setup via
  **healthchecks.io** (gratis): Account anlegen, Check „redrabbit-daily" Period 1 Tag / Grace 6 h, Mail an
  t.uhlir@immo.red, Ping-URL kopieren, in `.env.local` `HEARTBEAT_URL=https://hc-ping.com/<uuid>`.
  In-House-Alternative: GitHub-Actions-Cron-Watchdog (prüft „heute Commit in content/blog?"). Memory
  `reference_redrabbit_daily_heartbeat`.

## 8. Diagnose-Playbook
- **„Keine Tagesmail / kein Artikel":** ZUERST Tageslog lesen, ERSTE Fehlerzeile:
  `scripts/content-engine/.work/daily-<datum>.log`. NICHT Scheduling verdächtigen (3h-Catch-up läuft).
  - `code=Unknown system error -8` / `spawnSync claude` → claude-Binary kaputt. `file $(command -v claude)`
    muss „Mach-O" sein, nicht „ASCII text". Guard/Pin sollte greifen; sonst `/opt/homebrew/bin/claude --version`.
  - Hängt 3h+ → Timeout-Wächter prüfen (GSC-Check `pgtimeout 420`). Historie: Memory
    `reference_redrabbit_daily_mail_hang_fix`.
  - Mail-Route 5xx → `/api/review-notify` bzw. `/api/ops-alert` + ADMIN_API_TOKEN prüfen.
- **„Kein Medien-Schritt nach Freigabe":** Marker da? `ls content-engine/.media-requests/`. mediachecker
  läuft aus dem Bot-Worktree? Marker-Parsing nur mit `JSON.parse` (pretty-printed).
- **Manueller Neustart des Tageslaufs** (idempotent, sicher): `bash -lc
  ~/dev/redrabbit-daily/scripts/content-engine/trigger/run-daily.sh`. Stamp `.work/last-run-<datum>` löschen
  erzwingt Neulauf (Vorsicht Doppel-Artikel).
- **Tests/Typecheck:** `npm test` (Vitest, ~168) + `npx tsc --noEmit --skipLibCheck`.

## 9. Goldene Regeln
- NIE raten — verifizieren (Code/DB/Browser/Docs) oder fail-closed. Memory `feedback_nie_raten_immer_verifizieren`.
- Jeder Bot-Job läuft aus `~/dev/redrabbit-daily` (immer main), NIE aus `~/dev/redrabbit`.
- Kundenseiten: nichts kaputt machen. Veröffentlichungen/Mails/irreversibles: nur mit Thomas' OK.
- Passwörter tippt Thomas, nicht der Agent. Consent-Banner: nur notwendige.

## 10. Verwandte Memory-Dateien (`~/.claude/projects/-Users-McTomson/memory/`)
`reference_redrabbit_daily_mail_hang_fix`, `reference_redrabbit_daily_claude_enoexec_fix`,
`reference_redrabbit_daily_heartbeat`, `feedback_medien_flow_immer_automatisch`,
`reference_redrabbit_media_produktion_runbook`, `reference_world4you_konten_domains`,
`feedback_nie_raten_immer_verifizieren`.
