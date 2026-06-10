import { describe, it, expect } from 'vitest';
import { buildReviewEmail, type ReviewArticle } from './send-review';

const article: ReviewArticle = {
    slug: 'website-wartungsvertrag-sinnvoll',
    title: 'Lohnt sich ein Wartungsvertrag?',
    author: 'Thomas Uhlir MBA',
    excerpt: 'Kurze ehrliche Einordnung.',
    wordCount: 1117,
    sources: [{ name: 'Patchstack', url: 'https://patchstack.com' }],
    flags: ['price_claim', 'legal_claim'],
    risk: 'high',
};

describe('buildReviewEmail', () => {
    const mail = buildReviewEmail(article, 'secret');

    it('includes preview, approve and reject links', () => {
        expect(mail.html).toContain('/tipps/website-wartungsvertrag-sinnvoll');
        expect(mail.html).toContain('/api/approve?token=');
        expect(mail.text).toMatch(/Freigeben: .*\/api\/approve\?token=/);
        expect(mail.text).toMatch(/Ablehnen: .*\/api\/approve\?token=/);
    });

    it('approve and reject tokens differ', () => {
        const tokens = [...mail.html.matchAll(/token=([^"&]+)/g)].map((m) => m[1]);
        expect(new Set(tokens).size).toBeGreaterThanOrEqual(2);
    });

    it('contains no em-dash anywhere (Guardrail 8)', () => {
        expect(/[–—]/.test(mail.html)).toBe(false);
        expect(/[–—]/.test(mail.subject)).toBe(false);
    });

    it('surfaces flags and risk', () => {
        expect(mail.html).toContain('price_claim');
        expect(mail.text).toMatch(/Risiko: high/);
    });

    it('shows an interview reminder only when opinion_missing is flagged', () => {
        expect(mail.html).not.toContain('/interview-me');
        const withGap = buildReviewEmail({ ...article, flags: ['opinion_missing'] }, 'secret');
        expect(withGap.html).toContain('/interview-me');
        expect(withGap.html).toContain('Meinung fehlt');
        expect(withGap.text).toMatch(/Meinung fehlt/);
        expect(/[–—]/.test(withGap.html)).toBe(false); // Guardrail 8 still holds
    });
});
