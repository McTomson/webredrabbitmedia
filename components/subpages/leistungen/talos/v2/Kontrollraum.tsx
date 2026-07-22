/**
 * Kontrollraum — Copy aus docs/specs/TALOS_COPY_V2_2026-07-22_ENTWURF.md,
 * Sektion 7. 6 Panels: 3 Basis (Tag "Immer an") + 3 gebuchte Beispiele (Tag
 * "Gebucht · <Name>"). Panel-Zeilen 1:1 aus der Spec uebernommen.
 */
const BASIS = [
  { label: 'Seite läuft, alles schnell und erreichbar.' },
  { label: 'Deine Zahlen werden mitgeschrieben, jederzeit abrufbar in Klartext.' },
  { label: 'Wächter aktiv, meldet sich sofort, falls etwas klemmt.' },
];

const GEBUCHT = [
  { name: 'Der Schreiber', text: 'Nächster Beitrag liegt fertig zur Freigabe bereit.' },
  { name: 'Der Empfang', text: 'Anfrage von heute Mittag aufgefangen, Antwort wartet auf dein Ja.' },
  { name: 'Der Sichtbarmacher', text: 'Arbeitet daran, dass dich mehr Leute finden.' },
];

export default function Kontrollraum() {
  return (
    <section className="rr-section tl-section tl-section--surface">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Der Kontrollraum</p>
        <h2 className="rr-statement tl-title">
          Was gerade alles für dich läuft, während du etwas anderes machst.
        </h2>
        <p className="rr-body-lg tl-lead">
          Talos arbeitet nicht der Reihe nach, sondern an vielem gleichzeitig,
          Tag und Nacht. Die Grundausstattung läuft immer. Was du dazubuchst,
          schaltet sich zusätzlich ein.
        </p>

        <div className="tl-cards">
          {BASIS.map((w) => (
            <div className="tl-card" key={w.label}>
              <span className="tl-panel__status tl-panel__status--basis">Immer an</span>
              <p className="tl-card__text">{w.label}</p>
            </div>
          ))}
          {GEBUCHT.map((g) => (
            <div className="tl-card tl-card--booked" key={g.name}>
              <span className="tl-panel__status tl-panel__status--booked">
                <span className="tl-panel__dot" aria-hidden="true" />
                Gebucht · {g.name}
              </span>
              <p className="tl-card__text">{g.text}</p>
            </div>
          ))}
        </div>

        <p className="tl-says">Was du eingeschaltet hast, leuchtet. Der Rest bleibt einfach dunkel.</p>
      </div>
    </section>
  );
}
