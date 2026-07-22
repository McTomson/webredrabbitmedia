import Link from "next/link";

/**
 * Schluss-CTA — loest den Hero-Hook auf ("ruft bei dir auch wer an?" ->
 * "Deine ruft an."). Copy 1:1 aus scratchpad/website-copy-v2.md Abschnitt 9.
 * Primaer = Kostenloser Entwurf (-> Kontakt, so wie alle anderen Primaer-
 * CTAs im Relaunch verlinken), Sekundaer = Anrufen (tel:-Link, Nummer nie im
 * Klartext, Muster aus dem Hub-SchlussCta). Label + roter Schlusspunkt per Inline-
 * Style (keine neue CSS-Klasse/keine css-Datei-Aenderung, Kontrakt).
 */
export default function SchlussCta() {
  return (
    <section className="rr-section lw-cta">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow wd-eyebrow--ondark" style={{ marginBottom: 32 }}>
          Bereit?
        </p>
        <p className="rr-display-2 lw-cta__title">
          Hol dir die Website, bei der das Telefon klingelt<span style={{ color: "var(--rr-red)" }}>.</span>
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
          <a href="tel:+436769000955" className="rr-btn-frame rr-btn-frame--red">
            <i className="c1" />
            <i className="c2" />
            <i className="c3" />
            <i className="c4" />
            <span className="rr-btn-frame__t">Anrufen</span>
          </a>
        </div>
      </div>
    </section>
  );
}
