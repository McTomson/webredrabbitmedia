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

## Existing Project Docs

- `README.md` - starter project README.
- `SEO_TODO.md` - SEO task notes.
- `VERCEL_DEPLOYMENT.md` - deployment notes.
- `.agent/workflows/seo-texte-leitfaden.md` - SEO text workflow.
- `.agent/workflows/podcast-einbinden.md` - podcast integration workflow.
