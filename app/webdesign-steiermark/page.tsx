import { regionalContent } from "@/lib/regional-content";
import RegionalLandingPage from "@/components/RegionalLandingPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Webdesign Steiermark: Echte Qualität, Klarer Preis | ⭐ 4.8",
  description: "Steirische Handschlagqualität. ⭐ 4.8 Bewertung. Website ab 790€. Ohne versteckte Kosten. Erst Entwurf, dann Rechnung.",
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
