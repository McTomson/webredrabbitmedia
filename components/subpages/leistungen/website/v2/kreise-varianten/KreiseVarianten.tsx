'use client';

/**
 * Drei edlere Design-Versionen der 4-Kreise-Reihe aus Ablauf.tsx (Kreis-Kette
 * "So laeuft das ab"). Thomas mag Konzept + Groesse, findet das aktuelle Design
 * "zu billig". Token-Spar-Vergleich: NUR die drei Reihen untereinander, jede mit
 * einem winzigen grauen Buchstaben-Label A/B/C davor. Kein weiterer Text.
 *
 * Alle Reihen zeigen den Zustand "Schritt 1 aktiv, Fortschritt bis Schritt 2
 * angedeutet" plus eine ruhige Idle-Loop-Animation. rr-Tokens (var(--rr-red),
 * navy, ink-soft), DM Sans fuer die Ziffern, Hairlines statt dicker Borders.
 * border-radius nur an den Kreisen (sind Kreise). prefers-reduced-motion ->
 * statisch (Endzustand), Loops 4-6s. Eigenstaendige Komponente, aendert nichts
 * an der echten Ablauf.tsx.
 */

const STEPS = [0, 1, 2, 3];
const ACTIVE = 0; // Schritt 1 aktiv
// Fortschritt bis Schritt 2 angedeutet: Band spannt Mitte-zu-Mitte ueber 4 Kreise
// (Schritt 2 = 33.3% der Strecke), wir deuten kurz davor an -> ~26%.
const PROGRESS = '26%';

export default function KreiseVarianten() {
  return (
    <div className="kv">
      <Row label="A">
        <VariantA />
      </Row>
      <Row label="B">
        <VariantB />
      </Row>
      <Row label="C">
        <VariantC />
      </Row>

      <style jsx>{`
        .kv {
          background: #ffffff;
        }
      `}</style>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="kv-row" aria-hidden="true">
      <span className="kv-tag">{label}</span>
      <div className="kv-stage">{children}</div>

      <style jsx>{`
        .kv-row {
          display: flex;
          align-items: center;
          gap: clamp(24px, 5vw, 64px);
          padding: clamp(64px, 11vh, 132px) var(--rr-gutter, clamp(20px, 4vw, 64px));
          max-width: 1120px;
          margin: 0 auto;
        }
        .kv-tag {
          flex: 0 0 auto;
          font-family: var(--rr-font-ui, inherit);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: color-mix(in srgb, var(--rr-ink, #23262e) 32%, transparent);
          width: 1ch;
        }
        .kv-stage {
          flex: 1 1 auto;
          min-width: 0;
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* A · HAIRLINE + DOT                                                  */
/* ------------------------------------------------------------------ */
function VariantA() {
  return (
    <div className="a-wrap">
      <div className="a-track">
        <div className="a-fill" />
      </div>
      {STEPS.map((i) => {
        const active = i === ACTIVE;
        return (
          <span key={i} className={'a-c' + (active ? ' is-active' : '')}>
            {active && (
              <span className="a-orbit">
                <span className="a-dot" />
              </span>
            )}
            <span className="a-num">0{i + 1}</span>
          </span>
        );
      })}

      <style jsx>{`
        .a-wrap {
          --c: clamp(60px, 6.4vw, 92px);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: min(880px, 100%);
          margin: 0 auto;
        }
        .a-track {
          position: absolute;
          left: calc(var(--c) / 2);
          right: calc(var(--c) / 2);
          top: 50%;
          height: 1px;
          transform: translateY(-50%);
          background: color-mix(in srgb, var(--rr-ink, #23262e) 15%, transparent);
        }
        .a-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 1px;
          width: ${PROGRESS};
          background: var(--rr-red, #f12032);
        }
        .a-c {
          position: relative;
          z-index: 1;
          width: var(--c);
          height: var(--c);
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--rr-ink, #23262e) 15%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .a-num {
          font-family: var(--rr-font-display, inherit);
          font-weight: 500;
          font-size: clamp(0.85rem, 1.2vw, 1.1rem);
          line-height: 1;
          letter-spacing: 0.18em;
          text-indent: 0.18em;
          color: var(--rr-ink-soft, #5a5e68);
        }
        .a-c.is-active {
          box-shadow: 0 0 0 1px var(--rr-red, #f12032);
        }
        .a-c.is-active .a-num {
          font-weight: 700;
          letter-spacing: 0.04em;
          text-indent: 0.04em;
          color: var(--rr-navy, #1c2837);
        }
        .a-orbit {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          animation: a-spin 6s linear infinite;
        }
        .a-dot {
          position: absolute;
          top: -3px;
          left: 50%;
          width: 6px;
          height: 6px;
          margin-left: -3px;
          border-radius: 50%;
          background: var(--rr-red, #f12032);
        }
        @keyframes a-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .a-orbit {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* B · FILLED-SOFT + RING-PULS                                        */
/* ------------------------------------------------------------------ */
function VariantB() {
  return (
    <div className="b-wrap">
      <div className="b-track">
        <div className="b-fill" />
      </div>
      {STEPS.map((i) => {
        const active = i === ACTIVE;
        return (
          <span key={i} className={'b-c' + (active ? ' is-active' : '')}>
            {active && <span className="b-halo" />}
            <span className="b-num">0{i + 1}</span>
          </span>
        );
      })}

      <style jsx>{`
        .b-wrap {
          --c: clamp(60px, 6.4vw, 92px);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: min(880px, 100%);
          margin: 0 auto;
        }
        .b-track {
          position: absolute;
          left: calc(var(--c) / 2);
          right: calc(var(--c) / 2);
          top: 50%;
          height: 8px;
          transform: translateY(-50%);
          /* gepunktete Linie: kleine Punkte via radial-gradient */
          background-image: radial-gradient(
            circle,
            color-mix(in srgb, var(--rr-ink, #23262e) 26%, transparent) 0 1.6px,
            transparent 1.9px
          );
          background-size: 12px 8px;
          background-position: left center;
          background-repeat: repeat-x;
        }
        .b-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 8px;
          width: ${PROGRESS};
          overflow: hidden;
          background-image: radial-gradient(
            circle,
            var(--rr-red, #f12032) 0 1.9px,
            transparent 2.2px
          );
          background-size: 12px 8px;
          background-position: left center;
          background-repeat: repeat-x;
        }
        .b-c {
          position: relative;
          z-index: 1;
          width: var(--c);
          height: var(--c);
          border-radius: 50%;
          background: color-mix(in srgb, var(--rr-ink, #23262e) 4%, #fff);
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--rr-ink, #23262e) 12%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .b-num {
          position: relative;
          z-index: 2;
          font-family: var(--rr-font-display, inherit);
          font-weight: 600;
          font-size: clamp(0.9rem, 1.3vw, 1.2rem);
          line-height: 1;
          color: var(--rr-ink-soft, #5a5e68);
        }
        .b-c.is-active {
          background: var(--rr-red, #f12032);
          box-shadow: none;
        }
        .b-c.is-active .b-num {
          color: #fff;
          font-weight: 700;
        }
        .b-halo {
          position: absolute;
          inset: -11px;
          border-radius: 50%;
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--rr-red, #f12032) 55%, transparent);
          animation: b-breath 4.5s ease-in-out infinite;
        }
        @keyframes b-breath {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.09);
            opacity: 0.12;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .b-halo {
            animation: none;
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* C · SEGMENT-ARC                                                     */
/* ------------------------------------------------------------------ */
function VariantC() {
  // Kreisumfang fuer r=46 in 100er-viewBox
  const R = 46;
  const C = 2 * Math.PI * R; // ~289
  const ARC = C * 0.75; // ~270 Grad

  return (
    <div className="c-wrap">
      <div className="c-track">
        <div className="c-fill" />
      </div>
      {STEPS.map((i) => {
        const active = i === ACTIVE;
        return (
          <span key={i} className={'c-c' + (active ? ' is-active' : '')}>
            {active && (
              <svg className="c-arc" viewBox="0 0 100 100" aria-hidden="true">
                <circle
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke="var(--rr-red, #f12032)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${ARC} ${C}`}
                />
              </svg>
            )}
            <span className="c-num">0{i + 1}</span>
          </span>
        );
      })}

      <style jsx>{`
        .c-wrap {
          --c: clamp(60px, 6.4vw, 92px);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: min(880px, 100%);
          margin: 0 auto;
        }
        .c-track {
          position: absolute;
          left: calc(var(--c) / 2);
          right: calc(var(--c) / 2);
          top: 50%;
          height: 1px;
          transform: translateY(-50%);
          background: color-mix(in srgb, var(--rr-ink, #23262e) 13%, transparent);
        }
        .c-fill {
          position: absolute;
          left: 0;
          top: 50%;
          height: 2px;
          width: calc(${PROGRESS} + 8%);
          transform: translateY(-50%);
          background: linear-gradient(
            90deg,
            var(--rr-red, #f12032) 0%,
            color-mix(in srgb, var(--rr-red, #f12032) 40%, transparent) 55%,
            transparent 100%
          );
        }
        .c-c {
          position: relative;
          z-index: 1;
          width: var(--c);
          height: var(--c);
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--rr-ink, #23262e) 14%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .c-num {
          font-family: var(--rr-font-display, inherit);
          font-weight: 500;
          font-size: clamp(0.9rem, 1.3vw, 1.2rem);
          line-height: 1;
          color: var(--rr-ink-soft, #5a5e68);
        }
        .c-c.is-active {
          box-shadow: none;
        }
        .c-c.is-active .c-num {
          font-weight: 700;
          color: var(--rr-navy, #1c2837);
        }
        .c-arc {
          position: absolute;
          inset: -1px;
          width: calc(100% + 2px);
          height: calc(100% + 2px);
          transform-origin: 50% 50%;
          animation: c-rotate 5.5s linear infinite;
        }
        @keyframes c-rotate {
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .c-arc {
            animation: none;
            transform: rotate(-90deg);
          }
        }
      `}</style>
    </div>
  );
}
