'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { clamp01 } from '@/lib/relaunch/morph/grammar';

/**
 * Sektion 5 — TALOS-TALENTE-FAHRT (brand/PREISE_SEITE_BRIEF.md Abschnitt 5.5):
 * Die Sektion startet SOFORT navy (kein weisser Kopf auf Weiss mehr — der
 * wirkte zerrissen, Thomas 24.07.). Aufbau: (1) blaues Intro-Panel, Text
 * links, reservierte Figur-Flaeche rechts; (2) danach die Faehigkeiten-Fahrt.
 *
 * Die Fahrt selbst ist die bewaehrte Adaption der CasePanels-Mechanik
 * (components/relaunch/CasePanels.tsx) fuer EINEN durchgehenden Track: sticky
 * 100vh, Buehne faehrt bei vertikalem Scroll linear seitwaerts, Riesenwort
 * "Talos" laeuft als Parallax-Ebene mit. Stationen = die Talos-Faehigkeiten
 * (Capability-Beschreibungen, KEINE Preise), Abschluss-Panel fuehrt zum
 * Preis-Rechner ueber (#rechner in separater Rechner-Komponente).
 *
 * Mobile (<900px) und prefers-reduced-motion: statischer, vertikal
 * gestapelter Karten-Fallback statt der Fahrt (wie CasePanels es loest);
 * die Figur-Flaeche im Intro-Panel wird mobil ausgeblendet.
 */

type Station = { name: string; text: string };

const STATIONEN: Station[] = [
  {
    name: 'Der Schreiber',
    text: 'Schreibt zweimal die Woche Beiträge für deinen Betrieb, mit Bildern und auf Wunsch als Podcast, und stellt sie so online, dass Google und die KI-Antwortmaschinen dich finden.',
  },
  {
    name: 'Der Empfang',
    text: 'Fängt jede Anfrage auf, meldet sich sofort zurück, bucht Termine und hakt nach, wenn jemand still wird.',
  },
  {
    name: 'Der Poster',
    text: 'Erzeugt Social-Beiträge mit Bild und Text und postet sie in deinem Ton auf deinen Kanälen.',
  },
  {
    name: 'Der Sichtbarmacher',
    text: 'Sorgt dafür, dass dich mehr Leute finden, bei Google und bei den neuen Antwort-Maschinen.',
  },
  {
    name: 'Der Außendienst',
    text: 'Sucht wo möglich täglich passende Kunden und schreibt sie in deinem Namen an, als Entwurf oder auf Knopfdruck versendbar.',
  },
  {
    name: 'Der Werber',
    text: 'Betreut deine Google- und Meta-Werbung. Dein Werbebudget bleibt auf deinem eigenen Konto, wir managen nur.',
  },
  {
    name: 'Die Sonderanfertigung',
    text: 'Braucht dein Betrieb etwas, das es nicht von der Stange gibt, bauen wir es passend auf ihn zu.',
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

/**
 * Blaues Intro-Panel: volle Navy-Flaeche, Text links, reservierte Figur-
 * Flaeche rechts. Ersetzt die frueher weisse Kopf-Zeile auf Weiss.
 */
function TalosIntro() {
  return (
    <div className="rp-talos-intro">
      <div className="rp-talos-intro__grid">
        <div className="rp-talos-intro__text">
          <p className="wd-eyebrow wd-eyebrow--ondark">Wenn du mehr willst</p>
          <h2 className="rr-statement rp-talos-intro__h2">
            Talos übernimmt, was liegen bleibt<span style={{ color: 'var(--rr-red)' }}>.</span>
          </h2>
          <p className="rp-talos-intro__lead">
            Über die Grundausstattung hinaus kannst du Talos einzelne Aufgaben übergeben. Nimm,
            was dein Betrieb gerade braucht, und lass den Rest weg.
          </p>
          <p className="rp-talos-intro__pos">
            Unser Team hat zusammen 135 Jahre Erfahrung. Dieses Wissen steckt in Talos. Du
            bekommst also nicht nur eine KI, sondern alles, was wir können, und wir sitzen
            dahinter und überwachen Monat für Monat.
          </p>
        </div>

        {/* Figur-Slot: hier dockt spaeter der Talos-3D-Companion an (Fable,
            separater Pass). Bewusst NUR ein Platzhalter — keine 3D-Komponente,
            kein three.js, kein TalosCompanionStage-Import, sonst wuerde die
            Figur den Hero der Seite kapern. Das dezente Wortmarken-"Talos"
            markiert die reservierte Flaeche. */}
        {/* Figur-Slot = Talos-Companion-Station (Fable, 24.07.): der echte 3D-
            Companion (TalosCompanionStage stationsOnly, in page.tsx gemountet)
            positioniert Talos an dieser Station rechts (anchor .78), gross
            (size l), front-Ebene, winkt beim Ankommen. Das Wortmarken-"Talos"
            darunter bleibt als dezenter Grund, falls 3D nicht laedt (no-webgl/
            mobil). */}
        <div
          className="rp-talos-intro__figure"
          data-talos-figure-slot
          data-talos-station
          data-talos-anchor="0.78"
          data-talos-size="l"
          data-talos-gesture="wave"
          data-talos-layer="front"
          data-talos-appear="0.4"
          aria-hidden="true"
        >
          <span className="rp-talos-intro__figure-mark">Talos</span>
        </div>
      </div>

      {/* Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md
          "styled-jsx im Relaunch meiden"). */}
      <style>{`
        .rp-talos-intro {
          background: var(--rr-navy);
          color: #fff;
          /* Full-bleed: aus dem rr-section-Seitenpadding ausbrechen, damit die
             Navy-Flaeche bis an beide Kanten traegt (wie die Fahrt darunter). */
          width: 100vw;
          margin-left: calc(50% - 50vw);
        }
        .rp-talos-intro__grid {
          max-width: 1320px;
          margin: 0 auto;
          padding: clamp(72px, 12vh, 140px) var(--rr-gutter, clamp(20px, 4.6vw, 72px));
          min-height: 88vh;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
          align-items: center;
          gap: clamp(32px, 6vw, 88px);
        }
        .rp-talos-intro__text {
          max-width: 60ch;
        }
        .rp-talos-intro__h2 {
          margin: 18px 0 22px;
          color: #fff;
        }
        .rp-talos-intro__lead {
          font-family: var(--rr-font-ui);
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.82);
          max-width: 52ch;
          margin: 0 0 26px;
        }
        .rp-talos-intro__pos {
          font-family: var(--rr-font-ui);
          font-size: clamp(0.95rem, 1.15vw, 1.05rem);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.62);
          max-width: 54ch;
          margin: 0;
          padding-top: 22px;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
        }
        .rp-talos-intro__figure {
          position: relative;
          align-self: stretch;
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: radial-gradient(
            120% 100% at 70% 30%,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0) 60%
          );
        }
        .rp-talos-intro__figure-mark {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: min(22vh, 15vw);
          line-height: 0.9;
          color: rgba(255, 255, 255, 0.06);
          user-select: none;
          pointer-events: none;
        }
        @media (max-width: 900px) {
          .rp-talos-intro__grid {
            grid-template-columns: 1fr;
            min-height: 0;
            padding: clamp(56px, 9vh, 96px) var(--rr-gutter, clamp(20px, 4.6vw, 72px));
          }
          /* Figur-Flaeche mobil ausgeblendet (der echte Companion kommt
             ohnehin nur auf breiten Viewports zum Tragen). */
          .rp-talos-intro__figure {
            display: none;
          }
        }
      `}</style>
    </div>
  );
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
        <p className="tf-static__name">Was das kostet? Rechne es dir aus.</p>
        <p className="tf-static__text">
          Monatlich, jederzeit kündbar, jederzeit nachbuchbar. Ein fixer Betrag pro Fähigkeit,
          kein Credit-System, das du erst durchrechnen musst.
        </p>
        <div className="tf-static__cta">
          <Link href="#rechner" className="rr-btn-frame rr-btn-frame--red">
            <i className="c1" />
            <i className="c2" />
            <i className="c3" />
            <i className="c4" />
            <span className="rr-btn-frame__t">Zum Rechner</span>
          </Link>
          <Link href="/relaunch-preview/kontakt" className="tf-static__link">
            Talos-Gespräch
          </Link>
        </div>
      </div>

      {/* Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md
          "styled-jsx im Relaunch meiden"). */}
      <style>{`
        .tf-static {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: rgba(255, 255, 255, 0.08);
          width: 100vw;
          margin-left: calc(50% - 50vw);
        }
        .tf-static__card {
          background: var(--rr-navy);
          color: #fff;
          padding: clamp(32px, 5vw, 56px) var(--rr-gutter, clamp(20px, 5vw, 48px));
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
        .tf-static__cta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 20px 28px;
          margin-top: 24px;
        }
        .tf-static__link {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.35);
          padding-bottom: 2px;
          transition: color 0.2s, border-color 0.2s;
        }
        .tf-static__link:hover {
          color: #fff;
          border-color: #fff;
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
            (nicht nur einmal): bei 8 Slides legt die Buehne bis zu 700vw
            zurueck, das Wort bewegt sich mit 1.15x noch schneller (~805vw) —
            eine einzelne Instanz waere laengst aus dem Bild, bevor die
            Fahrt zu Ende ist (QA-Fix: Wort war bei keiner Stichprobe im
            Bild). Slots von 140vw Breite tragen das Wort ueber die ganze
            Fahrt hinweg im Sichtfeld, wie bei CasePanels' Riesenwort. */}
        <div ref={giantRef} aria-hidden="true" className="tf-giant">
          {/* Slot-Zahl hergeleitet: Fahrtweg des Wortes = (SLIDES-1) * 100vw * 1.15.
              Bei 7 Stationen + Abschluss = 8 Slides sind das 7 * 115vw = 805vw.
              Bei 140vw je Slot deckt eine Kette von ceil(805/140) + 1 = 7 Slots
              die Strecke gerade eben ab; 10 Slots geben Puffer fuer breite
              Viewports und eine spaeter groessere STATIONEN-Liste (ueberzaehlige
              Slots liegen ausserhalb, kosten nichts). Bei mehr als ~9 Stationen
              diese Zahl nachziehen. */}
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
              <p className="wd-eyebrow wd-eyebrow--ondark">Bereit?</p>
              <h3 className="tf-slide__name">Was das kostet? Rechne es dir aus.</h3>
              <p className="tf-slide__text">
                Monatlich, jederzeit kündbar, jederzeit nachbuchbar. Ein fixer Betrag pro
                Fähigkeit, kein Credit-System, das du erst durchrechnen musst.
              </p>
              <div className="tf-slide__cta">
                <Link href="#rechner" className="rr-btn-frame rr-btn-frame--red">
                  <i className="c1" />
                  <i className="c2" />
                  <i className="c3" />
                  <i className="c4" />
                  <span className="rr-btn-frame__t">Zum Rechner</span>
                </Link>
                <Link href="/relaunch-preview/kontakt" className="tf-slide__link">
                  Talos-Gespräch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md
          "styled-jsx im Relaunch meiden"). */}
      <style>{`
        .tf-track {
          /* 105vh je Slide statt 100vh: die Buehne haelt 100vh, die zusaetzlichen
             5vh sind Scroll-Puffer, damit die letzte Station nicht exakt im
             Moment des Sticky-Endes umschaltet (sonst wirkt der Ausstieg
             abgehackt). Gleiche Groessenordnung wie CasePanels' ~380vh/Thema. */
          height: calc(${SLIDES} * 105vh);
          position: relative;
          /* Full-bleed wie CasePanels: aus dem rr-section-Seitenpadding
             (72px) ausbrechen, die Navy-Buehne traegt bis an beide Kanten. */
          width: 100vw;
          margin-left: calc(50% - 50vw);
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
        .tf-slide__cta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 18px 28px;
          margin-top: 30px;
        }
        .tf-slide__cta .rr-btn-frame {
          align-self: flex-start;
        }
        .tf-slide__link {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.35);
          padding-bottom: 2px;
          transition: color 0.2s, border-color 0.2s;
        }
        .tf-slide__link:hover {
          color: #fff;
          border-color: #fff;
        }
      `}</style>
    </div>
  );
}

export default function TalosTalenteFahrt() {
  const fallback = useResponsiveMotion();

  return (
    <section className="rr-section rp-talos">
      <TalosIntro />

      {fallback ? <StaticStations /> : <TalosFahrt />}

      {/* Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md
          "styled-jsx im Relaunch meiden"). */}
      <style>{`
        .rp-talos {
          background: var(--rr-navy);
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }
      `}</style>
    </section>
  );
}
