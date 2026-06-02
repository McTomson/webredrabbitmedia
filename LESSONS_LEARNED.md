# LESSONS_LEARNED.md

Durable lessons for `webredrabbitmedia`.

Update this file at the end of every session when a debugging lesson, setup issue, deployment issue, or recurring mistake was discovered.

## 2026-06-02

- Fresh GitHub checkout for local testing was created at `/private/tmp/webredrabbitmedia-9000`.
- The site was successfully run on `http://localhost:9000`.
- Copying `node_modules` from another checkout caused dependency drift: `@next/third-parties/google` was missing even though `package.json` and `package-lock.json` required `@next/third-parties`.
- Running `npm install` in the checkout fixed the missing module by making `node_modules` match `package-lock.json`.
- The dev server then returned `HTTP/1.1 200 OK` on `http://localhost:9000`.
- Project memory files were added: `CLAUDE.md`, `MEMORY.md`, and `LESSONS_LEARNED.md`.
- `CLAUDE.md` now documents that `MEMORY.md` and `LESSONS_LEARNED.md` should be updated at every session end when relevant.
- Frontend work should use the `frontend-design` and `ui-ux-pro-max` skills for design quality, UX, accessibility, and responsive checks.
- Removed hardcoded SMTP credential fallback from `app/api/contact/route.ts`; SMTP secrets must be provided through env vars.
- Added shared API security helpers in `lib/api-security.ts` for admin-token checks, Web Red Rabbit URL validation, and audio proxy URL allowlisting.
- Protected `/api/indexing` and `/api/indexnow` so unauthenticated public requests fail closed.
- Hardened `/api/audio-proxy` by requiring HTTPS allowlisted hosts, audio content types, timeout, and max size checks.
- Resolved `/robots.txt` route conflict by keeping `app/robots.ts` and deleting `public/robots.txt`.
- Fixed missing blog image references by pointing MDX frontmatter/inline images to existing files in `public/images/blog`.
- `npm audit fix` plus targeted updates to `nodemailer@8.0.10` and `googleapis@173.0.0` reduced audit findings from 26 to 3 moderate `next/postcss` findings with no available fix.
- Codex and Claude Code should use the same memory files (`CLAUDE.md`, `MEMORY.md`, `LESSONS_LEARNED.md`) as the shared source of truth.
- Responsive root causes found on 2026-06-02:
  - The full Header nav at `md` overflowed 768px tablets; use `lg` for desktop nav and mobile drawer below that.
  - Rendering the closed offcanvas drawer still increased `scrollWidth`; render the drawer only while open.
  - `AOS` horizontal reveals (`fade-left`/`fade-right`) can temporarily push content outside the viewport; centralize them to `fade-up`.
  - Extra `left: -10000px` on `sr-only` SEO content can distort overflow checks; rely on the `sr-only` utility itself.
- Responsive verification script should scroll pages before checking images and should test image URLs via HTTP response/content-type instead of relying on `naturalWidth`, because lazy-loaded Next images can otherwise appear falsely broken.
- Additional responsive root causes found before commit:
  - The About testimonial carousel expanded the flex track to multiple slide widths, which increased document width; keep the visible track at 100% and translate by whole-slide widths.
  - Footer regional/city SEO links can overflow at tablet/desktop widths unless the wrapping container is constrained and overflow-safe.
  - `RegionalSEOContent` had the same manual offscreen positioning issue as `SEOContent`; rely on `sr-only`.
- ESLint cleanup on 2026-06-02 removed unused imports and changed unused `catch (_err)` to `catch`; `app/[slug]/cluster-content.ts` keeps a file-local unused-vars disable because its generated/template content intentionally includes unused placeholder parameters.
- `npm view next version` returned `16.2.7` on 2026-06-02. The remaining audit finding still reports vulnerable `next/postcss` with no fix available, so do not churn dependencies until a safe Next release exists.

## Session-End Checklist

- Add new lessons with dates.
- Prefer root-cause notes over vague summaries.
- Include the command or file involved when it helps future debugging.
- Do not store secrets or credentials here.
