import type { Metadata } from "next";
import PageShell from "@/components/relaunch/PageShell";

export const metadata: Metadata = {
  title: "Über uns | Red Rabbit Media",
  description:
    "Ein echtes Gesicht statt gesichtsloser Agentur. Red Rabbit Media steht für faires, transparentes Webdesign aus Österreich. Kein Risiko bis zur Zusage.",
  alternates: { canonical: "https://web.redrabbit.media/ueber-uns" },
};

// Person-Schema (EEAT). Name, Rolle, Profil und Themen sind belegt (vgl. app/layout.tsx).
// Das Foto ist PLATZHALTER, bis Tomson das finale Bild liefert.
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://web.redrabbit.media/ueber-uns#thomas-uhlir",
  name: "Thomas Uhlir MBA",
  jobTitle: "Gründer & Strategie",
  url: "https://web.redrabbit.media/ueber-uns",
  image: "https://web.redrabbit.media/images/thomas-uhlir.jpg",
  sameAs: ["https://www.linkedin.com/in/thomasuhlir/"],
  worksFor: { "@type": "Organization", "@id": "https://web.redrabbit.media/#organization", name: "Red Rabbit Media" },
  knowsAbout: [
    "Webdesign",
    "Suchmaschinenoptimierung (SEO)",
    "Generative Engine Optimization (GEO)",
    "Conversion-Optimierung",
    "Webdesign Österreich",
  ],
};

// B2B-Stationen aus Tomsons Immobilien-Vergangenheit (decisions-log 2026-07-04).
// Rein typografisch, eine Farbe, eine Schrift, keine Logos.
const b2bNames = [
  "SIGNA",
  "6B47",
  "Tillmann & Kraus",
  "MBT",
  "Sans Souci",
  "Die Vorsorgewohnungs GmbH",
  "Phils.place",
];

export default function UeberUnsPage() {
  return (
    <PageShell
      eyebrow="Über uns"
      title="Ein echtes Gesicht. Kein Callcenter."
      intro="Red Rabbit Media ist keine gesichtslose Agentur. Du redest mit einer Person, die dein Projekt kennt, von der ersten Idee bis nach dem Launch. Fair, direkt und ohne Agentur-Bullshit."
    >
      {/* Bio + Foto (Platzhalter) */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <div className="rr-grid rr-grid-2" style={{ alignItems: "start" }}>
            {/* Foto-Platzhalter */}
            <div
              className="rr-placeholder"
              style={{ aspectRatio: "4 / 5", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}
            >
              <div>
                <p className="rr-placeholder-tag">Platzhalter</p>
                <p className="rr-meta" style={{ marginTop: 8 }}>Foto Thomas Uhlir (liefert Tomson)</p>
              </div>
            </div>

            {/* Bio-Platzhalter */}
            <div style={{ display: "grid", gap: 20 }}>
              <div>
                <p className="rr-eyebrow" style={{ marginBottom: 12 }}>Thomas Uhlir MBA</p>
                <p className="rr-sub">Gründer & Strategie</p>
              </div>
              <div className="rr-placeholder">
                <p className="rr-placeholder-tag">Platzhalter: Bio</p>
                <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17, marginTop: 10 }}>
                  Hier steht die persönliche Geschichte von Thomas: Werdegang, warum Red Rabbit gegründet wurde und
                  warum das Kein-Risiko-Prinzip. Finaler Text und Bild kommen von Tomson.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Haltung */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <p className="rr-eyebrow" style={{ marginBottom: 34 }}>Wofür wir stehen</p>
          <div className="rr-grid rr-grid-3">
            <div className="rr-card rr-card--surface">
              <h2 className="rr-sub" style={{ marginBottom: 14 }}>Kein Risiko</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Du siehst den Entwurf zuerst. Wir tragen das Risiko, bis du überzeugt bist.
              </p>
            </div>
            <div className="rr-card rr-card--surface">
              <h2 className="rr-sub" style={{ marginBottom: 14 }}>Klartext</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Fixpreis-Rahmen statt Stundensatz-Lotterie. Kein Fachchinesisch, keine versteckten Kosten.
              </p>
            </div>
            <div className="rr-card rr-card--surface">
              <h2 className="rr-sub" style={{ marginBottom: 14 }}>Ergebnis</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Wir bauen keine digitale Visitenkarte, sondern einen Kanal, der Anfragen bringt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* B2B-Vergangenheit */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <p className="rr-eyebrow" style={{ marginBottom: 10 }}>Frühere Stationen</p>
          <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17, maxWidth: 720, marginBottom: 40 }}>
            Vor Red Rabbit war Thomas im Immobilien-Umfeld tätig und hat mit diesen Unternehmen und Marken
            zusammengearbeitet:
          </p>
          <div className="rr-trustnames">
            {b2bNames.map((n) => (
              <span key={n} className="rr-trustname">{n}</span>
            ))}
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
    </PageShell>
  );
}
