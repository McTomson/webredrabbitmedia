"use client";

import { AOSWrapper } from './AnimatedSection';

interface RegionalIntroProps {
    data: {
        region: string;
        cities: string[];
    }
}

const RegionalIntro = ({ data }: RegionalIntroProps) => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-8 text-center">
                <AOSWrapper animation="fade-up">
                    <h2 className="text-3xl font-light text-gray-900 mb-8">
                        Ihr Partner für <span className="font-semibold text-red-600">Webdesign in {data.region}</span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed font-light">
                        Professionelles Webdesign für <span className="font-medium text-gray-900">{data.cities.slice(0, 3).join(', ')}</span> und ganz {data.region}.
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
