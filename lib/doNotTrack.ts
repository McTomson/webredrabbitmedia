/**
 * Geraetebasierter "Do Not Track"-Schalter fuers eigene Team (Thomas 2026-08-12).
 *
 * Zweck: Eigenen Team-Traffic (z.B. Thomas' Besuche) an der QUELLE aus GA4, Google
 * Tag Manager und Microsoft Clarity ausschliessen — IP-unabhaengig, pro Geraet.
 * Wenn das Flag gesetzt ist, werden die Analytics-Skripte GAR NICHT initialisiert
 * (kein gtag/js, kein gtm.js, kein clarity.ms) — also nicht nur consent-denied
 * (Consent Mode v2 sendet bei denied trotzdem cookieless Pings), sondern NULL Hits.
 *
 * Aktivierung:   eine beliebige Seite mit ?rr_notrack=1 aufrufen (persistent gesetzt).
 * Deaktivierung: eine beliebige Seite mit ?rr_notrack=0 aufrufen (Opt-out rueckgaengig).
 *
 * Persistenz: localStorage-Key 'rr-notrack' = '1' (primaer) plus ein langlebiger
 * Cookie 'rr-notrack=1' (~1 Jahr) als Fallback fuer den Fall, dass localStorage
 * geleert/blockiert ist. Das Setzen/Loesen uebernimmt die NoTrackFlag-Komponente,
 * die Analytics-Komponenten LESEN nur via isDoNotTrack().
 */

export const NOTRACK_KEY = 'rr-notrack';
export const NOTRACK_PARAM = 'rr_notrack';
const NOTRACK_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // ~1 Jahr in Sekunden

/**
 * true, wenn dieses Geraet vom Tracking ausgeschlossen ist.
 * SSR-safe (typeof window Check + try/catch); prueft localStorage zuerst und faellt
 * bei geleertem/blockiertem localStorage auf den Cookie zurueck. Fail-open bei
 * Fehlern (im Zweifel tracken wie ein normaler Besucher).
 */
export function isDoNotTrack(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.localStorage.getItem(NOTRACK_KEY) === '1') return true;
  } catch {
    // localStorage blockiert/nicht verfuegbar -> Cookie-Fallback pruefen.
  }
  try {
    if (typeof document !== 'undefined') {
      return document.cookie
        .split(';')
        .some((c) => c.trim() === `${NOTRACK_KEY}=1`);
    }
  } catch {
    // ignore
  }
  return false;
}

/** Flag persistent setzen (localStorage + langlebiger Cookie). SSR-safe. */
export function enableDoNotTrack(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(NOTRACK_KEY, '1');
  } catch {
    // ignore
  }
  try {
    if (typeof document !== 'undefined') {
      document.cookie = `${NOTRACK_KEY}=1; Path=/; Max-Age=${NOTRACK_COOKIE_MAX_AGE}; SameSite=Lax`;
    }
  } catch {
    // ignore
  }
}

/** Flag entfernen (Opt-out rueckgaengig). SSR-safe. */
export function disableDoNotTrack(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(NOTRACK_KEY);
  } catch {
    // ignore
  }
  try {
    if (typeof document !== 'undefined') {
      document.cookie = `${NOTRACK_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
    }
  } catch {
    // ignore
  }
}
