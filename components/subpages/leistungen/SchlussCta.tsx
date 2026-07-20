import Link from "next/link";

/**
 * Sektion 9 — Schluss-CTA, produktbezogen. Primär rr-btn-sweep--red zu den
 * Preisen (keine Preise auf dieser Seite selbst), sekundär rr-btn-frame als
 * Anruf-Button (Telefonnummer nie im Klartext, nur hinter dem Button).
 */
export default function SchlussCta() {
  return (
    <section className="rr-section lh-cta">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg lh-cta__eyebrow">Dein nächster Schritt</p>
        <p className="rr-display-2 lh-cta__title">
          Jetzt weißt du, wer für dich arbeitet, wenn du Feierabend hast.
          Deine Website. Und Talos, der drinsteckt.
        </p>
        <p className="rr-body-lg lh-cta__subline">
          Du siehst zuerst deinen Entwurf, ganz ohne Vorkasse. Gefällt er dir
          nicht, hat es dich nichts gekostet. Gefällt er dir, geht es los.
        </p>
        <div className="lh-cta__actions">
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
