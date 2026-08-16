import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { HealthSignal } from './health';
import type { LocalRankSnapshot, ReviewHealth, ReviewItem } from '@/lib/localrank/types';
import type { PerformanceSnapshot } from '@/lib/localrank/performance';
import { computeReviewHealth } from '@/lib/localrank/reviewHealth';
import { buildLocalSignals } from '@/lib/localrank/signals';
import { REVIEWS, hasRealRating } from '@/lib/reviews';

// Read-only data layer for the Local (GBP) dashboard tab. Reads JSON snapshots the
// weekly pullers write (scripts/content-engine/local-rank/*). Everything degrades
// gracefully: a missing snapshot shows an EmptyState, a demo snapshot shows a loud
// banner. Nothing here calls Google or DataForSEO — that happens only in the puller.

const ROOT = process.cwd();
const DIR = path.join(ROOT, 'content-engine/local-rank');
const GRID_LATEST = path.join(DIR, 'latest.json');
const GRID_DEMO = path.join(DIR, 'demo.json');
const REVIEWS_FILE = path.join(DIR, 'reviews.json');
const PERFORMANCE_FILE = path.join(DIR, 'performance.json');
const GBP_TOKEN_FILE = path.join(os.homedir(), '.config/redrabbit-dashboard/token.json');

export type ReviewsSource = 'api' | 'demo' | 'manual';

export interface LocalRankView {
    grid: { snapshot: LocalRankSnapshot; isDemo: boolean } | null;
    reviews: { health: ReviewHealth; source: ReviewsSource } | null;
    performance: PerformanceSnapshot | null;
    signals: HealthSignal[];
    /** What is wired up, for the "how to go live" hints on the page. */
    configured: { gbpToken: boolean; placeId: boolean };
}

function readJson<T>(file: string): T | null {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
    } catch {
        return null;
    }
}

function loadGrid(): { snapshot: LocalRankSnapshot; isDemo: boolean } | null {
    const real = readJson<LocalRankSnapshot>(GRID_LATEST);
    if (real && Array.isArray(real.keywords)) return { snapshot: real, isDemo: real.source === 'demo' };
    const demo = readJson<LocalRankSnapshot>(GRID_DEMO);
    if (demo && Array.isArray(demo.keywords)) return { snapshot: demo, isDemo: true };
    return null;
}

interface ReviewsFile {
    source?: string;
    takenAt?: string;
    reviews?: ReviewItem[];
}

function loadReviews(now: Date): { health: ReviewHealth; source: ReviewsSource } | null {
    const raw = readJson<ReviewsFile>(REVIEWS_FILE);
    if (raw && Array.isArray(raw.reviews)) {
        const source: ReviewsSource = raw.source === 'demo' ? 'demo' : 'api';
        return { health: computeReviewHealth(raw.reviews, now), source };
    }
    // Fallback: the manually-maintained REVIEWS totals (honesty rule: real Google only).
    // We have counts, not individual reviews — so velocity/response metrics are unknown,
    // NOT zero. Represent them as such (daysSinceLast null, unanswered empty) and let the
    // page label this as "manual" so no false alarm fires.
    if (hasRealRating()) {
        return {
            source: 'manual',
            health: {
                total: REVIEWS.reviewCount ?? 0,
                avgRating: REVIEWS.rating,
                last30: 0,
                last90: 0,
                daysSinceLast: null,
                responseRate: 0,
                avgResponseDays: null,
                unanswered: [],
            },
        };
    }
    return null;
}

export function getLocalRank(now: Date = new Date()): LocalRankView {
    const grid = loadGrid();
    const reviews = loadReviews(now);
    const performance = readJson<PerformanceSnapshot>(PERFORMANCE_FILE);

    // Only feed per-review (api/demo) data into the alarm logic — manual totals can't
    // support velocity/response signals and would raise misleading warnings.
    const reviewsForSignals = reviews && reviews.source !== 'manual' ? reviews.health : null;
    const signals = buildLocalSignals(grid?.snapshot ?? null, reviewsForSignals);

    return {
        grid,
        reviews,
        performance: performance && Array.isArray(performance.metrics) ? performance : null,
        signals,
        configured: {
            gbpToken: fileExists(GBP_TOKEN_FILE),
            placeId: Boolean(process.env.RR_GBP_PLACE_ID),
        },
    };
}

function fileExists(f: string): boolean {
    try {
        return fs.existsSync(f);
    } catch {
        return false;
    }
}
