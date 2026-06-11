// Shared types for the quality-scan subsystem (Plan §15 "Punkt 4": foglift/lychee/axe-pa11y/schema-dts).
// The scan writes content-engine/.quality-report.json (gitignored, like .indexation.json) and the
// dashboard reads it read-only. Every scanner is resilient: a missing tool or a network failure
// degrades to a status, never an exception that aborts the whole run.

// ok        = ran and produced a result
// skipped   = intentionally not run (e.g. opt-in scanner without its flag)
// unavailable = the underlying tool/binary/service was not reachable (graceful degrade)
// error     = the tool ran but failed unexpectedly
export type ScannerStatus = 'ok' | 'skipped' | 'unavailable' | 'error';

export type ScannerKey = 'links' | 'schema' | 'geo' | 'a11y';

export interface BrokenLink {
    url: string;
    status: string; // HTTP code or reason ("404", "timeout", "unknown slug")
}

export interface ArticleLinks {
    status: ScannerStatus;
    note?: string;
    internalBroken: BrokenLink[]; // /tipps/{slug} links whose target slug does not exist (pure check)
    externalBroken: BrokenLink[]; // external http(s) URLs lychee reported as failed
    totalInternal: number;
    totalExternal: number;
}

export interface ArticleSchema {
    status: ScannerStatus;
    note?: string;
    types: string[]; // e.g. ['BlogPosting', 'FAQPage']
    errors: string[]; // missing @context / @type / required fields
    valid: boolean;
}

export interface GeoIssue {
    category: string;
    title: string;
    severity: string; // 'warning' | 'error' | ...
}

export interface ArticleGeo {
    status: ScannerStatus;
    note?: string;
    score: number | null; // foglift overall 0-100, null if not run
    geoScore: number | null; // foglift GEO sub-score (closest to our goal)
    subScores: Record<string, number> | null; // seo/geo/aeo/performance/security/accessibility
    issues: GeoIssue[]; // foglift topIssues (actionable)
}

export interface ArticleA11y {
    status: ScannerStatus;
    note?: string;
    violations: number | null; // count of WCAG issues, null if not run
    sample: string[]; // up to ~5 issue messages for context
}

export interface ArticleQuality {
    slug: string;
    url: string;
    links: ArticleLinks;
    schema: ArticleSchema;
    geo: ArticleGeo;
    a11y: ArticleA11y;
}

export interface QualitySummary {
    articles: number;
    internalBrokenTotal: number;
    externalBrokenTotal: number;
    schemaInvalid: number;
    avgGeo: number | null; // mean of available geo scores, null if none ran
    a11yViolationsTotal: number | null; // null if a11y never ran
}

export interface QualityReport {
    scannedAt: string; // ISO timestamp
    baseUrl: string;
    durationMs: number;
    scanners: Record<ScannerKey, ScannerStatus>; // overall per-scanner status across the run
    articles: ArticleQuality[];
    summary: QualitySummary;
}

// Aggregate per-article results into the report summary. Pure — unit-tested.
export function summarize(articles: ArticleQuality[]): QualitySummary {
    const geoScores = articles
        .map((a) => a.geo)
        .filter((g) => g.status === 'ok' && typeof g.score === 'number')
        .map((g) => g.score as number);
    const a11yRan = articles.some((a) => a.a11y.status === 'ok');
    return {
        articles: articles.length,
        internalBrokenTotal: articles.reduce((s, a) => s + a.links.internalBroken.length, 0),
        externalBrokenTotal: articles.reduce((s, a) => s + a.links.externalBroken.length, 0),
        schemaInvalid: articles.filter((a) => a.schema.status === 'ok' && !a.schema.valid).length,
        avgGeo: geoScores.length ? Math.round(geoScores.reduce((s, n) => s + n, 0) / geoScores.length) : null,
        a11yViolationsTotal: a11yRan
            ? articles.reduce((s, a) => s + (a.a11y.violations || 0), 0)
            : null,
    };
}

// Roll the per-article statuses up into one status per scanner for the run.
// ok wins if any article got a result; else the "worst" informative status present.
export function rollUpScannerStatus(articles: ArticleQuality[], pick: (a: ArticleQuality) => ScannerStatus): ScannerStatus {
    if (articles.length === 0) return 'skipped';
    const statuses = articles.map(pick);
    if (statuses.includes('ok')) return 'ok';
    if (statuses.every((s) => s === 'skipped')) return 'skipped';
    if (statuses.includes('error')) return 'error';
    if (statuses.includes('unavailable')) return 'unavailable';
    return 'skipped';
}
