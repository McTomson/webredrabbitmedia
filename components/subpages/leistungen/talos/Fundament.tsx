/**
 * Abschnitt 2 — "Das Fundament" (in jeder Website inklusive). rr-card-soft-
 * Grid (echte Klasse aus styleguide.css), alle --neutral, weil vier Punkte
 * derselben Kategorie gezeigt werden (UNTERSEITEN_STIL.md §5). Copy 1:1
 * aus leistungen-copy.md Abschnitt C.2.
 */
const PUNKTE: { label: string; text: string }[] = [
  {
    label: "Zahlen in Klartext",
    text: "Du siehst, wie viele Leute auf deiner Seite waren, woher sie kamen und wonach sie gesucht haben. In normaler Sprache, nicht in Fachbegriffen.",
  },
  {
    label: "Uptime-Wache",
    text: "Fällt deine Seite mal aus, merken wir es sofort und kümmern uns. Meist noch bevor es dir überhaupt auffällt.",
  },
  {
    label: "Speed-Report",
    text: "Einmal im Monat prüfen wir, ob deine Seite schnell genug lädt. Langsame Seiten verlieren Kunden, das lassen wir nicht zu.",
  },
  {
    label: "Selbst ändern",
    text: "Neuer Text, neues Foto, geänderte Öffnungszeiten? Machst du selbst mit ein paar Klicks. Kein Anruf bei der Agentur nötig.",
  },
];

export default function Fundament() {
  return (
    <section className="rr-section lt-substance">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">In jeder Website schon drin</p>
        <h2 className="rr-statement lt-fundament__title">
          Das Grundgerüst bekommst du geschenkt, weil es einfach dazugehört.
        </h2>
        <div className="lt-card-grid">
          {PUNKTE.map((p) => (
            <div key={p.label} className="rr-card-soft rr-card-soft--neutral">
              <p className="rr-card-soft__label">{p.label}</p>
              <p className="rr-card-soft__body">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="rr-body lt-fundament__outro">
          Das löst ein Versprechen ein, das viele geben und keiner hält. Bei
          uns ist es der Standard.
        </p>
      </div>
    </section>
  );
}
