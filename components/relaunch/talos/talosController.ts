// talosController — schlanke, render-freie Bruecke zwischen der scrollenden
// Text-Huelle (TalosPage) und der 3D-Buehne (TalosStage). Kein React-Context,
// kein Re-Render: die Page schreibt Felder in `talosBus`, die Buehne liest sie
// im useFrame. So bleibt die Scroll-Regie fluessig (nur ein Objekt, kein State-
// Roundtrip). Modell-Fakten (Node-Pivots, Weltskala 0.008) sind aus dem echten
// GLB vermessen (assets-src/talos, gltf-transform inspect), nicht geraten.

export type Vec3 = [number, number, number];

export interface TalosBus {
  /** Ziel-Scrollfortschritt 0..1 ueber die ganze Seite (Page setzt ihn). */
  progress: number;
  /** Cursor normalisiert -1..1 fuer die dezente Kopf-Blickfolge (Desktop). */
  pointerX: number;
  pointerY: number;
  /** Aktive Assistenten-Frage 0..4, -1 = keine (Kapitel 5 Kopfneigung). */
  activeQuestion: number;
  /** prefers-reduced-motion: statische Posen, kein Idle. */
  reduced: boolean;
  /** Buehne meldet, sobald das Modell sichtbar eingeblendet ist. */
  ready: boolean;
  /** invalidate der Buehne (frameloop="demand"); Page ruft es bei Scroll/Move. */
  invalidate: (() => void) | null;
}

export const talosBus: TalosBus = {
  progress: 0,
  pointerX: 0,
  pointerY: 0,
  activeQuestion: -1,
  reduced: false,
  ready: false,
  invalidate: null,
};

// ---- Keyframe-Regie (ein Eintrag pro Kapitel-Anker) ------------------------
// Kamera schaut aus +z auf das Modell (Front = +z, wie die Original-Kamera bei
// (0, 2.5, 3.6)). Modell: Fuesse ~y=-1, Kopf ~y=2.7, Schultern y=1.8, Hals/Kopf-
// Pivot (0, 2.2, 0.2). Freundlichkeits-Regie (Thomas 17.07.): Kamera auf/leicht
// ueber Augenhoehe, nie von oben herab auf den Betrachter; sanfte Yaws.
export interface Keyframe {
  p: number;
  cam: Vec3;
  target: Vec3;
  yaw: number; // Modell-Drehung um Y (rad), sanft
  tilt: number; // Kopfneigung nach vorn (rad), freundlich zugewandt
  mood: Vec3; // Licht-/Backdrop-Stimmung (linear RGB 0..1)
  light: number; // Key-Light-Intensitaet
}

// Stimmungsfarben: warm-bronze (Hero/Team), kuehl-klar (Fundament), Tageslicht-
// Wanderung (Arbeitstag), Navy-Abend (Start).
export const KEYFRAMES: Keyframe[] = [
  // 0 HERO — frontal, freundlich, Gruss (Arm-Regie separat), warm. Target
  // nach links versetzt -> Talos steht rechts, die Headline-Spalte bleibt frei.
  { p: 0.0, cam: [0.0, 2.0, 5.4], target: [-0.9, 1.4, 0], yaw: 0.0, tilt: 0.02, mood: [0.86, 0.62, 0.4], light: 1.15 },
  // 1 WER IST TALOS — naeher, dreht sich leicht, zeigt auf sich.
  { p: 0.15, cam: [-1.5, 2.1, 4.1], target: [-0.5, 1.55, 0], yaw: -0.2, tilt: 0.06, mood: [0.82, 0.66, 0.5], light: 1.15 },
  // 2 FUNDAMENT — tritt zur Seite, Kamera gibt Raum fuer die Karten, kuehl-klar.
  { p: 0.3, cam: [2.0, 1.95, 4.6], target: [-0.5, 1.2, 0], yaw: 0.24, tilt: 0.0, mood: [0.6, 0.72, 0.82], light: 1.05 },
  // 3a FAEHIGKEIT Schreiben — Profil links, warm.
  { p: 0.44, cam: [-2.5, 1.95, 3.7], target: [0, 1.6, 0], yaw: -0.5, tilt: 0.07, mood: [0.84, 0.6, 0.42], light: 1.2 },
  // 3b FAEHIGKEIT Empfang — Profil rechts, warm.
  { p: 0.53, cam: [2.5, 1.95, 3.7], target: [0, 1.6, 0], yaw: 0.5, tilt: 0.07, mood: [0.84, 0.62, 0.44], light: 1.2 },
  // 4 ARBEITSTAG — weiter weg, Talos im Hintergrund; Licht wandert Morgen->Nacht.
  { p: 0.6, cam: [0.0, 1.75, 6.2], target: [0, 1.05, 0], yaw: -0.06, tilt: 0.0, mood: [0.58, 0.68, 0.82], light: 0.95 }, // Morgen kuehl
  { p: 0.66, cam: [0.0, 1.75, 6.2], target: [0, 1.05, 0], yaw: -0.03, tilt: 0.0, mood: [0.96, 0.92, 0.84], light: 1.35 }, // Mittag hell
  { p: 0.72, cam: [0.0, 1.75, 6.2], target: [0, 1.05, 0], yaw: 0.03, tilt: 0.0, mood: [0.86, 0.56, 0.4], light: 1.0 }, // Abend warm
  // 5 FRAG TALOS — nah, Kopf zur aktiven Frage geneigt, warm-weich.
  { p: 0.82, cam: [-0.7, 2.2, 3.5], target: [0, 2.0, 0], yaw: -0.12, tilt: 0.05, mood: [0.88, 0.68, 0.48], light: 1.2 },
  // 6 START — verbeugt sich leicht/winkt, Navy-Abend.
  { p: 0.95, cam: [0.0, 1.8, 5.2], target: [0, 1.2, 0], yaw: 0.0, tilt: 0.12, mood: [0.3, 0.36, 0.52], light: 1.0 },
  { p: 1.0, cam: [0.0, 1.8, 5.2], target: [0, 1.2, 0], yaw: 0.0, tilt: 0.12, mood: [0.28, 0.34, 0.5], light: 1.0 },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function lerp3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

// Sanfte Ease fuer die Interpolation zwischen zwei Ankern (masterEase-Charakter).
function ease(t: number): number {
  // cubic-bezier(0.6,0,0.4,1)-Naeherung ueber smoothersteppiges Ease.
  return t * t * (3 - 2 * t);
}

/** Interpolierter Kamera-/Posen-Zustand fuer einen Fortschritt p (0..1). */
export function sampleKeyframes(p: number): Keyframe {
  const x = p < 0 ? 0 : p > 1 ? 1 : p;
  const ks = KEYFRAMES;
  if (x <= ks[0].p) return ks[0];
  if (x >= ks[ks.length - 1].p) return ks[ks.length - 1];
  let i = 0;
  while (i < ks.length - 1 && ks[i + 1].p < x) i++;
  const a = ks[i];
  const b = ks[i + 1];
  const span = b.p - a.p || 1;
  const t = ease((x - a.p) / span);
  return {
    p: x,
    cam: lerp3(a.cam, b.cam, t),
    target: lerp3(a.target, b.target, t),
    yaw: lerp(a.yaw, b.yaw, t),
    tilt: lerp(a.tilt, b.tilt, t),
    mood: lerp3(a.mood, b.mood, t),
    light: lerp(a.light, b.light, t),
  };
}
