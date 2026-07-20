import Link from "next/link";
import type { CSSProperties } from "react";

/**
 * v2 — "Die 3 Stufen", Copy aus scratchpad/website-copy-v2.md §5. Drei
 * rr-card-soft-Karten (Starter / Business / Premium), Business dezent
 * hervorgehoben (rr-card-soft--red + kleines "Meistgewählt"-Label).
 */

const STUFEN: { name: string; text: string; featured?: boolean }[] = [
  {
    name: "Starter",
    text: "Für alle, die schlank starten und erstmal gefunden werden wollen. One-Pager, sauber, schnell.",
  },
  {
    name: "Business",
    text: "Für Betriebe, die ernst machen wollen. Mehrseitig, auf lokale Sichtbarkeit und Anfragen gebaut. Unsere meistgewählte Stufe.",
    featured: true,
  },
  {
    name: "Premium",
    text: "Für alle, deren Seite wirklich arbeiten soll. Umfangreich, auf Performance und Sichtbarkeit gebaut, mit Content, der mitwächst.",
  },
];

const CARD_BASE: CSSProperties = {
  width: "100%",
  height: "auto",
  minHeight: 240,
  justifyContent: "flex-start",
  gap: 10,
};

export default function DreiStufen() {
  return (
    <section className="rr-section">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">DREI STUFEN</p>
        <h2
          className="rr-statement"
          style={{
            maxWidth: "18em",
            margin: "20px 0 clamp(40px, 5vw, 64px)",
            color: "var(--rr-navy)",
          }}
        >
          Drei Stufen, ein Prinzip: du zahlst für das, was du wirklich
          brauchst.
        </h2>

        <div className="rr-grid rr-grid-3 rr-stagger">
          {STUFEN.map((s) => (
            <div
              key={s.name}
              className={`rr-card-soft ${s.featured ? "rr-card-soft--red" : "rr-card-soft--neutral"}`}
              style={CARD_BASE}
            >
              {s.featured && <p className="rr-card-soft__eyebrow">Meistgewählt</p>}
              <p className="rr-card-soft__label">{s.name}</p>
              <p
                style={{
                  fontFamily: "var(--rr-font-ui)",
                  fontSize: 14.5,
                  lineHeight: 1.5,
                  margin: 0,
                  color: s.featured ? "rgba(255, 255, 255, 0.88)" : "var(--rr-ink-soft)",
                }}
              >
                {s.text}
              </p>
            </div>
          ))}
        </div>

        <p className="rr-meta" style={{ marginTop: "clamp(24px, 3vw, 32px)" }}>
          Was jede Stufe kostet und was genau drinsteckt, steht auf der{" "}
          <Link href="/preise" className="rr-link rr-link--text">
            Preisseite
          </Link>
          . Fixpreis, kein Stundensatz-Ratespiel.
        </p>
      </div>
    </section>
  );
}
