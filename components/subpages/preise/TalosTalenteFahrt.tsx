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
export default function TalosTalenteFahrt() {
  return (
    <section className="rr-section rp-talos">
      <div className="rp-talos-intro">
        <div className="rp-talos-intro__grid">
          <div className="rp-talos-intro__text">
            <p className="wd-eyebrow wd-eyebrow--ondark">Wenn du mehr willst</p>
            <h2 className="rr-statement rp-talos-intro__h2">
              Talos übernimmt, was liegen bleibt<span style={{ color: 'var(--rr-red)' }}>.</span>
            </h2>
            <p className="rp-talos-intro__lead">
              Über die Website hinaus kann Talos weitere Aufgaben für deinen Betrieb übernehmen.
              Was genau dazukommt, stimmen wir bei Bedarf gemeinsam ab — solche Zusatzleistungen
              gibt es auf Anfrage.
            </p>
            {/* Ehrlichkeit zum Produktstand (Thomas 30.07.): zum Start ist das
                Cockpit dabei, Talos und die KI-Agenten folgen. */}
            <p className="rp-talos-intro__soon">
              Dein Cockpit ist ab dem ersten Tag dabei, die Talos-Talente schalten wir
              Schritt für Schritt frei.
            </p>
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
            data-talos-size="l"
            data-talos-gesture="wave"
            data-talos-layer="front"
            data-talos-appear="0.4"
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
        .rp-talos-intro__soon {
          font-family: var(--rr-font-ui);
          font-size: clamp(0.9rem, 1.1vw, 1rem);
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.82);
          max-width: 52ch;
          margin: 0 0 26px;
        }
        .rp-talos-intro__soon::before {
          content: "Bald verfügbar";
          display: inline-block;
          border: 1px solid var(--rr-red);
          color: #fff;
          background: var(--rr-red);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 9px;
          margin-right: 10px;
          vertical-align: middle;
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
          /* Figur-Flaeche mobil ausgeblendet (der echte Companion kommt
             ohnehin nur auf breiten Viewports zum Tragen). */
          .rp-talos-intro__figure {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
