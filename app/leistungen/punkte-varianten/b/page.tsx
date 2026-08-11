import type { Metadata } from 'next';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import VarianteB from '@/components/subpages/leistungen/punkte-varianten/VarianteB';
import '@/app/styleguide/styleguide.css';
import '@/components/subpages/leistungen/wd-eyebrow.css';

/**
 * Vorschau-Route (noindex) fuer den Auftraggeber: Variante B "Echte Bauteile"
 * als Ersatz fuer die Stockfotos in der LeistungenUeberblick-Sektion. Die
 * Live-Seite (app/relaunch-preview/leistungen) bleibt unberuehrt. Chrome
 * (Fonts, styleguide.css, rr-Font-Wrapper) 1:1 aus den bestehenden
 * *-Varianten-Vergleichsseiten.
 */
export const metadata: Metadata = {
  title: 'Variante B: Echte Bauteile · Red Rabbit Media',
  description:
    'Vorschau: die sechs Leistungspunkte mit abstrahierten Produkt-Bauteilen statt Stockfotos.',
  robots: { index: false, follow: false },
};

export default function PunkteVarianteBPage() {
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
        {/* Schlichte Titelzeile */}
        <div
          style={{
            background: 'var(--rr-navy)',
            color: '#f2f2ef',
            padding:
              'clamp(20px, 4vw, 34px) var(--rr-gutter, clamp(20px, 4vw, 64px))',
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
            Variante B: Echte Bauteile
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
            Statt Stockfotos zeigt jeder Punkt ein abstrahiertes Produkt-Bauteil
            als reines Mockup. Live-Seite bleibt unberuehrt.
          </div>
        </div>

        <VarianteB />
      </div>
    </>
  );
}
