"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import dynamic from "next/dynamic";
import { sendGAEvent } from "@next/third-parties/google";
import type { LeadOpenOpts } from "@/lib/relaunch/leadPresets";

// Lazy: der Dialog (und sein styleguide.css) laedt erst, wenn das Popup
// zum ersten Mal geoeffnet wird. Kein globaler CSS-Ballast auf jeder Seite.
const LeadDialog = dynamic(() => import("./LeadDialog"), { ssr: false });

/**
 * LeadProvider (Thomas 06.08.2026) — oeffnet EIN wiederverwendbares
 * Anfrage-Popup (LeadDialog) fuer alle Lead-CTAs im Relaunch.
 *
 * Drei Wege, das Popup zu oeffnen:
 *  1. React-Komponenten: useLead().open({ preset, service, ... }).
 *  2. Beliebiges Markup (auch statisches demo.body.html): ein Element mit
 *     data-rr-lead="<preset>" (+ optional data-rr-lead-service="..."). Ein
 *     delegierter Klick-Listener faengt das ab.
 *  3. Implizit: jeder Link auf die Kontakt-Seite, der NICHT in Navigation/
 *     Footer/Menue sitzt (z.B. der geteilte SiteClosing-Button, den wir nicht
 *     editieren duerfen), oeffnet das Popup als "standard" statt zu navigieren.
 *     Der Link behaelt href als Fallback, falls JS nicht laeuft.
 *
 * Auf der ALTEN (Nicht-Relaunch-) Seite ist der Provider inert: dort gibt es
 * keine data-rr-lead-Elemente, und deren Kontakt-Pfad ("/kontakt") ist nicht
 * der Relaunch-Pfad ("/relaunch-preview/kontakt"), den wir abfangen.
 */

const KONTAKT_PATH = "/relaunch-preview/kontakt";

interface LeadContextValue {
  open: (opts?: LeadOpenOpts) => void;
  close: () => void;
}

const LeadContext = createContext<LeadContextValue | null>(null);

export function useLead(): LeadContextValue {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error("useLead must be used within a LeadProvider");
  return ctx;
}

export default function LeadProvider({ children }: { children: React.ReactNode }) {
  // null = geschlossen; sonst die Optionen des zuletzt geoeffneten Presets.
  const [opts, setOpts] = useState<LeadOpenOpts | null>(null);

  const open = useCallback((o?: LeadOpenOpts) => {
    const next = o ?? { preset: "standard" };
    // Conversion-Intent: Anfrage-Popup geoeffnet. Muster wie AnalyticsListener
    // (sendGAEvent -> dataLayer, flusht beim spaeteren GA-Laden). Der erfolgreiche
    // Submit (generate_lead) lebt in LeadDialog.tsx und wird hier NICHT gefeuert.
    try {
      sendGAEvent("event", "contact_form_open", {
        preset: next.preset,
        service: next.service,
      });
    } catch {
      /* Tracking darf das Popup nie blockieren */
    }
    setOpts(next);
  }, []);
  const close = useCallback(() => setOpts(null), []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      // Nur einfacher Linksklick ohne Modifier (cmd/ctrl-Klick = neuer Tab).
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as Element | null;
      if (!target || typeof target.closest !== "function") return;

      // 1) Explizites data-rr-lead
      const leadEl = target.closest<HTMLElement>("[data-rr-lead]");
      if (leadEl) {
        e.preventDefault();
        e.stopPropagation();
        open({
          preset: leadEl.getAttribute("data-rr-lead") || "standard",
          service: leadEl.getAttribute("data-rr-lead-service") || undefined,
        });
        return;
      }

      // 2) Impliziter Kontakt-Link ausserhalb von Navigation/Footer/Menue
      const a = target.closest<HTMLAnchorElement>("a[href]");
      if (!a) return;
      let path = a.getAttribute("href") || "";
      try {
        path = new URL(a.href, window.location.origin).pathname;
      } catch {
        /* relativer/ungueltiger href: roher Wert reicht fuer den Vergleich */
      }
      if (path !== KONTAKT_PATH) return;
      if (a.closest("footer, nav, .rrmenu-root, [data-rr-no-lead]")) return;
      e.preventDefault();
      e.stopPropagation();
      open({ preset: "standard" });
    }

    function onLeadEvent(e: Event) {
      const detail = (e as CustomEvent<LeadOpenOpts>).detail;
      open(detail ?? { preset: "standard" });
    }

    // Capture-Phase, damit wir VOR Next.js' Link-Handler abfangen koennen.
    document.addEventListener("click", onDocClick, true);
    window.addEventListener("rr:lead", onLeadEvent as EventListener);
    return () => {
      document.removeEventListener("click", onDocClick, true);
      window.removeEventListener("rr:lead", onLeadEvent as EventListener);
    };
  }, [open]);

  return (
    <LeadContext.Provider value={{ open, close }}>
      {children}
      {opts ? <LeadDialog opts={opts} onClose={close} /> : null}
    </LeadContext.Provider>
  );
}
