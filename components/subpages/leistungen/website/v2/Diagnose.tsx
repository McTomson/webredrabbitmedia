'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * Diagnose-Sektion "Was du wirklich brauchst" (Copy v2 §3).
 * Interaktiv: der Leser sucht seine Situation, wir geben ehrlich unsere
 * Empfehlung (zeigt auf Starter/Business/Premium, Kollege immer dabei).
 * Kein generisches Element: eigene Persona-Auswahl + Empfehlungs-Reveal im
 * Marken-Stil (rr-* Tokens, Eckig-Gesetz border-radius:0, roter Akzent).
 * DU-Anrede, echte Umlaute, kein Gedankenstrich, kein "KI"-Wort.
 */

type Persona = { quote: string; paket: string; text: string };

const PERSONAS: Persona[] = [
  {
    quote: 'Ich fange gerade an und will erstmal überhaupt gefunden werden.',
    paket: 'Starter',
    text: 'Dann brauchst du kein Riesending. Eine saubere One-Pager-Seite, auf der drinsteht, wer du bist, was du machst und wie man dich erreicht, reicht für den Anfang völlig. Das ist unser Starter. Und ehrlich: für viele passt genau das und mehr wäre rausgeworfenes Geld. Ein digitaler Kollege ist trotzdem dabei, der kümmert sich um Anfragen, während du arbeitest.',
  },
  {
    quote: 'Ich hab schon eine Seite, aber die bringt einfach nichts.',
    paket: 'Business',
    text: 'Kennen wir. Meistens ist die Seite nicht hässlich, sie führt nur niemanden irgendwohin. Da bauen wir dir eine mehrseitige Seite, die wirklich für dich rankt und aus Besuchern Anfragen macht. Das ist unser Business, unsere meistgewählte Stufe. Der Kollege hängt mit dran und fängt ab, was reinkommt, auch wenn du grad am Dach stehst.',
  },
  {
    quote: 'Ich will, dass die Seite aktiv arbeitet und mir Kunden bringt.',
    paket: 'Premium',
    text: 'Dann reden wir über Premium. Umfangreich, auf Anfragen und Sichtbarkeit gebaut, mit Content, der sich ständig aktualisiert, damit dich Google und die neuen Antwortmaschinen empfehlen. Auch hier ist ein Kollege von Anfang an im Team, und du kannst dir weitere dazuholen, sobald du merkst, wo dir Arbeit abgenommen werden soll.',
  },
];

export default function Diagnose() {
  const [active, setActive] = useState(0);
  const p = PERSONAS[active];

  return (
    <section className="wd-diag" aria-labelledby="wd-diag-title">
      <div className="wd-diag__head">
        <p className="rr-eyebrow-lg">WAS DU WIRKLICH BRAUCHST</p>
        <h2 id="wd-diag-title" className="rr-statement">
          Sag uns, wer du bist. Wir sagen dir ehrlich, was du brauchst.
        </h2>
        <p className="wd-diag__intro">
          Die meisten wissen genau, was sie machen, aber nicht, welche Website dazu
          passt. Muss auch keiner wissen, das ist unser Job. Such dir raus, wo du
          gerade stehst.
        </p>
      </div>

      <div className="wd-diag__grid">
        <div className="wd-diag__picker" role="tablist" aria-label="Deine Situation">
          {PERSONAS.map((persona, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`wd-diag__opt${i === active ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              <span className="wd-diag__optnum">0{i + 1}</span>
              <span className="wd-diag__optquote">{persona.quote}</span>
            </button>
          ))}
        </div>

        <div className="wd-diag__answer" role="tabpanel" key={active}>
          <p className="wd-diag__answerlabel">Unsere Empfehlung</p>
          <p className="wd-diag__paket">{p.paket}</p>
          <p className="wd-diag__text">{p.text}</p>
        </div>
      </div>

      <div className="wd-diag__foot">
        <p className="wd-diag__close">
          Nicht sicher, was davon du bist? Dann sag uns kurz, was du machst, und wir
          sind ehrlich mit dir. Auch wenn das Kleine reicht.
        </p>
        <Link href="/relaunch-preview/kontakt" className="rr-btn-frame rr-btn-frame--navy">
          <i className="c1" /><i className="c2" /><i className="c3" /><i className="c4" />
          <span className="rr-btn-frame__t">Sag uns kurz, was du machst</span>
        </Link>
      </div>

      <style jsx>{`
        .wd-diag {
          padding: clamp(72px, 12vh, 148px) var(--rr-gutter, clamp(20px, 4vw, 64px));
          max-width: 1200px;
          margin: 0 auto;
        }
        .wd-diag__head {
          max-width: 760px;
        }
        .wd-diag__intro {
          margin-top: 22px;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(1rem, 1.15vw, 1.15rem);
          line-height: 1.65;
          color: var(--rr-ink, #23262e);
          opacity: 0.82;
        }
        .wd-diag__grid {
          margin-top: clamp(36px, 5vw, 60px);
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
          gap: clamp(20px, 3vw, 48px);
          align-items: start;
        }
        .wd-diag__picker {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .wd-diag__opt {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          text-align: left;
          border: 1px solid rgba(28, 40, 55, 0.16);
          border-radius: 0;
          background: #fff;
          padding: 20px 22px;
          cursor: pointer;
          transition: border-color 0.22s ease, background 0.22s ease, transform 0.22s ease;
        }
        .wd-diag__opt:hover {
          border-color: rgba(28, 40, 55, 0.4);
        }
        .wd-diag__opt.is-active {
          border-color: var(--rr-red, #f12032);
          background: #fff;
          box-shadow: inset 4px 0 0 0 var(--rr-red, #f12032);
        }
        .wd-diag__optnum {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--rr-red, #f12032);
          padding-top: 3px;
          flex: none;
        }
        .wd-diag__optquote {
          font-family: var(--rr-font-serif, Georgia, serif);
          font-style: italic;
          font-size: clamp(1.05rem, 1.35vw, 1.32rem);
          line-height: 1.4;
          color: var(--rr-ink, #23262e);
        }
        .wd-diag__answer {
          border: 1px solid rgba(28, 40, 55, 0.16);
          border-radius: 0;
          padding: clamp(26px, 3vw, 40px);
          background: #fbfbfa;
          animation: wdFade 0.34s ease both;
        }
        @keyframes wdFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
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
        .wd-diag__foot {
          margin-top: clamp(36px, 5vw, 56px);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 24px 40px;
          justify-content: space-between;
        }
        .wd-diag__close {
          max-width: 640px;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(1rem, 1.1vw, 1.12rem);
          line-height: 1.6;
          color: var(--rr-ink, #23262e);
          opacity: 0.82;
        }
        @media (max-width: 860px) {
          .wd-diag__grid {
            grid-template-columns: 1fr;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .wd-diag__answer { animation: none; }
          .wd-diag__opt { transition: none; }
        }
      `}</style>
    </section>
  );
}
