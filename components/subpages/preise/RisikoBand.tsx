'use client';

import FloatingReview from './FloatingReview';

/**
 * Sektion 2 — Risiko-Umkehr-Navy-Band (brand/PREISE_SEITE_BRIEF.md Abschnitt
 * 5.2/7): staerkster USP VOR den Zahlen, Wortlaut 1:1 aus dem Brief bzw. der
 * alten Live-Seite (app/preise/page.tsx). Navy #1c2837, Eyebrow im
 * wd-eyebrow-Stil (ondark-Variante fuer AA-Kontrast).
 */
export default function RisikoBand() {
  return (
    <section className="rr-section rp-risiko">
      {/* FloatingReview VOR dem Inhalt im DOM: ihr sticky-Bereich ("Anschlagpunkt"
          bis Section-Ende) muss ab Section-Anfang reichen, sonst haette sie kaum
          Sticky-Weg (QA-Fix: Karte war in keinem Scroll-Sample sichtbar). */}
      <FloatingReview
        side="left"
        quote="Die Zusammenarbeit war äußerst präzise, auf all unsere Wünsche wurde detailliert eingegangen."
        name="Rafael Danesh, Google-Rezension"
      />

      <div className="rr-wrap rr-narrow rp-risiko__inner">
        <p className="wd-eyebrow wd-eyebrow--ondark">Dein Risiko: null</p>
        <p className="rr-statement rp-risiko__statement">
          Erst überzeugt, dann bezahlt<span style={{ color: '#f77480' }}>.</span>
        </p>
        <p className="rr-body-lg rp-risiko__body">
          Du bekommst zuerst einen echten Entwurf zu sehen, ohne Vorkasse. Gefällt er dir und
          du erteilst den Auftrag, fällt eine Anzahlung an. Bis dahin liegt das Risiko bei uns,
          nicht bei dir.
        </p>
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
      `}</style>
    </section>
  );
}
