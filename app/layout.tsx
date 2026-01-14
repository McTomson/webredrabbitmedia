import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Red Rabbit Media | Professionelles Webdesign ab 790€",
  description: "Professionelle Website ab 790€. Über 315 zufriedene Kunden. Erst zahlen wenn zufrieden. DSGVO-konform & mobil-optimiert.",
  metadataBase: new URL('https://web.redrabbit.media'),

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'de_AT',
    url: 'https://web.redrabbit.media',
    siteName: 'Red Rabbit Media',
    title: 'Red Rabbit Media | Website ab 790€ - Keine Vorkasse',
    description: 'Website ab 790€ ✓ Über 315 zufriedene Kunden ✓ Zahlung erst bei Zufriedenheit ✓ DSGVO-konform',
    images: [{
      url: 'https://web.redrabbit.media/images/og-image-wien.jpg',
      width: 1200,
      height: 630,
      alt: 'Red Rabbit Media - Webdesign Wien ab 790€',
    }],
  },

  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: 'Website ab 790€ | Red Rabbit Media Wien',
    description: '315 zufriedene Kunden ✓ Kein Risiko ✓ DSGVO-konform',
    images: ['https://web.redrabbit.media/images/twitter-card.jpg'],
  },

  // Canonical URL
  alternates: {
    canonical: 'https://web.redrabbit.media',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://web.redrabbit.media/#localbusiness",
      "name": "Red Rabbit Media",
      "image": "https://web.redrabbit.media/images/og-image.jpg",
      "telephone": "+436769000955",
      "email": "office@redrabbit.media",
      "url": "https://web.redrabbit.media",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Grabnergasse 8",
        "addressLocality": "Wien",
        "postalCode": "1060",
        "addressCountry": "AT"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 48.1923,
        "longitude": 16.3533
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      },
      "areaServed": [
        { "@type": "City", "name": "Wien" },
        { "@type": "City", "name": "Graz" },
        { "@type": "City", "name": "Linz" },
        { "@type": "City", "name": "Salzburg" },
        { "@type": "City", "name": "Innsbruck" },
        { "@type": "City", "name": "Klagenfurt" },
        { "@type": "City", "name": "Bregenz" },
        { "@type": "City", "name": "Eisenstadt" },
        { "@type": "City", "name": "St. Pölten" }
      ],
      "founder": {
        "@type": "Person",
        "name": "Thomas Uhlir MBA",
        "jobTitle": "Founder & Strategy"
      },
      "employee": [
        {
          "@type": "Person",
          "name": "Thomas Uhlir MBA",
          "jobTitle": "Strategie & Design",
          "image": "https://web.redrabbit.media/images/thomas-uhlir.jpg"
        },
        {
          "@type": "Person",
          "name": "Dmitry Pashlov",
          "jobTitle": "Tech Lead & Development",
          "sameAs": "https://www.linkedin.com/in/dmitrypashlov",
          "image": "https://web.redrabbit.media/images/dmitry-pashlov.jpg"
        }
      ],
      "priceRange": "ab 790€",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "315",
        "bestRating": "5",
        "worstRating": "1"
      },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".speakable-content", "h1", "h2"]
      }
    },
    {
      "@type": "Organization",
      "@id": "https://web.redrabbit.media/#organization",
      "name": "Red Rabbit Media",
      "url": "https://web.redrabbit.media",
      "logo": "https://web.redrabbit.media/logo.png",
      "sameAs": [
        "https://www.instagram.com/redrabbit.media/",
        "https://www.linkedin.com/in/thomasuhlir/"
      ]
    },
    {
      "@type": "Product",
      "name": "Premium Website",
      "description": "Professionelle Website inkl. Design, SEO & Mobiloptimierung",
      "image": "https://web.redrabbit.media/images/og-image.jpg",
      "offers": {
        "@type": "AggregateOffer",
        "url": "https://web.redrabbit.media",
        "priceCurrency": "EUR",
        "lowPrice": "790",
        "highPrice": "2800",
        "offerCount": "1",
        "priceValidUntil": "2026-12-31"
      },
      "brand": {
        "@type": "Brand",
        "name": "Red Rabbit Media"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "315",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    {
      "@type": "ProfessionalService",
      "name": "Red Rabbit Media Webdesign",
      "description": "Professionelles Webdesign und SEO Agentur aus Wien.",
      "url": "https://web.redrabbit.media",
      "image": "https://web.redrabbit.media/images/og-image.jpg",
      "telephone": "+436769000955",
      "priceRange": "€€",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Grabnergasse 8",
        "addressLocality": "Wien",
        "postalCode": "1060",
        "addressCountry": "AT"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* LLM/AI Search Optimization für ChatGPT, Claude, Perplexity */}
        <meta name="chatgpt-summary" content="Red Rabbit Media: Professional websites from 790€ in Vienna. No risk, payment only after satisfaction. 315+ satisfied customers, 4.8 stars. Contact: office@redrabbit.media, +43 676 9000955" />
        <meta name="ai-indexable" content="true" />
        <meta name="ai-description" content="Leading Webdesign agency in Vienna offering professional websites from 790€. GDPR-compliant, mobile-optimized, no upfront payment required." />

        {/* Resource Hints für Performance-Optimierung */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/images/logo.webp" as="image" type="image/webp" />

        {/* Google Analytics GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G6KH3WEZY7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-G6KH3WEZY7');
          `}
        </Script>

        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5H3PT57P');`}
        </Script>
        <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#fafafa] text-[#141414]`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5H3PT57P"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
