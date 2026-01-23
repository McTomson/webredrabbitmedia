"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import RegionalHero from "@/components/RegionalHero";
import RegionalSEOContent from "@/components/RegionalSEOContent";
import SkipLinks from "@/components/SkipLinks";
import { RegionalContent } from "@/lib/regional-content";

// Lazy imports shared across all regional pages
const RegionalIntro = dynamic(() => import('@/components/RegionalIntro'));
const Portfolio = dynamic(() => import('@/components/Portfolio'));
const Process = dynamic(() => import('@/components/Process'));
const SeoOptimization = dynamic(() => import('@/components/SeoOptimization'));
const About = dynamic(() => import('@/components/About'));
const Pricing = dynamic(() => import('@/components/Pricing'));
const RegionalFAQ = dynamic(() => import('@/components/RegionalFAQ'));
const Contact = dynamic(() => import('@/components/Contact'));

// OÖ-specific components
const OOBranchenSection = dynamic(() => import('@/components/OOBranchenSection'));
const OOTestimonials = dynamic(() => import('@/components/OOTestimonials'));

// Kärnten-specific components
const KaerntenUSPSection = dynamic(() => import('@/components/KaerntenUSPSection'));
const KaerntenBranchenSection = dynamic(() => import('@/components/KaerntenBranchenSection'));
const KaerntenTestimonials = dynamic(() => import('@/components/KaerntenTestimonials'));

// NÖ-specific components
const NOEUSPSection = dynamic(() => import('@/components/NOEUSPSection'));
const NOETestimonials = dynamic(() => import('@/components/NOETestimonials'));

// Steiermark-specific components
const SteiermarkUSPSection = dynamic(() => import('@/components/SteiermarkUSPSection'));
const SteiermarkBranchenSection = dynamic(() => import('@/components/SteiermarkBranchenSection'));
const SteiermarkTestimonials = dynamic(() => import('@/components/SteiermarkTestimonials'));

const RegionalCityLinks = dynamic(() => import('@/components/RegionalCityLinks'));

// Client-only Widgets
const FloatingWhatsApp = dynamic(() => import('@/components/FloatingWhatsApp'), { ssr: false });
const CookieBanner = dynamic(() => import('@/components/CookieBanner'), { ssr: false });
const AccessibilityWidget = dynamic(() => import('@/components/AccessibilityWidget'), { ssr: false });
const ContactForm = dynamic(() => import('@/components/ContactForm'), { ssr: false });

interface RegionalData {
    region: string;
    mainCity: string;
    mainCitySlug: string;
    population: string;
    cities: string[];
    landmarks: string[];
    keywords: string;
}

interface RegionalLandingPageProps {
    data: RegionalData;
    content: RegionalContent;
}

export default function RegionalLandingPage({ data, content }: RegionalLandingPageProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleFormOpen = () => {
        setIsFormOpen(true);
    };

    const defaultOrder = ["intro", "usp", "portfolio", "branchen", "process", "seo", "about", "testimonials", "pricing", "faq", "contact"];
    const sectionOrder = content.sectionOrder || defaultOrder;

    const renderSection = (sectionId: string) => {
        switch (sectionId) {
            case "intro":
                return <RegionalIntro key="intro" data={data} />;

            case "usp":
                return (
                    <div key="usp">
                        {data.region === "Niederösterreich" && <NOEUSPSection />}
                        {data.region === "Kärnten" && <KaerntenUSPSection />}
                        {data.region === "Steiermark" && <SteiermarkUSPSection />}
                    </div>
                );

            case "portfolio":
                return <Portfolio key="portfolio" region={data.region} />;

            case "branchen":
                return (
                    <div key="branchen">
                        {data.region === "Oberösterreich" && <OOBranchenSection />}
                        {data.region === "Kärnten" && <KaerntenBranchenSection />}
                        {data.region === "Steiermark" && <SteiermarkBranchenSection />}
                    </div>
                );

            case "process":
                return (
                    <Process
                        key="process"
                        onFormOpen={handleFormOpen}
                        headline={
                            data.region === "Oberösterreich" ? "Dein weg zu deiner Website" :
                                data.region === "Niederösterreich" ? "So entsteht Ihre Webseite" :
                                    data.region === "Kärnten" ? "Unser Weg zum Erfolg" :
                                        data.region === "Steiermark" ? "Der direkte Weg zum Erfolg" : undefined
                        }
                        subline={
                            data.region === "Oberösterreich" ? "Professionell. Regional. Unkompliziert. In 3 Schritten online." :
                                data.region === "Niederösterreich" ? "Transparente Schritte. Klare Ergebnisse. Von der Idee bis zum Go-Live." :
                                    data.region === "Kärnten" ? "Unkompliziert, transparent und auf Augenhöhe. So arbeiten wir." :
                                        data.region === "Steiermark" ? "Wir verzichten auf unnötige Schleifen. Von der Anfrage bis zum Go-Live in Bestzeit." : undefined
                        }
                    />
                );

            case "seo":
                return (
                    <SeoOptimization
                        key="seo"
                        strategyItems={content.strategyItems}
                        features={content.seoFeatures}
                    />
                );

            case "about":
                return (
                    <About
                        key="about"
                        hideTestimonials={true}
                        headline={
                            data.region === "Oberösterreich" ? "Dein Partner in Oberösterreich" :
                                data.region === "Niederösterreich" ? "Die Werbeagentur für Niederösterreich" :
                                    data.region === "Kärnten" ? "Ihre Webagentur für Kärnten" :
                                        data.region === "Steiermark" ? "Ihre Webagentur für die Steiermark" : undefined
                        }
                        text={content.aboutSecondaryText}
                        features={content.aboutFeatures}
                        region={data.region}
                    />
                );

            case "testimonials":
                return (
                    <div key="testimonials">
                        {data.region === "Oberösterreich" && <OOTestimonials />}
                        {data.region === "Niederösterreich" && <NOETestimonials />}
                        {data.region === "Kärnten" && <KaerntenTestimonials />}
                        {data.region === "Steiermark" && <SteiermarkTestimonials />}
                    </div>
                );

            case "pricing":
                return <Pricing key="pricing" onFormOpen={handleFormOpen} />;

            case "faq":
                return <RegionalFAQ key="faq" data={data} />;

            case "contact":
                return (
                    <Contact
                        key="contact"
                        onFormOpen={handleFormOpen}
                        headline={
                            data.region === "Oberösterreich" ? "Bereit für deinen Erfolg in OÖ?" :
                                data.region === "Niederösterreich" ? "Bereit für Wachstum?" :
                                    data.region === "Kärnten" ? "Kontaktieren Sie uns" :
                                        data.region === "Steiermark" ? "Starten wir Ihr Projekt in der Steiermark" : undefined
                        }
                        subline={
                            data.region === "Oberösterreich" ? "Starte jetzt mit deiner Website für Linz, Wels & Steyr." :
                                data.region === "Niederösterreich" ? "Lassen Sie uns gemeinsam Ihren digitalen Fußabdruck in Niederösterreich vergrößern." :
                                    data.region === "Kärnten" ? "Wir freuen uns auf ein persönliches Gespräch über Ihr Projekt." :
                                        data.region === "Steiermark" ? "Lassen Sie uns unverbindlich über Ihre neue Website sprechen. Wir sparen Ihnen Zeit und Nerven." : undefined
                        }
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen">
            <SkipLinks />
            <AccessibilityWidget />
            <CookieBanner />
            <FloatingWhatsApp />
            <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

            {/* SEO Content for Crawlers (hidden) */}
            <RegionalSEOContent data={data} content={content} />

            <main id="main-content" className="relative">
                {/* Regional Hero Section - Always first */}
                <RegionalHero data={data} onFormOpen={handleFormOpen} />

                {/* Dynamic Sections Based on regional-content.ts */}
                {sectionOrder.map((sectionId) => renderSection(sectionId))}

                {/* Regional City Links (Replaces OO Footer content) - Always last */}
                <RegionalCityLinks data={data} />
            </main>
        </div>
    );
}
