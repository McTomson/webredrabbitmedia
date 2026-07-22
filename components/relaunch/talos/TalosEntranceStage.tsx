"use client";

// Talos-Auftritts-Buehne: kontainierter three-spline-Canvas (rechtes Seiten-
// Drittel), auf dem Talos EINMAL einen Auftritt spielt, sobald die Sektion in
// den Viewport kommt: er gleitet von rechts herein (leicht abgewandt), richtet
// sich zum User aus (Body-Yaw -> 0) und winkt mit der rechten Hand (die bereits
// geloeste Gruss-Choreografie aus talosMotion). Danach: Idle-Atmung, Blickfolge,
// Blinzeln. Fuer den Helfer-Moment der Leistungsseite gedacht (Talos als Verb).
//
// Technik wie TalosHeroStage/TalosPresentation: Loader + Buehne laufen auf
// `three-spline` (three@0.149, per webpack isoliert). Kein Wasserzeichen, 0 Euro.
// Schwache Geraete / kein WebGL2 / reduced-motion -> statische Endpose bzw. Poster.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three-spline";
import SplineLoader from "@splinetool/loader";
import { buildTalosRig, type TalosRig } from "./talosRig";
import { createTalosMotion, type TalosMotion } from "./talosMotion";

const SCENE_URL = "https://prod.spline.design/bN7MTDW-zSkVIOxf/scene.splinecode";

// Ruhige Kamera (am Modell vermessen: Kopf-Oberkante ~y300, Fuesse ~y-40, also
// Figur-Mitte ~y130). Auf die Figur-MITTE gezielt und weit genug weg, damit der
// GANZE Koerper (Kopf UND Fuesse) mit Luft im Bild bleibt und Talos "nicht zu
// gross" wirkt (rechtes Drittel). Vorher zu hoch gezielt -> Beine abgeschnitten.
const CAM_POS: [number, number, number] = [30, 150, 860];
const CAM_TGT: [number, number, number] = [0, 132, 12];
const CAM_FOV = 40;

// --- Auftritts-Parameter (visuell tunebar, QA-Hooks: window.__talosEntrance) ---
const ENTRANCE_DUR = 2.6;     // Sekunden fuer den ganzen Auftritt (bis Winken)
const ENTER_X = 470;          // Start-Offset rechts (Weltkoordinaten, off-canvas)
const ENTER_ARC = 34;         // leichter Hoehen-Bogen waehrend des Reinfliegens
const ENTER_YAW = 0.62;       // Anfangs-Drehung (abgewandt), dreht sich auf 0
const FLY_END = 0.5;          // ent-Anteil: bis hier ist er an seinem Platz
const TURN_END = 0.8;         // ent-Anteil: bis hier hat er sich zum User gedreht
const WAVE_AT = 0.82;         // ent-Anteil: hier startet das Winken

const smooth = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10); // smootherstep
};

export interface TalosEntranceStageProps {
  /** Auftritt automatisch spielen, sobald sichtbar (default true). */
  autoplay?: boolean;
  /**
   * Opt-in: Klick (und Enter/Space) auf die Buehne loest die Wink-Choreografie
   * ERNEUT aus (reuse von talosMotion.triggerGreeting, das waehrend eines
   * laufenden Winkens ohnehin no-op ist). Default false -> Verhalten
   * bit-identisch zu allen bestehenden Verwendungen.
   */
  waveOnClick?: boolean;
  /**
   * Optionale Verzoegerung (ms) zwischen Sichtbar-Werden und Auftritts-Start
   * (additiv; Default 0 = bisheriges Verhalten, Start sofort bei inView). Damit
   * kann zuerst das Dashboard/die Sektion einblenden und Talos danach auftreten.
   * Greift nur im autoplay-Pfad; prefers-reduced-motion zeigt sofort die Endpose.
   */
  autoplayDelayMs?: number;
  /**
   * Optionale Kamera-Kadrierung (additiv; Default = bisherige Konstanten,
   * Oberkoerper-Framing der Talos-Seite). Die Website-Dashboard-Sektion
   * braucht den GANZEN Koerper inkl. Fuesse und uebergibt eigene Werte.
   */
  camPos?: [number, number, number];
  camTgt?: [number, number, number];
  camFov?: number;
  /**
   * Welcher Arm winkt am ENDE des Auftritts. "primary" (Default, arm1/Hand2 —
   * bit-identisch zu allen bestehenden Verwendungen) oder "other" (gespiegelte
   * Kette). Der Klick-Wink bleibt unabhaengig davon immer "other".
   */
  greetArm?: "primary" | "other";
}

export default function TalosEntranceStage({ autoplay = true, waveOnClick = false, autoplayDelayMs = 0, camPos, camTgt, camFov, greetArm = "primary" }: TalosEntranceStageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [no3d, setNo3d] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let webgl2 = false;
    try {
      webgl2 = !!document.createElement("canvas").getContext("webgl2");
    } catch {
      webgl2 = false;
    }
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    if (!webgl2 || (mem !== undefined && mem <= 4)) {
      setNo3d(true);
      return;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene(); // transparent (alpha), Seite liefert Grund

    const camera = new THREE.PerspectiveCamera(camFov ?? CAM_FOV, host.clientWidth / host.clientHeight, 10, 100000);
    camera.position.set(...(camPos ?? CAM_POS));
    camera.lookAt(new THREE.Vector3(...(camTgt ?? CAM_TGT)));

    scene.add(new THREE.AmbientLight(0xffffff, 0.68));
    const key = new THREE.PointLight(0xffffff, 1.35, 4000, 1);
    key.position.set(180, 460, 420);
    scene.add(key);
    const fill = new THREE.PointLight(0xdfe7ee, 0.5, 4000, 1);
    fill.position.set(-260, 120, 220);
    scene.add(fill);

    const pivot = new THREE.Group();
    scene.add(pivot);

    let disposed = false;
    let rig: TalosRig | null = null;
    let motion: TalosMotion | null = null;
    let loaded = false;

    // Auftritts-Zustand.
    let inView = false;
    let inViewAt = -1;        // Zeitpunkt (ms) des Sichtbar-Werdens (fuer Delay)
    let started = false;      // Auftritt begonnen
    let ent = 0;              // 0..1 Auftritts-Fortschritt
    let waved = false;        // Winken schon ausgeloest?
    let manualProg: number | null = null; // QA-Scrub ueberschreibt die Zeit

    const applyEntrancePose = () => {
      // Vor dem Start: ganz rechts, abgewandt, unsichtbar bis inView.
      const e = ent;
      const fly = smooth(e / FLY_END);
      const x = (1 - fly) * ENTER_X;
      const yArc = Math.sin(fly * Math.PI) * ENTER_ARC;
      // Drehung: bleibt bis FLY_END bei ENTER_YAW, dreht dann auf 0.
      const turnRaw = (e - FLY_END) / (TURN_END - FLY_END);
      const turn = smooth(turnRaw);
      const yaw = e <= FLY_END ? ENTER_YAW : (1 - turn) * ENTER_YAW;
      pivot.position.set(x, yArc, 0);
      pivot.rotation.y = yaw;
    };

    const onResize = () => {
      if (!host.clientWidth) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener("resize", onResize);
    // vh-basierte Buehne (min(78vh,...)) -> iOS-Adressleisten-Kollaps aendert vh
    // ohne verlaesslichen window-resize; visualViewport nachziehen (L-referenzen-01).
    window.visualViewport?.addEventListener("resize", onResize);

    const onGaze = (e: PointerEvent) => {
      motion?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("pointermove", onGaze);

    // Opt-in: Klick/Tastatur auf der Buehne loest die Wink-Choreografie erneut
    // aus. Reuse von motion.triggerGreeting (no-op waehrend ein Winken laeuft).
    const wrap = wrapRef.current;
    const onActivate = () => {
      // Klick-Wink mit der ANDEREN Hand (der Auftritts-Wink nutzt die erste).
      motion?.triggerGreeting("other");
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Enter" || ev.key === " " || ev.key === "Spacebar") {
        ev.preventDefault();
        onActivate();
      }
    };
    if (waveOnClick && wrap) {
      wrap.addEventListener("click", onActivate);
      wrap.addEventListener("keydown", onKey);
    }

    // Auftritt startet, sobald Sektion sichtbar UND Rig geladen.
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) inView = true;
      },
      { threshold: 0.35 },
    );
    io.observe(host);

    let torn = false;
    const teardown = () => {
      if (torn) return;
      torn = true;
      renderer.setAnimationLoop(null);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onGaze);
      if (waveOnClick && wrap) {
        wrap.removeEventListener("click", onActivate);
        wrap.removeEventListener("keydown", onKey);
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      delete (window as unknown as Record<string, unknown>).__talosEntrance;
    };

    const loader = new SplineLoader() as unknown as {
      load: (u: string, ok: (s: unknown) => void, p?: unknown, e?: (e: unknown) => void) => void;
    };
    loader.load(
      SCENE_URL,
      (splineScene) => {
        if (disposed) return;
        pivot.add(splineScene as never);
        rig = buildTalosRig(THREE, splineScene);
        if (rig) {
          motion = createTalosMotion(rig, splineScene);
          motion.setReducedMotion(reduced);
        }
        loaded = true;
        if (reduced) {
          // Statische Endpose: an seinem Platz, zum User, kein Fly-in/Winken.
          ent = 1;
          started = true;
          applyEntrancePose();
        }
      },
      undefined,
      () => {
        teardown();
        setNo3d(true);
      },
    );

    // QA-Hooks: window.__talosEntrance.play() / .setProg(0..1) / .replay()
    (window as unknown as Record<string, unknown>).__talosEntrance = {
      play: () => { if (loaded) { started = true; manualProg = null; } },
      replay: () => { ent = 0; waved = false; started = true; manualProg = null; },
      setProg: (p: number) => { manualProg = Math.max(0, Math.min(1, p)); started = true; },
      // QA: erneutes Winken ausloesen bzw. pruefen, ob gerade gewinkt wird
      // (nutzt fuer die Klick-Wink-Verifikation der Website-Leistungsseite).
      wave: () => { motion?.triggerGreeting(); },
      // QA: Wink mit der ANDEREN Hand (entspricht dem Klick-Verhalten).
      wave2: () => { motion?.triggerGreeting("other"); },
      // QA: Kamera-Handle zum Live-Tuning der Kadrierung (nur Lesen/Justieren).
      camera,
      isWaving: () => motion?.isBusy() ?? false,
    };

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();

      if (loaded && !reduced) {
        if (manualProg != null) {
          ent = manualProg;
        } else {
          if (!started && autoplay && inView) {
            // Erst nach Ablauf der optionalen Verzoegerung starten (Default 0
            // -> sofort). Erlaubt: zuerst Dashboard einblenden, dann Talos.
            if (inViewAt < 0) inViewAt = performance.now();
            if (performance.now() - inViewAt >= autoplayDelayMs) started = true;
          }
          if (started && ent < 1) ent = Math.min(1, ent + delta / ENTRANCE_DUR);
        }
        applyEntrancePose();
        if (started && !waved && ent >= WAVE_AT) {
          waved = true;
          motion?.triggerGreeting(greetArm);
        }
      }

      motion?.update(delta);
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      rig?.dispose();
      teardown();
    };
  }, [autoplay, autoplayDelayMs, greetArm]);

  return (
    <div
      className={"tle-wrap" + (waveOnClick ? " tle-wrap--clickable" : "")}
      ref={wrapRef}
      {...(waveOnClick
        ? { role: "button", tabIndex: 0, "aria-label": "Talos winken lassen" }
        : {})}
    >
      <div className="tle-canvas" aria-hidden="true" ref={hostRef} />
      {no3d && <div className="tle-poster" aria-hidden="true" />}
      <style
        dangerouslySetInnerHTML={{
          __html: `
.tle-wrap{ position:relative; width:100%; height:100%; min-height:320px; overflow:hidden; }
/* Klickbar trotz pointer-events:none am Slot-Wrapper (Nachkomme re-aktiviert). */
.tle-wrap--clickable{ pointer-events:auto; cursor:pointer; }
.tle-wrap--clickable:focus-visible{ outline:2px solid var(--rr-red, #f12032); outline-offset:3px; }
.tle-canvas{ position:absolute; inset:0; }
.tle-canvas canvas{ display:block; }
.tle-poster{ position:absolute; inset:0;
  background:radial-gradient(120% 90% at 50% 40%, #ffffff 0%, #f4f4f2 55%, #e9edf0 100%); }
`,
        }}
      />
    </div>
  );
}
