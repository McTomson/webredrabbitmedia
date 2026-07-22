"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RabbitMark } from "@/components/relaunch/RabbitMark";

/**
 * Gemeinsames Ecken-Logo (rote Hasen-Marke oben links) fuer ALLE
 * Relaunch-Preview-Seiten. Groesse/Position 1:1 aus der Leistungs-/Website-
 * Seite (fixed, top clamp(18px,2.4vw,34px), left clamp(20px,4vw,64px),
 * z-index 43, Marke width clamp(18px,1.8vw,21px)). Die Groesse ist bewusst
 * NICHT von --rr-gutter abhaengig (hart auf den Referenz-Fallback), damit sie
 * unabhaengig vom .rr-Scope auf jeder Seite identisch sitzt.
 *
 * Verhalten (Thomas 22.07., praezisiert): beim Laden UNSICHTBAR, blendet
 * NUR beim Runterscrollen langsam (~1200ms) ein, sobald sich die Hero-
 * Woerter zerlegen (Trigger scrollY > 45% Viewport-Hoehe, einmalig).
 * BEWUSST KEIN Zeit-Fallback ("immer erst wenn wir weiter runter gehen").
 * prefers-reduced-motion: sofort sichtbar, ohne Transition.
 */
export default function CornerLogo() {
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
      if (window.scrollY > window.innerHeight * 0.45) reveal();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // falls die Seite bereits gescrollt geladen wird

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Link
      href="/relaunch-preview"
      aria-label="Zur Startseite"
      tabIndex={shown ? 0 : -1}
      style={{
        position: "fixed",
        top: "clamp(18px, 2.4vw, 34px)",
        left: "clamp(20px, 4vw, 64px)",
        zIndex: 43,
        display: "block",
        lineHeight: 0,
        opacity: shown ? 1 : 0,
        pointerEvents: shown ? "auto" : "none",
        transition: reduced ? "none" : "opacity 1200ms ease",
      }}
    >
      <RabbitMark style={{ display: "block", width: "clamp(18px, 1.8vw, 21px)", height: "auto" }} />
    </Link>
  );
}
