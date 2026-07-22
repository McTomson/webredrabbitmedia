'use client';

import { useEffect, useRef } from 'react';

/**
 * ScrollBumper — eigenstaendige, wiederverwendbare Stups-Mechanik: eine hohe
 * Sticky-Sektion, in der genau EIN Satz zentral sichtbar ist; beim Scrollen
 * schiebt der naechste Satz den aktuellen nach oben raus (kurze Ueberlappung
 * am Slot-Rand, dazwischen ein Halte-Fenster). Nachgebaut nach der Mechanik
 * der Haltungs-Statements auf der ueber-uns-Seite
 * (components/subpages/ueber-uns-demo/demo.engine.jstext:529-579, dort
 * B_HOLD/B_EDGE/B_FADE), aber OHNE die Demo-Engine anzufassen: eigener
 * rAF-Loop + getBoundingClientRect-Progress, Zentren gleichmaessig ueber die
 * Satzanzahl verteilt statt hardcoded (das Original hat 4 feste Werte fuer
 * genau 4 Saetze). Ersetzt im Hub die statische Scharnierzeile
 * (Scharnierzeile.tsx bleibt unveraendert bestehen, nur nicht mehr verwendet).
 */

export interface ScrollBumperStatement {
  text: string;
  /** Schluss-Satz: bleibt ab seiner Mitte zentral gehalten (wird nicht mehr
   *  nach oben rausgestupst, wie die Pointe in der ueber-uns-Vorlage) und
   *  bekommt einen roten Satzpunkt-Akzent statt des Original-Punkts. */
  pointe?: boolean;
}

interface ScrollBumperProps {
  statements: ScrollBumperStatement[];
}

// Normierte Zonen, relativ zur Slot-Breite W = 1/Satzanzahl — 1:1 aus der
// ueber-uns-Mechanik uebernommen (B_HOLD/B_EDGE/B_FADE): HOLD = zentral und
// voll lesbar, EDGE = leichtes Anstupsen am Slot-Rand (~10% Ueberlappung),
// danach faehrt der Satz verblassend raus. Bleibt fuer jede Satzanzahl gleich,
// weil die Distanz vorher durch W geteilt wird.
const HOLD = 0.34;
const EDGE = 0.5;
const FADE = 0.12;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
function smooth(t: number) {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

export default function ScrollBumper({ statements }: ScrollBumperProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const n = statements.length;
    const w = 1 / n;
    const centers = Array.from({ length: n }, (_, i) => w * (i + 0.5));

    let rafId = 0;

    function tick() {
      const vh = window.innerHeight;
      const rect = section!.getBoundingClientRect();
      const total = rect.height - vh;
      const bp = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;

      const EXIT = vh * 0.62; // faehrt oben ganz aus dem Bild
      const PARK = vh * 0.42; // wartet unten ausserhalb des Bilds
      const TOUCH = vh * 0.1; // Beruehrungsversatz am Slot-Rand (~10%)

      for (let i = 0; i < n; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        let d = (centers[i] - bp) / w;
        // Pointe: nie nach oben rausstupsen, sobald erreicht (bleibt gehalten).
        if (statements[i].pointe) d = Math.max(d, 0);
        const ad = Math.abs(d);
        const sgn = d < 0 ? -1 : 1;
        let y: number;
        let o: number;
        if (ad <= HOLD) {
          y = 0;
          o = 1;
        } else if (ad <= EDGE) {
          const k = smooth((ad - HOLD) / (EDGE - HOLD));
          y = sgn * k * TOUCH;
          o = 1;
        } else if (ad <= EDGE + FADE) {
          const m = smooth((ad - EDGE) / FADE);
          const far = sgn < 0 ? EXIT : PARK;
          y = sgn * (TOUCH + (far - TOUCH) * m);
          o = 1 - m;
        } else {
          y = sgn * (sgn < 0 ? EXIT : PARK);
          o = 0;
        }
        el.style.transform = `translate(-50%, -50%) translateY(${y.toFixed(1)}px)`;
        el.style.opacity = o.toFixed(3);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [statements]);

  return (
    <section ref={sectionRef} className="sb-section">
      <div className="sb-sticky">
        <div className="sb-stage">
          {statements.map((s, i) => {
            // Trennt einen etwaigen Original-Schlusspunkt ab, damit der rote
            // Punkt-Akzent den Satz nicht doppelt beendet.
            const text = s.pointe && s.text.endsWith('.') ? s.text.slice(0, -1) : s.text;
            return (
              <p
                key={i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={`sb-line rr-display-2${s.pointe ? ' sb-line--pointe' : ''}`}
              >
                {text}
                {s.pointe && <span className="sb-dot">.</span>}
              </p>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .sb-section {
          position: relative;
          height: 320vh;
          background: var(--rr-navy, #1c2837);
        }
        .sb-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }
        .sb-stage {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .sb-line {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(88%, 900px);
          text-align: center;
          color: #f6f5f1;
          margin: 0;
          will-change: transform, opacity;
        }
        .sb-dot {
          color: var(--rr-red, #f12032);
        }
        @media (prefers-reduced-motion: reduce) {
          .sb-section {
            height: auto;
            padding: var(--rr-section-y, clamp(96px, 12vw, 180px)) var(--rr-gutter, clamp(20px, 4vw, 64px));
          }
          .sb-sticky {
            position: static;
            height: auto;
            overflow: visible;
          }
          .sb-stage {
            position: static;
            height: auto;
            display: flex;
            flex-direction: column;
            gap: clamp(24px, 4vw, 40px);
          }
          .sb-line {
            position: static;
            transform: none !important;
            opacity: 1 !important;
            width: auto;
          }
        }
      `}</style>
    </section>
  );
}
