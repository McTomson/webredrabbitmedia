"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

import SkipLinks from "@/components/SkipLinks";
import { City } from './cities';
import CityHero from '@/components/CityHero'; // New component
import CitySEOContent from '@/components/CitySEOContent'; // New component
import CityFAQ from '@/components/CityFAQ'; // New component
import { clusterContent } from './cluster-content';

const Portfolio = dynamic(() => import('@/components/Portfolio'));
const Process = dynamic(() => import('@/components/Process'));
const SeoOptimization = dynamic(() => import('@/components/SeoOptimization'));
const About = dynamic(() => import('@/components/About'));
const Pricing = dynamic(() => import('@/components/Pricing'));
const Contact = dynamic(() => import('@/components/Contact'));
const FloatingWhatsApp = dynamic(() => import('@/components/FloatingWhatsApp'), { ssr: false });
const CookieBanner = dynamic(() => import('@/components/CookieBanner'), { ssr: false });
const AccessibilityWidget = dynamic(() => import('@/components/AccessibilityWidget'), { ssr: false });
const ContactForm = dynamic(() => import('@/components/ContactForm'), { ssr: false });

const RegionalIntro = dynamic(() => import('@/components/RegionalIntro'));

interface CityContentProps {
    city: City;
}

export default function CityContent({ city }: CityContentProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const content = clusterContent[city.cluster];

    return (
        <div className="min-h-screen">
            <SkipLinks />
            <AccessibilityWidget />
            <CookieBanner />
            <FloatingWhatsApp />
            <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />



            <CitySEOContent city={city} />

            <main id="main-content" className="relative">
                <CityHero city={city} onFormOpen={() => setIsFormOpen(true)} />
                <RegionalIntro data={{ region: city.region, cities: [city.name] }} />
                <Portfolio
                    headline={content.portfolio.headline}
                    subline={content.portfolio.text(city.name)}
                    cityName={city.name}
                    citySlug={city.name.toLowerCase().replace('ö', 'oe').replace('ä', 'ae').replace('ü', 'ue').replace('ß', 'ss').replace(' ', '-')}
                />
                <Process
                    onFormOpen={() => setIsFormOpen(true)}
                    headline={content.process.headline}
                    subline={content.process.text}
                    steps={content.process.steps}
                    benefits={content.process.benefits}
                />
                <SeoOptimization
                    headline={content.seo.headline}
                    subline={content.seo.subline}
                    strategyHeadline={content.seo.strategyHeadline}
                    comparisonHeadline={content.seo.comparisonHeadline(city.name)}
                    features={content.seo.features.map(f => ({
                        title: f.title,
                        text: f.text(city.name)
                    }))}
                    strategyItems={content.seo.strategyItems}
                    comparisonItems={content.seo.comparisonItems}
                />
                <About
                    headline={content.about.headline}
                    text={content.about.text}
                    testimonialsHeadline={content.about.testimonialsHeadline(city.name)}
                    features={content.about.features.map(f => ({
                        title: f.title,
                        text: f.text
                    }))}
                    testimonials={content.about.testimonials}
                />
                <Pricing onFormOpen={() => setIsFormOpen(true)} />
                <CityFAQ
                    city={city}
                    headline={content.faq?.headline(city.name)}
                    subline={content.faq?.subline(city.name, city.region)}
                    questions={content.faq?.questions.map(q => ({
                        question: q.question(city.name),
                        answer: q.answer(city.name, city.region)
                    }))}
                />
                <Contact
                    onFormOpen={() => setIsFormOpen(true)}
                    headline={content.contact.headline}
                    subline={content.contact.subline(city.name)}
                />
            </main>
        </div>
    );
}
