import type { Metadata } from "next";
import PageShell from "@/components/relaunch/PageShell";
import Faq from "@/components/relaunch/Faq";

export const metadata: Metadata = {
  title: "Dashboard & Betreuung | Red Rabbit Media",
  description:
    "Ein Dashboard zeigt dir in Klartext, was deine Website bringt: Rankings, Sichtbarkeit, Anfragen. Ab dem Business-Paket gratis. Wartung ohne Bindung.",
  alternates: { canonical: "https://web.redrabbit.media/leistungen/dashboard" },
};

const faq = [
  {
    q: "Was kostet das Dashboard?",
    a: "Ab dem Business-Paket ist das Dashboard gratis dabei. Du zahlst also keinen Aufpreis, um zu sehen, was deine Website leistet.",
  },
  {
    q: "Was sehe ich im Dashboard?",
    a: "In Klartext aufbereitet: wie du bei wichtigen Suchbegriffen rankst, wie sich deine Sichtbarkeit entwickelt und wie viele Anfragen ueber die Seite reinkommen. Keine kryptischen Zahlen, sondern verstaendliche Aussagen.",
  },
  {
    q: "Bin ich bei der Betreuung an einen Vertrag gebunden?",
    a: "Nein. Das Wartungs- und Optimierungs-Abo laeuft ohne Mindestlaufzeit und ist jederzeit kuendbar. Wir wollen dich mit Leistung halten, nicht mit einem Vertrag.",
  },
  {
    q: "Brauche ich die Betreuung ueberhaupt?",
    a: "Eine Website ist nichts, das man einmal baut und dann vergisst. Wer regelmaessig pflegt, Inhalte ergaenzt und die Technik aktuell haelt, bleibt sichtbar. Ob du das selbst machst oder uns ueberlaesst, entscheidest du.",
  },
];

export default function DashboardPage() {
  return (
    <PageShell
      eyebrow="Leistung · Dashboard & Betreuung"
      title="Sieh in Klartext, was deine Website bringt."
      intro="Die meisten Betriebe haben keine Ahnung, ob ihre Website funktioniert. Wir aendern das: Ein Dashboard zeigt dir schwarz auf weiss, wie sichtbar du bist und was reinkommt. Ab dem Business-Paket gratis."
    >
      {/* Problem */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-prose">
          <p className="rr-statement" style={{ marginBottom: 24 }}>Was man nicht sieht, kann man nicht steuern.</p>
          <p className="rr-body-lg" style={{ color: "var(--rr-ink-soft)" }}>
            Eine Website ohne Ueberblick ist eine Blackbox. Du zahlst, aber weisst nicht, ob sie arbeitet. Wir
            machen das sichtbar und uebersetzen die technischen Zahlen in Aussagen, mit denen du wirklich etwas anfangen kannst.
          </p>
        </div>
      </section>

      {/* Was wir tun */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <p className="rr-eyebrow" style={{ marginBottom: 34 }}>Was drin steckt</p>
          <div className="rr-grid rr-grid-3">
            <div className="rr-card rr-card--surface">
              <h2 className="rr-sub" style={{ marginBottom: 14 }}>Sichtbarkeit</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Wie du bei deinen wichtigsten Suchbegriffen stehst und wie sich das ueber die Zeit entwickelt.
              </p>
            </div>
            <div className="rr-card rr-card--surface">
              <h2 className="rr-sub" style={{ marginBottom: 14 }}>Anfragen</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Wie viele Menschen ueber deine Seite Kontakt aufnehmen. So siehst du, was die Website wirklich bringt.
              </p>
            </div>
            <div className="rr-card rr-card--surface">
              <h2 className="rr-sub" style={{ marginBottom: 14 }}>Laufende Pflege</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Technik aktuell halten, Inhalte ergaenzen, Schwachstellen ausbessern. Optional als Abo ohne Bindung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Was du bekommst */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <div className="rr-grid rr-grid-2" style={{ alignItems: "start" }}>
            <div>
              <p className="rr-eyebrow" style={{ marginBottom: 20 }}>Was du bekommst</p>
              <p className="rr-sub">Ueberblick statt Blackbox.</p>
            </div>
            <ul className="rr-check">
              <li>Dashboard mit Rankings, Sichtbarkeit und Anfragen in Klartext</li>
              <li>Ab dem Business-Paket ohne Aufpreis dabei</li>
              <li>Wartungs- und Optimierungs-Abo ohne Mindestlaufzeit</li>
              <li>Ein Ansprechpartner, kein Callcenter</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <p className="rr-eyebrow" style={{ marginBottom: 12 }}>Haeufige Fragen</p>
          <Faq items={faq} id="faq-dashboard" />
        </div>
      </section>
    </PageShell>
  );
}
