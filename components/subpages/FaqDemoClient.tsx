'use client';

import { useEffect, useMemo, useRef } from 'react';

/**
 * FAQ-Seite auf Basis des ueber-uns/kontakt-Templates (siehe KontaktDemoClient
 * fuer die Architektur-Doku: stabiler innerHTML-Container, Engine als echtes
 * <script>). Anders als kontakt/ueber-uns hat diese Seite KEINE MorphSculpture
 * (Beschluss: die Skulpturen comp0/2/3 bleiben Leistungs-/Preisseiten
 * vorbehalten). Darum entfaellt das MorphSculpture-Portal komplett und die
 * Engine (demo.engine.jstext) treibt nur noch Hero-Split + Haltungs-Statements
 * + FAQ-Reveal + Footer — kein Kopf-Aufbau, keine Story, keine Partner-Grid.
 */
export default function FaqDemoClient({
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
      script.setAttribute('data-faq-engine', '');
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
