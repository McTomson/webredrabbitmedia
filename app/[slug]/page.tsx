import { Metadata } from 'next';
import { cities, type CitySlug } from './cities';
import { notFound } from 'next/navigation';
import CityContent from './CityContent';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    if (!slug || !slug.startsWith('webdesign-')) {
        return { title: 'Seite nicht gefunden' };
    }

    const citySlug = slug.replace('webdesign-', '') as CitySlug;
    const city = cities[citySlug];

    if (!city) {
        return { title: 'Stadt nicht gefunden' };
    }

    return {
        title: `Webdesign ${city.name}: Premium Website & SEO | ⭐ 4.8`,
        description: `Wir bringen ${city.name} online. ⭐ 4.8 Bewertung. Maßgeschneidertes Webdesign ab 790€ ohne Vorkasse. Perfekt für lokale Dienstleister & KMUs.`,
    };
}

export default async function CityPage({ params }: PageProps) {
    const { slug } = await params;

    if (!slug || !slug.startsWith('webdesign-')) {
        notFound();
    }

    // Validate city
    const citySlug = slug.replace('webdesign-', '') as CitySlug;
    const city = cities[citySlug];

    if (!city) {
        notFound();
    }

    // Pass the simple data object to the Client Component
    return <CityContent city={city} />;
}
