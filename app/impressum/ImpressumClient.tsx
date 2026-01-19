"use client";

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AOSWrapper } from '@/components/AnimatedSection';
import Image from 'next/image';

export default function Impressum() {
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
                                Impressum
                            </h1>
                            <p className="text-xl text-gray-600">
                                Rechtliche Informationen über Red Rabbit Media
                            </p>
                        </div>
                    </AOSWrapper>

                    <div className="space-y-12">
                        {/* Firmenangaben */}
                        <AOSWrapper animation="fade-up" delay={200}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">Firmenangaben</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p><strong>Red Rabbit GmbH</strong></p>
                                    <p>Grabnergasse 8/8<br />
                                        1060 Wien, Österreich</p>

                                    <div className="mt-6 space-y-2">
                                        <p><strong>Firmenbuchnummer:</strong> FN 516936 a</p>
                                        <p><strong>Firmenbuchgericht:</strong> Handelsgericht Wien</p>
                                        <p><strong>UID-Nummer:</strong> ATU 74636904</p>
                                    </div>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Kontakt */}
                        <AOSWrapper animation="fade-up" delay={300}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">Kontakt</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p><strong>Telefon:</strong> +43 676 9000 955</p>
                                    <p><strong>E-Mail:</strong> office@redrabbit.media</p>
                                    <p><strong>Web:</strong> www.redrabbit.media</p>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Unternehmensgegenstand */}
                        <AOSWrapper animation="fade-up" delay={400}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">Unternehmensgegenstand</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p><strong>Unternehmensgegenstand:</strong> Webdesign & digitale Dienstleistungen</p>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Mitgliedschaften */}
                        <AOSWrapper animation="fade-up" delay={500}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">Mitgliedschaften & Rechtliche Grundlagen</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p>Mitglied der Wirtschaftskammer Wien</p>
                                    <p><strong>Gewerbeordnung:</strong> <a href="https://www.ris.bka.gv.at" className="text-red-600 hover:text-red-700" target="_blank" rel="noopener noreferrer">www.ris.bka.gv.at</a></p>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Datenschutzerklärung */}
                        <AOSWrapper animation="fade-up" delay={600}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">🔒 Datenschutzerklärung</h2>
                                <div className="space-y-6 text-gray-700">
                                    <p>Red Rabbit GmbH (im Folgenden &quot;wir&quot;) verarbeitet personenbezogene Daten ausschließlich auf Grundlage der gesetzlichen Vorgaben (insb. DSGVO, TKG 2021).</p>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">1. Welche Daten wir verarbeiten</h3>
                                        <ul className="list-disc list-inside space-y-1 ml-4">
                                            <li>Name, E-Mail, Telefonnummer, Unternehmensdaten (bei Anfragen, Bestellungen etc.)</li>
                                            <li>technische Daten (z. B. IP-Adresse, Browsertyp, Zugriffszeitpunkte beim Besuch der Website)</li>
                                            <li>ggf. Inhalte von Kontaktformularen</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">2. Zweck und Rechtsgrundlagen</h3>
                                        <p className="mb-2">Wir verarbeiten deine Daten zur:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-4">
                                            <li>Anbahnung und Erfüllung von Verträgen (Art 6 Abs 1 lit b DSGVO)</li>
                                            <li>Erfüllung rechtlicher Verpflichtungen (Art 6 Abs 1 lit c DSGVO)</li>
                                            <li>Direktwerbung, Marketing & Kundengewinnung (berechtigtes Interesse, Art 6 Abs 1 lit f DSGVO)</li>
                                            <li>Nur mit Einwilligung: Newsletter & Datenweitergabe an Dritte (Art 6 Abs 1 lit a DSGVO)</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">3. Speicherdauer</h3>
                                        <p className="mb-2">Wir speichern personenbezogene Daten nur so lange, wie es notwendig ist:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-4">
                                            <li>Vertragliche und steuerliche Aufbewahrungspflichten: bis zu 7 bzw. 12 Jahre</li>
                                            <li>Für Marketingzwecke: bis zum Widerruf oder Wegfall des berechtigten Interesses</li>
                                            <li>Bei laufenden Verfahren: entsprechend gesetzlicher Verjährungsfristen (bis zu 30 Jahre)</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">4. Weitergabe an Dritte</h3>
                                        <p>Daten werden nur an Auftragsverarbeiter (z. B. Hosting, IT, Buchhaltung) weitergegeben, sofern erforderlich. Alle Dritten sind vertraglich zur DSGVO-konformen Verarbeitung verpflichtet.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">5. Verpflichtung zur Datenbereitstellung</h3>
                                        <p>Die Bereitstellung personenbezogener Daten ist zur Vertragserfüllung erforderlich. Ohne diese Daten ist ein Vertragsabschluss nicht möglich.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">6. Cookies</h3>
                                        <p className="mb-2">Unsere Website verwendet technisch notwendige und funktionale Cookies, um die Darstellung zu optimieren und Angriffe abzuwehren. Diese Cookies benötigen keine Einwilligung (Art 6 Abs 1 lit f DSGVO).</p>
                                        <p>Du kannst Cookies über deinen Browser jederzeit deaktivieren. Die Funktionalität der Website kann dadurch eingeschränkt sein.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">7. Automatisierte Entscheidungsfindung</h3>
                                        <p>Wir treffen keine automatisierten Entscheidungen im Sinne von Art 22 DSGVO.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">8. Deine Rechte</h3>
                                        <p className="mb-2">Du hast jederzeit das Recht auf:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-4">
                                            <li>Auskunft (Art 15 DSGVO)</li>
                                            <li>Berichtigung (Art 16 DSGVO)</li>
                                            <li>Löschung (Art 17 DSGVO)</li>
                                            <li>Einschränkung der Verarbeitung (Art 18 DSGVO)</li>
                                            <li>Widerspruch (Art 21 DSGVO)</li>
                                            <li>Datenübertragbarkeit (Art 20 DSGVO)</li>
                                            <li>Widerruf erteilter Einwilligungen (Art 7 DSGVO)</li>
                                        </ul>
                                        <p className="mt-3">Wenn du glaubst, dass wir deine Rechte verletzt haben, kannst du dich bei der Datenschutzbehörde beschweren: <a href="https://www.dsb.gv.at" className="text-red-600 hover:text-red-700" target="_blank" rel="noopener noreferrer">www.dsb.gv.at</a></p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">9. Kontakt für Datenschutzanfragen</h3>
                                        <p>Red Rabbit GmbH<br />
                                            Grabnergasse 8/8, 1060 Wien<br />
                                            T: +43 676 9000 955<br />
                                            E: office@redrabbit.media</p>
                                    </div>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Hinweis zu Demo-Seiten */}
                        <AOSWrapper animation="fade-up" delay={700}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">⚠️ Hinweis zu Demo-Seiten</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p>Die auf dieser Website gezeigten Beispielseiten und Projekt-Demos befinden sich teilweise in Bearbeitung und wurden noch nicht final vom Kunden freigegeben. Sie dienen ausschließlich als Designvorschau. Alle dargestellten Marken, Texte und Bilder bleiben Eigentum der jeweiligen Rechteinhaber.</p>
                                </div>
                            </section>
                        </AOSWrapper>
                    </div>
                </div>
            </main>
        </div>
    );
}
