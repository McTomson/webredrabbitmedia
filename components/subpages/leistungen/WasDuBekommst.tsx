/**
 * Sektion 3 — "Was du bekommst": rr-card-soft-Grid, reine Website-Sprache
 * (kein Talos, kein "KI"-Wort). Alle Karten --neutral, weil sie dieselbe
 * Kategorie zeigen (UNTERSEITEN_STIL.md §5: Trio-Farben nur bei drei
 * verschiedenen Dingen).
 */
const ITEMS: { label: string; text: string }[] = [
  {
    label: "Design, das nach dir aussieht",
    text: "Kein Schema-F. Deine Seite bekommt ein Gesicht, das zu deinem Betrieb passt und nicht wie von der Stange wirkt.",
  },
  {
    label: "Hosting inklusive",
    text: "Wir hosten deine Seite schnell und stabil. Du musst dich um nichts kümmern, das läuft im Hintergrund mit.",
  },
  {
    label: "Am Handy top",
    text: "Die meisten Leute suchen dich am Smartphone. Deine Seite sieht dort genauso gut aus wie am großen Bildschirm.",
  },
  {
    label: "Rechtssicher",
    text: "Impressum, Datenschutz, Cookie-Hinweis. Alles sauber und nach österreichischem Recht, damit du keine böse Post bekommst.",
  },
  {
    label: "Kontaktformular",
    text: "Ein Formular, das wirklich ankommt. Anfragen landen direkt bei dir, ohne Umweg und ohne Spam-Chaos.",
  },
  {
    label: "Sichtbar bei Google",
    text: "Die Basis, damit dich Leute finden, wenn sie in deiner Nähe nach dir suchen. Bei uns Fundament, kein teures Extra.",
  },
];

export default function WasDuBekommst() {
  return (
    <section className="rr-section lh-bekommst">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">In jeder Website drin</p>
        <h2 className="rr-statement lh-bekommst__title">
          Kein Extra, kein Aufpreis. Das ist das Fundament.
        </h2>
        <div className="lh-bekommst__grid">
          {ITEMS.map((it) => (
            <div key={it.label} className="rr-card-soft rr-card-soft--neutral">
              <p className="rr-card-soft__label">{it.label}</p>
              <p className="rr-card-soft__text">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
