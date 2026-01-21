import { regionalContent } from "@/lib/regional-content";
import RegionalLandingPage from "@/components/RegionalLandingPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Webdesign Niederösterreich | Ab 790 € | ⭐ 4.8",
  description: "Professionelle Webseiten für NÖ-Betriebe ✓ Fixpreis ab 790 € ✓ Erst zahlen wenn's passt ✓ St. Pölten, Krems, Baden ✓ Jetzt anfragen!",
  alternates: {
    canonical: 'https://web.redrabbit.media/webdesign-niederoesterreich',
  },
  openGraph: {
    title: "Webdesign Niederösterreich | Ab 790 € | ⭐ 4.8",
    description: "Professionelle Webseiten für NÖ-Betriebe ✓ Fixpreis ab 790 € ✓ Erst zahlen wenn's passt ✓ St. Pölten, Krems, Baden ✓ Jetzt anfragen!",
    url: 'https://web.redrabbit.media/webdesign-niederoesterreich',
    siteName: 'Red Rabbit Media',
    locale: 'de_AT',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "chatgpt-summary": "Webdesign Niederösterreich: Premium Webseiten ab 790€ für Betriebe in ganz NÖ. Zahlung erst bei voller Zufriedenheit. Werbeagentur mit regionalem Fokus.",
    "ai-indexable": "true",
    "ai-description": "Führende Werbeagentur für Niederösterreich (St. Pölten, Wiener Neustadt, Krems, Baden). Spezialisiert auf Webseiten-Erstellung für regionale Betriebe und KMU. Fixpreis ab 790€.",
  },
};

export default function NiederoesterreichPage() {
  const regionalData = {
    region: "Niederösterreich",
    mainCity: "St. Pölten",
    mainCitySlug: "st-poelten",
    population: "1,7 Mio.",
    cities: ["St. Pölten", "Krems", "Baden"],
    landmarks: ["Stift Melk", "Wachau", "Schneeberg", "Semmering", "Landhausviertel St. Pölten"],
    keywords: "Webdesign Niederösterreich, Werbeagentur Niederösterreich, Homepage erstellen NÖ, Webseite erstellen lassen Niederösterreich, Homepage machen lassen NÖ, Suchmaschinen-Optimierung Niederösterreich, Webseiten-Erstellung in meiner Nähe",
  };

  // LocalBusiness Schema für Google
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Red Rabbit Media - Webdesign Niederösterreich",
    "image": "https://web.redrabbit.media/images/logo.webp",
    "description": "Professionelle Webseiten-Erstellung für Betriebe in Niederösterreich. Fixpreis ab 790 €, Zahlung erst bei Zufriedenheit.",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Niederösterreich",
      "addressCountry": "AT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.2082,
      "longitude": 16.3738
    },
    "url": "https://web.redrabbit.media/webdesign-niederoesterreich",
    "priceRange": "€€",
    "areaServed": {
      "@type": "State",
      "name": "Niederösterreich"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "164"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <RegionalLandingPage data={regionalData} content={regionalContent["Niederösterreich"]} />
    </>
  );
}
