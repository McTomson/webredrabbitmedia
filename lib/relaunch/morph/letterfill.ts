/**
 * Buchstaben-Silhouetten-Fueller: fuellt eine Masken-Form (Canvas-Alpha) mit
 * GANZEN Buchstaben in vier Stilen (Tomson-Inspiration 04.07. spaet):
 *  - "city":   gemischte Groessen, dicht gepackt, leichte Drehung
 *  - "chain":  grosse Buchstaben, luftig entlang der Kontur
 *  - "micro":  viele kleine Buchstaben, gleichmaessig dicht (Mikrografie)
 *  - "grid":   Buchstaben auf Zeilenraster (Schreibmaschine)
 * Jeder platzierte Buchstabe ist ein animierbares Einzelteil.
 */

import { makeRng } from "./grammar";

export interface LetterPiece {
  ch: string;
  /** Mitte relativ zum Masken-Zentrum, normiert auf Masken-Hoehe (1 = Hoehe) */
  x: number;
  y: number;
  /** Font-Groesse relativ zur Masken-Hoehe */
  size: number;
  rot: number;
}

export type FillStyle = "city" | "chain" | "micro" | "grid";

/** Zwei ineinandergreifende Zahnraeder als Alpha-Maske zeichnen. */
export function drawGearsMask(ctx: CanvasRenderingContext2D, S: number) {
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = "#000";
  const gear = (cx: number, cy: number, R: number, teeth: number, phase: number) => {
    // Zahnkranz: Kreis + rechteckige Zaehne
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < teeth; i++) {
      const a = phase + (i / teeth) * Math.PI * 2;
      ctx.save();
      ctx.translate(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.rotate(a);
      // kraeftige Zaehne: ragen deutlich ueber den Kranz hinaus
      ctx.fillRect(-R * 0.04, -R * 0.14, R * 0.32, R * 0.28);
      ctx.restore();
    }
    // Nabenloch ausstanzen
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  gear(S * 0.36, S * 0.6, S * 0.26, 11, 0.1);
  gear(S * 0.72, S * 0.28, S * 0.175, 8, 0.32);
}

/** Belegungs-Raster aus einer Masken-Canvas (true = innerhalb der Form). */
function maskGrid(ctx: CanvasRenderingContext2D, S: number, cell: number) {
  const g = Math.ceil(S / cell);
  const data = ctx.getImageData(0, 0, S, S).data;
  const inside = new Uint8Array(g * g);
  for (let gy = 0; gy < g; gy++) {
    for (let gx = 0; gx < g; gx++) {
      const px = Math.min(S - 1, Math.round((gx + 0.5) * cell));
      const py = Math.min(S - 1, Math.round((gy + 0.5) * cell));
      inside[gy * g + gx] = data[(py * S + px) * 4 + 3] > 120 ? 1 : 0;
    }
  }
  return { g, inside };
}

/**
 * Fuellt die Maske mit Buchstaben. mFrac = Ink-Bbox der Buchstaben relativ zur
 * Fontgroesse (vorvermessen vom Aufrufer: w/h je Zeichen).
 */
export function fillWithLetters(
  maskCtx: CanvasRenderingContext2D,
  S: number,
  letters: { ch: string; wf: number; hf: number }[],
  style: FillStyle,
  seed = 11
): LetterPiece[] {
  const rng = makeRng(seed);
  const cell = 4;
  const { g, inside } = maskGrid(maskCtx, S, cell);
  const occupied = new Uint8Array(g * g);
  const out: LetterPiece[] = [];

  /** frei UND zu mindestens insideFrac innerhalb der Maske (Kontur-Toleranz:
   *  die Buchstaben-Kanten ZEICHNEN den Rand, duerfen also leicht ueberstehen) */
  const rectFits = (x0: number, y0: number, x1: number, y1: number, insideFrac: number) => {
    const gx0 = Math.max(0, Math.floor(x0 / cell)), gy0 = Math.max(0, Math.floor(y0 / cell));
    const gx1 = Math.min(g - 1, Math.floor(x1 / cell)), gy1 = Math.min(g - 1, Math.floor(y1 / cell));
    if (gx1 < gx0 || gy1 < gy0) return false;
    let total = 0, inCnt = 0;
    for (let gy = gy0; gy <= gy1; gy++) {
      for (let gx = gx0; gx <= gx1; gx++) {
        const idx = gy * g + gx;
        if (occupied[idx]) return false;
        total++;
        if (inside[idx]) inCnt++;
      }
    }
    return total > 0 && inCnt / total >= insideFrac;
  };
  const rectMark = (x0: number, y0: number, x1: number, y1: number) => {
    const gx0 = Math.max(0, Math.floor(x0 / cell)), gy0 = Math.max(0, Math.floor(y0 / cell));
    const gx1 = Math.min(g - 1, Math.floor(x1 / cell)), gy1 = Math.min(g - 1, Math.floor(y1 / cell));
    for (let gy = gy0; gy <= gy1; gy++) for (let gx = gx0; gx <= gx1; gx++) occupied[gy * g + gx] = 1;
  };

  const push = (ch: string, cxPx: number, cyPx: number, fontPx: number, rot: number) => {
    out.push({ ch, x: (cxPx - S / 2) / S, y: (cyPx - S / 2) / S, size: fontPx / S, rot });
  };

  if (style === "grid") {
    // Zeilenraster wie Schreibmaschine: feste Zeilenhoehe, Buchstabe wo Maske
    const fontPx = S * 0.034;
    const lineH = fontPx * 1.12;
    let li = 0;
    for (let y = lineH / 2; y < S; y += lineH) {
      for (let x = fontPx / 2; x < S; x += fontPx * 0.82) {
        const gx = Math.floor(x / cell), gy = Math.floor(y / cell);
        if (inside[gy * g + gx]) {
          const L = letters[(li * 7 + Math.floor(rng() * letters.length)) % letters.length];
          push(L.ch, x, y, fontPx, 0);
          li++;
        }
      }
    }
    return out;
  }

  // Groessen-Plan je Stil (Kaskade gross -> klein; kleine Stufen fuellen die
  // Luecken der grossen — so entsteht die dichte City-Packung)
  const plan: { fontPx: number; tries: number; jitterRot: number }[] = [];
  let insideFrac = 0.9;
  let pad = 1;
  if (style === "city") {
    const steps: [number, number][] = [[0.15, 600], [0.115, 1200], [0.085, 2400], [0.062, 4800], [0.046, 9000], [0.036, 12000]];
    for (const [f, tries] of steps) plan.push({ fontPx: S * f, tries, jitterRot: 9 });
    insideFrac = 0.88;
    pad = 0;
  } else if (style === "micro") {
    for (const f of [0.052, 0.042, 0.034]) plan.push({ fontPx: S * f, tries: 9000, jitterRot: 6 });
    insideFrac = 0.92;
    pad = 0;
  } else {
    // chain: nur grosse Buchstaben, moderat viele Versuche -> luftig, mit Fugen
    for (const f of [0.14, 0.115, 0.095, 0.08]) plan.push({ fontPx: S * f, tries: 1500, jitterRot: 12 });
    insideFrac = 0.85;
    pad = 2;
  }

  for (const step of plan) {
    for (let t = 0; t < step.tries; t++) {
      const L = letters[Math.floor(rng() * letters.length)];
      const w = L.wf * step.fontPx, h = L.hf * step.fontPx;
      const x = rng() * S, y = rng() * S;
      const x0 = x - w / 2 - pad * cell, y0 = y - h / 2 - pad * cell;
      const x1 = x + w / 2 + pad * cell, y1 = y + h / 2 + pad * cell;
      if (!rectFits(x0, y0, x1, y1, insideFrac)) continue;
      rectMark(x0, y0, x1, y1);
      push(L.ch, x, y, step.fontPx, (rng() - 0.5) * step.jitterRot * 2);
    }
  }
  return out;
}
