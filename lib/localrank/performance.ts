// Pure parsing + types for the (free) Business Profile Performance API. Separated
// from the network call so it is unit-testable. The Performance API reports how often
// we were seen and acted on (impressions/clicks/calls/directions) plus the search
// terms people used — the free, ToS-clean visibility signal. It has NO rank/position.

/** Metrics we pull. Verified against the v1 DailyMetric enum (2026-08-16). */
export const PERF_METRICS = [
    'BUSINESS_IMPRESSIONS_DESKTOP_MAPS',
    'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH',
    'BUSINESS_IMPRESSIONS_MOBILE_MAPS',
    'BUSINESS_IMPRESSIONS_MOBILE_SEARCH',
    'CALL_CLICKS',
    'WEBSITE_CLICKS',
    'BUSINESS_DIRECTION_REQUESTS',
    'BUSINESS_CONVERSATIONS',
] as const;

export interface MetricPoint {
    date: string; // YYYY-MM-DD
    value: number;
}
export interface MetricSeries {
    metric: string;
    total: number;
    points: MetricPoint[];
}
export interface KeywordCount {
    keyword: string;
    value: number;
    /** true when the API returned a lower-bound threshold instead of an exact count. */
    isThreshold: boolean;
}
export interface PerformanceSnapshot {
    takenAt: string;
    source: 'gbp' | 'demo' | string;
    rangeDays: number;
    metrics: MetricSeries[];
    keywords: KeywordCount[];
}

// ── Response shapes (subset) ────────────────────────────────────────────────
interface ApiDate {
    year?: number;
    month?: number;
    day?: number;
}
interface DatedValue {
    date?: ApiDate;
    value?: string | number;
}
interface DailyMetricTimeSeries {
    dailyMetric?: string;
    timeSeries?: { datedValues?: DatedValue[] };
}
export interface MultiMetricsResponse {
    multiDailyMetricTimeSeries?: Array<{ dailyMetricTimeSeries?: DailyMetricTimeSeries[] }>;
}
export interface SearchKeywordsResponse {
    searchKeywordsCounts?: Array<{ searchKeyword?: string; insightsValue?: { value?: string | number; threshold?: string | number } }>;
}

function fmtDate(d?: ApiDate): string {
    if (!d?.year || !d?.month || !d?.day) return '';
    return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
}

export function parseMultiMetrics(resp: MultiMetricsResponse): MetricSeries[] {
    const out: MetricSeries[] = [];
    for (const group of resp.multiDailyMetricTimeSeries ?? []) {
        for (const dms of group.dailyMetricTimeSeries ?? []) {
            if (!dms.dailyMetric) continue;
            const points: MetricPoint[] = (dms.timeSeries?.datedValues ?? [])
                .map((dv) => ({ date: fmtDate(dv.date), value: Number(dv.value ?? 0) || 0 }))
                .filter((p) => p.date)
                .sort((a, b) => a.date.localeCompare(b.date));
            out.push({ metric: dms.dailyMetric, total: points.reduce((s, p) => s + p.value, 0), points });
        }
    }
    return out;
}

export function parseSearchKeywords(resp: SearchKeywordsResponse): KeywordCount[] {
    return (resp.searchKeywordsCounts ?? [])
        .map((k) => {
            const iv = k.insightsValue ?? {};
            const exact = iv.value != null ? Number(iv.value) : null;
            const thr = iv.threshold != null ? Number(iv.threshold) : null;
            return { keyword: k.searchKeyword ?? '(unbekannt)', value: exact ?? thr ?? 0, isThreshold: exact == null && thr != null };
        })
        .sort((a, b) => b.value - a.value);
}

/** Sum impression metrics into one headline "seen" number. */
export function totalImpressions(metrics: MetricSeries[]): number {
    return metrics.filter((m) => m.metric.startsWith('BUSINESS_IMPRESSIONS')).reduce((s, m) => s + m.total, 0);
}

/** Look up one metric's total by name (0 when absent). */
export function metricTotal(metrics: MetricSeries[], name: string): number {
    return metrics.find((m) => m.metric === name)?.total ?? 0;
}
