import { describe, it, expect } from 'vitest';
import { buildLocalSignals } from './signals';
import { computeKpis } from './kpi';
import type { LocalRankSnapshot, ReviewHealth, RankCell } from './types';

const cells = (ranks: (number | null)[]): RankCell[] => ranks.map((rank, i) => ({ pointId: `p${i}`, row: 0, col: i, rank }));

function snap(ranks: (number | null)[]): LocalRankSnapshot {
    const c = cells(ranks);
    const kpis = computeKpis(c);
    return {
        takenAt: '2026-08-16T00:00:00Z', source: 'demo', center: { lat: 48.2, lng: 16.37, label: 'x' },
        gridSize: 1, spacingKm: 0.6, scanDepth: 20,
        keywords: [{ keyword: 'webdesign wien', cells: c, kpis }],
        overall: kpis,
    };
}

const review = (over: Partial<ReviewHealth> = {}): ReviewHealth => ({
    total: 8, avgRating: 5, last30: 0, last90: 1, daysSinceLast: 20, responseRate: 1, avgResponseDays: 2, unanswered: [], ...over,
});

const find = (s: ReturnType<typeof buildLocalSignals>, id: string) => s.find((x) => x.id === id);

describe('buildLocalSignals — grid', () => {
    it('alerts when SoLV is near zero', () => {
        const s = buildLocalSignals(snap([15, null, 18, null]), null);
        expect(find(s, 'solv')?.level).toBe('alert');
    });
    it('warns on a low but non-zero SoLV', () => {
        // 1 of 5 in top3 = 20% → warn
        expect(find(buildLocalSignals(snap([2, 7, 12, null, 9]), null), 'solv')?.level).toBe('warn');
    });
    it('ok when SoLV is healthy', () => {
        expect(find(buildLocalSignals(snap([1, 2, 3, 4]), null), 'solv')?.level).toBe('ok');
    });
    it('no grid signal without a snapshot', () => {
        expect(find(buildLocalSignals(null, review()), 'solv')).toBeUndefined();
    });
});

describe('buildLocalSignals — reviews', () => {
    it('warns on stalled velocity (no new review, long gap)', () => {
        expect(find(buildLocalSignals(null, review({ last30: 0, daysSinceLast: 60 })), 'review-velocity')?.level).toBe('warn');
    });
    it('info (not warn) on a short recent gap', () => {
        expect(find(buildLocalSignals(null, review({ last30: 0, daysSinceLast: 20 })), 'review-velocity')?.level).toBe('info');
    });
    it('ok when new reviews arrived', () => {
        expect(find(buildLocalSignals(null, review({ last30: 2 })), 'review-velocity')?.level).toBe('ok');
    });
    it('warns on unanswered reviews', () => {
        const un = review({ unanswered: [{ id: 'x', rating: 4, createdAt: '2026-08-10' }] });
        expect(find(buildLocalSignals(null, un), 'review-responses')?.level).toBe('warn');
    });
    it('ok when all answered', () => {
        expect(find(buildLocalSignals(null, review({ unanswered: [] })), 'review-responses')?.level).toBe('ok');
    });
});
