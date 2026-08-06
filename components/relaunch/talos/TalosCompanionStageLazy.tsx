"use client";

import dynamic from "next/dynamic";

// Laedt TalosCompanionStage per dynamic(ssr:false) -> three-spline (~0.5 MB)
// liegt NICHT im Initial-Bundle, sondern in einem eigenen, nachgeladenen Chunk
// (Perf, desktop-sicher; die Buehne baut ihren Canvas ohnehin erst in useEffect).
// Talos wird auf ALLEN Viewports gerendert (Thomas 06.08.: "Talos soll angezeigt
// werden"); die Buehne selbst regelt ihr Mobile-Verhalten intern (Hero-Modus).
const TalosCompanionStage = dynamic(() => import("./TalosCompanionStage"), {
  ssr: false,
});

export default function TalosCompanionStageLazy({
  stationsOnly = false,
}: {
  stationsOnly?: boolean;
}) {
  return <TalosCompanionStage stationsOnly={stationsOnly} />;
}
