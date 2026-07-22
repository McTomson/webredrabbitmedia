'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import TalosWalkStage from '@/components/relaunch/talos/TalosWalkStage';

/**
 * 1:1-Architektur von WebsiteDemoClient fuer die geklonte Talos-Demo-Strecke
 * (components/subpages/talos-demo/): stabiler innerHTML-Container (React
 * reconciliert diesen Teilbaum nach dem ersten Mount nicht erneut), Engine als
 * echtes <script>, Figur-Ebene per Portal in .main-sticky.
 *
 * EINZIGER inhaltlicher Unterschied: Statt der MorphSculpture (rote
 * Fragment-Figur) haengt hier die 3D-Walk-Buehne (TalosWalkStage) im Portal.
 * Sie liest denselben Scroll-Fortschritt (window.__sculptProgress, von der
 * Demo-Engine pro Frame gesetzt) — Talos geht scroll-gekoppelt von links
 * herein, statt dass sich die Figur aus Teilen zusammensetzt.
 *
 * Eindeutiger Marker: script[data-talos-demo-engine], damit Website-/Talos-
 * Engines nebeneinander sauber identifizierbar/entfernbar sind.
 */
export default function TalosDemoClient({
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
  // ersten Mount nicht erneut, `innerHTML` bleibt unberuehrt.
  const injectedHtml = useMemo(
    () => <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />,
    [html],
  );

  useEffect(() => {
    // 1) Engine als echtes <script> (globaler Scope noetig fuer top-level
    //    const/IIFE der Engine). NUR das ist idempotent -> einmal-Guard.
    if (!booted.current) {
      booted.current = true;
      const script = document.createElement('script');
      script.setAttribute('data-talos-demo-engine', '');
      script.textContent = js;
      document.body.appendChild(script);
    }

    // 2) Portal-Ziel (der Hero-Sticky) robust finden; rAF-Retry wie im Original
    //    (StrictMode nullt Refs zwischen den beiden Setup-Laeufen).
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
         sich tote <script>-Knoten im body. booted bleibt true. */
      document.querySelector('script[data-talos-demo-engine]')?.remove();
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
            <TalosWalkStage />
          </div>,
          sticky,
        )}
    </>
  );
}
