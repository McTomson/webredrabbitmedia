import fs from 'fs';
import path from 'path';
import type { QualityReport, ArticleQuality } from '@/scripts/content-engine/quality/types';

// Read-only reader for the quality-scan SoT artifact (content-engine/.quality-report.json,
// gitignored, written by `npm run quality:scan`). Mirrors the .indexation.json reader pattern:
// the dashboard never runs the scan, it only surfaces the last result. Missing file = not yet run.
// Aggregation (flagged articles, top GEO issues) lives here — not in the page — so it is testable
// and the view component stays thin.

const FILE = path.join(process.cwd(), 'content-engine/.quality-report.json');

// One GEO cutoff, reused for both "flag this article" and the KPI accent.
export const WEAK_GEO = 80;

export interface FlaggedArticle {
    article: ArticleQuality;
    broken: number; // internal + external broken links
    schemaBad: boolean;
    geo: number | null; // overall foglift score, when it ran
}

export interface QualityView {
    report: QualityReport | null;
    ageHours: number | null; // hours since last scan, null if never run
    stale: boolean; // older than 7 days
    flagged: FlaggedArticle[]; // articles with a finding, worst first, capped at 12
    geoIssues: Array<{ title: string; count: number }>; // foglift top issues aggregated, most frequent first
}

// Articles with an actionable finding (broken link, invalid schema, or weak GEO), worst first.
export function flaggedArticles(report: QualityReport, limit = 12): FlaggedArticle[] {
    return report.articles
        .map((article) => ({
            article,
            broken: article.links.internalBroken.length + article.links.externalBroken.length,
            schemaBad: article.schema.status === 'ok' && !article.schema.valid,
            geo: article.geo.status === 'ok' ? article.geo.score : null,
        }))
        .filter((r) => r.broken > 0 || r.schemaBad || (r.geo !== null && r.geo < WEAK_GEO))
        .sort((x, y) => y.broken - x.broken || (x.geo ?? 100) - (y.geo ?? 100))
        .slice(0, limit);
}

// foglift top issues aggregated across all scanned articles, most frequent first.
export function topGeoIssues(report: QualityReport): Array<{ title: string; count: number }> {
    const freq = report.articles
        .flatMap((a) => a.geo.issues.map((i) => i.title))
        .reduce<Record<string, number>>((m, t) => {
            m[t] = (m[t] || 0) + 1;
            return m;
        }, {});
    return Object.entries(freq)
        .map(([title, count]) => ({ title, count }))
        .sort((x, y) => y.count - x.count);
}

export function getQualityReport(): QualityView {
    let report: QualityReport | null = null;
    try {
        report = JSON.parse(fs.readFileSync(FILE, 'utf8')) as QualityReport;
    } catch {
        return { report: null, ageHours: null, stale: false, flagged: [], geoIssues: [] };
    }
    let ageHours: number | null = null;
    const t = Date.parse(report.scannedAt);
    if (!Number.isNaN(t)) ageHours = Math.round((Date.now() - t) / 3_600_000);
    return {
        report,
        ageHours,
        stale: ageHours !== null && ageHours > 24 * 7,
        flagged: flaggedArticles(report),
        geoIssues: topGeoIssues(report),
    };
}
