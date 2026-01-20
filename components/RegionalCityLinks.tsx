"use client";

import Link from 'next/link';
import { AOSWrapper } from './AnimatedSection';

interface RegionalCityLinksProps {
    data: {
        region: string;
        cities: string[];
    }
}

const RegionalCityLinks = ({ data }: RegionalCityLinksProps) => {
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
        <section className="bg-gray-900 border-t border-gray-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-8">
                <AOSWrapper animation="fade-up">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                        <h3 className="text-gray-400 text-sm font-medium whitespace-nowrap">
                            Webdesign in {data.region}:
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {data.cities.map((city, index) => (
                                <div key={index} className="flex items-center">
                                    <Link
                                        href={getSlug(city)}
                                        prefetch={false}
                                        className="text-gray-500 hover:text-red-400 text-sm transition-colors"
                                    >
                                        {city}
                                    </Link>
                                    {index < data.cities.length - 1 && (
                                        <span className="text-gray-800 ml-4">·</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </AOSWrapper>
            </div>
        </section>
    );
};

export default RegionalCityLinks;
