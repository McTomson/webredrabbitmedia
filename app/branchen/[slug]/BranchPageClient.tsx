"use client";

import { branches, type BranchSlug } from './data';
import { notFound, useParams } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import ContactForm from "@/components/ContactForm";
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';

export default function BranchPageClient() {
    const params = useParams();
    const slug = params.slug as BranchSlug;
    const branch = branches[slug];

    if (!branch) {
        notFound();
    }

    const [isFormOpen, setIsFormOpen] = useState(false);
    const handleFormOpen = () => setIsFormOpen(true);

    return (
        <div className="min-h-screen bg-white">
            <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
            <Header onFormOpen={handleFormOpen} />

            <main>
                {/* Hero */}
                <section className="pt-32 pb-16 px-8 bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto">
                        <span className="text-red-500 font-medium mb-4 block">Spezialisiert auf Ihre Branche</span>
                        <h1 className="text-5xl lg:text-7xl font-light mb-8 max-w-4xl">
                            {branch.title}
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mb-12">
                            {branch.description}
                        </p>
                        <Link href="#kontakt" className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 hover:bg-red-700 transition-colors">
                            Jetzt anfragen <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>

                {/* Benefits */}
                <section className="py-24 px-8">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-4xl font-light mb-8 text-black">Warum Red Rabbit für {slug}?</h2>
                            <div className="space-y-6">
                                {branch.benefits.map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-red-100 flex items-center justify-center rounded-full flex-shrink-0">
                                            <Check className="w-6 h-6 text-red-600" />
                                        </div>
                                        <span className="text-xl text-gray-800">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-100 rounded-2xl p-8">
                            <h3 className="text-2xl font-medium mb-4 text-black">Das sagen unsere Kunden</h3>
                            <blockquote className="text-gray-600 italic mb-4">
                                "Endlich eine Agentur, die versteht, dass wir keine Zeit für technische Spielereien haben. Die Seite läuft und bringt Kunden."
                            </blockquote>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                <div>
                                    <div className="font-bold text-black">Beispiel Kunde</div>
                                    <div className="text-sm text-gray-500">{slug === 'handwerk' ? 'Malermeister' : 'Geschäftsführer'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Contact onFormOpen={handleFormOpen} />
            </main>

            <Footer />
        </div>
    );
}
