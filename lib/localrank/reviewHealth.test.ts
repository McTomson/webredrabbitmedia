import { describe, it, expect } from 'vitest';
import { computeReviewHealth } from './reviewHealth';
import type { ReviewItem } from './types';

const NOW = new Date('2026-08-16T12:00:00Z');
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString();

describe('computeReviewHealth', () => {
    it('empty is neutral', () => {
        expect(computeReviewHealth([], NOW)).toMatchObject({ total: 0, avgRating: null, daysSinceLast: null, responseRate: 0, unanswered: [] });
    });

    it('computes count, avg rating, velocity and recency', () => {
        const reviews: ReviewItem[] = [
            { id: '1', rating: 5, createdAt: daysAgo(5) },
            { id: '2', rating: 4, createdAt: daysAgo(20) },
            { id: '3', rating: 5, createdAt: daysAgo(200) },
        ];
        const h = computeReviewHealth(reviews, NOW);
        expect(h.total).toBe(3);
        expect(h.avgRating).toBeCloseTo((5 + 4 + 5) / 3, 1);
        expect(h.last30).toBe(2); // 5 and 20 days
        expect(h.last90).toBe(2);
        expect(h.daysSinceLast).toBe(5);
    });

    it('computes response rate, avg response time and unanswered list (newest first)', () => {
        const reviews: ReviewItem[] = [
            { id: 'a', rating: 5, createdAt: daysAgo(10), reply: { createdAt: daysAgo(8) } }, // 2-day response
            { id: 'b', rating: 2, createdAt: daysAgo(3) }, // unanswered, newer
            { id: 'c', rating: 4, createdAt: daysAgo(30) }, // unanswered, older
        ];
        const h = computeReviewHealth(reviews, NOW);
        expect(h.responseRate).toBeCloseTo(1 / 3, 5);
        expect(h.avgResponseDays).toBeCloseTo(2, 1);
        expect(h.unanswered.map((r) => r.id)).toEqual(['b', 'c']); // newest unanswered first
    });
});
