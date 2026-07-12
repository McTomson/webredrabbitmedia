"use client";

import { useEffect, useRef, useState } from "react";
import { clamp01, masterEase } from "@/lib/relaunch/morph/grammar";
import { RabbitMark } from "@/components/relaunch/RabbitMark";

/**
 * FIGUREN-SZENE (Umbau 12.07., Tomson: "wo ist der Effekt"): der Hase steht
 * nicht mehr statisch, er SETZT SICH beim Scrollen aus 8 eckigen Fragmenten
 * ZUSAMMEN (K95-Assembly-Moment, Morph-Sprache der Startseite). Zerlegung der
 * RabbitMark-Silhouette per clipPath-Rechtecken (Kacheln des 174x267-viewBox,
 * zusammengesetzt = vollstaendige Figur); die Teile fliegen aus versetzten
 * Richtungen (Golden-Angle) mit leichter Rotation ein, scroll-gescrubbt und
 * reversibel, danach ruhige Parallax. prefers-reduced-motion: statische Figur.
 *
 * Pfad-Daten 1:1 aus components/relaunch/RabbitMark.tsx uebernommen (dort nicht
 * exportiert; Datei gehoert dem Hero-Strang und bleibt unangetastet).
 */

const RABBIT_D =
  "M0 1335 l0 -1335 503 0 c626 1 693 8 877 98 172 84 290 230 337 417 " +
  "24 98 24 325 -1 415 -60 222 -232 402 -431 451 -28 6 -52 13 -54 15 -2 1 81 " +
  "112 183 246 139 182 194 262 218 318 31 72 33 80 33 210 0 164 -15 220 -90 " +
  "330 -42 62 -153 170 -175 170 -3 0 -179 -272 -390 -605 -212 -332 -388 -604 " +
  "-392 -605 -5 0 -8 156 -8 346 0 387 -3 414 -68 539 -51 99 -163 208 -263 258 " +
  "-76 37 -184 66 -246 67 l-33 0 0 -1335z m1036 -308 c276 -140 177 -553 -131 " +
  "-551 -144 1 -254 94 -286 243 -21 97 33 225 119 285 90 62 204 71 298 23z";

/** Clip-Kacheln [x, y, w, h] im 174x267-viewBox — decken die Figur vollstaendig. */
const FRAGS: number[][] = [
  [0, 0, 87, 70], [87, 0, 87, 70],
  [0, 70, 58, 72], [58, 70, 116, 72],
  [0, 142, 87, 62], [87, 142, 87, 62],
  [0, 204, 100, 63], [100, 204, 74, 63],
];

const GOLDEN = 137.50776;
type FragMotion = { ux: number; uy: number; rot: number; delay: number };
const MOTION: FragMotion[] = FRAGS.map((_f, i) => {
  const a = ((i * GOLDEN + 40) * Math.PI) / 180;
  return {
    ux: Math.cos(a),
    uy: Math.sin(a),
    rot: (i % 2 ? 1 : -1) * (14 + (i % 4) * 6),
    delay: i * 0.045,
  };
});

export default function AboutRabbit() {
  const secRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const fragRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const sec = secRef.current!;
    let raf = 0;
    let destroyed = false;

    function render() {
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      // Assembly-Fortschritt: baut sich auf, waehrend die Sektion hereinscrollt,
      // steht komplett, sobald sie zentriert ist. Reversibel.
      const pin = clamp01((vh * 0.95 - r.top) / (vh * 0.72));
      const D = Math.min(360, window.innerWidth * 0.42);
      for (let i = 0; i < FRAGS.length; i++) {
        const el = fragRefs.current[i];
        if (!el) continue;
        const m = MOTION[i];
        const a = masterEase(clamp01((pin - m.delay) / 0.62));
        const inv = 1 - a;
        el.style.transform =
          `translate(${m.ux * D * inv}px, ${m.uy * D * inv}px) rotate(${m.rot * inv}deg)`;
        el.style.opacity = String(0.15 + 0.85 * a);
      }
      // Ruhige Parallax nach der Assembly (auf dem Gesamt-Container).
      const pp = clamp01((vh - r.top) / (vh + r.height));
      if (markRef.current) {
        markRef.current.style.transform = `translateY(${(pp - 0.5) * -56}px)`;
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
    <section ref={secRef} className="rr-section uup-rabbit">
      <div className="rr-wrap">
        <div className="uup-rabbit__grid">
          <div ref={markRef} className="uup-rabbit__mark" aria-hidden="true">
            {reduced ? (
              <RabbitMark color="var(--rr-red)" title="Red Rabbit" />
            ) : (
              <div className="uup-rabbit__frags">
                {FRAGS.map((f, i) => (
                  <div
                    key={i}
                    ref={(el) => { fragRefs.current[i] = el; }}
                    className="uup-rabbit__frag"
                  >
                    <svg viewBox="0 0 174 267" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                      <defs>
                        <clipPath id={`uupfrag${i}`}>
                          {/* leicht aufgeblasen (wie pieces.ts M-Overlap): sonst
                              zeigen die Kachelkanten im zusammengesetzten Zustand
                              Antialiasing-Haarlinien */}
                          <rect x={f[0] - 0.8} y={f[1] - 0.8} width={f[2] + 1.6} height={f[3] + 1.6} />
                        </clipPath>
                      </defs>
                      <g clipPath={`url(#uupfrag${i})`}>
                        <g transform="translate(0,267) scale(0.1,-0.1)">
                          <path fill="var(--rr-red)" fillRule="evenodd" stroke="none" d={RABBIT_D} />
                        </g>
                      </g>
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="uup-rabbit__text">
            <p className="rr-eyebrow" style={{ marginBottom: 18 }}>Warum der Hase</p>
            <h2 className="rr-claim" style={{ marginBottom: 22 }}>
              Schnell, wach, immer auf dem Sprung.
            </h2>
            <div className="rr-prose">
              <p>
                Ein Hase ist schnell, aufmerksam und immer auf dem Sprung. Genau so
                arbeiten wir: der erste Entwurf steht in sieben Tagen, wir reagieren
                sofort und bleiben wach für das, was dein Betrieb wirklich braucht.
              </p>
              <p>
                Kein behäbiges Bürokratie-Tier, kein Stillstand. Rot, weil wir
                auffallen wollen, und weil wir Haltung zeigen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
