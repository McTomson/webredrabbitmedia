import { regionalContent } from "@/lib/regional-content";
import RegionalLandingPage from "@/components/RegionalLandingPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Webdesign OÖ: Digitaler Vorsprung für Macher | ab 790€ | ⭐ 4.8",
    description: "Innovation trifft Fairness. ⭐ 4.8 Bewertung. Website ab 790€ für OÖ Unternehmen. Kein 'Larifari', nur Ergebnisse. Zahlung erst nach Abnahme.",
    alternates: {
        canonical: 'https://web.redrabbit.media/webdesign-oberoesterreich',
    },
    openGraph: {
        title: "Webdesign OÖ: Digitaler Vorsprung für Macher | ab 790€ | ⭐ 4.8",
        description: "Innovation trifft Fairness. ⭐ 4.8 Bewertung. Website ab 790€ für OÖ Unternehmen. Kein 'Larifari', nur Ergebnisse. Zahlung erst nach Abnahme.",
        url: 'https://web.redrabbit.media/webdesign-oberoesterreich',
        siteName: 'Red Rabbit Media',
        locale: 'de_AT',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
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
