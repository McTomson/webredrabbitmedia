/**
 * Sektion 4 — Foerderung (Thomas 09.08.2026: groesser, flaechiger, aufklappbar,
 * mehr Text, Links zu den offiziellen Foerderstellen im neuen Tab).
 *
 * FRAMING = neutral + nur Verweis (Thomas-Entscheid 09.08.): KMU.DIGITAL laeuft
 * budgetiert in Runden (First-Come-First-Serve) und ist zeitweise ausgeschoepft
 * (verifiziert 09.08.: aktuell kein offener Call). Deshalb bewusst KEINE aktive
 * Betrags-/"jetzt sichern"-Werbung (AT-UWG-Risiko), sondern ehrlich erklaeren +
 * auf den offiziellen Live-Status verlinken. Nur belegte, funktionierende Links:
 * kmudigital.at und aws.at/aws-digitalisierung.
 *
 * Aufklapp-Mechanik = native <details>/<summary> (SSR-lesbar, barrierefrei, kein
 * Client-JS noetig). Styling: plain globales <style>-Tag statt <style jsx>
 * (LESSONS_LEARNED.md "styled-jsx im Relaunch meiden"), Klassen rp-bf- lokal.
 */
export default function BetreuungFoerderung() {
  return (
    <section className="rr-section rp-bf" data-rr-snap>
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow">Förderung</p>
        <h2 className="rr-statement rp-bf__h2">
          Vielleicht zahlt jemand mit<span style={{ color: 'var(--rr-red)' }}>.</span>
        </h2>
        <p className="rr-body-lg rp-bf__intro">
          Für die Digitalisierung von Klein- und Mittelbetrieben gibt es in Österreich
          Förderungen. Ob gerade eine Runde offen ist, ändert sich laufend. Wir sagen dir
          ehrlich, was möglich ist, statt dir etwas zu versprechen, das gerade gar nicht
          beantragbar ist.
        </p>

        <div className="rp-bf__list">
          <details className="rp-bf__item">
            <summary className="rp-bf__sum">
              <span className="rp-bf__sum-t">Was grundsätzlich gefördert wird</span>
              <span className="rp-bf__plus" aria-hidden="true">
                <span className="rp-bf__plus-h" />
                <span className="rp-bf__plus-v" />
              </span>
            </summary>
            <div className="rp-bf__panel">
              <p className="rp-bf__detail">
                KMU.DIGITAL ist die zentrale Förderung des Bundes für die Digitalisierung von
                Klein- und Mittelbetrieben, abgewickelt über die aws. Gefördert werden je nach
                Runde Beratung und Umsetzung von Digitalisierungsprojekten, wozu auch eine neue
                Website gehören kann. Voraussetzung ist ein österreichischer Betrieb mit
                aufrechter Gewerbeberechtigung. Die Umsetzungsförderung greift allerdings erst
                ab einem größeren Projektvolumen und setzt eine vorherige geförderte Beratung
                voraus. Für kleine Website-Projekte ist sie also nicht immer der passende Weg,
                für größere Vorhaben schon.
              </p>
            </div>
          </details>

          <details className="rp-bf__item">
            <summary className="rp-bf__sum">
              <span className="rp-bf__sum-t">Wie es aktuell läuft</span>
              <span className="rp-bf__plus" aria-hidden="true">
                <span className="rp-bf__plus-h" />
                <span className="rp-bf__plus-v" />
              </span>
            </summary>
            <div className="rp-bf__panel">
              <p className="rp-bf__detail">
                Die Fördertöpfe sind budgetiert und laufen nach dem Prinzip: wer zuerst kommt,
                mahlt zuerst. Mal ist eine Runde offen, mal ist das Budget ausgeschöpft und du
                wartest auf die nächste. Den aktuellen Stand siehst du am schnellsten direkt bei
                der offiziellen Stelle. Wir sagen dir, ob du grundsätzlich in Frage kommst, und
                melden uns, wenn wieder eine Runde öffnet.
              </p>
            </div>
          </details>
        </div>

        <div className="rp-bf__links">
          <a
            className="rp-bf__link"
            href="https://www.kmudigital.at"
            target="_blank"
            rel="noopener noreferrer"
          >
            KMU.DIGITAL, Live-Status ansehen<span aria-hidden="true"> →</span>
          </a>
          <a
            className="rp-bf__link"
            href="https://www.aws.at/aws-digitalisierung"
            target="_blank"
            rel="noopener noreferrer"
          >
            aws Digitalisierung<span aria-hidden="true"> →</span>
          </a>
        </div>

        <p className="rr-meta rp-bf__closer">
          Frag uns einfach. Wir schauen gemeinsam, was für dich möglich ist.
        </p>
      </div>

      <style>{`
        .rp-bf {
          background: #f4f4f2;
        }
        .rp-bf__h2 {
          margin: 18px 0 20px;
          max-width: 16em;
          color: var(--rr-navy);
        }
        .rp-bf__intro {
          color: var(--rr-ink-soft);
          max-width: 60ch;
          margin: 0 0 clamp(36px, 5vw, 60px);
        }
        .rp-bf__list {
          border-bottom: 1px solid rgba(28, 40, 55, 0.12);
        }
        .rp-bf__item {
          border-top: 1px solid rgba(28, 40, 55, 0.12);
        }
        .rp-bf__sum {
          list-style: none;
          cursor: pointer;
          display: grid;
          grid-template-columns: 1fr 18px;
          align-items: center;
          gap: 16px;
          padding: clamp(16px, 2.1vw, 24px) 2px;
        }
        .rp-bf__sum::-webkit-details-marker {
          display: none;
        }
        .rp-bf__sum-t {
          font-family: var(--rr-font-display);
          font-weight: 600;
          font-size: clamp(1.1rem, 1.9vw, 1.5rem);
          letter-spacing: -0.01em;
          color: var(--rr-navy);
        }
        .rp-bf__plus {
          position: relative;
          width: 16px;
          height: 16px;
          transition: transform 0.35s var(--rr-ease, ease);
        }
        .rp-bf__item[open] .rp-bf__plus {
          transform: rotate(45deg);
        }
        .rp-bf__plus-h,
        .rp-bf__plus-v {
          position: absolute;
          background: var(--rr-navy);
        }
        .rp-bf__plus-h {
          top: 50%;
          left: 0;
          right: 0;
          height: 1.5px;
          transform: translateY(-50%);
        }
        .rp-bf__plus-v {
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1.5px;
          transform: translateX(-50%);
        }
        .rp-bf__panel {
          overflow: hidden;
        }
        .rp-bf__detail {
          font-family: var(--rr-font-ui);
          font-size: 15.5px;
          line-height: 1.62;
          color: var(--rr-navy);
          max-width: 62ch;
          margin: 0;
          padding: 2px 2px clamp(18px, 2.4vw, 26px) 20px;
          border-left: 2px solid var(--rr-red);
          margin-left: 2px;
        }
        .rp-bf__links {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(18px, 3vw, 36px);
          margin-top: clamp(32px, 4.5vw, 52px);
        }
        .rp-bf__link {
          font-family: var(--rr-font-ui);
          font-weight: 600;
          font-size: 15px;
          color: var(--rr-navy);
          text-decoration: none;
          border-bottom: 1px solid rgba(28, 40, 55, 0.28);
          padding-bottom: 3px;
          transition: color 0.25s var(--rr-ease, ease), border-color 0.25s var(--rr-ease, ease);
        }
        .rp-bf__link:hover {
          color: var(--rr-red);
          border-color: var(--rr-red);
        }
        .rp-bf__closer {
          margin-top: clamp(28px, 4vw, 44px);
          max-width: 60ch;
          color: var(--rr-ink);
          font-family: var(--rr-font-display);
          font-weight: 600;
          font-size: clamp(1.05rem, 1.8vw, 1.35rem);
        }
        @media (prefers-reduced-motion: reduce) {
          .rp-bf__plus,
          .rp-bf__link {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
