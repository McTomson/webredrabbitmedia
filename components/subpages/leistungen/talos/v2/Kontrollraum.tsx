/**
 * Kontrollraum — "Was gerade alles gleichzeitig läuft", Platzhalter-Grid mit
 * 6 Panels: 3 laufende Wachen + 3 als "gebucht" markierte Fähigkeiten-Beispiele.
 * WIRD SPAETER animierter Kontrollraum (live wirkende Panels, Muster in
 * TalosDashboard vorgezeichnet); hier bewusst nur statisches Grid.
 */
const WACHEN = [
  { label: 'Täglicher Check', text: 'Talos prüft jeden Morgen, ob deine Seite läuft und schnell bleibt.' },
  { label: 'Tempo', text: 'Ladezeit und Auffindbarkeit im Blick, ohne dass du nachfragen musst.' },
  { label: 'Ausfall-Wache', text: 'Fällt etwas aus, bekommst du sofort Bescheid, meist bevor du es merkst.' },
];

const GEBUCHT = [
  { label: 'Beitrag in Arbeit', text: 'Der Schreiber setzt gerade einen neuen Beitrag für deine Seite auf.' },
  { label: 'Anfrage aufgefangen', text: 'Der Empfang hat eine neue Anfrage übernommen und antwortet.' },
  { label: 'Nachfass-Mail wartet auf Freigabe', text: 'Ein Entwurf liegt bereit, ein Klick von dir genügt.' },
];

export default function Kontrollraum() {
  return (
    <section className="rr-section tl-section tl-section--surface">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Der Kontrollraum</p>
        <h2 className="rr-statement tl-title">
          Was gerade alles gleichzeitig läuft.
        </h2>

        <div className="tl-cards">
          {WACHEN.map((w) => (
            <div className="tl-card" key={w.label}>
              <p className="tl-card__label">Immer an</p>
              <p className="tl-card__name">{w.label}</p>
              <p className="tl-card__text">{w.text}</p>
            </div>
          ))}
          {GEBUCHT.map((g) => (
            <div className="tl-card tl-card--booked" key={g.label}>
              <span className="tl-panel__status">Gebucht</span>
              <p className="tl-card__name">{g.label}</p>
              <p className="tl-card__text">{g.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
