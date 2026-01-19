"use client";

import { useState, useEffect } from 'react';
import { Cookie, Settings, X, Check } from 'lucide-react';
import Link from 'next/link';

// TypeScript interface for consent
interface ConsentData {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    timestamp: string;
}

// TypeScript declaration for gtag
declare global {
    interface Window {
        gtag: (...args: Array<string | object | Date>) => void;
    }
}

const CookieBanner = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true, // Always true, can't be disabled
        analytics: true, // Default to true for Google Analytics
        marketing: true  // Default to true for marketing
    });

    useEffect(() => {
        // Check if user has already made a choice
        const cookieConsent = localStorage.getItem('redrabbit-cookie-consent');
        if (!cookieConsent) {
            // Show banner after a short delay for better UX
            setTimeout(() => setShowBanner(true), 2000);
        }
    }, []);

    // Neue Funktion für GTM Consent-Update
    const updateGTMConsent = (consent: ConsentData) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': consent.analytics ? 'granted' : 'denied',
                'ad_storage': consent.marketing ? 'granted' : 'denied'
            });

            // Debug-Logging für Testing
            console.log('GTM Consent updated:', {
                analytics: consent.analytics ? 'granted' : 'denied',
                marketing: consent.marketing ? 'granted' : 'denied'
            });
        }
    };

    const acceptAll = () => {
        const consent = {
            necessary: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('redrabbit-cookie-consent', JSON.stringify(consent));
        updateGTMConsent(consent); // GTM informieren
        setShowBanner(false);
    };

    const acceptSelected = () => {
        const consent = {
            ...preferences,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('redrabbit-cookie-consent', JSON.stringify(consent));
        updateGTMConsent(consent); // GTM informieren
        setShowBanner(false);
    };

    const rejectAll = () => {
        const consent = {
            necessary: true,
            analytics: false, // Jetzt wirklich false
            marketing: false, // Jetzt wirklich false
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('redrabbit-cookie-consent', JSON.stringify(consent));
        updateGTMConsent(consent); // GTM informieren
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
            <div className="max-w-7xl mx-auto px-6 py-6">
                {!showDetails ? (
                    // Simple Banner
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                        <div className="flex items-start space-x-4 flex-1">
                            <Cookie className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-2 text-gray-900">Wir verwenden Cookies</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Wir verwenden Cookies, um dir die bestmögliche Erfahrung auf unserer Website zu bieten.
                                    Technisch notwendige Cookies sind für die Grundfunktionen erforderlich.
                                    Mit deiner Zustimmung verwenden wir auch Analytics-Cookies zur Verbesserung unserer Website.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0 w-full sm:w-auto">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowDetails(true)}
                            >
                                <Settings className="w-4 h-4 inline mr-2" />
                                Einstellungen
                            </button>
                            <button
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={rejectAll}
                            >
                                Nur notwendige
                            </button>
                            <button
                                onClick={acceptAll}
                                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Alle akzeptieren
                            </button>
                        </div>
                    </div>
                ) : (
                    // Detailed Settings
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Cookie-Einstellungen</h3>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Necessary Cookies */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-gray-900">Technisch notwendige Cookies</h4>
                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                        Immer aktiv
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Diese Cookies sind für die grundlegenden Funktionen der Website erforderlich und können nicht deaktiviert werden.
                                    Sie werden normalerweise nur als Reaktion auf von dir durchgeführte Aktionen gesetzt.
                                </p>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-gray-900">Analytics-Cookies</h4>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 transition-colors"></div>
                                    </label>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren,
                                    indem sie Informationen anonym sammeln und melden.
                                </p>
                            </div>

                            {/* Marketing Cookies */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-gray-900">Marketing-Cookies</h4>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.marketing}
                                            onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 transition-colors"></div>
                                    </label>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Diese Cookies werden verwendet, um dir relevante Werbung und Inhalte zu zeigen
                                    und die Effektivität unserer Werbekampagnen zu messen.
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={rejectAll}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Alle ablehnen
                            </button>
                            <button
                                onClick={acceptSelected}
                                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                                Auswahl speichern
                            </button>
                            <button
                                onClick={acceptAll}
                                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                                Alle akzeptieren
                            </button>
                        </div>

                        {/* Legal Info */}
                        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                            <p className="text-xs text-gray-500">
                                Weitere Informationen findest du in unserer{' '}
                                <Link href="/datenschutz/" className="underline hover:text-white transition-colors">
                                    Datenschutzerklärung
                                </Link>
                                Du kannst deine Einstellungen jederzeit ändern.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CookieBanner;
