import type { Metadata } from "next";
import PageShell from "@/components/relaunch/PageShell";
import Faq from "@/components/relaunch/Faq";

export const metadata: Metadata = {
  title: "Google-Sichtbarkeit & SEO | Red Rabbit Media",
  description:
    "Gefunden werden, wenn Leute suchen. Wir bauen die technische und inhaltliche Basis, damit deine Seite bei Google rankt, statt unsichtbar zu bleiben.",
  alternates: { canonical: "https://web.redrabbit.media/leistungen/seo" },
};

const faq = [
  {
    q: "Wie lange dauert es, bis ich bei Google steige?",
    a: "SEO wirkt langfristig. Erste Bewegungen sind oft nach einigen Wochen sichtbar, stabile Rankings brauchen meist mehrere Monate. Wer schnelle Garantien verspricht, ist unserioes.",
  },
  {
    q: "Koennt ihr Platz 1 bei Google garantieren?",
    a: "Nein, und niemand kann das serioes. Wir sorgen fuer eine starke technische Basis, guten Inhalt und die richtigen Signale. Ueber die Platzierung entscheidet am Ende Google.",
  },
  {
    q: "Ist SEO bei euch ein teures Extra?",
    a: "Die SEO-Grundlagen bauen wir direkt in die Website ein. Laufende Optimierung und Content sind ein eigener Baustein, den du dazunehmen kannst, aber nicht musst.",
  },
  {
    q: "Was ist der Unterschied zwischen SEO und bezahlter Werbung?",
    a: "Bezahlte Anzeigen bringen sofort Klicks, kosten aber pro Klick. SEO baut Sichtbarkeit auf, die dir langfristig ohne laufende Klickkosten Anfragen bringt. Beides ergaenzt sich.",
  },
];

export default function SeoPage() {
  return (
    <PageShell
      eyebrow="Leistung · Google-Sichtbarkeit"
      title="Gefunden werden, wenn Leute suchen."
      intro="Die beste Website bringt nichts, wenn sie auf Seite drei bei Google steht. Sichtbarkeit ist kein Zufall, sondern das Ergebnis von sauberer Technik, gutem Inhalt und den richtigen Signalen."
    >
      {/* Problem */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-prose">
          <p className="rr-statement" style={{ marginBottom: 24 }}>Unsichtbar ist wie geschlossen.</p>
          <p className="rr-body-lg" style={{ color: "var(--rr-ink-soft)" }}>
            Wenn jemand nach deiner Leistung in deiner Region sucht und dich nicht findet, gewinnt der Mitbewerber,
            der oben steht. Nicht weil er besser ist, sondern weil er sichtbar ist. Genau das drehen wir um.
          </p>
        </div>
      </section>

      {/* Was wir tun */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <p className="rr-eyebrow" style={{ marginBottom: 34 }}>Was wir tun</p>
          <div className="rr-grid rr-grid-3">
            <div className="rr-card rr-card--surface">
              <h2 className="rr-sub" style={{ marginBottom: 14 }}>Technische Basis</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Tempo, saubere Struktur, korrekte Auszeichnung und maschinenlesbare Daten. Das Fundament, damit
                Google deine Seite versteht.
              </p>
            </div>
            <div className="rr-card rr-card--surface">
              <h2 className="rr-sub" style={{ marginBottom: 14 }}>Lokale Sichtbarkeit</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Eigene Regionalseiten und lokale Signale, damit du in deiner Stadt und deinem Bundesland gefunden wirst.
              </p>
            </div>
            <div className="rr-card rr-card--surface">
              <h2 className="rr-sub" style={{ marginBottom: 14 }}>Inhalt, der rankt</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Beitraege, die echte Fragen deiner Kunden beantworten und langfristig Besucher bringen.
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
              <p className="rr-sub">Ein Fundament, auf dem Sichtbarkeit waechst.</p>
            </div>
            <ul className="rr-check">
              <li>SEO-Grundlagen direkt in die Website eingebaut</li>
              <li>Maschinenlesbare Auszeichnung (strukturierte Daten)</li>
              <li>Lokale Sichtbarkeit fuer deine Region</li>
              <li>Optional: laufende Optimierung und Content</li>
              <li>Ehrliche Einschaetzung statt leerer Ranking-Versprechen</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <p className="rr-eyebrow" style={{ marginBottom: 12 }}>Haeufige Fragen</p>
          <Faq items={faq} id="faq-seo" />
        </div>
      </section>
    </PageShell>
  );
}
