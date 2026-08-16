# Local-Rank Tracker (Google Business Profile · Wien)

Read-only measurement foundation for the GBP automation: where does "Red Rabbit GmbH"
rank in Google's Local Pack / Maps across a geographic grid over Vienna, and how healthy
are our reviews. Feeds the dashboard tab **Local (GBP)**. Nothing here writes to the live
profile — the guiding principle for the whole GBP project is **Draft → Freigabe → publish**.

## What it does

- **Grid rank tracking.** A 7×7 grid (≈600 m spacing, ~3.6 km across) centred on the office
  (Habsburgergasse 8, 1010 Wien; geocode 48.208590, 16.368577 — verified via OSM Nominatim +
  Photon, 2026-08-16). For each of 4 buyer keywords it records our organic Local-Finder
  position at each point, then computes:
  - **SoLV** (Share of Local Voice) — share of points in the local **Top 3**. The headline metric.
  - **ATRP** (Average Total Rank Position) — mean rank over **all** points, unranked counted as 21.
  - **ARP** (Average Rank Position) — mean rank over the points where we are found.
  - A green (≤3) / yellow (4–10) / red (11+/unranked) heatmap per keyword.
- **Review health.** Volume, average rating, 30/90-day velocity, recency, response rate,
  average response time, and the list of still-unanswered reviews. (These — not keywords in
  review text — are the real ranking levers: Sterling Sky causal testing, 2025.)
- **Outreach engine (preview).** Compliant two-touch review ask + reply drafts (see Compliance).

## Files

- `lib/localrank/` — pure logic (grid geometry, KPI math, review health, outreach, signals) + tests.
- `lib/dashboard/localRank.ts` — read-only data layer the dashboard tab consumes.
- `app/dashboard/local-rank/page.tsx` — the dashboard tab.
- `lib/localrank/gbpClient.ts` — fail-closed token client for the (free) GBP APIs (raw REST for v4 reviews).
- `lib/localrank/reviewsParse.ts` / `performance.ts` — pure parsers (v4 reviews + Performance API), unit-tested.
- `scripts/content-engine/local-rank/reviews-pull.ts` — reviews puller (free GBP API) → `reviews.json`.
- `scripts/content-engine/local-rank/performance-pull.ts` — Performance puller (free GBP API) → `performance.json`.
- `scripts/content-engine/local-rank/provider.ts` / `pull.ts` — grid puller (`RankProvider`: browser/DataForSEO/Fixture).
- `content-engine/local-rank/{demo,latest,reviews,performance}.json` — snapshots (real supersede demo; none = EmptyState).

## The free plan (no paid service, no credit card)

Thomas refuses any paid service. So:

1. **Sichtbarkeit — automated backbone = Performance API (free, official, no ToS issue).** Impressions
   (Maps/Search × desktop/mobile), calls, website clicks, directions, and the real search terms people
   used. This directly measures "getting found more" and needs no scraping. → `npm run gbp:performance`.
2. **Reviews — free GBP v4 API.** Volume, velocity, response rate, unanswered list + human-approved replies.
   → `npm run gbp:reviews`.
3. **Copy** (post drafts, review replies, profile texts) — the Claude subscription (`claude -p`, 0 API cost),
   same as the blog engine.
4. **Grid rank (position) — optional, free, on-demand only.** There is NO free official rank API. The only
   free way is self-driving a logged-in Chrome to Google Maps `.../maps/search/<kw>/@<lat>,<lng>,<zoom>z`
   and reading the result order — ToS grey area, CAPTCHA risk at volume. So the grid stays a **manual,
   low-volume browser check** (stop on the first CAPTCHA, never bypass bot-protection). The paid
   `DataForSeoProvider` remains in the code as a dormant option but is **not used** (costs money).

### Setup (once) → then it just works
See **`GBP-API-SETUP.md`** for the click-path. Short version: enable 4 free APIs → request "Basic API
Access" (free, ~3–10 days) → `npm run gbp:auth` (one Google login, scope `business.manage`). After
Google's approval the two pullers write real data and the dashboard lights up. No card at any step.

```bash
npm run gbp:auth          # one-time Google login (GSC + GA4 + GBP in one consent)
npm run gbp:performance   # → performance.json (after Basic Access approval)
npm run gbp:reviews       # → reviews.json
npm run local-rank -- --demo   # grid demo (fixture, 0 cost); live grid = browser check, see above
```

All pullers are **fail-closed**: without the token / before approval they print a hint and write nothing.

Env (server-only, `.env.local`, never committed): `RR_GBP_ACCOUNT_ID`, `RR_GBP_LOCATION_ID`,
`RR_GBP_PLACE_ID` (optional — skip the discovery call + build the review deep link).

## Scheduling (later — not auto-enabled)

Same pattern as the blog engine: **weekly, at an irregular off-peak time**, from the Mac bot-worktree
(`~/dev/redrabbit-daily`, always `main`) or the `redrabbit-blog` systemd timer on the VPS. All pullers are
read-only; nothing edits the profile or sends without approval.

## Review compliance (hard rules — Google review policy Apr-2026 + AT-UWG Anh. Z 23b/c, EU-RL 2019/2161)

- Ask **every** finished customer — never pre-filter by expected sentiment (no gating).
- **No incentives**, no asking for staff names, no dictating the wording.
- **Open questions only**, so the customer writes in their own words.
- The follow-up must carry the anti-gating line ("Egal ob positiv oder kritisch …").
- **Never** batch-mail old customers (spam filter). One ask (T+2) + one follow-up (T+12).
- Reply to **every** review within 1–2 days; replies are personal and human-approved before send.

Violations risk fines up to 4% of turnover and profile suspension. The engine encodes these
rules; a human still approves every outgoing mail and every reply.
