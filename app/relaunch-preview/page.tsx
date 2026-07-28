import type { Metadata } from "next";
import { crimson, dmsans, fraunces, grotesk } from "@/lib/relaunch/fonts";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import CornerLogo from "@/components/relaunch/CornerLogo";
import HomeMorph from "@/components/relaunch/HomeMorph";
import CasePanels from "@/components/relaunch/CasePanels";
import HomeClosing from "@/components/relaunch/HomeClosing";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import ScrollExperience from "@/components/relaunch/ScrollExperience";
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

      {/* Ecken-Logo (rote Hasen-Marke oben links) — gemeinsames Bauteil,
          blendet erst nach dem Zerlegen der Hero-Woerter ein. Bleibt bei
          z-index 43 unter dem Menue-Overlay (z-index 1000). */}
      <CornerLogo />

      {/* Sektionen 0-3: Marken-Auftakt (Statement + Hasenkopf-Lockup) direkt in die
          durchgehende Morph-Buehne integriert (Hero + 5 Leistungs-Szenen) */}
      <HomeMorph />

      {/* Sektion 4: nur Weissraum als Atempause vor dem ersten Panel
          (Ueberleitungs-Satz entfernt, Tomson 25.07.). */}
      <div aria-hidden style={{ height: "var(--rr-section-y)" }} />

      {/* Sektion 5: Case-Panels (Referenz-Auswahl = Vorschlag, Tomson-Gate) */}
      <CasePanels />

      {/* Sektionen 6-8: Zahlen, Firmen-Liste, CTA */}
      <HomeClosing />

      {/* Sektion 9: Footer mit Wortmarken-Reassembly */}
      <div data-rr-snap>
        <FooterReassembly />
      </div>

      {/* Site-weites Scroll-Gefuehl: Lenis + Soft-Snap (Thomas 28.07.).
          Bewusst als LETZTES Kind: dann hat HomeMorph seine Lenis-Instanz
          schon auf window.__rrLenis gelegt und ScrollExperience haengt sich
          dort an, statt ein zweites Lenis zu starten. */}
      <ScrollExperience />
    </div>
  );
}
