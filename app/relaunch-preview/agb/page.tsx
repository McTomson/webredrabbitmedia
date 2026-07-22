import type { Metadata } from "next";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import CornerLogo from "@/components/relaunch/CornerLogo";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import { crimson, dmsans, fraunces, grotesk } from "@/lib/relaunch/fonts";
import "@/app/styleguide/styleguide.css";
import "@/components/subpages/legal-preview.css";

/**
 * AGB im Relaunch-Look (Preview, noindex). Rechtstexte 1:1 aus
 * app/agb/AGBClient.tsx uebernommen — nichts umformuliert.
 */
export const metadata: Metadata = {
  title: "AGB · Red Rabbit Media",
  description: "Allgemeine Geschäftsbedingungen der Red Rabbit GmbH.",
  robots: { index: false, follow: false },
};

export default function AGBPreviewPage() {
  return (
    <>
      <div
        className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}
        style={{ background: "transparent" }}
      >
        <RelaunchMenu />
      </div>

      {/* Ecken-Logo (rote Hasen-Marke oben links) — gemeinsames Bauteil. */}
      <CornerLogo />

      <div className="rrl">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&family=Instrument+Sans:wght@400;500;600&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
        />

        <div className="rrl-wrap">
          <header className="rrl-head">
            <span className="rrl-label">(Rechtliches)</span>
            <h1>
              Allgemeine Geschäftsbedingungen (AGB)<span className="rrl-dot">.</span>
            </h1>
            <p>
              Red Rabbit GmbH
              <br />
              Stand: Juli 2026
            </p>
          </header>

          <div className="rrl-body">
            <section>
              <h2>1. Geltungsbereich</h2>
              <p>
                Diese Allgemeinen Geschäftsbedingungen gelten für sämtliche Leistungen der Red Rabbit
                GmbH, Grabnergasse 8/8, 1060 Wien, insbesondere im Bereich Webdesign, Online-Marketing,
                Konzeption und Umsetzung digitaler Inhalte. Abweichende Bedingungen des Kunden gelten
                nur, wenn sie ausdrücklich schriftlich anerkannt wurden.
              </p>
            </section>

            <section>
              <h2>2. Vertragsabschluss &amp; Preisbindung</h2>
              <p>
                Ein Vertrag kommt durch das Absenden des vollständig ausgefüllten Kontaktformulars auf
                unserer Website zustande.
              </p>
              <p>Nur in diesem Fall gilt der vergünstigte Fixpreis ab 950 € netto.</p>
              <ul>
                <li>
                  Das Angebot ist 30 Tage gültig. Danach kann die Red Rabbit GmbH das Angebot einseitig
                  ändern oder zurückziehen.
                </li>
              </ul>
            </section>

            <section>
              <h2>3. Leistungsumfang &amp; Ablauf</h2>
              <ul>
                <li>Nach Erhalt der vollständigen Kundendaten und Inhalte (Texte, Bilder etc.) beginnt die Umsetzung.</li>
                <li>Innerhalb von 7 Werktagen wird ein erster Entwurf bereitgestellt.</li>
                <li>Der Kunde kann im Rahmen einer einmaligen Korrekturschleife Änderungswünsche äußern.</li>
                <li>Weitere Änderungen oder Redesigns sind kostenpflichtig.</li>
                <li>
                  Innerhalb von 6 Monaten nach Projektabschluss ist eine einmalige kostenlose Text- oder
                  Bildanpassung möglich (kein neues Layout).
                </li>
                <li>
                  Hosting und Wartung sind nicht Bestandteil des Pakets, es sei denn, ein optionales Abo
                  wird abgeschlossen (siehe Punkt 5).
                </li>
              </ul>
            </section>

            <section>
              <h2>4. Zahlungsbedingungen</h2>
              <ul>
                <li>Die Rechnung wird nach Projektfreigabe bzw. Veröffentlichung der Website gestellt.</li>
                <li>Die Zahlung ist innerhalb von 7 Werktagen ab Rechnungsdatum fällig.</li>
              </ul>
              <p>Bei Zahlungsverzug gelten folgende Mahngebühren:</p>
              <ul>
                <li>1. Mahnung: 10 € pauschal</li>
                <li>2. Mahnung: zusätzliche 20 €</li>
                <li>3. Mahnung: zusätzliche 30 € + Ankündigung rechtlicher Schritte</li>
                <li>
                  Zusätzlich werden gesetzliche Verzugszinsen von derzeit 9,2 %-Punkte über dem
                  Basiszinssatz (§ 456 UGB) verrechnet.
                </li>
                <li>
                  Bei Nichtzahlung ist Red Rabbit berechtigt, die Website temporär zu deaktivieren oder
                  Daten zurückzubehalten.
                </li>
              </ul>
            </section>

            <section>
              <h2>5. Betreuung &amp; Wartung (optional)</h2>
              <ul>
                <li>
                  Kunden können ein Betreuungsabo zum Preis von 79 €/Monat netto (Mindestlaufzeit 12
                  Monate) abschließen.
                </li>
                <li>
                  Enthalten sind:
                  <ul>
                    <li>laufende Text-/Bildanpassungen</li>
                    <li>technische Wartung</li>
                    <li>bevorzugte Umsetzung</li>
                    <li>Support bei Rückfragen</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section>
              <h2>6. Nutzungsrechte &amp; Referenznutzung</h2>
              <ul>
                <li>Alle Rechte an der Website bleiben bis zur vollständigen Bezahlung bei Red Rabbit.</li>
                <li>Danach erhält der Kunde ein einfaches, nicht übertragbares Nutzungsrecht zur eigenen Verwendung.</li>
                <li>
                  Red Rabbit ist berechtigt, sämtliche erstellten Projekte, Inhalte und Designs dauerhaft
                  zu Werbe- und Referenzzwecken zu nutzen (z. B. auf der eigenen Website oder Social
                  Media).
                </li>
                <li>Dem Kunden ist bewusst, dass Demoseiten vor Veröffentlichung nicht die Endfreigabe darstellen.</li>
              </ul>
            </section>

            <section>
              <h2>7. Pflichten des Kunden</h2>
              <ul>
                <li>
                  Der Kunde verpflichtet sich, alle zur Projektumsetzung erforderlichen Inhalte
                  zeitgerecht bereitzustellen.
                </li>
                <li>Bei Verzögerungen verschieben sich Fristen entsprechend.</li>
                <li>
                  Der Kunde ist für die rechtliche Korrektheit aller gelieferten Inhalte (z. B.
                  Impressum, Texte, Logos, Datenschutz) selbst verantwortlich – außer diese Leistungen
                  wurden ausdrücklich von Red Rabbit übernommen.
                </li>
              </ul>
            </section>

            <section>
              <h2>8. Haftung</h2>
              <ul>
                <li>Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen.</li>
                <li>Keine Haftung bei Datenverlust, technischen Fehlern durch Hostinganbieter oder Drittanbietern.</li>
                <li>
                  Bei Eigenverantwortung des Kunden (z. B. Rechtsverletzungen durch eigene Inhalte)
                  übernimmt Red Rabbit keine Haftung.
                </li>
              </ul>
            </section>

            <section>
              <h2>9. Widerruf &amp; Rücktritt</h2>
              <ul>
                <li>
                  Verbraucher haben das gesetzliche Widerrufsrecht, sofern die Leistung noch nicht
                  vollständig erbracht wurde.
                </li>
                <li>
                  Erfolgt 30 Tage lang keine Rückmeldung des Kunden nach Angebot oder Designvorschlag,
                  ist Red Rabbit berechtigt, vom Vertrag zurückzutreten.
                </li>
              </ul>
            </section>

            <section>
              <h2>10. Gerichtsstand &amp; Recht</h2>
              <p>Es gilt österreichisches Recht.</p>
              <p>Gerichtsstand: Wien</p>
            </section>

            <section>
              <h2>11. Salvatorische Klausel</h2>
              <p>
                Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die
                Gültigkeit der übrigen Regelungen unberührt.
              </p>
            </section>

            <section>
              <h2>12. Kontakt</h2>
              <p>
                <strong>Red Rabbit GmbH</strong>
                <br />
                Grabnergasse 8/8
                <br />
                1060 Wien
                <br />
                T +43 676 9000 955
                <br />
                E office@redrabbit.media
                <br />
                W www.redrabbit.media
              </p>
            </section>
          </div>
        </div>
      </div>

      <div
        className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}
        style={{ background: "transparent" }}
      >
        <FooterReassembly />
      </div>
    </>
  );
}
