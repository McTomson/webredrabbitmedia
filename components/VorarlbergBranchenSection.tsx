"use client";

import { Cpu, PenTool, Layout, Microscope } from 'lucide-react';
import { motion } from 'framer-motion';

const industries = [
    {
        icon: Cpu,
        title: "High-Tech & Industrie",
        description: "Präzision aus dem Ländle. Wir entwickeln Webauftritte für Vorarlberger Industrie-Champions, die technische Überlegenheit und Innovationskraft international auf den Punkt bringen.",
        features: ["Clean-Code Architektur", "Internationales Recruiting", "B2B Lead-Systeme"]
    },
    {
        icon: PenTool,
        title: "Architektur & Design",
        description: "Form trifft Funktion. Wir bauen Webseiten für Vorarlberger Planer und Gestalter, die genau die Klarsicht und Ästhetik versprühen, für die die Region weltweit bekannt ist.",
        features: ["Portfolio-Visualisierung", "Reduzierte Designsprache", "Maximale Bildqualität"]
    },
    {
        icon: Layout,
        title: "Innovative KMU",
        description: "Bodenständigkeit trifft Hightech. Wir unterstützen Vorarlberger Mittelstandsbetriebe dabei, ihre Marktführerschaft digital zu festigen und neue Märkte effizient zu erschließen.",
        features: ["KI-optimierte Datenstruktur", "Gezielte GEO-Sichtbarkeit", "Skalierbare Lösungen"]
    },
    {
        icon: Microscope,
        title: "Forschung & Bildung",
        description: "Wissen digital vermitteln. Wir erstellen Plattformen für Bildungseinrichtungen und Labore, die komplexes Know-how einfach zugänglich machen und Talente anziehen.",
        features: ["Content-Hub Strategie", "Modernstes UI/UX Design", "Suchmaschinen-Autorität"]
    }
];

export default function VorarlbergBranchenSection() {
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
                            Digitale Exzellenz für <span className="text-red-500 font-medium">Vorarlbergs Pioniere</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Im Ländle zählt die Qualität bis ins kleinste Detail. Wir liefern Webdesign, das diesem hohen Anspruch an Präzision und technischer Perfektion gerecht wird.
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
