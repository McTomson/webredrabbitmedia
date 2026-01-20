import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Webdesign Oberösterreich | Website erstellen ab 790€",
    description: "Professionelles Webdesign in Oberösterreich. Website erstellen lassen ab 790€. Linz, Wels, Steyr & ganz OÖ. DSGVO-konform & mobil-optimiert. Kein Risiko.",
    keywords: "Webdesign Oberösterreich, Website erstellen Oberösterreich, Homepage OÖ, Webentwicklung Oberösterreich, Webdesigner Linz",

    // Open Graph
    openGraph: {
        type: 'website',
        locale: 'de_AT',
        url: 'https://web.redrabbit.media/webdesign-oberoesterreich',
        siteName: 'Red Rabbit Media',
        title: 'Webdesign Oberösterreich | Website ab 790€ - Linz, Wels, Steyr',
        description: 'Website erstellen in Oberösterreich ab 790€ ✓ Linz, Wels, Steyr ✓ Kein Risiko ✓ DSGVO-konform',
        images: [{
            url: 'https://web.redrabbit.media/images/og-image-wien.jpg',
            width: 1200,
            height: 630,
            alt: 'Red Rabbit Media - Webdesign Oberösterreich ab 790€',
        }],
    },

    // Twitter Cards
    twitter: {
        card: 'summary_large_image',
        title: 'Webdesign Oberösterreich | Website ab 790€',
        description: 'Website erstellen in OÖ ✓ Linz, Wels, Steyr ✓ Kein Risiko ✓ DSGVO-konform',
        images: ['https://web.redrabbit.media/images/twitter-card.jpg'],
    },

    // Canonical URL
    alternates: {
        canonical: 'https://web.redrabbit.media/webdesign-oberoesterreich',
    },

    // Robots
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
