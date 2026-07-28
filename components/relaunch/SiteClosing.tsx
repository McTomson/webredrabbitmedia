import Link from "next/link";

/**
 * Geteilter Abschluss-Block fuer ALLE Inhaltsseiten (DESIGN_STANDARD.md
 * "Abschluss-Block"): verallgemeinerte Fassung des Homepage-Closings
 * (frueher inline in HomeClosing.tsx). Linksbuendig, Off-White-Grund,
 * Button-Paar rr-btn-sweep--red (Kontakt) + rr-btn-outline (tel:-Link,
 * Telefonnummer NIE im Klartext). Texte pro Seite: brand/copy-closing-cta.md.
 *
 * `lines` = die Textzeilen des Statements, jede kommt auf eine eigene Zeile
 * (Zeilenumbruch via <br />, wie im Homepage-Original).
 * `compact` = kleinere Bauhoehe (Kontakt-Seite: das Formular liegt darueber).
 */

const TEL = "tel:+436769000955";

export default function SiteClosing({
  lines,
  compact = false,
}: {
  lines: string[];
  compact?: boolean;
}) {
  return (
    <section
      className="rr-section"
      style={{
        background: "var(--rr-surface, #f4f4f2)",
        paddingTop: compact ? "clamp(56px, 8vw, 120px)" : "var(--rr-section-y)",
        paddingBottom: compact ? "clamp(56px, 8vw, 120px)" : "var(--rr-section-y)",
      }}
    >
      <div className="rr-wrap">
        <p
          className="rr-display-2"
          style={{ maxWidth: "16em", fontSize: "clamp(30px, 4.2vw, 58px)", lineHeight: 1.14 }}
        >
          {lines.map((line, i) => (
            <span key={`${i}-${line}`}>
              {line}
              {i < lines.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
        {/* Button-Paar (Thomas 25.07.): Haupt-CTA roter Sweep, Anrufen als
            klarer Rahmen-Button (matched pair). */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(16px, 2vw, 24px)",
            marginTop: "clamp(40px, 6vh, 64px)",
          }}
        >
          <Link href="/relaunch-preview/kontakt" className="rr-btn-sweep rr-btn-sweep--red">
            Kostenlosen Entwurf holen
          </Link>
          <a href={TEL} className="rr-btn-outline">
            Anrufen
          </a>
        </div>
      </div>
    </section>
  );
}
