import { regionalContent } from "@/lib/regional-content";
import RegionalLandingPage from "@/components/RegionalLandingPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Webdesign Steiermark: Echte Qualität, Klarer Preis | ⭐ 4.8",
  description: "Steirische Handschlagqualität. ⭐ 4.8 Bewertung. Website ab 790€. Ohne versteckte Kosten. Erst Entwurf, dann Rechnung.",
  alternates: {
    canonical: 'https://web.redrabbit.media/webdesign-steiermark',
  },
  openGraph: {
    title: "Webdesign Steiermark: Echte Qualität, Klarer Preis | ⭐ 4.8",
    description: "Steirische Handschlagqualität. ⭐ 4.8 Bewertung. Website ab 790€. Ohne versteckte Kosten. Erst Entwurf, dann Rechnung.",
    url: 'https://web.redrabbit.media/webdesign-steiermark',
    siteName: 'Red Rabbit Media',
    locale: 'de_AT',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SteiermarkPage() {
  const regionalData = {
    region: "Steiermark",
    mainCity: "Graz",
    mainCitySlug: "graz",
    population: "1,2 Mio.",
    cities: ["Graz", "Leoben", "Kapfenberg", "Bruck an der Mur", "Knittelfeld"],
    landmarks: ["Uhrturm", "Kunsthaus", "Murinsel", "Schlossberg"],
    keywords: "Webdesign Steiermark, Webdesigner Graz, Homepage erstellen Steiermark",
  };

  return <RegionalLandingPage data={regionalData} content={regionalContent["Steiermark"]} />;
}
