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
        <p className="wd-eyebrow wd-eyebrow--ondark">Ohne Vorkasse</p>
        <p className="rr-statement rp-risiko__statement">
          Dein Risiko liegt bei uns, nicht bei dir<span style={{ color: '#f77480' }}>.</span>
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
          background: var(--rr-navy);
          color: #ffffff;
          overflow: hidden;
          /* Seitenfuellend (Thomas 09.08.): das Risiko-Band ist der staerkste
             USP vor den Zahlen und soll den Bildschirm fuellen, Inhalt zentriert.
             100svh = mobil sauber (kein Sprung durch die Browser-Adressleiste). */
          min-height: 100svh;
          display: flex;
          align-items: center;
        }
        .rp-risiko__inner {
          max-width: 760px;
        }
        .rp-risiko__statement {
          color: #ffffff;
          margin: 20px 0 28px;
        }
        .rp-risiko__body {
          color: rgba(255, 255, 255, 0.78);
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
          color: rgba(255, 255, 255, 0.72);
          font-family: var(--rr-font-ui);
          font-size: 15px;
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          padding-bottom: 2px;
          transition: color 0.25s var(--rr-ease, ease), border-color 0.25s var(--rr-ease, ease);
        }
        .rp-risiko__anchor:hover {
          color: #ffffff;
          border-color: #ffffff;
        }
      `}</style>
    </section>
  );
}
