"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Laedt die schwere three-spline-Companion-Buehne NUR auf Desktop (Perf, Thomas 04.08.).
// Auf Mobile/Tablet (hover:none ODER <900px) wird TalosCompanionStage GAR NICHT
// importiert -> kein three-spline-Bundle (~0.5 MB), keine WebGL-Init, kein
// Remote-Spline-Fetch. Deckt sich mit der dokumentierten Absicht der Buehne
// ("Mobil nur der Hero, Stationen aus"). Desktop unveraendert, nur der Ladezeit-
// punkt verschiebt sich (client-only, ssr:false) — die Buehne baut ihren Canvas
// ohnehin erst in useEffect auf.
const TalosCompanionStage = dynamic(() => import("./TalosCompanionStage"), {
  ssr: false,
});

export default function TalosCompanionStageLazy({
  stationsOnly = false,
}: {
  stationsOnly?: boolean;
}) {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(hover: none), (max-width: 899px)").matches) {
      setDesktop(true);
    }
  }, []);
  if (!desktop) return null;
  return <TalosCompanionStage stationsOnly={stationsOnly} />;
}
