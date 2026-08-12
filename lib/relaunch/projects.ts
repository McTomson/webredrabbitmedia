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

// ------------------------------------------------------------
// Sphaeren-Galerie (phantom.land-Look, 15.07.): die 7 Projekte
// mit vorhandenen Screenshot-Karten unter public/relaunch/referenzen/cards/.
// Namen/Kategorien/Links == freigegebener Stand der Hasen-Seite (ReferenzenLauf).
// ------------------------------------------------------------

export type SphereProject = {
  slug: string;
  name: string;
  cat: string;
  href: string;
  img: string; // public-Pfad zum Screenshot (960px breit, WebP)
  img2?: string; // zweite Ansicht (Unterseite/Sektion) — verdoppelt die Kachel-Vielfalt
  domain: string; // Anzeige-Name der Website (Label oben rechts in der Zelle)
  tags: string[]; // max 3 Leistungs-/Branchen-Tags (Pills unten links)
  // Hover-Tint der Zelle, passend zur Markenfarbe der Kundenseite.
  // Quelle: dominante gesaettigte Farbe aus dem echten Screenshot gesampelt
  // (sharp-Histogramm 15.07.2026), visuell gegen die Live-Site abgeglichen.
  hoverColor: string;
  loop?: string; // optionaler Scroll-Video-Loop (mp4) — nur ein Teil der Zellen bewegt sich
};

export const SPHERE_PROJECTS: SphereProject[] = [
  { slug: "thermewarten", name: "Thermewarten", cat: "Thermenwartung Wien", href: "https://thermewarten.at", img: "/relaunch/referenzen/cards/thermewarten.webp", img2: "/relaunch/referenzen/cards/thermewarten-2.webp", domain: "thermewarten.at", tags: ["WEBSITE", "DESIGN", "WARTUNG"], hoverColor: "#14444c", loop: "/relaunch/referenzen/loops/thermewarten.mp4" },
  { slug: "lashesbydanesh", name: "LashesbyDanesh", cat: "Beauty-Studio", href: "https://lashesbydanesh.at", img: "/relaunch/referenzen/cards/lashesbydanesh.webp", img2: "/relaunch/referenzen/cards/lashesbydanesh-2.webp", domain: "lashesbydanesh.at", tags: ["WEBSITE", "DESIGN", "BEAUTY"], hoverColor: "#6b4326", loop: "/relaunch/referenzen/loops/lashesbydanesh.mp4" },
  { slug: "la-morra", name: "Ristorante La Morra", cat: "Gastronomie", href: "https://pizza-4.vercel.app", img: "/relaunch/referenzen/cards/la-morra.webp", img2: "/relaunch/referenzen/cards/la-morra-2.webp", domain: "pizza-4.vercel.app", tags: ["WEBSITE", "DESIGN", "GASTRO"], hoverColor: "#7a4a1c", loop: "/relaunch/referenzen/loops/la-morra.mp4" },
  { slug: "almtal-invest", name: "Almtal Invest", cat: "Immobilien-Investment", href: "https://almtal-invest.vercel.app", img: "/relaunch/referenzen/cards/almtal-invest.webp", img2: "/relaunch/referenzen/cards/almtal-invest-2.webp", domain: "almtal-invest.vercel.app", tags: ["WEBSITE", "DESIGN", "IMMOBILIEN"], hoverColor: "#35446a", loop: "/relaunch/referenzen/loops/almtal-invest.mp4" },
  { slug: "rero-heizsysteme", name: "ReRo Heizsysteme", cat: "Heizungstechnik", href: "https://heating-systems.at", img: "/relaunch/referenzen/cards/rero-heizsysteme.webp", img2: "/relaunch/referenzen/cards/rero-heizsysteme-2.webp", domain: "heating-systems.at", tags: ["WEBSITE", "DESIGN", "HEIZUNG"], hoverColor: "#b5501f", loop: "/relaunch/referenzen/loops/rero-heizsysteme.mp4" },
  { slug: "k2-dach-bau", name: "K2 Dach & Bau", cat: "Dach & Bau", href: "https://k2-dream-builder.vercel.app", img: "/relaunch/referenzen/cards/k2-dach-bau.webp", img2: "/relaunch/referenzen/cards/k2-dach-bau-2.webp", domain: "k2-dream-builder.vercel.app", tags: ["WEBSITE", "DESIGN", "BAU"], hoverColor: "#4a6288", loop: "/relaunch/referenzen/loops/k2-dach-bau.mp4" },
  { slug: "global-insights", name: "Global Insights", cat: "Beratung", href: "https://ruderes-insights.at", img: "/relaunch/referenzen/cards/global-insights.webp", img2: "/relaunch/referenzen/cards/global-insights-2.webp", domain: "ruderes-insights.at", tags: ["WEBSITE", "DESIGN", "BERATUNG"], hoverColor: "#a37450", loop: "/relaunch/referenzen/loops/global-insights.mp4" },
];

// Die fruehere Farbkachel-Vorstufe (TILE_COLORS/TILES, P2b) wurde am 15.07.2026
// durch SPHERE_PROJECTS mit echten Screenshots ersetzt und entfernt
// (Simplify-Review: tote Exporte). Historie: git log lib/relaunch/projects.ts.
