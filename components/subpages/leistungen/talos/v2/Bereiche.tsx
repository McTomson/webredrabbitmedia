import Link from 'next/link';
import { BEREICHE, type Bereich } from './bereiche-data';

const KONTAKT = '/relaunch-preview/kontakt';
const PREISE = '/relaunch-preview/preise';

/** Gruppen-Reihenfolge + Labels (Thomas 07.08.: 3 Gruppen statt 9er-Wand;
    Label = Kundenfrage in Alltagssprache). */
const GRUPPEN: Array<{ key: Bereich['gruppe']; label: string }> = [
  { key: 'machen', label: 'Selbst machen' },
  { key: 'wissen', label: 'Wissen, was los ist' },
  { key: 'gefunden', label: 'Gefunden werden und dein Ruf' },
];

/**
 * Bereiche — das neue Herzstueck der Talos-Seite (Thomas 07.08., Pivot zur
 * Kommandozentrale): die 9 Bereiche als statisches Karten-Raster. BEWUSST
 * ohne Modal/Akkordeon (anders als Faehigkeiten): der Besucher, der noch
 * nicht weiss, was Talos ist, soll ALLES ohne Klick lesen koennen — jede
 * Karte traegt Hook-Headline, Klartext, Wert-Zeile und Talos-Ich-Zeile.
 *
 * Optik = Fugen-Raster wie tlfg-grid (1px-Hairlines auf #e4e4e0, weisse
 * Zellen, radius 0), Karteninhalt aus den bestehenden Bausteinen tl-card__label
 * (rote Label-Zeile) und tl-says--card (Sprechzeile). Kein neuer Bausteintyp,
 * Styles .tl-br-* in talos-v2.css (Ownership-Datei dieser Sektionen).
 *
 * Server Component, null JS. Daten aus ./bereiche-data (Seam-Muster wie
 * faehigkeiten-data). CTA-Zeile darunter: Lead-Popup (data-rr-lead="talos",
 * LeadProvider haengt im Root-Layout) + Preisseiten-Link als Zweitweg.
 */
export default function Bereiche() {
  return (
    <section className="rr-section tl-section tl-section--surface" data-rr-snap>
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Deine Kommandozentrale</p>
        <h2 className="rr-statement tl-title">
          Neun Bereiche. Jeder beantwortet eine Frage, die du dir längst
          stellst.
        </h2>
        <p className="rr-body-lg tl-lead">
          Du schaust rein, du änderst selbst, und keiner davon kostet extra.
          Sie gehören zu deiner Website dazu und halten sich von allein
          aktuell.
        </p>

        {GRUPPEN.map((g) => {
          const karten = BEREICHE.filter((b) => b.gruppe === g.key);
          return (
            <div key={g.key} className="tl-br__gruppe">
              <p className="tl-br__grouphd">{g.label}</p>
              {/* 2 pro Reihe ausser bei glatten 3ern (Thomas 07.08.: die
                  4er-Gruppe "Wissen" als 2x2 statt 3+1 mit Leerflaeche). */}
              <div
                className={`tl-br__grid${karten.length % 3 !== 0 ? ' tl-br__grid--2' : ''}`}
              >
                {karten.map((b) => (
                  <article
                    key={b.name}
                    className={`tl-br__card${b.badge === 'hot' ? ' tl-br__card--hot' : ''}`}
                  >
                    {/* Bewusst "fast keiner" statt "keiner": woertliche
                        Alleinstellung waere UWG-angreifbar (Security-Review
                        07.08., solche Pruef-Werkzeuge existieren am Markt). */}
                    {b.badge === 'hot' && (
                      <span className="tl-br__badge tl-br__badge--hot">
                        Das hat sonst fast keiner
                      </span>
                    )}
                    {b.badge === 'soon' && (
                      <span className="tl-br__badge">Kommt bald</span>
                    )}
                    <p className="tl-card__label">{b.name}</p>
                    <h3 className="tl-br__head">{b.head}</h3>
                    <p className="tl-br__why">{b.why}</p>
                    <p className="tl-br__edge">
                      <strong>{b.edgeLead}</strong> {b.edge}
                    </p>
                    <p className="tl-says tl-says--card">{b.says}</p>
                  </article>
                ))}
              </div>
            </div>
          );
        })}

        <div className="tl-br__cta">
          <Link
            href={KONTAKT}
            data-rr-lead="talos"
            className="rr-btn-sweep rr-btn-sweep--red"
          >
            Das will ich für meinen Betrieb
          </Link>
          <Link href={PREISE} className="rr-btn-outline">
            Erst schauen, was es kostet
          </Link>
        </div>
      </div>
    </section>
  );
}
