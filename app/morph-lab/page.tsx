import type { Metadata } from "next";
import { crimson, fraunces, grotesk } from "@/lib/relaunch/fonts";
import MorphLab from "@/components/relaunch/MorphLab";
import "../styleguide/styleguide.css";

export const metadata: Metadata = {
  title: "Morph-Lab — Formations-Standbilder (intern)",
  robots: { index: false, follow: false },
};

/** Interne Testseite: rendert die komponierten Formationen als STANDBILD,
 *  ohne Scroll-Choreografie — fuer schnelle Abnahme-Loops der Motive. */
export default function MorphLabPage() {
  return (
    <div className={`rr ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
      <MorphLab />
    </div>
  );
}
