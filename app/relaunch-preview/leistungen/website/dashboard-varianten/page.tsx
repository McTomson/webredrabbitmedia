import type { Metadata } from 'next';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import VarianteA from '@/components/subpages/leistungen/website/v2/dashboard-varianten/VarianteA';
import VarianteB from '@/components/subpages/leistungen/website/v2/dashboard-varianten/VarianteB';
import VarianteC from '@/components/subpages/leistungen/website/v2/dashboard-varianten/VarianteC';
import '@/app/styleguide/styleguide.css';

/**
 * Vergleichs-Route (noindex) fuer den Auftraggeber: drei Neubau-Varianten der
 * Talos-Dashboard-Sektion (Ersatz fuer KollegeAnreisser) untereinander, jeweils
 * mit navy Trenner-Balken davor. Chrome (Fonts, styleguide.css, rr-Font-Wrapper)
 * 1:1 aus der Fundament-Varianten-Vergleichsseite. Bestehende KollegeAnreisser.tsx
 * und die Website-Seite bleiben unberuehrt.
 */
export const metadata: Metadata = {
  title: 'Dashboard-Varianten (Vergleich) · Red Rabbit Media',
  description:
    'Drei Neubau-Varianten der Talos-Dashboard-Sektion zum Durchscrollen und Auswaehlen.',
  robots: { index: false, follow: false },
};

const VARIANTEN: { label: string; note: string; node: React.ReactNode }[] = [
  {
    label: 'VARIANTE A · Browser-Frame',
    note: 'Dunkler Browser-Chrome rahmt ein helles Dashboard-Mockup; Talos ragt von rechts halb ueber den Rahmen und winkt.',
    node: <VarianteA />,
  },
  {
    label: 'VARIANTE B · Floating Panels',
    note: 'Ueberlappend schwebende Panels mit dezenter Scroll-Parallax; Talos steht ganzkoerper daneben wie ein Kollege, der praesentiert.',
    node: <VarianteB />,
  },
  {
    label: 'VARIANTE C · Kommandozentrale dunkel',
    note: 'Navy-Dashboard mit roten Akzenten; Talos schaut von oben hinter dem Board hervor und winkt.',
    node: <VarianteC />,
  },
];

export default function DashboardVariantenVergleichPage() {
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
                padding:
                  'clamp(20px, 4vw, 34px) var(--rr-gutter, clamp(20px, 4vw, 64px))',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                borderBottom: '2px solid var(--rr-red)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--rr-font-ui)',
                  fontSize: 'clamp(14px, 1.6vw, 18px)',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                {v.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--rr-font-ui)',
                  fontSize: 'clamp(12px, 1.3vw, 14px)',
                  color: 'rgba(242, 242, 239, 0.68)',
                  marginTop: '6px',
                  maxWidth: '60em',
                  letterSpacing: '0.01em',
                }}
              >
                {v.note}
              </div>
            </div>
            {v.node}
          </div>
        ))}
      </div>
    </>
  );
}
