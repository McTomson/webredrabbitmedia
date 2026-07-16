'use client';

import { useEffect, useMemo, useRef } from 'react';

/**
 * Tipps-Hero auf Basis des Unterseiten-Templates (siehe FaqDemoClient /
 * KontaktDemoClient fuer die Architektur-Doku: stabiler innerHTML-Container,
 * Engine als echtes <script>). Wie FAQ hat diese Seite KEINE MorphSculpture
 * und keine roten Fragmente — nur die Hero-Szene (Titel-Anschnitt + Malen).
 * Die Engine (tipps-hero-demo/demo.engine.jstext) treibt die Hero-Choreografie
 * UND die dezente Scroll-Reveal-Staffelung des darunter server-gerenderten
 * rrt-Index (querySelectorAll auf .rrt-*, gated per data-reveal).
 */
export default function TippsHeroClient({
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

  const injectedHtml = useMemo(
    () => <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />,
    [html],
  );

  useEffect(() => {
    if (!booted.current) {
      booted.current = true;
      const script = document.createElement('script');
      script.setAttribute('data-tipps-hero-engine', '');
      script.textContent = js;
      document.body.appendChild(script);
      /* Script-Tag beim Unmount entfernen: die Engine selbst beendet ihre
         Loops ueber den isConnected-Guard; ohne remove() stapeln sich sonst
         pro Soft-Navigation tote <script>-Knoten im body. booted bewusst
         NICHT zuruecksetzen: StrictMode ruft Effekte doppelt auf, ein Reset
         wuerde die Engine im Dev zweimal booten (Ref ist pro Instanz, echte
         Remounts bekommen ohnehin einen frischen Ref). */
      return () => {
        script.remove();
      };
    }
  }, [js]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {injectedHtml}
    </>
  );
}
