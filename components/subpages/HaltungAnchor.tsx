"use client";

import { useEffect, useRef } from "react";
import { clamp01, masterEase } from "@/lib/relaunch/morph/grammar";

/**
 * HALTUNGS-ANKER: Outline-Riesenwort "HALTUNG" (-webkit-text-stroke) fuellt sich
 * beim Vorbeiscrollen von links nach rechts rot (Draw-Line-/P4-Sprache) — hier per
 * clip-path statt scaleX, damit die Buchstabenform beim Fuellen erhalten bleibt.
 * Darunter drei kurze Statements aus brand/decisions-log.md.
 *
 * Scroll-gekoppelt (getBoundingClientRect + rAF, reversibel). Nur clip-path/opacity.
 * prefers-reduced-motion: Wort voll gefuellt, keine rAF-Schleife.
 */
const STATEMENTS = [
  "Kein Kleingedrucktes.",
  "Erst der Entwurf, dann das Geld.",
  "Klartext statt Agentur-Sprech.",
];

export default function HaltungAnchor() {
  const secRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sec = secRef.current!;
    let raf = 0;
    let destroyed = false;

    function render() {
      const r = sec.getBoundingClientRect();
      const p = clamp01((window.innerHeight - r.top) / (window.innerHeight + r.height * 0.4));
      const fill = masterEase(clamp01((p - 0.12) / 0.5));
      if (fillRef.current) {
        fillRef.current.style.clipPath = `inset(0 ${(1 - fill) * 100}% 0 0)`;
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
    <section ref={secRef} className="rr-section uup-haltung">
      <div className="rr-wrap">
        <div className="uup-haltung__wordwrap" aria-hidden="true">
          <span className="uup-haltung__word uup-haltung__word--outline">HALTUNG</span>
          <span ref={fillRef} className="uup-haltung__word uup-haltung__word--fill">HALTUNG</span>
        </div>
        <h2 className="uup-sr">Unsere Haltung</h2>
        <ul className="uup-haltung__list">
          {STATEMENTS.map((s) => (
            <li key={s} className="uup-haltung__item">
              <span className="uup-haltung__num" aria-hidden="true" />
              <p className="uup-haltung__stmt">{s}</p>
              <div className="uup-haltung__rule" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
