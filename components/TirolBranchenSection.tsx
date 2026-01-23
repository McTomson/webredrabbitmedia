"use client";

import { Mountain, UtensilsCrossed, Footprints, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const industries = [
    {
        icon: Mountain,
        title: "Alpiner Tourismus",
        description: "Wo Berge auf Webdesign treffen. Wir bauen Webseiten für Tourismusverbände und Bergbahnen, die Lust auf den nächsten Gipfelsieg machen – am Handy wie am Desktop.",
        features: ["Interaktive Pistenpläne", "Saisonale Inhalts-Steuerung", "Maximale Mobile-Performance"]
    },
    {
        icon: UtensilsCrossed,
        title: "Gastronomie & Hospitality",
        description: "Tiroler Genuss digital serviert. Wir sorgen dafür, dass Gäste online den Weg zu Ihnen finden und direkt einen Tisch oder ein Zimmer in Ihrer Hütte oder Ihrem Hotel reservieren.",
        features: ["Digitale Speisekarten", "Reservierungssysteme", "Gästebewertungs-Management"]
    },
    {
        icon: Footprints,
        title: "Outdoor & Sport",
        description: "Ihre Ausrüstung für das Internet. Wir unterstützen Sportgeschäfte und Bergführer dabei, ihre Leistungen und Produkte so zu präsentieren, dass Profis und Einsteiger vertrauen.",
        features: ["Intuitive Nutzerführung", "Lokale GEO-Optimierung", "Verkaufsstarke Landingpages"]
    },
    {
        icon: Wrench,
        title: "Spezialisiertes Handwerk",
        description: "Stabilität und Präzision. Wir zeigen die Kompetenz Tiroler Handwerker – vom Holzbau bis zur Haustechnik – so überzeugend, dass Referenzen für sich selbst sprechen.",
        features: ["Hochwertige Bildergalerien", "Einfache Kontaktwege", "Lokale Such-Sichtbarkeit"]
    }
];

export default function TirolBranchenSection() {
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
                            Digitale Power für <span className="text-red-500 font-medium">Tiroler Betriebe</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            In Tirol zählen Taten. Wir liefern Webdesign, das hält, was es verspricht – pfeilschnell, stabil und exakt auf Ihre Zielgruppe in den Alpen angepasst.
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
