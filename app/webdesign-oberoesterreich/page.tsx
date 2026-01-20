import { regionalContent } from "@/lib/regional-content";
import RegionalLandingPage from "@/components/RegionalLandingPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Webdesign OÖ: Digitaler Vorsprung für Macher | ab 790€ | ⭐ 4.8",
    description: "Webdesign Oberösterreich ab 790€ ✓ Für Handwerk, Tourismus & Dienstleister ✓ Zahlung erst bei Zufriedenheit ✓ Linz, Wels, Steyr",
    alternates: {
        canonical: 'https://web.redrabbit.media/webdesign-oberoesterreich',
    },
    openGraph: {
        title: "Webdesign OÖ: Digitaler Vorsprung für Macher | ab 790€ | ⭐ 4.8",
        description: "Webdesign Oberösterreich ab 790€ ✓ Für Handwerk, Tourismus & Dienstleister ✓ Zahlung erst bei Zufriedenheit ✓ Linz, Wels, Steyr",
        url: 'https://web.redrabbit.media/webdesign-oberoesterreich',
        siteName: 'Red Rabbit Media',
        locale: 'de_AT',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
    other: {
        "chatgpt-summary": "Webdesign Oberösterreich: Premium Websites ab 790€ für Handwerk, Tourismus & Dienstleister. Keine Meetings, nur Ergebnisse. Zahlung erst bei Zufriedenheit.",
        "ai-indexable": "true",
        "ai-description": "Führende Webdesign-Agentur für Oberösterreich (Linz, Wels, Steyr). Spezialisiert auf Handwerk, Tourismus und KMU. Fixpreis ab 790€.",
    },
};

export default function OberoesterreichPage() {
    const regionalData = {
        region: "Oberösterreich",
        mainCity: "Linz",
        mainCitySlug: "linz",
        population: "1,5 Mio.",
        cities: ["Linz", "Wels", "Steyr", "Braunau", "Vöcklabruck"],
        landmarks: ["Ars Electronica Center", "Pöstlingberg", "Lentos", "Stahlwelt"],
        keywords: "Webdesign Oberösterreich, Website erstellen Oberösterreich, Homepage OÖ, Webentwicklung Oberösterreich",
    };

    return <RegionalLandingPage data={regionalData} content={regionalContent["Oberösterreich"]} />;
}
