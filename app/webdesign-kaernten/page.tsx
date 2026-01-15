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
  title: "Webdesign Kärnten: Online-Erfolg im Süden | ab 790€ | ⭐ 4.8",
  description: "Websites so attraktiv wie unser Land. Ab 790€ Fixpreis. Perfekt für Tourismus & Gewerbe. Erst sehen, dann zahlen.",
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

export default function KaerntenPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const regionalData = {
    region: "Kärnten",
    mainCity: "Klagenfurt",
    mainCitySlug: "klagenfurt",
    population: "560.000",
    cities: ["Klagenfurt", "Villach", "Spittal", "Feldkirchen", "Völkermarkt"],
    landmarks: ["Wörthersee", "Minimundus", "Lindwurm", "Pyramidenkogel"],
    keywords: "Website erstellen Kärnten, Webdesign Kärnten, Homepage Klagenfurt",
  };

  return (
    <div className="min-h-screen">
      <SkipLinks /><AccessibilityWidget /><CookieBanner /><FloatingWhatsApp />
      <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <Header onFormOpen={() => setIsFormOpen(true)} />
      <RegionalSEOContent data={regionalData} content={regionalContent["Kärnten"]} />
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
