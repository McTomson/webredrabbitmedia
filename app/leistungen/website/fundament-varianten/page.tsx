import type { Metadata } from 'next';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import VarianteA from '@/components/subpages/leistungen/website/v2/fundament-varianten/VarianteA';
import VarianteB from '@/components/subpages/leistungen/website/v2/fundament-varianten/VarianteB';
import VarianteC from '@/components/subpages/leistungen/website/v2/fundament-varianten/VarianteC';
import '@/app/styleguide/styleguide.css';

/**
 * Vergleichs-Route (noindex) fuer den Auftraggeber: die drei scroll-interaktiven
 * Design-Varianten der "Was drinsteckt / Fundament"-Sektion untereinander,
 * jeweils mit deutlichem navy Trenner-Balken davor. Chrome (Fonts, styleguide.css,
 * rr-Font-Wrapper) 1:1 aus app/relaunch-preview/leistungen/website/page.tsx.
 * Bestehende Fundament.tsx und die Website-Seite bleiben unberuehrt.
 */
export const metadata: Metadata = {
  title: 'Fundament-Varianten (Vergleich) · Red Rabbit Media',
  description:
    'Drei scroll-interaktive Design-Varianten der Fundament-Sektion zum Durchscrollen und Auswaehlen.',
  robots: { index: false, follow: false },
};

const VARIANTEN: { label: string; node: React.ReactNode }[] = [
  { label: 'VARIANTE A · Sticky-Ledger mit wanderndem Fokus', node: <VarianteA /> },
  { label: 'VARIANTE B · Nummern-Index mit Progress-Leiste', node: <VarianteB /> },
  { label: 'VARIANTE C · Zeilen-Ledger mit Detail', node: <VarianteC /> },
];

export default function FundamentVariantenVergleichPage() {
  const rrFonts = `rr ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
      />

      <div className={rrFonts} style={{ background: '#ffffff' }}>
        {VARIANTEN.map((v) => (
          <div key={v.label}>
            <div
              style={{
                background: 'var(--rr-navy)',
                color: '#f2f2ef',
                padding: 'clamp(20px, 4vw, 34px) var(--rr-gutter, clamp(20px, 4vw, 64px))',
                fontFamily: 'var(--rr-font-ui)',
                fontSize: 'clamp(14px, 1.6vw, 18px)',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                borderBottom: '2px solid var(--rr-red)',
              }}
            >
              {v.label}
            </div>
            {v.node}
          </div>
        ))}
      </div>
    </>
  );
}
