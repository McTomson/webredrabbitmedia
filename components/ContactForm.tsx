"use client";

import { useState, useEffect } from 'react';
import { X, Send, Building, User, Mail, Phone, MapPin, MessageSquare, Globe, CheckCircle, Clock, CreditCard, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ContactFormProps {
    isOpen: boolean;
    onClose: () => void;
}

// Input validation and sanitization
const sanitizeInput = (input: string): string => {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .slice(0, 1000); // Limit length
};

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;
    return phoneRegex.test(phone);
};

const validateWebsite = (website: string): boolean => {
    if (!website) return false;
    try {
        new URL(website.startsWith('http') ? website : `https://${website}`);
        return true;
    } catch {
        return false;
    }
};

const ContactForm = ({ isOpen, onClose }: ContactFormProps) => {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        website: '',
        message: '',
        honeyPot: '' // Hidden field for spam protection
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Rate limiting
    const [lastSubmission, setLastSubmission] = useState(0);
    const RATE_LIMIT_MS = 30000; // 30 seconds

    // Auto-hide success message after 5 minutes
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
                onClose();
            }, 5 * 60 * 1000); // 5 minutes

            return () => clearTimeout(timer);
        }
    }, [showSuccess, onClose]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        // Name validation
        if (!formData.name.trim()) {
            errors.name = 'Name ist erforderlich';
        } else if (formData.name.length < 2) {
            errors.name = 'Name muss mindestens 2 Zeichen lang sein';
        }

        // Email validation
        if (!formData.email.trim()) {
            errors.email = 'E-Mail ist erforderlich';
        } else if (!validateEmail(formData.email)) {
            errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
        }

        // Website validation
        if (!formData.website.trim()) {
            errors.website = 'Website ist erforderlich';
        } else if (!validateWebsite(formData.website)) {
            errors.website = 'Bitte geben Sie eine gültige Website-URL ein';
        }

        // Phone validation (optional but validate if provided)
        if (formData.phone.trim() && !validatePhone(formData.phone)) {
            errors.phone = 'Bitte geben Sie eine gültige Telefonnummer ein';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Rate limiting check
        const now = Date.now();
        if (now - lastSubmission < RATE_LIMIT_MS) {
            setSubmitError(`Bitte warten Sie ${Math.ceil((RATE_LIMIT_MS - (now - lastSubmission)) / 1000)} Sekunden vor dem nächsten Versuch.`);
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            // Sanitize all inputs
            const sanitizedData = {
                name: sanitizeInput(formData.name),
                company: sanitizeInput(formData.company),
                email: sanitizeInput(formData.email),
                phone: sanitizeInput(formData.phone),
                website: sanitizeInput(formData.website),
                message: sanitizeInput(formData.message),
                honeyPot: formData.honeyPot
            };

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sanitizedData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Fehler beim Senden');
            }

            setIsSubmitting(false);
            setShowSuccess(true);
            setLastSubmission(now);

            // Reset form
            setFormData({
                name: '',
                company: '',
                email: '',
                phone: '',
                website: '',
                message: '',
                honeyPot: ''
            });

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
            console.error(error);
            setIsSubmitting(false);
            setSubmitError(errorMessage);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors({
                ...validationErrors,
                [name]: ''
            });
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {!showSuccess ? (
                            <>
                                {/* Header */}
                                <div className="relative p-8 bg-white text-gray-900 border-b border-gray-100">
                                    <button
                                        onClick={onClose}
                                        className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all duration-300"
                                        aria-label="Formular schließen"
                                    >
                                        <X className="w-4 h-4" aria-hidden="true" />
                                    </button>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative h-12 w-auto">
                                            <Image
                                                src="/images/logo.webp"
                                                alt="Red Rabbit Media Logo"
                                                width={50}
                                                height={50}
                                                className="h-full w-auto object-contain"
                                            />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-light text-gray-900">Kostenloser Website-Vorschlag</h2>
                                            <p className="text-gray-600">Fülle das Formular aus und erhalte deinen individuellen Vorschlag</p>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone className="w-4 h-4" />
                                            <span>+43 676 9000 955</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            <span>office@redrabbit.media</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                    {/* Honeypot Field - Hidden */}
                                    <div className="hidden" aria-hidden="true">
                                        <input
                                            type="text"
                                            name="honeyPot"
                                            value={formData.honeyPot}
                                            onChange={handleInputChange}
                                            tabIndex={-1}
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Name */}
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <User className="w-4 h-4" aria-hidden="true" />
                                                Name *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    aria-required="true"
                                                    aria-describedby="name-error"
                                                    className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 focus:border-red-600 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400"
                                                    placeholder="Dein vollständiger Name"
                                                />
                                                {validationErrors.name && <div id="name-error" className="text-red-600 text-sm mt-1" role="alert">{validationErrors.name}</div>}
                                            </div>
                                        </div>

                                        {/* Company */}
                                        <div className="space-y-2">
                                            <label htmlFor="company" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Building className="w-4 h-4" aria-hidden="true" />
                                                Unternehmen
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="company"
                                                    type="text"
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleInputChange}
                                                    className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 focus:border-red-600 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400"
                                                    placeholder="Name deines Unternehmens"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Mail className="w-4 h-4" aria-hidden="true" />
                                                E-Mail *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    aria-required="true"
                                                    aria-describedby="email-error"
                                                    className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 focus:border-red-600 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400"
                                                    placeholder="deine@email.com"
                                                />
                                                {validationErrors.email && <div id="email-error" className="text-red-600 text-sm mt-1" role="alert">{validationErrors.email}</div>}
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                Telefon
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 focus:border-red-600 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400"
                                                    placeholder="+43 676 9000 955"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Website */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            Website *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="url"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 focus:border-red-600 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400"
                                                placeholder="https://www.deine-website.at"
                                            />
                                            {validationErrors.website && <div id="website-error" className="text-red-600 text-sm mt-1" role="alert">{validationErrors.website}</div>}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Nachricht
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 focus:border-red-600 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 resize-none"
                                                placeholder="Erzähle uns von deinem Projekt und deinen Wünschen..."
                                            />
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {submitError && (
                                        <div className="pt-4">
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <p className="text-red-700 text-sm">{submitError}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full group flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 transition-all duration-500 rounded-none"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Wird gesendet...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-lg">Kostenlosen Vorschlag anfordern</span>
                                                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Privacy Notice */}
                                    <p className="text-xs text-gray-500 text-center">
                                        Mit dem Absenden stimmst du zu, dass wir deine Daten zur Bearbeitung deiner Anfrage verwenden.
                                        Du zahlst nur, wenn dir unser Vorschlag gefällt. Kein Risiko – 100% DSGVO-konform.
                                        Mehr dazu findest du in unserer <a href="#" className="text-red-600 hover:underline">Datenschutzerklärung</a>.
                                    </p>
                                </form>
                            </>
                        ) : (
                            /* Success Message */
                            <div className="p-8">
                                <button
                                    onClick={handleCloseSuccess}
                                    className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all duration-300"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {/* Success Header */}
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-light text-gray-900 mb-2">Vielen Dank für deine Anfrage!</h2>
                                    <p className="text-gray-600">Unsere 5 Designer machen sich ans Werk</p>
                                </div>

                                {/* Main Message */}
                                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        In den nächsten 7 Tagen bekommst du schon den ersten Vorschlag für deine Website.
                                        Danach kannst du uns sagen, was wir für dich verbessern dürfen, bis du deine perfekte Website hast.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        <strong>Wichtig:</strong> Wenn es dir nicht gefällt, musst du es nicht nehmen und auch nicht zahlen.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        Du kannst uns aber auch jederzeit unter <strong>0676 9000 955</strong> erreichen oder eine E-Mail schreiben an <strong>office@redrabbit.media</strong>
                                    </p>
                                </div>

                                {/* Key Points */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    <div className="bg-white border border-gray-200 rounded-none p-4 text-center shadow-sm">
                                        <Clock className="w-6 h-6 text-red-600 mx-auto mb-2" />
                                        <h3 className="font-medium text-gray-900 mb-1">7 Tage</h3>
                                        <p className="text-sm text-gray-600">Erster Vorschlag</p>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-none p-4 text-center shadow-sm">
                                        <CreditCard className="w-6 h-6 text-red-600 mx-auto mb-2" />
                                        <h3 className="font-medium text-gray-900 mb-1">ab 790€</h3>
                                        <p className="text-sm text-gray-600">Keine versteckten Kosten</p>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-none p-4 text-center shadow-sm">
                                        <MessageCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                                        <h3 className="font-medium text-gray-900 mb-1">800+</h3>
                                        <p className="text-sm text-gray-600">zufriedene Kunden seit 2010</p>
                                    </div>
                                </div>

                                {/* Contact Buttons */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => window.open('tel:+436769000955')}
                                        className="flex items-center justify-center gap-3 px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition-all duration-300 rounded-none"
                                    >
                                        <Phone className="w-4 h-4" />
                                        <span>Anrufen</span>
                                    </button>
                                    <a
                                        href="mailto:office@redrabbit.media"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 px-6 py-3 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 rounded-none"
                                    >
                                        <Mail className="w-4 h-4" />
                                        <span>E-Mail senden</span>
                                    </a>
                                </div>

                                {/* Auto-close notice */}
                                <p className="text-xs text-gray-500 text-center mt-6">
                                    Diese Nachricht schließt sich automatisch in 5 Minuten
                                </p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ContactForm;
