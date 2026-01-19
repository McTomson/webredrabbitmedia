import { Metadata } from 'next';
import DatenschutzClient from './DatenschutzClient';

export const metadata: Metadata = {
    title: 'Datenschutzerklärung | Red Rabbit Media',
    description: 'Informationen zum Datenschutz, Cookies und Ihre Rechte gemäß DSGVO.',
    alternates: {
        canonical: 'https://web.redrabbit.media/datenschutz',
    },
    openGraph: {
        title: 'Datenschutzerklärung | Red Rabbit Media',
        description: 'Informationen zum Datenschutz, Cookies und Ihre Rechte gemäß DSGVO.',
        url: 'https://web.redrabbit.media/datenschutz',
        siteName: 'Red Rabbit Media',
        locale: 'de_AT',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function DatenschutzPage() {
    return <DatenschutzClient />;
}
