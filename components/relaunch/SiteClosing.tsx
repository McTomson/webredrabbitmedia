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
      className={`rr-section${compact ? "" : " sc-full"}`}
      // Soft-Snap-Ziel (components/relaunch/ScrollExperience.tsx): gilt damit
      // automatisch auf jeder Seite, die den Abschluss-Block einbindet.
      data-rr-snap
      style={{
        background: "var(--rr-surface, #f4f4f2)",
        paddingTop: compact ? "clamp(56px, 8vw, 120px)" : "var(--rr-section-y)",
        paddingBottom: compact ? "clamp(56px, 8vw, 120px)" : "var(--rr-section-y)",
      }}
    >
      {/* Volle Bildschirmhoehe + vertikale Zentrierung (Thomas 29.07.: soll wie
          eine eigene volle Bildschirmseite wirken statt kleine Textinsel).
          Nur wenn NICHT compact — compact ist bewusst die kleinere Bauhoehe
          fuer die Kontakt-Seite (Formular liegt darueber), das bleibt so.
          Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md
          "styled-jsx im Relaunch meiden"). Breakpoint = MOBILE_BREAKPOINT
          (lib/relaunch/scroll-standard.ts, 820px). */}
      <style>{`
        .sc-full {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (max-width: 820px) {
          .sc-full {
            min-height: 0;
          }
        }
      `}</style>
      <div className="rr-wrap">
        <p
          className="rr-display-2"
          style={{ maxWidth: "16em", fontSize: "clamp(30px, 4.2vw, 58px)", lineHeight: 1.14 }}
        >
          {lines.map((line, i) => {
            const isLast = i === lines.length - 1;
            // Letzte Zeile ("Reden wir.") = Pointe (Thomas 28.07.): kleine
            // Pause davor (Extra-Abstand) + roter Schlusspunkt.
            const endsWithDot = isLast && line.endsWith(".");
            const text = endsWithDot ? line.slice(0, -1) : line;
            return (
              <span
                key={`${i}-${line}`}
                style={isLast ? { display: "inline-block", marginTop: "0.55em" } : undefined}
              >
                {text}
                {endsWithDot ? <span style={{ color: "var(--rr-red, #f12032)" }}>.</span> : null}
                {!isLast ? <br /> : null}
              </span>
            );
          })}
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
          <Link href="/kontakt" className="rr-btn-sweep rr-btn-sweep--red">
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
