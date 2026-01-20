'use client';

import ComparisonTable from '@/components/ComparisonTable';

const heroldComparisonData = [
    {
        criterion: 'Einmalige Kosten',
        herold: '0 € (oft Einrichtungsgebühr 200-500 €)',
        agency: 'ab 790 €'
    },
    {
        criterion: 'Monatliche Kosten',
        herold: '65-140 € (je nach Paket)',
        agency: '0 €'
    },
    {
        criterion: 'Kosten nach 12 Monaten',
        herold: '780-1.680 € + Einrichtung',
        agency: '790 € (einmalig)'
    },
    {
        criterion: 'Kosten nach 36 Monaten',
        herold: '2.340-5.040 €',
        agency: '790 € (einmalig)'
    },
    {
        criterion: 'Eigentum am Code',
        herold: '❌ Nein (Mietmodell)',
        agency: '✅ Ja (100% Eigentum)'
    },
    {
        criterion: 'Vertragslaufzeit',
        herold: '12-36 Monate (Auto-Verlängerung)',
        agency: 'Keine Bindung'
    },
    {
        criterion: 'Kündigung',
        herold: 'Totalverlust der Website',
        agency: 'Website bleibt bestehen'
    },
    {
        criterion: 'Domain-Besitz',
        herold: 'Oft im Paket, Transfer kompliziert',
        agency: 'Voller Besitz ab Tag 1'
    },
    {
        criterion: 'Page Speed Score',
        herold: '40-60/100 (Baukasten-System)',
        agency: '95-100/100 (Next.js optimiert)'
    },
    {
        criterion: 'SEO-Optimierung',
        herold: 'Basis (Template-basiert)',
        agency: 'Vollständig individuell'
    },
    {
        criterion: 'Design-Anpassungen',
        herold: 'Begrenzt (Template-Grenzen)',
        agency: 'Unbegrenzt möglich'
    },
    {
        criterion: 'Technologie',
        herold: 'Proprietäres CMS',
        agency: 'Next.js, React, Open Source'
    },
    {
        criterion: 'Ladezeit',
        herold: '3-8 Sekunden',
        agency: '0,5-1,5 Sekunden'
    },
    {
        criterion: 'Mobile Optimierung',
        herold: 'Standard-Responsive',
        agency: 'Perfekt optimiert'
    },
    {
        criterion: 'Individuelle Funktionen',
        herold: '❌ Kaum möglich',
        agency: '✅ Vollständig anpassbar'
    },
    {
        criterion: 'Analytics & Tracking',
        herold: 'Basis-Statistiken',
        agency: 'Google Analytics 4, Custom Events'
    },
    {
        criterion: 'Support',
        herold: 'Hotline (oft Wartezeit)',
        agency: 'Persönlicher Ansprechpartner Wien'
    },
    {
        criterion: 'Skalierbarkeit',
        herold: '❌ Begrenzt',
        agency: '✅ Unbegrenzt erweiterbar'
    },
    {
        criterion: 'Conversion-Optimierung',
        herold: 'Standard-Templates',
        agency: 'Psychologisch optimiert'
    },
    {
        criterion: 'Backup & Sicherheit',
        herold: 'Im Paket enthalten',
        agency: 'Automatisiert + manuell'
    },
    {
        criterion: 'Updates',
        herold: 'Automatisch (keine Kontrolle)',
        agency: 'Nach Bedarf, volle Kontrolle'
    }
];

export default function HeroldComparisonTable() {
    return (
        <>
            <ComparisonTable
                data={heroldComparisonData}
                title="Detaillierter Kosten- und Leistungsvergleich"
            />
            <p style={{ marginTop: '1.5rem', fontWeight: 600, fontSize: '1.1rem' }}>
                <strong>Langzeit-Ersparnis:</strong> Nach 3 Jahren sparen Sie mit Red Rabbit Media durchschnittlich{' '}
                <span style={{ color: '#16a34a', fontWeight: 700 }}>1.550-4.250 €</span> gegenüber Herold –
                und besitzen eine technisch überlegene Website ohne monatliche Kosten.
            </p>
        </>
    );
}
