import { motion } from 'framer-motion';
import { Zap, Target, Database, Check } from 'lucide-react';
import { AOSWrapper } from '@/components/AnimatedSection';


interface Feature {
    title: string;
    text: string;
}


interface ComparisonItem {
    name: string;
    other: string;
    us: string;
}

interface SeoOptimizationProps {
    headline?: string;
    subline?: string;
    strategyHeadline?: string;
    comparisonHeadline?: string;
    features?: Feature[];
    comparisonItems?: ComparisonItem[];
}

const SeoOptimization = (props: SeoOptimizationProps) => {
    const { headline, subline, strategyHeadline, comparisonHeadline, features, comparisonItems } = props;

    return (
        <section className="py-24 bg-white relative" id="seo">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50 rounded-full blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-50 rounded-full blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <div className="text-center mb-20">
                    <AOSWrapper animation="fade-up">
                        <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-6">
                            {headline || <>Wir bauen keine Websites. <br /><span className="text-red-600 font-medium">Wir bauen Wachstum.</span></>}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                            {subline || "Eine schöne Hülle bringt keinen Umsatz. Wir liefern den Motor gleich mit: Premium SEO und KI-Optimierung sind bei uns Standard – nicht Extra."}
                        </p>
                    </AOSWrapper>
                </div>

                {/* 3 Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {(features || [
                        { title: "Technisches Fundament", text: "Google liebt Geschwindigkeit. Wir bauen auf modernster Technologie, die Ladezeiten minimiert und Rankings maximiert." },
                        { title: "Strategische SEO", text: "Wir analysieren nicht nur Keywords, sondern Kaufabsichten. Damit du genau dann gefunden wirst, wenn deine Kunden bereit sind zu kaufen." },
                        { title: "AI & LLM Ready", text: "Die Zukunft der Suche ist KI. Wir strukturieren deine Daten so, dass ChatGPT & Co. dich als beste Antwort verstehen und empfehlen." }
                    ]).map((feature, index) => (
                        <AOSWrapper key={index} animation="fade-up" delay={index * 100}>
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
                                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {index === 0 && <Zap className="w-7 h-7 text-red-600" />}
                                    {index === 1 && <Target className="w-7 h-7 text-red-600" />}
                                    {index === 2 && <Database className="w-7 h-7 text-red-600" />}
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.text}
                                </p>
                            </div>
                        </AOSWrapper>
                    ))}
                </div>

                {/* Detailed Explanation */}
                <div className="mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100"
                    >
                        <div className="max-w-4xl mx-auto">
                            <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-8 text-center">
                                {strategyHeadline || <>Warum eine Website ohne Strategie <span className="text-red-600 font-medium">Geldverschwendung</span> ist.</>}
                            </h3>

                            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">1</span>
                                        Warum wichtig?
                                    </h4>
                                    <p className="text-gray-600 mb-8">
                                        Sind Sie bereit, Ihre digitale Präsenz auf die nächste Stufe zu heben? Lassen Sie uns gemeinsam eine Website entwickeln, die nicht nur gut aussieht, sondern Ihre Geschäftsziele unterstützt. Klicken Sie auf &quot;Projekt anfragen&quot;, um ein kostenloses Erstgespräch zu vereinbaren, oder rufen Sie uns direkt an unter &quot;+43 676 9000955&quot;. Wir freuen uns darauf, von Ihnen zu hören!
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">2</span>
                                        Was wir tun
                                    </h4>
                                    <p className="text-gray-600 font-light leading-relaxed text-sm">
                                        Wir überlassen nichts dem Zufall. Wir analysieren genau, was Ihre Kunden suchen und bereiten Ihre Daten so auf, dass KI-Modelle wie ChatGPT Sie als beste Antwort empfehlen. Die meisten Websites sind darauf nicht vorbereitet – das ist Ihr Wettbewerbsvorteil.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">3</span>
                                        Ihr Vorteil
                                    </h4>
                                    <p className="text-gray-600 font-light leading-relaxed text-sm">
                                        Sie bekommen nicht nur ein Design, sondern einen 24/7 Vertriebsmitarbeiter. Während andere für teure Werbeanzeigen zahlen müssen, kommen Kunden bei Ihnen organisch – also kostenlos – auf die Seite.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* The Comparison - "The Unfair Advantage" */}
                <div className="mt-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gray-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative"
                    >
                        {/* Abstract Background */}
                        <div className="absolute top-0 right-0 w-full h-full opacity-10">
                            <div className="absolute right-0 top-0 w-96 h-96 bg-red-600 rounded-full blur-[100px]" />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                            <div>
                                <h3 className="text-3xl font-light mb-6">
                                    {comparisonHeadline || <>Warum andere <span className="text-red-500 font-medium">extra kosten</span>,<br />und wir <span className="text-red-500 font-medium">mehr liefern</span>.</>}
                                </h3>
                                <p className="text-gray-400 text-lg font-light mb-8 leading-relaxed">
                                    Bei den meisten Agenturen ist SEO ein teures Zusatzpaket. Bei uns ist es das Fundament.
                                    Wir glauben: Eine Website ohne Sichtbarkeit ist wertlos.
                                </p>
                                <div className="flex gap-4">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-4xl font-bold text-white">99%</span>
                                        <span className="text-sm text-gray-400">Unsichtbare Websites</span>
                                    </div>
                                    <div className="w-px h-16 bg-gray-700" />
                                    <div className="flex flex-col gap-2">
                                        <span className="text-4xl font-bold text-red-500">Top 1%</span>
                                        <span className="text-sm text-gray-400">Dein Ziel mit uns</span>
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Card */}
                            <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 text-gray-900 shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                                {/* Comparison Table */}
                                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                                    <div className="grid grid-cols-3 bg-gray-900 text-white p-6 text-sm md:text-base font-medium">
                                        <div>Feature</div>
                                        <div className="text-center opacity-70">Standard Agentur</div>
                                        <div className="text-center text-red-500 font-bold">Red Rabbit</div>
                                    </div>

                                    {(comparisonItems || [
                                        { name: "Design", other: "Standard Template", us: "Premium Custom" },
                                        { name: "SEO Basics", other: "Extra Kosten", us: "Inklusive" },
                                        { name: "Ladezeit", other: "Oft langsam", us: "High-Speed" },
                                        { name: "AI-Ready", other: "Nicht vorhanden", us: "Standard" },
                                        { name: "Kosten", other: "Intransparent", us: "Fixpreis" }
                                    ]).map((row, index) => (
                                        <div key={index} className="grid grid-cols-3 p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                            <div className="font-medium text-gray-900">{row.name}</div>
                                            <div className="text-center text-gray-500">{row.other}</div>
                                            <div className="text-center text-red-600 font-medium flex items-center justify-center gap-2">
                                                <Check className="w-4 h-4" />
                                                {row.us}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default SeoOptimization;
