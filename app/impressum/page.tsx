import { Metadata } from 'next';
import ImpressumClient from './ImpressumClient';

export const metadata: Metadata = {
    title: 'Impressum | Red Rabbit Media',
    description: 'Rechtliche Informationen und Firmendaten der Red Rabbit GmbH. Webdesign & digitale Dienstleistungen aus Wien.',
    alternates: {
        canonical: 'https://web.redrabbit.media/impressum',
    },
    openGraph: {
        title: 'Impressum | Red Rabbit Media',
        description: 'Rechtliche Informationen und Firmendaten der Red Rabbit GmbH.',
        url: 'https://web.redrabbit.media/impressum',
        siteName: 'Red Rabbit Media',
        locale: 'de_AT',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function ImpressumPage() {
    return <ImpressumClient />;
}
