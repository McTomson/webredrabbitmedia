"use client";

import Link from "next/link";
import { useState } from "react";
import { STUFEN } from "./VarianteA";

/**
 * Stufen — Variante C: STACKED TILES.
 * Pro Stufe ein grosses Block-Intro (Name + Kurzbeschreibung + Badge), darunter
 * die Merkmale als kompakte Kacheln in einem Grid (2-3 Spalten je nach Breite).
 * Klick expandiert die Kachel weich auf volle Breite und zeigt den Erklaertext
 * (grid-template-rows-Transition, Kachel wird grid-column 1/-1); die anderen
 * Kacheln weichen im Flow nach unten aus. Hover hebt die Kachel dezent an
 * (Hairline + Hintergrund-Tint, keine Schatten-Orgie). Copy identisch zu A/B.
 */

function StufeTiles({
  stufe,
}: {
  stufe: (typeof STUFEN)[number];
}) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className={"stk__stufe" + (stufe.featured ? " stk__stufe--featured" : "")}>
      <div className="stk__intro">
        <h3 className="stk__name">
          {stufe.name}
          {stufe.featured && <span className="stk__namedot" aria-hidden="true" />}
        </h3>
        <div className="stk__introbody">
          {stufe.featured && <span className="stk__tag">MEISTGEWÄHLT</span>}
          <p className="stk__text">{stufe.text}</p>
        </div>
      </div>

      <div className="stk__grid">
        {stufe.merkmale.map((m, i) => {
          const isActive = active === i;
          return (
            <button
              key={m.titel}
              type="button"
              className={"stk__tile" + (isActive ? " is-active" : "")}
              aria-expanded={isActive}
              onClick={() => setActive(isActive ? null : i)}
            >
              <span className="stk__tilehead">
                <span className="stk__dot" aria-hidden="true" />
                <span className="stk__titel">{m.titel}</span>
                <span className="stk__plus" aria-hidden="true">
                  <span className="stk__plus-h" />
                  <span className="stk__plus-v" />
                </span>
              </span>
              <span className="stk__panel">
                <span className="stk__panel-inner">
                  <span className="stk__detail">{m.detail}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .stk__stufe {
          padding: clamp(40px, 6vw, 76px) 0;
          border-top: 1px solid rgba(28, 40, 55, 0.12);
        }
        .stk__stufe--featured {
          border-top: 1px solid var(--rr-red);
          border-bottom: 1px solid var(--rr-red);
        }
        .stk__stufe--featured + .stk__stufe {
          border-top: 0;
        }

        .stk__intro {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: clamp(20px, 4vw, 56px);
          align-items: end;
          margin-bottom: clamp(28px, 4vw, 44px);
        }
        .stk__name {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(2.4rem, 5vw, 4.4rem);
          line-height: 0.98;
          color: var(--rr-navy);
          margin: 0;
          display: inline-flex;
          align-items: flex-end;
          gap: 0.28em;
          opacity: 0.62;
        }
        .stk__stufe--featured .stk__name {
          opacity: 1;
          font-size: clamp(2.9rem, 6.2vw, 5.4rem);
        }
        .stk__namedot {
          width: 0.16em;
          height: 0.16em;
          border-radius: 50%;
          background: var(--rr-red);
          margin-bottom: 0.22em;
        }
        .stk__introbody {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }
        .stk__tag {
          border: 1px solid var(--rr-red);
          color: var(--rr-red);
          font-family: var(--rr-font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
        }
        .stk__text {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          line-height: 1.55;
          color: var(--rr-ink-soft);
          max-width: 40em;
          margin: 0;
        }

        .stk__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .stk__tile {
          grid-column: span 1;
          background: transparent;
          border: 1px solid rgba(28, 40, 55, 0.14);
          cursor: pointer;
          text-align: left;
          padding: 0;
          display: flex;
          flex-direction: column;
          transition: background 0.32s var(--rr-ease, ease),
            border-color 0.32s var(--rr-ease, ease),
            transform 0.32s var(--rr-ease, ease);
        }
        @media (hover: hover) and (pointer: fine) {
          .stk__tile:hover {
            background: rgba(28, 40, 55, 0.03);
            border-color: rgba(28, 40, 55, 0.28);
            transform: translateY(-2px);
          }
        }
        .stk__tile.is-active {
          grid-column: 1 / -1;
          background: rgba(28, 40, 55, 0.03);
          border-color: var(--rr-red);
        }

        .stk__tilehead {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: clamp(16px, 2vw, 22px) clamp(16px, 2vw, 22px);
        }
        .stk__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(28, 40, 55, 0.28);
          flex: none;
          transition: background 0.3s var(--rr-ease, ease),
            transform 0.3s var(--rr-ease, ease);
        }
        .stk__tile:hover .stk__dot,
        .stk__tile.is-active .stk__dot {
          background: var(--rr-red);
        }
        .stk__tile.is-active .stk__dot {
          transform: scale(1.3);
        }
        .stk__titel {
          font-family: var(--rr-font-display);
          font-weight: 600;
          font-size: clamp(0.98rem, 1.4vw, 1.15rem);
          letter-spacing: -0.005em;
          color: var(--rr-navy);
          flex: 1;
        }
        .stk__plus {
          position: relative;
          width: 14px;
          height: 14px;
          flex: none;
          transition: transform 0.35s var(--rr-ease, ease);
        }
        .stk__tile.is-active .stk__plus {
          transform: rotate(45deg);
        }
        .stk__plus-h,
        .stk__plus-v {
          position: absolute;
          background: var(--rr-navy);
        }
        .stk__plus-h {
          top: 50%;
          left: 0;
          right: 0;
          height: 1.5px;
          transform: translateY(-50%);
        }
        .stk__plus-v {
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1.5px;
          transform: translateX(-50%);
        }

        .stk__panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s var(--rr-ease, ease);
        }
        .stk__tile.is-active .stk__panel {
          grid-template-rows: 1fr;
        }
        .stk__panel-inner {
          overflow: hidden;
          min-height: 0;
        }
        .stk__detail {
          display: block;
          font-family: var(--rr-font-ui);
          font-size: 15px;
          line-height: 1.62;
          color: var(--rr-ink-soft);
          max-width: 44em;
          padding: 0 clamp(16px, 2vw, 22px) clamp(18px, 2.2vw, 24px) 31px;
          opacity: 0;
          transform: translateY(-4px);
          transition: opacity 0.35s var(--rr-ease, ease) 0.05s,
            transform 0.35s var(--rr-ease, ease) 0.05s;
        }
        .stk__tile.is-active .stk__detail {
          opacity: 1;
          transform: none;
        }

        @media (max-width: 860px) {
          .stk__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 560px) {
          .stk__intro {
            grid-template-columns: 1fr;
            gap: 14px;
            align-items: start;
          }
          .stk__name,
          .stk__stufe--featured .stk__name {
            font-size: clamp(2.2rem, 12vw, 3rem);
          }
          .stk__grid {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .stk__tile,
          .stk__dot,
          .stk__plus,
          .stk__panel,
          .stk__detail {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

export default function VarianteC() {
  return (
    <section className="stk">
      <div className="stk__wrap">
        <p className="rr-eyebrow-lg">DREI STUFEN</p>
        <h2 className="stk__h2">Drei Stufen. Eine passt zu dir.</h2>

        {STUFEN.map((s) => (
          <StufeTiles key={s.name} stufe={s} />
        ))}

        <p className="rr-meta stk__meta">
          Was die Stufen kosten, steht schwarz auf weiß auf der{" "}
          <Link href="/relaunch-preview/preise" className="rr-link rr-link--text">
            Preisseite
          </Link>
          . Fixpreis, kein Stundensatz-Ratespiel.
        </p>
      </div>

      <style jsx>{`
        .stk {
          background: #f6f5f1;
          color: var(--rr-ink);
          padding: var(--rr-section-y, clamp(96px, 12vw, 180px))
            var(--rr-gutter, clamp(20px, 4vw, 64px));
        }
        .stk__wrap {
          max-width: 1120px;
          margin: 0 auto;
        }
        .stk__h2 {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          line-height: 1.02;
          letter-spacing: -0.02em;
          color: var(--rr-navy);
          max-width: 16em;
          margin: 18px 0 clamp(36px, 5vw, 56px);
        }
        .stk__meta {
          margin-top: clamp(40px, 5vw, 64px);
        }
      `}</style>
    </section>
  );
}
