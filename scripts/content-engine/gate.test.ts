import { describe, it, expect } from 'vitest';
import { runGate, type GateInput } from './gate';

function words(n: number): string {
    return Array.from({ length: n }, (_, i) => `wort${i % 50}`).join(' ');
}

const base: GateInput = {
    frontmatter: {
        title: 'Test',
        category: 'Strategie & Kosten',
        sources: [{ name: 'WKO', url: 'https://www.wko.at' }],
        keyTakeaways: ['a', 'b'],
    },
    body: words(700),
    flags: [],
    hasOpinion: true,
};

describe('runGate', () => {
    it('passes a solid low-risk article (auto-publish)', () => {
        const r = runGate(base);
        expect(r.pass).toBe(true);
        expect(r.risk).toBe('low');
    });

    it('hard-fails when under 500 words', () => {
        const r = runGate({ ...base, body: words(200) });
        expect(r.pass).toBe(false);
        expect(r.reasons.join(' ')).toMatch(/500|Woerter|Wörter|words/i);
    });

    it('hard-fails when no sources (Guardrail 5)', () => {
        const r = runGate({ ...base, frontmatter: { ...base.frontmatter, sources: [] } });
        expect(r.pass).toBe(false);
        expect(r.reasons.join(' ')).toMatch(/Quelle|source/i);
    });

    it('hard-fails when no real element (no source and no opinion)', () => {
        const r = runGate({ ...base, frontmatter: { ...base.frontmatter, sources: [] }, hasOpinion: false });
        expect(r.pass).toBe(false);
    });

    it('routes legal_claim flag to high risk (review email)', () => {
        const r = runGate({ ...base, flags: ['legal_claim'] });
        expect(r.pass).toBe(true);
        expect(r.risk).toBe('high');
    });

    it('treats legal/tax categories as high risk even without flags', () => {
        const r = runGate({ ...base, frontmatter: { ...base.frontmatter, category: 'Recht & Sicherheit' } });
        expect(r.risk).toBe('high');
    });

    it('flags price_claim and low_confidence as high risk', () => {
        expect(runGate({ ...base, flags: ['price_claim'] }).risk).toBe('high');
        expect(runGate({ ...base, flags: ['low_confidence'] }).risk).toBe('high');
    });
});
