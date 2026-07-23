'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Schwebende Rezensionskarte (rabenrifaie-Mechanik, dezent): kleine 5-Sterne-
 * Karte mit Google-G, Ein-Satz-Zitat und Name. NIE ueber Text
 * (eigene Spalte am Section-Rand, pointer-events:none), leicht transparent.
 * Nur ECHTE Google-Rezensionen (Quelle: KundenSagen.tsx, Dmitry Pashlov =
 * Team, NIE als Kundenstimme verwenden).
 *
 * Sichtbarkeitsfenster (QA-Fix nach Orchestrator-Feedback: Karte war in
 * keinem Scroll-Sample sichtbar): "manuelles Sticky" statt fixer top-%-
 * Position. `position:sticky` kam nicht infrage, weil die Karte dafuer VOR
 * dem Inhalt im DOM-Fluss liegen muesste und dann selbst Layout-Hoehe
 * beansprucht (Textverschiebung). Stattdessen bleibt sie `position:absolute`
 * (kein Layout-Einfluss), aber ein rAF-Loop rechnet den Section-Rahmen
 * (getBoundingClientRect des Eltern-<section>) gegen den Viewport und
 * klemmt die Karte auf eine feste Zielposition IM Viewport (28vh von oben),
 * solange die Section irgendwo im Bild ist — dadurch schwebt sie waehrend
 * eines GROSSEN Teils der Scrollstrecke sichtbar, verlaesst die Buehne aber
 * sauber an den Section-Kanten (Fade per Opacity).
 *
 * reduced-motion: keine Bewegung, aber wegen "nie ueber Text" bleibt sie
 * ausgeblendet (kein sinnvoller statischer Platz ohne Layout-Verschiebung).
 */
export default function FloatingReview({
  quote,
  name,
  side,
}: {
  quote: string;
  name: string;
  side: 'left' | 'right';
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const wrap = wrapRef.current;
    const card = cardRef.current;
    const section = wrap?.parentElement;
    if (!wrap || !card || !section) return;

    let raf = 0;
    let destroyed = false;
    const FADE_ZONE = 120; // px am Section-Rand, in denen die Karte ein-/ausblendet
    const TARGET_VH = 0.28; // Zielposition im Viewport (28% von oben)

    function render() {
      const sec = section as HTMLElement;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const cardH = card!.offsetHeight || 160;
      const margin = 24;

      // Zielposition im Viewport, geklemmt auf den innerhalb der Section
      // sichtbaren Bereich (nie ueber den oberen/unteren Rand hinaus).
      const desiredViewportY = vh * TARGET_VH;
      const minViewportY = Math.max(r.top + margin, margin);
      const maxViewportY = Math.min(r.bottom - cardH - margin, vh - cardH - margin);
      const viewportY =
        maxViewportY >= minViewportY
          ? Math.min(Math.max(desiredViewportY, minViewportY), maxViewportY)
          : (minViewportY + maxViewportY) / 2;

      wrap!.style.top = `${viewportY - r.top}px`;

      // Fade: sichtbar, solange die Section im (erweiterten) Bild ist.
      const inView = r.bottom > -FADE_ZONE && r.top < vh + FADE_ZONE;
      setVisible(inView);
    }

    function loop() {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`fr-wrap fr-wrap--${side}${visible ? ' is-in' : ''}`} aria-hidden="true">
      <div ref={cardRef} className="fr-card">
        <div className="fr-head">
          <svg className="fr-g" viewBox="0 0 48 48" width="16" height="16" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span className="fr-stars" aria-hidden="true">★★★★★</span>
        </div>
        <p className="fr-quote">&ldquo;{quote}&rdquo;</p>
        <p className="fr-name">{name}</p>
      </div>

      {/* Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md
          "styled-jsx im Relaunch meiden"). Klassen fr- sind seiten-lokal
          eindeutig; die Komponente wird zweimal instanziiert (RisikoBand +
          PreiseMatrix), das Tag dupliziert dadurch harmlos im DOM. */}
      <style>{`
        .fr-wrap {
          position: absolute;
          top: 28vh;
          width: clamp(180px, 15vw, 230px);
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.9s var(--rr-ease, ease), transform 0.9s var(--rr-ease, ease),
            top 0.05s linear;
          pointer-events: none;
          z-index: 3;
        }
        .fr-wrap--left {
          left: clamp(4px, 2vw, 24px);
        }
        .fr-wrap--right {
          right: clamp(4px, 2vw, 24px);
        }
        .fr-wrap.is-in {
          opacity: 1;
          transform: none;
        }
        .fr-card {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(28, 40, 55, 0.1);
          padding: 14px 16px;
          box-shadow: 0 18px 40px rgba(28, 40, 55, 0.14);
        }
        .fr-head {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .fr-stars {
          font-size: 10px;
          letter-spacing: 0.05em;
          color: #f5b400;
        }
        .fr-quote {
          font-family: var(--rr-font-ui, "Instrument Sans", sans-serif);
          font-size: 12.5px;
          line-height: 1.45;
          color: var(--rr-ink, #23262e);
          margin: 0 0 8px;
        }
        .fr-name {
          font-family: var(--rr-font-display, "DM Sans", sans-serif);
          font-size: 11.5px;
          font-weight: 700;
          color: var(--rr-ink-soft, #5a5e68);
          margin: 0;
        }
        @media (max-width: 1100px) {
          .fr-wrap {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .fr-wrap {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
