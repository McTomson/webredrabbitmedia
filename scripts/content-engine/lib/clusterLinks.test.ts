import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
    cleanAnchor,
    scoreRelated,
    buildBlock,
    injectBlock,
    relinkAll,
    loadPosts,
    hardcodedSlugs,
    LINK_START,
    LINK_END,
    type PostLite,
} from './clusterLinks';

function post(p: Partial<PostLite> & { slug: string }): PostLite {
    return {
        title: p.slug,
        category: '',
        cluster: undefined,
        tags: [],
        status: 'published',
        filePath: '',
        head: '',
        body: '',
        ...p,
    };
}

describe('cleanAnchor', () => {
    it('strips a trailing bracketed SEO suffix', () => {
        expect(cleanAnchor('Was kostet eine Website 2026? [Echte Preise & ROI]')).toBe(
            'Was kostet eine Website 2026?',
        );
    });
    it('leaves a clean title untouched and collapses whitespace', () => {
        expect(cleanAnchor('Wie  lange   dauert es')).toBe('Wie lange dauert es');
    });
});

describe('scoreRelated', () => {
    const all = [
        post({ slug: 'a', cluster: 1, category: 'Kosten', tags: ['x'] }),
        post({ slug: 'b', cluster: 1, category: 'Kosten', tags: ['x'] }), // same cluster+cat+tag
        post({ slug: 'c', cluster: 1, category: 'Kosten', tags: [] }), // same cluster+cat
        post({ slug: 'd', cluster: 2, category: 'Technik', tags: ['x'] }), // only shared tag
        post({ slug: 'e', cluster: 2, category: 'Technik', tags: [] }), // unrelated
    ];

    it('ranks the strongest cluster-mate first and never includes self', () => {
        const r = scoreRelated(all[0], all, 3).map((p) => p.slug);
        expect(r).not.toContain('a');
        expect(r[0]).toBe('b'); // +3 cat +2 cluster +1 tag = 6
        expect(r).toContain('c');
        expect(r).not.toContain('e'); // score 0 excluded
    });

    it('falls back to cross-cluster matches for a single-article cluster', () => {
        const lonely = post({ slug: 'solo', cluster: 4, category: 'SEO', tags: ['x'] });
        const r = scoreRelated(lonely, [lonely, ...all], 3).map((p) => p.slug);
        // no cluster-4 mate exists, so shared-tag articles (a,b,d) are picked
        expect(r.length).toBeGreaterThan(0);
        expect(r).toContain('a');
        expect(r).not.toContain('solo');
    });

    it('excludes drafts unless force-included', () => {
        const withDraft = [...all, post({ slug: 'draft1', cluster: 1, category: 'Kosten', tags: ['x'], status: 'draft' })];
        expect(scoreRelated(all[0], withDraft, 5).map((p) => p.slug)).not.toContain('draft1');
        expect(scoreRelated(all[0], withDraft, 5, new Set(['draft1'])).map((p) => p.slug)).toContain('draft1');
    });
});

describe('buildBlock', () => {
    it('emits /tipps/ markdown links wrapped in markers', () => {
        const block = buildBlock([post({ slug: 'b', title: 'Titel B [x]' }), post({ slug: 'c', title: 'Titel C' })]);
        expect(block).toContain(LINK_START);
        expect(block).toContain(LINK_END);
        expect(block).toContain('[Titel B](/tipps/b)');
        expect(block).toContain('[Titel C](/tipps/c)');
        expect(block).not.toContain('/blog/');
    });
});

describe('injectBlock idempotency + placement', () => {
    const block1 = buildBlock([post({ slug: 'b', title: 'B' })]);
    const block2 = buildBlock([post({ slug: 'c', title: 'C' })]);

    it('inserts before the author footer', () => {
        const body = 'Intro text.\n\n## Fazit\nText.\n\n[CTA](/kontakt)\n\n---\n**Thomas Uhlir MBA**\n*Geschäftsführer*\n';
        const out = injectBlock(body, block1);
        expect(out.indexOf(LINK_START)).toBeLessThan(out.indexOf('**Thomas Uhlir'));
        expect(out).toContain('[CTA](/kontakt)');
    });

    it('is idempotent: re-injecting the same block yields identical output', () => {
        const body = 'Intro.\n\n---\n**Thomas Uhlir MBA**\n';
        const once = injectBlock(body, block1);
        const twice = injectBlock(once, block1);
        expect(twice).toBe(once);
    });

    it('replaces an existing block with new targets (no duplicate markers)', () => {
        const body = 'Intro.\n\n---\n**Thomas Uhlir MBA**\n';
        const out = injectBlock(injectBlock(body, block1), block2);
        expect(out.match(new RegExp(LINK_START.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'), 'g'))?.length).toBe(1);
        expect(out).toContain('/tipps/c');
        expect(out).not.toContain('/tipps/b');
    });

    it('appends at the end when there is no author footer', () => {
        const out = injectBlock('Just body text.', block1);
        expect(out.trimEnd().endsWith(LINK_END)).toBe(true);
    });

    it('is idempotent in a SINGLE re-run for the append branch (no author footer)', () => {
        const body = 'Body without footer.\n\n## Schluss\n\nLetzter Absatz.';
        const once = injectBlock(body, block1);
        expect(injectBlock(once, block1)).toBe(once); // stable after one run, not two
    });

    it('never reformats unrelated body whitespace (surgical)', () => {
        const body = 'Para one.\n\n\n![img](/images/x.png)\n\n\nPara two.\n\n---\n**Thomas Uhlir MBA**\n';
        const out = injectBlock(body, block1);
        expect(out).toContain('Para one.\n\n\n![img](/images/x.png)\n\n\nPara two.'); // triple newlines preserved
    });
});

describe('relinkAll (filesystem, tmp dir)', () => {
    let dir: string;
    const fm = (o: Record<string, string | number>) =>
        '---\n' + Object.entries(o).map(([k, v]) => `${k}: ${typeof v === 'number' ? v : `"${v}"`}`).join('\n') + '\n---\n';

    beforeEach(() => {
        dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rr-links-'));
        fs.writeFileSync(path.join(dir, 'a.mdx'), fm({ slug: 'a', title: 'A', category: 'Kosten', cluster: 1 }) + '\nBody A.\n\n[CTA](/kontakt)\n');
        fs.writeFileSync(path.join(dir, 'b.mdx'), fm({ slug: 'b', title: 'B', category: 'Kosten', cluster: 1 }) + '\nBody B.\n');
        fs.writeFileSync(path.join(dir, 'c.mdx'), fm({ slug: 'c', title: 'C', category: 'Kosten', cluster: 1 }) + '\nBody C.\n');
        fs.writeFileSync(path.join(dir, 'd.mdx'), fm({ slug: 'd', title: 'D', category: 'Kosten', cluster: 1, status: 'draft' }) + '\nDraft D.\n');
    });
    afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

    it('adds links to published articles and never targets the draft', () => {
        relinkAll(dir);
        const a = fs.readFileSync(path.join(dir, 'a.mdx'), 'utf8');
        expect(a).toContain(LINK_START);
        expect(a).toMatch(/\/tipps\/(b|c)/);
        expect(a).not.toContain('/tipps/d'); // draft never linked
        // draft file itself gets no block
        expect(fs.readFileSync(path.join(dir, 'd.mdx'), 'utf8')).not.toContain(LINK_START);
    });

    it('preserves frontmatter byte-for-byte', () => {
        const headBefore = fs.readFileSync(path.join(dir, 'a.mdx'), 'utf8').split('---\n')[1];
        relinkAll(dir);
        const headAfter = fs.readFileSync(path.join(dir, 'a.mdx'), 'utf8').split('---\n')[1];
        expect(headAfter).toBe(headBefore);
    });

    it('is idempotent across runs (second run changes nothing)', () => {
        relinkAll(dir);
        const snapshot = ['a', 'b', 'c'].map((s) => fs.readFileSync(path.join(dir, `${s}.mdx`), 'utf8'));
        const second = relinkAll(dir);
        expect(second.every((r) => !r.changed)).toBe(true);
        ['a', 'b', 'c'].forEach((s, i) => {
            expect(fs.readFileSync(path.join(dir, `${s}.mdx`), 'utf8')).toBe(snapshot[i]);
        });
    });

    it('dryRun reports changes without writing', () => {
        const before = fs.readFileSync(path.join(dir, 'a.mdx'), 'utf8');
        const res = relinkAll(dir, { dryRun: true });
        expect(res.find((r) => r.slug === 'a')?.changed).toBe(true);
        expect(fs.readFileSync(path.join(dir, 'a.mdx'), 'utf8')).toBe(before);
    });

    it('force-includes a draft as a link target (publish moment)', () => {
        relinkAll(dir, { forceInclude: ['d'] });
        const someTargetsD = ['a', 'b', 'c'].some((s) =>
            fs.readFileSync(path.join(dir, `${s}.mdx`), 'utf8').includes('/tipps/d'),
        );
        expect(someTargetsD).toBe(true);
    });

    it('loadPosts narrows status correctly', () => {
        const posts = loadPosts(dir);
        expect(posts.find((p) => p.slug === 'd')?.status).toBe('draft');
        expect(posts.find((p) => p.slug === 'a')?.status).toBe('published');
    });
});

describe('hardcoded route handling (root/app/tipps + root/content/blog)', () => {
    let root: string;
    let blogDir: string;
    const fm = (o: Record<string, string | number>) =>
        '---\n' + Object.entries(o).map(([k, v]) => `${k}: ${typeof v === 'number' ? v : `"${v}"`}`).join('\n') + '\n---\n';

    beforeEach(() => {
        root = fs.mkdtempSync(path.join(os.tmpdir(), 'rr-root-'));
        blogDir = path.join(root, 'content', 'blog');
        fs.mkdirSync(blogDir, { recursive: true });
        fs.writeFileSync(path.join(blogDir, 'a.mdx'), fm({ slug: 'a', title: 'A', category: 'Kosten', cluster: 1 }) + '\nBody A.\n');
        fs.writeFileSync(path.join(blogDir, 'flag.mdx'), fm({ slug: 'flag', title: 'Flag', category: 'Kosten', cluster: 1 }) + '\nBody Flag.\n');
        // bespoke hardcoded route for "flag"
        const hc = path.join(root, 'app', 'tipps', 'flag');
        fs.mkdirSync(hc, { recursive: true });
        fs.writeFileSync(path.join(hc, 'page.tsx'), 'export default function P(){return null}');
    });
    afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

    it('detects the hardcoded slug', () => {
        expect(hardcodedSlugs(blogDir).has('flag')).toBe(true);
        expect(hardcodedSlugs(blogDir).has('a')).toBe(false);
    });

    it('skips the hardcoded slug as a SOURCE but keeps it as a valid TARGET', () => {
        relinkAll(blogDir);
        // flag.mdx body is dead (bespoke route renders) -> no block written
        expect(fs.readFileSync(path.join(blogDir, 'flag.mdx'), 'utf8')).not.toContain(LINK_START);
        // a.mdx still links TO flag (its route resolves)
        expect(fs.readFileSync(path.join(blogDir, 'a.mdx'), 'utf8')).toContain('/tipps/flag');
    });
});
