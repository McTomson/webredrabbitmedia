/**
 * Abschnitt 2 — "Wie wir bauen": drei Schritte als rr-card-soft --neutral
 * (UNTERSEITEN_STIL.md §5: Schritte alle EINE Farbe, Nummer + Scroll tragen
 * die Abfolge). Die Nummer steckt in rr-card-soft__eyebrow, der Scroll-Anteil
 * kommt vom echten rr-stagger-Utility aus styleguide.css (view-timeline,
 * gestaffelter Reveal je Karte) — kein eigenes Bewegungssystem erfunden.
 * Copy 1:1 aus scratchpad/leistungen-copy.md Abschnitt B, "Wie wir bauen".
 */
const STEPS: { num: string; label: string; body: string }[] = [
  {
    num: "01",
    label: "Erstgespräch",
    body: "Du erzählst uns kurz, was dein Betrieb macht und was du brauchst. Kein Verkaufsdruck, kein Fachchinesisch. Ein Gespräch, keine zehn.",
  },
  {
    num: "02",
    label: "Entwurf ohne Vorkasse",
    body: "Wir bauen dir einen echten Entwurf, den du anschauen kannst. Erst wenn er dir gefällt und du Ja sagst, fällt eine Anzahlung an. Vorher zahlst du nichts.",
  },
  {
    num: "03",
    label: "Live und deins",
    body: "Wir feilen so lange, bis es passt, dann geht die Seite online. Ab dann gehört sie dir, samt allem, was drinsteckt.",
  },
];

export default function WieWirBauen() {
  return (
    <section className="rr-section lw-bauen">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">So läuft es ab</p>
        <h2 className="rr-statement lw-bauen__title">
          Drei Schritte, keine Meeting-Marathons.
        </h2>
        <div className="rr-grid rr-grid-3 rr-stagger lw-bauen__grid">
          {STEPS.map((s) => (
            <article key={s.num} className="rr-card-soft rr-card-soft--neutral lw-step">
              <p className="rr-card-soft__eyebrow">{s.num}</p>
              <p className="rr-card-soft__label lw-step__label">{s.label}</p>
              <p className="rr-body lw-step__body">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
