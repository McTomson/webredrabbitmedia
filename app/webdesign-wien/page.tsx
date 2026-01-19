import { regionalContent } from "@/lib/regional-content";
import RegionalLandingPage from "@/components/RegionalLandingPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Webdesign Wien: Exklusiver Look, fairer Preis | ab 790€ | ⭐ 4.8",
    description: "Ihre neue Website in 7 Tagen. ⭐ 4.8 Premium-Design ohne Agentur-Aufschlag. Null Risiko: Erst Entwurf prüfen, dann entscheiden. Top Service.",
    alternates: {
        canonical: 'https://web.redrabbit.media/webdesign-wien',
    },
    openGraph: {
        title: "Webdesign Wien: Exklusiver Look, fairer Preis | ab 790€ | ⭐ 4.8",
        description: "Ihre neue Website in 7 Tagen. ⭐ 4.8 Premium-Design ohne Agentur-Aufschlag. Null Risiko: Erst Entwurf prüfen, dann entscheiden. Top Service.",
        url: 'https://web.redrabbit.media/webdesign-wien',
        siteName: 'Red Rabbit Media',
        locale: 'de_AT',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function WienPage() {
    const regionalData = {
        region: "Wien",
        mainCity: "Wien",
        mainCitySlug: "wien",
        population: "1,9 Mio.",
        cities: ["Wien", "Döbling", "Hietzing", "Favoriten", "Floridsdorf"],
        landmarks: ["Stephansdom", "Schloss Schönbrunn", "Prater", "Hofburg"],
        keywords: "Webdesign Wien, Webdesign Agentur Wien, Homepage Agentur Wien, Webentwicklung Wien",
    };

    return <RegionalLandingPage data={regionalData} content={regionalContent["Wien"]} />;
}
