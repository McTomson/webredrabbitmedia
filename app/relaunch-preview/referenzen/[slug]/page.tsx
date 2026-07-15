import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { crimson, dmsans, grotesk } from "@/lib/relaunch/fonts";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import { SPHERE_PROJECTS } from "@/lib/relaunch/projects";
import "../../../styleguide/styleguide.css";
import "@/components/relaunch/subpages.css";

/**
 * Projekt-Unterseite (Stub) — Ziel des Kachel-Klicks in der Referenzen-
 * Galerie. Die vollen Case-Studies sind ein eigener Folgeauftrag
 * (Thomas 15.07.2026); bis dahin: Name, Kategorie, Screenshot,
 * Link zur Live-Site. noindex wie alle relaunch-previews.
 */

export function generateStaticParams() {
  return SPHERE_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = SPHERE_PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — Referenz | Red Rabbit Media`,
    description: `${project.name} (${project.cat}): Website gebaut von Red Rabbit Media.`,
    robots: { index: false, follow: false },
  };
}

export default async function ReferenzProjektPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = SPHERE_PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div
      className={`rr rf ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`}
      style={{ background: "var(--rr-navy)", minHeight: "100dvh" }}
    >
      <RelaunchMenu />

      <section className="rr-section" style={{ background: "var(--rr-navy)" }}>
        <div className="rr-wrap" style={{ maxWidth: 880 }}>
          <p className="rr-eyebrow-lg" style={{ color: "#c7c9cf", marginBottom: 16 }}>
            {project.cat}
          </p>
          <h1 className="rr-display-2" style={{ color: "#f6f5f1", marginBottom: 12 }}>
            {project.name}
          </h1>
          <p className="rr-body" style={{ color: "#c7c9cf", marginBottom: 36, maxWidth: "52ch" }}>
            Die ganze Geschichte zu diesem Projekt folgt hier in Kürze. Bis dahin:
            schau dir die Website live an.
          </p>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.img}
            alt={`Website ${project.name}`}
            style={{
              display: "block",
              width: "100%",
              aspectRatio: "960/620",
              objectFit: "cover",
              marginBottom: 36,
              boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
            }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <a
              className="rr-btn rr-btn--ondark"
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Website live ansehen
            </a>
            <Link className="rr-btn rr-btn--ondark-ghost" href="/relaunch-preview/referenzen">
              Zurück zur Galerie
            </Link>
          </div>
        </div>
      </section>

      <FooterReassembly />
    </div>
  );
}
