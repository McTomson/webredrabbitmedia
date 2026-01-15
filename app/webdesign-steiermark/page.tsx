"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from "@/components/Header";
import { regionalContent } from "@/lib/regional-content";
import RegionalHero from "@/components/RegionalHero";
import RegionalSEOContent from "@/components/RegionalSEOContent";
import SkipLinks from "@/components/SkipLinks";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Webdesign Steiermark: Echte Qualität, Klarer Preis | ⭐ 4.8",
  description: "Steirische Handschlagqualität digital übersetzt. Website ab 790€. Ohne versteckte Kosten. Erst Entwurf, dann Rechnung.",
};

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

export default function SteiermarkPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const regionalData = {
    region: "Steiermark",
    mainCity: "Graz",
    mainCitySlug: "graz",
    population: "1,2 Mio.",
    cities: ["Graz", "Leoben", "Kapfenberg", "Bruck an der Mur", "Knittelfeld"],
    landmarks: ["Uhrturm", "Kunsthaus", "Murinsel", "Schlossberg"],
    keywords: "Webdesign Steiermark, Webdesigner Graz, Homepage erstellen Steiermark",
  };

  return (
    <div className="min-h-screen">
      <SkipLinks /><AccessibilityWidget /><CookieBanner /><FloatingWhatsApp />
      <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <Header onFormOpen={() => setIsFormOpen(true)} />
      <RegionalSEOContent data={regionalData} content={regionalContent["Steiermark"]} />
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
