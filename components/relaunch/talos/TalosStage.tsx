"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { talosBus, sampleKeyframes } from "./talosController";

// QA-Fehlerfaenger: React schluckt Fehler im Canvas-Teilbaum sonst still.
class StageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: Error) {
    const w = window as unknown as { __talosTrace?: string[] };
    (w.__talosTrace ??= []).push("BOUNDARY: " + (err?.message || String(err)));
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * TalosStage — die eigene Three.js-Buehne (kein Spline-Player, kein Wasser-
 * zeichen). R3F-Canvas fixed fullscreen, transparent (die weisse Seite scheint
 * durch, Footer/Chrome liegen per z-index darueber). frameloop="demand": ein
 * eigener Idle-Treiber invalidiert nur waehrend der Tab sichtbar ist und pausiert
 * bei visibilitychange. Modell talos.glb (meshopt, 464 KB) bekommt Bronze-
 * Materialien und Ruestungs-Geometrie im Code (das GLB hat keine Materialien).
 *
 * Freundlichkeits-Regie (Thomas 17.07.): warmes weiches Licht, kleine dezente
 * Ruestung, sanfte langsame Bewegungen, Kamera auf/leicht ueber Augenhoehe.
 */

// ?v= cache-bustet den Browser-HTTP-Cache bei Asset-Updates (Lesson 17.07.:
// alter meshopt-Export blieb im Cache haengen und liess den Loader ewig warten).
const MODEL_URL = "/models/talos.glb?v=2";

// Weltskala der Gelenke aus dem GLB vermessen (uniform 0.008). Pivots:
// Hals/Kopf (0, 2.2, 0.2), Schultern (+-0.77, 1.8), Becken (0, 0.56).
const HEAD_PIVOT = new THREE.Vector3(0, 2.2, 0.18);

// ---- Material-Zonen (per Node-Name, aus dem GLB verifiziert) ----------------
function makeBronze(rough: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color("#c0955a"),
    metalness: 0.72,
    roughness: rough,
  });
}
const INK = new THREE.Color("#23262e");
const DARK_BRONZE = new THREE.Color("#8a6435");

// deterministische Roughness-Variation (gealterte Bronze) aus dem Namen.
function hashRough(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return 0.42 + (h % 100) / 100 * 0.22; // 0.42..0.64
}

function TalosModel({ onReady }: { onReady: () => void }) {
  const { scene } = useGLTF(MODEL_URL);
  const rootRef = useRef<THREE.Group>(null);
  const helmetPivot = useRef<THREE.Group>(null);
  const { invalidate } = useThree();

  // Modell einmalig aufbereiten: klonen, Materialien nach Zone, Logo weg,
  // Gelenke fuer die Regie einsammeln, Basis-Quaternions merken.
  const prepared = useMemo(() => {
    const root = scene.clone(true);
    let visorMat: THREE.MeshStandardMaterial | null = null;
    const arms: THREE.Object3D[] = [];
    let head: THREE.Object3D | null = null;

    root.traverse((o) => {
      if (o.name === "logo") o.visible = false; // Spline-Logo (z=-10) ausblenden
      if (o.name === "Head" && !head) head = o;
      if (o.name === "arm") arms.push(o);
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const n = o.name || "";
      mesh.castShadow = true;
      mesh.receiveShadow = false;
      if (n === "Head 2") {
        // Visier / Augen: weiches warmes Emissive, Off-White.
        visorMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#2a2622"),
          emissive: new THREE.Color("#fff1de"),
          emissiveIntensity: 0.95,
          metalness: 0.3,
          roughness: 0.4,
        });
        mesh.material = visorMat;
      } else if (/Cylinder|elbow|Neck|Hand/i.test(n)) {
        mesh.material = new THREE.MeshStandardMaterial({ color: INK, metalness: 0.7, roughness: 0.55 });
      } else if (/shin|Foot|femur|Rectangle 7|Rectangle 8/i.test(n)) {
        mesh.material = new THREE.MeshStandardMaterial({ color: DARK_BRONZE, metalness: 0.8, roughness: 0.5 });
      } else {
        mesh.material = makeBronze(hashRough(n));
      }
    });

    // Basis-Quaternions fuer additive Regie (Node-Matrizen sind gebacken).
    const headBase = head ? (head as THREE.Object3D).quaternion.clone() : null;
    const armBases = arms.map((a) => a.quaternion.clone());
    return {
      root,
      visorMat: visorMat as THREE.MeshStandardMaterial | null,
      arms,
      armBases,
      head: head as THREE.Object3D | null,
      headBase,
    };
  }, [scene]);

  // Einblende-Opacity (weiches Fade nach dem Laden, LCP-Schutz).
  const fade = useRef(0);
  useEffect(() => {
    prepared.root.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (m) {
        m.transparent = true;
        m.opacity = 0;
      }
    });
    onReady();
    talosBus.ready = true;
    invalidate();
    return () => {
      // NUR unsere eigenen Materialien freigeben. Die Geometrien sind via
      // clone(true) mit dem useGLTF-Cache GETEILT — sie zu disposen zerstoert
      // den Cache, und der StrictMode-Doppel-Mount rendert danach ein leeres
      // Modell (Dev: unsichtbarer Talos). Geometrie raeumt der Kontext-Teardown
      // des Canvas beim echten Seitenwechsel ab.
      prepared.root.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          const m = mesh.material as THREE.Material | THREE.Material[];
          if (Array.isArray(m)) m.forEach((x) => x.dispose?.());
          else m?.dispose?.();
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wiederverwendbare Objekte (kein GC-Druck im Frame).
  const smoothP = useRef(0);
  const gaze = useRef({ x: 0, y: 0 });
  const camPos = useRef(new THREE.Vector3(0, 2, 5.4));
  const camTgt = useRef(new THREE.Vector3(0, 1.35, 0));
  const tmpCam = useMemo(() => new THREE.Vector3(), []);
  const tmpTgt = useMemo(() => new THREE.Vector3(), []);
  const tmpEuler = useMemo(() => new THREE.Euler(), []);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);
  const startT = useRef<number | null>(null);

  useFrame((state, delta) => {
    const cam = state.camera;
    const t = state.clock.elapsedTime;
    if (startT.current === null) startT.current = t;
    const since = t - startT.current;
    const reduced = talosBus.reduced;

    // Fade-in.
    if (fade.current < 1) {
      fade.current = Math.min(1, fade.current + delta * 1.4);
      const o = fade.current * fade.current;
      prepared.root.traverse((obj) => {
        const m = (obj as THREE.Mesh).material as THREE.Material | undefined;
        if (m) m.opacity = o;
      });
      invalidate();
    }

    // Scroll-Progress weich nachziehen — zeitkorrigiert (Review-Fix: fixe
    // Frame-Bruchteile fuehlen sich auf langsamen Geraeten traeger an).
    const target = talosBus.progress;
    smoothP.current += (target - smoothP.current) * (reduced ? 1 : 1 - Math.pow(0.0135, delta));
    const kf = sampleKeyframes(smoothP.current);

    // ---- Kamera: Keyframe-Position/Target sanft anfahren --------------------
    const camLerp = reduced ? 1 : 1 - Math.pow(0.001, delta); // zeitkorrigiert
    camPos.current.lerp(tmpCam.set(kf.cam[0], kf.cam[1], kf.cam[2]), camLerp);
    camTgt.current.lerp(tmpTgt.set(kf.target[0], kf.target[1], kf.target[2]), camLerp);
    cam.position.copy(camPos.current);
    cam.lookAt(camTgt.current);

    // ---- Modell-Root: Yaw + Idle-Bobbing + Atmen ---------------------------
    const rootObj = rootRef.current;
    if (rootObj) {
      const bob = reduced ? 0 : Math.sin(t * 0.85) * 0.02;
      const breathe = reduced ? 1 : 1 + Math.sin(t * 1.25) * 0.004;
      rootObj.position.y = bob;
      rootObj.scale.setScalar(breathe);
      rootObj.rotation.y += (kf.yaw - rootObj.rotation.y) * (reduced ? 1 : 0.08);
    }

    // ---- Cursor-Blickfolge (Kopf, max ~8 Grad, gelerpt) --------------------
    if (!reduced) {
      gaze.current.x += (talosBus.pointerX - gaze.current.x) * 0.06;
      gaze.current.y += (talosBus.pointerY - gaze.current.y) * 0.06;
    }
    const gx = gaze.current.x * 0.14; // ~8 Grad
    const gy = gaze.current.y * 0.1;

    // Kapitel-5-Kopfneigung zur aktiven Frage.
    const q = talosBus.activeQuestion;
    const questionTilt = q >= 0 ? (q % 2 === 0 ? -0.08 : 0.08) : 0;

    // ---- Kopf-Regie (Blickfolge + Keyframe-Tilt + Fragen-Neigung) ----------
    const head = prepared.head;
    if (head && prepared.headBase) {
      tmpEuler.set(kf.tilt + gy, gx + questionTilt, 0, "XYZ");
      tmpQuat.setFromEuler(tmpEuler);
      head.quaternion.copy(prepared.headBase).multiply(tmpQuat);
    }
    // Helm folgt dem Kopf (gleiche Neigung um den Hals-Pivot).
    if (helmetPivot.current) {
      helmetPivot.current.rotation.set(kf.tilt + gy, gx + questionTilt, 0);
    }

    // ---- Gruss-Geste im Hero (einmal, zeitbasiert, ease-out) ---------------
    if (prepared.arms[0] && prepared.armBases[0]) {
      let raise = 0;
      if (!reduced && smoothP.current < 0.12) {
        // Arm hebt sich in ~1.2s, kleines Winken, dann leicht gehoben als Rest.
        const g = Math.min(1, since / 1.2);
        const eased = 1 - Math.pow(1 - g, 3);
        const wave = since > 1.2 && since < 3.2 ? Math.sin((since - 1.2) * 5) * 0.12 : 0;
        raise = eased * 0.7 + wave;
      }
      tmpEuler.set(0, 0, -raise, "XYZ"); // Schulter um Z anheben
      tmpQuat.setFromEuler(tmpEuler);
      prepared.arms[0].quaternion.copy(prepared.armBases[0]).multiply(tmpQuat);
    }

    // Blinzeln: Emissive kurz dippen (~alle 4.2s), warm-weiches Auge.
    if (prepared.visorMat && !reduced) {
      const cyc = t % 4.2;
      prepared.visorMat.emissiveIntensity = cyc < 0.12 ? 0.25 : 0.95;
    }
  });

  const bronzeArmor = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color("#8a6231"), metalness: 0.85, roughness: 0.5 }),
    [],
  );
  const darkArmor = useMemo(
    () => new THREE.MeshStandardMaterial({ color: DARK_BRONZE, metalness: 0.8, roughness: 0.55 }),
    [],
  );

  return (
    <group ref={rootRef}>
      <primitive object={prepared.root} />

      {/* Helm-Pivot am Hals (0,2.2,0.18); dreht mit dem Kopf. Ruestung bewusst
          KLEIN/dezent (Freundlichkeit vor Martialik): flache Kappe + schmaler
          kurzer Kamm, keine wuchtige Nasenschiene. */}
      <group ref={helmetPivot} position={[HEAD_PIVOT.x, HEAD_PIVOT.y, HEAD_PIVOT.z]}>
        {/* Kappe SITZT auf dem Scheitel (nicht ueber dem Gesicht — Augen und
            Gesicht bleiben frei, Freundlichkeits-Regel). */}
        <mesh position={[0, 0.5, -0.04]} material={darkArmor}>
          <sphereGeometry args={[0.38, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
        </mesh>
        {/* schmaler, kurzer Kamm (Extrude-Ersatz: flacher gebogener Streifen). */}
        <mesh position={[0, 0.74, -0.06]} rotation={[0.15, 0, 0]} material={bronzeArmor}>
          <boxGeometry args={[0.05, 0.15, 0.46]} />
        </mesh>
      </group>

      {/* Schulterplatten (zurueckhaltend, kleine gewoelbte Schalen). */}
      <mesh position={[0.79, 1.86, 0.02]} rotation={[0, 0, -0.5]} material={bronzeArmor}>
        <sphereGeometry args={[0.26, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
      </mesh>
      <mesh position={[-0.83, 1.86, 0.02]} rotation={[0, 0, 0.5]} material={bronzeArmor}>
        <sphereGeometry args={[0.26, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
      </mesh>

      {/* Pteryges: schlichte schmale Lamellen an der Huefte (Becken y=0.56). */}
      <group position={[0, 0.5, 0.34]}>
        {[-0.34, -0.17, 0, 0.17, 0.34].map((x, i) => (
          <mesh key={i} position={[x, -0.16, -Math.abs(x) * 0.18]} rotation={[Math.abs(x) * 0.25, 0, 0]} material={bronzeArmor}>
            <boxGeometry args={[0.11, 0.34, 0.03]} />
          </mesh>
        ))}
      </group>

      {/* gebackener Kontaktschatten (frames=1 = einmal gerendert, billig). */}
      <ContactShadows position={[0, -1.02, 0]} scale={5} blur={2.6} opacity={0.32} far={3} frames={1} color="#3a2c18" />
    </group>
  );
}

// Mood-Backdrop: grosse Sphaere hinter Talos, deren Farbe pro Kapitel wandert
// (ATMOS-Technik). An der Kamera aufgehaengt, damit Vorder-/Hintergrund nie
// auseinanderlaufen.
function MoodBackdrop() {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const smooth = useRef(0);
  const col = useMemo(() => new THREE.Color("#f6f3ee"), []);
  const white = useMemo(() => new THREE.Color("#ffffff"), []);
  useFrame((state, delta) => {
    smooth.current += (talosBus.progress - smooth.current) * (talosBus.reduced ? 1 : 1 - Math.pow(0.0135, delta));
    const kf = sampleKeyframes(smooth.current);
    // sanfte, helle Stimmung: Mood mit Weiss gemischt (Studio bleibt hell).
    col.set(kf.mood[0], kf.mood[1], kf.mood[2]).lerp(white, 0.72);
    if (matRef.current) matRef.current.color.copy(col);
    if (meshRef.current) meshRef.current.position.copy(state.camera.position);
  });
  return (
    <mesh ref={meshRef} scale={60}>
      <sphereGeometry args={[1, 24, 16]} />
      <meshBasicMaterial ref={matRef} side={THREE.BackSide} color="#f6f3ee" depthWrite={false} />
    </mesh>
  );
}

function Lights() {
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const smooth = useRef(0);
  useFrame((_state, delta) => {
    smooth.current += (talosBus.progress - smooth.current) * (talosBus.reduced ? 1 : 1 - Math.pow(0.0135, delta));
    const kf = sampleKeyframes(smooth.current);
    if (keyRef.current) {
      keyRef.current.intensity = kf.light;
      keyRef.current.color.setRGB(1, 0.94 - (1 - kf.mood[0]) * 0.1, 0.86 - (1 - kf.mood[0]) * 0.2);
    }
  });
  return (
    <>
      <ambientLight intensity={0.72} color="#fff3e6" />
      <directionalLight ref={keyRef} position={[3, 5, 4]} intensity={1.3} color="#fff1e0" />
      <directionalLight position={[-4, 2, 2]} intensity={0.5} color="#dfe8f2" />
    </>
  );
}

// Idle-Treiber: invalidiert waehrend sichtbar (frameloop demand -> weiche
// Idle-Animation), pausiert bei verstecktem Tab (spart GPU).
function IdleDriver() {
  const { invalidate } = useThree();
  useEffect(() => {
    let raf = 0;
    let visible = !document.hidden;
    const tick = () => {
      if (visible && !talosBus.reduced) invalidate();
      raf = requestAnimationFrame(tick);
    };
    const onVis = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(tick);
    talosBus.invalidate = invalidate;
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      talosBus.invalidate = null;
    };
  }, [invalidate]);
  return null;
}

export default function TalosStage() {
  const [, setLoaded] = useState(false);
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop="demand"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 42, near: 0.1, far: 120, position: [0, 2, 5.4] }}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <IdleDriver />
      <MoodBackdrop />
      <Lights />
      <StageBoundary>
        <Suspense fallback={null}>
          <TalosModel onReady={() => setLoaded(true)} />
        </Suspense>
      </StageBoundary>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
