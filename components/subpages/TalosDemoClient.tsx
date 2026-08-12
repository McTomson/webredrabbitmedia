'use client';

import { useEffect, useMemo, useRef } from 'react';

/**
 * 1:1-Architektur von WebsiteDemoClient fuer die geklonte Talos-Demo-Strecke
 * (components/subpages/talos-demo/): stabiler innerHTML-Container (React
 * reconciliert diesen Teilbaum nach dem ersten Mount nicht erneut), Engine als
 * echtes <script>, Figur-Ebene per Portal in .main-sticky.
 *
 * EINZIGER inhaltlicher Unterschied: KEINE Figur-Ebene im Portal. Die Figur
 * ist der seitenweite TalosCompanionStage (fixe Vollbild-Ebene, von page.tsx
 * gemountet); er liest denselben Scroll-Fortschritt (window.__sculptProgress)
 * und macht daraus den Walk-in — und begleitet danach die ganze Seite.
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

    return () => {
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
    </>
  );
}
