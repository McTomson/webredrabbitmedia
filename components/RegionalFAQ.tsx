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
            question: "Wie läuft das Ganze ab?",
            answer: "Ganz unkompliziert. Wir sprechen kurz über Ihre Wünsche, dann erstellen wir einen ersten Entwurf. Den bekommen Sie nach einer Woche zugeschickt. Wenn er Ihnen gefällt, finalisieren wir die Seite. Wenn nicht, zahlen Sie nichts."
        },
        {
            question: "Muss ich im Voraus etwas zahlen?",
            answer: "Nein. Sie zahlen erst, wenn das Ergebnis für Sie passt. Wir wollen, dass Sie zufrieden sind, nicht dass Sie die Katze im Sack kaufen."
        },
        {
            question: "Kann ich den Auftrag stornieren, wenn mir der Entwurf nicht gefällt?",
            answer: "Ja. Das ist unser Risiko, nicht Ihres. Wenn der Design-Vorschlag nicht Ihren Vorstellungen entspricht, sind Sie zu nichts verpflichtet."
        },
        {
            question: "Warum Red Rabbit Media und keine andere Agentur?",
            answer: "Wir sind schneller und technologisch moderner als die meisten klassischen Agenturen. Wir nutzen keine veralteten Baukästen, sondern programmieren individuell (Next.js). Das merken Sie an der Geschwindigkeit und Google an der Qualität."
        },
        {
            question: "Sind die Websites auch für Google optimiert (SEO)?",
            answer: "Absolut. Geschwindigkeit und saubere Technik sind die wichtigsten Faktoren für Google heute. Da sind unsere Seiten meist weit vor der Konkurrenz. Die technische Basis für gute Rankings ist also perfekt gelegt."
        },
        {
            question: "Was kostet mich die Website am Ende?",
            answer: "Das Basispaket kostet 790 € netto. Das ist ein Fixpreis. Domain & Hosting kosten extra (ca. 10-15€ im Monat bei einem Anbieter Ihrer Wahl), aber die Erstellung der Seite bleibt beim vereinbarten Preis."
        }
    ];

    const ooeFaqData = [
        {
            question: "Sind Sie eine lokale Agentur in Oberösterreich?",
            answer: "Wir haben unseren Hauptsitz in Wien, sind aber in ganz Oberösterreich mobil für Sie da. Von Linz bis Steyr, vom Innviertel bis ins Salzkammergut betreuen wir über 156 zufriedene Kunden. Auf Wunsch kommen wir für ein persönliches Gespräch auch gerne zu Ihnen."
        },
        {
            question: "Was kostet eine Website in Oberösterreich?",
            answer: "Bei uns erhalten Sie eine professionelle Website ab 790 € netto (Basis-Paket inkl. 4 Seiten). Das ist ein Fixpreis für diesen Umfang, der Design, Programmierung, SEO-Optimierung und DSGVO-Konformität beinhaltet. Mehr Seiten oder individuelle Anforderungen sind flexibel möglich."
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

    const wienFaqData = [
        {
            question: "Wie läuft das Ganze ab?",
            answer: "Ganz entspannt. Wir telefonieren kurz oder machen einen Video-Call, um zu verstehen, was Sie brauchen. Innerhalb von 7 Tagen bekommen Sie den ersten fertigen Design-Entwurf. Erst wenn Sie sagen 'Ja, das ist es', machen wir den Rest fertig."
        },
        {
            question: "Muss ich im Voraus etwas zahlen?",
            answer: "Nein. Wir gehen in Vorleistung. Sie zahlen erst, wenn Sie mit dem Design zu 100% zufrieden sind. Kein Risiko, keine Katze im Sack."
        },
        {
            question: "Kann ich auch 'Nein' sagen, wenn mir der Entwurf nicht gefällt?",
            answer: "Ja, absolut. Wenn Ihnen unser Vorschlag nicht gefällt und wir keine gemeinsame Lösung finden, müssen Sie nichts bezahlen. Wir trennen uns dann einfach wieder. Das kommt aber so gut wie nie vor."
        },
        {
            question: "Warum sollte ich bei euch buchen und nicht woanders?",
            answer: "Weil wir keine leeren Versprechungen machen. Wir sind schnell (Wien-Tempo), wir sind direkt und wir liefern Premium-Qualität zum Fixpreis, wo andere Agenturen oft das Dreifache verlangen. Und: Wir programmieren alles selbst (Next.js), was Ihre Seite extrem schnell und sicher macht."
        },
        {
            question: "Sind eure Websites auch schnell und SEO-optimiert?",
            answer: "Ja, extrem schnell. Da wir keinen Baukasten (wie Wordpress oder Wix) nutzen, sondern moderne Technologie (Next.js), laden unsere Seiten blitzschnell. Google liebt das – und technische SEO-Optimierung für Wien ist bei uns immer standardmäßig dabei."
        },
        {
            question: "Was kostet das wirklich? Gibt es versteckte Kosten?",
            answer: "Es bleibt bei ab 790 € netto für das Standard-Paket (4 Seiten). Das ist ein Fixpreis. Wenn Sie später spezielle Extra-Wünsche haben, sagen wir Ihnen vorher genau, was das kostet. Keine Überraschungen."
        }
    ];

    const kaerntenFaqData = [
        {
            question: "Was kostet eine Website in Kärnten?",
            answer: "Professionelles Webdesign startet bei uns ab 790 € netto (Basis-Paket inkl. 4 Seiten). Egal ob Sie in Klagenfurt, Villach oder Wolfsberg ansässig sind – der Preis ist transparent und fair, ohne monatliche Mietgebühren für die Webpräsenz selbst."
        },
        {
            question: "Haben Sie Erfahrung mit Tourismus-Websites in Kärnten?",
            answer: "Ja, wir betreuen viele Kunden im Bereich Gastronomie und Beherbergung. Wir wissen, wie man die Kärntner Gastfreundschaft digital übersetzt und Buchungsanfragen generiert."
        },
        {
            question: "Muss ich eine Vorkasse leisten?",
            answer: "Nein. Sie gehen kein Risiko ein. Wir erstellen zuerst einen Design-Entwurf. Erst wenn Ihnen dieser zu 100% gefällt, beauftragen Sie uns final. Das ist unsere Zufriedenheitsgarantie für Kärnten."
        },
        {
            question: "Was ist nach der Fertigstellung – kann ich die Seite selbst pflegen?",
            answer: "Auf Wunsch programmieren wir Ihnen einen Admin-Bereich, mit dem Sie Texte und Bilder einfach selbst ändern können. So bleiben Sie flexibel und unabhängig."
        },
        {
            question: "Sind die Seiten DSGVO-konform für Kärntner Betriebe?",
            answer: "Selbstverständlich. Datenschutz nach österreichischem Recht, SSL-Verschlüsselung und ein rechtssicheres Impressum sind bei jedem Projekt inklusive."
        }
    ];

    const salzburgFaqData = [
        {
            question: "Was kostet Full-Service Webdesign in Salzburg?",
            answer: "Wir realisieren hochwertige Webauftritte ab 790 € netto (inkl. 4 Seiten). In Salzburg setzen wir auf Exzellenz und Detailliebe – dieser Fixpreis für das Basis-Paket beinhaltet von Design bis SEO alles Wesentliche."
        },
        {
            question: "Sind Sie auch für Export-Unternehmen in Salzburg tätig?",
            answer: "Ja, wir strukturieren Webseiten so, dass sie auch auf internationalen Märkten perfekt performen. Wir nutzen modernste Next.js Technik für weltweite Höchstgeschwindigkeit."
        },
        {
            question: "Wie erfolgt die Zusammenarbeit, wenn ich nicht in Wien bin?",
            answer: "Wir arbeiten mit Salzburger Kunden zu 100% digital und effizient. Das hat sich über Hunderte Projekte bewährt. Wir sind per Video-Call und Telefon immer für Sie erreichbar – oft schneller als eine lokale Agentur."
        },
        {
            question: "Wie sieht es mit der Wartung und Updates aus?",
            answer: "In den ersten 6 Monaten ist unser technischer Support komplett kostenlos. Danach bieten wir faire Service-Pakete an, damit Ihre Website immer sicher und aktuell bleibt."
        },
        {
            question: "Können Sie auch beim Content (Texte/Bilder) helfen?",
            answer: "Sehr gerne. Wir wissen, wie man die Salzburger Qualität in Worte fasst und bereiten Ihre Inhalte suchmaschinen- und KI-gerecht auf."
        }
    ];

    const tirolFaqData = [
        {
            question: "Was kostet eine neue Website für Tiroler Betriebe?",
            answer: "Eine professionelle Website kostet bei uns ab 790 € netto (inkl. 4 Seiten). Keine Abos, keine monatliche Miete. Ein ehrliches Angebot für Tiroler Handschlagqualität – transparent und fair."
        },
        {
            question: "Ist die Website mobil optimiert für Gäste in Tirol?",
            answer: "Absolut. In Tirol suchen viele Gäste von unterwegs nach Leistungen. Wir garantieren 'High-Performance Mobile Design', das auch bei schwankender Netzabdeckung pfeilschnell lädt."
        },
        {
            question: "Was ist Ihr technischer Vorteil gegenüber Baukästen?",
            answer: "Wir programmieren alles von Grund auf mit Next.js. Das bedeutet: Bessere Google-Rankings, höhere Sicherheit und eine Website, die auch in 5 Jahren noch modern ist – kein Vergleich zu starren Baukasten-Systemen."
        },
        {
            question: "Muss ich mich um das Hosting kümmern?",
            answer: "Wir beraten Sie gerne bei der Auswahl des richtigen Hosters in Österreich und übernehmen die komplette technische Einrichtung für Sie."
        },
        {
            question: "Arbeiten Sie auch für kleine Gewerbebetriebe in Tirol?",
            answer: "Ja, unser Modell ist ideal für KMUs und Einpersonenunternehmen in Tirol, die einen professionellen Auftritt ohne Agentur-Overhead suchen."
        }
    ];

    const vorarlbergFaqData = [
        {
            question: "Was kostet Webdesign mit Ländle-Präzision?",
            answer: "Wir bieten professionelle Lösungen ab 790 € netto an (Basis-Paket inkl. 4 Seiten). In Vorarlberg zählt das Ergebnis – unser Paket beinhaltet alles, was Sie für einen erfolgreichen Start im Netz brauchen."
        },
        {
            question: "Wie sicher ist meine Website bei Ihnen?",
            answer: "Sicherheit steht bei uns an oberster Stelle. Wir nutzen modernste Frameworks, die von Natur aus gegen viele Angriffe immun sind. Ideal für anspruchsvolle Vorarlberger Unternehmen."
        },
        {
            question: "Wie läuft der Prozess der Erstellung ab?",
            answer: "Strukturiert und effizient. Nach einem kurzen Strategiegespräch erstellen wir den Entwurf. Sie geben Feedback, wir finalisieren. In maximal 14 Tagen ist Ihr Vorarlberger Unternehmen digital top aufgestellt."
        },
        {
            question: "Unterstützen Sie auch bei der Suchmaschinenoptimierung?",
            answer: "SEO ist bei uns kein Extra, sondern das Fundament. Wir optimieren Ihren Auftritt für das Ländle und darüber hinaus, damit Sie gefunden werden, wo Ihre Kunden suchen."
        },
        {
            question: "Gibt es eine Zufriedenheitsgarantie?",
            answer: "Ja. Wir arbeiten nach dem Prinzip: Erst Entwurf, dann Auftrag. Sie beauftragen uns erst final, wenn Ihnen der Design-Vorschlag absolut zusagt. Kein Risiko für Sie."
        }
    ];

    const noeFaqData = [
        {
            question: "Was kostet eine Webseite für mein Unternehmen in Niederösterreich?",
            answer: "Eine professionelle Webseite kostet bei uns ab 790 € (Basis-Paket inkl. 4 Seiten). Keine monatlichen Gebühren für die Erstellung. Egal ob Sie in St. Pölten, Krems oder im Waldviertel ansässig sind – der Startpreis bleibt gleich und fair."
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

    const steiermarkFaqData = [
        {
            question: "Was kostet eine professionelle Website in der Steiermark?",
            answer: `Bei uns erhalten Sie eine High-End Website ab einem Fixpreis von 790 € netto (inkl. 4 Seiten). Dieses Angebot gilt für alle steirischen Unternehmen. Wir garantieren volle Kostentransparenz; größere Projekte mit mehr Seiten kalkulieren wir individuell und fair.`
        },
        {
            question: "Warum ist Ihre Webagentur die richtige Wahl für steirische Unternehmen?",
            answer: "Wir vereinen modernste Technik (Next.js) mit einem tiefen Verständnis für den lokalen Markt. Wir bauen keine Standard-Seiten, sondern maßgeschneiderte Vertriebskanäle, die Ihre regionale Sichtbarkeit in der Steiermark massiv erhöhen."
        },
        {
            question: "Muss ich eine Vorkasse leisten?",
            answer: "Nein. Wir arbeiten rein erfolgsbasiert nach dem 'Zuerst sehen, dann zahlen'-Prinzip. Sie erhalten zuerst einen fertigen Design-Entwurf Ihrer neuen Website. Nur wenn Sie zu 100% zufrieden sind, beauftragen Sie uns final. Damit tragen Sie absolut kein Risiko."
        },
        {
            question: "Wie schnell kann meine Website online gehen?",
            answer: "Zeit ist Geld, besonders im steirischen Gewerbe. Den ersten Entwurf präsentieren wir Ihnen bereits innerhalb von 7 Werktagen. Bei zügigem Feedback ist die gesamte Website meist innerhalb von 14 Tagen live und einsatzbereit."
        },
        {
            question: "Arbeiten Sie auch vor Ort in Graz oder Leoben?",
            answer: "Unser Prozess ist für maximale Effizienz digital optimiert, was uns erlaubt, die attraktiven Fixpreise zu halten. Dennoch betreuen wir Kunden in der gesamten Steiermark persönlich via Video-Call und Telefon. Auf Wunsch und bei größeren Projekten sind auch Termine vor Ort möglich."
        },
        {
            question: "Ist die Website für Google und KI (ChatGPT) optimiert?",
            answer: "Absolut. Suchmaschinenoptimierung (SEO) ist bei uns kein Zusatzprodukt, sondern das Fundament. Zusätzlich strukturieren wir Ihre Daten so, dass moderne KI-Systeme Ihr Unternehmen als beste Antwort in der Region Steiermark empfehlen."
        },
        {
            question: "Was passiert nach der Fertigstellung?",
            answer: "Sie erhalten in den ersten 6 Monaten vollen technischen Support inklusive. Danach entscheiden Sie flexibel, ob Sie die Wartung selbst übernehmen oder einen unserer transparenten Service-Verträge nutzen möchten."
        }
    ];

    const faqData = data.region === "Oberösterreich" ? ooeFaqData :
        data.region === "Niederösterreich" ? noeFaqData :
            data.region === "Steiermark" ? steiermarkFaqData :
                data.region === "Wien" ? wienFaqData :
                    data.region === "Kärnten" ? kaerntenFaqData :
                        data.region === "Salzburg" ? salzburgFaqData :
                            data.region === "Tirol" ? tirolFaqData :
                                data.region === "Vorarlberg" ? vorarlbergFaqData :
                                    genericFaqData;

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
