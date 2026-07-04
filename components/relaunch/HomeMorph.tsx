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
import atShapes from "@/lib/relaunch/morph/at-shapes-comp1.json";

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
    let camWrap: HTMLDivElement | null = null;
    let cameraFn: ((u: number) => { k: number; tx: number; ty: number }) | null = null;
    let raf = 0;
    let destroyed = false;

    // schwerere Daempfung als Default — at-Fahrt wirkt gedaempfter (Delta-Punkt 8)
    const lenis = new Lenis({ autoRaf: false, lerp: 0.075 });

    function build() {
      const fam = getComputedStyle(probeRef.current!).fontFamily;
      const F = Math.min(150, Math.max(56, window.innerWidth * 0.125));
      const layout = buildWordLayout(fam, F, window.devicePixelRatio || 1);
      if (!layout || layout.pieces.length < 10) return false;

      // Pool: 18 Wortmarken-Teile + die extrahierten all-turtles-Original-
      // Teilformen (atShapes.pieces) fuer Szene 0.
      const kBase = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      const pool: PoolPieceIn[] = [];
      const srcOf: number[] = [];
      layout.pieces.forEach((src, idx) => {
        pool.push({ cx: src.cx, cy: src.cy, w: src.w, h: src.h, letter: src.letter, clone: false });
        srcOf.push(idx);
      });
      atShapes.pieces.forEach((jp, idx) => {
        const elW = jp.w * Math.abs(jp.sx) * kBase;
        const elH = jp.h * Math.abs(jp.sy) * kBase;
        pool.push({ cx: 0, cy: 0, w: elW, h: elH, letter: -1, clone: true, at: idx });
        srcOf.push(-1);
      });
      // Farbtupfer (Tomson 05.07.): GENAU EIN laengliches Teil in Dunkelblau —
      // deterministisch das gestreckteste Teil der Formation.
      const navyIdx = atShapes.pieces.reduce((best, jp, idx) => {
        const asp = (jp2: typeof jp) => {
          const W = jp2.w * Math.abs(jp2.sx), H = jp2.h * Math.abs(jp2.sy);
          return Math.max(W / H, H / W);
        };
        return asp(jp) > asp(atShapes.pieces[best]) ? idx : best;
      }, 0);
      const plan = buildStagePlan(pool, { w: window.innerWidth, h: window.innerHeight });
      timelines = plan.timelines;
      sceneLayouts = plan.scenes;
      cameraFn = plan.camera;

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
      // Kamera-Wrapper: nimmt ALLE at-Teile auf (Zoom/Pan der Szene-0-Fahrt);
      // die 18 Wortmarken-Teile haengen direkt in der Stage.
      camWrap = document.createElement("div");
      camWrap.style.cssText = "position:absolute;inset:0;will-change:transform;transform-origin:50% 50%;";
      stage.appendChild(camWrap);
      els = pool.map((p, i) => {
        const el = document.createElement("div");
        if (p.at != null) {
          const jp = atShapes.pieces[p.at];
          el.innerHTML = `<svg width="100%" height="100%" viewBox="${-jp.w / 2} ${-jp.h / 2} ${jp.w} ${jp.h}" preserveAspectRatio="none" style="display:block;overflow:visible"><g transform="scale(${jp.sx < 0 ? -1 : 1} ${jp.sy < 0 ? -1 : 1})"><path d="${jp.d}" fill="${p.at === navyIdx ? "#1C2837" : "#F12032"}"/></g></svg>`;
        } else {
          el.innerHTML = layout.pieces[srcOf[i]].svg;
        }
        el.style.cssText =
          `position:absolute;left:50%;top:50%;max-width:none;width:${p.w}px;height:${p.h}px;` +
          `margin-left:${-p.w / 2}px;margin-top:${-p.h / 2}px;will-change:transform;opacity:1;`;
        (p.at != null ? camWrap! : stage).appendChild(el);
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

      // Kamera-Fahrt (Szene 0): Zoom/Pan des at-Teile-Wrappers.
      if (cameraFn && camWrap) {
        const c = cameraFn(u);
        camWrap.style.transform = `translate(${c.tx}px, ${c.ty}px) scale(${c.k})`;
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
