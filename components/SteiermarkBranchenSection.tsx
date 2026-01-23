"use client";

import { Utensils, Factory, Cpu, Hammer } from 'lucide-react';
import { motion } from 'framer-motion';

const industries = [
    {
        icon: Utensils,
        title: "Gastronomie & Tourismus",
        description: "Vom Buschenschank in der Südsteiermark bis zum Hotel in Schladming. Wir sorgen für mehr Reservierungen und Buchungen.",
        features: ["Digitale Speisekarte", "Buchungssystem", "Event-Kalender"]
    },
    {
        icon: Factory,
        title: "Industrie & Gewerbe",
        description: "Der Motor der Steiermark. Wir präsentieren Ihre Produkte und Leistungen international professionell und überzeugend.",
        features: ["Produkt-Kataloge", "Mitarbeiter-Suche", "Mehrsprachigkeit"]
    },
    {
        icon: Cpu,
        title: "Startups & Tech",
        description: "Graz ist Tech-Hauptstadt. Wir liefern Webdesign, das Investoren überzeugt und skalierbar mit Ihrem Wachstum mithält.",
        features: ["Modernster Tech-Stack", "High-Performance", "Schnelle Iterationen"]
    },
    {
        icon: Hammer,
        title: "Handwerk & Bau",
        description: "Ehrliches Handwerk braucht eine ehrliche Website. Zeigen Sie Ihre Referenzprojekte und gewinnen Sie neue Aufträge.",
        features: ["Projekt-Galerien", "Anfrage-Formulare", "Regionales SEO"]
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
