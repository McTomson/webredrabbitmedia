import FragTalos from '@/components/relaunch/talos/FragTalos';

/**
 * "Frag Talos" — Anmoderation vor dem bestehenden 5-Fragen-Assistenten
 * (Copy v2 Sektion 9). Der Assistent selbst (components/relaunch/talos/
 * FragTalos.tsx) wird unveraendert eingebunden, exakt wie in dessen
 * Referenz-Verwendung im Leistungs-Hub (app/relaunch-preview/
 * leistungen-hub/page.tsx): eigener SSR-Rahmen mit Eyebrow/H2/Subline +
 * Talos-Sprechzeilen, danach direkt <FragTalos />. FragTalos bringt seinen
 * eigenen Hintergrund/Stil (dangerouslySetInnerHTML-<style>) selbst mit,
 * hier unangetastet gelassen.
 */
export default function FragTalosAnmoderation() {
  return (
    <section className="rr-section tl-section tl-frag">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Noch unsicher?</p>
        <h2 className="rr-statement tl-title">
          Du weißt nicht, was dein Betrieb wirklich braucht? Dann frag mich.
        </h2>
        <p className="rr-body-lg tl-lead">
          Fünf kurze Fragen, dann sage ich dir ehrlich, welche Website und
          welche Kollegen zu dir passen. Und was du getrost weglassen kannst.
          Kein Verkaufsgespräch, du steigst aus, wann du willst.
        </p>

        <p className="tl-says">
          Beantworte mir kurz fünf Fragen, dann wird es konkret.
        </p>
        <p className="tl-says">
          Und keine Sorge, ich rede dir nichts ein, was du nicht brauchst.
        </p>

        <FragTalos />
      </div>
    </section>
  );
}
