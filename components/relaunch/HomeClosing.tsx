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
          {/* Eine Button-Sprache (Thomas 25.07.): NUR der linke Sweep-Typ. Haupt-CTA
              rot, Anrufen als dunkle Sweep-Variante (kein Eck-Rahmen mehr). */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px, 2.5vw, 32px)", marginTop: "clamp(40px, 6vh, 64px)" }}>
            <Link href="/relaunch-preview/kontakt" className="rr-btn-sweep rr-btn-sweep--red">
              Kostenlosen Entwurf holen
            </Link>
            <a href="tel:+436769000955" className="rr-btn-sweep rr-btn-sweep--navy">
              Anrufen
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
