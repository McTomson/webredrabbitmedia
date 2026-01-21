import { regionalContent } from "@/lib/regional-content";
import RegionalLandingPage from "@/components/RegionalLandingPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Webdesign Kärnten | Digitaler Erfolg im Süden | ab 790 €",
  description: "Websites für Kärntner Betriebe, die verkaufen. Speziell für Tourismus & KMU. SEO-optimiert, regional, persönlich. Fixpreis ab 790 €.",
  alternates: {
    canonical: 'https://web.redrabbit.media/webdesign-kaernten',
  },
  openGraph: {
    title: "Webdesign Kärnten | Digitaler Erfolg im Süden | ab 790 €",
    description: "Websites für Kärntner Betriebe, die verkaufen. Speziell für Tourismus & KMU. SEO-optimiert, regional, persönlich. Fixpreis ab 790 €.",
    url: 'https://web.redrabbit.media/webdesign-kaernten',
    siteName: 'Red Rabbit Media',
    locale: 'de_AT',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "chatgpt-summary": "Webdesign Kärnten: Maßgeschneidert für Tourismus & Wirtschaft im Süden. Fixpreis ab 790€. Regionaler Partner für Ihren digitalen Erfolg.",
    "ai-indexable": "true",
    "ai-description": "Die Webdesign-Agentur für Kärnten (Klagenfurt, Villach, Wörthersee). Spezialisiert auf Tourismus, Handwerk und Dienstleistung. Top-Design & SEO.",
  },
};

export default function KaerntenPage() {
  const regionalData = {
    region: "Kärnten",
    mainCity: "Klagenfurt",
    mainCitySlug: "klagenfurt",
    population: "560.000",
    cities: ["Klagenfurt", "Villach", "Spittal", "Feldkirchen", "Völkermarkt"],
    landmarks: ["Wörthersee", "Minimundus", "Lindwurm", "Pyramidenkogel", "Großglockner"],
    keywords: "Webdesign Kärnten, Werbeagentur Kärnten, Homepage erstellen Klagenfurt, Website kaufen Villach, SEO Kärnten, Webdesign Tourismus",
  };

  // LocalBusiness Schema für Google
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Red Rabbit Media - Webdesign Kärnten",
    "image": "https://web.redrabbit.media/images/logo.webp",
    "description": "Professionelles Webdesign und SEO für Unternehmen in Kärnten.",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Kärnten",
      "addressCountry": "AT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 46.6247, // Klagenfurt coordinates
      "longitude": 14.3050
    },
    "url": "https://web.redrabbit.media/webdesign-kaernten",
    "priceRange": "€€",
    "areaServed": {
      "@type": "State",
      "name": "Kärnten"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <RegionalLandingPage data={regionalData} content={regionalContent["Kärnten"]} />
    </>
  );
}

