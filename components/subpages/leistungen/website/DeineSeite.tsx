/**
 * Abschnitt (neu) — "Sie gehört dir": Eigentum + Unabhaengigkeit als eigener,
 * kurzer Moment (nicht nur im Hero nebenbei). Beantwortet "gehört mir die
 * Seite wirklich, bin ich gebunden". Statement + Fliesstext im Muster von
 * WasEntsteht/FuerWenNicht. DU-Anrede, kein "KI"/"AI"-Wort, kein Gedankenstrich,
 * kein Preis.
 */
export default function DeineSeite() {
  return (
    <section className="rr-section lw-eigentum">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">Sie gehört dir</p>
        <h2 className="rr-statement lw-eigentum__title">
          Am Ende hast du die Seite. Nicht wir, nicht ein Anbieter, den du nie
          wieder los wirst.
        </h2>
        <p className="rr-body-lg lw-eigentum__body">
          Kein Knebelvertrag, keine Miete, die ewig weiterläuft. Was wir bauen,
          gehört dir, samt Domain, Texten und Zugängen. Willst du irgendwann
          weg oder jemand anderen ranlassen, nimmst du deine Seite einfach mit.
          Wir binden dich nicht. Wir wollen, dass du bleibst, weil es passt,
          nicht weil du musst.
        </p>
      </div>
    </section>
  );
}
