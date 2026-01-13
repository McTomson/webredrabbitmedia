"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Above-the-fold - synchron laden
import Header from "@/components/Header";
import RegionalHero from "@/components/RegionalHero";
import RegionalSEOContent from "@/components/RegionalSEOContent";
import SkipLinks from "@/components/SkipLinks";

// Below-the-fold - lazy laden
const Portfolio = dynamic(() => import('@/components/Portfolio'));
const Process = dynamic(() => import('@/components/Process'));
const SeoOptimization = dynamic(() => import('@/components/SeoOptimization'));
const About = dynamic(() => import('@/components/About'));
const Pricing = dynamic(() => import('@/components/Pricing'));
const RegionalFAQ = dynamic(() => import('@/components/RegionalFAQ'));
const Contact = dynamic(() => import('@/components/Contact'));

// Client-only Widgets
const FloatingWhatsApp = dynamic(() => import('@/components/FloatingWhatsApp'), {
    ssr: false
});
const CookieBanner = dynamic(() => import('@/components/CookieBanner'), {
    ssr: false
});
const AccessibilityWidget = dynamic(() => import('@/components/AccessibilityWidget'), {
    ssr: false
});
const ContactForm = dynamic(() => import('@/components/ContactForm'), {
    ssr: false
});

export default function OberoesterreichPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleFormOpen = () => {
        setIsFormOpen(true);
    };

    // Regional data for Oberösterreich
    const regionalData = {
        region: "Oberösterreich",
        mainCity: "Linz",
        mainCitySlug: "linz",
        population: "1,5 Mio.",
        cities: ["Linz", "Wels", "Steyr", "Braunau", "Vöcklabruck"],
        landmarks: ["Ars Electronica Center", "Pöstlingberg", "Lentos", "Stahlwelt"],
        keywords: "Webdesign Oberösterreich, Website erstellen Oberösterreich, Homepage OÖ, Webentwicklung Oberösterreich",
    };

    return (
        <div className="min-h-screen">
            <SkipLinks />
            <AccessibilityWidget />
            <CookieBanner />
            <FloatingWhatsApp />
            <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

            {/* Header Navigation */}
            <Header onFormOpen={handleFormOpen} />

            {/* SEO Content for Crawlers (hidden) */}
            <RegionalSEOContent data={regionalData} />

            <main id="main-content" className="relative">
                {/* Regional Hero Section */}
                <RegionalHero data={regionalData} onFormOpen={handleFormOpen} />

                {/* Portfolio Section */}
                <Portfolio />

                {/* Process Section */}
                <Process onFormOpen={handleFormOpen} />

                {/* SEO Optimization Section */}
                <SeoOptimization />

                {/* About Section */}
                <About />

                {/* Pricing Section */}
                <Pricing onFormOpen={handleFormOpen} />

                {/* Regional FAQ Section */}
                <RegionalFAQ data={regionalData} />

                {/* Contact Section */}
                <Contact onFormOpen={handleFormOpen} />
            </main>
        </div>
    );
}
