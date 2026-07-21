'use client';

import { useMemo, useState } from 'react';
import './kunden-sagen.css';

/**
 * Sektion "Was unsere Kunden sagen" — 1:1 nach vermessener Vorlage
 * (finsight.framer.ai), Marke Red Rabbit (Navy-Grund #1c2837 statt Schwarz,
 * DM Sans statt deren Font, Akzentfarbe ueber --ks-accent umschaltbar).
 *
 * Nur ECHTE Google-Rezensionen, Wortlaut 1:1 aus Referenzen.tsx uebernommen:
 * Rafael Danesh + Rene Rohrer, beide 5 Sterne. Dmitry Pashlov ist laut
 * Referenzen.tsx und website/v2/Testimonials.tsx (beide 1:1 geprueft)
 * Teammitglied, KEINE Kundenstimme — deshalb hier bewusst NICHT als drittes
 * Zitat verwendet, kein Text erfunden. Kein Foto vorhanden -> Kachel zeigt
 * Initialen statt eines erfundenen Bildes.
 */

interface Testimonial {
  id: string;
  name: string;
  role: string;
  initials: string;
  stars: number;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'rafael-danesh',
    name: 'Rafael Danesh',
    role: 'Google-Rezension',
    initials: 'RD',
    stars: 5,
    quote:
      'Für unsere beiden Firmen wurden zwei Webseiten erstellt. Die Zusammenarbeit war äußerst präzise, auf all unsere Wünsche wurde detailliert eingegangen, und wir sind mit den Ergebnissen sehr zufrieden! Danke!',
  },
  {
    id: 'rene-rohrer',
    name: 'Rene Rohrer',
    role: 'Google-Rezension',
    initials: 'RR',
    stars: 5,
    quote:
      'Ich bin von der Firma begeistert, vor allem von der Umsetzung. Ein Lob an Herrn Uhlir, der mich durch die Zeit der Umsetzung begleitet hat. Vielen lieben Dank. 100 Prozent Empfehlung.',
  },
];

const TILE = 123;
const GAP = 16;

export default function KundenSagen() {
  const [active, setActive] = useState(0);
  const count = TESTIMONIALS.length;
  const current = TESTIMONIALS[active];

  // Mittelpunkt der aktiven Kachel relativ zur Mitte der zentrierten Reihe
  // (Reihe ist zentriert, also reicht Index-Rechnung ohne ref-Messung).
  const activeCenterOffset = useMemo(() => {
    const totalWidth = count * TILE + (count - 1) * GAP;
    const tileCenter = active * (TILE + GAP) + TILE / 2;
    return tileCenter - totalWidth / 2;
  }, [active, count]);

  const goTo = (index: number) => {
    const next = ((index % count) + count) % count;
    setActive(next);
  };

  return (
    <section className="ks-section" style={{ ['--ks-accent' as string]: '#c94f5c' }}>
      <div className="ks-wrap">
        <h2 className="ks-preset">Was unsere Kunden sagen</h2>

        <div className="ks-quote-block" aria-live="polite">
          {current.stars === 5 && (
            <p className="ks-stars" aria-label="5 von 5 Sternen" style={{ color: '#f4b400' }}>
              ★★★★★
            </p>
          )}
          <blockquote className="ks-preset ks-quote">{current.quote}</blockquote>
        </div>

        <div className="ks-row-area">
          <button
            type="button"
            className="ks-arrow ks-arrow--prev"
            aria-label="Vorherige Rezension"
            onClick={() => goTo(active - 1)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M11 3L5 9L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="ks-row-col">
            <div className="ks-attr" style={{ ['--ks-attr-left' as string]: `${activeCenterOffset}px` }}>
              <p className="ks-name">{current.name}</p>
              <p className="ks-role">{current.role}</p>
            </div>

            <div className="ks-tiles">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  className={`ks-tile${i === active ? ' ks-tile--active' : ''}`}
                  aria-pressed={i === active}
                  aria-label={t.name}
                  onClick={() => goTo(i)}
                >
                  {t.initials}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="ks-arrow ks-arrow--next"
            aria-label="Nächste Rezension"
            onClick={() => goTo(active + 1)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M7 3L13 9L7 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
