"use client";

// Fidelity-Check-Demo: laedt die ORIGINAL-NEXBOT-Szene ueber @splinetool/loader
// in einen eigenen Vanilla-three-Canvas. WICHTIG: Loader + Buehne laufen auf
// `three-spline` (= three@0.149, die Version gegen die der Loader gebaut ist),
// per webpack NormalModuleReplacementPlugin von der 0.185-Haupt-App isoliert.
// Zweck: beweisen, dass Chrom/Carbon/LED-Look den Export ueberlebt, BEVOR die
// Talos-Seite umgebaut wird. Steuerung: ziehen = drehen, sonst Turntable.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three-spline";
import SplineLoader from "@splinetool/loader";
import { buildTalosRig, TALOS_COLORS, type TalosRig } from "./talosRig";
import { createTalosMotion, type TalosMotion } from "./talosMotion";

const SCENE_URL = "https://prod.spline.design/bN7MTDW-zSkVIOxf/scene.splinecode";

export default function TalosSplineDemo() {
  const hostRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<TalosRig | null>(null);
  const motionRef = useRef<TalosMotion | null>(null);
  const [status, setStatus] = useState<"laedt" | "bereit" | "fehler">("laedt");
  const [eyeVariant, setEyeVariant] = useState<"tuerkis" | "weiss">("tuerkis");
  const [crestOn, setCrestOn] = useState(true);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe3e3e3);

    const camera = new THREE.PerspectiveCamera(
      45,
      host.clientWidth / host.clientHeight,
      10,
      100000
    );
    camera.position.set(0, 170, 820);
    camera.lookAt(0, 20, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.PointLight(0xffffff, 1.4, 2000, 1);
    key.position.set(180, 420, 340);
    scene.add(key);

    const pivot = new THREE.Group();
    scene.add(pivot);

    let disposed = false;
    let rig: TalosRig | null = null;
    let motion: TalosMotion | null = null;
    let greetTimer = 0;
    const loader = new SplineLoader() as unknown as {
      load: (url: string, ok: (s: unknown) => void, p?: unknown, err?: (e: unknown) => void) => void;
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
          motion.setReducedMotion(
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
          );
          // Begruessung kurz nach dem Laden.
          greetTimer = window.setTimeout(() => motion?.triggerGreeting(), 1200);
        }
        (window as unknown as Record<string, unknown>).__talosScene = splineScene;
        (window as unknown as Record<string, unknown>).__THREE = THREE;
        (window as unknown as Record<string, unknown>).__talos = rig;
        (window as unknown as Record<string, unknown>).__talosMotion = motion;
        setStatus("bereit");
      },
      undefined,
      (e) => {
        console.error("[talos-demo] Ladefehler", e);
        setStatus("fehler");
      }
    );

    // Drag = drehen, sonst langsamer Turntable.
    let targetY = 0;
    let dragging = false;
    let lastX = 0;
    let auto = true;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      auto = false;
      delete pivot.userData.lock; // Nutzer-Drag hebt QA-Lock auf
      targetY = pivot.rotation.y;
      lastX = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      targetY += (e.clientX - lastX) * 0.008;
      lastX = e.clientX;
    };
    const onUp = () => {
      dragging = false;
      window.setTimeout(() => {
        auto = true;
      }, 4000);
    };
    // QA-Hook: Ansicht fixieren (Screenshots), schaltet den Turntable ab.
    // Lock haengt am Pivot selbst (userData), damit er auch bei StrictMode-
    // Doppelmount immer die LEBENDE Instanz trifft.
    (window as unknown as Record<string, unknown>).__setYaw = (rad: number) => {
      const livePivot = (
        (window as unknown as Record<string, unknown>).__talosScene as
          | { parent?: { userData: Record<string, unknown> } }
          | undefined
      )?.parent;
      if (livePivot) livePivot.userData.lock = rad;
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    const onResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Blickfolge: Cursorposition normalisiert an die Regie melden.
    const onGaze = (e: PointerEvent) => {
      motion?.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener("pointermove", onGaze);

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      const lock = pivot.userData.lock as number | undefined;
      if (typeof lock === "number") {
        pivot.rotation.y = lock;
        targetY = lock;
      } else {
        if (auto) targetY += delta * 0.25;
        pivot.rotation.y += (targetY - pivot.rotation.y) * (1 - Math.pow(0.001, delta));
      }
      motion?.update(delta);
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      window.clearTimeout(greetTimer);
      motionRef.current = null;
      rigRef.current?.dispose();
      rigRef.current = null;
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onGaze);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#e3e3e3" }}>
      <div ref={hostRef} style={{ position: "absolute", inset: 0, touchAction: "pan-y" }} />
      <div
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {(["tuerkis", "weiss"] as const).map((variant) => (
          <button
            key={variant}
            type="button"
            onClick={() => {
              setEyeVariant(variant);
              rigRef.current?.setEyeColor(
                variant === "weiss" ? TALOS_COLORS.eyeWhite : TALOS_COLORS.eye
              );
            }}
            style={{
              padding: "8px 14px",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              border: "1px solid #b9bdc2",
              borderRadius: 999,
              cursor: "pointer",
              background: eyeVariant === variant ? "#23262e" : "rgba(255,255,255,0.7)",
              color: eyeVariant === variant ? "#f4f4f2" : "#3a3f46",
            }}
          >
            Augen {variant === "tuerkis" ? "Tuerkis" : "Weiss"}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            const next = !crestOn;
            setCrestOn(next);
            rigRef.current?.setCrestVisible(next);
          }}
          style={{
            padding: "8px 14px",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "1px solid #b9bdc2",
            borderRadius: 999,
            cursor: "pointer",
            background: crestOn ? "#23262e" : "rgba(255,255,255,0.7)",
            color: crestOn ? "#f4f4f2" : "#3a3f46",
          }}
        >
          Kamm {crestOn ? "An" : "Aus"}
        </button>
        <button
          type="button"
          onClick={() => motionRef.current?.triggerGreeting()}
          style={{
            padding: "8px 14px",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "1px solid #b9bdc2",
            borderRadius: 999,
            cursor: "pointer",
            background: "rgba(255,255,255,0.7)",
            color: "#3a3f46",
          }}
        >
          Gruss
        </button>
        <button
          type="button"
          onClick={() => motionRef.current?.triggerBow()}
          style={{
            padding: "8px 14px",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "1px solid #b9bdc2",
            borderRadius: 999,
            cursor: "pointer",
            background: "rgba(255,255,255,0.7)",
            color: "#3a3f46",
          }}
        >
          Verbeugung
        </button>
      </div>
      <p
        style={{
          position: "fixed",
          left: "50%",
          bottom: 18,
          transform: "translateX(-50%)",
          margin: 0,
          fontSize: 13,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#5a5f66",
          fontFamily: "system-ui, sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        Talos Fidelity-Demo · Original-Szene, eigener Canvas ·{" "}
        {status === "laedt" ? "laedt ..." : status === "fehler" ? "Ladefehler" : "ziehen zum Drehen"}
      </p>
    </div>
  );
}
