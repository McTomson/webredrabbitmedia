// Shared types for the Local-Rank (Google Business Profile) tracker.
//
// The tracker measures where "Red Rabbit GmbH" ranks in Google's Local Pack /
// Maps across a geographic grid over Vienna, for a small set of buyer keywords.
// A weekly puller (scripts/content-engine/local-rank/pull.ts) writes a Snapshot
// as JSON; the dashboard reads it read-only. Nothing here touches the live GBP.

/** A single measured grid point (equirectangular offset from the business centre). */
export interface GridPoint {
    /** Stable id, e.g. "r-1_c2" (row/col relative to centre). */
    id: string;
    row: number; // -(n-1)/2 .. +(n-1)/2, centre = 0
    col: number;
    lat: number;
    lng: number;
}

/**
 * Rank of our business at one grid point for one keyword.
 * `rank` is the 1-based Local-Finder position, or null when we are not found
 * within the scanned depth (`scanDepth`, default top 20). null = "not ranked".
 */
export interface RankCell {
    pointId: string;
    row: number;
    col: number;
    rank: number | null;
}

/** All cells for one keyword, plus the computed KPIs for that keyword. */
export interface KeywordGrid {
    keyword: string;
    cells: RankCell[];
    kpis: GridKpis;
}

/** Share-of-Local-Voice style KPIs over a set of cells. */
export interface GridKpis {
    points: number; // number of grid points measured
    /** Share of points where rank <= 3 (the money metric), 0..1. */
    solv: number;
    /** Average Total Rank Position: mean rank over ALL points, unranked = UNRANKED_RANK. */
    atrp: number;
    /** Average Rank Position: mean rank over ranked points only (null when none ranked). */
    arp: number | null;
    top3: number; // count of points ranked 1..3
    top10: number; // count of points ranked 1..10
    ranked: number; // count of points ranked at all (1..scanDepth)
    unranked: number; // count of points not found within scanDepth
}

/** One weekly measurement across all keywords. */
export interface LocalRankSnapshot {
    /** ISO datetime the pull ran. */
    takenAt: string;
    /** "demo" = fixture data (loud banner in UI); "dataforseo" | "localfalcon" = real. */
    source: 'demo' | 'dataforseo' | 'localfalcon' | string;
    center: { lat: number; lng: number; label: string };
    gridSize: number; // n (grid is n x n)
    spacingKm: number;
    scanDepth: number; // how deep the Local Finder was scanned (e.g. 20)
    keywords: KeywordGrid[];
    /** KPIs aggregated across all keywords (all cells pooled). */
    overall: GridKpis;
}

// ── Review health ───────────────────────────────────────────────────────────

/** One Google review (subset of the Business Profile API `reviews` resource). */
export interface ReviewItem {
    id: string;
    /** 1..5 */
    rating: number;
    /** ISO datetime the review was created. */
    createdAt: string;
    author?: string;
    comment?: string;
    /** Owner reply, when present. */
    reply?: { createdAt: string };
}

export interface ReviewHealth {
    total: number;
    avgRating: number | null;
    /** New reviews in the last 30 / 90 days (velocity). */
    last30: number;
    last90: number;
    /** Days since the most recent review (recency), null when no reviews. */
    daysSinceLast: number | null;
    /** Share of reviews that have an owner reply, 0..1. */
    responseRate: number;
    /** Average owner response time in days over replied reviews, null when none. */
    avgResponseDays: number | null;
    /** Reviews still without an owner reply (action list), newest first. */
    unanswered: ReviewItem[];
}
