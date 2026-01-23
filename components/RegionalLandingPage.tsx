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
                {/* Regional Hero Section */}
                <RegionalHero data={data} onFormOpen={handleFormOpen} />

                {/* Intro Section with SEO Text */}
                <RegionalIntro data={data} />

                {/* NÖ-specific: USP Section (Why choose us) */}
                {data.region === "Niederösterreich" && <NOEUSPSection />}

                {/* Kärnten-specific: USP Section */}
                {data.region === "Kärnten" && <KaerntenUSPSection />}

                {/* Steiermark-specific: USP Section */}
                {data.region === "Steiermark" && <SteiermarkUSPSection />}

                {/* Portfolio Section */}
                <Portfolio region={data.region} />

                {/* OÖ-specific: Branchen Section */}
                {data.region === "Oberösterreich" && <OOBranchenSection />}

                {/* Kärnten-specific: Branchen Section */}
                {data.region === "Kärnten" && <KaerntenBranchenSection />}

                {/* Steiermark-specific: Branchen Section */}
                {data.region === "Steiermark" && <SteiermarkBranchenSection />}

                {/* Process Section */}
                <Process
                    onFormOpen={handleFormOpen}
                    headline={
                        data.region === "Oberösterreich" ? "Dein weg zu deiner Website" :
                            data.region === "Niederösterreich" ? "So entsteht Ihre Webseite" :
                                data.region === "Kärnten" ? "Unser Weg zum Erfolg" :
                                    data.region === "Steiermark" ? "So läuft das bei uns" : undefined
                    }
                    subline={
                        data.region === "Oberösterreich" ? "Professionell. Regional. Unkompliziert. In 3 Schritten online." :
                            data.region === "Niederösterreich" ? "Transparente Schritte. Klare Ergebnisse. Von der Idee bis zum Go-Live." :
                                data.region === "Kärnten" ? "Unkompliziert, transparent und auf Augenhöhe. So arbeiten wir." :
                                    data.region === "Steiermark" ? "Kein Fachchinesisch, keine leeren Kilometer. Direkt zum Ziel." : undefined
                    }
                />

                {/* SEO Optimization Section */}
                <SeoOptimization />

                {/* About Section */}
                <About
                    hideTestimonials={data.region === "Oberösterreich" || data.region === "Niederösterreich" || data.region === "Kärnten" || data.region === "Steiermark"}
                    headline={
                        data.region === "Oberösterreich" ? "Dein Partner in Oberösterreich" :
                            data.region === "Niederösterreich" ? "Die Werbeagentur für Niederösterreich" :
                                data.region === "Kärnten" ? "Ihre Webagentur für Kärnten" :
                                    data.region === "Steiermark" ? "Webdesign aus der und für die Steiermark" : undefined
                    }
                    region={data.region}
                />

                {/* OÖ-specific: Testimonials */}
                {data.region === "Oberösterreich" && <OOTestimonials />}

                {/* NÖ-specific: Testimonials */}
                {data.region === "Niederösterreich" && <NOETestimonials />}

                {/* Kärnten-specific: Testimonials */}
                {data.region === "Kärnten" && <KaerntenTestimonials />}

                {/* Steiermark-specific: Testimonials */}
                {data.region === "Steiermark" && <SteiermarkTestimonials />}

                {/* Pricing Section */}
                <Pricing onFormOpen={handleFormOpen} />

                {/* Regional FAQ Section */}
                <RegionalFAQ data={data} />

                {/* Contact Section */}
                <Contact
                    onFormOpen={handleFormOpen}
                    headline={
                        data.region === "Oberösterreich" ? "Bereit für deinen Erfolg in OÖ?" :
                            data.region === "Niederösterreich" ? "Bereit für Wachstum?" :
                                data.region === "Kärnten" ? "Kontaktieren Sie uns" :
                                    data.region === "Steiermark" ? "Red' ma miteinand'" : undefined
                    }
                    subline={
                        data.region === "Oberösterreich" ? "Starte jetzt mit deiner Website für Linz, Wels & Steyr." :
                            data.region === "Niederösterreich" ? "Lassen Sie uns gemeinsam Ihren digitalen Fußabdruck in Niederösterreich vergrößern." :
                                data.region === "Kärnten" ? "Wir freuen uns auf ein persönliches Gespräch über Ihr Projekt." :
                                    data.region === "Steiermark" ? "Schick uns eine Anfrage oder ruf an. Wir beißen nicht." : undefined
                    }
                />

                {/* Regional City Links (Replaces OO Footer content) */}
                <RegionalCityLinks data={data} />
            </main>
        </div>
    );
}
