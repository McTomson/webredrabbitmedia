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

      {/* Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md
          "styled-jsx im Relaunch meiden"). */}
      <style>{`
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
          font-family: var(--rr-font-serif);
          font-weight: 500;
          font-size: clamp(1.7rem, 4.4vw, 2.4rem);
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
        {/* Riesenwort "Talos", Parallax-Ebene hinter der Buehne. WIEDERHOLT
            (nicht nur einmal): bei 7 Slides legt die Buehne bis zu 600vw
            zurueck, das Wort bewegt sich mit 1.15x noch schneller (~690vw) —
            eine einzelne Instanz waere laengst aus dem Bild, bevor die
            Fahrt zu Ende ist (QA-Fix: Wort war bei keiner Stichprobe im
            Bild). Slots von 140vw Breite tragen das Wort ueber die ganze
            Fahrt hinweg im Sichtfeld, wie bei CasePanels' Riesenwort. */}
        <div ref={giantRef} aria-hidden="true" className="tf-giant">
          {Array.from({ length: 10 }).map((_, i) => (
            <span className="tf-giant__slot" key={i}>Talos</span>
          ))}
        </div>

        <div ref={stageRef} className="tf-stage">
          {STATIONEN.map((s, i) => (
            <div className="tf-slide" key={s.name} style={{ left: `${i * 100}vw` }}>
              <div className="tf-slide__inner">
                <div className="tf-slide__eyebrow">
                  <span className="tf-slide__eyebrow-label">Talos-Talent</span>
                  <span className="tf-slide__num">{`0${i + 1}`}</span>
                </div>
                <h3 className="tf-slide__name">{s.name}</h3>
                <p className="tf-slide__text">{s.text}</p>
              </div>
            </div>
          ))}
          <div className="tf-slide tf-slide--close" style={{ left: `${STATIONEN.length * 100}vw` }}>
            <div className="tf-slide__inner">
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
        </div>
      </section>

      {/* Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md
          "styled-jsx im Relaunch meiden"). */}
      <style>{`
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
        .tf-giant__slot {
          flex: 0 0 auto;
          width: 140vw;
          font-family: var(--rr-font-display);
          font-weight: 800;
          white-space: nowrap;
          font-size: min(58vh, 34vw);
          line-height: 0.9;
          color: rgba(255, 255, 255, 0.06);
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
          left: 0;
          width: 100vw;
          height: 100%;
          display: flex;
          align-items: center;
        }
        /* Innenbreite EXPLIZIT begrenzt (nicht ueber Padding von einer
           100vw/max-width-Box abgeleitet, das brach bei laengeren
           Stationsnamen wie "Der Aussendienst" ins rechte Nachbar-Slide
           hinein — QA-Fix, Massstab an CasePanels .introRef orientiert:
           dort traegt der Textblock selbst eine feste width+maxWidth statt
           padding-basiertem Rest). min()-Breite + fixer Aussenabstand
           garantiert genug Luft zum rechten Slide-Rand auf jeder
           Bildschirmgroesse. */
        .tf-slide__inner {
          width: min(46vw, 560px);
          margin-left: max(24px, 8vw);
          margin-right: 12vw;
        }
        /* Typografie-Fix (Design-Lead-Addendum): CasePanels-Grammatik ist
           kleine Sans-Eyebrow letterspaced + grosse Serif-Headline weiss,
           nicht DM-Sans-Bold wie zuvor. Die Nummer bleibt rot + Sans, ruckt
           aber als Teil der Eyebrow-Zeile ein statt eigener Block. */
        .tf-slide__eyebrow {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 18px;
        }
        .tf-slide__eyebrow-label {
          font-family: var(--rr-font-ui);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
        }
        .tf-slide__num {
          font-family: var(--rr-font-ui);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: var(--rr-red);
        }
        .tf-slide__name {
          font-family: var(--rr-font-serif);
          font-weight: 500;
          font-size: clamp(2.6rem, 5.6vw, 4.6rem);
          line-height: 1.05;
          letter-spacing: -0.01em;
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
        .tf-slide--close .rr-btn-frame {
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

      {/* Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md
          "styled-jsx im Relaunch meiden"). */}
      <style>{`
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
