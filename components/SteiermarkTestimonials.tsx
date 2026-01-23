"use client";

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        name: "Andreas H.",
        role: "Weinbau & Buschenschank",
        location: "Südsteiermark",
        text: "Wir wollten unsere Weine auch online besser verkaufen. Red Rabbit Media hat das perfekt verstanden. Modern, aber passend zu unserer Tradition. Die Bestellungen sind spürbar gestiegen.",
        stars: 5,
        initial: "A"
    },
    {
        name: "Tech-Start-up Graz",
        role: "Head of Marketing",
        location: "Graz",
        text: "Als Tech-Firma war uns wichtig, dass der Code sauber ist und die Performance stimmt. Hier weiß man, was man tut. Next.js war die richtige Wahl. Top Umsetzung!",
        stars: 5,
        initial: "T"
    },
    {
        name: "Gasthof zur Post",
        role: "Inhaber",
        location: "Murtal",
        text: "Endlich eine unkomplizierte Zusammenarbeit. Einer kümmert sich um alles, ich muss mich nicht mit Technik ärgern. Die neue Seite bringt uns viele Reservierungen.",
        stars: 5,
        initial: "G"
    },
    {
        name: "Lisa M.",
        role: "Selbstständige Beraterin",
        location: "Leoben",
        text: "Der Fixpreis war für mich entscheidend. Keine versteckten Kosten, klares Angebot. Das Ergebnis kann sich sehen lassen, ich bekomme viele Komplimente für die Seite.",
        stars: 5,
        initial: "L"
    }
];

export default function SteiermarkTestimonials() {
    return (
        <section className="py-24 bg-gray-50 overflow-hidden" id="stimmen">
            <div className="max-w-7xl mx-auto px-8 relative">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>

                <div className="relative z-10">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
                                Das sagt die <span className="text-red-600 font-medium">Steiermark</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Zufriedene Kunden von Graz bis ins Ausseerland.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col relative group">
                                    <Quote className="absolute top-8 right-8 w-12 h-12 text-gray-100 group-hover:text-red-50 transition-colors duration-300" />

                                    <div className="flex gap-1 mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>

                                    <blockquote className="text-lg text-gray-700 leading-relaxed mb-8 flex-grow italic">
                                        &quot;{testimonial.text}&quot;
                                    </blockquote>

                                    <div className="flex items-center gap-4 mt-auto">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xl">
                                            {testimonial.initial}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                            <div className="text-sm text-gray-500">{testimonial.role} | {testimonial.location}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
