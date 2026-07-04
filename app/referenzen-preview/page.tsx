import type { Metadata } from "next";
import { fraunces, grotesk } from "@/lib/relaunch/fonts";
import SphereGallery from "@/components/relaunch/SphereGallery";
import { BASE_PROJECTS } from "@/lib/relaunch/projects";
import "../styleguide/styleguide.css";

export const metadata: Metadata = {
  title: "Referenzen-Preview — Kugel-Galerie P2b (intern)",
  robots: { index: false, follow: false },
};

export default function ReferenzenPreviewPage() {
  return (
    <div className={`rr ${fraunces.variable} ${grotesk.variable}`}>
      {/* Buehne: viewportfuellend */}
      <section style={{ position: "relative", height: "100dvh", background: "var(--rr-dark)" }}>
        <div
          style={{
            position: "absolute",
            top: "var(--rr-gutter)",
            left: "var(--rr-gutter)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <p className="rr-eyebrow">P2b-Preview</p>
        </div>
        <SphereGallery />
      </section>

      {/* Crawlbare, server-gerenderte Referenz-Liste (SEO-Unterbau) */}
      <section className="rr-section" style={{ background: "var(--rr-paper)" }}>
        <div className="rr-wrap">
          <p className="rr-eyebrow" style={{ marginBottom: 20 }}>
            Referenzen
          </p>
          <h1 className="rr-statement" style={{ marginBottom: 48 }}>
            Ausgewaehlte Projekte
          </h1>
          <ul className="rr-companyrow" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {BASE_PROJECTS.map((p) => (
              <li key={p.name}>
                <p className="rr-company-name">{p.name}</p>
                {p.href ? (
                  <a
                    className="rr-company-line"
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "block", color: "inherit", textDecoration: "none" }}
                  >
                    {p.line}
                  </a>
                ) : (
                  <p className="rr-company-line">{p.line}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
