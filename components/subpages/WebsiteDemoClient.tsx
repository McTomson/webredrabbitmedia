'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import MorphSculpture from '@/components/subpages/MorphSculpture';

/**
 * 1:1-Kopie von UeberUnsDemoClient fuer die geklonte Website-Demo-Strecke
 * (components/subpages/website-demo/). Gleiche Architektur: stabiler
 * innerHTML-Container (React reconciliert diesen Teilbaum nach dem ersten
 * Mount nicht erneut), Engine als echtes <script>, Kopf-Skulptur per Portal
 * in .main-sticky (vom Scroll-Fortschritt der Demo getrieben ueber
 * window.__sculptProgress).
 *
 * Eindeutiger Marker: script[data-website-demo-engine] (statt
 * data-ueber-uns-engine), damit beide Demo-Engines nebeneinander sauber
 * identifizierbar/entfernbar sind.
 */
export default function WebsiteDemoClient({
  css,
  html,
  js,
}: {
  css: string;
  html: string;
  js: string;
}) {
  const booted = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = useState<HTMLElement | null>(null);

  // Stabile Element-Identitaet -> React reconciliert diesen Teilbaum nach dem
  // ersten Mount nicht erneut, `innerHTML` bleibt unberuehrt (siehe Doc oben).
  const injectedHtml = useMemo(
    () => <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />,
    [html],
  );

  useEffect(() => {
    // 1) Engine als echtes <script> (globaler Scope noetig fuer top-level
    //    const/IIFE der Engine). NUR das ist idempotent -> einmal-Guard.
    //    StrictMode ruft Effekte in Dev doppelt auf; die Engine darf nur
    //    einmal booten.
    if (!booted.current) {
      booted.current = true;
      const script = document.createElement('script');
      script.setAttribute('data-website-demo-engine', '');
      script.textContent = js;
      document.body.appendChild(script);
    }

    // 2) Portal-Ziel (der Hero-Sticky) robust finden. NICHT hinter dem booted-Guard:
    //    StrictMode nullt Refs zwischen den beiden Setup-Laeufen. rAF-Retry, bis
    //    .main-sticky abfragbar ist (setSticky mit gleichem el ist ein No-op).
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
      /* Script-Tag beim Unmount entfernen (Soft-Navigation): die Engine beendet
         ihre Loops selbst ueber den isConnected-Guard; ohne remove() stapeln
         sich tote <script>-Knoten im body. booted bleibt true (StrictMode-
         Doppel-Effekt darf die Engine nicht erneut booten). */
      document.querySelector('script[data-website-demo-engine]')?.remove();
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
            }}
          >
            {/* comp={0} = Zahnrad (at-shapes-comp1). Kein progress-Prop -> liest window.__sculptProgress
                (von der Demo-Engine pro Frame gesetzt). Transparenter Grund, damit der
                Pinsel-Reveal darunter sichtbar bleibt, solange der Kopf offscreen ist.
                Die Zahnrad-Komposition ist breiter gerahmt als der Kopf (comp4) und
                wuerde an der Textspalte kleben; deshalb Figur-Ebene leicht nach links
                und minimal kleiner, Text bleibt referenz-identisch zu ueber-uns. */}
            <MorphSculpture
              comp={0}
              style={{ background: 'transparent', transform: 'translateX(-4vw) scale(0.92)' }}
            />
          </div>,
          sticky,
        )}
    </>
  );
}
