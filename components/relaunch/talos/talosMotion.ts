// Talos-Bewegungs-Regie: laeuft pro Frame auf den benannten Spline-Nodes
// (matrixAutoUpdate=true, verifiziert 19.07.). Alle Animationen sind Offsets
// auf die beim Start eingefrorenen Basis-Rotationen — die Rest-Pose des
// Originals bleibt unangetastet.
//
// Gelenk-Mapping (numerisch vermessen 19.07.): Schulter-/Ellbogen-Rotation um
// lokal Z hebt die Hand; Kette "arm1/elbow1/forearm1" = Arm auf Bildschirm-
// rechts in der Frontalansicht (damit winkt Talos).

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { TalosRig } from "./talosRig";

interface Euler3 {
  x: number;
  y: number;
  z: number;
}

const GREETING_DURATION = 3.2; // Sekunden gesamt (heben, 2x winken, senken)
const BOW_DURATION = 2.0;

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
const easeInOut = (t: number) => t * t * (3 - 2 * t); // smoothstep
// Weiches Nachziehen, frame-rate-unabhaengig.
const damp = (cur: number, target: number, lambda: number, dt: number) =>
  cur + (target - cur) * (1 - Math.exp(-lambda * dt));

export interface TalosMotion {
  /** Pro Frame aufrufen. dt in Sekunden. */
  update(dt: number): void;
  /** Gruss ausloesen (Arm heben + winken). Ignoriert waehrend er laeuft. */
  triggerGreeting(): void;
  /** Leichte Verbeugung (Abschluss-Geste). */
  triggerBow(): void;
  /** Blickziel: normalisierte Viewport-Koordinaten -1..1 (x rechts, y oben). */
  setPointer(nx: number, ny: number): void;
  /** Kopfneigung an/aus (z.B. waehrend einer Frage im Assistenten). */
  setHeadTilt(active: boolean): void;
  /** true = statische Pose, nur Blinzeln (prefers-reduced-motion). */
  setReducedMotion(reduced: boolean): void;
  /** Läuft gerade eine Gruss-/Verbeugungs-Timeline? (fuer Regie-Gates) */
  isBusy(): boolean;
}

export function createTalosMotion(rig: TalosRig, splineScene: any): TalosMotion {
  const byName: Record<string, any> = {};
  splineScene.traverse((o: any) => {
    if (o.name) byName[o.name] = o;
  });

  const nodes = {
    head: rig.head,
    topPart: rig.topPart,
    arm: byName["arm1"],
    elbow: byName["elbow1"],
    forearm: byName["forearm1"],
    hand: byName["Hand2"],
  };

  // Vector3-Konstruktor aus der Szene ziehen (Modul importiert THREE nicht,
  // damit Demo + Buehne dieselbe three-spline-Instanz nutzen).
  const V3 = rig.head.position.constructor as new (
    x: number,
    y: number,
    z: number
  ) => any;
  // Hand-Geometrie (vermessen 19.07.): laengste Achse y = Finger,
  // duennste Achse z = Handflaechen-Normale.
  const FINGER_AXIS = new V3(0, 1, 0);
  const PALM_AXIS = new V3(0, 0, 1);
  // Twist, der die Handflaeche bei gehobenem Arm zur Kamera dreht
  // (numerisch geloest: dot(Normale, Kamera) = 0.999 bei -2.19 rad).
  const PALM_FORWARD_TWIST = -2.19;

  // Basis-Rotationen einfrieren (Rest-Pose des Originals).
  const base: Record<string, Euler3> = {};
  for (const [key, node] of Object.entries(nodes)) {
    if (!node) continue;
    base[key] = {
      x: node.rotation.x,
      y: node.rotation.y,
      z: node.rotation.z,
    };
  }

  let elapsed = 0;
  let reduced = false;
  let headTilt = false;

  // Blinzeln
  let nextBlinkAt = 2.5;
  let blinkPhase = -1;

  // Blickfolge
  let pointerX = 0;
  let pointerY = 0;
  let gazeYaw = 0;
  let gazePitch = 0;

  // Gesten-Timelines (-1 = inaktiv, sonst 0..1)
  let greetT = -1;
  let bowT = -1;

  // Idle-Daempfer fuer weiche Uebergaenge nach Gesten
  let armLift = 0;
  let elbowBend = 0;
  let wristWave = 0;

  const setPointer = (nx: number, ny: number) => {
    pointerX = clamp(nx, -1, 1);
    pointerY = clamp(ny, -1, 1);
  };

  const triggerGreeting = () => {
    if (greetT < 0 && bowT < 0 && !reduced) greetT = 0;
  };
  const triggerBow = () => {
    if (bowT < 0 && greetT < 0 && !reduced) bowT = 0;
  };

  const update = (dt: number) => {
    if (!Number.isFinite(dt) || dt <= 0) return;
    elapsed += dt;

    // --- Blinzeln (laeuft auch bei reduced-motion, ist minimal) ---
    if (blinkPhase < 0 && elapsed >= nextBlinkAt) blinkPhase = 0;
    if (blinkPhase >= 0) {
      blinkPhase += dt / 0.28;
      if (blinkPhase >= 1) {
        blinkPhase = -1;
        nextBlinkAt = elapsed + 3.2 + 2.2 * Math.abs(Math.sin(elapsed * 5.7));
        rig.setEyeOpen(1);
      } else {
        rig.setEyeOpen(Math.abs(1 - blinkPhase * 2));
      }
    }

    if (reduced) return; // statische Pose, nur Blinzeln

    // --- Blickfolge: Kopf folgt dem Cursor, weich gedaempft ---
    const targetYaw = pointerX * 0.32;
    const targetPitch = -pointerY * 0.18;
    gazeYaw = damp(gazeYaw, targetYaw, 6, dt);
    gazePitch = damp(gazePitch, targetPitch, 6, dt);

    // --- Idle-Atmung: kaum sichtbares Heben des Oberkoerpers ---
    const breathe = Math.sin(elapsed * 1.4) * 0.012;

    // --- Kopfneigung (Frage-Geste) ---
    const tiltTarget = headTilt ? 0.14 : 0;

    // --- Gruss-Timeline ---
    let greetArm = 0;
    let greetElbow = 0;
    let greetWave = 0;
    if (greetT >= 0) {
      greetT += dt / GREETING_DURATION;
      if (greetT >= 1) {
        greetT = -1;
      } else {
        const t = greetT;
        // Phasen: 0-0.25 heben, 0.25-0.75 winken, 0.75-1 senken
        const lift =
          t < 0.25
            ? easeInOut(t / 0.25)
            : t > 0.75
              ? easeInOut((1 - t) / 0.25)
              : 1;
        greetArm = lift;
        greetElbow = lift;
        if (t >= 0.25 && t <= 0.75) {
          greetWave = Math.sin(((t - 0.25) / 0.5) * Math.PI * 4) * lift;
        }
      }
    }
    armLift = damp(armLift, greetArm, 10, dt);
    elbowBend = damp(elbowBend, greetElbow, 10, dt);
    wristWave = damp(wristWave, greetWave, 14, dt);

    // --- Verbeugung ---
    let bowAmount = 0;
    if (bowT >= 0) {
      bowT += dt / BOW_DURATION;
      if (bowT >= 1) {
        bowT = -1;
      } else {
        const t = bowT;
        bowAmount =
          t < 0.35
            ? easeInOut(t / 0.35)
            : t > 0.6
              ? easeInOut((1 - t) / 0.4)
              : 1;
      }
    }

    // --- Auf die Nodes schreiben (Basis + Offsets) ---
    if (nodes.head) {
      nodes.head.rotation.y = base.head.y + gazeYaw;
      nodes.head.rotation.x = base.head.x + gazePitch + bowAmount * 0.22;
      nodes.head.rotation.z = damp(
        nodes.head.rotation.z,
        base.head.z + tiltTarget,
        5,
        dt
      );
    }
    if (nodes.topPart) {
      nodes.topPart.rotation.x = base.topPart.x + breathe * 0.4 + bowAmount * 0.18;
      const s = 1 + breathe * 0.25;
      nodes.topPart.scale.set(s, s, s);
    }
    if (nodes.arm) nodes.arm.rotation.z = base.arm.z + armLift * 1.35;
    if (nodes.elbow) nodes.elbow.rotation.z = base.elbow.z + elbowBend * 1.05;
    if (nodes.forearm)
      nodes.forearm.rotation.z = base.forearm.z + elbowBend * 0.35;
    if (nodes.hand && base.hand) {
      // Handflaeche beim Heben zur Kamera drehen, Winken = Faechern um die
      // Flaechen-Normale (Scheibenwischer).
      nodes.hand.rotation.set(base.hand.x, base.hand.y, base.hand.z);
      if (armLift > 0.001) {
        nodes.hand.rotateOnAxis(FINGER_AXIS, PALM_FORWARD_TWIST * armLift);
        nodes.hand.rotateOnAxis(PALM_AXIS, wristWave * 0.5);
      }
    }
  };

  return {
    update,
    triggerGreeting,
    triggerBow,
    setPointer,
    setHeadTilt: (active: boolean) => {
      headTilt = active;
    },
    setReducedMotion: (r: boolean) => {
      reduced = r;
    },
    isBusy: () => greetT >= 0 || bowT >= 0,
  };
}
