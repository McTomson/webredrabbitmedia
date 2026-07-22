'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import './kunden-sagen.css';

/**
 * Sektion "Was unsere Kunden sagen" — Layout nach finsight.framer.ai,
 * Marke Red Rabbit. Umbau 21.07.: WEISSER Grund, dunkle Typo (rr-Tokens),
 * Rot nur als sparsamer Akzent. Google-Branding (farbiges G-Logo neben den
 * Gold-Sternen). Smoother Personen-Wechsel (Crossfade + Slide, reduced-motion
 * beachtet). Avatar-Kacheln neutral hellgrau, die aktive bekommt einen
 * dezenten roten Farbfilter (halbtransparent) statt Vollton-Rot; Logo-Slot
 * ist vorbereitet (Initialen als Fallback).
 *
 * Nur ECHTE Google-Rezensionen, Wortlaut 1:1. Am 22.07.2026 direkt gegen das
 * Live-Google-Profil verifiziert (Maps: "Red Rabbit GmbH", redrabbit.media,
 * Habsburgergasse 1010 Wien): Das Profil hat insgesamt genau DREI Rezensionen
 * (5,0): Rafael Danesh (5 Sterne), Rene Rohrer (5 Sterne), Dmitry Pashlov
 * (5 Sterne). Dmitry Pashlov ist Teammitglied (Lead Developer, siehe
 * Referenzen.tsx / SoArbeitenWir.tsx: "NIE als Kundenstimme") — seine
 * Rezension wird deshalb bewusst NICHT angezeigt. Mehr echte Rezensionen
 * existieren nicht; nichts erfinden. Rene-Rohrer-Wortlaut am 22.07. auf den
 * exakten Original-Wortlaut korrigiert (inkl. ":-)" und Original-Zeichensetzung).
 * Kein Foto vorhanden -> Kachel zeigt Initialen statt eines erfundenen Bildes.
 */

interface Testimonial {
  id: string;
  name: string;
  role: string;
  initials: string;
  stars: number;
  quote: string;
  /** Vorbereitet fuer echte Kunden-Logos; solange leer -> Initialen-Fallback. */
  logo?: string;
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
      'Ich bin von der Firma begeistert vor allem von der Umsetzung, ein Lob an Herrn Uhlir der mich durch die Zeit der Umsetzung begleitet hat. Vielen lieben Dank :-) 100 Prozent Empfehlung',
  },
];

const TILE = 123;
const GAP = 16;

/** Offizielles Google-"G" (4 Farben), inline als SVG — kein externes Asset. */
function GoogleG() {
  return (
    <svg className="ks-google-g" viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export default function KundenSagen() {
  const [active, setActive] = useState(0);
  // Anim-Schluessel: erzwingt den Enter-Effekt (Crossfade + Slide) bei jedem
  // Wechsel. Startet auf 0 -> kein Effekt beim ersten Paint.
  const [animKey, setAnimKey] = useState(0);
  const firstRun = useRef(true);
  const count = TESTIMONIALS.length;
  const current = TESTIMONIALS[active];

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setAnimKey((k) => k + 1);
  }, [active]);

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
    <section className="ks-section">
      <div className="ks-wrap">
        <h2 className="ks-title">Was unsere Kunden sagen</h2>

        <div className="ks-quote-block" aria-live="polite">
          <div key={animKey} className="ks-quote-anim">
            <div className="ks-badge">
              <GoogleG />
              {current.stars === 5 && (
                <span className="ks-stars" aria-label="5 von 5 Sternen">
                  ★★★★★
                </span>
              )}
              <span className="ks-badge-label">Google Rezension</span>
            </div>
            <blockquote className="ks-quote">{current.quote}</blockquote>
          </div>
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
                  <span className="ks-tile-media">
                    {t.logo ? (
                      <img className="ks-tile-logo" src={t.logo} alt="" aria-hidden="true" />
                    ) : (
                      <span className="ks-tile-initials">{t.initials}</span>
                    )}
                  </span>
                  {/* dezenter roter Farbfilter ueber der aktiven Kachel */}
                  <span className="ks-tile-filter" aria-hidden="true" />
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
