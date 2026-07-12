"use client";

import { useEffect, useRef, useState } from "react";
import { clamp01, masterEase } from "@/lib/relaunch/morph/grammar";

/**
 * AUFTAKT nach K95-Muster (Umbau 12.07., Tomson-Feedback):
 * (a) ANKOMMEN: "Über uns" fuellt die Breite RANDABSCHNEIDEND (27vw, nowrap,
 *     zentriert; das sticky overflow:hidden schneidet beide Enden an), roter
 *     Punkt-Akzent, Off-White-Grund. Sonst nichts.
 * (b) PHASE 1: der ECHTE Intro-Text (Claim + 2 Absaetze: Anti-Agentur, faire
 *     Festpreise, Entwurf ohne Vorkasse) blendet gestaffelt in der unteren Zone
 *     ein, der Titel bleibt gross stehen. Text steht frei, keine Buchstaben davor.
 * (c) PHASE 2: erst danach fliegen die Titel-Buchstaben auseinander — NUR nach
 *     oben/aussen (Exclusion-Zone: die Textzone unten wird nie ueberflogen) und
 *     die Formel mappt bis p=1.0 (kein eingefrorener toter Scroll mehr). Der
 *     Intro-Text bleibt bis zum Sticky-Release voll sichtbar -> kein leerer
 *     Screen, die naechste Sektion schiebt direkt nach.
 *
 * Scroll-gekoppelt und reversibel (getBoundingClientRect + rAF, HomeMorph-
 * Muster, kein eigenes Lenis). h1 + Intro sind echter SSR-Text; die Letter-
 * Ebene ist aria-hidden. prefers-reduced-motion: statischer Zustand, keine rAF.
 */

const WORD = "Über uns";
const CHARS = [...WORD];
const GOLDEN = 137.50776; // Grad

// Deterministische Streu-Vektoren je Letter (Golden-Angle). Die vertikale
// Komponente wird im Render IMMER nach oben gerichtet (Exclusion-Zone unten).
type Scatter = { ux: number; uy: number; frac: number; rot: number };
const SCATTER: Scatter[] = CHARS.map((_ch, i) => {
  const a = (i * GOLDEN * Math.PI) / 180;
  return {
    ux: Math.cos(a),
    uy: Math.sin(a),
    frac: 0.42 + (i / CHARS.length) * 0.58,
    rot: (i % 2 ? 1 : -1) * (12 + i * 4),
  };
});

export default function AboutHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
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

      // (b) Intro-Text: gestaffelt einblenden, bleibt danach voll sichtbar.
      const stag: Array<[HTMLElement | null, number]> = [
        [ledeRef.current, 0.1],
        [p1Ref.current, 0.2],
        [p2Ref.current, 0.3],
      ];
      for (const [el, start] of stag) {
        if (!el) continue;
        const t = masterEase(clamp01((p - start) / 0.16));
        el.style.opacity = String(t);
        el.style.transform = `translateY(${(1 - t) * 26}px)`;
      }

      // (c) Zerfall: mappt bis exakt p=1.0 (QA-Blocker 2 behoben), Flugbahnen
      // NUR nach oben/aussen (QA-Blocker 1: Textzone unten nie ueberdeckt).
      const s = masterEase(clamp01((p - 0.52) / 0.48));
      const spread = Math.max(window.innerWidth, window.innerHeight) * 0.85;
      const fade = 1 - clamp01((s - 0.55) / 0.45); // am Ende sauber weg
      for (let i = 0; i < CHARS.length; i++) {
        const el = letterRefs.current[i];
        if (!el) continue;
        const sc = SCATTER[i];
        const dist = spread * sc.frac * s;
        const dx = sc.ux * dist * 1.25;
        const dy = -(0.4 + Math.abs(sc.uy) * 0.85) * dist; // immer aufwaerts
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${sc.rot * s}deg)`;
        el.style.opacity = String(fade);
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${60 * s}px, ${-spread * 0.7 * s}px)`;
        dotRef.current.style.opacity = String(fade);
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
        {/* (a) Randabschneidender Titel, roter Punkt-Akzent */}
        <h1 className="uup-hero-word">
          <span className="uup-sr">Über uns</span>
          <span className="uup-hero-letters" aria-hidden="true">
            {CHARS.map((ch, i) => (
              <span
                key={i}
                ref={(el) => { letterRefs.current[i] = el; }}
                className={`uup-hero-letter${ch === " " ? " uup-hero-letter--space" : ""}`}
              >
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
        </h1>
        <span ref={dotRef} className="uup-hero-dot" aria-hidden="true" />

        {/* (b) Echter Intro-Text (SSR), untere Zone; Buchstaben fliegen nie hierher */}
        <div className="uup-hero-intro">
          <p ref={ledeRef} className="uup-hero-lede">Die Agentur, die fair rechnet.</p>
          <p ref={p1Ref} className="uup-hero-p">
            Red Rabbit Media ist eine Webdesign-Agentur aus Österreich. Wir bauen
            Websites für den Mittelstand, für Handwerk, Gastronomie, Ärzte, Kanzleien
            und Dienstleister. Kein Agentur-Sprech, keine Meeting-Marathons, keine
            intransparenten Stundensätze, sondern faire Festpreise.
          </p>
          <p ref={p2Ref} className="uup-hero-p">
            Anti-Agentur heißt: Du siehst zuerst das Ergebnis. Den Entwurf bekommst du
            ohne Vorkasse, eine Anzahlung fällt erst an, wenn du zusagst. Wir sagen dir
            klar, was Sinn ergibt und was nicht.
          </p>
        </div>
      </div>
    </div>
  );
}
