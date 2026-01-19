import { Metadata } from 'next';
import AGBClient from './AGBClient';

export const metadata: Metadata = {
    title: 'Allgemeine Geschäftsbedingungen (AGB) | Red Rabbit Media',
    description: 'AGB der Red Rabbit GmbH für Webdesign und digitale Dienstleistungen. Transparent, fair und rechtssicher.',
    alternates: {
        canonical: 'https://web.redrabbit.media/agb',
    },
    openGraph: {
        title: 'AGB | Red Rabbit Media',
        description: 'Allgemeine Geschäftsbedingungen der Red Rabbit GmbH.',
        url: 'https://web.redrabbit.media/agb',
        siteName: 'Red Rabbit Media',
        locale: 'de_AT',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function AGBPage() {
    return <AGBClient />;
}
