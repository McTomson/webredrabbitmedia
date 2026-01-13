import type { Metadata } from 'next';
import { cities, type CitySlug, generateStaticParams } from './cities';
import { notFound } from 'next/navigation';

export { generateStaticParams };

type Props = {
    params: { city: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const city = cities[params.city as CitySlug];

    if (!city) {
        return {
            title: 'Stadt nicht gefunden',
        };
    }

    return {
        title: `Webdesign ${city.name} | Professionelle Website ab 790€`,
        description: `Professionelles Webdesign in ${city.name}, ${city.region}. Website erstellen lassen ab 790€ statt 2.800€. ✓ 15 Jahre Erfahrung ✓ 800+ zufriedene Kunden ✓ Erst zahlen wenn zufrieden.`,
        keywords: city.keywords,
        openGraph: {
            title: `Webdesign ${city.name} - Red Rabbit Media`,
            description: `Website erstellen lassen in ${city.name} ab 790€. Professionelles Webdesign für Unternehmen in ${city.region}.`,
            type: 'website',
        },
    };
}

export default function CityLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
