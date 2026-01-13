"use client";

import { Mail, Phone, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AOSWrapper } from './AnimatedSection';

interface ContactProps {
    onFormOpen: () => void;
}

const Contact = ({ onFormOpen }: ContactProps) => {
    return (
        <section id="contact" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Side - Content */}
                    <div className="space-y-8">
                        <AOSWrapper animation="fade-left" delay={200}>
                            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
                                Bereit für deine
                                <br />
                                neue Website?
                            </h2>
                        </AOSWrapper>

                        <AOSWrapper animation="fade-left" delay={300}>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Starte jetzt mit deinem kostenlosen Website-Vorschlag.
                                Kein Risiko, kein Aufwand – nur Ergebnisse.
                            </p>
                        </AOSWrapper>

                        {/* New Content */}
                        <AOSWrapper animation="fade-left" delay={400}>
                            <div className="space-y-6">
                                <p className="text-lg text-gray-700 font-medium">
                                    Du hast nichts zu verlieren – aber eine starke Website zu gewinnen.
                                </p>

                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-800 text-sm">
                                        Aktuell bekommst du deinen maßgeschneiderten Website-Vorschlag zum Sonderpreis von 790 € statt 2.800 € – aber nur, wenn du jetzt anfragst.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-red-600" />
                                        <span className="text-gray-700">Kein Risiko.</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-red-600" />
                                        <span className="text-gray-700">Kein Aufwand.</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-red-600" />
                                        <span className="text-gray-700">Deine Website ist in nur 7 Tagen bereit.</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm">
                                    Wir machen den ersten Schritt – du musst nur noch klicken.
                                </p>
                            </div>
                        </AOSWrapper>

                        <AOSWrapper animation="fade-left" delay={500}>
                            <button
                                onClick={onFormOpen}
                                className="group inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white hover:bg-red-700 transition-all duration-500"
                            >
                                <span className="text-lg">Jetzt unverbindlich starten</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
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
                                    className="object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <div className="text-center relative py-8">
                                        <motion.div
                                            className="relative w-56 h-56 mx-auto mb-8 drop-shadow-2xl"
                                            animate={{
                                                y: [0, -15, 0],
                                                rotate: [0, 3, -3, 0],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <Image
                                                src="/images/logo.png"
                                                alt="Red Rabbit Media"
                                                fill
                                                className="object-contain brightness-0 invert"
                                            />
                                        </motion.div>
                                        <motion.div
                                            className="mb-3"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3, duration: 0.8 }}
                                        >
                                            <p className="text-white text-3xl font-semibold mb-1 drop-shadow-lg tracking-tight">red rabbit media</p>
                                        </motion.div>
                                        <motion.p
                                            className="text-white font-medium text-xl drop-shadow-md"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.4, duration: 0.8 }}
                                        >
                                            Persönlich. Transparent. Zuverlässig.
                                        </motion.p>
                                        <motion.p
                                            className="text-white/90 text-base mt-3 drop-shadow-md"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.5, duration: 0.8 }}
                                        >
                                            Über 800 zufriedene Kunden. 15 Jahre Erfahrung.
                                        </motion.p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AOSWrapper>
                </div>

                {/* Alternative Contact Methods */}
                <AOSWrapper animation="fade-up" delay={600}>
                    <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="font-medium text-gray-900 mb-2">Telefon</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Lieber direktes Gespräch?<br />
                                Ruf uns an!
                            </p>
                            <button
                                onClick={() => window.open('tel:+436769000955')}
                                className="px-4 py-2 border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-600 transition-all duration-300"
                            >
                                Jetzt Anrufen
                            </button>
                        </div>

                        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="font-medium text-gray-900 mb-2">WhatsApp</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Schnell und unkompliziert per WhatsApp
                            </p>
                            <button
                                onClick={() => window.open('https://wa.me/436769000955', '_blank')}
                                className="px-4 py-2 border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-600 transition-all duration-300"
                            >
                                WhatsApp öffnen
                            </button>
                        </div>

                        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="font-medium text-gray-900 mb-2">E-Mail</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Schreib uns eine E-Mail mit deinen Fragen
                            </p>
                            <button
                                onClick={() => window.open('mailto:office@redrabbit.media')}
                                className="px-4 py-2 border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-600 transition-all duration-300"
                            >
                                E-Mail senden
                            </button>
                        </div>
                    </div>
                </AOSWrapper>
            </div>
        </section>
    );
};

export default Contact;
