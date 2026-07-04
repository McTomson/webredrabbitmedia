import type { Metadata } from "next";
import PageShell from "@/components/relaunch/PageShell";
import Faq from "@/components/relaunch/Faq";

export const metadata: Metadata = {
  title: "Webdesign | Red Rabbit Media",
  description:
    "Schnelles, klares Webdesign, das auf Anfragen gebaut ist. Den Entwurf siehst du zuerst, ganz ohne Vorkasse. Individuell statt Baukasten.",
  alternates: { canonical: "https://web.redrabbit.media/leistungen/webdesign" },
};

const faq = [
  {
    q: "Bekomme ich eine individuelle Seite oder einen Baukasten?",
    a: "Du bekommst eine individuell gebaute Seite. Wir arbeiten nicht mit fertigen Baukasten-Vorlagen, sondern gestalten Struktur, Text und Design für deinen Betrieb.",
  },
  {
    q: "Muss ich vorab bezahlen?",
    a: "Nein. Du siehst zuerst einen echten Entwurf. Eine Anzahlung fällt erst an, wenn dir der Vorschlag gefällt und du den Auftrag erteilst.",
  },
  {
    q: "Ist die Seite auf dem Handy sauber?",
    a: "Ja. Jede Seite wird für Handy, Tablet und Desktop gebaut und getestet. Der Großteil deiner Besucher kommt vom Handy, also hat das oberste Priorität.",
  },
  {
    q: "Kann ich Inhalte später selbst ändern?",
    a: "Ja. Auf Wunsch richten wir dir einen Zugang ein, mit dem du Texte und Bilder selbst pflegst. Oder wir übernehmen die Pflege im Rahmen der Betreuung.",
  },
];

export default function WebdesignPage() {
  return (
    <PageShell
      eyebrow="Leistung · Webdesign"
      title="Eine Website, die arbeitet. Nicht nur gut aussieht."
      intro="Viele Betriebe haben eine Seite, die schön ist und trotzdem nichts bringt. Weil sie langsam ist, unklar aufgebaut oder auf dem Handy bricht. Genau da setzen wir an."
    >
      {/* Problem */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-prose">
          <p className="rr-statement" style={{ marginBottom: 24 }}>Schön allein reicht nicht.</p>
          <p className="rr-body-lg" style={{ color: "var(--rr-ink-soft)" }}>
            Deine Kunden entscheiden in Sekunden, ob sie bleiben. Lädt die Seite zu langsam, finden sie nicht
            sofort, was sie suchen, oder wirkt der Auftritt beliebig, sind sie wieder weg, meist zur Konkurrenz.
            Eine gute Website nimmt Besucher an der Hand und führt sie zur Anfrage.
          </p>
        </div>
      </section>

      {/* Was wir tun */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <p className="rr-eyebrow" style={{ marginBottom: 34 }}>Was wir tun</p>
          <div className="rr-grid rr-grid-3">
            <div className="rr-card rr-card--surface">
              <h2 className="rr-sub" style={{ marginBottom: 14 }}>Klarer Aufbau</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Wir strukturieren deine Seite so, dass Besucher sofort verstehen, was du machst und was der
                nächste Schritt ist.
              </p>
            </div>
            <div className="rr-card rr-card--surface">
              <h2 className="rr-sub" style={{ marginBottom: 14 }}>Tempo & Technik</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Modern gebaut, schnell geladen, sauber auf jedem Gerät. Geschwindigkeit ist auch ein Ranking-Faktor.
              </p>
            </div>
            <div className="rr-card rr-card--surface">
              <h2 className="rr-sub" style={{ marginBottom: 14 }}>Auf Anfragen gebaut</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Jede Seite hat ein Ziel: Anruf oder Anfrage. Wege dorthin bauen wir klar und ohne Umwege ein.
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
              <p className="rr-sub">Am Ende steht kein Poster, sondern ein Werkzeug.</p>
            </div>
            <ul className="rr-check">
              <li>Individuelles Design, auf deinen Betrieb zugeschnitten</li>
              <li>Sauber auf Handy, Tablet und Desktop</li>
              <li>Schnelle Ladezeiten und moderne Technik</li>
              <li>Klare Wege zu Anruf und Kontaktformular</li>
              <li>DSGVO-konforme Umsetzung</li>
              <li>Den ersten Entwurf ohne Vorkasse</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <p className="rr-eyebrow" style={{ marginBottom: 12 }}>Häufige Fragen</p>
          <Faq items={faq} id="faq-webdesign" />
        </div>
      </section>
    </PageShell>
  );
}
