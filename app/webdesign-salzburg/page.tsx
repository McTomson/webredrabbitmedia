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
};

export default function SalzburgPage() {
    const regionalData = {
        region: "Salzburg",
        mainCity: "Salzburg",
        mainCitySlug: "salzburg",
        population: "0,5 Mio.",
        cities: ["Salzburg", "Hallein", "Saalfelden", "St. Johann", "Bischofshofen"],
        landmarks: ["Festung Hohensalzburg", "Getreidegasse", "Dom", "Mirabellgarten"],
        keywords: "Webdesign Salzburg, Website erstellen Salzburg, Homepage Salzburg, Webagentur Salzburg",
    };

    return <RegionalLandingPage data={regionalData} content={regionalContent["Salzburg"]} />;
}
