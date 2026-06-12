// Single source of truth for review / social-proof numbers.
//
// HONESTY RULE (Thomas, 2026-06-12): the structured-data `aggregateRating` and any
// visible star AVERAGE may ONLY reflect REAL Google Business reviews. Until real
// numbers are filled in below, `rating`/`reviewCount` stay null, so NO star average
// and NO aggregateRating JSON-LD is rendered anywhere (avoids Google review-spam +
// Austrian UWG risk). `customersServed` is a SEPARATE, truthful marketing claim
// (clients served over the years) and is safe to display as social proof.
//
// To go live with real stars: set `rating`, `reviewCount`, `updatedAt` from the
// Google Business Profile (manually monthly, or wired to the Business Profile API).
// Everything that consumes REVIEWS updates automatically.

export interface ReviewStats {
    /** Real Google average rating, e.g. 4.8 — null until verified. */
    rating: number | null;
    /** Real Google review count — null until verified. */
    reviewCount: number | null;
    /** Clients served since 2019 (marketing claim, not a review count). */
    customersServed: number;
    /** ISO date the real numbers were last refreshed; null while none exist. */
    updatedAt: string | null;
}

export const REVIEWS: ReviewStats = {
    rating: null,
    reviewCount: null,
    customersServed: 164,
    updatedAt: null,
};

/** True only when verified real Google review data exists. */
export function hasRealRating(r: ReviewStats = REVIEWS): boolean {
    return r.rating != null && r.reviewCount != null && r.reviewCount > 0;
}

/**
 * schema.org AggregateRating block built from REAL data, or null when none exists.
 * Spread into a schema object only when non-null:
 *   ...(aggregateRatingLd() ? { aggregateRating: aggregateRatingLd() } : {})
 */
export function aggregateRatingLd(r: ReviewStats = REVIEWS) {
    if (!hasRealRating(r)) return null;
    return {
        '@type': 'AggregateRating',
        ratingValue: String(r.rating),
        reviewCount: String(r.reviewCount),
        bestRating: '5',
        worstRating: '1',
    };
}
