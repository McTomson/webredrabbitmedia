'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/**
 * Diagnose — Variante B: DIAGNOSE-BOGEN.
 * Die Sektion inszeniert einen hellen Befund-Bogen (Offwhite-Karte auf Teal,
 * eckig, dezente Hairlines wie ein Formular). Die Fragen fuellen sich Zeile fuer
 * Zeile auf den Bogen; die gewaehlte Antwort bekommt einen roten, handschriftlich
 * wirkenden Kreis (SVG-Stroke-Animation, passt zur Mal-Mechanik der Marke).
 * Nach Frage 3 stempelt sich das Ergebnis auf den Bogen (Empfehlungs-Block faehrt
 * mit leichtem Rotations-Settle ein). Kollege-Hinweis als Randnotiz.
 *
 * INHALT + LOGIK 1:1 zum Bestand (Diagnose.tsx). DU-Anrede, echte Umlaute, kein
 * Gedankenstrich, kein "KI"-Wort (digitaler Kollege), border-radius:0 (Ausnahme:
 * die runden Ziffer-Chips). Rot nur auf der hellen Bogen-Flaeche, nie auf Teal.
 * prefers-reduced-motion: Kreis + Stempel erscheinen instant, nur Fade.
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

/** Handschriftlich wirkender roter Kreis (SVG), zeichnet sich beim Mount ein. */
function HandCircle({ reduce }: { reduce: boolean }) {
  const [drawn, setDrawn] = useState(reduce);
  useEffect(() => {
    if (reduce) {
      setDrawn(true);
      return;
    }
    const id = window.requestAnimationFrame(() => setDrawn(true));
    return () => window.cancelAnimationFrame(id);
  }, [reduce]);
  return (
    <svg
      className="db__circle"
      viewBox="0 0 220 70"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M40 12 C14 16 8 34 20 48 C34 63 92 66 140 62 C190 57 214 44 208 28 C202 13 150 6 96 8 C70 9 48 11 34 18"
        fill="none"
        stroke="var(--rr-red, #f12032)"
        strokeWidth="2.4"
        strokeLinecap="round"
        pathLength={100}
        style={{
          strokeDasharray: 100,
          strokeDashoffset: drawn ? 0 : 100,
          transition: reduce
            ? 'none'
            : 'stroke-dashoffset 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
        }}
      />
    </svg>
  );
}

export default function VarianteB() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [chosen, setChosen] = useState<number[]>([]); // Index der gewaehlten Option je Frage
  const [pending, setPending] = useState<number | null>(null);
  const [altOpen, setAltOpen] = useState<PaketName | null>(null);
  const reduce = usePrefersReducedMotion();

  function antwort(i: number) {
    if (pending !== null) return;
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
      setPending(null);
    };
    if (reduce) {
      commit();
      return;
    }
    // erst den Kreis ziehen lassen, dann naechste Zeile aufschlagen
    setPending(i);
    // Kreis provisorisch anzeigen: chosen fuer aktuellen step setzen
    setChosen((prev) => {
      const next = [...prev];
      next[step] = i;
      return next;
    });
    window.setTimeout(commit, 720);
  }

  function zurueck() {
    if (pending !== null) return;
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
    setPending(null);
  }

  const summe = answers.reduce((a, b) => a + b, 0);
  const paket = paketFuer(summe);
  const paketIdx = ORDER.indexOf(paket);
  const nachbarn = ORDER.filter(
    (_, i) => i === paketIdx - 1 || i === paketIdx + 1,
  );

  const done = step >= 3;

  return (
    <section className="db" aria-labelledby="db-title">
      <div className="db__inner">
        <div className="db__head">
          <p className="wd-eyebrow wd-eyebrow--cream db__eyebrow">
            (WAS DU WIRKLICH BRAUCHST)
          </p>
          <h2 id="db-title" className="rr-statement db__statement">
            Sag uns, wer du bist. Wir sagen dir ehrlich, was du brauchst.
          </h2>
          <p className="db__intro">Drei Fragen, dann reden wir Klartext.</p>
        </div>

        <div className="db__sheetwrap">
          <div className="db__sheet" aria-live="polite">
            <div className="db__sheethead">
              <span className="db__sheettitle">Befund-Bogen</span>
              <span className="db__sheetmeta">
                {done ? 'Ausgewertet' : `Frage ${step + 1} von 3`}
              </span>
            </div>

            {/* beantwortete + aktuelle Fragen fuellen den Bogen */}
            {QUESTIONS.map((frage, qi) => {
              if (qi > step) return null;
              const answered = qi < step || (pending !== null && qi === step);
              const activeOpen = qi === step && pending === null && !done;
              return (
                <div
                  key={qi}
                  className={'db__field' + (answered ? ' is-answered' : '')}
                >
                  <p className="db__q">
                    <span className="db__qnum">{qi + 1}</span>
                    {frage.q}
                  </p>

                  {answered ? (
                    <p className="db__answered">
                      <span className="db__answeredwrap">
                        {frage.opts[chosen[qi] ?? 0]}
                        <HandCircle reduce={reduce} />
                      </span>
                    </p>
                  ) : activeOpen ? (
                    <div className="db__opts">
                      {frage.opts.map((label, i) => (
                        <button
                          key={i}
                          type="button"
                          className="db__opt"
                          onClick={() => antwort(i)}
                          disabled={pending !== null}
                        >
                          <span className="db__mark" aria-hidden="true" />
                          <span className="db__optlabel">{label}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}

            {step > 0 && !done && (
              <button type="button" className="db__back" onClick={zurueck}>
                Zurück
              </button>
            )}

            {/* Ergebnis stempelt auf den Bogen */}
            {done && (
              <div
                className={'db__stamp' + (reduce ? ' is-static' : '')}
                key="stamp"
              >
                <p className="db__stamplabel">Befund · Unsere Empfehlung</p>
                <p className="db__paket">{paket}</p>
                <p className="db__text">{PAKETE[paket]}</p>

                {nachbarn.length > 0 && (
                  <div className="db__alt">
                    <p className="db__altlabel">Das könnte dir auch gefallen</p>
                    <div className="db__altrow">
                      {nachbarn.map((name) => (
                        <button
                          key={name}
                          type="button"
                          className={
                            'db__altbtn' + (altOpen === name ? ' is-open' : '')
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
                      <p className="db__alttext" key={altOpen}>
                        {PAKETE[altOpen]}
                      </p>
                    )}
                  </div>
                )}

                <div className="db__cta">
                  <Link
                    href="/relaunch-preview/kontakt"
                    className="rr-btn-sweep rr-btn-sweep--red"
                  >
                    Hol dir den kostenlosen Entwurf
                  </Link>
                  <button type="button" className="db__restart" onClick={reset}>
                    Nochmal von vorn
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="db__note" aria-hidden={done ? undefined : true}>
            Notiz am Rand: Egal welcher Befund, ein digitaler Kollege ist von
            Anfang an dabei und fängt deine Anfragen ab.
          </p>
        </div>
      </div>

      <style jsx>{`
        .db {
          background: var(--rr-world-1-bg, #1d8c98);
          padding: var(--rr-section-y, clamp(96px, 12vw, 180px))
            var(--rr-gutter, clamp(20px, 4vw, 64px));
        }
        .db__inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .db__head {
          max-width: 780px;
        }
        .db__statement {
          color: #f6f5f1;
        }
        .db__intro {
          margin-top: 22px;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(1rem, 1.15vw, 1.15rem);
          line-height: 1.65;
          color: #ffffff;
          font-weight: 500;
        }

        .db__sheetwrap {
          margin-top: clamp(40px, 5vw, 64px);
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 220px);
          gap: clamp(20px, 3vw, 44px);
          align-items: start;
        }

        /* --- Bogen --- */
        .db__sheet {
          background: #f7f6f1;
          border: 1px solid rgba(28, 40, 55, 0.18);
          box-shadow: 0 24px 60px -30px rgba(0, 0, 0, 0.5);
          padding: clamp(24px, 3.2vw, 44px);
          max-width: 780px;
        }
        .db__sheethead {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
          padding-bottom: clamp(14px, 1.8vw, 20px);
          border-bottom: 2px solid rgba(28, 40, 55, 0.72);
          margin-bottom: clamp(18px, 2.4vw, 28px);
        }
        .db__sheettitle {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--rr-navy, #1c2837);
        }
        .db__sheetmeta {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--rr-red, #f12032);
        }

        .db__field {
          padding: clamp(14px, 2vw, 22px) 0;
          border-bottom: 1px dashed rgba(28, 40, 55, 0.22);
          animation: dbLine 0.45s ease both;
        }
        .db__field:last-of-type {
          border-bottom: 0;
        }
        .db__q {
          display: flex;
          align-items: baseline;
          gap: 12px;
          font-family: var(--rr-font-display, inherit);
          font-weight: 700;
          font-size: clamp(1.1rem, 1.8vw, 1.5rem);
          line-height: 1.2;
          color: var(--rr-navy, #1c2837);
          margin: 0 0 clamp(12px, 1.6vw, 18px);
        }
        .db__qnum {
          flex: none;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1.5px solid var(--rr-navy, #1c2837);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.82rem;
          font-weight: 700;
          transform: translateY(-2px);
        }

        .db__opts {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-left: 38px;
        }
        .db__opt {
          display: flex;
          align-items: center;
          gap: 14px;
          text-align: left;
          border: 0;
          background: none;
          cursor: pointer;
          padding: 11px 6px;
          transition: background 0.2s ease, padding-left 0.25s ease;
        }
        .db__opt:disabled {
          cursor: default;
        }
        @media (hover: hover) and (pointer: fine) {
          .db__opt:not(:disabled):hover {
            background: rgba(28, 40, 55, 0.05);
            padding-left: 12px;
          }
        }
        .db__mark {
          flex: none;
          width: 15px;
          height: 15px;
          border: 1.5px solid rgba(28, 40, 55, 0.4);
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .db__opt:not(:disabled):hover .db__mark {
            border-color: var(--rr-red, #f12032);
          }
        }
        .db__optlabel {
          font-family: var(--rr-font-serif, Georgia, serif);
          font-style: italic;
          font-size: clamp(1.02rem, 1.3vw, 1.24rem);
          line-height: 1.35;
          color: var(--rr-ink, #23262e);
        }

        .db__answered {
          margin: 0;
          padding-left: 38px;
        }
        .db__answeredwrap {
          position: relative;
          display: inline-block;
          padding: 4px 18px 10px 8px;
          font-family: var(--rr-font-serif, Georgia, serif);
          font-style: italic;
          font-size: clamp(1.05rem, 1.35vw, 1.32rem);
          line-height: 1.3;
          color: var(--rr-navy, #1c2837);
        }
        .db__circle {
          position: absolute;
          left: -6px;
          top: -4px;
          width: calc(100% + 12px);
          height: calc(100% + 8px);
          overflow: visible;
          pointer-events: none;
        }

        .db__back {
          margin-top: clamp(16px, 2vw, 22px);
          border: 0;
          background: none;
          padding: 0;
          cursor: pointer;
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.86rem;
          font-weight: 600;
          color: var(--rr-navy, #1c2837);
          opacity: 0.7;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: opacity 0.2s ease;
        }
        .db__back:hover {
          opacity: 1;
        }

        /* --- Ergebnis-Stempel --- */
        .db__stamp {
          margin-top: clamp(20px, 2.6vw, 30px);
          padding-top: clamp(20px, 2.6vw, 30px);
          border-top: 2px solid rgba(28, 40, 55, 0.72);
          animation: dbStamp 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          transform-origin: 30% 20%;
        }
        .db__stamp.is-static {
          animation: dbFade 0.4s ease both;
        }
        .db__stamplabel {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-red, #f12032);
        }
        .db__paket {
          margin-top: 6px;
          font-family: var(--rr-font-display, inherit);
          font-weight: 800;
          font-size: clamp(2rem, 3.6vw, 3.1rem);
          line-height: 1.0;
          color: var(--rr-navy, #1c2837);
        }
        .db__paket::after {
          content: '.';
          color: var(--rr-red, #f12032);
        }
        .db__text {
          margin-top: 16px;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(1rem, 1.1vw, 1.1rem);
          line-height: 1.64;
          color: var(--rr-ink, #23262e);
          max-width: 46em;
        }

        .db__alt {
          margin-top: clamp(24px, 2.8vw, 34px);
          padding-top: clamp(20px, 2.4vw, 28px);
          border-top: 1px solid rgba(28, 40, 55, 0.16);
        }
        .db__altlabel {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--rr-ink, #23262e);
          opacity: 0.55;
          margin-bottom: 14px;
        }
        .db__altrow {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .db__altbtn {
          border: 1px solid rgba(28, 40, 55, 0.26);
          background: #ffffff;
          padding: 11px 20px;
          cursor: pointer;
          font-family: var(--rr-font-display, inherit);
          font-weight: 700;
          font-size: clamp(1rem, 1.15vw, 1.12rem);
          color: var(--rr-navy, #1c2837);
          transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .db__altbtn:hover {
          border-color: var(--rr-navy, #1c2837);
        }
        .db__altbtn.is-open {
          background: var(--rr-navy, #1c2837);
          border-color: var(--rr-navy, #1c2837);
          color: #f6f5f1;
        }
        .db__alttext {
          margin-top: 18px;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(0.98rem, 1.05vw, 1.06rem);
          line-height: 1.62;
          color: var(--rr-ink, #23262e);
          max-width: 46em;
          animation: dbFade 0.3s ease both;
        }

        .db__cta {
          margin-top: clamp(26px, 3vw, 38px);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px 28px;
        }
        .db__cta :global(.rr-btn-sweep) {
          color: var(--rr-ink, #23262e);
        }
        .db__restart {
          border: 0;
          background: none;
          padding: 0;
          cursor: pointer;
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--rr-ink, #23262e);
          opacity: 0.7;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: opacity 0.2s ease;
        }
        .db__restart:hover {
          opacity: 1;
        }

        /* --- Randnotiz --- */
        .db__note {
          font-family: var(--rr-font-serif, Georgia, serif);
          font-style: italic;
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          line-height: 1.5;
          color: var(--rr-world-1-accent, #fcfbc9);
          border-left: 2px solid rgba(252, 251, 201, 0.5);
          padding: 4px 0 4px 16px;
          margin: clamp(8px, 2vw, 20px) 0 0;
          transform: rotate(-1.2deg);
        }

        @keyframes dbLine {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes dbStamp {
          0% {
            opacity: 0;
            transform: scale(1.12) rotate(-3deg);
          }
          60% {
            opacity: 1;
            transform: scale(0.99) rotate(0.6deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        @keyframes dbFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 860px) {
          .db__sheetwrap {
            grid-template-columns: 1fr;
          }
          .db__note {
            transform: none;
            border-left: 0;
            border-top: 1px solid rgba(252, 251, 201, 0.4);
            padding: 14px 0 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .db__field,
          .db__stamp,
          .db__alttext {
            animation: none;
          }
          .db__opt,
          .db__mark {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
