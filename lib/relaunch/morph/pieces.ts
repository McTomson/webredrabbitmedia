/**
 * Naturbruch-Zerlegung der Wortmarke "red rabbit" (ABGENOMMEN 04.07., Tomson).
 * Quelle der Koordinaten: brand/prototypes/relaunch-2026-07/scroll-prototyp-v6.html
 * (6 Korrektur-Runden, pixelverifiziert). Feld 120x140, Glyphe bei x=10,
 * Baseline y=100, Font "650 100px Fraunces" (opsz 144).
 * NICHT veraendern ohne neue Abnahme.
 */

export const BRAND_RED = "#F12032";

/** Clip-Rechtecke [x, y, w, h] pro Teil, pro Buchstabe. */
export const PIECES: Record<string, number[][][]> = {
  r: [[[0, 0, 29.4, 76], [0, 76, 120, 64]], [[30.8, 0, 89.2, 76]]],
  e: [[[0, 56, 34, 12], [0, 68, 25, 12], [0, 80, 120, 60]], [[34, 44, 86, 24], [25.8, 68, 94.2, 12]]],
  a: [[[0, 0, 34.5, 72]], [[0, 72, 34.5, 68]], [[36, 57.5, 84, 82.5]]],
  d: [[[0, 40, 40, 100]], [[42.5, 31.5, 77.5, 108.5], [35, 0, 85, 31.5]]],
  b: [[[0, 0, 28.5, 140]], [[33, 40, 87, 100]]],
  i: [[[0, 0, 120, 50.5]], [[0, 50.5, 120, 89.5]]],
  t: [[[0, 0, 120, 140]]],
};

export interface RenderedPiece {
  url: string;
  minx: number;
  miny: number;
  w: number;
  h: number;
}

/**
 * Rendert EIN Teil scharf (Canvas-Clip, Trim auf Ink-BBox).
 * fontFamily: aufgeloester Fraunces-Familienname (next/font hasht ihn),
 * S: Render-Scale (devicePixelRatio-gekoppelt).
 */
export function renderPiece(ch: string, rects: number[][], fontFamily: string, S: number): RenderedPiece | null {
  const W = Math.round(120 * S), H = Math.round(140 * S);
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d", { willReadFrequently: true })!;
  ctx.save();
  ctx.beginPath();
  for (const r of rects) ctx.rect(r[0] * S, r[1] * S, r[2] * S, r[3] * S);
  ctx.clip();
  ctx.font = `650 ${100 * S}px ${fontFamily}`;
  ctx.fillStyle = BRAND_RED;
  ctx.fillText(ch, 10 * S, 100 * S);
  ctx.restore();
  const d = ctx.getImageData(0, 0, W, H).data;
  let minx = W, maxx = 0, miny = H, maxy = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (d[(y * W + x) * 4 + 3] > 10) {
        if (x < minx) minx = x;
        if (x > maxx) maxx = x;
        if (y < miny) miny = y;
        if (y > maxy) maxy = y;
      }
    }
  }
  if (maxx < minx || maxy < miny) return null; // leeres Teil (Font nicht geladen o.ae.) -> fail-closed
  const w = maxx - minx + 1, h = maxy - miny + 1;
  const out = document.createElement("canvas");
  out.width = w; out.height = h;
  out.getContext("2d")!.drawImage(cv, minx, miny, w, h, 0, 0, w, h);
  return { url: out.toDataURL(), minx: minx / S, miny: miny / S, w: w / S, h: h / S };
}

export interface WordPiece {
  url: string;
  /** Home-Position (linke obere Ecke) im Wortmarken-Koordinatensystem */
  hx: number;
  hy: number;
  w: number;
  h: number;
  /** Mitte relativ zum Wortmarken-Zentrum */
  cx: number;
  cy: number;
  letter: number;
}

export interface WordLayout {
  pieces: WordPiece[];
  boxW: number;
  boxH: number;
}

/** Zweizeilige zentrierte Wortmarke "red / rabbit", Teile mit Home-Positionen. */
export function buildWordLayout(fontFamily: string, F: number, dpr: number): WordLayout | null {
  const mcv = document.createElement("canvas");
  const mctx = mcv.getContext("2d")!;
  mctx.font = `650 100px ${fontFamily}`;
  const lines = ["red", "rabbit"];
  const scale = F / 100, lineH = F * 0.92;
  const widths = lines.map((w) => mctx.measureText(w).width * scale);
  const boxW = Math.max(...widths), boxH = lineH * 2.06;
  if (boxW < F) return null; // Font offenbar nicht geladen -> fail-closed, Retry beim Aufrufer
  const S = Math.max(2, Math.ceil((F * dpr) / 100));
  const pieces: WordPiece[] = [];
  lines.forEach((word, li) => {
    const x0 = (boxW - widths[li]) / 2;
    const baseY = lineH * 0.78 + li * lineH * 1.06;
    let adv = 0;
    for (let ci = 0; ci < word.length; ci++) {
      const ch = word[ci];
      for (const rects of PIECES[ch]) {
        const p = renderPiece(ch, rects, fontFamily, S);
        if (!p) return;
        const hx = x0 + adv + (p.minx - 10) * scale;
        const hy = baseY + (p.miny - 100) * scale;
        const w = p.w * scale, h = p.h * scale;
        pieces.push({
          url: p.url, hx, hy, w, h,
          cx: hx + w / 2 - boxW / 2,
          cy: hy + h / 2 - boxH / 2,
          letter: li * 10 + ci,
        });
      }
      adv += mctx.measureText(ch).width * scale;
    }
  });
  return { pieces, boxW, boxH };
}
