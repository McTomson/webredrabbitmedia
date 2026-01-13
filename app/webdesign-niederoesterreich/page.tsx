"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { regionalContent } from "@/lib/regional-content";
import Header from "@/components/Header";
import RegionalHero from "@/components/RegionalHero";
import RegionalSEOContent from "@/components/RegionalSEOContent";
import SkipLinks from "@/components/SkipLinks";

const Portfolio = dynamic(() => import('@/components/Portfolio'));
const Process = dynamic(() => import('@/components/Process'));
const SeoOptimization = dynamic(() => import('@/components/SeoOptimization'));
const About = dynamic(() => import('@/components/About'));
const Pricing = dynamic(() => import('@/components/Pricing'));
const RegionalFAQ = dynamic(() => import('@/components/RegionalFAQ'));
const Contact = dynamic(() => import('@/components/Contact'));
const FloatingWhatsApp = dynamic(() => import('@/components/FloatingWhatsApp'), { ssr: false });
const CookieBanner = dynamic(() => import('@/components/CookieBanner'), { ssr: false });
const AccessibilityWidget = dynamic(() => import('@/components/AccessibilityWidget'), { ssr: false });
const ContactForm = dynamic(() => import('@/components/ContactForm'), { ssr: false });

export default function NiederoesterreichPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const regionalData = {
    region: "Niederösterreich",
    mainCity: "St. Pölten",
    mainCitySlug: "st-poelten",
    population: "1,7 Mio.",
    cities: ["St. Pölten", "Wiener Neustadt", "Krems", "Baden", "Amstetten"],
    landmarks: ["Wachau", "Stift Melk", "Schloss Grafenegg", "Kamptal"],
    keywords: "Website erstellen Niederösterreich, Homepage Niederösterreich, Webdesign NÖ",
  };

  return (
    <div className="min-h-screen">
      <SkipLinks /><AccessibilityWidget /><CookieBanner /><FloatingWhatsApp />
      <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <Header onFormOpen={() => setIsFormOpen(true)} />
      <RegionalSEOContent data={regionalData} content={regionalContent["Niederösterreich"]} />
      <main id="main-content" className="relative">
        <RegionalHero data={regionalData} onFormOpen={() => setIsFormOpen(true)} />
        <Portfolio /><Process onFormOpen={() => setIsFormOpen(true)} />
        <SeoOptimization /><About />
        <Pricing onFormOpen={() => setIsFormOpen(true)} />
        <RegionalFAQ data={regionalData} />
        <Contact onFormOpen={() => setIsFormOpen(true)} />
      </main>
    </div>
  );
}
