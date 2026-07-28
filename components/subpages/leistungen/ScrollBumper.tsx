'use client';

import { useEffect, useRef, useState } from 'react';
import {
  BUMPER_TRACK_VH_PER_WINDOW,
  isBumperDegraded,
  snapUnits,
} from '@/lib/relaunch/scroll-standard';

/**
 * ScrollBumper — die kanonische Bumper-Strecke fuer kurze Display-Inhalte.
 *
 * Umgebaut 28.07. auf den Homepage-Standard (docs/DESIGN_STANDARD.md, Abschnitt
 * "Scroll & Bumper"). Entscheidung Thomas woertlich: "Preisseiten-Bumper an
 * Homepage-Standard angleichen: heller Hintergrund, gleiche Headline-Groesse wie
 * die Homepage-Panels (30-52px), gleiches Stopp-Verhalten, und oben die rote
 * Themen-Zeile (Eyebrow)". Verworfen wurde ausdruecklich "dunkel behalten".
 *
 * Mechanik jetzt identisch zur Referenz components/relaunch/CasePanels.tsx, nur
 * vertikal statt horizontal: sticky 100vh-Fenster, eine Buehne mit N Fenstern
 * uebereinander, Track = N * BUMPER_TRACK_VH_PER_WINDOW. Der Fortschritt laeuft
 * durch snapUnits(), also steht jedes Fenster den grossen Teil seiner Etappe
 * still und wechselt nur im schmalen Uebergangsfenster ("1 Scroll = 1 Fenster,
 * stoppt, 2 Fenster = 2x scrollen"). Vorher: 320vh Track, dunkles Navy,
 * rr-display-2 (44-89px), lineares Durchschieben mit Rand-Anstupsen, kein
 * Eyebrow.
 *
 * Inhalte hier sind bewusst kurze Saetze — die NN/g-Regel "nie Fliesstext im
 * Snap trappen" wird also nicht verletzt. Kommt ein langer Absatz dazu, gehoert
 * er NICHT in diese Komponente, sondern in eine frei laufende Sektion.
 *
 * Mobile (<= 820px) und prefers-reduced-motion: der Sticky-Track faellt weg,
 * die Saetze stehen als normale vertikale Liste untereinander.
 */

export interface ScrollBumperStatement {
  text: string;
  /**
   * Schluss-Satz: bekommt einen roten Satzpunkt-Akzent. Im Standard-Bumper ist
   * der letzte Satz ohnehin das Endbild der Strecke und wird nicht mehr
   * weggeschoben; das Flag steuert daher nur noch den Punkt-Akzent (frueher
   * zusaetzlich das Halten gegen die Ausschiebe-Mechanik).
   */
  pointe?: boolean;
}

interface ScrollBumperProps {
  statements: ScrollBumperStatement[];
  /**
   * Rote Themen-Zeile oben links im Fenster ("( Thema )"). Ohne manuelle
   * Klammern uebergeben, die setzt die Klasse rr-eyebrow-theme. Optional,
   * damit bestehende Aufrufe unveraendert weiterlaufen.
   */
  label?: string;
}

export default function ScrollBumper({ statements, label }: ScrollBumperProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [degraded, setDegraded] = useState(false);

  const n = statements.length;

  // Entscheidung beim Mount (kein Live-Umschalten bei Resize: ein Wechsel
  // mitten im Scroll wuerde die Scroll-Position der Seite zerreissen).
  useEffect(() => {
    setDegraded(isBumperDegraded());
  }, []);

  useEffect(() => {
    if (degraded) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    let rafId = 0;
    let destroyed = false;

    function render() {
      const vh = window.innerHeight;
      const rect = section!.getBoundingClientRect();
      const total = rect.height - vh;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      // Gleiche Dwell-Mathe wie CasePanels, nur auf der Y-Achse.
      const units = snapUnits(p * (n - 1), n);
      stage!.style.transform = `translate3d(0, ${-units * vh}px, 0)`;
    }

    function loop() {
      if (destroyed) return;
      render();
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
    };
  }, [degraded, n]);

  const lines = statements.map((s, i) => {
    // Trennt einen etwaigen Original-Schlusspunkt ab, damit der rote
    // Punkt-Akzent den Satz nicht doppelt beendet.
    const text = s.pointe && s.text.endsWith('.') ? s.text.slice(0, -1) : s.text;
    return (
      <p key={i} className={`sb-line${s.pointe ? ' sb-line--pointe' : ''}`}>
        {text}
        {s.pointe && <span className="sb-dot">.</span>}
      </p>
    );
  });

  if (degraded) {
    return (
      <section className="sb-section sb-section--static">
        {label && <p className="rr-eyebrow-theme sb-label">{label}</p>}
        <div className="sb-static">{lines}</div>
        <ScrollBumperStyles />
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="sb-section"
      style={{ '--sb-track': `${n * BUMPER_TRACK_VH_PER_WINDOW}vh` } as React.CSSProperties}
    >
      <div className="sb-sticky">
        {label && <p className="rr-eyebrow-theme sb-label">{label}</p>}
        <div ref={stageRef} className="sb-stage" style={{ height: `${n * 100}vh` }}>
          {statements.map((s, i) => (
            <div className="sb-window" key={i} style={{ top: `${i * 100}vh` }}>
              {lines[i]}
            </div>
          ))}
        </div>
      </div>
      <ScrollBumperStyles />
    </section>
  );
}

/**
 * Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md "styled-jsx im
 * Relaunch meiden"), Klassen sind mit sb- durchgehend namespaced.
 */
function ScrollBumperStyles() {
  return (
    <style>{`
      .sb-section {
        position: relative;
        height: var(--sb-track, 380vh);
        /* Homepage-Standard: helle Flaeche, dunkler Text (Thomas 28.07.). */
        background: var(--rr-world-2-bg, #f4f4f2);
        color: #23262e;
      }
      .sb-sticky {
        position: sticky;
        top: 0;
        height: 100vh;
        overflow: hidden;
      }
      /* Rote Themen-Zeile: fix oben links im Fenster, bleibt ueber die ganze
         Strecke stehen (DESIGN_STANDARD: "Jede Bumper-Strecke traegt oben die
         rote ( Thema )-Zeile"). */
      .sb-label {
        position: absolute;
        top: clamp(24px, 6vh, 64px);
        left: 8vw;
        z-index: 2;
      }
      .sb-stage {
        position: relative;
        width: 100%;
        will-change: transform;
      }
      .sb-window {
        position: absolute;
        left: 0;
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        /* Klasse-B-Innenpadding, identisch zu den CasePanels-Fenstern. */
        padding: 0 8vw;
      }
      .sb-line {
        margin: 0;
        width: min(88%, 900px);
        text-align: center;
        /* Gleiche Headline-Groesse wie die Homepage-Panels (Thomas 28.07.). */
        font-family: var(--rr-font-display);
        font-weight: 700;
        font-size: clamp(30px, 3.6vw, 52px);
        line-height: 1.07;
        letter-spacing: -0.018em;
        color: inherit;
      }
      .sb-dot {
        color: var(--rr-red, #f12032);
      }

      /* Degradierter Zustand (<= 820px oder reduzierte Bewegung): normales
         vertikales Scrollen, kein Sticky, kein Track. */
      .sb-section--static {
        height: auto;
        padding: var(--rr-section-y, clamp(96px, 12vw, 180px)) var(--rr-gutter, clamp(20px, 4vw, 64px));
      }
      .sb-section--static .sb-label {
        position: static;
        margin-bottom: clamp(24px, 5vw, 40px);
      }
      .sb-static {
        display: flex;
        flex-direction: column;
        gap: clamp(24px, 4vw, 40px);
      }
      .sb-section--static .sb-line {
        width: auto;
        text-align: left;
      }
    `}</style>
  );
}
