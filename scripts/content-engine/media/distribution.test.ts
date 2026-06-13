import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildDistributionKit, renderKitText } from './distribution';

let dir: string;

beforeAll(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-test-'));
    const longHook = 'Was kostet eine professionelle Website in Oesterreich 2026? '.repeat(10).trim();
    fs.writeFileSync(
        path.join(dir, 'kosten.mdx'),
        matterDoc({ title: 'Website-Kosten Oesterreich 2026', excerpt: longHook }),
    );
    fs.writeFileSync(
        path.join(dir, 'no-excerpt.mdx'),
        matterDoc({ title: 'Nur Titel', featuredSnippet: 'Kurze Direktantwort.' }),
    );
});

afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

function matterDoc(fm: Record<string, string>): string {
    const yaml = Object.entries(fm).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n');
    return `---\n${yaml}\n---\n\nBody.\n`;
}

describe('buildDistributionKit', () => {
    it('uses the origin /tipps/<slug> as canonical', () => {
        const kit = buildDistributionKit('kosten', dir);
        expect(kit.canonical).toBe('https://web.redrabbit.media/tipps/kosten');
    });

    it('LinkedIn + Substack are teaser+link (carry the canonical link, not full body)', () => {
        const kit = buildDistributionKit('kosten', dir);
        expect(kit.linkedin).toContain('https://web.redrabbit.media/tipps/kosten');
        expect(kit.substack).toContain('https://web.redrabbit.media/tipps/kosten');
    });

    it('Medium import URL points back to the canonical (canonical-safe full syndication)', () => {
        const kit = buildDistributionKit('kosten', dir);
        expect(kit.mediumImportUrl).toBe(
            'https://medium.com/p/import?url=' + encodeURIComponent('https://web.redrabbit.media/tipps/kosten'),
        );
    });

    it('Bluesky post stays within 300 chars and keeps the link intact', () => {
        const kit = buildDistributionKit('kosten', dir);
        expect(kit.bluesky.length).toBeLessThanOrEqual(300);
        expect(kit.bluesky).toContain('https://web.redrabbit.media/tipps/kosten');
    });

    it('falls back to featuredSnippet when excerpt is absent', () => {
        const kit = buildDistributionKit('no-excerpt', dir);
        expect(kit.substack).toContain('Kurze Direktantwort.');
    });

    it('throws on a missing article', () => {
        expect(() => buildDistributionKit('does-not-exist', dir)).toThrow();
    });

    it('renderKitText states the canonical rule and contains every channel', () => {
        const txt = renderKitText(buildDistributionKit('kosten', dir));
        expect(txt).toContain('LinkedIn');
        expect(txt).toContain('Substack');
        expect(txt).toContain('Medium');
        expect(txt).toContain('Bluesky');
        expect(txt).toMatch(/canonical/i);
    });
});
