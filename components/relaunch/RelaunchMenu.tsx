"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { RabbitMark } from "@/components/relaunch/RabbitMark";

/**
 * RelaunchMenu — Vollbild-Overlay-Menue fuer den Red-Rabbit-Relaunch.
 *
 * Mechanik-Vorbild: kookie-kollective.com (1:1 rekonstruiert, nur Farbe + Font +
 * Inhalte auf die Marke uebersetzt). Kern des Vorbilds:
 *   - helle, halbtransparente Overlay-Flaeche, Seite dahinter unscharf
 *     (backdrop-filter: blur), KEIN Panel, KEIN Navy.
 *   - zentral gestapelte Grosschrift-Menuepunkte.
 *   - Hover: vier Eck-Klammern (Reticle) blenden um den Punkt ein
 *     (opacity 0 -> 1), plus ein kleiner runder Punkt-Akzent.
 * Bei uns: Klammern + Punkt in Marken-Rot, Text in Display-Font/Ink.
 *
 * WICHTIG (Groessen-Regel): Schriftgroesse ist VH-basiert (min(vh, vw)), so dass
 * alle 8 Punkte + aufgeklapptes Leistungen-Dropdown + Social-Zeile auch bei
 * ~700px Fensterhoehe komplett in den Viewport passen. Beim Aufklappen
 * schrumpfen die Punkte sanft (Klasse .is-expanded).
 *
 * Rendert BEIDES selbst: den fixierten Trigger und das Overlay. Eigener
 * Open-State. Styles ueber styled-jsx gescoped; next/link-Klassen via :global().
 */

type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

const NAV_ITEMS: NavItem[] = [
  { label: "Start", href: "/relaunch-preview" },
  {
    label: "Leistungen",
    href: "/relaunch-preview/leistungen",
    // Klick klappt auf statt zu navigieren (Thomas 22.07.: genau diese zwei
    // Zeilen). Du-Anrede statt "Ihre" (Hausregel), kein Wort "KI".
    children: [
      { label: "Deine Website", href: "/relaunch-preview/leistungen/website" },
      { label: "Bei jeder Website dabei · Talos", href: "/relaunch-preview/leistungen/talos" },
    ],
  },
  { label: "Referenzen", href: "/relaunch-preview/referenzen" },
  { label: "Preise", href: "/preise" },
  { label: "Tipps", href: "/relaunch-preview/tipps" },
  { label: "FAQ", href: "/relaunch-preview/faq" },
  { label: "Über uns", href: "/relaunch-preview/ueber-uns" },
  { label: "Kontakt", href: "/relaunch-preview/kontakt" },
];

const CONTACTS: { label: string; href: string; external?: boolean }[] = [
  { label: "Instagram", href: "https://www.instagram.com/redrabbit.media/", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/thomasuhlir/", external: true },
  { label: "office@redrabbit.media", href: "mailto:office@redrabbit.media" },
  { label: "Anrufen", href: "tel:+436769000955" },
];

/** Vier Eck-Klammern (Reticle) + Punkt-Akzent, wie beim Vorbild. */
function Reticle() {
  return (
    <span className="rrmenu-corners" aria-hidden="true">
      <span className="rrmenu-corners-row">
        <span className="rrmenu-c rrmenu-c--tl" />
        <span className="rrmenu-c rrmenu-c--tr" />
      </span>
      <span className="rrmenu-corners-row">
        <span className="rrmenu-c rrmenu-c--bl" />
        <span className="rrmenu-c rrmenu-c--br" />
      </span>
    </span>
  );
}

export default function RelaunchMenu() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const dialogId = useId();
  const subId = useId();

  const close = useCallback(() => setOpen(false), []);

  // Beim Schliessen Dropdown zuruecksetzen.
  useEffect(() => {
    if (!open) setServicesOpen(false);
  }, [open]);

  // Body-Scroll sperren solange offen (ohne Layout-Sprung durch Scrollbar).
  useEffect(() => {
    if (!open) return;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    // Lenis (Smooth-Scroll der Morph-Seite) sauber pausieren, beim Schliessen
    // fortsetzen — sonst bleibt der Scroll eingefroren. No-op ohne Lenis.
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

  // Roter Punkt = DER Maus-Cursor der ganzen Seite (Thomas 22.07.: "immer
  // nur der rote punkt ueberall und jederzeit, nicht beides"). RelaunchMenu
  // haengt auf jeder Relaunch-Seite, darum lebt der Cursor hier. Direktes
  // transform statt State -> kein Re-Render pro Mousemove.
  useEffect(() => {
    const dot = cursorRef.current;
    if (!dot) return;
    const onMove = (e: MouseEvent) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      dot.style.opacity = "1";
    };
    const onLeave = () => {
      dot.style.opacity = "0";
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Fokus in den Dialog schicken; beim Schliessen zurueck zum Trigger.
  // Fokus auf das Overlay selbst (nicht den ersten Link), sonst zeigt
  // "Start" beim Oeffnen sofort die Klammern (Thomas 22.07.: erst bei Hover).
  useEffect(() => {
    if (open) {
      overlayRef.current?.focus();
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
      {/* Roter Punkt = seitenweiter Cursor (nur Desktop-Pointer) */}
      <span ref={cursorRef} className="rrmenu-cursor" aria-hidden="true" />

      {/* ---- Fixierter Trigger (oben rechts) ---- */}
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
        tabIndex={-1}
        className={`rrmenu-overlay${open ? " is-open" : ""}`}
        hidden={!open}
        onClick={(e) => {
          if (e.target === overlayRef.current) close();
        }}
      >
        <div className="rrmenu-inner">
          {/* oben links: Logo + Wortmarke (auf hellem Grund in Ink) */}
          <div className="rrmenu-top">
            <span className="rrmenu-brand" aria-hidden={!open}>
              <RabbitMark className="rrmenu-mark" title="" />
              <span className="rrmenu-wordmark">Red Rabbit</span>
            </span>
          </div>

          <nav
            className={`rrmenu-nav${servicesOpen ? " is-expanded" : ""}`}
            aria-label="Seiten"
          >
            <ul className="rrmenu-list">
              {NAV_ITEMS.map((item, i) => {
                const delayVar = { "--i": i } as React.CSSProperties;
                if (item.children) {
                  return (
                    <li
                      key={item.href}
                      className="rrmenu-item rrmenu-item--has-sub"
                      style={delayVar}
                    >
                      <button
                        type="button"
                        className={`rrmenu-link rrmenu-link--btn${servicesOpen ? " is-active" : ""}`}
                        aria-expanded={servicesOpen}
                        aria-controls={subId}
                        onClick={() => setServicesOpen((v) => !v)}
                      >
                        <span className="rrmenu-link-text">{item.label}</span>
                        <Reticle />
                      </button>

                      <div
                        id={subId}
                        className={`rrmenu-sub-outer${servicesOpen ? " is-open" : ""}`}
                      >
                        <div className="rrmenu-sub-inner">
                          <ul className="rrmenu-sublist">
                            {item.children.map((sub) => (
                              <li key={sub.href}>
                                <Link
                                  href={sub.href}
                                  className="rrmenu-sublink"
                                  tabIndex={servicesOpen ? undefined : -1}
                                  onClick={close}
                                >
                                  <span className="rrmenu-sublink-text">{sub.label}</span>
                                  <Reticle />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={item.href} className="rrmenu-item" style={delayVar}>
                    <Link href={item.href} className="rrmenu-link" onClick={close}>
                      <span className="rrmenu-link-text">{item.label}</span>
                      <Reticle />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* unten links: Social/Kontakt-Zeile */}
          <div className="rrmenu-foot">
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
        .rrmenu-bar {
          position: absolute;
          left: 0;
          height: 2px;
          width: 28px;
          background: var(--rr-red, #f12032);
          transition: transform 360ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)),
            opacity 200ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .rrmenu-bar--1 { top: 0; }
        .rrmenu-bar--2 { bottom: 0; }
        .rrmenu-trigger.is-open .rrmenu-bar--1 {
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        }
        .rrmenu-trigger.is-open .rrmenu-bar--2 {
          bottom: auto;
          top: 50%;
          transform: translateY(-50%) rotate(-45deg);
        }

        /* ============ Overlay (helle Flaeche, Seite dahinter unscharf) ============ */
        .rrmenu-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          /* Deckend weiss (Thomas 22.07.: nicht durchsichtig) */
          background: var(--rr-offwhite, #f6f5f1);
          display: flex;
          opacity: 0;
          transition: opacity 320ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
          overflow: hidden;
        }
        .rrmenu-cursor {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 9999;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--rr-red, #f12032);
          pointer-events: none;
          opacity: 0;
        }
        @media (hover: none), (pointer: coarse) {
          .rrmenu-cursor { display: none; }
        }
        .rrmenu-overlay.is-open {
          opacity: 1;
        }

        .rrmenu-inner {
          position: relative;
          width: 100%;
          max-width: var(--rr-max, 1680px);
          height: 100%;
          margin: 0 auto;
          padding: clamp(20px, 3vh, 34px) var(--rr-gutter, clamp(22px, 5vw, 56px));
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* ---- oben: Logo + Wortmarke ---- */
        .rrmenu-top {
          flex: none;
        }
        .rrmenu-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .rrmenu-overlay :global(.rrmenu-mark) {
          height: clamp(22px, 2.2vw, 30px);
          width: auto;
          display: block;
        }
        .rrmenu-wordmark {
          font-family: var(--rr-font-display, system-ui, sans-serif);
          font-weight: 700;
          font-size: clamp(16px, 1.5vw, 20px);
          letter-spacing: -0.01em;
          color: var(--rr-ink, #23262e);
        }

        /* ---- Mitte: zentral gestapelte Punkte ---- */
        .rrmenu-nav {
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          /* VH-basierte Groessen. Zusammengeklappt: 8 Punkte.
             Thomas 22.07.: Punkte brauchen mehr Luft zueinander. */
          --menu-fs: clamp(22px, min(5.8vh, 7.2vw), 54px);
          --menu-gap: clamp(8px, 2vh, 26px);
          --menu-pad-y: clamp(2px, 0.7vh, 8px);
        }
        /* Aufgeklappt: Punkte schrumpfen sanft, damit Dropdown + Social passen. */
        .rrmenu-nav.is-expanded {
          --menu-fs: clamp(18px, min(4.4vh, 5.6vw), 42px);
          --menu-gap: clamp(5px, 1.3vh, 16px);
          --menu-pad-y: clamp(1px, 0.45vh, 6px);
        }
        .rrmenu-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--menu-gap);
          transition: gap 360ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .rrmenu-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        /* Gestaffeltes Einblenden beim Oeffnen (Thomas 22.07.): Punkte
           erscheinen nacheinander von oben nach unten, nicht alle sofort. */
        .rrmenu-overlay.is-open .rrmenu-item {
          animation: rrmenuItemIn 480ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)) both;
          animation-delay: calc(120ms + var(--i, 0) * 70ms);
        }
        @keyframes rrmenuItemIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        /* Link/Button = teils next/link -> :global() unter dem Overlay ansprechen
           (bleibt trotzdem auf dieses Menue begrenzt, kein globales Leck). */
        .rrmenu-overlay :global(.rrmenu-link) {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: var(--menu-pad-y) 0.75rem;
          text-decoration: none;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: var(--rr-font-display, system-ui, sans-serif);
          font-weight: 500;
          font-size: var(--menu-fs);
          line-height: 1;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: var(--rr-ink, #23262e);
          transition: font-size 360ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)),
            padding 360ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)),
            color 220ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .rrmenu-overlay :global(.rrmenu-link-text) {
          position: relative;
          z-index: 1;
        }

        /* Eck-Klammern (Reticle) — opacity 0 -> 1 bei Hover (Vorbild-Mechanik) */
        .rrmenu-overlay :global(.rrmenu-corners) {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          pointer-events: none;
          opacity: 0;
          transition: opacity 300ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .rrmenu-overlay :global(.rrmenu-corners-row) {
          display: flex;
          justify-content: space-between;
        }
        .rrmenu-overlay :global(.rrmenu-c) {
          width: 0.75rem;
          height: 0.75rem;
        }
        .rrmenu-overlay :global(.rrmenu-c--tl) {
          border-top: 1px solid var(--rr-red, #f12032);
          border-left: 1px solid var(--rr-red, #f12032);
        }
        .rrmenu-overlay :global(.rrmenu-c--tr) {
          border-top: 1px solid var(--rr-red, #f12032);
          border-right: 1px solid var(--rr-red, #f12032);
        }
        .rrmenu-overlay :global(.rrmenu-c--bl) {
          border-bottom: 1px solid var(--rr-red, #f12032);
          border-left: 1px solid var(--rr-red, #f12032);
        }
        .rrmenu-overlay :global(.rrmenu-c--br) {
          border-bottom: 1px solid var(--rr-red, #f12032);
          border-right: 1px solid var(--rr-red, #f12032);
        }

        /* Hover / Fokus / aktiver Dropdown -> Klammern + Punkt sichtbar */
        .rrmenu-overlay :global(.rrmenu-link:hover .rrmenu-corners),
        .rrmenu-overlay :global(.rrmenu-link:focus-visible .rrmenu-corners),
        .rrmenu-overlay :global(.rrmenu-link.is-active .rrmenu-corners) {
          opacity: 1;
        }
        .rrmenu-overlay :global(.rrmenu-link:focus-visible) {
          outline: none;
        }

        /* ---- Dropdown (Leistungen) ---- */
        .rrmenu-sub-outer {
          display: grid;
          grid-template-rows: 0fr;
          width: 100%;
          transition: grid-template-rows 380ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .rrmenu-sub-outer.is-open {
          grid-template-rows: 1fr;
        }
        .rrmenu-sub-inner {
          overflow: hidden;
          min-height: 0;
        }
        .rrmenu-sublist {
          list-style: none;
          margin: 0;
          padding: clamp(4px, 0.9vh, 12px) 0 clamp(2px, 0.6vh, 8px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(1px, 0.4vh, 6px);
        }
        .rrmenu-overlay :global(.rrmenu-sublink) {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: clamp(2px, 0.5vh, 6px) 0.65rem;
          text-decoration: none;
          font-family: var(--rr-font-display, system-ui, sans-serif);
          font-weight: 500;
          font-size: clamp(15px, min(2.6vh, 2.6vw), 24px);
          line-height: 1;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: var(--rr-ink, #23262e);
          transition: color 220ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .rrmenu-overlay :global(.rrmenu-sublink-text) {
          position: relative;
          z-index: 1;
        }
        .rrmenu-overlay :global(.rrmenu-sublink:hover .rrmenu-corners),
        .rrmenu-overlay :global(.rrmenu-sublink:focus-visible .rrmenu-corners) {
          opacity: 1;
        }
        .rrmenu-overlay :global(.rrmenu-sublink .rrmenu-c) {
          width: 0.5rem;
          height: 0.5rem;
        }
        .rrmenu-overlay :global(.rrmenu-sublink:focus-visible) {
          outline: none;
        }

        /* ============ Fuss: Social/Kontakt (unten links) ============ */
        .rrmenu-foot {
          flex: none;
        }
        .rrmenu-contacts {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 6px 22px;
        }
        .rrmenu-contact {
          font-family: var(--rr-font-ui, sans-serif);
          font-size: clamp(12px, 1.2vw, 15px);
          font-weight: 500;
          color: var(--rr-ink-soft, #5a5e68);
          text-decoration: none;
          padding-bottom: 2px;
          border-bottom: 1px solid transparent;
          transition: color 200ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)),
            border-color 200ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .rrmenu-contact:hover,
        .rrmenu-contact:focus-visible {
          color: var(--rr-ink, #23262e);
          border-color: var(--rr-red, #f12032);
          outline: none;
        }

        /* ============ Reduced Motion ============ */
        @media (prefers-reduced-motion: reduce) {
          .rrmenu-overlay,
          .rrmenu-list,
          .rrmenu-sub-outer,
          .rrmenu-bar,
          .rrmenu-contact,
          .rrmenu-overlay :global(.rrmenu-link),
          .rrmenu-overlay :global(.rrmenu-sublink),
          .rrmenu-overlay :global(.rrmenu-corners),
          .rrmenu-overlay :global(.rrmenu-dot) {
            transition-duration: 0.01ms;
          }
          .rrmenu-overlay.is-open .rrmenu-item {
            animation: none;
          }
        }
      `}</style>
      {/* Seitenweit: System-Cursor aus, der rote Punkt ist der einzige Cursor
          (nur echte Zeiger-Geraete; Touch bleibt unberuehrt). Global, weil
          RelaunchMenu auf jeder Relaunch-Seite haengt. */}
      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) {
          html,
          body,
          a,
          button,
          input,
          textarea,
          select,
          label,
          [role="button"] {
            cursor: none !important;
          }
        }
      `}</style>
    </div>
  );
}
