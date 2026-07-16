'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import MorphSculpture from '@/components/subpages/MorphSculpture';

/**
 * Kontakt-Seite auf Basis des ueber-uns-Templates (siehe UeberUnsDemoClient fuer
 * die Architektur-Doku: stabiler innerHTML-Container, Engine als echtes <script>,
 * MorphSculpture-Portal in .main-sticky, window.__sculptProgress von der Engine).
 *
 * Unterschiede zu ueber-uns:
 * - comp={1} = GLUEHBIRNE (at-shapes-comp2) statt Kopf; Figur steht rechts,
 *   Story-Text links (Spaltentausch in kontakt-demo/demo.css).
 * - scene-cta enthaelt das Kontakt-Formular (plain HTML + Engine-Handler,
 *   gleicher Endpunkt POST /api/contact wie KontaktForm.tsx).
 */
export default function KontaktDemoClient({
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

  const injectedHtml = useMemo(
    () => <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />,
    [html],
  );

  useEffect(() => {
    if (!booted.current) {
      booted.current = true;
      const script = document.createElement('script');
      script.setAttribute('data-kontakt-engine', '');
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
    return () => { cancelled = true; cancelAnimationFrame(raf); };
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
            {/* comp={1} = Gluehbirne. Kein progress-Prop -> liest window.__sculptProgress. */}
            <MorphSculpture comp={1} style={{ background: 'transparent' }} />
          </div>,
          sticky,
        )}
    </>
  );
}
