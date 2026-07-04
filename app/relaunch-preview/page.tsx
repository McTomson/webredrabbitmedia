import type { Metadata } from "next";
import { fraunces, grotesk } from "@/lib/relaunch/fonts";
import HeroMorph from "@/components/relaunch/HeroMorph";
import "../styleguide/styleguide.css";

export const metadata: Metadata = {
  title: "Relaunch-Preview — Hero-Morph P1 (intern)",
  robots: { index: false, follow: false },
};

export default function RelaunchPreviewPage() {
  return (
    <div className={`rr ${fraunces.variable} ${grotesk.variable}`}>
      <HeroMorph claim="Wir bauen Websites, die man findet. Bei Google und in der KI." />
      <section className="rr-section" style={{ background: "var(--rr-surface)" }}>
        <div className="rr-wrap">
          <p className="rr-eyebrow" style={{ marginBottom: 24 }}>P1-Preview · nach dem Hero geht es hier weiter</p>
          <p className="rr-statement">Deine Website schreibt selbst. Jede Woche neue Beitraege, die ranken.</p>
        </div>
      </section>
      <section className="rr-section">
        <div className="rr-wrap"><p className="rr-body-lg" style={{ maxWidth: 640 }}>Platzhalter-Sektion, damit der Scroll-Track Auslauf hat. Die 5 Leistungs-Szenen mit Morph-Motiven folgen in P1b.</p></div>
      </section>
    </div>
  );
}
