import { Metadata } from 'next';
import { branches, type BranchSlug } from '../data';
import BranchPageClient from './BranchPageClient';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return Object.keys(branches).map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const branch = branches[slug as BranchSlug];

    if (!branch) {
        return {
            title: 'Branche nicht gefunden',
            robots: { index: false }
        };
    }

    return {
        title: `${branch.title} | Red Rabbit Media`,
        description: branch.description,
        alternates: {
            canonical: `https://web.redrabbit.media/branchen/${slug}`,
        },
        openGraph: {
            title: `${branch.title} | Red Rabbit Media`,
            description: branch.description,
            url: `https://web.redrabbit.media/branchen/${slug}`,
            siteName: 'Red Rabbit Media',
            locale: 'de_AT',
            type: 'website',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default function BranchPage() {
    return <BranchPageClient />;
}
