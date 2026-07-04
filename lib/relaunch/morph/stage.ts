/**
 * Durchgehende Morph-Buehne (Hero + 5 Szenen) — EINE Timeline wie das Original
 * (das at-Lottie ist EIN Precomp-Zug ohne Schnitt, deshalb gibt es dort nie
 * einen leeren Screen). Choreografie-Regeln aus der Messung (grammar.ts §0):
 * EIN Master-Easing, gerade 2-Punkt-Bahnen, Stagger, Rotation endet bei Ankunft.
 * Formations-Slots = vermessene Original-Kompositionen (at-scenes.ts).
 */

import { masterEase, makeRng } from "./grammar";
import { AT_SCENES, type SlotTuple } from "./at-scenes";
import atShapes from "./at-shapes-comp1.json";

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

/** Timeline-Aufteilung: Hero belegt u [0,U_HERO), Szene s belegt [U_HERO+s, +1).
 *  1.7 statt 2.0: die Zerfall-Haltephase war gegen das Original-Video zu lang. */
export const U_HERO = 1.7;
export const U_TOTAL = U_HERO + AT_SCENES.length;

/** u-Fenster, auf das die Comp-Anzeige (0..1) fuer Szene 0 linear gemappt wird. */
const U_B0 = 0.45, U_B1 = 2.3;

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
  /** Index in atShapes.pieces (Original-Teilform); Wordmark-Teile: undefined */
  at?: number;
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
  /** Kamera-Fahrt (Szene 0): u -> Zoom/Pan des at-Teile-Wrappers. */
  camera: (u: number) => { k: number; tx: number; ty: number };
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
  const diag = Math.hypot(vp.w, vp.h);

  // ---- Szenen-Layouts (Formation-Zentrum + Text-Gegenseite) ----------------
  const scenes: SceneLayout[] = AT_SCENES.map((sc) => {
    const cxN = narrow ? 0.5 : sc.cx;
    return {
      cx: (cxN - 0.5) * vp.w,
      cy: (Math.min(0.56, Math.max(0.42, sc.cy)) - 0.5) * vp.h * (narrow ? 0.7 : 1),
      textSide: sc.cx < 0.5 ? "right" : "left",
    };
  });

  // ---- R2 Nicht-Beruehren: pro Szene Ziel-Groesse je Slot vorberechnen ------
  // dNear = Distanz zum naechsten anderen Slot-Zentrum (Canvas-px, VOR k).
  // slotMajor = min(max(sw,sh), dNear*0.98), global gedeckelt auf 1.15*Median,
  // Untergrenze 45% des urspruenglichen slotMajor -> Weiss fliesst durch.
  const sceneSlotMajor: number[][] = AT_SCENES.map((sc) => {
    const centers = sc.pieces.map((p) => ({ x: p[0] * 1920, y: p[1] * 1080 }));
    const raw = sc.pieces.map((p, i) => {
      const orig = Math.max(p[3], p[4]);
      let dNear = Infinity;
      for (let j = 0; j < centers.length; j++) {
        if (j === i) continue;
        const d = Math.hypot(centers[i].x - centers[j].x, centers[i].y - centers[j].y);
        if (d < dNear) dNear = d;
      }
      return Math.min(orig, (Number.isFinite(dNear) ? dNear : orig) * 0.98);
    });
    const sorted = [...raw].sort((a, b) => a - b);
    const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
    const cap = median * 1.3;
    return sc.pieces.map((p, i) => {
      const orig = Math.max(p[3], p[4]);
      const capped = Math.min(raw[i], cap);
      // Untergrenze 62%: Browser-Befund 04.07. — bei 45% verlieren dicht
      // vermessene Formationen (Birne, Dokument) Kontur und Substanz.
      return Math.max(capped, orig * 0.62);
    });
  });

  // ---- R1 Rand-Geometrie: Punkte auf/ueber dem Viewport-Rand ----------------
  const halfW = vp.w / 2, halfH = vp.h / 2;
  /** Punkt auf dem Ray (dx,dy) ab Zentrum, knapp UEBER den Rand (Ueberstand als
   *  Bruchteil der Diagonale). */
  function edgePoint(dx: number, dy: number, overshoot: number): { x: number; y: number } {
    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;
    const tx = Math.abs(dx) > 1e-6 ? halfW / Math.abs(dx) : Infinity;
    const ty = Math.abs(dy) > 1e-6 ? halfH / Math.abs(dy) : Infinity;
    const t = Math.min(tx, ty) + overshoot * diag;
    return { x: dx * t, y: dy * t };
  }
  /** Rand-Punkt auf der dem Ziel naechsten Seite, +10% Ueberstand, mit
   *  rng-Streuung entlang der Kante. */
  function edgeStartForSlot(t: PieceState): { x: number; y: number } {
    const dR = halfW - t.x, dL = t.x + halfW, dB = halfH - t.y, dT = t.y + halfH;
    const m = Math.min(dR, dL, dB, dT);
    const jV = (rng() - 0.5) * vp.h * 0.3;
    const jH = (rng() - 0.5) * vp.w * 0.3;
    if (m === dR) return { x: halfW * 1.1, y: t.y + jV };
    if (m === dL) return { x: -halfW * 1.1, y: t.y + jV };
    if (m === dB) return { x: t.x + jH, y: halfH * 1.1 };
    return { x: t.x + jH, y: -halfH * 1.1 };
  }
  /** Liegt der Punkt im Bild, auf mind. 8% ausserhalb des Randes projizieren. */
  function projectOutside(x: number, y: number): { x: number; y: number } {
    if (Math.abs(x) < halfW && Math.abs(y) < halfH) return edgePoint(x, y, 0.08);
    return { x, y };
  }

  // ---- Szene-0-Anker + Canvas-norm -> Buehnen-px (Original-Teilformen) ------
  const A = AT_SCENES[0];
  const X0 = (xN: number) => scenes[0].cx + (xN - A.cx) * 1920 * k;
  const Y0 = (yN: number) => scenes[0].cy + (yN - A.cy) * 1080 * k;

  // ---- Kamera-Fahrt der Comp-Anzeige (atShapes.camera) auf u-Fenster gemappt -
  const camN = atShapes.camera;
  const cref = camN[camN.length - 1];
  const tuCam = (t: number) => U_B0 + t * (U_B1 - U_B0);
  const kView = k;
  const camera = (u: number): { k: number; tx: number; ty: number } => {
    const tu0 = tuCam(camN[0].t), tu1 = tuCam(cref.t);
    let cx: number, cy: number, cs: number;
    if (u <= tu0) { cx = camN[0].x; cy = camN[0].y; cs = camN[0].s; }
    else if (u >= tu1) { cx = cref.x; cy = cref.y; cs = cref.s; }
    else {
      const e = masterEase((u - tu0) / (tu1 - tu0));
      cx = camN[0].x + (cref.x - camN[0].x) * e;
      cy = camN[0].y + (cref.y - camN[0].y) * e;
      cs = camN[0].s + (cref.s - camN[0].s) * e;
    }
    const ck = cs / cref.s;
    const tx = scenes[0].cx * (1 - ck) + (cx - ck * cref.x - A.cx * (1 - ck)) * 1920 * kView;
    const ty = scenes[0].cy * (1 - ck) + (cy - ck * cref.y - A.cy * (1 - ck)) * 1080 * kView;
    return { k: ck, tx, ty };
  };

  // ---- Slot-Zuordnung pro Szene: Teil-Klasse passend zum Slot-kind ---------
  const elongPool: number[] = [];
  const roundPool: number[] = [];
  pool.forEach((p, i) => {
    if (p.at == null) return; // Wortmarken-Teile fliegen ab, belegen keine Slots
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

  /** Slot -> Zielzustand in Buehnen-px. slotMajorPx = R2-vorberechnete Groesse. */
  function slotState(slot: SlotTuple, scene: SceneLayout, sceneN: { cx: number; cy: number }, piece: PoolPieceIn, slotMajorPx: number): PieceState {
    const [sx, sy, srot, sw, sh] = slot;
    const x = scene.cx + (sx - sceneN.cx) * 1920 * k;
    const y = scene.cy + (sy - sceneN.cy) * 1080 * k;
    const slotMajor = slotMajorPx * k;
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
  // 18 Wortmarken-Teile: Ruhe -> Kontraktion -> Burst -> RAUS ueber den Rand
  // (nehmen an keiner Formations-Szene teil). Alle at-Teile: Szene 0 spielt die
  // extrahierten all-turtles-Original-Teilformen 1:1 ab (Entry -> Slot; der
  // Kamera-Zoom blendet sie anfangs aus), danach Formations-Szenen 1-4.
  const U_REST = 0.22, U_CON = 0.5;
  const timelines: PieceTimeline[] = pool.map((p, i) => {
    const segs: Seg[] = [];

    // ---- Wortmarken-Teil: Ruhe -> Kontraktion -> Burst -> RAUS ---------------
    if (!p.clone && p.at == null) {
      const home: PieceState = { x: p.cx, y: p.cy, rot: 0, scale: 1, o: 1 };
      const con = contract.get(p.letter) ?? { kx: 0, ky: 0 };
      const conState: PieceState = { ...home, x: p.cx + con.kx, y: p.cy + con.ky };
      segs.push({ u0: U_REST, u1: U_CON, a: home, b: conState });
      let bax = conState.x, bay = conState.y;
      if (Math.hypot(bax, bay) < 1) { const a = rng() * Math.PI * 2; bax = Math.cos(a); bay = Math.sin(a); }
      const bAng = Math.atan2(bay, bax);
      const dxN = Math.cos(bAng), dyN = Math.sin(bAng);
      const tEdge = Math.min(
        Math.abs(dxN) > 1e-6 ? halfW / Math.abs(dxN) : Infinity,
        Math.abs(dyN) > 1e-6 ? halfH / Math.abs(dyN) : Infinity
      );
      const bDist = tEdge * (0.55 + rng() * 0.35);
      const burstRot = (rng() < 0.55 ? 1 : 0) * (rng() < 0.5 ? -1 : 1) * (22 + rng() * 95);
      const b0 = U_CON + rng() * 0.15;
      const burstEnd = Math.min(1.05, b0 + 0.5);
      const burstExit: PieceState = { x: dxN * bDist, y: dyN * bDist, rot: burstRot, scale: 1, o: 1 };
      segs.push({ u0: b0, u1: burstEnd, a: conState, b: burstExit });
      // Weiterflug RAUS: radialer Ray der Burst-Position, knapp ueber den Rand.
      let ex = burstExit.x, ey = burstExit.y;
      if (Math.hypot(ex, ey) < 1) { const a = rng() * Math.PI * 2; ex = Math.cos(a); ey = Math.sin(a); }
      const out = edgePoint(ex, ey, 0.12);
      const exit: PieceState = { x: out.x, y: out.y, rot: burstRot + (rng() - 0.5) * 40, scale: burstExit.scale, o: 1 };
      segs.push({ u0: burstEnd + 0.06, u1: 1.45 + rng() * 0.35, a: burstExit, b: exit });
      return { segs };
    }

    // ---- at-Teil: Szene 0 = Original-Teilform 1:1 ----------------------------
    let prev: PieceState | null = null;
    let appeared = false;
    const jp = p.at != null ? atShapes.pieces[p.at] : null;
    if (jp && !jp.hidden) {
      const slotScale = (jp.w * Math.abs(jp.sx) * k) / p.w;
      const slot: PieceState = { x: X0(jp.x), y: Y0(jp.y), rot: jp.rot, scale: slotScale, o: 1 };
      const entry: PieceState = { x: X0(jp.fromX), y: Y0(jp.fromY), rot: jp.fromRot, scale: slotScale * jp.fromScale, o: 1 };
      const fs = U_B0 + jp.entryT * (U_B1 - U_B0);
      const ar = U_B0 + jp.arriveT * (U_B1 - U_B0);
      // Unsichtbar bis zum eigenen Flugbeginn (R1: der Original-Trick —
      // Teile stehen ab Comp-Start sichtbar am Entry — funktioniert nur mit
      // dem verdeckenden comp_0-Burst; bei uns erscheinen sie, WAEHREND sie
      // sich bewegen, gestaffelt nach Original-entryT).
      segs.push({ u0: 0, u1: fs, a: { ...entry, o: 0 }, b: { ...entry, o: 0 } });
      segs.push({ u0: fs, u1: ar, a: entry, b: slot });
      prev = slot;
      appeared = true;
    }

    // ---- Szenen 1-4: bestehende Logik (Slot->Slot direkt, ueberzaehlige ----
    // ueber den Rand). Erste Erscheinung einer Szene = Einflug von aussen. ----
    for (let s = 1; s < AT_SCENES.length; s++) {
      const sc = AT_SCENES[s];
      const us = U_HERO + s;
      const sIdx = assignment[s][i];
      const t0 = 0.08 + rng() * 0.21;   // gemessene Starts 2..7/24
      const t1 = 0.67 + rng() * 0.205;  // gemessene Ankuenfte 16..21/24
      if (sIdx >= 0) {
        let target = slotState(sc.pieces[sIdx], scenes[s], sc, p, sceneSlotMajor[s][sIdx]);
        if (!appeared || !prev) {
          // erste Erscheinung: von einem Rand-Punkt einfliegen, snap auf sichtbar
          const st = edgeStartForSlot(target);
          const startPt: PieceState = { x: st.x, y: st.y, rot: target.rot + (rng() - 0.5) * 60, scale: target.scale, o: 1 };
          segs.push({ u0: 0, u1: us + t0, a: { ...startPt, o: 0 }, b: { ...startPt, o: 0 } });
          segs.push({ u0: us + t0, u1: us + t1, a: startPt, b: target });
          appeared = true;
        } else {
          // Ziel-Rotation auf die naechste Aequivalenz zur Vorposition normieren
          let r = target.rot;
          while (r - prev.rot > 180) r -= 360;
          while (r - prev.rot < -180) r += 360;
          target = { ...target, rot: r };
          // Transit-Rotation: endet exakt bei Ankunft; ~40% drehen eine Extra-Runde
          if (rng() < 0.4) target = { ...target, rot: target.rot + (rng() < 0.5 ? -360 : 360) };
          segs.push({ u0: us + t0, u1: us + t1, a: prev, b: target });
        }
        prev = target;
      } else if (appeared && prev) {
        // ueberzaehlig -> ueber den Rand abgehen
        const target = exitState(prev, scenes[s]);
        segs.push({ u0: us + t0, u1: us + t1, a: prev, b: target });
        prev = target;
      }
    }

    // Fail-closed: Teil ohne jede Zuordnung braucht ein (unsichtbares) Segment,
    // damit sampleTimeline nie auf ein leeres segs[] laeuft.
    if (!segs.length) {
      const off: PieceState = { x: halfW * 1.3, y: halfH * 1.3, rot: 0, scale: 0.5, o: 0 };
      segs.push({ u0: 0, u1: U_TOTAL, a: off, b: off });
    }

    return { segs };
  });

  return { timelines, scenes, camera };
}
