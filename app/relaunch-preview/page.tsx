import type { Metadata } from "next";
import { fraunces, grotesk } from "@/lib/relaunch/fonts";
import HomeMorph from "@/components/relaunch/HomeMorph";
import CasePanels from "@/components/relaunch/CasePanels";
import HomeClosing from "@/components/relaunch/HomeClosing";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import "../styleguide/styleguide.css";

export const metadata: Metadata = {
  title: "Relaunch-Preview — Homepage nach Blaupause (intern)",
  robots: { index: false, follow: false },
};

/**
 * Komplette Homepage-Sektionsfolge nach docs/HOMEPAGE_BLAUPAUSE_ALLTURTLES.md:
 * Hero+Morph -> 5 Leistungs-Szenen -> Ueberleitung -> 3 Case-Panels ->
 * Zahlen-Statement -> Firmen-Liste -> Riesen-CTA -> Footer-Reassembly.
 */
export default function RelaunchPreviewPage() {
  return (
    <div className={`rr ${fraunces.variable} ${grotesk.variable}`}>
      {/* Sektionen 1-3: durchgehende Morph-Buehne (Hero + 5 Leistungs-Szenen) */}
      <HomeMorph claim="Wir bauen Websites, die man findet. Bei Google und in der KI." />

      {/* Sektion 4: Ueberleitung */}
      <section className="rr-section">
        <div className="rr-wrap">
          <h2 className="rr-claim">Ein paar unserer Projekte.</h2>
        </div>
      </section>

      {/* Sektion 5: Case-Panels (Referenz-Auswahl = Vorschlag, Tomson-Gate) */}
      <CasePanels />

      {/* Sektionen 6-8: Zahlen, Firmen-Liste, CTA */}
      <HomeClosing />

      {/* Sektion 9: Footer mit Wortmarken-Reassembly */}
      <FooterReassembly />
    </div>
  );
}
