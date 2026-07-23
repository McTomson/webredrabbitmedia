'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Schwebende Rezensionskarte (rabenrifaie-Mechanik, dezent): kleine 5-Sterne-
 * Karte mit Google-G, Ein-Satz-Zitat und Name. Scroll-getrieben ein-/ausge-
 * blendet (IntersectionObserver auf den eigenen Wrapper), NIE ueber Text
 * (position:absolute im Rand der Section, pointer-events:none), leicht
 * transparent. Nur ECHTE Google-Rezensionen (Quelle: KundenSagen.tsx,
 * Dmitry Pashlov = Team, NIE als Kundenstimme verwenden).
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
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setVisible(e.isIntersecting);
      },
      { rootMargin: '-15% 0px -15% 0px', threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fr-wrap fr-wrap--${side}${visible ? ' is-in' : ''}`} aria-hidden="true">
      <div className="fr-card">
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

      <style jsx>{`
        .fr-wrap {
          position: absolute;
          top: 8%;
          width: clamp(180px, 15vw, 230px);
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.9s var(--rr-ease, ease), transform 0.9s var(--rr-ease, ease);
          pointer-events: none;
          z-index: 3;
        }
        .fr-wrap--left {
          left: clamp(0px, 2vw, 24px);
        }
        .fr-wrap--right {
          right: clamp(0px, 2vw, 24px);
          top: 55%;
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
        .fr-wrap--left .fr-card {
          background: rgba(255, 255, 255, 0.88);
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
