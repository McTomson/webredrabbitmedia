import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Selbst-gehostete Fonts unter woertlichen Namen (Thomas 06.08.) -> ersetzt den
// render-blockierenden externen Google-Fonts-<link> auf den Seiten (FCP-Hebel).
import "./fonts-selfhosted.css";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChromeGate from "@/components/ChromeGate";
import DeferredThirdParties from "@/components/DeferredThirdParties";
import NoTrackFlag from "@/components/NoTrackFlag";
import LeadProvider from "@/components/relaunch/lead/LeadProvider";
import ChatWidgetMount from "@/components/relaunch/chat/ChatWidgetMount";
import { aggregateRatingLd } from '@/lib/reviews';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Webdesign Österreich: Premium-Qualität zum Fixpreis",
  description: "Webdesign zum Fixpreis für den österreichischen Mittelstand. Du siehst zuerst 1-2 grafische Entwürfe und zahlst erst, wenn du überzeugt bist. Kein Baukasten, keine Abos.",
  metadataBase: new URL('https://web.redrabbit.media'),

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'de_AT',
    url: 'https://web.redrabbit.media',
    siteName: 'Red Rabbit Media',
    title: 'Red Rabbit Media | Websites zum Fixpreis, ohne Vorkasse',
    description: 'Webdesign zum Fixpreis für den österreichischen Mittelstand. Entwurf zuerst, du zahlst erst, wenn du überzeugt bist. DSGVO-konform.',
    images: [{
      url: '/og/og-image-redrabbit.jpg',
      width: 1200,
      height: 630,
      alt: 'Red Rabbit Media, Webdesign zum Fixpreis aus Österreich',
    }],
  },

  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: 'Websites zum Fixpreis | Red Rabbit Media',
    description: 'Entwurf zuerst, du zahlst erst, wenn du überzeugt bist. DSGVO-konform, aus Österreich.',
    images: ['/og/og-image-redrabbit.jpg'],
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

// Viewport: bis 31.07. fehlte ein expliziter Export -> Next-Default ohne
// viewport-fit=cover, d.h. env(safe-area-inset-*) lieferten 0 (kein Notch-/
// Home-Indicator-Handling auf iPhones). viewport-fit=cover aktiviert die Insets;
// das Safe-Area-Padding setzen die Fixed-Chrome-Elemente selbst (CornerLogo,
// Menue-Overlay, Nach-oben-Button).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://web.redrabbit.media/#localbusiness",
      "name": "Red Rabbit Media",
      // Echtes Google-Rating (lib/reviews.ts). Rendert nur, wenn echte Zahlen hinterlegt
      // sind — sonst kein aggregateRating (kein Review-Spam). Aktuell 5,0 aus 8.
      ...(aggregateRatingLd() ? { aggregateRating: aggregateRatingLd() } : {}),
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
        "@id": "https://web.redrabbit.media/#thomas-uhlir"
      },
      "employee": [
        {
          "@type": "Person",
          "@id": "https://web.redrabbit.media/#thomas-uhlir",
          "name": "Thomas Uhlir MBA",
          "jobTitle": "Founder & Strategy",
          "url": "https://web.redrabbit.media/#about",
          "image": "https://web.redrabbit.media/images/thomas-uhlir.jpg",
          "sameAs": "https://www.linkedin.com/in/thomasuhlir/",
          "worksFor": { "@id": "https://web.redrabbit.media/#organization" },
          "knowsAbout": [
            "Webdesign",
            "Suchmaschinenoptimierung (SEO)",
            "Generative Engine Optimization (GEO)",
            "Next.js",
            "Conversion-Optimierung",
            "Webdesign Österreich"
          ]
        },
        {
          "@type": "Person",
          "name": "Dmitry Pashlov",
          "jobTitle": "Tech Lead & Development",
          "sameAs": "https://www.linkedin.com/in/dmitrypashlov",
          "image": "https://web.redrabbit.media/images/dmitry-pashlov.jpg"
        }
      ],
      "priceRange": "ab 1.250 €",
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
      // Gruender-Verknuepfung staerkt E-E-A-T (echte Person hinter der Marke).
      // foundingDate BEWUSST NICHT gesetzt: exaktes GmbH-Gruendungsdatum liegt nicht
      // verifiziert vor -> nicht raten (autoritative Daten). Nachtragen, wenn belegt.
      "founder": { "@id": "https://web.redrabbit.media/#thomas-uhlir" },
      "sameAs": [
        "https://www.instagram.com/redrabbit.media/",
        "https://www.linkedin.com/in/thomasuhlir/"
      ]
    },
    {
      // WebSite-Node fuer GEO/Sitelinks (Name der Domain in Answer Engines). Kein
      // SearchAction — es gibt keine seiteneigene Suche, also nichts erfinden.
      "@type": "WebSite",
      "@id": "https://web.redrabbit.media/#website",
      "url": "https://web.redrabbit.media",
      "name": "Red Rabbit Media",
      "inLanguage": "de-AT",
      "publisher": { "@id": "https://web.redrabbit.media/#organization" }
    }
    // Product/Offer-Schema bewusst NICHT global: Angebote/Preise (Starter 1.250 /
    // Business 2.850 / Premium ab 4.900) liegen als Service+Offer page-level auf
    // /preise. Ein globales Offer streute Preis-Nodes auf Impressum/AGB/Datenschutz
    // (Rich-Result-/Spam-Signal) und widerspraeche mit einem Einzelpreis der Tier-
    // Realitaet. Das alte 790er-Product ist damit entfernt (Relaunch-Preise gelten).
  ]
};

import { ContactFormProvider } from "@/components/ContactFormProvider";
import ContactFormWrapper from "@/components/ContactFormWrapper";
import AOSInit from "@/components/AOSInit";
import AnalyticsListener from "@/components/AnalyticsListener";
import ClarityLoader from "@/components/ClarityLoader";
import CookieBanner from "@/components/CookieBanner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Consent Mode v2 Defaults (DSGVO). Laeuft SYNCHRON als erstes Element im
            <head>, VOR GA4/GTM (die verzoegert via DeferredThirdParties nachladen).
            Plain <script> (kein next/script) = garantiert synchron waehrend des
            HTML-Parse, bevor irgendein Analytics-Code laeuft.

            OPT-OUT-MODELL (bewusste Entscheidung Thomas, 2026-08-12) — NICHT auf
            Opt-in zuruecksetzen:
              - Default = 'granted' fuer alle Signale. Tracking (GA4 + Clarity) feuert
                ab dem ersten Seitenaufruf, der Nutzer kann jederzeit ablehnen.
              - Der localStorage-Key des CookieBanners wird im selben Script sofort
                gelesen: hat ein wiederkehrender Nutzer bereits ABGELEHNT
                (analytics/marketing=false), wird das per consent update SYNCHRON auf
                'denied' gesetzt, BEVOR ein Tag feuert -> abgelehnte Nutzer werden
                nicht getrackt. Gespeicherte Zustimmung bleibt granted (== Default).
              - Kein wait_for_update noetig: Default ist granted und ein evtl.
                gespeicherter Opt-out wird synchron in derselben Ausfuehrung angewandt.
              - ads_data_redaction bleibt als Datenschutz-Schutz aktiv. */}
        <script
          id="consent-mode-default"
          dangerouslySetInnerHTML={{
            __html: `(function(){window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);try{var c=localStorage.getItem('redrabbit-cookie-consent');if(c){var p=JSON.parse(c);var m=p.marketing?'granted':'denied';gtag('consent','update',{ad_storage:m,ad_user_data:m,ad_personalization:m,analytics_storage:p.analytics?'granted':'denied'});}}catch(e){}})();`,
          }}
        />
        {/* Priority Resource Hints */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Kritischen Font-Schnitt (DM Sans, Headlines/Wortmarke) vorladen, damit
            der sichtbare Text ohne Flackern in der richtigen Schrift paintet
            (selbst-gehostet, Thomas 06.08.). crossOrigin Pflicht auch same-origin. */}
        <link rel="preload" href="/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossOrigin="" />

        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="Red Rabbit Media Website Tipps RSS Feed" href="/feed.xml" />

        {/* LLM/AI-Search-Kontext (ChatGPT, Claude, Perplexity). Nicht-offizielle
            Metas — laut Research kein bestaetigter Ranking-Hebel, aber solange sie
            existieren, muessen sie akkurat sein: alte Zahlen (790€/164) raus, echte
            Fakten rein. Deutsch (AT-Zielgruppe). Wert-Feinschliff -> Phase B. */}
        <meta name="chatgpt-summary" content="Red Rabbit Media ist eine oesterreichische Webdesign-Agentur in Wien fuer den Mittelstand (Handwerk, Gastronomie, Dienstleister, Aerzte, Kanzleien). Fixpreis-Pakete: Starter 1.250 EUR, Business 2.850 EUR, Premium ab 4.900 EUR. Du siehst zuerst 1-2 grafische Vorschlaege ohne Vorkasse; SEO und KI-Sichtbarkeit sind im Fundament dabei, DSGVO-konform, KMU.DIGITAL-foerderbar. Kontakt: office@redrabbit.media, +43 676 9000955" />
        <meta name="ai-indexable" content="true" />
        <meta name="ai-description" content="Oesterreichische Webdesign-Agentur in Wien fuer den Mittelstand: individuell gebaute, DSGVO-konforme Websites mit SEO und KI-Sichtbarkeit als Fundament. Fixpreis-Pakete ab 1.250 EUR, grafischer Vorschlag ohne Vorkasse." />

        {/* Analytics (GA4 + GTM) laden jetzt verzoegert via DeferredThirdParties
            im <body> (Mobile-Perf, Thomas 06.08.) — nicht mehr hier im <head>. */}
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
          <LeadProvider>
          <AOSInit />
          {/* Do-Not-Track-Schalter fuers Team (Thomas 2026-08-12): setzt/loescht das
              Geraete-Flag aus ?rr_notrack. MUSS vor den Analytics-Komponenten stehen,
              damit sein Effect zuerst laeuft. */}
          <NoTrackFlag />
          <DeferredThirdParties gaId="G-09FNC6THTD" gtmId="GTM-MQXGT8FL" />
          <ClarityLoader />
          <AnalyticsListener />
          <ChromeGate><Header /></ChromeGate>
          <main id="main-content" tabIndex={-1} className="scroll-mt-20 focus:outline-none">{children}</main>
          <ChromeGate><Footer /></ChromeGate>
          <ContactFormWrapper />
          {/* Chat-Widget global auf ALLEN Seiten (client-only, ssr:false). Spricht
              via fetch/SSE mit chat.redrabbit.media; Turnstile-Script/-iframe von
              challenges.cloudflare.com (CSP entsprechend erweitert). */}
          <ChatWidgetMount />
          {/* Cookie-Banner global auf ALLEN Routen (DSGVO). Rendert per
              localStorage-Guard nur einmal sichtbar; alte Seiten, die ihn noch
              selbst einbinden (ClientWidgets/RegionalLandingPage/CityContent),
              werden vom Go-Live-Umbau entfernt. */}
          <CookieBanner />
          </LeadProvider>
        </ContactFormProvider>
      </body>
    </html>
  );
}
