"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { buildWordLayout, type WordLayout } from "@/lib/relaunch/morph/pieces";
import { buildHeroChoreo, sample, clamp01, type HeroChoreo } from "@/lib/relaunch/morph/grammar";

/**
 * Hero-Morph P1: Wortmarke -> Kontraktion -> Burst -> Zerfall (Scroll-gescrubbt).
 * Choreografie = Keyframes nach gemessener all-turtles-Grammatik
 * (docs/MORPH_SYSTEM_BAUPLAN.md §0). Lenis liefert das Scroll-Smoothing.
 */
export default function HeroMorph({ claim }: { claim: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const track = trackRef.current!, box = boxRef.current!;
    let layout: WordLayout | null = null;
    let choreo: HeroChoreo[] = [];
    let els: HTMLImageElement[] = [];
    let raf = 0;
    let destroyed = false;

    const lenis = new Lenis({ autoRaf: false });

    function build() {
      // next/font hasht den Familiennamen -> aus der Probe aufloesen (nie raten)
      const fam = getComputedStyle(probeRef.current!).fontFamily;
      const F = Math.min(150, Math.max(56, window.innerWidth * 0.125));
      const l = buildWordLayout(fam, F, window.devicePixelRatio || 1);
      if (!l || l.pieces.length < 10) return false; // Font noch nicht bereit
      layout = l;
      box.style.width = `${l.boxW}px`;
      box.style.height = `${l.boxH}px`;
      box.innerHTML = "";
      els = l.pieces.map((p) => {
        const im = document.createElement("img");
        im.src = p.url;
        im.alt = "";
        im.style.cssText = `position:absolute;left:${p.hx}px;top:${p.hy}px;width:${p.w}px;height:${p.h}px;will-change:transform;`;
        box.appendChild(im);
        return im;
      });
      choreo = buildHeroChoreo(
        l.pieces.map((p) => ({ cx: p.cx, cy: p.cy, w: p.w, h: p.h, letter: p.letter })),
        { wordW: l.boxW, wordH: l.boxH, viewportW: window.innerWidth, viewportH: window.innerHeight, fontPx: F }
      );
      return true;
    }

    function render() {
      if (!layout) return;
      const r = track.getBoundingClientRect();
      const p = clamp01(-r.top / (r.height - window.innerHeight));
      for (let i = 0; i < els.length; i++) {
        const c = choreo[i];
        const kf = p < c.splitAt ? sample(c.letterTrack, p) : sample(c.pieceTrack, p);
        els[i].style.transform = `translate(${kf.x}px, ${kf.y}px) rotate(${kf.rot}deg)`;
      }
    }

    function loop(time: number) {
      if (destroyed) return;
      lenis.raf(time);
      render();
      raf = requestAnimationFrame(loop);
    }

    // Font laden, dann bauen (mit Retry, fail-closed statt kaputter Teile)
    let tries = 0;
    function tryBuild() {
      if (destroyed) return;
      if (build()) { render(); return; }
      if (++tries < 30) setTimeout(tryBuild, 200);
    }
    document.fonts.ready.then(tryBuild);
    raf = requestAnimationFrame(loop);

    const onResize = () => { build(); render(); };
    window.addEventListener("resize", onResize);
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={trackRef} style={{ height: "320vh", position: "relative" }}>
      {/* Font-Probe: liefert den echten (gehashten) Fraunces-Familiennamen */}
      <span ref={probeRef} aria-hidden style={{ fontFamily: "var(--rr-font-display)", position: "absolute", opacity: 0, pointerEvents: "none" }}>probe</span>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 className="rr-claim" style={{ marginBottom: "8vh", padding: "0 24px" }}>{claim}</h1>
          {reduced ? (
            <p className="rr-display-2" style={{ color: "var(--rr-red)", fontWeight: 640 }}>red<br />rabbit</p>
          ) : (
            <div ref={boxRef} style={{ position: "relative", margin: "0 auto" }} />
          )}
        </div>
      </div>
    </div>
  );
}
