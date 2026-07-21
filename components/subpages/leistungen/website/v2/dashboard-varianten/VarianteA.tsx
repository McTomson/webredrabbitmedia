"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TalosEntranceStage from "@/components/relaunch/talos/TalosEntranceStage";

/**
 * Dashboard-Variante A — "BROWSER-FRAME".
 * Ein dunkler Browser-Chrome (Navy, drei Ampel-Punkte, URL-Pill) rahmt ein helles
 * Dashboard-Mockup in unserem Stil: Sidebar-Skeleton links, Panels mit Klartext
 * (Benachrichtigung, Besucher-Skeleton, Status-Ring, Faehigkeiten). Ein Chart-Panel
 * schwebt ueberlappend ueber den oberen Frame-Rand (wie Referenz 1). Talos ragt von
 * rechts HALB ueber den Browser-Rahmen und winkt (TalosEntranceStage in einem absolut
 * positionierten Slot, teils ausserhalb, ueber dem Frame, pointer-events:none).
 * Darunter: H2 + Erklaerabsatz (1:1 aus KollegeAnreisser) + drei kurze Info-Spalten.
 *
 * Keine erfundenen Kennzahlen: alle Panels zeigen Klartext oder reine Skeleton-Balken.
 */
export default function VarianteA() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

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
    <section className="wda">
      <div className="wda__wrap">
        {/* Buehne: Browser-Frame + darueber ragender Talos */}
        <div className={`wda__stageArea ${inView ? "is-in" : ""}`} ref={rootRef}>
          <div className="wda__browser">
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
              </div>
            </div>

            {/* Schwebendes Chart-Panel, ueberlappt den oberen Frame-Rand */}
            <div className="wda__float" aria-hidden="true">
              <span className="wda__cardHead">Klicks nach Seite</span>
              <div className="wda__floatBars">
                <span style={{ height: "72%" }} />
                <span style={{ height: "44%" }} />
                <span style={{ height: "88%" }} />
                <span style={{ height: "58%" }} />
              </div>
            </div>
          </div>

          {/* Talos ragt von rechts halb ueber den Rahmen und winkt */}
          <div className="wda__talos">
            <TalosEntranceStage />
          </div>
        </div>

        {/* Infos UNTER dem Dashboard */}
        <div className="wda__info">
          <p className="rr-eyebrow-lg wda__eyebrow">Nicht nur eine Seite</p>
          <h2 className="rr-statement wda__title">
            Zu einer gewöhnlichen Website bekommst du bei uns einen Helfer dazu.
            Er heisst <span className="wda__name">Talos</span>.
          </h2>
          <p className="rr-body-lg wda__lead">
            Du bekommst ein Dashboard. Dort tauschst du Texte und Bilder selbst.
            Und Talos hilft dir aktiv: Du bekommst eine Nachricht, wenn auf deiner
            Seite etwas nicht stimmt. Du siehst, wie viele Leute da waren und wo sie
            hingeklickt haben.
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
          padding: clamp(72px, 12vh, 148px) var(--rr-gutter, clamp(20px, 4vw, 64px));
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
          background: var(--rr-navy, #1c2837);
          border: 1px solid var(--rr-navy, #1c2837);
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
          background: var(--rr-red, #f12032);
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
          color: #f6f5f1;
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
          color: var(--rr-navy, #1c2837);
          margin-bottom: 8px;
        }
        .wda__sideDot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--rr-red, #f12032);
        }
        .wda__sideLine {
          height: 10px;
          width: 100%;
          background: color-mix(in srgb, var(--rr-navy, #1c2837) 12%, transparent);
        }
        .wda__sideLine--on {
          background: color-mix(in srgb, var(--rr-navy, #1c2837) 42%, transparent);
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
          background: var(--rr-red, #f12032);
        }
        .wda__cardHead {
          font-family: var(--rr-font-ui);
          font-size: 11px;
          font-weight: 650;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--rr-ink-soft, #5a5e68);
        }
        .wda__cardLine {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          color: var(--rr-ink, #23262e);
        }
        .wda__cardSub {
          display: block;
          margin-top: 10px;
          font-family: var(--rr-font-ui);
          font-size: 13px;
          color: var(--rr-ink-soft, #5a5e68);
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
            var(--rr-red, #f12032) 0turn 0.72turn,
            color-mix(in srgb, var(--rr-navy, #1c2837) 14%, transparent) 0.72turn 1turn
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
          background: color-mix(in srgb, var(--rr-navy, #1c2837) 20%, transparent);
          min-height: 4px;
        }
        .wda__spark span:last-child {
          background: var(--rr-navy, #1c2837);
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
          color: var(--rr-ink, #23262e);
        }
        .wda__skills li::before {
          content: "+";
          position: absolute;
          left: 0;
          top: -1px;
          font-weight: 650;
          color: var(--rr-red, #f12032);
        }

        /* Schwebendes Chart-Panel ueber dem oberen Rand */
        .wda__float {
          position: absolute;
          top: -26px;
          right: clamp(96px, 18vw, 260px);
          width: 190px;
          padding: 14px 16px;
          background: var(--rr-paper, #ffffff);
          border: 1px solid rgba(28, 40, 55, 0.16);
          box-shadow: 0 18px 40px -24px rgba(28, 40, 55, 0.5);
        }
        .wda__floatBars {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 42px;
          margin-top: 12px;
        }
        .wda__floatBars span {
          flex: 1;
          background: color-mix(in srgb, var(--rr-navy, #1c2837) 22%, transparent);
        }
        .wda__floatBars span:nth-child(3) {
          background: var(--rr-red, #f12032);
        }

        /* Talos-Slot: ragt rechts halb ueber den Frame */
        .wda__talos {
          position: absolute;
          right: -3%;
          bottom: -6%;
          width: clamp(240px, 32vw, 400px);
          height: clamp(360px, 46vw, 520px);
          z-index: 5;
          pointer-events: none;
        }

        /* ---- Infos ---- */
        .wda__info {
          margin-top: clamp(48px, 7vw, 84px);
          max-width: 1000px;
        }
        .wda__eyebrow {
          color: var(--rr-ink-soft, #5a5e68);
          margin-bottom: 14px;
        }
        .wda__title {
          color: var(--rr-navy, #1c2837);
          max-width: 20em;
        }
        .wda__name {
          color: var(--rr-red, #f12032);
        }
        .wda__lead {
          color: var(--rr-ink-soft, #5a5e68);
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
          color: var(--rr-red, #f12032);
          margin-bottom: 10px;
        }
        .wda__colText {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          line-height: 1.5;
          color: var(--rr-ink, #23262e);
          margin: 0;
        }
        .wda__more {
          margin-top: clamp(28px, 4vw, 40px);
        }

        /* ---- Panel-Einblendung ---- */
        @media (prefers-reduced-motion: no-preference) {
          .wda__card,
          .wda__float {
            opacity: 0;
            transform: translateY(14px);
          }
          .is-in .wda__card {
            animation: wda-rise 560ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
            animation-delay: calc(160ms + var(--i, 0) * 100ms);
          }
          .is-in .wda__float {
            animation: wda-rise 620ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
            animation-delay: 640ms;
          }
        }
        @keyframes wda-rise {
          to {
            opacity: 1;
            transform: none;
          }
        }

        /* ---- Responsive ---- */
        @media (max-width: 860px) {
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
          .wda__sideLine {
            width: 56px;
          }
          .wda__panels {
            grid-template-columns: 1fr;
          }
          .wda__card--note {
            grid-column: auto;
          }
          .wda__float {
            display: none;
          }
          .wda__talos {
            position: relative;
            right: auto;
            bottom: auto;
            width: 100%;
            height: 320px;
            margin-top: 8px;
          }
          .wda__cols {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
