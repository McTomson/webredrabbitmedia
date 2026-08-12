/**
 * Eigen-KOMPONIERTE Formationen aus unseren 18 Fraunces-Teilen (Befund 04.07.:
 * vermessene at-Slots + fremde Teil-Formen = Chaos; Motive muessen fuer UNSER
 * Material komponiert werden). Bau-Regeln pro Motiv:
 * - KONTUR dominiert: laengliche Teile als Perlenkette ENTLANG der Linie
 *   (tangential ausgerichtet), enge Abstaende, grosse Teile.
 * - Struktur-Merkmale klar: Zaehne, Loch, Strahlen — das, woran man das
 *   Motiv aus drei Schritten Entfernung erkennt (Pergament-Regel).
 * - Innenfuellung sparsam, kleiner, damit die Kontur fuehrt.
 * Koordinaten normiert: Motiv-Raum, 1 = Motiv-Hoehe; Aufrufer skaliert.
 */

export interface ComposedSlot {
  x: number;
  y: number;
  /** Rotation der Teil-Laengsachse in Grad */
  rot: number;
  /** Teil-Laenge (Major) relativ zur Motiv-Hoehe */
  size: number;
  /** bevorzugte Teil-Klasse */
  kind: "bar" | "curve" | "dot";
}

const D2 = (a: number) => (a * 180) / Math.PI;

/** Perlenkette entlang eines Kreisbogens: tangential liegende Teile. */
function ringChain(
  cx: number, cy: number, r: number,
  size: number, gapFactor: number,
  kind: ComposedSlot["kind"],
  a0 = 0, a1 = Math.PI * 2, jitter = 0.05
): ComposedSlot[] {
  const slots: ComposedSlot[] = [];
  const arc = (a1 - a0) * r;
  const step = size * (1 + gapFactor);
  const n = Math.max(3, Math.round(arc / step));
  for (let i = 0; i < n; i++) {
    const a = a0 + ((i + 0.5) / n) * (a1 - a0);
    const jr = r * (1 + (((i * 7919) % 100) / 100 - 0.5) * jitter);
    slots.push({
      x: cx + Math.cos(a) * jr,
      y: cy + Math.sin(a) * jr,
      rot: D2(a) + 90 + (((i * 104729) % 100) / 100 - 0.5) * 14,
      size,
      kind,
    });
  }
  return slots;
}

/** Ein Zahnrad: Zahnkranz (radiale Balken) + Aussenring-Kette + Innenring +
 *  leeres Nabenloch + sparsame Fuellung zwischen den Ringen. */
function gear(cx: number, cy: number, R: number, teeth: number, phase = 0): ComposedSlot[] {
  const slots: ComposedSlot[] = [];
  // Zaehne: kraeftige Balken, radial, direkt am Kranz (das wichtigste Merkmal)
  for (let i = 0; i < teeth; i++) {
    const a = phase + (i / teeth) * Math.PI * 2;
    slots.push({
      x: cx + Math.cos(a) * R * 0.99,
      y: cy + Math.sin(a) * R * 0.99,
      rot: D2(a),           // Laengsachse radial
      size: R * 0.3,
      kind: "bar",
    });
  }
  // Aussenring: dichte tangentiale Kette (der Kreis, den man lesen soll)
  slots.push(...ringChain(cx, cy, R * 0.8, R * 0.3, 0.18, "curve"));
  // Innenring um die Nabe
  slots.push(...ringChain(cx, cy, R * 0.38, R * 0.22, 0.3, "curve"));
  // sparsame Fuellung zwischen den Ringen (kleiner, versetzt)
  slots.push(...ringChain(cx, cy, R * 0.6, R * 0.16, 0.85, "dot", 0.3, Math.PI * 2 + 0.3, 0.12));
  return slots;
}

/** 1 · Zwei ineinandergreifende Zahnraeder (gross unten links, klein oben rechts). */
export function gearsComposition(): ComposedSlot[] {
  const big = gear(-0.17, 0.15, 0.34, 10, 0.12);
  // kleines Rad weiter abgerueckt, damit die Zahnkraenze sich beruehren
  // statt zu ueberschneiden (Verzahnung lesbar)
  const small = gear(0.37, -0.29, 0.23, 8, 0.42);
  return [...big, ...small];
}

/** Groesster sinnvoller Slot-Bestand fuer Pool-Berechnungen. */
export const COMPOSED: { key: string; build: () => ComposedSlot[] }[] = [
  { key: "gears", build: gearsComposition },
];
