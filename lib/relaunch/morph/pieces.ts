/**
 * Naturbruch-Zerlegung der Wortmarke "red rabbit".
 * Feld 120x140, Glyphe bei x=10, Baseline y=100, Font "600 100px DM Sans".
 * Font-Swap 06.07. (Tomson): Fraunces -> DM Sans Bold, einzeilig statt gestapelt.
 * Variante C+F 07.07. (Tomson): Wortmarke in Tinte statt Rot, nur der i-Punkt
 * bleibt Markenrot (eigenes Teil), Gewicht 600 statt 700, engere Wortluecke.
 * Die Clip-Rechtecke je Buchstabe KACHELN das gesamte 120x140-Feld (Aussenkanten
 * bis 0/120/140), decken also jede Glyphe vollstaendig ab — im intakten Zustand
 * rendert die Wortmarke als solide Buchstaben (Schnitte unsichtbar), erst beim
 * Zerbrechen trennen sich die Teile. Nur die INNEREN Schnittlinien bestimmen die
 * Bruchkanten; sie liegen an den duennsten Stellen der DM-Sans-Glyphen.
 */

export const BRAND_RED = "#F12032";
/** Wortmarken-Tinte (= --rr-ink). Variante C 07.07.: Buchstaben in Tinte statt Rot. */
export const WORD_INK = "#23262e";

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
export function renderPiece(ch: string, rects: number[][], fontFamily: string, S: number, fill: string = BRAND_RED): RenderedPiece | null {
  const W = Math.round(120 * S), H = Math.round(140 * S);
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d", { willReadFrequently: true })!;
  // Schnittkanten leicht ueberlappen (Tomson 06.07.): die Clip-Rechtecke wurden
  // fuer eine andere Schrift getunt und lassen an DM-Sans-Glyphen Haarlinien-
  // Luecken (e/d/b). +M Einheiten rundum -> Nachbarteile ueberlappen an inneren
  // Schnitten (Luecke weg), aussen greift weiterhin der Ink-Clip. M in 120x140-
  // Glyphenraum; beim Auseinanderfliegen sind ~2/120 unsichtbar.
  const M = 2.4;
  const infl = rects.map((r) => [r[0] - M, r[1] - M, r[2] + 2 * M, r[3] + 2 * M]);
  ctx.save();
  ctx.beginPath();
  for (const r of infl) ctx.rect(r[0] * S, r[1] * S, r[2] * S, r[3] * S);
  ctx.clip();
  ctx.font = `600 ${100 * S}px ${fontFamily}`;
  ctx.fillStyle = fill; // Farbe egal fuer die Ink-BBox (nur Alpha zaehlt), aber konsistent halten
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
  const rectsSvg = infl.map((r) => `<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}"/>`).join("");
  const vb = `${minx / S} ${miny / S} ${w / S} ${h / S}`;
  const fam = fontFamily.replace(/"/g, "&quot;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="100%" height="100%" preserveAspectRatio="none" style="display:block;overflow:visible"><defs><clipPath id="${id}">${rectsSvg}</clipPath></defs><g clip-path="url(#${id})"><text x="10" y="100" font-family="${fam}" font-size="100" font-weight="600" fill="${fill}">${ch}</text></g></svg>`;
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
 *
 * letterFill steuert die Buchstaben-Fuellfarbe je Verwendungsort (Tomson 07.07.):
 * Default WORD_INK fuer den Hero (Tinte auf Hell), der Footer uebergibt #ffffff
 * (Weiss auf Navy). Der rote i-Punkt bleibt IMMER Markenrot — er leuchtet auf
 * beiden Untergruenden.
 */
export function buildWordLayout(fontFamily: string, F: number, dpr: number, letterFill: string = WORD_INK): WordLayout | null {
  const mcv = document.createElement("canvas");
  const mctx = mcv.getContext("2d")!;
  mctx.font = `600 100px ${fontFamily}`;
  const word = "red rabbit";
  const SPACE_EM = 0.18; // Wort-Abstand: eng (Variante C, Tomson 07.07.: 0.42 war zu weit)
  // Farben Variante C 07.07.: Buchstaben in Tinte, i-Punkt in Markenrot.
  const DOT_RED = "#f12032";
  // Trennhoehe i (empirisch, DM Sans 600, 120x140-Glyphraster; Canvas-Alpha-Probe):
  // Punkt-Ink 27.5..41.5, Stamm-Ink 49.5..99.8 -> Trennlinie mittig in die Luecke.
  const I_SPLIT = 45.5;
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
  // Rendert EIN Teil (Clip-Rechtecke + Farbe) an der aktuellen Advance-Position
  // und traegt es unter dem aktuellen Buchstaben-Index li in die Zeile ein.
  const emit = (ch: string, rects: number[][], fill: string): boolean => {
    const p = renderPiece(ch, rects, fontFamily, S, fill);
    if (!p) return false; // leeres Teil -> fail-closed
    const hx = adv + (p.minx - 10) * scale;
    const hy = baseY + (p.miny - 100) * scale;
    const w = p.w * scale, h = p.h * scale;
    raw.push({ svg: p.svg, hx, hy, w, h, letter: li });
    if (hx < minX) minX = hx;
    if (hx + w > maxX) maxX = hx + w;
    if (hy < minY) minY = hy;
    if (hy + h > maxY) maxY = hy + h;
    return true;
  };
  for (let ci = 0; ci < word.length; ci++) {
    const ch = word[ci];
    if (ch === " ") { adv += advOf(ch); continue; }
    // GANZE Buchstaben (Tomson 06.07.): kein Zerschneiden mehr. Die Fragment-
    // Clips (PIECES) waren fuer Fraunces getunt und schnitten an DM Sans quer
    // durch die Glyphen -> haessliche Splitter + Haarlinien-Sporne beim Burst.
    // Jeder Buchstabe ist EINE saubere Glyphe (ein Voll-Feld-Clip) in Tinte.
    // AUSNAHME i (Variante C+F 07.07.): zwei Teile am selben Buchstaben-Index —
    // Punkt (rot, oberes Clip-Rechteck) + Stamm (letterFill, unteres) -> der rote
    // Punkt fliegt im Morph als eigenes kleines Teil mit (zitiert das Hasen-Auge).
    if (ch === "i") {
      if (!emit("i", [[0, 0, 120, I_SPLIT]], DOT_RED)) return null;                // Punkt = rot (immer)
      if (!emit("i", [[0, I_SPLIT, 120, 140 - I_SPLIT]], letterFill)) return null; // Stamm = letterFill
    } else {
      if (!emit(ch, [[0, 0, 120, 140]], letterFill)) return null;
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
