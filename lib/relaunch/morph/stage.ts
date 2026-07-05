/**
 * Durchgehende Morph-Buehne (Hero + 5 Szenen) — das Original ist eine Folge von
 * 5 all-turtles-Precomps mit HARTEN SCHNITTEN: Szene s endet, ihre Teile
 * verschwinden schlagartig; die Teile von Szene s+1 stehen ab dem Schnitt
 * SICHTBAR an ihren Entry-Positionen — und diese liegen (globales Canvas-
 * Mapping) genau dort, wo Szene s stand. Deshalb wirkt der Schnitt nahtlos wie
 * ein Morph. Wir spielen alle 5 Comps 1:1 aus den extrahierten Daten ab.
 */

import { masterEase, makeRng } from "./grammar";
import atShapes1 from "./at-shapes-comp1.json";
import atShapes2 from "./at-shapes-comp2.json";
import atShapes3 from "./at-shapes-comp3.json";
import atShapes4 from "./at-shapes-comp4.json";
import atShapes5 from "./at-shapes-comp5.json";

/** alle 5 vermessenen Kompositionen (Index = Szene). comp1 = bisheriges atShapes. */
const COMPS = [atShapes1, atShapes2, atShapes3, atShapes4, atShapes5];

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

/** Timeline-Aufteilung: Hero belegt u [0,U_HERO), danach 5 Szenen a 1 u. */
export const U_HERO = 1.7;
export const U_TOTAL = U_HERO + 5;

/** u-Fenster fuer Szene 0 (laenger, weil sie aus dem Hero-Einflug entsteht). */
const U_B0 = 0.35, U_B1 = 2.25;

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
  /** Index in COMPS[scene].pieces (Original-Teilform); Wordmark-Teile: undefined */
  at?: number;
  /** Szene 0..4 (welche Comp); Wordmark-Teile: undefined */
  scene?: number;
}

export interface SceneLayout {
  /** Formation-Zentrum in Viewport-px (relativ zum Viewport-Zentrum, nur informativ) */
  cx: number;
  cy: number;
  /** Text auf der Gegenseite der Formation */
  textSide: "left" | "right";
}

export interface StagePlan {
  timelines: PieceTimeline[];
  scenes: SceneLayout[];
  /** Kamera-Fahrt pro Szene (Index = Szene): u -> Zoom/Pan des Szenen-Wrappers. */
  cameras: Array<(u: number) => { k: number; tx: number; ty: number }>;
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
  /** Massstab: all-turtles skaliert breiten-orientiert -> vh/810 statt vh/1080. */
  const k = Math.min(vp.w / 1920, vp.h / 810) * (narrow ? 1.15 : 1);
  const diag = Math.hypot(vp.w, vp.h);
  const halfW = vp.w / 2, halfH = vp.h / 2;

  // ---- Formations-Zentrum pro Szene (fuer Mobile-Zentrierung) ---------------
  const sceneCenterX = COMPS.map((c) => {
    const xs = c.pieces.filter((p) => !p.hidden).map((p) => p.x);
    return xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : 0.5;
  });
  const sceneCenterY = COMPS.map((c) => {
    const ys = c.pieces.filter((p) => !p.hidden).map((p) => p.y);
    return ys.length ? (Math.min(...ys) + Math.max(...ys)) / 2 : 0.5;
  });

  // ---- Canvas-Mapping. Desktop: GLOBAL (Original-Koordinaten -> Szene s+1
  // startet wo s endete, nahtloser Schnitt; Formation seitlich, Text auf der
  // Gegenseite). Mobile (narrow): jede Formation horizontal + vertikal um ihr
  // eigenes Zentrum in den oberen Bildbereich zentriert (Text darunter).
  const offX = (s: number) => (narrow ? -(sceneCenterX[s] - 0.5) * 1920 * k : 0);
  const offY = (s: number) => (narrow ? (-(sceneCenterY[s] - 0.5) * 1080 * k) - vp.h * 0.16 : 0);
  const X = (xN: number, s = 0) => (xN - 0.5) * 1920 * k + offX(s);
  const Y = (yN: number, s = 0) => (yN - 0.5) * 1080 * k + offY(s);

  // ---- R1 Rand-Geometrie fuer den Wortmarken-Abflug -------------------------
  /** Punkt auf dem Ray (dx,dy) ab Zentrum, knapp UEBER den Rand. */
  function edgePoint(dx: number, dy: number, overshoot: number): { x: number; y: number } {
    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;
    const tx = Math.abs(dx) > 1e-6 ? halfW / Math.abs(dx) : Infinity;
    const ty = Math.abs(dy) > 1e-6 ? halfH / Math.abs(dy) : Infinity;
    const t = Math.min(tx, ty) + overshoot * diag;
    return { x: dx * t, y: dy * t };
  }

  /** Punkt AUSSERHALB des Viewports, ausgehend von (fx,fy) in Richtung (dx,dy):
   *  bis zum ersten Rand + Ueberstand. Fuer den Szene-0-Einflug von aussen. */
  function offscreenFrom(fx: number, fy: number, dx: number, dy: number, overshoot: number): { x: number; y: number } {
    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;
    const tx = dx > 1e-6 ? (halfW - fx) / dx : dx < -1e-6 ? (-halfW - fx) / dx : Infinity;
    const ty = dy > 1e-6 ? (halfH - fy) / dy : dy < -1e-6 ? (-halfH - fy) / dy : Infinity;
    const t = Math.max(0, Math.min(tx, ty)) + overshoot * diag;
    return { x: fx + dx * t, y: fy + dy * t };
  }

  // ---- Szenen-Fenster -------------------------------------------------------
  // Szene 0: Build [U_B0, U_B1], harter Schnitt bei uCut0 = U_HERO + 1.
  // Szene s>=1: us = U_HERO + s; Build [us, us+0.75]; Schnitt us+1
  //             (Szene 4: kein Ende, bleibt bis U_TOTAL).
  const uB0 = (s: number) => (s === 0 ? U_B0 : U_HERO + s);
  const winW = (s: number) => (s === 0 ? U_B1 - U_B0 : 0.75);
  const uCutOf = (s: number) =>
    s === 0 ? U_HERO + 1 : s < 4 ? U_HERO + s + 1 : U_TOTAL + 1;

  // ---- Szenen-Layouts (Formation-Zentrum + Text-Gegenseite) ----------------
  const scenes: SceneLayout[] = COMPS.map((c) => {
    const xs = c.pieces.filter((p) => !p.hidden).map((p) => p.x);
    const anchor = xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : 0.5;
    return {
      cx: (anchor - 0.5) * 1920 * k,
      cy: 0,
      textSide: anchor < 0.5 ? "right" : "left",
    };
  });

  // ---- Kamera-Fahrt pro Szene ----------------------------------------------
  const cameras = COMPS.map((c, s) => {
    const track = c.camera;
    const cref = track[track.length - 1];
    const uB0s = uB0(s), W = winW(s);
    const tuAt = (t: number) => uB0s + t * W;
    const tu0 = tuAt(track[0].t), tu1 = tuAt(cref.t);
    return (u: number): { k: number; tx: number; ty: number } => {
      let cx: number, cy: number, cs: number;
      if (u <= tu0) { cx = track[0].x; cy = track[0].y; cs = track[0].s; }
      else if (u >= tu1) { cx = cref.x; cy = cref.y; cs = cref.s; }
      else {
        const e = masterEase((u - tu0) / (tu1 - tu0));
        cx = track[0].x + (cref.x - track[0].x) * e;
        cy = track[0].y + (cref.y - track[0].y) * e;
        cs = track[0].s + (cref.s - track[0].s) * e;
      }
      const ck = cs / cref.s;
      const tx = (cx - ck * cref.x - 0.5 * (1 - ck)) * 1920 * k;
      const ty = (cy - ck * cref.y - 0.5 * (1 - ck)) * 1080 * k;
      return { k: ck, tx, ty };
    };
  });

  // ---- at-Teil: Original-Teilform 1:1 aus der Comp-Szene --------------------
  function atTimeline(p: PoolPieceIn): Seg[] {
    const s = p.scene!;
    const c = COMPS[s];
    const jp = c.pieces[p.at!];
    const dur = c.displayFrames;
    const uB0s = uB0(s), W = winW(s), uCut = uCutOf(s);
    const uAt = (f: number) => uB0s + (f / dur) * W;

    const slotScale = (jp.w * Math.abs(jp.sx) * k) / p.w;
    const slot: PieceState = { x: X(jp.x, s), y: Y(jp.y, s), rot: jp.rot, scale: slotScale, o: 1 };
    let entry: PieceState = {
      x: X(jp.fromX, s), y: Y(jp.fromY, s), rot: jp.fromRot,
      scale: slotScale * jp.fromScale, o: 1,
    };

    // Szene 0: Einflug von AUSSERHALB des Bildschirms statt Aufpoppen am
    // Original-Entry (das oft im Bild liegt). Startpunkt = slot in Original-
    // Einflugrichtung verlaengert bis ueber den Rand -> die Teile stroemen
    // sichtbar von aussen herein, waehrend die Wortmarke hinausfliegt.
    // Der Halte-Frame (slot) bleibt exakt 1:1.
    if (s === 0) {
      let dx = entry.x - slot.x, dy = entry.y - slot.y;
      if (Math.hypot(dx, dy) < 1) { dx = slot.x; dy = slot.y; }
      if (Math.hypot(dx, dy) < 1) { const a = rng() * Math.PI * 2; dx = Math.cos(a); dy = Math.sin(a); }
      const start = offscreenFrom(slot.x, slot.y, dx, dy, 0.06);
      entry = { ...entry, x: start.x, y: start.y };
    }

    // Fail-closed: verstecktes Teil -> nur Off-Segment.
    if (jp.hidden) {
      const off = { ...entry, o: 0 };
      return [{ u0: 0, u1: U_TOTAL, a: off, b: off }];
    }

    const fs = uAt(jp.entryT * dur);              // Flugbeginn
    const ar = uAt(jp.arriveT * dur);             // Ankunft
    // Szene 0: Teile ab u=0 sichtbar, aber off-screen geparkt (kein o-Snap im
    // Bild) -> fliegen ab fs herein. Szenen 1-4: ab Sichtbarkeitsfenster (ip)
    // am Entry geparkt, der Vorgaenger-Formation-Standort verdeckt das Erscheinen.
    const uVis0 = s === 0 ? 0 : uAt(Math.max(jp.ip, 0));
    const finiteVis = s < 4 || jp.op < dur;
    const uVis1 = jp.op >= dur ? uCut : uAt(jp.op);

    const segs: Seg[] = [];
    // a) unsichtbar am Entry geparkt bis Sichtbarkeitsbeginn
    if (uVis0 > 1e-9) segs.push({ u0: 0, u1: uVis0, a: { ...entry, o: 0 }, b: { ...entry, o: 0 } });
    // c) sichtbar am Entry geparkt bis Flugbeginn (nur wenn fs > uVis0)
    if (fs > uVis0 + 1e-9) segs.push({ u0: uVis0, u1: fs, a: entry, b: entry });

    // d) Flug entry -> slot. Verschwindet ein Teil mid-flight (Reveal-Fenster),
    // wird der Flug bei uVis1 gekuerzt (b bleibt slot, der o-Snap folgt sofort).
    const flightEnd = Math.min(ar, uVis1);
    if (flightEnd > fs + 1e-9) {
      segs.push({ u0: fs, u1: flightEnd, a: entry, b: slot });
    } else {
      // Kein echter Flug (entryT==arriveT / Reveal am Slot): sichtbar am Slot
      // halten. Der o-Snap auf 1 passiert am Uebergang von Segment a.
      const holdStart = Math.max(uVis0, fs);
      const holdEnd = finiteVis ? uVis1 : U_TOTAL + 1;
      if (holdEnd > holdStart + 1e-9) segs.push({ u0: holdStart, u1: holdEnd, a: slot, b: slot });
      else segs.push({ u0: holdStart, u1: holdStart + 1e-4, a: slot, b: slot });
    }

    // e) Verschwinden am uVis1 (Reveal-Ende oder Szenen-Cut). Szene 4 mit
    // op>=dur blendet nie aus.
    if (finiteVis) {
      segs.push({ u0: uVis1, u1: uVis1 + 1e-4, a: { ...slot }, b: { ...slot, o: 0 } });
    }

    if (!segs.length) {
      const off = { ...entry, o: 0 };
      segs.push({ u0: 0, u1: U_TOTAL, a: off, b: off });
    }
    return segs;
  }

  // ---- Hero-Kontraktion (gemessene Grammatik, letter-basiert) --------------
  const letters = new Map<number, { cx: number; cy: number }>();
  for (const p of pool) {
    if (p.clone || p.at != null) continue;
    const cur = letters.get(p.letter);
    if (!cur) letters.set(p.letter, { cx: p.cx, cy: p.cy });
    else { cur.cx = (cur.cx + p.cx) / 2; cur.cy = (cur.cy + p.cy) / 2; }
  }
  const wordmarkPieces = pool.filter((p) => p.at == null && !p.clone);
  const fontS = wordmarkPieces.length
    ? Math.max(...wordmarkPieces.map((p) => Math.max(p.w, p.h))) / 135
    : 1;
  const contract = new Map<number, { kx: number; ky: number }>();
  for (const [id, c] of letters) {
    const ky = c.cy < 0 ? 20 * fontS : -20 * fontS;
    const kx = -Math.sign(c.cx) * Math.min(50 * fontS, Math.max(20 * fontS, Math.abs(c.cx) * 0.11));
    contract.set(id, { kx, ky });
  }

  // ---- Wortmarken-Teil: Ruhe -> Kontraktion -> Burst -> RAUS ---------------
  const U_REST = 0.22, U_CON = 0.5;
  function wordmarkSegs(p: PoolPieceIn): Seg[] {
    const segs: Seg[] = [];
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
    let ex = burstExit.x, ey = burstExit.y;
    if (Math.hypot(ex, ey) < 1) { const a = rng() * Math.PI * 2; ex = Math.cos(a); ey = Math.sin(a); }
    const out = edgePoint(ex, ey, 0.12);
    const exit: PieceState = { x: out.x, y: out.y, rot: burstRot + (rng() - 0.5) * 40, scale: burstExit.scale, o: 1 };
    segs.push({ u0: burstEnd + 0.06, u1: 1.45 + rng() * 0.35, a: burstExit, b: exit });
    return segs;
  }

  // ---- Timeline pro Teil ----------------------------------------------------
  const timelines: PieceTimeline[] = pool.map((p) => {
    if (p.at != null && p.scene != null) return { segs: atTimeline(p) };
    if (p.at == null && !p.clone) return { segs: wordmarkSegs(p) };
    // Fail-closed: unklassifiziertes Teil -> unsichtbar geparkt.
    const off: PieceState = { x: halfW * 1.3, y: halfH * 1.3, rot: 0, scale: 0.5, o: 0 };
    return { segs: [{ u0: 0, u1: U_TOTAL, a: off, b: off }] };
  });

  return { timelines, scenes, cameras };
}
