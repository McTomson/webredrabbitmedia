import type { Metadata } from "next";
import { crimson, dmsans, grotesk } from "@/lib/relaunch/fonts";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import ReferenzenLauf, { type Copy } from "@/components/subpages/referenzen/ReferenzenLauf";
import "../../styleguide/styleguide.css";
import "@/components/relaunch/subpages.css";

/**
 * Referenzen-Seite im Relaunch-Design (Preview, noindex) — der "Hasen-Lauf":
 * eine einzige Scroll-Strecke, in der eine 125-Frame-WebP-Sequenz per Canvas
 * scroll-gescrubt wird (Hase sitzt -> laeuft ins Loch -> Tunnel), waehrend im
 * Tunnel die sieben Projekt-Karten ueber dem Canvas erscheinen. Aufbau/Farbrollen/
 * Fonts nach docs/UNTERSEITEN_STIL.md: .rr-Scope + drei Font-Variablen, weisser
 * Grund, RelaunchMenu oben, FooterReassembly unten. Die Scrub-/Frame-Engine liegt
 * in der Client-Komponente ReferenzenLauf; H1 und Karten sind echtes SSR-HTML.
 *
 * Copy-Varianten ueber ?v=1|2|3 (Default 1) — der Dirigent zeigt sie Thomas
 * gerendert.
 */

const CANONICAL = "https://web.redrabbit.media/relaunch-preview/referenzen";
const META_DESC =
  "Ausgewählte Webdesign-Projekte von Red Rabbit Media: Websites für Betriebe aus Österreich, " +
  "von Thermenwartung über Gastronomie bis Immobilien. Sieh dir an, was wir bauen.";

export const metadata: Metadata = {
  title: "Referenzen — Webdesign-Projekte aus Österreich | Red Rabbit Media",
  description: META_DESC,
  robots: { index: false, follow: false },
  alternates: { canonical: "/relaunch-preview/referenzen" },
  openGraph: {
    title: "Referenzen — Red Rabbit Media",
    description: META_DESC,
    type: "website",
    url: CANONICAL,
  },
};

// Drei Copy-Varianten (Thomas-Vorgabe). Echte Umlaute. Das Schluss-Statement
// wird in der Client-Komponente an der letzten Interpunktion in einen roten
// Punkt gesplittet (einziger Akzent).
const COPY: Record<1 | 2 | 3, Copy> = {
  1: {
    h1: "Wie tief geht der Hasenbau?",
    closeStmt: "Jedes dieser Projekte war mal ein erster Schritt.",
    cta: "Dein Projekt starten",
  },
  2: {
    h1: "Willst du sehen, was wir können?",
    closeStmt: "Der Hase läuft schon. Kommst du mit?",
    cta: "Projekt starten",
  },
  3: {
    h1: "Komm mit. Wir zeigen dir was.",
    closeStmt: "Das waren unsere Kunden. Der nächste bist du.",
    cta: "Den nächsten Schritt machen",
  },
};

export default async function ReferenzenPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const sp = await searchParams;
  const variant: 1 | 2 | 3 = sp.v === "2" ? 2 : sp.v === "3" ? 3 : 1;

  return (
    <div
      className={`rr rf ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`}
      style={{ background: "#ffffff" }}
    >
      <RelaunchMenu />
      <ReferenzenLauf copy={COPY[variant]} />
      <FooterReassembly />
    </div>
  );
}
