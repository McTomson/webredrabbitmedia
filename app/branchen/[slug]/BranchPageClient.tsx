"use client";

import { ArrowRight, Check, ChevronDown, Search } from 'lucide-react';
import { branches, type BranchSlug } from '../data';
import { notFound, useParams } from 'next/navigation';

import Contact from "@/components/Contact";
import ContactForm from "@/components/ContactForm";
import Link from 'next/link';
import { useState } from 'react';

export default function BranchPageClient() {
    const params = useParams();
    const slug = params?.slug as BranchSlug;
    const branch = slug ? branches[slug] : null;

    const [isFormOpen, setIsFormOpen] = useState(false);
    const handleFormOpen = () => setIsFormOpen(true);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    if (!branch) {
        notFound();
    }

    const faqs = [
        {
            q: "Wie lange dauert die Erstellung?",
            a: "Je nach Umfang und Anforderungen benötigen wir in der Regel 2-4 Wochen für eine komplette Branchen-Website."
        },
        {
            q: "Kann ich Inhalte selbst ändern?",
            a: "Ja, Sie erhalten einen Zugang zum Content Management System (CMS) und können Texte und Bilder ganz einfach selbst tauschen."
        },
        {
            q: "Ist die Website für Handys optimiert?",
            a: "Absolut. Mobile First ist unser Standard. Ihre Website sieht auf Smartphones, Tablets und Desktops perfekt aus."
        },
        {
            q: "Was kostet die Betreuung?",
            a: "Wir bieten faire Wartungspakete an, damit Ihre Seite technisch immer aktuell und sicher bleibt. Das ist aber kein Muss – Sie haben die volle Wahlfreiheit."
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

            <main>
                {/* Hero */}
                <section className="pt-32 pb-20 px-4 md:px-8 bg-[#0F1116] text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(220,38,38,0.1),transparent_50%)]"></div>
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            <div className="flex-1 text-center lg:text-left">
                                <span className="inline-block py-1 px-3 rounded-full bg-red-500/10 text-red-400 text-sm font-medium mb-6 border border-red-500/20">
                                    Spezialisiert auf {branch.name}
                                </span>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                    {branch.title}
                                </h1>
                                <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                    {branch.description}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                    <button
                                        onClick={handleFormOpen}
                                        className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
                                    >
                                        Kostenloses Angebot
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                    <Link
                                        href="#features"
                                        className="w-full sm:w-auto px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center"
                                    >
                                        Mehr erfahren
                                    </Link>
                                </div>
                            </div>
                            <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
                                {/* Abstract Visual for Branch */}
                                <div className="aspect-square rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-8 flex items-center justify-center relative group">
                                    <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full"></div>
                                    <div className="text-9xl transform group-hover:scale-110 transition-transform duration-500">
                                        {branch.icon}
                                    </div>

                                    {/* Floating Cards */}
                                    <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-4 rounded-xl shadow-xl border border-gray-100 hidden md:block animate-bounce-slow">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <Check className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Status</div>
                                                <div className="font-bold">100% DSGVO-konform</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute -top-6 -right-6 bg-white text-gray-900 p-4 rounded-xl shadow-xl border border-gray-100 hidden md:block animate-bounce-reverse-slow">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Search className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Ranking</div>
                                                <div className="font-bold">Google Seite 1</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section id="features" className="py-24 px-4 md:px-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Maßgeschneidert für {branch.name}
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Ihre Branche hat spezielle Anforderungen. Wir haben die Lösungen, die genau darauf abgestimmt sind.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                            {branch.benefits.map((benefit, i) => (
                                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                                    <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors">
                                        <Check className="w-7 h-7 text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit}</h3>
                                    <p className="text-gray-600">
                                        Speziell entwickelt, um die Abläufe in der {branch.name}-Branche zu optimieren und mehr Kunden zu gewinnen.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonial Section */}
                {branch.testimonial && (
                    <section className="py-24 px-4 md:px-8 bg-white border-y border-gray-100">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-8 flex items-center justify-center overflow-hidden border-2 border-red-500 p-1">
                                <span className="text-2xl font-bold text-gray-400">{branch.testimonial.name.charAt(0)}</span>
                            </div>
                            <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 leading-relaxed mb-8">
                                &quot;{branch.testimonial.quote}&quot;
                            </blockquote>
                            <div className="flex flex-col items-center">
                                <cite className="text-lg font-bold text-gray-900 not-italic block">
                                    {branch.testimonial.name}
                                </cite>
                                <span className="text-red-600 font-medium">
                                    {branch.testimonial.role}
                                </span>
                            </div>
                        </div>
                    </section>
                )}

                {/* Process Section */}
                <section className="py-24 px-4 md:px-8 bg-[#0F1116] text-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ihr Weg zur neuen Website</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Unkompliziert und transparent. Wir kümmern uns um die Technik, damit Sie sich auf Ihr Geschäft konzentrieren können.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12 relative">
                            {/* Connector Line (Desktop) */}
                            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-800 z-0"></div>

                            <div className="relative z-10 text-center">
                                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-[#0F1116] text-3xl">
                                    1
                                </div>
                                <h3 className="text-xl font-bold mb-3">Analyse & Angebot</h3>
                                <p className="text-gray-400">Wir besprechen Ihre Ziele und erstellen ein maßgeschneidertes Konzept für Ihren Betrieb.</p>
                            </div>
                            <div className="relative z-10 text-center">
                                <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-[#0F1116] text-3xl shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                                    2
                                </div>
                                <h3 className="text-xl font-bold mb-3">Design & Umsetzung</h3>
                                <p className="text-gray-400">Unsere Experten erstellen Ihre Website, schreiben Texte und optimieren die Technik.</p>
                            </div>
                            <div className="relative z-10 text-center">
                                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-[#0F1116] text-3xl">
                                    3
                                </div>
                                <h3 className="text-xl font-bold mb-3">Go-Live & Betreuung</h3>
                                <p className="text-gray-400">Wir schalten Ihre Seite online und kümmern uns auf Wunsch um die laufende Pflege.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 px-4 md:px-8 bg-gray-50">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Häufige Fragen</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="font-bold text-gray-900">{faq.q}</span>
                                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-6 pb-6 text-gray-600 animate-in slide-in-from-top-2">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <Contact onFormOpen={handleFormOpen} />
            </main>
        </div>
    );
}
