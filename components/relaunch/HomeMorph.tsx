"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { buildWordLayout } from "@/lib/relaunch/morph/pieces";
import { clamp01, masterEase } from "@/lib/relaunch/morph/grammar";
import {
  buildStagePlan, sampleTimeline, U_HERO, U_TOTAL,
  type PieceTimeline, type PoolPieceIn, type SceneLayout,
} from "@/lib/relaunch/morph/stage";
import { SCENE_TEXTS } from "@/lib/relaunch/morph/scene-content";

/**
 * Durchgehende Morph-Buehne: Wortmarke -> Kontraktion -> Burst mit sichtbarer
 * Teile-Vermehrung -> Vollbild-Zerfall -> 5 Formations-Szenen (vermessene
 * Original-Kompositionen, Seiten-Alternierung) — OHNE leeren Screen, ein
 * Teile-Pool ueber die ganze Fahrt (at-Struktur: EIN Lottie, kein Schnitt).
 */
export default function HomeMorph({ claim }: { claim: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const claimRef = useRef<HTMLHeadingElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const track = trackRef.current!, stage = stageRef.current!;
    let timelines: PieceTimeline[] = [];
    let sceneLayouts: SceneLayout[] = [];
    let els: HTMLDivElement[] = [];
    let raf = 0;
    let destroyed = false;

    // schwerere Daempfung als Default — at-Fahrt wirkt gedaempfter (Delta-Punkt 8)
    const lenis = new Lenis({ autoRaf: false, lerp: 0.075 });

    function build() {
      const fam = getComputedStyle(probeRef.current!).fontFamily;
      const F = Math.min(150, Math.max(56, window.innerWidth * 0.125));
      const layout = buildWordLayout(fam, F, window.devicePixelRatio || 1);
      if (!layout || layout.pieces.length < 10) return false;

      // Pool: Original-Teile + Klone bis zur groessten Formation (~175).
      // Klon-Quellen kuratiert: der reine Kreis (i-Punkt) wirkt im Vergleich
      // zu den kalligrafischen at-Fragmenten schwach -> nicht vervielfachen.
      const POOL_N = 175;
      const cloneSrcs = layout.pieces
        .map((p, idx) => ({ p, idx }))
        .filter(({ p }) => !(Math.max(p.w / p.h, p.h / p.w) < 1.2 && Math.max(p.w, p.h) < 0.3 * F))
        .map(({ idx }) => idx);
      const pool: PoolPieceIn[] = [];
      const srcOf: number[] = [];
      for (let i = 0; i < POOL_N; i++) {
        const si = i < layout.pieces.length ? i : cloneSrcs[i % cloneSrcs.length];
        const src = layout.pieces[si];
        pool.push({ cx: src.cx, cy: src.cy, w: src.w, h: src.h, letter: src.letter, clone: i >= layout.pieces.length });
        srcOf.push(si);
      }
      const plan = buildStagePlan(pool, { w: window.innerWidth, h: window.innerHeight });
      timelines = plan.timelines;
      sceneLayouts = plan.scenes;

      // Schaerfe: Element in seiner GROESSTEN Verwendung rendern und Timeline-Scales
      // darauf normieren — CSS-transform darf nur noch verkleinern (Upscale = Matsch).
      timelines.forEach((tl, i) => {
        let m = 0;
        const states = new Set<{ scale: number }>();
        tl.segs.forEach((s) => { states.add(s.a); states.add(s.b); });
        states.forEach((st) => { m = Math.max(m, st.scale); });
        if (m > 1) {
          states.forEach((st) => { st.scale /= m; });
          const p = pool[i];
          p.w *= m; p.h *= m;
        }
      });

      stage.innerHTML = "";
      els = pool.map((p, i) => {
        const el = document.createElement("div");
        el.innerHTML = layout.pieces[srcOf[i]].svg;
        el.style.cssText =
          `position:absolute;left:50%;top:50%;max-width:none;width:${p.w}px;height:${p.h}px;` +
          `margin-left:${-p.w / 2}px;margin-top:${-p.h / 2}px;will-change:transform;opacity:${p.clone ? 0 : 1};`;
        stage.appendChild(el);
        return el;
      });

      // Statement-Bloecke auf die Gegenseite der jeweiligen Formation setzen;
      // mobil: Formation zentriert oben, Text unten ueber die volle Breite
      const narrow = window.innerWidth < 900;
      textRefs.current.forEach((el, s) => {
        if (!el || !sceneLayouts[s]) return;
        el.dataset.center = narrow ? "0" : "1";
        if (narrow) {
          el.style.left = "24px";
          el.style.right = "24px";
          el.style.top = "auto";
          el.style.bottom = "7vh";
          el.style.maxWidth = "none";
        } else {
          const side = sceneLayouts[s].textSide;
          el.style.left = side === "left" ? "var(--rr-gutter)" : "auto";
          el.style.right = side === "right" ? "var(--rr-gutter)" : "auto";
          el.style.top = "50%";
          el.style.bottom = "auto";
          el.style.maxWidth = "min(40%, 560px)";
        }
      });
      return true;
    }

    function render() {
      if (!timelines.length) return;
      const r = track.getBoundingClientRect();
      const p = clamp01(-r.top / (r.height - window.innerHeight));
      const u = p * U_TOTAL;

      for (let i = 0; i < els.length; i++) {
        const st = sampleTimeline(timelines[i], u);
        els[i].style.transform = `translate(${st.x}px, ${st.y}px) rotate(${st.rot}deg) scale(${st.scale})`;
        els[i].style.opacity = String(st.o);
      }

      // Hero-Claim: sichtbar bis zur Kontraktion, dann raus
      if (claimRef.current) {
        const co = 1 - clamp01((u - 0.18) / 0.3);
        claimRef.current.style.opacity = String(co);
        claimRef.current.style.transform = `translateY(${(1 - co) * -18}px)`;
      }

      // R3: Statement steigt VON UNTEN hoch waehrend die Formation entsteht —
      // nie vorher da, nie nachher eingeblendet. Szene 0 laeuft waehrend des
      // Hero-Einflugs (eigenes tin-Fenster ab u=1.9).
      textRefs.current.forEach((el, s) => {
        if (!el) return;
        const local = u - (U_HERO + s);
        const isLast = s === textRefs.current.length - 1;
        const tin = s === 0 ? clamp01((u - 1.9) / 0.45) : clamp01((local - 0.22) / 0.35);
        // Ausblenden erst ab local 1.05
        const tout = isLast ? 1 : clamp01((1.4 - local) / 0.35);
        const eased = masterEase(tin);
        const o = eased * tout;
        el.style.opacity = String(o);
        const base = el.dataset.center === "1" ? "translateY(-50%) " : "";
        // Aufstieg von +56px (tin=0) auf 0 (tin=1)
        el.style.transform = `${base}translateY(${(1 - eased) * 56}px)`;
      });
    }

    function loop(time: number) {
      if (destroyed) return;
      lenis.raf(time);
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
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={trackRef} style={{ height: `${U_TOTAL * 150 + 100}vh`, position: "relative" }}>
      <span ref={probeRef} aria-hidden style={{ fontFamily: "var(--rr-font-display)", position: "absolute", opacity: 0, pointerEvents: "none" }}>probe</span>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        {/* Teile-Buehne: Origin = Viewport-Zentrum */}
        {!reduced && <div ref={stageRef} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }} />}

        {/* Hero-Claim ueber der Wortmarke */}
        <div style={{ position: "absolute", left: 0, right: 0, top: "11vh", textAlign: "center", pointerEvents: "none" }}>
          <h1 ref={claimRef} className="rr-claim" style={{ padding: "0 24px" }}>{claim}</h1>
        </div>

        {reduced && (
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <p className="rr-display-2" style={{ color: "var(--rr-red)", fontWeight: 640 }}>red<br />rabbit</p>
          </div>
        )}

        {/* Statements (SEO-Text immer im DOM), Seite = Gegenseite der Formation */}
        {!reduced && SCENE_TEXTS.map((t, i) => (
          <div
            key={t.key}
            ref={(el) => { textRefs.current[i] = el; }}
            style={{ position: "absolute", right: "var(--rr-gutter)", top: "50%", transform: "translateY(-50%)", maxWidth: "min(40%, 560px)", opacity: 0 }}
          >
            <h2 className="rr-eyebrow-lg" style={{ marginBottom: 18 }}>{t.eyebrow}</h2>
            <p className="rr-statement">{t.statement}</p>
          </div>
        ))}
      </div>
      {/* reduced-motion: Statements als normale Sektionen */}
      {reduced && SCENE_TEXTS.map((t) => (
        <section key={t.key} className="rr-section">
          <div className="rr-wrap">
            <h2 className="rr-eyebrow-lg" style={{ marginBottom: 18 }}>{t.eyebrow}</h2>
            <p className="rr-statement">{t.statement}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
