"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import Link from 'next/link';

interface RegionalHeroProps {
    onFormOpen: () => void;
    data: {
        region: string;
        mainCity: string;
        mainCitySlug: string;
        population: string;
        cities: string[];
    };
}

const RegionalHero = ({ onFormOpen, data }: RegionalHeroProps) => {
    // Helper to generate slug from city name
    const getSlug = (city: string) => {
        const slug = city.toLowerCase()
            .replace('ü', 'ue')
            .replace('ö', 'oe')
            .replace('ä', 'ae')
            .replace('ß', 'ss')
            .replace(' ', '-');
        return `/webdesign-${slug}`;
    };

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const heroCities = data.cities?.slice(0, 4) || ['Linz', 'Wels', 'Steyr', 'Gmunden'];

    return (
        <section className="h-screen bg-slate-900 relative overflow-hidden flex flex-col justify-center">
            {/* Animated Background Shapes - Made subtler for dark theme */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full opacity-5"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

            </div>

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={data.region === "Oberösterreich"
                        ? "/images/ooe/hero/webdesign-oberoesterreich-see-schiff-v2.png"
                        : data.region === "Niederösterreich"
                            ? "/images/noe/hero/webdesign-niederoesterreich-hero.png"
                            : data.region === "Kärnten"
                                ? "/images/webdesign-kaernten-woerthersee.png"
                                : data.region === "Steiermark"
                                    ? "/images/webdesign-steiermark-hero.jpg"
                                    : "/images/dashboard.webp"
                    }
                    alt={data.region === "Oberösterreich"
                        ? "Webdesign Oberösterreich - See mit Boot im Nebel"
                        : data.region === "Niederösterreich"
                            ? "Webdesign Niederösterreich – Landschaft mit Dorf und Bergen"
                            : data.region === "Kärnten"
                                ? "Webdesign Kärnten - Wörthersee am Morgen mit Schiff"
                                : data.region === "Steiermark"
                                    ? "Webdesign Steiermark - Malerische Hügellandschaft im Sonnenaufgang"
                                    : `Red Rabbit Media Webdesign ${data.region}`
                    }
                    fill
                    className="w-full h-full object-cover object-bottom"
                    priority
                />
                {/* Subtle dark gradient for better text readability */}
                <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black/60 to-transparent"></div>
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Main Hero Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 w-full mb-0 md:mb-12">
                <div className="text-center max-w-5xl mx-auto">

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-thin text-white leading-[1.1] mb-6 md:mb-10 tracking-wide drop-shadow-xl">
                        <motion.span
                            className="block"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                        >
                            DIGITAL.
                        </motion.span>
                        <motion.span
                            className="block font-light"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                        >
                            {data.region.toUpperCase()}.
                        </motion.span>
                    </h1>

                    <motion.p
                        className="text-base sm:text-lg md:text-2xl text-gray-200 font-extralight mb-10 md:mb-16 max-w-2xl mx-auto drop-shadow-md tracking-wider px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5, duration: 1.5 }}
                    >
                        Webauftritte, die begeistern und Conversions erzielen.<br />
                        <span className="text-gray-400 text-sm md:text-lg block mt-2 md:mt-3 font-light">Keine Spielereien. Nur Ergebnisse.</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, delay: 3.5 }}
                        className="flex justify-center"
                    >
                        <button
                            onClick={onFormOpen}
                            className="group flex items-center gap-3 md:gap-4 px-8 py-3 md:px-12 md:py-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white hover:text-gray-900 transition-all duration-700 rounded-sm"
                        >
                            <span className="text-sm md:text-lg tracking-[0.2em] font-light">JETZT STARTEN</span>
                        </button>
                    </motion.div>
                </div>
            </div>
            <motion.div
                className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-100 py-4 z-20 hidden md:block"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
            >
                <div className="max-w-7xl mx-auto px-8 flex justify-between items-center text-xs md:text-sm text-gray-500 uppercase tracking-widest font-medium">
                    <div className="flex gap-8">
                        {heroCities.map((city) => (
                            <Link
                                key={city}
                                href={getSlug(city)}
                                prefetch={false}
                                className="hover:text-red-600 transition-all duration-300 hover:underline decoration-red-600/30 underline-offset-4"
                            >
                                {city}
                            </Link>
                        ))}
                    </div>
                    <div className="flex gap-8">
                        <span className="text-gray-900">AB 790 €</span>
                        <span className="text-gray-900">PREMIUM WEBDESIGN</span>
                    </div>
                </div>
            </motion.div>

            {/* Mouse Trail Effect */}
            <motion.div
                className="fixed pointer-events-none z-50 mix-blend-multiply"
                style={{
                    left: mousePosition.x - 10,
                    top: mousePosition.y - 10,
                }}
                animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 0.5, 0],
                }}
                transition={{
                    duration: 1.5,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatDelay: 0.1
                }}
            >
                <div className="w-6 h-6 bg-red-400/30 rounded-full blur-md"></div>
            </motion.div>
        </section>
    );
};

export default RegionalHero;
