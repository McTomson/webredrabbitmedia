'use client';

import { useEffect, useMemo, useRef } from 'react';

/**
 * Leistungen-Hero auf Basis des Unterseiten-Templates (siehe TippsHeroClient /
 * FaqDemoClient fuer die Architektur-Doku: stabiler innerHTML-Container, Engine
 * als echtes <script>). Wie FAQ/Tipps hat diese Seite KEINE MorphSculpture im
 * Hero und keine roten Fragmente — nur die Hero-Szene (Titel-Anschnitt "Leistungen."
 * + Malen). Die Zahnraeder-Skulptur (comp0) kommt erst in Kapitel 1 der Story.
 * Die Engine (leistungen-hero-demo/demo.engine.jstext) treibt nur die Hero-
 * Choreografie; darunter dockt die server-gerenderte LeistungenStory an.
 */
export default function LeistungenHeroClient({
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
      script.setAttribute('data-leistungen-hero-engine', '');
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
