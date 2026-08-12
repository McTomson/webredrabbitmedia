"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-Reveal (IntersectionObserver, reversibel: blendet beim Verlassen wieder
 * aus). Der Inhalt bleibt echter SSR-Text im DOM (kein display:none) — SEO-sicher.
 * prefers-reduced-motion: sofort sichtbar (CSS-Kill-Switch in ueber-uns.css).
 * Bewegt nur opacity/transform. Kein Lenis, keine zweite Scroll-Engine.
 */
export default function Reveal({
  children,
  className = "",
  stagger = false,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  as?: "div" | "section";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          e.target.classList.toggle("is-in", e.isIntersecting);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const base = stagger ? "uup-reveal-stagger" : "uup-reveal";
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLElement>}
      className={`${base} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
