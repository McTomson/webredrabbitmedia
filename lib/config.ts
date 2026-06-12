export const SITE_URL = 'https://web.redrabbit.media';
export const SITE_NAME = 'Red Rabbit Media';
export const COMPANY_NAME = 'Red Rabbit Media';
export const FOUNDING_YEAR = 2019;

export const AUTHORS = {
    thomas: {
        name: 'Thomas Uhlir MBA',
        role: 'Geschäftsführer & Strategie-Berater',
        linkedin: 'https://www.linkedin.com/in/thomasuhlir/',
        image: '/images/team/thomas.jpg', // Placeholder path
        knowsAbout: ['Digital Strategy', 'Webdesign ROI', 'Business Development'],
        // Stable schema.org @id: MUST match the Person node defined in app/layout.tsx
        // (#thomas-uhlir). Reusing the same @id across pages lets Google/LLMs merge
        // article authorship into ONE authoritative entity (E-E-A-T consolidation).
        entityId: `${SITE_URL}/#thomas-uhlir`
    },
    dmitry: {
        name: 'Dmitry Pashlov',
        role: 'Technischer Leiter & Lead Developer',
        linkedin: 'https://www.linkedin.com/in/dmitrypashlov/',
        image: '/images/team/dmitry.jpg', // Placeholder path
        knowsAbout: ['Next.js', 'React', 'SEO Performance', 'Web Core Vitals'],
        entityId: `${SITE_URL}/#dmitry-pashlov`
    }
};

export const PRICING = {
    baseline: 'ab 790 €',
    standard: '1.990 €',
    premium: 'ab 3.500 €'
};
