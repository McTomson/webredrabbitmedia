"use client";

import { Award, Zap, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { AOSWrapper } from './AnimatedSection';
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";

interface Feature {
    title: string;
    text: string;
}

interface Testimonial {
    stars: string;
    rating: string;
    quote: string;
    author: string;
    company: string;
    avatar: string;
}

interface AboutProps {
    headline?: string;
    text?: string;
    testimonialsHeadline?: string;
    features?: Feature[];
    testimonials?: Testimonial[];
    hideTestimonials?: boolean;
    region?: string;
}

const defaultFeatures: Feature[] = [
    { title: "Individuelles Design", text: "Maßgeschneidert auf Ihre Marke und Zielgruppe." },
    { title: "SEO-Optimierung", text: "Gefunden werden, wo Ihre Kunden suchen." },
    { title: "Performance", text: "Blitzschnelle Ladezeiten für beste Nutzererfahrung." }
];

const defaultTestimonials: Testimonial[] = [
    {
        stars: "★★★★★",
        rating: "5.0",
        quote: "Red Rabbit Media hat unsere Erwartungen übertroffen. Die neue Website ist nicht nur optisch ein Highlight, sondern bringt uns auch messbar mehr Anfragen.",
        author: "Markus Weber",
        company: "Baufirma Weber",
        avatar: ""
    },
    {
        stars: "★★★★★",
        rating: "5.0",
        quote: "Professionell, schnell und immer erreichbar. Die Zusammenarbeit war hervorragend und das Ergebnis spricht für sich.",
        author: "Sarah Leitner",
        company: "Praxis Leitner",
        avatar: ""
    },
    {
        stars: "★★★★★",
        rating: "5.0",
        quote: "Endlich eine Agentur, die mitdenkt! Unsere Online-Sichtbarkeit hat sich deutlich verbessert. Klare Empfehlung.",
        author: "Thomas Huber",
        company: "Huber Installationen",
        avatar: ""
    }
];

const About = ({ headline, text, testimonialsHeadline, features = defaultFeatures, testimonials, hideTestimonials = false, region }: AboutProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [displayTestimonials, setDisplayTestimonials] = useState<Testimonial[]>(testimonials || defaultTestimonials);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        if (testimonials) {
            setDisplayTestimonials(testimonials);
        }
    }, [testimonials]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        if (carouselRef.current) {
            setStartX(e.pageX - carouselRef.current.offsetLeft);
            setScrollLeft(carouselRef.current.scrollLeft);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !carouselRef.current) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        if (carouselRef.current) {
            setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
            setScrollLeft(carouselRef.current.scrollLeft);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !carouselRef.current) return;
        const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    return (
        <section className="py-20 lg:py-32 bg-white relative overflow-hidden" id="about">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-24">
                    {/* Left Side - Content */}
                    <AOSWrapper animation="fade-right">
                        <div className="max-w-xl">
                            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-8 leading-tight">
                                {headline || "Wir erschaffen digitale Erlebnisse, die bleiben."}
                            </h2>
                            <div className="text-gray-600 space-y-6 text-lg font-light leading-relaxed">
                                {text ? (
                                    <p>{text}</p>
                                ) : (
                                    <>
                                        <p>
                                            In einer Welt, die sich ständig wandelt, braucht es Partner, die beständig Qualität liefern.
                                            Seit 2019 begleiten wir Unternehmen dabei, ihre digitale Identität zu finden und zu schärfen.
                                        </p>
                                        <p>
                                            Wir glauben an transparente Kommunikation, pixelgenaues Design und technische Exzellenz.
                                            Keine leeren Versprechungen, sondern messbare Ergebnisse.
                                        </p>
                                    </>
                                )}
                            </div>

                            {features && (
                                <div className="mt-10 space-y-4">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-red-100 transition-colors duration-300">
                                            <div className="bg-white p-2 rounded-lg shadow-sm text-red-600">
                                                {index === 0 ? <Target className="w-5 h-5" /> : index === 1 ? <Zap className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
                                                <p className="text-sm text-gray-500">{feature.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </AOSWrapper>

                    {/* Right Side - Visual */}
                    <AOSWrapper animation="fade-left" delay={300}>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden relative">
                                <Image
                                    src={region === "Kärnten" ? "/images/webdesign-agentur-kaernten-team.jpg" : "/images/pexels-fauxels-3184395.jpg"}
                                    alt={region === "Kärnten" ? "Red Rabbit Media Team - Webdesign Agentur für Kärnten" : "Red Rabbit Media Team"}
                                    fill
                                    className="object-cover object-right"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                                    <div className="text-center relative py-8">
                                        <p className="text-white font-medium text-xl drop-shadow-md">
                                            Persönlich. Transparent. Zuverlässig.
                                        </p>
                                        <p className="text-white/90 text-base mt-3 drop-shadow-md">
                                            Über 800 zufriedene Kunden. Seit 2019.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AOSWrapper>
                </div>

                {/* Testimonials - Completely redesigned with animations */}
                {!hideTestimonials && (
                    <AOSWrapper animation="fade-up" delay={600}>
                        <div className="mt-60">
                            <h3 className="text-3xl lg:text-4xl font-light text-center mb-6 text-gray-900">
                                {testimonialsHeadline || "Was unsere Kunden sagen"}
                            </h3>
                            <p className="text-xl text-gray-600 text-center mb-20 max-w-2xl mx-auto">
                                Echte Erfahrungen von Kunden, die mit uns erfolgreich geworden sind
                            </p>

                            {/* Desktop Grid Layout */}
                            <div className="hidden lg:grid md:grid-cols-3 gap-8">
                                {displayTestimonials.map((testimonial, index) => (
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
                                            width: `${displayTestimonials.length * 100}%`
                                        }}
                                    >
                                        {displayTestimonials.map((testimonial, index) => (
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
                )}
            </div>
        </section>
    );
};

export default About;
