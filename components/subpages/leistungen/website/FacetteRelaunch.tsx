/**
 * Facette 2 von 3 — "Relaunch" (die groesste Luecke der bisherigen Seite):
 * konkrete Warnsignale, woran ein Laie merkt, dass ein Relaunch faellig ist,
 * plus die groesste Angst nehmen (Google-Sichtbarkeit geht NICHT verloren) in
 * rein qualitativer Sprache, ohne erfundene Prozentzahlen. Warnsignale als
 * bordered List im rr-stagger-Container (view-timeline-Reveal aus
 * styleguide.css, Muster wie SelbstOderMit/WieWirBauen, kein eigenes
 * Bewegungssystem). Der Beruhigungs-Block sitzt auf neutralem rr-surface (wie
 * FuerWenNicht), NICHT auf Teal/Rot: der einzige farbige Moment bleibt das
 * Zitat in SoArbeitenWir. DU-Anrede, echte Umlaute, kein "KI"/"AI"-Wort, kein
 * Gedankenstrich, kein Preis, nur h2.
 */
const SIGNALE: string[] = [
  "Sie sieht aus wie vor zehn Jahren, und du traust dich fast nicht mehr, sie herzuzeigen.",
  "Sie lädt ewig, und wer warten muss, ist schon wieder weg.",
  "Am Handy musst du zoomen und schieben, obwohl fast jeder übers Handy draufkommt.",
  "Es kommt kaum eine Anfrage darüber, obwohl Leute die Seite besuchen.",
  "Du willst selbst etwas ändern und kommst nicht mehr rein, oder traust dich nicht.",
];

export default function FacetteRelaunch() {
  return (
    <section className="rr-section lw-relaunch">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">Relaunch</p>
        <h2 className="rr-statement lw-relaunch__title">
          Deine Seite gibt es schon. Sie tut nur nicht mehr, was sie soll.
        </h2>
        <p className="rr-body-lg lw-relaunch__body">
          Manchmal reicht kein Nachbessern mehr, dann bauen wir neu auf, was du
          schon hast. Woran du merkst, dass es so weit ist:
        </p>

        <ul className="rr-stagger lw-relaunch__signals">
          {SIGNALE.map((s) => (
            <li key={s} className="lw-relaunch__signal">
              {s}
            </li>
          ))}
        </ul>

        <div className="lw-relaunch__ruhe">
          <p className="rr-eyebrow-lg lw-relaunch__ruhe-eyebrow">
            Die größte Sorge zuerst
          </p>
          <p className="rr-body-lg lw-relaunch__ruhe-body">
            Die häufigste Angst beim Relaunch ist, dass du deine Sichtbarkeit
            bei Google verlierst. Das passiert bei uns nicht. Wir übernehmen
            deine Inhalte und die Struktur sauber, leiten alte Adressen auf die
            passenden neuen Seiten und schalten die neue Seite erst live, wenn
            sie wirklich steht. Kein Loch, in dem dich plötzlich keiner mehr
            findet. Was du dir über die Jahre bei Google aufgebaut hast, nehmen
            wir mit.
          </p>
        </div>
      </div>
    </section>
  );
}
