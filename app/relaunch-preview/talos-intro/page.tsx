import type { Metadata } from "next";
import TalosPresentation from "@/components/relaunch/talos/TalosPresentation";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import { crimson, dmsans, fraunces, grotesk } from "@/lib/relaunch/fonts";
import "@/app/styleguide/styleguide.css";

export const metadata: Metadata = {
  title: "Talos Praesentation (Prototyp)",
  robots: { index: false, follow: false },
};

// Chrome wie die echte Leistungsseite: Hamburger-Menue oben, Footer unten
// (opak, deckt die fixe 3D-Buehne beim Herunterscrollen). Das Logo oben links
// rendert die Praesentation selbst — es erscheint scroll-reaktiv erst nach dem
// Hero. So wirkt die Seite als Teil der Red-Rabbit-Seite, nicht als Insel.
const rrFonts = `rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`;

export default function TalosIntroPage() {
  return (
    <>
      {/* Hamburger-Menue der Hauptseite; .rr-Wrapper liefert nur Font-Variablen. */}
      <div className={rrFonts} style={{ background: "transparent" }}>
        <RelaunchMenu />
      </div>

      {/* Talos: Scroll-Praesentation (3D-Buehne + Stationen). */}
      <div className={rrFonts} style={{ background: "#ffffff" }}>
        <TalosPresentation />
      </div>

      {/* Footer der Hauptseite (opak). z-index 50 deckt beim Herunterscrollen die
          fixe 3D-Buehne UND das fixe Talos-Chrome (Anrufen, Logo, Dots, Progress:
          z40-43) ab; der globale Menue-Trigger (z1001) bleibt darueber erreichbar. */}
      <div className={rrFonts} style={{ background: "transparent", position: "relative", zIndex: 50 }}>
        <FooterReassembly />
      </div>
    </>
  );
}
