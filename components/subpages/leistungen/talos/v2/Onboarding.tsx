/**
 * Onboarding — Copy aus docs/specs/TALOS_COPY_V2_2026-07-22_ENTWURF.md,
 * Sektion 6, 3 Schritte als nummerierte Reihe.
 */
const SCHRITTE = [
  {
    titel: 'Du buchst.',
    text: 'Du entscheidest, welche Fähigkeit du dazunimmst. Das geht in Minuten und ohne langes Hin und Her.',
  },
  {
    titel: 'Ihr lernt euch kennen.',
    text: 'Talos fragt dich nach ein paar Textbeispielen, nach deiner Sprache und deinem Ton, und lernt, wie dein Betrieb tickt.',
  },
  {
    titel: 'Er legt los.',
    text: 'Ab da entsteht alles in deiner Art, so als hättest du es selbst gemacht. Nur dass du es nicht musst.',
  },
];

export default function Onboarding() {
  return (
    <section className="rr-section tl-section">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">So zieht Talos ein</p>
        <h2 className="rr-statement tl-title">
          In drei Schritten ist Talos ein Teil deines Betriebs.
        </h2>
        <p className="rr-body-lg tl-lead">
          Kein großes Projekt, kein Aufwand für dich. Talos arbeitet sich
          selbst ein.
        </p>

        <div className="tl-steps">
          {SCHRITTE.map((s, i) => (
            <div className="tl-step" key={s.titel}>
              <p className="tl-step__num">0{i + 1}</p>
              <p className="tl-step__title">{s.titel}</p>
              <p className="tl-step__text">{s.text}</p>
            </div>
          ))}
        </div>

        <p className="tl-says">Gib mir ein paar Beispiele von dir, dann klinge ich wie du.</p>
      </div>
    </section>
  );
}
