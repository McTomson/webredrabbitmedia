"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import WebsiteDemoClient from "@/components/subpages/WebsiteDemoClient";
import MobileVideoHero from "./MobileVideoHero";

/**
 * Hero-Weiche (Thomas 02.08.): auf Handy/Tablet das Video, am Desktop der
 * bestehende interaktive Canvas-Hero. Ziel: Desktop bit-identisch, und auf
 * Mobile darf die schwere Demo-Engine gar nicht erst booten.
 *
 * Mechanik: SSR + erster Client-Render = Desktop-Demo (echter Inhalt fuer SEO,
 * Desktop-User sehen sofort den Canvas, keine Hydration-Diskrepanz). Ein
 * isomorpher Layout-Effekt (vor dem Paint) prueft den Viewport und schaltet auf
 * Mobile um, BEVOR etwas gemalt wird -> kein Flash; die Demo-Komponente
 * unmountet vor ihrem passiven Effekt, die Engine bootet mobil also nie.
 */

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
const MOBILE_QUERY = "(max-width: 820px)";

export default function WebsiteHeroSwitch({
  css,
  html,
  js,
  videoSrc,
}: {
  css: string;
  html: string;
  js: string;
  videoSrc: string;
}) {
  // null = SSR/pending -> Desktop-Zweig (SEO-sicher). Nach Mount echte Wahl.
  const [mobile, setMobile] = useState<boolean | null>(null);

  useIsoLayoutEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (mobile) {
    return <MobileVideoHero src={videoSrc} />;
  }

  // Desktop (und SSR/pending): unveraendert wie bisher.
  return (
    <div data-rr-snap-exempt data-rr-snap>
      <WebsiteDemoClient css={css} html={html} js={js} />
    </div>
  );
}
