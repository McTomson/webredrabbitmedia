import type { Metadata } from 'next';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import VarianteA from '@/components/subpages/leistungen/website/v2/ablauf-varianten/VarianteA';
import VarianteB from '@/components/subpages/leistungen/website/v2/ablauf-varianten/VarianteB';
import VarianteC from '@/components/subpages/leistungen/website/v2/ablauf-varianten/VarianteC';
import '@/app/styleguide/styleguide.css';

/**
 * Vergleichs-Route (noindex) fuer den Auftraggeber: drei animierte Design-Varianten
 * der "So laeuft das ab"-Sektion untereinander. Ersetzt die Kreis-Ketten-Optik durch
 * drei schoener designte, animierte Alternativen. Copy (4 Schritte + Eyebrow + H2 +
 * CTA) 1:1 aus components/subpages/leistungen/website/v2/Ablauf.tsx. Chrome (Fonts,
 * styleguide.css, rr-Font-Wrapper, sticky Navy-Label) 1:1 aus der stufen-varianten-
 * Vergleichsseite. Kein Menu/Footer. Bestehende Ablauf.tsx bleibt unberuehrt.
 */
export const metadata: Metadata = {
  title: 'Ablauf-Varianten (Vergleich) · Red Rabbit Media',
  description:
    'Drei animierte Design-Varianten der Ablauf-Sektion (Vier Schritte) zum Durchscrollen und Vergleichen.',
  robots: { index: false, follow: false },
};

const VARIANTEN: { label: string; beschreibung: string; node: React.ReactNode }[] = [
  {
    label: 'VARIANTE A · Editorial-Zahlen-Stack',
    beschreibung:
      'Die vier Schritte als grosse Editorial-Rows untereinander. Links riesige Serif-Ziffer als Haarlinien-Outline, rechts Titel und Text. Die aktive Row faerbt die Ziffer rot und blendet die Ergebnis-Zeile ein, ein roter Fortschritts-Strich waechst links mit dem Scroll.',
    node: <VarianteA />,
  },
  {
    label: 'VARIANTE B · Sticky-Split mit rotem Faden',
    beschreibung:
      'Links sticky der aktuelle Schritt gross mit Punkt-Progress, rechts scrollen vier hohe Trigger-Bloecke vorbei und crossfaden den linken Inhalt. Schritt-fuer-Schritt erzaehlt, mit rotem Faden durch die Punkte.',
    node: <VarianteB />,
  },
  {
    label: 'VARIANTE C · Prozess-Band horizontal',
    beschreibung:
      'Ein horizontales Band faehrt in einer sticky Szene seitwaerts: vier eckige Karten nebeneinander, verbunden durch eine Linie mit wanderndem rotem Punkt. Die aktive Karte hebt sich, der Rest ist gedimmt. Mobile: vertikale Liste.',
    node: <VarianteC />,
  },
];

export default function AblaufVariantenVergleichPage() {
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
            Ablauf-Varianten A / B / C
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
            Drei Design-Vorschlaege fuer die Ablauf-Sektion
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
            Alle drei zeigen dieselben vier Schritte und denselben Text. Statt der
            Kreis-Kette drei animierte Alternativen. Scroll durch jede Variante,
            um die Bewegung zu sehen.
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
