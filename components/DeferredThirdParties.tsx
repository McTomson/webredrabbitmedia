'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

/**
 * Laedt GA4 + GTM erst NACH dem kritischen Ladefenster (Thomas 06.08., Mobile-Perf).
 *
 * Grund: @next/third-parties mountet GA/GTM per Default mit strategy="afterInteractive"
 * -> ~283 KB Analytics-JS (grossteils ungenutzt) laufen direkt nach der Hydration und
 * blockieren den Main-Thread waehrend des Ladens (Script Evaluation ~3,8 s, TBT hoch,
 * LCP-Render-Delay). Das drueckt den (simulierten) PageSpeed-Score massiv.
 *
 * Loesung: Analytics erst bei erster Nutzer-Interaktion ODER 3 s nach window.load laden.
 * Keine Events gehen verloren — AnalyticsListener pusht via sendGAEvent in den dataLayer,
 * der beim spaeteren Laden geflusht wird. Keine visuelle Aenderung.
 */
export default function DeferredThirdParties({ gaId, gtmId }: { gaId: string; gtmId: string }) {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (load) return;
    let done = false;
    let timer = 0;
    const evs = ['scroll', 'pointerdown', 'keydown', 'touchstart', 'mousemove'];
    const trigger = () => {
      if (done) return;
      done = true;
      evs.forEach((e) => window.removeEventListener(e, trigger));
      window.clearTimeout(timer);
      setLoad(true);
    };
    evs.forEach((e) => window.addEventListener(e, trigger, { once: true, passive: true }));
    // Fallback fuer Sitzungen ohne Interaktion (Bounce, Bots, Analytics-Vollstaendigkeit):
    // 3 s nach dem load-Event laden — sicher hinter FCP/LCP/TTI, zaehlt nicht in TBT.
    const arm = () => { timer = window.setTimeout(trigger, 3000); };
    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm, { once: true });
    return () => {
      evs.forEach((e) => window.removeEventListener(e, trigger));
      window.removeEventListener('load', arm);
      window.clearTimeout(timer);
    };
  }, [load]);

  if (!load) return null;
  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      <GoogleTagManager gtmId={gtmId} />
    </>
  );
}
