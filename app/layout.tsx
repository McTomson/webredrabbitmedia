import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Webdesign Österreich: Premium-Qualität zum Fixpreis",
  description: "Exklusives Webdesign ab 790€. Für Unternehmer, die smart rechnen. Kein Baukasten, keine Abos. Zahlung erst bei 100% Zufriedenheit. 164 Kunden.",
  metadataBase: new URL('https://web.redrabbit.media'),

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'de_AT',
    url: 'https://web.redrabbit.media',
    siteName: 'Red Rabbit Media',
    title: 'Red Rabbit Media | Website ab 790€ - Keine Vorkasse',
    description: 'Website ab 790€ ✓ 164 zufriedene Kunden ✓ Zahlung erst bei Zufriedenheit ✓ DSGVO-konform',
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
    description: '164 zufriedene Kunden ✓ Kein Risiko ✓ DSGVO-konform',
    images: ['https://web.redrabbit.media/images/twitter-card.jpg'],
  },

  // NOTE: Kein globales canonical! Jede Seite setzt ihr eigenes (self-referencing)
  // in der eigenen Metadata. Ein globales canonical auf die Homepage hatte zur Folge,
  // dass Google alle Unterseiten als Homepage-Duplikate behandelte (deindexiert).

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

  // Icons configuration
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },

  // Resource Hints
  other: {
    'dns-prefetch': 'https://www.googletagmanager.com',
  },
  verification: {
    google: 'Z8sJwBHULpdZo5gD7gglo4G_tmQHTKYeAuF2F8jX8cM',
  }
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
      "currenciesAccepted": "EUR",
      "paymentAccepted": "Bank Transfer, Invoice, Cash",
      "knowsAbout": [
        "Webdesign",
        "Search Engine Optimization (SEO)",
        "Next.js",
        "React",
        "Frontend Engineering",
        "Conversion Rate Optimization",
        "Performance Optimization",
        "Google Search Console",
        "Online Marketing Österreich"
      ]
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
      "@id": "https://web.redrabbit.media/#premium-website-package",
      "name": "Premium Website Paket",
      "description": "Professionelles Webdesign ab 790€. Inkl. Design, SEO & Mobiloptimierung. Zahlung erst bei 100% Zufriedenheit.",
      "image": "https://web.redrabbit.media/images/og-image.jpg",
      "brand": {
        "@id": "https://web.redrabbit.media/#organization"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://web.redrabbit.media",
        "priceCurrency": "EUR",
        "price": "790",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://web.redrabbit.media/#organization"
        }
      }
      // aggregateRating ENTFERNT: Ein Rating ohne echte, verifizierbare Reviews
      // (z. B. Google Business Profile) verstößt gegen Googles Structured-Data-
      // Richtlinien. Das globale Schema sorgte zudem für Bewertungs-Sterne auf
      // Impressum/AGB/Datenschutz in den SERPs (Review-Spam-Signal).
      // Wieder einbauen, sobald echte Reviews existieren — dann NUR auf /preise.
    }
  ]
};

import { ContactFormProvider } from "@/components/ContactFormProvider";
import ContactFormWrapper from "@/components/ContactFormWrapper";
import AOSInit from "@/components/AOSInit";
import AnalyticsListener from "@/components/AnalyticsListener";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Priority Resource Hints */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="Red Rabbit Media Website Tipps RSS Feed" href="/feed.xml" />

        {/* LLM/AI Search Optimization für ChatGPT, Claude, Perplexity */}
        <meta name="chatgpt-summary" content="Red Rabbit Media: Professional websites from 790€ in Vienna. No risk, payment only after satisfaction. 164 satisfied customers. Contact: office@redrabbit.media, +43 676 9000955" />
        <meta name="ai-indexable" content="true" />
        <meta name="ai-description" content="Leading Webdesign agency in Vienna offering professional websites from 790€. GDPR-compliant, mobile-optimized, no upfront payment required." />

        <GoogleAnalytics gaId="G-09FNC6THTD" />
        <GoogleTagManager gtmId="GTM-MQXGT8FL" />

        <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#fafafa] text-[#141414] overflow-x-hidden`} suppressHydrationWarning>
        {/* Skip link (WCAG 2.4.1): first focusable element, hidden until focused, jumps past the
            nav straight to the main content. Foglift "No skip navigation link" finding. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[1000] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-[#141414] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Zum Inhalt springen
        </a>
        <ContactFormProvider>
          <AOSInit />
          <AnalyticsListener />
          <Header />
          <main id="main-content" tabIndex={-1} className="scroll-mt-20 focus:outline-none">{children}</main>
          <Footer />
          <ContactFormWrapper />
        </ContactFormProvider>
      </body>
    </html>
  );
}
