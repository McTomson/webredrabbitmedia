"use client";

import { useEffect, useRef } from "react";
import { drawGearsMask, fillWithLetters, type FillStyle } from "@/lib/relaunch/morph/letterfill";

/**
 * Standbild-Labor: das Zahnrad-Motiv, mit GANZEN Buchstaben aus
 * "red rabbit" + "webdesign" gefuellt, in vier Stilen (Tomson-Inspiration):
 * city (gemischt/dicht) - chain (gross/luftig) - micro (klein/dicht) -
 * grid (Schreibmaschinen-Zeilen). Abnahme-Loop ohne Scroll.
 */
const STYLES: { key: FillStyle; label: string }[] = [
  { key: "city", label: "1 city — gemischte Groessen, dicht gepackt" },
  { key: "chain", label: "2 kalligramm — grosse Buchstaben, luftig" },
  { key: "micro", label: "3 mikrografie — viele kleine, gleichmaessig" },
  { key: "grid", label: "4 schreibmaschine — Zeilenraster" },
];

const CHARS = [..."redrabbit", ..."webdesign"];

export default function MorphLab() {
  const hostRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current!;
    let destroyed = false;

    function build() {
      const fam = getComputedStyle(probeRef.current!).fontFamily;
      // Ink-Bbox pro Zeichen vermessen (relativ zur Fontgroesse)
      const mcv = document.createElement("canvas");
      const mctx = mcv.getContext("2d")!;
      mctx.font = `650 100px ${fam}`;
      const probeW = mctx.measureText("red").width;
      if (probeW < 80) return false; // Font noch nicht geladen
      const letters = [...new Set(CHARS)].map((ch) => {
        const m = mctx.measureText(ch);
        const asc = m.actualBoundingBoxAscent, desc = m.actualBoundingBoxDescent;
        return { ch, wf: (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) / 100, hf: (asc + desc) / 100 };
      });

      // Maske einmal zeichnen
      const S = 900;
      const mask = document.createElement("canvas");
      mask.width = S; mask.height = S;
      const maskCtx = mask.getContext("2d", { willReadFrequently: true })!;
      drawGearsMask(maskCtx, S);

      host.innerHTML = "";
      for (const st of STYLES) {
        const label = document.createElement("p");
        label.textContent = st.label;
        label.style.cssText = "font-family:var(--rr-font-ui);font-size:15px;color:#5a5e68;margin:5vh 0 8px;text-align:center;";
        host.appendChild(label);

        const VIEW = Math.min(window.innerHeight * 0.86, 720);
        const stage = document.createElement("div");
        stage.style.cssText = `position:relative;width:${VIEW}px;height:${VIEW}px;margin:0 auto;`;
        host.appendChild(stage);

        const pieces = fillWithLetters(maskCtx, S, letters, st.key);
        for (const p of pieces) {
          const el = document.createElement("span");
          el.textContent = p.ch;
          const fs = p.size * VIEW;
          el.style.cssText =
            `position:absolute;left:${VIEW / 2 + p.x * VIEW}px;top:${VIEW / 2 + p.y * VIEW}px;` +
            `transform:translate(-50%,-56%) rotate(${p.rot}deg);` +
            `font-family:${fam};font-weight:650;font-size:${fs}px;line-height:1;color:#F12032;` +
            `user-select:none;white-space:pre;`;
          stage.appendChild(el);
        }
        const count = document.createElement("p");
        count.textContent = `${pieces.length} Teile`;
        count.style.cssText = "font-family:var(--rr-font-ui);font-size:13px;color:#9a9ea8;margin:6px 0 0;text-align:center;";
        host.appendChild(count);
      }
      return true;
    }

    let tries = 0;
    function tryBuild() {
      if (destroyed) return;
      if (build()) return;
      if (++tries < 30) setTimeout(tryBuild, 200);
    }
    document.fonts.ready.then(tryBuild);
    return () => { destroyed = true; };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", padding: "2vh 0 10vh" }}>
      <span ref={probeRef} aria-hidden style={{ fontFamily: "var(--rr-font-display)", position: "absolute", opacity: 0, pointerEvents: "none" }}>probe</span>
      <div ref={hostRef} />
    </div>
  );
}
