"use client";

import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface HeroProps {
    onFormOpen: () => void;
}

const Hero = ({ onFormOpen }: HeroProps) => {
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
            {/* Animated Background Shapes */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-20 w-32 h-32 bg-red-100 rounded-full opacity-30"
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
                <motion.div
                    className="absolute top-40 right-32 w-24 h-24 bg-red-200 rounded-full opacity-20"
                    animate={{
                        x: [0, -25, 0],
                        y: [0, 15, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-40 left-1/3 w-20 h-20 bg-red-300 rounded-full opacity-25"
                    animate={{
                        x: [0, 20, 0],
                        y: [0, -10, 0],
                        rotate: [0, -180, -360],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/dashboard.webp" // USING DASHBOARD AS REQUESTED
                    alt="Red Rabbit Media Background"
                    fill
                    className="w-full h-full object-cover opacity-50"
                    priority
                />
                <div className="absolute inset-0 bg-white/85"></div>
            </div>

            {/* Main Hero Content */}
            <div className="max-w-7xl mx-auto px-8 pt-20 pb-16 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[70vh]">
                    {/* Left Side - Floating Red Logo */}
                    <div className="hidden lg:flex justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-center lg:text-right"
                        >
                            <motion.div
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="mb-8"
                            >
                                <Image
                                    src="/images/logo.webp"
                                    alt="Red Rabbit Media Logo"
                                    width={280}
                                    height={280}
                                    className="w-64 h-auto"
                                />
                            </motion.div>
                            <motion.h2
                                className="text-3xl font-light text-gray-700"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                Red Rabbit Media
                            </motion.h2>
                            <motion.p
                                className="text-gray-500 mt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                            >
                                Webdesign & digitale Dienstleistungen
                            </motion.p>
                        </motion.div>
                    </div>

                    {/* Right Side - Main Content */}
                    <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative"
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight">
                                <motion.span
                                    className="block"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    Keine Meetings.
                                </motion.span>
                                <motion.span
                                    className="block"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                >
                                    Kein Aufwand.
                                </motion.span>
                                <motion.span
                                    className="text-red-600 font-medium block"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    whileHover={{ scale: 1.05, originX: 0 }}
                                >
                                    Nur Ergebnisse.
                                </motion.span>
                                <motion.span
                                    className="text-xl text-gray-600 font-light block mt-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 1.0 }}
                                >
                                    Wir bauen deine Website <span className="font-medium text-gray-900">ab 790 Euro</span> - stressfrei.
                                </motion.span>
                            </h1>
                        </motion.div>

                        <motion.p
                            className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                        >
                            Du füllst nur das Formular aus – wir übernehmen den Rest.
                            Zahle nur, wenn dir der Vorschlag gefällt. Kein Aufwand. Kein Risiko.
                        </motion.p>

                        {/* Trust / Reviews */}
                        <motion.div
                            className="flex items-center justify-center lg:justify-start gap-4 py-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.3 }}
                        >
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="w-5 h-5 text-yellow-500 fill-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                ))}
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                                <span className="font-bold">4.8/5</span> • <span className="underline decoration-gray-300 underline-offset-4">315 Bewertungen</span>
                            </div>
                        </motion.div>

                        <div className="flex justify-center lg:justify-start">
                            <motion.button
                                onClick={onFormOpen}
                                className="group flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-red-600 text-white hover:bg-red-700 transition-all duration-500 rounded-lg shadow-lg shadow-red-500/30"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.4 }}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 15px 30px rgba(220, 38, 38, 0.4)"
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-lg font-medium">Jetzt kostenlos starten</span>
                                <motion.div
                                    animate={{ y: [0, 5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <ArrowDown className="w-5 h-5" />
                                </motion.div>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

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

export default Hero;
