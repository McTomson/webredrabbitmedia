'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Blendet das alte Seiten-Chrome (Header/Footer aus dem Root-Layout) fuer den
 * Relaunch aus, damit Relaunch-Seiten NUR ihr eigenes Chrome zeigen
 * (RelaunchMenu + CornerLogo + FooterReassembly). Ausgeblendet wird:
 *  - jede /relaunch-preview-Route (Browser-URL zeigt den Pfad -> usePathname reicht)
 *  - der Test-Host v2.* (dort schreibt middleware.ts "/" intern auf /relaunch-preview
 *    um, die Browser-URL bleibt aber "/", daher zusaetzlich der Host-Check)
 *
 * Server/SSG blendet ueber den Pfad aus, Client zusaetzlich ueber den Host -> beide
 * Seiten liefern dieselbe Ausgabe: kein Flash, kein Hydration-Mismatch, kein
 * dynamisches Rendering. Die echte Live-Domain (web.redrabbit.media) bleibt komplett
 * unveraendert, weil dort weder der Pfad noch der Host greift.
 */
export default function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hide =
    (pathname?.startsWith('/relaunch-preview') ?? false) ||
    (typeof window !== 'undefined' && window.location.host.startsWith('v2.'));
  return hide ? null : <>{children}</>;
}
