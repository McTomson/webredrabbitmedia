import { Metadata } from "next";
import ContactFormHighEnd from "@/components/contact/ContactFormHighEnd";
import ContactMap from "@/components/contact/ContactMap";
import { Mail, Phone, MapPin, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Kontakt | Red Rabbit Media - Ihre Webdesign Agentur in Wien",
    description: "Starten Sie Ihr digitales Projekt mit Red Rabbit Media. Kostenlose Beratung, Premium Webdesign & SEO aus Österreich. Antwort innerhalb von 24h.",
    alternates: {
        canonical: "https://www.redrabbit.media/kontakt",
    },
};

// SEO Schema for Contact Page
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Kontakt - Red Rabbit Media",
    "description": "Kontaktieren Sie Red Rabbit Media für Premium Webdesign und SEO.",
    "mainEntity": {
        "@type": "ProfessionalService",
        "name": "Red Rabbit Media GmbH",
        "image": "https://www.redrabbit.media/images/logo.webp",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Grabnergasse 8",
            "addressLocality": "Wien",
            "postalCode": "1060",
            "addressCountry": "AT"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 48.1916366,
            "longitude": 16.3513361
        },
        "url": "https://www.redrabbit.media",
        "telephone": "+436769000955",
        "email": "office@redrabbit.media",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
            }
        ],
        "areaServed": ["AT", "CH", "DE"],
        "priceRange": "$$"
    }
};

export default function ContactPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background text-foreground">
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>
                {/* Abstract Gradient Background - Lighter/Warmer tones */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

                <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium tracking-wide mb-6 animate-fade-in-up">
                        Antwort innerhalb von 24h
                    </span>
                    <h1 className="text-display font-bold mb-6 text-foreground leading-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        Lassen Sie uns <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                            Großes erschaffen.
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        Egal, ob Sie eine komplett neue Website benötigen oder Ihre bestehende Präsenz auf das nächste Level heben wollen – wir sind bereit.
                    </p>
                </div>
            </section>

            {/* Main Content: Split Layout */}
            <section className="relative py-20 bg-background overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                        {/* Left Column: Contact Info & Trust */}
                        <div className="lg:col-span-5 space-y-12">

                            {/* Direct Contact Cards */}
                            <div className="space-y-6">
                                <h2 className="text-3xl font-light text-foreground">Direkter Draht</h2>

                                <a href="tel:+436769000955" className="flex items-start gap-4 p-6 rounded-xl border border-border/60 hover:border-primary/30 hover:shadow-lg transition-all group bg-card">
                                    <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg text-foreground">Telefon & WhatsApp</h3>
                                        <p className="text-primary font-semibold text-xl mt-1">+43 676 9000 955</p>
                                        <p className="text-sm text-muted-foreground mt-2">Mo-Fr, 09:00 - 18:00 Uhr</p>
                                    </div>
                                </a>

                                <a href="mailto:office@redrabbit.media" className="flex items-start gap-4 p-6 rounded-xl border border-border/60 hover:border-primary/30 hover:shadow-lg transition-all group bg-card">
                                    <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg text-foreground">E-Mail</h3>
                                        <p className="text-primary font-semibold text-xl mt-1">office@redrabbit.media</p>
                                        <p className="text-sm text-muted-foreground mt-2">Wir antworten garantiert am selben Werktag.</p>
                                    </div>
                                </a>
                            </div>

                            {/* Office Location */}
                            <div className="space-y-6">
                                <h2 className="text-3xl font-light text-foreground">Unser Büro</h2>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-foreground/70 shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg text-foreground">Red Rabbit Media GmbH</h3>
                                        <p className="text-muted-foreground leading-relaxed mt-1">
                                            Grabnergasse 8<br />
                                            1060 Wien<br />
                                            Österreich
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Signals */}
                            <div className="pt-8 border-t border-border">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Warum Red Rabbit?</h3>
                                <ul className="space-y-4">
                                    {[
                                        "315+ Zufriedene Kunden",
                                        "100% DSGVO-Konform",
                                        "Österreichische Qualität & Hosting",
                                        "Transparente Fixpreise"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-foreground/80">
                                            <CheckCircle className="w-5 h-5 text-success" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="lg:col-span-7">
                            <div className="sticky top-32">
                                <ContactFormHighEnd />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="h-[500px] w-full relative z-0">
                <ContactMap />
            </section>

            {/* Regional Footer Links (SEO) */}
            <section className="bg-secondary/30 py-12 border-t border-border">
                <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">Wir sind in ganz Österreich für Sie da</h3>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        {[
                            { name: "Wien", href: "/webdesign-wien" },
                            { name: "Graz", href: "/webdesign-graz" },
                            { name: "Linz", href: "/webdesign-linz" },
                            { name: "Salzburg", href: "/webdesign-salzburg" },
                            { name: "Innsbruck", href: "/webdesign-innsbruck" },
                            { name: "Klagenfurt", href: "/webdesign-klagenfurt" },
                            { name: "St. Pölten", href: "/webdesign-st-poelten" },
                            { name: "Bregenz", href: "/webdesign-bregenz" },
                            { name: "Eisenstadt", href: "/webdesign-eisenstadt" },
                        ].map((city) => (
                            <Link key={city.name} href={city.href} className="text-sm text-foreground/60 hover:text-primary transition-colors">
                                Webdesign {city.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
