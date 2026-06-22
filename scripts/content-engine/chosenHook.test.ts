import { describe, it, expect } from 'vitest';
import { pickHook, setChosenHook } from '../../lib/chosenHook';

const FM = `---
title: "Test"
slug: "test-slug"
status: "draft"
updatedAt: "2026-06-22"
hookCandidates:
  - "bilder selbst liefern oder nicht?"
  - 'website-bilder: alles selbst machen?'
  - "woher kommen die website-fotos?"
---

# Body
Some text.
`;

describe('pickHook', () => {
    it('resolves a 1-based index to the hook text', () => {
        expect(pickHook(FM, 1)).toBe('bilder selbst liefern oder nicht?');
        expect(pickHook(FM, 2)).toBe('website-bilder: alles selbst machen?');
        expect(pickHook(FM, 3)).toBe('woher kommen die website-fotos?');
    });
    it('returns null for out-of-range / invalid indices', () => {
        expect(pickHook(FM, 0)).toBeNull();
        expect(pickHook(FM, 4)).toBeNull();
        expect(pickHook(FM, -1)).toBeNull();
        expect(pickHook(FM, 1.5)).toBeNull();
    });
    it('returns null when there are no candidates', () => {
        expect(pickHook('---\nstatus: "draft"\n---\nbody', 1)).toBeNull();
    });
});

describe('setChosenHook', () => {
    it('inserts a chosenHook line after status, preserving the rest', () => {
        const out = setChosenHook(FM, 'website-bilder: alles selbst machen?');
        expect(out).toContain('chosenHook: "website-bilder: alles selbst machen?"');
        // status stays, body untouched, candidates untouched
        expect(out).toContain('status: "draft"');
        expect(out).toContain('# Body');
        expect(out).toContain('woher kommen die website-fotos?');
        // exactly one chosenHook line
        expect(out.match(/^chosenHook:/gm)?.length).toBe(1);
    });
    it('replaces an existing chosenHook instead of duplicating', () => {
        const once = setChosenHook(FM, 'first');
        const twice = setChosenHook(once, 'second');
        expect(twice.match(/^chosenHook:/gm)?.length).toBe(1);
        expect(twice).toContain('chosenHook: "second"');
        expect(twice).not.toContain('chosenHook: "first"');
    });
    it('escapes quotes/colons in the hook value (valid YAML scalar)', () => {
        const out = setChosenHook(FM, 'website: "wirklich" so?');
        expect(out).toContain('chosenHook: "website: \\"wirklich\\" so?"');
    });
    it('round-trips: the injected chosenHook parses back to the original text', async () => {
        const matter = (await import('gray-matter')).default;
        const hook = 'website-bilder: alles selbst machen?';
        const out = setChosenHook(FM, hook);
        expect((matter(out).data as { chosenHook?: string }).chosenHook).toBe(hook);
    });
});
