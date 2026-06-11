# Review — quality-scan subsystem (commit 62f4d63, fixes e5f1d4a)

**Date**: 2026-06-11
**Reviewer**: review-it skill, 3 parallel agents (Logic, Security, Simplify)
**Stack**: service (scanners), ui (dashboard tsx), test, config, docs
**Domain**: external-process spawning, HTTP fetch, third-party egress (foglift.io)
**Verdict**: GO — no CRITICAL, no blocking MAJOR. Fixes applied in e5f1d4a.

## Findings — Accepted + fixed (e5f1d4a)

- **MAJOR (Logic+Simplify, 2/3) — O(n²) file I/O.** `bodyFor()` re-read+parsed the whole blog dir per slug. Fixed: `articles()` reads once, returns `{slug, body}`.
- **MAJOR (Logic) — scanSchema timer leak.** `clearTimeout` only on the happy path; non-200 early-return left the AbortController timer running. Fixed: clear before the branch.
- **MAJOR (Logic) — a11y partial-data dishonesty.** `a11yViolationsTotal` summed only successful articles but presented as a full total. Fixed: returns `null` when coverage is partial (any unavailable/error).
- **MAJOR (Simplify) — aggregation in the page.** `flagged`/`geoIssueFreq` were inline in the server component. Fixed: moved to `lib/dashboard/quality.ts` (`flaggedArticles`, `topGeoIssues`, `WEAK_GEO`), unit-tested; page is thin.
- **MINOR (Security) — unvalidated `--base`.** Flows into fetch + foglift egress. Fixed: reject non-http(s), warn on private/loopback host.
- **MINOR (Security) — unconstrained scanned slug.** Fixed: `^[a-z0-9-]+$` guard before the slug enters a third-party URL.
- **MINOR (Security) — silent foglift egress.** Fixed: one-line notice before the `--geo` pass.
- **MINOR (Logic) — internal-link check missed anchors/query.** Fixed: regex resolves `/tipps/{slug}` through `#…`/`?…`/trailing slash.
- **MINOR (Simplify) — `geoScore`/`subScores` dead payload + 80/90 threshold split.** Fixed: dropped `subScores`, surfaced `geoScore` in the table, single `WEAK_GEO=80`.
- **MINOR (Logic) — React key collision** on `geoIssueFreq` titles. Fixed: `${title}-${count}` key.
- **COSMETIC (Logic) — log separator** `geo(ok0)` → `geo(ok 0)`. Fixed.

## Findings — Rejected / kept as-is (documented decisions)

- **lychee accepts 403/429** (Logic MINOR #9): kept. 403/429 = bot-blocking, not dead links; 404/410/5xx still flagged. Documented in code + runbook. (Don't re-flag.)
- **foglift-scan caret `^1.0.2`** (Security COSMETIC): kept. Lockfile is committed; `npm ci` reproducibility. (Don't re-flag.)
- **reference-style markdown links not parsed** (Logic MINOR #5): kept. The generator never emits them; a code comment makes the limitation explicit.
- **Slug-derivation triplication** (Simplify COSMETIC #6): kept. Each consumer needs a different shape (slug list vs valid-slug Set incl. drafts vs hardcoded-only); a shared helper would add more coupling than the ~6 duplicated lines cost. (Don't re-flag.)

## Confirmed safe (Security, explicitly checked)
No shell injection (spawnSync array form, no `shell:true`), no XSS (no dangerouslySetInnerHTML in scope; href is `${base}/tipps/${slug}`), no secret leakage (UA-only fetch, gitignored report), DoS bounds set (timeout + maxBuffer on every spawn, AbortController on fetch).

## Praise
Pure parsers split from spawn shells (testable seams), `getQualityReport()` mirrors the `.indexation.json` reader, graceful-degrade contract held everywhere, pa11y-as-opt-in (§15 no-Ballast) well-reasoned.
