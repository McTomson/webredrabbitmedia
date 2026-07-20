import Link from "next/link";
import type { CSSProperties } from "react";

/**
 * v2 — "Was drinsteckt" (Das Fundament), Copy aus scratchpad/website-copy-v2.md
 * §2. Zwei rr-card-soft-Gruppen: (a) was auf der Seite steckt (Tag + volle
 * Copy-Zeile, Typografie 1:1 aus lw-fund__text gespiegelt), (b) was im
 * Hintergrund mitläuft (Label + Beschreibung, Typografie 1:1 aus
 * lw-step__body gespiegelt). Nur rr-*-Klassen + Inline-Styles, keine neue
 * CSS-Datei/-Klasse (Konflikt-Vermeidung mit Parallel-Agent).
 */

const AUF_DER_SEITE: { tag: string; text: string }[] = [
  { tag: "Design", text: "Individuelles Design, gebaut auf deinen Betrieb." },
  { tag: "Handy", text: "Sauber am Handy, weil da deine Kunden suchen." },
  {
    tag: "Recht",
    text: "Rechtssicher nach AT-Recht: Impressum und Datenschutz passen.",
  },
  { tag: "SEO", text: "Grund-SEO, damit dich Leute aus deiner Gegend finden." },
  { tag: "Kontakt", text: "Kontaktformular, das direkt bei dir ankommt." },
  { tag: "Domain", text: "Eigene Domain, gehört dir." },
];

const IM_HINTERGRUND: { label: string; text: string }[] = [
  {
    label: "Hosting inklusive",
    text: "Deine Seite liegt bei uns, schnell und sicher. Du kümmerst dich um nichts.",
  },
  {
    label: "Selbst ändern",
    text: "Öffnungszeiten, Texte, Bilder: das machst du selbst, ohne uns anzurufen und ohne Zusatzkosten.",
  },
  {
    label: "Zahlen im Klartext",
    text: "Du siehst, wie viele Leute vorbeischauen und wie viele sich melden. Ohne Fachchinesisch.",
  },
  {
    label: "Ein Wächter passt auf",
    text: "Geht etwas nicht, merken wir es meist vor dir. Ausfälle fängt die Seite selbst ab.",
  },
  {
    label: "Monatlicher Check",
    text: "Einmal im Monat schauen wir drauf, ob alles rund läuft und aktuell ist.",
  },
  {
    label: "Pflege inklusive",
    text: "Updates, kleine Korrekturen, Sicherheit: das läuft im Hintergrund einfach mit.",
  },
];

const CARD_BASE: CSSProperties = {
  width: "100%",
  height: "auto",
  justifyContent: "flex-start",
  gap: 10,
};

const SENTENCE_TEXT: CSSProperties = {
  fontFamily: "var(--rr-font-display)",
  fontWeight: 560,
  fontSize: 18,
  lineHeight: 1.28,
  letterSpacing: "-0.005em",
  margin: 0,
};

const DESC_TEXT: CSSProperties = {
  fontFamily: "var(--rr-font-ui)",
  fontSize: 14.5,
  lineHeight: 1.5,
  color: "var(--rr-ink-soft)",
  margin: 0,
};

export default function Fundament() {
  return (
    <section className="rr-section">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">WAS DRINSTECKT</p>
        <h2
          className="rr-statement"
          style={{ maxWidth: "14em", margin: "20px 0 20px", color: "var(--rr-navy)" }}
        >
          Das Fundament ist immer schon drin.
        </h2>
        <p
          className="rr-body-lg"
          style={{
            maxWidth: "44em",
            color: "var(--rr-ink-soft)",
            marginBottom: "clamp(40px, 5vw, 64px)",
          }}
        >
          Nicht als Zusatzpaket, nicht als Kleingedrucktes. Sondern als das,
          womit jede Seite von uns startet.
        </p>

        <p className="rr-eyebrow" style={{ marginBottom: 16 }}>
          Was auf der Seite steckt
        </p>
        <div
          className="rr-grid rr-grid-3 rr-stagger"
          style={{ marginBottom: "clamp(40px, 5vw, 64px)" }}
        >
          {AUF_DER_SEITE.map((it) => (
            <div
              key={it.tag}
              className="rr-card-soft rr-card-soft--neutral"
              style={{ ...CARD_BASE, minHeight: 168 }}
            >
              <p className="rr-card-soft__eyebrow">{it.tag}</p>
              <p style={SENTENCE_TEXT}>{it.text}</p>
            </div>
          ))}
        </div>

        <p className="rr-eyebrow" style={{ marginBottom: 16 }}>
          Was im Hintergrund für dich mitläuft
        </p>
        <div className="rr-grid rr-grid-3 rr-stagger">
          {IM_HINTERGRUND.map((it) => (
            <div
              key={it.label}
              className="rr-card-soft rr-card-soft--neutral"
              style={{ ...CARD_BASE, minHeight: 220 }}
            >
              <p className="rr-card-soft__label" style={{ marginTop: 2 }}>
                {it.label}
              </p>
              <p style={DESC_TEXT}>{it.text}</p>
            </div>
          ))}
        </div>

        <p
          className="rr-body"
          style={{ marginTop: "clamp(28px, 4vw, 40px)", color: "var(--rr-ink)" }}
        >
          Keine Extra-Rechnung. Kein Wartungsvertrag. Drin.
        </p>
        <p className="rr-meta" style={{ marginTop: 12 }}>
          Was das kostet, steht schwarz auf weiß auf der{" "}
          <Link href="/preise" className="rr-link rr-link--text">
            Preisseite
          </Link>
          . Fixpreis, keine Überraschung am Ende.
        </p>
      </div>
    </section>
  );
}
