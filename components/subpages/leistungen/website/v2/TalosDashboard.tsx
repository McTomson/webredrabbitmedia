"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TalosEntranceStage from "@/components/relaunch/talos/TalosEntranceStage";

/**
 * Talos-Dashboard — LIVE (Thomas' Wahl 21.07. aus /dashboard-varianten):
 * Variante A "Browser-Frame". Ein dunkler Browser-Chrome (Navy, Ampel-Punkte,
 * URL-Pill) rahmt ein helles Dashboard-Mockup: Sidebar-Skeleton, Panels mit
 * Klartext (Benachrichtigung, Status-Ring, Besucher-Skeleton, Faehigkeiten).
 * Talos ragt von rechts halb ueber den Rahmen, spielt seinen Auftritt und
 * winkt bei Klick erneut. Darunter: Eyebrow + H2 + Erklaerabsatz + drei
 * Info-Spalten.
 *
 * Fixes ggue. der Variante (Thomas-Feedback 22.07.):
 *  1) "Klicks nach Seite" ist ein normales Panel IM Dashboard (unten rechts im
 *     Panel-Raster), kein schwebendes Feld mehr; Kartendesign wie "Besucher".
 *  2) Talos weiter nach rechts + tiefer (ueber die untere Frame-Kante), Fuesse
 *     bleiben sichtbar (Kamera-Framing unveraendert).
 *  3) Reihenfolge: erst das Dashboard einblenden, dann tritt Talos auf
 *     (TalosEntranceStage autoplayDelayMs).
 *  4) Talos winkt bei Klick mit der ANDEREN Hand (talosMotion "other").
 *
 * Keine erfundenen Kennzahlen: alle Panels zeigen Klartext oder Skeleton-Balken.
 */
export default function TalosDashboard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const browserRef = useRef<HTMLDivElement>(null);
  const talosRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  // Mobile-Pan aktiv nur bei schmalem Viewport UND erlaubter Bewegung
  // (deckungsgleich mit der Media Query der gepinnten Szene). Erst nach Mount
  // gesetzt, damit SSR desktop-sicher bleibt.
  const [panActive, setPanActive] = useState(false);

  useEffect(() => {
    setPanActive(
      window.matchMedia("(max-width: 860px)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  // Auto-Scroll-Pan (Mobile): vertikaler Track-Fortschritt q treibt das
  // horizontale translateX des Dashboards; Talos blendet in der zweiten Haelfte
  // ein. Liest nur die Scroll-Position (kapert den Touch nicht), Muster wie
  // Ablauf/StufenFahrt.
  useEffect(() => {
    if (!panActive) return;
    const track = rootRef.current;
    const browser = browserRef.current;
    const talos = talosRef.current;
    if (!track || !browser) return;
    let raf = 0;
    let destroyed = false;
    const clamp = (n: number, a: number, b: number) => (n < a ? a : n > b ? b : n);

    const render = () => {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const denom = rect.height - vh;
      const q = denom > 0 ? clamp(-rect.top / denom, 0, 1) : 0;
      const stageW = browser.parentElement ? browser.parentElement.clientWidth : 0;
      const shift = Math.max(0, browser.offsetWidth - stageW); // = eine Sichtfensterbreite
      browser.style.transform = `translate3d(${(-q * shift).toFixed(1)}px,0,0)`;
      if (talos) {
        const tv = clamp((q - 0.45) / 0.4, 0, 1);
        talos.style.opacity = tv.toFixed(3);
        talos.style.transform = `translateX(${((1 - tv) * 24).toFixed(1)}px)`;
      }
    };
    const loop = () => {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("scroll", render, { passive: true });
    window.addEventListener("resize", render);
    render();
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", render);
      window.removeEventListener("resize", render);
    };
  }, [panActive]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Dekorative Balken (aria-hidden), bewusst keine aussagekraeftige Kennzahl.
  const spark = [34, 52, 41, 68, 57, 79, 63, 48];

  return (
    <section className="wda" data-rr-snap>
      <div className="wda__wrap">
        {/* Buehne: Browser-Frame + darueber ragender Talos */}
        <div className={`wda__stageArea ${inView ? "is-in" : ""}`} ref={rootRef}>
          {/* Mobile/Tablet: gepinnte Szene. Vertikales Scrollen pannt das
              Dashboard automatisch nach rechts (rAF setzt translateX), Talos
              blendet ueber der zweiten Haelfte ein. Auf dem Desktop ist der
              Scroller ein transparenter, unpositionierter Wrapper (alle
              Mobile-Regeln unter @media max-width:860px), Layout unveraendert. */}
          <div className="wda__scroller">
            <div className="wda__browser" ref={browserRef}>
            {/* Browser-Chrome */}
            <div className="wda__chrome">
              <span className="wda__lights" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="wda__url">
                <span className="wda__lock" aria-hidden="true" />
                dein-dashboard.redrabbit.media
              </span>
              <span className="wda__chromeSpacer" aria-hidden="true" />
            </div>

            {/* Heller Dashboard-Screen */}
            <div className="wda__screen">
              {/* Sidebar-Skeleton */}
              <aside className="wda__side" aria-hidden="true">
                <span className="wda__sideBrand">
                  <span className="wda__sideDot" />
                  TALOS
                </span>
                <span className="wda__sideLine wda__sideLine--on" />
                <span className="wda__sideLine" />
                <span className="wda__sideLine" />
                <span className="wda__sideLine" />
                <span className="wda__sideLine wda__sideLine--short" />
              </aside>

              {/* Panel-Feld */}
              <div className="wda__panels">
                {/* Benachrichtigung */}
                <div
                  className="wda__card wda__card--note"
                  style={{ "--i": 0 } as React.CSSProperties}
                >
                  <span className="wda__mark" aria-hidden="true" />
                  <span className="wda__cardHead">Benachrichtigung</span>
                  <span className="wda__cardLine">
                    Formular geprüft: alles in Ordnung.
                  </span>
                </div>

                {/* Status-Ring (Donut ohne Zahl) */}
                <div
                  className="wda__card wda__card--ring"
                  style={{ "--i": 1 } as React.CSSProperties}
                >
                  <span className="wda__donut" aria-hidden="true">
                    <span className="wda__donutHole" />
                  </span>
                  <span className="wda__ringMeta">
                    <span className="wda__cardHead">Deine Seite</span>
                    <span className="wda__cardSub">läuft, alles online</span>
                  </span>
                </div>

                {/* Besucher-Skeleton */}
                <div
                  className="wda__card wda__card--stats"
                  style={{ "--i": 2 } as React.CSSProperties}
                >
                  <span className="wda__cardHead">Besucher diese Woche</span>
                  <div className="wda__spark" aria-hidden="true">
                    {spark.map((h, i) => (
                      <span key={i} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <span className="wda__cardSub">Und wo sie hingeklickt haben.</span>
                </div>

                {/* Faehigkeiten */}
                <div
                  className="wda__card wda__card--skills"
                  style={{ "--i": 3 } as React.CSSProperties}
                >
                  <span className="wda__cardHead">Talos kann mehr lernen</span>
                  <ul className="wda__skills">
                    <li>Blogbeiträge schreiben</li>
                    <li>Kunden suchen und anschreiben</li>
                    <li>Auf Social Media posten</li>
                  </ul>
                </div>

                {/* Klicks nach Seite — normales Panel unten rechts im Dashboard
                    (FIX 1: kein schwebendes Feld mehr), gleiches Kartendesign
                    wie "Besucher diese Woche". */}
                <div
                  className="wda__card wda__card--clicks"
                  style={{ "--i": 4 } as React.CSSProperties}
                >
                  <span className="wda__cardHead">Klicks nach Seite</span>
                  <div className="wda__clickBars" aria-hidden="true">
                    <span style={{ height: "72%" }} />
                    <span style={{ height: "44%" }} />
                    <span style={{ height: "88%" }} />
                    <span style={{ height: "58%" }} />
                  </div>
                  <span className="wda__cardSub">Welche Seite am meisten geklickt wird.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Talos liegt UEBER dem Dashboard. Mobile: absolut in der gepinnten
              Szene, z-index oben, von JS eingeblendet, sobald nach rechts
              gepannt wird. Desktop: absolut zur stageArea (scroller dort
              unpositioniert), Position unveraendert. Erscheint nach den Panels
              (autoplayDelayMs). */}
          <div className="wda__talos" ref={talosRef}>
            <TalosEntranceStage
                waveOnClick
                greetArm="other"
                autoplayDelayMs={900}
                /* Ganzkoerper-Kadrierung (Fuesse sichtbar): im Browser getuned,
                   Default der Buehne rahmt nur den Oberkoerper. camTgt.y auf 140
                   gesenkt (22.07.): bei 170 klippte die Schuh-Unterkante an der
                   Canvas-Unterkante (vertikales FOV fix -> hoehere Slot-Hoehe
                   allein zeigt die Fuesse nicht; Kamera muss tiefer zielen).
                   Bei 1280 UND 1500 Fensterbreite mit Schuh-Marge verifiziert. */
                camPos={[30, 190, 1150]}
                camTgt={[0, 140, 12]}
              />
          </div>
          </div>
        </div>

        {/* Infos UNTER dem Dashboard */}
        <div className="wda__info">
          <p className="wd-eyebrow wda__eyebrow">NICHT NUR EINE SEITE</p>
          <h2 className="rr-statement wda__title">
            Zu einer gewöhnlichen Website bekommst du bei uns einen Copiloten
            dazu. Er heisst <span className="wda__name">Talos</span>.
          </h2>
          <p className="rr-body-lg wda__lead">
            Talos ist bei jeder Website dabei und zeigt dir, wie sie läuft: ob
            alles online ist, wie viele Leute da waren, wo sie herkommen und wo
            sie hinklicken. Seine Infos zieht er aus Google Search, deiner Heatmap
            und dem Google Tag. Und er meldet sich, wenn etwas nicht stimmt.
          </p>

          <div className="wda__cols">
            <div className="wda__col">
              <span className="wda__colHead">Passt auf</span>
              <p className="wda__colText">
                Du bekommst eine Nachricht, wenn auf deiner Seite etwas nicht
                stimmt.
              </p>
            </div>
            <div className="wda__col">
              <span className="wda__colHead">Zeigt dir alles</span>
              <p className="wda__colText">
                Du siehst, wie viele Leute da waren und wo sie hingeklickt haben.
              </p>
            </div>
            <div className="wda__col">
              <span className="wda__colHead">Kann mehr lernen</span>
              <p className="wda__colText">
                Blogbeiträge schreiben, Kunden anschreiben, auf Social Media
                posten. Wenn du willst.
              </p>
            </div>
          </div>

          <p className="wda__more">
            <Link href="/relaunch-preview/leistungen" className="rr-link">
              Was Talos alles kann, siehst du auf der Leistungs-Seite
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .wda {
          padding: var(--rr-section-y, clamp(96px, 12vw, 180px))
            var(--rr-gutter, clamp(20px, 4vw, 64px));
          background: var(--rr-surface, #f4f4f2);
        }
        .wda__wrap {
          max-width: 1180px;
          margin: 0 auto;
        }

        /* ---- Buehne ---- */
        .wda__stageArea {
          position: relative;
          /* Platz rechts, damit Talos ueber den Rahmen ragen kann */
          padding-right: clamp(0px, 6vw, 96px);
        }

        .wda__browser {
          position: relative;
          background: var(--rr-navy);
          border: 1px solid var(--rr-navy);
          padding: 0 0 12px;
        }

        .wda__chrome {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
        }
        .wda__lights {
          display: inline-flex;
          gap: 8px;
        }
        .wda__lights span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(246, 245, 241, 0.32);
        }
        .wda__lights span:first-child {
          background: var(--rr-red);
        }
        .wda__url {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          justify-self: center;
          min-width: min(420px, 62%);
          padding: 7px 16px;
          background: rgba(246, 245, 241, 0.1);
          border: 1px solid rgba(246, 245, 241, 0.16);
          font-family: var(--rr-font-ui);
          font-size: 13px;
          letter-spacing: 0.01em;
          color: #f4f4f2;
        }
        .wda__lock {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #2ea44f;
        }
        .wda__chromeSpacer {
          width: 44px;
        }

        .wda__screen {
          display: grid;
          grid-template-columns: 168px 1fr;
          gap: 0;
          margin: 0 12px;
          background: var(--rr-paper, #ffffff);
          border: 1px solid rgba(28, 40, 55, 0.14);
        }

        /* Sidebar */
        .wda__side {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 22px 18px;
          border-right: 1px solid rgba(28, 40, 55, 0.12);
        }
        .wda__sideBrand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--rr-font-ui);
          font-size: 12px;
          font-weight: 650;
          letter-spacing: 0.16em;
          color: var(--rr-navy);
          margin-bottom: 8px;
        }
        .wda__sideDot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--rr-red);
        }
        .wda__sideLine {
          height: 10px;
          width: 100%;
          background: color-mix(in srgb, var(--rr-navy) 12%, transparent);
        }
        .wda__sideLine--on {
          background: color-mix(in srgb, var(--rr-navy) 42%, transparent);
          width: 82%;
        }
        .wda__sideLine--short {
          width: 60%;
        }

        /* Panel-Feld */
        .wda__panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          padding: 20px;
        }
        .wda__card {
          padding: 16px 18px;
          border: 1px solid rgba(28, 40, 55, 0.14);
          background: var(--rr-paper, #ffffff);
        }
        .wda__card--stats,
        .wda__card--skills {
          grid-column: span 1;
        }
        .wda__card--note {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
          column-gap: 12px;
          row-gap: 4px;
          align-items: center;
        }
        .wda__mark {
          grid-row: 1 / 3;
          width: 12px;
          height: 12px;
          background: var(--rr-red);
        }
        .wda__cardHead {
          font-family: var(--rr-font-ui);
          font-size: 11px;
          font-weight: 650;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--rr-ink-soft);
        }
        .wda__cardLine {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          color: var(--rr-ink);
        }
        .wda__cardSub {
          display: block;
          margin-top: 10px;
          font-family: var(--rr-font-ui);
          font-size: 13px;
          color: var(--rr-ink-soft);
        }

        /* Status-Ring */
        .wda__card--ring {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .wda__donut {
          position: relative;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: conic-gradient(
            var(--rr-red) 0turn 0.72turn,
            color-mix(in srgb, var(--rr-navy) 14%, transparent) 0.72turn 1turn
          );
          flex: none;
        }
        .wda__donutHole {
          position: absolute;
          inset: 9px;
          border-radius: 50%;
          background: var(--rr-paper, #ffffff);
        }
        .wda__ringMeta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        /* Sparkline */
        .wda__spark {
          display: flex;
          align-items: flex-end;
          gap: 5px;
          height: 46px;
          margin-top: 12px;
        }
        .wda__spark span {
          flex: 1;
          background: color-mix(in srgb, var(--rr-navy) 20%, transparent);
          min-height: 4px;
        }
        .wda__spark span:last-child {
          background: var(--rr-navy);
        }

        .wda__skills {
          list-style: none;
          margin: 12px 0 0;
          padding: 0;
          display: grid;
          gap: 8px;
        }
        .wda__skills li {
          position: relative;
          padding-left: 20px;
          font-family: var(--rr-font-ui);
          font-size: 14px;
          color: var(--rr-ink);
        }
        .wda__skills li::before {
          content: "+";
          position: absolute;
          left: 0;
          top: -1px;
          font-weight: 650;
          color: var(--rr-red);
        }

        /* FIX 1 — "Klicks nach Seite" ist jetzt ein normales Panel im Dashboard
           (unten rechts im Panel-Raster), gleiches Kartendesign wie "Besucher
           diese Woche": Skeleton-Balken mit einem roten Balken. */
        .wda__clickBars {
          display: flex;
          align-items: flex-end;
          gap: 5px;
          height: 46px;
          margin-top: 12px;
        }
        .wda__clickBars span {
          flex: 1;
          background: color-mix(in srgb, var(--rr-navy) 20%, transparent);
          min-height: 4px;
        }
        .wda__clickBars span:nth-child(3) {
          background: var(--rr-red);
        }

        /* FIX 2 — Talos-Slot: weiter rechts, hoeher, bodenverankert, damit der
           ganze Koerper inkl. Fuesse sichtbar ist (er ragt weiter rechts ueber
           den Rahmen, unten aber nicht mehr abgeschnitten). */
        .wda__talos {
          position: absolute;
          right: -14%;
          bottom: -10%;
          width: clamp(260px, 34vw, 460px);
          height: clamp(440px, 56vw, 680px);
          z-index: 5;
          pointer-events: none;
        }

        /* ---- Infos ---- */
        .wda__info {
          margin-top: clamp(48px, 7vw, 84px);
          max-width: 1000px;
        }
        .wda__eyebrow {
          margin-bottom: 14px;
        }
        .wda__title {
          color: var(--rr-navy);
          max-width: 20em;
        }
        .wda__name {
          color: var(--rr-red);
        }
        .wda__lead {
          color: var(--rr-ink-soft);
          max-width: 44em;
          margin-top: clamp(16px, 2vw, 22px);
        }
        .wda__cols {
          margin-top: clamp(32px, 4vw, 46px);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(20px, 3vw, 40px);
        }
        .wda__col {
          border-top: 1px solid rgba(28, 40, 55, 0.18);
          padding-top: 16px;
        }
        .wda__colHead {
          display: block;
          font-family: var(--rr-font-ui);
          font-size: 12px;
          font-weight: 650;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--rr-red);
          margin-bottom: 10px;
        }
        .wda__colText {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          line-height: 1.5;
          color: var(--rr-ink);
          margin: 0;
        }
        .wda__more {
          margin-top: clamp(28px, 4vw, 40px);
        }

        /* ---- Panel-Einblendung ---- */
        @media (prefers-reduced-motion: no-preference) {
          .wda__card {
            opacity: 0;
            transform: translateY(14px);
          }
          .is-in .wda__card {
            animation: wda-rise 560ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
            animation-delay: calc(160ms + var(--i, 0) * 100ms);
          }
        }
        @keyframes wda-rise {
          to {
            opacity: 1;
            transform: none;
          }
        }

        /* ---- Responsive: Mobile/Tablet = gepinnte Auto-Scroll-Szene ----
           Thomas 01.08.: das Dashboard pannt beim vertikalen Scrollen
           automatisch nach rechts (rAF setzt translateX auf .wda__browser),
           Talos blendet ueber der zweiten Haelfte ein und liegt UEBER dem
           Dashboard. Der Browser bleibt im Desktop-2-Spalter (nicht stapeln),
           ist doppelt so breit wie das Sichtfenster (= zwei Haelften). Nur bei
           erlaubter Bewegung; reduced-motion bekommt darunter den statischen
           Fallback. */
        @media (max-width: 860px) and (prefers-reduced-motion: no-preference) {
          .wda__stageArea {
            padding-right: 0;
            position: relative;
            /* Track: 100svh Pin + Pan-Strecke. */
            height: calc(100svh + 85vh);
          }
          .wda__scroller {
            position: sticky;
            top: 0;
            height: 100svh;
            overflow: hidden;
            display: flex;
            align-items: center;
          }
          .wda__browser {
            width: 200%;
            flex: none;
            will-change: transform;
          }
          .wda__screen {
            grid-template-columns: 128px 1fr;
          }
          .wda__side {
            padding: 16px 12px;
          }
          .wda__panels {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            padding: 14px;
          }
          .wda__card--note {
            grid-column: 1 / -1;
          }
          /* Talos liegt UEBER dem Dashboard (z-index), rechts in der gepinnten
             Szene; JS blendet ihn ein, sobald nach rechts gepannt wird
             (opacity 0 -> 1). */
          .wda__talos {
            position: absolute;
            right: 2%;
            bottom: 0;
            width: clamp(190px, 48vw, 300px);
            height: clamp(300px, 62vh, 440px);
            margin-top: 0;
            z-index: 5;
            opacity: 0;
            pointer-events: none;
          }
          .wda__cols {
            grid-template-columns: 1fr;
          }
        }

        /* Reduced-motion auf Mobile: kein Pan/Pin, statisch gestapelt. */
        @media (max-width: 860px) and (prefers-reduced-motion: reduce) {
          .wda__stageArea {
            padding-right: 0;
          }
          .wda__screen {
            grid-template-columns: 1fr;
          }
          .wda__side {
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            border-right: none;
            border-bottom: 1px solid rgba(28, 40, 55, 0.12);
          }
          .wda__panels {
            grid-template-columns: 1fr;
          }
          .wda__card--note {
            grid-column: auto;
          }
          .wda__talos {
            position: relative;
            right: auto;
            bottom: auto;
            width: 100%;
            height: 300px;
            margin-top: 12px;
          }
          .wda__cols {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
