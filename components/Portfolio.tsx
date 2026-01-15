"use client";

import { ExternalLink, ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import { AnimatedSection, AOSWrapper } from '@/components/AnimatedSection';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import Image from 'next/image';

// SVG Progress Circle Component
const ProgressCircle = ({ value, size = 56, strokeWidth = 4 }: { value: number; size?: number; strokeWidth?: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <svg width={size} height={size} style={{ willChange: 'auto' }}>
            {/* Background Circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={strokeWidth}
            />
            {/* Progress Circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#22c55e"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{
                    transition: 'stroke-dashoffset 1s ease-out',
                    willChange: 'stroke-dashoffset'
                }}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            {/* Center Text */}
            <text
                x={size / 2}
                y={size / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#111827"
                fontSize="14"
                fontWeight="300"
            >
                {value}
            </text>
        </svg>
    );
};

// Performance Score Component with Collapsible Info
const PerformanceScores = ({ scores }: { scores: { performance: number; accessibility: number; bestPractices: number; seo: number; llm: number } }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Calculate average
    const average = Math.round((scores.performance + scores.accessibility + scores.bestPractices + scores.seo + scores.llm) / 5);

    return (
        <div className="mb-8">
            {/* Header */}
            <div className="text-center mb-6">
                <h4 className="text-xs font-light text-gray-500 uppercase tracking-wide">Google Leistungsdiagnostik</h4>
            </div>

            {/* Average Score Circle - Large */}
            <div className="flex justify-center mb-6">
                <div className="text-center">
                    <div className="mb-2">
                        <ProgressCircle value={average} size={80} strokeWidth={6} />
                    </div>
                    <span className="text-xs text-gray-600 font-light">Gesamtpunktzahl</span>
                </div>
            </div>

            {/* 5 Score Circles - Small */}
            <div className="flex justify-center gap-4 mb-6">
                <div className="text-center">
                    <div className="mb-1">
                        <ProgressCircle value={scores.performance} size={48} strokeWidth={3} />
                    </div>
                    <span className="text-[9px] text-gray-500 font-light">Leistung</span>
                </div>
                <div className="text-center">
                    <div className="mb-1">
                        <ProgressCircle value={scores.accessibility} size={48} strokeWidth={3} />
                    </div>
                    <span className="text-[9px] text-gray-500 font-light">Barrierefreiheit</span>
                </div>
                <div className="text-center">
                    <div className="mb-1">
                        <ProgressCircle value={scores.bestPractices} size={48} strokeWidth={3} />
                    </div>
                    <span className="text-[9px] text-gray-500 font-light">Best Practices</span>
                </div>
                <div className="text-center">
                    <div className="mb-1">
                        <ProgressCircle value={scores.seo} size={48} strokeWidth={3} />
                    </div>
                    <span className="text-[9px] text-gray-500 font-light">SEO</span>
                </div>
                <div className="text-center">
                    <div className="mb-1">
                        <ProgressCircle value={scores.llm} size={48} strokeWidth={3} />
                    </div>
                    <span className="text-[9px] text-gray-500 font-light">LLM</span>
                </div>
            </div>

            {/* Red Button Toggle */}
            <div className="text-center">
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors text-xs font-light"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span>Details anzeigen</span>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown className="w-3.5 h-3.5" />
                    </motion.div>
                </motion.button>
            </div>

            {/* Collapsible Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-6 p-6 bg-gray-50 border border-gray-200 space-y-6">
                            {/* Leistung */}
                            <div className="flex gap-4 items-start">
                                <div className="flex-shrink-0">
                                    <ProgressCircle value={scores.performance} size={64} strokeWidth={4} />
                                </div>
                                <div className="flex-grow">
                                    <h5 className="text-sm font-medium text-gray-900 mb-2">Leistung</h5>
                                    <p className="text-xs text-gray-600 font-light leading-relaxed">
                                        Wie schnell lädt die Website? Schnelle Ladezeiten bedeuten weniger Wartezeit für Ihre Kunden und bessere Rankings bei Google.
                                    </p>
                                </div>
                            </div>

                            {/* Barrierefreiheit */}
                            <div className="flex gap-4 items-start">
                                <div className="flex-shrink-0">
                                    <ProgressCircle value={scores.accessibility} size={64} strokeWidth={4} />
                                </div>
                                <div className="flex-grow">
                                    <h5 className="text-sm font-medium text-gray-900 mb-2">Barrierefreiheit</h5>
                                    <p className="text-xs text-gray-600 font-light leading-relaxed">
                                        Kann jeder die Website nutzen? Wir stellen sicher, dass auch Menschen mit Einschränkungen Ihre Inhalte problemlos erreichen können.
                                    </p>
                                </div>
                            </div>

                            {/* Best Practices */}
                            <div className="flex gap-4 items-start">
                                <div className="flex-shrink-0">
                                    <ProgressCircle value={scores.bestPractices} size={64} strokeWidth={4} />
                                </div>
                                <div className="flex-grow">
                                    <h5 className="text-sm font-medium text-gray-900 mb-2">Best Practices</h5>
                                    <p className="text-xs text-gray-600 font-light leading-relaxed">
                                        Werden moderne Web-Standards eingehalten? Sicherheit, HTTPS und aktuelle Technologien sind heute Pflicht für seriöse Websites.
                                    </p>
                                </div>
                            </div>

                            {/* SEO */}
                            <div className="flex gap-4 items-start">
                                <div className="flex-shrink-0">
                                    <ProgressCircle value={scores.seo} size={64} strokeWidth={4} />
                                </div>
                                <div className="flex-grow">
                                    <h5 className="text-sm font-medium text-gray-900 mb-2">SEO (Suchmaschinenoptimierung)</h5>
                                    <p className="text-xs text-gray-600 font-light leading-relaxed">
                                        Wird Ihre Website von Google gefunden? Optimierte Inhalte, Meta-Tags und Struktur sorgen dafür, dass Sie bei Google ganz oben stehen.
                                    </p>
                                </div>
                            </div>

                            {/* LLM/ChatGPT */}
                            <div className="flex gap-4 items-start">
                                <div className="flex-shrink-0">
                                    <ProgressCircle value={scores.llm} size={64} strokeWidth={4} />
                                </div>
                                <div className="flex-grow">
                                    <h5 className="text-sm font-medium text-gray-900 mb-2">LLM/ChatGPT Optimierung</h5>
                                    <p className="text-xs text-gray-600 font-light leading-relaxed">
                                        Kann ChatGPT Ihre Website verstehen? Moderne KI-Assistenten wie ChatGPT helfen Kunden, Informationen zu finden.
                                        Wir strukturieren Ihre Website so, dass KI-Tools Ihre Inhalte perfekt lesen und empfehlen können - ein entscheidender Vorteil für die Zukunft.
                                    </p>
                                </div>
                            </div>

                            {/* Bottom Info */}
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-700 font-light leading-relaxed">
                                    <span className="font-medium">Warum ist das wichtig für Sie?</span> Diese Werte entscheiden darüber, ob Ihre Kunden Sie online finden,
                                    wie lange sie auf Ihrer Website bleiben und ob sie zu zahlenden Kunden werden. Wir sorgen dafür, dass alle Werte im grünen Bereich (90+) liegen.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface PortfolioProps {
    headline?: string;
    subline?: string;
}

const Portfolio = ({ headline, subline }: PortfolioProps) => {
    const [showAllProjects, setShowAllProjects] = useState(false);
    const isMobile = useIsMobile();

    const allProjects = [
        {
            id: 1,
            name: "K2 Dach- & Bau GmbH",
            url: "https://k2-dream-builder.vercel.app",
            screenshot: "/images/k2-dach/k2-red-rabbit-media.png",
            category: "Dach & Bau",
            description: "Professionelle Website für Dach- und Baulösungen mit Fokus auf modernes Design und Kundenerlebnis",
            features: [
                "Responsives Design für alle Geräte",
                "Interaktive Projektgalerie",
                "SEO-optimiert für lokale Suche"
            ],
            scores: { performance: 95, accessibility: 92, bestPractices: 96, seo: 94, llm: 96 }
        },
        {
            id: 2,
            name: "Thermewarten.at",
            url: "https://www.thermewarten.at/",
            screenshot: "/images/thermewarten/thermenwarten-at-red-rabbit-media.png",
            category: "Thermenwartung",
            description: "Benutzerfreundliche Plattform für schnelle Thermenwartung und zuverlässigen Heizanlagen-Service",
            features: [
                "Online-Terminbuchung integriert",
                "Mobile-First Design",
                "Schnelle Ladezeiten"
            ],
            scores: { performance: 93, accessibility: 91, bestPractices: 95, seo: 92, llm: 94 }
        },
        {
            id: 3,
            name: "LashesbyDanesh",
            url: "https://www.lashesbydanesh.at/",
            screenshot: "/images/LashesbyDanesh/lashbydanesh-red-rabbit-media.png",
            category: "Beauty & Kosmetik",
            description: "Elegante Website für professionelle Wimpernverlängerung und Beauty-Treatments",
            features: [
                "Buchungssystem integriert",
                "Instagram Feed Integration",
                "Bildoptimiert für Portfolio"
            ],
            scores: { performance: 94, accessibility: 93, bestPractices: 96, seo: 95, llm: 97 }
        },
        {
            id: 4,
            name: "Ristorante LA MORRA",
            url: "https://pizza-4.vercel.app",
            screenshot: "/images/ristorante-la-morra/ristorante-la-morra-red-rabbit-media.png",
            category: "Gastronomie",
            description: "Stilvolle Website für authentische italienische Küche mit digitaler Speisekarte und Reservierung",
            features: [
                "Online-Speisekarte digital",
                "Reservierungssystem",
                "Mehrsprachig (DE/IT)"
            ],
            scores: { performance: 96, accessibility: 94, bestPractices: 97, seo: 93, llm: 95 }
        },
        {
            id: 5,
            name: "ReRo Heizsysteme",
            url: "https://www.heating-systems.at/",
            screenshot: "/images/rero-heitzsysteme/rero-heizsysteme-red-rabbit-media.png",
            category: "Heizung & Haustechnik",
            description: "Moderne Präsentation innovativer Heizlösungen mit interaktivem Produkt-Konfigurator",
            features: [
                "Produkt-Konfigurator",
                "Beratungsanfrage-Formular",
                "Energieeffizienz-Rechner"
            ],
            scores: { performance: 92, accessibility: 90, bestPractices: 94, seo: 91, llm: 93 }
        },
        {
            id: 6,
            name: "Aircraft Kälte- & Klimatechnik",
            url: "https://aircraft-comfort-guide.vercel.app/",
            screenshot: "/images/Aircraft/aircraft-red-rabbit-media.png",
            category: "Klima & Kälte",
            description: "Leistungsstarke Website für Klimatechnik mit digitalem Showroom und Service-Anfrage",
            features: [
                "Produktkatalog interaktiv",
                "Service-Anfrage online",
                "Performance-optimiert"
            ],
            scores: { performance: 95, accessibility: 92, bestPractices: 96, seo: 94, llm: 96 }
        },
        {
            id: 7,
            name: "Kickinger Installationen",
            url: "https://kickinger1234-m6yt.vercel.app/",
            screenshot: "/images/Kickinger/kickinger-red-rabbit-media.png",
            category: "Sanitär & Heizung",
            description: "Übersichtliche Website für Sanitär- und Heizungslösungen mit integriertem Notdienst-Kontakt",
            features: [
                "Notdienst-Hotline prominent",
                "Referenzprojekte Galerie",
                "Kontaktformular optimiert"
            ],
            scores: { performance: 94, accessibility: 91, bestPractices: 95, seo: 93, llm: 94 }
        },
        {
            id: 8,
            name: "Elektro M.I.T. OG",
            url: "https://www-elektro-mit-at.vercel.app/",
            screenshot: "/images/elektro-mit/elektro-mit-red-rabbit-media.png",
            category: "Elektroinstallation",
            description: "Professioneller Webauftritt für Elektroinstallationen im Gewerbe- und Privatbereich",
            features: [
                "Leistungsübersicht klar strukturiert",
                "Zertifikate & Qualifikationen",
                "Mobile-optimierte Navigation"
            ],
            scores: { performance: 93, accessibility: 92, bestPractices: 95, seo: 92, llm: 94 }
        },
        {
            id: 9,
            name: "Eichelmann Haus",
            url: "https://eichelmann-haus-11at.vercel.app/",
            screenshot: "/images/Eichelmann/eichelmann-red-rabbit-media.png",
            category: "Haustechnik",
            description: "Umfassende Website für moderne Haustechnik-Lösungen mit Fokus auf Energieeffizienz",
            features: [
                "Komplettes Service-Portfolio",
                "Anfrage-System integriert",
                "Schnelle Performance"
            ],
            scores: { performance: 94, accessibility: 91, bestPractices: 96, seo: 93, llm: 95 }
        }
    ];

    const initialCount = isMobile ? 3 : 6;
    const displayedProjects = showAllProjects ? allProjects : allProjects.slice(0, initialCount);

    return (
        <section id="portfolio" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <AOSWrapper animation="fade-up" delay={100}>
                        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
                            {headline || "Portfolio"}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            {subline || "Unsere realisierten Webprojekte für zufriedene Kunden."}
                        </p>
                    </AOSWrapper>
                </div>

                {/* 2-Column Grid with more spacing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {displayedProjects.map((project, index) => (
                        <AOSWrapper
                            key={project.id}
                            animation="fade-up"
                            delay={100 + (index * 50)}
                        >
                            <motion.div
                                className="group relative bg-white border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full"
                                whileHover={{ y: -4 }}
                            >
                                {/* Screenshot - Medium */}
                                <div className="relative aspect-video overflow-hidden bg-white">
                                    <a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block h-full"
                                    >
                                        {/* Using Next.js Image for optimization, fallback logic included via state if needed, but here simple */}
                                        <Image
                                            src={project.screenshot}
                                            alt={`${project.name} - Webdesign Referenz ${project.category} | Red Rabbit Media`}
                                            width={606}
                                            height={313}
                                            className="w-full h-full object-contain object-top transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </a>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                                        <motion.a
                                            href={project.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 hover:bg-red-600 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className="font-light">Website ansehen</span>
                                            <ArrowUpRight className="w-5 h-5" />
                                        </motion.a>
                                    </div>
                                </div>

                                {/* Project Info with more whitespace */}
                                <div className="p-8 flex-1 flex flex-col">
                                    {/* Performance Scores */}
                                    <PerformanceScores scores={project.scores} />

                                    {/* Category Badge */}
                                    <div className="mb-6">
                                        <span className="inline-block px-3 py-1 bg-gray-50 text-gray-600 text-xs font-light border border-gray-200">
                                            {project.category}
                                        </span>
                                    </div>

                                    {/* Project Name */}
                                    <h3 className="text-2xl font-light text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                                        {project.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 leading-relaxed font-light mb-6">
                                        {project.description}
                                    </p>

                                    {/* Features as Bullet Points */}
                                    <ul className="space-y-3 mb-8">
                                        {project.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 font-light">
                                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Bottom Link */}
                                    <div className="pt-6 border-t border-gray-100">
                                        <a
                                            href={project.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors group/link font-light"
                                        >
                                            <span className="group-hover/link:underline">Zur Website</span>
                                            <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </AOSWrapper>
                    ))}
                </div>

                {/* Load More Button */}
                {allProjects.length > 6 && (
                    <AOSWrapper animation="fade-up" delay={800}>
                        <div className="text-center mt-12">
                            {!showAllProjects ? (
                                <motion.button
                                    onClick={() => setShowAllProjects(true)}
                                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white border border-gray-300 text-gray-900 hover:border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="text-base font-light">Mehr Projekte laden</span>
                                    <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </motion.button>
                            ) : (
                                <div className="text-gray-600">
                                    <p className="text-base font-light">Alle Projekte angezeigt</p>
                                    <p className="text-sm mt-2 font-light">Du siehst jetzt alle {allProjects.length} Projekte</p>
                                </div>
                            )}
                        </div>
                    </AOSWrapper>
                )}

                {/* Disclaimer */}
                <div className="mt-16 text-center">
                    <p className="text-xs text-gray-400 leading-relaxed max-w-4xl mx-auto">
                        * Hinweis: Bei dieser Seite handelt es sich um einen Entwurf bzw. eine Vorschau, die im Rahmen eines laufenden Projekts erstellt wurde. Die Inhalte wurden vom Kunden noch nicht final freigegeben und dienen lediglich als Designbeispiel. Marken, Logos und Bilder bleiben Eigentum des jeweiligen Inhabers.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
