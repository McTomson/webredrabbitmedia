"use client";

import { useEffect, useRef, useState } from "react";
import { clamp01, masterEase } from "@/lib/relaunch/morph/grammar";

/**
 * Bau-Moment — scroll-gekoppelte Sektion, in der sich eine Website sichtbar aus
 * roten Bauteilen zusammensetzt ("das bauen wir fuer dich"). Kein Talos, keine
 * Figur, kein Morph — reines Handwerk: Menueleiste, Hero, Karten und Formular
 * fliegen einzeln aus ihrer Ruheposition in den fertigen Slot, waehrend der
 * Nutzer scrollt (Track + Sticky-Stage, exakt das Kopplungsmuster aus
 * SubpageHero/StepStack: getBoundingClientRect auf einem hohen Track treibt
 * einen Fortschritt 0..1, rAF schreibt nur transform/opacity).
 *
 * reduced-motion: CSS-Kill-Switch (Media Query weiter unten) UND JS-Zweig
 * (reduced=true rendert die fertig montierte, statische Website ohne Animation).
 */

export interface BauMomentProps {
  /** Ink-Eyebrow ueber dem Statement (rr-eyebrow-lg, GROSSBUCHSTABEN, kein Rot). */
  headline?: string;
  /** Crimson-Statement als Sektions-Botschaft (rr-statement). */
  sub?: string;
}

interface PieceCfg {
  /** Startversatz relativ zur Zielposition (px) + Start-Rotation (deg). */
  x: number;
  y: number;
  rot: number;
  /** Fortschrittsfenster [s,e] in dem das Teil einfliegt. */
  s: number;
  e: number;
}

/** Reihenfolge der Montage: Menueleiste -> Hero (Headline/Sub/CTA) -> 3 Karten -> Formular (2 Felder + Button). */
const PIECES: PieceCfg[] = [
  { x: 0, y: -150, rot: 0, s: 0.03, e: 0.2 }, // 0 Menueleiste
  { x: -240, y: 0, rot: -7, s: 0.15, e: 0.32 }, // 1 Headline
  { x: -190, y: 0, rot: -4, s: 0.23, e: 0.39 }, // 2 Subline
  { x: 40, y: 70, rot: 9, s: 0.31, e: 0.47 }, // 3 CTA-Button
  { x: 260, y: 50, rot: 11, s: 0.41, e: 0.57 }, // 4 Karte 1
  { x: 0, y: 170, rot: 0, s: 0.49, e: 0.65 }, // 5 Karte 2
  { x: -260, y: 50, rot: -11, s: 0.57, e: 0.73 }, // 6 Karte 3
  { x: 0, y: 180, rot: 0, s: 0.67, e: 0.83 }, // 7 Formfeld 1
  { x: 0, y: 220, rot: 0, s: 0.73, e: 0.89 }, // 8 Formfeld 2
  { x: 150, y: 200, rot: 13, s: 0.81, e: 0.96 }, // 9 Formular-Button
];

const TRACK_VH = 300;

export default function BauMoment({
  headline = "SO ENTSTEHT DEINE WEBSITE",
  /* COPY: Opus */
  sub = "Stueck fuer Stueck setzen wir zusammen, was am Ende traegt.",
}: BauMomentProps = {}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pieceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setReduced(true);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    let destroyed = false;

    const render = () => {
      const r = track.getBoundingClientRect();
      const denom = r.height - window.innerHeight;
      const q = denom > 0 ? clamp01(-r.top / denom) : 0;

      for (let i = 0; i < PIECES.length; i++) {
        const el = pieceRefs.current[i];
        if (!el) continue;
        const cfg = PIECES[i];
        const p = masterEase(clamp01((q - cfg.s) / (cfg.e - cfg.s)));
        const x = (1 - p) * cfg.x;
        const y = (1 - p) * cfg.y;
        const rot = (1 - p) * cfg.rot;
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`;
        el.style.opacity = p.toFixed(3);
      }
    };

    const loop = () => {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("scroll", render, { passive: true });
    window.addEventListener("resize", render);
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", render);
      window.removeEventListener("resize", render);
    };
  }, [reduced]);

  return (
    <section className="bm-root">
      <style>{BM_CSS}</style>

      <div
        ref={trackRef}
        className="bm-track"
        style={{ height: reduced ? "auto" : `${TRACK_VH}vh`, position: "relative" }}
      >
        <div className={reduced ? "bm-stage bm-stage--reduced" : "bm-stage"}>
          <div className="bm-copy">
            <p className="rr-eyebrow-lg bm-eyebrow">{headline}</p>
            <p className="rr-statement bm-statement">{sub}</p>
          </div>

          <div className="bm-frame" aria-hidden="true">
            {/* 0 Menueleiste */}
            <div
              ref={(el) => {
                pieceRefs.current[0] = el;
              }}
              className="bm-piece bm-bar"
              style={reduced ? undefined : { opacity: 0 }}
            >
              <span className="bm-dot bm-dot--red" />
              <span className="bm-dot" />
              <span className="bm-dot" />
              <span className="bm-bar__url" />
            </div>

            <div className="bm-hero">
              {/* 1 Headline */}
              <div
                ref={(el) => {
                  pieceRefs.current[1] = el;
                }}
                className="bm-piece bm-bar-line bm-bar-line--headline"
                style={reduced ? undefined : { opacity: 0 }}
              />
              {/* 2 Subline */}
              <div
                ref={(el) => {
                  pieceRefs.current[2] = el;
                }}
                className="bm-piece bm-bar-line bm-bar-line--sub"
                style={reduced ? undefined : { opacity: 0 }}
              />
              {/* 3 CTA */}
              <div
                ref={(el) => {
                  pieceRefs.current[3] = el;
                }}
                className="bm-piece bm-cta"
                style={reduced ? undefined : { opacity: 0 }}
              />
            </div>

            <div className="bm-cards">
              {/* 4,5,6 Karten */}
              {[4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    pieceRefs.current[idx] = el;
                  }}
                  className="bm-piece bm-card"
                  style={reduced ? undefined : { opacity: 0 }}
                >
                  <span className="bm-card__line bm-card__line--a" />
                  <span className="bm-card__line bm-card__line--b" />
                </div>
              ))}
            </div>

            <div className="bm-form">
              {/* 7 Feld 1 */}
              <div
                ref={(el) => {
                  pieceRefs.current[7] = el;
                }}
                className="bm-piece bm-field"
                style={reduced ? undefined : { opacity: 0 }}
              />
              {/* 8 Feld 2 */}
              <div
                ref={(el) => {
                  pieceRefs.current[8] = el;
                }}
                className="bm-piece bm-field"
                style={reduced ? undefined : { opacity: 0 }}
              />
              {/* 9 Formular-Button */}
              <div
                ref={(el) => {
                  pieceRefs.current[9] = el;
                }}
                className="bm-piece bm-submit"
                style={reduced ? undefined : { opacity: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const BM_CSS = `
.bm-root { position: relative; background: var(--rr-paper); }

.bm-stage {
  position: sticky; top: 0; height: 100vh; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: clamp(28px, 5vh, 56px);
  padding: clamp(24px, 6vh, 64px) var(--rr-gutter);
}
.bm-stage--reduced { position: static; height: auto; overflow: visible; }

.bm-copy { max-width: 640px; text-align: center; }
.bm-eyebrow { color: var(--rr-ink); margin-bottom: 14px; }
.bm-statement { color: var(--rr-ink); margin: 0; }

.bm-frame {
  position: relative;
  width: min(880px, 90vw);
  height: min(58vh, 520px);
  background: var(--rr-paper);
  border: 1.5px solid var(--rr-ink);
  border-radius: 0;
  overflow: hidden;
}

.bm-piece { will-change: transform, opacity; }

.bm-bar {
  position: absolute; left: 0; top: 0; right: 0; height: 34px;
  background: var(--rr-navy);
  display: flex; align-items: center; gap: 7px;
  padding: 0 14px;
}
.bm-dot { width: 8px; height: 8px; border-radius: 50%; background: #5a5e68; display: inline-block; }
.bm-dot--red { background: var(--rr-red); }
.bm-bar__url {
  margin-left: 10px; height: 12px; width: 38%;
  background: rgba(255,255,255,0.14);
  border-radius: 0;
}

.bm-hero {
  position: absolute; left: 24px; right: 24px; top: 58px;
  display: flex; flex-direction: column; gap: 12px;
}
.bm-bar-line { background: var(--rr-ink); border-radius: 0; }
.bm-bar-line--headline { height: 22px; width: 62%; }
.bm-bar-line--sub { height: 12px; width: 44%; background: var(--rr-ink-soft); }
.bm-cta { height: 30px; width: 128px; background: var(--rr-red); border-radius: 0; margin-top: 6px; }

.bm-cards {
  position: absolute; left: 24px; right: 24px; top: 46%;
  display: flex; gap: 16px;
}
.bm-card {
  flex: 1; height: 96px;
  background: #f4f4f2; border: 1px solid var(--rr-ink); border-radius: 0;
  padding: 12px; display: flex; flex-direction: column; gap: 8px;
}
.bm-card__line { display: block; height: 8px; background: var(--rr-ink-soft); border-radius: 0; }
.bm-card__line--a { width: 70%; }
.bm-card__line--b { width: 45%; }

.bm-form {
  position: absolute; left: 24px; right: 24px; bottom: 22px;
  display: flex; align-items: center; gap: 12px;
}
.bm-field {
  flex: 1; height: 32px;
  background: var(--rr-paper); border: 1px solid var(--rr-ink); border-radius: 0;
}
.bm-submit {
  width: 108px; height: 32px; background: var(--rr-red); border-radius: 0; flex-shrink: 0;
}

@media (max-width: 640px) {
  .bm-frame { height: min(64vh, 460px); }
  .bm-cards { flex-direction: column; top: 42%; bottom: 96px; }
  .bm-card { height: 56px; }
}

/* Kill-Switch: falls JS den reduced-Zweig noch nicht gesetzt hat, keine Bewegung zeigen. */
@media (prefers-reduced-motion: reduce) {
  .bm-piece { transition: none !important; transform: none !important; opacity: 1 !important; }
  .bm-stage { position: static !important; height: auto !important; overflow: visible !important; }
}
`;
