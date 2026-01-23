"use client";

import { Handshake, Gauge, MapPin, CheckCircle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const usps = [
    {
        icon: Gauge,
        title: "Maximale Performance",
        description: "In der Steiermark zählt Effizienz. Unsere Websites laden blitzschnell, damit Ihre Kunden nicht warten müssen – und Google Sie liebt.",
        highlight: "High-Speed Webdesign"
    },
    {
        icon: Lightbulb,
        title: "Direkt & Schnörkellos",
        description: "Wir kommen direkt zum Punkt. Keine unnötigen Fachbegriffe oder leere Kilometer, sondern digitale Ergebnisse, die Ihr Geschäft voranbringen.",
        highlight: "Klarer Fokus"
    },
    {
        icon: Handshake,
        title: "Ehrliche Beratung",
        description: "Wir sagen Ihnen ehrlich, was funktioniert und was nicht. Transparente Fixpreise und Handschlagqualität sind unser Standard für die Steiermark.",
        highlight: "100% Transparent"
    },
    {
        icon: CheckCircle,
        title: "Zukunftssicherheit",
        description: "Mit Next.js und KI-Optimierung bauen wir heute die Website, die auch morgen noch technisch an der Spitze der grünen Mark steht.",
        highlight: "Modernster Stack"
    }
];

export default function SteiermarkUSPSection() {
    return (
        <section className="py-24 bg-white" id="vorteile">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
                            Warum <span className="text-red-600 font-medium">Steirer</span> uns vertrauen
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Ehrliche Arbeit für ehrliches Geld. Webdesign, das hält, was es verspricht.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {usps.map((usp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="group h-full p-8 lg:p-10 bg-gray-50 rounded-xl hover:bg-white hover:shadow-xl border border-transparent hover:border-gray-100 transition-all duration-500 flex flex-col">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-50 transition-all duration-300 shadow-sm">
                                    <usp.icon className="w-8 h-8 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
                                </div>

                                <div className="text-center flex flex-col flex-grow">
                                    <h4 className="font-medium text-lg lg:text-xl mb-4 text-gray-900">
                                        {usp.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                                        {usp.description}
                                    </p>

                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white group-hover:bg-red-50 rounded-full text-[10px] font-medium text-gray-400 group-hover:text-red-600 transition-all duration-300 mx-auto mt-auto uppercase tracking-wider border border-gray-100">
                                        <CheckCircle className="w-3 h-3" />
                                        {usp.highlight}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
