/**
 * Facette 3 von 3 — "Gestaltung, die Anfragen bringt": warum gutes Design
 * nicht Deko ist, sondern verkauft (klare Nutzerfuehrung, der Besucher findet
 * sofort, was er sucht, und meldet sich). Fachbegriffe werden erklaert, nicht
 * als nacktes Kuerzel stehen gelassen (Laien-Sprache). Prosa-Muster wie
 * WasEntsteht/DeineSeite, plus eine kurze bordered List "so fuehrt eine gute
 * Seite" im rr-stagger-Container (Reveal aus styleguide.css). Keine Farbe
 * (der EINE Teal-Moment bleibt SoArbeitenWir). DU-Anrede, echte Umlaute, kein
 * "KI"/"AI"-Wort, kein Gedankenstrich, kein Preis, nur h2.
 */
const FUEHRUNG: string[] = [
  "In Sekunden ist klar, was du machst und für wen.",
  "Der Weg zum Anrufen oder Schreiben ist immer nur einen Blick entfernt.",
  "Das Wichtige steht oben, der Rest stört nicht.",
  "Am Handy liest und drückt es sich genauso leicht wie am großen Bildschirm.",
];

export default function FacetteDesign() {
  return (
    <section className="rr-section lw-design">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">Gestaltung, die Anfragen bringt</p>
        <h2 className="rr-statement lw-design__title">
          Gutes Design ist keine Deko. Es ist der Unterschied zwischen
          anschauen und anrufen.
        </h2>
        <p className="rr-body-lg lw-design__body">
          Design heißt bei uns nicht nur, dass es hübsch ist. Es heißt, dass ein
          Besucher in Sekunden findet, was er sucht, und weiß, was er als
          Nächstes tun soll. Wo drückt man, um anzurufen. Wo stehen die
          Öffnungszeiten. Warum sollte man dich nehmen und nicht den Nächsten.
          Ist das klar geführt, bleibt der Besucher, liest weiter und meldet
          sich. Ist es unklar, klickt er weg, egal wie schön es aussieht.
          Fachleute nennen diese Nutzerführung Usability. Für dich heißt es
          einfach: Die Seite nimmt deinen Kunden an die Hand, statt ihn raten zu
          lassen.
        </p>

        <ul className="rr-stagger lw-design__list">
          {FUEHRUNG.map((f) => (
            <li key={f} className="lw-design__item">
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
