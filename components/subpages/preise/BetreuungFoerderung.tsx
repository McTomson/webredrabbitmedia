'use client';

/**
 * Sektion 4 — Betreuung + Förderung kompakt (brand/PREISE_SEITE_BRIEF.md
 * Abschnitt 5.4/13): "Wartungs-Abo ohne Bindung" + "KMU.DIGITAL kann
 * mitzahlen" (unbeziffert), Wortlaut 1:1 aus der alten Live-Seite
 * (app/preise/page.tsx).
 */
export default function BetreuungFoerderung() {
  return (
    <section className="rr-section rp-bf">
      <div className="rr-wrap rr-narrow rp-bf__grid">
        <div className="rp-bf__col">
          <p className="wd-eyebrow">Betreuung</p>
          <h2 className="rr-sub rp-bf__h">Wartungs-Abo ohne Bindung</h2>
          <p className="rr-body-lg rp-bf__p">
            Wenn du willst, halten wir deine Seite laufend aktuell und sichtbar. Ohne
            Mindestlaufzeit, jederzeit kündbar. Wir halten dich mit Leistung, nicht mit einem
            Vertrag.
          </p>
        </div>
        <div className="rp-bf__col">
          <p className="wd-eyebrow">Förderung</p>
          <h2 className="rr-sub rp-bf__h">KMU.DIGITAL kann mitzahlen</h2>
          <p className="rr-body-lg rp-bf__p">
            Für österreichische Kleinbetriebe kann die KMU.DIGITAL-Förderung einen Teil der
            Kosten übernehmen. Wir prüfen mit dir, ob das für dein Projekt in Frage kommt.
          </p>
        </div>
      </div>

      <style jsx>{`
        .rp-bf {
          background: #f6f5f1;
        }
        .rp-bf__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 5vw, 72px);
        }
        .rp-bf__h {
          margin: 14px 0 16px;
          color: var(--rr-navy);
        }
        .rp-bf__p {
          color: var(--rr-ink-soft);
        }
        @media (max-width: 760px) {
          .rp-bf__grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
    </section>
  );
}
