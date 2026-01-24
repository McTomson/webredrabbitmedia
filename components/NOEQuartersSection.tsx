"use client";


import { Wine, TreePine, Factory, Mountain } from 'lucide-react';
import { AOSWrapper } from './AnimatedSection';

const quarters = [
    {
        title: "Waldviertel",
        description: "Von Gmünd bis Zwettl – wir kennen den Norden Niederösterreichs und bringen Ihre Botschaft ins Netz.",
        icon: TreePine,
        keywords: "Gmünd, Zwettl, Horn",
        color: "bg-emerald-50",
        iconColor: "text-emerald-600"
    },
    {
        title: "Weinviertel",
        description: "Von Hollabrunn bis Mistelbach – digitale Lösungen für Betriebe im Osten Niederösterreichs.",
        icon: Wine,
        keywords: "Hollabrunn, Mistelbach, Korneuburg",
        color: "bg-purple-50",
        iconColor: "text-purple-600"
    },
    {
        title: "Mostviertel",
        description: "Von Amstetten bis Scheibbs – wir bringen Ihr Unternehmen im Herzen von NÖ nach vorne.",
        icon: Mountain,
        keywords: "Amstetten, Scheibbs, Waidhofen",
        color: "bg-amber-50",
        iconColor: "text-amber-600"
    },
    {
        title: "Industrieviertel",
        description: "Von Wiener Neustadt bis Baden – Ihre Werbeagentur für den wirtschaftsstarken Süden.",
        icon: Factory,
        keywords: "Wr. Neustadt, Baden, Mödling",
        color: "bg-blue-50",
        iconColor: "text-blue-600"
    }
];

export default function NOEQuartersSection() {
    return (
        <section className="py-24 bg-[#fdfdfd] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <AOSWrapper animation="fade-right" delay={100} className="max-w-2xl">
                        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
                            Wir kennen <span className="text-red-600 font-medium">Niederösterreich</span>.<br />
                            In allen 4 Vierteln zu Hause.
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Vom Waldviertel bis ins Industrieviertel – Red Rabbit Media ist Ihre
                            Werbeagentur mit regionalem Weitblick und digitaler Expertise.
                        </p>
                    </AOSWrapper>

                    <AOSWrapper animation="fade-left" delay={300} className="hidden lg:block pb-2">
                        <div className="flex items-center gap-4 text-gray-400 font-light tracking-[0.2em] uppercase text-xs">
                            <span className="w-12 h-px bg-gray-200"></span>
                            Regionale Kompetenz
                        </div>
                    </AOSWrapper>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {quarters.map((q, index) => (
                        <AOSWrapper
                            key={index}
                            animation="fade-up"
                            delay={200 + (index * 100)}
                        >
                            <div className="group h-full bg-white border border-gray-100 p-8 rounded-2xl hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col">
                                <div className={`w-14 h-14 ${q.color} rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    <q.icon className={`w-7 h-7 ${q.iconColor}`} />
                                </div>

                                <h3 className="text-2xl font-medium text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                                    {q.title}
                                </h3>

                                <p className="text-sm text-gray-600 leading-relaxed mb-8 flex-grow">
                                    {q.description}
                                </p>

                                <div className="pt-6 border-t border-gray-50 mt-auto">
                                    <p className="text-[10px] uppercase tracking-[0.1em] text-gray-400 font-medium">
                                        {q.keywords}
                                    </p>
                                </div>
                            </div>
                        </AOSWrapper>
                    ))}
                </div>
            </div>

            {/* Subtle Background Accent */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-red-50/30 rounded-full blur-3xl -z-10"></div>
        </section>
    );
}
