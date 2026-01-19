import { regionalContent } from "@/lib/regional-content";
import RegionalLandingPage from "@/components/RegionalLandingPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Webdesign Vorarlberg: Qualität, die sich rechnet | ⭐ 4.8",
  description: "Gscheit online gehen. ⭐ 4.8 Bewertung. Premium-Website ab 790€. Wir schaffen Werte für Ihr Unternehmen. 0% Risiko.",
  alternates: {
    canonical: 'https://web.redrabbit.media/webdesign-vorarlberg',
  },
  openGraph: {
    title: "Webdesign Vorarlberg: Qualität, die sich rechnet | ⭐ 4.8",
    description: "Gscheit online gehen. ⭐ 4.8 Bewertung. Premium-Website ab 790€. Wir schaffen Werte für Ihr Unternehmen. 0% Risiko.",
    url: 'https://web.redrabbit.media/webdesign-vorarlberg',
    siteName: 'Red Rabbit Media',
    locale: 'de_AT',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function VorarlbergPage() {
  const regionalData = {
    region: "Vorarlberg",
    mainCity: "Bregenz",
    mainCitySlug: "bregenz",
    population: "400.000",
    cities: ["Bregenz", "Dornbirn", "Feldkirch", "Hohenems", "Lustenau"],
    landmarks: ["Seebühne", "Pfänder", "Kunsthaus", "Bodensee"],
    keywords: "Webdesign Vorarlberg, Homepage Vorarlberg, Webdesigner Bregenz",
  };

  return <RegionalLandingPage data={regionalData} content={regionalContent["Vorarlberg"]} />;
}
