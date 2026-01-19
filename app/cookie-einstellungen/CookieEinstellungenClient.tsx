"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Cookie, Check, Settings } from 'lucide-react';
import Link from 'next/link';
import { AOSWrapper } from '@/components/AnimatedSection';
import Image from 'next/image';

interface ConsentData {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    timestamp: string;
}

declare global {
    interface Window {
        gtag: (...args: Array<string | object | Date>) => void;
    }
}

export default function CookieEinstellungen() {
    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: true,
        marketing: true
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load current preferences
        const cookieConsent = localStorage.getItem('redrabbit-cookie-consent');
        if (cookieConsent) {
            const consent = JSON.parse(cookieConsent);
            setPreferences({
                necessary: true, // Always true
                analytics: consent.analytics || false,
                marketing: consent.marketing || false
            });
        }
    }, []);

    const updateGTMConsent = (consent: ConsentData) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': consent.analytics ? 'granted' : 'denied',
                'ad_storage': consent.marketing ? 'granted' : 'denied'
            });
        }
    };

    const savePreferences = () => {
        const consent = {
            ...preferences,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('redrabbit-cookie-consent', JSON.stringify(consent));
        updateGTMConsent(consent);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const acceptAll = () => {
        const newPrefs = {
            necessary: true,
            analytics: true,
            marketing: true
        };
        setPreferences(newPrefs);
        const consent = {
            ...newPrefs,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('redrabbit-cookie-consent', JSON.stringify(consent));
        updateGTMConsent(consent);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const rejectAll = () => {
        const newPrefs = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        setPreferences(newPrefs);
        const consent = {
            ...newPrefs,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('redrabbit-cookie-consent', JSON.stringify(consent));
        updateGTMConsent(consent);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-600">Zurück zur Startseite</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Image
                                src="/images/logo.webp"
                                alt="Red Rabbit Media"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="py-16">
                <div className="max-w-4xl mx-auto px-8">
                    <AOSWrapper animation="fade-up" delay={100}>
                        <div className="text-center mb-16">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Cookie className="w-8 h-8 text-red-600" />
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
                                Cookie-Einstellungen
                            </h1>
                            <p className="text-xl text-gray-600">
                                Verwalte deine Datenschutz-Präferenzen
                            </p>
                        </div>
                    </AOSWrapper>

                    {/* Success Message */}
                    {saved && (
                        <AOSWrapper animation="fade-down" delay={0}>
                            <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4">
                                <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium text-green-900">Einstellungen gespeichert!</h3>
                                    <p className="text-sm text-green-700">Deine Cookie-Präferenzen wurden erfolgreich aktualisiert.</p>
                                </div>
                            </div>
                        </AOSWrapper>
                    )}

                    <div className="space-y-8">
                        {/* Necessary Cookies */}
                        <AOSWrapper animation="fade-up" delay={200}>
                            <section className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-light text-gray-900 mb-2">
                                            🔒 Technisch notwendige Cookies
                                        </h2>
                                        <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                                            Immer aktiv
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 text-gray-700">
                                    <p>
                                        Diese Cookies sind für die grundlegenden Funktionen der Website erforderlich und können nicht deaktiviert werden.
                                        Sie werden normalerweise nur als Reaktion auf von dir durchgeführte Aktionen gesetzt, wie z.B.:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Speicherung deiner Cookie-Einstellungen</li>
                                        <li>Session-Management</li>
                                        <li>Sicherheitsfunktionen</li>
                                        <li>Formular-Funktionalität</li>
                                    </ul>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Analytics Cookies */}
                        <AOSWrapper animation="fade-up" delay={300}>
                            <section className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-light text-gray-900 mb-4">
                                            📊 Analytics-Cookies
                                        </h2>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600 transition-colors"></div>
                                    </label>
                                </div>
                                <div className="space-y-4 text-gray-700">
                                    <p>
                                        Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren,
                                        indem sie Informationen anonym sammeln und melden.
                                    </p>
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <h3 className="font-medium text-gray-900 mb-2">Google Analytics 4</h3>
                                        <p className="text-sm mb-2">
                                            <strong>Anbieter:</strong> Google Ireland Limited
                                        </p>
                                        <p className="text-sm mb-2">
                                            <strong>Zweck:</strong> Analyse des Nutzerverhaltens, Verbesserung der Website
                                        </p>
                                        <p className="text-sm">
                                            <strong>Speicherdauer:</strong> Bis zu 14 Monate
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Marketing Cookies */}
                        <AOSWrapper animation="fade-up" delay={400}>
                            <section className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-light text-gray-900 mb-4">
                                            🎯 Marketing-Cookies
                                        </h2>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.marketing}
                                            onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600 transition-colors"></div>
                                    </label>
                                </div>
                                <div className="space-y-4 text-gray-700">
                                    <p>
                                        Diese Cookies werden verwendet, um dir relevante Werbung und Inhalte zu zeigen
                                        und die Effektivität unserer Werbekampagnen zu messen.
                                    </p>
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <h3 className="font-medium text-gray-900 mb-2">Meta Pixel (Facebook)</h3>
                                        <p className="text-sm mb-2">
                                            <strong>Anbieter:</strong> Meta Platforms Ireland Ltd.
                                        </p>
                                        <p className="text-sm mb-2">
                                            <strong>Zweck:</strong> Conversion-Tracking, Remarketing
                                        </p>
                                        <p className="text-sm">
                                            <strong>Speicherdauer:</strong> Bis zu 90 Tage
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Action Buttons */}
                        <AOSWrapper animation="fade-up" delay={500}>
                            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={rejectAll}
                                        className="px-6 py-3 border border-gray-300 rounded-none text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                                    >
                                        Alle ablehnen
                                    </button>
                                    <button
                                        onClick={savePreferences}
                                        className="px-6 py-3 bg-gray-900 text-white rounded-none hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        <Settings className="w-5 h-5" />
                                        Auswahl speichern
                                    </button>
                                    <button
                                        onClick={acceptAll}
                                        className="px-6 py-3 bg-red-600 text-white rounded-none hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-5 h-5" />
                                        Alle akzeptieren
                                    </button>
                                </div>
                            </div>
                        </AOSWrapper>

                        {/* Legal Info */}
                        <AOSWrapper animation="fade-up" delay={600}>
                            <div className="text-center text-sm text-gray-600">
                                <p>
                                    Weitere Informationen findest du in unserer{' '}
                                    <Link href="/datenschutz" className="text-red-600 hover:underline font-medium">
                                        Datenschutzerklärung
                                    </Link>
                                    .
                                </p>
                                <p className="mt-2">
                                    Du kannst deine Einstellungen jederzeit auf dieser Seite ändern.
                                </p>
                            </div>
                        </AOSWrapper>
                    </div>
                </div>
            </main>
        </div>
    );
}
