/**
 * Sektion (neu, Produkt-zuerst 20.07.) — "Was deine Website zusätzlich kann":
 * die mitarbeitenden Funktionen in Klartext, BEVOR die Figur (Talos) als Gesicht
 * eingeführt wird. Entscheidung Thomas 20.07.: Produkt zuerst, Talos als Gesicht
 * danach. Kein "KI"-Wort, kein Fachjargon, Autonomie sofort klargestellt (du
 * gibst frei). Drei rr-card-soft--neutral Karten (gleiche Kategorie, daher eine
 * Farbe, UNTERSEITEN_STIL.md §5).
 */
const CAPS: { label: string; text: string }[] = [
  {
    label: "Anfragen und Termine",
    text: "Anfragen werden angenommen und beantwortet, Termine buchen sich online. Du gibst frei, was rausgeht, oder lässt sie es allein erledigen. Du entscheidest, nicht die Technik.",
  },
  {
    label: "Beiträge, die dich sichtbar machen",
    text: "Deine Seite schreibt regelmäßig Beiträge zu deinem Handwerk, damit dich mehr Leute in der Nähe und bei Google finden. Was online geht, gibst du frei.",
  },
  {
    label: "Dein Dashboard in Klartext",
    text: "Du siehst jederzeit, was reinkommt und was läuft. Keine Technik, keine Rätsel, eine Übersicht, die du sofort verstehst.",
  },
];

export default function WasSieKann() {
  return (
    <section className="rr-section lh-kann">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">Was sie zusätzlich kann</p>
        <h2 className="rr-statement lh-kann__title">
          Sie nimmt dir Arbeit ab. Die Kontrolle behältst du.
        </h2>
        <div className="rr-grid rr-grid-3 rr-stagger lh-kann__grid">
          {CAPS.map((c) => (
            <div key={c.label} className="rr-card-soft rr-card-soft--neutral">
              <p className="rr-card-soft__label">{c.label}</p>
              <p className="rr-card-soft__text">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
