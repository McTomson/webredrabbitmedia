import { describe, it, expect } from 'vitest';
import { extractLinks, checkInternalTipps, parseLycheeJson } from './scanners/links';
import { extractJsonLd, validateBlocks } from './scanners/schema';
import { parseFoglift } from './scanners/geo';
import { parsePa11yJson } from './scanners/a11y';
import { summarize, rollUpScannerStatus, type ArticleQuality } from './types';

describe('links: extractLinks', () => {
    it('splits internal vs external and ignores images', () => {
        const body = [
            'See [a](/tipps/foo) and [b](/kontakt).',
            'External [c](https://example.com/x) and [d](http://t.io).',
            '![img](/images/blog/x.png) and ![h](/images/y.jpg)',
            'Titled [e](/tipps/bar "Mein Titel").',
        ].join('\n');
        const { internal, external } = extractLinks(body);
        expect(internal).toEqual(['/tipps/foo', '/kontakt', '/tipps/bar']);
        expect(external).toEqual(['https://example.com/x', 'http://t.io']);
    });
    it('returns empty for no links', () => {
        expect(extractLinks('plain text')).toEqual({ internal: [], external: [] });
    });
});

describe('links: checkInternalTipps', () => {
    const valid = new Set(['foo', 'bar']);
    it('flags unknown /tipps slug only', () => {
        const broken = checkInternalTipps(['/tipps/foo', '/tipps/missing', '/kontakt', '/tipps/bar/'], valid);
        expect(broken).toEqual([{ url: '/tipps/missing', status: 'unknown slug' }]);
    });
    it('ignores non-/tipps internal paths (no false positives)', () => {
        expect(checkInternalTipps(['/kontakt', '/leistungen'], valid)).toEqual([]);
    });
    it('resolves the slug through anchors and query strings', () => {
        expect(checkInternalTipps(['/tipps/foo#abschnitt', '/tipps/bar?utm=x'], valid)).toEqual([]);
        expect(checkInternalTipps(['/tipps/missing#x'], valid)).toEqual([{ url: '/tipps/missing#x', status: 'unknown slug' }]);
    });
});

describe('links: parseLycheeJson', () => {
    it('reads fail_map entries with object status', () => {
        const raw = JSON.stringify({
            total: 3,
            fail_map: { 'content/blog/a.mdx': [{ url: 'https://dead.example', status: { code: 404, text: 'Not Found' } }] },
        });
        expect(parseLycheeJson(raw)).toEqual([{ url: 'https://dead.example', status: 'Not Found' }]);
    });
    it('reads error_map and string status', () => {
        const raw = JSON.stringify({ error_map: { x: [{ url: 'https://t.io', status: 'timeout' }] } });
        expect(parseLycheeJson(raw)).toEqual([{ url: 'https://t.io', status: 'timeout' }]);
    });
    it('returns empty on no failures or malformed', () => {
        expect(parseLycheeJson(JSON.stringify({ total: 5, fail_map: {} }))).toEqual([]);
        expect(parseLycheeJson('not json')).toEqual([]);
    });
});

describe('schema: extractJsonLd', () => {
    it('extracts single object and array blocks across scripts', () => {
        const html = `
      <script type="application/ld+json">{"@type":"BlogPosting"}</script>
      <script type="application/ld+json">[{"@type":"FAQPage"},{"@type":"Organization"}]</script>`;
        const blocks = extractJsonLd(html);
        expect(blocks.map((b) => b.type)).toEqual(['BlogPosting', 'FAQPage', 'Organization']);
    });
    it('records a ParseError block for invalid JSON', () => {
        const blocks = extractJsonLd('<script type="application/ld+json">{bad}</script>');
        expect(blocks[0].type).toBe('ParseError');
    });
    it('ignores non-ld scripts', () => {
        expect(extractJsonLd('<script>var x=1</script>')).toEqual([]);
    });
});

describe('schema: validateBlocks', () => {
    it('passes a complete BlogPosting + FAQPage', () => {
        const blocks = extractJsonLd(`<script type="application/ld+json">${JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: 'X',
            author: { '@type': 'Person', name: 'T' },
            datePublished: '2026-01-01',
        })}</script><script type="application/ld+json">${JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [{ '@type': 'Question' }],
        })}</script>`);
        const r = validateBlocks(blocks);
        expect(r.valid).toBe(true);
        expect(r.types).toEqual(['BlogPosting', 'FAQPage']);
        expect(r.errors).toEqual([]);
    });
    it('flags a missing required field', () => {
        const blocks = extractJsonLd(`<script type="application/ld+json">${JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: 'X',
            author: { name: 'T' },
            // datePublished missing
        })}</script>`);
        const r = validateBlocks(blocks);
        expect(r.valid).toBe(false);
        expect(r.errors).toContain('BlogPosting: Pflichtfeld "datePublished" fehlt');
    });
    it('flags empty page (no JSON-LD)', () => {
        const r = validateBlocks([]);
        expect(r.valid).toBe(false);
        expect(r.errors).toContain('kein JSON-LD auf der Seite gefunden');
    });
    it('lists but does not grade unknown types', () => {
        const blocks = extractJsonLd('<script type="application/ld+json">{"@type":"WebSite"}</script>');
        const r = validateBlocks(blocks);
        expect(r.types).toEqual(['WebSite']);
        expect(r.valid).toBe(true);
    });
});

describe('geo: parseFoglift', () => {
    const real = JSON.stringify({
        url: 'https://x',
        scores: { overall: 92, seo: 87, geo: 100, aeo: 73, performance: 95, security: 100, accessibility: 97 },
        topIssues: [{ category: 'SEO', title: 'Title tag too long', severity: 'warning' }],
        totalIssues: 4,
    });
    it('reads overall + geo sub-score + issues', () => {
        const p = parseFoglift(real)!;
        expect(p.overall).toBe(92);
        expect(p.geo).toBe(100);
        expect(p.issues).toEqual([{ category: 'SEO', title: 'Title tag too long', severity: 'warning' }]);
    });
    it('returns null on malformed', () => {
        expect(parseFoglift('not json')).toBeNull();
    });
    it('falls back to a bare score field', () => {
        const p = parseFoglift(JSON.stringify({ score: 80 }))!;
        expect(p.overall).toBe(80);
    });
});

describe('a11y: parsePa11yJson', () => {
    it('counts only errors as violations and samples messages', () => {
        const raw = JSON.stringify([
            { type: 'error', message: 'Image missing alt' },
            { type: 'warning', message: 'meh' },
            { type: 'notice', message: 'fyi' },
            { type: 'error', code: 'WCAG2AA.X' },
        ]);
        const p = parsePa11yJson(raw)!;
        expect(p.violations).toBe(2);
        expect(p.sample).toEqual(['Image missing alt', 'WCAG2AA.X']);
    });
    it('returns null on non-array / malformed', () => {
        expect(parsePa11yJson('{}')).toBeNull();
        expect(parsePa11yJson('nope')).toBeNull();
    });
});

describe('types: summarize + rollUpScannerStatus', () => {
    function art(over: Partial<ArticleQuality>): ArticleQuality {
        return {
            slug: 's',
            url: 'u',
            links: { status: 'ok', internalBroken: [], externalBroken: [], totalInternal: 0, totalExternal: 0 },
            schema: { status: 'ok', types: [], errors: [], valid: true },
            geo: { status: 'skipped', score: null, geoScore: null, issues: [] },
            a11y: { status: 'skipped', violations: null, sample: [] },
            ...over,
        };
    }
    it('aggregates broken links, schema-invalid, avg geo, a11y', () => {
        const articles = [
            art({
                links: { status: 'ok', internalBroken: [{ url: '/tipps/x', status: 'unknown slug' }], externalBroken: [{ url: 'h', status: '404' }], totalInternal: 1, totalExternal: 1 },
                schema: { status: 'ok', types: ['BlogPosting'], errors: ['e'], valid: false },
                geo: { status: 'ok', score: 90, geoScore: 100, issues: [] },
                a11y: { status: 'ok', violations: 3, sample: [] },
            }),
            art({
                geo: { status: 'ok', score: 80, geoScore: 90, issues: [] },
                a11y: { status: 'ok', violations: 2, sample: [] },
            }),
        ];
        const s = summarize(articles);
        expect(s.articles).toBe(2);
        expect(s.internalBrokenTotal).toBe(1);
        expect(s.externalBrokenTotal).toBe(1);
        expect(s.schemaInvalid).toBe(1);
        expect(s.avgGeo).toBe(85);
        expect(s.a11yViolationsTotal).toBe(5);
    });
    it('avgGeo null + a11yViolationsTotal null when never run', () => {
        const s = summarize([art({})]);
        expect(s.avgGeo).toBeNull();
        expect(s.a11yViolationsTotal).toBeNull();
    });
    it('a11yViolationsTotal is null when a11y coverage was partial (honesty)', () => {
        const s = summarize([
            art({ a11y: { status: 'ok', violations: 3, sample: [] } }),
            art({ a11y: { status: 'unavailable', violations: null, sample: [] } }),
        ]);
        // one article failed to scan → the total would undercount → report null, not a wrong number
        expect(s.a11yViolationsTotal).toBeNull();
    });
    it('rolls up scanner status: ok wins, else all-skipped', () => {
        const okArt = art({ geo: { status: 'ok', score: 1, geoScore: 1, issues: [] } });
        const skipArt = art({});
        expect(rollUpScannerStatus([okArt, skipArt], (a) => a.geo.status)).toBe('ok');
        expect(rollUpScannerStatus([skipArt], (a) => a.geo.status)).toBe('skipped');
        expect(rollUpScannerStatus([], (a) => a.geo.status)).toBe('skipped');
    });
    it('rolls up to error/unavailable when no ok', () => {
        const errArt = art({ links: { status: 'error', internalBroken: [], externalBroken: [], totalInternal: 0, totalExternal: 0 } });
        const unavArt = art({ links: { status: 'unavailable', internalBroken: [], externalBroken: [], totalInternal: 0, totalExternal: 0 } });
        expect(rollUpScannerStatus([errArt, unavArt], (a) => a.links.status)).toBe('error');
        expect(rollUpScannerStatus([unavArt], (a) => a.links.status)).toBe('unavailable');
    });
});
