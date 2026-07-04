import { Crimson_Pro, Fraunces, Instrument_Sans } from "next/font/google";

// Display-Serif: Fraunces (OFL) — bleibt fuer die Wortmarke ("red rabbit").
// Entscheidung 04.07.: KEIN Font-Kauf, nur freie Schriften.
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
