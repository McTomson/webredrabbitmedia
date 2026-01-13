"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
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

export default function VorarlbergPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const regionalData = {
    region: "Vorarlberg",
    mainCity: "Bregenz",
    mainCitySlug: "bregenz",
    population: "400.000",
    cities: ["Bregenz", "Dornbirn", "Feldkirch", "Hohenems", "Lustenau"],
    landmarks: ["Seebühne", "Pfänder", "Kunsthaus", "Bodensee"],
    keywords: "Webdesign Vorarlberg, Homepage Vorarlberg, Webdesigner Bregenz",
  };

  return (
    <div className="min-h-screen">
      <SkipLinks /><AccessibilityWidget /><CookieBanner /><FloatingWhatsApp />
      <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <Header onFormOpen={() => setIsFormOpen(true)} />
      <RegionalSEOContent data={regionalData} />
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
