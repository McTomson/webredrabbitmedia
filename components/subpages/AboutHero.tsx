"use client";

import { useEffect, useRef, useState } from "react";
import { clamp01, masterEase } from "@/lib/relaunch/morph/grammar";

/**
 * AUFTAKT der Unterseite (komprimiertes Startseiten-Echo): "Über uns" steht ruhig
 * gross da (DM Sans, Ink, roter Schluss-Punkt), zerfaellt beim Scrollen in die
 * Fragment-Sprache (ganze Letter, Golden-Angle-Streuung, leichte Rotation wie die
 * Hauptseite), waehrend die Crimson-Serif-Zeile per Masken-Reveal einblendet.
 *
 * Scroll-gekoppelt (vor/zurueck spielbar) ueber getBoundingClientRect + rAF, EXAKT
 * das HomeMorph-Muster (kein neues Lenis, keine GSAP). h1-Text bleibt zusammen-
 * haengender SSR-Text (uup-sr), die Letter-Ebene ist rein dekorativ (aria-hidden).
 * prefers-reduced-motion: statischer Endzustand, keine rAF-Schleife.
 */

const WORD = "Über uns";
const CHARS = [...WORD];
const GOLDEN = 137.50776; // Grad

// Deterministische Streu-Vektoren je Letter (Golden-Angle wie die Startseite).
type Scatter = { ux: number; uy: number; frac: number; rot: number };
const SCATTER: Scatter[] = CHARS.map((ch, i) => {
  const a = (i * GOLDEN * Math.PI) / 180;
  return {
    ux: Math.cos(a),
    uy: Math.sin(a),
    frac: 0.34 + (i / CHARS.length) * 0.66,
    rot: (i % 2 ? 1 : -1) * (10 + i * 4),
  };
});

export default function AboutHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const serifRef = useRef<HTMLParagraphElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const track = trackRef.current!;
    let raf = 0;
    let destroyed = false;

    function render() {
      const r = track.getBoundingClientRect();
      const p = clamp01(-r.top / (r.height - window.innerHeight));
      // Wort-Zerfall: startet nachdem das Wort kurz ruhig stand.
      const scatter = masterEase(clamp01((p - 0.26) / 0.44));
      const spread = Math.min(window.innerWidth * 0.5, 440);
      for (let i = 0; i < CHARS.length; i++) {
        const el = letterRefs.current[i];
        if (!el) continue;
        const s = SCATTER[i];
        const dist = spread * s.frac * scatter;
        const dx = s.ux * dist;
        const dy = s.uy * dist * 0.72;
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${s.rot * scatter}deg)`;
      }
      // Serif-Zeile: Masken-Reveal von links, leichter Aufstieg.
      const rev = masterEase(clamp01((p - 0.42) / 0.4));
      if (serifRef.current) {
        serifRef.current.style.clipPath = `inset(0 ${(1 - rev) * 100}% 0 0)`;
        serifRef.current.style.opacity = String(rev);
        serifRef.current.style.transform = `translateY(${(1 - rev) * 16}px)`;
      }
    }

    function loop() {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    }
    render();
    raf = requestAnimationFrame(loop);
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={trackRef} className={`uup-hero-track${reduced ? " uup-hero-reduced" : ""}`}>
      <div className="uup-hero-sticky">
        <div className="uup-hero-stage">
          <h1 className="uup-hero-word">
            <span className="uup-sr">Über uns</span>
            <span className="uup-hero-letters" aria-hidden="true">
              {CHARS.map((ch, i) => (
                <span
                  key={i}
                  ref={(el) => { letterRefs.current[i] = el; }}
                  className={`uup-hero-letter${ch === " " ? " uup-hero-letter--space" : ""}`}
                >
                  {ch === " " ? " " : ch}
                </span>
              ))}
              <span className="uup-hero-dot" aria-hidden="true">.</span>
            </span>
          </h1>
          <p ref={serifRef} className="uup-hero-serif">
            Die Agentur, die fair rechnet.
          </p>
        </div>
      </div>
    </div>
  );
}
