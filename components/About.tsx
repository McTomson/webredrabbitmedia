"use client";

import { MapPin, Users, Award, Star, Trophy, Wrench, Shield, MapPin as MapPinIcon, Target, DollarSign, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { AOSWrapper } from './AnimatedSection';
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";

const About = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const testimonials = [
        {
            stars: "⭐️⭐️⭐️⭐️⭐️",
            rating: "5/5",
            quote: "\"Ich hatte keine Lust mich damit zu beschäftigen wusste aber das ich eine neue Webseite benötigte. RED hat alles gemacht und ich musste nur einmal ein feedback geben. Jetzt hab ich eine moderne Website und bin online sichtbar – ohne Stress.\"",
            author: "Daniel W.",
            company: "Sanitär & Heizung",
            avatar: "👨‍🔧"
        },
        {
            stars: "⭐️⭐️⭐️⭐️⭐️",
            rating: "5/5",
            quote: "\"Ich war erst skeptisch. Aber das Team hat geliefert – schnell, unkompliziert und die Seite sieht top aus. Danke nochmals!\"",
            author: "Stefan H.",
            company: "Elektrotechnik",
            avatar: "👨‍💻"
        },
        {
            stars: "⭐️⭐️⭐️⭐️",
            rating: "4/5",
            quote: "\"Nachdem ich Google Analytics gecheckt habe sah ich das meine Kunden nach 30 sec die Seite wieder verlassen haben und mich nicht kontaktiert haben. Jetzt bekomme ich jeden Monat neue Anfragen.\"",
            author: "Ali K.",
            company: "Bauunternehmen",
            avatar: "👷‍♂️"
        }
    ];

    // Auto-advance carousel
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isDragging) {
                setCurrentSlide((prev) => (prev + 1) % 3); // Only 3 positions for 3 testimonials
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.clientX);
        setCurrentX(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setCurrentX(e.clientX);
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    setCurrentSlide((prev) => (prev + 1) % 3);
                } else {
                    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
                }
            }
            setIsDragging(false);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
        setCurrentX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isDragging) {
            setCurrentX(e.touches[0].clientX);
        }
    };

    const handleTouchEnd = () => {
        if (isDragging) {
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    setCurrentSlide((prev) => (prev + 1) % 3);
                } else {
                    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
                }
            }
            setIsDragging(false);
        }
    };

    // Review Schema für Google Rich Snippets
    const reviewSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Review",
                "itemReviewed": {
                    "@type": "LocalBusiness",
                    "name": "Red Rabbit Media",
                    "@id": "https://web.redrabbit.media/#localbusiness"
                },
                "author": {
                    "@type": "Person",
                    "name": "Daniel W."
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5",
                    "worstRating": "1"
                },
                "reviewBody": "Ich hatte keine Lust mich damit zu beschäftigen wusste aber das ich eine neue Webseite benötigte. RED hat alles gemacht und ich musste nur einmal ein feedback geben. Jetzt hab ich eine moderne Website und bin online sichtbar – ohne Stress.",
                "datePublished": "2024-11-20"
            },
            {
                "@type": "Review",
                "itemReviewed": {
                    "@type": "LocalBusiness",
                    "name": "Red Rabbit Media",
                    "@id": "https://web.redrabbit.media/#localbusiness"
                },
                "author": {
                    "@type": "Person",
                    "name": "Stefan H."
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5",
                    "worstRating": "1"
                },
                "reviewBody": "Ich war erst skeptisch. Aber das Team hat geliefert – schnell, unkompliziert und die Seite sieht top aus. Danke nochmals!",
                "datePublished": "2024-10-15"
            },
            {
                "@type": "Review",
                "itemReviewed": {
                    "@type": "LocalBusiness",
                    "name": "Red Rabbit Media",
                    "@id": "https://web.redrabbit.media/#localbusiness"
                },
                "author": {
                    "@type": "Person",
                    "name": "Ali K."
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "4",
                    "bestRating": "5",
                    "worstRating": "1"
                },
                "reviewBody": "Nachdem ich Google Analytics gecheckt habe sah ich das meine Kunden nach 30 sec die Seite wieder verlassen haben und mich nicht kontaktiert haben. Jetzt bekomme ich jeden Monat neue Anfragen.",
                "datePublished": "2024-09-28"
            }
        ]
    };

    return (
        <>
            {/* Review Schema for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
            />

            <section id="about" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Side - Content */}
                    <div className="space-y-8">
                        <AOSWrapper animation="fade-left" delay={200}>
                            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
                                Über Red Rabbit Media
                            </h2>
                        </AOSWrapper>

                        <AOSWrapper animation="fade-left" delay={300}>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Wir entwickeln professionelle Websites, die Ihr Unternehmen online erfolgreich machen.
                                Mit über 15 Jahren Erfahrung verstehen wir, was Ihre Kunden erwarten
                                und wie Sie online überzeugen.
                            </p>
                        </AOSWrapper>

                        {/* Features */}
                        <AOSWrapper animation="fade-left" delay={400}>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <DollarSign className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Transparente Preise</h3>
                                        <p className="text-gray-600 text-sm">
                                            Keine versteckten Kosten - Sie wissen von Anfang an, was Ihre Website kostet.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Target className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Strategisch durchdacht</h3>
                                        <p className="text-gray-600 text-sm">
                                            Jede Website wird so konzipiert, dass sie Ihre Geschäftsziele erreicht.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Zap className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">🎯 Rundum-sorglos-Paket</h3>
                                        <p className="text-gray-600 text-sm">
                                            Wir übernehmen alles: Texte, Bilder, Struktur, Design - Sie lehnen sich zurück und erhalten Ihre fertige Website.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </AOSWrapper>

                        {/* Contact Info */}
                        <AOSWrapper animation="fade-left" delay={500}>
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h3 className="font-medium text-gray-900 mb-3">Red Rabbit GmbH</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>Grabnergasse 8/8, 1060 Wien, Österreich</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4" />
                                        <span>Geprüfter Webdesign-Partner</span>
                                    </div>
                                </div>
                            </div>
                        </AOSWrapper>
                    </div>

                    {/* Right Side - Visual */}
                    <AOSWrapper animation="fade-right" delay={300}>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden relative">
                                <Image
                                    src="/images/pexels-fauxels-3184395.jpg"
                                    alt="Red Rabbit Media Team"
                                    fill
                                    className="object-cover object-right"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                                    <div className="text-center">
                                        <div className="relative h-24 w-auto mx-auto mb-6 brightness-0 invert">
                                            <Image
                                                src="/images/logo.png"
                                                alt="Red Rabbit Media"
                                                width={100}
                                                height={100}
                                                className="object-contain"
                                            />
                                        </div>
                                        <p className="text-white font-medium text-lg">Persönlich. Transparent. Zuverlässig.</p>
                                        <p className="text-white/80 text-sm mt-2">Über 800 zufriedene Kunden. 15 Jahre Erfahrung.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                        </div>
                    </AOSWrapper>
                </div>

                {/* Testimonials - Completely redesigned with animations */}
                <AOSWrapper animation="fade-up" delay={600}>
                    <div className="mt-60">
                        <h3 className="text-3xl lg:text-4xl font-light text-center mb-6 text-gray-900">
                            Was unsere Kunden sagen
                        </h3>
                        <p className="text-xl text-gray-600 text-center mb-20 max-w-2xl mx-auto">
                            Echte Erfahrungen von Kunden, die mit uns erfolgreich geworden sind
                        </p>

                        {/* Desktop Grid Layout */}
                        <div className="hidden lg:grid md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <AOSWrapper
                                    key={index}
                                    animation="fade-up"
                                    delay={700 + (index * 150)}
                                >
                                    <div className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:border-red-300 hover:-translate-y-2 overflow-hidden">
                                        {/* Subtle background pattern */}
                                        <div className="absolute inset-0 opacity-5">
                                            <div className="absolute top-4 right-4 w-20 h-20 bg-red-200 rounded-full"></div>
                                            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gray-200 rounded-full"></div>
                                        </div>

                                        <div className="relative z-10 flex flex-col h-full">
                                            {/* Stars and rating */}
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-xl text-yellow-400">
                                                        {testimonial.stars}
                                                    </div>
                                                    <span className="text-sm text-gray-500 font-medium">
                                                        {testimonial.rating}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                                    Verifiziert
                                                </div>
                                            </div>

                                            {/* Quote */}
                                            <div className="flex-1 mb-6">
                                                <blockquote className="text-gray-700 leading-relaxed text-base font-light">
                                                    {testimonial.quote}
                                                </blockquote>
                                            </div>

                                            {/* Author section */}
                                            <div className="pt-6 border-t border-gray-100">
                                                <div className="font-medium text-gray-900 text-sm">
                                                    {testimonial.author}
                                                </div>
                                                <div className="text-gray-400 text-xs">
                                                    {testimonial.company}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </AOSWrapper>
                            ))}
                        </div>

                        {/* Mobile/Tablet Carousel */}
                        <div className="lg:hidden relative max-w-4xl mx-auto">
                            {/* Carousel */}
                            <div
                                ref={carouselRef}
                                className="overflow-hidden rounded-2xl"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                            >
                                <div
                                    className="flex transition-transform duration-300 ease-out"
                                    style={{
                                        transform: `translateX(-${currentSlide * (100 / 3)}%)`,
                                        width: `${testimonials.length * 100}%`
                                    }}
                                >
                                    {testimonials.map((testimonial, index) => (
                                        <div
                                            key={index}
                                            className="w-full flex-shrink-0 px-2"
                                            style={{ width: `${100 / 3}%` }}
                                        >
                                            <div className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:border-red-300 overflow-hidden">
                                                {/* Subtle background pattern */}
                                                <div className="absolute inset-0 opacity-5">
                                                    <div className="absolute top-4 right-4 w-20 h-20 bg-red-200 rounded-full"></div>
                                                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-gray-200 rounded-full"></div>
                                                </div>

                                                <div className="relative z-10 flex flex-col h-full">
                                                    {/* Stars and rating */}
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-xl text-yellow-400">
                                                                {testimonial.stars}
                                                            </div>
                                                            <span className="text-sm text-gray-500 font-medium">
                                                                {testimonial.rating}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                                            Verifiziert
                                                        </div>
                                                    </div>

                                                    {/* Quote */}
                                                    <div className="flex-1 mb-6">
                                                        <blockquote className="text-gray-700 leading-relaxed text-base font-light">
                                                            {testimonial.quote}
                                                        </blockquote>
                                                    </div>

                                                    {/* Author section */}
                                                    <div className="pt-6 border-t border-gray-100">
                                                        <div className="font-medium text-gray-900 text-sm">
                                                            {testimonial.author}
                                                        </div>
                                                        <div className="text-gray-400 text-xs">
                                                            {testimonial.company}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Arrows */}
                            <button
                                onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors duration-300"
                                aria-label="Vorherige Bewertung"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors duration-300"
                                aria-label="Nächste Bewertung"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Lines Indicator */}
                            <div className="flex justify-center mt-6 space-x-1">
                                {[0, 1, 2].map((index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`h-1 transition-all duration-300 ${index === currentSlide
                                            ? 'w-8 bg-red-600'
                                            : 'w-4 bg-gray-300 hover:bg-gray-400'
                                            }`}
                                        aria-label={`Gehe zu Bewertung ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-16 text-center">
                            <div className="inline-flex items-center space-x-8 text-sm text-gray-500">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span>Echte Kunden</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span>Verifizierte Bewertungen</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                    <span>Durchschnitt: 4.8/5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </AOSWrapper>
            </div>
        </section>
        </>
    );
};

export default About;
