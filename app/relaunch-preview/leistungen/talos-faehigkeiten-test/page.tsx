import type { Metadata } from 'next';
import FaehigkeitenKachel from '@/components/subpages/leistungen/talos/v2/FaehigkeitenKachel';
import FaehigkeitenAufklapp from '@/components/subpages/leistungen/talos/v2/FaehigkeitenAufklapp';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';
import '@/components/subpages/leistungen/wd-eyebrow.css';
import '@/components/subpages/leistungen/talos/v2/talos-v2.css';

/**
 * Vergleichs-Testseite (Preview, noindex): rendert BEIDE alternativen
 * Darstellungen der Faehigkeiten-Sektion untereinander, damit Thomas eine
 * waehlen kann. Chrome bewusst minimal (kein Menue/Footer/3D-Companion), nur
 * der .rr-Font-Scope + die Styleguide-Tokens, damit die zwei Varianten pur
 * nebeneinander beurteilt werden koennen. Beide nutzen dieselbe Copy/Daten
 * wie die echte Faehigkeiten.tsx (geteiltes faehigkeiten-data.ts).
 */
export const metadata: Metadata = {
  title: 'Talos-Faehigkeiten — Vergleichsansicht (Preview)',
  robots: { index: false, follow: false },
};

export default function TalosFaehigkeitenTestPage() {
  const rrFonts = `rr ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
      />

      <div className={rrFonts} style={{ background: '#f6f5f1', minHeight: '100vh' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '48px 24px 12px',
            fontFamily: 'var(--rr-font-ui)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--rr-font-ui)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--rr-red)',
              margin: 0,
            }}
          >
            VARIANTE A — Kachel-Raster + Modal
          </p>
        </div>
        <FaehigkeitenKachel />

        {/* Deutlicher Trenner zwischen den Varianten. */}
        <div style={{ height: 2, background: 'var(--rr-navy)', margin: '0 24px' }} />

        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '48px 24px 12px',
            fontFamily: 'var(--rr-font-ui)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--rr-font-ui)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--rr-red)',
              margin: 0,
            }}
          >
            VARIANTE B — Aufklapp-Karte + CTA
          </p>
        </div>
        <FaehigkeitenAufklapp />
      </div>
    </>
  );
}
