"use client";

// Auftakt-Prototyp: weisser Grund, Talos fliegt aus der Ferne heran, landet
// mit sanftem Dip, winkt, danach faehrt die Kamera weich in eine Nah-
// Einstellung und eine Glass-Card ("Was Talos kann") blendet daneben ein.
// Laeuft automatisch (Thomas 19.07.: er kommt zu dir, kein Scroll-Zwang).
// Reduced-Motion: statische Landepose + Card sofort.
//
// Buehne = dieselbe isolierte three-spline-Instanz wie die Fidelity-Demo.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three-spline";
import SplineLoader from "@splinetool/loader";
import { buildTalosRig, type TalosRig } from "./talosRig";
import { createTalosMotion, type TalosMotion } from "./talosMotion";

const SCENE_URL = "https://prod.spline.design/bN7MTDW-zSkVIOxf/scene.splinecode";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => t * t * (3 - 2 * t);

export default function TalosIntro() {
  const hostRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<TalosRig | null>(null);
  const motionRef = useRef<TalosMotion | null>(null);
  const [phase, setPhase] = useState<"laedt" | "flug" | "text">("laedt");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4f4f2); // Marken-Off-White

    const camera = new THREE.PerspectiveCamera(
      42,
      host.clientWidth / host.clientHeight,
      10,
      100000
    );
    camera.position.set(0, 170, 820);
    camera.lookAt(0, 20, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const key = new THREE.PointLight(0xffffff, 1.4, 4000, 1);
    key.position.set(180, 460, 420);
    scene.add(key);
    const fill = new THREE.PointLight(0xdfe7ee, 0.5, 4000, 1);
    fill.position.set(-260, 120, 220);
    scene.add(fill);

    const pivot = new THREE.Group();
    scene.add(pivot);

    // Start-Zustand fuer den Anflug: weit hinten, hoch, klein, leicht gekippt.
    const START = { x: 90, y: 470, z: -1500, rotX: 0.3, rotY: -0.5 };
    const setFlightPose = (t: number) => {
      // t 0..1: aus der Ferne ins Zentrum
      const e = easeOutCubic(t);
      pivot.position.set(
        START.x * (1 - e),
        START.y * (1 - e),
        START.z * (1 - e)
      );
      pivot.rotation.x = START.rotX * (1 - e);
      pivot.rotation.y = START.rotY * (1 - e);
    };

    let disposed = false;
    let rig: TalosRig | null = null;
    let motion: TalosMotion | null = null;
    let started = 0; // Zeitstempel Ladeende (via clock)

    const loader = new SplineLoader() as unknown as {
      load: (u: string, ok: (s: unknown) => void, p?: unknown, e?: (e: unknown) => void) => void;
    };
    loader.load(
      SCENE_URL,
      (splineScene) => {
        if (disposed) return;
        pivot.add(splineScene as never);
        rig = buildTalosRig(THREE, splineScene);
        rigRef.current = rig;
        if (rig) {
          motion = createTalosMotion(rig, splineScene);
          motionRef.current = motion;
          motion.setReducedMotion(reduced);
        }
        (window as unknown as Record<string, unknown>).__talosScene = splineScene;
        (window as unknown as Record<string, unknown>).__talos = rig;
        (window as unknown as Record<string, unknown>).__talosMotion = motion;
        if (reduced) {
          setFlightPose(1);
          setPhase("text");
        } else {
          setFlightPose(0);
          started = clock.getElapsedTime();
          setPhase("flug");
        }
      },
      undefined,
      () => setPhase("text")
    );

    const onResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Blickfolge nach dem Auftakt.
    const onGaze = (e: PointerEvent) => {
      motion?.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener("pointermove", onGaze);

    // Timeline-Marker (Sekunden ab Ladeende)
    const T_FLIGHT = 2.6; // Anflug
    const T_DIP = 0.45; // Lande-Dip danach
    let greeted = false;
    let textShown = false;

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      const now = clock.getElapsedTime();

      if (rig && motion && !reduced && started > 0) {
        const t = now - started;
        if (t < T_FLIGHT) {
          setFlightPose(t / T_FLIGHT);
        } else if (t < T_FLIGHT + T_DIP) {
          // Lande-Dip: kurz einsacken und zurueckfedern.
          const p = (t - T_FLIGHT) / T_DIP;
          const dip = Math.sin(p * Math.PI) * -14;
          pivot.position.set(0, dip, 0);
          pivot.rotation.set(0, 0, 0);
        } else {
          pivot.position.set(0, 0, 0);
          if (!greeted) {
            greeted = true;
            motion.triggerGreeting();
          }
          if (!textShown && t > T_FLIGHT + 0.9) {
            textShown = true;
            setPhase("text");
          }
        }
      }

      motion?.update(delta);
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      motionRef.current = null;
      rigRef.current?.dispose();
      rigRef.current = null;
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onGaze);
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#f4f4f2", overflow: "hidden" }}>
      <div ref={hostRef} style={{ position: "absolute", inset: 0 }} />

      {/* Glass-Card: blendet nach der Landung ein, rechts neben Talos */}
      <div
        aria-hidden={phase !== "text"}
        style={{
          position: "absolute",
          top: "50%",
          right: "clamp(1.5rem, 8vw, 8rem)",
          transform: `translateY(-50%) translateX(${phase === "text" ? "0" : "24px"})`,
          opacity: phase === "text" ? 1 : 0,
          transition: "opacity 900ms ease, transform 900ms cubic-bezier(0.22,1,0.36,1)",
          width: "min(340px, 78vw)",
          padding: "1.6rem 1.7rem",
          borderRadius: 20,
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(18px) saturate(1.4)",
          WebkitBackdropFilter: "blur(18px) saturate(1.4)",
          border: "1px solid rgba(255,255,255,0.7)",
          boxShadow: "0 24px 60px rgba(20,30,45,0.14)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#20242b",
        }}
      >
        <p
          style={{
            margin: "0 0 0.9rem",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#0a72a0",
            fontWeight: 600,
          }}
        >
          Das ist Talos
        </p>
        <p style={{ margin: "0 0 1.1rem", fontSize: 20, lineHeight: 1.3, fontWeight: 500 }}>
          Deine Website bekommt einen Mitarbeiter.
        </p>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: "0.6rem" }}>
          {["schreibt und pflegt Inhalte", "nimmt Anfragen an", "sorgt dafuer, dass etwas passiert"].map(
            (t) => (
              <li
                key={t}
                style={{ display: "flex", gap: "0.6rem", alignItems: "center", fontSize: 15 }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#39c2d7",
                    flex: "0 0 auto",
                  }}
                />
                {t}
              </li>
            )
          )}
        </ul>
      </div>

      {phase === "laedt" && (
        <p
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            margin: 0,
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#8a9098",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Talos kommt ...
        </p>
      )}
    </div>
  );
}
