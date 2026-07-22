/**
 * Wer ist Talos — Copy aus docs/specs/TALOS_COPY_2026-07.md, Station 1.
 * Reserviert einen .tl-stage-slot: die 3D-Naeherkommen-Szene (Talos laeuft
 * auf die Kamera zu) folgt in einer spaeteren Etappe, hier nur der leere
 * Rahmen, damit Layout/Abstand schon stimmen.
 */
export default function WerIstTalos() {
  return (
    <section className="rr-section tl-section">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Wer ist Talos</p>
        <h2 className="rr-statement tl-title">
          Kein Zusatz-Gadget. Deine Website selbst, nur dass sie mitarbeitet.
        </h2>
        <p className="rr-body-lg tl-lead">
          Talos ist keine App, die du dir noch dazukaufst. Er ist die Art, wie
          wir Websites bauen: eine Seite, die dir Arbeit abnimmt, statt nur gut
          auszusehen.
        </p>

        {/* 3D-Naeherkommen folgt: Talos laeuft scroll-getrieben auf die
            Kamera zu (Muster TalosEntranceStage/TalosPresentation). */}
        <div className="tl-stage-slot" aria-hidden="true" />
      </div>
    </section>
  );
}
