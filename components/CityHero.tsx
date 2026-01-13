"use client";

import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { City } from '../app/[slug]/cities';

interface CityHeroProps {
    onFormOpen: () => void;
    city: City; // Uses the City interface from cities.ts
}

const CityHero = ({ onFormOpen, city }: CityHeroProps) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="min-h-screen bg-white relative overflow-hidden pt-20">
            {/* Animated Background Shapes - Different colors/timing than Regional for variety */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 right-20 w-40 h-40 bg-blue-100 rounded-full opacity-20" // Blue shift for cities
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 20, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-40 left-10 w-24 h-24 bg-red-100 rounded-full opacity-30"
                    animate={{
                        x: [0, 20, 0],
                        y: [0, -15, 0],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/dashboard.webp"
                    alt={`Webdesign ${city.name} - Red Rabbit Media`}
                    fill
                    className="w-full h-full object-cover opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-white/90"></div>
            </div>

            {/* Main Hero Content */}
            <div className="max-w-7xl mx-auto px-8 pt-20 pb-16 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[70vh]">

                    {/* Content Side (Left on Desktop for variety vs Regional) */}
                    <div className="space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-red-600 font-medium tracking-wide section-subtitle uppercase text-sm md:text-base mb-4">
                                Webdesign Agentur für {city.name}
                            </h2>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight">
                                <motion.span className="block">
                                    Ihre Website in
                                </motion.span>
                                <motion.span className="font-bold text-gray-900 block mt-1">
                                    {city.name}.
                                </motion.span>

                                <motion.div
                                    className="mt-8 space-y-3 p-6 bg-gray-50 rounded-xl border border-gray-100 inline-block text-left w-full md:w-auto"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Angebot</span>
                                    </div>
                                    <div className="text-2xl font-semibold text-gray-900">Premium Website</div>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl font-bold text-red-600">790 €</span>
                                        <span className="text-xl text-gray-400 line-through decoration-1">2.800 €</span>
                                    </div>
                                    <div className="text-sm text-gray-600 border-t border-gray-200 pt-2 mt-1">
                                        Exklusiv für Unternehmen in {city.name}
                                    </div>
                                </motion.div>
                            </h1>
                        </motion.div>

                        <motion.p
                            className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            {city.description} Wir bringen Ihr Unternehmen in {city.name} digital nach vorne.
                            Ohne Baukasten, ohne Abo-Falle.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 }}
                        >
                            <button
                                onClick={onFormOpen}
                                className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2"
                            >
                                Jetzt Angebot anfragen
                                <ArrowDown className="w-4 h-4" />
                            </button>
                            <Link
                                href={`/webdesign-${city.region.toLowerCase()}`}
                                className="w-full sm:w-auto px-6 py-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center"
                            >
                                Mehr zu {city.region}
                            </Link>
                        </motion.div>

                        <div className="pt-6 flex justify-center lg:justify-start gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> 100% DSGVO-konform
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Inklusive SEO-Start
                            </div>
                        </div>
                    </div>

                    {/* Image/Visual Side */}
                    <div className="hidden lg:block order-1 lg:order-2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-red-100 to-blue-50 rounded-2xl blur-2xl opacity-60"></div>
                            <Image
                                src="/images/hero-portrait.jpg" // Or specific city image if available
                                alt={`Webdesign in ${city.name}`}
                                width={600}
                                height={700}
                                className="relative rounded-2xl shadow-2xl z-10 w-full object-cover max-h-[700px]"
                                sizes="(max-width: 1024px) 100vw, 50vw" // Fix missing sizes warning
                                priority // Hero images should be priority
                            />

                            {/* Floating Badge */}
                            <motion.div
                                className="absolute -bottom-10 -left-10 bg-white p-6 rounded-xl shadow-xl z-20 max-w-xs"
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <p className="font-semibold text-gray-900 text-lg mb-1">Ihr Partner in {city.name}</p>
                                <p className="text-gray-600 text-sm">
                                    Wir kennen den Markt in {city.name} und {city.region}.
                                    {city.localFacts[0]}? Wir wissen wie man das nutzt.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <motion.div
                className="fixed pointer-events-none z-50 rounded-full mix-blend-multiply blur-xl opacity-40 bg-blue-400 w-8 h-8"
                style={{ left: mousePosition.x, top: mousePosition.y }}
            />
        </section>
    );
};

export default CityHero;
