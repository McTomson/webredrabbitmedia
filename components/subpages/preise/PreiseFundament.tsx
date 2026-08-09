'use client';

import { useState } from 'react';

/**
 * Fundament-Block der Preisseite — "In jedem Paket dabei" (Thomas 09.08.2026,
 * brand/decisions-log.md). Einmal gezeigt, damit die drei Stufen darunter nur
 * noch ihren echten Unterschied auflisten (Selbstzuordnung in Sekunden).
 * Aufklappbare Ueberpunkte statt 20-Zeilen-Liste (Thomas: keine Feature-Wand),
 * Auto-Modell: das ist die "Serienausstattung".
 *
 * WAS-statt-WIE (Thomas): kein Wort ueber die Technik-Mechanik. Nur Belegbares:
 * keine unhaltbaren Garantien ("ausfallsicher"/"rechtssicher" umformuliert).
 * Domain kommt bewusst NICHT vor. Name durchgaengig "Talos, dein Copilot".
 *
 * Styling: plain globales <style>-Tag statt <style jsx> (LESSONS_LEARNED.md
 * "styled-jsx im Relaunch meiden"). Klassen rpf- sind seiten-lokal eindeutig.
 * Accordion-Mechanik gespiegelt aus PreiseMatrix (rpm__panel grid-rows 0fr->1fr).
 */

type Punkt = { titel: string; detail: string };

const FUNDAMENT: Punkt[] = [
  {
    titel: 'Talos, dein Copilot',
    detail:
      'Bei jeder Website dabei. Texte und Bilder änderst du selbst, jederzeit. Und du siehst an einem Ort, was auf deiner Seite läuft: wie viele Leute kommen, woher, was sie anklicken, wer sich meldet. Im Klartext, ohne Fachchinesisch.',
  },
  {
    titel: 'Gefunden werden, bei Google und KI',
    detail:
      'So gebaut, dass Google und KI-Suchen wie ChatGPT deine Seite sauber verstehen. Das Fundament, damit dich Leute überhaupt finden.',
  },
  {
    titel: 'Individuell gebaut',
    detail:
      'Individuelles Design, auf deinen Betrieb gebaut, kein Baukasten-Template. Perfekt am Handy, weil da deine Kunden suchen.',
  },
  {
    titel: 'Technik und Sicherheit',
    detail:
      'Schnell und stabil gehostet, Backups und Sicherheit laufen im Hintergrund mit. Um Server, Updates und Technik kümmerst du dich nie. Geht etwas nicht, merken wir es meist vor dir.',
  },
  {
    titel: 'Rechtlich sauber',
    detail:
      'Impressum und Datenschutz nach österreichischem Recht, sauber aufgesetzt. Und ein Kontaktformular, das direkt bei dir ankommt.',
  },
  {
    titel: 'Einrichtung und Übertragung dabei',
    detail:
      'Aufsetzen, alles übertragen, Mailadressen verbinden: bei uns Teil des Preises. Anderswo landet genau das oft mit rund 350 Euro extra auf der Rechnung.',
  },
];

export default function PreiseFundament() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="rr-section rpf" data-rr-snap>
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow">In jedem Paket dabei</p>
        <h2 className="rr-statement rpf__h2">
          Das Fundament ist immer dabei<span style={{ color: 'var(--rr-red)' }}>.</span>
        </h2>
        <p className="rr-body-lg rpf__intro">
          Egal welches Paket du wählst, das steckt bei jeder Website von uns drin. Kein
          Zusatzpaket, kein Kleingedrucktes. Der Unterschied zwischen den Stufen kommt danach.
        </p>

        <div className="rpf__list">
          {FUNDAMENT.map((p, i) => {
            const isActive = active === i;
            return (
              <div key={p.titel} className={'rpf__item' + (isActive ? ' is-active' : '')}>
                <button
                  type="button"
                  className="rpf__btn"
                  aria-expanded={isActive}
                  onClick={() => setActive(isActive ? null : i)}
                >
                  <span className="rpf__mark" aria-hidden="true" />
                  <span className="rpf__titel">{p.titel}</span>
                  <span className="rpf__plus" aria-hidden="true">
                    <span className="rpf__plus-h" />
                    <span className="rpf__plus-v" />
                  </span>
                </button>
                <div className="rpf__panel">
                  <div className="rpf__panel-inner">
                    <p className="rpf__detail">{p.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="rr-meta rpf__closer">
          Kein Wartungsvertrag, keine Extra-Rechnung. Drin.
        </p>
      </div>

      <style>{`
        .rpf {
          background: #f4f4f2;
        }
        .rpf__h2 {
          margin: 18px 0 20px;
          max-width: 16em;
          color: var(--rr-navy);
        }
        .rpf__intro {
          color: var(--rr-ink-soft);
          max-width: 58ch;
          margin: 0 0 clamp(28px, 4vw, 44px);
        }
        .rpf__list {
          border-top: 1px solid rgba(28, 40, 55, 0.12);
        }
        .rpf__item {
          border-bottom: 1px solid rgba(28, 40, 55, 0.12);
        }
        .rpf__btn {
          width: 100%;
          background: transparent;
          border: 0;
          cursor: pointer;
          display: grid;
          grid-template-columns: 14px 1fr 18px;
          align-items: center;
          gap: 16px;
          padding: clamp(15px, 1.9vw, 21px) 2px;
          text-align: left;
          transition: padding-left 0.3s var(--rr-ease, ease);
        }
        @media (hover: hover) and (pointer: fine) {
          .rpf__btn:hover {
            padding-left: 10px;
          }
        }
        .rpf__mark {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(28, 40, 55, 0.28);
          transition: background 0.3s var(--rr-ease, ease), transform 0.3s var(--rr-ease, ease);
        }
        .rpf__item.is-active .rpf__mark,
        .rpf__btn:hover .rpf__mark {
          background: var(--rr-red);
          transform: scale(1.3);
        }
        .rpf__titel {
          font-family: var(--rr-font-display);
          font-weight: 600;
          font-size: clamp(1.1rem, 1.9vw, 1.5rem);
          letter-spacing: -0.01em;
          color: var(--rr-navy);
        }
        .rpf__plus {
          position: relative;
          width: 16px;
          height: 16px;
          transition: transform 0.35s var(--rr-ease, ease);
        }
        .rpf__item.is-active .rpf__plus {
          transform: rotate(45deg);
        }
        .rpf__plus-h,
        .rpf__plus-v {
          position: absolute;
          background: var(--rr-navy);
        }
        .rpf__plus-h {
          top: 50%;
          left: 0;
          right: 0;
          height: 1.5px;
          transform: translateY(-50%);
        }
        .rpf__plus-v {
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1.5px;
          transform: translateX(-50%);
        }
        .rpf__panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s var(--rr-ease, ease);
        }
        .rpf__item.is-active .rpf__panel {
          grid-template-rows: 1fr;
        }
        .rpf__panel-inner {
          overflow: hidden;
          min-height: 0;
        }
        .rpf__detail {
          font-family: var(--rr-font-ui);
          font-size: 15.5px;
          line-height: 1.62;
          color: var(--rr-navy);
          max-width: 60ch;
          margin: 0;
          padding: 2px 2px clamp(18px, 2.4vw, 26px) 30px;
          border-left: 2px solid var(--rr-red);
          margin-left: 2px;
          opacity: 0;
          transition: opacity 0.35s var(--rr-ease, ease) 0.05s;
        }
        .rpf__item.is-active .rpf__detail {
          opacity: 1;
        }
        .rpf__closer {
          margin-top: clamp(28px, 4vw, 44px);
          color: var(--rr-ink);
          font-family: var(--rr-font-display);
          font-weight: 600;
          font-size: clamp(1.05rem, 1.8vw, 1.35rem);
        }
        @media (prefers-reduced-motion: reduce) {
          .rpf__btn,
          .rpf__mark,
          .rpf__plus,
          .rpf__panel,
          .rpf__detail {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
