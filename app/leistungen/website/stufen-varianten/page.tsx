import type { Metadata } from 'next';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import VarianteA from '@/components/subpages/leistungen/website/v2/stufen-varianten/VarianteA';
import VarianteB from '@/components/subpages/leistungen/website/v2/stufen-varianten/VarianteB';
import VarianteC from '@/components/subpages/leistungen/website/v2/stufen-varianten/VarianteC';
import '@/app/styleguide/styleguide.css';

/**
 * Vergleichs-Route (noindex) fuer den Auftraggeber: drei animierte Design-Varianten
 * der "Drei Stufen"-Sektion untereinander. Jede Stufe hat 8-10 aufklappbare Merkmale
 * mit Erklaertext (Klick). Chrome (Fonts, styleguide.css, rr-Font-Wrapper) 1:1 aus
 * der bestehenden fundament-varianten-Vergleichsseite. Kein Menu/Footer.
 * Bestehende DreiStufen.tsx und die Website-Seite bleiben unberuehrt.
 */
export const metadata: Metadata = {
  title: 'Stufen-Varianten (Vergleich) · Red Rabbit Media',
  description:
    'Drei animierte Design-Varianten der Stufen-Sektion mit aufklappbaren Merkmalen zum Durchklicken und Auswaehlen.',
  robots: { index: false, follow: false },
};

const VARIANTEN: { label: string; beschreibung: string; node: React.ReactNode }[] = [
  {
    label: 'VARIANTE A · Editorial Accordion',
    beschreibung:
      'Riesiger Stufenname, darunter die Merkmale als Accordion-Zeilen mit Haarlinien. Roter Punkt statt Nummer, Klick klappt den Erklaertext auf, Zeilen staggern beim Scrollen herein.',
    node: <VarianteA />,
  },
  {
    label: 'VARIANTE B · Feature-Matrix mit Sticky-Stufe',
    beschreibung:
      'Links sticky der Stufenname mit Badge, rechts die Merkmale in zwei Spalten. Klick hebt das Merkmal navy hervor, dimmt den Rest und faehrt ein Panel ueber beide Spalten aus.',
    node: <VarianteB />,
  },
  {
    label: 'VARIANTE C · Stacked Tiles',
    beschreibung:
      'Grosses Block-Intro je Stufe, darunter die Merkmale als kompakte Kacheln im Raster. Klick klappt die Kachel weich auf volle Breite auf, Hover hebt sie dezent an.',
    node: <VarianteC />,
  },
];

export default function StufenVariantenVergleichPage() {
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
        <div
          style={{
            background: 'var(--rr-navy)',
            color: '#f2f2ef',
            padding:
              'clamp(28px, 5vw, 48px) var(--rr-gutter, clamp(20px, 4vw, 64px))',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--rr-font-ui)',
              fontSize: 'clamp(11px, 1.4vw, 13px)',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--rr-red)',
              margin: '0 0 10px',
            }}
          >
            Stufen-Varianten A / B / C
          </p>
          <h1
            style={{
              fontFamily: 'var(--rr-font-display)',
              fontWeight: 800,
              fontSize: 'clamp(1.5rem, 3.4vw, 2.4rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: '0 0 8px',
              maxWidth: '22em',
            }}
          >
            Drei Design-Vorschlaege fuer die Stufen-Sektion
          </h1>
          <p
            style={{
              fontFamily: 'var(--rr-font-ui)',
              fontSize: 'clamp(13px, 1.6vw, 15px)',
              lineHeight: 1.5,
              opacity: 0.82,
              maxWidth: '40em',
              margin: 0,
            }}
          >
            Alle drei zeigen dieselben Stufen und Merkmale. Klick auf ein Merkmal
            klappt den Erklaertext auf. Business steht in jeder Variante klar als
            meistgewaehlte Stufe.
          </p>
        </div>

        {VARIANTEN.map((v) => (
          <div key={v.label}>
            <div
              style={{
                background: 'var(--rr-navy)',
                color: '#f2f2ef',
                padding:
                  'clamp(18px, 3.4vw, 28px) var(--rr-gutter, clamp(20px, 4vw, 64px))',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                borderBottom: '2px solid var(--rr-red)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--rr-font-ui)',
                  fontSize: 'clamp(14px, 1.6vw, 18px)',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                {v.label}
              </span>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--rr-font-ui)',
                  fontSize: 'clamp(12px, 1.4vw, 14px)',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  opacity: 0.78,
                  letterSpacing: 0,
                  textTransform: 'none',
                  maxWidth: '52em',
                }}
              >
                {v.beschreibung}
              </span>
            </div>
            {v.node}
          </div>
        ))}
      </div>
    </>
  );
}
