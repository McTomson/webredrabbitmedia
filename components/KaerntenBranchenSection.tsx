"use client";

import { Wrench, Hotel, Briefcase, Utensils, ShoppingBag, Mountain, CheckCircle } from 'lucide-react';
import { AOSWrapper } from './AnimatedSection';

const branchen = [
    {
        icon: Hotel,
        title: "Tourismus & Hotellerie",
        description: "Buchungsstarke Websites für Hotels, Pensionen und Ferienwohnungen rund um die Kärntner Seen.",
        redText: "Direktbuchungen",
        highlight: "Saisonal optimiert"
    },
    {
        icon: Wrench,
        title: "Handwerk & Bau",
        description: "Seriöse Auftritte für Baufirmen, Installateure und Handwerker von Villach bis Wolfsberg.",
        redText: "Mitarbeiter finden",
        highlight: "Regional stark"
    },
    {
        icon: Briefcase,
        title: "Dienstleister",
        description: "Moderne Websites für Ärzte, Steuerberater, Anwälte und Berater in Klagenfurt & Villach.",
        redText: "Vertrauensaufbau",
        highlight: "Klagenfurt & Villach"
    },
    {
        icon: Utensils,
        title: "Gastronomie",
        description: "Appetitanregende Designs für Restaurants, Buschenschanken und Cafés.",
        redText: "Speisekarte digital",
        highlight: "Genuss pur"
    },
    {
        icon: Mountain,
        title: "Freizeit & Sport",
        description: "Dynamische Seiten für Skischulen, Bootsverleihe und Outdoor-Anbieter in den Nockbergen.",
        redText: "Erlebnis",
        highlight: "Tourismus-Fokus"
    },
    {
        icon: ShoppingBag,
        title: "Handel & E-Commerce",
        description: "Verkaufsstarke Online-Shops für Kärntner Produkte und Direktvermarkter.",
        redText: "Online verkaufen",
        highlight: "Regionaler Handel"
    }
];

export default function KaerntenBranchenSection() {
    return (
        <section className="py-24 bg-white" id="branchen">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-16">
                    <AOSWrapper animation="fade-up" delay={100}>
                        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
                            Lösungen für <span className="text-red-600 font-medium">Kärntner Branchen</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Wir verstehen die Kärntner Wirtschaft. Ob Saisonbetrieb am See oder Tech-Firma im Lakeside Park – wir haben die passende Strategie.
                        </p>
                    </AOSWrapper>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {branchen.map((branche, index) => (
                        <AOSWrapper
                            key={index}
                            animation="fade-up"
                            delay={200 + (index * 100)}
                        >
                            <div className="group h-full p-8 lg:p-10 bg-white border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden flex flex-col">
                                {/* Background accent */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-red-200 group-hover:from-red-200 group-hover:to-red-300 transition-all duration-500"></div>

                                {/* Icon */}
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-50 transition-all duration-300">
                                    <branche.icon className="w-8 h-8 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
                                </div>

                                {/* Content */}
                                <div className="text-center flex flex-col flex-grow">
                                    <h4 className="font-medium text-lg lg:text-xl mb-4 text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                                        {branche.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                                        {branche.description}
                                    </p>

                                    {/* Red badge */}
                                    <div className="mb-6">
                                        <div className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                                            {branche.redText}
                                        </div>
                                    </div>

                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-xs font-medium text-gray-600 group-hover:bg-red-50 group-hover:text-red-600 transition-all duration-300 mx-auto mt-auto">
                                        <CheckCircle className="w-3 h-3" />
                                        {branche.highlight}
                                    </div>
                                </div>
                            </div>
                        </AOSWrapper>
                    ))}
                </div>
            </div>
        </section>
    );
}
