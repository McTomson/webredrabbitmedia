'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/**
 * Diagnose — Variante A: GROSSE TYPO-ANTWORTEN.
 * Weg von den Boxen: die Antworten stehen als grosse, kursive Serif-Zeilen
 * untereinander, jede mit einer kleinen roten Ziffer auf hellem Chip. Hover
 * schiebt die Zeile nach rechts und laesst eine Unterstreichung wachsen. Beim
 * Klick bleibt die gewaehlte Zeile stehen, der Rest wischt weg und die naechste
 * Frage crossfadet herein. Oben eine duenne, wachsende Fortschrittslinie mit
 * "Frage 1 von 3". Ergebnis auf hellem Panel (Offwhite auf Teal).
 *
 * INHALT + LOGIK sind 1:1 identisch zum Bestand (Diagnose.tsx): gleiche Fragen,
 * gleiche Punkt-Summe -> Starter/Business/Premium, gleiche Texte, gleiche Nachbarn.
 * DU-Anrede, echte Umlaute, kein Gedankenstrich, kein "KI"-Wort (digitaler Kollege),
 * border-radius:0 (Ausnahme: die runden Ziffer-Chips/Punkte). Rot nie als Textfarbe
 * auf Teal; Rot nur auf hellen Flaechen. prefers-reduced-motion: nur Fade/Instant.
 */

type Frage = { q: string; opts: string[] };

const QUESTIONS: Frage[] = [
  {
    q: 'Hast du schon eine Website?',
    opts: [
      'Nein, noch keine',
      'Ja, aber sie bringt nichts',
      'Ja, und sie soll mehr rausholen',
    ],
  },
  {
    q: 'Was soll deine Seite vor allem tun?',
    opts: [
      'Da sein und gut aussehen, wenn wer nachschaut',
      'Anfragen bringen',
      'Aktiv Kunden holen und Sichtbarkeit ausbauen',
    ],
  },
  {
    q: 'Wie viel willst du selbst damit zu tun haben?',
    opts: [
      'So wenig wie möglich',
      'Ich pflege gern selbst nach',
      'Ich will mitreden und ausbauen',
    ],
  },
];

type PaketName = 'Starter' | 'Business' | 'Premium';

const ORDER: PaketName[] = ['Starter', 'Business', 'Premium'];

const PAKETE: Record<PaketName, string> = {
  Starter:
    'Für den Anfang reicht ein sauberer One-Pager völlig. Eine Seite, auf der klar steht wer du bist, was du machst und wie man dich erreicht, und du bist online. Ehrlich gesagt wäre mehr für dich gerade rausgeworfenes Geld. Ein digitaler Kollege ist trotzdem von Anfang an dabei und fängt deine Anfragen ab, während du arbeitest.',
  Business:
    'Du bist an dem Punkt, wo eine einzelne Seite zu wenig wird. Wir bauen dir eine mehrseitige Website, die bei Google rankt und aus Besuchern echte Anfragen macht. Das ist unsere meistgewählte Stufe, weil sie für die meisten genau passt. Ein digitaler Kollege gehört fest dazu und fängt ab, was reinkommt, auch wenn du gerade keine Zeit hast.',
  Premium:
    'Du willst, dass die Seite aktiv für dich arbeitet, und dafür ist Premium gebaut. Umfangreich, auf laufende Anfragen und dauerhafte Sichtbarkeit ausgelegt, mit Inhalten die dich bei Google und den neuen Antwortmaschinen nach vorne bringen. Ein Mitarbeiter ist von Anfang an im Team und fängt deine Anfragen ab, rund um die Uhr. Und du kannst dir weitere dazuholen, sobald du merkst wo dir Arbeit abgenommen werden soll.',
};

function paketFuer(summe: number): PaketName {
  if (summe <= 4) return 'Starter';
  if (summe <= 7) return 'Business';
  return 'Premium';
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduce;
}

export default function VarianteA() {
  // step 0..2 = Fragen, 3 = Ergebnis. answers: Punktwerte 1..3 pro Frage.
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null); // Index, waehrend Uebergang
  const [altOpen, setAltOpen] = useState<PaketName | null>(null);
  const reduce = usePrefersReducedMotion();

  function antwort(i: number) {
    if (picked !== null) return;
    const commit = () => {
      setAnswers((prev) => {
        const next = [...prev];
        next[step] = i + 1;
        return next;
      });
      setStep((s) => s + 1);
      setPicked(null);
    };
    if (reduce) {
      commit();
      return;
    }
    setPicked(i);
    window.setTimeout(commit, 460);
  }

  function zurueck() {
    if (picked !== null) return;
    setAltOpen(null);
    setStep((s) => Math.max(0, s - 1));
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setAltOpen(null);
    setPicked(null);
  }

  const summe = answers.reduce((a, b) => a + b, 0);
  const paket = paketFuer(summe);
  const paketIdx = ORDER.indexOf(paket);
  const nachbarn = ORDER.filter(
    (_, i) => i === paketIdx - 1 || i === paketIdx + 1,
  );

  const pct = step >= 3 ? 100 : (step / 3) * 100;

  return (
    <section className="gta" aria-labelledby="gta-title">
      <div className="gta__inner">
        <div className="gta__head">
          <p className="wd-eyebrow wd-eyebrow--cream gta__eyebrow">
            (WAS DU WIRKLICH BRAUCHST)
          </p>
          <h2 id="gta-title" className="rr-statement gta__statement">
            Sag uns, wer du bist. Wir sagen dir ehrlich, was du brauchst.
          </h2>
          <p className="gta__intro">Drei Fragen, dann reden wir Klartext.</p>
        </div>

        <div className="gta__stage" aria-live="polite">
          {step < 3 && (
            <div className="gta__progress" aria-hidden="true">
              <span className="gta__progressbar" style={{ width: `${pct}%` }} />
            </div>
          )}

          {step < 3 ? (
            <div className="gta__quiz" key={`q-${step}`}>
              <div className="gta__meta">
                <span className="gta__count">Frage {step + 1} von 3</span>
                {step > 0 && (
                  <button type="button" className="gta__back" onClick={zurueck}>
                    Zurück
                  </button>
                )}
              </div>

              <p className="gta__question">{QUESTIONS[step].q}</p>

              <ul className="gta__opts">
                {QUESTIONS[step].opts.map((label, i) => {
                  const isPicked = picked === i;
                  const isLeaving = picked !== null && picked !== i;
                  return (
                    <li
                      key={i}
                      className={
                        'gta__optrow' +
                        (isPicked ? ' is-picked' : '') +
                        (isLeaving ? ' is-leaving' : '')
                      }
                    >
                      <button
                        type="button"
                        className="gta__opt"
                        onClick={() => antwort(i)}
                        disabled={picked !== null}
                      >
                        <span className="gta__num" aria-hidden="true">
                          {i + 1}
                        </span>
                        <span className="gta__label">
                          {label}
                          <span className="gta__underline" aria-hidden="true" />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="gta__result" key="result">
              <p className="gta__reclabel">Unsere Empfehlung</p>
              <p className="gta__paket">{paket}</p>
              <p className="gta__text">{PAKETE[paket]}</p>

              {nachbarn.length > 0 && (
                <div className="gta__alt">
                  <p className="gta__altlabel">Das könnte dir auch gefallen</p>
                  <div className="gta__altrow">
                    {nachbarn.map((name) => (
                      <button
                        key={name}
                        type="button"
                        className={
                          'gta__altbtn' + (altOpen === name ? ' is-open' : '')
                        }
                        aria-expanded={altOpen === name}
                        onClick={() =>
                          setAltOpen((cur) => (cur === name ? null : name))
                        }
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                  {altOpen && (
                    <p className="gta__alttext" key={altOpen}>
                      {PAKETE[altOpen]}
                    </p>
                  )}
                </div>
              )}

              <div className="gta__cta">
                <Link
                  href="/relaunch-preview/kontakt"
                  className="rr-btn-sweep rr-btn-sweep--red"
                >
                  Hol dir den kostenlosen Entwurf
                </Link>
                <button type="button" className="gta__restart" onClick={reset}>
                  Nochmal von vorn
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .gta {
          background: var(--rr-world-1-bg, #1d8c98);
          padding: var(--rr-section-y, clamp(96px, 12vw, 180px))
            var(--rr-gutter, clamp(20px, 4vw, 64px));
        }
        .gta__inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .gta__head {
          max-width: 780px;
        }
        .gta__statement {
          color: #f6f5f1;
        }
        .gta__intro {
          margin-top: 22px;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(1rem, 1.15vw, 1.15rem);
          line-height: 1.65;
          color: #ffffff;
          font-weight: 500;
        }

        .gta__stage {
          margin-top: clamp(40px, 5vw, 64px);
          max-width: 880px;
        }

        /* --- Fortschrittslinie --- */
        .gta__progress {
          height: 2px;
          background: rgba(246, 245, 241, 0.24);
          margin-bottom: clamp(26px, 3.4vw, 40px);
          overflow: hidden;
        }
        .gta__progressbar {
          display: block;
          height: 100%;
          background: var(--rr-world-1-accent, #fcfbc9);
          transition: width 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* --- Quiz --- */
        .gta__quiz {
          animation: gtaIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .gta__meta {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: clamp(18px, 2.4vw, 26px);
        }
        .gta__count {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-world-1-accent, #fcfbc9);
        }
        .gta__back {
          border: 0;
          background: none;
          padding: 0;
          cursor: pointer;
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.82rem;
          font-weight: 600;
          color: #ffffff;
          opacity: 0.72;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: opacity 0.2s ease;
        }
        .gta__back:hover {
          opacity: 1;
        }
        .gta__question {
          font-family: var(--rr-font-display, inherit);
          font-weight: 800;
          font-size: clamp(1.5rem, 2.6vw, 2.2rem);
          line-height: 1.12;
          color: #f6f5f1;
          margin-bottom: clamp(24px, 3.4vw, 40px);
          max-width: 20em;
        }

        .gta__opts {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
        }
        .gta__optrow {
          border-top: 1px solid rgba(246, 245, 241, 0.16);
          transition: opacity 0.4s ease, transform 0.4s ease, max-height 0.45s ease;
          max-height: 220px;
          overflow: hidden;
        }
        .gta__optrow:last-child {
          border-bottom: 1px solid rgba(246, 245, 241, 0.16);
        }
        .gta__optrow.is-leaving {
          opacity: 0;
          transform: translateX(28px);
          max-height: 0;
          pointer-events: none;
        }
        .gta__optrow.is-picked {
          border-color: rgba(246, 245, 241, 0.5);
        }

        .gta__opt {
          width: 100%;
          border: 0;
          background: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: clamp(16px, 2vw, 26px);
          text-align: left;
          padding: clamp(16px, 2.2vw, 26px) 2px;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .gta__opt:disabled {
          cursor: default;
        }
        @media (hover: hover) and (pointer: fine) {
          .gta__opt:not(:disabled):hover {
            transform: translateX(14px);
          }
        }
        .gta__optrow.is-picked .gta__opt {
          transform: translateX(14px);
        }

        .gta__num {
          flex: none;
          width: clamp(30px, 3.4vw, 40px);
          height: clamp(30px, 3.4vw, 40px);
          border-radius: 50%;
          background: #f6f5f1;
          color: var(--rr-red, #f12032);
          font-family: var(--rr-font-ui, inherit);
          font-weight: 700;
          font-size: clamp(0.9rem, 1.1vw, 1.05rem);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .gta__optrow.is-picked .gta__num {
          transform: scale(1.08);
        }

        .gta__label {
          position: relative;
          font-family: var(--rr-font-serif, Georgia, serif);
          font-style: italic;
          font-weight: 500;
          font-size: clamp(1.35rem, 3vw, 2.4rem);
          line-height: 1.14;
          color: #ffffff;
        }
        .gta__underline {
          position: absolute;
          left: 0;
          right: 100%;
          bottom: -0.08em;
          height: 2px;
          background: var(--rr-world-1-accent, #fcfbc9);
          transition: right 0.36s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) and (pointer: fine) {
          .gta__opt:not(:disabled):hover .gta__underline {
            right: 0;
          }
        }
        .gta__optrow.is-picked .gta__underline {
          right: 0;
        }

        /* --- Ergebnis --- */
        .gta__result {
          border: 1px solid rgba(28, 40, 55, 0.16);
          background: #fbfbfa;
          padding: clamp(28px, 3.4vw, 48px);
          animation: gtaFade 0.5s ease both;
        }
        .gta__reclabel {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-ink, #23262e);
          opacity: 0.55;
        }
        .gta__paket {
          margin-top: 6px;
          font-family: var(--rr-font-display, inherit);
          font-weight: 800;
          font-size: clamp(2.2rem, 4vw, 3.4rem);
          line-height: 1.0;
          color: var(--rr-navy, #1c2837);
        }
        .gta__paket::after {
          content: '.';
          color: var(--rr-red, #f12032);
        }
        .gta__text {
          margin-top: 20px;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(1rem, 1.1vw, 1.12rem);
          line-height: 1.65;
          color: var(--rr-ink, #23262e);
          max-width: 46em;
        }

        .gta__alt {
          margin-top: clamp(28px, 3vw, 38px);
          padding-top: clamp(22px, 2.6vw, 30px);
          border-top: 1px solid rgba(28, 40, 55, 0.14);
        }
        .gta__altlabel {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--rr-ink, #23262e);
          opacity: 0.55;
          margin-bottom: 14px;
        }
        .gta__altrow {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .gta__altbtn {
          border: 1px solid rgba(28, 40, 55, 0.26);
          background: #ffffff;
          padding: 12px 20px;
          cursor: pointer;
          font-family: var(--rr-font-display, inherit);
          font-weight: 700;
          font-size: clamp(1rem, 1.15vw, 1.15rem);
          color: var(--rr-navy, #1c2837);
          transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .gta__altbtn:hover {
          border-color: var(--rr-navy, #1c2837);
        }
        .gta__altbtn.is-open {
          background: var(--rr-navy, #1c2837);
          border-color: var(--rr-navy, #1c2837);
          color: #f6f5f1;
        }
        .gta__alttext {
          margin-top: 18px;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(0.98rem, 1.05vw, 1.08rem);
          line-height: 1.62;
          color: var(--rr-ink, #23262e);
          max-width: 46em;
          animation: gtaFade 0.3s ease both;
        }

        .gta__cta {
          margin-top: clamp(30px, 3.4vw, 42px);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px 28px;
        }
        .gta__cta :global(.rr-btn-sweep) {
          color: var(--rr-ink, #23262e);
        }
        .gta__restart {
          border: 0;
          background: none;
          padding: 0;
          cursor: pointer;
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--rr-ink, #23262e);
          opacity: 0.7;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: opacity 0.2s ease;
        }
        .gta__restart:hover {
          opacity: 1;
        }

        @keyframes gtaIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gtaFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gta__quiz,
          .gta__result,
          .gta__alttext {
            animation: none;
          }
          .gta__opt,
          .gta__num,
          .gta__underline,
          .gta__optrow,
          .gta__progressbar {
            transition: none;
          }
          .gta__optrow.is-leaving {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
