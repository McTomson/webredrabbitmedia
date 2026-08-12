'use client';

import Link from 'next/link';
import Faq, { type FaqItem } from '@/components/relaunch/Faq';

/**
 * Sektion 6 — Preis-FAQ (brand/PREISE_SEITE_BRIEF.md Abschnitt 5.6/9),
 * SSR-lesbar ueber components/relaunch/Faq.tsx (liefert FAQPage-JSON-LD
 * automatisch mit).
 *
 * QA-Fix (Design-Lead-Addendum): die 6 allgemeinen Fragen 1:1 im Wortlaut
 * der Website-FAQ (components/subpages/leistungen/website/WebsiteFaq.tsx)
 * ergaenzt, in deren Reihenfolge — vorher standen nur die 4 preis-
 * spezifischen Fragen da. Die bisherigen 4 preis-spezifischen Fragen
 * bleiben zusaetzlich, ans Ende gestellt (Auftrag: "duerfen zusaetzlich
 * bleiben"). EINE woertliche Abweichung: die erste Antwort verwies im
 * Original auf "die Preisseite" — da diese Antwort HIER auf der Preisseite
 * selbst steht, wurde nur dieser eine Verweis auf "weiter oben auf dieser
 * Seite" umformuliert (sonst waere der Satz zirkulaer/falsch), der Rest
 * ist unveraendert.
 */
const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Was kostet es, eine professionelle Website erstellen zu lassen?',
    a: 'Bei uns startet der One-Pager (Starter) ab 1.250 Euro, die mehrseitige Business-Website ab 2.850 Euro und die große Premium-Ausbaustufe ab 4.900 Euro. Immer als Fixpreis-Rahmen, nicht als Stundensatz, bei dem am Ende eine böse Überraschung steht. Was am Ende genau dein Preis ist, hängt vom Umfang ab, den du brauchst. Die drei Pakete mit allem, was drinsteckt, stehen weiter oben auf dieser Seite. Und die 1-2 grafischen Vorschläge bekommst du sowieso, bevor du dich festlegst.',
  },
  {
    q: 'Wie lange dauert das Ganze?',
    a: 'Die ersten 1-2 Vorschläge siehst du schnell, meist in ein paar Tagen. Danach feilen wir so lange, bis es passt. Ohne endlose Meetings, den großen Teil der Arbeit machen wir, nicht du.',
  },
  {
    q: 'Gehört mir die Website am Ende wirklich?',
    a: 'Ja, ganz. Sobald die Seite live ist, gehört sie dir, mit Texten, Bildern und allem, was drinsteckt. Wir sitzen nicht auf deinem Zugang und halten dich nicht fest. Willst du irgendwann zu jemand anderem, nimmst du deine Seite einfach mit.',
  },
  {
    q: 'Kann ich Texte und Bilder selbst ändern?',
    a: 'Ja. Über Talos, deinen Copilot, tauschst du Texte und Bilder mit ein paar Klicks selbst, ganz ohne Technikwissen. Talos ist bei jeder Website dabei. Und wenn du lieber willst, dass wir das übernehmen, sagst du kurz Bescheid und wir ziehen es für dich nach.',
  },
  {
    q: 'Ist die Seite rechtlich sauber, also Impressum und Datenschutz?',
    a: 'Ja. Impressum und Datenschutzerklärung setzen wir nach österreichischem Recht auf, und die Seite ist so gebaut, dass sie die üblichen Vorgaben erfüllt. Du stehst also nicht mit einem Bein im Risiko, nur weil dir eine Pflichtangabe gefehlt hat.',
  },
  {
    q: 'Warum zeigt ihr mir die Vorschläge ohne Vorkasse, wollt dann aber eine Anzahlung?',
    a: 'Weil wir das Risiko tragen, bis du überzeugt bist. Du bekommst zuerst 1-2 grafische Vorschläge zu sehen, wohin dein Auftritt gehen kann, ohne Vorkasse. Gefällt dir die Richtung nicht, hat es dich nichts gekostet. Sagst du Ja und erteilst den Auftrag, bekommst du ein konkretes Angebot und leistest 40 % Anzahlung, den Rest nach Fertigstellung. Das ist ehrlicher, als dir vorher das ganze Geld abzunehmen und zu hoffen, dass es passt.',
  },
  {
    q: 'Sind das Fixpreise oder kommt noch etwas dazu?',
    a: 'Die Preise sind Startpreise und geben dir einen klaren Rahmen. Je nach Anforderung kann sich der Umfang verschieben; das genaue Angebot bekommst du bei der Auftragserteilung. Zusatzleistungen gibt es auf Anfrage. Keine Stundensatz-Lotterie, keine versteckten Kosten.',
  },
  {
    q: "Was bedeutet das 'ab' bei den Preisen?",
    a: 'Alle Preise sind Startpreise. Der genaue Preis hängt vom Umfang ab. Bei besonderen Anforderungen oder Extras kann er sich verschieben. Nach einem kurzen Gespräch nennen wir dir die Zahl, und dein verbindliches Angebot bekommst du bei der Auftragserteilung.',
  },
  {
    q: 'Gibt es eine Förderung?',
    a: 'Für österreichische Kleinbetriebe kann die KMU.DIGITAL-Förderung einen Teil der Kosten übernehmen. Wir sagen dir, ob das für dich in Frage kommt.',
  },
];

export default function PreiseFaq() {
  return (
    <section className="rr-section rp-faq" data-rr-snap>
      <div className="rr-wrap rr-narrow rp-faq__grid">
        <div className="rp-faq__label">
          <p className="wd-eyebrow">Häufige Fragen</p>
          <h2 className="rr-statement rp-faq__heading">
            Preis und Ablauf<span className="rp-faq__dot">.</span>
          </h2>
        </div>
        <div className="rp-faq__accordion">
          <Faq items={FAQ_ITEMS} id="faq-preise" />
          {/* Querverlinkung zum Kosten-Ratgeber (Thomas 11.08.): der Artikel
              verlinkt schon auf /preise, die Rueckrichtung fehlte. Dezenter
              Textlink statt eigener Absatz in der Faq-Antwort, da die
              geteilte Faq-Komponente (components/relaunch/Faq.tsx) reinen
              Text erwartet (JSON-LD acceptedAnswer.text) und in 5 weiteren
              Seiten wiederverwendet wird, hier lokal ergaenzt, um sie nicht
              anzufassen. */}
          <p className="rp-faq__link">
            Mehr dazu im Ratgeber:{' '}
            <Link href="/tipps/welche-versteckten-kosten-gibt-es-bei-der-website-erstellung">
              Welche versteckten Kosten gibt es bei der Website-Erstellung?
            </Link>
          </p>
        </div>
      </div>

      {/* Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md
          "styled-jsx im Relaunch meiden"). */}
      <style>{`
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
        .rp-faq__link {
          margin: clamp(20px, 3vw, 32px) 0 0;
          color: var(--rr-ink-soft);
          font-family: var(--rr-font-ui);
          font-size: 15px;
        }
        .rp-faq__link a {
          color: var(--rr-ink-soft);
          text-decoration: none;
          border-bottom: 1px solid rgba(28, 40, 55, 0.28);
          padding-bottom: 2px;
          transition: color 0.25s var(--rr-ease, ease), border-color 0.25s var(--rr-ease, ease);
        }
        .rp-faq__link a:hover {
          color: var(--rr-navy);
          border-color: var(--rr-navy);
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
