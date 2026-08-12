'use client';

import Link from 'next/link';
import { useState } from 'react';

const KONTAKT = '/kontakt';

/**
 * TalosTest — "Wie viel weisst du ueber deine eigene Website?" (Thomas
 * 07.08.): drei Ja/Nein-Fragen, Ergebnis ist keine Note, sondern zeigt die
 * blinden Flecken ("das siehst du heute nicht, das wuerdest du mit Talos
 * sehen") + CTA ins Lead-Popup. Mechanik = bewusst einfachste Fassung des
 * Diagnose-Quiz-Musters (website/v2/Diagnose.tsx): lineare Fragen, Buttons,
 * Ergebnis, "Nochmal von vorn" (Label 1:1 aus Diagnose). Kein Modal, kein
 * Sticky. Styles .tl-qz-* in talos-v2.css.
 */
const FRAGEN = [
  'Weißt du, wie viele Leute gestern auf deiner Seite waren?',
  'Würdest du es merken, wenn deine Seite heute Nacht ausfällt?',
  'Kannst du selbst einen Text auf deiner Seite ändern, ohne jemanden zu fragen?',
];

/** Ergebnis-Saetze nach Zahl der Nein-Antworten (0..3). */
const ERGEBNIS: Record<number, string> = {
  0: 'Stark, du hast mehr im Griff als die meisten. Mit Talos hättest du alles an einem Ort, ohne selbst nachschauen zu müssen.',
  1: 'An einer Stelle ist deine Seite blind. Genau dort würde Talos für dich hinschauen, jeden Tag.',
  2: 'An zwei von drei Stellen ist deine Seite blind. Du zahlst für eine Website und weißt nicht, was sie tut. Genau dafür ist Talos gebaut.',
  3: 'Deine Seite ist eine verschlossene Kiste. Du bist damit nicht allein, so geht es fast jedem Betrieb. Genau dafür ist Talos gebaut.',
};

export default function TalosTest() {
  const [step, setStep] = useState(0);
  const [neins, setNeins] = useState(0);
  const done = step >= FRAGEN.length;

  const answer = (ja: boolean) => {
    if (!ja) setNeins((n) => n + 1);
    setStep((s) => s + 1);
  };

  const restart = () => {
    setStep(0);
    setNeins(0);
  };

  return (
    // KEIN data-rr-snap: lebt in der TalosPanorama-Buehne (Dwell-System regiert).
    <section className="rr-section tl-section tl-section--surface">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Mach den Test</p>
        <h2 className="rr-statement tl-title">
          Wie viel weißt du über deine eigene Website?
        </h2>
        <p className="rr-body-lg tl-lead">
          Drei kurze Fragen, ehrlich beantwortet. Danach weißt du, wo deine
          Seite blind ist und was Talos dort sehen würde.
        </p>

        <div className="tl-qz__box" aria-live="polite">
          {!done ? (
            <>
              <p className="tl-qz__count">
                Frage {step + 1} von {FRAGEN.length}
              </p>
              <p className="tl-qz__frage">{FRAGEN[step]}</p>
              <div className="tl-qz__actions">
                <button
                  type="button"
                  className="rr-btn-outline tl-qz__btn"
                  onClick={() => answer(true)}
                >
                  Ja
                </button>
                <button
                  type="button"
                  className="rr-btn-outline tl-qz__btn"
                  onClick={() => answer(false)}
                >
                  Nein
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="tl-qz__count">Dein Ergebnis</p>
              <p className="tl-qz__frage">{ERGEBNIS[neins]}</p>
              <div className="tl-qz__actions">
                <Link
                  href={KONTAKT}
                  data-rr-lead="talos"
                  className="rr-btn-sweep rr-btn-sweep--red"
                >
                  Reden wir über deine Website
                </Link>
                <button
                  type="button"
                  className="rr-btn-outline tl-qz__btn"
                  onClick={restart}
                >
                  Nochmal von vorn
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
