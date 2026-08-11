'use client';

import Link from 'next/link';
import FloatingReview from './FloatingReview';

/**
 * Sektion 2 — Risiko-Umkehr-Navy-Band (brand/PREISE_SEITE_BRIEF.md Abschnitt
 * 5.2/7): staerkster USP VOR den Zahlen, Wortlaut 1:1 aus dem Brief bzw. der
 * alten Live-Seite (app/preise/page.tsx). Navy #23262e, Eyebrow im
 * wd-eyebrow-Stil (ondark-Variante fuer AA-Kontrast).
 */
export default function RisikoBand() {
  return (
    <section className="rr-section rp-risiko" data-rr-snap>
      {/* FloatingReview VOR dem Inhalt im DOM: ihr sticky-Bereich ("Anschlagpunkt"
          bis Section-Ende) muss ab Section-Anfang reichen, sonst haette sie kaum
          Sticky-Weg (QA-Fix: Karte war in keinem Scroll-Sample sichtbar). */}
      <FloatingReview
        side="right"
        quote="Die Zusammenarbeit war äußerst präzise, auf all unsere Wünsche wurde detailliert eingegangen."
        name="Rafael Danesh, Google-Rezension"
      />

      <div className="rr-wrap rr-narrow rp-risiko__inner">
        <p className="wd-eyebrow">Ohne Vorkasse</p>
        <p className="rr-statement rp-risiko__statement">
          Dein Risiko liegt bei uns, nicht bei dir<span style={{ color: 'var(--rr-red)' }}>.</span>
        </p>
        <p className="rr-body-lg rp-risiko__body">
          Du bekommst zuerst 1-2 grafische Vorschläge von unserem Designer-Team zu sehen, wohin
          dein Auftritt gehen kann, ohne Vorkasse. Gefällt dir die Richtung und du erteilst den
          Auftrag, bekommst du ein konkretes Angebot und leistest 40 % Anzahlung. Bis dahin liegt
          das Risiko bei uns, nicht bei dir.
        </p>
        <div className="rp-risiko__cta">
          <Link
            href="/relaunch-preview/kontakt"
            data-rr-lead="risiko"
            data-rr-lead-service="Preise Risiko-Band"
            className="rr-btn-sweep rr-btn-sweep--red"
          >
            Vorschläge anfragen
          </Link>
          <a href="#pakete" className="rp-risiko__anchor">
            Erst die Pakete ansehen<span aria-hidden="true"> →</span>
          </a>
        </div>
      </div>

      {/* Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md
          "styled-jsx im Relaunch meiden" — 3 dokumentierte Faelle, in denen
          Komponenten ungestylt als roher Text rendern). Klassen rp- sind
          seiten-lokal eindeutig genug. */}
      <style>{`
        .rp-risiko {
          position: relative;
          isolation: isolate;
          background: #f4f4f2;
          overflow: hidden;
          /* Eigener Bereich = eigene Bildschirmseite (Thomas 11.08.), Muster
             1:1 vom site-weiten Abschluss-Block (.sc-full, styleguide.css 1638
             + SiteClosing.tsx): fensterhoch, Inhalt vertikal zentriert. Gilt
             auf ALLEN Groessen (Thomas: "auf jeden bildschirmgroessen"). */
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        /* Flex-Kind-Korrektur wie in SiteClosing: width:100% stellt das
           Block-Verhalten von .rr-wrap wieder her (sonst shrink-to-fit). */
        .rp-risiko > .rr-wrap {
          width: 100%;
        }
        .rp-risiko__inner {
          max-width: 760px;
        }
        /* .rr-Praefix PFLICHT (Root-Cause 11.08.): styleguide.css setzt
           ".rr .rr-statement { margin: 0 }" mit 2-Klassen-Spezifitaet — eine
           einzelne Klasse verliert IMMER dagegen, die Marge kam nie an
           ("alles klebt"). Gleiches Muster wie FragTalosAnmoderation. */
        .rr .rp-risiko__statement {
          color: var(--rr-navy);
          margin: clamp(24px, 2.6vw, 34px) 0 clamp(30px, 3.6vw, 42px);
        }
        .rp-risiko__body {
          color: var(--rr-ink-soft);
          max-width: 56ch;
        }
        .rp-risiko__cta {
          display: flex;
          align-items: center;
          gap: clamp(16px, 3vw, 28px);
          flex-wrap: wrap;
          margin-top: clamp(32px, 5vw, 48px);
        }
        .rp-risiko__anchor {
          color: var(--rr-ink-soft);
          font-family: var(--rr-font-ui);
          font-size: 15px;
          text-decoration: none;
          border-bottom: 1px solid rgba(28, 40, 55, 0.28);
          padding-bottom: 2px;
          transition: color 0.25s var(--rr-ease, ease), border-color 0.25s var(--rr-ease, ease);
        }
        .rp-risiko__anchor:hover {
          color: var(--rr-navy);
          border-color: var(--rr-navy);
        }
      `}</style>
    </section>
  );
}
