"use client";

import { Utensils, Factory, Cpu, Hammer } from 'lucide-react';
import { motion } from 'framer-motion';

const industries = [
    {
        icon: Factory,
        title: "Industrie & Export",
        description: "Das Rückgrat der Steiermark. Wir präsentieren Ihre Fertigungsprozesse und Produkte für den Weltmarkt – technisch brillant und überzeugend.",
        features: ["B2B-Produktwelten", "Internationale SEO", "Karriere-Portale"]
    },
    {
        icon: Cpu,
        title: "GreenTech & Innovation",
        description: "Nachhaltigkeit trifft High-End. Wir bauen Webseiten für Pioniere im Bereich Energie und Technik, die Vertrauen bei Investoren und Kunden schaffen.",
        features: ["Clean-Code Architektur", "Schnelle Ladezeiten", "Messbarer Vorsprung"]
    },
    {
        icon: Utensils,
        title: "Tourismus & Genuss",
        description: "Vom Schilcher-Winzer bis zum Ski-Resort. Wir bringen das steirische Lebensgefühl ins Netz und sorgen für volle Auftragsbücher und Reservierungen.",
        features: ["E-Commerce & Buchung", "Emotionale Journeys", "Regionales Marketing"]
    },
    {
        icon: Hammer,
        title: "Modernes Handwerk",
        description: "Präzision aus der Region. Wir zeigen Ihre Referenzen so hochwertig, dass Qualität direkt spürbar wird – von Bruck bis Deutschlandsberg.",
        features: ["Projekt-Visualisierung", "Lokale Sichtbarkeit", "Einfache Anfrage-Tools"]
    }
];

export default function SteiermarkBranchenSection() {
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
                            Branchen, die wir <span className="text-red-600 font-medium">verstehen</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Jede Branche hat ihre eigenen Regeln. Wir kennen sie.
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
                                    <industry.icon className="w-7 h-7 text-gray-600 group-hover:text-red-600 transition-colors" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 mb-3">{industry.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                                    {industry.description}
                                </p>
                                <ul className="space-y-2 mt-auto">
                                    {industry.features.map((feature, i) => (
                                        <li key={i} className="text-xs text-gray-500 font-medium flex items-center gap-2">
                                            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
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
