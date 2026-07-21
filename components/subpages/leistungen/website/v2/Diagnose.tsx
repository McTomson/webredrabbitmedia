'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * Diagnose-Sektion "Was du wirklich brauchst" (Copy v2 §3).
 * Durchklickender Fragebogen: drei Fragen nacheinander, dann eine ehrliche
 * Empfehlung (Starter/Business/Premium) mit den Nachbar-Stufen als
 * "Das koennte dir auch gefallen" und einem CTA.
 * Kein generisches Element: eigener Quiz-Flow im Marken-Stil (Teal-Welt,
 * rr-* Tokens, Eckig-Gesetz border-radius:0, roter Akzent).
 * DU-Anrede, echte Umlaute, kein Gedankenstrich, kein "KI"-Wort
 * (Hausbegriff: digitaler Kollege / Mitarbeiter).
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

export default function Diagnose() {
  // step 0..2 = Fragen, 3 = Ergebnis. answers: Punktwerte 1..3 pro Frage.
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [flash, setFlash] = useState<number | null>(null);
  const [altOpen, setAltOpen] = useState<PaketName | null>(null);

  function antwort(wert: number) {
    if (flash !== null) return;
    setFlash(wert - 1);
    // gewaehlte Antwort kurz weiss aufblitzen lassen, dann weiter
    window.setTimeout(() => {
      setAnswers((prev) => {
        const next = [...prev];
        next[step] = wert;
        return next;
      });
      setStep((s) => s + 1);
      setFlash(null);
    }, 220);
  }

  function zurueck() {
    setAltOpen(null);
    setStep((s) => Math.max(0, s - 1));
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setAltOpen(null);
    setFlash(null);
  }

  const summe = answers.reduce((a, b) => a + b, 0);
  const paket = paketFuer(summe);
  const paketIdx = ORDER.indexOf(paket);
  const nachbarn = ORDER.filter(
    (_, i) => i === paketIdx - 1 || i === paketIdx + 1,
  );

  return (
    <section className="wd-diag" aria-labelledby="wd-diag-title">
      <div className="wd-diag__inner">
        <div className="wd-diag__head">
          <p className="rr-eyebrow-lg wd-diag__eyebrow">WAS DU WIRKLICH BRAUCHST</p>
          <h2 id="wd-diag-title" className="rr-statement wd-diag__statement">
            Sag uns, wer du bist. Wir sagen dir ehrlich, was du brauchst.
          </h2>
          <p className="wd-diag__intro">Drei Fragen, dann reden wir Klartext.</p>
        </div>

        <div className="wd-diag__stage" aria-live="polite">
          {step < 3 ? (
            <div className="wd-diag__quiz" key={`q-${step}`}>
              <div className="wd-diag__progress">
                <span className="wd-diag__progresslabel">Frage {step + 1} von 3</span>
                {step > 0 && (
                  <button type="button" className="wd-diag__back" onClick={zurueck}>
                    Zurück
                  </button>
                )}
              </div>

              <p className="wd-diag__question">{QUESTIONS[step].q}</p>

              <div className="wd-diag__opts">
                {QUESTIONS[step].opts.map((label, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`wd-diag__opt${flash === i ? ' is-flash' : ''}`}
                    onClick={() => antwort(i + 1)}
                  >
                    <span className="wd-diag__optnum">
                      {String.fromCharCode(97 + i)}
                    </span>
                    <span className="wd-diag__optlabel">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="wd-diag__result" key="result">
              <p className="wd-diag__answerlabel">Unsere Empfehlung</p>
              <p className="wd-diag__paket">{paket}</p>
              <p className="wd-diag__text">{PAKETE[paket]}</p>

              {nachbarn.length > 0 && (
                <div className="wd-diag__alt">
                  <p className="wd-diag__altlabel">Das könnte dir auch gefallen</p>
                  <div className="wd-diag__altrow">
                    {nachbarn.map((name) => (
                      <button
                        key={name}
                        type="button"
                        className={`wd-diag__altbtn${
                          altOpen === name ? ' is-open' : ''
                        }`}
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
                    <p className="wd-diag__alttext" key={altOpen}>
                      {PAKETE[altOpen]}
                    </p>
                  )}
                </div>
              )}

              <div className="wd-diag__cta">
                <Link
                  href="/relaunch-preview/kontakt"
                  className="rr-btn-sweep rr-btn-sweep--red"
                >
                  Hol dir den kostenlosen Entwurf
                </Link>
                <button type="button" className="wd-diag__restart" onClick={reset}>
                  Nochmal von vorn
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .wd-diag {
          /* Teal-Welt: die Hauptseite fuehrt mit genau diesem Tuerkis zur
             Website-Leistung; hier antwortet die Seite mit EINER Teal-Sektion
             als Herzstueck. Farben = --rr-world-1-bg/-accent aus dem Styleguide. */
          background: var(--rr-world-1-bg, #1d8c98);
          padding: var(--rr-section-y, clamp(96px, 12vw, 180px)) var(--rr-gutter, clamp(20px, 4vw, 64px));
        }
        .wd-diag__inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .wd-diag__head {
          max-width: 760px;
        }
        .wd-diag__eyebrow {
          color: var(--rr-world-1-accent, #fcfbc9);
        }
        .wd-diag__statement {
          color: #f6f5f1;
        }
        .wd-diag__intro {
          margin-top: 22px;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(1rem, 1.15vw, 1.15rem);
          line-height: 1.65;
          color: #ffffff;
          font-weight: 500;
        }

        .wd-diag__stage {
          margin-top: clamp(36px, 5vw, 60px);
          max-width: 820px;
        }

        /* --- Quiz --- */
        .wd-diag__quiz {
          animation: wdSlide 0.34s ease both;
        }
        .wd-diag__progress {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 20px;
        }
        .wd-diag__progresslabel {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-world-1-accent, #fcfbc9);
        }
        .wd-diag__back {
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
        .wd-diag__back:hover {
          opacity: 1;
        }
        .wd-diag__question {
          font-family: var(--rr-font-display, inherit);
          font-weight: 800;
          font-size: clamp(1.5rem, 2.6vw, 2.2rem);
          line-height: 1.12;
          color: #f6f5f1;
          margin-bottom: clamp(20px, 3vw, 32px);
        }
        .wd-diag__opts {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .wd-diag__opt {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          text-align: left;
          /* Inaktive Zeilen: dunkler Scrim (hebt Text-Kontrast auf ~5:1),
             Border cream. Kein Rot direkt an Teal (vibriert). */
          border: 1px solid rgba(246, 245, 241, 0.3);
          border-radius: 0;
          background: rgba(0, 0, 0, 0.18);
          padding: 20px 22px;
          cursor: pointer;
          transition: border-color 0.22s ease, background 0.22s ease,
            transform 0.22s ease;
        }
        .wd-diag__opt:hover {
          border-color: rgba(246, 245, 241, 0.7);
        }
        .wd-diag__optnum {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--rr-world-1-accent, #fcfbc9);
          padding-top: 6px;
          flex: none;
        }
        .wd-diag__optlabel {
          font-family: var(--rr-font-serif, Georgia, serif);
          font-style: italic;
          font-size: clamp(1.05rem, 1.35vw, 1.32rem);
          line-height: 1.4;
          color: #ffffff;
        }
        /* gewaehlte Antwort blitzt kurz weiss auf, dann naechste Frage */
        .wd-diag__opt.is-flash {
          border-color: #f6f5f1;
          background: #fff;
          box-shadow: inset 4px 0 0 0 var(--rr-navy, #1c2837);
        }
        .wd-diag__opt.is-flash .wd-diag__optlabel {
          color: var(--rr-ink, #23262e);
        }
        .wd-diag__opt.is-flash .wd-diag__optnum {
          color: var(--rr-red, #f12032);
        }

        /* --- Ergebnis --- */
        .wd-diag__result {
          border: 1px solid rgba(28, 40, 55, 0.16);
          border-radius: 0;
          padding: clamp(26px, 3vw, 44px);
          background: #fbfbfa;
          animation: wdFade 0.4s ease both;
        }
        .wd-diag__answerlabel {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-ink, #23262e);
          opacity: 0.55;
        }
        .wd-diag__paket {
          margin-top: 6px;
          font-family: var(--rr-font-display, inherit);
          font-weight: 800;
          font-size: clamp(2rem, 3.4vw, 3rem);
          line-height: 1.02;
          color: var(--rr-navy, #1c2837);
        }
        .wd-diag__paket::after {
          content: '.';
          color: var(--rr-red, #f12032);
        }
        .wd-diag__text {
          margin-top: 18px;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(1rem, 1.1vw, 1.12rem);
          line-height: 1.65;
          color: var(--rr-ink, #23262e);
        }

        .wd-diag__alt {
          margin-top: clamp(26px, 3vw, 36px);
          padding-top: clamp(22px, 2.6vw, 30px);
          border-top: 1px solid rgba(28, 40, 55, 0.14);
        }
        .wd-diag__altlabel {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--rr-ink, #23262e);
          opacity: 0.55;
          margin-bottom: 14px;
        }
        .wd-diag__altrow {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .wd-diag__altbtn {
          border: 1px solid rgba(28, 40, 55, 0.26);
          border-radius: 0;
          background: #ffffff;
          padding: 12px 20px;
          cursor: pointer;
          font-family: var(--rr-font-display, inherit);
          font-weight: 700;
          font-size: clamp(1rem, 1.15vw, 1.15rem);
          color: var(--rr-navy, #1c2837);
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .wd-diag__altbtn:hover {
          border-color: var(--rr-navy, #1c2837);
        }
        .wd-diag__altbtn.is-open {
          background: var(--rr-navy, #1c2837);
          border-color: var(--rr-navy, #1c2837);
          color: #f6f5f1;
        }
        .wd-diag__alttext {
          margin-top: 18px;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(0.98rem, 1.05vw, 1.08rem);
          line-height: 1.62;
          color: var(--rr-ink, #23262e);
          animation: wdFade 0.3s ease both;
        }

        .wd-diag__cta {
          margin-top: clamp(28px, 3.4vw, 40px);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px 28px;
        }
        .wd-diag__cta :global(.rr-btn-sweep) {
          color: var(--rr-ink, #23262e);
        }
        .wd-diag__restart {
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
        .wd-diag__restart:hover {
          opacity: 1;
        }

        @keyframes wdFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes wdSlide {
          from {
            opacity: 0;
            transform: translateX(18px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .wd-diag__quiz,
          .wd-diag__result,
          .wd-diag__alttext {
            animation: none;
          }
          .wd-diag__opt {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
