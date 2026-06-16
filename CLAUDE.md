# CLAUDE.md

Project instructions for agents working on `webredrabbitmedia`.

## Project

This is a Next.js website for Web Red Rabbit Media.

## Commands

```bash
npm install
npm run dev
npm run dev -- --port 9000
npm run build
npm run lint
```

## Project Memory

The repository has dedicated project memory files:

- `MEMORY.md` - current project state, recurring context, active decisions, and operational notes.
- `LESSONS_LEARNED.md` - durable lessons from debugging, setup issues, deployment problems, and recurring mistakes.

These files are the shared memory source for both Codex and Claude Code. Both tools should read and update the same files so future sessions stay aligned.

At every session end, update both files when anything relevant changed:

- Add new setup or runtime gotchas.
- Record bugs that were diagnosed and how they were fixed.
- Capture decisions that future sessions should not rediscover.
- Keep entries concise and dated.
- If Codex changes project context, Claude Code should be able to recover it from these files, and vice versa.

Do not put secrets, API keys, private credentials, or customer-sensitive data in these files.

## Content-Engine: Bild- & Medien-Produktion (IMMER diese Runbooks abrufen, nicht neu herleiten)

Operative Fakten stehen verbindlich in den Runbooks. Vor jeder Bild-/Medien-Aufgabe lesen:

- **Bilder:** `.agent/workflows/bilder-gemini-browser.md`. Kurz: Gemini im Browser ist PRIMAER
  (gratis, mit Hook), Codex (`images-only.ts`, gpt-5.5) nur Fallback. Hero = Tuerkis->Blau-Verlauf
  + handschriftlicher Hook (Kriterien im Runbook). Daily-Cron schickt Text-only; Bilder nach Freigabe.
- **Podcast/Video:** `content-engine/knowledge/media-notes.md` (Abschnitt "RUNBOOK Podcast + Video").
  Kurz: Ausloeser = Freigabe (Marker in `content-engine/.media-requests/`). NotebookLM-MCP kann NUR
  Audio, **Video nur im Browser**; Default = Chrome-Session, 1 Notebook pro Artikel, deutsch. Tail =
  `media/run-media.ts` (YouTube oeffentlich + Substack = Veroeffentlichung -> pro Schritt OK holen).
- Backlog pruefen: `ls content-engine/.media-requests/` (offene Marker = Medien nie produziert).
- **KONTEN (Pflicht):** NotebookLM + Google/Gemini IMMER mit `t.uhlir@immo.red` (nicht
  thomas.uhlir@gmail.com; ggf. Konto-Switcher umstellen). YouTube = `medi.redrabbit@gmail.com`
  (Upload via OAuth-Token `~/.config/redrabbit-youtube/token.json`, Kanal @RedRabbitLab).

## Content-Engine: launchd-Automatisierung (KRITISCHE REGEL — sonst Stille/keine Medien)
Drei launchd-Bot-Jobs laufen unbeaufsichtigt: `com.redrabbit.contentengine` (täglich Artikel+Review-Mail),
`com.redrabbit.mediachecker` (alle 30 Min: erkennt Freigabe-Marker → Bilder headless + Notification),
`com.redrabbit.reminder` (wöchentlich). Ablauf: Tageslauf publiziert Text → Review-Mail an
**t.uhlir@immo.red** → Thomas gibt frei → Marker `content-engine/.media-requests/<slug>.json`
(`status:requested`) auf main → media-checker → Bilder + Notification → Browser-Session (Claude) macht
Podcast/Video/Substack.

**EISERNE REGEL: jeder launchd-Bot-Job läuft aus dem BOT-WORKTREE `~/dev/redrabbit-daily` (immer `main`),
NIE aus dem geteilten Mensch-Checkout `~/dev/redrabbit`** (der steht oft auf einem Feature-Branch → der
Job sieht main-Stand/Marker NICHT). Alle Trigger-Scripts sind self-locating (`REPO` aus `$BASH_SOURCE`)
+ `git fetch && git merge --ff-only origin/main`. Die plists zeigen auf `~/dev/redrabbit-daily/...`.
Wer einen neuen Bot-Job/Script baut oder ein plist anfasst: dieses Muster zwingend übernehmen, sonst
wiederholt sich der 16.06-Ausfall (Daily-Mail + Medien liefen nicht, weil die Jobs auf dem Feature-Branch
liefen). Marker-Parsing IMMER mit `JSON.parse` (Marker sind pretty-printed, grep ohne Leerzeichen matcht
nicht). Details: LESSONS_LEARNED.md (2026-06-16).

**„Kompletter Prozess nach Freigabe" ist NICHT 100% headless:** Bilder = headless (Codex), aber
**Podcast (NotebookLM) / Video (nur Browser) / Substack** brauchen eine Browser-/Claude-Session. Der
media-checker schickt dafür eine macOS-Notification. YouTube-Public + Substack-Publish = OK von Thomas.

## Frontend And UI/UX Workflow

Use the available frontend and UI/UX skills for all visual website work:

- `frontend-design` - use when building or changing pages, components, layouts, animations, or visual styling.
- `ui-ux-pro-max` - use when planning, reviewing, or improving usability, accessibility, responsive behavior, interaction states, color systems, typography, spacing, and overall UX quality.

For any frontend task, apply both skills before implementation unless the task is purely backend, infrastructure, or content-only. Future sessions should treat this as a project rule.

Before delivering UI changes, verify:

- Responsive behavior on mobile and desktop.
- Accessibility basics: contrast, focus states, labels, semantic structure.
- No generic AI-looking design patterns; match the Web Red Rabbit Media brand and existing site style.
- No layout overlap, clipping, or horizontal scroll on mobile.

## Current Localhost Notes

For local testing, the GitHub checkout can run on port `9000`:

```bash
npm run dev -- --port 9000
```

If `@next/third-parties/google` is missing, run `npm install` so `node_modules` matches `package-lock.json`.

## Code Intelligence: Graphify

The repo ships a pre-built knowledge graph at `graphify-out/graph.json`.
The graph auto-updates after every commit via `.git/hooks/post-commit` (no API, no cost).

**Use it before every code task:**

```bash
# Find a component or function
graphify query "SimpleAudioPlayer" --graph graphify-out/graph.json

# Understand dependencies between two files
graphify path "VideoEmbed" "RegionalLandingPage" --graph graphify-out/graph.json

# Explain a node in plain language
graphify explain "SteiermarkTestimonials" --graph graphify-out/graph.json
```

**Manually update the graph when needed (no API cost, no LLM):**

```bash
cd ~/dev/redrabbit && graphify update . --no-cluster --force
```

**NEVER run `graphify . --backend claude` or `graphify label`** — those call the Anthropic API and incur extra cost. Always use `graphify update` or `graphify query/path/explain` which are 100% local.

## Existing Project Docs

- `README.md` - starter project README.
- `SEO_TODO.md` - SEO task notes.
- `VERCEL_DEPLOYMENT.md` - deployment notes.
- `.agent/workflows/seo-texte-leitfaden.md` - SEO text workflow.
- `.agent/workflows/podcast-einbinden.md` - podcast integration workflow.
