'use client';

import Faq, { type FaqItem } from '@/components/relaunch/Faq';

/**
 * Sektion 6 — Preis-FAQ (brand/PREISE_SEITE_BRIEF.md Abschnitt 5.6/9), Copy
 * 1:1 aus der alten Live-Seite (app/preise/page.tsx), SSR-lesbar ueber
 * components/relaunch/Faq.tsx (liefert FAQPage-JSON-LD automatisch mit).
 */
const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Warum seht ihr den Entwurf ohne Vorkasse?',
    a: 'Weil wir das Risiko tragen wollen, nicht du. Du siehst zuerst einen echten Vorschlag. Eine Anzahlung fällt erst an, wenn dir das Ergebnis gefällt und du den Auftrag erteilst.',
  },
  {
    q: 'Sind das Fixpreise oder kommt noch etwas dazu?',
    a: 'Die Pakete geben dir einen klaren Rahmen. Was genau du brauchst, besprechen wir vorher und halten es fest. Keine Stundensatz-Lotterie, keine versteckten Kosten.',
  },
  {
    q: "Was bedeutet 'ab 4.900' beim Premium-Paket?",
    a: 'Premium ist maßgeschneidert. Der Preis hängt vom Umfang ab. 4.900 Euro ist der Einstieg, den genauen Preis nennen wir dir nach einem kurzen Gespräch.',
  },
  {
    q: 'Gibt es eine Förderung?',
    a: 'Für österreichische Kleinbetriebe kann die KMU.DIGITAL-Förderung einen Teil der Kosten übernehmen. Wir sagen dir, ob das für dich in Frage kommt.',
  },
];

export default function PreiseFaq() {
  return (
    <section className="rr-section rp-faq">
      <div className="rr-wrap rr-narrow rp-faq__grid">
        <div className="rp-faq__label">
          <p className="wd-eyebrow">Häufige Fragen</p>
          <h2 className="rr-statement rp-faq__heading">
            Preis und Ablauf<span className="rp-faq__dot">.</span>
          </h2>
        </div>
        <div className="rp-faq__accordion">
          <Faq items={FAQ_ITEMS} id="faq-preise" />
        </div>
      </div>

      <style jsx>{`
        .rp-faq {
          background: #ffffff;
        }
        .rp-faq__grid {
          display: grid;
          grid-template-columns: minmax(260px, 0.82fr) 1.18fr;
          gap: clamp(2.5rem, 6vw, 6.5rem);
          align-items: start;
        }
        .rp-faq__label {
          position: sticky;
          top: 14vh;
        }
        .rp-faq__heading {
          margin: 14px 0 0;
          color: var(--rr-ink);
        }
        .rp-faq__dot {
          color: var(--rr-red);
        }
        @media (max-width: 860px) {
          .rp-faq__grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .rp-faq__label {
            position: static;
          }
        }
      `}</style>
    </section>
  );
}
