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

## Session-End Checklist

- Update this file with any new stable project context.
- Update `LESSONS_LEARNED.md` with any debugging or setup lessons.
- Keep Codex and Claude Code aligned by recording shared decisions here instead of relying on tool-local chat history.
- Keep notes concise and dated.
- Do not store secrets or credentials here.
