import type { Metadata } from "next";
import { crimson, dmsans, grotesk } from "@/lib/relaunch/fonts";
import TalosEntranceStage from "@/components/relaunch/talos/TalosEntranceStage";
import "@/app/styleguide/styleguide.css";

export const metadata: Metadata = {
  title: "Talos-Auftritt (Fidelity-Demo, intern)",
  robots: { index: false, follow: false },
};

/**
 * Isolierte Fidelity-Demo NUR fuer den Talos-Auftritt am Helfer-Moment:
 * Talos gleitet von rechts herein, dreht sich zum User und winkt. Layout wie
 * spaeter auf der Leistungsseite (Text links, Talos im rechten Drittel). Der
 * Auftritt spielt, sobald die Sektion in den Viewport scrollt. QA-Hooks:
 * window.__talosEntrance.play() / .replay() / .setProg(0..1).
 */
export default function TalosEntranceDemoPage() {
  return (
    <div
      className={`rr ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`}
      style={{ background: "#ffffff" }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
      />

      {/* Kurzer Vorlauf, damit man in die Sektion hineinscrollt (Auftritt-Trigger). */}
      <section
        style={{
          minHeight: "62vh",
          display: "flex",
          alignItems: "center",
          padding: "0 var(--rr-gutter)",
        }}
      >
        <div style={{ maxWidth: "38em" }}>
          <p className="rr-eyebrow-lg" style={{ marginBottom: 16 }}>
            Interne Demo
          </p>
          <h1 className="rr-statement" style={{ color: "var(--rr-navy)", margin: 0 }}>
            Scroll nach unten. Talos kommt gleich von rechts, dreht sich zu dir und winkt.
          </h1>
          <p className="rr-body" style={{ marginTop: 20, color: "var(--rr-ink-soft)" }}>
            Das ist nur der Auftritt zum Abstimmen. Danach baue ich ihn in den
            Helfer-Moment der Leistungsseite ein.
          </p>
        </div>
      </section>

      {/* Helfer-Moment-Layout: Text links, Talos-Buehne im rechten Drittel. */}
      <section
        className="tle-demo-grid"
        style={{ minHeight: "100vh", padding: "8vh var(--rr-gutter)", alignItems: "center" }}
      >
        <div className="tle-demo-text">
          <p className="rr-eyebrow-lg" style={{ marginBottom: 16 }}>
            Der Helfer
          </p>
          <p className="rr-statement" style={{ color: "var(--rr-navy)", margin: 0 }}>
            Und sie kann mehr als andere Websites, weil im Hintergrund jemand
            mitarbeitet.
          </p>
          <p className="rr-body" style={{ marginTop: 20, color: "var(--rr-ink-soft)", maxWidth: "34em" }}>
            Während du schläfst, nimmt Talos die Anfrage von 23 Uhr an und legt
            dir am Morgen die fertige Antwort zur Freigabe hin.
          </p>
        </div>

        <div className="tle-demo-stage">
          <TalosEntranceStage />
        </div>
      </section>

      <section style={{ minHeight: "40vh" }} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
.tle-demo-grid{ display:grid; grid-template-columns: 1fr; gap: clamp(24px, 5vh, 56px); }
.tle-demo-stage{ position:relative; width:100%; height:min(72vh, 640px); }
@media (min-width: 900px){
  .tle-demo-grid{ grid-template-columns: 1fr 38%; }
  .tle-demo-stage{ height:min(78vh, 720px); }
}
`,
        }}
      />
    </div>
  );
}
