import type { Metadata } from 'next';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import VarianteA from '@/components/subpages/leistungen/website/v2/diagnose-varianten/VarianteA';
import VarianteB from '@/components/subpages/leistungen/website/v2/diagnose-varianten/VarianteB';
import VarianteC from '@/components/subpages/leistungen/website/v2/diagnose-varianten/VarianteC';
import '@/app/styleguide/styleguide.css';
import '@/components/subpages/leistungen/website/website.css';

/**
 * Vergleichs-Route (noindex) fuer den Auftraggeber: drei animierte Design-Varianten
 * der Diagnose-Sektion ("Was du wirklich brauchst") untereinander. Inhalt und
 * Empfehlungs-Logik sind in allen drei identisch zum Bestand (Diagnose.tsx): dieselben
 * drei Fragen, dieselbe Punkt-Summe -> Starter/Business/Premium, dieselben Ergebnis-Texte
 * und Nachbar-Stufen. Nur die Buehne unterscheidet sich. Chrome (Fonts, styleguide.css,
 * rr-Font-Wrapper) 1:1 aus der bestehenden stufen-varianten-Vergleichsseite. Kein
 * Menu/Footer. Die bestehende Diagnose.tsx und die Website-Seite bleiben unberuehrt.
 */
export const metadata: Metadata = {
  title: 'Diagnose-Varianten (Vergleich) · Red Rabbit Media',
  description:
    'Drei animierte Design-Varianten der Diagnose-Sektion zum Durchklicken. Gleiche Fragen, gleiche ehrliche Empfehlung.',
  robots: { index: false, follow: false },
};

const VARIANTEN: { label: string; beschreibung: string; node: React.ReactNode }[] = [
  {
    label: 'VARIANTE A · Grosse Typo-Antworten',
    beschreibung:
      'Keine Boxen: die Antworten stehen als grosse Serif-Zeilen untereinander, mit roter Ziffer auf hellem Chip. Hover schiebt die Zeile nach rechts und laesst die Unterstreichung wachsen. Klick laesst die gewaehlte Zeile stehen, wischt den Rest weg und blendet die naechste Frage ein. Duenne Fortschrittslinie oben.',
    node: <VarianteA />,
  },
  {
    label: 'VARIANTE B · Diagnose-Bogen',
    beschreibung:
      'Ein heller Befund-Bogen auf Teal, eckig, mit dezenten Hairlines wie ein Formular. Die gewaehlte Antwort bekommt einen roten, handschriftlich wirkenden Kreis (SVG-Stroke-Animation, passt zur Mal-Mechanik der Marke). Nach der dritten Frage stempelt sich das Ergebnis mit leichtem Settle auf den Bogen. Kollege-Hinweis als Randnotiz.',
    node: <VarianteB />,
  },
  {
    label: 'VARIANTE C · Split mit Live-Zusammenfassung',
    beschreibung:
      'Links sticky die bisherigen Antworten als wachsende Liste mit kleinen Checks, rechts die aktive Frage mit grossen Antwort-Flaechen (voll-flaechiger Hover-Fill in dunklerem Teal). Jede Antwort fliegt nach links in die Zusammenfassung. Das Ergebnis ersetzt die rechte Seite, links bleibt die Antwort-Historie als Begruendung stehen.',
    node: <VarianteC />,
  },
];

export default function DiagnoseVariantenVergleichPage() {
  const rrFonts = `rr ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:ital,wght@0,500;0,600;1,500;1,600&display=swap"
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
            Diagnose-Varianten A / B / C
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
            Drei Design-Vorschlaege fuer die Diagnose-Sektion
          </h1>
          <p
            style={{
              fontFamily: 'var(--rr-font-ui)',
              fontSize: 'clamp(13px, 1.6vw, 15px)',
              lineHeight: 1.5,
              opacity: 0.82,
              maxWidth: '44em',
              margin: 0,
            }}
          >
            Alle drei stellen dieselben drei Fragen und geben dieselbe ehrliche
            Empfehlung (Starter, Business oder Premium) mit denselben Texten. Klick
            dich einmal komplett durch: gleiche Antworten fuehren in jeder Variante
            zum gleichen Ergebnis. Nur das Design ist unterschiedlich.
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
                  maxWidth: '56em',
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
