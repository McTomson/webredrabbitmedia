// Talos-Rig: baut auf der geladenen Original-Spline-Szene die Marken-Elemente
// (tuerkise Punktmatrix-Augen wie das Original-Dot-Muster, EINE Gold-Kammlinie)
// und liefert die Bewegungs-API. Laeuft auf `three-spline` (three@0.149) —
// deshalb wird THREE als Parameter hereingereicht statt importiert, damit das
// Modul in jeder Buehne (Demo + Leistungs-Seite) dieselbe Instanz nutzt.
//
// Vermessen am geladenen Modell (Raycast, 18.07.):
// - Visier zeigt in Head-Space nach +Z (verifiziert ueber die eingebettete
//   Editor-Kamera "Camera 2": Position in Head-Space ~(3, 37, 429)).
// - Augenhoehe y=57, Augenabstand x=+-19, Visier-Front z~41..49.
// - Kopf-Scheitelprofil (x=0): z=-40:y84.9, -30:98.4, -20:104.6, -10:106.5,
//   0:106.4, 10:104.7, 20:101.5, 30:97, 40:83.5.

/* eslint-disable @typescript-eslint/no-explicit-any */

export const TALOS_COLORS = {
  eye: 0x39c2d7, // Marken-Tuerkis (Look-Entscheidung 18.07.)
  eyeWhite: 0xffffff, // Original-Variante zum Vergleich
  crestGold: 0xc9a04a,
} as const;

// Punktmatrix pro Auge: gestaffelte Reihen wie das Hexagon-Muster des Originals.
const EYE_ROWS: ReadonlyArray<{ y: number; xs: ReadonlyArray<number> }> = [
  { y: 6, xs: [-4.5, -1.5, 1.5, 4.5] },
  { y: 3, xs: [-6, -3, 0, 3, 6] },
  { y: 0, xs: [-7.5, -4.5, -1.5, 1.5, 4.5, 7.5] },
  { y: -3, xs: [-6, -3, 0, 3, 6] },
  { y: -6, xs: [-4.5, -1.5, 1.5, 4.5] },
];

const EYE_CENTER_Y = 53;
const EYE_CENTER_X = 19;
const DOT_RADIUS = 1.15;
const DOT_SURFACE_OFFSET = 0.8;

// Scheitelprofil fuer die Kammlinie (Head-Space, x=0), leicht angehoben.
const CREST_PROFILE: ReadonlyArray<[number, number]> = [
  [-46, 76],
  [-40, 87.5],
  [-30, 101],
  [-20, 107.2],
  [-10, 109.1],
  [0, 109],
  [10, 107.3],
  [20, 104.1],
  [30, 99.6],
  [40, 86.1],
  [46, 74],
];
const CREST_TUBE_RADIUS = 1.4;

export interface TalosRig {
  head: any;
  neck: any;
  body: any;
  bot: any;
  topPart: any;
  handLeft: any;
  handRight: any;
  eyesGroup: any;
  crest: any;
  /** 0 = zu, 1 = offen. Skaliert die Augen-Reihen vertikal (Blinzeln). */
  setEyeOpen(open: number): void;
  /** Augenfarbe umschalten (Hex), z.B. Original-Weiss vs. Marken-Tuerkis. */
  setEyeColor(hex: number): void;
  dispose(): void;
}

interface DotRecord {
  mesh: any;
  base: any; // Basisposition (Head-Space)
  rowY: number; // Reihen-Offset relativ zur Augenmitte
}

export function buildTalosRig(THREE: any, splineScene: any): TalosRig | null {
  let head: any = null;
  let head2: any = null;
  let neck: any = null;
  let body: any = null;
  let bot: any = null;
  let topPart: any = null;
  let handLeft: any = null;
  let handRight: any = null;
  splineScene.traverse((o: any) => {
    if (o.name === "Head") head = o;
    if (o.name === "Head 2") head2 = o;
    if (o.name === "Neck") neck = o;
    if (o.name === "Body") body = o;
    if (o.name === "Bot") bot = o;
    if (o.name === "Top part") topPart = o;
    if (o.name === "Hand Instance") handRight = o;
    if (o.name === "Hand1") handLeft = o;
  });
  if (!head || !head2) return null;

  splineScene.updateMatrixWorld(true);

  const rigGroup = new THREE.Group();
  rigGroup.name = "talosRig";
  head.add(rigGroup);

  // --- Augen: Dots per Raycast auf die gekruemmte Visier-Flaeche setzen ---
  const eyesGroup = new THREE.Group();
  eyesGroup.name = "talosEyes";
  rigGroup.add(eyesGroup);

  const eyeMaterial = new THREE.MeshBasicMaterial({ color: TALOS_COLORS.eye });
  const dotGeometry = new THREE.CircleGeometry(DOT_RADIUS, 16);
  const raycaster = new THREE.Raycaster();
  const dots: DotRecord[] = [];

  for (const side of [-1, 1]) {
    for (const row of EYE_ROWS) {
      for (const dx of row.xs) {
        const x = side * EYE_CENTER_X + dx;
        const y = EYE_CENTER_Y + row.y;
        const originWorld = head.localToWorld(new THREE.Vector3(x, y, 200));
        const dirWorld = head
          .localToWorld(new THREE.Vector3(x, y, 100))
          .sub(originWorld)
          .normalize();
        raycaster.set(originWorld, dirWorld);
        const hits = raycaster.intersectObject(head2, false);
        if (!hits.length) continue;
        const pointLocal = head.worldToLocal(hits[0].point.clone());
        const normalWorld = hits[0].face.normal
          .clone()
          .transformDirection(head2.matrixWorld);
        const normalLocal = head
          .worldToLocal(hits[0].point.clone().add(normalWorld))
          .sub(pointLocal)
          .normalize();
        const dot = new THREE.Mesh(dotGeometry, eyeMaterial);
        dot.position
          .copy(pointLocal)
          .add(normalLocal.clone().multiplyScalar(DOT_SURFACE_OFFSET));
        dot.lookAt(dot.position.clone().add(normalLocal));
        eyesGroup.add(dot);
        dots.push({ mesh: dot, base: dot.position.clone(), rowY: row.y });
      }
    }
  }

  // --- Gold-Kammlinie: Tube entlang des vermessenen Scheitelprofils ---
  const crestCurve = new THREE.CatmullRomCurve3(
    CREST_PROFILE.map(([z, y]) => new THREE.Vector3(0, y, z))
  );
  const crestGeometry = new THREE.TubeGeometry(
    crestCurve,
    64,
    CREST_TUBE_RADIUS,
    10,
    false
  );
  const crestMaterial = new THREE.MeshStandardMaterial({
    color: TALOS_COLORS.crestGold,
    metalness: 0.85,
    roughness: 0.35,
  });
  const crest = new THREE.Mesh(crestGeometry, crestMaterial);
  crest.name = "talosCrest";
  rigGroup.add(crest);

  const setEyeOpen = (open: number) => {
    const clamped = Math.max(0, Math.min(1, open));
    for (const d of dots) {
      // Reihen kollabieren zur Augenmitte: geschlossen = flache Linie.
      d.mesh.position.y = d.base.y - d.rowY * (1 - clamped);
      const rowVisible = clamped > 0.15 || d.rowY === 0;
      d.mesh.visible = rowVisible;
      const s = 0.6 + 0.4 * clamped;
      d.mesh.scale.set(1, s, 1);
    }
  };

  const setEyeColor = (hex: number) => {
    eyeMaterial.color.setHex(hex);
  };

  const dispose = () => {
    head.remove(rigGroup);
    dotGeometry.dispose();
    crestGeometry.dispose();
    eyeMaterial.dispose();
    crestMaterial.dispose();
  };

  return {
    head,
    neck,
    body,
    bot,
    topPart,
    handLeft,
    handRight,
    eyesGroup,
    crest,
    setEyeOpen,
    setEyeColor,
    dispose,
  };
}
