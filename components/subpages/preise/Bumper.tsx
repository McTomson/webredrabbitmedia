'use client';

import { useEffect, useRef, useState } from 'react';
import { clamp01 } from '@/lib/relaunch/morph/grammar';

/**
 * Bumper — kinetische Typografie direkt nach dem Preise-Hero (brand-Wunsch
 * Thomas 24.07.: "Worte die kommen, und dann Worte von unten die dagegen
 * bumpen"). Mechanik 1:1 aus der Bewegungs-Demo (scratchpad/bumper-demo.html)
 * portiert, aber SCROLL-getrieben statt Autoplay: eine sticky 100vh-Buehne
 * (Track+rAF+getBoundingClientRect+clamp01 wie TalosTalenteFahrt.tsx) laesst
 * Zeile fuer Zeile von unten hereinsteigen; jede neue Zeile stoesst den
 * Stapel darueber kurz nach oben (Overshoot-Bump), bevor er sich wieder
 * setzt. Die grosse Serif-Zeile "Erst ueberzeugt, dann bezahlt." landet zum
 * Schluss mit demselben Bump und dem roten Marken-Punkt.
 *
 * VERWORFEN (Thomas explizit): ein einfaches Fade-in/Rise ohne Anschlag. Der
 * Bump (Overshoot + kurzes Nach-oben-Stossen der Zeilen darueber) ist der
 * Kern der Idee, nicht nur Kosmetik — deshalb ueber direkte DOM-Transitions
 * gebaut statt ueber React-State-Interpolation (haette den Anschlag nur als
 * einen von vielen Zwischen-Frames gezeigt statt als fuehlbaren Ruck).
 *
 * prefers-reduced-motion: statischer Fallback, alle Zeilen ruhig sichtbar,
 * kein Sticky-Scrub, kein Bump (wie TalosTalenteFahrt es fuer schmale/
 * reduced-motion Ansichten loest). SSR-sicher: Default = Fallback, echter
 * Zustand erst nach Mount per matchMedia geprueft.
 */

const LINES: React.ReactNode[] = [
  <>
    Wir bauen dir eine <strong>ganze Website.</strong>
  </>,
  <>
    Von Grund auf. <span className="bmp-soft">Nicht von der Stange.</span>
  </>,
  <>
    Dazu ein Dashboard: <strong>Talos</strong>, dein persönlicher Helfer.
  </>,
  <>
    Grundfunktionen immer dabei.{' '}
    <span className="bmp-soft">Mehr per Abo, wenn du willst.</span>
  </>,
];

const N = LINES.length;
const TOTAL = N + 1; // + Payoff-Zeile
// Track-Hoehe: (TOTAL + 1) * 70vh = 6 * 70vh = 420vh Scroll-Weg fuer die
// sticky 100vh-Buehne, macht ~70vh Scroll-Strecke pro ausgeloester Zeile
// (gleiche Groessenordnung wie TalosTalenteFahrt ~105vh/Slide).
const STEP_VH = 70;
const TRACK_VH = (TOTAL + 1) * STEP_VH;

const EASE_BUMP = 'cubic-bezier(.34,1.32,.5,1)'; // Overshoot fuer den Anschlag
const EASE_SETTLE = 'cubic-bezier(.4,0,.3,1)';

function useReducedMotion() {
  const [reduced, setReduced] = useState(true); // SSR-sicher: erst nach Mount pruefen
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const check = () => setReduced(mq.matches);
    check();
    mq.addEventListener('change', check);
    return () => mq.removeEventListener('change', check);
  }, []);
  return reduced;
}

function StaticBumper() {
  return (
    <div className="bmp-wrap bmp-static">
      <p className="wd-eyebrow bmp-eyebrow">So funktioniert das</p>
      <div className="bmp-stack">
        {LINES.map((l, i) => (
          <p className="bmp-line bmp-line--static" key={i}>
            {l}
          </p>
        ))}
        <p className="bmp-line bmp-line--pay bmp-line--static">
          Erst überzeugt, dann bezahlt<span className="bmp-dot">.</span>
        </p>
      </div>
    </div>
  );
}

function KineticStack() {
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const firedRef = useRef<boolean[]>(new Array(TOTAL).fill(false));

  useEffect(() => {
    const track = trackRef.current!;
    let raf = 0;
    let destroyed = false;

    function bumpIn(idx: number) {
      const el = lineRefs.current[idx];
      if (!el) return;
      el.style.transition = `transform .62s ${EASE_BUMP}, opacity .38s ease`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      // Stapel darueber kurz nach oben stossen (der "Bump"), dann absetzen.
      for (let k = 0; k < idx; k++) {
        const above = lineRefs.current[k];
        if (!above) continue;
        above.style.transition = `transform .5s ${EASE_BUMP}`;
        above.style.transform = 'translateY(-7px)';
        window.setTimeout(() => {
          if (destroyed || !above) return;
          above.style.transition = `transform .42s ${EASE_SETTLE}`;
          above.style.transform = 'translateY(0)';
        }, 150);
      }
    }

    function bumpOut(idx: number) {
      const el = lineRefs.current[idx];
      if (!el) return;
      el.style.transition = 'transform .3s ease, opacity .25s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateY(64px)';
    }

    function render() {
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp01(-r.top / total) : 0;
      for (let i = 0; i < TOTAL; i++) {
        // Gleichmaessig gestaffelte Schwellen mit 8% Vorlauf/Nachlauf, damit
        // die erste Zeile nicht sofort beim Anheften ausloest und die letzte
        // (Payoff) etwas Luft zum Lesen hat, bevor die Buehne loslaesst.
        const threshold = 0.08 + i * (0.84 / (TOTAL - 1));
        const shouldFire = p >= threshold;
        if (shouldFire && !firedRef.current[i]) {
          firedRef.current[i] = true;
          bumpIn(i);
        } else if (!shouldFire && firedRef.current[i]) {
          firedRef.current[i] = false;
          bumpOut(i);
        }
      }
    }

    function loop() {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={trackRef} className="bmp-track">
      <section aria-label="So funktioniert das" className="bmp-sticky">
        <div className="bmp-wrap">
          <p className="wd-eyebrow bmp-eyebrow">So funktioniert das</p>
          <div className="bmp-stack">
            {LINES.map((l, i) => (
              <p
                className="bmp-line"
                key={i}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
              >
                {l}
              </p>
            ))}
            <p
              className="bmp-line bmp-line--pay"
              ref={(el) => {
                lineRefs.current[N] = el;
              }}
            >
              Erst überzeugt, dann bezahlt<span className="bmp-dot">.</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Bumper() {
  const reduced = useReducedMotion();

  return (
    <section className="rr-section bmp">
      {reduced ? <StaticBumper /> : <KineticStack />}

      {/* Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md
          "styled-jsx im Relaunch meiden"). Praefix bmp- gegen den Rest der
          Preise-Seite gescopet. */}
      <style>{`
        .bmp {
          background: #f6f5f1;
          padding-left: 0;
          padding-right: 0;
          overflow: hidden;
        }
        .bmp-track {
          height: calc(${TRACK_VH}vh);
          position: relative;
        }
        .bmp-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .bmp-static.bmp-wrap {
          padding-top: clamp(72px, 12vh, 140px);
          padding-bottom: clamp(72px, 12vh, 140px);
        }
        .bmp-wrap {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding-left: var(--rr-gutter, clamp(20px, 4.6vw, 72px));
          padding-right: var(--rr-gutter, clamp(20px, 4.6vw, 72px));
          position: relative;
        }
        .bmp-eyebrow {
          margin-bottom: clamp(28px, 6vh, 64px);
        }
        .bmp-stack {
          display: flex;
          flex-direction: column;
          gap: clamp(10px, 1.6vh, 20px);
        }
        .bmp-line {
          font-family: var(--rr-font-display);
          font-weight: 700;
          letter-spacing: -0.015em;
          font-size: clamp(1.5rem, 4.2vw, 3rem);
          line-height: 1.08;
          color: var(--rr-navy);
          margin: 0;
          opacity: 0;
          transform: translateY(64px);
          will-change: transform, opacity;
        }
        .bmp-line--static {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.6s ease;
        }
        .bmp-soft {
          color: var(--rr-ink-soft);
          font-weight: 500;
        }
        .bmp-line--pay {
          font-family: var(--rr-font-serif);
          font-weight: 500;
          font-size: clamp(2.2rem, 6.6vw, 4.8rem);
          line-height: 1;
          letter-spacing: -0.01em;
          margin-top: clamp(14px, 3vh, 34px);
        }
        .bmp-dot {
          color: var(--rr-red);
        }
        @media (max-width: 640px) {
          .bmp-line {
            font-size: clamp(1.3rem, 6vw, 1.9rem);
          }
          .bmp-line--pay {
            font-size: clamp(2rem, 9vw, 2.8rem);
          }
        }
      `}</style>
    </section>
  );
}
