import { describe, it, expect } from 'vitest';
import { stripLeadingTitleH1 } from './posts';

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
