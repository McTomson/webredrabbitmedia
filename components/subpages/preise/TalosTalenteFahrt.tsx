/**
 * Sektion 5 — TALOS-PANEL (brand/PREISE_SEITE_BRIEF.md Abschnitt 5.5).
 *
 * Stand 08.08.2026 (Thomas): Wir bieten aktuell KEINE buchbaren Zusatz-/Modul-
 * Pakete zum Selbst-Zusammenklicken an. Die frueheren buchbaren "Talos-Talente"
 * (Fahrt mit Einzel-Faehigkeiten + Monatspreisen + Rechner-Link) und der
 * Mehrwert-Rechner sind daher entfernt. Was bleibt: das blaue Talos-Panel mit
 * dem 3D-Companion (data-talos-station) und der Positionierung. Zusatzleistungen
 * laufen ueber "auf Anfrage" (kein Selbst-Baukasten, kein Preis-Rechner mehr).
 *
 * Der 3D-Companion (TalosCompanionStage stationsOnly, in page.tsx gemountet)
 * dockt weiterhin an data-talos-station an — Talos bleibt auf /preise sichtbar.
 */

/**
 * Blaues Talos-Panel: volle Navy-Flaeche, Text links, reservierte Figur-
 * Flaeche rechts (Companion-Station).
 */
import Link from 'next/link';

export default function TalosTalenteFahrt() {
  return (
    <section className="rr-section rp-talos">
      <div className="rp-talos-intro">
        <div className="rp-talos-intro__grid">
          <div className="rp-talos-intro__text">
            <p className="wd-eyebrow wd-eyebrow--ondark">Was noch möglich ist</p>
            <h2 className="rr-statement rp-talos-intro__h2">
              Talos übernimmt, was liegen bleibt<span style={{ color: 'var(--rr-red)' }}>.</span>
            </h2>
            <p className="rp-talos-intro__lead">
              Talos, dein Copilot, ist schon in jeder Website dabei. Darüber hinaus bauen wir dir
              auf Wunsch Zusatzfunktionen, die dir echte Arbeit abnehmen, ganz auf deinen Betrieb
              zugeschnitten. Nichts von der Stange, wir programmieren es für dich. Ein paar
              Beispiele, was heute schon geht:
            </p>
            <ul className="rp-talos-intro__ex">
              <li>
                <span className="rp-talos-intro__ex-t">Empfang</span> nimmt Anfragen auf, bucht
                Termine und fasst automatisch nach, wenn ein Anruf verpasst wurde.
              </li>
              <li>
                <span className="rp-talos-intro__ex-t">Chatbot</span> beantwortet Besucherfragen
                rund um die Uhr, mit deinen Firmendaten.
              </li>
              <li>
                <span className="rp-talos-intro__ex-t">Der Schreiber</span> hält dich mit
                Beiträgen bei Google und KI sichtbar.
              </li>
              <li>
                <span className="rp-talos-intro__ex-t">Laufende Optimierung</span> bringt deine
                Seite Monat für Monat weiter nach vorne, als optionales Monatspaket.
              </li>
              <li>
                <span className="rp-talos-intro__ex-t">Dein Problem steht hier nicht?</span> Dann
                bauen wir&apos;s. Wir programmieren und binden an, was dein Betrieb braucht.
              </li>
            </ul>
            <div className="rp-talos-intro__cta">
              <p className="rp-talos-intro__ask">
                Alles davon gibt es auf Anfrage. Was für deinen Betrieb Sinn macht und was es
                kostet, sagen wir dir nach einem kurzen Gespräch, ehrlich und unverbindlich.
              </p>
              <Link
                href="/kontakt"
                data-rr-lead="talos-extras"
                data-rr-lead-service="Talos Zusatzfunktionen (auf Anfrage)"
                className="rr-btn-sweep rr-btn-sweep--red rp-talos-intro__btn"
              >
                Nachfragen
              </Link>
            </div>
            <p className="rp-talos-intro__pos">
              Unser Team hat zusammen 135 Jahre Erfahrung. Dieses Wissen steckt in Talos. Du
              bekommst also nicht nur eine KI, sondern alles, was wir können, und wir sitzen
              dahinter und überwachen Monat für Monat.
            </p>
          </div>

          {/* Figur-Slot = Talos-Companion-Station (Fable, 24.07.): der echte 3D-
              Companion (TalosCompanionStage stationsOnly, in page.tsx gemountet)
              positioniert Talos an dieser Station rechts (anchor .78), gross
              (size l), front-Ebene, winkt beim Ankommen. Das Wortmarken-"Talos"
              darunter bleibt als dezenter Grund, falls 3D nicht laedt (no-webgl/
              mobil). */}
          <div
            className="rp-talos-intro__figure"
            data-talos-figure-slot
            data-talos-station
            data-talos-anchor="0.78"
            data-talos-size="m"
            data-talos-gesture="wave2"
            data-talos-layer="front"
            data-talos-appear="0.4"
            data-talos-mobile="1"
            data-talos-mobile-anchor="0.82"
            data-talos-mobile-size="xs"
            data-talos-mobile-gesture="wave2"
            aria-hidden="true"
          >
            <span className="rp-talos-intro__figure-mark">Talos</span>
          </div>
        </div>
      </div>

      {/* Plain globales style-Tag statt <style jsx> (LESSONS_LEARNED.md
          "styled-jsx im Relaunch meiden"). */}
      <style>{`
        .rp-talos {
          background: var(--rr-navy);
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }
        .rp-talos-intro {
          background: var(--rr-navy);
          color: #fff;
          /* Full-bleed: aus dem rr-section-Seitenpadding ausbrechen, damit die
             Navy-Flaeche bis an beide Kanten traegt. */
          width: 100vw;
          margin-left: calc(50% - 50vw);
        }
        .rp-talos-intro__grid {
          max-width: 1320px;
          margin: 0 auto;
          padding: clamp(72px, 12vh, 140px) var(--rr-gutter, clamp(20px, 4.6vw, 72px));
          min-height: 88vh;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
          align-items: center;
          gap: clamp(32px, 6vw, 88px);
        }
        .rp-talos-intro__text {
          max-width: 60ch;
        }
        .rp-talos-intro__h2 {
          margin: 18px 0 22px;
          color: #fff;
        }
        .rp-talos-intro__lead {
          font-family: var(--rr-font-ui);
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.82);
          max-width: 52ch;
          margin: 0 0 26px;
        }
        .rp-talos-intro__ex {
          list-style: none;
          margin: 0 0 clamp(30px, 4vw, 44px);
          padding: 0;
          max-width: 54ch;
          display: flex;
          flex-direction: column;
          gap: clamp(16px, 2vw, 20px);
        }
        .rp-talos-intro__ex li {
          font-family: var(--rr-font-ui);
          font-size: clamp(0.95rem, 1.15vw, 1.05rem);
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.82);
          padding-left: 18px;
          position: relative;
        }
        .rp-talos-intro__ex li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.62em;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--rr-red);
        }
        .rp-talos-intro__ex-t {
          color: #fff;
          font-weight: 700;
        }
        .rp-talos-intro__cta {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: clamp(16px, 2vw, 22px);
          margin: 0 0 clamp(30px, 4vw, 44px);
          max-width: 52ch;
        }
        .rp-talos-intro__ask {
          font-family: var(--rr-font-ui);
          font-size: clamp(0.95rem, 1.15vw, 1.05rem);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.82);
          margin: 0;
        }
        .rp-talos-intro__btn {
          align-self: flex-start;
        }
        .rp-talos-intro__pos {
          font-family: var(--rr-font-ui);
          font-size: clamp(0.95rem, 1.15vw, 1.05rem);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.62);
          max-width: 54ch;
          margin: 0;
          padding-top: 22px;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
        }
        .rp-talos-intro__figure {
          position: relative;
          align-self: stretch;
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: radial-gradient(
            120% 100% at 70% 30%,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0) 60%
          );
        }
        .rp-talos-intro__figure-mark {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: min(22vh, 15vw);
          line-height: 0.9;
          color: rgba(255, 255, 255, 0.06);
          user-select: none;
          pointer-events: none;
        }
        @media (max-width: 900px) {
          .rp-talos-intro__grid {
            grid-template-columns: 1fr;
            min-height: 0;
            padding: clamp(56px, 9vh, 96px) var(--rr-gutter, clamp(20px, 4.6vw, 72px));
          }
          /* Mobil: Station bleibt IN FLOW (Thomas 10.08.: Talos soll auch am Handy
             kommen, klein, rechts unten). Die Engine braucht ein echtes Rect fuers
             Scoring (TalosCompanionStage.getBoundingClientRect) -> NICHT display:none.
             Kleine reservierte Flaeche am Panel-Ende, in der der Companion (xs,
             mAnchor 0.82) rechts unten erscheint; das Riesen-Wort faellt weg. */
          .rp-talos-intro__figure {
            min-height: clamp(200px, 44vh, 360px);
            margin-top: clamp(8px, 3vw, 20px);
            background: none;
            border-radius: 0;
          }
          .rp-talos-intro__figure-mark {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
