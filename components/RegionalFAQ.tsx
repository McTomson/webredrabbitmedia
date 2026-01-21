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

    // Regional FAQ Data
    const genericFaqData = [
        {
            question: `Was kostet eine professionelle Website?`,
            answer: `Eine professionelle Website kostet ab 790 Euro netto - egal ob Sie in ${data.mainCity} oder einer anderen Stadt in ${data.region} ansässig sind. Fixpreis ohne versteckte Kosten. Alle Leistungen inklusive: Design, DSGVO, SEO, Support. Keine Überraschungen, keine Zusatzkosten.`
        },
        {
            question: `Muss ich vorher bezahlen?`,
            answer: `Nein, absolut kein Risiko. Sie zahlen erst, wenn Ihnen der Website-Entwurf gefällt. Wenn er Ihnen nicht zusagt, zahlen Sie nichts. Dieses Konzept macht unser Angebot komplett risikofrei für Sie - egal wo in ${data.region}. Erst Ergebnis sehen, dann entscheiden.`
        },
        {
            question: `Wie lange dauert es, bis meine Website fertig ist?`,
            answer: `Sie erhalten innerhalb von 7 Tagen den ersten Website-Entwurf. Nach Ihrem Feedback und eventuellen Anpassungen wird die finale Version ausgeliefert. Schnelle Umsetzung ohne lange Wartezeiten - auch für Kunden aus ${data.region}. In der Regel ist alles innerhalb von 2 Wochen komplett fertig.`
        },
        {
            question: `Arbeiten Sie auch vor Ort oder nur online?`,
            answer: `Wir arbeiten mit Unternehmen in ganz ${data.region}. Ob ${data.cities[0]}, ${data.cities[1]}, ${data.cities[2]} oder ${data.cities[3]} - wir sind für Sie da. Die Kommunikation läuft digital, persönliche Treffen sind bei Bedarf möglich. So sparen Sie Zeit und Kosten.`
        },
        {
            question: `Ist die Website rechtssicher und DSGVO-konform?`,
            answer: `Ja, alle Websites werden standardmäßig DSGVO-konform nach österreichischem Recht ausgeliefert. Das beinhaltet Cookie-Banner, Datenschutzerklärung, Impressum und SSL-Verschlüsselung - alles für einen rechtssicheren Webauftritt in ${data.region}. Sie können sofort online gehen, ohne rechtliche Bedenken.`
        },
        {
            question: `Warum sollte ich bei Ihnen eine Website erstellen lassen?`,
            answer: `Wir kennen die regionalen Besonderheiten in ${data.region} und erstellen Websites, die perfekt auf Ihre Zielgruppe abgestimmt sind. Lokale SEO-Optimierung inklusive. Kein Risiko, faire Preise, schnelle Umsetzung - speziell für ${data.cities[0]} und Umgebung. Über 315 zufriedene Kunden sprechen für uns.`
        },
        {
            question: `Kann ich meine Website später selbst bearbeiten?`,
            answer: `Ja, wenn Sie im Auftrag angeben, dass wir einen Admin-Bereich für Sie programmieren. Die Websites werden alle für Sie von Grund auf komplett programmiert - keine Templates. So haben Sie volle Kontrolle über Ihre Inhalte in ${data.region}. Individuelle Lösungen für Ihre Bedürfnisse.`
        },
        {
            question: `Bekomme ich auch Unterstützung bei Texten und Bildern?`,
            answer: `Ja, gerne unterstützen wir Sie auch mit Texten und Bildern. Wir kennen die Anforderungen in ${data.region} und erstellen professionelle Inhalte, die Ihre Zielgruppe ansprechen. So wird Ihre Website komplett fertig - ready to go. Alles aus einer Hand für Ihr Unternehmen.`
        },
        {
            question: `Was passiert nach den 6 Monaten kostenlosem Support?`,
            answer: `Nach den 6 Monaten haben Sie die Möglichkeit, einen Service-Vertrag abzuschließen. Alternativ können wir Ihnen auch punktuell helfen, das müssten wir dann extra verrechnen. Sie entscheiden flexibel, was für Ihr Unternehmen in ${data.region} am besten passt. Keine versteckten Kosten.`
        }
    ];

    const ooeFaqData = [
        {
            question: "Sind Sie eine lokale Agentur in Oberösterreich?",
            answer: "Wir haben unseren Hauptsitz in Wien, sind aber in ganz Oberösterreich mobil für Sie da. Von Linz bis Steyr, vom Innviertel bis ins Salzkammergut betreuen wir über 156 zufriedene Kunden. Auf Wunsch kommen wir für ein persönliches Gespräch auch gerne zu Ihnen."
        },
        {
            question: "Was kostet eine Website in Oberösterreich?",
            answer: "Bei uns erhalten Sie eine professionelle Website ab 790 € netto. Das ist ein Fixpreis, der Design, Programmierung, SEO-Optimierung und DSGVO-Konformität beinhaltet. Keine versteckten Kosten, keine monatlichen Mietgebühren für die Website selbst."
        },
        {
            question: "Wie schnell ist die Seite fertig?",
            answer: "Wir wissen, dass es in OÖ oft schnell gehen muss. Deshalb erhalten Sie den ersten Design-Entwurf innerhalb von nur 7 Tagen. Die komplette Fertigstellung dauert meistens ca. 2 Wochen – abhängig davon, wie schnell wir Ihr Feedback erhalten."
        },
        {
            question: "Was kostet eine Website mit Webshop?",
            answer: "Einen vollwertigen Online-Shop realisieren wir bereits ab 980 €. Damit können Sie Ihre Produkte direkt online verkaufen – ideal für regionale Händler und Produzenten in Oberösterreich, die ihren Kundenstamm digital erweitern möchten."
        },
        {
            question: "Was brauchen Sie von mir?",
            answer: "Fast nichts! Wir machen Ihnen proaktiv Vorschläge für Design und Texte. Wenn Sie bereits eine alte Website haben, übernehmen wir gerne bestehende Inhalte. Wenn nicht, erstellen wir alles neu. Sie müssen uns nur sagen, ob es Ihnen gefällt – wir kümmern uns um den Rest."
        },

        {
            question: "Bieten Sie Vor-Ort-Termine in OÖ an?",
            answer: "Ja, wir schätzen den persönlichen Kontakt. Für größere Projekte oder wenn Sie es wünschen, kommen wir gerne zu einem Beratungsgespräch in Ihren Betrieb – egal ob in Linz, Wels, Steyr oder im ländlichen Raum."
        }
    ];

    const noeFaqData = [
        {
            question: "Was kostet eine Webseite für mein Unternehmen in Niederösterreich?",
            answer: "Eine professionelle Webseite kostet bei uns ab 790 € Fixpreis. Keine versteckten Kosten, keine monatlichen Gebühren. Egal ob Sie in St. Pölten, Krems oder einem kleinen Ort im Waldviertel ansässig sind – der Preis bleibt gleich."
        },
        {
            question: "Muss ich für ein Treffen in ein Büro kommen?",
            answer: "Nein, alles läuft online. Sie müssen nirgendwo hinfahren. Das spart Ihnen Zeit und Aufwand. Die Kommunikation erfolgt digital über E-Mail und Telefon. Kein Zeitverlust für Sie."
        },
        {
            question: "Wie lange dauert die Erstellung meiner Webseite?",
            answer: "In der Regel erhalten Sie den ersten Entwurf innerhalb von 7 Tagen. Nach Ihrer Freigabe und eventuellen Anpassungen ist die Webseite meist innerhalb von 2-3 Wochen komplett fertig und online."
        },
        {
            question: "Arbeitet ihr auch im Waldviertel / Weinviertel / Mostviertel / Industrieviertel?",
            answer: "Ja, wir betreuen Kunden in ganz Niederösterreich. Vom Waldviertel bis ins Industrieviertel, von kleinen Orten bis zu größeren Städten wie Wiener Neustadt oder Baden. Die Zusammenarbeit läuft komplett digital."
        },
        {
            question: "Was ist, wenn mir die Webseite nicht gefällt?",
            answer: "Sie zahlen erst, wenn Sie mit dem Ergebnis zufrieden sind. Wenn Ihnen der Entwurf nicht gefällt, zahlen Sie nichts. Kein Risiko für Sie. Das ist unsere Zufriedenheitsgarantie."
        },
        {
            question: "Bekomme ich auch Hilfe bei Texten und Bildern?",
            answer: "Ja, gerne unterstützen wir Sie auch mit Texten und Bildern. Wir erstellen professionelle Inhalte, die Ihre Zielgruppe ansprechen. So wird Ihre Webseite komplett fertig – ready to go. Alles aus einer Hand."
        },
        {
            question: "Was passiert, wenn ich später Änderungen brauche?",
            answer: "In den ersten 6 Monaten ist der Support kostenlos. Danach können Sie entweder einen Service-Vertrag abschließen oder wir helfen Ihnen punktuell gegen Verrechnung. Sie entscheiden flexibel, was für Sie am besten passt."
        }
    ];

    const faqData = data.region === "Oberösterreich" ? ooeFaqData : data.region === "Niederösterreich" ? noeFaqData : genericFaqData;

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
