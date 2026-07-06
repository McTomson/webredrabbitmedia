/**
 * Naturbruch-Zerlegung der Wortmarke "red rabbit".
 * Feld 120x140, Glyphe bei x=10, Baseline y=100, Font "700 100px DM Sans".
 * Font-Swap 06.07. (Tomson): Fraunces -> DM Sans Bold, einzeilig statt gestapelt.
 * Die Clip-Rechtecke je Buchstabe KACHELN das gesamte 120x140-Feld (Aussenkanten
 * bis 0/120/140), decken also jede Glyphe vollstaendig ab — im intakten Zustand
 * rendert die Wortmarke als solide Buchstaben (Schnitte unsichtbar), erst beim
 * Zerbrechen trennen sich die Teile. Nur die INNEREN Schnittlinien bestimmen die
 * Bruchkanten; sie liegen an den duennsten Stellen der DM-Sans-Glyphen.
 */

export const BRAND_RED = "#F12032";

/** Clip-Rechtecke [x, y, w, h] pro Teil, pro Buchstabe. */
export const PIECES: Record<string, number[][][]> = {
  r: [[[0, 0, 31.4, 76], [0, 76, 120, 64]], [[30.8, 0, 89.2, 76]]],
  e: [[[0, 44, 34, 24], [0, 68, 25, 12], [0, 80, 120, 60]], [[34, 44, 86, 24], [25.8, 68, 94.2, 12]]],
  a: [[[0, 0, 34.5, 72]], [[0, 72, 34.5, 68]], [[34.5, 0, 85.5, 140]]],
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
 * fontFamily: aufgeloester DM-Sans-Familienname (next/font hasht ihn),
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
  ctx.font = `700 ${100 * S}px ${fontFamily}`;
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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="100%" height="100%" preserveAspectRatio="none" style="display:block;overflow:visible"><defs><clipPath id="${id}">${rectsSvg}</clipPath></defs><g clip-path="url(#${id})"><text x="10" y="100" font-family="${fam}" font-size="100" font-weight="700" fill="${BRAND_RED}">${ch}</text></g></svg>`;
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

/**
 * Einzeilige zentrierte Wortmarke "red rabbit" (Tomson 06.07.: nebeneinander, DM
 * Sans Bold). Klarer Wort-Abstand zwischen "red" und "rabbit" (sonst liest es sich
 * als ein Wort "redrabbit" — ausdruecklich abgelehnt). Zentrierung ueber die echte
 * Ink-Bounding-Box (zwei Paesse), damit die Marke exakt mittig sitzt.
 */
export function buildWordLayout(fontFamily: string, F: number, dpr: number): WordLayout | null {
  const mcv = document.createElement("canvas");
  const mctx = mcv.getContext("2d")!;
  mctx.font = `700 100px ${fontFamily}`;
  const word = "red rabbit";
  const SPACE_EM = 0.9; // klarer Wort-Abstand (nicht "redrabbit")
  const scale = F / 100;
  const advOf = (ch: string) => (ch === " " ? SPACE_EM * 100 : mctx.measureText(ch).width) * scale;
  const totalW = [...word].reduce((s, ch) => s + advOf(ch), 0);
  if (totalW < F) return null; // Font offenbar nicht geladen -> fail-closed, Retry beim Aufrufer
  const S = Math.max(2, Math.ceil((F * dpr) / 100));

  // Pass 1: Teile an Roh-Positionen (hx/hy) bauen und Ink-BBox der ganzen Zeile sammeln.
  interface Raw { svg: string; hx: number; hy: number; w: number; h: number; letter: number }
  const raw: Raw[] = [];
  const baseY = F * 0.82; // Baseline; nur provisorisch, echte Mitte kommt aus der BBox
  let adv = 0, li = 0;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let ci = 0; ci < word.length; ci++) {
    const ch = word[ci];
    if (ch === " ") { adv += advOf(ch); continue; }
    for (const rects of PIECES[ch]) {
      const p = renderPiece(ch, rects, fontFamily, S);
      if (!p) return null; // leeres Teil -> fail-closed
      const hx = adv + (p.minx - 10) * scale;
      const hy = baseY + (p.miny - 100) * scale;
      const w = p.w * scale, h = p.h * scale;
      raw.push({ svg: p.svg, hx, hy, w, h, letter: li });
      if (hx < minX) minX = hx;
      if (hx + w > maxX) maxX = hx + w;
      if (hy < minY) minY = hy;
      if (hy + h > maxY) maxY = hy + h;
    }
    adv += advOf(ch);
    li++;
  }
  if (!raw.length) return null;

  // Pass 2: cx/cy relativ zur echten Ink-Mitte (robuste Zentrierung auf dem Screen).
  const boxW = maxX - minX, boxH = maxY - minY;
  const cX = (minX + maxX) / 2, cY = (minY + maxY) / 2;
  const pieces: WordPiece[] = raw.map((r) => ({
    svg: r.svg, hx: r.hx, hy: r.hy, w: r.w, h: r.h,
    cx: r.hx + r.w / 2 - cX,
    cy: r.hy + r.h / 2 - cY,
    letter: r.letter,
  }));
  return { pieces, boxW, boxH };
}
