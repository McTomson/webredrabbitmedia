import { regionalContent } from "@/lib/regional-content";
import RegionalLandingPage from "@/components/RegionalLandingPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Webdesign Tirol: Gipfelstürmer-Design für Betriebe | ⭐ 4.8",
  description: "Bringen Sie Ihr Business nach ganz oben. ⭐ 4.8 Bewertung. Website ab 790€. Robust, schnell & mobil-optimiert. Erfolg ohne Vorkasse.",
  alternates: {
    canonical: 'https://web.redrabbit.media/webdesign-tirol',
  },
  openGraph: {
    title: "Webdesign Tirol: Gipfelstürmer-Design für Betriebe | ⭐ 4.8",
    description: "Bringen Sie Ihr Business nach ganz oben. ⭐ 4.8 Bewertung. Website ab 790€. Robust, schnell & mobil-optimiert. Erfolg ohne Vorkasse.",
    url: 'https://web.redrabbit.media/webdesign-tirol',
    siteName: 'Red Rabbit Media',
    locale: 'de_AT',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TirolPage() {
  const regionalData = {
    region: "Tirol",
    mainCity: "Innsbruck",
    mainCitySlug: "innsbruck",
    population: "760.000",
    cities: ["Innsbruck", "Kufstein", "Wörgl", "Schwaz", "Hall in Tirol"],
    landmarks: ["Goldenes Dachl", "Nordkette", "Bergisel", "Altstadt"],
    keywords: "Webdesign Tirol, Website erstellen Tirol, Homepage Innsbruck",
  };

  return <RegionalLandingPage data={regionalData} content={regionalContent["Tirol"]} />;
}
