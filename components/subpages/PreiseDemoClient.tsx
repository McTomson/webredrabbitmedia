'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import MorphSculpture from '@/components/subpages/MorphSculpture';

/**
 * 1:1-Kopie von WebsiteDemoClient fuer die geklonte Preise-Demo-Strecke
 * (components/subpages/preise-demo/). Gleiche Architektur: stabiler
 * innerHTML-Container (React reconciliert diesen Teilbaum nach dem ersten
 * Mount nicht erneut), Engine als echtes <script>, Figur per Portal
 * in .main-sticky (vom Scroll-Fortschritt der Demo getrieben ueber
 * window.__sculptProgress).
 *
 * Eindeutiger Marker: script[data-preise-demo-engine] (statt
 * data-website-demo-engine), damit beide Demo-Engines nebeneinander sauber
 * identifizierbar/entfernbar sind.
 */
export default function PreiseDemoClient({
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
      script.setAttribute('data-preise-demo-engine', '');
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
      document.querySelector('script[data-preise-demo-engine]')?.remove();
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
            {/* comp={3} = Chart/Dashboard (at-shapes-comp4) — erste Verwendung
                dieser Figur auf einer Unterseite (siehe
                reference_ueber_uns_template_rezept: 0=Zahnrad,1=Gluehbirne,
                2=Dokument,3=Chart,4=Kopf). Kein progress-Prop -> liest
                window.__sculptProgress (von der Demo-Engine pro Frame gesetzt).
                KEIN manueller translateX/scale-Versatz: der war 1:1 vom
                Zahnrad (comp=0) kopiert, das dort dokumentiert eine
                SONDERKORREKTUR ist (comp0 hat ein breiteres u-Fenster/andere
                Rahmung als comp1-4, siehe WebsiteDemoClient-Kommentar).
                comp1 (Gluehbirne, KontaktDemoClient) laeuft OHNE Zusatz-
                Transform; comp3 folgt diesem Default (QA-Fix: die Zahnrad-
                Korrektur verschob die Chart-Figur aus dem sichtbaren Bild/
                liess sie waehrend des Story-Texts nicht sauber halten). */}
            <MorphSculpture comp={3} style={{ background: 'transparent' }} />
          </div>,
          sticky,
        )}
    </>
  );
}
