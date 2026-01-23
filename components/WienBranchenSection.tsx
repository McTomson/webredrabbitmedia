"use client";

import { Briefcase, Building2, Rocket, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const industries = [
    {
        icon: Briefcase,
        title: "Kanzleien & Beratung",
        description: "In Wien zählen Vertrauen und Professionalität. Wir erstellen Webseiten für Rechtsanwälte, Steuerberater und Consulter, die Kompetenz ausstrahlen und neue Mandanten gewinnen.",
        features: ["Rechtssichere Struktur", "Professionelles Fotoshooting-Konzept", "KI-optimierte Texte"]
    },
    {
        icon: Rocket,
        title: "Tech-Startups",
        description: "Innovation aus der Hauptstadt. Wir bauen Hochleistungs-Websites für Wiener Startups, die Investoren überzeugen und Nutzer begeistern – skalierbar und blitzschnell.",
        features: ["Modernster Tech-Stack", "Investor-Pitch Readyness", "Maximale Performance"]
    },
    {
        icon: Building2,
        title: "Immobilien & Bauträger",
        description: "Vom ersten Bezirk bis in die Donaustadt. Wir visualisieren Ihre Projekte so hochwertig, dass Objekte schneller verwertet werden und Ihr Portfolio glänzt.",
        features: ["Interaktive Projektkarten", "Hochwertige Galerien", "SEO für Wiener Bezirke"]
    },
    {
        icon: ShoppingBag,
        title: "Urbaner Handel",
        description: "Gezielte Sichtbarkeit für Wiener Ladengeschäfte und Boutiquen. Wir sorgen dafür, dass Kunden Sie online finden und direkt in Ihr Geschäft kommen.",
        features: ["Local SEO Strategie", "Google Maps Integration", "Mobile-First Design"]
    }
];

export default function WienBranchenSection() {
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
                            Branchen-Fokus für <span className="text-red-600 font-medium">Wiener Unternehmen</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Wien ist vielfältig und anspruchsvoll. Wir bieten maßgeschneidertes Webdesign, das genau auf Ihre Branche und Ihre Wiener Zielgruppe zugeschnitten ist.
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
