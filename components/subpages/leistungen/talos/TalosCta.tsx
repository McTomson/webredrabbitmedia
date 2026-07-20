import Link from "next/link";

/**
 * Schluss-CTA — loest den Hero-Open-Loop auf ("was tut sich unten auf
 * deiner Website, waehrend du auf der Baustelle stehst"). Navy-Band,
 * Muster aus components/subpages/leistungen/SchlussCta.tsx. Primaer
 * rr-btn-sweep--red (Kostenloser Entwurf), sekundaer rr-btn-frame
 * (Preise ansehen -> /preise). Keine Preise auf dieser Seite selbst.
 */
export default function TalosCta() {
  return (
    <section className="rr-section lt-cta">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg" style={{ color: "rgba(246,245,241,0.7)" }}>
          Dein nächster Schritt
        </p>
        <p className="rr-display-2 lt-cta__title">
          Jetzt weißt du, was sich auf deiner Website tut, während du auf der
          Baustelle stehst. Talos arbeitet.
        </p>
        <p className="rr-body-lg lt-cta__sub">
          Fang mit einer Website an, die dir gehört. Den Helfer holst du dir
          dazu, wenn du merkst, wie viel er dir abnimmt. Den ersten Entwurf
          siehst du ohne Vorkasse.
        </p>
        <div className="lt-cta__actions">
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
