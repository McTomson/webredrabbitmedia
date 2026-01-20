import type { Metadata } from 'next';
import { cities, type CitySlug, generateStaticParams } from './cities';

export { generateStaticParams };

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Parse city from slug (same logic as page.tsx)
    if (!slug || !slug.startsWith('webdesign-')) {
        return {
            title: 'Stadt nicht gefunden',
        };
    }

    const citySlug = slug.replace('webdesign-', '') as CitySlug;
    const city = cities[citySlug];

    if (!city) {
        return {
            title: 'Stadt nicht gefunden',
        };
    }

    return {
        title: `Webdesign ${city.name} | Professionelle Website ab 790€`,
        description: `Professionelles Webdesign in ${city.name}, ${city.region}. Website erstellen lassen ab 790€. ✓ 15 Jahre Erfahrung ✓ 800 + zufriedene Kunden ✓ Erst zahlen wenn zufrieden.`,
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
