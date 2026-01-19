"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from "lucide-react";
import { City } from '../app/[slug]/cities';

interface FAQItem {
    question: string;
    answer: string;
}

interface CityFAQProps {
    city: City;
    headline?: string;
    subline?: string;
    questions?: FAQItem[];
}

const CityFAQ = ({ city, headline, subline, questions }: CityFAQProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    // City-specific FAQ Data - Unique mix and phrasing
    const defaultFaqData = [
        {
            question: `Gibt es versteckte Kosten für Unternehmen aus ${city.name}?`,
            answer: `Nein. Unser Fixpreis von 790€ gilt auch für Kunden aus ${city.name} und Umgebung. Darin enthalten sind Design, technische Umsetzung, SEO-Grundlagen und DSGVO-Sicherheit. Transparenz ist uns wichtig, gerade für die lokale Zusammenarbeit in ${city.region}.`
        },
        {
            question: `Wie hebe ich mich von der Konkurrenz in ${city.name} ab?`,
            answer: `Durch individuelles Design statt Templates. ${city.name} ist ein kompetitiver Markt. Wir analysieren Ihre lokalen Mitbewerber in ${city.name} und positionieren Ihre Website so, dass sie genau Ihre Stärken hervorhebt und Sie in den lokalen Suchergebnissen sichtbar macht.`
        },
        {
            question: `Können Sie auch Bilder von meinem Standort in ${city.name} machen?`,
            answer: `Wir arbeiten meist mit vorhandenem Material oder hochwertigen Stock-Medien. Für authentische Fotos aus ${city.name} empfehlen wir lokale Fotografen, mit denen wir Sie gerne vernetzen. Einbindung und Optimierung der Bilder übernehmen selbstverständlich wir.`
        },
        {
            question: `Betreuen Sie auch andere Kunden in ${city.name}?`,
            answer: `Ja, wir betreuen mehrere Unternehmen in ${city.region} und speziell im Raum ${city.name}. Aufgrund unserer Erfahrung mit dem Branchenmix in ${city.name} (siehe ${city.marketTrends}) verstehen wir schnell, worauf es bei Ihrem Projekt ankommt.`
        },
        {
            question: `Wie läuft die Zusammenarbeit ab, wenn ich in ${city.name} sitze?`,
            answer: `Sehr effizient. Wir nutzen Video-Calls, WhatsApp und Telefon. Das spart Ihnen Anfahrtszeiten im ${city.name}er Verkehr und uns Ressourcen, die wir direkt in die Qualität Ihrer Website stecken. Sie haben jederzeit einen festen Ansprechpartner.`
        },
        {
            question: `Ist die Website für den ${city.name}er Markt optimiert?`,
            answer: `Absolut. Wir richten die SEO-Strategie auf lokale Keywords wie "Dienstleistung ${city.name}" aus. Zudem achten wir auf schnelle Ladezeiten, da viele Nutzer in ${city.name} mobil unterwegs sind (z.B. in den Öffis oder in der Innenstadt).`
        }
    ];

    const faqData = questions || defaultFaqData;

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section className="py-20 bg-gray-50 relative overflow-hidden" id="faq">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="max-w-4xl mx-auto px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-red-600 font-semibold tracking-wider uppercase text-sm">Häufige Fragen</span>
                    <h2 className="text-3xl md:text-5xl font-light text-gray-900 mt-3 mb-6">
                        {headline || `Fragen zu Webdesign in ${city.name}`}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {subline || `Antworten für Unternehmer aus ${city.name} und ${city.region}.`}
                    </p>
                </div>

                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="text-lg font-medium text-gray-900 pr-8">
                                    {faq.question}
                                </span>
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${openIndex === index ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                                    {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 mt-2">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-500">
                        Noch Fragen zu Ihrem Projekt in {city.name}? <a href="#kontakt" className="text-red-600 font-medium hover:underline">Schreiben Sie uns</a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CityFAQ;
