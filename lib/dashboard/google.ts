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

// GSC data lags ~2 days; ending the window a day back avoids a misleadingly empty tail.
function gscRange(days: number): { startDate: string; endDate: string } {
    const end = new Date(Date.now() - 1 * 86400000);
    const start = new Date(Date.now() - (days + 1) * 86400000);
    return { startDate: ymd(start), endDate: ymd(end) };
}

function round1(n: number): number {
    return Math.round(n * 10) / 10;
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
        const msg = e instanceof Error ? e.message : String(e);
        return { state: 'error', message: msg };
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

        const [summary, pages, channels] = await Promise.all([
            ga.properties.runReport({
                property,
                requestBody: {
                    dateRanges: [{ startDate: range, endDate: 'today' }],
                    metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }, { name: 'engagementRate' }, { name: 'averageSessionDuration' }],
                },
            }),
            ga.properties.runReport({
                property,
                requestBody: {
                    dateRanges: [{ startDate: range, endDate: 'today' }],
                    dimensions: [{ name: 'pagePath' }],
                    metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
                    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
                    limit: '25',
                },
            }),
            ga.properties.runReport({
                property,
                requestBody: {
                    dateRanges: [{ startDate: range, endDate: 'today' }],
                    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
                    metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
                    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
                    limit: '12',
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
            },
        };
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return { state: 'error', message: msg };
    }
}
