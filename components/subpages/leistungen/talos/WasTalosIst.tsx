/**
 * Abschnitt 1 — "Was Talos ist" (Klartext). Traegt die einzige <h1> der
 * Seite, weil TalosPresentation selbst keine H1 rendert (nur tp-headline
 * = <h2>, geprueft in components/relaunch/talos/TalosPresentation.tsx).
 * SSR-Text nach dem 3D-Deck, ueber der fixen Buehne (siehe talos-sub.css
 * .lt-substance). Copy 1:1 aus leistungen-copy.md Abschnitt C.1.
 */
export default function WasTalosIst() {
  return (
    <section className="rr-section lt-substance">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">In Klartext</p>
        <h1 className="rr-statement lt-wer__title">
          Stell dir einen zuverlässigen Mitarbeiter vor, der immer da ist und
          nie einen freien Tag braucht.
        </h1>
        <p className="rr-body-lg lt-wer__body">
          Talos sitzt in deiner Website und kümmert sich um die Dinge, die
          zwar sein müssen, aber niemand gern macht. Anfragen erfassen.
          Freundlich zurückschreiben. Nachfassen, wenn sich jemand nicht mehr
          meldet. Dir zeigen, was läuft. Du bleibst der Chef, du gibst frei,
          was rausgeht. Talos nimmt dir nur das ab, wofür du abends keine
          Nerven mehr hast.
        </p>
      </div>
    </section>
  );
}
