"use client";

// Talos-Walk-Buehne fuer den Hero der Talos-Leistungsseite.
//
// Vollflaechige, transparente three-spline-Ebene, die der TalosDemoClient per
// Portal in .main-sticky der talos-demo haengt (an der Stelle, an der die
// Website-Seite die MorphSculpture rendert). Sie liest window.__sculptProgress
// (0..1, von der Demo-Engine pro Frame gesetzt) und macht daraus die
// scroll-gekoppelte Choreografie:
//
//   p 0.06..0.44  Walk-in: Talos geht von links ins Bild (Beine = portierter
//                 Lauf-Zyklus aus talosMoodMotion, distanzbasiert -> scrubbing
//                 rueckwaerts laeuft rueckwaerts). Laufrichtung rechts = Profil
//                 zur Bildmitte, nie "aus dem Bildschirm hinaus" (Thomas-Regel).
//   p 0.44..0.53  Ankommen + Drehung zum User (Yaw -> 0).
//   p ~0.55       Plateau (Story-Text scrollt): Winken (rechte Hand, einmalig,
//                 re-armiert beim Zurueckscrollen), danach Idle: Atmung,
//                 Blinzeln, Blickfolge. Dashboard-Rahmen blendet ein.
//   p 0.62..1     Abgang: er geht rechts aus dem Bild (wie die Wort-Fragmente).
//
// Der Dashboard-Rahmen (helles Fenster mit Mini-Widgets, Schaubild ohne echte
// Zahlen) liegt UNTER dem Canvas -> Talos steht davor bzw. wird vom Rahmen
// angeschnitten, je nach Kadrierung. Fallbacks wie TalosEntranceStage:
// kein WebGL2 / wenig RAM -> Poster; prefers-reduced-motion -> statische
// Endpose mit sichtbarem Rahmen.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three-spline";
import SplineLoader from "@splinetool/loader";
import { buildTalosRig, type TalosRig } from "./talosRig";
import { createTalosMotion, type TalosMotion } from "./talosMotion";

const SCENE_URL = "https://prod.spline.design/bN7MTDW-zSkVIOxf/scene.splinecode";

// Ganzkoerper-Kamera mit Platz zum Laufen (Basis: TalosChoreoStage, dort am
// Modell vermessen). Ziel leicht ueber Figur-Mitte, weit genug weg fuer Kopf
// UND Fuesse plus Laufstrecke.
const CAM_POS: [number, number, number] = [60, 70, 1860];
const CAM_TGT: [number, number, number] = [0, 30, 12];
const CAM_FOV = 40;

// Laufstrecke (Weltkoordinaten, via QA-Hook __talosWalk.tune live justierbar).
// Start/Exit werden NICHT fix gesetzt, sondern pro Frame aus dem Kamera-Frustum
// gerechnet (offscreen ist aspect-abhaengig: bei 16:9 liegt die Bildkante bei
// ~±1450 Welteinheiten — ein fixer Wert war bei breiten Viewports noch im Bild).
const END_X = -150; // Zielplatz: links der Mitte (rechts kommt der Text)
const OFF_MARGIN = 260; // Luft hinter der Bildkante
// Laufrichtung rechts als DREIVIERTEL-Ansicht: empirisch am Render geprueft
// (22.07.): +1.5 = hartes Profil rechts (Gesicht kaum sichtbar), -1.5 = schaut
// nach links aus dem Bild (verboten). +1.05 = geht nach rechts, Gesicht leicht
// zum User gedreht (Thomas-Regel: Blick nie aus dem Bildschirm hinaus).
const FACE_RIGHT = 1.05;

// Lauf-Parameter (1:1 aus talosMoodMotion, dort am Modell abgestimmt).
const WALK_LEG_AMP = 0.55;
const WALK_KNEE = 1.15;
const WALK_BOUNCE = 4;
const PHASE_PER_UNIT = 3.0 / 95; // Schrittfrequenz pro Weltstrecke (CADENCE/SPEED)

// Progress-Fenster (p = __sculptProgress).
const P_WALK0 = 0.06;
const P_WALK1 = 0.44;
const P_TURN1 = 0.53;
const P_WAVE = 0.545;
const P_EXIT0 = 0.62;
const P_EXIT1 = 0.95;
const P_FRAME0 = 0.5;   // Rahmen an, sobald er praktisch steht
const P_FRAME1 = 0.64;  // Rahmen aus, wenn der Abgang beginnt

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * c * (c * (c * 6 - 15) + 10);
};
const damp = (cur: number, target: number, lambda: number, dt: number) =>
  cur + (target - cur) * (1 - Math.exp(-lambda * dt));

export default function TalosWalkStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [no3d, setNo3d] = useState(false);
  const [frameOn, setFrameOn] = useState(false);

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
      setFrameOn(true); // Rahmen als ruhiges Schaubild trotzdem zeigen
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

    // Beine + Ganzkoerper-Root steuert DIESE Buehne (talosMotion fasst nur
    // Kopf/Oberkoerper/Arme an -> keine Schreib-Konflikte).
    let legNodes: {
      femurL?: { rotation: { x: number } };
      femurR?: { rotation: { x: number } };
      shinL?: { rotation: { x: number } };
      shinR?: { rotation: { x: number } };
      bot?: { rotation: { y: number }; position: { x: number; y: number } };
    } = {};
    let legBase: Record<string, number> = {};
    let botBase = { ry: 0, px: 0, py: 0 };
    let walkW = 0; // gedaempftes Lauf-Gewicht (Beine schwingen nur beim Gehen)

    // Live-Tuning (QA): __talosWalk.tune({endX: ...})
    const tuning = { endX: END_X, offMargin: OFF_MARGIN };

    const applyProgress = (p: number, dt: number) => {
      // Offscreen-Kanten aus dem Frustum (Figur steht ~z0, Kamera z=CAM_POS[2]).
      const halfW = Math.tan(((CAM_FOV / 2) * Math.PI) / 180) * CAM_POS[2] * camera.aspect;
      const startX = -(halfW + tuning.offMargin);
      const exitX = halfW + tuning.offMargin;
      // Segmente aus dem Scroll-Fortschritt.
      const wp = clamp01((p - P_WALK0) / (P_WALK1 - P_WALK0));
      const tp = clamp01((p - P_WALK1) / (P_TURN1 - P_WALK1));
      const ep = clamp01((p - P_EXIT0) / (P_EXIT1 - P_EXIT0));

      let x: number;
      let yaw: number;
      let walkingNow: boolean;
      if (ep > 0) {
        // Abgang rechts: erst zurueckdrehen ins Profil, dann gehen.
        const turnBack = smooth(Math.min(1, ep / 0.18));
        x = tuning.endX + (exitX - tuning.endX) * smooth(ep);
        yaw = FACE_RIGHT * turnBack;
        walkingNow = ep > 0.12 && ep < 0.98;
      } else {
        x = startX + (tuning.endX - startX) * wp;
        // Waehrend des Gehens Profil zur Bildmitte, beim Ankommen Drehung zum User.
        yaw = FACE_RIGHT * (1 - smooth(tp));
        walkingNow = wp > 0.001 && wp < 0.999;
      }

      // Distanzbasierter Schritt-Zyklus: rueckwaerts scrubben = rueckwaerts gehen.
      const phase = (x - startX) * PHASE_PER_UNIT * Math.PI * 2 * 0.16;
      walkW = damp(walkW, walkingNow ? 1 : 0, 6, Math.max(dt, 1 / 240));
      const swing = Math.sin(phase) * WALK_LEG_AMP * walkW;

      if (legNodes.femurL) legNodes.femurL.rotation.x = (legBase.femurL ?? 0) + swing;
      if (legNodes.femurR) legNodes.femurR.rotation.x = (legBase.femurR ?? 0) - swing;
      if (legNodes.shinL) legNodes.shinL.rotation.x = (legBase.shinL ?? 0) + Math.max(0, -swing) * WALK_KNEE;
      if (legNodes.shinR) legNodes.shinR.rotation.x = (legBase.shinR ?? 0) + Math.max(0, swing) * WALK_KNEE;
      if (legNodes.bot) {
        legNodes.bot.rotation.y = botBase.ry + yaw;
        legNodes.bot.position.x = x;
        legNodes.bot.position.y = botBase.py + Math.abs(Math.sin(phase)) * WALK_BOUNCE * walkW;
      }

      // Winken: einmalig am Plateau (nach der Drehung), re-armiert beim
      // Zurueckscrollen unter das Walk-Ende.
      if (!waved && p >= P_WAVE && ep <= 0) {
        waved = true;
        motion?.triggerGreeting("primary");
      }
      if (waved && p < P_WALK1 - 0.06) waved = false;

      // Dashboard-Rahmen einblenden, solange er an seinem Platz steht.
      const wantFrame = p >= P_FRAME0 && p <= P_FRAME1;
      if (wantFrame !== frameVisible) {
        frameVisible = wantFrame;
        setFrameOn(wantFrame);
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
      if (w.__talosWalk === qaHooks) delete w.__talosWalk;
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
        // Bein-/Root-Nodes einsammeln (Namen wie in talosMoodMotion vermessen).
        const byName: Record<string, unknown> = {};
        (splineScene as { traverse: (fn: (o: { name?: string }) => void) => void }).traverse((o) => {
          if (o.name) byName[o.name] = o;
        });
        legNodes = {
          femurL: byName["femur"] as typeof legNodes.femurL,
          femurR: byName["femur1"] as typeof legNodes.femurR,
          shinL: byName["shin"] as typeof legNodes.shinL,
          shinR: byName["shin1"] as typeof legNodes.shinR,
          bot: byName["Bot"] as typeof legNodes.bot,
        };
        legBase = {};
        for (const k of ["femurL", "femurR", "shinL", "shinR"] as const) {
          const n = legNodes[k];
          if (n) legBase[k] = n.rotation.x;
        }
        if (legNodes.bot) {
          botBase = {
            ry: legNodes.bot.rotation.y,
            px: legNodes.bot.position.x,
            py: legNodes.bot.position.y,
          };
        }
        loaded = true;
        if (reduced) {
          // Statische Endpose: an seinem Platz, zum User gedreht, Rahmen an.
          if (legNodes.bot) {
            legNodes.bot.position.x = tuning.endX;
            legNodes.bot.rotation.y = botBase.ry;
          }
          setFrameOn(true);
        }
      },
      undefined,
      () => {
        teardown();
        setNo3d(true);
        setFrameOn(true);
      },
    );

    // QA-Hooks: window.__talosWalk.setProg(0..1) / .tune({endX}) / .camera
    const qaHooks = {
      setProg: (p: number | null) => {
        manualProg = p == null ? null : clamp01(p);
      },
      tune: (t: Partial<typeof tuning>) => Object.assign(tuning, t),
      camera,
      wave: () => motion?.triggerGreeting("primary"),
      isWaving: () => motion?.isBusy() ?? false,
    };
    (window as unknown as Record<string, unknown>).__talosWalk = qaHooks;

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      if (loaded && !reduced) {
        const raw = (window as unknown as { __sculptProgress?: number }).__sculptProgress ?? 0;
        applyProgress(manualProg ?? raw, delta);
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
    <div className="tws-wrap" aria-hidden="true">
      {/* Dashboard-Fenster UNTER dem Canvas: Talos steht davor / ragt drueber. */}
      <div className={"tws-frame" + (frameOn ? " tws-frame--on" : "")}>
        <div className="tws-frame__bar">
          <span className="tws-frame__dot" />
          <span className="tws-frame__title">Talos · im Dienst</span>
        </div>
        <div className="tws-frame__widgets">
          <div className="tws-widget">
            <span className="tws-widget__k">Seite l&auml;uft</span>
            <span className="tws-widget__v">schnell und erreichbar</span>
          </div>
          <div className="tws-widget">
            <span className="tws-widget__k">Anfrage aufgefangen</span>
            <span className="tws-widget__v">Antwort wartet auf dein Ja</span>
          </div>
          <div className="tws-widget">
            <span className="tws-widget__k">Beitrag fertig</span>
            <span className="tws-widget__v">liegt zur Freigabe bereit</span>
          </div>
        </div>
      </div>
      <div className="tws-canvas" ref={hostRef} />
      {no3d && <div className="tws-poster" />}
      <style
        dangerouslySetInnerHTML={{
          __html: `
.tws-wrap{ position:absolute; inset:0; pointer-events:none; }
.tws-canvas{ position:absolute; inset:0; z-index:2; }
.tws-canvas canvas{ display:block; width:100%; height:100%; }
.tws-poster{ position:absolute; left:6vw; bottom:10vh; width:min(34vw,420px); aspect-ratio:3/4; z-index:1;
  background:radial-gradient(120% 90% at 50% 40%, #ffffff 0%, #f4f4f2 55%, #e9edf0 100%); }
/* Dashboard-Fenster: helles, eckiges Schaubild um die ganze Hero-Flaeche. */
.tws-frame{ position:absolute; z-index:1; left:3vw; right:3vw; top:9vh; bottom:7vh;
  border:1px solid rgba(28,40,55,.22); background:transparent;
  opacity:0; transform:translateY(10px); transition:opacity .9s ease, transform .9s ease; }
.tws-frame--on{ opacity:1; transform:none; }
.tws-frame__bar{ position:absolute; top:0; left:0; right:0; height:34px;
  display:flex; align-items:center; gap:10px; padding:0 14px;
  border-bottom:1px solid rgba(28,40,55,.14);
  font:600 11px/1 "DM Sans",sans-serif; letter-spacing:.14em; text-transform:uppercase;
  color:rgba(28,40,55,.72); }
.tws-frame__dot{ width:7px; height:7px; border-radius:50%; background:var(--rr-red,#f12032); }
.tws-frame__widgets{ position:absolute; left:14px; bottom:14px; display:flex; flex-direction:column; gap:8px; }
.tws-widget{ display:flex; flex-direction:column; gap:2px; padding:8px 12px;
  border:1px solid rgba(28,40,55,.16); background:rgba(255,255,255,.85); min-width:200px; }
.tws-widget__k{ font:700 10px/1.2 "DM Sans",sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#1c2837; }
.tws-widget__v{ font:400 12px/1.35 "DM Sans",sans-serif; color:rgba(28,40,55,.66); }
@media (max-width: 760px){
  .tws-frame__widgets{ display:none; } /* mobil: nur Rahmen, keine Widget-Spalte */
}
`,
        }}
      />
    </div>
  );
}
