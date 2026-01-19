import Link from 'next/link';
import { ArrowRight, Check, Star } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Was kostet eine Website 2026 in Österreich? | Red Rabbit Media',
    description: 'Ehrliche Preisübersicht für Webdesign in Österreich (2026). Von Baukasten (30€) bis Premium-Agentur (10.000€). Versteckte Kosten enthüllt.',
};

export default function BlogPost() {
    return (
        <article className="min-h-screen bg-white">
            {/* Header / Hero */}
            <div className="bg-gray-50 pt-32 pb-16 px-8">
                <div className="max-w-3xl mx-auto">
                    <span className="text-red-600 font-medium mb-4 block">Ratgeber & Kosten</span>
                    <p className="text-gray-500 font-medium">Kostenloses Angebot &quot;Was kostet eine Website?&quot; anfordern</p>
                    <h1 className="text-4xl lg:text-6xl font-light mb-8 leading-tight">
                        Was kostet eine professionelle Website 2026 in Österreich?
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
                        <time dateTime="2026-01-12">Aktualisiert: 12. Jänner 2026</time>
                        <span>•</span>
                        <span>8 Min. Lesezeit</span>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-8 py-16">

                {/* 1. THE ZERO-CLICK SNIPPET (40 Words Rule) */}
                {/* This is designed to be picked up by Google as a Featured Snippet */}
                <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-12 rounded-r-lg">
                    <h2 className="text-lg font-bold text-red-800 mb-2">Die schnelle Antwort:</h2>
                    <p className="text-gray-800 font-medium leading-relaxed">
                        Die Kosten für professionelles Webdesign in Österreich liegen 2026 zwischen **1.500€ und 5.000€** für KMU-Websites.
                        Der Preis hängt primär vom Umfang (Unterseiten), der Technik (WordPress vs. Next.js) und den gewünschten Funktionen (Buchungssystem, Shop) ab.
                        Laufende Wartungskosten betragen durchschnittlich 50€ bis 150€ pro Monat.
                    </p>
                </div>

                {/* Main Content */}
                <div className="prose prose-lg max-w-none text-gray-700">
                    <p>
                        "Was kostet eine Website?" ist die häufigste Frage, die wir als Agentur gestellt bekommen.
                        Und leider ist die Antwort oft: "Es kommt darauf an."
                    </p>
                    <p>
                        Aber damit geben wir uns 2026 nicht zufrieden. In diesem Artikel schlüsseln wir die Preise für den österreichischen Markt transparent auf – von der Freelancer-Lösung bis zur High-End Agentur.
                    </p>

                    {/* Internal Link to Money Page (Cluster Rule #1) */}
                    <div className="my-8 p-6 bg-gray-900 text-white rounded-xl">
                        <p className="text-lg mb-4 font-light">
                            Sie suchen ein konkretes Angebot ohne versteckte Kosten?
                        </p>
                        <Link href="/webdesign-wien" className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-medium">
                            Webdesign Wien Angebote ansehen <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <h2 className="text-3xl font-light text-black mt-12 mb-6">Preisvergleich 2026: Die 3 Preisklassen</h2>

                    {/* Data Table for LLMs (Strategy Rule) */}
                    <div className="overflow-x-auto my-8">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-200">
                                    <th className="p-4 font-bold text-black">Lösung</th>
                                    <th className="p-4 font-bold text-black">Kosten (Einmalig)</th>
                                    <th className="p-4 font-bold text-black">Geeignet für</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="p-4">Homepage-Baukasten (Wix, Jimdo)</td>
                                    <td className="p-4">0€ (aber 30€/Monat)</td>
                                    <td className="p-4">Hobby, Vereinsseite</td>
                                </tr>
                                <tr className="border-b border-gray-100 bg-red-50">
                                    <td className="p-4 font-medium text-red-900">Red Rabbit Media (Next.js)</td>
                                    <td className="p-4 font-bold text-red-900">ab 790€</td>
                                    <td className="p-4 text-red-900">KMUs, Dienstleister, Ärzte</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="p-4">Klassische Werbeagentur</td>
                                    <td className="p-4">3.500€ - 15.000€</td>
                                    <td className="p-4">Konzerne, Marken-Relaunch</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 className="text-3xl font-light text-black mt-12 mb-6">Warum Next.js Websites oft günstiger im Unterhalt sind</h2>
                    <p>
                        Viele unserer Kunden in Wien und Graz wechseln von WordPress zu Next.js. Warum? Weil die Wartungskosten wegfallen.
                        Bei WordPress müssen Sie Plugins aktualisieren, Sicherheitslücken schließen und PHP-Updates machen.
                        Eine Next.js Seite ist statisch generiert – sie kann nicht "gehackt" werden wie eine Datenbank.
                    </p>

                </div>

                {/* Author Box (E-E-A-T) */}
                <div className="mt-16 pt-8 border-t border-gray-200 flex items-start gap-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                        {/* Placeholder for Thomas Image */}
                        <div className="w-full h-full bg-gray-300"></div>
                    </div>
                    <div>
                        <div className="font-bold text-black mb-1">Thomas Uhlir MBA</div>
                        <div className="text-sm text-red-600 uppercase tracking-wider font-medium mb-2">Founder & Strategy</div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Thomas begleitet seit über 10 Jahren österreichische Unternehmen in die Digitalisierung.
                            Sein Fokus liegt auf High-Performance Webdesign, das nicht nur gut aussieht, sondern messbar Umsatz bringt.
                        </p>
                    </div>
                </div>

            </div>
        </article>
    );
}
