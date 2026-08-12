'use client';

import { useEffect } from 'react';

/**
 * Microsoft Clarity, Consent-gesteuert (DSGVO).
 *
 * Laedt das Clarity-Script NUR nach Analytics-Zustimmung:
 *  - beim Mount, falls im localStorage bereits Zustimmung gespeichert ist
 *    (wiederkehrende Besucher), ODER
 *  - sobald der CookieBanner ein 'rr:consent'-Event mit analytics=true feuert.
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

function hasAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem('redrabbit-cookie-consent');
    if (!raw) return false;
    return JSON.parse(raw).analytics === true;
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

    if (hasAnalyticsConsent()) loadClarity(CLARITY_ID);

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
