/**
 * Abschnitt 3 — "Die mietbaren Module". Zwei echte Module als rr-card-soft
 * (Der Schreiber, Der Empfang), ein dritter Hinweis bewusst KEINE Karte
 * (Copy-Vorgabe: "Modul 3, Hinweis, keine Liste"), sondern ein Textblock.
 * Copy 1:1 aus leistungen-copy.md Abschnitt C.3.
 */
const MODULE: { label: string; text: string }[] = [
  {
    label: "Der Schreiber",
    text: "Regelmäßig frische Artikel und Beiträge für deine Seite und deine Kanäle, damit du bei Google und bei deinen Kunden präsent bleibst. Du bekommst alles fertig vorgelegt und gibst per Klick frei, was raus soll. Kein leeres Blatt, kein Zeitfresser mehr.",
  },
  {
    label: "Der Empfang",
    text: "Nimmt Anfragen entgegen, lässt Kunden direkt online Termine buchen und fasst nach, wenn sich jemand nicht mehr meldet. So geht dir keine Anfrage mehr verloren, nur weil du gerade keine Zeit zum Antworten hattest.",
  },
];

export default function Module() {
  return (
    <section className="rr-section lt-substance">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">Wenn du mehr abgeben willst</p>
        <h2 className="rr-statement lt-module__title">
          Such dir den Helfer aus, der dir die meiste Arbeit abnimmt. Freigabe
          bleibt immer bei dir.
        </h2>
        <div className="lt-card-grid">
          {MODULE.map((m) => (
            <div key={m.label} className="rr-card-soft rr-card-soft--neutral">
              <p className="rr-card-soft__label">{m.label}</p>
              <p className="rr-card-soft__body">{m.text}</p>
            </div>
          ))}
        </div>
        <div className="lt-module__note">
          <span className="lt-module__note-label">Weitere auf Anfrage</span>
          <p className="rr-body lt-module__note-text">
            Reviews im Blick behalten, bei Google und in Sprachassistenten
            besser gefunden werden, sehen wo Besucher abspringen. Sag uns, was
            dich am meisten nervt, dann schauen wir, ob ein Helfer dafür
            passt.
          </p>
        </div>
        <p className="rr-body lt-module__outro">
          Fang mit einem an, hol dir mehr dazu, wenn es sich lohnt. Kein
          Abo-Zwang, keine Mindestlaufzeit-Falle.
        </p>
      </div>
    </section>
  );
}
