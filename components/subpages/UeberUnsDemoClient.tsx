'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import MorphSculpture from '@/components/subpages/MorphSculpture';

/**
 * Portiert scratchpad/ueber-uns-gesamt-demo.html 1:1 in die Next-App.
 *
 * Bewusst KEIN Nachbau mit stage.ts fuer Aufbau/Scroll/Story/Pinsel/Sektionen:
 * die Demo liefert diese Teile 1:1 (CSS, Body-HTML, eigene Scroll-Engine).
 *
 * NUR die Kopf-Skulptur wird durch den ECHTEN Renderer der Hauptseite ersetzt:
 * der Demo-Naeherungs-Kopf (#headSvg) ist per CSS ausgeblendet; stattdessen wird
 * <MorphSculpture comp={4}/> als transparente Vollbild-Ebene in .main-sticky
 * portalt und vom Scroll-Fortschritt der Demo getrieben (window.__sculptProgress,
 * das die Engine pro Frame setzt: Einflug -> Halten -> Aufloesen). So ist die
 * Skulptur pixelgleich zur Hauptseite, waehrend die restliche Seite die Demo bleibt.
 *
 * WICHTIG (Architektur): Der injizierte Demo-HTML-Container wird per useMemo auf
 * eine STABILE Element-Identitaet festgenagelt. React bailed dadurch bei jedem
 * Folge-Render (z.B. durch setSticky) aus der Reconciliation dieses Teilbaums aus
 * und setzt `dangerouslySetInnerHTML` NICHT neu. Ohne das wuerde jeder Re-Render
 * den vom Engine-Script mutierten DOM zerstoeren und den Portal-Zielknoten
 * detachen -> der Kopf wuerde in einen abgekoppelten Knoten rendern (unsichtbar).
 */
export default function UeberUnsDemoClient({
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
    // 1) Engine als echtes <script> (globaler Scope noetig fuer `const COMP5` + IIFE).
    //    NUR das ist idempotent -> einmal-Guard. StrictMode ruft Effekte in Dev
    //    doppelt auf; die Engine darf nur einmal booten.
    if (!booted.current) {
      booted.current = true;
      const script = document.createElement('script');
      script.setAttribute('data-ueber-uns-engine', '');
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
      document.querySelector('script[data-ueber-uns-engine]')?.remove();
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
            {/* comp={4} = Kopf/KI. Kein progress-Prop -> liest window.__sculptProgress
                (von der Demo-Engine pro Frame gesetzt). Transparenter Grund, damit der
                Pinsel-Reveal darunter sichtbar bleibt, solange der Kopf offscreen ist. */}
            <MorphSculpture comp={4} style={{ background: 'transparent' }} />
          </div>,
          sticky,
        )}
    </>
  );
}
