import type { Metadata } from "next";
import { crimson, dmsans, fraunces, grotesk } from "@/lib/relaunch/fonts";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
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
    <div className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
      {/* Fixes Menue (Trigger + Vollbild-Overlay) */}
      <RelaunchMenu />

      {/* Sektionen 0-3: Marken-Auftakt (Statement + Hasenkopf-Lockup) direkt in die
          durchgehende Morph-Buehne integriert (Hero + 5 Leistungs-Szenen) */}
      <HomeMorph />

      {/* Sektion 4: Ueberleitung — zentriert und grosszuegig geluftet wie
          all-turtles' "Meet a few of our studio companies" (viel Weissraum
          vor dem ersten farbigen Panel). */}
      <section
        className="rr-section"
        style={{
          textAlign: "center",
          paddingTop: "clamp(360px, 52vh, 760px)",
          paddingBottom: "clamp(130px, 18vh, 260px)",
        }}
      >
        <div className="rr-wrap">
          <h2 className="rr-claim" style={{ margin: "0 auto", maxWidth: "13em" }}>
            Ein paar unserer Projekte.
          </h2>
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
