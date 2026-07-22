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
  /**
   * Gruss ausloesen (Arm heben + winken). Ignoriert waehrend eine Geste laeuft.
   * `arm` waehlt die Hand: "primary" (Default, arm1/Hand2 — bit-identisch zum
   * bisherigen Verhalten) oder "other" (gespiegelte arm/Hand-Kette).
   */
  triggerGreeting(arm?: "primary" | "other"): void;
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
    // Primaerer Arm (Frontalansicht Bildschirm-rechts): arm1/elbow1/forearm1/Hand2.
    arm: byName["arm1"],
    elbow: byName["elbow1"],
    forearm: byName["forearm1"],
    hand: byName["Hand2"],
    // Gegen-Arm (gespiegelte Instanz-Kette unter "Hand Instance", am Modell
    // verifiziert 22.07.): arm/elbow/forearm mit End-Hand "Hand". Fuer den
    // Wink mit der ANDEREN Hand — IDENTISCHE lokale Offsets, die X-Spiegelung
    // des Eltern-Knotens erzeugt die Spiegel-Geste (siehe update()).
    armB: byName["arm"],
    elbowB: byName["elbow"],
    forearmB: byName["forearm"],
    handB: byName["Hand"],
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
  let greetT = -1;   // Primaer-Arm-Wink
  let greetBT = -1;  // Gegen-Arm-Wink (andere Hand)
  let bowT = -1;

  // Idle-Daempfer fuer weiche Uebergaenge nach Gesten
  let armLift = 0;
  let elbowBend = 0;
  let wristWave = 0;
  // Zweiter Satz Daempfer fuer den Gegen-Arm.
  let armLiftB = 0;
  let elbowBendB = 0;
  let wristWaveB = 0;

  const setPointer = (nx: number, ny: number) => {
    pointerX = clamp(nx, -1, 1);
    pointerY = clamp(ny, -1, 1);
  };

  // Wink-Hebe-/Faecher-Kurve aus dem Timeline-Fortschritt (0..1).
  // Phasen: 0-0.25 heben, 0.25-0.75 winken, 0.75-1 senken.
  const greetPose = (t: number) => {
    const lift =
      t < 0.25 ? easeInOut(t / 0.25) : t > 0.75 ? easeInOut((1 - t) / 0.25) : 1;
    const wave =
      t >= 0.25 && t <= 0.75
        ? Math.sin(((t - 0.25) / 0.5) * Math.PI * 4) * lift
        : 0;
    return { lift, wave };
  };

  const triggerGreeting = (arm: "primary" | "other" = "primary") => {
    // Nur starten, wenn keine Geste laeuft (Winken beider Arme + Verbeugung
    // schliessen sich gegenseitig aus) — no-op waehrend eines laufenden Winkens.
    if (reduced || greetT >= 0 || greetBT >= 0 || bowT >= 0) return;
    if (arm === "other") greetBT = 0;
    else greetT = 0;
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

    // --- Gruss-Timeline (Primaer-Arm) ---
    let greetArm = 0;
    let greetElbow = 0;
    let greetWave = 0;
    if (greetT >= 0) {
      greetT += dt / GREETING_DURATION;
      if (greetT >= 1) {
        greetT = -1;
      } else {
        const g = greetPose(greetT);
        greetArm = g.lift;
        greetElbow = g.lift;
        greetWave = g.wave;
      }
    }
    armLift = damp(armLift, greetArm, 10, dt);
    elbowBend = damp(elbowBend, greetElbow, 10, dt);
    wristWave = damp(wristWave, greetWave, 14, dt);

    // --- Gruss-Timeline (Gegen-Arm, andere Hand) ---
    let greetArmB = 0;
    let greetElbowB = 0;
    let greetWaveB = 0;
    if (greetBT >= 0) {
      greetBT += dt / GREETING_DURATION;
      if (greetBT >= 1) {
        greetBT = -1;
      } else {
        const g = greetPose(greetBT);
        greetArmB = g.lift;
        greetElbowB = g.lift;
        greetWaveB = g.wave;
      }
    }
    armLiftB = damp(armLiftB, greetArmB, 10, dt);
    elbowBendB = damp(elbowBendB, greetElbowB, 10, dt);
    wristWaveB = damp(wristWaveB, greetWaveB, 14, dt);

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

    // --- Gegen-Arm schreiben (IDENTISCHE lokale Rotationen wie der Primaer-Arm) ---
    // Am Modell vermessen (22.07.): die Gegen-Arm-Kette haengt unter "Hand
    // Instance", einer GESPIEGELTEN Instanz von "Hand1" (world-Determinante
    // kippt das Vorzeichen: arm1=+0.512, arm=-0.512; die lokalen Transforms sind
    // numerisch identisch). Weil der Eltern-Knoten bereits die X-Spiegelung
    // liefert, erzeugt DERSELBE lokale Rotations-Offset automatisch die
    // spiegelbildliche Geste (Arm hebt, Hand pendelt oben). Das fruehere Negieren
    // der Vorzeichen war eine Doppel-Spiegelung -> Hand kippte nach unten/innen.
    if (nodes.armB && base.armB)
      nodes.armB.rotation.z = base.armB.z + armLiftB * 1.35;
    if (nodes.elbowB && base.elbowB)
      nodes.elbowB.rotation.z = base.elbowB.z + elbowBendB * 1.05;
    if (nodes.forearmB && base.forearmB)
      nodes.forearmB.rotation.z = base.forearmB.z + elbowBendB * 0.35;
    if (nodes.handB && base.handB) {
      nodes.handB.rotation.set(base.handB.x, base.handB.y, base.handB.z);
      if (armLiftB > 0.001) {
        nodes.handB.rotateOnAxis(FINGER_AXIS, PALM_FORWARD_TWIST * armLiftB);
        nodes.handB.rotateOnAxis(PALM_AXIS, wristWaveB * 0.5);
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
    isBusy: () => greetT >= 0 || greetBT >= 0 || bowT >= 0,
  };
}
