"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

/**
 * v2 — "Die 3 Stufen", Copy aus scratchpad/website-copy-v2.md §5.
 * Editorial-Rows statt Cards: drei volle-Breite-Zeilen untereinander,
 * Business als Held (groesser, roter Rahmen-Tag, rote Ober-/Unterlinie).
 * Ganze Row = Link auf /preise, Hover faehrt Flaeche von links ein.
 */

const STUFEN: {
  index: string;
  name: string;
  text: string;
  merkmale: string[];
  featured?: boolean;
}[] = [
  {
    index: "01",
    name: "Starter",
    text: "Für alle, die schlank starten und erstmal gefunden werden wollen. One-Pager, sauber, schnell.",
    merkmale: ["One-Pager", "Gefunden werden", "Schnell online"],
  },
  {
    index: "02",
    name: "Business",
    text: "Für Betriebe, die ernst machen wollen. Mehrseitig, auf lokale Sichtbarkeit und Anfragen gebaut.",
    merkmale: ["Mehrseitig", "Lokale Sichtbarkeit", "Auf Anfragen gebaut", "Unsere meistgewählte Stufe"],
    featured: true,
  },
  {
    index: "03",
    name: "Premium",
    text: "Für alle, deren Seite wirklich arbeiten soll. Umfangreich, auf dauerhafte Sichtbarkeit und laufende Anfragen gebaut, mit Inhalten, die mitwachsen.",
    merkmale: ["Umfangreich", "Dauerhafte Sichtbarkeit", "Inhalte wachsen mit"],
  },
];

const ROW_LINK_BASE: CSSProperties = {
  position: "relative",
  display: "block",
  textDecoration: "none",
  color: "inherit",
  overflow: "hidden",
  isolation: "isolate",
};

export default function DreiStufen() {
  return (
    <section className="rr-section">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg rr-reveal">DREI STUFEN</p>
        <h2
          className="rr-statement rr-reveal"
          style={{
            maxWidth: "18em",
            margin: "20px 0 clamp(40px, 5vw, 64px)",
            color: "var(--rr-navy)",
          }}
        >
          Drei Stufen. Eine passt zu dir.
        </h2>

        <div className="dreistufen-rows rr-stagger">
          {STUFEN.map((s) => (
            <Link
              key={s.name}
              href="/preise"
              aria-label={`Stufe ${s.name} auf der Preisseite ansehen`}
              className={`dreistufen-row${s.featured ? " dreistufen-row--featured" : ""}`}
              style={ROW_LINK_BASE}
            >
              {s.featured && <span className="dreistufen-row__tag">MEISTGEWÄHLT</span>}

              <span className="dreistufen-row__grid">
                <span className={`dreistufen-row__name${s.featured ? " dreistufen-row__name--featured" : ""}`}>
                  {s.name}
                  {s.featured && <span className="dreistufen-row__dot" aria-hidden="true" />}
                </span>

                <span className="dreistufen-row__body">
                  <span className="dreistufen-row__text">{s.text}</span>
                  <span className="dreistufen-row__merkmale">
                    {s.merkmale.map((m, i) => (
                      <span className="dreistufen-row__merkmal" key={m}>
                        <span className="dreistufen-row__merkmal-index">{String(i + 1).padStart(2, "0")}</span>
                        {m}
                      </span>
                    ))}
                  </span>
                </span>
              </span>
            </Link>
          ))}
        </div>

        <p className="rr-meta" style={{ marginTop: "clamp(24px, 3vw, 32px)" }}>
          Was die Stufen kosten, steht schwarz auf weiss auf der{" "}
          <Link href="/preise" className="rr-link rr-link--text">
            Preisseite
          </Link>
          . Fixpreis, kein Stundensatz-Ratespiel.
        </p>
      </div>

      <style jsx>{`
        .dreistufen-rows {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dreistufen-row {
          border-top: 1px solid rgba(11, 31, 58, 0.12);
          padding: clamp(28px, 4vw, 44px) 4px;
        }
        .dreistufen-rows > .dreistufen-row:last-child {
          border-bottom: 1px solid rgba(11, 31, 58, 0.12);
        }

        .dreistufen-row--featured {
          border-top: 1px solid var(--rr-red);
          border-bottom: 1px solid var(--rr-red);
          padding: clamp(40px, 6vw, 64px) 4px;
        }
        .dreistufen-rows > .dreistufen-row--featured + .dreistufen-row {
          border-top: 1px solid var(--rr-red);
        }

        .dreistufen-row::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background: var(--rr-surface, #f4f4f2);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s var(--rr-ease, ease);
        }
        @media (hover: hover) and (pointer: fine) {
          .dreistufen-row:hover::before {
            transform: scaleX(1);
          }
        }

        .dreistufen-row__tag {
          display: inline-block;
          border: 1px solid var(--rr-red);
          color: var(--rr-red);
          font-family: var(--rr-font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 0;
          margin-bottom: clamp(16px, 2vw, 24px);
        }

        .dreistufen-row__grid {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: clamp(16px, 4vw, 48px);
          align-items: center;
        }

        .dreistufen-row__name {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(2.2rem, 4.5vw, 4rem);
          line-height: 1;
          color: var(--rr-navy);
          opacity: 0.55;
          transition: opacity 0.35s var(--rr-ease, ease);
          display: inline-flex;
          align-items: center;
          gap: 14px;
        }
        .dreistufen-row:hover .dreistufen-row__name {
          opacity: 0.85;
        }

        .dreistufen-row__name--featured {
          font-size: clamp(2.8rem, 6vw, 5.2rem);
          color: var(--rr-navy);
          opacity: 1;
        }
        .dreistufen-row:hover .dreistufen-row__name--featured {
          opacity: 1;
        }

        .dreistufen-row__dot {
          width: 0.22em;
          height: 0.22em;
          border-radius: 50%;
          background: var(--rr-red);
          display: inline-block;
        }

        .dreistufen-row__body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dreistufen-row__text {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          line-height: 1.55;
          color: var(--rr-ink-soft);
          max-width: 46em;
        }

        .dreistufen-row__merkmale {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dreistufen-row__merkmal {
          font-family: var(--rr-font-ui);
          font-size: 13.5px;
          color: var(--rr-ink-soft);
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .dreistufen-row__merkmal-index {
          font-family: var(--rr-font-display);
          font-weight: 700;
          font-size: 11px;
          color: var(--rr-red);
          letter-spacing: 0.04em;
        }

        @media (max-width: 720px) {
          .dreistufen-row__grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .dreistufen-row__name,
          .dreistufen-row__name--featured {
            font-size: clamp(2rem, 9vw, 2.8rem);
          }
        }
      `}</style>
    </section>
  );
}
