'use client';

import { useEffect, useMemo, useRef } from 'react';

/**
 * Website-Hero auf Basis des Unterseiten-Templates (Architektur wie
 * LeistungenHeroClient / TippsHeroClient: stabiler innerHTML-Container, Engine
 * als echtes <script>). Nur die Hero-Szene (Titel-Anschnitt "Website." + Malen,
 * ueber-uns/tipps-Malmechanik), darunter dockt der server-gerenderte Seiten-
 * inhalt an. Engine: website-hero-demo/demo.engine.jstext.
 */
export default function WebsiteHeroClient({
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
      script.setAttribute('data-website-hero-engine', '');
      script.textContent = js;
      document.body.appendChild(script);
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
