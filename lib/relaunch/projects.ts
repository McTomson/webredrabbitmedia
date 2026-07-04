// Referenz-Projekte fuer die Kugel-Galerie (P2b) + die crawlbare SEO-Liste.
// Quelle: Tomson-Freigabe 04.07.2026 (RELAUNCH_PLAN, Abschnitt "Tomson liefert").
// REGEL: keine erfundenen Zahlen/Claims. Links nur, wo die Domain gesichert ist;
// bei ungesicherter Domain KEIN Link (fail-closed, nicht raten).

export type Project = {
  name: string;
  line: string; // neutraler Einzeiler, keine Claims/Zahlen
  href?: string; // nur gesicherte Domains
};

// Neutraler Kategorie-Einzeiler, deterministisch rotiert (kein faktischer Anspruch).
const LINES = [
  "Website & Sichtbarkeit",
  "Website & digitaler Auftritt",
  "Website & Auffindbarkeit",
];

// Die 10 realen Referenzen. Reihenfolge = Nennung in der Freigabe.
export const BASE_PROJECTS: Project[] = [
  // Domain verifiziert 05.07.: thermewarten.at ist unsere Site (thermenwartung.at gehoert allgas.at!)
  { name: "thermewarten.at", line: LINES[0], href: "https://thermewarten.at" },
  { name: "lashesbydanesh.at", line: LINES[1], href: "https://lashesbydanesh.at" },
  // Domain von Tomson 05.07. genannt + verifiziert (Titel: Tree House Apartments, Salzkammergut)
  { name: "Almtal Invest", line: LINES[2], href: "https://almtal-invest.vercel.app" },
  { name: "rero", line: LINES[0] },
  { name: "rero-michael", line: LINES[1] },
  { name: "La Morra", line: LINES[2] },
  { name: "Tino Jugler", line: LINES[0] },
  { name: "Global Insights", line: LINES[1] },
  { name: "K2 / villagegardencondo", line: LINES[2] },
  { name: "web.redrabbit.media", line: LINES[0], href: "https://web.redrabbit.media" },
];

// Case-Farbwelten fuer die Kacheln (rotierend, aus dem Design-System).
// Text-/Akzentfarbe je Flaeche fuer ausreichenden Kontrast mitgefuehrt.
export type TileColor = { bg: string; text: string; accent: string };

export const TILE_COLORS: TileColor[] = [
  { bg: "#0b3f3b", text: "#f4f4f2", accent: "#ffd784" }, // --rr-world-1-bg
  { bg: "#17181d", text: "#f4f4f2", accent: "#f12032" }, // --rr-dark
  { bg: "#f3e8e4", text: "#23262e", accent: "#8c2f42" }, // --rr-world-3-bg
  { bg: "#f4f4f2", text: "#23262e", accent: "#f12032" }, // --rr-surface
];

export type Tile = Project & { colorIndex: number };

export const TILE_COUNT = 40;

// Basis-Liste bis TILE_COUNT wiederholen (ausdruecklich erlaubt),
// Farbwelt rotiert unabhaengig vom Projekt.
export const TILES: Tile[] = Array.from({ length: TILE_COUNT }, (_, i) => {
  const base = BASE_PROJECTS[i % BASE_PROJECTS.length];
  return { ...base, colorIndex: i % TILE_COLORS.length };
});
