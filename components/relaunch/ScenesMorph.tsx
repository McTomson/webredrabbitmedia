"use client";

import { useEffect, useRef } from "react";
import { PIECES, renderPiece } from "@/lib/relaunch/morph/pieces";
import { FORMATIONS, type FormationPoint } from "@/lib/relaunch/morph/formations";
import { masterEase, clamp01, makeRng } from "@/lib/relaunch/morph/grammar";

/**
 * 5 Leistungs-Szenen (Blaupause Sektion 3): ein Teile-Pool formiert sich pro
 * Szene zu einem Motiv. Assembly-Grammatik aus der Messung (§0.5): Starts
 * gestaffelt (0.08..0.29 der Phase), Ankuenfte 0.67..0.875, Rotation endet
 * exakt bei Ankunft, Scale passt Teile ins Motiv (Vermehrungs-Mechanik).
 */
export default function ScenesMorph() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const track = trackRef.current!, stage = stageRef.current!;
    let destroyed = false;
    let raf = 0;

    interface PoolPiece {
      el: HTMLDivElement;
      w: number;
      h: number;
      /** Rotations-Offset, damit die Laengsachse des Teils der Kantenrichtung folgt */
      rotOff: number;
      /** pro Szene: Ziel {x,y,rot,s} + Stagger-Fenster [t0,t1] */
      targets: { x: number; y: number; rot: number; s: number; t0: number; t1: number; spin: number }[];
    }
    let pool: PoolPiece[] = [];
    const N_SCENES = FORMATIONS.length;

    function build() {
      const fam = getComputedStyle(probeRef.current!).fontFamily;
      const rng = makeRng(41);
      const dpr = window.devicePixelRatio || 1;
      // G3-Teile: alle 14 Naturbruch-Teile einmal rendern, Pool zieht Kopien
      const rendered: { svg: string; w: number; h: number }[] = [];
      const S = Math.max(2, Math.ceil((90 * dpr) / 100));
      for (const ch of Object.keys(PIECES)) {
        for (const rects of PIECES[ch]) {
          const p = renderPiece(ch, rects, fam, S);
          if (p) rendered.push({ svg: p.svg, w: p.w, h: p.h });
        }
      }
      if (rendered.length < 10) return false;

      // Formationen vorberechnen; Pool-Groesse = groesste Formation
      const formations = FORMATIONS.map((f) => f.build());
      const poolN = Math.max(...formations.map((f) => f.length));
      const scale = Math.min(window.innerWidth, window.innerHeight) * 0.62;
      const baseSize = Math.min(window.innerWidth, window.innerHeight) * 0.045;

      // at-Logik: Kanten bekommen LAENGLICHE Teile (Perlenkette), Punkte runde.
      const elongated = rendered.filter((r) => Math.max(r.w / r.h, r.h / r.w) >= 1.5);
      const roundish = rendered.filter((r) => Math.max(r.w / r.h, r.h / r.w) < 1.5);
      const dotSlots = 3; // Formationen haengen ihre Punkt-Rollen ans Ende

      stage.innerHTML = "";
      pool = [];
      for (let i = 0; i < poolN; i++) {
        const useRound = i >= poolN - dotSlots && roundish.length > 0;
        const src = useRound
          ? roundish[i % roundish.length]
          : (elongated.length ? elongated[i % elongated.length] : rendered[i % rendered.length]);
        // Laengsachse ausrichten: hochkant-Teile brauchen -90, damit "entlang der Kante" stimmt
        const rotOff = !useRound && src.h > src.w ? -90 : 0;
        const el = document.createElement("div");
        el.innerHTML = src.svg;
        const w = baseSize * (src.w / Math.max(src.w, src.h));
        const h = baseSize * (src.h / Math.max(src.w, src.h));
        el.style.cssText = `position:absolute;left:50%;top:50%;max-width:none;width:${w}px;height:${h}px;margin-left:${-w / 2}px;margin-top:${-h / 2}px;will-change:transform;opacity:0;`;
        stage.appendChild(el);

        const targets = formations.map((form) => {
          // Punkt zuweisen; ueberzaehlige Pool-Teile parken offscreen (Formation kleiner als Pool)
          const pt: FormationPoint | undefined = form[i];
          const t0 = 0.08 + rng() * 0.21;   // gemessen: Starts 2..7 von 24
          const t1 = 0.67 + rng() * 0.205;  // gemessen: Ankuenfte 16..21 von 24
          const spin = (rng() < 0.5 ? -1 : 1) * (40 + rng() * 110); // endet bei Ankunft
          if (!pt) {
            const a = rng() * Math.PI * 2;
            const r = Math.hypot(window.innerWidth, window.innerHeight) * 0.75;
            return { x: Math.cos(a) * r, y: Math.sin(a) * r, rot: 0, s: 1, t0, t1, spin };
          }
          return { x: pt.x * scale, y: pt.y * scale, rot: pt.rot, s: pt.s, t0, t1, spin };
        });
        pool.push({ el, w, h, rotOff, targets });
      }
      return true;
    }

    function render() {
      if (!pool.length) return;
      const r = track.getBoundingClientRect();
      const p = clamp01(-r.top / (r.height - window.innerHeight));
      const seg = Math.min(N_SCENES - 1, Math.floor(p * N_SCENES));
      const local = clamp01(p * N_SCENES - seg);

      for (const pc of pool) {
        const to = pc.targets[seg];
        // Herkunft: vorige Formation oder (Szene 0) verstreut von aussen
        const from = seg === 0
          ? { x: to.x * 3.5 + 40, y: to.y * 3.5 - 60, rot: to.rot - to.spin, s: to.s }
          : pc.targets[seg - 1];
        const u = masterEase(clamp01((local - to.t0) / (to.t1 - to.t0)));
        const x = from.x + (to.x - from.x) * u;
        const y = from.y + (to.y - from.y) * u;
        // Rotation: Herkunft = Ziel minus spin -> dreht im Transit, endet EXAKT bei Ankunft (gemessen §0.4)
        const rotFrom = (seg === 0 ? to.rot : from.rot) - to.spin;
        const rotV = rotFrom + (to.rot - rotFrom) * u;
        const s = (seg === 0 ? to.s : from.s) + (to.s - (seg === 0 ? to.s : from.s)) * u;
        pc.el.style.opacity = p < 0.005 ? "0" : "1";
        pc.el.style.transform = `translate(${x}px, ${y}px) rotate(${rotV + pc.rotOff}deg) scale(${s})`;
      }
      // Statements: aktives Segment einblenden
      textRefs.current.forEach((el, i) => {
        if (!el) return;
        const active = i === seg;
        const tp = active ? clamp01((local - 0.25) / 0.2) * (local > 0.92 ? clamp01((1 - local) / 0.08) : 1) : 0;
        el.style.opacity = String(tp);
        el.style.transform = `translateY(${(1 - tp) * 24}px)`;
      });
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
    <div ref={trackRef} style={{ height: `${FORMATIONS.length * 160}vh`, position: "relative" }}>
      <span ref={probeRef} aria-hidden style={{ fontFamily: "var(--rr-font-display)", position: "absolute", opacity: 0, pointerEvents: "none" }}>probe</span>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        {/* Motiv-Buehne (Zentrum rechts der Mitte, Text links — all-turtles-Anordnung) */}
        <div ref={stageRef} style={{ position: "absolute", left: "34%", top: "50%" }} />
        {FORMATIONS.map((f, i) => (
          <div
            key={f.key}
            ref={(el) => { textRefs.current[i] = el; }}
            style={{ position: "absolute", right: "var(--rr-gutter)", top: "50%", transform: "translateY(-50%)", maxWidth: "38%", opacity: 0 }}
          >
            <h2 className="rr-eyebrow-lg" style={{ marginBottom: 18 }}>{f.eyebrow}</h2>
            <p className="rr-statement">{f.statement}</p>
          </div>
        ))}
        {/* SEO/reduced-motion: Inhalte sind als Text im DOM (oben); Motive sind Dekoration */}
      </div>
    </div>
  );
}
