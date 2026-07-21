'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Diagnose — Variante C: SPLIT MIT LIVE-ZUSAMMENFASSUNG.
 * Links sticky die bisherigen Antworten als wachsende Liste (kleine Checks,
 * cream-Ton); rechts die aktive Frage mit grossen Antwort-Flaechen, deren
 * Hover-Fill voll-flaechig in dunklerem Teal aufzieht (Text hell). Jede gewaehlte
 * Antwort fliegt nach links in die Zusammenfassung. Das Ergebnis ersetzt die
 * rechte Seite, links bleibt die Antwort-Historie als Begruendung stehen.
 *
 * INHALT + LOGIK 1:1 zum Bestand (Diagnose.tsx). DU-Anrede, echte Umlaute, kein
 * Gedankenstrich, kein "KI"-Wort (digitaler Kollege), border-radius:0 (Ausnahme:
 * runde Check-Punkte). Rot nur auf hellen Flaechen (Ergebnis-Panel), nie auf Teal.
 * prefers-reduced-motion: kein Flug, nur Fade/Instant.
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

export default function VarianteC() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [chosen, setChosen] = useState<number[]>([]); // Option-Index je Frage (fuer Zusammenfassung)
  const [flying, setFlying] = useState<number | null>(null);
  const [altOpen, setAltOpen] = useState<PaketName | null>(null);
  const reduce = usePrefersReducedMotion();

  function antwort(i: number) {
    if (flying !== null) return;
    const commit = () => {
      setAnswers((prev) => {
        const next = [...prev];
        next[step] = i + 1;
        return next;
      });
      setChosen((prev) => {
        const next = [...prev];
        next[step] = i;
        return next;
      });
      setStep((s) => s + 1);
      setFlying(null);
    };
    if (reduce) {
      commit();
      return;
    }
    setFlying(i);
    window.setTimeout(commit, 480);
  }

  function zurueck() {
    if (flying !== null) return;
    setAltOpen(null);
    setStep((s) => {
      const ns = Math.max(0, s - 1);
      setChosen((prev) => prev.slice(0, ns));
      setAnswers((prev) => prev.slice(0, ns));
      return ns;
    });
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setChosen([]);
    setAltOpen(null);
    setFlying(null);
  }

  const summe = answers.reduce((a, b) => a + b, 0);
  const paket = paketFuer(summe);
  const paketIdx = ORDER.indexOf(paket);
  const nachbarn = ORDER.filter(
    (_, i) => i === paketIdx - 1 || i === paketIdx + 1,
  );

  const done = step >= 3;
  const answeredCount = done ? 3 : step;

  return (
    <section className="sp" aria-labelledby="sp-title">
      <div className="sp__inner">
        <div className="sp__head">
          <p className="wd-eyebrow wd-eyebrow--cream sp__eyebrow">
            (WAS DU WIRKLICH BRAUCHST)
          </p>
          <h2 id="sp-title" className="rr-statement sp__statement">
            Sag uns, wer du bist. Wir sagen dir ehrlich, was du brauchst.
          </h2>
          <p className="sp__intro">Drei Fragen, dann reden wir Klartext.</p>
        </div>

        <div className="sp__grid">
          {/* Links: Live-Zusammenfassung */}
          <aside className="sp__summary" aria-label="Deine Antworten bisher">
            <p className="sp__summarytitle">Deine Antworten</p>
            <ol className="sp__list">
              {QUESTIONS.map((frage, qi) => {
                const filled = qi < answeredCount;
                return (
                  <li
                    key={qi}
                    className={'sp__row' + (filled ? ' is-filled' : '')}
                  >
                    <span className="sp__check" aria-hidden="true">
                      {filled && (
                        <svg viewBox="0 0 16 16" width="11" height="11">
                          <path
                            d="M2.5 8.5l3.5 3.5 7.5-8.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="sp__rowtext">
                      <span className="sp__rowq">{frage.q}</span>
                      <span className="sp__rowa">
                        {filled ? frage.opts[chosen[qi] ?? 0] : 'offen'}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
            {done && (
              <p className="sp__because">Drum diese Empfehlung.</p>
            )}
          </aside>

          {/* Rechts: aktive Frage bzw. Ergebnis */}
          <div className="sp__panel" aria-live="polite">
            {!done ? (
              <div className="sp__quiz" key={`q-${step}`}>
                <div className="sp__meta">
                  <span className="sp__count">Frage {step + 1} von 3</span>
                  {step > 0 && (
                    <button type="button" className="sp__back" onClick={zurueck}>
                      Zurück
                    </button>
                  )}
                </div>
                <p className="sp__question">{QUESTIONS[step].q}</p>
                <div className="sp__opts">
                  {QUESTIONS[step].opts.map((label, i) => (
                    <button
                      key={i}
                      type="button"
                      className={
                        'sp__opt' +
                        (flying === i ? ' is-fly' : '') +
                        (flying !== null && flying !== i ? ' is-dim' : '')
                      }
                      onClick={() => antwort(i)}
                      disabled={flying !== null}
                    >
                      <span className="sp__optlabel">{label}</span>
                      <span className="sp__optarrow" aria-hidden="true">
                        &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="sp__result" key="result">
                <p className="sp__reclabel">Unsere Empfehlung</p>
                <p className="sp__paket">{paket}</p>
                <p className="sp__text">{PAKETE[paket]}</p>

                {nachbarn.length > 0 && (
                  <div className="sp__alt">
                    <p className="sp__altlabel">Das könnte dir auch gefallen</p>
                    <div className="sp__altrow">
                      {nachbarn.map((name) => (
                        <button
                          key={name}
                          type="button"
                          className={
                            'sp__altbtn' + (altOpen === name ? ' is-open' : '')
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
                      <p className="sp__alttext" key={altOpen}>
                        {PAKETE[altOpen]}
                      </p>
                    )}
                  </div>
                )}

                <div className="sp__cta">
                  <Link
                    href="/relaunch-preview/kontakt"
                    className="rr-btn-sweep rr-btn-sweep--red"
                  >
                    Hol dir den kostenlosen Entwurf
                  </Link>
                  <button type="button" className="sp__restart" onClick={reset}>
                    Nochmal von vorn
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .sp {
          background: var(--rr-world-1-bg, #1d8c98);
          padding: var(--rr-section-y, clamp(96px, 12vw, 180px))
            var(--rr-gutter, clamp(20px, 4vw, 64px));
        }
        .sp__inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .sp__head {
          max-width: 780px;
        }
        .sp__statement {
          color: #f6f5f1;
        }
        .sp__intro {
          margin-top: 22px;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(1rem, 1.15vw, 1.15rem);
          line-height: 1.65;
          color: #ffffff;
          font-weight: 500;
        }

        .sp__grid {
          margin-top: clamp(40px, 5vw, 64px);
          display: grid;
          grid-template-columns: minmax(0, 0.72fr) minmax(0, 1fr);
          gap: clamp(24px, 4vw, 60px);
          align-items: start;
        }

        /* --- Links: Zusammenfassung --- */
        .sp__summary {
          position: sticky;
          top: clamp(90px, 12vh, 130px);
          border-top: 1px solid rgba(246, 245, 241, 0.24);
          padding-top: clamp(16px, 2vw, 22px);
        }
        .sp__summarytitle {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-world-1-accent, #fcfbc9);
          margin-bottom: clamp(16px, 2vw, 22px);
        }
        .sp__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: clamp(14px, 1.8vw, 20px);
        }
        .sp__row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          opacity: 0.42;
          transition: opacity 0.4s ease;
        }
        .sp__row.is-filled {
          opacity: 1;
          animation: spDrop 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .sp__check {
          flex: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1.5px solid rgba(246, 245, 241, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--rr-world-1-bg, #1d8c98);
          margin-top: 2px;
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .sp__row.is-filled .sp__check {
          background: var(--rr-world-1-accent, #fcfbc9);
          border-color: var(--rr-world-1-accent, #fcfbc9);
        }
        .sp__rowtext {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }
        .sp__rowq {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: rgba(255, 255, 255, 0.66);
        }
        .sp__rowa {
          font-family: var(--rr-font-serif, Georgia, serif);
          font-style: italic;
          font-size: clamp(0.95rem, 1.1vw, 1.08rem);
          line-height: 1.3;
          color: #f6f5f1;
        }
        .sp__because {
          margin-top: clamp(18px, 2.4vw, 26px);
          padding-top: clamp(14px, 1.8vw, 20px);
          border-top: 1px solid rgba(246, 245, 241, 0.2);
          font-family: var(--rr-font-serif, Georgia, serif);
          font-style: italic;
          font-size: clamp(1rem, 1.2vw, 1.15rem);
          color: var(--rr-world-1-accent, #fcfbc9);
          animation: spFade 0.4s ease both;
        }

        /* --- Rechts: Panel --- */
        .sp__quiz {
          animation: spFade 0.4s ease both;
        }
        .sp__meta {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: clamp(16px, 2vw, 24px);
        }
        .sp__count {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-world-1-accent, #fcfbc9);
        }
        .sp__back {
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
        .sp__back:hover {
          opacity: 1;
        }
        .sp__question {
          font-family: var(--rr-font-display, inherit);
          font-weight: 800;
          font-size: clamp(1.5rem, 2.6vw, 2.2rem);
          line-height: 1.12;
          color: #f6f5f1;
          margin-bottom: clamp(20px, 3vw, 32px);
          max-width: 18em;
        }
        .sp__opts {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .sp__opt {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          text-align: left;
          border: 1px solid rgba(246, 245, 241, 0.32);
          background: transparent;
          padding: clamp(18px, 2.2vw, 26px) clamp(20px, 2.2vw, 26px);
          cursor: pointer;
          transition: transform 0.45s cubic-bezier(0.5, 0, 0.2, 1),
            opacity 0.4s ease, border-color 0.25s ease;
        }
        /* voll-flaechiger Hover-Fill in dunklerem Teal */
        .sp__opt::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #0f5a63;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.4s cubic-bezier(0.5, 0, 0.2, 1);
          z-index: 0;
        }
        @media (hover: hover) and (pointer: fine) {
          .sp__opt:not(:disabled):hover::before {
            transform: scaleX(1);
          }
          .sp__opt:not(:disabled):hover {
            border-color: #0f5a63;
          }
        }
        .sp__optlabel,
        .sp__optarrow {
          position: relative;
          z-index: 1;
        }
        .sp__optlabel {
          font-family: var(--rr-font-serif, Georgia, serif);
          font-style: italic;
          font-size: clamp(1.1rem, 1.5vw, 1.5rem);
          line-height: 1.28;
          color: #ffffff;
        }
        .sp__optarrow {
          flex: none;
          font-size: 1.3rem;
          color: var(--rr-world-1-accent, #fcfbc9);
          opacity: 0;
          transform: translateX(-8px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .sp__opt:not(:disabled):hover .sp__optarrow {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .sp__opt.is-fly {
          transform: translate(-40px, -30px) scale(0.9);
          opacity: 0;
        }
        .sp__opt.is-dim {
          opacity: 0.25;
        }

        /* --- Ergebnis --- */
        .sp__result {
          border: 1px solid rgba(28, 40, 55, 0.16);
          background: #fbfbfa;
          padding: clamp(26px, 3vw, 44px);
          animation: spFade 0.5s ease both;
        }
        .sp__reclabel {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-ink, #23262e);
          opacity: 0.55;
        }
        .sp__paket {
          margin-top: 6px;
          font-family: var(--rr-font-display, inherit);
          font-weight: 800;
          font-size: clamp(2rem, 3.4vw, 3rem);
          line-height: 1.02;
          color: var(--rr-navy, #1c2837);
        }
        .sp__paket::after {
          content: '.';
          color: var(--rr-red, #f12032);
        }
        .sp__text {
          margin-top: 18px;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(1rem, 1.1vw, 1.12rem);
          line-height: 1.65;
          color: var(--rr-ink, #23262e);
        }

        .sp__alt {
          margin-top: clamp(26px, 3vw, 36px);
          padding-top: clamp(22px, 2.6vw, 30px);
          border-top: 1px solid rgba(28, 40, 55, 0.14);
        }
        .sp__altlabel {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--rr-ink, #23262e);
          opacity: 0.55;
          margin-bottom: 14px;
        }
        .sp__altrow {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .sp__altbtn {
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
        .sp__altbtn:hover {
          border-color: var(--rr-navy, #1c2837);
        }
        .sp__altbtn.is-open {
          background: var(--rr-navy, #1c2837);
          border-color: var(--rr-navy, #1c2837);
          color: #f6f5f1;
        }
        .sp__alttext {
          margin-top: 18px;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(0.98rem, 1.05vw, 1.08rem);
          line-height: 1.62;
          color: var(--rr-ink, #23262e);
          animation: spFade 0.3s ease both;
        }

        .sp__cta {
          margin-top: clamp(28px, 3.4vw, 40px);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px 28px;
        }
        .sp__cta :global(.rr-btn-sweep) {
          color: var(--rr-ink, #23262e);
        }
        .sp__restart {
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
        .sp__restart:hover {
          opacity: 1;
        }

        @keyframes spFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spDrop {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 860px) {
          .sp__grid {
            grid-template-columns: 1fr;
          }
          .sp__summary {
            position: static;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sp__quiz,
          .sp__result,
          .sp__alttext,
          .sp__row.is-filled,
          .sp__because {
            animation: none;
          }
          .sp__opt,
          .sp__opt::before,
          .sp__optarrow,
          .sp__check,
          .sp__row {
            transition: none;
          }
          .sp__opt.is-fly {
            opacity: 0;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
