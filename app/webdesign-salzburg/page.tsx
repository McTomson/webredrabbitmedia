import { regionalContent } from "@/lib/regional-content";
import RegionalLandingPage from "@/components/RegionalLandingPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Webdesign Salzburg: Weltklasse Design, Lokal betreut | ⭐ 4.8",
    description: "Ein Auftritt mit Stil für Salzburger Betriebe. Ab 790€. Exklusiv, elegant & effektiv. Zahlen Sie nur bei 100% Zufriedenheit. ⭐ 4.8",
    alternates: {
        canonical: 'https://web.redrabbit.media/webdesign-salzburg',
    },
    openGraph: {
        title: "Webdesign Salzburg: Weltklasse Design, Lokal betreut | ⭐ 4.8",
        description: "Ein Auftritt mit Stil für Salzburger Betriebe. Ab 790€. Exklusiv, elegant & effektiv. Zahlen Sie nur bei 100% Zufriedenheit. ⭐ 4.8",
        url: 'https://web.redrabbit.media/webdesign-salzburg',
        siteName: 'Red Rabbit Media',
        locale: 'de_AT',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
    other: {
        "chatgpt-summary": "Webdesign Salzburg: Premium Webseiten ab 790€ für Betriebe in ganz Salzburg. Zahlung erst bei voller Zufriedenheit. Werbeagentur mit regionalem Fokus.",
        "ai-indexable": "true",
        "ai-description": "Führende Werbeagentur für Salzburg (Stadt Salzburg, Hallein, Saalfelden, St. Johann). Spezialisiert auf Webseiten-Erstellung für regionale Betriebe und KMU. Fixpreis ab 790€.",
    },
};

export default function SalzburgPage() {
    const regionalData = {
        region: "Salzburg",
        mainCity: "Salzburg",
        mainCitySlug: "salzburg",
        population: "0,5 Mio.",
        cities: ["Salzburg", "Hallein", "Saalfelden", "St. Johann", "Bischofshofen"],
        landmarks: ["Festung Hohensalzburg", "Getreidegasse", "Dom", "Mirabellgarten"],
        keywords: "Webdesign Salzburg, Website erstellen Salzburg, Homepage Salzburg, Webagentur Salzburg, Webdesigner Salzburg, SEO Salzburg",
    };

    // LocalBusiness Schema für Google
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Red Rabbit Media - Webdesign Salzburg",
        "image": "https://web.redrabbit.media/images/logo.webp",
        "description": "Professionelle Webseiten-Erstellung für Betriebe in Salzburg. Fixpreis ab 790 €, Zahlung erst bei Zufriedenheit.",
        "address": {
            "@type": "PostalAddress",
            "addressRegion": "Salzburg",
            "addressCountry": "AT"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 47.8095,
            "longitude": 13.0550
        },
        "url": "https://web.redrabbit.media/webdesign-salzburg",
        "priceRange": "€€",
        "areaServed": {
            "@type": "State",
            "name": "Salzburg"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "134"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />
            <RegionalLandingPage data={regionalData} content={regionalContent["Salzburg"]} />
        </>
    );
}
