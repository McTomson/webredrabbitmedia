import FragTalos from "@/components/relaunch/talos/FragTalos";

/**
 * Frag-Talos-Sektion: eigenstaendige Client-Insel (components/relaunch/
 * talos/FragTalos.tsx, unveraendert importiert, UNTERSEITEN_STIL.md §0)
 * eingebettet in einen SSR-Rahmen mit Eyebrow + kurzer Einleitung.
 */
export default function FragTalosSection() {
  return (
    <section className="rr-section lt-substance lt-frag">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">Frag Talos</p>
        <h2 className="rr-statement lt-frag__title">
          Fünf kurze Fragen, dann weißt du, welcher Helfer zu deinem Betrieb
          passt.
        </h2>
        <p className="rr-body-lg lt-frag__intro">
          Kein Formular mit zwanzig Feldern. Du beantwortest ein paar
          Klick-Fragen, Talos schlägt dir vor, was für deinen Betrieb Sinn
          ergibt.
        </p>
        <FragTalos />
      </div>
    </section>
  );
}
