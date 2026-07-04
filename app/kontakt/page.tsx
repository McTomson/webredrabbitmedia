import type { Metadata } from "next";
import PageShell from "@/components/relaunch/PageShell";
import ContactFormRR from "@/components/relaunch/ContactFormRR";

export const metadata: Metadata = {
  title: "Kontakt | Red Rabbit Media",
  description:
    "Reden wir ueber deine Website. Schreib uns ueber das Formular oder ruf direkt an. Wir melden uns in der Regel am selben Werktag.",
  alternates: { canonical: "https://web.redrabbit.media/kontakt" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Kontakt - Red Rabbit Media",
  description: "Kontaktiere Red Rabbit Media fuer Webdesign, SEO und KI-Sichtbarkeit.",
  mainEntity: {
    "@type": "ProfessionalService",
    name: "Red Rabbit Media",
    url: "https://web.redrabbit.media",
    telephone: "+436769000955",
    email: "office@redrabbit.media",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Grabnergasse 8",
      addressLocality: "Wien",
      postalCode: "1060",
      addressCountry: "AT",
    },
    areaServed: ["AT", "DE", "CH"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
  },
};

export default function KontaktPage() {
  return (
    <PageShell
      eyebrow="Kontakt"
      title="Reden wir."
      intro="Erzaehl uns kurz von deinem Betrieb und was du brauchst. Wir melden uns in der Regel am selben Werktag. Lieber direkt? Ruf einfach an."
      hideCta
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <div className="rr-contact-grid">
            {/* Formular */}
            <div className="rr-card" style={{ padding: "clamp(24px, 3vw, 44px)" }}>
              <p className="rr-eyebrow" style={{ marginBottom: 12 }}>Anfrage</p>
              <h2 className="rr-sub" style={{ marginBottom: 28 }}>Schreib uns.</h2>
              <ContactFormRR />
            </div>

            {/* Direkter Draht */}
            <div style={{ display: "grid", gap: 22 }}>
              <div className="rr-card rr-card--surface">
                <p className="rr-eyebrow" style={{ marginBottom: 12 }}>Telefon</p>
                <a className="rr-link" href="tel:+436769000955">+43 676 9000 955</a>
                <p className="rr-meta" style={{ marginTop: 14 }}>Mo bis Fr, 09:00 bis 18:00 Uhr</p>
              </div>
              <div className="rr-card rr-card--surface">
                <p className="rr-eyebrow" style={{ marginBottom: 12 }}>E-Mail</p>
                <a className="rr-link" href="mailto:office@redrabbit.media">office@redrabbit.media</a>
                <p className="rr-meta" style={{ marginTop: 14 }}>Wir antworten in der Regel am selben Werktag.</p>
              </div>
              <div className="rr-card rr-card--surface">
                <p className="rr-eyebrow" style={{ marginBottom: 12 }}>Adresse</p>
                <p className="rr-body" style={{ fontSize: 17 }}>
                  Red Rabbit Media<br />
                  Grabnergasse 8<br />
                  1060 Wien, Oesterreich
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
