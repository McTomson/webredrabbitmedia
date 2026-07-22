/**
 * Wer ist Talos — Copy aus docs/specs/TALOS_COPY_V2_2026-07-22_ENTWURF.md,
 * Sektion 2. Layout: Text links (Eyebrow, H2, Subline, 3 Talos-Sprechzeilen
 * untereinander), .tl-stage-slot rechts als leerer Rahmen fuer die spaetere
 * 3D-Naeherkommen-Szene (Design-Lead haengt dort selbst eine Buehne ein).
 */
export default function WerIstTalos() {
  return (
    <section className="rr-section tl-section">
      <div className="rr-wrap rr-narrow tl-wer__grid">
        <div className="tl-wer__text">
          <p className="wd-eyebrow tl-eyebrow">Wer ist Talos</p>
          <h2 className="rr-statement tl-title">
            Kein Programm, das du zusätzlich kaufst. Deine Website selbst, nur
            dass sie mitdenkt.
          </h2>
          <p className="rr-body-lg tl-lead">
            Talos ist keine App und kein Werkzeug, das du irgendwo dazuklickst.
            Er ist die Art, wie wir Websites bauen. Eine Seite, die dir Arbeit
            abnimmt, statt nur schön dazustehen.
          </p>

          <p className="tl-says">Schau ruhig genauer hin. So bin ich gebaut.</p>
          <p className="tl-says">
            Ich passe auf, dass deine Seite läuft, schnell bleibt und keine
            Anfrage verloren geht.
          </p>
          <p className="tl-says">
            Und wenn du willst, nehme ich dir noch viel mehr ab. Aber immer
            erst, wenn du Ja sagst.
          </p>
        </div>

        {/* 3D-Naeherkommen folgt: Talos laeuft scroll-getrieben auf die
            Kamera zu (Muster TalosEntranceStage/TalosPresentation). */}
        <div className="tl-stage-slot" aria-hidden="true" />
      </div>
    </section>
  );
}
