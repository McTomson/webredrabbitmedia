'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { clamp01 } from '@/lib/relaunch/morph/grammar';

/**
 * Sektion 5 — TALOS-TALENTE-FAHRT (brand/PREISE_SEITE_BRIEF.md Abschnitt 5.5):
 * Adaption der CasePanels-Mechanik (components/relaunch/CasePanels.tsx) fuer
 * EINEN durchgehenden Track statt drei getrennter Themen-Tracks: sticky
 * 100vh, Buehne faehrt bei vertikalem Scroll linear seitwaerts, Riesenwort
 * "Talos" laeuft als Parallax-Ebene mit. Stationen = die Talos-Faehigkeiten
 * (ARBEITSTITEL + Nutzen-Saetze 1:1 aus components/subpages/leistungen/talos/
 * v2/Faehigkeiten.tsx), Abschluss-Panel = Preis-LOGIK ohne erfundene Zahlen
 * (monatlich, kuendbar, nachbuchbar, Fixbetrag statt Credit-Raetsel).
 *
 * Mobile (<900px) und prefers-reduced-motion: statischer, vertikal
 * gestapelter Karten-Fallback statt der Fahrt (wie CasePanels es loest).
 */

type Station = { name: string; text: string };

const STATIONEN: Station[] = [
  {
    name: 'Der Schreiber',
    text: 'Er schreibt regelmäßig Beiträge für deinen Betrieb und verteilt sie dort, wo deine Kunden und Google sie finden.',
  },
  {
    name: 'Der Empfang',
    text: 'Er fängt jede Anfrage auf, meldet sich sofort zurück und hakt nach, wenn jemand still wird.',
  },
  {
    name: 'Der Außendienst',
    text: 'Er sucht deine Wunschkunden, findet die passenden Ansprechpartner und schreibt sie in deinem Namen an.',
  },
  {
    name: 'Der Poster',
    text: 'Er macht regelmäßig Posts für deine Kanäle, in deinem Ton und mit deinen Themen.',
  },
  {
    name: 'Der Sichtbarmacher',
    text: 'Er sorgt dafür, dass dich mehr Leute finden, bei Google und bei den neuen Antwort-Maschinen.',
  },
  {
    name: 'Die Sonderanfertigung',
    text: 'Braucht dein Betrieb etwas, das es so nicht von der Stange gibt, bauen wir es passend auf ihn zu.',
  },
];

const SLIDES = STATIONEN.length + 1; // + Abschluss-Panel

function useResponsiveMotion() {
  const [fallback, setFallback] = useState(true); // SSR-sicher: erst nach Mount pruefen
  useEffect(() => {
    const check = () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const narrow = window.innerWidth < 900;
      setFallback(reduce || narrow);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return fallback;
}

function StaticStations() {
  return (
    <div className="tf-static">
      {STATIONEN.map((s) => (
        <div className="tf-static__card" key={s.name}>
          <p className="tf-static__name">{s.name}</p>
          <p className="tf-static__text">{s.text}</p>
        </div>
      ))}
      <div className="tf-static__card tf-static__card--close">
        <p className="tf-static__name">Was das kostet</p>
        <p className="tf-static__text">
          Monatlich, jederzeit kündbar, jederzeit nachbuchbar. Kein Credit-System, das du erst
          durchrechnen musst, sondern ein fixer Betrag pro Fähigkeit. Konkrete Zahlen auf
          Anfrage.
        </p>
        <Link href="/relaunch-preview/kontakt" className="rr-btn-frame rr-btn-frame--red">
          <i className="c1" />
          <i className="c2" />
          <i className="c3" />
          <i className="c4" />
          <span className="rr-btn-frame__t">Talos-Gespräch</span>
        </Link>
      </div>

      <style jsx>{`
        .tf-static {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: rgba(28, 40, 55, 0.12);
        }
        .tf-static__card {
          background: var(--rr-navy);
          color: #fff;
          padding: clamp(32px, 5vw, 56px) clamp(20px, 5vw, 48px);
        }
        .tf-static__name {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(1.5rem, 4vw, 2.1rem);
          margin: 0 0 12px;
          color: #fff;
        }
        .tf-static__text {
          font-family: var(--rr-font-ui);
          font-size: 16px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.78);
          max-width: 56ch;
          margin: 0;
        }
        .tf-static__card--close .rr-btn-frame {
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
}

function TalosFahrt() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current!, stage = stageRef.current!, giant = giantRef.current!;
    let raf = 0, destroyed = false;

    function render() {
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp01(-r.top / total) : 0;
      const vw = window.innerWidth;
      const dist = (SLIDES - 1) * vw;
      stage.style.transform = `translate3d(${-p * dist}px, 0, 0)`;
      giant.style.transform = `translate3d(${-p * dist * 1.15}px, 0, 0)`;
    }
    function loop() {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => { destroyed = true; cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={trackRef} className="tf-track">
      <section aria-label="Talos-Talente" className="tf-sticky">
        {/* Riesenwort "Talos", Parallax-Ebene hinter der Buehne */}
        <div ref={giantRef} aria-hidden="true" className="tf-giant">
          <span>Talos</span>
        </div>

        <div ref={stageRef} className="tf-stage">
          {STATIONEN.map((s, i) => (
            <div className="tf-slide" key={s.name} style={{ left: `${i * 100}vw` }}>
              <span className="tf-slide__num">{`0${i + 1}`}</span>
              <h3 className="tf-slide__name">{s.name}</h3>
              <p className="tf-slide__text">{s.text}</p>
            </div>
          ))}
          <div className="tf-slide tf-slide--close" style={{ left: `${STATIONEN.length * 100}vw` }}>
            <p className="wd-eyebrow wd-eyebrow--ondark">Was das kostet</p>
            <h3 className="tf-slide__name">Fixbetrag, keine Credit-Rätsel.</h3>
            <p className="tf-slide__text">
              Monatlich, jederzeit kündbar, jederzeit nachbuchbar. Kein Credit-System, das du
              erst durchrechnen musst, sondern ein fixer Betrag pro Fähigkeit. Konkrete Zahlen
              auf Anfrage.
            </p>
            <Link href="/relaunch-preview/kontakt" className="rr-btn-frame rr-btn-frame--red">
              <i className="c1" />
              <i className="c2" />
              <i className="c3" />
              <i className="c4" />
              <span className="rr-btn-frame__t">Talos-Gespräch</span>
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .tf-track {
          height: calc(${SLIDES} * 105vh);
          position: relative;
        }
        .tf-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          background: var(--rr-navy);
          color: #fff;
        }
        .tf-giant {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          pointer-events: none;
          will-change: transform;
        }
        .tf-giant span {
          font-family: var(--rr-font-display);
          font-weight: 800;
          white-space: nowrap;
          font-size: min(58vh, 34vw);
          line-height: 0.9;
          color: rgba(255, 255, 255, 0.06);
          margin-left: 8vw;
        }
        .tf-stage {
          position: absolute;
          inset: 0;
          width: ${SLIDES * 100}vw;
          will-change: transform;
        }
        .tf-slide {
          position: absolute;
          top: 0;
          width: 100vw;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 8vw;
          max-width: 720px;
        }
        .tf-slide__num {
          font-family: var(--rr-font-ui);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: var(--rr-red);
          margin-bottom: 18px;
        }
        .tf-slide__name {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(2.2rem, 5vw, 4rem);
          line-height: 1.02;
          margin: 0 0 20px;
          color: #fff;
        }
        .tf-slide__text {
          font-family: var(--rr-font-ui);
          font-size: clamp(1rem, 1.3vw, 1.2rem);
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.78);
          max-width: 40ch;
          margin: 0;
        }
        .tf-slide--close :global(.rr-btn-frame) {
          margin-top: 30px;
          align-self: flex-start;
        }
      `}</style>
    </div>
  );
}

export default function TalosTalenteFahrt() {
  const fallback = useResponsiveMotion();

  return (
    <section className="rr-section rp-talos">
      <div className="rr-wrap rr-narrow rp-talos__head">
        <p className="wd-eyebrow">Wenn du mehr willst</p>
        <h2 className="rr-statement rp-talos__h2">
          Talos übernimmt, was liegen bleibt<span style={{ color: 'var(--rr-red)' }}>.</span>
        </h2>
        <p className="rr-body-lg rp-talos__intro">
          Über die Grundausstattung hinaus kannst du Talos einzelne Aufgaben übergeben. Nimm,
          was dein Betrieb gerade braucht, und lass den Rest weg.
        </p>
      </div>

      {fallback ? <StaticStations /> : <TalosFahrt />}

      <style jsx>{`
        .rp-talos {
          background: #ffffff;
          padding-left: 0;
          padding-right: 0;
        }
        .rp-talos__head {
          padding: 0 var(--rr-gutter, clamp(20px, 4.6vw, 72px));
          margin-bottom: clamp(40px, 5vw, 64px);
        }
        .rp-talos__h2 {
          margin: 18px 0 20px;
          color: var(--rr-navy);
        }
        .rp-talos__intro {
          color: var(--rr-ink-soft);
          max-width: 56ch;
        }
      `}</style>
    </section>
  );
}
