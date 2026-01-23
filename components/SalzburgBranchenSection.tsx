"use client";

import { Hotel, Music, Gem, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';

const industries = [
    {
        icon: Hotel,
        title: "Hotellerie & Tourismus",
        description: "Salzburger Gastlandschaften digital erlebbar machen. Wir erstellen Webseiten für Hotels und Resorts, die sofort Urlaubsstimmung wecken und Direktbuchungen maximieren.",
        features: ["Integration von Buchungstools", "Emotionale Bildwelten", "Mehrsprachige SEO"]
    },
    {
        icon: Music,
        title: "Kultur & Events",
        description: "Wo die Kunst zu Hause ist. Wir begleiten Veranstalter und Kulturbetriebe bei der digitalen Inszenierung ihrer Projekte – modern, ästhetisch und nutzerfreundlich.",
        features: ["Event-Management Tools", "Interaktive Terminkalender", "Klares, edles Design"]
    },
    {
        icon: Gem,
        title: "Manufakturen & Handwerk",
        description: "Beste Qualität verdient beste Präsentation. Wir setzen Salzburger Traditionsbetriebe und Manufakturen so in Szene, dass die Wertigkeit Ihrer Arbeit online spürbar wird.",
        features: ["Detailverliebte Galerien", "Marken-Storytelling", "Anfrage-Optimierung"]
    },
    {
        icon: Globe2,
        title: "Export & Dienstleistung",
        description: "Von Salzburg aus die Welt erobern. Wir unterstützen exportstarke Unternehmen dabei, ihre Kompetenz international sichtbar zu machen – technisch präzise und überzeugend.",
        features: ["KI-gestützte Übersetzung", "B2B-Leadgenerierung", "Globale SEO-Strategie"]
    }
];

export default function SalzburgBranchenSection() {
    return (
        <section className="py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
                            Exzellenz für <span className="text-red-500 font-medium">Salzburger Branchen</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            In Salzburg zählt der erste Eindruck. Wir entwickeln Webauftritte, die Ihren hohen Qualitätsanspruch widerspiegeln und Ihre Kunden nachhaltig beeindrucken.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {industries.map((industry, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 h-full flex flex-col">
                                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <industry.icon className="w-7 h-7 text-gray-600 group-hover:text-red-500 transition-colors" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 mb-3">{industry.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                                    {industry.description}
                                </p>
                                <ul className="space-y-2 mt-auto">
                                    {industry.features.map((feature, i) => (
                                        <li key={i} className="text-xs text-gray-500 font-medium flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
