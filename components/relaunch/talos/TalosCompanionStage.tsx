"use client";

// Talos-COMPANION-Buehne fuer die Talos-Leistungsseite (Thomas 23.07.: Talos
// soll wie auf /talos-intro MIT der Seite mitgehen, sich von Sektion zu
// Sektion neu positionieren, mal groesser, mal kleiner, fluessig und stimmig).
//
// EINE fixe, vollflaechige, transparente three-spline-Ebene fuer die GANZE
// Seite (pointer-events:none, ueber dem Inhalt). Zwei Modi:
//
// 1) HERO (solange #sceneMain im Viewport): liest window.__sculptProgress der
//    talos-demo-Engine. Walk-in von links (Lauf-Zyklus aus talosMoodMotion,
//    distanzbasiert -> Zurueckscrollen laeuft rueckwaerts), Drehung zum User,
//    Winken rechts, Dashboard-Fenster mit Mini-Widgets, Abgang nach rechts.
// 2) STATIONEN (danach): Sektionen deklarieren Halte-Punkte per Markup:
//      <div data-talos-station data-talos-anchor="0.75" data-talos-size="l"
//           data-talos-gesture="wave" data-talos-yaw="0.2">...</div>
//    anchor = horizontale Ziel-Position (0..1 der Viewport-Breite),
//    size    = s | m | l | xl (Naehe zur Kamera -> Groesse),
//    gesture = wave | wave2 | bow (einmalig beim Ankommen),
//    yaw     = leichte Grunddrehung (Blick bleibt IMMER zum User geneigt).
//    Talos gleitet/geht sichtbar zwischen Stationen (Beine laufen, wenn er
//    horizontal unterwegs ist), ohne Station blendet er weich aus. Erscheint
//    er nach Unsichtbarkeit neu, wird die Position VOR dem Einblenden gesetzt
//    (Thomas-Regel: er kommt ins Bild ODER wird von unsichtbar sichtbar,
//    niemals Teleport im Sichtbaren; Blick nie aus dem Bildschirm hinaus).
//
// Fallbacks: kein WebGL2 / wenig RAM -> nur Hero-Poster; reduced-motion ->
// statische Posen ohne Lauf/Gesten. Mobil (<900px) nur der Hero, Stationen aus
// (einspaltiger Text vertraegt keinen davorstehenden Roboter).
import { useEffect, useRef, useState } from "react";
import * as THREE from "three-spline";
import SplineLoader from "@splinetool/loader";
import { buildTalosRig, type TalosRig } from "./talosRig";
import { createTalosMotion, type TalosMotion } from "./talosMotion";

const SCENE_URL = "https://prod.spline.design/bN7MTDW-zSkVIOxf/scene.splinecode";

// Ganzkoerper-Kamera, nah genug dass Talos gross wirkt (Thomas: "zu klein").
// z=700 -> Koerper (~340 Einheiten) fuellt ~2/3 der Bildhoehe.
const CAM_POS: [number, number, number] = [30, 150, 700];
const CAM_TGT: [number, number, number] = [0, 132, 12];
const CAM_FOV = 40;

const END_X = -170; // Hero-Zielplatz: links der Mitte (rechts laeuft der Text)
const OFF_MARGIN = 260; // Luft hinter der Bildkante (offscreen)
// Dreiviertel-Ansicht in Laufrichtung (empirisch: +1.05 = geht nach rechts,
// Gesicht leicht zum User; Vorzeichen spiegelt fuer Laufrichtung links).
const FACE_TURN = 1.05;

// Lauf-Parameter (aus talosMoodMotion, am Modell abgestimmt) + Armschwung.
const WALK_LEG_AMP = 0.55;
const WALK_KNEE = 1.15;
const WALK_BOUNCE = 4;
const WALK_ARM_AMP = 0.32; // Gegenschwung der Arme (rotation.x, von talosMotion unberuehrt)
const WALK_LEAN = 0.07; // leichte Oberkoerper-Vorlage beim Gehen
const PHASE_PER_UNIT = (3.0 / 95) * Math.PI * 2 * 0.16;

// Hero-Progress-Fenster (p = __sculptProgress).
const P_WALK0 = 0.06;
const P_WALK1 = 0.44;
const P_TURN1 = 0.53;
const P_WAVE = 0.545;
const P_EXIT0 = 0.62;
const P_EXIT1 = 0.95;
const P_FRAME0 = 0.5;
const P_FRAME1 = 0.64;

// Stations-Groessen: Naehe zur Kamera (Bot.position.z, Basis ~z0).
const SIZE_Z: Record<string, number> = { s: -420, m: 0, l: 200, xl: 330 };

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * c * (c * (c * 6 - 15) + 10);
};
const damp = (cur: number, target: number, lambda: number, dt: number) =>
  cur + (target - cur) * (1 - Math.exp(-lambda * dt));

interface Station {
  el: HTMLElement;
  anchor: number;
  sizeZ: number;
  gesture: string;
  yaw: number;
}

export default function TalosCompanionStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [no3d, setNo3d] = useState(false);
  const [frameOn, setFrameOn] = useState(false);

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
      setFrameOn(true);
      return;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
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

    let disposed = false;
    let rig: TalosRig | null = null;
    let motion: TalosMotion | null = null;
    let loaded = false;
    let waved = false;
    let manualProg: number | null = null;
    let frameVisible = false;

    // Nodes, die DIESE Buehne steuert (talosMotion: Kopf/Oberkoerper/Arm-z).
    type RotNode = { rotation: { x: number; y: number; z: number } };
    type BotNode = { rotation: { y: number }; position: { x: number; y: number; z: number } };
    let n: {
      femurL?: RotNode; femurR?: RotNode; shinL?: RotNode; shinR?: RotNode;
      armP?: RotNode; armO?: RotNode; topPart?: RotNode; bot?: BotNode;
    } = {};
    let base: Record<string, { x: number; y: number; z: number }> = {};
    let botBase = { ry: 0, px: 0, py: 0, pz: 0 };

    let walkW = 0; // Beine schwingen nur, wenn er unterwegs ist
    let walkPhase = 0; // distanzbasiert akkumuliert (auch Stations-Glide)
    let curX = 0; // aktuelle Welt-Position
    let curZ = 0;
    let curYaw = 0;
    let opacity = 0; // weiches Ein-/Ausblenden der ganzen Ebene
    let lastStation: Station | null = null;
    let gestureDone = false;

    const tuning = { endX: END_X, offMargin: OFF_MARGIN };

    // --- Stationen aus dem DOM (gecached, periodisch neu gescannt) ---
    let stations: Station[] = [];
    let scanIn = 0;
    const scanStations = () => {
      stations = Array.from(document.querySelectorAll<HTMLElement>("[data-talos-station]")).map((el) => ({
        el,
        anchor: parseFloat(el.dataset.talosAnchor ?? "0.75"),
        sizeZ: SIZE_Z[el.dataset.talosSize ?? "m"] ?? 0,
        gesture: el.dataset.talosGesture ?? "",
        yaw: parseFloat(el.dataset.talosYaw ?? "0"),
      }));
    };

    const halfWidthAt = (z: number) =>
      Math.tan(((CAM_FOV / 2) * Math.PI) / 180) * (CAM_POS[2] - z) * camera.aspect;

    // Beine/Arme/Vorlage fuer Gehen ODER Stehen schreiben.
    const writeWalkPose = (x: number, z: number, yaw: number, walking: boolean, dt: number) => {
      walkW = damp(walkW, walking ? 1 : 0, 6, Math.max(dt, 1 / 240));
      const swing = Math.sin(walkPhase) * WALK_LEG_AMP * walkW;
      if (n.femurL && base.femurL) n.femurL.rotation.x = base.femurL.x + swing;
      if (n.femurR && base.femurR) n.femurR.rotation.x = base.femurR.x - swing;
      if (n.shinL && base.shinL) n.shinL.rotation.x = base.shinL.x + Math.max(0, -swing) * WALK_KNEE;
      if (n.shinR && base.shinR) n.shinR.rotation.x = base.shinR.x + Math.max(0, swing) * WALK_KNEE;
      // Arm-Gegenschwung auf rotation.x (talosMotion schreibt nur arm.z) —
      // macht das Gehen glaubwuerdig statt "plump" (Thomas-Feedback).
      const armSwing = Math.sin(walkPhase + Math.PI) * WALK_ARM_AMP * walkW;
      if (n.armP && base.armP) n.armP.rotation.x = base.armP.x + armSwing;
      if (n.armO && base.armO) n.armO.rotation.x = base.armO.x - armSwing;
      if (n.bot) {
        n.bot.rotation.y = botBase.ry + yaw;
        n.bot.position.x = x;
        n.bot.position.z = botBase.pz + z;
        n.bot.position.y = botBase.py + Math.abs(Math.sin(walkPhase)) * WALK_BOUNCE * walkW;
      }
    };

    // --- Modus 1: Hero-Choreografie (p = __sculptProgress) ---
    const applyHero = (p: number, dt: number) => {
      const halfW = halfWidthAt(0);
      const startX = -(halfW + tuning.offMargin);
      const exitX = halfW + tuning.offMargin;
      const wp = clamp01((p - P_WALK0) / (P_WALK1 - P_WALK0));
      const tp = clamp01((p - P_WALK1) / (P_TURN1 - P_WALK1));
      const ep = clamp01((p - P_EXIT0) / (P_EXIT1 - P_EXIT0));

      let x: number;
      let yaw: number;
      let walking: boolean;
      if (ep > 0) {
        const turnBack = smooth(Math.min(1, ep / 0.18));
        x = tuning.endX + (exitX - tuning.endX) * smooth(ep);
        yaw = FACE_TURN * turnBack;
        walking = ep > 0.12 && ep < 0.98;
      } else {
        x = startX + (tuning.endX - startX) * wp;
        yaw = FACE_TURN * (1 - smooth(tp));
        walking = wp > 0.001 && wp < 0.999;
      }
      walkPhase = (x - startX) * PHASE_PER_UNIT;
      curX = x; curZ = 0; curYaw = yaw;
      writeWalkPose(x, 0, yaw, walking, dt);

      if (!waved && p >= P_WAVE && ep <= 0) {
        waved = true;
        motion?.triggerGreeting("primary");
      }
      if (waved && p < P_WALK1 - 0.06) waved = false;

      const wantFrame = p >= P_FRAME0 && p <= P_FRAME1;
      if (wantFrame !== frameVisible) { frameVisible = wantFrame; setFrameOn(wantFrame); }
      // Sichtbarkeit: im Hero immer voll (er ist eh offscreen, wenn p klein).
      opacity = damp(opacity, 1, 8, dt);
    };

    // --- Modus 2: Stationen (Begleiter zwischen den Sektionen) ---
    const applyStations = (dt: number) => {
      if (frameVisible) { frameVisible = false; setFrameOn(false); }
      const vh = window.innerHeight;
      const mobile = window.innerWidth < 900;
      // Aktive Station = die, deren Element der Viewport-Mitte am naechsten ist.
      let best: Station | null = null;
      let bestScore = 0;
      for (const s of stations) {
        const r = s.el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const c = r.top + r.height / 2;
        const score = 1 - Math.abs(c - vh / 2) / (r.height / 2 + vh / 2);
        if (score > bestScore) { bestScore = score; best = s; }
      }
      if (mobile) best = null;

      if (best) {
        const targetZ = best.sizeZ;
        const half = halfWidthAt(targetZ);
        const targetX = (best.anchor * 2 - 1) * half;
        if (opacity < 0.05) {
          // Unsichtbar -> Position setzen, DANN einblenden (kein Teleport im Bild).
          curX = targetX; curZ = targetZ; walkPhase = 0;
        }
        const prevX = curX;
        curX = reduced ? targetX : damp(curX, targetX, 2.6, dt);
        curZ = reduced ? targetZ : damp(curZ, targetZ, 2.6, dt);
        const vx = (curX - prevX) / Math.max(dt, 1 / 240);
        const walking = !reduced && Math.abs(vx) > 30 && Math.abs(targetX - curX) > 20;
        walkPhase += (curX - prevX) * PHASE_PER_UNIT * Math.sign(1);
        // Blick: beim Gehen Dreiviertel in Laufrichtung, im Stand die Stations-
        // Grunddrehung (leicht, Richtung Bildmitte deklariert das Markup).
        const targetYaw = walking ? FACE_TURN * Math.sign(vx) : best.yaw;
        curYaw = damp(curYaw, targetYaw, 5, dt);
        writeWalkPose(curX, curZ, curYaw, walking, dt);
        opacity = damp(opacity, 1, 5, dt);
        if (lastStation !== best) { lastStation = best; gestureDone = false; }
        if (!gestureDone && bestScore > 0.45 && !walking) {
          gestureDone = true;
          if (best.gesture === "wave") motion?.triggerGreeting("primary");
          else if (best.gesture === "wave2") motion?.triggerGreeting("other");
          else if (best.gesture === "bow") motion?.triggerBow();
        }
      } else {
        lastStation = null;
        opacity = damp(opacity, 0, 6, dt);
        writeWalkPose(curX, curZ, curYaw, false, dt);
      }
    };

    const onResize = () => {
      if (!host.clientWidth) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener("resize", onResize);
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
      if (w.__talosCompanion === qaHooks) delete w.__talosCompanion;
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
        const byName: Record<string, unknown> = {};
        (splineScene as { traverse: (fn: (o: { name?: string }) => void) => void }).traverse((o) => {
          if (o.name) byName[o.name] = o;
        });
        n = {
          femurL: byName["femur"] as RotNode,
          femurR: byName["femur1"] as RotNode,
          shinL: byName["shin"] as RotNode,
          shinR: byName["shin1"] as RotNode,
          armP: byName["arm1"] as RotNode,
          armO: byName["arm"] as RotNode,
          topPart: byName["Top part"] as RotNode,
          bot: byName["Bot"] as BotNode,
        };
        base = {};
        for (const [k, node] of Object.entries(n)) {
          if (node && "rotation" in node) {
            const r = (node as RotNode).rotation;
            base[k] = { x: r.x, y: r.y, z: r.z };
          }
        }
        if (n.bot) {
          botBase = { ry: n.bot.rotation.y, px: n.bot.position.x, py: n.bot.position.y, pz: n.bot.position.z };
        }
        scanStations();
        loaded = true;
        if (reduced) {
          curX = tuning.endX;
          writeWalkPose(curX, 0, 0, false, 1 / 60);
          setFrameOn(true);
          opacity = 1;
        }
      },
      undefined,
      () => {
        teardown();
        setNo3d(true);
        setFrameOn(true);
      },
    );

    const qaHooks = {
      setProg: (p: number | null) => { manualProg = p == null ? null : clamp01(p); },
      tune: (t: Partial<typeof tuning>) => Object.assign(tuning, t),
      camera,
      stations: () => stations.map((s) => ({ anchor: s.anchor, sizeZ: s.sizeZ, gesture: s.gesture })),
      wave: () => motion?.triggerGreeting("primary"),
      isWaving: () => motion?.isBusy() ?? false,
      state: () => ({ x: curX, z: curZ, yaw: curYaw, opacity }),
    };
    (window as unknown as Record<string, unknown>).__talosCompanion = qaHooks;

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      if (loaded) {
        if (--scanIn <= 0) { scanStations(); scanIn = 150; }
        const heroScene = document.getElementById("sceneMain");
        const heroActive = !!heroScene && heroScene.getBoundingClientRect().bottom > 0;
        if (!reduced) {
          if (manualProg != null) {
            applyHero(manualProg, delta);
          } else if (heroActive) {
            const raw = (window as unknown as { __sculptProgress?: number }).__sculptProgress ?? 0;
            applyHero(raw, delta);
          } else {
            applyStations(delta);
          }
        }
        wrap.style.opacity = opacity.toFixed(3);
      }
      motion?.update(delta);
      // Oberkoerper-Vorlage NACH motion.update (das schreibt topPart absolut).
      if (n.topPart && walkW > 0.01) n.topPart.rotation.x += WALK_LEAN * walkW;
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      rig?.dispose();
      teardown();
    };
  }, []);

  return (
    <div className="tcs-wrap" aria-hidden="true" ref={wrapRef}>
      {/* Dashboard-Fenster UNTER dem Canvas: Talos steht davor / ragt drueber. */}
      <div className={"tcs-frame" + (frameOn ? " tcs-frame--on" : "")}>
        <div className="tcs-frame__bar">
          <span className="tcs-frame__dot" />
          <span className="tcs-frame__title">Talos · im Dienst</span>
        </div>
        <div className="tcs-frame__widgets">
          <div className="tcs-widget">
            <span className="tcs-widget__k">Seite l&auml;uft</span>
            <span className="tcs-widget__v">schnell und erreichbar</span>
          </div>
          <div className="tcs-widget">
            <span className="tcs-widget__k">Anfrage aufgefangen</span>
            <span className="tcs-widget__v">Antwort wartet auf dein Ja</span>
          </div>
          <div className="tcs-widget">
            <span className="tcs-widget__k">Beitrag fertig</span>
            <span className="tcs-widget__v">liegt zur Freigabe bereit</span>
          </div>
        </div>
      </div>
      <div className="tcs-canvas" ref={hostRef} />
      {no3d && <div className="tcs-poster" />}
      <style
        dangerouslySetInnerHTML={{
          __html: `
.tcs-wrap{ position:fixed; inset:0; z-index:30; pointer-events:none; opacity:0; }
.tcs-canvas{ position:absolute; inset:0; z-index:2; }
.tcs-canvas canvas{ display:block; width:100%; height:100%; }
.tcs-poster{ position:absolute; left:6vw; bottom:10vh; width:min(34vw,420px); aspect-ratio:3/4; z-index:1;
  background:radial-gradient(120% 90% at 50% 40%, #ffffff 0%, #f4f4f2 55%, #e9edf0 100%); }
.tcs-frame{ position:absolute; z-index:1; left:3vw; right:3vw; top:9vh; bottom:7vh;
  border:1px solid rgba(28,40,55,.22); background:transparent;
  opacity:0; transform:translateY(10px); transition:opacity .9s ease, transform .9s ease; }
.tcs-frame--on{ opacity:1; transform:none; }
.tcs-frame__bar{ position:absolute; top:0; left:0; right:0; height:34px;
  display:flex; align-items:center; gap:10px; padding:0 14px;
  border-bottom:1px solid rgba(28,40,55,.14);
  font:600 11px/1 "DM Sans",sans-serif; letter-spacing:.14em; text-transform:uppercase;
  color:rgba(28,40,55,.72); }
.tcs-frame__dot{ width:7px; height:7px; border-radius:50%; background:var(--rr-red,#f12032); }
.tcs-frame__widgets{ position:absolute; left:14px; bottom:14px; display:flex; flex-direction:column; gap:8px; }
.tcs-widget{ display:flex; flex-direction:column; gap:2px; padding:8px 12px;
  border:1px solid rgba(28,40,55,.16); background:rgba(255,255,255,.85); min-width:200px; }
.tcs-widget__k{ font:700 10px/1.2 "DM Sans",sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#1c2837; }
.tcs-widget__v{ font:400 12px/1.35 "DM Sans",sans-serif; color:rgba(28,40,55,.66); }
@media (max-width: 760px){
  .tcs-frame__widgets{ display:none; }
}
`,
        }}
      />
    </div>
  );
}
