import type { Metadata } from "next";
import TalosPresentation from "@/components/relaunch/talos/TalosPresentation";
import { crimson, dmsans, grotesk } from "@/lib/relaunch/fonts";
import "@/app/styleguide/styleguide.css";

export const metadata: Metadata = {
  title: "Talos Praesentation (Prototyp)",
  robots: { index: false, follow: false },
};

const rrFonts = `rr ${dmsans.variable} ${grotesk.variable} ${crimson.variable}`;

export default function TalosIntroPage() {
  return (
    <div className={rrFonts} style={{ background: "#ffffff" }}>
      <TalosPresentation />
    </div>
  );
}
