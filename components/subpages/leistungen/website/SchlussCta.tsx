import Link from "next/link";

/**
 * Schluss-CTA — loest den Hero-Hook auf ("ruft bei dir auch wer an?" ->
 * "Deine ruft an."). Copy 1:1 aus scratchpad/website-copy-v2.md Abschnitt 9.
 * Primaer = Kostenloser Entwurf (-> Kontakt, so wie alle anderen Primaer-
 * CTAs im Relaunch verlinken), Sekundaer = Preise ansehen (-> /preise, keine
 * Preise auf dieser Seite selbst). Label + roter Schlusspunkt per Inline-
 * Style (keine neue CSS-Klasse/keine css-Datei-Aenderung, Kontrakt).
 */
export default function SchlussCta() {
  return (
    <section className="rr-section lw-cta">
      <div className="rr-wrap rr-narrow">
        <p
          className="rr-eyebrow-lg"
          style={{ color: "rgba(246, 245, 241, 0.82)", marginBottom: 16 }}
        >
          Bereit?
        </p>
        <p className="rr-display-2 lw-cta__title">
          Hol dir die Website, bei der das Telefon geht<span style={{ color: "var(--rr-red)" }}>.</span>
        </p>
        <p className="rr-body-lg lw-cta__sub">
          Der erste Schritt kostet dich nichts: Wir bauen dir einen echten
          Entwurf, ohne Vorkasse. Gefällt er dir, reden wir weiter. Wenn
          nicht, hat es dich keinen Cent gekostet.
        </p>
        <div className="lw-cta__actions">
          <Link href="/relaunch-preview/kontakt" className="rr-btn-sweep rr-btn-sweep--red">
            Kostenlosen Entwurf holen
          </Link>
          <Link href="/preise" className="rr-btn-frame rr-btn-frame--red">
            <i className="c1" />
            <i className="c2" />
            <i className="c3" />
            <i className="c4" />
            <span className="rr-btn-frame__t">Preise ansehen</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
