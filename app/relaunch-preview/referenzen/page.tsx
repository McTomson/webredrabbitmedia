import type { Metadata } from "next";
import Link from "next/link";
import { crimson, dmsans, grotesk } from "@/lib/relaunch/fonts";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import SphereGallery from "@/components/relaunch/SphereGallery";
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

      {/* Buehne: viewportfuellende Sphaeren-Galerie, H1 als SSR-Overlay */}
      <section style={{ position: "relative", height: "100dvh", background: "var(--rr-dark)" }}>
        <div
          style={{
            position: "absolute",
            top: "calc(var(--rr-gutter) + 64px)",
            left: "var(--rr-gutter)",
            right: "var(--rr-gutter)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          {/* Scrim: haelt die H1 lesbar, wenn helle Kacheln dahinter vorbeiziehen */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "-48px -64px -56px -64px",
              background:
                "radial-gradient(ellipse 110% 100% at 20% 40%, rgba(13,14,18,0.72), rgba(13,14,18,0) 68%)",
            }}
          />
          <p
            className="rr-eyebrow-lg"
            style={{ position: "relative", color: "#f6f5f1", marginBottom: 10 }}
          >
            Referenzen
          </p>
          <h1
            className="rr-statement"
            style={{ position: "relative", color: "#f6f5f1", maxWidth: "16ch" }}
          >
            Komm mit. Wir zeigen dir was.
          </h1>
        </div>
        <SphereGallery />
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
