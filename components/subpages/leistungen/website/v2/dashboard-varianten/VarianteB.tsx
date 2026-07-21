"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TalosEntranceStage from "@/components/relaunch/talos/TalosEntranceStage";

/**
 * Dashboard-Variante B — "FLOATING PANELS".
 * Kein Browser-Rahmen. Ein grosses Basis-Panel (Besucher-Skeleton) plus mehrere
 * kleinere Panels, die ueberlappend versetzt schweben (Stagger-Entrance + dezente
 * Scroll-Parallax). Talos steht GANZKOERPER daneben (rechts) auf gleicher Grundlinie
 * und winkt, wie ein Kollege, der das Dashboard praesentiert. Infos darunter als
 * breiter Textblock (H2 + Erklaerabsatz, 1:1 aus KollegeAnreisser) + Faehigkeiten-Zeile.
 *
 * Keine erfundenen Kennzahlen: Klartext oder reine Skeleton-Balken.
 */
export default function VarianteB() {
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

  // Dezente Scroll-Parallax fuer die schwebenden Panels.
  const layerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = layerRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        // -1 (Sektion unten am Viewport) .. 1 (oben) — nur wenn im Blick.
        const p = (window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight;
        el.style.setProperty("--p", String(Math.max(-1, Math.min(1, p))));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const spark = [30, 46, 38, 60, 52, 74, 58, 82, 66, 90];

  return (
    <section className="wdb">
      <div className="wdb__wrap">
        <div className={`wdb__stage ${inView ? "is-in" : ""}`} ref={rootRef}>
          {/* Panel-Ebene links */}
          <div className="wdb__panels" ref={layerRef}>
            {/* Basis-Panel: Besucher-Skeleton */}
            <div
              className="wdb__card wdb__card--base"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <div className="wdb__cardTop">
                <span className="wdb__cardHead">Besucher diese Woche</span>
                <span className="wdb__badge" aria-hidden="true">
                  live
                </span>
              </div>
              <div className="wdb__spark" aria-hidden="true">
                {spark.map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
              <span className="wdb__cardSub">Und wo sie hingeklickt haben.</span>
            </div>

            {/* Benachrichtigung, schwebt versetzt */}
            <div
              className="wdb__card wdb__card--note wdb__float wdb__float--a"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <span className="wdb__mark" aria-hidden="true" />
              <span className="wdb__cardHead">Benachrichtigung</span>
              <span className="wdb__cardLine">
                Formular geprüft: alles in Ordnung.
              </span>
            </div>

            {/* Status-Ring, schwebt versetzt */}
            <div
              className="wdb__card wdb__card--ring wdb__float wdb__float--b"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              <span className="wdb__donut" aria-hidden="true">
                <span className="wdb__donutHole" />
              </span>
              <span className="wdb__ringMeta">
                <span className="wdb__cardHead">Deine Seite</span>
                <span className="wdb__cardSub wdb__cardSub--tight">
                  läuft, alles online
                </span>
              </span>
            </div>

            {/* Faehigkeiten, schwebt versetzt */}
            <div
              className="wdb__card wdb__card--skills wdb__float wdb__float--c"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <span className="wdb__cardHead">Talos kann mehr lernen</span>
              <ul className="wdb__skills">
                <li>Blogbeiträge schreiben</li>
                <li>Kunden anschreiben</li>
                <li>Social Media posten</li>
              </ul>
            </div>
          </div>

          {/* Talos ganzkoerper rechts, gleiche Grundlinie */}
          <div className="wdb__talos">
            <TalosEntranceStage />
          </div>
        </div>

        {/* Infos darunter: breiter Textblock + Faehigkeiten-Zeile */}
        <div className="wdb__info">
          <p className="rr-eyebrow-lg wdb__eyebrow">Nicht nur eine Seite</p>
          <h2 className="rr-statement wdb__title">
            Zu einer gewöhnlichen Website bekommst du bei uns einen Helfer dazu.
            Er heisst <span className="wdb__name">Talos</span>.
          </h2>
          <p className="rr-body-lg wdb__lead">
            Du bekommst ein Dashboard. Dort tauschst du Texte und Bilder selbst.
            Und Talos hilft dir aktiv: Du bekommst eine Nachricht, wenn auf deiner
            Seite etwas nicht stimmt. Du siehst, wie viele Leute da waren und wo sie
            hingeklickt haben.
          </p>

          <ul className="wdb__row" aria-label="Was Talos noch lernen kann">
            <li>Blogbeiträge schreiben</li>
            <li>Kunden suchen und anschreiben</li>
            <li>Auf Social Media posten</li>
            <li>Und weitere Aufgaben</li>
          </ul>

          <p className="wdb__more">
            <Link href="/relaunch-preview/leistungen" className="rr-link">
              Was Talos alles kann, siehst du auf der Leistungs-Seite
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .wdb {
          padding: clamp(72px, 12vh, 148px) var(--rr-gutter, clamp(20px, 4vw, 64px));
          background: var(--rr-surface, #f4f4f2);
        }
        .wdb__wrap {
          max-width: 1180px;
          margin: 0 auto;
        }

        /* ---- Buehne ---- */
        .wdb__stage {
          position: relative;
          display: grid;
          grid-template-columns: 1fr minmax(280px, 38%);
          gap: clamp(24px, 4vw, 56px);
          align-items: end;
          min-height: clamp(420px, 52vw, 560px);
        }

        .wdb__panels {
          position: relative;
          --p: 0;
          padding: 40px 0 24px;
          min-height: clamp(380px, 46vw, 500px);
        }

        .wdb__card {
          padding: 18px 20px;
          background: var(--rr-paper, #ffffff);
          border: 1px solid rgba(28, 40, 55, 0.14);
        }
        .wdb__card--base {
          position: relative;
          z-index: 1;
          max-width: 420px;
        }
        .wdb__cardTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .wdb__badge {
          font-family: var(--rr-font-ui);
          font-size: 10px;
          font-weight: 650;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-red, #f12032);
          border: 1px solid color-mix(in srgb, var(--rr-red, #f12032) 40%, transparent);
          padding: 3px 8px;
        }
        .wdb__mark {
          position: absolute;
          top: 18px;
          left: 20px;
          width: 12px;
          height: 12px;
          background: var(--rr-red, #f12032);
        }
        .wdb__cardHead {
          font-family: var(--rr-font-ui);
          font-size: 11px;
          font-weight: 650;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--rr-ink-soft, #5a5e68);
        }
        .wdb__cardLine {
          display: block;
          margin-top: 6px;
          font-family: var(--rr-font-ui);
          font-size: 15px;
          color: var(--rr-ink, #23262e);
        }
        .wdb__cardSub {
          display: block;
          margin-top: 12px;
          font-family: var(--rr-font-ui);
          font-size: 13px;
          color: var(--rr-ink-soft, #5a5e68);
        }
        .wdb__cardSub--tight {
          margin-top: 3px;
        }

        .wdb__spark {
          display: flex;
          align-items: flex-end;
          gap: 5px;
          height: 64px;
          margin-top: 16px;
        }
        .wdb__spark span {
          flex: 1;
          background: color-mix(in srgb, var(--rr-navy, #1c2837) 20%, transparent);
          min-height: 4px;
        }
        .wdb__spark span:last-child {
          background: var(--rr-navy, #1c2837);
        }

        /* Schwebende Panels — versetzt + Parallax */
        .wdb__float {
          position: absolute;
          z-index: 2;
          box-shadow: 0 26px 56px -30px rgba(28, 40, 55, 0.55);
        }
        .wdb__card--note {
          padding-top: 40px;
        }
        .wdb__float--a {
          top: 4px;
          right: -6%;
          width: 236px;
          transform: translateY(calc(var(--p, 0) * -22px));
        }
        .wdb__float--b {
          top: 168px;
          right: 8%;
          width: 214px;
          display: flex;
          align-items: center;
          gap: 14px;
          transform: translateY(calc(var(--p, 0) * 16px));
        }
        .wdb__float--c {
          bottom: 4px;
          left: 6%;
          width: 250px;
          transform: translateY(calc(var(--p, 0) * -12px));
        }

        .wdb__donut {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          flex: none;
          background: conic-gradient(
            var(--rr-red, #f12032) 0turn 0.72turn,
            color-mix(in srgb, var(--rr-navy, #1c2837) 14%, transparent) 0.72turn 1turn
          );
        }
        .wdb__donutHole {
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          background: var(--rr-paper, #ffffff);
        }
        .wdb__ringMeta {
          display: flex;
          flex-direction: column;
        }

        .wdb__skills {
          list-style: none;
          margin: 12px 0 0;
          padding: 0;
          display: grid;
          gap: 8px;
        }
        .wdb__skills li {
          position: relative;
          padding-left: 20px;
          font-family: var(--rr-font-ui);
          font-size: 14px;
          color: var(--rr-ink, #23262e);
        }
        .wdb__skills li::before {
          content: "+";
          position: absolute;
          left: 0;
          top: -1px;
          font-weight: 650;
          color: var(--rr-red, #f12032);
        }

        /* Talos ganzkoerper rechts */
        .wdb__talos {
          position: relative;
          width: 100%;
          height: clamp(380px, 46vw, 520px);
          align-self: end;
          pointer-events: none;
        }

        /* ---- Infos ---- */
        .wdb__info {
          margin-top: clamp(40px, 6vw, 76px);
          max-width: 900px;
        }
        .wdb__eyebrow {
          color: var(--rr-ink-soft, #5a5e68);
          margin-bottom: 14px;
        }
        .wdb__title {
          color: var(--rr-navy, #1c2837);
          max-width: 20em;
        }
        .wdb__name {
          color: var(--rr-red, #f12032);
        }
        .wdb__lead {
          color: var(--rr-ink-soft, #5a5e68);
          max-width: 44em;
          margin-top: clamp(16px, 2vw, 22px);
        }
        .wdb__row {
          list-style: none;
          margin: clamp(28px, 4vw, 40px) 0 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 12px 26px;
        }
        .wdb__row li {
          position: relative;
          padding-left: 20px;
          font-family: var(--rr-font-ui);
          font-size: 15px;
          color: var(--rr-ink, #23262e);
        }
        .wdb__row li::before {
          content: "+";
          position: absolute;
          left: 0;
          top: -1px;
          font-weight: 650;
          color: var(--rr-red, #f12032);
        }
        .wdb__more {
          margin-top: clamp(24px, 3.5vw, 34px);
        }

        /* ---- Entrance ---- */
        @media (prefers-reduced-motion: no-preference) {
          .wdb__card {
            opacity: 0;
          }
          .is-in .wdb__card {
            animation: wdb-in 640ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
            animation-delay: calc(160ms + var(--i, 0) * 120ms);
          }
        }
        @keyframes wdb-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
          }
        }

        /* ---- Responsive ---- */
        @media (max-width: 860px) {
          .wdb__stage {
            grid-template-columns: 1fr;
            min-height: 0;
          }
          .wdb__panels {
            min-height: 0;
            padding: 8px 0 0;
            display: grid;
            gap: 14px;
          }
          /* Am Handy kein Ueberlappen — Panels stapeln sauber. */
          .wdb__float {
            position: relative;
            top: auto;
            right: auto;
            bottom: auto;
            left: auto;
            width: 100%;
            transform: none;
            box-shadow: none;
          }
          .wdb__card--base {
            max-width: none;
          }
          .wdb__card--note {
            padding-top: 40px;
          }
          .wdb__talos {
            height: 340px;
            margin-top: 6px;
          }
        }
      `}</style>
    </section>
  );
}
