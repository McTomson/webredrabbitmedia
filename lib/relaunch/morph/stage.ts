/**
 * Durchgehende Morph-Buehne (Hero + 5 Szenen) — EINE Timeline wie das Original
 * (das at-Lottie ist EIN Precomp-Zug ohne Schnitt, deshalb gibt es dort nie
 * einen leeren Screen). Choreografie-Regeln aus der Messung (grammar.ts §0):
 * EIN Master-Easing, gerade 2-Punkt-Bahnen, Stagger, Rotation endet bei Ankunft.
 * Formations-Slots = vermessene Original-Kompositionen (at-scenes.ts).
 */

import { masterEase, makeRng } from "./grammar";
import { AT_SCENES, type SlotTuple } from "./at-scenes";
import atTiming from "./at-timing.json";

/** Timing-Messdaten (paralleler Vermessungs-Agent, at-timing.json):
 *  pieces = [entryT, arriveT, entryX, entryY, onCanvas] pro Slot. Vorhanden ->
 *  Einflug folgt dem Original-Rhythmus; fehlte die Datei, waeren es Defaults. */
interface TimingScene { id: string; pieces: number[][]; visibleCurve?: number[] }
interface TimingData { scenes: TimingScene[] }
const AT_TIMING: TimingData | null = atTiming as TimingData;

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

  // ---- Einflug-Timing Szene 0 (comp_1): Original-Rhythmus falls vermessen ---
  const timing0 = AT_TIMING ? AT_TIMING.scenes.find((s) => s.id === "comp_1") ?? null : null;
  let entMin = 0, entMax = 1, arrMin = 0, arrMax = 1;
  if (timing0 && timing0.pieces.length) {
    const ents = timing0.pieces.map((p) => p[0]);
    const arrs = timing0.pieces.map((p) => p[1]);
    entMin = Math.min(...ents); entMax = Math.max(...ents);
    arrMin = Math.min(...arrs); arrMax = Math.max(...arrs);
  }
  /** Einflug-Start/Ankunft fuer Teil mit Szene-0-Slot slotIdx0 (Fenster
   *  Start 0.8..1.7, Ankunft 1.9..2.35). Mit Timing: entryT/arriveT linear
   *  normiert; ohne: gestaffelt per rng. */
  function flightTiming0(slotIdx0: number): { fs: number; ar: number; tp: number[] | null } {
    // Fenster frueher + breiter (Browser-Befund 04.07.): mit Start erst ab 0.8
    // und Ankunft ab 1.9 war der Screen zwischen Burst-Ende (~1.05) und
    // Einflug LEER — die ersten Teile muessen schon einschweben, waehrend die
    // letzten Wortmarken-Teile hinausfliegen (Original-visibleCurve steigt
    // von Szenenbeginn an monoton).
    if (timing0 && slotIdx0 >= 0 && slotIdx0 < timing0.pieces.length) {
      const tp = timing0.pieces[slotIdx0];
      const fe = entMax > entMin ? (tp[0] - entMin) / (entMax - entMin) : rng();
      const fa = arrMax > arrMin ? (tp[1] - arrMin) / (arrMax - arrMin) : rng();
      return { fs: 0.4 + fe * 0.7, ar: 1.35 + fa * 0.95, tp };
    }
    const q = rng();
    return { fs: 0.4 + q * 0.7, ar: 1.35 + q * 0.95, tp: null };
  }

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
  // R1: KEIN statischer Scatter-Haltezustand, KEINE Klon-Geburt. Die 18
  // Wortmarken-Teile machen Ruhe -> Kontraktion -> Burst radial nach DRAUSSEN
  // (knapp ueber den Rand) und fliegen anschliessend genau dort wieder herein
  // an ihren Szene-0-Slot (Kontinuitaet). Alle uebrigen Teile stehen bis zu
  // ihrem Einflug unsichtbar (o:0) AUSSERHALB und fliegen von einem Rand-Punkt
  // ein. Nie erscheint ein Teil "aus dem Nichts" im Bild.
  const U_REST = 0.22, U_CON = 0.5;
  const sc0 = AT_SCENES[0];
  const timelines: PieceTimeline[] = pool.map((p, i) => {
    const segs: Seg[] = [];
    const sIdx0 = assignment[0][i];
    const target0 = sIdx0 >= 0 ? slotState(sc0.pieces[sIdx0], scenes[0], sc0, p, sceneSlotMajor[0][sIdx0]) : null;
    let prev: PieceState | null = null;
    let appeared = false;

    if (!p.clone) {
      // ---- Wortmarken-Teil: Ruhe -> Kontraktion -> Burst nach draussen ------
      const home: PieceState = { x: p.cx, y: p.cy, rot: 0, scale: 1, o: 1 };
      const con = contract.get(p.letter) ?? { kx: 0, ky: 0 };
      const conState: PieceState = { ...home, x: p.cx + con.kx, y: p.cy + con.ky };
      segs.push({ u0: U_REST, u1: U_CON, a: home, b: conState });
      // Burst: gestaffelt (Startjitter 0-0.15), gerade Bahn radial — aber wie im
      // Original (f_0011/f_0012) NICHT ueber den Rand: die Buchstaben-Teile
      // verteilen sich GROSS ueber den Screen (55-90% des Wegs zur Kante) und
      // BLEIBEN dort, waehrend die neuen Teile von aussen hereinstroemen.
      // So ist der Screen nach dem Burst nie leer (Tomson-Regel + Original).
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
      appeared = true;

      if (target0) {
        // Weiterflug: von der Streu-Position direkt an den Szene-0-Slot
        // (Groesse schrumpft dabei von Buchstaben- auf Slot-Massstab).
        const { fs, ar } = flightTiming0(sIdx0);
        const fStart = Math.max(fs, burstEnd + 0.08);
        segs.push({ u0: fStart, u1: Math.max(ar, fStart + 0.1), a: { ...burstExit }, b: target0 });
        prev = target0;
      } else {
        // kein Szene-0-Slot -> bleibt an der Streu-Position und geht mit
        // der naechsten Szene ueber den Rand ab (exitState-Zweig).
        prev = burstExit;
      }
    } else if (target0) {
      // ---- Klon mit Szene-0-Slot: unsichtbar draussen -> Einflug -----------
      const { fs, ar, tp } = flightTiming0(sIdx0);
      const start = tp && tp[4] === 0
        ? projectOutside((tp[2] - 0.5) * vp.w, (tp[3] - 0.5) * vp.h)
        : edgeStartForSlot(target0);
      const startPt: PieceState = { x: start.x, y: start.y, rot: target0.rot + (rng() - 0.5) * 60, scale: target0.scale, o: 1 };
      // Unsichtbar-Halt bis Einflug (o:0), dann snap auf o:1 und geradliniger Flug.
      segs.push({ u0: 0, u1: fs, a: { ...startPt, o: 0 }, b: { ...startPt, o: 0 } });
      segs.push({ u0: fs, u1: Math.max(ar, fs + 0.1), a: startPt, b: target0 });
      appeared = true;
      prev = target0;
    }
    // Klon ohne Szene-0-Slot: noch gar keine Segmente, erscheint spaeter.

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

  return { timelines, scenes };
}
