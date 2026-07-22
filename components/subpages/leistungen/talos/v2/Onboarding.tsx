'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Onboarding "So zieht Talos ein" (Copy v2 Sektion 6). 1:1-Klon der
 * Kreis-Ketten-Mechanik aus components/subpages/leistungen/website/v2/
 * Ablauf.tsx (Sticky-Track, ein Scroll je Schritt, Kreise mit Navy-Hairline,
 * aktiver Kreis rot), aber nur 3 statt 4 Schritte -> Track entsprechend
 * kuerzer (100vh Sticky-Pin + 200vh Scroll-Strecke = 300vh statt 500vh).
 * Mobile/prefers-reduced-motion: statische, vertikale Liste ohne Sticky/
 * Scroll-Kopplung. Eigene tl-ob-* Klassen in talos-v2.css (1:1-Kopie der
 * wd-abl-* Regeln, umbenannt und auf 3 Schritte angepasst). Nur ein <h2>
 * (das eine h1 sitzt im Hero). DU-Anrede, echte Umlaute, kein
 * Gedankenstrich, kein "KI"-Wort.
 */

type Schritt = { titel: string; text: string };

const SCHRITTE: Schritt[] = [
  {
    titel: 'Du buchst.',
    text: 'Du entscheidest, welche Fähigkeit du dazunimmst. Das geht in Minuten und ohne langes Hin und Her.',
  },
  {
    titel: 'Ihr lernt euch kennen.',
    text: 'Talos fragt dich nach ein paar Textbeispielen, nach deiner Sprache und deinem Ton, und lernt, wie dein Betrieb tickt.',
  },
  {
    titel: 'Er legt los.',
    text: 'Ab da entsteht alles in deiner Art, so als hättest du es selbst gemacht. Nur dass du es nicht musst.',
  },
];

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export default function Onboarding() {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    let destroyed = false;

    const render = () => {
      const r = track.getBoundingClientRect();
      const denom = r.height - window.innerHeight;
      const q = denom > 0 ? clamp01(-r.top / denom) : 0;

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${q.toFixed(4)})`;
      }

      const idx = Math.min(2, Math.max(0, Math.floor(q * 3)));
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }
    };

    const loop = () => {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('scroll', render, { passive: true });
    window.addEventListener('resize', render);
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', render);
      window.removeEventListener('resize', render);
    };
  }, [reduced]);

  return (
    <section className="rr-section tl-section tl-ob" aria-labelledby="tl-ob-title">
      <div className="rr-wrap rr-narrow tl-ob__head">
        <p className="wd-eyebrow tl-eyebrow">So zieht Talos ein</p>
        <h2 id="tl-ob-title" className="rr-statement tl-title">
          In drei Schritten ist Talos ein Teil deines Betriebs.
        </h2>
        <p className="rr-body-lg tl-lead">
          Kein großes Projekt, kein Aufwand für dich. Talos arbeitet sich
          selbst ein.
        </p>
      </div>

      <div ref={trackRef} className="tl-ob__track">
        <div className="tl-ob__stage">
          <div className="tl-ob__circles" aria-hidden="true">
            <div className="tl-ob__linetrack">
              <div ref={fillRef} className="tl-ob__linefill" />
            </div>
            {SCHRITTE.map((_, i) => (
              <span
                key={i}
                className={
                  'tl-ob__circle' +
                  (i === activeIndex ? ' is-active' : i < activeIndex ? ' is-done' : '')
                }
              >
                <span className="tl-ob__circlenum">0{i + 1}</span>
              </span>
            ))}
          </div>

          <ol className="tl-ob__list">
            {SCHRITTE.map((s, i) => (
              <li className={'tl-ob__step' + (i === activeIndex ? ' is-active' : '')} key={i}>
                <span className="tl-ob__stepnum" aria-hidden="true">
                  <span className="tl-ob__stepcircle">0{i + 1}</span>
                </span>
                <div className="tl-ob__body">
                  <h3 className="tl-ob__titel">{s.titel}</h3>
                  <p className="tl-ob__text">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="tl-says tl-ob__says">
        Gib mir ein paar Beispiele von dir, dann klinge ich wie du.
      </p>
    </section>
  );
}
