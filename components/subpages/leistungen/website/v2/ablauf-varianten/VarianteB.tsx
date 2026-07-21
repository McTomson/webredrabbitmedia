"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SCHRITTE } from "./VarianteA";

/**
 * Ablauf — Variante B: STICKY-SPLIT MIT ROTEM FADEN.
 * Links sticky: der aktuelle Schritt gross (Serif-Titel + Text + Ergebnis-Tag),
 * darunter eine dezente Punkt-Progress (vier kleine Punkte, aktiver rot + groesser,
 * verbunden durch einen roten Faden der mitwaechst). Rechts scrollen vier hohe
 * Trigger-Bloecke vorbei (grosse Ziffer + Kurz-Titel), die den linken Inhalt weich
 * crossfaden. prefers-reduced-motion / Mobile: statische vertikale Liste, kein Sticky.
 * Copy 1:1 aus Ablauf.tsx (Kurzlabel rechts = der echte Schritt-Titel).
 * rr-* Tokens, border-radius:0 ausser Punkte, DU-Anrede, echte Umlaute.
 */

export default function VarianteB() {
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let destroyed = false;

    const render = () => {
      const blocks = blockRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!blocks.length) return;
      const mid = window.innerHeight * 0.5;
      let best = 0;
      let bestDist = Infinity;
      blocks.forEach((b, i) => {
        const r = b.getBoundingClientRect();
        const c = r.top + r.height / 2;
        const d = Math.abs(c - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      if (best !== activeRef.current) {
        activeRef.current = best;
        setActive(best);
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

  const cur = SCHRITTE[active];
  const progress = SCHRITTE.length > 1 ? active / (SCHRITTE.length - 1) : 0;

  return (
    <section className="sf" aria-labelledby="sf-title">
      <div className="sf__wrap">
        <header className="sf__head">
          <p className="sf__eyebrow">(SO LÄUFT DAS AB)</p>
          <h2 id="sf-title" className="sf__h2">
            Vier Schritte. Und du siehst deine Seite echt, bevor du dich festlegst.
          </h2>
        </header>

        <div className="sf__split">
          {/* LINKS: sticky, crossfadender Inhalt */}
          <div className="sf__left">
            <div className="sf__leftinner">
              <span className="sf__count" aria-hidden="true">
                0{active + 1} <span className="sf__countof">/ 0{SCHRITTE.length}</span>
              </span>
              <div key={active} className="sf__card">
                <h3 className="sf__titel">{cur.titel}</h3>
                <p className="sf__text">{cur.text}</p>
                <p className="sf__erg">
                  <span className="sf__ergtag">Ergebnis</span>
                  <span className="sf__ergtext">{cur.ergebnis}</span>
                </p>
              </div>

              <div className="sf__dots" aria-hidden="true">
                <span className="sf__dotline">
                  <span
                    className="sf__dotfill"
                    style={{ transform: `scaleX(${progress})` }}
                  />
                </span>
                {SCHRITTE.map((_, i) => (
                  <span
                    key={i}
                    className={"sf__dot" + (i === active ? " is-active" : i < active ? " is-done" : "")}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RECHTS: hohe Trigger-Bloecke */}
          <div className="sf__right">
            {SCHRITTE.map((s, i) => (
              <div
                key={i}
                ref={(el) => {
                  blockRefs.current[i] = el;
                }}
                className={"sf__trigger" + (i === active ? " is-active" : "")}
              >
                <button
                  type="button"
                  className="sf__triggerbtn"
                  onClick={() => {
                    activeRef.current = i;
                    setActive(i);
                  }}
                >
                  <span className="sf__trignum" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span className="sf__triglabel">{s.titel}</span>
                </button>
                <div className="sf__mobbody">
                  <p className="sf__text">{s.text}</p>
                  <p className="sf__erg">
                    <span className="sf__ergtag">Ergebnis</span>
                    <span className="sf__ergtext">{s.ergebnis}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sf__cta">
          <Link href="/relaunch-preview/kontakt" className="rr-btn-frame rr-btn-frame--navy">
            <i className="c1" />
            <i className="c2" />
            <i className="c3" />
            <i className="c4" />
            <span className="rr-btn-frame__t">Mach den ersten Schritt</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .sf {
          background: #f6f5f1;
          color: var(--rr-ink);
          padding: var(--rr-section-y, clamp(96px, 12vw, 180px))
            var(--rr-gutter, clamp(20px, 4vw, 64px));
        }
        .sf__wrap {
          max-width: 1180px;
          margin: 0 auto;
        }
        .sf__head {
          max-width: 780px;
          margin-bottom: clamp(40px, 6vw, 72px);
        }
        .sf__eyebrow {
          font-family: var(--rr-font-display);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--rr-red);
          margin: 0 0 18px;
        }
        .sf__h2 {
          font-family: var(--rr-font-serif);
          font-weight: 500;
          font-size: clamp(1.8rem, 4vw, 3.1rem);
          line-height: 1.11;
          letter-spacing: -0.01em;
          color: var(--rr-navy);
          margin: 0;
          text-wrap: balance;
        }

        .sf__split {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
          gap: clamp(24px, 5vw, 72px);
        }

        /* LINKS sticky */
        .sf__left {
          position: sticky;
          top: 0;
          align-self: start;
          height: 100vh;
          display: flex;
          align-items: center;
        }
        .sf__leftinner {
          width: 100%;
        }
        .sf__count {
          display: inline-block;
          font-family: var(--rr-font-display);
          font-weight: 700;
          font-size: clamp(0.8rem, 1vw, 0.95rem);
          letter-spacing: 0.16em;
          color: var(--rr-red);
          margin-bottom: clamp(20px, 3vw, 32px);
        }
        .sf__countof {
          color: var(--rr-ink-soft);
        }
        .sf__card {
          animation: sf-in 0.5s var(--rr-ease, ease) both;
        }
        @keyframes sf-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .sf__titel {
          margin: 0;
          font-family: var(--rr-font-serif);
          font-weight: 500;
          font-size: clamp(1.8rem, 3.6vw, 3rem);
          line-height: 1.08;
          letter-spacing: -0.015em;
          color: var(--rr-navy);
        }
        .sf__text {
          margin: clamp(18px, 2.4vw, 26px) 0 0;
          font-family: var(--rr-font-ui);
          font-size: clamp(1.02rem, 1.2vw, 1.18rem);
          line-height: 1.65;
          color: var(--rr-ink);
          max-width: 40em;
        }
        .sf__erg {
          margin: clamp(22px, 3vw, 30px) 0 0;
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0 12px;
        }
        .sf__ergtag {
          font-family: var(--rr-font-ui);
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-red);
          border: 1px solid var(--rr-red);
          padding: 3px 8px;
          white-space: nowrap;
          transform: translateY(-2px);
        }
        .sf__ergtext {
          font-family: var(--rr-font-serif);
          font-style: italic;
          font-size: clamp(1rem, 1.2vw, 1.2rem);
          line-height: 1.45;
          color: var(--rr-navy);
        }

        /* Punkt-Progress mit rotem Faden */
        .sf__dots {
          position: relative;
          display: flex;
          align-items: center;
          gap: clamp(28px, 5vw, 48px);
          margin-top: clamp(36px, 5vw, 56px);
          width: max-content;
        }
        .sf__dotline {
          position: absolute;
          left: 5px;
          right: 5px;
          top: 50%;
          height: 1px;
          transform: translateY(-50%);
          background: rgba(28, 40, 55, 0.18);
          overflow: hidden;
        }
        .sf__dotfill {
          position: absolute;
          inset: 0;
          background: var(--rr-red);
          transform-origin: left center;
          transition: transform 0.5s var(--rr-ease, ease);
        }
        .sf__dot {
          position: relative;
          z-index: 1;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #f6f5f1;
          box-shadow: inset 0 0 0 1.5px rgba(28, 40, 55, 0.3);
          transition: transform 0.35s var(--rr-ease, ease),
            box-shadow 0.35s var(--rr-ease, ease), background 0.35s var(--rr-ease, ease);
        }
        .sf__dot.is-done {
          background: var(--rr-red);
          box-shadow: inset 0 0 0 1.5px var(--rr-red);
        }
        .sf__dot.is-active {
          background: var(--rr-red);
          box-shadow: inset 0 0 0 1.5px var(--rr-red);
          transform: scale(1.7);
        }

        /* RECHTS: Trigger-Bloecke */
        .sf__right {
          display: block;
        }
        .sf__trigger {
          min-height: 82vh;
          display: flex;
          align-items: center;
          border-top: 1px solid rgba(28, 40, 55, 0.12);
        }
        .sf__trigger:last-child {
          border-bottom: 1px solid rgba(28, 40, 55, 0.12);
        }
        .sf__triggerbtn {
          width: 100%;
          background: transparent;
          border: 0;
          cursor: pointer;
          text-align: left;
          display: block;
          padding: clamp(24px, 4vw, 40px) 0;
          color: inherit;
          opacity: 0.34;
          transition: opacity 0.4s var(--rr-ease, ease);
        }
        .sf__trigger.is-active .sf__triggerbtn {
          opacity: 1;
        }
        .sf__trignum {
          display: block;
          font-family: var(--rr-font-serif);
          font-weight: 500;
          font-size: clamp(2.4rem, 5vw, 4rem);
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(28, 40, 55, 0.3);
          transition: -webkit-text-stroke-color 0.4s var(--rr-ease, ease),
            color 0.4s var(--rr-ease, ease);
        }
        .sf__trigger.is-active .sf__trignum {
          color: var(--rr-red);
          -webkit-text-stroke-color: transparent;
        }
        .sf__triglabel {
          display: block;
          margin-top: 14px;
          font-family: var(--rr-font-display);
          font-weight: 700;
          font-size: clamp(1.2rem, 2.2vw, 1.7rem);
          line-height: 1.14;
          letter-spacing: -0.015em;
          color: var(--rr-navy);
          max-width: 16em;
        }

        .sf__cta {
          margin-top: clamp(48px, 7vw, 88px);
        }

        /* Mobile / reduced-motion: statische vertikale Liste */
        @media (max-width: 860px) {
          .sf__split {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .sf__left {
            display: none;
          }
          .sf__trigger {
            min-height: 0;
            display: block;
            padding: clamp(28px, 6vw, 40px) 0;
          }
          .sf__triggerbtn {
            opacity: 1;
            padding: 0;
            cursor: default;
          }
          .sf__trignum {
            color: var(--rr-red);
            -webkit-text-stroke-color: transparent;
          }
          .sf__triglabel {
            max-width: none;
          }
          .sf__mobtext {
            display: block;
          }
        }
      `}</style>

      {/* Mobile-Fallback: unter jedem Trigger den vollen Text + Ergebnis zeigen,
          damit ohne Sticky-Szene nichts verloren geht. Nur <=860px sichtbar. */}
      <style jsx>{`
        .sf__mobbody {
          display: none;
        }
        @media (max-width: 860px) {
          .sf__mobbody {
            display: block;
            margin-top: 14px;
          }
          .sf__mobbody .sf__text {
            margin-top: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sf__left {
            display: none;
          }
          .sf__split {
            grid-template-columns: 1fr;
          }
          .sf__trigger {
            min-height: 0;
            display: block;
          }
          .sf__triggerbtn {
            opacity: 1;
          }
          .sf__trignum {
            color: var(--rr-red);
            -webkit-text-stroke-color: transparent;
          }
          .sf__mobbody {
            display: block;
            margin-top: 14px;
          }
          .sf__card {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
