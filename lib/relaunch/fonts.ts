import { Crimson_Pro, DM_Sans, Fraunces, Instrument_Sans } from "next/font/google";

// Display-Sans: DM Sans (OFL) — Wortmarke ("red rabbit") UND alle Headlines.
// Entscheidung 06.07. (Tomson): ersetzt Fraunces im Display-Slot. Das echte
// Marken-Wortbild ist ein fetter geometrischer Sans (nebeneinander), DM Sans ist
// der naechste freie Treffer, der zugleich als Fliesstext-Headline taugt. Variabel
// geladen (wght-Achse) -> font-weight:700 (Bold) greift per CSS. Spec: DESIGN.md §3.1.
export const dmsans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
  display: "swap",
});

// Display-Serif: Fraunces (OFL) — ausgemustert aus dem Display-Slot (06.07.), noch
// importiert falls Alt-Referenzen darauf zeigen. Nicht mehr fuer die Wortmarke.
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

// Lese-Serif fuer Statements/Claims: Crimson Pro (OFL). Visueller Vergleich
// 05.07. gegen das at-Original (Heldane, kommerziell/Klim): beide Kis-Antiqua-
// Abkoemmlinge — Crimson Pro w500 ist der naechste freie Doppelgaenger
// (Fraunces war als Modeschrift-Didone sichtbar die falsche Gattung).
export const crimson = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
});

// UI-Grotesk: Instrument Sans (OFL) fuer Eyebrows, Navigation, Meta, Formulare.
export const grotesk = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});
