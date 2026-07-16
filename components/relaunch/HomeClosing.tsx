import Link from "next/link";
import KundenGrid from "@/components/relaunch/KundenGrid";

/**
 * Blaupause Sektionen 6-8. Sektionen 6+7 (Zahlen-Statement + statische
 * Firmen-Liste) sind seit 16.07. durch das Typing-Grid KundenGrid ersetzt
 * (Port des ueber-uns-Kundenlisten-Blocks auf Weiss statt Blau). Sektion 8
 * (Abschluss-CTA) bleibt unveraendert.
 */

export default function HomeClosing() {
  return (
    <>
      {/* Sektionen 6+7: Kundenliste-Typing-Grid (Port ueber-uns, weiss statt blau) */}
      <KundenGrid />

      {/* Sektion 8: Abschluss-CTA — eigener luftiger Block */}
      <section
        className="rr-section"
        style={{ paddingTop: "clamp(80px, 12vw, 180px)", paddingBottom: "clamp(120px, 18vw, 240px)" }}
      >
        <div className="rr-wrap">
          <p className="rr-display-2" style={{ maxWidth: "10em" }}>
            Du willst eine Website, die man findet? Reden wir.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: "clamp(40px, 6vh, 64px)" }}>
            <Link className="rr-btn rr-btn--primary" href="/kontakt">Projekt anfragen</Link>
            <a className="rr-btn rr-btn--secondary" href="tel:+436769000955">Anrufen</a>
          </div>
        </div>
      </section>
    </>
  );
}
