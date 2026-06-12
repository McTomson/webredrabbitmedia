// Schema.org Organization Markup
import { aggregateRatingLd } from '@/lib/reviews';

// aggregateRating wird NUR aus echten Google-Reviews gerendert (lib/reviews.ts).
// Solange dort keine echten Zahlen hinterlegt sind, liefert dies undefined und es
// landet KEIN Rating im Schema (kein Review-Spam, kein UWG-Risiko).
const ratingLd = aggregateRatingLd();

export const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://web.redrabbit.media/#organization',
    name: 'Red Rabbit Media',
    url: 'https://web.redrabbit.media',
    logo: {
        '@type': 'ImageObject',
        url: 'https://web.redrabbit.media/images/logo.webp',
        width: 677,
        height: 267,
    },
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+43-676-9000955',
        contactType: 'customer service',
        areaServed: 'AT',
        availableLanguage: ['German', 'de'],
        email: 'office@redrabbit.media',
    },
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Grabnergasse 8',
        addressLocality: 'Wien',
        postalCode: '1060',
        addressCountry: 'AT',
    },
    sameAs: [
        // Add social media profiles here
        'https://www.facebook.com/redrabbit.media',
        'https://www.instagram.com/redrabbit.media',
    ],
    ...(ratingLd ? { aggregateRating: ratingLd } : {}),
    priceRange: '€€',
    description: 'Professionelle Webdesign Agentur in Wien. Website ab 790€. 164 zufriedene Kunden.',
};

// LocalBusiness Schema (zusätzlich zu Organization)
export const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://web.redrabbit.media/#localbusiness',
    name: 'Red Rabbit Media',
    image: 'https://web.redrabbit.media/images/logo.webp',
    telephone: '+43-676-9000955',
    email: 'office@redrabbit.media',
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Grabnergasse 8',
        addressLocality: 'Wien',
        addressRegion: 'Wien',
        postalCode: '1060',
        addressCountry: 'AT',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 48.1975,
        longitude: 16.3524,
    },
    url: 'https://web.redrabbit.media',
    priceRange: '€€',
    openingHoursSpecification: [
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
        },
    ],
    ...(ratingLd ? { aggregateRating: ratingLd } : {}),
};


// WebSite Schema mit SearchAction
export const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://web.redrabbit.media/#website',
    url: 'https://web.redrabbit.media',
    name: 'Red Rabbit Media - Website ab 790€',
    description: 'Professionelle Website ab 790€. 164 zufriedene Kunden. Erst zahlen wenn zufrieden.',
    publisher: {
        '@id': 'https://web.redrabbit.media/#organization',
    },
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://web.redrabbit.media/tipps?search={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
    },
    inLanguage: 'de-AT',
};
