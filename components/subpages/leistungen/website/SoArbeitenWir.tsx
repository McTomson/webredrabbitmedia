import { REVIEWS, hasRealRating } from "@/lib/reviews";

/**
 * Abschnitt (neu) — Vertrauens-Moment: EIN ehrlicher Satz "so arbeiten wir mit
 * Betrieben wie deinem" plus EINE echte Google-Rezension im Teal-Panel
 * (rr-quote, Signatur-Moment). Das ist bewusst der EINZIGE farbige Moment
 * dieser Seite. Nur echte Rezension (Rafael Danesh, Wortlaut 1:1 wie in
 * components/subpages/leistungen/Referenzen.tsx), Gold-Sterne (#f4b400),
 * Zahlen aus lib/reviews.ts. Dmitry Pashlov ist Team, NIE als Kundenstimme.
 * Keine erfundenen Zahlen. DU-Anrede, kein "KI"/"AI"-Wort, kein Gedankenstrich.
 */
export default function SoArbeitenWir() {
  const real = hasRealRating();
  const ratingLabel =
    REVIEWS.rating != null ? REVIEWS.rating.toFixed(1).replace(".", ",") : null;

  return (
    <section className="rr-section lw-arbeit">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">Wie wir arbeiten</p>
        <h2 className="rr-statement lw-arbeit__title">
          So läuft das mit Betrieben wie deinem.
        </h2>
        <p className="rr-body-lg lw-arbeit__body">
          Du erzählst, was du brauchst, wir bauen den Entwurf, du entscheidest in
          Ruhe. Kein Fachchinesisch, kein Druck. Und wir sind ehrlich: wir sind
          kein Großkonzern und haben keine hundert Bewertungen.
          {real && ratingLabel && (
            <>
              {" "}
              Aber die, die es gibt, stehen echt bei Google, {ratingLabel}{" "}
              Sterne, keine davon erfunden.
            </>
          )}
        </p>

        {/* Der EINE Teal-Moment der Seite: ein echtes Zitat im Signatur-Panel. */}
        <figure className="rr-quote lw-arbeit__quote">
          <p className="rr-quote__mark" aria-hidden="true">
            &ldquo;
          </p>
          <blockquote className="rr-quote__text">
            Für unsere beiden Firmen wurden zwei Webseiten erstellt. Die
            Zusammenarbeit war äußerst präzise, auf all unsere Wünsche wurde
            detailliert eingegangen, und wir sind mit den Ergebnissen sehr
            zufrieden! Danke!
          </blockquote>
          <figcaption className="rr-quote__attr">
            <span className="rr-quote__name">Rafael Danesh</span>
            <span
              className="rr-quote__stars"
              style={{ color: "#f4b400" }}
              aria-label="5 von 5 Sternen"
            >
              ★★★★★
            </span>
            <span className="rr-quote__src">Verifizierte Google-Rezension</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
