"use client";

import { GlassWater, Sun, Store, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const industries = [
    {
        icon: GlassWater,
        title: "Weinbau & Direktvermarktung",
        description: "Vom Seewinkel bis ins Südburgenland. Wir erstellen Webseiten für Winzer und Hofläden, die Ihre Tradition modern präsentieren und den Ab-Hof-Verkauf digital ankurbeln.",
        features: ["Einfache Webshop-Systeme", "Emotionale Bildsprache", "Event-Ankündigungen"]
    },
    {
        icon: Sun,
        title: "Erneuerbare Energien",
        description: "Power aus dem Sonnenland. Wir unterstützen Betriebe im Bereich Photovoltaik und Windkraft dabei, ihre Kompetenz sichtbar zu machen und Anfragen effizient zu generieren.",
        features: ["SEO für Energiethemen", "Anfrage-Konfiguratoren", "Technische Beratung online"]
    },
    {
        icon: Store,
        title: "Regionales Kleingewerbe",
        description: "Lokale Stärke digital nutzen. Wir bauen bezahlbare Webseiten für burgenländische Kleinbetriebe, die bei Google in der Region ganz oben erscheinen wollen.",
        features: ["Fixpreis-Garantie", "Local SEO Burgenland", "Schnelle Umsetzung"]
    },
    {
        icon: Leaf,
        title: "Naturtourismus & Freizeit",
        description: "Erholung am Neusiedler See. Wir begleiten Pensionen und Freizeitbetriebe bei der Gewinnung neuer Gäste durch einladendes Design und einfache Buchungswege.",
        features: ["Mobil-optimierte Buchung", "Freizeit-Tipp Blogs", "Emotionale Kundenreise"]
    }
];

export default function BurgenlandBranchenSection() {
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
                            Regionale Lösungen für <span className="text-red-600 font-medium">Burgenlands Betriebe</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Ehrlich, direkt und effektiv. Wir liefern Webdesign für das Burgenland, das genau zu Ihrem Budget passt und Ihre Ziele in der Region sicher erreicht.
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
                                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
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
