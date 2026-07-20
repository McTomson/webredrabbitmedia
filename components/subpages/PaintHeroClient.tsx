'use client';

import { useEffect, useMemo, useRef } from 'react';

/**
 * Paint-Hero (Wisch-Reveal) — dasselbe Unterseiten-Template wie der Tipps-Hero
 * (components/subpages/tipps-hero-demo), hier als wiederverwendbare Variante:
 * ein angeschnittenes grosses Wort unten, darueber eine weisse Flaeche, die man
 * mit der Maus/dem Finger FREIMALT, worunter eine Botschaft (Navy) erscheint.
 * Beim Scrollen steigt das Wort auf, schrumpft und die Buchstaben zerstreuen.
 *
 * Architektur 1:1 vom TippsHeroClient: stabiler innerHTML-Container + Engine als
 * echtes <script> (die Engine misst Fonts, braucht echtes DOM). css/html/js
 * werden serverseitig aus components/subpages/paint-hero/ + dem pro-Seite
 * gebauten HTML (Wort + Botschaft) hereingereicht.
 */
export default function PaintHeroClient({
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
      script.setAttribute('data-paint-hero-engine', '');
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
