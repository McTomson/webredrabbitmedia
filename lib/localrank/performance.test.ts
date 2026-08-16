import { describe, it, expect } from 'vitest';
import { parseMultiMetrics, parseSearchKeywords, totalImpressions, metricTotal, type MultiMetricsResponse, type SearchKeywordsResponse } from './performance';

const multi: MultiMetricsResponse = {
    multiDailyMetricTimeSeries: [
        {
            dailyMetricTimeSeries: [
                {
                    dailyMetric: 'WEBSITE_CLICKS',
                    timeSeries: {
                        datedValues: [
                            { date: { year: 2026, month: 8, day: 2 }, value: '3' },
                            { date: { year: 2026, month: 8, day: 1 }, value: '5' },
                        ],
                    },
                },
                {
                    dailyMetric: 'BUSINESS_IMPRESSIONS_MOBILE_MAPS',
                    timeSeries: { datedValues: [{ date: { year: 2026, month: 8, day: 1 }, value: 40 }] },
                },
            ],
        },
    ],
};

describe('parseMultiMetrics', () => {
    it('sorts points by date, sums totals, coerces values', () => {
        const series = parseMultiMetrics(multi);
        const wc = series.find((s) => s.metric === 'WEBSITE_CLICKS')!;
        expect(wc.points.map((p) => p.date)).toEqual(['2026-08-01', '2026-08-02']); // sorted
        expect(wc.total).toBe(8);
    });
    it('drops points with an incomplete date', () => {
        const r = parseMultiMetrics({ multiDailyMetricTimeSeries: [{ dailyMetricTimeSeries: [{ dailyMetric: 'CALL_CLICKS', timeSeries: { datedValues: [{ date: { year: 2026, month: 8 }, value: '9' }] } }] }] });
        expect(r[0].points).toHaveLength(0);
        expect(r[0].total).toBe(0);
    });
    it('handles an empty response', () => {
        expect(parseMultiMetrics({})).toEqual([]);
    });
});

describe('totalImpressions / metricTotal', () => {
    it('sums only impression metrics', () => {
        const series = parseMultiMetrics(multi);
        expect(totalImpressions(series)).toBe(40); // only the impressions metric
        expect(metricTotal(series, 'WEBSITE_CLICKS')).toBe(8);
        expect(metricTotal(series, 'NOPE')).toBe(0);
    });
});

describe('parseSearchKeywords', () => {
    it('parses exact + threshold values and sorts desc', () => {
        const resp: SearchKeywordsResponse = {
            searchKeywordsCounts: [
                { searchKeyword: 'webagentur wien', insightsValue: { threshold: '15' } },
                { searchKeyword: 'webdesigner wien', insightsValue: { value: '42' } },
            ],
        };
        const k = parseSearchKeywords(resp);
        expect(k[0]).toEqual({ keyword: 'webdesigner wien', value: 42, isThreshold: false });
        expect(k[1]).toEqual({ keyword: 'webagentur wien', value: 15, isThreshold: true });
    });
});
