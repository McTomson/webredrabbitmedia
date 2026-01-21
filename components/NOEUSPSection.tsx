"use client";

import { Euro, Shield, Zap, MapPin, CheckCircle } from 'lucide-react';
import { AOSWrapper } from './AnimatedSection';

const usps = [
    {
        icon: Euro,
        title: "Fixpreis ab 790 €",
        description: "Keine versteckten Kosten, keine Überraschungen. Sie wissen von Anfang an, was Sie bezahlen.",
        highlight: "Transparent"
    },
    {
        icon: Shield,
        title: "Erst zahlen, wenn's passt",
        description: "Sie zahlen erst, wenn Sie mit Ihrer neuen Webseite rundum zufrieden sind. Null Risiko für Sie.",
        highlight: "Zufriedenheitsgarantie"
    },
    {
        icon: Zap,
        title: "Kein Technik-Stress",
        description: "Sie füllen nur ein Formular aus – wir kümmern uns um den Rest. Keine Meetings, kein Aufwand.",
        highlight: "Unkompliziert"
    },
    {
        icon: MapPin,
        title: "Aus der Region, für die Region",
        description: "Wir kennen Niederösterreich und verstehen, was Betriebe hier brauchen, um erfolgreich zu sein.",
        highlight: "Regional verwurzelt"
    }
];

export default function NOEUSPSection() {
    return (
        <section className="py-24 bg-white" id="warum-wir">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-16">
                    <AOSWrapper animation="fade-up" delay={100}>
                        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
                            Warum Betriebe in <span className="text-red-600 font-medium">NÖ</span> uns vertrauen
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Über 160 zufriedene Kunden in Niederösterreich. Das sind unsere Versprechen an Sie.
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
