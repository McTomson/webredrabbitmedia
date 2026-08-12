/**
 * KennstDuDas — Einfuehlungs-Einstieg direkt nach dem Hero (Thomas 07.08.):
 * Der Besucher weiss noch nicht, was Talos ist. Bevor die Seite erklaert,
 * was er bekommt, muss er sich wiedererkennen. Fuenf Alltags-Fragen als
 * Serif-Zeilen (Marken-Muster: Crimson-Statements mit rotem Punkt-Marker),
 * danach die Ueberleitung "genau damit ist jetzt Schluss".
 *
 * Server Component, statisch, Styles .tl-kd-* in talos-v2.css.
 */
const FRAGEN = [
  'War heute überhaupt jemand auf meiner Seite?',
  'Warum ruft niemand an, obwohl die Seite so schön ist?',
  'Für ein geändertes Wort soll ich die Agentur anrufen. Und zahlen.',
  'Ob mich Google überhaupt findet? Keine Ahnung.',
  'Wenn die Seite ausfällt, merke ich es als Letzter.',
];

export default function KennstDuDas() {
  return (
    <section className="rr-section tl-section tl-section--surface" data-rr-snap>
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Kennst du das?</p>
        <h2 className="rr-statement tl-title">
          Du hast eine Website. Aber du weißt nichts über sie.
        </h2>

        <ul className="tl-kd__list">
          {FRAGEN.map((f) => (
            <li key={f} className="tl-kd__item">
              {f}
            </li>
          ))}
        </ul>

        <p className="rr-body-lg tl-lead tl-kd__close">
          So geht es fast jedem Betrieb. Die Website ist da, aber sie ist eine
          verschlossene Kiste. Man zahlt dafür und hofft, dass sie etwas
          bringt. <strong>Genau damit ist jetzt Schluss.</strong>
        </p>
      </div>
    </section>
  );
}
