"use client";

import Link from "next/link";
import { useState } from "react";
import { STUFEN } from "./stufen-varianten/VarianteA";

/**
 * Drei Stufen — LIVE (Thomas' Wahl 21.07. aus /stufen-varianten): Variante B,
 * "Feature-Matrix mit Sticky-Stufe". Pro Stufe: links sticky der Stufenname +
 * Kurzbeschreibung + Badge, rechts die Merkmale als vertikale Liste in zwei
 * Spalten. Klick auf ein Merkmal expandiert inline ein Panel ueber beide
 * Spalten (grid-template-rows 0fr -> 1fr). Aktives Merkmal bekommt roten Punkt
 * + Navy-Hervorhebung, der Rest dimmt. Daten (STUFEN) aus stufen-varianten
 * importiert, damit die Vorschau-Route unberuehrt bleibt und nichts doppelt
 * gepflegt wird. Sektions-Rahmen (Eyebrow/H2/Abschluss/Padding) an die
 * Live-Seite angeglichen.
 */

function StufeMatrix({
  stufe,
}: {
  stufe: (typeof STUFEN)[number];
}) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className={"fmx__stufe" + (stufe.featured ? " fmx__stufe--featured" : "")}>
      <aside className="fmx__aside">
        <div className="fmx__asideinner">
          {stufe.featured && <span className="fmx__tag">MEISTGEWÄHLT</span>}
          <h3 className="fmx__name">
            {stufe.name}
            {stufe.featured && <span className="fmx__namedot" aria-hidden="true" />}
          </h3>
          <p className="fmx__text">{stufe.text}</p>
        </div>
      </aside>

      <div className="fmx__matrix">
        {stufe.merkmale.map((m, i) => {
          const isActive = active === i;
          const dimmed = active !== null && !isActive;
          return (
            <div
              key={m.titel}
              className={
                "fmx__cell" +
                (isActive ? " is-active" : "") +
                (dimmed ? " is-dim" : "")
              }
            >
              <button
                type="button"
                className="fmx__btn"
                aria-expanded={isActive}
                onClick={() => setActive(isActive ? null : i)}
              >
                <span className="fmx__mark" aria-hidden="true" />
                <span className="fmx__titel">{m.titel}</span>
              </button>
              <div className="fmx__panel">
                <div className="fmx__panel-inner">
                  <p className="fmx__detail">{m.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .fmx__stufe {
          display: grid;
          grid-template-columns: minmax(220px, 300px) 1fr;
          gap: clamp(28px, 5vw, 72px);
          padding: clamp(44px, 6vw, 80px) 0;
          border-top: 1px solid rgba(28, 40, 55, 0.12);
        }
        .fmx__stufe--featured {
          border-top: 1px solid var(--rr-red);
          border-bottom: 1px solid var(--rr-red);
        }
        .fmx__stufe--featured + .fmx__stufe {
          border-top: 0;
        }

        .fmx__aside {
          position: relative;
        }
        .fmx__asideinner {
          position: sticky;
          top: clamp(96px, 16vh, 172px);
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: flex-start;
        }
        .fmx__tag {
          border: 1px solid var(--rr-red);
          color: var(--rr-red);
          font-family: var(--rr-font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
        }
        .fmx__name {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(2.2rem, 4vw, 3.6rem);
          line-height: 1;
          color: var(--rr-navy);
          margin: 0;
          display: inline-flex;
          align-items: flex-end;
          gap: 0.26em;
          opacity: 0.62;
        }
        .fmx__stufe--featured .fmx__name {
          opacity: 1;
          font-size: clamp(2.6rem, 4.8vw, 4.2rem);
        }
        .fmx__namedot {
          width: 0.16em;
          height: 0.16em;
          border-radius: 50%;
          background: var(--rr-red);
          margin-bottom: 0.2em;
        }
        .fmx__text {
          font-family: var(--rr-font-ui);
          font-size: 14.5px;
          line-height: 1.55;
          color: var(--rr-ink-soft);
          max-width: 24em;
          margin: 0;
        }

        .fmx__matrix {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: clamp(20px, 3vw, 44px);
          align-content: start;
          border-top: 1px solid rgba(28, 40, 55, 0.1);
        }
        /* Aktives Panel spannt ueber beide Spalten. */
        .fmx__cell.is-active {
          grid-column: 1 / -1;
        }
        .fmx__cell {
          border-bottom: 1px solid rgba(28, 40, 55, 0.1);
          transition: opacity 0.4s var(--rr-ease, ease);
        }
        .fmx__cell.is-dim {
          opacity: 0.4;
        }

        .fmx__btn {
          width: 100%;
          background: transparent;
          border: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: clamp(13px, 1.6vw, 17px) 2px;
          text-align: left;
          transition: padding-left 0.3s var(--rr-ease, ease);
        }
        @media (hover: hover) and (pointer: fine) {
          .fmx__btn:hover {
            padding-left: 10px;
          }
        }
        .fmx__mark {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(28, 40, 55, 0.28);
          flex: none;
          transition: background 0.3s var(--rr-ease, ease),
            transform 0.3s var(--rr-ease, ease);
        }
        .fmx__btn:hover .fmx__mark {
          background: var(--rr-red);
        }
        .fmx__cell.is-active .fmx__mark {
          background: var(--rr-red);
          transform: scale(1.35);
        }
        .fmx__titel {
          font-family: var(--rr-font-display);
          font-weight: 500;
          font-size: clamp(1rem, 1.5vw, 1.18rem);
          letter-spacing: -0.005em;
          color: var(--rr-ink-soft);
          transition: color 0.3s var(--rr-ease, ease),
            font-weight 0.3s var(--rr-ease, ease);
        }
        .fmx__cell.is-active .fmx__titel {
          color: var(--rr-navy);
          font-weight: 700;
        }

        .fmx__panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s var(--rr-ease, ease);
        }
        .fmx__cell.is-active .fmx__panel {
          grid-template-rows: 1fr;
        }
        .fmx__panel-inner {
          overflow: hidden;
          min-height: 0;
        }
        .fmx__detail {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          line-height: 1.62;
          color: var(--rr-navy);
          max-width: 42em;
          margin: 0;
          padding: 4px 2px clamp(18px, 2.4vw, 26px) 21px;
          border-left: 2px solid var(--rr-red);
          margin-left: 2px;
          opacity: 0;
          transition: opacity 0.35s var(--rr-ease, ease) 0.05s;
        }
        .fmx__cell.is-active .fmx__detail {
          opacity: 1;
        }

        @media (max-width: 860px) {
          .fmx__stufe {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .fmx__asideinner {
            position: static;
          }
          .fmx__matrix {
            grid-template-columns: 1fr;
          }
          .fmx__cell.is-active {
            grid-column: auto;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fmx__cell,
          .fmx__btn,
          .fmx__mark,
          .fmx__titel,
          .fmx__panel,
          .fmx__detail {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

export default function DreiStufenMatrix() {
  return (
    <section className="fmx">
      <div className="fmx__wrap">
        <p className="wd-eyebrow">DREI STUFEN</p>
        <h2 className="fmx__h2">Drei Stufen, je nachdem wie viel du brauchst.</h2>
        <p className="fmx__intro">
          Der One-Pager als schlanker Einstieg, wenn eine saubere Seite für den
          Anfang reicht. Die mittlere Stufe, die die meisten Betriebe wählen. Und
          die große Lösung, wenn deine Seite richtig etwas leisten soll. Klein
          anfangen und später wachsen geht immer.
        </p>

        {STUFEN.map((s) => (
          <StufeMatrix key={s.name} stufe={s} />
        ))}

        <p className="rr-meta fmx__meta">
          Was die Stufen kosten, steht schwarz auf weiß auf der{" "}
          <Link href="/preise" className="rr-link rr-link--text">
            Preisseite
          </Link>
          . Fixpreis, kein Stundensatz-Ratespiel.
        </p>
      </div>

      <style jsx>{`
        .fmx {
          background: #ffffff;
          color: var(--rr-ink);
          padding: var(--rr-section-y, clamp(96px, 12vw, 180px))
            var(--rr-gutter, clamp(20px, 4vw, 64px));
        }
        .fmx__wrap {
          max-width: 1180px;
          margin: 0 auto;
        }
        .fmx__h2 {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          line-height: 1.02;
          letter-spacing: -0.02em;
          color: var(--rr-navy);
          max-width: 16em;
          margin: 18px 0 20px;
        }
        .fmx__intro {
          font-family: var(--rr-font-ui);
          font-size: clamp(1rem, 1.15vw, 1.14rem);
          line-height: 1.65;
          color: var(--rr-ink-soft);
          max-width: 56ch;
          margin: 0 0 clamp(20px, 3vw, 32px);
        }
        .fmx__meta {
          margin-top: clamp(40px, 5vw, 64px);
        }
      `}</style>
    </section>
  );
}
