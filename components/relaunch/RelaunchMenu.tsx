"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";

/**
 * RelaunchMenu — distinktives Vollbild-Overlay-Menue fuer den Red-Rabbit-Relaunch.
 *
 * Bewusst KEIN Seiten-Panel (Abgrenzung zu all-turtles): beim Oeffnen faellt ein
 * vollflaechiges Navy-Overlay ein, die Fraunces-Links "setzen sich" gestaffelt aus
 * leichter Rotation/Versatz in die Flucht — Echo auf das Marken-Motiv (Typografie,
 * die zerbricht und sich neu zusammensetzt).
 *
 * Rendert BEIDES selbst: den fixierten Hamburger-Trigger und das Overlay.
 * Verwaltet eigenen Open-State. Keine externen Deps ausser React/next/link.
 * Styles sind ueber styled-jsx auf die Komponente gescoped (kein globales Leck).
 */

type NavItem = { label: string; href: string };

// Preise zeigt bewusst noch auf die alte Live-Seite, bis es eine Relaunch-
// Version gibt (Tomson 16.07.). Leistungen zeigt auf die neue Preview-Seite.
const NAV_ITEMS: NavItem[] = [
  { label: "Start", href: "/relaunch-preview" },
  { label: "Leistungen", href: "/relaunch-preview/leistungen" },
  { label: "Referenzen", href: "/relaunch-preview/referenzen" },
  { label: "Preise", href: "/preise" },
  { label: "Tipps", href: "/relaunch-preview/tipps" },
  { label: "FAQ", href: "/relaunch-preview/faq" },
  { label: "Über uns", href: "/relaunch-preview/ueber-uns" },
  { label: "Kontakt", href: "/relaunch-preview/kontakt" },
];

const CONTACTS: { label: string; href: string; external?: boolean }[] = [
  { label: "office@redrabbit.media", href: "mailto:office@redrabbit.media" },
  { label: "Anrufen", href: "tel:+436769000955" },
  { label: "Instagram", href: "https://www.instagram.com/redrabbit.media/", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/thomasuhlir/", external: true },
];

export default function RelaunchMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogId = useId();

  const close = useCallback(() => setOpen(false), []);

  // Body-Scroll sperren solange offen (ohne Layout-Sprung durch Scrollbar).
  useEffect(() => {
    if (!open) return;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    // Lenis (Smooth-Scroll der Morph-Seite) sauber pausieren und beim Schliessen
    // fortsetzen — sonst bleibt der Scroll nach dem Menue eingefroren. No-op wenn
    // keine Lenis-Instanz vorhanden ist (z.B. Test-Routen).
    const lenis = (window as unknown as {
      lenis?: { stop?: () => void; start?: () => void };
    }).lenis;
    lenis?.stop?.();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      lenis?.start?.();
    };
  }, [open]);

  // Fokus in den Dialog schicken; beim Schliessen zurueck zum Trigger.
  useEffect(() => {
    if (open) {
      const first = overlayRef.current?.querySelector<HTMLElement>("[data-menu-focus]");
      first?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  // Esc schliesst + Focus-Trap (Tab/Shift+Tab zyklisch im Overlay halten).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const root = overlayRef.current;
      if (!root) return;
      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div className="rrmenu-root">
      {/* ---- Fixierter Hamburger-Trigger (oben rechts) ---- */}
      <button
        ref={triggerRef}
        type="button"
        className={`rrmenu-trigger${open ? " is-open" : ""}`}
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="rrmenu-bars" aria-hidden="true">
          <span className="rrmenu-bar rrmenu-bar--1" />
          <span className="rrmenu-bar rrmenu-bar--2" />
        </span>
      </button>

      {/* ---- Vollbild-Overlay ---- */}
      <div
        ref={overlayRef}
        id={dialogId}
        role="dialog"
        aria-modal="true"
        aria-label="Hauptnavigation"
        className={`rrmenu-overlay${open ? " is-open" : ""}`}
        hidden={!open}
        onClick={(e) => {
          if (e.target === overlayRef.current) close();
        }}
      >
        <div className="rrmenu-inner">
          <p className="rrmenu-eyebrow" aria-hidden={!open}>
            Red Rabbit · Navigation
          </p>

          <nav className="rrmenu-nav" aria-label="Seiten">
            <ul className="rrmenu-list">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.href} className="rrmenu-item" style={itemDelay(i)}>
                  <Link
                    href={item.href}
                    className="rrmenu-link"
                    data-menu-focus={i === 0 ? "" : undefined}
                    onClick={close}
                  >
                    <span className="rrmenu-link-index">{String(i + 1).padStart(2, "0")}</span>
                    <span className="rrmenu-link-text">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="rrmenu-foot" style={itemDelay(NAV_ITEMS.length)}>
            <Link href="/relaunch-preview/kontakt" className="rrmenu-cta" onClick={close}>
              Projekt anfragen
              <span className="rrmenu-cta-arrow" aria-hidden="true">→</span>
            </Link>

            <ul className="rrmenu-contacts">
              {CONTACTS.map((c) => (
                <li key={c.href}>
                  <a
                    href={c.href}
                    className="rrmenu-contact"
                    {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .rrmenu-root {
          font-family: var(--rr-font-ui, ui-sans-serif, system-ui, sans-serif);
        }

        /* ============ Trigger ============ */
        .rrmenu-trigger {
          position: fixed;
          top: clamp(18px, 2.4vw, 34px);
          right: clamp(18px, 2.4vw, 40px);
          z-index: 1001;
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          padding: 0;
          border: none;
          border-radius: 999px;
          background: transparent;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .rrmenu-trigger:focus-visible {
          outline: 2px solid var(--rr-red, #f12032);
          outline-offset: 3px;
        }
        .rrmenu-bars {
          position: relative;
          width: 28px;
          height: 11px;
          display: block;
        }
        /* Zwei gleich lange Linien (wie all-turtles) */
        .rrmenu-bar {
          position: absolute;
          left: 0;
          height: 2px;
          width: 28px;
          border-radius: 2px;
          background: var(--rr-red, #f12032);
          transition: transform 360ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)),
            opacity 200ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .rrmenu-bar--1 { top: 0; }
        .rrmenu-bar--2 { bottom: 0; }
        /* Offen: X */
        .rrmenu-trigger.is-open .rrmenu-bar--1 {
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        }
        .rrmenu-trigger.is-open .rrmenu-bar--2 {
          bottom: auto;
          top: 50%;
          transform: translateY(-50%) rotate(-45deg);
        }

        /* ============ Overlay ============ */
        .rrmenu-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: var(--rr-navy, #1c2837);
          display: flex;
          opacity: 0;
          transform: scale(1.03);
          transition: opacity 350ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)),
            transform 350ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
          overflow-y: auto;
          overflow-x: hidden;
        }
        .rrmenu-overlay.is-open {
          opacity: 1;
          transform: scale(1);
        }
        /* Dezente Rot-Aura oben rechts hinter dem Trigger + Vignette unten */
        .rrmenu-overlay::before {
          content: "";
          position: absolute;
          top: -20%;
          right: -10%;
          width: 60vw;
          height: 60vw;
          background: radial-gradient(
            closest-side,
            rgba(241, 32, 50, 0.16),
            rgba(241, 32, 50, 0) 70%
          );
          pointer-events: none;
        }

        .rrmenu-inner {
          position: relative;
          width: 100%;
          max-width: var(--rr-max, 1680px);
          margin: 0 auto;
          padding: clamp(84px, 12vh, 150px) var(--rr-gutter, clamp(24px, 5vw, 72px))
            clamp(40px, 7vh, 80px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 100%;
        }

        .rrmenu-eyebrow {
          font-family: var(--rr-font-ui, sans-serif);
          font-size: 13px;
          font-weight: 650;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--rr-red, #f12032);
          margin: 0 0 clamp(24px, 4vh, 46px);
        }

        /* ============ Nav-Links ============ */
        .rrmenu-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: clamp(6px, 1.4vh, 16px);
        }
        .rrmenu-item {
          opacity: 0;
          transform: translateY(24px) rotate(-4deg);
          transform-origin: left center;
        }
        .rrmenu-overlay.is-open .rrmenu-item {
          animation: rrmenu-settle 620ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)) forwards;
          animation-delay: var(--rrmenu-delay, 0ms);
        }
        @keyframes rrmenu-settle {
          to {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
        }

        /* Link = next/link (custom component): styled-jsx haengt hier KEINEN
           Scope-Hash an -> per :global() unter dem gescopten Overlay ansprechen
           (bleibt dadurch trotzdem auf dieses Menue begrenzt, kein Leck). */
        .rrmenu-overlay :global(.rrmenu-link) {
          display: inline-flex;
          align-items: baseline;
          gap: clamp(12px, 1.6vw, 22px);
          text-decoration: none;
          color: #ffffff;
          font-family: var(--rr-font-display, Georgia, serif);
          font-weight: 560;
          font-size: clamp(40px, 7vw, 76px);
          line-height: 1.02;
          letter-spacing: -0.02em;
          transition: color 240ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)),
            transform 240ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .rrmenu-overlay :global(.rrmenu-link-index) {
          font-family: var(--rr-font-ui, sans-serif);
          font-size: clamp(12px, 1vw, 15px);
          font-weight: 650;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.35);
          transform: translateY(-0.35em);
          transition: color 240ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .rrmenu-overlay :global(.rrmenu-link-text) {
          position: relative;
        }
        .rrmenu-overlay :global(.rrmenu-link:hover),
        .rrmenu-overlay :global(.rrmenu-link:focus-visible) {
          color: var(--rr-red, #f12032);
          transform: translateX(10px) skewX(-5deg);
          outline: none;
        }
        .rrmenu-overlay :global(.rrmenu-link:hover .rrmenu-link-index),
        .rrmenu-overlay :global(.rrmenu-link:focus-visible .rrmenu-link-index) {
          color: var(--rr-red, #f12032);
        }
        .rrmenu-overlay :global(.rrmenu-link:focus-visible .rrmenu-link-text) {
          text-decoration: underline;
          text-decoration-thickness: 2px;
          text-underline-offset: 8px;
        }

        /* ============ Fuss: CTA + Kontakte ============ */
        .rrmenu-foot {
          margin-top: clamp(34px, 6vh, 64px);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: clamp(20px, 3vw, 40px);
          opacity: 0;
          transform: translateY(24px) rotate(-4deg);
          transform-origin: left center;
        }
        .rrmenu-overlay.is-open .rrmenu-foot {
          animation: rrmenu-settle 620ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)) forwards;
          animation-delay: var(--rrmenu-delay, 0ms);
        }

        /* CTA = next/link -> ebenfalls :global() unter dem Overlay. */
        .rrmenu-overlay :global(.rrmenu-cta) {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--rr-font-ui, sans-serif);
          font-size: 16px;
          font-weight: 600;
          line-height: 1;
          padding: 17px 30px;
          border-radius: 999px;
          background: var(--rr-red, #f12032);
          color: #fff;
          text-decoration: none;
          transition: background-color 200ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)),
            transform 200ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .rrmenu-overlay :global(.rrmenu-cta:hover) {
          background: var(--rr-red-deep, #c81222);
        }
        .rrmenu-overlay :global(.rrmenu-cta:focus-visible) {
          outline: 2px solid #fff;
          outline-offset: 3px;
        }
        .rrmenu-overlay :global(.rrmenu-cta-arrow) {
          transition: transform 200ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .rrmenu-overlay :global(.rrmenu-cta:hover .rrmenu-cta-arrow) {
          transform: translateX(4px);
        }

        .rrmenu-contacts {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px 26px;
        }
        .rrmenu-contact {
          font-family: var(--rr-font-ui, sans-serif);
          font-size: 15px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.18);
          padding-bottom: 2px;
          transition: color 200ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)),
            border-color 200ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .rrmenu-contact:hover,
        .rrmenu-contact:focus-visible {
          color: #fff;
          border-color: var(--rr-red, #f12032);
          outline: none;
        }
        .rrmenu-contact:focus-visible {
          color: var(--rr-red, #f12032);
        }

        @media (max-width: 560px) {
          .rrmenu-inner {
            justify-content: flex-start;
          }
          .rrmenu-foot {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        /* ============ Reduced Motion: alles sofort auf Endzustand ============ */
        @media (prefers-reduced-motion: reduce) {
          .rrmenu-overlay {
            transition: opacity 0.01ms;
            transform: none;
          }
          .rrmenu-overlay.is-open {
            transform: none;
          }
          .rrmenu-item,
          .rrmenu-foot {
            opacity: 1;
            transform: none;
          }
          .rrmenu-overlay.is-open .rrmenu-item,
          .rrmenu-overlay.is-open .rrmenu-foot {
            animation: none;
          }
          .rrmenu-bar,
          .rrmenu-contact {
            transition-duration: 0.01ms;
          }
          .rrmenu-overlay :global(.rrmenu-link),
          .rrmenu-overlay :global(.rrmenu-cta),
          .rrmenu-overlay :global(.rrmenu-cta-arrow) {
            transition-duration: 0.01ms;
          }
        }
      `}</style>
    </div>
  );
}

/** Staffel-Delay pro Link (~60ms), als CSS-Variable an das <li>. */
function itemDelay(i: number): React.CSSProperties {
  return { ["--rrmenu-delay" as string]: `${120 + i * 60}ms` };
}
