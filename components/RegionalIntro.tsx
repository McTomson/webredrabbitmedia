"use client";

import Link from 'next/link';
import { AOSWrapper } from './AnimatedSection';

interface RegionalIntroProps {
    data: {
        region: string;
        cities: string[];
    }
}

const RegionalIntro = ({ data }: RegionalIntroProps) => {
    // Helper to generate slug from city name
    const getSlug = (city: string) => {
        const slug = city.toLowerCase()
            .replace('ü', 'ue')
            .replace('ö', 'oe')
            .replace('ä', 'ae')
            .replace('ß', 'ss')
            .replace(' ', '-');
        return `/webdesign-${slug}`;
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-8 text-center">
                <AOSWrapper animation="fade-up">
                    <h2 className="text-3xl font-light text-gray-900 mb-8">
                        Ihr Partner für <span className="font-semibold text-red-600">Webdesign in {data.region}</span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed font-light">
                        {data.region === "Niederösterreich" ? (
                            <>
                                Sie suchen eine Werbeagentur in Niederösterreich, die Ihre Webseite professionell erstellt?
                                Von {' '}
                                {data.cities.slice(0, 3).map((city, index) => (
                                    <span key={city}>
                                        <Link
                                            href={getSlug(city)}
                                            prefetch={false}
                                            className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200"
                                        >
                                            {city}
                                        </Link>
                                        {index < 2 ? ', ' : ''}
                                    </span>
                                ))}
                                {' '} bis Amstetten, vom Waldviertel bis Baden – wir entwickeln Webauftritte, die nicht nur gut aussehen, sondern Kunden gewinnen.
                                Du füllst nur das Formular aus – wir übernehmen den Rest.
                            </>
                        ) : data.region === "Steiermark" ? (
                            <>
                                Sie suchen eine Webagentur in der Steiermark, die Ihr Unternehmen als Innovationsführer positioniert?
                                {data.cities.length > 0 && (
                                    <>
                                        Von <Link href={getSlug(data.cities[0])} className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200">{data.cities[0]}</Link>
                                        {data.cities.length > 1 && (
                                            <> über <Link href={getSlug(data.cities[1])} className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200">{data.cities[1]}</Link></>
                                        )}
                                        {data.cities.length > 2 && (
                                            <> bis nach <Link href={getSlug(data.cities[2])} className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200">{data.cities[2]}</Link></>
                                        )}
                                    </>
                                )}
                                – wir entwickeln High-End Webauftritte für das wirtschaftliche Rückgrat der grünen Mark.
                                Keine Standard-Vorlagen, sondern maßgeschneiderte Lösungen mit Fokus auf messbare Ergebnisse und überragende Ladezeiten.
                            </>
                        ) : data.region === "Wien" ? (
                            <>
                                Wien verlangt nach Tempo und Perfektion. Sie suchen eine Agentur für <strong>Webdesign in Wien</strong>, die Ihren urbanen Vorsprung versteht?
                                Vom <Link href={getSlug(data.cities[0])} className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200">{data.cities[0]}</Link> bis <strong>Donaustadt</strong> – wir digitalisieren die Hauptstadt.
                                Keine Parkplatzsuche, keine leeren Kilometer, sondern direkt zum Erfolg für Ihr Wiener Unternehmen.
                            </>
                        ) : data.region === "Kärnten" ? (
                            <>
                                Sie suchen Webdesign in Kärnten, das die Sonnenseite Ihres Betriebs hervorhebt?
                                Von <Link href={getSlug(data.cities[0])} className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200">{data.cities[0]}</Link> über <Link href={getSlug("Villach")} className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200">Villach</Link> bis <Link href={getSlug("Spittal")} className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200">Spittal</Link> – wir bringen die Kärntner Qualität und Gastfreundschaft auf den digitalen Bildschirm.
                                Professionell, nahbar und mit klarem Fokus auf Ihre regionale Sichtbarkeit.
                            </>
                        ) : data.region === "Salzburg" ? (
                            <>
                                Auf der Salzburger Weltbühne zählt der erste Eindruck. Sie suchen exzellentes <strong>Webdesign in Salzburg</strong>, das internationalen Standards gerecht wird?
                                Von der <Link href={getSlug("Salzburg")} className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200">Stadt Salzburg</Link> bis in den <strong>Pinzgau</strong> – wir entwickeln Webauftritte mit Festspiel-Niveau. Ästhetisch brillant und technisch kompromisslos.
                            </>
                        ) : data.region === "Tirol" ? (
                            <>
                                In den Alpen zählen Ausdauer und die richtige Strategie. Sie suchen professionelles <strong>Webdesign in Tirol</strong>, das Ihr Unternehmen an die Spitze führt?
                                Von <Link href={getSlug("Innsbruck")} className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200">Innsbruck</Link> über <Link href={getSlug("Kufstein")} className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200">Kufstein</Link> bis <Link href={getSlug("Lienz")} className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200">Lienz</Link> – wir bauen digitale Fundamente, die so stabil sind wie ein Gipfelkreuz. Performance für Gipfelstürmer.
                            </>
                        ) : data.region === "Vorarlberg" ? (
                            <>
                                Im Ländle zählt das Schaffen. Sie suchen Webdesign in Vorarlberg, das so präzise arbeitet wie Ihre Fertigung?
                                Von <Link href={getSlug("Bregenz")} className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200">Bregenz</Link> über <Link href={getSlug("Dornbirn")} className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200">Dornbirn</Link> bis nach <Link href={getSlug("Feldkirch")} className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200">Feldkirch</Link> – wir liefern digitales Handwerk mit Vorarlberger Präzision. Klar, funktional und hocheffizient.
                            </>
                        ) : (
                            <>
                                Professionelles Webdesign für {' '}
                                {data.cities.slice(0, 3).map((city, index) => (
                                    <span key={city}>
                                        <Link
                                            href={getSlug(city)}
                                            prefetch={false}
                                            className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200"
                                        >
                                            {city}
                                        </Link>
                                        {index < 2 ? ', ' : ''}
                                    </span>
                                ))}
                                {' '} und ganz {data.region}.
                                Wir entwickeln Webauftritte, die nicht nur gut aussehen, sondern Kunden gewinnen.
                                Sie füllen nur das Formular aus – wir übernehmen den Rest.
                            </>
                        )}
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-400 uppercase tracking-widest">
                        <span>Kein Aufwand</span>
                        <span className="text-red-300">•</span>
                        <span>Kein Baukasten</span>
                        <span className="text-red-300">•</span>
                        <span>Fixpreis ab 790 €</span>
                    </div>
                </AOSWrapper>
            </div>
        </section>
    );
};

export default RegionalIntro;
