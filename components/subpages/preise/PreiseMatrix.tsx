'use client';

import Link from 'next/link';
import FloatingReview from './FloatingReview';

/**
 * Sektion 3 — die drei Pakete MIT Preis (brand/PREISE_SEITE_BRIEF.md Abschnitt
 * 5.3/6/10): Preise sichtbar und selbstbewusst (DM Sans Bold), Business
 * featured ("MEISTGEWÄHLT"), Delta-Phrasing "Alles aus X, plus" wie in
 * components/subpages/leistungen/website/v2/stufen-varianten/VarianteA
 * (Feature-Vokabular uebernommen). Preise NUR 950 / 2.900 / ab 4.900 — nie
 * andere Zahlen, nie 790. Custom-Zeile 1:1 aus dem Brief.
 */

type Paket = {
  name: string;
  price: string;
  tagline: string;
  delta?: string;
  features: string[];
  featured?: boolean;
};

const PAKETE: Paket[] = [
  {
    name: 'Starter',
    price: '950 €',
    tagline: 'Der faire Einstieg für alle, die schlank und schnell online wollen.',
    features: [
      'One-Pager',
      'Individuelles Design, kein Baukasten',
      'Sauber auf allen Geräten',
      'Kontaktformular und Anruf-Wege',
      'SEO-Grundlagen',
      'DSGVO-konform',
    ],
  },
  {
    name: 'Business',
    price: '2.900 €',
    tagline: 'Die solide Website für Betriebe, die gefunden werden wollen.',
    delta: 'Alles aus Starter, plus:',
    featured: true,
    features: [
      'Mehrseitige Website',
      'Erweiterte SEO und lokale Sichtbarkeit',
      'Dashboard gratis dabei',
      'Struktur für Anfragen',
    ],
  },
  {
    name: 'Premium',
    price: 'ab 4.900 €',
    tagline: 'Das Flaggschiff, wenn deine Website wirklich arbeiten soll.',
    delta: 'Alles aus Business, plus:',
    features: [
      'Umfangreiche, individuell gebaute Website',
      'Performance und Conversion',
      'SEO und KI-Sichtbarkeit',
      'Content- und KI-Artikel-Anbindung',
      'Persönliche Begleitung mit Priorität',
    ],
  },
];

export default function PreiseMatrix() {
  return (
    <section className="rr-section rp-matrix" id="pakete">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow">Drei Pakete</p>
        <h2 className="rr-statement rp-matrix__h2">
          Drei Pakete, ein Prinzip<span style={{ color: 'var(--rr-red)' }}>.</span>
        </h2>
        <p className="rr-body-lg rp-matrix__intro">
          Du weißt vorher, woran du bist. Wähl das Paket, das zu deinem Betrieb passt, und
          wachse später jederzeit in die nächste Stufe.
        </p>

        <div className="rp-cards">
          {PAKETE.map((p) => (
            <div key={p.name} className={`rp-card${p.featured ? ' rp-card--featured' : ''}`}>
              {p.featured && <span className="rp-card__tag">Meistgewählt</span>}
              <p className="rp-card__name">{p.name}</p>
              <p className="rp-card__price">{p.price}</p>
              <span className="rp-card__badge">0 € bis zum Entwurf</span>
              <p className="rp-card__tagline">{p.tagline}</p>
              {p.delta && <p className="rp-card__delta">{p.delta}</p>}
              <ul className="rp-card__list">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link
                href="/relaunch-preview/kontakt"
                className={p.featured ? 'rr-btn-sweep rr-btn-sweep--red' : 'rr-btn-frame rr-btn-frame--navy'}
              >
                {!p.featured && (
                  <>
                    <i className="c1" />
                    <i className="c2" />
                    <i className="c3" />
                    <i className="c4" />
                  </>
                )}
                <span className={p.featured ? undefined : 'rr-btn-frame__t'}>{p.name} anfragen</span>
              </Link>
            </div>
          ))}
        </div>

        <p className="rr-meta rp-matrix__custom">
          Große oder besondere Projekte, etwa Shops oder Sonderfunktionen, planen wir
          individuell. Sprich uns einfach an, dann finden wir den passenden Rahmen.
        </p>
      </div>

      <FloatingReview
        side="right"
        quote="Ein Lob an Herrn Uhlir, der mich durch die Zeit der Umsetzung begleitet hat."
        name="Rene Rohrer, Google-Rezension"
      />

      <style jsx>{`
        .rp-matrix {
          position: relative;
          background: #ffffff;
        }
        .rp-matrix__h2 {
          margin: 18px 0 20px;
          max-width: 16em;
        }
        .rp-matrix__intro {
          color: var(--rr-ink-soft);
          max-width: 56ch;
          margin: 0 0 clamp(40px, 5vw, 64px);
        }
        .rp-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(20px, 2.4vw, 32px);
          align-items: stretch;
        }
        .rp-card {
          position: relative;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(28, 40, 55, 0.14);
          padding: clamp(28px, 2.6vw, 40px) clamp(22px, 2.2vw, 32px);
        }
        .rp-card--featured {
          border: 1px solid var(--rr-red);
          box-shadow: 0 24px 60px rgba(241, 32, 50, 0.1);
        }
        .rp-card__tag {
          position: absolute;
          top: -13px;
          left: clamp(22px, 2.2vw, 32px);
          background: var(--rr-red);
          color: #fff;
          font-family: var(--rr-font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
        }
        .rp-card__name {
          font-family: var(--rr-font-ui);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rr-ink-soft);
          margin: 8px 0 10px;
        }
        .rp-card__price {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(2.1rem, 3.4vw, 2.9rem);
          line-height: 1;
          letter-spacing: -0.02em;
          color: var(--rr-navy);
          margin: 0 0 14px;
        }
        .rp-card__badge {
          display: inline-block;
          align-self: flex-start;
          border: 1px solid rgba(28, 40, 55, 0.22);
          color: var(--rr-ink-soft);
          font-family: var(--rr-font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 3px 9px;
          margin-bottom: 18px;
        }
        .rp-card--featured .rp-card__badge {
          border-color: var(--rr-red);
          color: var(--rr-red);
        }
        .rp-card__tagline {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          line-height: 1.5;
          color: var(--rr-ink-soft);
          margin: 0 0 22px;
        }
        .rp-card__delta {
          font-family: var(--rr-font-ui);
          font-size: 13px;
          font-weight: 700;
          color: var(--rr-navy);
          margin: 0 0 10px;
        }
        .rp-card__list {
          list-style: none;
          margin: 0 0 28px;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
          flex: 1;
        }
        .rp-card__list li {
          position: relative;
          padding-left: 22px;
          font-family: var(--rr-font-ui);
          font-size: 15px;
          line-height: 1.45;
          color: var(--rr-ink);
        }
        .rp-card__list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.5em;
          width: 8px;
          height: 8px;
          background: var(--rr-red);
        }
        .rp-card :global(.rr-btn-sweep),
        .rp-card :global(.rr-btn-frame) {
          width: 100%;
          text-align: center;
          justify-content: center;
        }
        .rp-matrix__custom {
          margin-top: clamp(28px, 3vw, 40px);
          max-width: 60ch;
        }
        @media (max-width: 900px) {
          .rp-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
