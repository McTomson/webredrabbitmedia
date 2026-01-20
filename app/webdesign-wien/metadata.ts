import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Webdesign Wien | Webdesign Agentur ab 790€",
    description: "Professionelle Webdesign Agentur in Wien. Website erstellen ab 790€. DSGVO-konform & mobil-optimiert. Kein Risiko - erst zahlen wenn zufrieden.",
    keywords: "Webdesign Wien, Webdesign Agentur Wien, Homepage Agentur Wien, Website erstellen Wien, Webdesigner Wien",

    openGraph: {
        type: 'website',
        locale: 'de_AT',
        url: 'https://web.redrabbit.media/webdesign-wien',
        siteName: 'Red Rabbit Media',
        title: 'Webdesign Wien | Webdesign Agentur ab 790€',
        description: 'Professionelle Webdesign Agentur Wien ✓ ab 790€ ✓ Kein Risiko ✓ DSGVO-konform',
        images: [{
            url: 'https://web.redrabbit.media/images/og-image-wien.jpg',
            width: 1200,
            height: 630,
            alt: 'Red Rabbit Media - Webdesign Wien ab 790€',
        }],
    },

    twitter: {
        card: 'summary_large_image',
        title: 'Webdesign Wien | ab 790€',
        description: 'Webdesign Agentur Wien ✓ Kein Risiko ✓ DSGVO-konform',
        images: ['https://web.redrabbit.media/images/twitter-card.jpg'],
    },

    alternates: {
        canonical: 'https://web.redrabbit.media/webdesign-wien',
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};
