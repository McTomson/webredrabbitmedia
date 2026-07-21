import Link from 'next/link';

/**
 * Schmaler Teaser auf /relaunch-preview/referenzen, direkt nach den
 * Testimonials: das Zitat behauptet, die Arbeiten belegen. Bewusst nur ein
 * Streifen (Eyebrow + Satz + Frame-Button), keine eigene Galerie, damit die
 * Referenzen-Seite das Schaufenster bleibt. Server-Komponente, nur
 * rr-*-Klassen + Inline-Styles (kein styled-jsx noetig).
 */
export default function ReferenzenTeaser() {
  return (
    <section
      className="rr-section"
      aria-labelledby="wd-refs-title"
      style={{
        padding: 'var(--rr-section-y, clamp(96px, 12vw, 180px)) var(--rr-gutter, clamp(20px, 4vw, 64px))',
      }}
    >
      <div
        className="rr-reveal"
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px 48px',
          borderTop: '1px solid rgba(28, 40, 55, 0.14)',
          borderBottom: '1px solid rgba(28, 40, 55, 0.14)',
          padding: 'clamp(28px, 4vw, 44px) 0',
        }}
      >
        <div style={{ maxWidth: '58ch' }}>
          <p className="rr-eyebrow-lg">SCHON GEBAUT</p>
          <p
            id="wd-refs-title"
            style={{
              marginTop: 14,
              fontFamily: 'var(--rr-font-serif, Georgia, serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.15rem, 1.6vw, 1.5rem)',
              lineHeight: 1.45,
              color: 'var(--rr-navy, #1c2837)',
            }}
          >
            Seiten, die wir von Hand gebaut haben, kannst du dir anschauen und
            selber urteilen.
          </p>
        </div>
        <Link href="/relaunch-preview/referenzen" className="rr-btn-frame rr-btn-frame--navy">
          <i className="c1" />
          <i className="c2" />
          <i className="c3" />
          <i className="c4" />
          <span className="rr-btn-frame__t">Unsere Arbeiten ansehen</span>
        </Link>
      </div>
    </section>
  );
}
