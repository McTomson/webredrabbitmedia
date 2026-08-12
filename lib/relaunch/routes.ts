/**
 * Erkennt die Relaunch-Seiten am Root-Pfad (nach dem Go-Live-Tausch). Vor dem
 * Tausch lagen sie unter /relaunch-preview/*; jetzt tragen sie die finalen
 * Root-Pfade. Das alte Seiten-Chrome (Header/Footer/AOS aus dem Root-Layout)
 * blendet sich auf diesen Pfaden aus, damit die Relaunch-Seiten NUR ihr eigenes
 * Chrome zeigen (RelaunchMenu + CornerLogo + FooterReassembly).
 *
 * Rein pfadbasiert -> Server (SSG) und Client liefern dieselbe Ausgabe: kein
 * Flash, kein Hydration-Mismatch. Interne Test-/Dev-Seiten (/styleguide,
 * /design-system, /morph-lab, /sculpture-test) und /dashboard sind bewusst NICHT
 * enthalten und behalten ihr bisheriges Verhalten.
 */
const RELAUNCH_EXACT = new Set([
  '/',
  '/kontakt',
  '/faq',
  '/ueber-uns',
  '/preise',
  '/impressum',
  '/datenschutz',
  '/agb',
  '/cookie-einstellungen',
  '/referenzen',
  '/tipps',
  '/leistungen',
  '/leistungen-hub',
  '/menue-varianten',
  '/talos-demo',
  '/talos-entrance',
  '/talos-intro',
]);

const RELAUNCH_PREFIX = ['/referenzen/', '/tipps/', '/leistungen/', '/webdesign-'];

export function isRelaunchPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  if (RELAUNCH_EXACT.has(pathname)) return true;
  return RELAUNCH_PREFIX.some((p) => pathname.startsWith(p));
}
