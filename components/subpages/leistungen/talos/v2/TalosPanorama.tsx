'use client';

import { useEffect, useRef, useState } from 'react';
import { clamp01 } from '@/lib/relaunch/morph/grammar';
import {
  BUMPER_TRACK_VH_PER_WINDOW,
  prefersReducedMotion,
  rideUnits,
} from '@/lib/relaunch/scroll-standard';
import VorherNachher from './VorherNachher';
import TalosTest from './TalosTest';

/**
 * TalosPanorama — horizontale 2-Fenster-Fahrt (Thomas 07.08.: "nach dem
 * Bereich nach rechts scrollen zum naechsten, dann wieder normal runter"):
 * Fenster 1 = VorherNachher, Fenster 2 = TalosTest. Mechanik 1:1 aus dem
 * abgenommenen PanelTrack (components/relaunch/CasePanels.tsx): Track
 * N*BUMPER_TRACK_VH_PER_WINDOW hoch, sticky 100vh-Buehne, translateX ueber
 * snapUnits (Snap-Dwell-Standard, lib/relaunch/scroll-standard.ts). OHNE
 * Riesen-Wort (hier nicht gebraucht, kein Overengineering).
 *
 * Degradiert (prefers-reduced-motion ODER <=820px, Entscheidung am Mount wie
 * im Vorbild): beide Sektionen normal untereinander, vertikales Scrollen.
 * data-rr-snap sitzt am Track (Einstieg rastet ein), innen regiert das
 * Dwell-System (data-rr-snap-exempt) — deshalb tragen VorherNachher/TalosTest
 * selbst KEIN data-rr-snap mehr.
 */
const N = 2;

export default function TalosPanorama() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [degraded, setDegraded] = useState(false);

  useEffect(() => {
    setDegraded(
      prefersReducedMotion() ||
        window.matchMedia('(max-width: 820px)').matches
    );
  }, []);

  useEffect(() => {
    if (degraded) return;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    let raf = 0;
    let destroyed = false;

    function render() {
      if (!track || !stage) return;
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp01(-r.top / total) : 0;
      const units = rideUnits(p * (N - 1), N);
      stage.style.transform = `translate3d(${-units * window.innerWidth}px, 0, 0)`;
    }

    function loop() {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
    };
  }, [degraded]);

  if (degraded) {
    return (
      <div className="tl-pan tl-pan--flat">
        <VorherNachher />
        <TalosTest />
      </div>
    );
  }

  return (
    <div
      ref={trackRef}
      className="tl-pan"
      data-rr-snap
      data-rr-snap-exempt
      style={{ height: `${N * BUMPER_TRACK_VH_PER_WINDOW}vh`, position: 'relative' }}
    >
      <div className="tl-pan__viewport">
        <div
          ref={stageRef}
          className="tl-pan__stage"
          style={{ width: `${N * 100}vw` }}
        >
          <div className="tl-pan__seg" style={{ left: '0vw' }}>
            <VorherNachher />
          </div>
          <div className="tl-pan__seg" style={{ left: '100vw' }}>
            <TalosTest />
          </div>
        </div>
      </div>
    </div>
  );
}
