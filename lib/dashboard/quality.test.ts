import { describe, it, expect } from 'vitest';
import { flaggedArticles, topGeoIssues, WEAK_GEO } from './quality';
import type { ArticleQuality, QualityReport } from '@/scripts/content-engine/quality/types';

function art(slug: string, over: Partial<ArticleQuality> = {}): ArticleQuality {
    return {
        slug,
        url: `https://x/tipps/${slug}`,
        links: { status: 'ok', internalBroken: [], externalBroken: [], totalInternal: 2, totalExternal: 1 },
        schema: { status: 'ok', types: ['BlogPosting'], errors: [], valid: true },
        geo: { status: 'ok', score: 95, geoScore: 100, issues: [] },
        a11y: { status: 'skipped', violations: null, sample: [] },
        ...over,
    };
}

function report(articles: ArticleQuality[]): QualityReport {
    return {
        scannedAt: '2026-06-11T00:00:00.000Z',
        baseUrl: 'https://x',
        durationMs: 1,
        scanners: { links: 'ok', schema: 'ok', geo: 'ok', a11y: 'skipped' },
        articles,
        summary: { articles: articles.length, internalBrokenTotal: 0, externalBrokenTotal: 0, schemaInvalid: 0, avgGeo: null, a11yViolationsTotal: null },
    };
}

describe('flaggedArticles', () => {
    it('flags broken links, invalid schema, and weak GEO; sorts worst first', () => {
        const clean = art('clean');
        const broken = art('broken', { links: { status: 'ok', internalBroken: [{ url: '/tipps/x', status: 'unknown slug' }], externalBroken: [{ url: 'h', status: '404' }], totalInternal: 1, totalExternal: 1 } });
        const schemaBad = art('schemabad', { schema: { status: 'ok', types: ['BlogPosting'], errors: ['e'], valid: false } });
        const weakGeo = art('weakgeo', { geo: { status: 'ok', score: WEAK_GEO - 5, geoScore: 50, issues: [] } });
        const r = flaggedArticles(report([clean, weakGeo, schemaBad, broken]));
        // clean excluded; most-broken first, then ties broken by ascending GEO (weakgeo 75 < schemabad 95)
        expect(r.map((f) => f.article.slug)).toEqual(['broken', 'weakgeo', 'schemabad']);
        expect(r[0].broken).toBe(2);
        expect(r.find((f) => f.article.slug === 'schemabad')!.schemaBad).toBe(true);
    });
    it('does not flag an article whose GEO scanner did not run (status != ok)', () => {
        const skipped = art('skip', { geo: { status: 'skipped', score: null, geoScore: null, issues: [] } });
        expect(flaggedArticles(report([skipped]))).toEqual([]);
    });
    it('respects the limit', () => {
        const many = Array.from({ length: 20 }, (_, i) => art(`a${i}`, { schema: { status: 'ok', types: [], errors: ['e'], valid: false } }));
        expect(flaggedArticles(report(many), 5)).toHaveLength(5);
    });
});

describe('topGeoIssues', () => {
    it('aggregates foglift issue titles by frequency, most frequent first', () => {
        const a = art('a', { geo: { status: 'ok', score: 90, geoScore: 90, issues: [{ category: 'SEO', title: 'Multiple H1', severity: 'warning' }, { category: 'SEO', title: 'Title too long', severity: 'warning' }] } });
        const b = art('b', { geo: { status: 'ok', score: 90, geoScore: 90, issues: [{ category: 'SEO', title: 'Multiple H1', severity: 'warning' }] } });
        expect(topGeoIssues(report([a, b]))).toEqual([
            { title: 'Multiple H1', count: 2 },
            { title: 'Title too long', count: 1 },
        ]);
    });
    it('returns empty when no GEO issues', () => {
        expect(topGeoIssues(report([art('a')]))).toEqual([]);
    });
});
