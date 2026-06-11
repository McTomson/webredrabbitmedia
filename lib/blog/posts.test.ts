import { describe, it, expect } from 'vitest';
import { stripLeadingTitleH1, clampDescription } from './posts';

describe('stripLeadingTitleH1', () => {
    it('strips a leading "# Title" line (the duplicate of the page H1)', () => {
        const body = '# Was kostet eine Website?\n\nDer erste Absatz.';
        expect(stripLeadingTitleH1(body)).toBe('Der erste Absatz.');
    });
    it('strips even with leading blank lines before the heading', () => {
        const body = '\n\n# Titel\n\nText.';
        expect(stripLeadingTitleH1(body)).toBe('Text.');
    });
    it('does NOT strip an h2 (## ) leading heading', () => {
        const body = '## Unterüberschrift\n\nText.';
        expect(stripLeadingTitleH1(body)).toBe(body);
    });
    it('does NOT strip when the body starts with a paragraph', () => {
        const body = 'Ein Einleitungssatz.\n\n# Später eine H1.';
        expect(stripLeadingTitleH1(body)).toBe(body);
    });
    it('removes only the first H1, keeps the rest intact', () => {
        const body = '# Titel\n\nAbsatz.\n\n## Abschnitt\n\nMehr.';
        expect(stripLeadingTitleH1(body)).toBe('Absatz.\n\n## Abschnitt\n\nMehr.');
    });
    it('leaves a body without any leading heading unchanged', () => {
        expect(stripLeadingTitleH1('Nur Text, keine Überschrift.')).toBe('Nur Text, keine Überschrift.');
    });
});

describe('clampDescription', () => {
    it('leaves a short description unchanged', () => {
        const s = 'Kurze Beschreibung unter dem Limit.';
        expect(clampDescription(s)).toBe(s);
    });
    it('caps a long description at <=155 chars on a word boundary with ellipsis', () => {
        const long = 'Wort '.repeat(60).trim(); // ~299 chars
        const r = clampDescription(long);
        expect(r.length).toBeLessThanOrEqual(155);
        expect(r.endsWith('…')).toBe(true);
        expect(r).not.toMatch(/\s…$/); // no dangling space before the ellipsis
    });
    it('backtracks to a word boundary on normal prose', () => {
        const r = clampDescription('Berlin München Hamburg Köln Frankfurt Stuttgart', 25);
        expect(r).toBe('Berlin München Hamburg…'); // cut would land in "Köln"; backtrack to the space
        expect(r.length).toBeLessThanOrEqual(25);
    });
    it('respects a custom max', () => {
        expect(clampDescription('Eins zwei drei vier fünf sechs sieben acht', 20).length).toBeLessThanOrEqual(20);
    });
});
