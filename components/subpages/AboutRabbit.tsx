"use client";

import { useEffect, useRef } from "react";
import { clamp01 } from "@/lib/relaunch/morph/grammar";
import { RabbitMark } from "@/components/relaunch/RabbitMark";

/**
 * FIGUREN-SZENE (Hauptseiten-Zitat): der Hase steht gross im Weissraum mit leichter
 * Scroll-Parallax, daneben der Text-Block. Layout wie die Morph-Szenen der Startseite
 * (Figur links, Text rechts). Parallax = transform-only, getBoundingClientRect + rAF,
 * reversibel. prefers-reduced-motion: keine Verschiebung.
 */
export default function AboutRabbit() {
  const secRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sec = secRef.current!;
    let raf = 0;
    let destroyed = false;

    function render() {
      const r = sec.getBoundingClientRect();
      // 0 = Sektion tritt unten ein, 1 = verlaesst oben.
      const p = clamp01((window.innerHeight - r.top) / (window.innerHeight + r.height));
      const shift = (p - 0.5) * -56; // px, dezent
      if (markRef.current) markRef.current.style.transform = `translateY(${shift}px)`;
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
            <RabbitMark color="var(--rr-red)" title="Red Rabbit" />
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
