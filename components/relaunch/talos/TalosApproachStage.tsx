"use client";

// Talos-Approach-Buehne: kontainierte three-spline-Buehne fuer den tl-stage-slot
// der WerIstTalos-Sektion. Talos steht FRONTAL und bewegungslos (kein Gehen,
// keine Yaw-Drehung), waehrend die Kamera beim Scrollen NAH herankommt — der
// Moment, an dem seine Struktur (Kopf, Brust, Bauteile) sichtbar wird
// (Thomas-Vorliebe). Kein Autoplay-Timer: die Buehne misst ihren eigenen
// Scroll-Fortschritt ueber getBoundingClientRect des eigenen Wrappers.
//
// Technik wie TalosWalkStage/TalosEntranceStage: Loader + Buehne laufen auf
// `three-spline` (three@0.149, per webpack isoliert). Kein Wasserzeichen, 0 Euro.
// Schwache Geraete / kein WebGL2 -> Poster; prefers-reduced-motion -> statische
// Nah-Pose ohne Kamerafahrt.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three-spline";
import SplineLoader from "@splinetool/loader";
import { buildTalosRig, type TalosRig } from "./talosRig";
import { createTalosMotion, type TalosMotion } from "./talosMotion";

const SCENE_URL = "/hero/talos-scene.splinecode";

// Ganzkoerper/Oberkoerper-Kadrierung (bewaehrter Startwert aus TalosEntranceStage,
// dort am Modell vermessen: Figur-Mitte ~y130, weit genug weg fuer Kopf UND Fuesse).
const CAM_POS_FAR: [number, number, number] = [30, 150, 860];
const CAM_TGT_FAR: [number, number, number] = [0, 132, 12];

// Nahe Kadrierung: Kopf + Brust formatfuellend, Bauteile sichtbar. Werte als
// Konstanten mit Kommentar — werden spaeter visuell nachjustiert (Thomas-Feedback
// live am Render, wie bei allen anderen Buehnen ueblich).
const CAM_POS_NEAR: [number, number, number] = [0, 190, 320];
const CAM_TGT_NEAR: [number, number, number] = [0, 205, 12];

const CAM_FOV = 40;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
// Smootherstep (Perlin): weicher als smoothstep an beiden Enden, kein Ruck
// beim Erreichen von Fortschritt 0 bzw. 1.
const smootherstep = (t: number) => {
  const c = clamp01(t);
  return c * c * c * (c * (c * 6 - 15) + 10);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpVec3 = (
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

export default function TalosApproachStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [no3d, setNo3d] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const wrap = wrapRef.current;
    if (!host || !wrap) return;
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
    camera.position.set(...(reduced ? CAM_POS_NEAR : CAM_POS_FAR));
    camera.lookAt(new THREE.Vector3(...(reduced ? CAM_TGT_NEAR : CAM_TGT_FAR)));

    scene.add(new THREE.AmbientLight(0xffffff, 0.68));
    const key = new THREE.PointLight(0xffffff, 1.35, 4000, 1);
    key.position.set(180, 460, 420);
    scene.add(key);
    const fill = new THREE.PointLight(0xdfe7ee, 0.5, 4000, 1);
    fill.position.set(-260, 120, 220);
    scene.add(fill);

    let disposed = false;
    let rig: TalosRig | null = null;
    let motion: TalosMotion | null = null;
    let loaded = false;
    let manualProg: number | null = null; // QA-Scrub ueberschreibt die Messung

    // Eigener Scroll-Fortschritt aus dem Wrapper: 0 = Slot betritt den Viewport
    // von unten, 1 = Slot verlaesst ihn oben. Kein Scroll-Listener noetig, das
    // wird pro Frame im Animation-Loop aus getBoundingClientRect gerechnet.
    const measureProgress = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const travel = vh + rect.height;
      if (travel <= 0) return 0;
      return clamp01((vh - rect.top) / travel);
    };

    const applyProgress = (p: number) => {
      const t = smootherstep(p);
      const pos = lerpVec3(CAM_POS_FAR, CAM_POS_NEAR, t);
      const tgt = lerpVec3(CAM_TGT_FAR, CAM_TGT_NEAR, t);
      camera.position.set(...pos);
      camera.lookAt(new THREE.Vector3(...tgt));
    };

    const onResize = () => {
      if (!host.clientWidth) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener("resize", onResize);
    // vh-basierte Buehnen: iOS-Adressleisten-Kollaps aendert vh ohne
    // verlaesslichen window-resize; visualViewport nachziehen.
    window.visualViewport?.addEventListener("resize", onResize);

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
      window.visualViewport?.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onGaze);
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      const w = window as unknown as Record<string, unknown>;
      if (w.__talosApproach === qaHooks) delete w.__talosApproach;
    };

    const loader = new SplineLoader() as unknown as {
      load: (u: string, ok: (s: unknown) => void, p?: unknown, e?: (e: unknown) => void) => void;
    };
    loader.load(
      SCENE_URL,
      (splineScene) => {
        if (disposed) return;
        scene.add(splineScene as never);
        rig = buildTalosRig(THREE, splineScene);
        if (rig) {
          motion = createTalosMotion(rig, splineScene);
          motion.setReducedMotion(reduced);
        }
        loaded = true;
        // Frontal, kein Yaw: die Rest-Pose der Szene ist bereits die Frontal-
        // Ausrichtung (bewaehrt aus TalosEntranceStage/TalosWalkStage) — hier
        // wird nichts an Position/Rotation der Figur veraendert.
        if (reduced) {
          // Statische Nah-Pose ohne Kamerafahrt.
          camera.position.set(...CAM_POS_NEAR);
          camera.lookAt(new THREE.Vector3(...CAM_TGT_NEAR));
        }
      },
      undefined,
      () => {
        teardown();
        setNo3d(true);
      },
    );

    // QA-Hooks: window.__talosApproach.setProg(0..1|null) / .camera
    const qaHooks = {
      setProg: (p: number | null) => {
        manualProg = p == null ? null : clamp01(p);
      },
      camera,
    };
    (window as unknown as Record<string, unknown>).__talosApproach = qaHooks;

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      if (loaded && !reduced) {
        const p = manualProg ?? measureProgress();
        applyProgress(p);
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
    <div className="tap-wrap" ref={wrapRef} aria-hidden="true">
      <div className="tap-canvas" ref={hostRef} />
      {no3d && <div className="tap-poster" />}
      <style
        dangerouslySetInnerHTML={{
          __html: `
.tap-wrap{ position:relative; width:100%; height:100%; min-height:320px; overflow:hidden; pointer-events:none; }
.tap-canvas{ position:absolute; inset:0; }
.tap-canvas canvas{ display:block; width:100%; height:100%; }
.tap-poster{ position:absolute; inset:0;
  background:radial-gradient(120% 90% at 50% 40%, #ffffff 0%, #f4f4f2 55%, #e9edf0 100%); }
`,
        }}
      />
    </div>
  );
}
