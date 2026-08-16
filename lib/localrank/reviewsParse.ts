import type { ReviewItem } from './types';

// Pure mapping from the Google My Business v4 reviews payload to our ReviewItem shape.
// Kept separate from the network call so it is fully unit-testable against fixtures.

const STAR: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

export interface V4Review {
    reviewId?: string;
    reviewer?: { displayName?: string };
    starRating?: string; // "ONE".."FIVE"
    comment?: string;
    createTime?: string; // RFC3339
    updateTime?: string;
    reviewReply?: { comment?: string; updateTime?: string };
}

export interface V4ReviewsResponse {
    reviews?: V4Review[];
    averageRating?: number;
    totalReviewCount?: number;
    nextPageToken?: string;
}

/** Map one v4 review to a ReviewItem. Skips entries without an id or star rating. */
export function mapReview(r: V4Review): ReviewItem | null {
    if (!r.reviewId) return null;
    const rating = r.starRating ? STAR[r.starRating] : undefined;
    if (rating == null) return null;
    return {
        id: r.reviewId,
        rating,
        createdAt: r.createTime ?? r.updateTime ?? '',
        author: r.reviewer?.displayName,
        comment: r.comment,
        reply: r.reviewReply ? { createdAt: r.reviewReply.updateTime ?? '' } : undefined,
    };
}

/** Map a full v4 reviews response (one or more pages already concatenated) to ReviewItems. */
export function mapReviews(reviews: V4Review[]): ReviewItem[] {
    return reviews.map(mapReview).filter((r): r is ReviewItem => r !== null);
}
