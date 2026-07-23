'use client';

import Link from 'next/link';

/**
 * Sektion 7 — Schluss-CTA (Klon des Musters aus
 * components/subpages/leistungen/website/SchlussCta.tsx): Navy, primär
 * Entwurf holen (-> Kontakt), sekundär Anrufen (tel:-Link, Nummer nie im
 * Klartext). Wortlaut 1:1 aus brand/PREISE_SEITE_BRIEF.md Abschnitt 5.7.
 */
export default function PreiseSchlussCta() {
  return (
    <section className="rr-section rp-cta">
      <div className="rr-wrap rr-narrow rp-cta__inner">
        <p className="wd-eyebrow wd-eyebrow--ondark" style={{ marginBottom: 32 }}>
          Bereit?
        </p>
        <p className="rr-display-2 rp-cta__title">
          Hol dir deinen Entwurf. Ohne Vorkasse, ohne Risiko<span style={{ color: '#f77480' }}>.</span>
        </p>
        <p className="rr-body-lg rp-cta__sub">
          Drei Pakete, ein Prinzip: Du weißt vorher, woran du bist. Den ersten Entwurf siehst
          du, ohne einen Cent Vorkasse.
        </p>
        <div className="rp-cta__actions">
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

      {/* Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md
          "styled-jsx im Relaunch meiden"). Kein :global(...) mehr noetig
          (das ist styled-jsx-Syntax) — bei einem globalen Tag wirkt jeder
          Selektor ohnehin ungescopet auf .rr-btn-sweep. */}
      <style>{`
        .rp-cta {
          background: var(--rr-navy);
        }
        .rp-cta__inner {
          text-align: left;
          max-width: 760px;
        }
        .rp-cta__title {
          color: #ffffff;
          margin: 0 0 24px;
        }
        .rp-cta__sub {
          color: rgba(255, 255, 255, 0.78);
          max-width: 52ch;
          margin: 0 0 40px;
        }
        .rp-cta__actions {
          display: flex;
          align-items: center;
          gap: clamp(1.2rem, 2.4vw, 2rem);
          flex-wrap: wrap;
        }
        /* rr-btn-sweep hat im Ruhezustand Ink-Text (fuer helle Flaechen); auf
           dem Navy-Band den Text hell setzen (Kontrast-Fix, 1:1 Muster aus
           components/subpages/leistungen/website/website.css .lw-cta). */
        .rp-cta__actions .rr-btn-sweep {
          color: #f6f5f1;
        }
      `}</style>
    </section>
  );
}
