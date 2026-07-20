import { REVIEWS, hasRealRating } from "@/lib/reviews";

/**
 * Sektion 6 — Referenzen: EIN Teal-Moment (canonical: der eine Farb-Moment der
 * Seite). Beide echten Google-Rezensionen liegen in EINEM Teal-Panel (Hairline
 * trennt sie), nicht in zwei getrennten Teal-Bloecken. Gold-Sterne (#f4b400).
 * Nur echte Rezensionen: Rafael Danesh + Rene Rohrer (Wortlaut 1:1). Dmitry
 * Pashlov NICHT als Kundenzitat (Team-Mitglied). Zahlen aus lib/reviews.ts.
 */
export default function Referenzen() {
  const real = hasRealRating();
  const ratingLabel = REVIEWS.rating != null ? REVIEWS.rating.toFixed(1).replace(".", ",") : null;

  return (
    <section className="rr-section lh-referenzen">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">Was Kunden sagen</p>
        {real && (
          <p className="rr-meta lh-referenzen__meta">
            Wir sind kein Großkonzern und haben keine hundert Bewertungen. Aber
            die, die es gibt, stehen echt bei Google. {ratingLabel} Sterne aus{" "}
            {REVIEWS.reviewCount} Rezensionen, keine davon erfunden.
          </p>
        )}

        {/* EIN Teal-Panel, zwei echte Zitate. */}
        <div className="rr-quote lhref-panel">
          <p className="rr-quote__mark" aria-hidden="true">&ldquo;</p>

          <figure className="lhref-q">
            <blockquote className="rr-quote__text">
              Für unsere beiden Firmen wurden zwei Webseiten erstellt. Die
              Zusammenarbeit war äußerst präzise, auf all unsere Wünsche wurde
              detailliert eingegangen, und wir sind mit den Ergebnissen sehr
              zufrieden! Danke!
            </blockquote>
            <figcaption className="rr-quote__attr">
              <span className="rr-quote__name">Rafael Danesh</span>
              <span className="rr-quote__stars" style={{ color: "#f4b400" }} aria-label="5 von 5 Sternen">
                ★★★★★
              </span>
              <span className="rr-quote__src">Verifizierte Google-Rezension</span>
            </figcaption>
          </figure>

          <hr className="lhref-divider" aria-hidden="true" />

          <figure className="lhref-q">
            <blockquote className="rr-quote__text">
              Ich bin von der Firma begeistert, vor allem von der Umsetzung. Ein
              Lob an Herrn Uhlir, der mich durch die Zeit der Umsetzung begleitet
              hat. Vielen lieben Dank. 100 Prozent Empfehlung.
            </blockquote>
            <figcaption className="rr-quote__attr">
              <span className="rr-quote__name">Rene Rohrer</span>
              <span className="rr-quote__stars" style={{ color: "#f4b400" }} aria-label="5 von 5 Sternen">
                ★★★★★
              </span>
              <span className="rr-quote__src">Verifizierte Google-Rezension</span>
            </figcaption>
          </figure>
          {/* {{TODO: drittes echtes Zitat mit vollem Wortlaut ergänzen, sobald
              auf dem Google-Profil verfügbar. Dmitry Pashlov NICHT verwenden
              (Teammitglied, kein Kunde).}} */}
        </div>
      </div>

      <style>{`
.rr .lhref-panel .rr-quote__text { font-size: clamp(22px, 3vw, 34px); margin: 0 0 24px; }
.rr .lhref-q { margin: 0; }
.rr .lhref-divider {
  border: 0; height: 1px; background: rgba(246, 245, 241, 0.24);
  margin: clamp(28px, 4vw, 44px) 0;
}
      `}</style>
    </section>
  );
}
