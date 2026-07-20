import Link from "next/link";
import { REVIEWS, hasRealRating } from "@/lib/reviews";

/**
 * v2 Sektion 7 — Testimonials (Leistungsseite Website): EIN Teal-Zitat-Panel
 * (.rr-quote, canonical Signatur-Moment aus app/styleguide/styleguide.css)
 * mit beiden echten Google-Rezensionen, Hairline dazwischen, Muster 1:1 aus
 * components/subpages/leistungen/Referenzen.tsx — hier ohne eigene <style>-
 * Klassen (nur rr-*-Klassen + Inline-Styles, siehe Kontrakt). Nur die zwei
 * verifizierten Reviews (Rafael Danesh, Rene Rohrer). Dmitry Pashlov ist
 * Teammitglied, NIE als Kundenstimme, kein drittes Zitat erfinden. Sterne-
 * Durchschnitt/Anzahl kommen aus lib/reviews.ts (einzige Quelle, verifiziert
 * 2026-06-12), nicht hart im Copy-Text verdrahtet.
 */
export default function Testimonials() {
  const real = hasRealRating();
  const ratingLabel = REVIEWS.rating != null ? REVIEWS.rating.toFixed(1).replace(".", ",") : null;

  return (
    <section className="rr-section lw2-testimonials">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">Was Kunden sagen</p>

        {real && (
          <p
            className="rr-body"
            style={{ color: "var(--rr-ink-soft)", maxWidth: "60ch", marginTop: 16 }}
          >
            Wir sind kein Großkonzern und haben keine hundert Bewertungen. Aber
            die, die es gibt, stehen echt bei Google. {ratingLabel} Sterne aus{" "}
            {REVIEWS.reviewCount} Rezensionen, keine davon erfunden.
          </p>
        )}

        <figure className="rr-quote" style={{ marginTop: "clamp(32px, 5vw, 48px)" }}>
          <p className="rr-quote__mark" aria-hidden="true">
            &ldquo;
          </p>

          <blockquote
            className="rr-quote__text"
            style={{ fontSize: "clamp(22px, 3vw, 34px)" }}
          >
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

          <hr
            aria-hidden="true"
            style={{
              border: 0,
              height: 1,
              background: "rgba(246, 245, 241, 0.24)",
              margin: "clamp(28px, 4vw, 44px) 0",
            }}
          />

          <blockquote
            className="rr-quote__text"
            style={{ fontSize: "clamp(22px, 3vw, 34px)" }}
          >
            Ich bin von der Firma begeistert, vor allem von der Umsetzung. Ein
            Lob an Herrn Uhlir, der mich durch die Zeit der Umsetzung
            begleitet hat. Vielen lieben Dank. 100 Prozent Empfehlung.
          </blockquote>
          <figcaption className="rr-quote__attr">
            <span className="rr-quote__name">Rene Rohrer</span>
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

        <p className="rr-body" style={{ marginTop: 24 }}>
          Mehr Arbeiten und Stimmen findest du auf der{" "}
          <Link href="/relaunch-preview/referenzen">Referenzen-Seite</Link>.
        </p>
      </div>
    </section>
  );
}
