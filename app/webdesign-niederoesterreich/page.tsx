import { regionalContent } from "@/lib/regional-content";
import RegionalLandingPage from "@/components/RegionalLandingPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Webdesign Niederösterreich: Wachstum für Ihr Business | ⭐ 4.8",
  description: "Modernster Webauftritt für NÖ-Betriebe. ⭐ 4.8 Bewertung. Ab 790€ Fixpreis. Wir digitalisieren Ihren Erfolg. Erst zahlen, wenn Sie begeistert sind.",
};

export default function NiederoesterreichPage() {
  const regionalData = {
    region: "Niederösterreich",
    mainCity: "St. Pölten",
    mainCitySlug: "st-poelten",
    population: "1,7 Mio.",
    cities: ["St. Pölten", "Wiener Neustadt", "Klosterneuburg", "Baden", "Krems"],
    landmarks: ["Stift Melk", "Wachau", "Schneeberg", "Semmering"],
    keywords: "Webdesign Niederösterreich, Website erstellen NÖ, Homepage Niederösterreich, Webentwicklung NÖ",
  };

  return <RegionalLandingPage data={regionalData} content={regionalContent["Niederösterreich"]} />;
}
