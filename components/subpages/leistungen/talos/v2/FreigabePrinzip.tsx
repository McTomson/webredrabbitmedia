/**
 * Freigabe-Prinzip — Copy aus docs/specs/TALOS_COPY_V2_2026-07-22_ENTWURF.md,
 * Sektion 5, inklusive der Kurz-Klaerung "Und wenn er einen Fehler macht?"
 * als eingerueckter Block.
 */
export default function FreigabePrinzip() {
  return (
    /* Sticky-Szene: Track 180vh, Inhalt bleibt einen Moment stehen (lesbar,
       und der Companion-Talos hat Zeit fuer seine Verbeugung). Grund bewusst
       TRANSPARENT: Talos laeuft hier auf der "back"-Ebene HINTER dem Text. */
    <section className="rr-section tl-section tl-sticky-track">
      <div className="tl-sticky">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Du hast das Sagen</p>
        <h2 className="rr-statement tl-title">
          Nichts verlässt dein Haus, ohne dass du es freigibst.
        </h2>
        <p className="rr-body-lg tl-lead">
          Alles, was Talos vorbereitet, eine Antwort auf eine Anfrage, ein
          Text, ein Beitrag, landet zuerst als Entwurf bei dir. Du findest ihn
          in deinem Dashboard, liest in Ruhe drüber, änderst jedes Wort, das
          dir nicht passt, und klickst dann auf Senden. Erst mit diesem Klick
          geht etwas raus, vorher passiert nach außen nichts. Willst du bei
          einer bestimmten Aufgabe nicht mehr jedes Mal gefragt werden, stellst
          du genau diese eine Aufgabe auf Selbstlauf. Dann erledigt Talos sie
          von allein, während alle anderen Aufgaben weiter auf deine Freigabe
          warten. Und wenn dir der Selbstlauf doch nicht passt, drehst du ihn
          mit einem Klick wieder zurück, ohne dass du irgendwo anrufen oder
          etwas umbauen musst.
        </p>

        <div className="tl-klaerung">
          <p className="tl-klaerung__frage">Und wenn er einen Fehler macht?</p>
          <p className="tl-klaerung__text">
            Weil kein Entwurf ohne dein Ja rausgeht, fällt dir jeder Fehler
            schon im Dashboard auf, bevor ihn ein Kunde zu sehen bekommt. Du
            korrigierst ihn direkt im Entwurf oder verwirfst ihn ganz. Und wo
            du eine Aufgabe auf Selbstlauf gestellt hast, läuft sie nicht im
            Verborgenen. Jeder Schritt wird in deinem Dashboard mitgeschrieben,
            sodass du jederzeit nachlesen kannst, was Talos getan hat, und die
            Aufgabe mit einem Klick wieder anhältst, sobald dir etwas komisch
            vorkommt.
          </p>
        </div>

        <p className="tl-says">Ein Klick von dir genügt. Und du kannst mich jederzeit bremsen.</p>
      </div>
      </div>
    </section>
  );
}
