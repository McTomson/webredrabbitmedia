'use client';

import { useEffect } from 'react';
import { isDoNotTrack } from '@/lib/doNotTrack';

/**
 * Microsoft Clarity, Consent-gesteuert (DSGVO) — OPT-OUT-Modell.
 *
 * Bewusste Entscheidung Thomas (2026-08-12): NICHT auf Opt-in zuruecksetzen.
 * Clarity laedt standardmaessig SOFORT beim Mount — AUSSER es liegt eine
 * explizite Ablehnung im localStorage (analytics === false). Also:
 *  - keine gespeicherte Wahl  -> laden (Default-on),
 *  - gespeicherte Zustimmung  -> laden,
 *  - gespeicherte ABLEHNUNG   -> NICHT laden.
 * Zusaetzlich reagiert der 'rr:consent'-Listener live: analytics=true laedt
 * (falls noch nicht geladen), analytics=false widerruft die Einwilligung
 * (clarity('consent', false)) — der Ablehn-Weg stoppt Clarity also wirklich.
 *
 * Projekt-ID kommt aus NEXT_PUBLIC_CLARITY_ID, mit Fallback auf die
 * produktive Projekt-ID "y0xaxw5gux" (Repo-Standard, analog zu den fest
 * hinterlegten GA4/GTM-IDs). Nach dem Laden signalisiert clarity('consent')
 * die erteilte Einwilligung (Clarity Consent-API).
 */

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || 'y0xaxw5gux';

/**
 * Opt-out-Gate: Clarity darf laden, SOLANGE keine explizite Ablehnung vorliegt.
 * Nur eine gespeicherte Wahl mit analytics === false blockt das Laden; alles
 * andere (keine Wahl / Zustimmung) erlaubt es. Bei kaputtem localStorage
 * fail-open (Default-on gemaess Opt-out-Entscheidung).
 */
function analyticsBlocked(): boolean {
  try {
    const raw = localStorage.getItem('redrabbit-cookie-consent');
    if (!raw) return false;
    return JSON.parse(raw).analytics === false;
  } catch {
    return false;
  }
}

let injected = false;

function loadClarity(id: string) {
  if (injected || typeof window === 'undefined') return;
  injected = true;
  // Offizielles Clarity-Bootstrap-Snippet (Queue-Stub, bis das Tag-Script laedt).
  if (!window.clarity) {
    const stub = function (...args: unknown[]) {
      (stub.q = stub.q || []).push(args);
    } as ((...args: unknown[]) => void) & { q?: unknown[][] };
    window.clarity = stub;
  }
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.clarity.ms/tag/' + id;
  document.head.appendChild(script);
  // Consent-Signal an Clarity (Nutzer hat Analytics zugestimmt).
  window.clarity('consent');
}

export default function ClarityLoader() {
  useEffect(() => {
    if (!CLARITY_ID) return;

    // Do-Not-Track fuers Team (Thomas 2026-08-12): Ist das Geraete-Flag gesetzt
    // (?rr_notrack=1), wird Clarity GAR NICHT geladen (kein clarity.ms) und auch
    // nicht per Consent-Event nachgeladen — NULL Hits von diesem Geraet.
    // Deaktivierung via ?rr_notrack=0.
    if (isDoNotTrack()) return;

    // Opt-out: sofort laden, ausser es liegt eine explizite Ablehnung vor.
    if (!analyticsBlocked()) loadClarity(CLARITY_ID);

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<{ analytics?: boolean }>).detail;
      if (detail?.analytics) loadClarity(CLARITY_ID);
      else if (window.clarity) window.clarity('consent', false);
    };
    window.addEventListener('rr:consent', onConsent as EventListener);
    return () => window.removeEventListener('rr:consent', onConsent as EventListener);
  }, []);

  return null;
}
