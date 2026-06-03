import { describe, it, expect } from 'vitest';
import { extractJsonBlock, extractMdxBlock } from './extract';

describe('extractJsonBlock', () => {
    it('parses a fenced ```json block', () => {
        const out = 'Hier ist mein Ergebnis:\n```json\n{"enough": true, "facts": []}\n```\nDanke.';
        expect(extractJsonBlock(out)).toEqual({ enough: true, facts: [] });
    });

    it('takes the LAST json block when several exist', () => {
        const out = '```json\n{"v":1}\n```\nText\n```json\n{"v":2}\n```';
        expect(extractJsonBlock(out)).toEqual({ v: 2 });
    });

    it('falls back to a bare json object if no fence', () => {
        const out = 'Antwort: {"enough": false, "notes": "zu wenig"} Ende';
        expect(extractJsonBlock(out)).toEqual({ enough: false, notes: 'zu wenig' });
    });

    it('throws on no json at all', () => {
        expect(() => extractJsonBlock('kein json hier')).toThrow();
    });
});

describe('extractMdxBlock', () => {
    it('parses a fenced ```mdx block', () => {
        const out = 'Fertig:\n```mdx\n---\ntitle: x\n---\n# H1\n```\n';
        expect(extractMdxBlock(out)).toBe('---\ntitle: x\n---\n# H1');
    });

    it('returns trimmed raw text if no fence but looks like frontmatter', () => {
        const out = '---\ntitle: x\n---\n# H1\nText';
        expect(extractMdxBlock(out)).toBe('---\ntitle: x\n---\n# H1\nText');
    });

    it('throws when there is no mdx/frontmatter', () => {
        expect(() => extractMdxBlock('nur prosa ohne frontmatter')).toThrow();
    });
});
