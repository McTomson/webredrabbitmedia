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

const END_X = -545; // Hero-Zielplatz: an der linken Fensterkante (die Panel-Spalte hat dafuer einen Einzug, .tlh-panels padding-left); wird in applyHero gegen den Frustum-Rand geclampt, damit er auf schmalen Viewports nicht aus dem Bild rutscht
const HERO_Z = -130; // Hero: eine Spur kleiner (weiter von der Kamera)
const OFF_MARGIN = 320; // Luft hinter der Bildkante (offscreen) — inkl. Armreichweite, damit ganz oben NICHTS von Talos ins Bild ragt (Thomas 24.07., Bild 1)
// Koerperhaltung im Stand: IMMER deutlich zur Bildmitte gedreht, nie nach aussen
// (Thomas-Regel 24.07.: die alten 0.13 rad waren zu subtil, er las die Haltung als
// "nach aussen"). Vorzeichen: +yaw = nach rechts gedreht.
// Koerperhaltung im Stand: nur LEICHT zur Bildmitte angedeutet (Thomas 24.07.:
// 0.50 war zu viel -> man sah seinen Ruecken). Die Praesenz macht der KOPF, der
// den User anschaut; der Koerper deutet die Wendung nur an.
const STAND_BIAS = 0.24;
// Wie stark der KOPF (netto, in Welt-Yaw) zum mittig VOR dem Bildschirm sitzenden
// User dreht. Steht Talos links -> Kopf nach rechts/zur Mitte (+), steht er rechts
// -> spiegelverkehrt (-). Thomas 24.07.: der abgenommene Testwert (~0.5) ist das
// Ziel; eine dezentere Variante (0.2) sah wieder fast frontal aus ("falsch").
const USER_LOOK = 0.5;
// Ab welcher Auslenkung (Bruchteil der halben Bildbreite) die volle Drehung
// erreicht ist. Klein -> ausserhalb der Bildmitte ueberall gleich deutlich
// gedreht, nur ganz mittig laeuft es gegen 0 (dann schaut er gerade zum User).
const USER_LOOK_REF = 0.35;
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
const P_EXIT1 = 0.98; // 24.07.: Abgang spaeter beenden -> langsamer, Talos bleibt laenger neben "Gruender"
const P_FRAME0 = 0.5;
const P_FRAME1 = 0.64;

// Stations-Groessen: Naehe zur Kamera (Bot.position.z, Basis ~z0).
// 24.07.: l/xl verkleinert, weil Talos bei l/xl unten abgeschnitten war
// (Thomas Bild 2/15: "etwas verkleinern"). Fuesse sollen im Bild bleiben.
const SIZE_Z: Record<string, number> = { s: -420, sm: -200, m: -70, l: 110, xl: 220 };

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
  layer: "front" | "back";
  appear: number;
}

export default function TalosCompanionStage() {
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
      // Ohne 3D bleibt wenigstens das Dashboard-Fenster im Hero sichtbar.
      document.getElementById("mainSticky")?.classList.add("is-dash");
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
        layer: (el.dataset.talosLayer as "front" | "back") ?? "back",
        appear: parseFloat(el.dataset.talosAppear ?? "0.18"),
      }));
    };

    const halfWidthAt = (z: number) =>
      Math.tan(((CAM_FOV / 2) * Math.PI) / 180) * (CAM_POS[2] - z) * camera.aspect;

    // Netto-Welt-Yaw des Kopfes, damit Talos den mittig VOR dem Bildschirm sitzenden
    // User anschaut: proportional zur horizontalen Bild-Auslenkung (Bruchteil der
    // halben Bildbreite bei seiner Tiefe). Links (x<0) -> +, rechts (x>0) -> -.
    const userLookYaw = (x: number, z: number) => {
      const frac = Math.max(-1, Math.min(1, x / halfWidthAt(z) / USER_LOOK_REF));
      return -frac * USER_LOOK;
    };

    // Ebenen-Schaltung: "front" = Canvas VOR dem Inhalt (Hero, Kontrollraum,
    // CTA), "back" = HINTER dem Text (Text bleibt lesbar, Thomas 23.07.).
    // Der Inhalts-Wrapper der Seite liegt auf z20 mit transparentem Grund.
    let curLayer: "front" | "back" | null = null;
    const setLayer = (l: "front" | "back") => {
      if (curLayer === l) return;
      curLayer = l;
      wrap.style.zIndex = l === "front" ? "30" : "12";
    };

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
      // Frustum-Breite bei der ECHTEN Hero-Tiefe (z=HERO_Z), nicht bei z=0 —
      // sonst steht Talos zu weit vorne im breiteren Bild und der Arm ragt oben rein.
      const halfW = halfWidthAt(HERO_Z);
      const startX = -(halfW + tuning.offMargin);
      const exitX = halfW + tuning.offMargin;
      // Zielplatz nie aus dem Bild: auf schmalen Viewports (kleineres halfW)
      // rueckt er automatisch so weit rein, dass er voll sichtbar bleibt.
      const endX = Math.max(tuning.endX, -(halfWidthAt(HERO_Z) - 130));
      const wp = clamp01((p - P_WALK0) / (P_WALK1 - P_WALK0));
      const tp = clamp01((p - P_WALK1) / (P_TURN1 - P_WALK1));
      const ep = clamp01((p - P_EXIT0) / (P_EXIT1 - P_EXIT0));

      let x: number;
      let yaw: number;
      let walking: boolean;
      if (ep > 0) {
        const turnBack = smooth(Math.min(1, ep / 0.18));
        x = endX + (exitX - endX) * smooth(ep);
        yaw = STAND_BIAS + (FACE_TURN - STAND_BIAS) * turnBack;
        walking = ep > 0.12 && ep < 0.98;
      } else {
        x = startX + (endX - startX) * wp;
        // Ankommen: nicht auf 0 drehen, sondern auf die Stand-Haltung leicht
        // zur Mitte (er steht links -> Haltung leicht nach rechts, nie aussen).
        yaw = STAND_BIAS + (FACE_TURN - STAND_BIAS) * (1 - smooth(tp));
        walking = wp > 0.001 && wp < 0.999;
      }
      walkPhase = (x - startX) * PHASE_PER_UNIT;
      curX = x; curZ = HERO_Z; curYaw = yaw;
      writeWalkPose(x, HERO_Z, yaw, walking, dt);

      if (!waved && p >= P_WAVE && ep <= 0) {
        waved = true;
        motion?.triggerGreeting("primary");
      }
      if (waved && p < P_WALK1 - 0.06) waved = false;

      // Dashboard-Fenster (Navy-Frame lebt im Demo-DOM, Klasse steuert Opacity).
      const wantFrame = p >= P_FRAME0 && p <= P_FRAME1;
      if (wantFrame !== frameVisible) {
        frameVisible = wantFrame;
        document.getElementById("mainSticky")?.classList.toggle("is-dash", wantFrame);
      }
      // Im Hero schaut Talos den mittig sitzenden User an: netto = userLookYaw
      // (headYaw = Ziel - Koerper-Yaw). Beim Abgang (ep>0, er geht) NICHT — dann
      // schaut der Kopf frei in Laufrichtung.
      motion?.setHeadYaw(ep > 0 ? 0 : userLookYaw(x, HERO_Z) - yaw);
      motion?.setNodLoop(false);
      motion?.setWinkLoop(false);
      // Im Hero liegt der Canvas immer VOR dem Inhalt.
      setLayer("front");
      // Sichtbarkeit: im Hero immer voll (er ist eh offscreen, wenn p klein).
      opacity = damp(opacity, 1, 8, dt);
    };

    // --- Modus 2: Stationen (Begleiter zwischen den Sektionen) ---
    const applyStations = (dt: number) => {
      if (frameVisible) {
        frameVisible = false;
        document.getElementById("mainSticky")?.classList.remove("is-dash");
      }
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

      // Erst aktiv, wenn die Sektion wirklich da ist (Thomas: er erschien nach
      // dem Bumper zu frueh/zu schnell) — pro Station eigene Schwelle moeglich.
      if (best && bestScore < best.appear) best = null;

      if (best) {
        setLayer(best.layer);
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
        // Blick/Haltung: beim Gehen Dreiviertel in Laufrichtung; im Stand IMMER
        // leicht zur Bildmitte (nie nach aussen) plus optionale Markup-Drehung.
        const centerBias = curX > 60 ? -STAND_BIAS : curX < -60 ? STAND_BIAS : 0;
        const targetYaw = walking ? FACE_TURN * Math.sign(vx) : centerBias + best.yaw;
        curYaw = damp(curYaw, targetYaw, 5, dt);
        writeWalkPose(curX, curZ, curYaw, walking, dt);
        // Kopf schaut den mittig sitzenden User an: netto = userLookYaw (links ->
        // leicht zur Mitte/rechts, rechts spiegelverkehrt). Beim Gehen frei.
        motion?.setHeadYaw(walking ? 0 : userLookYaw(curX, curZ) - curYaw);
        // Nicken/Zwinkern laufen als 10-s-Loop, solange die Station aktiv ist.
        motion?.setNodLoop(best.gesture === "nod");
        motion?.setWinkLoop(best.gesture === "wink");
        opacity = damp(opacity, 1, 3.2, dt);
        if (lastStation !== best) { lastStation = best; gestureDone = false; }
        if (!gestureDone && bestScore > 0.45 && !walking) {
          gestureDone = true;
          if (best.gesture === "wave") motion?.triggerGreeting("primary");
          else if (best.gesture === "wave2") motion?.triggerGreeting("other");
          else if (best.gesture === "bow") motion?.triggerBow();
        }
      } else {
        lastStation = null;
        motion?.setHeadYaw(0);
        motion?.setNodLoop(false);
        motion?.setWinkLoop(false);
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
      let nx = (e.clientX / window.innerWidth) * 2 - 1;
      // BLICK-SPERRE (Thomas-Regel, seitenweit): Der Kopf darf der Maus nie so
      // weit folgen, dass Talos aus dem Bild schaut. Steht er links, ist der
      // Blick nach links (negatives nx) hart begrenzt; rechts umgekehrt.
      if (curX < -60) nx = Math.max(nx, -0.12);
      else if (curX > 60) nx = Math.min(nx, 0.12);
      motion?.setPointer(nx, -((e.clientY / window.innerHeight) * 2 - 1));
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
          writeWalkPose(curX, HERO_Z, STAND_BIAS, false, 1 / 60);
          document.getElementById("mainSticky")?.classList.add("is-dash");
          opacity = 1;
        }
      },
      undefined,
      () => {
        teardown();
        setNo3d(true);
        document.getElementById("mainSticky")?.classList.add("is-dash");
      },
    );

    // Ein Frame: Modus waehlen, Motion updaten, rendern. Ausgelagert, damit die
    // QA-Hooks bei eingefrorenem rAF (Hintergrund-Tab) Frames manuell treiben koennen.
    const frame = (delta: number) => {
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
    };

    const qaHooks = {
      setProg: (p: number | null) => { manualProg = p == null ? null : clamp01(p); },
      tune: (t: Partial<typeof tuning>) => Object.assign(tuning, t),
      camera,
      stations: () => stations.map((s) => ({ anchor: s.anchor, sizeZ: s.sizeZ, gesture: s.gesture })),
      wave: () => motion?.triggerGreeting("primary"),
      isWaving: () => motion?.isBusy() ?? false,
      state: () => ({ x: curX, z: curZ, yaw: curYaw, opacity }),
      // QA: Frames manuell treiben, wenn der Tab im Hintergrund liegt (rAF friert).
      tick: (dt = 1 / 60, steps = 1) => { for (let i = 0; i < steps; i++) frame(dt); },
      // QA: Zugriff auf Kopf-Pitch (Nicken) + Augen-Dots (Zwinkern) zum Messen.
      rig: () => rig,
    };
    (window as unknown as Record<string, unknown>).__talosCompanion = qaHooks;

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => frame(clock.getDelta()));

    return () => {
      disposed = true;
      rig?.dispose();
      teardown();
    };
  }, []);

  return (
    <div className="tcs-wrap" aria-hidden="true" ref={wrapRef}>
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
`,
        }}
      />
    </div>
  );
}
