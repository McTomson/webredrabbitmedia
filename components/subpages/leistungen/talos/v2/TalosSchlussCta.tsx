import Link from 'next/link';

/**
 * Talos-Schluss-CTA — Muster 1:1 aus components/subpages/leistungen/
 * website/SchlussCta.tsx uebernommen (rr-btn-sweep "Kostenlosen Entwurf
 * holen" -> Kontakt, rr-btn-frame "Anrufen" tel:-Link, Nummer nie im
 * Klartext). Eigene .tl-cta-Klassen (1:1-Kopie von website.css .lw-cta) in
 * talos-v2.css, weil diese Seite website.css nicht mehr importiert.
 * Copy aus Spec Sektion 11 (22.07.2026), Buttons unangetastet.
 */
export default function TalosSchlussCta() {
  return (
    <section className="rr-section tl-cta">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow wd-eyebrow--ondark" style={{ marginBottom: 32 }}>
          Los geht&apos;s
        </p>
        <p className="rr-display-2 tl-cta__title">
          Hol dir zuerst die Website. Talos ziehst du dazu, wann immer du
          willst<span style={{ color: 'var(--rr-red)' }}>.</span>
        </p>
        <p className="rr-body-lg tl-cta__sub">
          Fang mit einer Seite an, die von Tag eins für dich arbeitet. Den
          Entwurf siehst du zuerst, ohne Vorkasse. Und wenn du später mehr
          Arbeit abgeben willst, ist Talos schon da.
        </p>
        <p className="tl-says tl-says--ondark">
          Bis gleich. Ich freu mich, wenn ich für dich loslegen darf.
        </p>
        <div className="tl-cta__actions">
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
