'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/**
 * Ablauf "So läuft das ab" (Copy v2 §4). Vier Schritte als scroll-getriebene
 * Kreis-Kette: Sticky-Szene auf dem Desktop, bei der der naechste Schritt beim
 * Scrollen dazukommt (Kreis mit Zahl fuellt sich, Text darunter wechselt).
 * Mobile und prefers-reduced-motion bekommen dieselbe Liste als statische,
 * vertikale Aufzaehlung ohne Sticky/Scroll-Kopplung (reines CSS, kein JS noetig
 * fuer die Darstellung selbst). rr-* Tokens, Eckig-Gesetz border-radius:0 ausser
 * bei den Kreisen, DU-Anrede, echte Umlaute, kein Gedankenstrich, kein "KI"-Wort.
 * Nur <h2> (das eine h1 sitzt im Hero). Copy/Inhalt unveraendert aus v1.
 */

type Schritt = { titel: string; text: string; ergebnis: string };

const SCHRITTE: Schritt[] = [
  {
    titel: 'Du erzählst uns deinen Betrieb.',
    text: 'Kurz, wer du bist, was du machst, wer deine Kunden sind. Kein Formular-Marathon, ein Gespräch reicht.',
    ergebnis: 'Wir wissen, worum es geht. Ohne dass du dafür schon einen Cent zahlst.',
  },
  {
    titel: 'Wir bauen deinen Entwurf.',
    text: 'Den großen Teil der Arbeit machen wir, nicht du. Kein wochenlanges Hin und Her, den ersten Entwurf hast du meist in ein paar Tagen.',
    ergebnis: 'Du siehst deine echte Seite, fertig gestaltet. Nicht eine Skizze, nicht eine Vorlage. Deine.',
  },
  {
    titel: 'Du schaust sie dir in Ruhe an.',
    text: 'Das ist der Punkt, an dem andere Agenturen längst die halbe Rechnung geschickt hätten. Wir nicht. Du legst dich erst fest, wenn die Seite vor dir steht und sitzt. Wir zeigen sie dir zuerst, weil wir ziemlich sicher sind, dass sie dich überzeugt. Gefällt sie dir nicht, hat es dich nichts gekostet.',
    ergebnis: 'Du entscheidest mit dem Ergebnis vor Augen, nicht auf gut Glück.',
  },
  {
    titel: 'Feinschliff, dann geht sie live.',
    text: 'Sagst du Ja, feilen wir so lange, bis es passt. Dann stellen wir sie online, mit deiner Domain und allen Zugängen in deiner Hand.',
    ergebnis: 'Deine Seite ist live und gehört dir. Der Kollege legt am selben Tag los.',
  },
];

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export default function Ablauf() {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    let destroyed = false;

    const render = () => {
      const r = track.getBoundingClientRect();
      const denom = r.height - window.innerHeight;
      const q = denom > 0 ? clamp01(-r.top / denom) : 0;

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${q.toFixed(4)})`;
      }

      const idx = Math.min(3, Math.max(0, Math.floor(q * 4)));
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }
    };

    const loop = () => {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('scroll', render, { passive: true });
    window.addEventListener('resize', render);
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', render);
      window.removeEventListener('resize', render);
    };
  }, [reduced]);

  return (
    <section className="wd-abl" aria-labelledby="wd-abl-title">
      <div className="wd-abl__head">
        <p className="wd-eyebrow">(SO LÄUFT DAS AB)</p>
        <h2 id="wd-abl-title" className="rr-statement">
          Vier Schritte. Und du siehst deine Seite echt, bevor du dich festlegst.
        </h2>
      </div>

      <div ref={trackRef} className="wd-abl__track">
        <div className="wd-abl__stage">
          <div className="wd-abl__circles" aria-hidden="true">
            <div className="wd-abl__linetrack">
              <div ref={fillRef} className="wd-abl__linefill" />
            </div>
            {SCHRITTE.map((_, i) => (
              <span
                key={i}
                className={
                  'wd-abl__circle' +
                  (i === activeIndex ? ' is-active' : i < activeIndex ? ' is-done' : '')
                }
              >
                <span className="wd-abl__circlenum">0{i + 1}</span>
              </span>
            ))}
          </div>

          <ol className="wd-abl__list">
            {SCHRITTE.map((s, i) => (
              <li className={'wd-abl__step' + (i === activeIndex ? ' is-active' : '')} key={i}>
                <span className="wd-abl__stepnum" aria-hidden="true">
                  <span className="wd-abl__stepcircle">0{i + 1}</span>
                </span>
                <div className="wd-abl__body">
                  <h3 className="wd-abl__titel">{s.titel}</h3>
                  <p className="wd-abl__text">{s.text}</p>
                  <p className="wd-abl__erg">
                    <span className="wd-abl__ergtag">Ergebnis</span>
                    {s.ergebnis}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* CTA erst beim letzten Schritt: die Szene endet auf "live", also
              genau der Moment fuer den Entwurf-Einstieg. Dezent (Frame, kein
              Sweep), damit Quiz-CTA und Schluss-CTA die Haupt-Buttons bleiben.
              Mobile/reduced-motion: statisch nach der Liste sichtbar. */}
          <div className={'wd-abl__cta' + (reduced || activeIndex === 3 ? ' is-show' : '')}>
            <Link href="/relaunch-preview/kontakt" className="rr-btn-frame rr-btn-frame--navy">
              <i className="c1" /><i className="c2" /><i className="c3" /><i className="c4" />
              <span className="rr-btn-frame__t">Mach den ersten Schritt</span>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wd-abl {
          padding: calc(var(--rr-section-y, clamp(96px, 12vw, 180px)) * 1.5) var(--rr-gutter, clamp(20px, 4vw, 64px)) var(--rr-section-y, clamp(96px, 12vw, 180px));
          max-width: 1080px;
          margin: 0 auto;
        }
        .wd-abl__head {
          max-width: 780px;
          margin-bottom: clamp(40px, 6vw, 72px);
        }
        .wd-abl__track {
          position: relative;
        }
        .wd-abl__stage {
          display: block;
        }

        /* Kreis-Reihe (nur Desktop-Szene sichtbar, siehe Media Query unten) */
        .wd-abl__circles {
          display: none;
          position: relative;
          align-items: center;
          justify-content: space-between;
          --circle: clamp(60px, 6.4vw, 92px);
          width: min(880px, 92vw);
          margin: 0 auto;
        }
        .wd-abl__linetrack {
          position: absolute;
          left: calc(var(--circle) / 2);
          right: calc(var(--circle) / 2);
          top: 50%;
          height: 2px;
          transform: translateY(-50%);
          background: rgba(28, 40, 55, 0.16);
          overflow: hidden;
        }
        .wd-abl__linefill {
          position: absolute;
          inset: 0;
          background: var(--rr-red, #f12032);
          transform-origin: left center;
          transform: scaleX(0);
          will-change: transform;
        }
        .wd-abl__circle {
          position: relative;
          z-index: 1;
          width: var(--circle);
          height: var(--circle);
          border-radius: 50%;
          border: 2px solid var(--rr-navy, #1c2837);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
        }
        .wd-abl__circlenum {
          font-family: var(--rr-font-display, inherit);
          font-weight: 700;
          font-size: clamp(0.95rem, 1.4vw, 1.3rem);
          line-height: 1;
          color: var(--rr-navy, #1c2837);
          transition: color 0.3s ease;
        }
        .wd-abl__circle.is-done {
          background: var(--rr-navy, #1c2837);
          border-color: var(--rr-navy, #1c2837);
        }
        .wd-abl__circle.is-done .wd-abl__circlenum {
          color: #fff;
        }
        .wd-abl__circle.is-active {
          background: var(--rr-red, #f12032);
          border-color: var(--rr-red, #f12032);
          transform: scale(1.12);
        }
        .wd-abl__circle.is-active .wd-abl__circlenum {
          color: #fff;
        }

        /* Liste: mobile/reduced-motion Basis = statisch untereinander */
        .wd-abl__list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .wd-abl__step {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr);
          gap: clamp(16px, 3vw, 32px);
          margin-bottom: clamp(32px, 5vw, 56px);
        }
        .wd-abl__step:last-child {
          margin-bottom: 0;
        }
        .wd-abl__stepnum {
          display: flex;
          justify-content: center;
          padding-top: 2px;
        }
        .wd-abl__stepcircle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid var(--rr-navy, #1c2837);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--rr-font-display, inherit);
          font-weight: 700;
          font-size: 1rem;
          color: var(--rr-red, #f12032);
          flex-shrink: 0;
        }
        .wd-abl__titel {
          margin: 0;
          font-family: var(--rr-font-display, inherit);
          font-weight: 700;
          font-size: clamp(1.4rem, 2.4vw, 2.1rem);
          line-height: 1.14;
          color: var(--rr-navy, #1c2837);
          letter-spacing: -0.01em;
        }
        .wd-abl__text {
          margin: 16px 0 0;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(1.05rem, 1.25vw, 1.2rem);
          line-height: 1.7;
          color: var(--rr-ink, #23262e);
        }
        .wd-abl__erg {
          margin: 18px 0 0;
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 10px 14px;
          font-family: var(--rr-font-serif, Georgia, serif);
          font-style: italic;
          font-size: clamp(1.02rem, 1.25vw, 1.22rem);
          line-height: 1.45;
          color: var(--rr-navy, #1c2837);
        }
        .wd-abl__ergtag {
          font-family: var(--rr-font-ui, inherit);
          font-style: normal;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-red, #f12032);
          border: 1px solid var(--rr-red, #f12032);
          border-radius: 0;
          padding: 3px 8px;
          transform: translateY(-2px);
        }

        .wd-abl__cta {
          margin-top: clamp(28px, 4vw, 44px);
          text-align: center;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          pointer-events: none;
        }
        .wd-abl__cta.is-show {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        @media (max-width: 720px) {
          .wd-abl__cta {
            opacity: 1;
            transform: none;
            pointer-events: auto;
            text-align: left;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .wd-abl__cta {
            opacity: 1;
            transform: none;
            pointer-events: auto;
            transition: none;
          }
        }

        /* Desktop-Szene: Sticky-Scroll, nur wenn Platz da ist und Motion erlaubt */
        @media (min-width: 721px) and (prefers-reduced-motion: no-preference) {
          .wd-abl__track {
            height: calc(100vh + 180vh);
          }
          .wd-abl__stage {
            position: sticky;
            top: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: clamp(32px, 5vh, 56px);
          }
          .wd-abl__circles {
            display: flex;
          }
          .wd-abl__list {
            position: relative;
            width: 100%;
            max-width: 760px;
            min-height: clamp(260px, 36vh, 360px);
          }
          .wd-abl__step {
            position: absolute;
            inset: 0;
            display: block;
            margin: 0;
            opacity: 0;
            transform: translateY(8px);
            pointer-events: none;
            transition: opacity 0.3s ease, transform 0.3s ease;
            text-align: center;
          }
          .wd-abl__step.is-active {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
          }
          .wd-abl__stepnum {
            display: none;
          }
          .wd-abl__body {
            max-width: 720px;
            margin: 0 auto;
          }
          .wd-abl__erg {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
