"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Ablauf — Variante A: EDITORIAL-ZAHLEN-STACK.
 * Die vier Schritte als grosse Editorial-Rows untereinander. Links eine riesige
 * Serif-Ziffer (01-04, als Haarlinien-Outline, ink-soft), rechts Titel + Text.
 * Die aktive Row (naechster Row-Mittelpunkt zur Viewport-Mitte, oder Klick)
 * faerbt die Ziffer rot und blendet die Ergebnis-Zeile weich ein, die anderen
 * Rows dimmen. Links waechst eine haarduenne vertikale Verbindungslinie mit
 * rotem Fortschritts-Strich von Row zu Row mit dem Scroll.
 * prefers-reduced-motion / Mobile: statische vertikale Liste, Ergebnis offen,
 * keine Linien-Animation. Copy 1:1 aus Ablauf.tsx. rr-* Tokens, border-radius:0
 * ausser den kleinen Punkten, DU-Anrede, echte Umlaute, kein Gedankenstrich.
 */

export type Schritt = { titel: string; text: string; ergebnis: string };

// Copy identisch zu components/subpages/leistungen/website/v2/Ablauf.tsx.
export const SCHRITTE: Schritt[] = [
  {
    titel: "Du erzählst uns deinen Betrieb.",
    text: "Kurz, wer du bist, was du machst, wer deine Kunden sind. Kein Formular-Marathon, ein Gespräch reicht.",
    ergebnis: "Wir wissen, worum es geht. Ohne dass du dafür schon einen Cent zahlst.",
  },
  {
    titel: "Wir bauen deinen Entwurf.",
    text: "Den großen Teil der Arbeit machen wir, nicht du. Kein wochenlanges Hin und Her, den ersten Entwurf hast du meist in ein paar Tagen.",
    ergebnis: "Du siehst deine echte Seite, fertig gestaltet. Nicht eine Skizze, nicht eine Vorlage. Deine.",
  },
  {
    titel: "Du schaust sie dir in Ruhe an.",
    text: "Das ist der Punkt, an dem andere Agenturen längst die halbe Rechnung geschickt hätten. Wir nicht. Du legst dich erst fest, wenn die Seite vor dir steht und sitzt. Wir zeigen sie dir zuerst, weil wir ziemlich sicher sind, dass sie dich überzeugt. Gefällt sie dir nicht, hat es dich nichts gekostet.",
    ergebnis: "Du entscheidest mit dem Ergebnis vor Augen, nicht auf gut Glück.",
  },
  {
    titel: "Feinschliff, dann geht sie live.",
    text: "Sagst du Ja, feilen wir so lange, bis es passt. Dann stellen wir sie online, mit deiner Domain und allen Zugängen in deiner Hand.",
    ergebnis: "Deine Seite ist live und gehört dir. Der Kollege legt am selben Tag los.",
  },
];

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export default function VarianteA() {
  const listRef = useRef<HTMLOListElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const fillRef = useRef<HTMLSpanElement>(null);
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
      const rows = rowRefs.current.filter(Boolean) as HTMLLIElement[];
      if (!rows.length) return;
      const mid = window.innerHeight * 0.5;

      // aktive Row = deren Mitte der Viewport-Mitte am naechsten liegt
      let best = 0;
      let bestDist = Infinity;
      rows.forEach((row, i) => {
        const r = row.getBoundingClientRect();
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

      // vertikaler Fortschritts-Strich: 0 bis 1 ueber die gesamte Liste
      const list = listRef.current;
      if (list && fillRef.current) {
        const lr = list.getBoundingClientRect();
        const q = clamp01((mid - lr.top) / lr.height);
        fillRef.current.style.transform = `scaleY(${q.toFixed(4)})`;
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
    <section className="ez" aria-labelledby="ez-title">
      <div className="ez__wrap">
        <header className="ez__head">
          <p className="ez__eyebrow">(SO LÄUFT DAS AB)</p>
          <h2 id="ez-title" className="ez__h2">
            Vier Schritte. Und du siehst deine Seite echt, bevor du dich festlegst.
          </h2>
        </header>

        <div className="ez__grid">
          <div className="ez__line" aria-hidden="true">
            <span ref={fillRef} className="ez__linefill" />
          </div>

          <ol className="ez__rows" ref={listRef}>
            {SCHRITTE.map((s, i) => (
              <li
                key={i}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className={"ez__row" + (i === active ? " is-active" : "")}
              >
                <button
                  type="button"
                  className="ez__rowbtn"
                  onClick={() => {
                    activeRef.current = i;
                    setActive(i);
                  }}
                  aria-pressed={i === active}
                >
                  <span className="ez__num" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <div className="ez__body">
                    <h3 className="ez__titel">{s.titel}</h3>
                    <p className="ez__text">{s.text}</p>
                    <div className="ez__erg" aria-hidden={i !== active}>
                      <div className="ez__erginner">
                        <span className="ez__ergtag">Ergebnis</span>
                        <span className="ez__ergtext">{s.ergebnis}</span>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="ez__cta">
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
        .ez {
          background: #ffffff;
          color: var(--rr-ink);
          padding: var(--rr-section-y, clamp(96px, 12vw, 180px))
            var(--rr-gutter, clamp(20px, 4vw, 64px));
        }
        .ez__wrap {
          max-width: 1080px;
          margin: 0 auto;
        }
        .ez__head {
          max-width: 780px;
          margin-bottom: clamp(48px, 7vw, 96px);
        }
        .ez__eyebrow {
          font-family: var(--rr-font-display);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--rr-red);
          margin: 0 0 18px;
        }
        .ez__h2 {
          font-family: var(--rr-font-serif);
          font-weight: 500;
          font-size: clamp(1.8rem, 4vw, 3.1rem);
          line-height: 1.11;
          letter-spacing: -0.01em;
          color: var(--rr-navy);
          margin: 0;
          text-wrap: balance;
        }

        .ez__grid {
          display: grid;
          grid-template-columns: 2px minmax(0, 1fr);
          gap: clamp(24px, 4vw, 56px);
        }
        .ez__line {
          position: relative;
          background: rgba(28, 40, 55, 0.12);
        }
        .ez__linefill {
          position: absolute;
          inset: 0;
          background: var(--rr-red, #f12032);
          transform-origin: top center;
          transform: scaleY(0);
          will-change: transform;
        }

        .ez__rows {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .ez__row {
          border-bottom: 1px solid rgba(28, 40, 55, 0.1);
        }
        .ez__row:last-child {
          border-bottom: 0;
        }
        .ez__rowbtn {
          width: 100%;
          background: transparent;
          border: 0;
          cursor: pointer;
          text-align: left;
          display: grid;
          grid-template-columns: minmax(0, auto) minmax(0, 1fr);
          gap: clamp(20px, 4vw, 52px);
          align-items: start;
          padding: clamp(36px, 5vw, 64px) 0;
          color: inherit;
        }
        .ez__num {
          font-family: var(--rr-font-serif);
          font-weight: 500;
          font-size: clamp(3.4rem, 9vw, 7.2rem);
          line-height: 0.82;
          letter-spacing: -0.02em;
          color: transparent;
          -webkit-text-stroke: 1px rgba(28, 40, 55, 0.32);
          transition: -webkit-text-stroke-color 0.4s var(--rr-ease, ease),
            color 0.4s var(--rr-ease, ease), opacity 0.4s var(--rr-ease, ease);
          opacity: 0.7;
          user-select: none;
        }
        .ez__row.is-active .ez__num {
          color: var(--rr-red, #f12032);
          -webkit-text-stroke-color: transparent;
          opacity: 1;
        }
        .ez__body {
          transition: opacity 0.4s var(--rr-ease, ease);
          opacity: 0.5;
          padding-top: clamp(6px, 1.2vw, 14px);
        }
        .ez__row.is-active .ez__body {
          opacity: 1;
        }
        .ez__titel {
          margin: 0;
          font-family: var(--rr-font-display);
          font-weight: 700;
          font-size: clamp(1.35rem, 2.6vw, 2.2rem);
          line-height: 1.12;
          letter-spacing: -0.015em;
          color: var(--rr-navy);
        }
        .ez__text {
          margin: 16px 0 0;
          font-family: var(--rr-font-ui);
          font-size: clamp(1rem, 1.2vw, 1.15rem);
          line-height: 1.65;
          color: var(--rr-ink);
          max-width: 42em;
        }

        /* Ergebnis-Zeile: erst bei aktiver Row weich eingeblendet (0fr->1fr) */
        .ez__erg {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.45s var(--rr-ease, ease);
        }
        .ez__row.is-active .ez__erg {
          grid-template-rows: 1fr;
        }
        .ez__erginner {
          overflow: hidden;
          min-height: 0;
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0 12px;
          opacity: 0;
          transform: translateY(-4px);
          transition: opacity 0.4s var(--rr-ease, ease) 0.08s,
            transform 0.4s var(--rr-ease, ease) 0.08s;
        }
        .ez__row.is-active .ez__erginner {
          opacity: 1;
          transform: none;
          margin-top: 20px;
        }
        .ez__ergtag {
          font-family: var(--rr-font-ui);
          font-style: normal;
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-red, #f12032);
          border: 1px solid var(--rr-red, #f12032);
          padding: 3px 8px;
          white-space: nowrap;
          transform: translateY(-2px);
        }
        .ez__ergtext {
          font-family: var(--rr-font-serif);
          font-style: italic;
          font-size: clamp(1rem, 1.2vw, 1.2rem);
          line-height: 1.45;
          color: var(--rr-navy);
        }

        .ez__cta {
          margin-top: clamp(48px, 7vw, 88px);
          padding-left: calc(2px + clamp(24px, 4vw, 56px));
        }

        @media (max-width: 720px) {
          .ez__grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .ez__line {
            display: none;
          }
          .ez__rowbtn {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .ez__num {
            font-size: clamp(3rem, 18vw, 4.5rem);
          }
          .ez__cta {
            padding-left: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ez__num,
          .ez__body {
            opacity: 1;
            color: var(--rr-navy);
            -webkit-text-stroke-color: transparent;
            transition: none;
          }
          .ez__row .ez__num {
            color: var(--rr-ink-soft);
          }
          .ez__erg {
            grid-template-rows: 1fr;
            transition: none;
          }
          .ez__erginner {
            opacity: 1;
            transform: none;
            margin-top: 20px;
            transition: none;
          }
          .ez__linefill {
            transform: scaleY(1);
          }
        }
      `}</style>
    </section>
  );
}
