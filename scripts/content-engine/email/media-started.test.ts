import { describe, it, expect } from 'vitest';
import { buildMediaStartedEmail } from '../../../lib/reviewEmail';

describe('buildMediaStartedEmail', () => {
    const mail = buildMediaStartedEmail({
        slug: 'wie-veraendern-ki-technologien-die-erstellung-von-modernen-websites',
        title: 'Wie veraendern KI-Technologien die Erstellung von modernen Websites?',
        triggerUrl: 'https://web.redrabbit.media/api/media-trigger?token=abc.def',
    });

    it('carries the signed media-trigger link as the primary action', () => {
        expect(mail.html).toContain('https://web.redrabbit.media/api/media-trigger?token=abc.def');
        expect(mail.text).toContain('https://web.redrabbit.media/api/media-trigger?token=abc.def');
    });

    it('links to the article too', () => {
        expect(mail.html).toContain('/tipps/wie-veraendern-ki-technologien-die-erstellung-von-modernen-websites');
    });

    it('frames it as step 2, no second text review', () => {
        expect(mail.html).toMatch(/Schritt 2/);
        expect(mail.subject).toMatch(/Medien/i);
    });

    it('contains no em-dash anywhere (Guardrail 8)', () => {
        expect(/[–—]/.test(mail.html)).toBe(false);
        expect(/[–—]/.test(mail.subject)).toBe(false);
        expect(/[–—]/.test(mail.text)).toBe(false);
    });
});
