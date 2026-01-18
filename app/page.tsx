"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Above-the-fold - synchron laden für schnelles Initial Rendering
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SEOContent from "@/components/SEOContent";
import SkipLinks from "@/components/SkipLinks";

// Below-the-fold - lazy laden für bessere Performance
const Portfolio = dynamic(() => import('@/components/Portfolio'));
const Process = dynamic(() => import('@/components/Process'));
const SeoOptimization = dynamic(() => import('@/components/SeoOptimization'));
const About = dynamic(() => import('@/components/About'));
const Pricing = dynamic(() => import('@/components/Pricing'));
const FeaturedBlogPosts = dynamic(() => import('@/components/FeaturedBlogPosts'));
const FAQ = dynamic(() => import('@/components/FAQ'));
const Contact = dynamic(() => import('@/components/Contact'));

// Client-only Widgets - mit ssr: false für reine Client-Side Komponenten
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

export default function Home() {
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

      {/* Header Navigation */}
      <Header onFormOpen={handleFormOpen} />

      {/* SEO Content for Crawlers (hidden) */}
      <SEOContent />

      <main id="main-content" className="relative">

        {/* Hero Section */}
        <Hero onFormOpen={handleFormOpen} />

        {/* Portfolio Section */}
        <Portfolio />

        {/* Process Section */}
        <Process onFormOpen={handleFormOpen} />

        {/* SEO Optimization Section (NEW) */}
        <SeoOptimization />

        {/* About Section */}
        <About />

        {/* Pricing Section */}
        <Pricing onFormOpen={handleFormOpen} />

        {/* Featured Blog Posts - SEO Internal Linking */}
        <FeaturedBlogPosts />

        {/* FAQ Section */}
        <FAQ />

        {/* Contact Section */}
        <Contact onFormOpen={handleFormOpen} />
      </main>

      {/* Global Background Image (Absolute, verify position/visibility) */}
      <div className="absolute top-0 left-0 w-full h-[100vh] -z-10 bg-gray-50 pointer-events-none hidden">
        {/* Placeholder for potential global background handling if needed, 
             mostly handled by Hero specific background now */}
      </div>
    </div>
  );
}
