/**
 * Abschnitt (neu) — "Selbst mit einem Baukasten vs. mit uns": ehrliche
 * Gegenueberstellung als zwei rr-card-soft--neutral Karten (kein Preis, kein
 * Konkurrent schlechtgemacht). Beantwortet die Frage "warum nicht einfach
 * selbst mit einem Baukasten". Reveal ueber das bestehende rr-stagger-Utility
 * (view-timeline aus styleguide.css) wie WieWirBauen, kein eigenes Bewegungs-
 * system. DU-Anrede, kein "KI"/"AI"-Wort, kein Gedankenstrich.
 */
const SELBST: string[] = [
  "Du suchst dir eine Vorlage, die tausend andere auch nehmen.",
  "Du baust, textest und pflegst alles in deiner Freizeit.",
  "Am Handy verrutscht schnell was, und oft merkst du es nicht.",
  "Um Impressum und Datenschutz musst du dich selbst kümmern.",
  "Der Start geht schnell, die Pflege frisst deine Abende.",
];

const MIT: string[] = [
  "Deine Seite wird von Hand auf deinen Betrieb gebaut.",
  "Texte, Technik und der saubere Auftritt kommen von uns.",
  "Am Handy sitzt jede Zeile, das prüfen wir für dich.",
  "Impressum und Datenschutz machen wir rechtssicher.",
  "Du kümmerst dich um dein Geschäft, nicht um die Seite.",
];

export default function SelbstOderMit() {
  return (
    <section className="rr-section lw-vergleich">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">Selber machen oder machen lassen</p>
        <h2 className="rr-statement lw-vergleich__title">
          Klar kannst du das auch selbst zusammenklicken. Die Frage ist, was
          danach passiert.
        </h2>
        <div className="rr-grid rr-grid-2 rr-stagger lw-vergleich__grid">
          <article className="rr-card-soft rr-card-soft--neutral lw-vergleich__card">
            <p className="rr-card-soft__eyebrow">Der Baukasten</p>
            <p className="rr-card-soft__label lw-vergleich__label">
              Du machst alles selbst
            </p>
            <ul className="lw-vergleich__list">
              {SELBST.map((t) => (
                <li key={t} className="lw-vergleich__item">
                  {t}
                </li>
              ))}
            </ul>
          </article>

          <article className="rr-card-soft rr-card-soft--neutral lw-vergleich__card">
            <p className="rr-card-soft__eyebrow">Mit uns</p>
            <p className="rr-card-soft__label lw-vergleich__label">
              Wir bauen, du arbeitest weiter
            </p>
            <ul className="lw-vergleich__list">
              {MIT.map((t) => (
                <li key={t} className="lw-vergleich__item">
                  {t}
                </li>
              ))}
            </ul>
          </article>
        </div>
        <p className="rr-body lw-vergleich__closing">
          Kein schlechtes Wort über Baukästen, für viele reicht das völlig. Wenn
          deine Seite aber wirklich Anfragen holen soll, bist du bei uns besser
          aufgehoben.
        </p>
      </div>
    </section>
  );
}
