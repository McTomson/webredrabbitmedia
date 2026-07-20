import Link from "next/link";

/**
 * Sektion 7 — "Mehr als eine normale Website": kompakter Vergleich, Zeit
 * statt Geld (IA-Doc: keine Angeber-Vergleichstabelle). Nur echte rr-*-
 * Bausteine (rr-grid, rr-card, rr-check). Schliesst mit einem Wegweiser auf
 * die Website-Unterseite (Produkt-Tiefe), damit der Hub nicht Sackgasse ist.
 */
const NORMAL: string[] = [
  "Steht da und wartet, dass du selbst was tust.",
  "Anfragen liegen bis zum nächsten Werktag, wenn überhaupt.",
  "Ändern willst du was? Erst mal die Agentur anschreiben und warten.",
  "Ob sie was bringt, siehst du nie.",
];

const MIT_TALOS: string[] = [
  "Arbeitet mit, auch nachts und am Wochenende.",
  "Anfragen werden erfasst und beantwortet, während du was anderes tust.",
  "Texte und Bilder änderst du selbst, mit ein paar Klicks.",
  "Du siehst in Klartext, was läuft und was reinkommt.",
];

export default function MehrAlsWebsite() {
  return (
    <section className="rr-section lh-vergleich">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">Der Unterschied in Zeit gerechnet</p>
        <h2 className="rr-statement lh-vergleich__title">
          Eine normale Website kostet dich Zeit. Deine spart dir welche.
        </h2>
        <div className="rr-grid rr-grid-2 lh-vergleich__grid">
          <div className="rr-card">
            <p className="rr-eyebrow" style={{ marginBottom: 16 }}>
              Eine normale Website
            </p>
            <ul className="rr-check">
              {NORMAL.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="rr-card rr-card--surface">
            <p className="rr-eyebrow" style={{ marginBottom: 16 }}>
              Deine Website mit Talos
            </p>
            <ul className="rr-check">
              {MIT_TALOS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="rr-body lh-vergleich__closing">
          Kein Abo-Zwang, keine versteckten Stundensätze. Fang mit der
          Website an, hol dir mehr dazu, wenn du es brauchst.
        </p>
        <p className="lh-vergleich__more">
          <Link href="/relaunch-preview/leistungen/website" className="rr-link">
            Alles zur Website im Detail
          </Link>
        </p>
      </div>
    </section>
  );
}
