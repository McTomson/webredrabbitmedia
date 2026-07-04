import type { Metadata } from "next";
import { fraunces, grotesk } from "@/lib/relaunch/fonts";
import HeroMorph from "@/components/relaunch/HeroMorph";
import ScenesMorph from "@/components/relaunch/ScenesMorph";
import "../styleguide/styleguide.css";

export const metadata: Metadata = {
  title: "Relaunch-Preview — Hero-Morph P1 (intern)",
  robots: { index: false, follow: false },
};

export default function RelaunchPreviewPage() {
  return (
    <div className={`rr ${fraunces.variable} ${grotesk.variable}`}>
      <HeroMorph claim="Wir bauen Websites, die man findet. Bei Google und in der KI." />
      <ScenesMorph />
      <section className="rr-section">
        <div className="rr-wrap"><p className="rr-claim">Ein paar unserer Projekte.</p><p className="rr-meta" style={{ marginTop: 14 }}>Hier folgen die 3 Case-Panels (P2) und die Kugel-Galerie (P2b).</p></div>
      </section>
    </div>
  );
}
