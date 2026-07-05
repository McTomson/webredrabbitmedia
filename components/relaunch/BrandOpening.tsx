"use client";

import { useEffect, useRef, useState } from "react";
import { RabbitMark } from "./RabbitMark";

/**
 * Marken-Eroeffnung nach dem at "all-turtles"-Vorbild: zuoberst ein zentriertes,
 * ruhiges Serif-Statement, darunter ein RIESIGES Element, das am unteren
 * Viewport-Rand angeschnitten ist und beim Scrollen nach oben in die volle
 * Ansicht steigt. Statt einer Wortmarke steigt hier unser Hasenkopf auf.
 *
 * Sitzt ueber der bestehenden "red rabbit"-Wortmarken-Morph-Buehne (HomeMorph),
 * ist aber scroll-agnostisch: KEINE eigene Lenis-Instanz. Der Fortschritt wird
 * — wie in FooterReassembly.tsx — aus getBoundingClientRect gelesen.
 */

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
// sanfter Ausklang beim Andocken oben
function easeOutCubic(t: number) {
  const u = 1 - t;
  return 1 - u * u * u;
}

export default function BrandOpening() {
  const sectionRef = useRef<HTMLElement>(null);
  const rabbitRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const section = sectionRef.current!;
    const rabbit = rabbitRef.current!;
    const statement = statementRef.current!;
    let raf = 0;
    let destroyed = false;

    function render() {
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height - vh;
      const raw = total > 0 ? clamp01(-r.top / total) : 1;
      const p = easeOutCubic(raw);

      // Der Kopf ist zentriert verankert (translate(-50%,-50%)). Vertikaler
      // Offset in vh: bei p=1 sitzt der Kopf leicht unter der Mitte (Platz fuers
      // Statement oben), bei p=0 ist sein Mittelpunkt am unteren Rand -> nur die
      // obere Haelfte lugt hervor, der Rest ist vom Viewport-Boden angeschnitten.
      const settled = 0.1; //  Mittelpunkt bei ~60vh (Platz fuers Statement)
      const peek = 0.5; //   Mittelpunkt bei ~100vh (unterer Rand)
      const dy = (settled + (1 - p) * (peek - settled)) * vh;
      rabbit.style.transform = `translate(-50%, calc(-50% + ${dy}px))`;

      // Statement bleibt lesbar, verblasst nur dezent, waehrend der Kopf aufsteigt.
      statement.style.opacity = String(1 - raw * 0.2);
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

  // Statischer Endzustand fuer reduced-motion: Kopf zentriert, Statement oben.
  const rabbitStaticTransform = "translate(-50%, calc(-50% + 10vh))";

  return (
    <section
      ref={sectionRef}
      aria-label="Marken-Eroeffnung"
      style={{
        position: "relative",
        height: "200vh",
        background: "var(--rr-paper)",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "var(--rr-paper)",
        }}
      >
        {/* Statement — zuoberst, zentriert, ruhige Lese-Serif (Crimson Pro) */}
        <div
          ref={statementRef}
          style={{
            position: "absolute",
            top: "clamp(48px, 9vh, 132px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(92vw, 1040px)",
            textAlign: "center",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "var(--rr-font-serif)",
              fontWeight: 500,
              fontSize: "clamp(28px, 4vw, 56px)",
              lineHeight: 1.15,
              color: "#1C2837",
              letterSpacing: "-0.01em",
            }}
          >
            Wir bauen ästhetische Websites,
            <br />
            die man dort findet, wo deine Kunden sind.
          </p>
        </div>

        {/* Riesiger Hasenkopf — steigt vom unteren Rand herauf */}
        <div
          ref={rabbitRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            height: "min(72vh, calc(90vw * 267 / 174))",
            aspectRatio: "174 / 267",
            transform: reduced
              ? rabbitStaticTransform
              : "translate(-50%, calc(-50% + 50vh))",
            zIndex: 1,
            willChange: "transform",
          }}
        >
          <RabbitMark
            className="rr-brandopen-mark"
            color="var(--rr-red)"
            title="Red Rabbit"
          />
        </div>
      </div>

      <style>{`
        .rr-brandopen-mark {
          display: block;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </section>
  );
}
