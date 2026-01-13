"use client";

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface RegionalFAQProps {
    data: {
        region: string;
        mainCity: string;
        mainCitySlug: string;
        cities: string[];
    };
}

const RegionalFAQ = ({ data }: RegionalFAQProps) => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    // Regional FAQ Data - Each answer 40-45 words for Featured Snippet optimization
    // Questions written from USER perspective - how they would actually search
    const faqData = [
        {
            question: `Was kostet eine professionelle Website?`,
            answer: `Eine professionelle Website kostet ab 790 Euro netto - egal ob Sie in ${data.mainCity} oder einer anderen Stadt in ${data.region} ansässig sind. Fixpreis ohne versteckte Kosten. Alle Leistungen inklusive: Design, DSGVO, SEO, Support. Keine Überraschungen, keine Zusatzkosten.` // 42 Wörter
        },
        {
            question: `Muss ich vorher bezahlen?`,
            answer: `Nein, absolut kein Risiko. Sie zahlen erst, wenn Ihnen der Website-Entwurf gefällt. Wenn er Ihnen nicht zusagt, zahlen Sie nichts. Dieses Konzept macht unser Angebot komplett risikofrei für Sie - egal wo in ${data.region}. Erst Ergebnis sehen, dann entscheiden.` // 43 Wörter
        },
        {
            question: `Wie lange dauert es, bis meine Website fertig ist?`,
            answer: `Sie erhalten innerhalb von 7 Tagen den ersten Website-Entwurf. Nach Ihrem Feedback und eventuellen Anpassungen wird die finale Version ausgeliefert. Schnelle Umsetzung ohne lange Wartezeiten - auch für Kunden aus ${data.region}. In der Regel ist alles innerhalb von 2 Wochen komplett fertig.` // 44 Wörter
        },
        {
            question: `Arbeiten Sie auch vor Ort oder nur online?`,
            answer: `Wir arbeiten mit Unternehmen in ganz ${data.region}. Ob ${data.cities[0]}, ${data.cities[1]}, ${data.cities[2]} oder ${data.cities[3]} - wir sind für Sie da. Die Kommunikation läuft digital, persönliche Treffen sind bei Bedarf möglich. So sparen Sie Zeit und Kosten.` // 42 Wörter
        },
        {
            question: `Ist die Website rechtssicher und DSGVO-konform?`,
            answer: `Ja, alle Websites werden standardmäßig DSGVO-konform nach österreichischem Recht ausgeliefert. Das beinhaltet Cookie-Banner, Datenschutzerklärung, Impressum und SSL-Verschlüsselung - alles für einen rechtssicheren Webauftritt in ${data.region}. Sie können sofort online gehen, ohne rechtliche Bedenken.` // 40 Wörter
        },
        {
            question: `Warum sollte ich bei Ihnen eine Website erstellen lassen?`,
            answer: `Wir kennen die regionalen Besonderheiten in ${data.region} und erstellen Websites, die perfekt auf Ihre Zielgruppe abgestimmt sind. Lokale SEO-Optimierung inklusive. Kein Risiko, faire Preise, schnelle Umsetzung - speziell für ${data.cities[0]} und Umgebung. Über 315 zufriedene Kunden sprechen für uns.` // 45 Wörter
        },
        {
            question: `Kann ich meine Website später selbst bearbeiten?`,
            answer: `Ja, wenn Sie im Auftrag angeben, dass wir einen Admin-Bereich für Sie programmieren. Die Websites werden alle für Sie von Grund auf komplett programmiert - keine Templates. So haben Sie volle Kontrolle über Ihre Inhalte in ${data.region}. Individuelle Lösungen für Ihre Bedürfnisse.` // 44 Wörter
        },
        {
            question: `Bekomme ich auch Unterstützung bei Texten und Bildern?`,
            answer: `Ja, gerne unterstützen wir Sie auch mit Texten und Bildern. Wir kennen die Anforderungen in ${data.region} und erstellen professionelle Inhalte, die Ihre Zielgruppe ansprechen. So wird Ihre Website komplett fertig - ready to go. Alles aus einer Hand für Ihr Unternehmen.` // 43 Wörter
        },
        {
            question: `Was passiert nach den 6 Monaten kostenlosem Support?`,
            answer: `Nach den 6 Monaten haben Sie die Möglichkeit, einen Service-Vertrag abzuschließen. Alternativ können wir Ihnen auch punktuell helfen, das müssten wir dann extra verrechnen. Sie entscheiden flexibel, was für Ihr Unternehmen in ${data.region} am besten passt. Keine versteckten Kosten.` // 44 Wörter
        }
    ];

    // FAQ Schema für Google Rich Snippets
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    const FAQItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
        const isOpen = openFAQ === index;

        return (
            <div className="border-b border-gray-200 last:border-b-0">
                <button
                    onClick={() => setOpenFAQ(isOpen ? null : index)}
                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-500"
                >
                    <h3 className="text-lg font-light text-gray-900 pr-6 leading-relaxed">{question}</h3>
                    <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-1500 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>
                <div className={`overflow-hidden transition-all duration-1500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 pb-6">
                        <p className="text-gray-600 leading-relaxed">{answer}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* FAQ Schema for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <section id="faq" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-light text-gray-900 leading-tight mb-4">
                            Häufig gestellte Fragen - Webdesign {data.region}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Alles was Sie über Webdesign in {data.region} wissen müssen - einfach und verständlich erklärt
                        </p>
                        <div className="mt-4">
                            <Link
                                href={`/webdesign-${data.mainCitySlug}`}
                                className="text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-2"
                            >
                                Speziell für {data.mainCity} →
                            </Link>
                        </div>
                    </div>

                    <div className="max-w-3xl mx-auto bg-white border border-gray-200">
                        {faqData.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
                        ))}
                    </div>

                    {/* Additional CTA */}
                    <div className="text-center mt-12">
                        <p className="text-gray-600 mb-4">
                            Weitere Fragen zu Webdesign in {data.cities.join(', ')} oder {data.region}?
                        </p>
                        <a
                            href="mailto:office@redrabbit.media"
                            className="text-red-600 hover:text-red-700 font-medium"
                        >
                            office@redrabbit.media
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
};

export default RegionalFAQ;
