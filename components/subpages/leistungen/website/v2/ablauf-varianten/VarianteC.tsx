"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SCHRITTE } from "./VarianteA";

/**
 * Ablauf — Variante C: PROZESS-BAND HORIZONTAL.
 * Eine sticky Szene, in der ein horizontales Band beim Scrollen seitwaerts faehrt:
 * vier grosse eckige Karten nebeneinander, verbunden durch eine durchgehende Linie
 * mit einem wandernden roten Punkt, der zur aktiven Karte laeuft. Aktive Karte hebt
 * sich (Navy-Typo voll), der Rest ist gedimmt. Fortschrittsbalken oben zeigt die
 * Scroll-Position. prefers-reduced-motion / Mobile: vertikale Karten-Liste statt
 * Sticky-Band. Copy 1:1 aus Ablauf.tsx. rr-* Tokens, border-radius:0 ausser Punkte.
 */

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export default function VarianteC() {
  const trackRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    const band = bandRef.current;
    if (!track || !band) return;
    let raf = 0;
    let destroyed = false;

    const render = () => {
      const r = track.getBoundingClientRect();
      const denom = r.height - window.innerHeight;
      const q = denom > 0 ? clamp01(-r.top / denom) : 0;

      // Band seitwaerts fahren: von 0 bis -(Ueberhang)
      const overflow = Math.max(0, band.scrollWidth - band.parentElement!.clientWidth);
      band.style.transform = `translate3d(${(-overflow * q).toFixed(2)}px,0,0)`;

      if (dotRef.current) {
        dotRef.current.style.left = `${(q * 100).toFixed(3)}%`;
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${q.toFixed(4)})`;
      }

      const n = SCHRITTE.length;
      const idx = Math.min(n - 1, Math.max(0, Math.floor(q * n)));
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };

    const loop = () => {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("scroll", render, { passive: true });
    window.addEventListener("resize", render);
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", render);
      window.removeEventListener("resize", render);
    };
  }, [reduced]);

  return (
    <section className="pb" aria-labelledby="pb-title">
      <div className="pb__head">
        <p className="pb__eyebrow">(SO LÄUFT DAS AB)</p>
        <h2 id="pb-title" className="pb__h2">
          Vier Schritte. Und du siehst deine Seite echt, bevor du dich festlegst.
        </h2>
      </div>

      <div ref={trackRef} className="pb__track">
        <div className="pb__stage">
          {/* Fortschritts-Faden mit wanderndem Punkt (Desktop-Szene) */}
          <div className="pb__rail" aria-hidden="true">
            <span className="pb__railfill" ref={barRef} />
            <span className="pb__raildot" ref={dotRef} />
          </div>

          <div className="pb__viewport">
            <div ref={bandRef} className="pb__band">
              {SCHRITTE.map((s, i) => (
                <article
                  key={i}
                  className={"pb__card" + (i === active ? " is-active" : "")}
                >
                  <span className="pb__num" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <h3 className="pb__titel">{s.titel}</h3>
                  <p className="pb__text">{s.text}</p>
                  <p className="pb__erg">
                    <span className="pb__ergtag">Ergebnis</span>
                    <span className="pb__ergtext">{s.ergebnis}</span>
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pb__cta">
        <Link href="/relaunch-preview/kontakt" className="rr-btn-frame rr-btn-frame--navy">
          <i className="c1" />
          <i className="c2" />
          <i className="c3" />
          <i className="c4" />
          <span className="rr-btn-frame__t">Mach den ersten Schritt</span>
        </Link>
      </div>

      <style jsx>{`
        .pb {
          background: #ffffff;
          color: var(--rr-ink);
        }
        .pb__head {
          max-width: 780px;
          margin: 0 auto;
          padding: var(--rr-section-y, clamp(96px, 12vw, 180px))
            var(--rr-gutter, clamp(20px, 4vw, 64px)) 0;
        }
        .pb__eyebrow {
          font-family: var(--rr-font-display);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--rr-red);
          margin: 0 0 18px;
        }
        .pb__h2 {
          font-family: var(--rr-font-serif);
          font-weight: 500;
          font-size: clamp(1.8rem, 4vw, 3.1rem);
          line-height: 1.11;
          letter-spacing: -0.01em;
          color: var(--rr-navy);
          margin: 0;
          text-wrap: balance;
        }

        /* Basis (Mobile / reduced-motion): vertikale Karten-Liste */
        .pb__track {
          position: relative;
        }
        .pb__stage {
          padding: clamp(40px, 6vw, 72px) var(--rr-gutter, clamp(20px, 4vw, 64px));
          max-width: 1080px;
          margin: 0 auto;
        }
        .pb__rail {
          display: none;
        }
        .pb__viewport {
          overflow: hidden;
        }
        .pb__band {
          display: flex;
          flex-direction: column;
          gap: clamp(20px, 4vw, 28px);
        }
        .pb__card {
          border: 1px solid rgba(28, 40, 55, 0.16);
          padding: clamp(24px, 4vw, 36px);
          background: #fff;
        }
        .pb__num {
          display: block;
          font-family: var(--rr-font-serif);
          font-weight: 500;
          font-size: clamp(2rem, 5vw, 2.8rem);
          line-height: 1;
          color: var(--rr-red);
          margin-bottom: 16px;
        }
        .pb__titel {
          margin: 0;
          font-family: var(--rr-font-display);
          font-weight: 700;
          font-size: clamp(1.3rem, 2.4vw, 1.9rem);
          line-height: 1.14;
          letter-spacing: -0.015em;
          color: var(--rr-navy);
        }
        .pb__text {
          margin: 14px 0 0;
          font-family: var(--rr-font-ui);
          font-size: clamp(1rem, 1.15vw, 1.12rem);
          line-height: 1.6;
          color: var(--rr-ink);
        }
        .pb__erg {
          margin: 20px 0 0;
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0 12px;
        }
        .pb__ergtag {
          font-family: var(--rr-font-ui);
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-red);
          border: 1px solid var(--rr-red);
          padding: 3px 8px;
          white-space: nowrap;
          transform: translateY(-2px);
        }
        .pb__ergtext {
          font-family: var(--rr-font-serif);
          font-style: italic;
          font-size: clamp(0.98rem, 1.15vw, 1.15rem);
          line-height: 1.45;
          color: var(--rr-navy);
        }
        .pb__cta {
          max-width: 1080px;
          margin: 0 auto;
          padding: clamp(20px, 3vw, 32px) var(--rr-gutter, clamp(20px, 4vw, 64px))
            var(--rr-section-y, clamp(96px, 12vw, 180px));
        }

        /* Desktop-Szene: Sticky-Band, seitwaerts scrollend */
        @media (min-width: 861px) and (prefers-reduced-motion: no-preference) {
          .pb__track {
            height: 360vh;
          }
          .pb__stage {
            position: sticky;
            top: 0;
            height: 100vh;
            max-width: none;
            margin: 0;
            /* Top-Padding raeumt das sticky Vergleichs-Label (ebenfalls top:0)
               frei, damit die Fortschritts-Schiene mit dem roten Punkt nicht
               dahinter verschwindet. */
            padding: clamp(150px, 22vh, 210px) 0 clamp(40px, 6vh, 64px);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: clamp(28px, 4vh, 48px);
            overflow: hidden;
          }
          .pb__rail {
            display: block;
            position: relative;
            height: 2px;
            margin: 0 var(--rr-gutter, clamp(20px, 4vw, 64px));
            background: rgba(28, 40, 55, 0.14);
          }
          .pb__railfill {
            position: absolute;
            inset: 0;
            background: var(--rr-red);
            transform-origin: left center;
            transform: scaleX(0);
            will-change: transform;
          }
          .pb__raildot {
            position: absolute;
            top: 50%;
            left: 0;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: var(--rr-red);
            transform: translate(-50%, -50%);
            box-shadow: 0 0 0 6px rgba(241, 32, 50, 0.14);
            will-change: left;
          }
          .pb__viewport {
            width: 100%;
          }
          .pb__band {
            flex-direction: row;
            gap: clamp(24px, 3vw, 44px);
            padding: 0 12vw;
            width: max-content;
            will-change: transform;
          }
          .pb__card {
            flex: 0 0 auto;
            width: min(46vw, 560px);
            padding: clamp(32px, 3.4vw, 52px);
            opacity: 0.4;
            transition: opacity 0.4s var(--rr-ease, ease),
              border-color 0.4s var(--rr-ease, ease);
          }
          .pb__card.is-active {
            opacity: 1;
            border-color: var(--rr-navy);
          }
          .pb__num {
            color: transparent;
            -webkit-text-stroke: 1px rgba(28, 40, 55, 0.3);
            font-size: clamp(2.6rem, 4vw, 3.6rem);
            transition: color 0.4s var(--rr-ease, ease),
              -webkit-text-stroke-color 0.4s var(--rr-ease, ease);
          }
          .pb__card.is-active .pb__num {
            color: var(--rr-red);
            -webkit-text-stroke-color: transparent;
          }
          .pb__titel {
            font-size: clamp(1.6rem, 2.4vw, 2.3rem);
          }
        }
      `}</style>
    </section>
  );
}
