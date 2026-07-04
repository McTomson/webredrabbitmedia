import type { Metadata } from "next";
import PageShell from "@/components/relaunch/PageShell";
import Faq from "@/components/relaunch/Faq";

export const metadata: Metadata = {
  title: "KI-Sichtbarkeit | Red Rabbit Media",
  description:
    "Immer mehr Menschen fragen ChatGPT, Gemini und Perplexity statt Google. Wir sorgen dafür, dass dein Betrieb in diesen KI-Antworten vorkommt.",
  alternates: { canonical: "https://web.redrabbit.media/leistungen/ki-sichtbarkeit" },
};

const faq = [
  {
    q: "Was heißt KI-Sichtbarkeit überhaupt?",
    a: "Wenn jemand ChatGPT, Gemini oder Perplexity nach einem Anbieter fragt, gibt die KI eine Antwort mit konkreten Empfehlungen. KI-Sichtbarkeit heißt, dass dein Betrieb in diesen Antworten auftaucht.",
  },
  {
    q: "Ist das nicht dasselbe wie SEO?",
    a: "Es überschneidet sich, ist aber nicht identisch. KI-Systeme bewerten Inhalte etwas anders als die klassische Google-Suche. Wir bauen deine Seite so auf, dass beide sie gut verstehen und zitieren können.",
  },
  {
    q: "Könnt ihr garantieren, dass ChatGPT meinen Betrieb nennt?",
    a: "Nein. Wie bei Google entscheidet am Ende das System selbst. Wir sorgen für klare, gut strukturierte und belegbare Inhalte, die die Chance deutlich erhöhen, genannt zu werden.",
  },
  {
    q: "Lohnt sich das jetzt schon?",
    a: "Ja, gerade weil viele Betriebe es noch ignorieren. Wer jetzt eine saubere Basis hat, ist vorne dabei, während die KI-Suche weiter wächst.",
  },
];

export default function KiSichtbarkeitPage() {
  return (
    <PageShell
      eyebrow="Leistung · KI-Sichtbarkeit"
      title="Auch die KI soll dich empfehlen."
      intro="Die Suche verlagert sich. Immer mehr Menschen tippen ihre Frage nicht bei Google ein, sondern fragen ChatGPT, Gemini oder Perplexity und bekommen eine fertige Empfehlung. Die Frage ist: bist du Teil dieser Antwort?"
    >
      {/* Problem */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-prose">
          <p className="rr-statement" style={{ marginBottom: 24 }}>Die Suche hat sich verändert.</p>
          <p className="rr-body-lg" style={{ color: "var(--rr-ink-soft)" }}>
            Wer heute einen Handwerker, eine Kanzlei oder ein Lokal sucht, fragt oft direkt eine KI und bekommt drei
            Namen genannt. Steht dein Betrieb nicht dabei, existierst du in diesem Moment nicht. Und viele Betriebe
            wissen noch gar nicht, dass es diesen Kanal gibt.
          </p>
        </div>
      </section>

      {/* Was wir tun */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <p className="rr-eyebrow" style={{ marginBottom: 34 }}>Was wir tun</p>
          <div className="rr-grid rr-grid-3">
            <div className="rr-card rr-card--surface">
              <h2 className="rr-sub" style={{ marginBottom: 14 }}>Klare Fakten</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Wir stellen sicher, dass wichtige Angaben zu deinem Betrieb eindeutig, aktuell und maschinenlesbar
                auf deiner Seite stehen.
              </p>
            </div>
            <div className="rr-card rr-card--surface">
              <h2 className="rr-sub" style={{ marginBottom: 14 }}>Fragen beantworten</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Wir formulieren Inhalte so, dass sie echte Fragen direkt beantworten. Genau das zitieren KI-Systeme gern.
              </p>
            </div>
            <div className="rr-card rr-card--surface">
              <h2 className="rr-sub" style={{ marginBottom: 14 }}>Vertrauen aufbauen</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Erfahrung, Belege und ein klares Profil. Signale, auf die sowohl Google als auch KI-Modelle achten.
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
              <p className="rr-sub">Eine Seite, die auch Maschinen verstehen.</p>
            </div>
            <ul className="rr-check">
              <li>Strukturierte, maschinenlesbare Angaben zu deinem Betrieb</li>
              <li>Inhalte in Frage-und-Antwort-Form, die KI-Systeme aufgreifen</li>
              <li>Klare Vertrauens- und Erfahrungssignale</li>
              <li>Eine Basis, die für Google und KI-Suche zugleich arbeitet</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <p className="rr-eyebrow" style={{ marginBottom: 12 }}>Häufige Fragen</p>
          <Faq items={faq} id="faq-ki" />
        </div>
      </section>
    </PageShell>
  );
}
