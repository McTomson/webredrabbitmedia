"use client";

// Kontainierter Talos-Hero: ein selbst-dimensionierter three-spline-Canvas
// (KEINE Vollbild-Buehne, kein Scroll-Deck). Talos steht ruhig, atmet, folgt
// mit dem Blick der Maus und winkt einmal beim Laden. Fuer die Leistungs-
// Hauptseite gedacht (Talos "hin und wieder", nicht permanent).
//
// Technik wie TalosSplineDemo/TalosPresentation: Loader + Buehne laufen auf
// `three-spline` (three@0.149, per webpack von der Haupt-App isoliert). Kein
// Wasserzeichen, 0 Euro. Schwache Geraete / kein WebGL2 -> Poster-Fallback.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three-spline";
import SplineLoader from "@splinetool/loader";
import { buildTalosRig, type TalosRig } from "./talosRig";
import { createTalosMotion, type TalosMotion } from "./talosMotion";

const SCENE_URL = "https://prod.spline.design/bN7MTDW-zSkVIOxf/scene.splinecode";

// Ruhige Hero-Kamera (am Modell vermessen: Head-Center ~y263, Body ~y138).
const CAM_POS: [number, number, number] = [40, 196, 560];
const CAM_TGT: [number, number, number] = [0, 150, 12];
const CAM_FOV = 40;

export default function TalosHeroStage() {
  const hostRef = useRef<HTMLDivElement>(null);
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

    const camera = new THREE.PerspectiveCamera(CAM_FOV, host.clientWidth / host.clientHeight, 10, 100000);
    camera.position.set(...CAM_POS);
    camera.lookAt(new THREE.Vector3(...CAM_TGT));

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
    let greeted = false;

    const onResize = () => {
      if (!host.clientWidth) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const onGaze = (e: PointerEvent) => {
      motion?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("pointermove", onGaze);

    let torn = false;
    const teardown = () => {
      if (torn) return;
      torn = true;
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onGaze);
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
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
          if (!reduced) {
            greeted = true;
            motion.triggerGreeting();
          }
        }
      },
      undefined,
      () => {
        teardown();
        setNo3d(true);
      },
    );

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      // Sicherstellen, dass der Gruss auch bei spaetem Rig-Load kommt.
      if (rig && motion && !greeted && !reduced) {
        greeted = true;
        motion.triggerGreeting();
      }
      motion?.update(delta);
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      rig?.dispose();
      teardown();
    };
  }, []);

  return (
    <div className="tlh-wrap">
      <div className="tlh-canvas" aria-hidden="true" ref={hostRef} />
      {no3d && <div className="tlh-poster" aria-hidden="true" />}
      <style
        dangerouslySetInnerHTML={{
          __html: `
.tlh-wrap{ position:relative; width:100%; height:100%; min-height:260px; overflow:hidden; }
.tlh-canvas{ position:absolute; inset:0; }
.tlh-canvas canvas{ display:block; }
.tlh-poster{ position:absolute; inset:0;
  background:radial-gradient(120% 90% at 50% 40%, #ffffff 0%, #f4f4f2 55%, #e9edf0 100%); }
`,
        }}
      />
    </div>
  );
}
