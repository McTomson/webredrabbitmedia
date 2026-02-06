/**
 * RegionalSEOContent Component
 * Versteckter Content für Suchmaschinen und LLMs - regional angepasst
 * Vollständig unsichtbar für Benutzer, aber von Crawlern indizierbar
 */

import { RegionalContent } from "@/lib/regional-content";

interface RegionalSEOContentProps {
    data: {
        region: string;
        mainCity: string;
        mainCitySlug: string;
        population: string;
        cities: string[];
        keywords: string;
    };
    content: RegionalContent;
}

const RegionalSEOContent = ({ data, content }: RegionalSEOContentProps) => {
    // Helper to get correct hero image based on content
    const heroImage = content.heroImage
        ? `https://web.redrabbit.media${content.heroImage}`
        : "https://web.redrabbit.media/images/og-image.jpg";

    // Mobile Webdesign Image (identisch zur Startseite)
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://web.redrabbit.media/#organization",
        "name": "Red Rabbit Media",
        "url": "https://web.redrabbit.media",
        "logo": "https://web.redrabbit.media/logo.png",
        "image": "https://web.redrabbit.media/images/og-image.jpg",
        "email": "office@redrabbit.media",
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
        "priceRange": "ab 790€"
    };

    // Dynamic Product Schema for the Region
    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://web.redrabbit.media/#premium-website-package",
        "name": `Premium Webdesign ${data.region}`,
        "description": `Professionelles Webdesign für ${data.region}. ${content.hook} für lokale Unternehmen. Ab 790€.`,
        "image": {
            "@type": "ImageObject",
            "url": heroImage,
            "contentLocation": {
                "@type": "Place",
                "name": data.mainCity,
                "address": {
                    "@type": "PostalAddress",
                    "addressRegion": data.region,
                    "addressCountry": "AT"
                }
            },
            "description": content.heroImageAlt || `Webdesign in ${data.region}`
        },
        "brand": {
            "@type": "Brand",
            "name": "Red Rabbit Media"
        },
        "offers": {
            "@type": "AggregateOffer",
            "url": `https://web.redrabbit.media/webdesign-${data.region.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')}`,
            "priceCurrency": "EUR",
            "lowPrice": "790",
            "availability": "https://schema.org/InStock",
            "offerCount": "1",
            "seller": {
                "@id": "https://web.redrabbit.media/#organization"
            },
            "areaServed": {
                "@type": "AdministrativeArea",
                "name": data.region,
                "containsPlace": data.cities.map(city => ({
                    "@type": "City",
                    "name": city
                }))
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": String(content.projectCount || "150"),
            "bestRating": "5",
            "worstRating": "1"
        }
    };

    return (
        <>
            {/* JSON-LD Schema Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />

            {/* Hidden Text Content for Content-Crawlers (SEO Keywords) */}
            {/* No Microdata here to avoid conflicts with JSON-LD */}
            <div
                className="sr-only"
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    left: '-10000px',
                    top: 'auto',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden'
                }}
            >
                <article>
                    <h1>Professionelles Webdesign in {data.region} ab 790 Euro</h1>
                    <p>
                        Wir erstellen hochwertige Websites für Unternehmen in {data.region}. Speziell für
                        {data.region === "Oberösterreich" ? " Handwerker (Installateure, Elektriker), Hotels im Salzkammergut, Ärzte in Linz und Restaurants in Wels." : ` ${data.mainCity} und Umgebung.`}
                    </p>

                    <div>
                        <h2>Ihr Partner für digitale Erfolge in {data.region}</h2>
                        <p>
                            {content.introNarrative} Red Rabbit Media ist Ihre professionelle Webdesign Agentur für {data.region}.
                            Wir erstellen hochwertige, DSGVO-konforme Websites ab einem Fixpreis von 790 Euro netto.
                            {content.localProof}
                        </p>

                        <h2>Warum Webdesign aus {data.region}?</h2>
                        <p>
                            {content.economicContext} {data.region} ist ein wirtschaftlich starker Standort mit {data.population} Einwohnern.
                            Unsere Webdesign Agentur versteht die spezifischen Anforderungen der regionalen Wirtschaft.
                        </p>

                        <h2>Persönlicher Service vor Ort in {data.region}</h2>
                        <p>
                            Wir kommen zu Ihnen! Mit unserem Hauptsitz in Wien bedienen wir ganz Österreich - inklusive persönlicher
                            Beratung vor Ort in {data.region}. Bereits über {content.projectCount} erfolgreiche Webdesign-Projekte haben
                            wir realisiert. Ob in {data.mainCity}, {data.cities[1]} oder {data.cities[2]} -
                            wir sind für Sie da.
                        </p>

                        <h2>Leistungen im Überblick</h2>
                        <ul>
                            <li>Responsive Webdesign für alle Geräte (Desktop, Tablet, Mobile)</li>
                            <li>DSGVO-konforme Implementierung mit Cookie-Banner</li>
                            <li>Lokale Suchmaschinenoptimierung (SEO) für {data.region}</li>
                            <li>Kontaktformular mit E-Mail-Integration</li>
                            <li>Google Maps Integration</li>
                            <li>6 Monate kostenloser Support</li>
                            <li>WhatsApp Business Integration</li>
                            <li>Schnelle Ladezeiten unter 2 Sekunden</li>
                        </ul>

                        <h2>Häufige Fragen zu Webdesign in {data.region}</h2>
                        <p>
                            Firmen aus {data.mainCity} und ganz {data.region} vertrauen auf unsere Expertise.
                            Wir bieten einen Fixpreis von 790 Euro ohne versteckte Kosten.
                            Zahlung erst bei 100% Zufriedenheit.
                        </p>

                        <h3>Für wen arbeiten wir?</h3>
                        <p>
                            Vom Einzelunternehmer in {data.cities[3]} bis zum KMU in {data.cities[0]}.
                            Wir erstellen Homepages für Ärzte, Anwälte, Handwerker und Dienstleister in ganz {data.region}.
                        </p>
                    </div>
                </article>
            </div>
        </>
    );
};

export default RegionalSEOContent;
