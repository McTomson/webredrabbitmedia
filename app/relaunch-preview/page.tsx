import type { Metadata } from "next";
import { crimson, dmsans, fraunces, grotesk } from "@/lib/relaunch/fonts";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import CornerLogo from "@/components/relaunch/CornerLogo";
import BackToTop from "@/components/relaunch/BackToTop";
import HomeMorph from "@/components/relaunch/HomeMorph";
import CasePanels from "@/components/relaunch/CasePanels";
import HomeClosing from "@/components/relaunch/HomeClosing";
import Ablauf from "@/components/subpages/leistungen/website/v2/Ablauf";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import ScrollExperience from "@/components/relaunch/ScrollExperience";
import "../styleguide/styleguide.css";

export const metadata: Metadata = {
  title: "Relaunch-Preview — Homepage nach Blaupause (intern)",
  description:
    "Webdesign aus Österreich: Websites, die bei Google und in der KI-Suche gefunden werden. Vorschläge ohne Vorkasse, mit Talos als digitalem Mitarbeiter.",
  robots: { index: false, follow: false },
};

// Screenreader-only Stil (identisch zu app/relaunch-preview/webdesign-tirol),
// damit die Home ein h1 im SSR-HTML hat, ohne das visuelle Layout zu aendern.
const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

/**
 * Komplette Homepage-Sektionsfolge nach docs/HOMEPAGE_BLAUPAUSE_ALLTURTLES.md:
 * Hero+Morph -> 5 Leistungs-Szenen -> Ueberleitung -> 3 Case-Panels ->
 * Zahlen-Statement -> Firmen-Liste -> Riesen-CTA -> Footer-Reassembly.
 */
export default function RelaunchPreviewPage() {
  return (
    <div className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
      <h1 style={srOnly}>
        Webdesign aus Österreich: Websites, die gefunden werden, mit Talos als digitalem Mitarbeiter
      </h1>

      {/* Fixes Menue (Trigger + Vollbild-Overlay) */}
      <RelaunchMenu />

      {/* Ecken-Logo (rote Hasen-Marke oben links) — gemeinsames Bauteil,
          blendet erst nach dem Zerlegen der Hero-Woerter ein. Bleibt bei
          z-index 43 unter dem Menue-Overlay (z-index 1000). */}
      <CornerLogo />
      <BackToTop />

      {/* Sektionen 0-3: Marken-Auftakt (Statement + Hasenkopf-Lockup) direkt in die
          durchgehende Morph-Buehne integriert (Hero + 5 Leistungs-Szenen) */}
      <HomeMorph />

      {/* Sektion 4: nur Weissraum als Atempause vor dem ersten Panel
          (Ueberleitungs-Satz entfernt, Tomson 25.07.). */}
      <div aria-hidden style={{ height: "var(--rr-section-y)" }} />

      {/* Sektion 5: Case-Panels (Referenz-Auswahl = Vorschlag, Tomson-Gate) */}
      <CasePanels />

      {/* Sektion 5b: Ablauf-Kreis-Szene (01-04, von /leistungen/website) — Thomas
          11.08.: auch auf der echten Home. Traegt das Entwurf-ohne-Vorkasse-
          Argument + CTA "Mach den ersten Schritt" sichtbar auf die Startseite. */}
      <Ablauf />

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
