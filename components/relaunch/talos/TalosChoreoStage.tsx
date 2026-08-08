"use client";

// DEMO (Weg A): TALOS mit fuch.ai-Choreografie (Mood-State-Machine + Blickfolge +
// Leerlauf-Persoenlichkeit + Gesten). Isolierte Spielwiese, nicht die echte Seite.
// Buehne wie TalosHeroStage (three-spline, isoliert per webpack), plus Bedien-Panel.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three-spline";
import SplineLoader from "@splinetool/loader";
import { buildTalosRig, type TalosRig } from "./talosRig";
import {
  createTalosMoodMotion,
  type TalosMood,
  type TalosMoodMotion,
  type TalosGesture,
} from "./talosMoodMotion";

const SCENE_URL = "/hero/talos-scene.splinecode";

// Ganzkoerper-Framing (Beine sichtbar, Platz zum Laufen) — live am Modell vermessen.
const CAM_POS: [number, number, number] = [60, 70, 1860];
const CAM_TGT: [number, number, number] = [0, 30, 12];
const CAM_FOV = 40;

const MOODS: TalosMood[] = ["idle", "curious", "listening", "thinking", "speaking", "sleepy"];
const GESTURES: TalosGesture[] = ["wave", "bow", "nod", "lookaround", "kick"];

export default function TalosChoreoStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<TalosMoodMotion | null>(null);
  const [no3d, setNo3d] = useState(false);
  const [ready, setReady] = useState(false);
  const [mood, setMood] = useState<TalosMood>("idle");
  const [walking, setWalking] = useState(false);

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
    if (!webgl2) {
      setNo3d(true);
      return;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      CAM_FOV,
      host.clientWidth / host.clientHeight,
      10,
      100000,
    );
    camera.position.set(...CAM_POS);
    camera.lookAt(new THREE.Vector3(...CAM_TGT));
    // DEBUG (temporaer): Kamera exponieren, um Framing + Bein-Achsen live zu vermessen.
    (window as unknown as { __talosCam?: unknown; __THREEv?: unknown }).__talosCam = camera;
    (window as unknown as { __THREEv?: unknown }).__THREEv = THREE;

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

    const onResize = () => {
      if (!host.clientWidth) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const onGaze = (e: PointerEvent) => {
      motionRef.current?.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
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
        // DEBUG (temporaer): Szene exponieren, um den Node-/Rig-Aufbau zu vermessen.
        (window as unknown as { __talosScene?: unknown }).__talosScene = splineScene;
        rig = buildTalosRig(THREE, splineScene);
        if (rig) {
          const motion = createTalosMoodMotion(rig, splineScene);
          motion.setReducedMotion(reduced);
          motionRef.current = motion;
          setReady(true);
          if (!reduced) motion.triggerGesture("wave"); // Gruss beim Laden (Intro)
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
      motionRef.current?.update(clock.getDelta());
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      motionRef.current = null;
      rig?.dispose();
      teardown();
    };
  }, []);

  const pickMood = (m: TalosMood) => {
    motionRef.current?.setMood(m);
    setMood(m);
  };

  const toggleWalk = () => {
    const w = !walking;
    motionRef.current?.setWalking(w);
    setWalking(w);
  };

  return (
    <div className="tch-wrap">
      <div className="tch-canvas" aria-hidden="true" ref={hostRef} />
      {no3d && <div className="tch-poster" aria-hidden="true" />}

      <div className="tch-panel" role="group" aria-label="Talos Choreografie-Steuerung">
        <div className="tch-row">
          <span className="tch-label">Mood</span>
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              className={`tch-btn${mood === m ? " is-on" : ""}`}
              disabled={!ready}
              onClick={() => pickMood(m)}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="tch-row">
          <span className="tch-label">Geste</span>
          {GESTURES.map((g) => (
            <button
              key={g}
              type="button"
              className="tch-btn"
              disabled={!ready}
              onClick={() => motionRef.current?.triggerGesture(g)}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="tch-row">
          <span className="tch-label">Lauf</span>
          <button
            type="button"
            className={`tch-btn${walking ? " is-on" : ""}`}
            disabled={!ready}
            onClick={toggleWalk}
          >
            {walking ? "stop" : "laufen (hin/her)"}
          </button>
        </div>
        <p className="tch-hint">
          Maus bewegen = Blickfolge. 60 s nichts tun = &bdquo;sleepy&ldquo;. Alle 7 s zufaelliges
          Leerlauf-Zappeln.
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
.tch-wrap{ position:fixed; inset:0; overflow:hidden;
  background:radial-gradient(120% 90% at 50% 35%, #ffffff 0%, #f4f4f2 55%, #e9edf0 100%); }
.tch-canvas{ position:absolute; inset:0; }
.tch-canvas canvas{ display:block; }
.tch-poster{ position:absolute; inset:0;
  background:radial-gradient(120% 90% at 50% 40%, #ffffff 0%, #f4f4f2 55%, #e9edf0 100%); }
.tch-panel{ position:absolute; left:50%; bottom:24px; transform:translateX(-50%);
  display:flex; flex-direction:column; gap:10px; padding:14px 16px;
  background:rgba(255,255,255,.82); backdrop-filter:blur(8px);
  border:1px solid rgba(20,40,55,.1); border-radius:14px;
  box-shadow:0 8px 30px rgba(20,40,55,.12); font:500 13px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;
  color:#23262e; max-width:min(94vw,720px); }
.tch-row{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.tch-label{ width:52px; color:#f12032; letter-spacing:.06em; text-transform:uppercase; font-size:11px; }
.tch-btn{ appearance:none; border:1px solid rgba(20,40,55,.18); background:#fff; color:#23262e;
  padding:6px 12px; border-radius:9px; cursor:pointer; font:inherit; transition:.15s; }
.tch-btn:hover:not(:disabled){ border-color:#f12032; color:#f12032; }
.tch-btn.is-on{ background:#f12032; color:#fff; border-color:#f12032; }
.tch-btn:disabled{ opacity:.4; cursor:default; }
.tch-hint{ margin:2px 0 0; color:#5a6b78; font-size:11px; }
`,
        }}
      />
    </div>
  );
}
