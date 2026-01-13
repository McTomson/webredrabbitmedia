"use client";

import { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Container from '@/components/Container';
import { Mail, Phone, MapPin, Linkedin, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#fafafa] pt-20">
            {/* Contact Form Modal */}
            <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

            <main className="py-12 md:py-20">
                <Container>
                    <div className="max-w-6xl mx-auto">
                        {/* Breadcrumbs */}
                        <div className="mb-8">
                            <Breadcrumbs items={[
                                { name: 'Home', url: '/' },
                                { name: 'Kontakt', url: '/kontakt' }
                            ]} />
                        </div>

                        {/* Header */}
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-6xl font-bold text-[#141414] mb-6">
                                Kontaktieren Sie uns
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                Wir bauen nicht nur Websites, wir schaffen digitale Werte.
                                <br />
                                Lernen Sie das Team kennen oder starten Sie direkt Ihr Projekt.
                            </p>
                        </div>

                        {/* Contact Grid */}
                        <div className="grid lg:grid-cols-2 gap-12 items-start mb-24">
                            {/* Left: Contact Info */}
                            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-soft border border-gray-100">
                                <h3 className="text-2xl font-bold text-[#141414] mb-8">Direkter Draht</h3>

                                <div className="space-y-8">
                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 text-[#dc2626]">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Telefon & WhatsApp</p>
                                            <a href="tel:+436769000955" className="text-xl font-medium text-[#141414] hover:text-[#dc2626] transition-colors block mb-1">
                                                +43 676 9000 955
                                            </a>
                                            <p className="text-sm text-gray-500">Mo-Fr, 09:00 - 18:00 Uhr</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 text-[#dc2626]">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">E-Mail</p>
                                            <a href="mailto:office@redrabbit.media" className="text-xl font-medium text-[#141414] hover:text-[#dc2626] transition-colors">
                                                office@redrabbit.media
                                            </a>
                                            <p className="text-sm text-gray-500 mt-1">Antwort innerhalb von 24h</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 text-[#dc2626]">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Büro Wien</p>
                                            <address className="not-italic text-lg text-gray-700 leading-relaxed">
                                                Grabnergasse 8<br />
                                                1060 Wien<br />
                                                Österreich
                                            </address>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-8 border-t border-gray-100">
                                    <button
                                        onClick={() => setIsFormOpen(true)}
                                        className="w-full btn-primary py-4 text-center justify-center group"
                                    >
                                        <span className="font-bold text-lg">Projekt-Anfrage starten</span>
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <p className="text-xs text-center text-gray-400 mt-4">
                                        100% kostenlos & unverbindlich. Antwort in max. 24h.
                                    </p>
                                </div>
                            </div>

                            {/* Right: Map */}
                            <div className="h-full min-h-[400px] bg-gray-100 rounded-2xl overflow-hidden shadow-soft border border-gray-100 relative">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.431298539656!2d16.35084931267468!3d48.19234857112003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d07851963955d%3A0xc351918456f43e5!2sGrabnergasse%208%2C%201060%20Wien!5e0!3m2!1sde!2sat!4v1710326400000!5m2!1sde!2sat"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, minHeight: '500px' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition-all duration-700"
                                ></iframe>
                            </div>
                        </div>

                        {/* Team Section (Trust) */}
                        <div className="mb-24">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-[#141414] mb-4">Ihr Experten-Team</h2>
                                <p className="text-gray-600">
                                    Keine anonyme Agentur. Wir stehen persönlich für die Qualität unserer Arbeit.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Thomas */}
                                <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 flex flex-col items-center text-center hover:shadow-medium transition-shadow">
                                    <div className="w-32 h-32 rounded-full bg-gray-100 mb-6 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                                        {/* Placeholder for Image */}
                                        <span className="text-3xl font-bold text-gray-300">TU</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#141414] mb-1">Thomas Uhlir MBA</h3>
                                    <p className="text-[#dc2626] font-medium text-sm uppercase tracking-widest mb-4">Gründer & Strategie</p>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        "Eine Website muss Geld verdienen, nicht nur schön aussehen. Mein Fokus liegt auf messbaren Ergebnissen für Ihr Unternehmen."
                                    </p>
                                    <a href="https://www.linkedin.com/in/thomasuhlir/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#0077b5] transition-colors">
                                        <Linkedin size={20} />
                                        <span className="text-sm font-medium">LinkedIn Profil</span>
                                    </a>
                                </div>

                                {/* Dmitry */}
                                <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 flex flex-col items-center text-center hover:shadow-medium transition-shadow">
                                    <div className="w-32 h-32 rounded-full bg-blue-50 mb-6 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm relative">
                                        <Image
                                            src="/images/dmitry-pashlov.jpg"
                                            alt="Dmitry Pashlov"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#141414] mb-1">Dmitry Pashlov</h3>
                                    <p className="text-[#dc2626] font-medium text-sm uppercase tracking-widest mb-4">Tech Lead & Development</p>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        "Performance ist kein Zufall. Ich sorge dafür, dass Ihre Website technisch perfekt läuft und von Google geliebt wird."
                                    </p>
                                    <a href="https://www.linkedin.com/in/dmitrypashlov" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#0077b5] transition-colors">
                                        <Linkedin size={20} />
                                        <span className="text-sm font-medium">LinkedIn Profil</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </Container>
            </main>
        </div>
    );
}
