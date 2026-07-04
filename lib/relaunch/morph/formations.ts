/**
 * Motiv-Formationen der 5 Leistungs-Szenen (Blaupause Sektion 3).
 * Jede Formation = Ziel-Punkte in einem normierten Raum (-0.5..0.5),
 * skaliert vom Aufrufer. Punkte folgen der Szenen-Logik aus dem Bauplan §6:
 * EIN strenges Ordnungssystem pro Motiv, aufrecht dominiert.
 */

export interface FormationPoint {
  x: number;
  y: number;
  /** Ziel-Rotation im Ruhezustand (Grad) — Kantenrichtung (at-Logik) */
  rot: number;
  /** relative Teilgroesse 0..1 (multipliziert Basis-Groesse) */
  s: number;
  /** Teil-Rolle: Kanten brauchen laengliche Teile, Punkte runde (at-Logik) */
  role?: "edge" | "dot";
}

/** Abstand zwischen Teil-Mitten im normierten Raum: dicht wie beim at-Original */
const SPACING = 0.052;

function ring(cx: number, cy: number, r: number, _n?: number, tangential = true): FormationPoint[] {
  const pts: FormationPoint[] = [];
  const n = Math.max(8, Math.round((Math.PI * 2 * r) / SPACING));
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const jitter = (((i * 7919) % 100) / 100 - 0.5) * 7;
    pts.push({
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r,
      rot: (tangential ? (a * 180) / Math.PI + 90 : 0) + jitter,
      s: 0.92 + 0.16 * ((i * 7919) % 100) / 100,
      role: "edge",
    });
  }
  return pts;
}

function lineSeg(x0: number, y0: number, x1: number, y1: number, _n?: number, rot?: number): FormationPoint[] {
  const pts: FormationPoint[] = [];
  const len = Math.hypot(x1 - x0, y1 - y0);
  const n = Math.max(2, Math.round(len / SPACING) + 1);
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const jitter = (((i * 104729) % 100) / 100 - 0.5) * 7;
    pts.push({ x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, rot: (rot ?? ang) + jitter, s: 0.92 + 0.16 * ((i * 104729) % 100) / 100, role: "edge" });
  }
  return pts;
}

/** 1 · Webdesign: Browser-Fenster (Rahmen + Kopfleiste + zwei Inhaltszeilen) */
export function browserFormation(): FormationPoint[] {
  const W = 0.72, H = 0.52, x = -W / 2, y = -H / 2;
  return [
    ...lineSeg(x, y, x + W, y, 9, 0),
    ...lineSeg(x, y + H, x + W, y + H, 9, 0),
    ...lineSeg(x, y + 0.09, x, y + H - 0.06, 4, 90),
    ...lineSeg(x + W, y + 0.09, x + W, y + H - 0.06, 4, 90),
    ...lineSeg(x + 0.05, y + 0.09, x + W - 0.05, y + 0.09, 7, 0),
    { x: x + 0.045, y: y + 0.045, rot: 0, s: 0.55, role: "dot" },
    { x: x + 0.085, y: y + 0.045, rot: 0, s: 0.55, role: "dot" },
    { x: x + 0.125, y: y + 0.045, rot: 0, s: 0.55, role: "dot" },
    ...lineSeg(x + 0.08, y + 0.2, x + W * 0.62, y + 0.2, 5, 0),
    ...lineSeg(x + 0.08, y + 0.3, x + W * 0.45, y + 0.3, 4, 0),
    ...lineSeg(x + 0.08, y + H - 0.12, x + 0.26, y + H - 0.12, 3, 0),
  ];
}

/** 2 · Google-Sichtbarkeit: Lupe (Ring + Griff) */
export function loupeFormation(): FormationPoint[] {
  return [
    ...ring(-0.08, -0.08, 0.26, 22, true),
    ...lineSeg(0.13, 0.13, 0.34, 0.34, 6, 45),
  ];
}

/** 3 · KI-Sichtbarkeit: Sprechblase mit drei Tipp-Punkten */
export function bubbleFormation(): FormationPoint[] {
  const W = 0.64, H = 0.42, x = -W / 2, y = -H / 2 - 0.04;
  return [
    ...lineSeg(x + 0.04, y, x + W - 0.04, y, 8, 0),
    ...lineSeg(x + 0.04, y + H, x + 0.16, y + H, 2, 0),
    ...lineSeg(x + 0.34, y + H, x + W - 0.04, y + H, 5, 0),
    ...lineSeg(x, y + 0.06, x, y + H - 0.06, 4, 90),
    ...lineSeg(x + W, y + 0.06, x + W, y + H - 0.06, 4, 90),
    // Sprech-Zipfel
    ...lineSeg(x + 0.2, y + H, x + 0.14, y + H + 0.12, 2, 65),
    ...lineSeg(x + 0.14, y + H + 0.12, x + 0.3, y + H, 3, -65),
    // drei Punkte (KI tippt)
    { x: -0.12, y: -0.06, rot: 0, s: 0.85, role: "dot" },
    { x: 0, y: -0.06, rot: 0, s: 0.85, role: "dot" },
    { x: 0.12, y: -0.06, rot: 0, s: 0.85, role: "dot" },
  ];
}

/** 4 · Content & KI-Artikel: Textseite (fuenf Zeilen, Flattersatz) */
export function articleFormation(): FormationPoint[] {
  const x = -0.3;
  return [
    ...lineSeg(x, -0.24, x + 0.42, -0.24, 6, 0),   // Headline (dicker: groessere s)
    ...lineSeg(x, -0.1, x + 0.6, -0.1, 7, 0),
    ...lineSeg(x, 0.02, x + 0.55, 0.02, 6, 0),
    ...lineSeg(x, 0.14, x + 0.6, 0.14, 7, 0),
    ...lineSeg(x, 0.26, x + 0.34, 0.26, 4, 0),
  ].map((p, i) => (i < 6 ? { ...p, s: p.s * 1.5 } : p));
}

/** 5 · Dashboard & Betreuung: Balken-Chart mit Aufwaerts-Pfeil */
export function chartFormation(): FormationPoint[] {
  const base = 0.3;
  const bars = [
    { x: -0.3, h: 0.16 },
    { x: -0.12, h: 0.26 },
    { x: 0.06, h: 0.38 },
    { x: 0.24, h: 0.5 },
  ];
  const pts: FormationPoint[] = [];
  for (const b of bars) {
    const n = Math.max(2, Math.round(b.h / 0.075));
    pts.push(...lineSeg(b.x, base - b.h, b.x, base, n, 90).map((p) => ({ ...p, s: p.s * 1.15 })));
  }
  // Pfeil
  pts.push(...lineSeg(-0.34, 0.12, 0.3, -0.34, 7, undefined));
  pts.push(...lineSeg(0.3, -0.34, 0.18, -0.34, 2, 0));
  pts.push(...lineSeg(0.3, -0.34, 0.3, -0.22, 2, 90));
  return pts;
}

export const FORMATIONS: { key: string; eyebrow: string; statement: string; build: () => FormationPoint[] }[] = [
  { key: "webdesign", eyebrow: "Webdesign", statement: "Deine Website ist dein bester Verkäufer. Wir bauen sie so, dass man dir Premium zutraut.", build: browserFormation },
  { key: "google", eyebrow: "Google-Sichtbarkeit", statement: "Wer dich sucht, findet dich. Wer dich noch nicht kennt, findet dich zuerst.", build: loupeFormation },
  { key: "ki", eyebrow: "KI-Sichtbarkeit", statement: "Wenn jemand die KI nach dem besten Betrieb der Region fragt, soll die Antwort dein Name sein.", build: bubbleFormation },
  { key: "content", eyebrow: "Content & KI-Artikel", statement: "Deine Website schreibt selbst. Jede Woche neue Beiträge, die ranken.", build: articleFormation },
  { key: "dashboard", eyebrow: "Dashboard & Betreuung", statement: "Du siehst jederzeit, was deine Website verdient. Im Hintergrund arbeitet sie von selbst.", build: chartFormation },
];
