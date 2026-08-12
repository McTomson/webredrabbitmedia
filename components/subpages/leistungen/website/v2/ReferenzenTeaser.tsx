import Link from 'next/link';

/**
 * Schmaler Teaser auf /referenzen, direkt nach den
 * Testimonials: das Zitat behauptet, die Arbeiten belegen. Bewusst nur ein
 * Streifen (Eyebrow + Satz + Frame-Button), keine eigene Galerie, damit die
 * Referenzen-Seite das Schaufenster bleibt. Server-Komponente, nur
 * rr-*-Klassen + Inline-Styles (kein styled-jsx noetig).
 */
export default function ReferenzenTeaser() {
  return (
    <section
      className="rr-section wd-refs-section"
      aria-labelledby="wd-refs-title"
      data-rr-snap
      style={{
        padding: 'var(--rr-section-y, clamp(96px, 12vw, 180px)) var(--rr-gutter, clamp(20px, 4vw, 64px))',
      }}
    >
      {/* Volle Bildschirmhoehe + vertikale Zentrierung (Thomas 29.07.: eigen-
          staendige Bloecke sollen wie eine volle Bildschirmseite wirken statt
          als kleine Textinsel in viel Leerraum). Plain globales style-Tag statt
          <style jsx> (LESSONS_LEARNED.md "styled-jsx im Relaunch meiden") — hier
          unproblematisch, weil es nur EINE Root-Komponente in diesem File gibt,
          aber Konvention bleibt gleich. Breakpoint = MOBILE_BREAKPOINT
          (lib/relaunch/scroll-standard.ts, 820px): darunter bleibt der Streifen
          bei natuerlicher Hoehe, sonst reisst 100vh-Zwang Leerraum unter den
          kurzen mobilen Inhalt (Eyebrow + ein Satz + Button). */}
      <style>{`
        .wd-refs-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (max-width: 820px) {
          .wd-refs-section {
            min-height: 0;
          }
        }
      `}</style>
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
          <p className="wd-eyebrow">SCHON GEBAUT</p>
          <p
            id="wd-refs-title"
            style={{
              marginTop: 14,
              fontFamily: 'var(--rr-font-serif, Georgia, serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.15rem, 1.6vw, 1.5rem)',
              lineHeight: 1.45,
              color: 'var(--rr-navy, #23262e)',
            }}
          >
            Seiten, die wir von Hand gebaut haben, kannst du dir anschauen und
            selber urteilen.
          </p>
        </div>
        <Link href="/referenzen" className="rr-btn-outline">
          Unsere Arbeiten ansehen
        </Link>
      </div>
    </section>
  );
}
