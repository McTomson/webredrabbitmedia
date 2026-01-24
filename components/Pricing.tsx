"use client";

import { Check } from 'lucide-react';
import { AOSWrapper } from './AnimatedSection';
import { useContactForm } from './ContactFormProvider';

interface PricingProps {
    onFormOpen?: () => void;
}

const Pricing = ({ onFormOpen }: PricingProps) => {
    const { openForm } = useContactForm();

    const handleFormOpen = onFormOpen || openForm;

    const features = [
        "Moderne, responsive Website (inkl. 4 Seiten)",
        "DSGVO-konform (Cookie-Banner, Datenschutz)",
        "Mobile Optimierung",
        "SEO-Grundlagen",
        "Kontaktformular",
        "Google Maps Integration",
        "QR-Code Service",
        "6 Monate kostenloser Support (wir sind für dich da)",
        "WhatsApp Button integrieren",
        "Google Kunden Meinungen",
        "Schnelle Ladezeiten (< 2 Sekunden)",
        "Barrierefreiheit nach WCAG 2.1",
        "Social Media Integration",
        "Vieles mehr"
    ];

    // Product/Service Schema für Google Rich Snippets
    const pricingSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Webdesign & Website-Entwicklung",
        "provider": {
            "@type": "LocalBusiness",
            "name": "Red Rabbit Media",
            "@id": "https://web.redrabbit.media/#localbusiness"
        },
        "offers": {
            "@type": "Offer",
            "name": "Basis Website-Paket",
            "description": "Professionelle Website ab 790€ inkl. DSGVO, Mobile-Optimierung, SEO-Basics, Kontaktformular, Google Maps, WhatsApp Integration und 6 Monate Support",
            "price": "790",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2026-12-31",
            "itemOffered": {
                "@type": "Service",
                "name": "Website-Erstellung",
                "description": features.join(", ")
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "315",
            "bestRating": "5",
            "worstRating": "1"
        },
        "areaServed": {
            "@type": "Country",
            "name": "Österreich"
        }
    };

    return (
        <>
            {/* Product/Service Schema for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
            />

            <section id="pricing" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <AOSWrapper animation="fade-up" delay={100}>
                            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
                                Preisübersicht & Leistungsumfang
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Transparenz und klare Angebote.
                                Du siehst genau, was du bekommst.
                            </p>
                        </AOSWrapper>
                    </div>

                    {/* Pricing Card */}
                    <div className="max-w-4xl mx-auto">
                        <AOSWrapper animation="fade-up" delay={200}>
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 text-center">
                                    <h3 className="text-3xl font-light mb-2">Premium Website</h3>
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        <span className="text-4xl font-bold">ab 790 €</span>
                                    </div>
                                    <p className="text-red-100 text-sm">
                                        Deine Website in nur 7 Tagen fertig
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="p-8">
                                    {/* Why so cheap section */}
                                    <div className="mb-8 pb-6 border-b border-gray-200">
                                        <p className="text-gray-700 text-sm text-center mb-4">
                                            Du zahlst <span className="text-red-600 font-semibold">erst</span>, wenn dir unser Vorschlag gefällt. Ansonsten nicht.
                                        </p>

                                        <div className="flex justify-center space-x-6 text-xs text-gray-500">
                                            <span>Kein Abo</span>
                                            <span>•</span>
                                            <span>Kein Vertrag</span>
                                            <span>•</span>
                                            <span>100% transparent</span>
                                        </div>
                                    </div>

                                    <h4 className="text-xl font-medium text-gray-900 mb-6">Alle enthaltenen Leistungen:</h4>
                                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                                        {features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <div className="text-center">
                                        <button
                                            onClick={handleFormOpen}
                                            className="w-full bg-red-600 text-white py-4 px-8 text-lg font-medium hover:bg-red-700 transition-all duration-300 hover:scale-105 cursor-pointer"
                                        >
                                            Jetzt kostenlosen Vorschlag anfordern
                                        </button>
                                        <p className="text-sm text-gray-600 mt-3">
                                            100% unverbindlich • Kein Risiko • Garantiert
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </AOSWrapper>
                    </div>


                    {/* Trust Indicators */}
                    <AOSWrapper animation="fade-up" delay={600}>
                        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-light text-gray-900 mb-2">800+</div>
                                <div className="text-sm text-gray-600">Zufriedene Kunden</div>
                            </div>
                            <div>
                                <div className="text-3xl font-light text-gray-900 mb-2">15+</div>
                                <div className="text-sm text-gray-600">Jahre Erfahrung</div>
                            </div>
                            <div>
                                <div className="text-3xl font-light text-gray-900 mb-2">100%</div>
                                <div className="text-sm text-gray-600">Persönliche Betreuung</div>
                            </div>
                        </div>
                    </AOSWrapper>


                </div>
            </section>
        </>
    );
};

export default Pricing;
