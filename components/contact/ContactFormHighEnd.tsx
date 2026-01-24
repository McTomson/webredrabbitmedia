"use client";

import { useState } from "react";
import * as z from "zod";
import { Loader2, Send } from "lucide-react";
import Link from "next/link";

// Schema definition (same as before)
const formSchema = z.object({
    name: z.string().min(2, { message: "Name muss mindestens 2 Zeichen lang sein." }),
    email: z.string().email({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." }),
    phone: z.string().min(5, { message: "Bitte geben Sie eine gültige Telefonnummer ein." }),
    company: z.string().optional(),
    service: z.string().min(1, { message: "Bitte wählen Sie eine Leistung aus." }),
    message: z.string().min(10, { message: "Ihre Nachricht sollte mindestens 10 Zeichen lang sein." }),
});

export default function ContactFormHighEnd() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "Webdesign", // Default
        message: ""
    });

    // Errors State
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleRadioChange = (value: string) => {
        setFormData(prev => ({ ...prev, service: value }));
    };

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);
        setErrors({});

        // 1. Validation
        const result = formSchema.safeParse(formData);

        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                if (issue.path[0]) {
                    newErrors[issue.path[0].toString()] = issue.message;
                }
            });
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        // 2. Submission
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Fehler beim Senden");
            }

            setIsSuccess(true);
            setFormData({
                name: "",
                email: "",
                phone: "",
                company: "",
                service: "Webdesign",
                message: ""
            });
        } catch (_err) {
            setFormError("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="bg-card p-8 rounded-2xl border border-success/20 shadow-lg text-center animate-fade-in-up">
                <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Nachricht gesendet!</h3>
                <p className="text-muted-foreground mb-8">
                    Vielen Dank für Ihre Anfrage. Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.
                </p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="text-primary font-medium hover:underline"
                >
                    Weitere Nachricht senden
                </button>
            </div>
        );
    }

    return (
        <div className="bg-card p-8 md:p-10 rounded-2xl border border-border/50 shadow-xl relative overflow-hidden backdrop-blur-sm">
            {/* Decorative gradient blob */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <h3 className="text-2xl md:text-3xl font-light mb-2">Projekt anfragen</h3>
            <p className="text-muted-foreground mb-8">
                Erzählen Sie uns von Ihrer Vision. Wir melden uns umgehend.
            </p>

            <form onSubmit={onSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground/80">
                            Name <span className="text-accent">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg bg-secondary/50 border ${errors.name ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary/50"
                                } focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all`}
                            placeholder="Max Mustermann"
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                        <label htmlFor="company" className="text-sm font-medium text-foreground/80">
                            Unternehmen (Optional)
                        </label>
                        <input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                            placeholder="Ihr Unternehmen GmbH"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground/80">
                            Key-Mail <span className="text-accent">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg bg-secondary/50 border ${errors.email ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary/50"
                                } focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all`}
                            placeholder="max@beispiel.at"
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-foreground/80">
                            Telefon <span className="text-accent">*</span>
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg bg-secondary/50 border ${errors.phone ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary/50"
                                } focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all`}
                            placeholder="+43 676 1234567"
                        />
                        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                    </div>
                </div>

                {/* Service Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">
                        Woran sind Sie interessiert?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {["Webdesign", "SEO", "Wartung", "Anderes"].map((option) => (
                            <label
                                key={option}
                                className={`cursor-pointer border rounded-lg px-4 py-3 text-sm text-center transition-all ${formData.service === option
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "hover:border-primary/50 text-foreground"
                                    } relative overflow-hidden group`}
                            >
                                <input
                                    type="radio"
                                    name="service"
                                    value={option}
                                    checked={formData.service === option}
                                    onChange={() => handleRadioChange(option)}
                                    className="peer sr-only"
                                />
                                <span className="relative z-10">{option}</span>
                            </label>
                        ))}
                    </div>
                    {errors.service && <p className="text-xs text-destructive">{errors.service}</p>}
                </div>

                {/* Message */}
                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground/80">
                        Nachricht <span className="text-accent">*</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg bg-secondary/50 border ${errors.message ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary/50"
                            } focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all resize-none`}
                        placeholder="Beschreiben Sie kurz Ihr Projekt..."
                    />
                    {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                </div>

                <p className="text-xs text-muted-foreground">
                    Mit dem Absenden erkläre ich mich mit der <Link href="/datenschutz" className="underline hover:text-primary">Datenschutzerklärung</Link> einverstanden.
                </p>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-minimal flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Anfrage absenden
                            <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </button>

                {formError && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm mt-4">
                        {formError}
                    </div>
                )}
            </form>
        </div>
    );
}
