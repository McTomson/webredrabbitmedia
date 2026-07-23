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
      /* Review-Fix (Lesson L-leistungen-02): __sculptProgress ist window-global
         und wird auch von den ueber-uns-/kontakt-/website-Engines geschrieben.
         Bei Soft-Navigation von dort hierher stuende bis zum fonts.ready-Boot
         der eigenen Engine der fremde Alt-Wert (Figur flasht in falscher Pose).
         Vor dem Engine-Start auf 0 (= Startpose "offscreen") setzen. */
      (window as unknown as { __sculptProgress?: number }).__sculptProgress = 0;
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
      /* Gegenstueck zum Reset oben (Lesson L-leistungen-02): den globalen
         Fortschritt nicht fuer die naechste Seite liegen lassen. Fremd-Clients
         raeumen selbst nicht auf, darum verlassen wir uns beim Mount NICHT auf
         fremdes Aufraeumen. */
      delete (window as unknown as { __sculptProgress?: number }).__sculptProgress;
    };
  }, [js]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {injectedHtml}
      {/* Figur-Versatz als eigene Regel statt Inline-Style, weil er an einen
          Breakpoint gebunden ist: ab 769px liegen Figur und Text NEBENeinander
          (.story-grid 2-spaltig) — die comp3-Komposition sitzt von Haus aus
          rechts und wuerde die Textspalte ueberdecken, deshalb nach links in
          die freie Haelfte. Unter 768px stapelt .story-grid (Figur UEBER Text,
          grid-template-rows 44vh auto), dort muss die Figur mittig bleiben —
          ein Versatz wuerde sie aus dem Bild schieben. */}
      <style>{`
        @media (min-width: 769px) {
          .pd-figur { transform: translateX(-46vw); }
        }
      `}</style>
      {sticky &&
        createPortal(
          <div
            aria-hidden
            className="pd-figur"
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
                Transform. Der Versatz von comp3 steckt stattdessen in der
                .pd-figur-Regel oben (breakpoint-gebunden, live vermessen:
                Figur 855..1426px vs. Textspalte ab 777px -> ueberdeckte den
                Text; nach -46vw liegt sie bei 120..691px mit sauberem Abstand). */}
            <MorphSculpture comp={3} style={{ background: 'transparent' }} />
          </div>,
          sticky,
        )}
    </>
  );
}
