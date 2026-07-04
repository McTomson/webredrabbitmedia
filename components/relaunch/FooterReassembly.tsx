"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buildWordLayout, type WordLayout } from "@/lib/relaunch/morph/pieces";
import { buildReassembly, sample, clamp01, type Keyframe } from "@/lib/relaunch/morph/grammar";

/**
 * Footer mit Wortmarken-Reassembly (Blaupause Sektion 9): die Naturbruch-Teile
 * fliegen beim Erreichen des Seitenendes zusammen und setzen "red rabbit" neu
 * zusammen — Spiegelung des Hero-Zerfalls, gleiche Grammatik (grammar.ts).
 * Klein wie beim Original (Footer-Lottie ~259x106): F deutlich unter Hero-Groesse.
 */
export default function FooterReassembly() {
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
    let tracks: Keyframe[][] = [];
    let els: HTMLDivElement[] = [];
    let raf = 0;
    let destroyed = false;

    function build() {
      const fam = getComputedStyle(probeRef.current!).fontFamily;
      const F = Math.min(72, Math.max(44, window.innerWidth * 0.055));
      const l = buildWordLayout(fam, F, window.devicePixelRatio || 1);
      if (!l || l.pieces.length < 10) return false;
      layout = l;
      box.style.width = `${l.boxW}px`;
      box.style.height = `${l.boxH}px`;
      box.innerHTML = "";
      els = l.pieces.map((p) => {
        const im = document.createElement("div");
        im.innerHTML = p.svg;
        im.style.cssText = `position:absolute;left:${p.hx}px;top:${p.hy}px;max-width:none;width:${p.w}px;height:${p.h}px;will-change:transform;`;
        box.appendChild(im);
        return im;
      });
      tracks = buildReassembly(
        l.pieces.map((p) => ({ cx: p.cx, cy: p.cy, w: p.w, h: p.h, letter: p.letter })),
        { viewportW: window.innerWidth, viewportH: window.innerHeight }
      );
      return true;
    }

    function render() {
      if (!layout) return;
      const r = track.getBoundingClientRect();
      // Fortschritt: beginnt wenn der Track ins Bild kommt, endet wenn er ansteht
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp01(-r.top / total) : 1;
      for (let i = 0; i < els.length; i++) {
        const kf = sample(tracks[i], p);
        els[i].style.transform = `translate(${kf.x}px, ${kf.y}px) rotate(${kf.rot}deg)`;
        els[i].style.opacity = p < 0.01 ? "0" : "1";
      }
    }

    function loop() {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    }

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
    };
  }, []);

  return (
    <footer ref={trackRef} style={{ height: "220vh", position: "relative" }}>
      <span ref={probeRef} aria-hidden style={{ fontFamily: "var(--rr-font-display)", position: "absolute", opacity: 0, pointerEvents: "none" }}>probe</span>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "9vh" }}>
        {reduced ? (
          <p className="rr-claim" style={{ color: "var(--rr-red)", fontWeight: 640, fontFamily: "var(--rr-font-display)" }}>red<br />rabbit</p>
        ) : (
          <div ref={boxRef} style={{ position: "relative" }} />
        )}
        <nav aria-label="Footer" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px 34px", padding: "0 24px" }}>
          <Link className="rr-link" href="/referenzen-preview">Referenzen</Link>
          <Link className="rr-link" href="/kontakt">Kontakt</Link>
          <a className="rr-link" href="mailto:office@redrabbit.media">office@redrabbit.media</a>
          <a className="rr-link" href="tel:+436769000955">+43 676 9000 955</a>
          <Link className="rr-link" href="/impressum">Impressum</Link>
          <Link className="rr-link" href="/datenschutz">Datenschutz</Link>
        </nav>
        <p className="rr-meta">&copy; {new Date().getFullYear()} Red Rabbit Media</p>
      </div>
    </footer>
  );
}
