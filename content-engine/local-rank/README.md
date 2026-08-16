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
- `scripts/content-engine/local-rank/provider.ts` — `RankProvider` (DataForSEO + Fixture).
- `scripts/content-engine/local-rank/pull.ts` — the puller CLI.
- `content-engine/local-rank/latest.json` — real snapshot (written by a live pull; supersedes demo).
- `content-engine/local-rank/demo.json` — synthetic snapshot so the tab has something to show.
- `content-engine/local-rank/reviews.json` — real review snapshot (written once the API is wired).

## Running

```bash
npx tsx scripts/content-engine/local-rank/pull.ts --dry    # print grid + cost estimate, no calls
npx tsx scripts/content-engine/local-rank/pull.ts --demo   # regenerate demo.json (fixture, no cost)
npx tsx scripts/content-engine/local-rank/pull.ts          # LIVE (needs DataForSEO creds) → latest.json
```

The puller is **fail-closed**: without `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD` it falls back
to the fixture provider and writes `demo.json`, never a fake `latest.json`.

## Going live — credentials (all server-only, `.env.local` or the VPS `.env`, never committed)

| Var | Unlocks | Notes |
|-----|---------|-------|
| `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD` | real grid measurements | DataForSEO Live Maps SERP, HTTP Basic. ~$0.002 / SERP → 49 points × 4 keywords = **~$0.39 per weekly pull**. DataForSEO handles scraping/proxying, so we stay ToS-safe (no self-scraping of Google). |
| `RR_GBP_PLACE_ID` | exact listing match + review deep link | Google Place ID of the GBP listing. Without it we match by name substring (less reliable). |
| Business Profile API (OAuth `business.manage`) | real review velocity/response-rate + reply drafts | Needs a Google-Cloud project + "Basic API Access" request (3–10 business days) and Thomas's Google login. Reuses the `googleapis` OAuth pattern in `lib/dashboard/google.ts`. Profile must be verified + ~60 days active. |

Optional overrides: `RR_LOCALRANK_LAT` / `RR_LOCALRANK_LNG` (test another centre).

## Scheduling (later — not auto-enabled)

Same pattern as the blog engine: **weekly, at an irregular off-peak time**. Either a launchd
job from the Mac bot-worktree (`~/dev/redrabbit-daily`, always `main`) or the `redrabbit-blog`
systemd-timer Docker oneshot on the IONOS VPS. The puller only reads Google via DataForSEO; it
never edits the profile. A history copy is kept in `content-engine/local-rank/history/<date>.json`
so the dashboard can later show a trend.

## Review compliance (hard rules — Google review policy Apr-2026 + AT-UWG Anh. Z 23b/c, EU-RL 2019/2161)

- Ask **every** finished customer — never pre-filter by expected sentiment (no gating).
- **No incentives**, no asking for staff names, no dictating the wording.
- **Open questions only**, so the customer writes in their own words.
- The follow-up must carry the anti-gating line ("Egal ob positiv oder kritisch …").
- **Never** batch-mail old customers (spam filter). One ask (T+2) + one follow-up (T+12).
- Reply to **every** review within 1–2 days; replies are personal and human-approved before send.

Violations risk fines up to 4% of turnover and profile suspension. The engine encodes these
rules; a human still approves every outgoing mail and every reply.
