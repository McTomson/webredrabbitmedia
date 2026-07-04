/**
 * Morph-Grammatik — gemessene all-turtles-Werte (docs/MORPH_SYSTEM_BAUPLAN.md §0).
 * KEINE Physik: Keyframe-Choreografie + EIN Easing.
 */

// Master-Easing cubic-bezier(0.6, 0, 0.4, 1) — 259/260 gemessene Keyframes.
// Analytische Auswertung der Bezier-Kurve (x -> t via Newton, dann y(t)).
export function masterEase(x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const p1x = 0.6, p2x = 0.4; // p1y=0, p2y=1
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  let t = x;
  for (let i = 0; i < 6; i++) {
    const xt = ((ax * t + bx) * t + cx) * t - x;
    const dx = (3 * ax * t + 2 * bx) * t + cx;
    if (Math.abs(dx) < 1e-6) break;
    t -= xt / dx;
  }
  // y(t) mit p1y=0, p2y=1: y = 3(1-t)t^2*1... ausgeschrieben:
  const mt = 1 - t;
  return 3 * mt * t * t * 1 + t * t * t; // p1y=0-Term entfaellt
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Deterministischer Zufall (LCG) — Choreo bleibt bei jedem Render identisch. */
export function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export interface Keyframe {
  /** Zeit im normalisierten Track-Fortschritt 0..1 */
  t: number;
  x: number;
  y: number;
  rot: number;
  scale: number;
}

/** Wert einer Keyframe-Spur bei Fortschritt p (Master-Easing zwischen den Frames). */
export function sample(kfs: Keyframe[], p: number): Keyframe {
  if (p <= kfs[0].t) return kfs[0];
  const last = kfs[kfs.length - 1];
  if (p >= last.t) return last;
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i], b = kfs[i + 1];
    if (p >= a.t && p <= b.t) {
      const u = masterEase((p - a.t) / (b.t - a.t));
      return {
        t: p,
        x: a.x + (b.x - a.x) * u,
        y: a.y + (b.y - a.y) * u,
        rot: a.rot + (b.rot - a.rot) * u,
        scale: a.scale + (b.scale - a.scale) * u,
      };
    }
  }
  return last;
}

export interface PieceHome {
  /** Mitte des Teils relativ zum Wortmarken-Zentrum */
  cx: number;
  cy: number;
  w: number;
  h: number;
  /** Index des Buchstabens (Zeile*10+Spalte) — Teile eines Buchstabens teilen G1-Keyframes */
  letter: number;
}

export interface HeroChoreo {
  /** G1-Spur (ganzer Buchstabe) — Kontraktion + Burst-Beginn */
  letterTrack: Keyframe[];
  /** G2-Spur (Einzelteil) — ab Split individuell */
  pieceTrack: Keyframe[];
  /** ab welchem Fortschritt das Teil der pieceTrack folgt (Split-Punkt) */
  splitAt: number;
}

/**
 * Hero-Choreografie nach gemessener Grammatik (comp_0 + Uebergang comp_1):
 * - Ruhe bis P_REST, Kontraktion P_REST..P_CONTRACT (KEINE Rotation, obere Zeile
 *   +dy runter / untere -dy rauf (fixer Betrag), horizontal 20..50px-Aequivalent
 *   Richtung Zentrum, aussen mehr).
 * - Burst P_CONTRACT..P_EXIT: gerade Linie radial raus, nur ~40% der Buchstaben
 *   rotieren (22..73 Grad), Distanz individuell.
 * - Split bei P_SPLIT: Teile uebernehmen mit eigener Rotation (Median ~78 Grad)
 *   und fliegen weiter/schneller wenn klein (gemessen: weiter = schneller,
 *   Dauer konstant) bis aus dem Bild.
 * Frame-Anker aus der Messung: rest=2/18, contract=5/18, exit=15/18 der Hero-Phase.
 */
export function buildHeroChoreo(
  pieces: PieceHome[],
  opts: { wordW: number; wordH: number; viewportW: number; viewportH: number; fontPx: number; seed?: number }
): HeroChoreo[] {
  const rng = makeRng(opts.seed ?? 17);
  const S = opts.fontPx / 135; // Messwerte beziehen sich auf ~135px-Lettern bei 1920
  const CONTRACT_DY = 20 * S * 2.2;          // Zeilenabstand ist bei uns enger als bei at -> etwas staerker fuer gleiche Wirkung
  const DX_MIN = 20 * S, DX_MAX = 50 * S;
  const P_REST = 2 / 18, P_CONTRACT = 5 / 18, P_EXIT = 15 / 18;
  const P_SPLIT = 0.52;                       // Teile brechen mitten im Burst (Buchstaben loesen sich ERST ganz)
  const exitBase = Math.hypot(opts.viewportW, opts.viewportH) * 0.5;

  // G1: ein Plan pro BUCHSTABE (alle Teile eines Buchstabens teilen ihn)
  const letters = new Map<number, { cx: number; cy: number }>();
  for (const p of pieces) {
    const cur = letters.get(p.letter);
    if (!cur) letters.set(p.letter, { cx: p.cx, cy: p.cy });
    else { cur.cx = (cur.cx + p.cx) / 2; cur.cy = (cur.cy + p.cy) / 2; }
  }
  const letterPlan = new Map<number, { kx: number; ky: number; ex: number; ey: number; erot: number }>();
  for (const [id, c] of letters) {
    // Kontraktion: vertikal fixer Betrag zur Mitte, horizontal proportional gedeckelt
    const ky = c.cy < 0 ? CONTRACT_DY : -CONTRACT_DY;
    const kx = -Math.sign(c.cx) * Math.min(DX_MAX, Math.max(DX_MIN, Math.abs(c.cx) * 0.155));
    // Burst: radial raus mit Streuung; nur ~40% rotieren (gemessen 7/17, ±22..73 Grad)
    const ang = Math.atan2(c.cy + (rng() - 0.5) * opts.wordH, c.cx + (rng() - 0.5) * opts.wordW * 0.3);
    const dist = exitBase * (0.35 + rng() * 0.5);
    const rotates = rng() < 0.41;
    const erot = rotates ? (rng() < 0.5 ? -1 : 1) * (22 + rng() * 51) : 0;
    letterPlan.set(id, { kx, ky, ex: Math.cos(ang) * dist, ey: Math.sin(ang) * dist, erot });
  }

  const maxSize = Math.max(...pieces.map((p) => Math.max(p.w, p.h)));
  return pieces.map((p) => {
    const L = letterPlan.get(p.letter)!;
    const letterTrack: Keyframe[] = [
      { t: 0, x: 0, y: 0, rot: 0, scale: 1 },
      { t: P_REST, x: 0, y: 0, rot: 0, scale: 1 },
      { t: P_CONTRACT, x: L.kx, y: L.ky, rot: 0, scale: 1 },
      { t: P_EXIT, x: L.kx + L.ex, y: L.ky + L.ey, rot: L.erot, scale: 1 },
      { t: 1, x: L.kx + L.ex * 1.15, y: L.ky + L.ey * 1.15, rot: L.erot, scale: 1 },
    ];
    // G2: Teil uebernimmt am Split-Punkt und fliegt eigenstaendig weiter.
    // klein = weiter (gemessen: Distanz variiert, Dauer konstant -> weiter = schneller)
    const sizeF = 1 - (Math.max(p.w, p.h) / maxSize) * 0.45;
    const splitState = sample(letterTrack, P_SPLIT);
    const ang = Math.atan2(p.cy + splitState.y, p.cx + splitState.x) + (rng() - 0.5) * 0.9;
    const dist = exitBase * (0.5 + rng() * 0.7) * (0.7 + sizeF * 0.8);
    const rot = splitState.rot + (rng() < 0.5 ? -1 : 1) * (40 + rng() * 110); // Median ~78, endet bei Ankunft
    const pieceTrack: Keyframe[] = [
      { t: P_SPLIT, x: splitState.x, y: splitState.y, rot: splitState.rot, scale: 1 },
      { t: 1, x: splitState.x + Math.cos(ang) * dist, y: splitState.y + Math.sin(ang) * dist, rot, scale: 1 },
    ];
    return { letterTrack, pieceTrack, splitAt: P_SPLIT };
  });
}
