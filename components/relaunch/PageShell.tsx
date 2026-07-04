import type { ReactNode } from "react";
import Link from "next/link";
import { fraunces, grotesk } from "@/lib/relaunch/fonts";
import "@/app/styleguide/styleguide.css";
import "./subpages.css";

type PageShellProps = {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  /** Abschluss-CTA-Block ausblenden (z. B. auf /kontakt selbst). */
  hideCta?: boolean;
  ctaTitle?: string;
};

/**
 * Gemeinsames Unterseiten-Template im .rr-Design-System.
 * Rendert KEIN eigenes <main> (das kommt aus app/layout.tsx) und kein Header/Footer
 * (die Bestands-Chrome-Komponenten bleiben aktiv). Nur der Seiten-Inhalt im .rr-Scope.
 */
export default function PageShell({
  eyebrow,
  title,
  intro,
  children,
  hideCta = false,
  ctaTitle = "Du willst eine Website, die man findet? Reden wir.",
}: PageShellProps) {
  return (
    <div className={`rr ${fraunces.variable} ${grotesk.variable}`}>
      <section className="rr-section rr-pagehead">
        <div className="rr-wrap rr-narrow">
          <p className="rr-eyebrow" style={{ marginBottom: 20 }}>{eyebrow}</p>
          <h1 className="rr-claim">{title}</h1>
          {intro ? (
            <p className="rr-body-lg" style={{ marginTop: 26, maxWidth: 720, color: "var(--rr-ink-soft)" }}>
              {intro}
            </p>
          ) : null}
        </div>
      </section>

      {children}

      {hideCta ? null : (
        <section className="rr-section rr-cta-dark">
          <div className="rr-wrap rr-narrow">
            <p className="rr-display-2" style={{ color: "#fff", maxWidth: 900 }}>{ctaTitle}</p>
            <div className="rr-cta-actions">
              <Link className="rr-btn rr-btn--ondark" href="/kontakt">Projekt anfragen</Link>
              <a className="rr-link" href="tel:+436769000955" style={{ color: "#fff" }}>
                +43 676 9000 955
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
