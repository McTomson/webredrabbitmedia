import dynamic from 'next/dynamic';

// Above-the-fold - synchron laden für schnelles Initial Rendering
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

import ClientWidgets from "@/components/ClientWidgets";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SkipLinks />
      <ClientWidgets />

      {/* SEO Content for Crawlers (hidden) */}
      <SEOContent />

      <main id="main-content" className="relative">
        <Hero />
        <Portfolio />
        <Process />
        <SeoOptimization />
        <About />
        <Pricing />
        <FeaturedBlogPosts />
        <FAQ />
        <Contact />
      </main>

      {/* Global Background Image (Absolute, verify position/visibility) */}
      <div className="absolute top-0 left-0 w-full h-[100vh] -z-10 bg-gray-50 pointer-events-none hidden">
      </div>
    </div>
  );
}
