"use client";

import { Star, Quote } from 'lucide-react';
import { AOSWrapper } from './AnimatedSection';

const testimonials = [
    {
        name: "Hotelier am Wörthersee",
        role: "Geschäftsführer",
        location: "Velden",
        text: "Endlich eine Agentur, die versteht, wie wichtig Direktbuchungen für uns sind. Die neue Seite ist nicht nur wunderschön, sondern bringt uns spürbar mehr Gäste ohne Provisionen.",
        stars: 5,
        initial: "M"
    },
    {
        name: "Christian M.",
        role: "Zimmerei-Betrieb",
        location: "Spittal an der Drau",
        text: "Ich wollte kein kompliziertes Technik-Zeug, sondern eine Seite, wo man sieht, was wir können. Das Team hat das perfekt umgesetzt. Handschlagqualität, wie man sie sich wünscht.",
        stars: 5,
        initial: "C"
    },
    {
        name: "Dr. Sabine K.",
        role: "Zahnärztin",
        location: "Klagenfurt",
        text: "Kompetent, schnell und freundlich. Meine Praxis wird jetzt bei Google viel besser gefunden und Patienten loben oft die übersichtliche Homepage.",
        stars: 5,
        initial: "S"
    },
    {
        name: "Tourismusverband (Mitglied)",
        role: "Marketing",
        location: "Villach Land",
        text: "Die Zusammenarbeit war erfrischend unkompliziert. Das Design fängt das Kärntner Lebensgefühl perfekt ein. Absolute Weiterempfehlung!",
        stars: 5,
        initial: "T"
    }
];

export default function KaerntenTestimonials() {
    return (
        <section className="py-24 bg-gray-50 overflow-hidden" id="stimmen">
            <div className="max-w-7xl mx-auto px-8 relative">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>

                <div className="relative z-10">
                    <div className="text-center mb-16">
                        <AOSWrapper animation="fade-up" delay={100}>
                            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
                                Stimmen aus <span className="text-red-600 font-medium">Kärnten</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Was Kärntner Unternehmer über die Zusammenarbeit mit uns sagen.
                            </p>
                        </AOSWrapper>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <AOSWrapper
                                key={index}
                                animation="fade-up"
                                delay={200 + (index * 100)}
                            >
                                <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col relative group">
                                    <Quote className="absolute top-8 right-8 w-12 h-12 text-gray-100 group-hover:text-red-50 transition-colors duration-300" />

                                    <div className="flex gap-1 mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>

                                    <blockquote className="text-lg text-gray-700 leading-relaxed mb-8 flex-grow italic">
                                        &quot;{testimonial.text}&quot;
                                    </blockquote>

                                    <div className="flex items-center gap-4 mt-auto">
                                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xl">
                                            {testimonial.initial}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                            <div className="text-sm text-gray-500">{testimonial.role} | {testimonial.location}</div>
                                        </div>
                                    </div>
                                </div>
                            </AOSWrapper>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
