import type { Metadata } from 'next';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import MenueVarianten from '@/components/relaunch/menue-varianten/MenueVarianten';
import '@/app/styleguide/styleguide.css';

/**
 * Token-Spar-Vergleich (noindex) fuer Thomas: DREI Redesigns des Vollbild-
 * Overlay-Menues (RelaunchMenu) untereinander, jeder Block exakt 100vh. Er
 * waehlt per a/b/c. Kernproblem des Bestands: 8 Punkte + 2 Unterpunkte + CTA +
 * Kontakte passen nicht in einen Viewport — jede Variante loest das, alles ist
 * innerhalb der 100vh sichtbar (auch bei ~760px Hoehe). Nur Mini-Label A/B/C,
 * keine Menue-Logik. Chrome (Fonts, styleguide.css, rr-Wrapper) wie kreise-varianten.
 */
export const metadata: Metadata = {
  title: 'Menue-Varianten (Vergleich)',
  robots: { index: false, follow: false },
};

export default function MenueVariantenPage() {
  const rrFonts = `rr ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
      />

      <div className={rrFonts} style={{ background: '#1c2837' }}>
        <MenueVarianten />
      </div>
    </>
  );
}
