/**
 * Durchgehende Morph-Buehne (Hero + 5 Szenen) — EINE Timeline wie das Original
 * (das at-Lottie ist EIN Precomp-Zug ohne Schnitt, deshalb gibt es dort nie
 * einen leeren Screen). Choreografie-Regeln aus der Messung (grammar.ts §0):
 * EIN Master-Easing, gerade 2-Punkt-Bahnen, Stagger, Rotation endet bei Ankunft.
 * Formations-Slots = vermessene Original-Kompositionen (at-scenes.ts).
 */

import { masterEase, makeRng } from "./grammar";
import { AT_SCENES, type SlotTuple } from "./at-scenes";

export interface PieceState {
  x: number;
  y: number;
  rot: number;
  scale: number;
  o: number;
}

/** Ein Flug-Segment: von a nach b im u-Fenster [u0,u1], dazwischen Master-Easing. */
export interface Seg {
  u0: number;
  u1: number;
  a: PieceState;
  b: PieceState;
}

export interface PieceTimeline {
  segs: Seg[];
}

/** Timeline abtasten: vor dem ersten Segment dessen a, zwischen Segmenten Halt auf b. */
export function sampleTimeline(tl: PieceTimeline, u: number): PieceState {
  const segs = tl.segs;
  if (u <= segs[0].u0) return segs[0].a;
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (u < s.u0) return segs[i - 1].b;
    if (u <= s.u1) {
      const e = masterEase((u - s.u0) / (s.u1 - s.u0));
      return {
        x: s.a.x + (s.b.x - s.a.x) * e,
        y: s.a.y + (s.b.y - s.a.y) * e,
        rot: s.a.rot + (s.b.rot - s.a.rot) * e,
        scale: s.a.scale + (s.b.scale - s.a.scale) * e,
        o: s.a.o + (s.b.o - s.a.o) * e,
      };
    }
  }
  return segs[segs.length - 1].b;
}

/** Timeline-Aufteilung: Hero belegt u [0,2), Szene s belegt [2+s, 3+s). */
export const U_HERO = 2;
export const U_TOTAL = U_HERO + AT_SCENES.length;

/** Eingabe: ein Pool-Teil (gerendertes Naturbruch-Fragment). */
export interface PoolPieceIn {
  /** Wortmarken-Home (Mitte relativ zum Wort-Zentrum); Klone erben vom Parent */
  cx: number;
  cy: number;
  /** natuerliche Render-Groesse des Elements in px */
  w: number;
  h: number;
  letter: number;
  /** true = Klon (erst beim Burst sichtbar) */
  clone: boolean;
}

export interface SceneLayout {
  /** Formation-Zentrum in Viewport-px (relativ zum Viewport-Zentrum) */
  cx: number;
  cy: number;
  /** Text auf der Gegenseite der Formation */
  textSide: "left" | "right";
}

export interface StagePlan {
  timelines: PieceTimeline[];
  scenes: SceneLayout[];
}

/**
 * Baut die komplette Choreografie fuer den Teile-Pool.
 * Koordinaten: px relativ zum Viewport-Zentrum (Buehnen-Origin = 50%/50%).
 */
export function buildStagePlan(
  pool: PoolPieceIn[],
  vp: { w: number; h: number },
  opts?: { seed?: number; narrow?: boolean }
): StagePlan {
  const rng = makeRng(opts?.seed ?? 53);
  const narrow = opts?.narrow ?? vp.w < 900;
  /** uniformer Massstab der vermessenen Kompositionen (1920x1080 -> Viewport) */
  const k = Math.min(vp.w / 1920, vp.h / 1080) * (narrow ? 1.15 : 1);
  /** Zerfall-Teilgroesse: einheitliches Band ~3% Viewportbreite (Delta-Punkt 2) */
  const scatterMajor = Math.max(26, Math.min(64, vp.w * 0.031));

  // ---- Szenen-Layouts (Formation-Zentrum + Text-Gegenseite) ----------------
  const scenes: SceneLayout[] = AT_SCENES.map((sc) => {
    const cxN = narrow ? 0.5 : sc.cx;
    return {
      cx: (cxN - 0.5) * vp.w,
      cy: (Math.min(0.56, Math.max(0.42, sc.cy)) - 0.5) * vp.h * (narrow ? 0.7 : 1),
      textSide: sc.cx < 0.5 ? "right" : "left",
    };
  });

  // ---- Zerfall-Ziele: ganzer Screen inkl. Raender (Delta-Punkt 3) ----------
  // Erste 129 = vermessene Einflug-Positionen von comp_1 (echte at-Verteilung),
  // Rest deterministisch ueber den ganzen Viewport inkl. Ueberhang.
  const scatterRaw: { x: number; y: number }[] = [];
  const src = AT_SCENES[0].pieces;
  for (let i = 0; i < pool.length; i++) {
    if (i < src.length) {
      scatterRaw.push({ x: (src[i][6] - 0.5) * vp.w * 1.1, y: (src[i][7] - 0.5) * vp.h * 1.1 });
    } else {
      scatterRaw.push({ x: (rng() - 0.5) * vp.w * 1.15, y: (rng() - 0.5) * vp.h * 1.15 });
    }
  }
  // Radiale Zuordnung: jedes Teil bekommt ein Zerfall-Ziel in SEINEM Winkel-Sektor
  // (sonst kreuzen die Bahnen das Zentrum und der Burst wird zum Knoten).
  const homeAng = pool.map((p, i) => ({
    i,
    ang: Math.atan2(p.cy + (rng() - 0.5) * 120, p.cx + (rng() - 0.5) * 160),
  })).sort((a, b) => a.ang - b.ang);
  const scatAng = scatterRaw.map((s, j) => ({ j, ang: Math.atan2(s.y, s.x) })).sort((a, b) => a.ang - b.ang);
  const scatter = new Array<{ x: number; y: number }>(pool.length);
  homeAng.forEach((h, k) => { scatter[h.i] = scatterRaw[scatAng[k].j]; });

  // ---- Slot-Zuordnung pro Szene: Teil-Klasse passend zum Slot-kind ---------
  const elongPool: number[] = [];
  const roundPool: number[] = [];
  pool.forEach((p, i) => {
    (Math.max(p.w / p.h, p.h / p.w) >= 1.5 ? elongPool : roundPool).push(i);
  });

  /** pro Szene: slotIdx je Pool-Teil oder -1 (Rand-Abgang) */
  const assignment: number[][] = AT_SCENES.map((sc) => {
    const res = new Array<number>(pool.length).fill(-1);
    const elongQ = [...elongPool];
    const roundQ = [...roundPool];
    const take = (pref: number[], alt: number[]) => (pref.length ? pref.shift()! : alt.length ? alt.shift()! : -1);
    sc.pieces.forEach((slot, sIdx) => {
      const kind = slot[5];
      let pi: number;
      if (kind === 2) pi = take(roundQ, elongQ);       // dot -> rundliche Teile
      else if (kind === 3) pi = sIdx % 2 ? take(roundQ, elongQ) : take(elongQ, roundQ); // blob -> gemischt
      else pi = take(elongQ, roundQ);                  // bar/curve -> laengliche
      if (pi >= 0) res[pi] = sIdx;
    });
    return res;
  });

  /** Slot -> Zielzustand in Buehnen-px */
  function slotState(slot: SlotTuple, scene: SceneLayout, sceneN: { cx: number; cy: number }, piece: PoolPieceIn): PieceState {
    const [sx, sy, srot, sw, sh] = slot;
    const x = scene.cx + (sx - sceneN.cx) * 1920 * k;
    const y = scene.cy + (sy - sceneN.cy) * 1080 * k;
    const slotMajor = Math.max(sw, sh) * k;
    const pieceMajor = Math.max(piece.w, piece.h);
    // Achs-Ausrichtung: Hoch-/Querformat von Slot und Teil angleichen
    const mismatch = (sw >= sh) !== (piece.w >= piece.h);
    return { x, y, rot: srot + (mismatch ? 90 : 0), scale: slotMajor / pieceMajor, o: 1 };
  }

  /** Rand-Abgang: von der letzten Position nach aussen ueber die Kante */
  function exitState(from: PieceState, scene: SceneLayout): PieceState {
    let dx = from.x - scene.cx, dy = from.y - scene.cy;
    const len = Math.hypot(dx, dy);
    if (len < 1) { const a = rng() * Math.PI * 2; dx = Math.cos(a); dy = Math.sin(a); }
    else { dx /= len; dy /= len; }
    const reach = Math.hypot(vp.w, vp.h) * (0.62 + rng() * 0.2);
    return { ...from, x: from.x + dx * reach, y: from.y + dy * reach, rot: from.rot + (rng() - 0.5) * 60 };
  }

  // ---- Hero-Kontraktion (gemessene Grammatik, letter-basiert) --------------
  const letters = new Map<number, { cx: number; cy: number }>();
  for (const p of pool) {
    if (p.clone) continue;
    const cur = letters.get(p.letter);
    if (!cur) letters.set(p.letter, { cx: p.cx, cy: p.cy });
    else { cur.cx = (cur.cx + p.cx) / 2; cur.cy = (cur.cy + p.cy) / 2; }
  }
  const fontS = Math.max(...pool.filter((p) => !p.clone).map((p) => Math.max(p.w, p.h))) / 135;
  const contract = new Map<number, { kx: number; ky: number }>();
  for (const [id, c] of letters) {
    // Gemessen: flach ±20px vertikal, 20..50px horizontal (auf 135px-Lettern)
    const ky = c.cy < 0 ? 20 * fontS : -20 * fontS;
    const kx = -Math.sign(c.cx) * Math.min(50 * fontS, Math.max(20 * fontS, Math.abs(c.cx) * 0.11));
    contract.set(id, { kx, ky });
  }

  // ---- Timeline pro Teil ----------------------------------------------------
  const U_REST = 0.22, U_CON = 0.5, U_SCAT = 1.3;
  const timelines: PieceTimeline[] = pool.map((p, i) => {
    const segs: Seg[] = [];
    const home: PieceState = { x: p.cx, y: p.cy, rot: 0, scale: 1, o: p.clone ? 0 : 1 };
    const con = contract.get(p.letter) ?? { kx: 0, ky: 0 };
    const conState: PieceState = { ...home, x: p.cx + con.kx, y: p.cy + con.ky };
    const scatMajor = scatterMajor * (0.85 + rng() * 0.3);
    const scatState: PieceState = {
      x: scatter[i].x,
      y: scatter[i].y,
      rot: (rng() < 0.55 ? 1 : 0) * (rng() < 0.5 ? -1 : 1) * (22 + rng() * 95),
      scale: scatMajor / Math.max(p.w, p.h),
      o: 1,
    };

    if (!p.clone) {
      segs.push({ u0: U_REST, u1: U_CON, a: home, b: conState });
      // Burst: gestaffelt loesen, gerade Bahn zum Zerfall-Ziel
      const b0 = U_CON + rng() * 0.18;
      segs.push({ u0: b0, u1: Math.min(U_SCAT, b0 + 0.62), a: conState, b: scatState });
    } else {
      // Klon: haengt unsichtbar am Parent-Home, wird beim Burst sichtbar
      // "geboren" (Vermehrung sichtbar, Delta-Punkt 3) und fliegt an seinen Platz.
      // Kurze Einblend-Rampe am Anfang des Flugs — lange Fades = Geister-Teile.
      const ua = U_CON + 0.06 + rng() * 0.34;
      const u1 = Math.min(U_SCAT + 0.15, ua + 0.5);
      const birth: PieceState = { ...conState, o: 0, scale: scatState.scale * 0.6 };
      const lerp = (a: PieceState, b: PieceState, t: number): PieceState => ({
        x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t,
        rot: a.rot + (b.rot - a.rot) * t, scale: a.scale + (b.scale - a.scale) * t, o: 1,
      });
      const mid = lerp(birth, scatState, 0.14);
      segs.push({ u0: ua, u1: ua + (u1 - ua) * 0.14, a: birth, b: mid });
      segs.push({ u0: ua + (u1 - ua) * 0.14, u1, a: mid, b: scatState });
    }

    // Szenen: direkter Morph Slot -> Slot, ueberzaehlige ueber den Rand
    let prev: PieceState = scatState;
    AT_SCENES.forEach((sc, s) => {
      const us = U_HERO + s;
      const sIdx = assignment[s][i];
      const t0 = 0.08 + rng() * 0.21;   // gemessene Starts 2..7/24
      const t1 = 0.67 + rng() * 0.205;  // gemessene Ankuenfte 16..21/24
      let target: PieceState;
      if (sIdx >= 0) {
        target = slotState(sc.pieces[sIdx], scenes[s], sc, p);
        // Ziel-Rotation auf die naechste Aequivalenz zur Vorposition normieren
        // (sonst akkumulieren Szene fuer Szene unfreiwillige Extra-Umdrehungen)
        let r = target.rot;
        while (r - prev.rot > 180) r -= 360;
        while (r - prev.rot < -180) r += 360;
        target = { ...target, rot: r };
        // Transit-Rotation: endet exakt bei Ankunft; ~40% drehen eine Extra-Runde
        if (rng() < 0.4) target = { ...target, rot: target.rot + (rng() < 0.5 ? -360 : 360) };
      } else {
        target = exitState(prev, scenes[s]);
      }
      segs.push({ u0: us + t0, u1: us + t1, a: prev, b: target });
      prev = target;
    });

    return { segs };
  });

  return { timelines, scenes };
}
