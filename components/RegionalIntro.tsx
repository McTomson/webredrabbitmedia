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
                        Professionelles Webdesign für {' '}
                        {data.cities.slice(0, 3).map((city, index) => (
                            <span key={city}>
                                <Link
                                    href={getSlug(city)}
                                    className="font-medium text-gray-900 hover:text-red-600 transition-colors underline decoration-gray-200 underline-offset-4 hover:decoration-red-200"
                                >
                                    {city}
                                </Link>
                                {index < 2 ? ', ' : ''}
                            </span>
                        ))}
                        {' '} und ganz {data.region}.
                        Wir entwickeln Webauftritte, die nicht nur gut aussehen, sondern Kunden gewinnen.
                        Du füllst nur das Formular aus – wir übernehmen den Rest.
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
