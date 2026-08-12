/**
 * Abschnitt 4 — "Ein ganz normaler Arbeitstag": konkrete Szene als
 * Zeitleiste (eigenes, einfaches lt-timeline-Muster aus rr-body/rr-ink,
 * keine Nachbau-Komponente aus dem Design-System noetig, weil es dafuer
 * kein rr-*-Bauteil gibt). Copy 1:1 aus leistungen-copy.md Abschnitt C.4.
 */
const SZENE: { zeit: string; text: string }[] = [
  {
    zeit: "7:40 Uhr",
    text: "Du bist auf der Baustelle. Eine Anfrage von letzter Nacht ist schon beantwortet und liegt geordnet in deinem Dashboard.",
  },
  {
    zeit: "11:15 Uhr",
    text: "Ein Kunde bucht online einen Termin. Er landet direkt in deinem Kalender, ohne dass dein Handy einmal klingelt.",
  },
  {
    zeit: "14:30 Uhr",
    text: "Jemand hat vor drei Tagen angefragt und sich nicht mehr gemeldet. Talos hat freundlich nachgefasst, der Kunde ist wieder dran.",
  },
  {
    zeit: "18:00 Uhr",
    text: "Feierabend. Ein neuer Artikel liegt fertig zur Freigabe vor. Du liest ihn kurz, ein Klick, er ist online.",
  },
];

export default function Arbeitstag() {
  return (
    <section className="rr-section lt-substance">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">Ein Dienstag, den du nicht mitbekommst</p>
        <h2 className="rr-statement lt-arbeitstag__title">
          Während du arbeitest, arbeitet Talos mit.
        </h2>
        <ul className="lt-timeline">
          {SZENE.map((s) => (
            <li key={s.zeit} className="lt-timeline__item">
              <p className="lt-timeline__time">{s.zeit}</p>
              <p className="rr-body lt-timeline__text">{s.text}</p>
            </li>
          ))}
        </ul>
        <p className="rr-body lt-arbeitstag__outro">
          Du hast den ganzen Tag nichts davon gemerkt. Genau das ist der
          Punkt.
        </p>
      </div>
    </section>
  );
}
