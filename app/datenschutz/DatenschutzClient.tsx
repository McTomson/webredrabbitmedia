"use client";

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AOSWrapper } from '@/components/AnimatedSection';
import Image from 'next/image';

export default function Datenschutz() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-600">Zurück zur Startseite</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Image
                                src="/images/logo.webp"
                                alt="Red Rabbit Media"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="py-16">
                <div className="max-w-4xl mx-auto px-8">
                    <AOSWrapper animation="fade-up" delay={100}>
                        <div className="text-center mb-16">
                            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
                                Datenschutzerklärung
                            </h1>
                            <p className="text-xl text-gray-600">
                                Informationen zum Schutz Ihrer persönlichen Daten
                            </p>
                        </div>
                    </AOSWrapper>

                    <div className="space-y-12">
                        {/* Verantwortlicher */}
                        <AOSWrapper animation="fade-up" delay={200}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">1. Verantwortlicher</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p><strong>Red Rabbit GmbH</strong><br />
                                        Grabnergasse 8/8, 1060 Wien, Österreich<br />
                                        T: +43 676 9000 955<br />
                                        E: office@redrabbit.media<br />
                                        www.redrabbit.media</p>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Allgemeines */}
                        <AOSWrapper animation="fade-up" delay={300}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">2. Allgemeines</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p>Wir verarbeiten Ihre personenbezogenen Daten streng vertraulich und ausschließlich im Rahmen der gesetzlichen Vorschriften (DSGVO, TKG 2021). In dieser Datenschutzerklärung informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Website und Services.</p>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Welche Daten wir verarbeiten */}
                        <AOSWrapper animation="fade-up" delay={400}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">3. Welche Daten wir verarbeiten</h2>
                                <div className="space-y-6 text-gray-700">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">a) Bei Kontaktaufnahme & Angebotsanfrage</h3>
                                        <ul className="list-disc list-inside space-y-1 ml-4">
                                            <li>Name, E-Mail, Telefonnummer, Nachricht</li>
                                            <li>Zweck: Beantwortung Ihrer Anfrage, Angebotslegung</li>
                                            <li>Rechtsgrundlage: Art 6 Abs 1 lit b DSGVO (vorvertragliche Maßnahme)</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">b) Bei Nutzung unserer Website</h3>
                                        <ul className="list-disc list-inside space-y-1 ml-4">
                                            <li>IP-Adresse, Browsertyp, Betriebssystem, Datum & Uhrzeit des Zugriffs, besuchte Seiten</li>
                                            <li>Zweck: Systemsicherheit, Optimierung, Fehleranalyse</li>
                                            <li>Rechtsgrundlage: Art 6 Abs 1 lit f DSGVO (berechtigtes Interesse)</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">c) Newsletter / E-Mail-Marketing</h3>
                                        <ul className="list-disc list-inside space-y-1 ml-4">
                                            <li>E-Mail-Adresse, ggf. Name</li>
                                            <li>Zweck: Zusendung von Informationen, Angeboten</li>
                                            <li>Rechtsgrundlage: Art 6 Abs 1 lit a DSGVO (Einwilligung) oder Art 6 Abs 1 lit f DSGVO iVm § 107 TKG (Bestandskunden)</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">d) Cookies & Drittanbieter-Tools</h3>
                                        <p>(siehe Punkt 6)</p>
                                    </div>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Speicherdauer */}
                        <AOSWrapper animation="fade-up" delay={500}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">4. Speicherdauer</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p>Wir speichern Ihre Daten nur solange, wie dies für den jeweiligen Zweck erforderlich ist:</p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse border border-gray-300 mt-4">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Art der Daten</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Dauer</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2">Anfragen</td>
                                                    <td className="border border-gray-300 px-4 py-2">max. 12 Monate</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2">Vertrags-/Rechnungsdaten</td>
                                                    <td className="border border-gray-300 px-4 py-2">7 Jahre (steuerrechtlich)</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2">Newsletterdaten</td>
                                                    <td className="border border-gray-300 px-4 py-2">bis Widerruf</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2">Server-Logfiles</td>
                                                    <td className="border border-gray-300 px-4 py-2">14 Tage</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Datenweitergabe */}
                        <AOSWrapper animation="fade-up" delay={600}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">5. Datenweitergabe</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p>Daten werden ausschließlich im Rahmen der Auftragsverarbeitung an vertrauenswürdige Dienstleister übermittelt, z. B.:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Hosting-Anbieter (z. B. Vercel, All-Inkl, AWS)</li>
                                        <li>CRM-Systeme / E-Mail-Tools (z. B. Gmail, Brevo)</li>
                                        <li>Buchhaltung, Steuerberatung</li>
                                        <li>Webanalyse-/Marketing-Tools (siehe unten)</li>
                                    </ul>
                                    <p>Alle Empfänger sind vertraglich zur Einhaltung der DSGVO verpflichtet.</p>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Cookies & Webanalyse */}
                        <AOSWrapper animation="fade-up" delay={700}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">6. Cookies & Webanalyse</h2>
                                <div className="space-y-6 text-gray-700">
                                    <p>Beim Besuch unserer Website setzen wir Cookies und vergleichbare Technologien ein.</p>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">a) Technisch notwendige Cookies</h3>
                                        <ul className="list-disc list-inside space-y-1 ml-4">
                                            <li>Dienen der Grundfunktionalität (Session, Sprachauswahl, Sicherheit)</li>
                                            <li>Rechtsgrundlage: Art 6 Abs 1 lit f DSGVO</li>
                                            <li>Kein Consent erforderlich</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">b) Einwilligungspflichtige Cookies (Analytics / Marketing)</h3>
                                        <p className="mb-3">Diese Cookies werden nur mit Ihrer aktiven Zustimmung über unser Cookie-Banner gesetzt.</p>
                                        <p className="mb-3">Folgende Tools sind (möglicherweise) integriert:</p>
                                    </div>

                                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                                        <h4 className="text-lg font-medium text-gray-900 mb-3">Google Analytics 4</h4>
                                        <p className="mb-2"><strong>Anbieter:</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland</p>
                                        <ul className="list-disc list-inside space-y-1 ml-4">
                                            <li>Verwendet Cookies zur Analyse der Benutzung der Website</li>
                                            <li>IP-Anonymisierung aktiv</li>
                                            <li>Übermittlung in Drittstaaten (USA) kann stattfinden</li>
                                            <li>Rechtsgrundlage: Art 6 Abs 1 lit a DSGVO (Einwilligung)</li>
                                        </ul>
                                        <p className="mt-3 text-sm"><strong>Widerspruch:</strong> Sie können Ihre Einwilligung jederzeit über unser Cookie-Banner widerrufen.</p>
                                    </div>

                                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                                        <h4 className="text-lg font-medium text-gray-900 mb-3">Meta Pixel (Facebook Pixel)</h4>
                                        <p className="mb-2"><strong>Anbieter:</strong> Meta Platforms Ireland Ltd., 4 Grand Canal Square, Dublin 2, Irland</p>
                                        <ul className="list-disc list-inside space-y-1 ml-4">
                                            <li>Erfasst Nutzerverhalten zur Optimierung von Werbeanzeigen</li>
                                            <li>Ermöglicht Conversion-Tracking</li>
                                            <li>Rechtsgrundlage: Art 6 Abs 1 lit a DSGVO</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900 mb-3">Weitere mögliche Tools:</h4>
                                        <ul className="list-disc list-inside space-y-1 ml-4">
                                            <li>Google Tag Manager (verwaltungstechnisch, ohne Datenverarbeitung selbst)</li>
                                            <li>YouTube/Vimeo-Einbettung (bei eingebetteten Videos)</li>
                                            <li>Google Fonts lokal oder über API (DSGVO-relevant!)</li>
                                            <li>Hotjar, Matomo, LinkedIn Insight Tag – nur bei Bedarf</li>
                                        </ul>
                                        <p className="mt-3"><strong>Hinweis:</strong> Alle Dienste werden nur nach Ihrer Zustimmung über das Consent-Tool aktiviert. Ohne Zustimmung erfolgt keine Tracking-Verarbeitung.</p>
                                    </div>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Demo-Projekte */}
                        <AOSWrapper animation="fade-up" delay={800}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">7. Demo-Projekte</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p>Einige unserer gezeigten Websites befinden sich noch in Entwicklung oder wurden (noch) nicht durch den Kunden final abgenommen.</p>
                                    <p>Sie dienen ausschließlich der Vorschau und Darstellung unserer Leistungen.</p>
                                    <p>Alle verwendeten Inhalte bleiben Eigentum der jeweiligen Rechteinhaber.</p>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Ihre Rechte */}
                        <AOSWrapper animation="fade-up" delay={900}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">8. Ihre Rechte</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p>Sie haben das Recht auf:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Auskunft (Art 15 DSGVO)</li>
                                        <li>Berichtigung/Löschung (Art 16/17 DSGVO)</li>
                                        <li>Einschränkung der Verarbeitung (Art 18 DSGVO)</li>
                                        <li>Datenübertragbarkeit (Art 20 DSGVO)</li>
                                        <li>Widerspruch gegen Verarbeitung (Art 21 DSGVO)</li>
                                        <li>Widerruf Ihrer Einwilligung (Art 7 Abs 3 DSGVO)</li>
                                    </ul>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Kontakt Datenschutz */}
                        <AOSWrapper animation="fade-up" delay={1000}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">9. Kontakt Datenschutz</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p><strong>Red Rabbit GmbH</strong><br />
                                        Grabnergasse 8/8, 1060 Wien<br />
                                        T: +43 676 9000 955<br />
                                        E: office@redrabbit.media</p>
                                </div>
                            </section>
                        </AOSWrapper>
                    </div>
                </div>
            </main>
        </div>
    );
}
