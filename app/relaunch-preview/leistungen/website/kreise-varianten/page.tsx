import type { Metadata } from 'next';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import KreiseVarianten from '@/components/subpages/leistungen/website/v2/kreise-varianten/KreiseVarianten';
import '@/app/styleguide/styleguide.css';

/**
 * Token-Spar-Vergleich (noindex) fuer Thomas: DREI edlere Design-Versionen der
 * 4-Kreise-Reihe aus der Ablauf-Sektion (Ablauf.tsx). Er mag Konzept + Groesse
 * der Kreise, findet das aktuelle Design "zu billig". Die Seite zeigt NUR die
 * drei Reihen untereinander mit winzigem grauen Buchstaben-Label A/B/C, weisser
 * Grund, viel Luft. Kein Header/Menu/Footer, kein Beschreibungstext.
 */
export const metadata: Metadata = {
  title: 'Kreise-Varianten (Vergleich) · Red Rabbit Media',
  description: 'Drei edlere Design-Versionen der 4-Kreise-Reihe A / B / C.',
  robots: { index: false, follow: false },
};

export default function KreiseVariantenPage() {
  const rrFonts = `rr ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
      />

      <div className={rrFonts} style={{ background: '#ffffff', minHeight: '100vh' }}>
        <KreiseVarianten />
      </div>
    </>
  );
}
