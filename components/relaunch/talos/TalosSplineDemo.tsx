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

const SCENE_URL = "https://prod.spline.design/bN7MTDW-zSkVIOxf/scene.splinecode";

export default function TalosSplineDemo() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"laedt" | "bereit" | "fehler">("laedt");

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
    const loader = new SplineLoader() as unknown as {
      load: (url: string, ok: (s: unknown) => void, p?: unknown, err?: (e: unknown) => void) => void;
    };
    loader.load(
      SCENE_URL,
      (splineScene) => {
        if (disposed) return;
        pivot.add(splineScene as never);
        (window as unknown as Record<string, unknown>).__talosScene = splineScene;
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
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    const onResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      if (auto) targetY += delta * 0.25;
      pivot.rotation.y += (targetY - pivot.rotation.y) * (1 - Math.pow(0.001, delta));
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
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
