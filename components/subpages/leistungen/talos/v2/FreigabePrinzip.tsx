/**
 * Freigabe-Prinzip — Copy aus docs/specs/TALOS_COPY_V2_2026-07-22_ENTWURF.md,
 * Sektion 5, inklusive der Kurz-Klaerung "Und wenn er einen Fehler macht?"
 * als eingerueckter Block.
 */
export default function FreigabePrinzip() {
  return (
    <section className="rr-section tl-section tl-section--surface">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Du hast das Sagen</p>
        <h2 className="rr-statement tl-title">
          Nichts verlässt dein Haus, ohne dass du es freigibst.
        </h2>
        <p className="rr-body-lg tl-lead">
          Alles, was Talos vorbereitet, landet zuerst bei dir als Entwurf. Du
          liest drüber, änderst, was du willst, und klickst auf Senden. Erst
          dann geht etwas raus. Willst du bei einer bestimmten Aufgabe nicht
          mehr jedes Mal gefragt werden, stellst du genau diese auf Selbstlauf.
          Und wenn dir das doch nicht passt, drehst du es mit einem Klick
          wieder zurück.
        </p>

        <div className="tl-klaerung">
          <p className="tl-klaerung__frage">Und wenn er einen Fehler macht?</p>
          <p className="tl-klaerung__text">
            Weil nichts ohne dein Ja rausgeht, fällt dir jeder Fehler auf,
            bevor ihn ein Kunde sieht. Und wo du eine Aufgabe auf Selbstlauf
            gestellt hast, siehst du in deinem Dashboard mit, was passiert,
            und kannst sie jederzeit wieder anhalten.
          </p>
        </div>

        <p className="tl-says">Ein Klick von dir genügt. Und du kannst mich jederzeit bremsen.</p>
      </div>
    </section>
  );
}
