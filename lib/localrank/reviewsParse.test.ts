import { describe, it, expect } from 'vitest';
import { mapReview, mapReviews, type V4Review } from './reviewsParse';

describe('mapReview', () => {
    it('maps a full v4 review incl. reply', () => {
        const v4: V4Review = {
            reviewId: 'abc',
            reviewer: { displayName: 'Anna B.' },
            starRating: 'FIVE',
            comment: 'Top Arbeit',
            createTime: '2026-08-01T10:00:00Z',
            reviewReply: { comment: 'Danke!', updateTime: '2026-08-02T09:00:00Z' },
        };
        expect(mapReview(v4)).toEqual({
            id: 'abc',
            rating: 5,
            createdAt: '2026-08-01T10:00:00Z',
            author: 'Anna B.',
            comment: 'Top Arbeit',
            reply: { createdAt: '2026-08-02T09:00:00Z' },
        });
    });

    it('maps a review without reply (unanswered)', () => {
        const m = mapReview({ reviewId: 'x', starRating: 'THREE', createTime: '2026-08-05T00:00:00Z' });
        expect(m?.rating).toBe(3);
        expect(m?.reply).toBeUndefined();
    });

    it('drops entries missing id or star rating', () => {
        expect(mapReview({ starRating: 'FIVE' })).toBeNull();
        expect(mapReview({ reviewId: 'y' })).toBeNull();
        expect(mapReview({ reviewId: 'z', starRating: 'BOGUS' })).toBeNull();
    });
});

describe('mapReviews', () => {
    it('maps and filters a list', () => {
        const list: V4Review[] = [
            { reviewId: '1', starRating: 'FIVE', createTime: '2026-08-01T00:00:00Z' },
            { starRating: 'FOUR' }, // dropped (no id)
            { reviewId: '2', starRating: 'ONE', createTime: '2026-08-02T00:00:00Z', reviewReply: { updateTime: '2026-08-03T00:00:00Z' } },
        ];
        const out = mapReviews(list);
        expect(out.map((r) => r.id)).toEqual(['1', '2']);
        expect(out[1].reply?.createdAt).toBe('2026-08-03T00:00:00Z');
    });
});
