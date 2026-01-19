"use client";

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FAQ = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    // FAQ Data
    const faqData = [
        {
            question: "Was passiert, nachdem ich das Formular abgeschickt habe?",
            answer: "Du bekommst innerhalb von 24 Stunden eine persönliche Antwort – per Mail oder WhatsApp. Dann starten wir mit deinem Website-Vorschlag."
        },
        {
            question: "Muss ich wirklich nichts zahlen, wenn mir die Seite nicht gefällt?",
            answer: "Ganz genau. 0 Risiko. 0 Euro. 0 Aufwand. Wenn du sagst: \"Gefällt mir – macht fertig!\", zahlst du die 790 € netto. Davor musst du nichts tun."
        },
        {
            question: "Warum ist das so günstig – wo ist der Haken?",
            answer: "Es gibt keinen Haken. Wir wollen zeigen, was wir können – und langfristig Partner gewinnen. Deshalb bekommst du deine Website zum Fixpreis – ohne Risiko. Wir liefern dir erst Ergebnisse, bevor du zahlst. Fair und transparent."
        },
        {
            question: "Was ist im Preis von 790 € alles enthalten?",
            answer: "Eine komplette Premium-Website inkl. Mobiloptimierung, Kontaktformular, Google Maps, Cookie-Banner, SEO-Basics, QR-Code, Support u. v. m. – alles DSGVO-konform, mobil-optimiert & ready to go."
        },
        {
            question: "Wie schnell ist meine Website fertig?",
            answer: "In der Regel bekommst du innerhalb von 7 Tagen den ersten Entwurf. Du kannst dir alles in Ruhe ansehen und sagen, was wir ändern oder verbessern sollen. Danach setzen wir alles nach deinen Wünschen um."
        },
        {
            question: "Was ist nach der Fertigstellung – kann ich später noch etwas ändern lassen?",
            answer: "Du bekommst 6 Monate kostenlosen Support, wenn du etwas anpassen willst. Optional: Für 79 €/Monat kannst du ein Abo mit laufender Betreuung, regelmäßigen Anpassungen und weiteren Extras buchen. Kein Muss – nur ein Angebot."
        },
        {
            question: "Wie bezahle ich, wenn mir die Seite gefällt?",
            answer: "Du bekommst eine Rechnung über 790 € netto. Zahlung per Banküberweisung – einfach & sicher. Danach wird deine Website online geschaltet."
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
                            Häufig gestellte Fragen
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Alles was du wissen musst – einfach und verständlich erklärt
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto bg-white border border-gray-200">
                        {faqData.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default FAQ;
