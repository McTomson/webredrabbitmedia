/**
 * Sektion 4 — nur noch KMU.DIGITAL-Hinweis, schlichter Text (Thomas 24.07.:
 * die Karten waren schlechter; Wartungs-Abo raus, das gehoert in die Abo-/
 * Talos-Logik; KMU.DIGITAL bleibt als reiner Text ohne weisses Feld, gehoert
 * zum Website-Verkauf). KMU.DIGITAL foerdert bewusst nur die Website + Setup,
 * nicht die laufenden Abos (brand/decisions-log.md 24.07.).
 */
export default function BetreuungFoerderung() {
  return (
    <section className="rr-section rp-bf">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow">Förderung</p>
        <p className="rr-body-lg rp-bf__p">
          Für österreichische Kleinbetriebe kann die KMU.DIGITAL-Förderung einen Teil der
          Kosten für deine neue Website übernehmen. Wir prüfen gemeinsam mit dir, ob das für
          dich in Frage kommt.
        </p>
      </div>

      {/* Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md
          "styled-jsx im Relaunch meiden"). */}
      <style>{`
        .rp-bf {
          background: #f6f5f1;
        }
        .rp-bf__p {
          color: var(--rr-ink-soft);
          max-width: 60ch;
          margin: 14px 0 0;
        }
      `}</style>
    </section>
  );
}
