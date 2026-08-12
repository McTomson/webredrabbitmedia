'use client';

import { useEffect } from 'react';
import {
  NOTRACK_PARAM,
  enableDoNotTrack,
  disableDoNotTrack,
} from '@/lib/doNotTrack';

/**
 * Geraetebasierter "Do Not Track"-Schalter fuers eigene Team (Thomas 2026-08-12).
 *
 * Liest den URL-Parameter ?rr_notrack und schreibt das persistente Flag:
 *   ?rr_notrack=1 -> Flag setzen  (dieses Geraet aus GA4/GTM/Clarity ausschliessen)
 *   ?rr_notrack=0 -> Flag loeschen (Opt-out rueckgaengig, Tracking wieder aktiv)
 *
 * Wird global im Root-Layout gemountet und VOR den Analytics-Komponenten
 * (DeferredThirdParties, ClarityLoader) platziert, damit dieser Effect zuerst
 * laeuft und das Flag steht, bevor die Analytics-Komponenten es via isDoNotTrack()
 * lesen. Rendert nichts; nur clientseitiger Nebeneffekt (keine Hydration-Mismatches).
 */
export default function NoTrackFlag() {
  useEffect(() => {
    try {
      const value = new URLSearchParams(window.location.search).get(NOTRACK_PARAM);
      if (value === '1') enableDoNotTrack();
      else if (value === '0') disableDoNotTrack();
    } catch {
      // Kein window/URL -> ignorieren (fail-open, normaler Besucher).
    }
  }, []);

  return null;
}
