import { regionalContent } from "@/lib/regional-content";
import RegionalLandingPage from "@/components/RegionalLandingPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Webdesign Burgenland: Digitaler Aufschwung | ab 790€ | ⭐ 4.8",
  description: "Modern, leistbar & regional. ⭐ 4.8 Bewertung. Website ab 790€. Wir bringen burgenländische Betriebe groß raus. Zahlung erst bei Erfolg.",
};

export default function BurgenlandPage() {
  const regionalData = {
    region: "Burgenland",
    mainCity: "Eisenstadt",
    mainCitySlug: "eisenstadt",
    population: "0,3 Mio.",
    cities: ["Eisenstadt", "Oberwart", "Mattersburg", "Neusiedl", "Pinkafeld"],
    landmarks: ["Schloss Esterházy", "Neusiedler See", "Burg Forchtenstein"],
    keywords: "Webdesign Burgenland, Website erstellen Burgenland, Homepage Burgenland, Webentwicklung Burgenland",
  };

  return <RegionalLandingPage data={regionalData} content={regionalContent["Burgenland"]} />;
}
