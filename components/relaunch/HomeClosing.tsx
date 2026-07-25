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

      {/* Sektion 8: Abschluss-CTA — eigener luftiger Block, Off-White-Grund */}
      <section
        className="rr-section"
        style={{ background: "#F4F4F2", paddingTop: "clamp(80px, 12vw, 180px)", paddingBottom: "clamp(120px, 18vw, 240px)" }}
      >
        <div className="rr-wrap">
          <p className="rr-display-2" style={{ maxWidth: "16em", fontSize: "clamp(30px, 4.2vw, 58px)", lineHeight: 1.14 }}>
            Du willst eine Website, die man findet?<br />
            Und die für dich im Hintergrund Kunden gewinnt?<br />
            Reden wir.
          </p>
          {/* Button-Paar (Thomas 25.07.): Haupt-CTA roter Sweep, Anrufen als
              klarer Rahmen-Button (matched pair). */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(16px, 2vw, 24px)", marginTop: "clamp(40px, 6vh, 64px)" }}>
            <Link href="/relaunch-preview/kontakt" className="rr-btn-sweep rr-btn-sweep--red">
              Kostenlosen Entwurf holen
            </Link>
            <a href="tel:+436769000955" className="rr-btn-outline">
              Anrufen
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
