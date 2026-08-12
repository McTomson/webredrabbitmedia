'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { isRelaunchPath } from '@/lib/relaunch/routes';

/**
 * Blendet das alte Seiten-Chrome (Header/Footer aus dem Root-Layout) auf den
 * Relaunch-Seiten aus, damit diese NUR ihr eigenes Chrome zeigen
 * (RelaunchMenu + CornerLogo + FooterReassembly). Nach dem Go-Live-Tausch liegen
 * die Relaunch-Seiten auf den finalen Root-Pfaden (siehe lib/relaunch/routes.ts).
 *
 * Rein pfadbasiert -> Server (SSG) und Client liefern dieselbe Ausgabe: kein
 * Flash, kein Hydration-Mismatch, kein dynamisches Rendering.
 */
export default function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return isRelaunchPath(pathname) ? null : <>{children}</>;
}
