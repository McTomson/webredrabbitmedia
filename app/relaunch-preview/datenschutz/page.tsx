import type { Metadata } from "next";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import { crimson, dmsans, fraunces, grotesk } from "@/lib/relaunch/fonts";
import "@/app/styleguide/styleguide.css";
import "@/components/subpages/legal-preview.css";

/**
 * Datenschutzerklaerung im Relaunch-Look (Preview, noindex). Rechtstexte 1:1
 * aus app/datenschutz/DatenschutzClient.tsx uebernommen — nichts umformuliert.
 */
export const metadata: Metadata = {
  title: "Datenschutz · Red Rabbit Media",
  description: "Informationen zum Schutz Ihrer persönlichen Daten.",
  robots: { index: false, follow: false },
};

export default function DatenschutzPreviewPage() {
  return (
    <>
      <div
        className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}
        style={{ background: "transparent" }}
      >
        <RelaunchMenu />
      </div>

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
              Datenschutzerklärung<span className="rrl-dot">.</span>
            </h1>
            <p>Informationen zum Schutz Ihrer persönlichen Daten.</p>
          </header>

          <div className="rrl-body">
            <section>
              <h2>1. Verantwortlicher</h2>
              <p>
                <strong>Red Rabbit GmbH</strong>
                <br />
                Grabnergasse 8/8, 1060 Wien, Österreich
                <br />
                T: +43 676 9000 955
                <br />
                E: office@redrabbit.media
                <br />
                www.redrabbit.media
              </p>
            </section>

            <section>
              <h2>2. Allgemeines</h2>
              <p>
                Wir verarbeiten Ihre personenbezogenen Daten streng vertraulich und ausschließlich im
                Rahmen der gesetzlichen Vorschriften (DSGVO, TKG 2021). In dieser Datenschutzerklärung
                informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer
                Website und Services.
              </p>
            </section>

            <section>
              <h2>3. Welche Daten wir verarbeiten</h2>

              <h3>a) Bei Kontaktaufnahme &amp; Angebotsanfrage</h3>
              <ul>
                <li>Name, E-Mail, Telefonnummer, Nachricht</li>
                <li>Zweck: Beantwortung Ihrer Anfrage, Angebotslegung</li>
                <li>Rechtsgrundlage: Art 6 Abs 1 lit b DSGVO (vorvertragliche Maßnahme)</li>
              </ul>

              <h3>b) Bei Nutzung unserer Website</h3>
              <ul>
                <li>IP-Adresse, Browsertyp, Betriebssystem, Datum &amp; Uhrzeit des Zugriffs, besuchte Seiten</li>
                <li>Zweck: Systemsicherheit, Optimierung, Fehleranalyse</li>
                <li>Rechtsgrundlage: Art 6 Abs 1 lit f DSGVO (berechtigtes Interesse)</li>
              </ul>

              <h3>c) Newsletter / E-Mail-Marketing</h3>
              <ul>
                <li>E-Mail-Adresse, ggf. Name</li>
                <li>Zweck: Zusendung von Informationen, Angeboten</li>
                <li>
                  Rechtsgrundlage: Art 6 Abs 1 lit a DSGVO (Einwilligung) oder Art 6 Abs 1 lit f DSGVO
                  iVm § 107 TKG (Bestandskunden)
                </li>
              </ul>

              <h3>d) Cookies &amp; Drittanbieter-Tools</h3>
              <p>(siehe Punkt 6)</p>
            </section>

            <section>
              <h2>4. Speicherdauer</h2>
              <p>Wir speichern Ihre Daten nur solange, wie dies für den jeweiligen Zweck erforderlich ist:</p>
              <table>
                <thead>
                  <tr>
                    <th>Art der Daten</th>
                    <th>Dauer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Anfragen</td>
                    <td>max. 12 Monate</td>
                  </tr>
                  <tr>
                    <td>Vertrags-/Rechnungsdaten</td>
                    <td>7 Jahre (steuerrechtlich)</td>
                  </tr>
                  <tr>
                    <td>Newsletterdaten</td>
                    <td>bis Widerruf</td>
                  </tr>
                  <tr>
                    <td>Server-Logfiles</td>
                    <td>14 Tage</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h2>5. Datenweitergabe</h2>
              <p>
                Daten werden ausschließlich im Rahmen der Auftragsverarbeitung an vertrauenswürdige
                Dienstleister übermittelt, z. B.:
              </p>
              <ul>
                <li>Hosting-Anbieter (z. B. Vercel, All-Inkl, AWS)</li>
                <li>CRM-Systeme / E-Mail-Tools (z. B. Gmail, Brevo)</li>
                <li>Buchhaltung, Steuerberatung</li>
                <li>Webanalyse-/Marketing-Tools (siehe unten)</li>
              </ul>
              <p>Alle Empfänger sind vertraglich zur Einhaltung der DSGVO verpflichtet.</p>
            </section>

            <section>
              <h2>6. Cookies &amp; Webanalyse</h2>
              <p>Beim Besuch unserer Website setzen wir Cookies und vergleichbare Technologien ein.</p>

              <h3>a) Technisch notwendige Cookies</h3>
              <ul>
                <li>Dienen der Grundfunktionalität (Session, Sprachauswahl, Sicherheit)</li>
                <li>Rechtsgrundlage: Art 6 Abs 1 lit f DSGVO</li>
                <li>Kein Consent erforderlich</li>
              </ul>

              <h3>b) Einwilligungspflichtige Cookies (Analytics / Marketing)</h3>
              <p>Diese Cookies werden nur mit Ihrer aktiven Zustimmung über unser Cookie-Banner gesetzt.</p>
              <p>Folgende Tools sind (möglicherweise) integriert:</p>

              <div className="rrl-tool">
                <h4>Google Analytics 4</h4>
                <p>
                  <strong>Anbieter:</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin
                  4, Irland
                </p>
                <ul>
                  <li>Verwendet Cookies zur Analyse der Benutzung der Website</li>
                  <li>IP-Anonymisierung aktiv</li>
                  <li>Übermittlung in Drittstaaten (USA) kann stattfinden</li>
                  <li>Rechtsgrundlage: Art 6 Abs 1 lit a DSGVO (Einwilligung)</li>
                </ul>
                <p>
                  <strong>Widerspruch:</strong> Sie können Ihre Einwilligung jederzeit über unser
                  Cookie-Banner widerrufen.
                </p>
              </div>

              <div className="rrl-tool">
                <h4>Meta Pixel (Facebook Pixel)</h4>
                <p>
                  <strong>Anbieter:</strong> Meta Platforms Ireland Ltd., 4 Grand Canal Square, Dublin 2,
                  Irland
                </p>
                <ul>
                  <li>Erfasst Nutzerverhalten zur Optimierung von Werbeanzeigen</li>
                  <li>Ermöglicht Conversion-Tracking</li>
                  <li>Rechtsgrundlage: Art 6 Abs 1 lit a DSGVO</li>
                </ul>
              </div>

              <h4>Weitere mögliche Tools:</h4>
              <ul>
                <li>Google Tag Manager (verwaltungstechnisch, ohne Datenverarbeitung selbst)</li>
                <li>YouTube/Vimeo-Einbettung (bei eingebetteten Videos)</li>
                <li>Google Fonts lokal oder über API (DSGVO-relevant!)</li>
                <li>Hotjar, Matomo, LinkedIn Insight Tag – nur bei Bedarf</li>
              </ul>
              <p>
                <strong>Hinweis:</strong> Alle Dienste werden nur nach Ihrer Zustimmung über das
                Consent-Tool aktiviert. Ohne Zustimmung erfolgt keine Tracking-Verarbeitung.
              </p>
            </section>

            <section>
              <h2>7. Demo-Projekte</h2>
              <p>
                Einige unserer gezeigten Websites befinden sich noch in Entwicklung oder wurden (noch)
                nicht durch den Kunden final abgenommen.
              </p>
              <p>Sie dienen ausschließlich der Vorschau und Darstellung unserer Leistungen.</p>
              <p>Alle verwendeten Inhalte bleiben Eigentum der jeweiligen Rechteinhaber.</p>
            </section>

            <section>
              <h2>8. Ihre Rechte</h2>
              <p>Sie haben das Recht auf:</p>
              <ul>
                <li>Auskunft (Art 15 DSGVO)</li>
                <li>Berichtigung/Löschung (Art 16/17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art 20 DSGVO)</li>
                <li>Widerspruch gegen Verarbeitung (Art 21 DSGVO)</li>
                <li>Widerruf Ihrer Einwilligung (Art 7 Abs 3 DSGVO)</li>
              </ul>
            </section>

            <section>
              <h2>9. Kontakt Datenschutz</h2>
              <p>
                <strong>Red Rabbit GmbH</strong>
                <br />
                Grabnergasse 8/8, 1060 Wien
                <br />
                T: +43 676 9000 955
                <br />
                E: office@redrabbit.media
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
