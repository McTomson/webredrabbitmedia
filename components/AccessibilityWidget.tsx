"use client";

import { useState, useEffect } from 'react';
import { Settings, X, Globe, Eye, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccessibilitySettings {
    fontSize: number;
    lineHeight: number;
    letterSpacing: number;
    dyslexiaFont: boolean;
    highContrast: boolean;
    invertColors: boolean;
    grayscale: boolean;
    highlightLinks: boolean;
    highlightHeadings: boolean;
    language: string;
}

const AccessibilityWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useState<AccessibilitySettings>({
        fontSize: 100,
        lineHeight: 150,
        letterSpacing: 0,
        dyslexiaFont: false,
        highContrast: false,
        invertColors: false,
        grayscale: false,
        highlightLinks: false,
        highlightHeadings: false,
        language: 'de',
    });

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('accessibilitySettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    // Save settings to localStorage and apply CSS variables
    useEffect(() => {
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
        applyAccessibilitySettings(settings);
    }, [settings]);

    const applyAccessibilitySettings = (newSettings: AccessibilitySettings) => {
        const root = document.documentElement;

        // Language setting
        if (newSettings.language === 'en') {
            document.documentElement.lang = 'en';
        } else {
            document.documentElement.lang = 'de';
        }

        // Text settings
        root.style.setProperty('--accessibility-font-size', `${newSettings.fontSize}%`);
        root.style.setProperty('--accessibility-line-height', `${newSettings.lineHeight}%`);
        root.style.setProperty('--accessibility-letter-spacing', `${newSettings.letterSpacing}px`);

        // Visual settings
        if (newSettings.highContrast) {
            root.classList.add('accessibility-high-contrast');
        } else {
            root.classList.remove('accessibility-high-contrast');
        }

        if (newSettings.invertColors) {
            root.classList.add('accessibility-invert-colors');
        } else {
            root.classList.remove('accessibility-invert-colors');
        }

        if (newSettings.grayscale) {
            root.classList.add('accessibility-grayscale');
        } else {
            root.classList.remove('accessibility-grayscale');
        }

        if (newSettings.dyslexiaFont) {
            root.classList.add('accessibility-dyslexia-font');
            document.body.classList.add('accessibility-dyslexia-font');
        } else {
            root.classList.remove('accessibility-dyslexia-font');
            document.body.classList.remove('accessibility-dyslexia-font');
        }

        if (newSettings.highlightLinks) {
            root.classList.add('accessibility-highlight-links');
        } else {
            root.classList.remove('accessibility-highlight-links');
        }

        if (newSettings.highlightHeadings) {
            root.classList.add('accessibility-highlight-headings');
        } else {
            root.classList.remove('accessibility-highlight-headings');
        }
    };

    const resetSettings = () => {
        const defaultSettings: AccessibilitySettings = {
            fontSize: 100,
            lineHeight: 150,
            letterSpacing: 0,
            dyslexiaFont: false,
            highContrast: false,
            invertColors: false,
            grayscale: false,
            highlightLinks: false,
            highlightHeadings: false,
            language: 'de',
        };
        setSettings(defaultSettings);
    };

    const handleSliderChange = (setting: keyof AccessibilitySettings, value: number) => {
        setSettings(prev => ({ ...prev, [setting]: value }));
    };

    const handleToggle = (setting: keyof AccessibilitySettings) => {
        setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
    };

    const handleLanguageChange = (language: string) => {
        setSettings(prev => ({ ...prev, language }));
    };

    return (
        <>
            {/* Sticky Button - Bottom Left */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
                aria-label="Barrierefreiheit öffnen"
            >
                <Settings className="w-6 h-6" />
            </button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <Settings className="w-6 h-6 text-red-600" />
                                    <h2 className="text-2xl font-semibold text-gray-900">Barrierefreiheit</h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <select
                                        value={settings.language}
                                        onChange={(e) => handleLanguageChange(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                                        aria-label="Sprache auswählen"
                                    >
                                        <option value="de">Deutsch (AT)</option>
                                        <option value="en">English</option>
                                    </select>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                                        aria-label="Schließen"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-8">
                                {/* Text-Einstellungen */}
                                <section>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-red-600" />
                                        Text-Einstellungen
                                    </h3>
                                    <div className="space-y-6">
                                        {/* Schriftgröße */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Schriftgröße: {settings.fontSize}%
                                            </label>
                                            <input
                                                type="range"
                                                min="100"
                                                max="200"
                                                value={settings.fontSize}
                                                onChange={(e) => handleSliderChange('fontSize', parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                                aria-label="Schriftgröße anpassen"
                                            />
                                        </div>

                                        {/* Zeilenhöhe */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Zeilenhöhe: {settings.lineHeight}%
                                            </label>
                                            <input
                                                type="range"
                                                min="100"
                                                max="200"
                                                value={settings.lineHeight}
                                                onChange={(e) => handleSliderChange('lineHeight', parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                                aria-label="Zeilenhöhe anpassen"
                                            />
                                        </div>

                                        {/* Buchstabenabstand */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Buchstabenabstand: {settings.letterSpacing}px
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="5"
                                                value={settings.letterSpacing}
                                                onChange={(e) => handleSliderChange('letterSpacing', parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                                aria-label="Buchstabenabstand anpassen"
                                            />
                                        </div>

                                        {/* Legasthenie-Schrift */}
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="dyslexiaFont"
                                                checked={settings.dyslexiaFont}
                                                onChange={() => handleToggle('dyslexiaFont')}
                                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                            />
                                            <label htmlFor="dyslexiaFont" className="ml-2 text-sm text-gray-700">
                                                Legasthenie-Schrift
                                            </label>
                                        </div>
                                    </div>
                                </section>

                                {/* Visuelle Anpassungen */}
                                <section>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Eye className="w-5 h-5 text-red-600" />
                                        Visuelle Anpassungen
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="highContrast"
                                                checked={settings.highContrast}
                                                onChange={() => handleToggle('highContrast')}
                                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                            />
                                            <label htmlFor="highContrast" className="ml-2 text-sm text-gray-700">
                                                Hoher Kontrast
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="invertColors"
                                                checked={settings.invertColors}
                                                onChange={() => handleToggle('invertColors')}
                                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                            />
                                            <label htmlFor="invertColors" className="ml-2 text-sm text-gray-700">
                                                Farben umkehren
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="grayscale"
                                                checked={settings.grayscale}
                                                onChange={() => handleToggle('grayscale')}
                                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                            />
                                            <label htmlFor="grayscale" className="ml-2 text-sm text-gray-700">
                                                Graustufen
                                            </label>
                                        </div>
                                    </div>
                                </section>

                                {/* Navigations-Hilfen */}
                                <section>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Navigation className="w-5 h-5 text-red-600" />
                                        Navigations-Hilfen
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="highlightLinks"
                                                checked={settings.highlightLinks}
                                                onChange={() => handleToggle('highlightLinks')}
                                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                            />
                                            <label htmlFor="highlightLinks" className="ml-2 text-sm text-gray-700">
                                                Links hervorheben
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="highlightHeadings"
                                                checked={settings.highlightHeadings}
                                                onChange={() => handleToggle('highlightHeadings')}
                                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                            />
                                            <label htmlFor="highlightHeadings" className="ml-2 text-sm text-gray-700">
                                                Überschriften hervorheben
                                            </label>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between p-6 border-t border-gray-200">
                                <button
                                    onClick={resetSettings}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg"
                                >
                                    Zurücksetzen
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Schließen
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AccessibilityWidget;
