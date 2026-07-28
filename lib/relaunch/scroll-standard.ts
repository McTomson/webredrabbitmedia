/**
 * SCROLL-STANDARD — zentrale Konstanten und Helfer fuer alle Bumper-,
 * Pan- und Sticky-Step-Strecken des Relaunch.
 *
 * Kanonische Quelle: docs/DESIGN_STANDARD.md, Abschnitt "Scroll & Bumper".
 * Kundenentscheidung (Thomas, 28.07.) woertlich:
 *   "Bumper (1 Scroll = 1 Fenster, stoppt, 2 Fenster = 2x scrollen) gilt
 *    ueberall fuer kurze Display-Inhalte. Sobald ein Fenster einen langen
 *    Absatz hat, bekommt es mehr Dwell-Zeit bzw. laeuft frei. Ueberall
 *    dieselbe Uebergangs-Geschwindigkeit und Easing-Kurve."
 *
 * Herkunft der Zahlen:
 * - 1 Fenster ~ 1 Viewport Scroll-Strecke: GSAP-Heuristik fuer horizontale
 *   Pin-Strecken (ein Viewport Scroll pro Panel, sonst fuehlt sich der Pan
 *   entweder gehetzt oder endlos an). Der Aufschlag auf 190vh entsteht durch
 *   den Dwell: nur ~20% der Etappe sind Uebergang, ~80% Standbild.
 * - Uebergangsdauer 100-400ms: NN/g ("Animation Duration and Motion"), darum
 *   ist das Uebergangsfenster schmal (DWELL_WIDTH) und die Easing eine
 *   smoothstep-Kurve statt linear.
 * - NN/g-Regel, die hier haerter wiegt als alles andere: Fliesstext darf nie
 *   in einem Snap gefangen sein. Fenster mit langem Absatz bekommen darum
 *   entweder eine eigene, volle Etappe (Standbild lange genug zum Lesen) oder
 *   laufen ganz frei (kein Snap).
 *
 * Referenz-Implementierung der Mathe: components/relaunch/CasePanels.tsx.
 */

/**
 * Scroll-Strecke pro Bumper-/Pan-Fenster in vh. Track-Hoehe = N * diesen Wert.
 * 190vh = ~1 Viewport Standbild (Dwell) + ~1 Viewport Uebergangs-Reserve,
 * abzueglich der 100vh, die der Sticky-Pin selbst belegt.
 */
export const BUMPER_TRACK_VH_PER_WINDOW = 190;

/**
 * Beginn des Uebergangs innerhalb einer Etappe (0..1). Bis 0.4 steht das
 * Fenster still.
 */
export const DWELL_START = 0.4;

/**
 * Breite des Uebergangsfensters innerhalb einer Etappe (0..1). 0.2 = der
 * Wechsel passiert im mittleren Fuenftel, danach steht das naechste Fenster
 * wieder still. Zusammen mit BUMPER_TRACK_VH_PER_WINDOW ergibt das bei
 * normalem Scrolltempo einen Uebergang im NN/g-Fenster von 100-400ms.
 */
export const DWELL_WIDTH = 0.2;

/**
 * Scroll-Strecke pro Schritt bei DISKRETEN Sticky-Step-Szenen (Kreis-Ketten,
 * Karten-Stapel), bei denen der Wechsel eine CSS-Blende ist und nicht ein
 * scroll-gekoppelter Pan. Hier gilt "1 Scroll = 1 Schritt" woertlich: eine
 * Viewport-Hoehe pro Schritt, ohne Dwell-Aufschlag, weil das Standbild
 * ohnehin die ganze Etappe haelt und der Absatz nie im Snap haengt.
 */
export const STEP_TRACK_VH_PER_STEP = 100;

/**
 * Einheitliche Uebergangsdauer fuer CSS-Blenden (ms). Mitte des von NN/g
 * empfohlenen Korridors 100-400ms.
 */
export const TRANSITION_MS = 300;

/** Einheitliche Easing-Kurve fuer CSS-Uebergaenge (Pendant zu smoothstep). */
export const TRANSITION_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

/**
 * Ab hier abwaerts degradieren Bumper und Pan zu normalem vertikalem Scrollen
 * (Kundenentscheidung 28.07.). Muster: der bestehende reduced-motion-Fallback
 * wird einfach mit-getriggert.
 */
export const MOBILE_BREAKPOINT = 820;

/** smoothstep: weiche 0->1-Kurve ohne Sprung an den Raendern. */
export function smoothstep(x: number): number {
  const t = x < 0 ? 0 : x > 1 ? 1 : x;
  return t * t * (3 - 2 * t);
}

/**
 * Snap-Dwell-Mathe der Referenz (CasePanels): rechnet den linearen
 * Track-Fortschritt in "Fenster-Einheiten" um, die pro Fenster stehen bleiben
 * und nur im schmalen Uebergangsfenster weiterlaufen.
 *
 * @param seg  linearer Fortschritt in Etappen, also p * (N - 1)
 * @param n    Anzahl der Fenster
 * @returns    Fenster-Einheiten in [0, n-1], zum Multiplizieren mit der
 *             Fenster-Breite/Hoehe
 */
export function snapUnits(seg: number, n: number): number {
  if (n <= 1) return 0;
  const i = Math.min(n - 2, Math.floor(seg));
  const f = seg - i; // 0..1 innerhalb der Etappe
  return i + smoothstep((f - DWELL_START) / DWELL_WIDTH);
}

/**
 * Wahr, wenn die aufwendige Scroll-Mechanik durch normales vertikales
 * Scrollen ersetzt werden soll: schmaler Viewport oder reduzierte Bewegung.
 * Nur im Browser aufrufen (nach Mount).
 *
 * @param breakpoint Optional strengere Breite als MOBILE_BREAKPOINT, falls das
 *                   Layout einer Strecke schon frueher bricht.
 */
export function isBumperDegraded(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return (
    window.matchMedia(`(max-width: ${breakpoint}px)`).matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
