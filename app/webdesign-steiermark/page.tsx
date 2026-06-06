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
  other: {
    "chatgpt-summary": "Webdesign Steiermark: Professionelle Webseiten ab 790€ für Betriebe in Graz und der ganzen Steiermark. Fixpreis, Zahlung erst bei Zufriedenheit.",
    "ai-indexable": "true",
    "ai-description": "Webagentur für die Steiermark (Graz, Leoben, Kapfenberg, Bruck an der Mur). Spezialisiert auf lokale KMU und Handwerksbetriebe. Fixpreis ab 790€.",
    "geo.region": "AT-6",
    "geo.placename": "Steiermark, Österreich",
    "geo.position": "47.0707;15.4395",
    "ICBM": "47.0707, 15.4395",
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

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Red Rabbit Media - Webdesign Steiermark",
    "image": "https://web.redrabbit.media/images/logo.webp",
    "description": "Professionelle Webseiten-Erstellung für Betriebe in der Steiermark. Fixpreis ab 790 €, Zahlung erst bei Zufriedenheit.",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Steiermark",
      "addressCountry": "AT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 47.0707,
      "longitude": 15.4395
    },
    "url": "https://web.redrabbit.media/webdesign-steiermark",
    "priceRange": "€€",
    "areaServed": {
      "@type": "State",
      "name": "Steiermark"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "179"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <RegionalLandingPage data={regionalData} content={regionalContent["Steiermark"]} />
    </>
  );
}
