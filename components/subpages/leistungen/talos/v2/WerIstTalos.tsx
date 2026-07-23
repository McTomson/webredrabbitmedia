/**
 * Wer ist Talos — Copy: REVISION 23.07. aus docs/specs/TALOS_COPY_V2_…ENTWURF.md
 * (Headline V1; beantwortet "Was ist das konkret?", ENTWURF bis Thomas-Freigabe).
 *
 * Sticky-Szene: Track 200vh, der Inhalt bleibt stehen, waehrend der
 * Companion-Talos (fixe 3D-Ebene, Station "back") nah herankommt und man
 * seine Bauweise sieht. Text liegt VOR ihm (Wrapper z20 > Canvas z12),
 * der rechte Leerraum (.tl-wer__grid) ist seine Buehne.
 */
export default function WerIstTalos() {
  return (
    <section className="rr-section tl-section tl-sticky-track tl-sticky-track--tall">
      <div className="tl-sticky">
        <div className="rr-wrap rr-narrow tl-wer__grid">
          <div className="tl-wer__text">
            <p className="wd-eyebrow tl-eyebrow">Wer ist Talos</p>
            <h2 className="rr-statement tl-title">
              Kein Tool, kein Abo. Talos ist der Mitarbeiter, der in deiner
              Website steckt.
            </h2>
            <p className="rr-body-lg tl-lead">
              Du fragst dich wahrscheinlich, ob dir hier wieder irgendein
              Programm oder Abo angedreht werden soll. Wird es nicht. Talos ist
              nichts, das du kaufst oder installierst. Er ist fest in deine
              Website eingebaut und arbeitet dort. Er passt auf, dass die Seite
              läuft. Kommt eine Anfrage rein, fängt er sie auf und sagt dir
              Bescheid.
            </p>

            <p className="tl-says">
              Schau ruhig genau hin, wie ich gebaut bin. So nah siehst du einen
              Mitarbeiter selten.
            </p>
            <p className="tl-says">Kaufen musst du mich nicht. Ich stecke schon in deiner Seite.</p>
            <p className="tl-says">
              Ich halte deine Seite am Laufen und melde mich, sobald du etwas
              wissen musst.
            </p>
          </div>

          {/* Leerraum rechts = Standplatz des Companion-Talos (kein Rahmen). */}
          <div className="tl-stage-slot" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
