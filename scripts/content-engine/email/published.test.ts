import { describe, it, expect } from 'vitest';
import { buildPublishedEmail } from '../../../lib/reviewEmail';

describe('buildPublishedEmail', () => {
    const mail = buildPublishedEmail({
        slug: 'website-wartungsvertrag-sinnvoll',
        title: 'Lohnt sich ein Wartungsvertrag?',
        youtubeUrl: 'https://youtu.be/abc123',
        substackUrl: 'https://redrabbitlab.substack.com/p/test',
        youtubePrivacy: 'unlisted',
    });

    it('links to the article, youtube and substack', () => {
        expect(mail.html).toContain('/tipps/website-wartungsvertrag-sinnvoll');
        expect(mail.html).toContain('https://youtu.be/abc123');
        expect(mail.html).toContain('https://redrabbitlab.substack.com/p/test');
    });

    it('notes the unlisted state when not public', () => {
        expect(mail.html).toMatch(/ungelistet/i);
        expect(mail.text).toMatch(/unlisted/);
    });

    it('omits media buttons that are not provided', () => {
        const onlyArticle = buildPublishedEmail({ slug: 's', title: 'T' });
        expect(onlyArticle.html).not.toContain('youtu');
        expect(onlyArticle.html).not.toContain('substack');
    });

    it('contains no em-dash anywhere (Guardrail 8)', () => {
        expect(/[–—]/.test(mail.html)).toBe(false);
        expect(/[–—]/.test(mail.subject)).toBe(false);
        expect(/[–—]/.test(mail.text)).toBe(false);
    });
});
