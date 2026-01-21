"use client";

import { Wrench, Wine, Briefcase, Stethoscope, Factory, Trees, CheckCircle } from 'lucide-react';
import { AOSWrapper } from './AnimatedSection';

const branchen = [
    {
        icon: Wine,
        title: "Weinbau & Genuss",
        description: "Verkaufsstarke Websites für Winzer und Direktvermarkter im Weinviertel und der Wachau.",
        redText: "Heurigen-Digital",
        highlight: "Online-Shop"
    },
    {
        icon: Factory,
        title: "Industrie & High-Tech",
        description: "Professionelle Präsenz für Industriebetriebe in Wiener Neustadt und dem Mostviertel.",
        redText: "B2B-Experten",
        highlight: "Performance"
    },
    {
        icon: Briefcase,
        title: "Wiener Umland Business",
        description: "Smarte Web-Lösungen für Dienstleister in Speckgürtel-Regionen wie Baden & Mödling.",
        redText: "Local Hero",
        highlight: "Anfragen-Plus"
    },
    {
        icon: Wrench,
        title: "Meister-Handwerk",
        description: "Moderne Websites für Tischler, Bauherren und Handwerker im Waldviertel und ganz NÖ.",
        redText: "Bodenständig",
        highlight: "Regional"
    },
    {
        icon: Stethoscope,
        title: "Gesundheit & Therapie",
        description: "Vertrauensvolle Online-Auftritte für Ärzte und Therapeuten in St. Pölten und Krems.",
        redText: "Patienten-Fokus",
        highlight: "Terminanfrage"
    },
    {
        icon: Trees,
        title: "Tourismus & Freizeit",
        description: "Emotionale Websites für Hotels am Semmering oder Kulturbetriebe in Grafenegg.",
        redText: "Erlebnis-Design",
        highlight: "Interaktion"
    }
];

export default function NOEBranchenSection() {
    return (
        <section className="py-24 bg-white" id="branchen">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-16">
                    <AOSWrapper animation="fade-up" delay={100}>
                        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
                            Webdesign für <span className="text-red-600 font-medium">NÖ Branchen</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Wir verstehen die Vielfalt Niederösterreichs. Von der High-Tech-Schmiede bis zum
                            Traditionswinzer – wir bauen Ihre digitale Visitenkarte mit Biss.
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
                            <div className="group h-full p-8 lg:p-10 bg-white border border-gray-100 rounded-xl hover:shadow-xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-100 to-red-100 group-hover:from-red-100 group-hover:to-red-200 transition-all duration-500"></div>

                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-50 transition-all duration-300">
                                    <branche.icon className="w-8 h-8 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
                                </div>

                                <div className="text-center flex flex-col flex-grow">
                                    <h4 className="font-medium text-lg lg:text-xl mb-4 text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                                        {branche.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow">
                                        {branche.description}
                                    </p>

                                    <div className="mb-6">
                                        <div className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                                            {branche.redText}
                                        </div>
                                    </div>

                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-[10px] font-medium text-gray-400 group-hover:bg-red-50 group-hover:text-red-600 transition-all duration-300 mx-auto mt-auto uppercase tracking-wider">
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
