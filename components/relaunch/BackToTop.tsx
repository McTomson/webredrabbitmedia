"use client";

import { useEffect, useState } from "react";

/**
 * Gemeinsamer "Zurueck-zum-Anfang"-Button unten links, Gegenstueck zu
 * CornerLogo (oben links, fuehrt zur Startseite) — gleiche Position/Groesse/
 * Einblend-Logik, nur unten statt oben und scrollt zum Seitenanfang statt
 * zur Startseite (Thomas 29.07.).
 *
 * Verhalten identisch zu CornerLogo: beim Laden UNSICHTBAR, blendet nur beim
 * Runterscrollen langsam (~1200ms) ein, sobald ca. 2 Viewport-Hoehen gescrollt
 * wurden (einmalig, kein Wieder-Ausblenden — so bleibt die Ecke ruhig statt
 * bei jedem kleinen Scroll hoch/runter zu flackern).
 * prefers-reduced-motion: sofort sichtbar, ohne Transition, Sprung statt
 * Scroll-Animation.
 */
export default function BackToTop() {
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduced(true);
      setShown(true);
      return;
    }

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setShown(true);
      window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 2.0) reveal();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // falls die Seite bereits gescrollt geladen wird

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    // Site-weite Lenis-Instanz (HomeMorph/ScrollExperience) uebernehmen,
    // falls vorhanden, damit die Fahrt zum Anfang genauso gedaempft wirkt
    // wie der Rest des Scroll-Gefuehls. Sonst nativer smooth scroll.
    const lenis = window.__rrLenis;
    if (!reduced && lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Nach oben"
      tabIndex={shown ? 0 : -1}
      style={{
        position: "fixed",
        bottom: "clamp(18px, 2.4vw, 34px)",
        left: "clamp(20px, 4vw, 64px)",
        zIndex: 43,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "clamp(30px, 2.6vw, 36px)",
        height: "clamp(30px, 2.6vw, 36px)",
        padding: 0,
        border: "1px solid rgba(35, 38, 46, 0.22)",
        borderRadius: 0,
        background: "transparent",
        color: "#23262e",
        cursor: "pointer",
        opacity: shown ? 1 : 0,
        pointerEvents: shown ? "auto" : "none",
        transition: reduced ? "none" : "opacity 1200ms ease, border-color 0.2s ease, color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#f12032";
        e.currentTarget.style.color = "#f12032";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(35, 38, 46, 0.22)";
        e.currentTarget.style.color = "#23262e";
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d="M7 12V2M2.2 6.8 7 2l4.8 4.8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
