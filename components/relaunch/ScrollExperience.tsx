"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { isBumperDegraded } from "@/lib/relaunch/scroll-standard";

/**
 * SCROLL-EXPERIENCE — site-weites Scroll-Gefuehl (Thomas, 28.07.):
 *
 *   "bei jedem Bereich beim Scrollen stehen bleiben ... der Kunde muss
 *    durchatmen koennen bei jedem Punkt, nicht dass er einfach in 2 Sekunden
 *    durch die Seite kommt ... wenn der Bereich groesser als der Bildschirm
 *    ist, dann soll man am oberen Bereich einmal stoppen, dann weitergehen."
 *
 * Gewaehlte Variante: SANFTES Einrasten, kein hartes Trapping. Die Seite zieht
 * beim Loslassen zur naechsten Sektionsoberkante, wenn man in der Naehe ist —
 * man SPUERT den Stopp, kann aber mit Schwung darueber hinweg.
 *
 * Zwei Bauteile in einer Komponente:
 *  1. Lenis-Smooth-Scroll (lerp 0.08) fuer das traegere Gesamtgefuehl. Auf der
 *     Homepage existiert bereits eine Lenis-Instanz in HomeMorph.tsx; die legt
 *     sich auf window.__rrLenis, wir uebernehmen sie statt eine zweite zu
 *     starten (zwei Lenis-Instanzen wuerden gegeneinander scrollen).
 *  2. Soft-Snap-Engine: Ziele sind alle Elemente mit [data-rr-snap]. Nach
 *     ~150ms ohne Scroll-Input wird die naechstgelegene Ziel-Oberkante gesucht;
 *     liegt sie naeher als 28% Viewport-Hoehe, zieht die Seite in ~0.9s dorthin.
 *
 * Bewusste Grenzen:
 *  - AUS bei prefers-reduced-motion und bei Viewport <= 820px
 *    (isBumperDegraded aus lib/relaunch/scroll-standard.ts, gleiche Schwelle
 *    wie alle Bumper-Strecken).
 *  - Innerhalb der hohen Sticky-Tracks (CasePanels, ScrollBumper,
 *    TalosTalenteFahrt, Demo-Heroes) wird NICHT gesnappt: diese Strecken haben
 *    ihr eigenes Dwell-System, ein Snap wuerde dagegen kaempfen. Markierung am
 *    Track-Root: [data-rr-snap-exempt]. Der Track-ANFANG darf zusaetzlich
 *    [data-rr-snap] tragen (Einstieg rastet ein, innen regiert der Dwell).
 */

/** Ruhezeit ohne Scroll-Input, bevor das Einrasten ausgeloest wird (ms). */
const IDLE_MS = 150;
/** Fangbereich um die Ziel-Oberkante, als Anteil der Viewport-Hoehe. */
const CATCH_RATIO = 0.35;
/** Dauer der Einrast-Fahrt (Sekunden, Lenis-Einheit). */
const SNAP_DURATION = 1.1;
/** Ruhe nach einer programmatischen Fahrt, damit nichts in Schleife geraet. */
const COOLDOWN_MS = 500;
/** Site-weite Lenis-Daempfung (traeger als der Lenis-Default). */
const SITE_LERP = 0.065;
/** Naeher als das gilt als "steht schon dort" — kein erneuter Snap. */
const DEAD_ZONE_PX = 2;
/** Toleranz an der Track-Oberkante, damit der Einstiegs-Snap nicht sofort
 *  als "innerhalb des Tracks" gilt. */
const EXEMPT_TOP_TOLERANCE_PX = 4;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function ScrollExperience() {
  useEffect(() => {
    if (isBumperDegraded()) return;

    let disposed = false;
    let ownLenis: Lenis | null = null;
    let lenis: Lenis | null = null;
    let idleTimer = 0;
    let cooldownUntil = 0;
    // true, solange UNSERE Einrast-Fahrt laeuft: dann keine neuen Idle-Timer.
    let programmatic = false;
    let boot = 0;

    function docTop(el: HTMLElement, scrollY: number) {
      return el.getBoundingClientRect().top + scrollY;
    }

    /** Liegt die aktuelle Scroll-Position INNERHALB einer Sticky-Strecke? */
    function insideExempt(scrollY: number) {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-rr-snap-exempt]"),
      );
      for (const el of nodes) {
        const rect = el.getBoundingClientRect();
        const top = rect.top + scrollY;
        const bottom = top + rect.height;
        if (scrollY > top + EXEMPT_TOP_TOLERANCE_PX && scrollY < bottom) return true;
      }
      return false;
    }

    function trySnap() {
      if (disposed || !lenis) return;
      if (performance.now() < cooldownUntil) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      if (insideExempt(scrollY)) return;

      let bestTop = 0;
      let bestDist = Infinity;
      let found = false;
      document.querySelectorAll<HTMLElement>("[data-rr-snap]").forEach((el) => {
        const top = docTop(el, scrollY);
        const dist = Math.abs(top - scrollY);
        if (dist < bestDist) {
          bestDist = dist;
          bestTop = top;
          found = true;
        }
      });
      if (!found) return;
      if (bestDist <= DEAD_ZONE_PX) return;
      if (bestDist > vh * CATCH_RATIO) return;

      programmatic = true;
      cooldownUntil = performance.now() + SNAP_DURATION * 1000 + COOLDOWN_MS;
      lenis.scrollTo(bestTop, {
        duration: SNAP_DURATION,
        easing: easeOutCubic,
        onComplete: () => {
          programmatic = false;
        },
      });
    }

    function scheduleIdle() {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(trySnap, IDLE_MS);
    }

    /** Scroll-Bewegung: waehrend der eigenen Fahrt nichts neu planen. */
    function onScroll() {
      if (programmatic) return;
      scheduleIdle();
    }

    /** Echter User-Input bricht die laufende Einrast-Fahrt ab. */
    function onUserInput() {
      if (programmatic) {
        programmatic = false;
        cooldownUntil = 0;
      }
      scheduleIdle();
    }

    function attach() {
      if (disposed) return;
      // Homepage: HomeMorph hat schon eine Lenis-Instanz gebaut und auf
      // window.__rrLenis gelegt. Die uebernehmen wir (kein zweites Lenis).
      const shared = window.__rrLenis;
      let active: Lenis;
      if (shared) {
        active = shared;
      } else {
        ownLenis = new Lenis({ autoRaf: true, lerp: SITE_LERP });
        active = ownLenis;
        window.__rrLenis = ownLenis;
      }
      lenis = active;

      active.on("scroll", onScroll);
      window.addEventListener("wheel", onUserInput, { passive: true });
      window.addEventListener("touchstart", onUserInput, { passive: true });
      window.addEventListener("keydown", onUserInput);
    }

    // Einen Tick warten: so sind alle Mount-Effekte durch (inkl. HomeMorph),
    // window.__rrLenis ist gesetzt, falls die Seite schon eine Instanz hat.
    // setTimeout statt requestAnimationFrame: rAF feuert in Hintergrund-Tabs
    // NICHT (Chrome throttelt auf 0) — die Engine wuerde dann nie booten,
    // wenn die Seite in einem inaktiven Tab geladen wird (QA-Fund 29.07.).
    boot = window.setTimeout(attach, 0);

    return () => {
      disposed = true;
      window.clearTimeout(boot);
      window.clearTimeout(idleTimer);
      window.removeEventListener("wheel", onUserInput);
      window.removeEventListener("touchstart", onUserInput);
      window.removeEventListener("keydown", onUserInput);
      lenis?.off("scroll", onScroll);
      if (ownLenis) {
        if (window.__rrLenis === ownLenis) delete window.__rrLenis;
        ownLenis.destroy();
      }
    };
  }, []);

  return null;
}
