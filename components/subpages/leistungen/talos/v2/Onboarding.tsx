/**
 * Onboarding — "So zieht Talos bei dir ein", 3 Schritte nach dem Auftrag
 * (buchen, Kennenlernen, er legt los).
 */
const SCHRITTE = [
  {
    titel: 'Du buchst.',
    text: 'Du wählst die Website und die Fähigkeiten, die zu deinem Betrieb passen.',
  },
  {
    titel: 'Kennenlernen.',
    text: 'Talos fragt nach Textbeispielen, deiner Sprache und deinem Ton, damit alles in deiner Art entsteht.',
  },
  {
    titel: 'Er legt los.',
    text: 'Ab jetzt arbeitet Talos für dich, Entwürfe kommen zur Freigabe oder laufen selbstständig.',
  },
];

export default function Onboarding() {
  return (
    <section className="rr-section tl-section">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">So läuft der Start ab</p>
        <h2 className="rr-statement tl-title">So zieht Talos bei dir ein.</h2>

        <div className="tl-steps">
          {SCHRITTE.map((s, i) => (
            <div className="tl-step" key={s.titel}>
              <p className="tl-step__num">0{i + 1}</p>
              <p className="tl-step__title">{s.titel}</p>
              <p className="tl-step__text">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
