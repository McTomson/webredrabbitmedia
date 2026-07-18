import type { Metadata } from "next";
import TalosSplineDemo from "@/components/relaunch/talos/TalosSplineDemo";

export const metadata: Metadata = {
  title: "Talos Fidelity-Demo",
  robots: { index: false, follow: false },
};

export default function TalosDemoPage() {
  return <TalosSplineDemo />;
}
