/**
 * VorherNachher — "Der Unterschied im Alltag" (Thomas 07.08.): gleicher
 * Betrieb, zwei Spalten (Bisher / Mit Talos). Macht das Life-Changer-Argument
 * fuehlbar, ohne Fachwoerter. Server Component, statisch, Muster = zwei
 * Fugen-Spalten wie tl-modes, Styles .tl-vn-* in talos-v2.css.
 */
const BISHER = [
  'Website ist online. Was sie bringt? Keine Ahnung.',
  'Preisänderung: E-Mail an die Agentur, warten, Rechnung.',
  'Eine Bewertung von vor drei Wochen. Nie gesehen.',
  'Seite war einen halben Tag weg. Ein Kunde hat es gesagt.',
  'Ob Google dich findet? Man hofft es.',
];

const MIT_TALOS = [
  'Ein Blick am Morgen: so viele Besucher, daher kamen sie.',
  'Preisänderung: selbst gemacht, zwei Minuten, keine Rechnung.',
  'Neue Bewertung: sofort gemeldet, freundlich beantwortet.',
  'Seite hakt: Talos schlägt Alarm, bevor es jemand merkt.',
  'Google und ChatGPT: du weißt, wo du stehst.',
];

export default function VorherNachher() {
  return (
    <section className="rr-section tl-section tl-section--surface" data-rr-snap>
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Der Unterschied im Alltag</p>
        <h2 className="rr-statement tl-title">
          Gleicher Betrieb. Anderes Gefühl.
        </h2>

        <div className="tl-vn__grid">
          <div className="tl-vn__col">
            <p className="tl-vn__tag">Bisher</p>
            <ul className="tl-vn__list">
              {BISHER.map((z) => (
                <li key={z} className="tl-vn__item">
                  {z}
                </li>
              ))}
            </ul>
          </div>
          <div className="tl-vn__col">
            <p className="tl-vn__tag tl-vn__tag--after">Mit Talos</p>
            <ul className="tl-vn__list">
              {MIT_TALOS.map((z) => (
                <li key={z} className="tl-vn__item tl-vn__item--after">
                  {z}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
