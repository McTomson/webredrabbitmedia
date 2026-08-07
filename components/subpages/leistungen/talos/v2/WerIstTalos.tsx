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
    // Track = dieses Section-Element (200vh); Exempt auf dem tallen Root wie
    // CasePanels, nicht auf dem inneren position:sticky-Element.
    <section className="rr-section tl-section tl-sticky-track tl-sticky-track--tall" data-rr-snap data-rr-snap-exempt>
      <div className="tl-sticky">
        <div className="rr-wrap tl-wer__grid">
          <div className="tl-wer__text">
            <p className="wd-eyebrow tl-eyebrow">Wer ist Talos</p>
            <h2 className="rr-statement tl-title tl-wer__title">
              Talos macht aus der verschlossenen Kiste deine Kommandozentrale.
            </h2>
            <p className="rr-body-lg tl-lead">
              Talos ist nichts, das du extra kaufst oder installierst. Er
              steckt fest in jeder Website von uns. Er zeigt dir, was auf
              deiner Seite passiert: wie viele Leute da waren, wo sie klicken,
              was sie dir schreiben. Texte und Bilder änderst du selbst, ohne
              Anruf, ohne Wartezeit. Und alles hält sich von allein aktuell.
              Einmal eingerichtet, läuft es. Jahr für Jahr.
            </p>

            <p className="tl-says">
              Schau ruhig genau hin, wie ich gebaut bin. So nah siehst du einen
              Mitarbeiter selten.
            </p>
            <p className="tl-says">
              Ich zeige dir, was auf deiner Seite los ist. In normalen Worten,
              ohne Fachchinesisch.
            </p>
            <p className="tl-says">
              Und wenn etwas klemmt, sage ich dir Bescheid, bevor es ein Kunde
              merkt.
            </p>
          </div>

          {/* Leerraum rechts = Standplatz des Companion-Talos (kein Rahmen). */}
          <div className="tl-stage-slot" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
