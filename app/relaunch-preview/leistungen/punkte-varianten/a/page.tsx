import type { Metadata } from 'next';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import VarianteA from '@/components/subpages/leistungen/punkte-varianten/VarianteA';
import '@/app/styleguide/styleguide.css';

/**
 * Vorschau-Route (noindex) fuer den Auftraggeber: Variante A der 6-Punkte-
 * Sektion ("Typo-Werkbank", rein typografisch, keine Stockfotos) als eigen-
 * staendige Seite. Chrome (Fonts, styleguide.css, .rr-Wrapper) 1:1 aus dem
 * Fundament-Varianten-Muster. Die Live-Sektion (LeistungenUeberblick.tsx auf
 * dem Leistungen-Hub) bleibt unberuehrt.
 */
export const metadata: Metadata = {
  title: 'Punkte-Variante A: Typo-Werkbank · Red Rabbit Media',
  description:
    'Vorschau: die 6-Punkte-Sektion rein typografisch, ohne Bilder — Ziffern, Serif-Titel, Fliesstext.',
  robots: { index: false, follow: false },
};

export default function PunkteVarianteAPage() {
  const rrFonts = `rr ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
      />

      <div className={rrFonts} style={{ background: '#f6f5f1' }}>
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
          }}
        >
          Variante A: Typo-Werkbank
        </div>
        <VarianteA />
      </div>
    </>
  );
}
