/**
 * Facette 1 von 3 (Breite: "alles rund um Websites unter einem Dach") —
 * "Neu bauen": die erste richtige Seite. Traegt zugleich den Dach-Satz, der
 * alle drei Facetten (Neu / Relaunch / Gestaltung) aufspannt, damit sich ein
 * Besucher mit IRGENDEINEM Website-Anliegen wiederfindet. Bewusst KEINE
 * Wiederholung des Outcome-Frames aus WasEntsteht, sondern der eigene Winkel
 * "zum ersten Mal richtig online" (fuer wen, was dabei besonders ist) inkl.
 * leichtem Wo/Wann-Anker (regional Oesterreich, Entwurf schnell). Prosa-Muster
 * wie WasEntsteht. DU-Anrede, echte Umlaute, kein "KI"/"AI"-Wort, kein
 * Gedankenstrich, kein Preis, nur h2. Keine Farbe (der EINE Teal-Moment lebt
 * ausschliesslich in SoArbeitenWir).
 */
export default function FacetteNeu() {
  return (
    <section className="rr-section lw-neu">
      <div className="rr-wrap rr-narrow">
        <p className="lw-facetten-dach">
          Website ist bei uns nicht nur der eine Neubau. Es ist alles rund um
          deinen Auftritt: die erste richtige Seite, der Relaunch einer alten
          und die Gestaltung, die aus Besuchern Anfragen macht. Wir fangen da
          an, wo du gerade stehst.
        </p>

        <p className="rr-eyebrow-lg">Neu bauen</p>
        <h2 className="rr-statement lw-neu__title">
          Noch keine Seite? Oder eine, die nie eine richtige war? Dann fangen
          wir sauber an.
        </h2>
        <p className="rr-body-lg lw-neu__body">
          Wenn du bisher nur über Mundpropaganda und einen Eintrag bei Google
          kommst, ist die erste eigene Seite ein großer Schritt. Wir bauen sie
          so, dass sie von Anfang an nach deinem Betrieb aussieht und nicht nach
          Vorlage. Du erzählst, was du machst und für wen, den Rest bringen wir
          in Form. Weil sie sauber gebaut und bei Google angemeldet ist, findet
          dich auch jemand aus deiner Gegend, der genau das sucht und dich noch
          gar nicht kennt. Den ersten Entwurf siehst du schnell, danach feilen
          wir, bis er sitzt.
        </p>
      </div>
    </section>
  );
}
