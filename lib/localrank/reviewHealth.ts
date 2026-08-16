import type { ReviewItem, ReviewHealth } from './types';

// Pure review-health math. The REAL Google ranking levers for reviews are
// (Sterling Sky causal testing, 2025): volume, recency, a steady velocity, and
// owner responses — NOT keywords stuffed into review text. So we surface exactly
// those: count, avg rating, 30/90-day velocity, days-since-last, response rate,
// average response time, and the list of still-unanswered reviews to act on.
// `now` is injected so this is deterministic and testable.

const DAY_MS = 86_400_000;

export function computeReviewHealth(reviews: ReviewItem[], now: Date): ReviewHealth {
    const total = reviews.length;
    if (total === 0) {
        return { total: 0, avgRating: null, last30: 0, last90: 0, daysSinceLast: null, responseRate: 0, avgResponseDays: null, unanswered: [] };
    }

    const nowMs = now.getTime();
    let ratingSum = 0;
    let last30 = 0;
    let last90 = 0;
    let newestMs = -Infinity;
    let replied = 0;
    let responseDaysSum = 0;
    let responseDaysCount = 0;
    const unanswered: ReviewItem[] = [];

    for (const r of reviews) {
        ratingSum += r.rating;
        const createdMs = Date.parse(r.createdAt);
        if (!Number.isNaN(createdMs)) {
            const ageDays = (nowMs - createdMs) / DAY_MS;
            if (ageDays <= 30) last30++;
            if (ageDays <= 90) last90++;
            if (createdMs > newestMs) newestMs = createdMs;
        }
        if (r.reply) {
            replied++;
            const replyMs = Date.parse(r.reply.createdAt);
            if (!Number.isNaN(replyMs) && !Number.isNaN(createdMs) && replyMs >= createdMs) {
                responseDaysSum += (replyMs - createdMs) / DAY_MS;
                responseDaysCount++;
            }
        } else {
            unanswered.push(r);
        }
    }

    // Newest unanswered first — the action list.
    unanswered.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

    return {
        total,
        avgRating: round1(ratingSum / total),
        last30,
        last90,
        daysSinceLast: newestMs > -Infinity ? Math.floor((nowMs - newestMs) / DAY_MS) : null,
        responseRate: replied / total,
        avgResponseDays: responseDaysCount > 0 ? round1(responseDaysSum / responseDaysCount) : null,
        unanswered,
    };
}

function round1(n: number): number {
    return Math.round(n * 10) / 10;
}
