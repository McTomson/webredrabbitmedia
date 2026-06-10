# Review — bidirectional internal cluster linking (commit 05fa590)

**Date**: 2026-06-11
**Reviewer**: review-it skill, 3 parallel agents (Logic / Security / Simplify)
**Stack**: service (scripts/content-engine), ui (app/tipps), test, config
**Domain**: content-engine, MDX, git-publish
**Verdict**: CONDITIONAL on first pass (3 MAJOR, 0 CRITICAL) → all fixed → GO

## Findings — Accepted & Fixed

### MAJOR — MDX/JSX injection via LLM-generated article title (Security)
`clusterLinks.ts` buildBlock embedded `cleanAnchor(title)` raw into a markdown link compiled
by next-mdx-remote. A title with `{`, `<`, `]` could break out (server-side expression eval or
a render/build failure across every cluster-mate, then auto-pushed to main). Fix: `escapeMdxText`
backslash-escapes ``\ ` * _ [ ] < > { } |``; slug charset-guarded with `/^[a-z0-9-]+$/`.

### MAJOR — author-footer regex never matched the corpus → wrong placement (Logic, conf 88)
The footer regex `/\n+---\s*\n+\*\*[^\n]*Uhlir.../` assumed `**Uhlir**` sits AFTER a `---`.
Real articles vary (---/CTA, italic bio, "### Über den Autor"), so it never fired and every
article fell through to append. Fix: removed the footer branch entirely; the block is always
appended at the end of the body (predictable, the related-reading block is last in the prose).

### MAJOR — unbounded footer regex could relocate real content in future articles (Logic, conf 82)
The `[\s\S]*$` tail meant a mid-body `---` followed by "Uhlir" (a quote attribution) would match
and move a large chunk of content after the link block. Resolved by the same removal above.

### MINOR — git add staged the whole content/blog dir before an unattended push (Security)
Widened the blast radius (a stray non-mdx file could be swept into the push to main). Fix:
`git add content/blog/*.mdx`.

### MINOR — run-media commit message + silent relink failure (Logic, conf 82)
Message said only `${slug}` though N files change; a swallowed relink error looked complete. Fix:
message now appends `(+N cluster links)`; relink errors are written to stderr before being logged.

### MINOR — unused `limit` option on relinkAll (Simplify)
`limit` was plumbed but never passed. Removed from `relinkAll` (kept on lower-level `scoreRelated`).

### MINOR — zero-score isolated article gets no block (Logic, conf 80)
Confirmed acceptable (corpus is densely tag-linked; a forced unrelated link hurts relevance).
Clarified in a code comment instead of forcing a fallback tier.

## Findings — Rejected / Not a defect
- Duplication of `hardcodedSlugs` (scripts) vs `hardcodedTippsSlugs` (app) and the scoring mirror
  of `getRelatedPosts`: the established scripts/app module boundary forbids a clean shared import;
  both Simplify and the constraint agree — leave as-is (documented mirrors).
- `injectBlock` branch count: reduced from 3 to 2 by removing the footer branch (also a Simplify win).

## Verification after fixes
24 clusterLinks tests + 113 total green; tsc clean; `next build` ok (62 static pages);
`cluster:relink` idempotent (0 changed on re-run); browser-checked: block renders on MDX articles
and the hardcoded flagship page, all 15 link targets resolve (no 404), dashboard on-page score 96,
internal_links finding 0.
