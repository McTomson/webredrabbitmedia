import { Metadata } from 'next';
import { cities, type CitySlug } from './cities';
import { notFound } from 'next/navigation';
import CityContent from './CityContent';
import { SITE_URL, COMPANY_NAME, PRICING } from '@/lib/config';
import { clusterContent } from './cluster-content';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    if (!slug || !slug.startsWith('webdesign-')) {
        return { title: 'Seite nicht gefunden' };
    }

    const citySlug = slug.replace('webdesign-', '') as CitySlug;
    const city = cities[citySlug];

    if (!city) {
        return { title: 'Stadt nicht gefunden' };
    }

    return {
        title: `Webdesign ${city.name} ab 790 € – ohne Vorkasse`,
        description: `Webdesign für ${city.name}: DSGVO-konforme Website ab 790 € Fixpreis. Erster Entwurf in 7 Tagen, Zahlung erst bei Zufriedenheit. Für Dienstleister & KMUs.`,
        // Self-referencing canonical — KRITISCH: ohne dieses erbte die Seite das
        // (frühere) globale Homepage-canonical und wurde von Google deindexiert.
        alternates: {
            canonical: `${SITE_URL}/webdesign-${citySlug}`,
        },
        openGraph: {
            title: `Webdesign ${city.name} ab 790 € – ohne Vorkasse`,
            description: `DSGVO-konforme Website ab 790 € Fixpreis. Erster Entwurf in 7 Tagen, Zahlung erst bei Zufriedenheit.`,
            url: `${SITE_URL}/webdesign-${citySlug}`,
            type: 'website',
            locale: 'de_AT',
        },
    };
}

export default async function CityPage({ params }: PageProps) {
    const { slug } = await params;

    if (!slug || !slug.startsWith('webdesign-')) {
        notFound();
    }

    // Validate city
    const citySlug = slug.replace('webdesign-', '') as CitySlug;
    const city = cities[citySlug];

    if (!city) {
        notFound();
    }

    // Unified Schema Generation
    const isWien = city.name === "Wien";
    // ENTFERNT: erfundener projectCount aus String-Hash (charCodeAt % 92 + 121).
    // Erfundene Zahlen in Schema/Text = "fabricated content" (Google-Spam-Signal)
    // + irreführende Geschäftspraktik (UWG). Nur echte, belegbare Zahlen verwenden.
    const content = clusterContent[city.cluster];

    const businessSchema = {
        "@context": "https://schema.org",
        "@type": isWien ? "LocalBusiness" : "ProfessionalService",
        "name": `${COMPANY_NAME} ${city.name}`,
        "description": `Webdesign für ${city.name}: rechtssichere, DSGVO-konforme Websites ab ${PRICING.baseline} – ohne Vorkasse, Zahlung erst bei Zufriedenheit.`,
        "url": `${SITE_URL}/webdesign-${citySlug}`,
        "telephone": "+43 676 9000955",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Grabnergasse 8",
            "addressLocality": "Wien",
            "postalCode": "1060",
            "addressCountry": "AT"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 48.1945,
            "longitude": 16.3533
        },
        "priceRange": "€€",
        "areaServed": {
            "@type": "City",
            "name": city.name
        }
    };

    const faqSchema = content.faq ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": content.faq.questions.slice(0, 6).map(q => ({
            "@type": "Question",
            "name": q.question(city.name),
            "acceptedAnswer": {
                "@type": "Answer",
                "text": q.answer(city.name, city.region)
            }
        }))
    } : null;

    // Pass the simple data object to the Client Component
    return (
        <>
            <CityContent city={city} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
        </>
    );
}
