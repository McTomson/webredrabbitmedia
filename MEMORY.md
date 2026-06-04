# MEMORY.md

Project memory for `webredrabbitmedia`.

Update this file at the end of every session when project state, recurring context, active decisions, or operational notes changed.

This file is shared project memory for Codex and Claude Code. Both tools should read and update `MEMORY.md` and `LESSONS_LEARNED.md` so they stay on the same project state.

## Current State

- GitHub repo: `https://github.com/McTomson/webredrabbitmedia`
- Local temporary checkout used in this session: `/private/tmp/webredrabbitmedia-9000`
- Local dev URL used in this session: `http://localhost:9000`
- Framework: Next.js

## Operational Notes

- Use `npm run dev -- --port 9000` to start the site on port `9000`.
- Run `npm install` after a fresh clone before starting the dev server.
- Do not rely on copied `node_modules` from another checkout; it can drift from `package-lock.json`.
- For frontend/UI work, use `frontend-design` and `ui-ux-pro-max` before implementation or review.
- Treat responsive behavior, accessibility basics, and brand-consistent visual quality as required checks for UI changes.
- Admin/API mutation routes use `ADMIN_API_TOKEN` or `INDEXING_API_TOKEN`; send it as `Authorization: Bearer <token>` or `x-api-key`.
- Contact form SMTP configuration must come from environment variables. Never add fallback passwords or credentials to source code.
- Audio proxy is intentionally allowlisted. Current allowed hosts are managed in `lib/api-security.ts`.
- `app/robots.ts` is the canonical robots source. Do not re-add `public/robots.txt`, because it conflicts with the App Router route.
- Remaining audit note: `npm audit --omit=dev` reports 3 moderate `postcss` findings through `next`, currently with no available fix.
- Codex and Claude Code must use the same project memory files: `CLAUDE.md`, `MEMORY.md`, and `LESSONS_LEARNED.md`.
- Responsive verification on 2026-06-02 passed 30 checks across `/`, `/tipps`, `/tipps/website-kosten-oesterreich-2026`, `/kontakt`, and `/webdesign-wien` at 320, 375, 390, 768, 1024, and 1440 widths: no horizontal overflow failures and no broken image URLs.
- Header desktop navigation should start at `lg`, not `md`, because the full nav plus CTAs is too wide for 768px tablets.
- Avoid horizontal reveal animations (`fade-left`/`fade-right`) for AOS content; `AOSWrapper` maps them to `fade-up` to prevent temporary `scrollWidth` overflow.
- Do not add extreme offscreen positioning to `sr-only` content; Tailwind `sr-only` is enough and avoids layout measurement side effects.
- Regional hidden SEO content follows the same rule as homepage SEO content: use `sr-only` without manual `left: -10000px` offsets.
- Keep carousel tracks clipped to a 100% layout width. The About mobile testimonial carousel should translate one 100%-wide slide at a time, not expand the flex track to all slides.
- Footer SEO link rows need explicit wrap/overflow safety because long regional/city link lists can otherwise widen tablet and desktop layouts.
- ESLint is expected to run without warnings. The large `app/[slug]/cluster-content.ts` file has a local unused-vars rule disable because it contains templated regional content functions with intentionally unused placeholders.
- Current npm audit status on 2026-06-02: `next@16.2.7` is the latest registry version, but `npm audit --omit=dev` still reports 3 moderate `postcss` findings through `next` with no available fix.
- Deployment note from 2026-06-02:
  - GitHub `main` was pushed through commit `e442816`.
  - A Vercel production deployment is Ready at `https://webredrabbitmedia-9000.vercel.app`.
  - The first local Vercel upload failed with an API `Internal Server` JSON response during file upload; adding `.vercelignore` reduced upload size and the second deploy completed.
  - The existing custom domain `https://web.redrabbit.media` still points to a different/existing Vercel project and was not aliased to the new `webredrabbitmedia-9000` project, because the new project may not have the existing production environment variables.
  - Before moving `web.redrabbit.media`, identify the existing Vercel project or migrate required env vars (`SMTP_*`, `INDEXNOW_API_KEY`, admin token, analytics IDs as applicable) to the target project.
- Production follow-up on 2026-06-03:
  - `https://web.redrabbit.media` serves the hardened audio-proxy behavior (`http://127.0.0.1...` returns `{"error":"Audio URL is not allowed"}`), so the live domain has at least that new code path.
  - `https://web.redrabbit.media/api/indexnow` still reports `configured:false` and `protected:false`; `INDEXNOW_API_KEY` and admin token are not active in that live runtime.
  - Existing IndexNow key file is present and live: `/245ee51aa890fe982c6cbaa475db1255.txt`.
  - Attempts to manage Vercel env via CLI/API were inconclusive: `vercel env add` returned exit 0 but printed only `Retrieving project…`, `vercel env pull` produced no env file, and Vercel API requests intermittently failed DNS for `api.vercel.com`.
  - Next production step: use Vercel dashboard or a stable API session to set `ADMIN_API_TOKEN` and `INDEXNOW_API_KEY=245ee51aa890fe982c6cbaa475db1255`, then redeploy and verify `/api/indexnow` reports `configured:true` and `protected:true`.

## Content-Engine Projekt (2026-06-03)

- NEU: Autonome "Tipps"-Content-Maschine geplant. Vollständige Spec + Pre-Mortem + 7-Phasen-
  Umsetzungsplan unter `docs/superpowers/` (Branch `docs/content-engine-plan`).
- WICHTIG: Dieser Arbeits-Checkout liegt jetzt unter `~/dev/redrabbit` (frisch von GitHub
  geklont, RAUS aus dem iCloud-Desktop, wo git hängt). Hier weiterarbeiten, nicht im iCloud-Ordner.
- `content-engine/` = datei-basiertes Memory der Maschine (topics/voice/opinions/performance).
- Voice: `content-engine/voice/house.md` v2 aus Thomas' ECHTEN Mails. Register=Sie. HARTE REGEL:
  NIE Gedankenstrich "–" (sein Top-KI-Tell), keine Dreierfiguren/Hochglanz. Die bestehenden
  content/blog-Artikel sind KI-Gloss = nur SEO-Struktur-Vorlage, NICHT Ton-Vorbild.
- Baseline (GSC verifiziert): ~11 Klicks/3 Monate = nahe Null. KPIs: Indexierung→Klicks→Leads.
- Schon vorhanden (nicht neu bauen): GA4 (G-09FNC6THTD), Google Indexing API, IndexNow, SMTP.
- Bild: `codex` CLI `imagegen` (headless, 0€ über ChatGPT-Plus-Limit).
- Offen vor Bau Phase 1/2: Meinungs-Batch vom User, Headless-Spike (Task 0.4), vitest/tsx (0.5).
- Detaillierter Handoff in `~/.claude/projects/-Users-McTomson/memory/project_redrabbit_content_engine.md`.

## Content-Engine Stand (2026-06-04)

- **Engine GEBAUT + DEPLOYED.** Branch `feat/content-engine` (HEAD `3074897`, gepusht). `main` (`6cb905b`)
  hat die 3 Demo-Artikel als Drafts live (noindex). 36 Unit-Tests gruen.
- **Pipeline** (`scripts/content-engine/`): 4-Rollen-Redaktion headless via `claude -p`
  (Researcher web → Quellen-verify → Writer → Editor → Finalizer → Validator + Reparatur),
  `gate.ts` Quality/Risk, `image.ts` Multi-Bild, `lib/*`. Lauf: `tsx scripts/content-engine/pipeline.ts <slug-or-id|--next> [--emit] [--reuse-research] [--no-image]`.
- **3 Artikel live** (Drafts, noindex, je `/tipps/<slug>`): website-wartungsvertrag-sinnvoll (Text+Stil
  approved + photoreal Hero + Sketch-Infografik), website-kosten-steuerlich-absetzbar-oesterreich,
  bfsg-barrierefreiheit-website-pflicht-strafen. Steuer+BFSG haben noch ALTEN Text-Stil + 1 altes Bild.
- **1-Tap-Freigabe LIVE + bewiesen**: `/api/approve` (Token→GitHub-Flip draft→published→IndexNow),
  `/api/review-notify` (admin, sendet via SMTP). Vercel-Env gesetzt: APPROVAL_SECRET, ADMIN_API_TOKEN,
  INDEXNOW_API_KEY, SITE_URL, GITHUB_TOKEN. FEHLT: SMTP-Creds (Ionos-Passwort vom User) fuer Auto-Mail.
- **Bild-Stilsystem (approved):** Hero photoreal (Codex, Mensch, kein Text), Infografik handgezeichneter
  Sketch (SVG, Hand-Fonts), 3 Kontextfotos photoreal. Versionierte Dateinamen (Cache!).
- **OFFEN:** (1) Vercel-Build-Queue war gestaut, neue Wartungsvertrag-Bilder verifizieren sobald live;
  (2) Multi-Bild-Pipeline (gebaut) END-TO-END testen (1 Artikel, 4 Codex-Calls ~8min); (3) Steuer+BFSG
  Text neu (approved Stil) + 5 Bilder; (4) Auto-Mail (SMTP-Passwort); (5) Medien Phase 4 (NotebookLM/
  Substack/YouTube, User in Chrome eingeloggt, 1 Notebook pro Artikel); (6) launchd installieren.

## Session-End Checklist

- Update this file with any new stable project context.
- Update `LESSONS_LEARNED.md` with any debugging or setup lessons.
- Keep Codex and Claude Code aligned by recording shared decisions here instead of relying on tool-local chat history.
- Keep notes concise and dated.
- Do not store secrets or credentials here.
