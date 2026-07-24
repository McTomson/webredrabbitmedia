/**
 * Faehigkeiten — Intro + Karten-Grid aus docs/specs/
 * TALOS_COPY_V2_2026-07-22_ENTWURF.md, Sektion 4. 6 Karten (5 buchbare
 * Faehigkeiten + Die Sonderanfertigung als Massarbeit-Empfehlung), pro Karte
 * 4 Mikro-Label-Bloecke (NUTZEN / FÜR WEN / SO LÄUFT ES / WARUM GUT) plus
 * Talos-Sprechzeile. Die 6. Karte (Die Sonderanfertigung) navy-invers
 * abgesetzt. Fusszeile traegt die einzig erlaubte Preis-Logik (Sektion 4.7)
 * OHNE Zahlen. Kein Link auf /relaunch-preview/preise: die Route existiert
 * noch nicht (geprueft 22.07.), sobald sie da ist, kann hier verlinkt werden.
 */
import { FAEHIGKEITEN } from './faehigkeiten-data';

export default function Faehigkeiten() {
  return (
    <section className="rr-section tl-section">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Wenn du mehr willst</p>
        <h2 className="rr-statement tl-title">
          Und wenn dir das noch nicht reicht, gib Talos einfach mehr Arbeit.
        </h2>
        <p className="rr-body-lg tl-lead">
          Über die Grundausstattung hinaus kannst du Talos einzelne Aufgaben
          übergeben. Jede wie ein eigener Kollege, den du dazuholst. Nimm, was
          dein Betrieb gerade braucht, und lass den Rest weg. Der Katalog
          wächst laufend.
        </p>
        <p className="tl-says">
          Such dir aus, was dir Arbeit abnimmt. Alles andere ignorierst du
          einfach.
        </p>

        <div className="tl-cards tl-cards--faehigkeiten">
          {FAEHIGKEITEN.map((f) => (
            <div className={`tl-card tl-card--faehigkeit${f.invers ? ' tl-card--invers' : ''}`} key={f.name}>
              <h3 className="tl-card__name">{f.name}</h3>

              <div className="tl-card__block">
                <p className="tl-card__label">Nutzen</p>
                <p className="tl-card__text">{f.nutzen}</p>
              </div>
              <div className="tl-card__block">
                <p className="tl-card__label">Für wen</p>
                <p className="tl-card__text">{f.fuerWen}</p>
              </div>
              <div className="tl-card__block">
                <p className="tl-card__label">So läuft es</p>
                <p className="tl-card__text">{f.ablauf}</p>
              </div>
              <div className="tl-card__block">
                <p className="tl-card__label">Warum gut</p>
                <p className="tl-card__text">{f.warum}</p>
              </div>

              <p className="tl-says tl-says--card">{f.says}</p>
            </div>
          ))}
        </div>

        <p className="tl-footnote">
          Jede Fähigkeit buchst du einzeln, Monat für Monat. Du kannst
          jederzeit dazunehmen, was du brauchst, und jederzeit kündigen, was
          du nicht mehr brauchst. Keine Mindestlaufzeit, keine Vertragsfalle.
          Was das im Einzelnen kostet, steht offen auf der Preisseite.
          Maßarbeit richtet sich nach der Komplexität, das besprechen wir
          vorher.
        </p>
      </div>
    </section>
  );
}
