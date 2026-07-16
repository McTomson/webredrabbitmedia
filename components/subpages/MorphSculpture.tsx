"use client";

import { useEffect, useRef, useState } from "react";
import {
  buildStagePlan, sampleTimeline, U_HERO, U_TOTAL,
  type PieceTimeline, type PoolPieceIn, type SceneLayout,
} from "@/lib/relaunch/morph/stage";
import atShapes1 from "@/lib/relaunch/morph/at-shapes-comp1.json";
import atShapes2 from "@/lib/relaunch/morph/at-shapes-comp2.json";
import atShapes3 from "@/lib/relaunch/morph/at-shapes-comp3.json";
import atShapes4 from "@/lib/relaunch/morph/at-shapes-comp4.json";
import atShapes5 from "@/lib/relaunch/morph/at-shapes-comp5.json";

/** Alle 5 vermessenen Kompositionen (Index = Szene) — identisch zu HomeMorph. */
const COMPS = [atShapes1, atShapes2, atShapes3, atShapes4, atShapes5];

/**
 * Wiederverwendbares Skulptur-Modul: rendert GENAU EINE Skulptur `COMPS[comp]`
 * pixelgleich zur Hauptseite (`HomeMorph.tsx`) — dieselbe Pool-/Timeline-/Camera-
 * Maschine, nur auf eine Szene reduziert.
 *
 * Getrieben von `progress` 0..1 (Prop oder `window.__sculptProgress`):
 *   0        -> Fragmente unsichtbar / offscreen (vor dem Einflug),
 *   0.4..0.7 -> voll zusammengesetzt / gehalten (identisch zur Hauptseite),
 *   1        -> wieder aufgeloest (Einflug rueckwaerts, offscreen).
 *
 * Bewusst KEIN Wortmarken-Anteil im Pool: die Wortmarken-Teile beeinflussen die
 * Szenen-Teil-Timelines/Kameras nachweislich nicht (k, slotScale, Schaerfe-
 * Normierung und Kamera sind pool-unabhaengig), darum bleibt das Szenen-Rendering
 * byte-fuer-byte gleich, waehrend der Aufbau schlanker wird.
 */
export default function MorphSculpture({
  comp,
  progress,
  className,
  style,
}: {
  comp: number;
  /** 0..1. Wenn nicht gesetzt, liest die Komponente `window.__sculptProgress` (Default 0.55 = gehalten). */
  progress?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number | undefined>(progress);
  progressRef.current = progress;
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) setReduced(true);

    let timelines: PieceTimeline[] = [];
    let sceneLayouts: SceneLayout[] = [];
    let cameras: Array<(u: number) => { k: number; tx: number; ty: number }> = [];
    /**
     * Ziel-Szenen-Teile mit vorberechneten Scatter-Daten. Der GEHALTENE Zustand
     * (hx/hy/hrot/hscale) kommt exakt aus stage.ts (= hauptseiten-identisch); der
     * OFFSCREEN-Start (ox/oy) + spin/fscale + gestaffelte Zeiten (e2/a2) bilden die
     * Demo-Choreografie nach: jedes Fragment fliegt vom naechsten Viewport-Rand ein
     * (Rundum-Vollbild-Zerfall), statt aus den geclusterten stage.ts-fromX/fromY.
     */
    type Part = {
      el: HTMLDivElement; i: number;
      hx: number; hy: number; hrot: number; hscale: number;
      ox: number; oy: number;
      spin: number; fscale: number;
      e2: number; a2: number;
    };
    let parts: Part[] = [];
    let camHold = { k: 1, tx: 0, ty: 0 };
    let camWrap: HTMLDivElement | null = null;
    let raf = 0;
    let destroyed = false;

    const GOLDEN = Math.PI * (3 - Math.sqrt(5));
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic (weich, kein Bounce)

    // ---- u-Fenster der Ziel-Szene (aus stage.ts, verbatim nachgezogen) --------
    // Szene 0: Build [0.35, 2.25], Schnitt bei U_HERO+1.
    // Szene s>=1: Build [U_HERO+s, U_HERO+s+0.75], Schnitt U_HERO+s+1 (s=4: kein Ende).
    const uB0 = comp === 0 ? 0.35 : U_HERO + comp;
    const winW = comp === 0 ? 1.9 : 0.75;
    // Gehaltener u: 0.15 hinter dem Fensterende -> sicher im Halte-Plateau.
    // Fuer comp=4 ergibt das u=6.6 (Ground-Truth der Hauptseite: comp5 gehalten).
    const uHold = uB0 + winW + 0.15;

    function build() {
      // --- Pool ueber ALLE Comps, exakt wie HomeMorph (nur ohne Wortmarke) ----
      const kBase = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      const pool: PoolPieceIn[] = [];
      COMPS.forEach((c, scene) => {
        c.pieces.forEach((jp, idx) => {
          const elW = jp.w * Math.abs(jp.sx) * kBase;
          const elH = jp.h * Math.abs(jp.sy) * kBase;
          pool.push({ cx: 0, cy: 0, w: elW, h: elH, letter: -1, clone: true, at: idx, scene });
        });
      });

      // Navy-Teil je Szene: groesstes Seitenverhaeltnis (max W/H, H/W), ein Teil.
      const asp = (jp: { w: number; h: number; sx: number; sy: number }) => {
        const W = jp.w * Math.abs(jp.sx), H = jp.h * Math.abs(jp.sy);
        return Math.max(W / H, H / W);
      };
      const navyIdxByScene = COMPS.map((c) =>
        c.pieces.reduce((best, jp, idx) => (asp(jp) > asp(c.pieces[best]) ? idx : best), 0)
      );

      const plan = buildStagePlan(pool, { w: window.innerWidth, h: window.innerHeight });
      timelines = plan.timelines;
      sceneLayouts = plan.scenes;
      cameras = plan.cameras;

      // Schaerfe: Element in seiner GROESSTEN Verwendung rendern, Timeline-Scales
      // darauf normieren (Upscale = Matsch). Verbatim aus HomeMorph.
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

      // --- DOM: EIN Kamera-Wrapper fuer die Ziel-Szene, darin nur deren Teile ---
      stage!.innerHTML = "";
      camWrap = document.createElement("div");
      camWrap.style.cssText = "position:absolute;inset:0;will-change:transform;transform-origin:50% 50%;";
      stage!.appendChild(camWrap);

      // Kamera im Halte-Zustand (waehrend Einflug/Aufloesung fix -> Kopf baut sich
      // AN ORT UND STELLE zusammen, genau wie die Demo, kein Kamera-Schwenk dabei).
      camHold = cameras[comp](uHold);
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;

      parts = [];
      pool.forEach((p, i) => {
        if (p.scene !== comp || p.at == null) return;

        // Gehaltener Slot (stage.ts, nach Schaerfe-Normierung) = Referenz-Zustand.
        const hs = sampleTimeline(timelines[i], uHold);

        // HAUPTSEITEN-PARITAET (o-Feld!): stage.ts blendet Teile mit endlichem
        // Sichtbarkeitsfenster (op < displayFrames, Reveal-Austauschpaare) vor
        // dem Halte-Zeitpunkt per o->0 aus; HomeMorph wendet st.o an. Ohne diesen
        // Filter lagen hier 8 Phantom-Teile doppelt gestapelt im Kopf (comp5:
        // Indizes 14,21,23,25,27,29,31,33) -> "zu viele/falsche Teile".
        if (hs.o <= 0.001) return;

        const jp = COMPS[p.scene].pieces[p.at];
        const fill = p.at === navyIdxByScene[p.scene] ? "#1c2837" : "#F12032";
        const el = document.createElement("div");
        el.innerHTML = `<svg width="100%" height="100%" viewBox="${-jp.w / 2} ${-jp.h / 2} ${jp.w} ${jp.h}" preserveAspectRatio="none" style="display:block;overflow:visible"><g transform="scale(${jp.sx < 0 ? -1 : 1} ${jp.sy < 0 ? -1 : 1})"><path d="${jp.d}" fill="${fill}"/></g></svg>`;
        el.style.cssText =
          `position:absolute;left:50%;top:50%;max-width:none;width:${p.w}px;height:${p.h}px;` +
          `margin-left:${-p.w / 2}px;margin-top:${-p.h / 2}px;will-change:transform;opacity:1;`;
        camWrap!.appendChild(el);

        // Einflug-Richtung wie die Demo: Slot -> Lottie-fromX/fromY. Ist die
        // Verschiebung ~0, faechert der goldene Winkel radial auf (kein Klumpen).
        let dx = jp.fromX - jp.x;
        let dy = jp.fromY - jp.y;
        if (Math.hypot(dx, dy) < 1e-4) { const a = i * GOLDEN; dx = Math.cos(a); dy = Math.sin(a); }
        const dl = Math.hypot(dx, dy) || 1; const ux = dx / dl, uy = dy / dl;

        // Kleinstes t>0, ab dem der Fragment-Mittelpunkt (in Kamera-Projektion)
        // ueber den naechsten Viewport-Rand tritt -> Offscreen-Startpunkt.
        const vx = camHold.k * ux, vy = camHold.k * uy;
        const x0 = camHold.tx + camHold.k * hs.x, y0 = camHold.ty + camHold.k * hs.y;
        let tX = Infinity, tY = Infinity;
        if (vx > 1e-6) tX = (halfW - x0) / vx; else if (vx < -1e-6) tX = (-halfW - x0) / vx;
        if (vy > 1e-6) tY = (halfH - y0) / vy; else if (vy < -1e-6) tY = (-halfH - y0) / vy;
        let t = Math.min(tX > 0 ? tX : Infinity, tY > 0 ? tY : Infinity);
        if (!isFinite(t) || t <= 0) t = (halfW + halfH) / camHold.k;
        // Ganz ueber den Rand: Fragment-Groesse (im Flug bis fromScale vergroessert)
        // + Puffer, sonst lugen grosse/rotierte Teile am Rand herein.
        t += (Math.max(p.w, p.h) * jp.fromScale + 160) / camHold.k;

        // Reveal-am-Slot-Teile (entryT==arriveT, comp5: 8 Stueck mit ip>0):
        // auf der Hauptseite ERSCHEINEN sie einfach am Slot (ihr Austausch-
        // Partner verdeckt das). Im Scatter haetten sie ein degeneriertes
        // Zeitfenster und SPRINGEN beim kleinsten Fortschritt fix ins Bild
        // (Thomas' "Zeichen-Kombination, die auftaucht und bleibt").
        // Synthetisches Flugfenster: Start = ip/dur (ihr echter Erscheinens-
        // Moment), Dauer wie ein typischer Flug -> sie fliegen harmonisch mit.
        let e2 = jp.entryT, a2 = jp.arriveT;
        if (a2 - e2 < 1e-3) {
          e2 = Math.max(jp.ip, 0) / COMPS[p.scene].displayFrames;
          a2 = e2 + 0.35;
        }

        parts.push({
          el, i,
          hx: hs.x, hy: hs.y, hrot: hs.rot, hscale: hs.scale,
          ox: hs.x + ux * t, oy: hs.y + uy * t,
          spin: jp.fromRot - jp.rot, fscale: jp.fromScale,
          e2, a2,
        });
      });

      // Einflug-Zeiten auf [0,1] spreizen (wie Demo normalizeEntry): erstes Fragment
      // startet bei aA=0, letztes sitzt exakt bei aA=1 -> ganze Strecke bespielt.
      let eMin = Infinity, aMax = -Infinity;
      for (const q of parts) { if (q.e2 < eMin) eMin = q.e2; if (q.a2 > aMax) aMax = q.a2; }
      const span = (aMax - eMin) || 1;
      for (const q of parts) { q.e2 = (q.e2 - eMin) / span; q.a2 = (q.a2 - eMin) / span; }

      return parts.length > 0;
    }

    // Geglaetteter Anzeige-Fortschritt. Die Hauptseite scrollt via Lenis
    // (lerp 0.075) -> u springt dort NIE. Die Demo-Engine folgt dem rohen
    // Scroll; ohne Glaettung teleportieren Fragmente bei jedem Radtick mitten
    // ins Bild ("poppen auf"), statt sichtbar von aussen hereinzufliegen.
    let shownP: number | null = null;

    function render() {
      if (!parts.length || !camWrap) return;
      const prop = progressRef.current;
      const g = window as unknown as { __sculptProgress?: number };
      // Reihenfolge: QA-Global gewinnt, dann Prop, dann Default 0.55 (= gehalten).
      // Reduced-Motion => immer statisch gehalten.
      const target = reduced
        ? 0.55
        : typeof g.__sculptProgress === "number"
          ? g.__sculptProgress
          : typeof prop === "number"
            ? prop
            : 0.55;
      // Lenis-Paritaet: pro Frame Richtung Ziel lerpen; beim ersten Frame
      // direkt aufsetzen (kein Aufhol-Flug nach Load mitten auf der Seite).
      let p = shownP == null ? target : shownP + (target - shownP) * 0.09;
      if (Math.abs(target - p) < 0.0004) p = target;
      shownP = p;

      // progress-Mapping mit echtem HALTE-PLATEAU. Die Engine haelt waehrend des
      // Story-Scrolls konstant bei ~0.55; damit der Kopf ROBUST sauber haelt (und
      // nicht nur im Punkt 0.55), gilt: 0..0.5 = Zusammenbau, 0.5..0.6 = gehalten,
      // 0.6..1 = Aufloesung. So ist auch progress 0.52/0.58 voll zusammengesetzt.
      const assembleT = clamp(p / 0.5, 0, 1);          // 1 ab p>=0.5
      const dissolveT = clamp((p - 0.6) / 0.4, 0, 1);  // >0 ab p>0.6

      for (const q of parts) {
        let cx: number, cy: number, rot: number, sf: number, e: number;
        let vis: boolean;
        if (dissolveT > 0) {
          // Aufloesung: Slot -> Offscreen, gestaffelt (spaete Ankoemmlinge zuerst raus).
          const startB = (1 - q.a2) * 0.4;
          e = ease(clamp((dissolveT - startB) / 0.6, 0, 1));
          cx = q.hx + (q.ox - q.hx) * e;
          cy = q.hy + (q.oy - q.hy) * e;
          rot = q.hrot + q.spin * e;
          sf = 1 + (q.fscale - 1) * e;
          vis = e < 1; // voll ausgeflogen -> unsichtbar (kein Rand-Rest)
        } else {
          // Einflug: Offscreen -> Slot, gestaffelt (e2..a2 pro Fragment).
          const denom = q.a2 - q.e2 || 1e-3;
          e = ease(clamp((assembleT - q.e2) / denom, 0, 1));
          cx = q.ox + (q.hx - q.ox) * e;
          cy = q.oy + (q.hy - q.oy) * e;
          rot = q.hrot + q.spin * (1 - e);
          sf = q.fscale + (1 - q.fscale) * e;
          vis = e > 0; // noch nicht gestartet (geparkt offscreen) -> unsichtbar
        }
        // Opacity-Gating: geparkte/ausgeflogene Fragmente ausblenden, sonst lugen
        // sie am Rand herein (Offscreen-Position allein reicht nicht sicher).
        q.el.style.visibility = vis ? "visible" : "hidden";
        q.el.style.transform =
          `translate(${cx}px, ${cy}px) rotate(${rot}deg) scale(${q.hscale * sf})`;
      }

      // Kamera fix im Halte-Zustand (Kopf baut sich an Ort und Stelle zusammen).
      camWrap.style.transform = `translate(${camHold.tx}px, ${camHold.ty}px) scale(${camHold.k})`;
    }

    function loop() {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    }

    let tries = 0;
    function tryBuild() {
      if (destroyed) return;
      if (build()) { render(); if (!prefersReduced) raf = requestAnimationFrame(loop); return; }
      if (++tries < 30) setTimeout(tryBuild, 200);
    }
    // Fonts sind fuer die Szenen-Skulpturen irrelevant (reine Path-Fragmente),
    // aber wir warten trotzdem einen Tick auf ein stabiles Layout.
    tryBuild();

    const onResize = () => { if (build()) render(); };
    window.addEventListener("resize", onResize);
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // comp/reduced sind die einzigen Build-relevanten Eingaben; progress laeuft
    // ueber progressRef (kein Re-Init pro Frame).
  }, [comp, reduced]);

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", background: "#ffffff", overflow: "hidden", ...style }}
    >
      <div ref={stageRef} style={{ position: "absolute", inset: 0, willChange: "transform" }} />
    </div>
  );
}
