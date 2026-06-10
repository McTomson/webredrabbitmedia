import { describe, it, expect } from 'vitest';
import { buildHealthSignals, worstLevel, type HealthInput } from './health';
import type { VisibilityTrend } from './google';

function trend(imprCur: number, imprPrev: number): VisibilityTrend {
    const dpct = imprPrev > 0 ? Math.round(((imprCur - imprPrev) / imprPrev) * 1000) / 10 : imprCur > 0 ? 100 : 0;
    return {
        rangeDays: 7,
        clicks: { current: 0, previous: 0, deltaPct: 0 },
        impressions: { current: imprCur, previous: imprPrev, deltaPct: dpct },
    };
}

const base: HealthInput = { trend: null, newestArticleAgeDays: 1, lastDailyRunOk: true, liveArticles: 20 };
const find = (input: HealthInput, id: string) => buildHealthSignals(input).find((s) => s.id === id);

describe('buildHealthSignals — pipeline dead-man', () => {
    it('ok when an article is fresh', () => {
        expect(find({ ...base, newestArticleAgeDays: 1 }, 'pipeline')?.level).toBe('ok');
    });
    it('warns after 3 days', () => {
        expect(find({ ...base, newestArticleAgeDays: 5 }, 'pipeline')?.level).toBe('warn');
    });
    it('alerts after 7 days', () => {
        expect(find({ ...base, newestArticleAgeDays: 9 }, 'pipeline')?.level).toBe('alert');
    });
    it('omits the pipeline signal when age is unknown', () => {
        expect(find({ ...base, newestArticleAgeDays: null }, 'pipeline')).toBeUndefined();
    });
});

describe('buildHealthSignals — daily run', () => {
    it('alerts on a failed run', () => {
        expect(find({ ...base, lastDailyRunOk: false }, 'dailyrun')?.level).toBe('alert');
    });
    it('omits when no local log (unknown)', () => {
        expect(find({ ...base, lastDailyRunOk: null }, 'dailyrun')).toBeUndefined();
    });
});

describe('buildHealthSignals — visibility / penalty', () => {
    it('flags info when previous impressions are below the noise floor', () => {
        expect(find({ ...base, trend: trend(10, 20) }, 'visibility')?.level).toBe('info');
    });
    it('alerts on a >=40% impression drop with enough data', () => {
        expect(find({ ...base, trend: trend(50, 100) }, 'visibility')?.level).toBe('alert');
    });
    it('warns on a 20-40% drop', () => {
        expect(find({ ...base, trend: trend(75, 100) }, 'visibility')?.level).toBe('warn');
    });
    it('ok when stable or growing', () => {
        expect(find({ ...base, trend: trend(120, 100) }, 'visibility')?.level).toBe('ok');
    });
    it('warns on indexation gap: live articles but zero impressions', () => {
        expect(find({ ...base, trend: trend(0, 100), liveArticles: 20 }, 'indexation')?.level).toBe('warn');
    });
    it('no indexation signal when there are no live articles', () => {
        expect(find({ ...base, trend: trend(0, 100), liveArticles: 0 }, 'indexation')).toBeUndefined();
    });
});

describe('worstLevel', () => {
    it('returns the loudest level present', () => {
        expect(worstLevel([{ id: 'a', level: 'ok', title: '', detail: '' }, { id: 'b', level: 'alert', title: '', detail: '' }])).toBe('alert');
    });
    it('is ok for an empty list', () => {
        expect(worstLevel([])).toBe('ok');
    });
});
