"use client";

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AOSWrapper } from '@/components/AnimatedSection';
import Image from 'next/image';

export default function AGB() {
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
                                📄 Allgemeine Geschäftsbedingungen (AGB)
                            </h1>
                            <p className="text-xl text-gray-600">
                                Red Rabbit GmbH<br />
                                Stand: Juli 2025
                            </p>
                        </div>
                    </AOSWrapper>

                    <div className="space-y-12">
                        {/* Geltungsbereich */}
                        <AOSWrapper animation="fade-up" delay={200}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">1. Geltungsbereich</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p>Diese Allgemeinen Geschäftsbedingungen gelten für sämtliche Leistungen der Red Rabbit GmbH, Grabnergasse 8/8, 1060 Wien, insbesondere im Bereich Webdesign, Online-Marketing, Konzeption und Umsetzung digitaler Inhalte. Abweichende Bedingungen des Kunden gelten nur, wenn sie ausdrücklich schriftlich anerkannt wurden.</p>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Vertragsabschluss & Preisbindung */}
                        <AOSWrapper animation="fade-up" delay={300}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">2. Vertragsabschluss & Preisbindung</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p>Ein Vertrag kommt durch das Absenden des vollständig ausgefüllten Kontaktformulars auf unserer Website zustande.</p>
                                    <p>Nur in diesem Fall gilt der vergünstigte Fixpreis ab 790 € netto.</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Das Angebot ist 30 Tage gültig. Danach kann die Red Rabbit GmbH das Angebot einseitig ändern oder zurückziehen.</li>
                                    </ul>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Leistungsumfang & Ablauf */}
                        <AOSWrapper animation="fade-up" delay={400}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">3. Leistungsumfang & Ablauf</h2>
                                <div className="space-y-4 text-gray-700">
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Nach Erhalt der vollständigen Kundendaten und Inhalte (Texte, Bilder etc.) beginnt die Umsetzung.</li>
                                        <li>Innerhalb von 7 Werktagen wird ein erster Entwurf bereitgestellt.</li>
                                        <li>Der Kunde kann im Rahmen einer einmaligen Korrekturschleife Änderungswünsche äußern.</li>
                                        <li>Weitere Änderungen oder Redesigns sind kostenpflichtig.</li>
                                        <li>Innerhalb von 6 Monaten nach Projektabschluss ist eine einmalige kostenlose Text- oder Bildanpassung möglich (kein neues Layout).</li>
                                        <li>Hosting und Wartung sind nicht Bestandteil des Pakets, es sei denn, ein optionales Abo wird abgeschlossen (siehe Punkt 5).</li>
                                    </ul>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Zahlungsbedingungen */}
                        <AOSWrapper animation="fade-up" delay={500}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">4. Zahlungsbedingungen</h2>
                                <div className="space-y-4 text-gray-700">
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Die Rechnung wird nach Projektfreigabe bzw. Veröffentlichung der Website gestellt.</li>
                                        <li>Die Zahlung ist innerhalb von 7 Werktagen ab Rechnungsdatum fällig.</li>
                                    </ul>
                                    <p className="mt-4">Bei Zahlungsverzug gelten folgende Mahngebühren:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>1. Mahnung: 10 € pauschal</li>
                                        <li>2. Mahnung: zusätzliche 20 €</li>
                                        <li>3. Mahnung: zusätzliche 30 € + Ankündigung rechtlicher Schritte</li>
                                        <li>Zusätzlich werden gesetzliche Verzugszinsen von derzeit 9,2 %-Punkte über dem Basiszinssatz (§ 456 UGB) verrechnet.</li>
                                        <li>Bei Nichtzahlung ist Red Rabbit berechtigt, die Website temporär zu deaktivieren oder Daten zurückzubehalten.</li>
                                    </ul>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Betreuung & Wartung */}
                        <AOSWrapper animation="fade-up" delay={600}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">5. Betreuung & Wartung (optional)</h2>
                                <div className="space-y-4 text-gray-700">
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Kunden können ein Betreuungsabo zum Preis von 79 €/Monat netto (Mindestlaufzeit 12 Monate) abschließen.</li>
                                        <li>Enthalten sind:</li>
                                    </ul>
                                    <ul className="list-disc list-inside space-y-1 ml-8">
                                        <li>laufende Text-/Bildanpassungen</li>
                                        <li>technische Wartung</li>
                                        <li>bevorzugte Umsetzung</li>
                                        <li>Support bei Rückfragen</li>
                                    </ul>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Nutzungsrechte & Referenznutzung */}
                        <AOSWrapper animation="fade-up" delay={700}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">6. Nutzungsrechte & Referenznutzung</h2>
                                <div className="space-y-4 text-gray-700">
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Alle Rechte an der Website bleiben bis zur vollständigen Bezahlung bei Red Rabbit.</li>
                                        <li>Danach erhält der Kunde ein einfaches, nicht übertragbares Nutzungsrecht zur eigenen Verwendung.</li>
                                        <li>Red Rabbit ist berechtigt, sämtliche erstellten Projekte, Inhalte und Designs dauerhaft zu Werbe- und Referenzzwecken zu nutzen (z. B. auf der eigenen Website oder Social Media).</li>
                                        <li>Dem Kunden ist bewusst, dass Demoseiten vor Veröffentlichung nicht die Endfreigabe darstellen.</li>
                                    </ul>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Pflichten des Kunden */}
                        <AOSWrapper animation="fade-up" delay={800}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">7. Pflichten des Kunden</h2>
                                <div className="space-y-4 text-gray-700">
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Der Kunde verpflichtet sich, alle zur Projektumsetzung erforderlichen Inhalte zeitgerecht bereitzustellen.</li>
                                        <li>Bei Verzögerungen verschieben sich Fristen entsprechend.</li>
                                        <li>Der Kunde ist für die rechtliche Korrektheit aller gelieferten Inhalte (z. B. Impressum, Texte, Logos, Datenschutz) selbst verantwortlich – außer diese Leistungen wurden ausdrücklich von Red Rabbit übernommen.</li>
                                    </ul>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Haftung */}
                        <AOSWrapper animation="fade-up" delay={900}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">8. Haftung</h2>
                                <div className="space-y-4 text-gray-700">
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen.</li>
                                        <li>Keine Haftung bei Datenverlust, technischen Fehlern durch Hostinganbieter oder Drittanbietern.</li>
                                        <li>Bei Eigenverantwortung des Kunden (z. B. Rechtsverletzungen durch eigene Inhalte) übernimmt Red Rabbit keine Haftung.</li>
                                    </ul>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Widerruf & Rücktritt */}
                        <AOSWrapper animation="fade-up" delay={1000}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">9. Widerruf & Rücktritt</h2>
                                <div className="space-y-4 text-gray-700">
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Verbraucher haben das gesetzliche Widerrufsrecht, sofern die Leistung noch nicht vollständig erbracht wurde.</li>
                                        <li>Erfolgt 30 Tage lang keine Rückmeldung des Kunden nach Angebot oder Designvorschlag, ist Red Rabbit berechtigt, vom Vertrag zurückzutreten.</li>
                                    </ul>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Gerichtsstand & Recht */}
                        <AOSWrapper animation="fade-up" delay={1100}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">10. Gerichtsstand & Recht</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p>Es gilt österreichisches Recht.</p>
                                    <p>Gerichtsstand: Wien</p>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Salvatorische Klausel */}
                        <AOSWrapper animation="fade-up" delay={1200}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">11. Salvatorische Klausel</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p>Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Gültigkeit der übrigen Regelungen unberührt.</p>
                                </div>
                            </section>
                        </AOSWrapper>

                        {/* Kontakt */}
                        <AOSWrapper animation="fade-up" delay={1300}>
                            <section className="bg-gray-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-light text-gray-900 mb-6">12. Kontakt</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p><strong>Red Rabbit GmbH</strong><br />
                                        Grabnergasse 8/8<br />
                                        1060 Wien<br />
                                        T +43 676 9000 955<br />
                                        E office@redrabbit.media<br />
                                        W www.redrabbit.media</p>
                                </div>
                            </section>
                        </AOSWrapper>
                    </div>
                </div>
            </main>
        </div>
    );
}
