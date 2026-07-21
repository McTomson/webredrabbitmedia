"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TalosEntranceStage from "@/components/relaunch/talos/TalosEntranceStage";

/**
 * v2 — "Dein Helfer" (ersetzt das Navy-Band "Deine Website kommt nicht allein").
 * Auftrag Thomas 21.07.: EINFACH erklaeren, der ganze Bereich als minimalistisches
 * DASHBOARD, rechts Talos eingebunden und winkend, links der Text im Dashboard-Look.
 *
 * Aufbau: helle Sektion, darin EIN grosses Dashboard-Fenster (1px Navy-Rahmen,
 * eckig). Kopfleiste "TALOS · DEIN DASHBOARD" + Status "online". Innen zweispaltig:
 * links Fliesstext (H2 + Erklaerabsatz) plus flache UI-Panels (Benachrichtigung,
 * Zahlen als reine CSS-Sparkline OHNE erfundene Kennzahl, erweiterbare Faehigkeiten),
 * rechts die Talos-Buehne (TalosEntranceStage, 1:1 wiederverwendet: fliegt ein,
 * dreht sich, winkt; eigener Poster-/reduced-motion-Fallback).
 *
 * Talos-Einbindung: TalosEntranceStage direkt importiert (identisch zum Hub /
 * TalosSlot; kein dynamic-import noetig, da window nur im useEffect beruehrt wird).
 * Die Buehne fuellt ihre Zelle (height:100%), darum bekommt die Zelle feste Hoehe.
 * Kein "KI"-/"Agent"-Wort, keine Emojis, keine erfundenen Zahlen, kein Preis.
 */
export default function KollegeAnreisser() {
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

  // Deterministische Balken-Hoehen fuer die Sparkline (rein dekorativ, aria-hidden;
  // bewusst KEINE aussagekraeftige Kennzahl, nur ein neutraler Verlauf).
  const spark = [34, 52, 41, 68, 57, 79, 63];

  return (
    <section className="wd-kol">
      <div className={`wd-kol__panel ${inView ? "is-in" : ""}`} ref={rootRef}>
        {/* Kopfleiste */}
        <div className="wd-kol__bar">
          <span className="wd-kol__brand">TALOS · DEIN DASHBOARD</span>
          <span className="wd-kol__status">
            <span className="wd-kol__statusdot" aria-hidden="true" />
            online
          </span>
        </div>

        {/* Fenster-Inhalt: links Text + Panels, rechts Talos */}
        <div className="wd-kol__body">
          <div className="wd-kol__left">
            <p className="wd-eyebrow wd-kol__eyebrow">(NICHT NUR EINE SEITE)</p>

            <h2 className="rr-statement wd-kol__title">
              Zu einer gewöhnlichen Website bekommst du bei uns einen Helfer
              dazu. Er heisst <span className="wd-kol__name">Talos</span>.
            </h2>

            <p className="rr-body-lg wd-kol__lead">
              Du bekommst ein Dashboard. Dort tauschst du Texte und Bilder selbst.
              Und Talos hilft dir aktiv: Du bekommst eine Nachricht, wenn auf
              deiner Seite etwas nicht stimmt. Du siehst, wie viele Leute da waren
              und wo sie hingeklickt haben.
            </p>

            {/* Panel 1 — Benachrichtigung (einziger roter Akzent) */}
            <div
              className="wd-kol__card wd-kol__card--note"
              style={{ "--wd-i": 0 } as React.CSSProperties}
            >
              <span className="wd-kol__mark" aria-hidden="true" />
              <span className="wd-kol__cardhead">Benachrichtigung</span>
              <span className="wd-kol__cardline">
                Formular geprüft: alles in Ordnung.
              </span>
            </div>

            {/* Panel 2 — Zahlen ohne Zahl: neutrale Sparkline aus divs */}
            <div
              className="wd-kol__card wd-kol__card--stats"
              style={{ "--wd-i": 1 } as React.CSSProperties}
            >
              <span className="wd-kol__cardhead">Besucher diese Woche</span>
              <div className="wd-kol__spark" aria-hidden="true">
                {spark.map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
              <span className="wd-kol__cardsub">Und wo sie hingeklickt haben.</span>
            </div>

            {/* Panel 3 — erweiterbare Faehigkeiten */}
            <div
              className="wd-kol__card wd-kol__card--skills"
              style={{ "--wd-i": 2 } as React.CSSProperties}
            >
              <span className="wd-kol__cardhead">
                Talos kann mehr lernen, wenn du willst
              </span>
              <ul className="wd-kol__skills">
                <li>Blogbeiträge schreiben</li>
                <li>Kunden suchen und anschreiben</li>
                <li>Auf Social Media posten</li>
                <li>Und weitere Aufgaben</li>
              </ul>
            </div>

            <p className="wd-kol__more">
              <Link href="/relaunch-preview/leistungen" className="rr-link">
                Was Talos alles kann, siehst du auf der Leistungs-Seite
              </Link>
            </p>
          </div>

          {/* Rechte Zelle: die winkende Talos-Buehne */}
          <div className="wd-kol__stage">
            <TalosEntranceStage />
          </div>
        </div>
      </div>

      <style jsx>{`
        .wd-kol {
          /* Vereinheitlicht auf den Standard-Section-Rhythmus (Aufgabe 2,
             21.07.): war zuvor clamp(72px,12vh,148px), deutlich knapper als
             --rr-section-y (96-180px) aller anderen Sektionen der Seite. */
          padding: var(--rr-section-y, clamp(96px, 12vw, 180px))
            var(--rr-gutter, clamp(20px, 4vw, 64px));
          background: var(--rr-surface, #f4f4f2);
        }

        .wd-kol__panel {
          max-width: 1200px;
          margin: 0 auto;
          background: var(--rr-paper, #ffffff);
          border: 1px solid var(--rr-navy, #1c2837);
          border-radius: 0;
        }

        /* ---- Kopfleiste ---- */
        .wd-kol__bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 11px clamp(16px, 2.4vw, 26px);
          border-bottom: 1px solid var(--rr-navy, #1c2837);
        }
        .wd-kol__brand {
          font-family: var(--rr-font-ui);
          font-size: 12px;
          font-weight: 650;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--rr-navy, #1c2837);
        }
        .wd-kol__status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--rr-font-ui);
          font-size: 12px;
          letter-spacing: 0.02em;
          color: var(--rr-ink-soft, #5a5e68);
        }
        .wd-kol__statusdot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2ea44f;
          box-shadow: 0 0 0 3px rgba(46, 164, 79, 0.16);
        }

        /* ---- Fenster-Inhalt ---- */
        .wd-kol__body {
          display: grid;
          grid-template-columns: 1fr;
        }
        .wd-kol__left {
          padding: clamp(24px, 3.4vw, 44px);
          min-width: 0;
        }

        .wd-kol__eyebrow {
          margin-bottom: 14px;
        }
        .wd-kol__title {
          color: var(--rr-ink, #23262e);
          max-width: 18em;
        }
        .wd-kol__name {
          color: var(--rr-red, #f12032);
        }
        .wd-kol__lead {
          color: var(--rr-ink-soft, #5a5e68);
          max-width: 40em;
          margin-top: clamp(16px, 2vw, 22px);
        }

        /* ---- Dashboard-Kacheln ---- */
        .wd-kol__card {
          margin-top: clamp(16px, 2vw, 20px);
          padding: 16px 18px;
          border: 1px solid rgba(28, 40, 55, 0.14);
          border-radius: 0;
          background: var(--rr-paper, #ffffff);
        }
        .wd-kol__card--note {
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
          column-gap: 12px;
          row-gap: 4px;
          align-items: center;
        }
        .wd-kol__mark {
          grid-row: 1 / 3;
          width: 12px;
          height: 12px;
          background: var(--rr-red, #f12032);
        }
        .wd-kol__cardhead {
          font-family: var(--rr-font-ui);
          font-size: 11px;
          font-weight: 650;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--rr-ink-soft, #5a5e68);
        }
        .wd-kol__cardline {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          color: var(--rr-ink, #23262e);
        }
        .wd-kol__cardsub {
          display: block;
          margin-top: 10px;
          font-family: var(--rr-font-ui);
          font-size: 13px;
          color: var(--rr-ink-soft, #5a5e68);
        }

        /* Sparkline aus divs (dekorativ, keine Kennzahl) */
        .wd-kol__spark {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 46px;
          margin-top: 12px;
        }
        .wd-kol__spark span {
          flex: 1;
          background: color-mix(in srgb, var(--rr-navy, #1c2837) 20%, transparent);
          min-height: 4px;
        }
        .wd-kol__spark span:last-child {
          background: var(--rr-navy, #1c2837);
        }

        .wd-kol__skills {
          list-style: none;
          margin: 12px 0 0;
          padding: 0;
          display: grid;
          gap: 9px;
        }
        .wd-kol__skills li {
          position: relative;
          padding-left: 22px;
          font-family: var(--rr-font-ui);
          font-size: 15px;
          color: var(--rr-ink, #23262e);
        }
        .wd-kol__skills li::before {
          content: "+";
          position: absolute;
          left: 0;
          top: -1px;
          font-weight: 650;
          color: var(--rr-red, #f12032);
        }

        .wd-kol__more {
          margin-top: clamp(22px, 3vw, 30px);
        }

        /* ---- Rechte Zelle: Talos-Buehne ---- */
        .wd-kol__stage {
          position: relative;
          width: 100%;
          height: 320px;
          border-top: 1px solid rgba(28, 40, 55, 0.14);
          background: radial-gradient(
            120% 90% at 50% 40%,
            #ffffff 0%,
            #f4f4f2 60%,
            #eef1f3 100%
          );
        }

        /* ---- Desktop: zweispaltig, Talos rechts ---- */
        @media (min-width: 880px) {
          .wd-kol__body {
            grid-template-columns: 1fr minmax(360px, 46%);
          }
          .wd-kol__stage {
            height: clamp(360px, 48vw, 560px);
            border-top: none;
            border-left: 1px solid rgba(28, 40, 55, 0.14);
          }
        }

        /* ---- Mobile: Talos oben, Text darunter ---- */
        @media (max-width: 879px) {
          .wd-kol__body {
            display: flex;
            flex-direction: column;
          }
          .wd-kol__stage {
            order: -1;
          }
        }

        /* ---- Panel-Einblendung (reduce-Guard) ---- */
        @media (prefers-reduced-motion: no-preference) {
          .wd-kol__card {
            opacity: 0;
            transform: translateY(14px);
          }
          .is-in .wd-kol__card {
            animation: wd-kol-rise 560ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
            animation-delay: calc(120ms + var(--wd-i, 0) * 110ms);
          }
        }
        @keyframes wd-kol-rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
