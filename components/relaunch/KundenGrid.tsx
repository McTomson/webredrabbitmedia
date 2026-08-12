"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * Weisser Port des "Kundenliste"-Typing-Grids von der ueber-uns-Seite
 * (components/subpages/ueber-uns-demo/demo.body.html Abschnitt scene-partner
 * + demo.engine.jstext Zeilen 587-789 + demo.css .scene-partner/.p-*).
 *
 * Farb-Transposition Blau -> Weiss (Tomson 16.07.): Panel-Hintergrund war
 * var(--blue) #f12032 mit Off-White-Text -> hier Paper #ffffff mit Ink
 * #23262e. Die Klammer-Label-Farbe war Off-White auf Blau, bleibt aber
 * markentypisch ROT (wie f-label im FAQ-Abschnitt derselben Quelle), nicht
 * Ink. Hairlines waren rgba(offwhite,.18) auf Blau -> #e4e4e0 auf Weiss.
 * Caret + Chevron bleiben Marken-Rot #f12032 (unveraendert Akzent).
 *
 * POOL, Timing (DEL/TYPE/PAUSE-MS) und die Zellen-State-Machine (idle ->
 * del -> pause -> type -> idle) sind 1:1 aus demo.engine.jstext Zeilen
 * 593-637 uebernommen. Die Chevron-Fragment-Geometrie (ARM/WEDGE-Pfade,
 * CHEV-Array) ist 1:1 aus Zeilen 748-774 uebernommen.
 */

// GENAU diese 13 verifizierten Kundennamen (Thomas 30.07.: K2 Dach- & Bau raus,
// kein Kunde von uns; Global Insights/ruderes-insights.at neu rein — synchron mit
// components/subpages/ueber-uns-demo/demo.engine.jstext halten).
const POOL = [
  "SIGNA",
  "6B47",
  "Tillmann & Kraus",
  "MBT",
  "Sans Souci",
  "Die Vorsorgewohnungs GmbH",
  "Phils.place",
  "Auritas",
  "Almtal Invest",
  "Therme Warten",
  "Lashes by Danesh",
  "ReRo Heizsysteme",
  "Global Insights",
];

// Tipp-Animation tippt beim Neu-Schreiben einen ANDEREN Namen aus dem POOL
// (Thomas 30.07.: "durcheinander", nie derselbe Name an derselben Stelle neu).
function pickOtherName(exclude: string): string {
  let n: string;
  do {
    n = POOL[Math.floor(Math.random() * POOL.length)];
  } while (n === exclude && POOL.length > 1);
  return n;
}

const DEL_MS = 42;
const TYPE_MS = 78;
const PAUSE_MS = 320;

// Chevron-Fragment-Geometrie 1:1 aus demo.engine.jstext Zeilen 748-761.
const ARM =
  "M9.75 16.66 C9.75 23.0 10.94 24.12 12.05 25.23 C13.16 26.43 14.17 26.77 14.77 27.28 C14.77 27.28 14.77 27.45 14.77 27.45 C14.77 27.45 7.62 27.45 7.62 27.45 C-2.17 27.45 -9.23 22.74 -9.15 10.49 C-9.15 10.49 -9.15 -9.64 -9.15 -9.64 C-9.15 -20.86 -10.51 -26.0 -14.77 -27.2 C-14.77 -27.2 -14.77 -27.45 -14.77 -27.45 C1.32 -27.02 9.75 -21.63 9.75 -8.78 C9.75 -8.78 9.75 16.66 9.75 16.66 Z";

const CHEV = [
  { d: ARM, cx: 40, cy: 19, rot: -54, sc: 0.62, fx: -1 },
  { d: ARM, cx: 40, cy: 45, rot: 54, sc: 0.62, fx: 1 },
  { d: ARM, cx: 86, cy: 19, rot: -54, sc: 0.62, fx: -1 },
  { d: ARM, cx: 86, cy: 45, rot: 54, sc: 0.62, fx: 1 },
];

type CellState = "idle" | "del" | "pause" | "type";

interface CellRuntime {
  cur: string;
  target: string;
  state: CellState;
  t0: number;
}

export default function KundenGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const cellRefs = useRef<Array<HTMLDivElement | null>>([]);
  const nameRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const chevWrapRef = useRef<SVGGElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Chevron-Fragmente aufbauen (demo.engine.jstext Zeilen 762-774).
    const chevWrap = chevWrapRef.current;
    const frags: SVGPathElement[] = [];
    if (chevWrap) {
      CHEV.forEach((c, i) => {
        const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("class", "rrkg-chev-frag");
        p.setAttribute("d", c.d);
        const home = `translate(${c.cx}px,${c.cy}px) rotate(${c.rot}deg) scale(${c.fx * c.sc},${c.sc})`;
        const sdx = 34 + (i % 3) * 6;
        const sdy = (i % 2 ? 1 : -1) * 12;
        const scat = `translate(${c.cx + sdx}px,${c.cy + sdy}px) rotate(${c.rot + 150}deg) scale(${c.fx * c.sc * 0.5},${c.sc * 0.5})`;
        p.style.transform = scat;
        (p as SVGPathElement & { __home?: string }).__home = home;
        chevWrap.appendChild(p);
        frags.push(p);
      });
    }
    let chevDone = false;
    function assembleChev() {
      if (chevDone) return;
      chevDone = true;
      frags.forEach((p, i) => {
        p.style.transitionDelay = `${i * 70}ms`;
        p.style.transform = (p as SVGPathElement & { __home?: string }).__home ?? "";
        p.style.opacity = "1";
      });
    }

    if (reduced) {
      frags.forEach((p) => {
        p.style.transform = (p as SVGPathElement & { __home?: string }).__home ?? "";
        p.style.opacity = "1";
      });
    } else if (ctaRef.current && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting) {
              assembleChev();
              io.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );
      io.observe(ctaRef.current);
    } else {
      assembleChev();
    }

    if (reduced) return;

    // Typing-Loop (demo.engine.jstext Zeilen 594-637): rAF-Loop, aktiv nur
    // solange die Sektion im Viewport steht (bounding-rect-Check statt
    // IntersectionObserver, 1:1 wie im Original — dort in der globalen
    // "tick()"-Hauptschleife eingehaengt).
    const cells: CellRuntime[] = POOL.map((name) => ({
      cur: name,
      target: "",
      state: "idle",
      t0: 0,
    }));
    let nextLaunch = performance.now() + 1500;
    let rrIndex = 0;
    let raf = 0;

    function partnerTick(now: number) {
      const section = sectionRef.current;
      if (section) {
        const r = section.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) {
          raf = requestAnimationFrame(partnerTick);
          return;
        }
      }
      let active = 0;
      for (const c of cells) if (c.state !== "idle") active++;
      if (active < 2 && now > nextLaunch) {
        for (let k = 0; k < cells.length; k++) {
          const idx = (rrIndex + k) % cells.length;
          const c = cells[idx];
          if (c.state === "idle") {
            rrIndex = (rrIndex + k + 1) % cells.length;
            c.state = "del";
            c.t0 = now;
            c.target = pickOtherName(c.cur); // anderen Namen aus dem Pool tippen (durcheinander)
            cellRefs.current[idx]?.classList.add("typing");
            break;
          }
        }
        nextLaunch = now + 2600 + Math.random() * 1600;
      }
      cells.forEach((c, idx) => {
        const nameEl = nameRefs.current[idx];
        if (!nameEl) return;
        if (c.state === "del") {
          const n = Math.max(0, c.cur.length - Math.floor((now - c.t0) / DEL_MS));
          nameEl.textContent = c.cur.slice(0, n);
          if (n === 0) {
            c.state = "pause";
            c.t0 = now;
          }
        } else if (c.state === "pause") {
          if (now - c.t0 > PAUSE_MS) {
            c.state = "type";
            c.t0 = now;
          }
        } else if (c.state === "type") {
          const n = Math.min(c.target.length, Math.floor((now - c.t0) / TYPE_MS) + 1);
          nameEl.textContent = c.target.slice(0, n);
          if (n >= c.target.length) {
            c.cur = c.target;
            c.state = "idle";
            cellRefs.current[idx]?.classList.remove("typing");
          }
        }
      });
      raf = requestAnimationFrame(partnerTick);
    }

    raf = requestAnimationFrame(partnerTick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="rrkg-scene" id="rrkgScene" ref={sectionRef}>
      <div className="rrkg-head">
        <div className="rrkg-label">(Stationen und Projekte)</div>
        <h2 className="rrkg-title">Ausschnitt aus unserer Kundenliste</h2>
        <div className="rrkg-stats">Seit 2019 &nbsp;·&nbsp; 164+ Projekte &nbsp;·&nbsp; 5,0 auf Google &nbsp;·&nbsp; 9 Bundesländer</div>
      </div>
      <div className="rrkg-grid">
        {POOL.map((name, i) => (
          <div
            className="rrkg-cell"
            key={name}
            ref={(el) => {
              cellRefs.current[i] = el;
            }}
          >
            <span
              className="rrkg-name"
              ref={(el) => {
                nameRefs.current[i] = el;
              }}
            >
              {name}
            </span>
            <i className="rrkg-caret" />
          </div>
        ))}
        <Link className="rrkg-cell rrkg-cta" href="/referenzen" aria-label="Alle Projekte ansehen" ref={ctaRef}>
          <span className="rrkg-cta-label">Alle Projekte<span className="rrkg-cta-more"> ansehen</span></span>
          <svg className="rrkg-chev" viewBox="0 0 128 64" aria-hidden="true">
            <g ref={chevWrapRef} />
          </svg>
        </Link>
      </div>

      <style>{`
        .rrkg-scene{
          position:relative;isolation:isolate;
          background:#f4f4f2;color:#23262e;
          padding:14vh 6vw 16vh;
        }
        .rrkg-head{max-width:1240px;margin:0 auto 6vh}
        .rrkg-label{
          font-family:var(--font-dmsans),"DM Sans",sans-serif;
          font-size:.72rem;letter-spacing:.28em;text-transform:uppercase;
          color:#f12032;font-weight:700;margin-bottom:1.4rem;
          user-select:none;-webkit-user-select:none;
        }
        .rrkg-title{
          font-family:var(--font-dmsans),"DM Sans",sans-serif;font-weight:700;
          font-size:clamp(2.1rem,5vw,4rem);line-height:1.02;letter-spacing:-.025em;
          color:#23262e;text-wrap:balance;max-width:16ch;
          margin:0 0 1.5rem;
        }
        .rrkg-stats{
          font-family:var(--font-grotesk),"Instrument Sans",sans-serif;font-weight:400;
          font-size:clamp(.95rem,1.15vw,1.1rem);letter-spacing:.04em;
          color:#5a5e68;
          user-select:none;-webkit-user-select:none;
        }
        .rrkg-grid{
          max-width:1240px;margin:0 auto;
          display:grid;grid-template-columns:repeat(3,1fr);
          gap:1px;background:#e4e4e0;
          border:1px solid #e4e4e0;
          user-select:none;-webkit-user-select:none;
        }
        .rrkg-cell{
          background:#ffffff;border-radius:0;
          min-height:140px;display:flex;align-items:center;
          padding:clamp(2rem,2.6vw,3.1rem);
          font-family:var(--font-dmsans),"DM Sans",sans-serif;font-weight:300;
          font-size:clamp(1.4rem,1.85vw,1.7rem);letter-spacing:-.01em;
          line-height:1.2;color:#23262e;
          overflow:hidden;
          transition:background-color .3s var(--rr-ease, cubic-bezier(.6,0,.4,1));
        }
        .rrkg-name{font-family:var(--font-dmsans),"DM Sans",sans-serif;font-weight:300}
        .rrkg-caret{
          display:none;flex:none;
          width:.14em;height:1.05em;margin-left:2px;
          background:#f12032;
        }
        .rrkg-cell.typing .rrkg-caret{display:inline-block}
        a.rrkg-cta{
          text-decoration:none;flex-direction:column;justify-content:center;align-items:center;gap:.7rem;cursor:pointer;
          padding:.9rem 2rem;
          grid-column:3;grid-row:4 / span 2;
          transition:background-color .3s var(--rr-ease, cubic-bezier(.6,0,.4,1));
        }
        a.rrkg-cta:hover{background:#f4f4f2}
        .rrkg-cta-label{
          font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
          font-weight:600;font-size:.82rem;letter-spacing:.14em;text-transform:uppercase;
          color:#f12032;text-align:center;line-height:1.3;
        }
        .rrkg-chev{width:clamp(64px,34%,120px);height:auto;flex:none;overflow:visible}
        .rrkg-chev g{transition:transform .35s var(--rr-ease, cubic-bezier(.6,0,.4,1))}
        a.rrkg-cta:hover .rrkg-chev g{transform:translateX(8px)}
        .rrkg-chev-frag{
          fill:#f12032;opacity:0;
          transform-box:view-box;transform-origin:0 0;
          transition:transform .85s var(--rr-ease, cubic-bezier(.6,0,.4,1)),opacity .55s var(--rr-ease, cubic-bezier(.6,0,.4,1));
        }

        @media (min-width:769px) and (max-width:1120px){
          .rrkg-cell{min-height:122px;padding:clamp(1.5rem,2.2vw,2.2rem);font-size:clamp(1.2rem,2.15vw,1.42rem)}
        }
        /* Mobile + Tablet (Thomas 31.07., Bild #22): CTA-Wort "ansehen" weg
           (nur "Alle Projekte") und Label eine Spur kleiner — am Handy wirkte
           es zu gross. Desktop behaelt "Alle Projekte ansehen". */
        @media (max-width:1024px){
          .rrkg-cta-more{display:none}
          .rrkg-cta-label{font-size:.72rem;letter-spacing:.12em}
        }
        @media (max-width:768px){
          .rrkg-scene{padding:10vh 5vw 12vh}
          .rrkg-grid{grid-template-columns:repeat(2,1fr)}
          .rrkg-cell{min-height:64px;font-size:1rem;padding:.7rem 1.1rem}
          a.rrkg-cta{padding:.7rem 1.1rem;justify-content:center;grid-column:auto;grid-row:auto}
        }
        @media (prefers-reduced-motion:reduce){
          .rrkg-cell.typing .rrkg-caret{display:none}
        }
      `}</style>
    </section>
  );
}
