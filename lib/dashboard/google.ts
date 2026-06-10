import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { google } from 'googleapis';

// ──────────────────────────────────────────────────────────────────────────
// Local-only dashboard data layer for Google Search Console + GA4.
//
// Reuses the OAuth refresh token that `scripts/content-engine/dashboard/google_auth.ts`
// stored under ~/.config/redrabbit-dashboard (owner account thomas.uhlir@gmail.com —
// a personal Gmail cannot add service accounts as a GSC user, so we use OAuth).
//
// The dashboard route is hidden in production (notFound unless DASHBOARD_ENABLED),
// so these creds are only ever read on the local machine. Every fetch is wrapped so a
// missing token / revoked grant / API error degrades to a typed "not configured" or
// "error" result and a friendly UI message instead of a 500.
// ──────────────────────────────────────────────────────────────────────────

const CFG = path.join(os.homedir(), '.config/redrabbit-dashboard');
const SITE = process.env.GSC_SITE_URL || 'https://web.redrabbit.media';
const GA4 = process.env.GA4_PROPERTY_ID || '519842891';

export type Loaded<T> =
    | { state: 'ok'; data: T }
    | { state: 'unconfigured'; message: string }
    | { state: 'error'; message: string };

function authClient() {
    const clientPath = path.join(CFG, 'oauth_client.json');
    const tokenPath = path.join(CFG, 'token.json');
    if (!fs.existsSync(clientPath) || !fs.existsSync(tokenPath)) {
        return null;
    }
    const c = JSON.parse(fs.readFileSync(clientPath, 'utf8'));
    const cc = c.installed || c.web || c;
    const tok = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
    const o = new google.auth.OAuth2(cc.client_id, cc.client_secret);
    o.setCredentials(tok);
    return o;
}

function ymd(d: Date): string {
    return d.toISOString().slice(0, 10);
}

// GSC data lags ~2 days; the window ends yesterday and spans exactly `days` inclusive days
// (start = days ago, end = yesterday → e.g. days=28 yields 28 calendar days). GA4 uses the
// matching `${days}daysAgo`..yesterday so both sources show the same closed period.
function gscRange(days: number): { startDate: string; endDate: string } {
    const end = new Date(Date.now() - 1 * 86400000);
    const start = new Date(Date.now() - days * 86400000);
    return { startDate: ymd(start), endDate: ymd(end) };
}

function round1(n: number): number {
    return Math.round(n * 10) / 10;
}

// Never surface raw token/secret material in a UI error box (the dashboard is local,
// but a screenshot/bug report could otherwise leak credentials). Map known auth failures
// to a friendly hint and redact token-like query params from anything else.
function safeErrorMessage(e: unknown): string {
    const raw = e instanceof Error ? e.message : String(e);
    if (/invalid_grant|unauthorized|\b401\b/i.test(raw)) {
        return 'OAuth-Token abgelaufen oder widerrufen — bitte scripts/content-engine/dashboard/google_auth.ts erneut ausführen.';
    }
    return raw.replace(/(access_token|refresh_token|client_secret|id_token)=[^&\s]+/gi, '$1=***');
}

// ── Search Console ─────────────────────────────────────────────────────────

export interface GscRow {
    key: string;
    clicks: number;
    impressions: number;
    ctr: number; // 0..1
    position: number;
}

export interface SearchConsoleData {
    site: string;
    rangeDays: number;
    startDate: string;
    endDate: string;
    totals: { clicks: number; impressions: number; ctr: number; position: number };
    topQueries: GscRow[];
    topPages: GscRow[];
    // Queries ranked 8–20: already on/near page 1, small push = real traffic. The #1 daily lever.
    strikingDistance: GscRow[];
}

function mapRows(rows: Array<{ keys?: string[] | null; clicks?: number | null; impressions?: number | null; ctr?: number | null; position?: number | null }>): GscRow[] {
    return rows.map((r) => ({
        key: r.keys?.[0] ?? '(unbekannt)',
        clicks: r.clicks ?? 0,
        impressions: r.impressions ?? 0,
        ctr: r.ctr ?? 0,
        position: round1(r.position ?? 0),
    }));
}

export async function getSearchConsoleData(days = 28): Promise<Loaded<SearchConsoleData>> {
    const auth = authClient();
    if (!auth) {
        return { state: 'unconfigured', message: `Keine Google-Zugangsdaten unter ${CFG} gefunden. Einrichtung: scripts/content-engine/dashboard/google_auth.ts` };
    }
    const { startDate, endDate } = gscRange(days);
    try {
        const sc = google.webmasters({ version: 'v3', auth });
        const base = { siteUrl: SITE };

        const [byQuery, byPage] = await Promise.all([
            sc.searchanalytics.query({ ...base, requestBody: { startDate, endDate, dimensions: ['query'], rowLimit: 250 } }),
            sc.searchanalytics.query({ ...base, requestBody: { startDate, endDate, dimensions: ['page'], rowLimit: 25 } }),
        ]);

        const queryRows = mapRows(byQuery.data.rows || []);
        const pageRows = mapRows(byPage.data.rows || []);

        const totals = queryRows.reduce(
            (acc, r) => {
                acc.clicks += r.clicks;
                acc.impressions += r.impressions;
                return acc;
            },
            { clicks: 0, impressions: 0 },
        );
        const ctr = totals.impressions > 0 ? totals.clicks / totals.impressions : 0;
        // Impression-weighted average position across queries.
        const weightedPos = totals.impressions > 0 ? queryRows.reduce((s, r) => s + r.position * r.impressions, 0) / totals.impressions : 0;

        const strikingDistance = queryRows
            .filter((r) => r.position >= 8 && r.position <= 20 && r.impressions >= 5)
            .sort((a, b) => b.impressions - a.impressions)
            .slice(0, 25);

        return {
            state: 'ok',
            data: {
                site: SITE,
                rangeDays: days,
                startDate,
                endDate,
                totals: { clicks: totals.clicks, impressions: totals.impressions, ctr, position: round1(weightedPos) },
                topQueries: queryRows.slice(0, 25),
                topPages: pageRows,
                strikingDistance,
            },
        };
    } catch (e: unknown) {
        return { state: 'error', message: safeErrorMessage(e) };
    }
}

// ── Visibility trend (current period vs the period directly before it) ───────
// Powers the dead-man / penalty alarm: a sharp drop in impressions week-over-week
// is the earliest sign of a Google penalty, deindexing, or a broken pipeline.

export interface TrendMetric {
    current: number;
    previous: number;
    deltaPct: number; // (current - previous) / previous * 100; 0 if both were 0
}

export interface VisibilityTrend {
    rangeDays: number;
    clicks: TrendMetric;
    impressions: TrendMetric;
}

function deltaPct(current: number, previous: number): number {
    if (previous > 0) return round1(((current - previous) / previous) * 100);
    return current > 0 ? 100 : 0;
}

export async function getVisibilityTrend(days = 7): Promise<Loaded<VisibilityTrend>> {
    const auth = authClient();
    if (!auth) {
        return { state: 'unconfigured', message: `Keine Google-Zugangsdaten unter ${CFG} gefunden.` };
    }
    // current: [now-days .. now-1]; previous: [now-2*days .. now-days-1] (same length, directly before).
    const curEnd = ymd(new Date(Date.now() - 1 * 86400000));
    const curStart = ymd(new Date(Date.now() - days * 86400000));
    const prevEnd = ymd(new Date(Date.now() - (days + 1) * 86400000));
    const prevStart = ymd(new Date(Date.now() - 2 * days * 86400000));
    try {
        const sc = google.webmasters({ version: 'v3', auth });
        const [cur, prev] = await Promise.all([
            sc.searchanalytics.query({ siteUrl: SITE, requestBody: { startDate: curStart, endDate: curEnd, dimensions: [], rowLimit: 1 } }),
            sc.searchanalytics.query({ siteUrl: SITE, requestBody: { startDate: prevStart, endDate: prevEnd, dimensions: [], rowLimit: 1 } }),
        ]);
        const c = cur.data.rows?.[0] || {};
        const p = prev.data.rows?.[0] || {};
        const cClicks = c.clicks ?? 0;
        const pClicks = p.clicks ?? 0;
        const cImpr = c.impressions ?? 0;
        const pImpr = p.impressions ?? 0;
        return {
            state: 'ok',
            data: {
                rangeDays: days,
                clicks: { current: cClicks, previous: pClicks, deltaPct: deltaPct(cClicks, pClicks) },
                impressions: { current: cImpr, previous: pImpr, deltaPct: deltaPct(cImpr, pImpr) },
            },
        };
    } catch (e: unknown) {
        return { state: 'error', message: safeErrorMessage(e) };
    }
}

// ── Daily time series (for the trend sparklines) ────────────────────────────

export interface TimeseriesPoint {
    date: string; // YYYY-MM-DD
    clicks: number;
    impressions: number;
}

export async function getSearchConsoleTimeseries(days = 28): Promise<Loaded<TimeseriesPoint[]>> {
    const auth = authClient();
    if (!auth) {
        return { state: 'unconfigured', message: `Keine Google-Zugangsdaten unter ${CFG} gefunden.` };
    }
    const { startDate, endDate } = gscRange(days);
    try {
        const sc = google.webmasters({ version: 'v3', auth });
        const res = await sc.searchanalytics.query({ siteUrl: SITE, requestBody: { startDate, endDate, dimensions: ['date'], rowLimit: 500 } });
        const points = (res.data.rows || [])
            .map((r) => ({ date: r.keys?.[0] ?? '', clicks: r.clicks ?? 0, impressions: r.impressions ?? 0 }))
            .filter((p) => p.date)
            .sort((a, b) => a.date.localeCompare(b.date));
        return { state: 'ok', data: points };
    } catch (e: unknown) {
        return { state: 'error', message: safeErrorMessage(e) };
    }
}

// ── Indexation (GSC URL Inspection) — powers the kill-switch ─────────────────

export interface UrlIndexState {
    url: string;
    indexed: boolean;
    state: string; // GSC coverageState text, or the failure reason
}

export interface IndexationStatus {
    total: number;
    indexed: number;
    rate: number; // 0..1
    perUrl: UrlIndexState[];
}

// Inspect each URL via the Search Console URL Inspection API (needs webmasters.readonly,
// which the stored token already has). Sequential + best-effort: a single failing URL
// counts as not-indexed rather than aborting the whole run. Quota is 2000/day — fine for
// a small article set. Slow (~1s/URL) → meant for a scheduled script, not live render.
export async function getIndexationStatus(urls: string[]): Promise<Loaded<IndexationStatus>> {
    const auth = authClient();
    if (!auth) {
        return { state: 'unconfigured', message: `Keine Google-Zugangsdaten unter ${CFG} gefunden.` };
    }
    // URL Inspection requires the EXACT verified property string. GSC URL-prefix
    // properties carry a trailing slash (the Search Analytics API is more lenient).
    const property = SITE.endsWith('/') ? SITE : `${SITE}/`;
    try {
        const sc = google.searchconsole({ version: 'v1', auth });
        const perUrl: UrlIndexState[] = [];
        for (const url of urls) {
            try {
                const res = await sc.urlInspection.index.inspect({ requestBody: { inspectionUrl: url, siteUrl: property } });
                const r = res.data.inspectionResult?.indexStatusResult;
                const coverage = r?.coverageState || 'unbekannt';
                const indexed = r?.verdict === 'PASS' || /indexed/i.test(coverage);
                perUrl.push({ url, indexed, state: coverage });
            } catch (e: unknown) {
                perUrl.push({ url, indexed: false, state: e instanceof Error ? e.message.slice(0, 80) : 'Fehler' });
            }
        }
        const indexed = perUrl.filter((u) => u.indexed).length;
        const total = perUrl.length;
        return { state: 'ok', data: { total, indexed, rate: total > 0 ? indexed / total : 0, perUrl } };
    } catch (e: unknown) {
        return { state: 'error', message: safeErrorMessage(e) };
    }
}

// ── Google Analytics 4 ───────────────────────────────────────────────────────

export interface Ga4Pair {
    key: string;
    sessions: number;
    users: number;
}

export interface AnalyticsData {
    propertyId: string;
    rangeDays: number;
    totals: { activeUsers: number; sessions: number; pageViews: number; engagementRate: number; avgSessionSec: number };
    topPages: Array<{ path: string; views: number; users: number }>;
    channels: Ga4Pair[];
    leads: number; // total generate_lead events (form submits) in range
    leadsByPage: Array<{ path: string; count: number }>; // "Anfragen pro Artikel"
}

export async function getAnalyticsData(days = 28): Promise<Loaded<AnalyticsData>> {
    const auth = authClient();
    if (!auth) {
        return { state: 'unconfigured', message: `Keine Google-Zugangsdaten unter ${CFG} gefunden. Einrichtung: scripts/content-engine/dashboard/google_auth.ts` };
    }
    const range = `${days}daysAgo`;
    try {
        const ga = google.analyticsdata({ version: 'v1beta', auth });
        const property = `properties/${GA4}`;

        const leadFilter = { filter: { fieldName: 'eventName', stringFilter: { value: 'generate_lead' } } };
        const [summary, pages, channels, leads] = await Promise.all([
            ga.properties.runReport({
                property,
                requestBody: {
                    dateRanges: [{ startDate: range, endDate: 'yesterday' }],
                    metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }, { name: 'engagementRate' }, { name: 'averageSessionDuration' }],
                },
            }),
            ga.properties.runReport({
                property,
                requestBody: {
                    dateRanges: [{ startDate: range, endDate: 'yesterday' }],
                    dimensions: [{ name: 'pagePath' }],
                    metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
                    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
                    limit: '25',
                },
            }),
            ga.properties.runReport({
                property,
                requestBody: {
                    dateRanges: [{ startDate: range, endDate: 'yesterday' }],
                    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
                    metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
                    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
                    limit: '12',
                },
            }),
            ga.properties.runReport({
                property,
                requestBody: {
                    dateRanges: [{ startDate: range, endDate: 'yesterday' }],
                    dimensions: [{ name: 'pagePath' }],
                    metrics: [{ name: 'eventCount' }],
                    dimensionFilter: leadFilter,
                    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
                    limit: '25',
                },
            }),
        ]);

        const m = summary.data.rows?.[0]?.metricValues || [];
        const num = (i: number) => Number(m[i]?.value ?? 0);

        const topPages = (pages.data.rows || []).map((r) => ({
            path: r.dimensionValues?.[0]?.value ?? '(unbekannt)',
            views: Number(r.metricValues?.[0]?.value ?? 0),
            users: Number(r.metricValues?.[1]?.value ?? 0),
        }));

        const channelRows: Ga4Pair[] = (channels.data.rows || []).map((r) => ({
            key: r.dimensionValues?.[0]?.value ?? '(unbekannt)',
            sessions: Number(r.metricValues?.[0]?.value ?? 0),
            users: Number(r.metricValues?.[1]?.value ?? 0),
        }));

        const leadsByPage = (leads.data.rows || []).map((r) => ({
            path: r.dimensionValues?.[0]?.value ?? '(unbekannt)',
            count: Number(r.metricValues?.[0]?.value ?? 0),
        }));
        const leadsTotal = leadsByPage.reduce((s, l) => s + l.count, 0);

        return {
            state: 'ok',
            data: {
                propertyId: GA4,
                rangeDays: days,
                totals: {
                    activeUsers: num(0),
                    sessions: num(1),
                    pageViews: num(2),
                    engagementRate: num(3),
                    avgSessionSec: num(4),
                },
                topPages,
                channels: channelRows,
                leads: leadsTotal,
                leadsByPage,
            },
        };
    } catch (e: unknown) {
        return { state: 'error', message: safeErrorMessage(e) };
    }
}
