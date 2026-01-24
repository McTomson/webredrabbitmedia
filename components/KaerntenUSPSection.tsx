"use client";

import { Euro, Zap, MapPin, CheckCircle, Palmtree } from 'lucide-react';
import { AOSWrapper } from './AnimatedSection';

const usps = [
    {
        icon: Palmtree,
        title: "Verständnis für Kärntner Betriebe",
        description: "Ob Saisonbetrieb oder Ganzjahresunternehmen – wir kennen die lokalen Gegebenheiten und Märkte ganz genau.",
        highlight: "Regionales Know-how"
    },
    {
        icon: Euro,
        title: "Fixpreis ab 790 €",
        description: "Professioneller Auftritt muss nicht teuer sein. Investiere in dein Geschäft, wir kümmern uns um den Rest.",
        highlight: "Transparent & Fair"
    },
    {
        icon: Zap,
        title: "Technik, die läuft",
        description: "Keine Sorgen um Updates oder Sicherheit. Du kümmerst dich um deine Kunden, wir halten dir den Rücken frei.",
        highlight: "Rundum-Sorglos"
    },
    {
        icon: MapPin,
        title: "Persönlicher Partner",
        description: "Keine anonyme Hotline, sondern echte Ansprechpartner. Wir sind für dich da, wenn du uns brauchst.",
        highlight: "Erreichbar"
    }
];

export default function KaerntenUSPSection() {
    return (
        <section className="py-24 bg-white" id="vorteile">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-16">
                    <AOSWrapper animation="fade-up" delay={100}>
                        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
                            Warum <span className="text-red-600 font-medium">Kärnten</span> auf uns setzt
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Webdesign mit Hirn und Herz. Speziell für die Anforderungen zwischen Wörthersee und Großglockner.
                        </p>
                    </AOSWrapper>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {usps.map((usp, index) => (
                        <AOSWrapper
                            key={index}
                            animation="fade-up"
                            delay={200 + (index * 100)}
                        >
                            <div className="group h-full p-8 lg:p-10 bg-gray-50 rounded-xl hover:bg-white hover:shadow-xl border border-transparent hover:border-gray-100 transition-all duration-500 flex flex-col">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-50 transition-all duration-300 shadow-sm">
                                    <usp.icon className="w-8 h-8 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
                                </div>

                                <div className="text-center flex flex-col flex-grow">
                                    <h4 className="font-medium text-lg lg:text-xl mb-4 text-gray-900">
                                        {usp.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                                        {usp.description}
                                    </p>

                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white group-hover:bg-red-50 rounded-full text-[10px] font-medium text-gray-400 group-hover:text-red-600 transition-all duration-300 mx-auto mt-auto uppercase tracking-wider border border-gray-100">
                                        <CheckCircle className="w-3 h-3" />
                                        {usp.highlight}
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
