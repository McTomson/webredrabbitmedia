import Link from 'next/link';

const KONTAKT = '/kontakt';

/**
 * WertAnker — "Rechnen wir kurz" (Thomas 07.08.): beziffert, was die Bereiche
 * der Kommandozentrale kosten wuerden, wenn man sie sich einzeln zusammenkauft
 * (Einzel-Abos + Agentur-Stunden). Anker-Aufloesung am Ende: bei uns gehoert
 * es zur Website dazu. Navy-Sektion (bewusste Wechsel-Flaeche im Rhythmus),
 * Muster tl-cta/tl-bumper, Styles .tl-wa-* in talos-v2.css.
 *
 * ZAHLEN-REGEL (nie raten): gerundete Marktpreise, am 07.08.2026 gegen
 * aktuelle Anbieter-Preise geprueft (Klick-Karten ab ~32 EUR/Monat bei
 * gaengigen Anbietern, Suchbegriff-Werkzeuge ~130 EUR/Monat, Erreichbarkeits-
 * Wächter ab ~15 EUR/Monat). Bewusst mit "rund"/"ab" formuliert, keine
 * exakten Fremdpreise behauptet. Aenderung nur mit neuem Beleg.
 */
const POSTEN: Array<{ what: string; sub?: string; price: string }> = [
  {
    what: 'Besucher-Auswertung, sauber eingerichtet',
    sub: 'einmalige Einrichtung durch eine Agentur',
    price: 'ab 300 € einmalig',
  },
  {
    what: 'Klick-Karten und Verhaltens-Auswertung',
    sub: 'gängige Anbieter, kleinstes brauchbares Paket',
    price: 'rund 40 € im Monat',
  },
  {
    what: 'Suchbegriff- und Platzierungs-Überwachung',
    sub: 'übliche Profi-Werkzeuge',
    price: 'rund 130 € im Monat',
  },
  {
    what: 'Erreichbarkeits-Wächter mit Alarm',
    price: 'ab 15 € im Monat',
  },
  {
    what: 'Bewertungs-Überwachung',
    price: 'rund 30 € im Monat',
  },
  {
    what: 'Text- und Bild-Änderungen durch die Agentur',
    sub: 'übliche Stundensätze, schon bei wenigen Änderungen im Jahr',
    price: '100 bis 150 € je Stunde',
  },
];

export default function WertAnker() {
  return (
    <section className="rr-section tl-section tl-wa" data-rr-snap>
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow wd-eyebrow--ondark">Rechnen wir kurz</p>
        <h2 className="rr-statement tl-title tl-wa__title">
          Was das kostet, wenn du es dir einzeln zusammenkaufst.
        </h2>
        <p className="rr-body-lg tl-lead tl-wa__lead">
          Alles, was in deiner Kommandozentrale steckt, gibt es auch einzeln zu
          kaufen. So sieht die Rechnung dann aus:
        </p>

        <div className="tl-wa__table">
          {POSTEN.map((p) => (
            <div key={p.what} className="tl-wa__row">
              <span className="tl-wa__what">
                {p.what}
                {p.sub && <span className="tl-wa__sub">{p.sub}</span>}
              </span>
              <span className="tl-wa__price">{p.price}</span>
            </div>
          ))}
          <div className="tl-wa__row tl-wa__row--sum">
            <span className="tl-wa__what">Macht im Jahr, ohne die Stunden</span>
            <span className="tl-wa__price">über 2.000 €</span>
          </div>
        </div>

        <p className="tl-wa__punch">
          Bei uns ist das keine Rechnung. Es gehört zu deiner Website dazu.
        </p>

        {/* Die Frage, die sich an dieser Stelle JEDER stellt (Thomas 07.08.:
            "wuerden Leute nicht fragen wo ist der Haken?") — direkt und
            ehrlich beantwortet, Muster = tl-klaerung aus FreigabePrinzip. */}
        <div className="tl-klaerung tl-klaerung--dark">
          <p className="tl-klaerung__frage">Und wo ist der Haken?</p>
          <p className="tl-klaerung__text">
            Ehrliche Antwort: Die Zahlen dahinter sind zum großen Teil frei
            verfügbar. Google stellt sie jedem Betrieb kostenlos bereit, nur
            richtet es kaum jemand ein. Die teuren Abos verkaufen dir vor
            allem Einrichtung und Verpackung. Genau das bauen wir einmal,
            danach läuft es von allein weiter. Deshalb können wir es
            einbauen, statt es dir zu verrechnen. Wir verdienen an der
            Website selbst und an dem, was du Talos freiwillig zusätzlich
            übergibst. Nicht an versteckten Gebühren.
          </p>
        </div>

        <div className="tl-wa__cta">
          <Link
            href={KONTAKT}
            data-rr-lead="talos"
            className="rr-btn-sweep rr-btn-sweep--red"
          >
            Reden wir über deine Website
          </Link>
        </div>
      </div>
    </section>
  );
}
