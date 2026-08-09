import type { Metadata } from "next";
import { crimson, dmsans, grotesk } from "@/lib/relaunch/fonts";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import CornerLogo from "@/components/relaunch/CornerLogo";
import BackToTop from "@/components/relaunch/BackToTop";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import SiteClosing from "@/components/relaunch/SiteClosing";
import SphereGallery from "@/components/relaunch/SphereGallery";
import ScrollExperience from "@/components/relaunch/ScrollExperience";
import GalleryChrome from "@/components/relaunch/GalleryChrome";
import { SPHERE_PROJECTS } from "@/lib/relaunch/projects";
import JsonLd from "@/components/JsonLd";
import "../../styleguide/styleguide.css";
import "@/components/relaunch/subpages.css";

/**
 * Referenzen-Seite im Relaunch-Design (Preview, noindex) — Sphaeren-Galerie
 * im phantom.land-Look (Thomas-Entscheidung 15.07.2026, bewusster Stilbruch):
 * viewportfuellende dunkle Buehne, der Besucher steht IN einer Kugel aus
 * Projekt-Screenshots, Drag rotiert traege, Hover = weisse Meta-Karte,
 * Klick zoomt heran und hellt die Szene auf. Die 3D-Engine lebt in
 * components/relaunch/SphereGallery.tsx (die einzige freigegebene WebGL-
 * Signatur laut DESIGN.md §15 D3). H1 + Projektliste + Abschluss-CTA sind
 * echtes SSR-HTML (SEO-Unterbau). Der fruehere "Hasen-Lauf"
 * (components/subpages/referenzen/ReferenzenLauf.tsx) bleibt unangetastet
 * im Repo fuer spaetere Verwendung.
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

export default function ReferenzenPreviewPage() {
  return (
    <div
      className={`rr rf ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`}
      style={{ background: "var(--rr-surface, #f4f4f2)" }}
    >
      {/* Page-Level-Schema (Thomas 09.08.): CollectionPage + crawlbare ItemList der
          echten Referenzen (Quelle SPHERE_PROJECTS, fail-closed: url nur bei gesicherter
          Domain) + Breadcrumb. URLs auf Go-Live-Root (/referenzen), Org via @id aus dem
          globalen @graph. Verwandt: reference_relaunch_golive_domain_modell. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": "https://web.redrabbit.media/referenzen#collectionpage",
              url: "https://web.redrabbit.media/referenzen",
              name: "Referenzen — Webdesign-Projekte aus Österreich",
              description: META_DESC,
              inLanguage: "de-AT",
              isPartOf: { "@id": "https://web.redrabbit.media/#website" },
              about: { "@id": "https://web.redrabbit.media/#organization" },
              mainEntity: {
                "@type": "ItemList",
                itemListElement: SPHERE_PROJECTS.map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: p.name,
                  ...(p.href ? { url: p.href } : {}),
                })),
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Startseite", item: "https://web.redrabbit.media/" },
                { "@type": "ListItem", position: 2, name: "Referenzen", item: "https://web.redrabbit.media/referenzen" },
              ],
            },
          ],
        }}
      />

      <RelaunchMenu />

      {/* Ecken-Logo (rote Hasen-Marke oben links) — gemeinsames Bauteil,
          blendet erst nach etwas Scrollen ein (ersetzt das fruehere
          GalleryChrome-Logo, damit Groesse/Position seitenweit identisch sind). */}
      <CornerLogo />
      <BackToTop />

      {/* Buehne: viewportfuellende Galerie. H1 wie der Original-Claim als
          kleiner Textblock oben Mitte (SSR, SEO), Chrome = Logo/Let's talk/Nav. */}
      <section data-rr-snap style={{ position: "relative", height: "100dvh", background: "var(--rr-navy)" }}>
        <SphereGallery />
        <div
          style={{
            position: "absolute",
            top: "clamp(20px, 2.6vw, 38px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3,
            pointerEvents: "none",
            textAlign: "left",
            width: "min(340px, 42vw)",
          }}
          className="rf-gal-claim"
        >
          <h1
            style={{
              color: "#f4f4f2",
              fontSize: "clamp(10.5px, 0.85vw, 13px)",
              fontWeight: 600,
              letterSpacing: "0.14em",
              lineHeight: 1.55,
              textTransform: "uppercase",
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}
          >
            Referenzen: Websites von Red Rabbit Media für Betriebe aus Österreich.
          </h1>
        </div>
        <GalleryChrome />
      </section>

      {/* Crawlbare, server-gerenderte Projektliste (SEO-Unterbau) */}
      <section data-rr-snap className="rr-section" style={{ background: "var(--rr-surface, #f4f4f2)" }}>
        <div className="rr-wrap">
          <p className="rr-eyebrow-lg" style={{ marginBottom: 20 }}>
            Die Projekte
          </p>
          <h2 className="rr-display-2" style={{ marginBottom: 48 }}>
            Sieben Branchen, sieben Websites
          </h2>
          <ul className="rr-companyrow" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {SPHERE_PROJECTS.map((p) => (
              <li key={p.slug}>
                <p className="rr-company-name">{p.name}</p>
                <a
                  className="rr-company-line"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", color: "inherit", textDecoration: "none" }}
                >
                  {p.cat} — Website ansehen
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Abschluss: geteilter Block SiteClosing (DESIGN_STANDARD 28.07.: gleicher
          Aufbau wie Homepage, linksbuendig; Text aus brand/copy-closing-cta.md).
          Ersetzt den frueheren zentrierten Inline-CTA. */}
      <SiteClosing
        lines={[
          "Diese Projekte sprechen für uns.",
          "Das nächste kann für dich sprechen.",
          "Reden wir.",
        ]}
      />

      <div data-rr-snap>
        <FooterReassembly />
      </div>

      {/* Site-weites Scroll-Gefuehl: Lenis + Soft-Snap (Thomas 28.07.). */}
      <ScrollExperience />
    </div>
  );
}
