"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { clamp01, masterEase } from "@/lib/relaunch/morph/grammar";

/**
 * 3 Case-Panels in eigenen Farbwelten (Blaupause Sektion 5, all-turtles-Anatomie:
 * Eyebrow 27 / Headline 135 / Sub 41 / Link 20 / riesiger Anfangsbuchstabe
 * Ton-in-Ton). Tomson 04.07.: horizontal zwischen den Panels scrollen, dann
 * vertikal weiter — Umsetzung als sticky Track, vertikaler Scroll treibt
 * die horizontale Fahrt (Master-Easing pro Panel-Segment einrasten lassen).
 * Referenz-Auswahl = VORSCHLAG (Tomson-Gate): thermewarten / Almtal / Danesh.
 */

type CaseDef = {
  eyebrow: string;
  headline: string;
  sub: string;
  href: string;
  domain: string;
  bg: string;
  text: string;
  accent: string;
  initial: string;
  initialColor: string;
};

const CASES: CaseDef[] = [
  {
    eyebrow: "Handwerk & Service",
    headline: "Thermenwartung",
    sub: "Ein Serviceauftritt, der gefunden wird, wenn die Therme streikt. Klar, schnell, regional.",
    href: "https://thermewarten.at",
    domain: "thermewarten.at",
    bg: "var(--rr-world-1-bg)",
    text: "#f6f5f1",
    accent: "var(--rr-world-1-accent)",
    initial: "T",
    initialColor: "rgba(255,255,255,0.07)",
  },
  {
    eyebrow: "Immobilien & Kapitalanlage",
    headline: "Almtal Invest",
    sub: "Ein Investmentprojekt mit eigener Bühne. Ruhig, präzise, auf Vertrauen gebaut.",
    href: "/referenzen-preview",
    domain: "almtal-invest",
    bg: "var(--rr-world-2-bg)",
    text: "#f6f5f1",
    accent: "var(--rr-world-2-accent)",
    initial: "A",
    initialColor: "rgba(255,255,255,0.06)",
  },
  {
    eyebrow: "Beauty & Studio",
    headline: "Lashes by Danesh",
    sub: "Ein Studio-Auftritt mit der Handschrift der Gründerin. Persönlich statt austauschbar.",
    href: "https://lashesbydanesh.at",
    domain: "lashesbydanesh.at",
    bg: "var(--rr-world-3-bg)",
    text: "var(--rr-ink)",
    accent: "var(--rr-world-3-accent)",
    initial: "D",
    initialColor: "rgba(140,47,66,0.10)",
  },
];

export default function CasePanels() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const track = trackRef.current!, row = rowRef.current!;
    let raf = 0, destroyed = false;

    function render() {
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp01(-r.top / total) : 0;
      // Fahrt in (n-1) Segmenten, jedes Segment mit Master-Easing "einrasten"
      const segs = CASES.length - 1;
      const raw = p * segs;
      const idx = Math.min(segs - 1, Math.floor(raw));
      const eased = idx + masterEase(raw - idx);
      row.style.transform = `translate3d(${-eased * 100}vw, 0, 0)`;
    }

    function loop() {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => { destroyed = true; cancelAnimationFrame(raf); };
  }, []);

  // Reduced-Motion: Panels einfach vertikal stapeln (kein Scroll-Jacking)
  if (reduced) {
    return (
      <div>
        {CASES.map((c) => (
          <section key={c.headline} aria-label={`Referenz ${c.headline}`} style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: c.bg, color: c.text, display: "flex", alignItems: "center" }}>
            <div className="rr-wrap" style={{ position: "relative", width: "100%", padding: "12vh 0" }}>
              <p className="rr-eyebrow-lg" style={{ color: c.accent }}>{c.eyebrow}</p>
              <h3 className="rr-display-1" style={{ margin: "0.18em 0 0.22em", color: "inherit" }}>{c.headline}</h3>
              <p className="rr-sub" style={{ maxWidth: "17em", margin: 0 }}>{c.sub}</p>
              <p style={{ marginTop: 32 }}>{c.href.startsWith("http") ? (<a className="rr-link" href={c.href} target="_blank" rel="noopener" style={{ color: "inherit", fontSize: "var(--rr-fs-ui)" }}>Zum Projekt ({c.domain})</a>) : (<Link className="rr-link" href={c.href} style={{ color: "inherit", fontSize: "var(--rr-fs-ui)" }}>Zum Projekt ({c.domain})</Link>)}</p>
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div ref={trackRef} style={{ height: `${CASES.length * 120}vh`, position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div ref={rowRef} style={{ display: "flex", width: `${CASES.length * 100}vw`, height: "100%", willChange: "transform" }}>
          {CASES.map((c) => (
            <section
              key={c.headline}
              aria-label={`Referenz ${c.headline}`}
              style={{ width: "100vw", height: "100%", position: "relative", overflow: "hidden", background: c.bg, color: c.text, display: "flex", alignItems: "center" }}
            >
              {/* Riesiger Anfangsbuchstabe Ton-in-Ton, angeschnitten (all-turtles-Anatomie) */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  right: "-0.08em",
                  bottom: "-0.28em",
                  fontFamily: "var(--rr-font-display)",
                  fontWeight: 640,
                  fontSize: "clamp(340px, 58vw, 1100px)",
                  lineHeight: 1,
                  color: c.initialColor,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {c.initial}
              </span>
              <div className="rr-wrap" style={{ position: "relative", width: "100%" }}>
                <p className="rr-eyebrow-lg" style={{ color: c.accent }}>{c.eyebrow}</p>
                <h3 className="rr-display-1" style={{ margin: "0.18em 0 0.22em", color: "inherit" }}>{c.headline}</h3>
                <p className="rr-sub" style={{ maxWidth: "17em", margin: 0 }}>{c.sub}</p>
                <p style={{ marginTop: "clamp(28px, 4vh, 48px)" }}>
                  {c.href.startsWith("http") ? (
                    <a className="rr-link" href={c.href} target="_blank" rel="noopener" style={{ color: "inherit", fontSize: "var(--rr-fs-ui)" }}>
                      Zum Projekt ({c.domain})
                    </a>
                  ) : (
                    <Link className="rr-link" href={c.href} style={{ color: "inherit", fontSize: "var(--rr-fs-ui)" }}>
                      Zum Projekt ({c.domain})
                    </Link>
                  )}
                </p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
