import type { Metadata } from "next";
import Link from "next/link";
import { crimson, dmsans, grotesk } from "@/lib/relaunch/fonts";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import SphereGallery from "@/components/relaunch/SphereGallery";
import GalleryChrome from "@/components/relaunch/GalleryChrome";
import { SPHERE_PROJECTS } from "@/lib/relaunch/projects";
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
      style={{ background: "#ffffff" }}
    >
      <RelaunchMenu />

      {/* Buehne: viewportfuellende Galerie. H1 wie der Original-Claim als
          kleiner Textblock oben Mitte (SSR, SEO), Chrome = Logo/Let's talk/Nav. */}
      <section style={{ position: "relative", height: "100dvh", background: "var(--rr-navy)" }}>
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
              color: "#f6f5f1",
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
      <section className="rr-section" style={{ background: "#ffffff" }}>
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

      {/* Abschluss: Statement + CTA (Copy V3, Thomas-Wahl) */}
      <section className="rr-section" style={{ background: "var(--rr-surface)", textAlign: "center" }}>
        <div className="rr-wrap">
          <p className="rr-statement" style={{ margin: "0 auto 36px", maxWidth: "18ch" }}>
            Das waren unsere Kunden. Der nächste bist du.
          </p>
          <Link className="rr-btn-sweep--red" href="/relaunch-preview/kontakt">
            Den nächsten Schritt machen
          </Link>
        </div>
      </section>

      <FooterReassembly />
    </div>
  );
}
