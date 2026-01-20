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

                {/* Portfolio Section */}
                <Portfolio />

                {/* OÖ-specific: Branchen Section */}
                {data.region === "Oberösterreich" && <OOBranchenSection />}

                {/* Process Section */}
                <Process
                    onFormOpen={handleFormOpen}
                    headline={data.region === "Oberösterreich" ? "Dein weg zu deiner Website" : undefined}
                    subline={data.region === "Oberösterreich" ? "Professionell. Regional. Unkompliziert. In 3 Schritten online." : undefined}
                />

                {/* SEO Optimization Section */}
                <SeoOptimization />

                {/* About Section */}
                <About
                    hideTestimonials={data.region === "Oberösterreich"}
                    headline={data.region === "Oberösterreich" ? "Dein Partner in Oberösterreich" : undefined}
                />

                {/* OÖ-specific: Testimonials */}
                {data.region === "Oberösterreich" && <OOTestimonials />}

                {/* Pricing Section */}
                <Pricing onFormOpen={handleFormOpen} />

                {/* Regional FAQ Section */}
                <RegionalFAQ data={data} />

                {/* Contact Section */}
                <Contact
                    onFormOpen={handleFormOpen}
                    headline={data.region === "Oberösterreich" ? "Bereit für deinen Erfolg in OÖ?" : undefined}
                    subline={data.region === "Oberösterreich" ? "Starte jetzt mit deiner Website für Linz, Wels & Steyr." : undefined}
                />

                {/* Regional City Links (Replaces OO Footer content) */}
                <RegionalCityLinks data={data} />
            </main>
        </div>
    );
}
