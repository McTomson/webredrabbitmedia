/**
 * Inklusive Dashboard — was ohne Aufpreis in jeder Website steckt. Fakten
 * 1:1 aus dem Auftrag (Thomas, 22.07.), nicht aus der Spec-Datei (die hat
 * abweichende Bullets, hier gilt die aktuellere Vorgabe).
 */
const PUNKTE = [
  'Texte und Bilder änderst du selbst, ganz ohne uns anzurufen.',
  'Dein Dashboard zeigt deine eigenen Zahlen (Search Console, Heatmap) in Klartext statt Fachchinesisch.',
  'Fällt deine Seite aus, bekommst du einen Ausfall-Alarm per Mail, bevor du es selbst merkst.',
  'Hosting, Pflege und Updates laufen einfach mit.',
];

export default function InklusiveDashboard() {
  return (
    <section className="rr-section tl-section tl-section--surface">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">In jeder Website drin</p>
        <h2 className="rr-statement tl-title">
          Das kann jede Website von uns. Ohne Aufpreis.
        </h2>
        <ul className="tl-list">
          {PUNKTE.map((p) => (
            <li className="tl-list__item" key={p}>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
