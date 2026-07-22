/**
 * Inklusive-Sektion — Copy aus docs/specs/TALOS_COPY_V2_2026-07-22_ENTWURF.md,
 * Sektion 3. Die 4 Basis-Bullets als 2x2-Karten-Grid (Titel fett + 2 Zeilen
 * Text), darunter die Talos-Sprechzeile.
 */
const PUNKTE = [
  {
    titel: 'Alles selbst ändern.',
    text: 'Texte und Bilder tauschst du in deinem Dashboard selbst, einfacher als bei WordPress. Kein Anruf bei uns, kein Warten.',
  },
  {
    titel: 'Deine Zahlen in Klartext.',
    text: 'Wie oft du gefunden wirst, wo die Leute klicken, was funktioniert. In verständlicher Sprache statt Fachchinesisch, mit Google Search Console, Heatmap und weiteren Gratis-Anschlüssen.',
  },
  {
    titel: 'Alarm, bevor du es merkst.',
    text: 'Fällt die Seite aus oder klemmt etwas, bekommst du eine Mail. Du erfährst es von uns, nicht von deinen Kunden.',
  },
  {
    titel: 'Hosting, Pflege und Updates laufen mit.',
    text: 'Im Hintergrund, ohne dass du dich darum kümmern musst. Deine Seite bleibt schnell und sicher.',
  },
];

export default function InklusiveDashboard() {
  return (
    <section className="rr-section tl-section tl-section--surface">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Bei jeder Website dabei</p>
        <h2 className="rr-statement tl-title">
          Das kann jede Website von uns. Ohne Aufpreis.
        </h2>
        <p className="rr-body-lg tl-lead">
          Bevor du auch nur an einen einzigen Zusatz denkst: das hier ist alles
          schon drin, in jeder Seite, die wir bauen. Fest im Preis, den du
          vorher kennst.
        </p>

        <div className="tl-dash-grid">
          {PUNKTE.map((p) => (
            <div className="tl-dash-card" key={p.titel}>
              <p className="tl-dash-card__titel">{p.titel}</p>
              <p className="tl-dash-card__text">{p.text}</p>
            </div>
          ))}
        </div>

        <p className="tl-says">Das ist die Grundausstattung. Dafür zahlst du keinen Cent extra.</p>
      </div>
    </section>
  );
}
