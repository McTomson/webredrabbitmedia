import { Fraunces, Instrument_Sans } from "next/font/google";

// Display-Serif: Fraunces (OFL, Heldane-artig bei hoher optischer Groesse).
// Entscheidung 04.07.: KEIN Font-Kauf, nur freie Schriften.
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

// UI-Grotesk: Instrument Sans (OFL) fuer Eyebrows, Navigation, Meta, Formulare.
export const grotesk = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});
