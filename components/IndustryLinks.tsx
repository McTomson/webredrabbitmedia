"use client";

import Link from 'next/link';
import { Stethoscope, Hammer, Briefcase, ArrowRight } from 'lucide-react';
import { AOSWrapper } from './AnimatedSection';

const industries = [
    {
        slug: 'aerzte',
        title: 'Ärzte & Praxen',
        description: 'DSGVO-konforme Websites für Arztpraxen mit Terminbuchung und Patienteninformationen.',
        icon: Stethoscope,
        color: 'blue'
    },
    {
        slug: 'handwerk',
        title: 'Handwerk',
        description: 'Professionelle Online-Präsenz für Handwerksbetriebe mit Referenzen und Kontaktformular.',
        icon: Hammer,
        color: 'orange'
    },
    {
        slug: 'dienstleister',
        title: 'Dienstleister',
        description: 'Moderne Websites für Dienstleister mit Leistungsübersicht und Kundenbewertungen.',
        icon: Briefcase,
        color: 'green'
    }
];

const colorClasses = {
    blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        hover: 'hover:bg-blue-100'
    },
    orange: {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        hover: 'hover:bg-orange-100'
    },
    green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        hover: 'hover:bg-green-100'
    }
};

export default function IndustryLinks() {
    return (
        <section className="py-24 px-8 bg-gray-50" id="branchen">
            <div className="max-w-7xl mx-auto">
                <AOSWrapper animation="fade-up">
                    <div className="text-center mb-16">
                        <span className="text-red-600 font-medium text-sm uppercase tracking-wider">
                            Spezialisierungen
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-light mt-4 mb-6 text-gray-900">
                            Websites für Ihre Branche
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Wir kennen die spezifischen Anforderungen Ihrer Branche und erstellen
                            maßgeschneiderte Lösungen, die genau zu Ihrem Business passen.
                        </p>
                    </div>
                </AOSWrapper>

                <div className="grid md:grid-cols-3 gap-8">
                    {industries.map((industry, index) => {
                        const Icon = industry.icon;
                        const colors = colorClasses[industry.color as keyof typeof colorClasses];

                        return (
                            <AOSWrapper key={industry.slug} animation="fade-up" delay={100 + index * 100}>
                                <Link
                                    href={`/branchen/${industry.slug}`}
                                    className={`block bg-white rounded-2xl p-8 shadow-sm ${colors.hover} transition-all duration-300 hover:shadow-md group`}
                                >
                                    <div className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-8 h-8 ${colors.icon}`} />
                                    </div>

                                    <h3 className="text-2xl font-medium mb-4 text-gray-900">
                                        {industry.title}
                                    </h3>

                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {industry.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-red-600 font-medium group-hover:gap-3 transition-all">
                                        Mehr erfahren
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </Link>
                            </AOSWrapper>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
