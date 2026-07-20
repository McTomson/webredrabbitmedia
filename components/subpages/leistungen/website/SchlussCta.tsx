import Link from "next/link";

/**
 * Schluss-CTA — loest den Hero-Hook auf ("du hast schon eine Website, warum
 * ruft keiner an" -> "weil eine Website mehr sein muss als schoen"). Navy-
 * Band wie im Hub-SchlussCta (components/subpages/leistungen/SchlussCta.tsx),
 * hier eigene lw-Klassen. Primaer = Kostenloser Entwurf (-> Kontakt, so wie
 * alle anderen Primaer-CTAs im Relaunch verlinken), Sekundaer = Preise
 * ansehen (-> /preise, keine Preise auf dieser Seite selbst).
 */
export default function SchlussCta() {
  return (
    <section className="rr-section lw-cta">
      <div className="rr-wrap rr-narrow">
        <p className="rr-display-2 lw-cta__title">
          Eine Website muss mehr sein als schön. Sonst ruft keiner an. Deine
          wird beides.
        </p>
        <p className="rr-body-lg lw-cta__sub">
          Hol dir zuerst deinen Entwurf, ganz ohne Vorkasse.
        </p>
        <div className="lw-cta__actions">
          <Link href="/relaunch-preview/kontakt" className="rr-btn-sweep rr-btn-sweep--red">
            Kostenloser Entwurf
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
