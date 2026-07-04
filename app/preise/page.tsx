import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/relaunch/PageShell";
import Faq from "@/components/relaunch/Faq";

export const metadata: Metadata = {
  title: "Preise | Red Rabbit Media",
  description:
    "Klare Pakete ab 950 Euro. Den Entwurf siehst du zuerst, ganz ohne Vorkasse. Dashboard ab dem Business-Paket gratis, Betreuung ohne Bindung, KMU.DIGITAL-foerderbar.",
  alternates: { canonical: "https://web.redrabbit.media/preise" },
};

type Pkg = {
  name: string;
  price: string;
  priceNote?: string;
  tagline: string;
  features: string[];
  featured?: boolean;
};

const packages: Pkg[] = [
  {
    name: "Starter",
    price: "950 €",
    tagline: "Der faire Einstieg fuer alle, die schlank und schnell online wollen.",
    features: [
      "Einseitige Website (One-Pager)",
      "Individuelles Design, kein Baukasten",
      "Sauber auf Handy, Tablet und Desktop",
      "Kontaktformular und Anruf-Wege",
      "SEO-Grundlagen eingebaut",
      "DSGVO-konforme Umsetzung",
    ],
  },
  {
    name: "Business",
    price: "2.900 €",
    tagline: "Die solide Website fuer Betriebe, die gefunden werden wollen.",
    featured: true,
    features: [
      "Mehrseitige Website",
      "Alles aus dem Starter-Paket",
      "Erweiterte SEO-Basis und lokale Sichtbarkeit",
      "Dashboard gratis dabei",
      "Struktur fuer Anfragen und Conversion",
    ],
  },
  {
    name: "Premium",
    price: "ab 4.900 €",
    tagline: "Das Flaggschiff, wenn deine Website wirklich arbeiten soll.",
    features: [
      "Umfangreiche, individuell gebaute Website",
      "Performance- und Conversion-Aufbau",
      "SEO- und KI-Sichtbarkeits-Fundament",
      "Anbindung an Content und KI-Artikel",
      "Dashboard inklusive",
      "Persoenliche Begleitung mit Prioritaet",
    ],
  },
];

const faq = [
  {
    q: "Warum seht ihr den Entwurf ohne Vorkasse?",
    a: "Weil wir das Risiko tragen wollen, nicht du. Du siehst zuerst einen echten Vorschlag. Eine Anzahlung faellt erst an, wenn dir das Ergebnis gefaellt und du den Auftrag erteilst.",
  },
  {
    q: "Sind das Fixpreise oder kommt noch etwas dazu?",
    a: "Die Pakete geben dir einen klaren Rahmen. Was genau du brauchst, besprechen wir vorher und halten es fest. Keine Stundensatz-Lotterie, keine versteckten Kosten.",
  },
  {
    q: "Was bedeutet 'ab 4.900' beim Premium-Paket?",
    a: "Premium ist massgeschneidert. Der Preis haengt vom Umfang ab. 4.900 Euro ist der Einstieg, den genauen Preis nennen wir dir nach einem kurzen Gespraech.",
  },
  {
    q: "Gibt es eine Foerderung?",
    a: "Fuer oesterreichische Kleinbetriebe kann die KMU.DIGITAL-Foerderung einen Teil der Kosten uebernehmen. Wir sagen dir, ob das fuer dich in Frage kommt.",
  },
];

export default function PreisePage() {
  return (
    <PageShell
      eyebrow="Preise"
      title="Klare Pakete. Kein Risiko bis zur Zusage."
      intro="Drei Pakete, ein Prinzip: Du weisst vorher, woran du bist. Den ersten Entwurf siehst du, ohne einen Cent Vorkasse. Erst wenn er dir gefaellt und du zusagst, faellt eine Anzahlung an."
    >
      {/* Risiko-USP prominent */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <div
            className="rr-card"
            style={{ background: "var(--rr-surface)", borderColor: "transparent", display: "grid", gap: 16 }}
          >
            <p className="rr-eyebrow">Dein Risiko: null</p>
            <p className="rr-statement">Erst ueberzeugt, dann bezahlt.</p>
            <p className="rr-body-lg" style={{ color: "var(--rr-ink-soft)", maxWidth: 760 }}>
              Du bekommst zuerst einen echten Entwurf zu sehen, ohne Vorkasse. Gefaellt er dir und du erteilst den
              Auftrag, faellt eine Anzahlung an. Bis dahin liegt das Risiko bei uns, nicht bei dir.
            </p>
          </div>
        </div>
      </section>

      {/* Pakete */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <div className="rr-price-grid">
            {packages.map((p) => (
              <div key={p.name} className={`rr-price-card${p.featured ? " rr-price-card--featured" : ""}`}>
                {p.featured ? <span className="rr-price-badge">Beliebteste Wahl</span> : null}
                <div>
                  <p className="rr-eyebrow" style={{ color: "var(--rr-ink)", marginBottom: 12 }}>{p.name}</p>
                  <p className="rr-sub">{p.price}</p>
                  {p.priceNote ? (
                    <p className="rr-meta" style={{ marginTop: 6 }}>{p.priceNote}</p>
                  ) : null}
                </div>
                <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>{p.tagline}</p>
                <ul className="rr-check">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="rr-price-foot">
                  <Link
                    className={`rr-btn ${p.featured ? "rr-btn--primary" : "rr-btn--secondary"}`}
                    href="/kontakt"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {p.name} anfragen
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="rr-meta" style={{ marginTop: 24, maxWidth: 760 }}>
            Grosse oder besondere Projekte, etwa Shops oder Sonderfunktionen, planen wir individuell. Sprich uns
            einfach an, dann finden wir den passenden Rahmen.
          </p>
        </div>
      </section>

      {/* Abo + KMU.DIGITAL */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <div className="rr-grid rr-grid-2">
            <div className="rr-card">
              <p className="rr-eyebrow" style={{ marginBottom: 14 }}>Betreuung</p>
              <h2 className="rr-sub" style={{ marginBottom: 16 }}>Wartungs-Abo ohne Bindung</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Wenn du willst, halten wir deine Seite laufend aktuell und sichtbar. Ohne Mindestlaufzeit, jederzeit
                kuendbar. Wir halten dich mit Leistung, nicht mit einem Vertrag.
              </p>
            </div>
            <div className="rr-card">
              <p className="rr-eyebrow" style={{ marginBottom: 14 }}>Foerderung</p>
              <h2 className="rr-sub" style={{ marginBottom: 16 }}>KMU.DIGITAL kann mitzahlen</h2>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
                Fuer oesterreichische Kleinbetriebe kann die KMU.DIGITAL-Foerderung einen Teil der Kosten
                uebernehmen. Wir pruefen mit dir, ob das fuer dein Projekt in Frage kommt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <p className="rr-eyebrow" style={{ marginBottom: 12 }}>Haeufige Fragen zu Preis und Ablauf</p>
          <Faq items={faq} id="faq-preise" />
        </div>
      </section>
    </PageShell>
  );
}
