import { regionalContent } from "@/lib/regional-content";
import RegionalLandingPage from "@/components/RegionalLandingPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Webdesign Kärnten: Online-Erfolg im Süden | ab 790€ | ⭐ 4.8",
  description: "Websites so attraktiv wie unser Land. ⭐ 4.8 Bewertung. Ab 790€ Fixpreis. Perfekt für Tourismus & Gewerbe. Erst sehen, dann zahlen.",
};

export default function KaerntenPage() {
  const regionalData = {
    region: "Kärnten",
    mainCity: "Klagenfurt",
    mainCitySlug: "klagenfurt",
    population: "560.000",
    cities: ["Klagenfurt", "Villach", "Spittal", "Feldkirchen", "Völkermarkt"],
    landmarks: ["Wörthersee", "Minimundus", "Lindwurm", "Pyramidenkogel"],
    keywords: "Website erstellen Kärnten, Webdesign Kärnten, Homepage Klagenfurt",
  };

  return <RegionalLandingPage data={regionalData} content={regionalContent["Kärnten"]} />;
}
