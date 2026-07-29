"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { isBumperDegraded } from "@/lib/relaunch/scroll-standard";

/**
 * SCROLL-EXPERIENCE — site-weites Scroll-Gefuehl (Thomas, 28.07. + 29.07.):
 *
 *   "bei jedem Bereich beim Scrollen stehen bleiben ... egal wie schnell
 *    gescrollt wird ... wenn der Bereich groesser als der Bildschirm ist,
 *    dann soll man am oberen Bereich einmal stoppen, dann weitergehen."
 *
 * Seit 29.07. PFLICHT-STOPP statt Soft-Snap (Entscheidung Thomas, nachdem
 * mehrere Soft-Snap-Nachbesserungen das Problem nicht getroffen haben):
 * Soft-Snap korrigierte nur die ENDPOSITION eines Scrolls — ein kraeftiger
 * Wisch flog trotzdem an mehreren Bereichen vorbei. Pflicht-Stopp begrenzt
 * die Scroll-DISTANZ selbst: pro Geste kommt man maximal bis zur naechsten
 * Bereichs-Oberkante ([data-rr-snap]), dort haelt die Seite an. Erst eine
 * NEUE Geste (neuer Wisch, Richtungswechsel, Tastendruck) faehrt weiter.
 *
 * Bauteile:
 *  1. Lenis-Smooth-Scroll (lerp 0.065). Auf der Homepage existiert bereits
 *     eine Lenis-Instanz in HomeMorph.tsx (window.__rrLenis) — die wird
 *     uebernommen statt eine zweite zu starten.
 *  2. Gesten-Klammer (Pflicht-Stopp): Wheel-Events werden zu Gesten
 *     gruppiert (Luecke > GESTURE_GAP_MS, Richtungswechsel oder Delta-Spike
 *     im Momentum = neue Geste). Beim Gestenstart wird die naechste
 *     [data-rr-snap]-Oberkante in Scrollrichtung als Grenze gesetzt; sobald
 *     der Scroll sie erreicht, wird exakt dort geklemmt und Lenis gestoppt.
 *     Trackpad-Momentum laeuft dann ins Leere — die Seite steht.
 *  3. Idle-Soft-Snap als Aufraeumer: endet eine Geste ZWISCHEN zwei
 *     Bereichen (ohne die Grenze erreicht zu haben), zieht die Seite nach
 *     kurzer Ruhe zur naechstgelegenen Oberkante (Fangbereich CATCH_RATIO).
 *
 * Programmatische Fahrten (BackToTop, Menue-Anker) bleiben frei: die Grenze
 * ist nur "scharf", solange die letzte echte Wheel-Bewegung < DISARM_MS her
 * ist; mousedown/touchstart entschaerfen sofort und loesen einen Stopp.
 *
 * Bewusste Grenzen:
 *  - AUS bei prefers-reduced-motion und Viewport <= 820px (isBumperDegraded).
 *  - Innerhalb hoher Sticky-Tracks ([data-rr-snap-exempt]: CasePanels,
 *    Bumper, Talos-Fahrten, Preis-Matrix) regiert deren eigenes
 *    Dwell-System; der Idle-Snap greift dort nicht. Die Gesten-Klammer
 *    stoppt erst wieder an der naechsten [data-rr-snap]-Kante NACH dem
 *    Track — der Track-Anfang darf zusaetzlich [data-rr-snap] tragen.
 */

/** Ruhezeit ohne Scroll-Input, bevor der Idle-Soft-Snap ausgeloest wird (ms). */
const IDLE_MS = 150;
/** Fangbereich des Idle-Soft-Snaps um die Ziel-Oberkante (Anteil Viewport). */
const CATCH_RATIO = 0.6;
/** Dauer der Idle-Einrast-Fahrt (Sekunden, Lenis-Einheit). */
const SNAP_DURATION = 1.1;
/** Ruhe nach einer programmatischen Fahrt, damit nichts in Schleife geraet. */
const COOLDOWN_MS = 500;
/** Site-weite Lenis-Daempfung. Seit 29.07. (2.) auf Wunsch (Thomas: "diesen
 *  langsamen sticky Effekt ganz raus aus der Seite") praktisch deaktiviert —
 *  Lenis bleibt technisch aktiv (der Pflicht-Stopp braucht sein hijacking von
 *  Wheel-Events, um sauber zu kappen statt nachtraeglich zurueckzuspringen),
 *  aber der lerp-Wert liegt am oberen Ende des dokumentierten 0..1-Bereichs:
 *  die exponentielle Annaeherung an das Scroll-Ziel ist so schnell, dass sie
 *  sich wie natives Scrollen anfuehlt, kein spuerbares Nachziehen mehr. Davor:
 *  0.065, deutlich traeger als Lenis' eigener Default (0.1) — das war genau
 *  der gemeldete "sticky" Effekt. */
const SITE_LERP = 1;
/** Naeher als das gilt als "steht schon dort" — kein erneuter Idle-Snap. */
const DEAD_ZONE_PX = 2;
/** Toleranz an der Track-Oberkante fuer den Exempt-Check. */
const EXEMPT_TOP_TOLERANCE_PX = 4;
/** Wheel-Luecke, ab der der naechste Event als NEUE Geste gilt (ms).
 *  macOS-Momentum feuert in ~16ms-Abstaenden, echte Pausen sind laenger. */
const GESTURE_GAP_MS = 220;
/** Ohne SCROLL-BEWEGUNG so lange (ms) gilt die Geste als ausgelaufen — die
 *  Grenze wird entschaerft, damit programmatische Fahrten (BackToTop) frei
 *  sind. Bewusst an der Bewegung festgemacht, nicht am letzten Wheel-Event:
 *  Lenis' Animation laeuft der Eingabe sekundenlang hinterher (Fund 29.07.,
 *  Grenze war beim Kanten-Uebertritt sonst schon entschaerft). */
const DISARM_MS = 300;
/** Grenz-Suche: Kanten naeher als das an der aktuellen Position zaehlen
 *  nicht als "naechste" Kante (man steht ja schon dort). */
const BOUNDARY_EPS_PX = 6;
/** Delta-Spike im Momentum: so viel groesser als der abklingende Schwung
 *  muss ein Wheel-Delta sein, um als neuer bewusster Wisch zu gelten. */
const SPIKE_FACTOR = 2;
const SPIKE_MIN_DELTA = 24;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function ScrollExperience() {
  useEffect(() => {
    if (isBumperDegraded()) return;

    let disposed = false;
    let ownLenis: Lenis | null = null;
    let lenis: Lenis | null = null;
    let idleTimer = 0;
    let disarmTimer = 0;
    let cooldownUntil = 0;
    // true, solange UNSERE Idle-Snap-Fahrt laeuft: dann keine neuen Idle-Timer.
    let programmatic = false;
    let boot = 0;

    // --- Gesten-Zustand (Pflicht-Stopp) ---
    /** Scharfe Grenze der laufenden Geste (Dokument-Y) oder null = frei. */
    let boundary: number | null = null;
    /** Richtung der laufenden Geste: 1 runter, -1 rauf, 0 keine. */
    let gestureDir = 0;
    let lastWheelTs = 0;
    /** Abklingender Betrag der letzten Wheel-Deltas (Momentum-Referenz). */
    let refDelta = 0;

    function docTop(el: HTMLElement, scrollY: number) {
      return el.getBoundingClientRect().top + scrollY;
    }

    /**
     * Liegt die aktuelle Scroll-Position INNERHALB einer Sticky-Strecke?
     * Am ENDE des Tracks (letzte CATCH_RATIO*vh) gilt das NICHT mehr: dort
     * sitzt in aller Regel schon die naechste Sektion (QA-Fund 29.07.:
     * KundenGrid direkt nach CasePanels wurde sonst nie abgefangen).
     */
    function insideExempt(scrollY: number, vh: number) {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-rr-snap-exempt]"),
      );
      const tailReach = vh * CATCH_RATIO;
      for (const el of nodes) {
        const rect = el.getBoundingClientRect();
        const top = rect.top + scrollY;
        const bottom = top + rect.height;
        if (scrollY > top + EXEMPT_TOP_TOLERANCE_PX && scrollY < bottom - tailReach) return true;
      }
      return false;
    }

    /**
     * Alle gueltigen Snap-Oberkanten. [data-rr-snap]-Elemente IM INNEREN
     * einer Exempt-Strecke werden ignoriert: z.B. traegt KundenSagen als
     * wiederverwendetes Bauteil ein eigenes data-rr-snap und sitzt auf der
     * Homepage in der horizontalen CasePanels-Buehne — seine Dokument-
     * Koordinate ist dort bedeutungslos und wandert beim Scrollen mit
     * (Phantom-Ziel, Fund 29.07.). Der Track-Root selbst (data-rr-snap +
     * data-rr-snap-exempt am selben Element) bleibt gueltig.
     */
    function collectTops(scrollY: number): number[] {
      const tops: number[] = [];
      document.querySelectorAll<HTMLElement>("[data-rr-snap]").forEach((el) => {
        const exemptAncestor = el.parentElement?.closest("[data-rr-snap-exempt]");
        if (exemptAncestor) return;
        tops.push(docTop(el, scrollY));
      });
      return tops;
    }

    /**
     * Zusatz-Kanten, die eine Seite selbst registriert (window.__rrDynamicSnapTops)
     * fuer Zwischenstopps INNERHALB eines Exempt-Tracks, die sich nicht als
     * eigenes [data-rr-snap]-Element ausdruecken lassen (z.B. die vier
     * Ehrlich-gesagt-Statements in website-demo, Thomas 29.07.). Anders als
     * normale Exempt-Kinder werden diese Kanten NICHT vom Exempt-Filter
     * ausgeschlossen — die Seite registriert sie ja bewusst dafuer.
     */
    function dynamicTops(): number[] {
      try {
        const fn = window.__rrDynamicSnapTops;
        return typeof fn === "function" ? fn() || [] : [];
      } catch {
        return [];
      }
    }

    /** Naechste Snap-Oberkante in Scrollrichtung, oder null. */
    function findBoundary(dir: number): number | null {
      const scrollY = window.scrollY;
      let best: number | null = null;
      for (const top of [...collectTops(scrollY), ...dynamicTops()]) {
        if (dir > 0) {
          if (top > scrollY + BOUNDARY_EPS_PX && (best === null || top < best)) best = top;
        } else {
          if (top < scrollY - BOUNDARY_EPS_PX && (best === null || top > best)) best = top;
        }
      }
      return best;
    }

    /** Grenze entschaerfen (Geste beendet) — programmatische Fahrten frei. */
    function disarm() {
      boundary = null;
      window.clearTimeout(disarmTimer);
    }

    /**
     * Endet eine Geste VOR einer dynamischen Kante (Thomas 29.07.: bei den
     * Ehrlich-gesagt-Statements reichte ein normaler Fingerwisch oft nicht
     * bis zur naechsten Statement-Mitte — die Distanz lag ausserhalb von
     * CATCH_RATIO, der generische Idle-Snap (trySnap) griff also nicht, und
     * es brauchte einen zweiten Scroll). Dynamische Kanten sind bewusst
     * gesetzte Schritt-Ziele (siehe window.__rrDynamicSnapTops) — ANDERS als
     * normale [data-rr-snap]-Sektionen wird hier IMMER zu Ende gefahren,
     * unabhaengig von der Distanz: ein Scroll = ein vollstaendiger Schritt.
     */
    function finishDynamicBoundary() {
      const target = boundary;
      if (target === null || !lenis || disposed || programmatic) return;
      const isDynamicTarget = dynamicTops().some((v) => Math.abs(v - target) < 1);
      if (!isDynamicTarget) return;
      const dist = Math.abs(window.scrollY - target);
      if (dist <= DEAD_ZONE_PX) return;
      programmatic = true;
      cooldownUntil = performance.now() + SNAP_DURATION * 1000 + COOLDOWN_MS;
      lenis.scrollTo(target, {
        duration: SNAP_DURATION,
        easing: easeOutCubic,
        onComplete: () => {
          programmatic = false;
        },
      });
    }

    function scheduleDisarm() {
      window.clearTimeout(disarmTimer);
      disarmTimer = window.setTimeout(() => {
        finishDynamicBoundary();
        boundary = null;
      }, DISARM_MS);
    }

    /** Neue bewusste Scroll-Geste: naechste Grenze in Richtung scharf. */
    function beginGesture(dir: number) {
      gestureDir = dir;
      boundary = findBoundary(dir);
    }

    /**
     * Pflicht-Stopp-Kern: Will das LENIS-ZIEL ueber die Kante hinaus, wird
     * das Ziel auf die Kante gekappt — die laufende Fahrt gleitet dann mit
     * der normalen Daempfung in die Kante aus (kein Ruck, kein Zurueck-
     * setzen) und bleibt dort stehen, solange die Geste laeuft. BEWUSST
     * KEIN lenis.stop(): ein harter Lock hat sich mit echtem Trackpad-Input
     * als Falle erwiesen (Thomas 29.07.: Seite haengt, auch rueckwaerts
     * blockiert). Ohne Lock kann nichts einfrieren — nach DISARM_MS Ruhe
     * ist die Grenze weg und jede Richtung sofort frei.
     */
    function capToBoundary() {
      if (boundary === null || !lenis) return;
      const wantsBeyond =
        gestureDir > 0 ? lenis.targetScroll > boundary : lenis.targetScroll < boundary;
      if (wantsBeyond) lenis.scrollTo(boundary, { lerp: SITE_LERP });
    }

    /**
     * Idle-Aufraeumer: nach Ruhe zur naechstgelegenen Kante ziehen. NUR fuer
     * echte [data-rr-snap]-Elementkanten (collectTops) — bewusst OHNE
     * dynamicTops(): "naechstgelegen" kennt keine Richtung und wuerde bei den
     * Ehrlich-gesagt-Statements gern RUECKWAERTS zur Kante ziehen, von der die
     * Geste gerade herkam (Fund 29.07.: 200px vor, dann hierdurch wieder
     * zurueckgezogen). Fuer dynamische Kanten uebernimmt stattdessen
     * finishDynamicBoundary() bei Gesten-Ende — die kennt die Richtung, weil
     * sie die Kante der GESTE zu Ende faehrt, nicht die naechstgelegene.
     */
    function trySnap() {
      if (disposed || !lenis) return;
      if (performance.now() < cooldownUntil) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      if (insideExempt(scrollY, vh)) return;

      let bestTop = 0;
      let bestDist = Infinity;
      let found = false;
      for (const top of collectTops(scrollY)) {
        const dist = Math.abs(top - scrollY);
        if (dist < bestDist) {
          bestDist = dist;
          bestTop = top;
          found = true;
        }
      }
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

    /** Scroll-Bewegung (Lenis): Grenze pruefen, sonst Idle-Snap planen.
     *  scheduleDisarm haengt an der BEWEGUNG: solange die Fahrt rollt,
     *  bleibt die Grenze scharf — erst nach DISARM_MS Stillstand frei. */
    function onScroll() {
      if (programmatic) return;
      scheduleDisarm();
      capToBoundary();
      scheduleIdle();
    }

    function onWheel(e: WheelEvent) {
      if (e.deltaY === 0) return;
      const now = performance.now();
      const dir = e.deltaY > 0 ? 1 : -1;
      const abs = Math.abs(e.deltaY);
      const gap = now - lastWheelTs;
      lastWheelTs = now;

      // Neuer bewusster Wisch WAEHREND des abklingenden Momentums: das Delta
      // springt deutlich ueber den Referenzwert.
      const spike = abs >= SPIKE_MIN_DELTA && abs > refDelta * SPIKE_FACTOR;
      refDelta = Math.max(abs, refDelta * 0.8);

      // Echter User-Input bricht eine laufende Idle-Snap-Fahrt ab.
      if (programmatic) {
        programmatic = false;
        cooldownUntil = 0;
      }

      if (gap > GESTURE_GAP_MS || dir !== gestureDir || spike) {
        beginGesture(dir);
      }
      // Sofort kappen (Lenis' Wheel-Handler lief vor unserem): so waechst
      // das Ziel nie sichtbar ueber die Kante hinaus.
      capToBoundary();
      scheduleDisarm();
    }

    /** Tastatur-Scroll: gilt als neue Geste in Tastenrichtung. */
    function onKeydown(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (programmatic) {
        programmatic = false;
        cooldownUntil = 0;
      }
      const down = ["ArrowDown", "PageDown", " "].includes(e.key) && !e.shiftKey;
      const up = ["ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey);
      if (down || up) {
        beginGesture(down ? 1 : -1);
        scheduleDisarm();
      } else if (["Home", "End"].includes(e.key)) {
        disarm();
      }
    }

    /** Klick/Touch: Grenze entschaerfen (BackToTop, Menue bleiben frei). */
    function onPointer() {
      if (programmatic) {
        programmatic = false;
        cooldownUntil = 0;
      }
      disarm();
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
      window.addEventListener("wheel", onWheel, { passive: true });
      window.addEventListener("mousedown", onPointer, { passive: true });
      window.addEventListener("touchstart", onPointer, { passive: true });
      window.addEventListener("keydown", onKeydown);
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
      window.clearTimeout(disarmTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("touchstart", onPointer);
      window.removeEventListener("keydown", onKeydown);
      lenis?.off("scroll", onScroll);
      if (ownLenis) {
        if (window.__rrLenis === ownLenis) delete window.__rrLenis;
        ownLenis.destroy();
      }
    };
  }, []);

  return null;
}
