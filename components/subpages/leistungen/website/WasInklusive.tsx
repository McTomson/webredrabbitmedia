/**
 * Abschnitt 3 — "Was inklusive ist": das Fundament als rr-card-soft --neutral
 * Grid (kein Preis, keine gestaffelten Pakete). Copy 1:1 aus
 * scratchpad/leistungen-copy.md Abschnitt B, "Was inklusive ist" — die acht
 * Punkte bekommen je ein kurzes, selbst gesetztes Themen-Label als Eyebrow
 * (analog WasDuBekommst.tsx im Hub), der Fliesstext bleibt wortgleich.
 */
const ITEMS: { tag: string; text: string }[] = [
  { tag: "Design", text: "Individuelles Design, das zu deinem Betrieb passt." },
  { tag: "Hosting", text: "Hosting, schnell und stabil, du kümmerst dich um nichts." },
  { tag: "Handy", text: "Optimiert fürs Handy, weil da deine Kunden suchen." },
  {
    tag: "Recht",
    text: "Rechtssicher nach österreichischem Recht, Impressum und Datenschutz sauber.",
  },
  { tag: "Kontakt", text: "Kontaktformular, das direkt bei dir ankommt." },
  { tag: "Sichtbarkeit", text: "Grund-SEO, damit dich Leute in deiner Nähe finden." },
  {
    tag: "Dashboard",
    text: "Ein Dashboard in Klartext, in dem du siehst, was auf deiner Seite läuft.",
  },
  { tag: "Selbst ändern", text: "Texte und Bilder änderst du selbst, mit ein paar Klicks." },
];

export default function WasInklusive() {
  return (
    <section className="rr-section lw-fund">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">Ohne Aufpreis dabei</p>
        <h2 className="rr-statement lw-fund__title">Das Fundament ist immer drin.</h2>
        <div className="lw-fund__grid">
          {ITEMS.map((it) => (
            <div key={it.tag} className="rr-card-soft rr-card-soft--neutral lw-fund__card">
              <p className="rr-card-soft__eyebrow">{it.tag}</p>
              <p className="lw-fund__text">{it.text}</p>
            </div>
          ))}
        </div>
        <p className="rr-body lw-fund__closing">
          Kein Extra-Paket, kein Kleingedrucktes. Das ist der Standard, nicht
          der Aufpreis.
        </p>
      </div>
    </section>
  );
}
