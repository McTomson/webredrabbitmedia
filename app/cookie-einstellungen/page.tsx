import { Metadata } from 'next';
import CookieEinstellungenClient from './CookieEinstellungenClient';

export const metadata: Metadata = {
    title: 'Cookie-Einstellungen | Red Rabbit Media',
    description: 'Verwalten Sie Ihre Cookie-Präferenzen für die Website von Red Rabbit Media.',
    alternates: {
        canonical: 'https://web.redrabbit.media/cookie-einstellungen',
    },
    openGraph: {
        title: 'Cookie-Einstellungen | Red Rabbit Media',
        description: 'Verwalten Sie Ihre Cookie-Präferenzen.',
        url: 'https://web.redrabbit.media/cookie-einstellungen',
        siteName: 'Red Rabbit Media',
        locale: 'de_AT',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function CookiePage() {
    return <CookieEinstellungenClient />;
}
