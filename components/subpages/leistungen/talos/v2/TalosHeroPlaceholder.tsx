/**
 * Talos-Hero — GERUEST-Platzhalter (Etappe "Geruest", 22.07.2026). Reine
 * Server-Komponente, statisch, kein 3D. Traegt das einzige <h1> der Seite.
 *
 * WIRD IN ETAPPE 2 ERSETZT durch den echten Walk-in-Hero (Talos naehert sich
 * scroll-getrieben der Kamera, Muster aus components/relaunch/talos/
 * TalosEntranceStage bzw. TalosPresentation) — hier bewusst nur Text.
 */
export default function TalosHeroPlaceholder() {
  return (
    <section className="rr-section tl-section tl-hero">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Dein digitaler Mitarbeiter</p>
        <h1 className="tl-hero__word">Talos</h1>
        <p className="rr-body-lg tl-hero__sub">
          Der digitale Mitarbeiter, der in jeder Website von uns steckt.
        </p>
      </div>
    </section>
  );
}
