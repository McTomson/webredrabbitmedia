"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TalosEntranceStage from "@/components/relaunch/talos/TalosEntranceStage";

/**
 * Dashboard-Variante C — "KOMMANDOZENTRALE DUNKEL".
 * Navy-Sektion mit dunklem Dashboard (dunkle Panels, Offwhite-Typo, rote Akzente)
 * und App-Kopfleiste mit Ampel-Punkten. Talos schaut von OBEN HINTER dem Dashboard
 * hervor (halber Koerper, winkt): sein Slot liegt hinter dem Board (z-index darunter),
 * das Board deckt den Unterkoerper ab, Kopf/Oberkoerper ragen ueber die Board-Kante.
 * Infos darunter als 2-spaltiger HELLER Block (Kontrast auf Navy).
 *
 * Keine erfundenen Kennzahlen: Klartext oder reine Skeleton-Balken. H2 + Absatz 1:1
 * aus KollegeAnreisser. Poster-Fallback von TalosEntranceStage ist hell; auf Navy
 * bleibt das als bewusster, seltener No-WebGL-Fallback akzeptabel.
 */
export default function VarianteC() {
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

  const spark = [32, 50, 40, 66, 55, 78, 60, 86];

  return (
    <section className="wdc">
      <div className="wdc__wrap">
        <div className={`wdc__stage ${inView ? "is-in" : ""}`} ref={rootRef}>
          {/* Talos hinter dem Board, schaut von oben hervor */}
          <div className="wdc__talos">
            <TalosEntranceStage />
          </div>

          {/* Dunkles Board */}
          <div className="wdc__board">
            <div className="wdc__bar">
              <span className="wdc__lights" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="wdc__barTitle">TALOS · KOMMANDOZENTRALE</span>
              <span className="wdc__status">
                <span className="wdc__statusDot" aria-hidden="true" />
                online
              </span>
            </div>

            <div className="wdc__panels">
              {/* Benachrichtigung */}
              <div
                className="wdc__card wdc__card--note"
                style={{ "--i": 0 } as React.CSSProperties}
              >
                <span className="wdc__mark" aria-hidden="true" />
                <span className="wdc__cardHead">Benachrichtigung</span>
                <span className="wdc__cardLine">
                  Formular geprüft: alles in Ordnung.
                </span>
              </div>

              {/* Status-Ring */}
              <div
                className="wdc__card wdc__card--ring"
                style={{ "--i": 1 } as React.CSSProperties}
              >
                <span className="wdc__donut" aria-hidden="true">
                  <span className="wdc__donutHole" />
                </span>
                <span className="wdc__ringMeta">
                  <span className="wdc__cardHead">Deine Seite</span>
                  <span className="wdc__cardSub">läuft, alles online</span>
                </span>
              </div>

              {/* Besucher-Skeleton */}
              <div
                className="wdc__card wdc__card--stats"
                style={{ "--i": 2 } as React.CSSProperties}
              >
                <span className="wdc__cardHead">Besucher diese Woche</span>
                <div className="wdc__spark" aria-hidden="true">
                  {spark.map((h, i) => (
                    <span key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <span className="wdc__cardSub">Und wo sie hingeklickt haben.</span>
              </div>

              {/* Faehigkeiten */}
              <div
                className="wdc__card wdc__card--skills"
                style={{ "--i": 3 } as React.CSSProperties}
              >
                <span className="wdc__cardHead">Talos kann mehr lernen</span>
                <ul className="wdc__skills">
                  <li>Blogbeiträge schreiben</li>
                  <li>Kunden anschreiben</li>
                  <li>Social Media posten</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Heller 2-spaltiger Info-Block auf Navy */}
        <div className="wdc__info">
          <div className="wdc__infoLeft">
            <p className="wdc__eyebrow">Nicht nur eine Seite</p>
            <h2 className="wdc__title">
              Zu einer gewöhnlichen Website bekommst du bei uns einen Helfer dazu.
              Er heisst <span className="wdc__name">Talos</span>.
            </h2>
          </div>
          <div className="wdc__infoRight">
            <p className="wdc__lead">
              Du bekommst ein Dashboard. Dort tauschst du Texte und Bilder selbst.
              Und Talos hilft dir aktiv: Du bekommst eine Nachricht, wenn auf deiner
              Seite etwas nicht stimmt. Du siehst, wie viele Leute da waren und wo
              sie hingeklickt haben.
            </p>
            <p className="wdc__more">
              <Link href="/relaunch-preview/leistungen" className="rr-link rr-link--text">
                Was Talos alles kann, siehst du auf der Leistungs-Seite
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wdc {
          padding: clamp(72px, 12vh, 148px) var(--rr-gutter, clamp(20px, 4vw, 64px));
          background: var(--rr-navy, #1c2837);
        }
        .wdc__wrap {
          max-width: 1120px;
          margin: 0 auto;
        }

        /* ---- Buehne ---- */
        .wdc__stage {
          position: relative;
          /* Kopfraum fuer den ueber die Board-Kante ragenden Talos */
          padding-top: clamp(120px, 20vw, 220px);
        }

        /* Talos-Slot hinter dem Board */
        .wdc__talos {
          position: absolute;
          top: 0;
          right: clamp(4%, 12vw, 16%);
          width: clamp(240px, 30vw, 380px);
          height: clamp(360px, 44vw, 500px);
          z-index: 1;
          pointer-events: none;
        }

        /* Dunkles Board */
        .wdc__board {
          position: relative;
          z-index: 2;
          background: #202c3b;
          border: 1px solid rgba(246, 245, 241, 0.14);
        }
        .wdc__bar {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 16px;
          padding: 13px 18px;
          border-bottom: 1px solid rgba(246, 245, 241, 0.12);
        }
        .wdc__lights {
          display: inline-flex;
          gap: 8px;
        }
        .wdc__lights span {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: rgba(246, 245, 241, 0.28);
        }
        .wdc__lights span:first-child {
          background: var(--rr-red, #f12032);
        }
        .wdc__barTitle {
          justify-self: center;
          font-family: var(--rr-font-ui);
          font-size: 12px;
          font-weight: 650;
          letter-spacing: 0.16em;
          color: #f6f5f1;
        }
        .wdc__status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--rr-font-ui);
          font-size: 12px;
          color: rgba(246, 245, 241, 0.72);
        }
        .wdc__statusDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2ea44f;
          box-shadow: 0 0 0 3px rgba(46, 164, 79, 0.2);
        }

        .wdc__panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          padding: 20px;
        }
        .wdc__card {
          padding: 16px 18px;
          background: #1a2432;
          border: 1px solid rgba(246, 245, 241, 0.1);
        }
        .wdc__card--note {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
          column-gap: 12px;
          row-gap: 4px;
          align-items: center;
        }
        .wdc__mark {
          grid-row: 1 / 3;
          width: 12px;
          height: 12px;
          background: var(--rr-red, #f12032);
        }
        .wdc__cardHead {
          font-family: var(--rr-font-ui);
          font-size: 11px;
          font-weight: 650;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(246, 245, 241, 0.62);
        }
        .wdc__cardLine {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          color: #f6f5f1;
        }
        .wdc__cardSub {
          display: block;
          margin-top: 10px;
          font-family: var(--rr-font-ui);
          font-size: 13px;
          color: rgba(246, 245, 241, 0.6);
        }

        .wdc__card--ring {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .wdc__donut {
          position: relative;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          flex: none;
          background: conic-gradient(
            var(--rr-red, #f12032) 0turn 0.72turn,
            rgba(246, 245, 241, 0.16) 0.72turn 1turn
          );
        }
        .wdc__donutHole {
          position: absolute;
          inset: 9px;
          border-radius: 50%;
          background: #1a2432;
        }
        .wdc__ringMeta {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .wdc__spark {
          display: flex;
          align-items: flex-end;
          gap: 5px;
          height: 46px;
          margin-top: 12px;
        }
        .wdc__spark span {
          flex: 1;
          background: rgba(246, 245, 241, 0.22);
          min-height: 4px;
        }
        .wdc__spark span:last-child {
          background: var(--rr-red, #f12032);
        }

        .wdc__skills {
          list-style: none;
          margin: 12px 0 0;
          padding: 0;
          display: grid;
          gap: 8px;
        }
        .wdc__skills li {
          position: relative;
          padding-left: 20px;
          font-family: var(--rr-font-ui);
          font-size: 14px;
          color: #f6f5f1;
        }
        .wdc__skills li::before {
          content: "+";
          position: absolute;
          left: 0;
          top: -1px;
          font-weight: 650;
          color: var(--rr-red, #f12032);
        }

        /* ---- Heller 2-spaltiger Info-Block ---- */
        .wdc__info {
          margin-top: clamp(40px, 6vw, 72px);
          background: var(--rr-paper, #ffffff);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(28px, 5vw, 64px);
          padding: clamp(28px, 4vw, 48px);
          border: 1px solid rgba(246, 245, 241, 0.1);
        }
        .wdc__eyebrow {
          font-family: var(--rr-font-ui);
          font-size: 13px;
          font-weight: 650;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-red, #f12032);
          margin: 0 0 16px;
        }
        .wdc__title {
          font-family: var(--rr-font-serif);
          font-weight: 500;
          font-size: clamp(1.5rem, 3vw, 2.3rem);
          line-height: 1.16;
          color: var(--rr-navy, #1c2837);
          margin: 0;
          max-width: 16em;
        }
        .wdc__name {
          color: var(--rr-red, #f12032);
        }
        .wdc__lead {
          font-family: var(--rr-font-ui);
          font-size: clamp(1rem, 1.4vw, 1.12rem);
          line-height: 1.55;
          color: var(--rr-ink-soft, #5a5e68);
          margin: 0;
        }
        .wdc__more {
          margin: clamp(22px, 3vw, 30px) 0 0;
        }

        /* ---- Entrance ---- */
        @media (prefers-reduced-motion: no-preference) {
          .wdc__card {
            opacity: 0;
            transform: translateY(14px);
          }
          .is-in .wdc__card {
            animation: wdc-rise 560ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
            animation-delay: calc(200ms + var(--i, 0) * 100ms);
          }
        }
        @keyframes wdc-rise {
          to {
            opacity: 1;
            transform: none;
          }
        }

        /* ---- Responsive ---- */
        @media (max-width: 860px) {
          .wdc__stage {
            padding-top: 300px;
          }
          .wdc__talos {
            right: 50%;
            transform: translateX(50%);
            width: 260px;
            height: 340px;
          }
          .wdc__panels {
            grid-template-columns: 1fr;
          }
          .wdc__card--note {
            grid-column: auto;
          }
          .wdc__info {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
