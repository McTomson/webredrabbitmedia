'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import MorphSculpture from '@/components/subpages/MorphSculpture';

/**
 * Leistungen-Szene auf Basis des ueber-uns-Templates. Architektur-Doku steht in
 * UeberUnsDemoClient (stabiler innerHTML-Container, Engine als echtes <script>,
 * MorphSculpture-Portal in .main-sticky, window.__sculptProgress von der Engine).
 *
 * WICHTIG (der Punkt, an dem vier Anlaeufe gescheitert sind): die roten Fragmente
 * kommen NICHT aus der Engine. Deren #headSvg ist in demo.css hart ausgeblendet
 * (`#headSvg{display:none!important}`); die echte Figur ist diese MorphSculpture,
 * dieselbe Pipeline wie auf der Startseite. Ein Figur-Wechsel ist deshalb ein
 * Wechsel des comp-Index — KEIN Umbau von Fragmentdaten in der Engine.
 *
 * comp ist hier 0-basiert (COMPS[comp] = at-shapes-comp{comp+1}.json):
 *   0 = Zahnrad, 1 = Gluehbirne (Kontakt), 4 = Kopf (Ueber uns).
 * SubpageHero zaehlt dagegen 1-basiert — nicht verwechseln.
 */
export default function LeistungenHero2Client({
  css,
  html,
  js,
  comp = 0,
}: {
  css: string;
  html: string;
  js: string;
  /** Figur-Index, 0-basiert. Default 0 = Zahnrad. */
  comp?: number;
}) {
  const booted = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = useState<HTMLElement | null>(null);

  const injectedHtml = useMemo(
    () => <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />,
    [html],
  );

  useEffect(() => {
    if (!booted.current) {
      booted.current = true;
      /* Review-Fix 21.07.: __sculptProgress ist window-global und wird auch von
         den ueber-uns-/kontakt-Engines geschrieben. Bei Soft-Navigation von dort
         hierher stuende bis zum fonts.ready-Boot der Engine der fremde Alt-Wert
         (Figur flasht in falscher Pose). Vor dem Engine-Start auf 0 (= Startpose
         "offscreen") setzen. */
      (window as unknown as { __sculptProgress?: number }).__sculptProgress = 0;
      const script = document.createElement('script');
      script.setAttribute('data-leistungen-hero2-engine', '');
      script.textContent = js;
      document.body.appendChild(script);
    }

    let raf = 0;
    let tries = 0;
    let cancelled = false;
    const find = () => {
      if (cancelled) return;
      const el = containerRef.current?.querySelector('.main-sticky') as HTMLElement | null;
      if (el) { setSticky(el); return; }
      if (++tries < 120) raf = requestAnimationFrame(find);
    };
    find();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      document.querySelector('script[data-leistungen-hero2-engine]')?.remove();
      /* Globalen Fortschritt nicht fuer die naechste Seite liegen lassen
         (Gegenstueck zum Reset oben; Fremd-Clients raeumen selbst nicht auf,
         darum verlassen wir uns beim Mount NICHT auf fremdes Aufraeumen). */
      delete (window as unknown as { __sculptProgress?: number }).__sculptProgress;
    };
  }, [js]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {injectedHtml}
      {sticky &&
        createPortal(
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              pointerEvents: 'none',
              /* Das Zahnrad-Paar (comp 0) ist ~54px breiter als der ueber-uns-Kopf und
                 ragte damit bis auf 6px an die Textspalte heran (Kopf: 58px Abstand,
                 im Browser vermessen 20.07.). Die ganze Figuren-Ebene leicht nach links
                 ruecken stellt denselben Abstand her wie ueber-uns. Nur fuer die breite
                 Zahnrad-Figur; andere Figuren (schmaler) brauchen es nicht. vw-basiert,
                 damit es mit der viewport-skalierten Figur mitwandert. Greift ohnehin nur
                 im Desktop-2-Spalten-Layout; mobil stapelt das Grid (kein H-Abstand). */
              transform: comp === 0 ? 'translateX(-3.6vw)' : undefined,
            }}
          >
            {/* Kein progress-Prop -> liest window.__sculptProgress (Engine pro Frame). */}
            <MorphSculpture
              comp={comp}
              /* Zahnrad ohne Navy-Balken: das Akzent-Fragment (groesstes Seiten-
                 verhaeltnis) wirkt hier wie eine Fremd-Linie (Thomas 21.07.). */
              navyPiece={false}
              style={{ background: 'transparent' }}
            />
          </div>,
          sticky,
        )}
    </>
  );
}
