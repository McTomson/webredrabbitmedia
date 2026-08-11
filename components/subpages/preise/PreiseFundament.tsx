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
      'Bei jeder Website dabei, vom ersten Tag an. Texte und Bilder tauschst du selbst, in Minuten, ohne uns anzurufen und ohne Technikwissen. Und du siehst an einem Ort, was auf deiner Seite wirklich passiert: wie viele Leute kommen, woher, was sie anklicken, wer sich meldet. Im Klartext, ohne Fachchinesisch. Die meisten Betriebe raten, was ihre Website tut. Du weißt es.',
  },
  {
    titel: 'Individuelles Design, kein Template',
    detail:
      'Wir bauen deine Seite von Grund auf, auf deinen Betrieb zugeschnitten. Kein gekaufter Baukasten, kein Theme, das tausend andere auch haben. Farben, Aufbau, Bildsprache, alles passt zu dir und hebt dich von der Konkurrenz ab, statt dich in der Masse verschwinden zu lassen.',
  },
  {
    titel: 'Perfekt am Handy',
    detail:
      'Über die Hälfte deiner Besucher kommt vom Smartphone, oft die kaufbereitere Hälfte. Deshalb bauen wir jede Seite zuerst fürs Handy und dann für den großen Bildschirm. Nichts verrutscht, nichts ist zu klein, nichts musst du wegzoomen. Auf jedem Gerät, vom alten Android bis zum neuen iPhone.',
  },
  {
    titel: 'Tempo, das bleibt',
    detail:
      'Eine langsame Seite verliert Kunden, bevor sie überhaupt gesehen haben, was du kannst. Wir bauen schlank, optimieren Bilder und Code, damit deine Seite in Sekunden steht statt in gefühlten Minuten. Das merkt der Besucher, und Google merkt es auch.',
  },
  {
    titel: 'Gefunden werden, bei Google und KI',
    detail:
      'So gebaut, dass Google und die neuen KI-Suchen wie ChatGPT deine Seite sauber lesen und verstehen: saubere Struktur, richtige Überschriften, alles was heute zählt. Das ist das Fundament, damit dich Leute überhaupt finden. Platz eins verspricht dir seriös niemand, die Grundlagen dafür liefern wir.',
  },
  {
    titel: 'Technik, Hosting und Sicherheit',
    detail:
      'Schnelles, stabiles Hosting, automatische Backups, Sicherheitsupdates, SSL-Verschlüsselung, alles läuft im Hintergrund mit. Um Server, Updates und den ganzen technischen Kram kümmerst du dich nie. Geht doch mal etwas nicht, merken wir es meist, bevor du es tust.',
  },
  {
    titel: 'Rechtlich sauber, nach AT-Recht',
    detail:
      'Impressum und Datenschutzerklärung setzen wir nach österreichischem Recht auf, sauber und vollständig, Cookie-Hinweis wo er nötig ist. Damit du nicht wegen einer fehlenden Pflichtangabe eine Abmahnung riskierst, während du eigentlich nur deine Arbeit machen willst.',
  },
  {
    titel: 'Kontaktwege, die ankommen',
    detail:
      'Ein Kontaktformular, das direkt in deinem Postfach landet, nicht in irgendeinem Nirwana. Anruf-Button fürs Handy, Route zu deinem Betrieb, Öffnungszeiten, alles was ein Interessent braucht, um bei dir zu landen. Denn die schönste Website nützt nichts, wenn niemand den Weg zu dir findet.',
  },
  {
    titel: 'Einrichtung und Übertragung inklusive',
    detail:
      'Aufsetzen, alles einrichten, deine bestehenden Inhalte übertragen, Mailadressen verbinden, live schalten, das machen wir. Bei vielen anderen steht genau dieser Teil am Ende mit ein paar hundert Euro extra auf der Rechnung. Bei uns ist er Teil des Preises. Punkt.',
  },
];

export default function PreiseFundament() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="rr-section rpf" data-rr-snap>
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow">In jedem Paket dabei</p>
        <h2 className="rr-statement rpf__h2">
          Was andere extra berechnen, ist bei uns Standard<span style={{ color: 'var(--rr-red)' }}>.</span>
        </h2>
        <p className="rr-body-lg rpf__intro">
          Egal welches Paket du wählst, das steckt bei jeder Website von uns drin. Vieles davon
          verkaufen andere als teures Extra oder lassen es gleich ganz weg. Bei uns ist es der
          Standard, unter den wir nicht gehen. Der Unterschied zwischen den Stufen kommt erst
          danach. Klick dich durch, dann siehst du, was wir wirklich machen.
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
          Kein Wartungsvertrag, kein Kleingedrucktes, keine Extra-Rechnung. Das alles ist in
          jedem Paket drin.
        </p>
      </div>

      <style>{`
        .rpf {
          background: #f4f4f2;
        }
        .rpf__h2 {
          margin: clamp(24px, 2.6vw, 34px) 0 clamp(30px, 3.6vw, 42px);
          max-width: 16em;
          color: var(--rr-navy);
        }
        .rpf__intro {
          color: var(--rr-ink-soft);
          max-width: 60ch;
          margin: 0 0 clamp(44px, 6vw, 76px);
        }
        .rpf__list {
          /* Keine Linie oben (Thomas 09.08.): der Block soll luftig starten,
             nicht mit einer harten Trennlinie unter dem Intro. */
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
