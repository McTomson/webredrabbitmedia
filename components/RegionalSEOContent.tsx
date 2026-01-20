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
    // Dynamic Product Schema for the Region
    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `Premium Webdesign ${data.region}`, // e.g. "Premium Webdesign Wien"
        "description": `Professionelles Webdesign für ${data.region}. ${content.hook} für lokale Unternehmen. Ab 790€.`,
        "image": "https://web.redrabbit.media/images/og-image.jpg",
        "brand": {
            "@type": "Brand",
            "name": "Red Rabbit Media"
        },
        "areaServed": data.region === "Oberösterreich" ? [
            { "@type": "City", "name": "Linz" },
            { "@type": "City", "name": "Wels" },
            { "@type": "City", "name": "Steyr" },
            { "@type": "Place", "name": "Salzkammergut" },
            { "@type": "Place", "name": "Innviertel" },
            { "@type": "Place", "name": "Mühlviertel" }
        ] : undefined,
        "offers": {
            "@type": "Offer",
            "url": `https://web.redrabbit.media/webdesign-${data.region.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')}`,
            "priceCurrency": "EUR",
            "price": "790",
            "priceValidUntil": "2026-12-31",
            "availability": "https://schema.org/InStock",
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                    "@type": "MonetaryAmount",
                    "value": "0",
                    "currency": "EUR"
                },
                "shippingDestination": {
                    "@type": "DefinedRegion",
                    "addressCountry": "AT"
                }
            },
            "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "AT",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                "merchantReturnDays": 14,
                "returnMethod": "https://schema.org/ReturnByMail",
                "returnFees": "https://schema.org/FreeReturn"
            },
            "seller": {
                "@type": "Organization",
                "name": "Red Rabbit Media"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": data.region === "Oberösterreich" ? "156" : "315",
            "bestRating": "5",
            "worstRating": "1"
        }
    };

    return (
        <>
            {/* JSON-LD Schema Injection */}
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
