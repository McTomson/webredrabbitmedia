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
  /** Vektor-Markup (inline-SVG, erbt die geladene Seiten-Font) */
  svg: string;
  minx: number;
  miny: number;
  w: number;
  h: number;
}

let CLIP_SEQ = 0;

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
  // Vektor-Ausgabe: SVG mit Clip-Rechtecken im 120x140-Glyphenraum, viewBox = Ink-BBox.
  // Inline im DOM gerendert erbt es die echte Fraunces -> scharf bei jeder Groesse/Rotation.
  const id = `rrclip${++CLIP_SEQ}`;
  const rectsSvg = rects.map((r) => `<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}"/>`).join("");
  const vb = `${minx / S} ${miny / S} ${w / S} ${h / S}`;
  const fam = fontFamily.replace(/"/g, "&quot;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="100%" height="100%" preserveAspectRatio="none" style="display:block;overflow:visible"><defs><clipPath id="${id}">${rectsSvg}</clipPath></defs><g clip-path="url(#${id})"><text x="10" y="100" font-family="${fam}" font-size="100" font-weight="650" fill="${BRAND_RED}">${ch}</text></g></svg>`;
  return { svg, minx: minx / S, miny: miny / S, w: w / S, h: h / S };
}

export interface WordPiece {
  /** Vektor-Markup des Teils (inline-SVG) */
  svg: string;
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
  const boxW = Math.max(...widths), boxH = lineH * 1.94;
  if (boxW < F) return null; // Font offenbar nicht geladen -> fail-closed, Retry beim Aufrufer
  const S = Math.max(2, Math.ceil((F * dpr) / 100));
  const pieces: WordPiece[] = [];
  lines.forEach((word, li) => {
    // at-Setzung (Video-Befund 05.07.): Zeile 1 EINGERUECKT ueber Zeile 2 (nicht zentriert),
    // Einzug ~11% der Zeile-2-Breite; Zeilenabstand eng (Unterlaengen fast beruehrend).
    const x0 = li === 0 ? widths[1] * 0.11 : 0;
    const baseY = lineH * 0.78 + li * lineH * 0.94;
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
          svg: p.svg, hx, hy, w, h,
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
