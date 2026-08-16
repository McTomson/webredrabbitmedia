/*
 * Performance puller — the free, ToS-clean visibility signal. Reads the Business Profile
 * Performance API (impressions on Maps/Search desktop+mobile, calls, website clicks,
 * directions, conversations) + the search terms people used to find us, and writes
 * content-engine/local-rank/performance.json for the dashboard. READ-ONLY.
 *
 *   npx tsx scripts/content-engine/local-rank/performance-pull.ts [days]   # default 30
 *
 * Fail-closed like reviews-pull. No rank/position (the API has none) — this measures
 * "how often were we seen and acted on", the honest free complement to the grid.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadDotEnvLocal } from './env';
import { getAccessToken, resolveTarget, gbpGet, safeGbpError, GBP_HOSTS } from '../../../lib/localrank/gbpClient';
import { PERF_METRICS, parseMultiMetrics, parseSearchKeywords, type MultiMetricsResponse, type SearchKeywordsResponse, type PerformanceSnapshot } from '../../../lib/localrank/performance';

const OUT = path.join(process.cwd(), 'content-engine/local-rank/performance.json');

function ymd(d: Date) {
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

async function main() {
    loadDotEnvLocal();
    const days = Number(process.argv[2]) || 30;
    const token = await getAccessToken();
    if (!token) {
        console.log('[performance] Kein Google-Token. Einrichtung: npx tsx scripts/content-engine/dashboard/google_auth.ts (Scope business.manage). Siehe GBP-API-SETUP.md.');
        return;
    }
    try {
        const { locationId } = await resolveTarget(token);
        // Performance data lags ~2-3 days; window ends 3 days ago.
        const end = new Date(Date.now() - 3 * 86400000);
        const start = new Date(end.getTime() - days * 86400000);
        const s = ymd(start);
        const e = ymd(end);

        // Daily metrics (multi) — repeated dailyMetrics + a daily_range.
        const metricParams = PERF_METRICS.map((m) => `dailyMetrics=${m}`).join('&');
        const rangeParams =
            `dailyRange.start_date.year=${s.year}&dailyRange.start_date.month=${s.month}&dailyRange.start_date.day=${s.day}` +
            `&dailyRange.end_date.year=${e.year}&dailyRange.end_date.month=${e.month}&dailyRange.end_date.day=${e.day}`;
        const metricsUrl = `${GBP_HOSTS.performance}/locations/${locationId}:fetchMultiDailyMetricsTimeSeries?${metricParams}&${rangeParams}`;
        const metricsResp = await gbpGet<MultiMetricsResponse>(token, metricsUrl);
        const metrics = parseMultiMetrics(metricsResp);

        // Search keywords (monthly) — last full month.
        const km = ymd(new Date(end.getFullYear(), end.getMonth() - 1, 1));
        const kwUrl = `${GBP_HOSTS.performance}/locations/${locationId}/searchkeywords/impressions/monthly?monthlyRange.start_month.year=${km.year}&monthlyRange.start_month.month=${km.month}&monthlyRange.end_month.year=${e.year}&monthlyRange.end_month.month=${e.month}`;
        let keywords: PerformanceSnapshot['keywords'] = [];
        try {
            const kwResp = await gbpGet<SearchKeywordsResponse>(token, kwUrl);
            keywords = parseSearchKeywords(kwResp).slice(0, 25);
        } catch (e2) {
            console.warn('[performance] Suchbegriffe nicht abrufbar:', safeGbpError(e2));
        }

        const snapshot: PerformanceSnapshot = { takenAt: new Date().toISOString(), source: 'gbp', rangeDays: days, metrics, keywords };
        fs.mkdirSync(path.dirname(OUT), { recursive: true });
        fs.writeFileSync(OUT, JSON.stringify(snapshot, null, 2));
        console.log(`[performance] ${metrics.length} Metriken, ${keywords.length} Suchbegriffe → ${path.relative(process.cwd(), OUT)}`);
    } catch (e) {
        console.error('[performance] Fehler:', safeGbpError(e));
        process.exit(1);
    }
}

main();
