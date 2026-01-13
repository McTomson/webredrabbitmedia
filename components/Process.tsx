"use client";

import { FileText, Lightbulb, CreditCard, Clock, Shield, Zap, Users, CheckCircle } from 'lucide-react';
import { AOSWrapper } from './AnimatedSection';

interface ProcessProps {
    onFormOpen?: () => void;
}

const Process = ({ onFormOpen }: ProcessProps) => {
    const steps = [
        {
            number: "01",
            title: "Formular ausfüllen",
            description: "Du füllst unser kurzes Formular aus. Dauert nur 2 Minuten und ist komplett kostenlos.",
            highlight: "2 Minuten"
        },
        {
            number: "02",
            title: "Kostenlosen Vorschlag erhalten",
            description: "Innerhalb von 7 Tagen erhältst du einen individuellen Website-Vorschlag von uns.",
            highlight: "7 Tage"
        },
        {
            number: "03",
            title: "Nur zahlen, wenn's gefällt",
            description: "Gefällt dir unser Vorschlag? Perfekt! Wenn nicht, entstehen dir keinerlei Kosten.",
            highlight: "Kein Risiko"
        }
    ];

    return (
        <section id="process" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <AOSWrapper animation="fade-up" delay={100}>
                        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
                            So funktioniert's
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Unsicherheiten abbauen, Klarheit schaffen.
                            Drei einfache Schritte zu deiner neuen Website.
                        </p>
                        <div className="mt-4 text-red-600 font-medium">
                            ⚡ Deine Website ist in nur 7 Tagen fertig
                        </div>
                    </AOSWrapper>
                </div>

                {/* Process Steps - Horizontal Flow with Staggered Animation */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center justify-center space-y-12 lg:space-y-0">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col lg:flex-row items-center justify-center w-full lg:w-auto">
                                {/* Step Circle with Staggered Animation */}
                                <AOSWrapper animation="fade-up" delay={200 + (index * 400)}>
                                    <div className="relative flex flex-col items-center">
                                        <div className="w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                            <div className="text-center">
                                                <div className="text-xl lg:text-2xl text-red-600 font-light mb-2">{step.number}</div>
                                                <div className="text-xs lg:text-sm text-gray-900 font-light leading-tight px-2">
                                                    {step.number === "03" ? (
                                                        <>
                                                            Nur zahlen,<br />
                                                            wenn's gefällt
                                                        </>
                                                    ) : (
                                                        step.title
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step Details */}
                                        <div className="mt-6 text-center lg:text-left lg:absolute lg:top-full lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:mt-4 lg:w-64 max-w-xs mx-auto lg:mx-0">
                                            <h3 className="text-lg font-light text-gray-900 mb-2">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed text-sm mb-3">
                                                {step.description}
                                            </p>
                                            <div className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                                                {step.highlight}
                                            </div>
                                        </div>
                                    </div>
                                </AOSWrapper>

                                {/* Connecting Line - Only between steps, not after the last one */}
                                {index < steps.length - 1 && (
                                    <AOSWrapper animation="fade-left" delay={400 + (index * 400)}>
                                        <div className="hidden lg:block w-24 h-px bg-gray-300 mx-12"></div>
                                    </AOSWrapper>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Benefits Section - Restored Original Design */}
                <AOSWrapper animation="fade-up" delay={800}>
                    <div className="mt-60">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
                            {[
                                {
                                    title: "Keine Meetings",
                                    description: "Alles läuft digital ab. Du sparst Zeit.",
                                    icon: Clock,
                                    highlight: "Digital",
                                    redText: "2 Minuten"
                                },
                                {
                                    title: "Kein Aufwand",
                                    description: "Du machst nichts. Wir kümmern uns um alles.",
                                    icon: Users,
                                    highlight: "Entspannt",
                                    redText: "0 Aufwand"
                                },
                                {
                                    title: "Sicher",
                                    description: "100% DSGVO-konform. Deine Daten sind sicher.",
                                    icon: Shield,
                                    highlight: "DSGVO",
                                    redText: "100% Sicher"
                                },
                                {
                                    title: "Professionell",
                                    description: "Deine Website ist in 7 Tagen fertig.",
                                    icon: Zap,
                                    highlight: "Schnell",
                                    redText: "7 Tage"
                                }
                            ].map((benefit, index) => (
                                <AOSWrapper
                                    key={index}
                                    animation="fade-up"
                                    delay={1000 + (index * 100)}
                                >
                                    <div className="group h-56 sm:h-64 lg:h-80 p-4 sm:p-5 lg:p-8 bg-white border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                                        {/* Background accent */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-red-200 group-hover:from-red-200 group-hover:to-red-300 transition-all duration-500"></div>

                                        {/* Icon */}
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-50 transition-all duration-300">
                                            <benefit.icon className="w-8 h-8 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
                                        </div>

                                        {/* Content */}
                                        <div className="text-center flex flex-col h-full">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-lg mb-4 text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                                                    {benefit.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                                    {benefit.description}
                                                </p>

                                                {/* Red text - Positioned higher */}
                                                <div className="mb-6">
                                                    <div className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                                                        {benefit.redText}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-xs font-medium text-gray-600 group-hover:bg-red-50 group-hover:text-red-600 transition-all duration-300 mx-auto">
                                                <CheckCircle className="w-3 h-3" />
                                                {benefit.highlight}
                                            </div>
                                        </div>
                                    </div>
                                </AOSWrapper>
                            ))}
                        </div>
                    </div>
                </AOSWrapper>

                {/* Formular ausfüllen Button - Moved down and made rectangular */}
                <div className="flex justify-center mt-20">
                    <button
                        onClick={onFormOpen}
                        className="px-12 py-4 bg-red-600 text-white rounded-none text-lg font-medium shadow-lg hover:bg-red-700 transition-all duration-300"
                    >
                        Formular ausfüllen
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Process;
