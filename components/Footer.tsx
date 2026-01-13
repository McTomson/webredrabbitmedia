"use client";

import { MapPin, Phone, Mail, QrCode, X, UserPlus } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AOSWrapper } from './AnimatedSection';

const Footer = () => {
    const [showQRCode, setShowQRCode] = useState(false);
    const currentYear = new Date().getFullYear();

    const handleSaveContact = () => {
        // Create a link element to download the VCF file
        const link = document.createElement('a');
        link.href = '/images/red_rabbit_contact.vcf';
        link.download = 'Red_Rabbit_Media_Kontakte.vcf';
        link.click();
    };

    return (
        <>
            <footer className="bg-gray-900 text-white py-16" id="footer" role="contentinfo">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {/* Company Info */}
                        <div className="lg:col-span-2">
                            <AOSWrapper animation="fade-up" delay={100}>
                                <div className="flex items-center space-x-3 mb-6">
                                    <Image
                                        src="/images/logo.webp"
                                        alt="Red Rabbit Media Logo"
                                        width={32}
                                        height={32}
                                        className="h-8 w-auto"
                                    />
                                    <span className="text-xl font-light">Red Rabbit Media</span>
                                </div>
                                <p className="text-gray-400 mb-6 max-w-md">
                                    Dein Partner für moderne, DSGVO-konforme Websites.
                                    Spezialisiert auf digitale Dienstleistungen mit über 15 Jahren Erfahrung.
                                </p>

                                {/* Contact Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="w-4 h-4 text-red-600" />
                                        <span className="text-sm">Grabnergasse 8/8, 1060 Wien, Österreich</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Mail className="w-4 h-4 text-red-600" />
                                        <a href="mailto:office@redrabbit.media" className="text-sm hover:text-red-400 transition-colors">
                                            office@redrabbit.media
                                        </a>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Phone className="w-4 h-4 text-red-600" />
                                        <a href="tel:+436769000955" className="text-sm hover:text-red-400 transition-colors">
                                            +43 676 9000 955
                                        </a>
                                    </div>
                                </div>
                            </AOSWrapper>
                        </div>

                        {/* Services & Legal Combined for Mobile/Tablet */}
                        <div className="md:col-span-2 lg:col-span-1">
                            <AOSWrapper animation="fade-up" delay={200}>
                                <h4 className="text-lg font-medium mb-6">Unsere Leistungen</h4>
                                <ul className="space-y-3 text-gray-400 mb-8 lg:mb-0">
                                    <li>Website-Erstellung</li>
                                    <li>DSGVO-Compliance</li>
                                    <li>Mobile Optimierung</li>
                                    <li>SEO-Grundlagen</li>
                                    <li>Cookie-Banner</li>
                                    <li>Kontaktformulare</li>
                                    <li>Google Maps Integration</li>
                                    <li>QR-Code Service</li>
                                </ul>
                            </AOSWrapper>
                        </div>

                        {/* Quick Links & QR */}
                        <div className="md:col-span-2 lg:col-span-1">
                            <AOSWrapper animation="fade-up" delay={300}>
                                <h4 className="text-lg font-medium mb-6">Rechtliches</h4>
                                <ul className="space-y-3 text-gray-400 mb-6">
                                    <li>
                                        <Link href="/impressum" className="hover:text-red-400 transition-colors">Impressum</Link>
                                    </li>
                                    <li>
                                        <Link href="/datenschutz" className="hover:text-red-400 transition-colors">Datenschutz</Link>
                                    </li>
                                    <li>
                                        <Link href="/agb" className="hover:text-red-400 transition-colors">AGB</Link>
                                    </li>
                                    <li>
                                        <Link href="/cookie-einstellungen" className="hover:text-red-400 transition-colors">Cookie-Einstellungen</Link>
                                    </li>
                                </ul>

                                {/* QR Code */}
                                <div>
                                    <h5 className="font-medium mb-2 text-sm">QR-Code</h5>
                                    <button
                                        onClick={() => setShowQRCode(true)}
                                        className="px-4 py-2 border border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-600 transition-all duration-300"
                                    >
                                        <QrCode className="w-4 h-4 mr-2 inline" />
                                        QR-Code anzeigen
                                    </button>
                                </div>
                            </AOSWrapper>
                        </div>
                    </div>



                    {/* SEO Links Section */}
                    <AOSWrapper animation="fade-up" delay={350}>
                        <div className="border-t border-gray-800 mt-12 pt-8 pb-4">
                            <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-y-2 gap-x-1 text-xs text-gray-500 text-center md:text-left">
                                <span className="font-medium text-gray-400 mr-2">Wir sind aktiv in ganz Österreich:</span>

                                {/* Cities */}
                                <Link href="/webdesign-wien" className="hover:text-red-400 transition-colors">Wien</Link>
                                <span className="hidden md:inline mx-1">·</span>
                                <Link href="/webdesign-graz" className="hover:text-red-400 transition-colors">Graz</Link>
                                <span className="hidden md:inline mx-1">·</span>
                                <Link href="/webdesign-linz" className="hover:text-red-400 transition-colors">Linz</Link>
                                <span className="hidden md:inline mx-1">·</span>
                                <Link href="/webdesign-salzburg" className="hover:text-red-400 transition-colors">Salzburg</Link>
                                <span className="hidden md:inline mx-1">·</span>
                                <Link href="/webdesign-innsbruck" className="hover:text-red-400 transition-colors">Innsbruck</Link>
                                <span className="hidden md:inline mx-1">·</span>
                                <Link href="/webdesign-klagenfurt" className="hover:text-red-400 transition-colors">Klagenfurt</Link>
                                <span className="hidden md:inline mx-1">·</span>
                                <Link href="/webdesign-st-poelten" className="hover:text-red-400 transition-colors">St. Pölten</Link>
                                <span className="hidden md:inline mx-1">·</span>
                                <Link href="/webdesign-bregenz" className="hover:text-red-400 transition-colors">Bregenz</Link>
                                <span className="hidden md:inline mx-1">·</span>
                                <Link href="/webdesign-eisenstadt" className="hover:text-red-400 transition-colors">Eisenstadt</Link>

                                {/* Separator */}
                                <span className="hidden md:inline mx-3 text-gray-600">|</span>
                                <span className="md:hidden w-full h-1"></span>

                                {/* SEO Keywords */}
                                <Link href="/" className="hover:text-red-400 transition-colors">Website erstellen lassen</Link>
                                <span className="hidden md:inline mx-1">·</span>
                                <Link href="/" className="hover:text-red-400 transition-colors">Homepage erstellen lassen</Link>
                                <span className="hidden md:inline mx-1">·</span>
                                <Link href="/tipps/was-kostet-eine-website" className="hover:text-red-400 transition-colors">Website Kosten</Link>
                            </div>
                        </div>
                    </AOSWrapper>

                    {/* Bottom Bar */}
                    <AOSWrapper animation="fade-up" delay={400}>
                        <div className="border-t border-gray-800 mt-4 pt-8 flex flex-col md:flex-row items-center justify-between">
                            <p className="text-sm text-gray-400">
                                © {currentYear} Red Rabbit GmbH. Alle Rechte vorbehalten.
                            </p>
                            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                <span className="text-sm text-gray-400">Entwickelt in Wien</span>
                                <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
                                <div className="w-6 h-4 bg-white rounded-sm"></div>
                                <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
                            </div>
                        </div>
                    </AOSWrapper>
                </div>
            </footer >

            {/* QR Code Modal */}
            {
                showQRCode && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 text-center">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Website QR-Code</h3>
                                <button
                                    onClick={() => setShowQRCode(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Schließen"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* QR Code */}
                            <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4 p-2 relative h-48">
                                <Image
                                    src="/images/red_rabbit_contact_qr.png"
                                    alt="Red Rabbit Media QR Code"
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                Scanne diesen Code für direkten Zugriff auf unsere Website
                            </p>

                            {/* Contact Save Button */}
                            <button
                                onClick={handleSaveContact}
                                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors mb-3 flex items-center justify-center gap-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                Kontaktdaten speichern
                            </button>

                            <button
                                onClick={() => setShowQRCode(false)}
                                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Schließen
                            </button>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default Footer;
