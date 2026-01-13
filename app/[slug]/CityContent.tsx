"use client";

import { MapPin, Users, Building, Phone, Mail, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { AOSWrapper } from '@/components/AnimatedSection';
import Image from 'next/image';

interface CityContentProps {
    city: {
        name: string;
        region: string;
        population: string;
        description: string;
        keywords: string;
        landmarks: readonly string[];
        seoText: string;
        marketTrends: string;
        localFacts: readonly string[];
    }
}

export default function CityContent({ city }: CityContentProps) {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/images/hero-portrait.jpg')] bg-cover bg-center"></div>
                </div>

                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <AOSWrapper animation="fade-up" delay={100}>
                        <div className="flex items-center gap-2 text-red-400 mb-6">
                            <MapPin className="w-5 h-5" />
                            <span className="text-sm font-medium">{city.region}, Österreich</span>
                        </div>
                    </AOSWrapper>

                    <AOSWrapper animation="fade-up" delay={200}>
                        <h1 className="text-5xl lg:text-6xl font-light mb-6 leading-tight">
                            Professionelles Webdesign in {city.name}
                        </h1>
                    </AOSWrapper>

                    <AOSWrapper animation="fade-up" delay={300}>
                        <p className="text-2xl text-gray-300 mb-8 max-w-3xl">
                            Professionelle Website erstellen lassen ab 790€ statt 2.800€
                        </p>
                    </AOSWrapper>

                    <AOSWrapper animation="fade-up" delay={400}>
                        <div className="flex flex-wrap gap-4 mb-12">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <Check className="w-5 h-5 text-green-400" />
                                <span>15 Jahre Erfahrung</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <Check className="w-5 h-5 text-green-400" />
                                <span>800+ zufriedene Kunden</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <Check className="w-5 h-5 text-green-400" />
                                <span>Erst zahlen wenn zufrieden</span>
                            </div>
                        </div>
                    </AOSWrapper>

                    <AOSWrapper animation="fade-up" delay={500}>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/#kontakt"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white hover:bg-red-700 transition-all duration-300 rounded-none group"
                            >
                                <span className="text-lg">Jetzt kostenlosen Vorschlag anfordern</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="tel:+436769000955"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 rounded-none"
                            >
                                <Phone className="w-5 h-5" />
                                <span>+43 676 9000 955</span>
                            </a>
                        </div>
                    </AOSWrapper>
                </div>
            </section>

            {/* City Info Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <AOSWrapper animation="fade-right" delay={200}>
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
                                    Webdesign für Unternehmen in {city.name}
                                </h2>
                                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                                    {city.description}
                                </p>

                                {/* Unique SEO Content Block */}
                                <div className="mb-8 p-6 bg-red-50 rounded-xl border border-red-100">
                                    <h3 className="text-lg font-medium text-red-800 mb-3">
                                        Warum {city.name} anders tickt
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed text-sm">
                                        {city.seoText}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-6 h-6 text-red-600" />
                                        <span className="text-gray-700"><strong>Einwohner:</strong> {city.population}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-6 h-6 text-red-600" />
                                        <span className="text-gray-700"><strong>Region:</strong> {city.region}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Building className="w-6 h-6 text-red-600 mt-1" />
                                        <div>
                                            <span className="text-gray-900 font-medium block mb-1">Markttrends:</span>
                                            <span className="text-gray-600 text-sm leading-relaxed">{city.marketTrends}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AOSWrapper>

                        <AOSWrapper animation="fade-left" delay={300}>
                            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                                <h3 className="text-2xl font-light text-gray-900 mb-6">
                                    Warum Red Rabbit Media?
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        "Transparente Preise ab 790€",
                                        "Persönliche Betreuung aus Wien",
                                        "Schnelle Umsetzung in 7 Tagen",
                                        "Moderne, responsive Designs",
                                        "SEO-optimiert für Google",
                                        "DSGVO-konform",
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AOSWrapper>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-red-600 to-red-700 text-white">
                <div className="max-w-4xl mx-auto px-8 text-center">
                    <AOSWrapper animation="fade-up" delay={200}>
                        <h2 className="text-3xl lg:text-4xl font-light mb-6">
                            Bereit für deine neue Website in {city.name}?
                        </h2>
                    </AOSWrapper>

                    <AOSWrapper animation="fade-up" delay={300}>
                        <p className="text-xl mb-8 text-white/90">
                            Fülle einfach das Formular aus und erhalte deinen kostenlosen Website-Vorschlag.
                            Du zahlst nur, wenn dir das Ergebnis gefällt!
                        </p>
                    </AOSWrapper>

                    <AOSWrapper animation="fade-up" delay={400}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/#kontakt"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-600 hover:bg-gray-100 transition-all duration-300 rounded-none group"
                            >
                                <span className="text-lg font-medium">Kostenlosen Vorschlag anfordern</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="mailto:office@redrabbit.media"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-red-600 transition-all duration-300 rounded-none"
                            >
                                <Mail className="w-5 h-5" />
                                <span>E-Mail senden</span>
                            </a>
                        </div>
                    </AOSWrapper>
                </div>
            </section>

            {/* Link to Main Page */}
            <section className="py-12 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-8 text-center">
                    <p className="text-gray-600">
                        Mehr über unsere Leistungen erfahren?{' '}
                        <Link href="/" className="text-red-600 hover:underline font-medium">
                            Zur Hauptseite →
                        </Link>
                    </p>
                </div>
            </section>
        </div>
    );
}
