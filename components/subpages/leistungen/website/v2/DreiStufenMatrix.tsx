"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Diagnose from "./Diagnose";
import { STUFEN } from "./stufen-varianten/VarianteA";
import {
  BUMPER_TRACK_VH_PER_WINDOW,
  MOBILE_BREAKPOINT,
  STEP_TRACK_VH_PER_STEP,
  TRANSITION_EASING,
  TRANSITION_MS,
  prefersReducedMotion,
  snapUnits,
} from "@/lib/relaunch/scroll-standard";

/**
 * Drei Stufen — LIVE (Thomas' Wahl 21.07. aus /stufen-varianten): Variante B,
 * "Feature-Matrix mit Sticky-Stufe". Pro Stufe: links sticky der Stufenname +
 * Kurzbeschreibung + Badge, rechts die Merkmale als vertikale Liste in zwei
 * Spalten. Klick auf ein Merkmal expandiert inline ein Panel ueber beide
 * Spalten (grid-template-rows 0fr -> 1fr). Aktives Merkmal bekommt roten Punkt
 * + Navy-Hervorhebung, der Rest dimmt. Daten (STUFEN) aus stufen-varianten
 * importiert, damit die Vorschau-Route unberuehrt bleibt und nichts doppelt
 * gepflegt wird. Sektions-Rahmen (Eyebrow/H2/Abschluss/Padding) an die
 * Live-Seite angeglichen.
 *
 * Sticky-Fahrt (Thomas 29.07.: "jede Stufe soll ihre eigene Bildschirmseite
 * mit Stopp sein, wie die anderen Bumper auch"): die drei Stufen laufen jetzt
 * als kanonische Bumper-Strecke (lib/relaunch/scroll-standard.ts, Referenz
 * ScrollBumper.tsx/CasePanels.tsx) statt normal untereinander zu stehen — ein
 * Sticky-100vh-Fenster pro Stufe, snapUnits-Dwell-Mathe. Inhalt jeder Stufe
 * ist bewusst kurz (Name + 8-10 Ein-Wort-Merkmale, Detail-Saetze <20 Woerter)
 * — kein Fliesstext, verletzt also nicht die "nie Absatz im Snap"-Regel.
 * Mobile/reduced-motion (isBumperDegraded): faellt auf die alte, normal
 * gestapelte Darstellung zurueck.
 */

// Preise deckungsgleich mit der /preise-Seite (decisions-log 30.07.2026,
// Thomas bestaetigt 01.08.): Starter 1.250 / Business 2.850 / Premium ab 4.900.
// Bewusst hier als Anzeige-Strings, solange es keine gemeinsame PRICING-Config
// gibt (siehe decisions-log "OFFEN: brand/pricing.md + lib/config.ts angleichen").
const PREISE: Record<string, string> = {
  Starter: "ab 1.250 €",
  Business: "ab 2.850 €",
  Premium: "ab 4.900 €",
};

function StufeMatrix({
  stufe,
  defaultActive = null,
}: {
  stufe: (typeof STUFEN)[number];
  defaultActive?: number | null;
}) {
  const [active, setActive] = useState<number | null>(defaultActive);
  const preis = PREISE[stufe.name];

  return (
    <div className={"fmx__stufe" + (stufe.featured ? " fmx__stufe--featured" : "")}>
      <aside className="fmx__aside">
        <div className="fmx__asideinner">
          {stufe.featured && <span className="fmx__tag">MEISTGEWÄHLT</span>}
          <h3 className="fmx__name">
            {stufe.name}
            {stufe.featured && <span className="fmx__namedot" aria-hidden="true" />}
          </h3>
          {preis && <p className="fmx__preis">{preis}</p>}
          <p className="fmx__text">{stufe.text}</p>
        </div>
      </aside>

      <div className="fmx__matrix">
        {stufe.merkmale.map((m, i) => {
          const isActive = active === i;
          const dimmed = active !== null && !isActive;
          return (
            <div
              key={m.titel}
              className={
                "fmx__cell" +
                (isActive ? " is-active" : "") +
                (dimmed ? " is-dim" : "")
              }
            >
              <button
                type="button"
                className="fmx__btn"
                aria-expanded={isActive}
                onClick={() => setActive(isActive ? null : i)}
              >
                <span className="fmx__mark" aria-hidden="true" />
                <span className="fmx__titel">{m.titel}</span>
              </button>
              <div className="fmx__panel">
                <div className="fmx__panel-inner">
                  <p className="fmx__detail">{m.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .fmx__stufe {
          display: grid;
          grid-template-columns: minmax(220px, 300px) 1fr;
          gap: clamp(28px, 5vw, 72px);
          padding: clamp(44px, 6vw, 80px) 0;
          border-top: 1px solid rgba(28, 40, 55, 0.12);
        }
        .fmx__stufe--featured {
          border-top: 1px solid var(--rr-red);
          border-bottom: 1px solid var(--rr-red);
        }
        .fmx__stufe--featured + .fmx__stufe {
          border-top: 0;
        }

        .fmx__aside {
          position: relative;
        }
        .fmx__asideinner {
          position: sticky;
          top: clamp(96px, 16vh, 172px);
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: flex-start;
        }
        .fmx__tag {
          border: 1px solid var(--rr-red);
          color: var(--rr-red);
          font-family: var(--rr-font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
        }
        .fmx__name {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(2.2rem, 4vw, 3.6rem);
          line-height: 1;
          color: var(--rr-navy);
          margin: 0;
          display: inline-flex;
          align-items: flex-end;
          gap: 0.26em;
          opacity: 0.62;
        }
        .fmx__stufe--featured .fmx__name {
          opacity: 1;
          font-size: clamp(2.6rem, 4.8vw, 4.2rem);
        }
        .fmx__namedot {
          width: 0.16em;
          height: 0.16em;
          border-radius: 50%;
          background: var(--rr-red);
          margin-bottom: 0.2em;
        }
        .fmx__preis {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(1.5rem, 2.4vw, 2.1rem);
          line-height: 1;
          letter-spacing: -0.01em;
          color: var(--rr-navy);
          margin: 2px 0 2px;
        }
        .fmx__stufe--featured .fmx__preis {
          color: var(--rr-red);
        }
        .fmx__text {
          font-family: var(--rr-font-ui);
          font-size: 14.5px;
          line-height: 1.55;
          color: var(--rr-ink-soft);
          max-width: 24em;
          margin: 0;
        }

        .fmx__matrix {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: clamp(20px, 3vw, 44px);
          align-content: start;
          border-top: 1px solid rgba(28, 40, 55, 0.1);
        }
        /* Aktives Panel spannt ueber beide Spalten. */
        .fmx__cell.is-active {
          grid-column: 1 / -1;
        }
        .fmx__cell {
          border-bottom: 1px solid rgba(28, 40, 55, 0.1);
          transition: opacity 0.4s var(--rr-ease, ease);
        }
        .fmx__cell.is-dim {
          opacity: 0.4;
        }

        .fmx__btn {
          width: 100%;
          background: transparent;
          border: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: clamp(13px, 1.6vw, 17px) 2px;
          text-align: left;
          transition: padding-left 0.3s var(--rr-ease, ease);
        }
        @media (hover: hover) and (pointer: fine) {
          .fmx__btn:hover {
            padding-left: 10px;
          }
        }
        .fmx__mark {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(28, 40, 55, 0.28);
          flex: none;
          transition: background 0.3s var(--rr-ease, ease),
            transform 0.3s var(--rr-ease, ease);
        }
        .fmx__btn:hover .fmx__mark {
          background: var(--rr-red);
        }
        .fmx__cell.is-active .fmx__mark {
          background: var(--rr-red);
          transform: scale(1.35);
        }
        .fmx__titel {
          font-family: var(--rr-font-display);
          font-weight: 500;
          font-size: clamp(1rem, 1.5vw, 1.18rem);
          letter-spacing: -0.005em;
          color: var(--rr-ink-soft);
          transition: color 0.3s var(--rr-ease, ease),
            font-weight 0.3s var(--rr-ease, ease);
        }
        .fmx__cell.is-active .fmx__titel {
          color: var(--rr-navy);
          font-weight: 700;
        }

        .fmx__panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s var(--rr-ease, ease);
        }
        .fmx__cell.is-active .fmx__panel {
          grid-template-rows: 1fr;
        }
        .fmx__panel-inner {
          overflow: hidden;
          min-height: 0;
        }
        .fmx__detail {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          line-height: 1.62;
          color: var(--rr-navy);
          max-width: 42em;
          margin: 0;
          padding: 4px 2px clamp(18px, 2.4vw, 26px) 21px;
          border-left: 2px solid var(--rr-red);
          margin-left: 2px;
          opacity: 0;
          transition: opacity 0.35s var(--rr-ease, ease) 0.05s;
        }
        .fmx__cell.is-active .fmx__detail {
          opacity: 1;
        }

        @media (max-width: 860px) {
          .fmx__stufe {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .fmx__asideinner {
            position: static;
          }
          .fmx__matrix {
            grid-template-columns: 1fr;
          }
          .fmx__cell.is-active {
            grid-column: auto;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fmx__cell,
          .fmx__btn,
          .fmx__mark,
          .fmx__titel,
          .fmx__panel,
          .fmx__detail {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Kompakte Paket-Karte fuer die MOBILE Stop-Station (Thomas 01.08.: "einen
 * Stop bei jedem der Pakete, Starter/Business, wie beim Ablauf"). Bewusst ohne
 * das Accordion der Desktop-Matrix: Name + "ab"-Preis prominent, Merkmale als
 * kompaktes 2-Spalten-Titel-Raster (nur Ueberschriften, kein Aufklapp-Detail),
 * damit ein ganzes Paket garantiert in EINE Bildschirmhoehe (100svh) passt und
 * nichts intern scrollen muss. Die Merkmals-Details bleiben auf dem Desktop
 * (StufeMatrix) und ueber die Preisseite erreichbar.
 */
function StufeMobileCard({ stufe }: { stufe: (typeof STUFEN)[number] }) {
  const preis = PREISE[stufe.name];
  return (
    <div className={"fmx__mc" + (stufe.featured ? " fmx__mc--featured" : "")}>
      {stufe.featured && <span className="fmx__mtag">MEISTGEWÄHLT</span>}
      <div className="fmx__mhead">
        <h3 className="fmx__mname">
          {stufe.name}
          {stufe.featured && <span className="fmx__mnamedot" aria-hidden="true" />}
        </h3>
        {preis && <p className="fmx__mpreis">{preis}</p>}
      </div>
      <p className="fmx__mtext">{stufe.text}</p>
      <ul className="fmx__mlist">
        {stufe.merkmale.map((m) => (
          <li className="fmx__mitem" key={m.titel}>
            <span className="fmx__mmark" aria-hidden="true" />
            {m.titel}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Sticky-Fahrt: 3 Stufen als eigene 100vh-Fenster, snapUnits-Dwell wie
 * ScrollBumper/CasePanels. Track-Root traegt data-rr-snap (Einstieg rastet
 * ein) + data-rr-snap-exempt (innen regiert das eigene Dwell-System,
 * Muster components/relaunch/ScrollExperience.tsx).
 *
 * Drei Modi (Thomas 01.08.):
 *  - "static"  reduced-motion: gestapelte StufeMatrix, keine Fahrt.
 *  - "desktop" > MOBILE_BREAKPOINT: die bestehende translate-Fahrt (2-Spalten-
 *              Matrix je Fenster). UNVERAENDERT.
 *  - "mobile"  <= MOBILE_BREAKPOINT (kein reduced-motion): jede Stufe eine
 *              gepinnte Crossfade-Station (Ablauf-Mechanik: opacity-Blende
 *              statt translate), damit man an jedem Paket haelt und der
 *              vh/svh-Pixelversatz eines translate-Pins auf Handy entfaellt.
 */
function StufenFahrt() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // SSR-sicher: erst nach Mount entscheiden. Start "static" = kein Layout-Sprung.
  const [mode, setMode] = useState<"static" | "desktop" | "mobile">("static");

  useEffect(() => {
    if (prefersReducedMotion()) {
      setMode("static");
      return;
    }
    const mobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
    setMode(mobile ? "mobile" : "desktop");
  }, []);

  // Desktop-Fahrt: translate-Stage mit snapUnits-Dwell (unveraendert).
  useEffect(() => {
    if (mode !== "desktop") return;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    let rafId = 0;
    let destroyed = false;
    const n = STUFEN.length;

    function render() {
      const vh = window.innerHeight;
      const rect = track!.getBoundingClientRect();
      const total = rect.height - vh;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const units = snapUnits(p * (n - 1), n);
      stage!.style.transform = `translate3d(0, ${-units * vh}px, 0)`;
    }
    function loop() {
      if (destroyed) return;
      render();
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
    };
  }, [mode]);

  // Mobile-Station: aktive Stufe aus dem Scroll-Fortschritt (Ablauf-Muster).
  const activeIdxRef = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    if (mode !== "mobile") return;
    const track = trackRef.current;
    if (!track) return;

    let rafId = 0;
    let destroyed = false;
    const n = STUFEN.length;

    function render() {
      const rect = track!.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const q = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const idx = Math.min(n - 1, Math.max(0, Math.floor(q * n)));
      if (idx !== activeIdxRef.current) {
        activeIdxRef.current = idx;
        setActiveIdx(idx);
      }
    }
    function loop() {
      if (destroyed) return;
      render();
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    window.addEventListener("scroll", render, { passive: true });
    window.addEventListener("resize", render);
    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", render);
      window.removeEventListener("resize", render);
    };
  }, [mode]);

  if (mode === "static") {
    // reduced-motion: statisch gestapelt. Gutter-Padding hier direkt, weil die
    // Fahrt-Route (mit .fmx__wrap) hier nicht greift -- sonst klebten die
    // Stufen am Bildschirmrand (Thomas 01.08.).
    return (
      <div
        className="fmx__static"
        style={{ padding: "0 var(--rr-gutter, clamp(20px, 4vw, 64px))" }}
      >
        {STUFEN.map((s, i) => (
          <StufeMatrix key={s.name} stufe={s} defaultActive={i === 0 ? 0 : null} />
        ))}
      </div>
    );
  }

  if (mode === "mobile") {
    return (
      <div
        ref={trackRef}
        className="fmx__mtrack"
        data-rr-snap
        data-rr-snap-exempt
        style={{
          height: `calc(100svh + ${STUFEN.length * STEP_TRACK_VH_PER_STEP}vh)`,
        }}
      >
        <div className="fmx__msticky">
          {STUFEN.map((s, i) => (
            <div
              className={"fmx__mslot" + (i === activeIdx ? " is-active" : "")}
              key={s.name}
              aria-hidden={i !== activeIdx}
            >
              <StufeMobileCard stufe={s} />
            </div>
          ))}
          <div className="fmx__mdots" aria-hidden="true">
            {STUFEN.map((s, i) => (
              <span
                className={"fmx__mdot" + (i === activeIdx ? " is-on" : "")}
                key={s.name}
              />
            ))}
          </div>
        </div>

        <style>{`
          .fmx__mtrack {
            position: relative;
            width: 100%;
          }
          .fmx__msticky {
            position: sticky;
            top: 0;
            height: 100svh;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 var(--rr-gutter, clamp(20px, 4vw, 64px));
          }
          .fmx__mslot {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 var(--rr-gutter, clamp(20px, 4vw, 64px));
            opacity: 0;
            transform: translateY(10px);
            pointer-events: none;
            transition: opacity ${TRANSITION_MS}ms ${TRANSITION_EASING},
              transform ${TRANSITION_MS}ms ${TRANSITION_EASING};
          }
          .fmx__mslot.is-active {
            opacity: 1;
            transform: none;
            pointer-events: auto;
          }
          .fmx__mc {
            width: 100%;
            max-width: 560px;
          }
          .fmx__mc--featured {
            /* Featured-Rahmen als ruhige Klammer um die ganze Karte. */
            border: 1px solid var(--rr-red);
            padding: clamp(20px, 5vw, 30px);
          }
          .fmx__mtag {
            display: inline-block;
            border: 1px solid var(--rr-red);
            color: var(--rr-red);
            font-family: var(--rr-font-ui);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 4px 10px;
            margin-bottom: 14px;
          }
          .fmx__mhead {
            display: flex;
            align-items: baseline;
            flex-wrap: wrap;
            gap: 6px 16px;
            margin-bottom: 8px;
          }
          .fmx__mname {
            font-family: var(--rr-font-display);
            font-weight: 800;
            font-size: clamp(2.2rem, 11vw, 3rem);
            line-height: 1;
            color: var(--rr-navy);
            margin: 0;
            display: inline-flex;
            align-items: flex-end;
            gap: 0.24em;
            opacity: 0.72;
          }
          .fmx__mc--featured .fmx__mname {
            opacity: 1;
          }
          .fmx__mnamedot {
            width: 0.15em;
            height: 0.15em;
            border-radius: 50%;
            background: var(--rr-red);
            margin-bottom: 0.2em;
          }
          .fmx__mpreis {
            font-family: var(--rr-font-display);
            font-weight: 800;
            font-size: clamp(1.4rem, 6.4vw, 1.9rem);
            line-height: 1;
            letter-spacing: -0.01em;
            color: var(--rr-navy);
            margin: 0;
          }
          .fmx__mc--featured .fmx__mpreis {
            color: var(--rr-red);
          }
          .fmx__mtext {
            font-family: var(--rr-font-ui);
            font-size: clamp(0.95rem, 3.8vw, 1.05rem);
            line-height: 1.5;
            color: var(--rr-ink-soft);
            margin: 0 0 clamp(16px, 4vw, 22px);
          }
          .fmx__mlist {
            list-style: none;
            margin: 0;
            padding: clamp(14px, 4vw, 18px) 0 0;
            border-top: 1px solid rgba(28, 40, 55, 0.14);
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: clamp(9px, 2.4vw, 13px) clamp(14px, 4vw, 22px);
          }
          .fmx__mitem {
            display: flex;
            align-items: baseline;
            gap: 9px;
            font-family: var(--rr-font-display);
            font-weight: 500;
            font-size: clamp(0.9rem, 3.6vw, 1rem);
            line-height: 1.24;
            letter-spacing: -0.005em;
            color: var(--rr-navy);
          }
          .fmx__mmark {
            flex: none;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--rr-red);
            transform: translateY(-1px);
          }
          .fmx__mdots {
            position: absolute;
            left: 0;
            right: 0;
            bottom: clamp(18px, 5vh, 34px);
            display: flex;
            justify-content: center;
            gap: 10px;
          }
          .fmx__mdot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: rgba(28, 40, 55, 0.24);
            transition: background ${TRANSITION_MS}ms ${TRANSITION_EASING},
              transform ${TRANSITION_MS}ms ${TRANSITION_EASING};
          }
          .fmx__mdot.is-on {
            background: var(--rr-red);
            transform: scale(1.3);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      ref={trackRef}
      className="fmx__fahrt-track"
      data-rr-snap
      data-rr-snap-exempt
      style={{ height: `${STUFEN.length * BUMPER_TRACK_VH_PER_WINDOW}vh` }}
    >
      <div className="fmx__fahrt-sticky">
        <div ref={stageRef} className="fmx__fahrt-stage" style={{ height: `${STUFEN.length * 100}vh` }}>
          {STUFEN.map((s, i) => (
            <div className="fmx__fahrt-window" key={s.name} style={{ top: `${i * 100}vh` }}>
              <StufeMatrix stufe={s} defaultActive={i === 0 ? 0 : null} />
            </div>
          ))}
        </div>
      </div>

      {/* Plain globales style-Tag statt <style jsx>: die Fahrt-Klassen werden
          von DIESER Komponente gerendert, nicht von der aeusseren
          DreiStufenMatrix — ein <style jsx> dort haette (hat es auch, Bug
          29.07.) die styled-jsx-Scope-Grenze nie ueberschritten und wirkungslos
          im Leeren gestanden. Klassen bleiben fmx__fahrt-* namespaced. */}
      <style>{`
        .fmx__fahrt-track {
          position: relative;
          width: 100%;
        }
        .fmx__fahrt-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }
        .fmx__fahrt-stage {
          position: relative;
          width: 100%;
          will-change: transform;
        }
        .fmx__fahrt-window {
          position: absolute;
          left: 0;
          width: 100%;
          height: 100vh;
          overflow-y: auto;
          display: flex;
          align-items: center;
          padding: 0 var(--rr-gutter, clamp(20px, 4vw, 64px));
        }
        .fmx__fahrt-window > .fmx__stufe {
          max-width: 1180px;
          margin: 0 auto;
          width: 100%;
          border-top: 0 !important;
          border-bottom: 0 !important;
          padding: clamp(24px, 4vw, 48px) 0;
        }
      `}</style>
    </div>
  );
}

export default function DreiStufenMatrix() {
  const [quizOpen, setQuizOpen] = useState(false);
  useEffect(() => {
    if (!quizOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQuizOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [quizOpen]);

  return (
    <section className="fmx" data-rr-snap>
      <div className="fmx__wrap fmx__wrap--intro">
        <p className="wd-eyebrow">DREI PAKETE</p>
        <h2 className="fmx__h2">Drei Pakete, je nachdem wie viel du brauchst.</h2>
        <p className="fmx__intro">
          Der One-Pager als schlanker Einstieg, wenn eine saubere Seite für den
          Anfang reicht. Das mittlere Paket, das die meisten Betriebe wählen. Und
          die große Lösung, wenn deine Seite richtig etwas leisten soll. Du
          entscheidest dich für eines. Und wer klein anfängt, kann später
          jederzeit wachsen.
        </p>
        {/* Oeffnet den Kurz-Quiz (Diagnose) als Popup. Auf Mobile ist die
            Diagnose-Sektion ausgeblendet und kommt nur hierueber; auf Desktop
            steht sie zusaetzlich inline weiter oben. */}
        <button
          type="button"
          className="fmx__quizbtn"
          onClick={() => setQuizOpen(true)}
        >
          Welches Paket passt zu mir?
        </button>
      </div>

      <StufenFahrt />

      <div className="fmx__wrap">
        <p className="rr-meta fmx__meta">
          Was die Pakete kosten, steht schwarz auf weiß auf der{" "}
          <Link href="/preise" className="rr-link rr-link--text">
            Preisseite
          </Link>
          . Fixpreis, kein Stundensatz-Ratespiel.
        </p>
      </div>

      {quizOpen && (
        <div
          className="fmx__quizoverlay"
          role="dialog"
          aria-modal="true"
          aria-label="Welches Paket passt zu dir?"
          onClick={() => setQuizOpen(false)}
        >
          <div className="fmx__quizpanel" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="fmx__quizclose"
              onClick={() => setQuizOpen(false)}
              aria-label="Schließen"
            >
              &times;
            </button>
            <div className="fmx__quizbody">
              <Diagnose />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .fmx {
          background: #ffffff;
          color: var(--rr-ink);
        }
        .fmx__wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 var(--rr-gutter, clamp(20px, 4vw, 64px));
        }
        .fmx__wrap--intro {
          padding-top: var(--rr-section-y, clamp(96px, 12vw, 180px));
        }
        .fmx__meta {
          padding-bottom: var(--rr-section-y, clamp(96px, 12vw, 180px));
        }
        .fmx__h2 {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          line-height: 1.02;
          letter-spacing: -0.02em;
          color: var(--rr-navy);
          max-width: 16em;
          margin: 18px 0 20px;
        }
        .fmx__intro {
          font-family: var(--rr-font-ui);
          font-size: clamp(1rem, 1.15vw, 1.14rem);
          line-height: 1.65;
          color: var(--rr-ink-soft);
          max-width: 56ch;
          margin: 0 0 clamp(20px, 3vw, 32px);
        }
        .fmx__meta {
          margin-top: clamp(40px, 5vw, 64px);
        }

        /* Quiz-Button bei den Paketen (oeffnet Diagnose als Popup) */
        .fmx__quizbtn {
          margin-top: 6px;
          display: inline-flex;
          align-items: center;
          font-family: var(--rr-font-ui);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--rr-navy, #23262e);
          background: none;
          border: 1px solid var(--rr-navy, #23262e);
          border-radius: 0;
          padding: 13px 24px;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .fmx__quizbtn:hover {
          background: var(--rr-navy, #23262e);
          color: #fff;
        }

        /* Popup: Overlay + Panel (Diagnose-Quiz), inline position:fixed damit
           Fonts/Tokens aus dem .rr-Scope geerbt werden. */
        .fmx__quizoverlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(20, 26, 34, 0.55);
          -webkit-backdrop-filter: blur(2px);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(10px, 4vw, 40px);
          overflow-y: auto;
        }
        .fmx__quizpanel {
          position: relative;
          width: min(760px, 100%);
          max-height: 92vh;
          overflow-y: auto;
          background: #ffffff;
          border: 1px solid rgba(28, 40, 55, 0.14);
          box-shadow: 0 40px 90px -40px rgba(20, 26, 34, 0.6);
        }
        .fmx__quizclose {
          position: absolute;
          top: 10px;
          right: 12px;
          z-index: 2;
          width: 42px;
          height: 42px;
          font-size: 26px;
          line-height: 1;
          color: var(--rr-navy, #23262e);
          background: #ffffff;
          border: 1px solid rgba(28, 40, 55, 0.18);
          border-radius: 50%;
          cursor: pointer;
        }
        /* Section-Padding der eingebetteten Diagnose fuer den Modal-Kontext
           verkleinern (sonst riesige Leerraeume). */
        .fmx__quizbody :global(.wd-diag) {
          padding: clamp(30px, 5vw, 52px) clamp(20px, 4vw, 36px) !important;
        }
      `}</style>
    </section>
  );
}
