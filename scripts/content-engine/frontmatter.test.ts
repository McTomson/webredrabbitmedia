import { describe, it, expect } from 'vitest';
import { validateFrontmatter } from './frontmatter';

const valid = {
    title: 'Lohnt sich ein Wartungsvertrag fuer eine Website? [Ehrliche Antwort 2026]',
    slug: 'website-wartungsvertrag-sinnvoll',
    excerpt: 'Wann ein Wartungsvertrag fuer Ihre Website Sinn ergibt und wann nicht.',
    featuredSnippetTitle: 'Lohnt sich ein Wartungsvertrag fuer eine Website?',
    featuredSnippet: 'Fuer eine reine Website lohnt sich ein laufender Wartungsvertrag meist nicht. Sinnvoll wird er erst bei Zusatzdiensten wie Chatbots, automatischer Email-Beantwortung oder laufendem SEO und Google Ads, die regelmaessig kontrolliert werden muessen.',
    author: 'Thomas Uhlir MBA',
    publishedAt: '2026-06-03',
    updatedAt: '2026-06-03',
    category: 'Wartung & Analyse',
    tags: ['Website Wartung', 'Wartungsvertrag', 'KMU'],
    featuredImage: '/images/blog/website-wartungsvertrag-sinnvoll.png',
    status: 'draft',
    aiAssisted: true,
    sources: [{ name: 'WKO', url: 'https://www.wko.at' }],
    keyTakeaways: ['Reine Website braucht keinen Wartungsvertrag.', 'Zusatzdienste schon.'],
    autoGenerateFAQs: false,
    customFAQs: [{ question: 'Brauche ich einen Wartungsvertrag?', answer: 'Nur bei laufenden Zusatzdiensten.' }],
};

describe('validateFrontmatter', () => {
    it('accepts a complete valid frontmatter', () => {
        const r = validateFrontmatter(valid);
        expect(r.ok).toBe(true);
        expect(r.errors).toEqual([]);
    });

    it('rejects when a required field is missing (featuredSnippet)', () => {
        const { featuredSnippet, ...rest } = valid;
        const r = validateFrontmatter(rest);
        expect(r.ok).toBe(false);
        expect(r.errors.join(' ')).toMatch(/featuredSnippet/);
    });

    it('rejects an em-dash anywhere in a string field (Guardrail 8)', () => {
        const r = validateFrontmatter({ ...valid, title: valid.title + ' – jetzt neu' });
        expect(r.ok).toBe(false);
        expect(r.errors.join(' ')).toMatch(/Gedankenstrich|em-dash|–/);
    });

    it('rejects an em-dash inside nested FAQ text', () => {
        const r = validateFrontmatter({
            ...valid,
            customFAQs: [{ question: 'Frage?', answer: 'Antwort — mehr' }],
        });
        expect(r.ok).toBe(false);
        expect(r.errors.join(' ')).toMatch(/Gedankenstrich|em-dash/);
    });

    it('rejects an unknown author (only the two real authors allowed)', () => {
        const r = validateFrontmatter({ ...valid, author: 'Max Mustermann' });
        expect(r.ok).toBe(false);
        expect(r.errors.join(' ')).toMatch(/author/i);
    });

    it('rejects empty sources (Guardrail 5: at least one real source)', () => {
        const r = validateFrontmatter({ ...valid, sources: [] });
        expect(r.ok).toBe(false);
        expect(r.errors.join(' ')).toMatch(/sources/);
    });

    it('rejects autoGenerateFAQs:false without customFAQs', () => {
        const { customFAQs, ...rest } = valid;
        const r = validateFrontmatter({ ...rest, autoGenerateFAQs: false });
        expect(r.ok).toBe(false);
        expect(r.errors.join(' ')).toMatch(/FAQ/i);
    });

    it('rejects a non-kebab slug or mismatched image path', () => {
        const r = validateFrontmatter({ ...valid, slug: 'Not_Kebab' });
        expect(r.ok).toBe(false);
        expect(r.errors.join(' ')).toMatch(/slug/);
    });
});
