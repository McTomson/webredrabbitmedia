import type { Metadata } from "next";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import { crimson, dmsans, fraunces, grotesk } from "@/lib/relaunch/fonts";
import "@/app/styleguide/styleguide.css";
import "@/components/subpages/legal-preview.css";

/**
 * Impressum im Relaunch-Look (Preview, noindex). Rechtstexte 1:1 aus
 * app/impressum/ImpressumClient.tsx uebernommen — nichts umformuliert.
 */
export const metadata: Metadata = {
  title: "Impressum · Red Rabbit Media",
  description: "Rechtliche Informationen über Red Rabbit Media.",
  robots: { index: false, follow: false },
};

export default function ImpressumPreviewPage() {
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
              Impressum<span className="rrl-dot">.</span>
            </h1>
            <p>Rechtliche Informationen über Red Rabbit Media.</p>
          </header>

          <div className="rrl-body">
            <section>
              <h2>Firmenangaben</h2>
              <p>
                <strong>Red Rabbit GmbH</strong>
              </p>
              <p>
                Grabnergasse 8/8
                <br />
                1060 Wien, Österreich
              </p>
              <p>
                <strong>Firmenbuchnummer:</strong> FN 516936 a
                <br />
                <strong>Firmenbuchgericht:</strong> Handelsgericht Wien
                <br />
                <strong>UID-Nummer:</strong> ATU 74636904
              </p>
            </section>

            <section>
              <h2>Kontakt</h2>
              <p>
                <strong>Telefon:</strong> +43 676 9000 955
                <br />
                <strong>E-Mail:</strong> office@redrabbit.media
                <br />
                <strong>Web:</strong> www.redrabbit.media
              </p>
            </section>

            <section>
              <h2>Unternehmensgegenstand</h2>
              <p>
                <strong>Unternehmensgegenstand:</strong> Webdesign &amp; digitale Dienstleistungen
              </p>
            </section>

            <section>
              <h2>Mitgliedschaften &amp; Rechtliche Grundlagen</h2>
              <p>Mitglied der Wirtschaftskammer Wien</p>
              <p>
                <strong>Gewerbeordnung:</strong>{" "}
                <a href="https://www.ris.bka.gv.at" target="_blank" rel="noopener noreferrer">
                  www.ris.bka.gv.at
                </a>
              </p>
            </section>

            <section>
              <h2>Datenschutzerklärung</h2>
              <p>
                Red Rabbit GmbH (im Folgenden &quot;wir&quot;) verarbeitet personenbezogene Daten
                ausschließlich auf Grundlage der gesetzlichen Vorgaben (insb. DSGVO, TKG 2021).
              </p>

              <h3>1. Welche Daten wir verarbeiten</h3>
              <ul>
                <li>Name, E-Mail, Telefonnummer, Unternehmensdaten (bei Anfragen, Bestellungen etc.)</li>
                <li>technische Daten (z. B. IP-Adresse, Browsertyp, Zugriffszeitpunkte beim Besuch der Website)</li>
                <li>ggf. Inhalte von Kontaktformularen</li>
              </ul>

              <h3>2. Zweck und Rechtsgrundlagen</h3>
              <p>Wir verarbeiten deine Daten zur:</p>
              <ul>
                <li>Anbahnung und Erfüllung von Verträgen (Art 6 Abs 1 lit b DSGVO)</li>
                <li>Erfüllung rechtlicher Verpflichtungen (Art 6 Abs 1 lit c DSGVO)</li>
                <li>Direktwerbung, Marketing &amp; Kundengewinnung (berechtigtes Interesse, Art 6 Abs 1 lit f DSGVO)</li>
                <li>Nur mit Einwilligung: Newsletter &amp; Datenweitergabe an Dritte (Art 6 Abs 1 lit a DSGVO)</li>
              </ul>

              <h3>3. Speicherdauer</h3>
              <p>Wir speichern personenbezogene Daten nur so lange, wie es notwendig ist:</p>
              <ul>
                <li>Vertragliche und steuerliche Aufbewahrungspflichten: bis zu 7 bzw. 12 Jahre</li>
                <li>Für Marketingzwecke: bis zum Widerruf oder Wegfall des berechtigten Interesses</li>
                <li>Bei laufenden Verfahren: entsprechend gesetzlicher Verjährungsfristen (bis zu 30 Jahre)</li>
              </ul>

              <h3>4. Weitergabe an Dritte</h3>
              <p>
                Daten werden nur an Auftragsverarbeiter (z. B. Hosting, IT, Buchhaltung) weitergegeben,
                sofern erforderlich. Alle Dritten sind vertraglich zur DSGVO-konformen Verarbeitung
                verpflichtet.
              </p>

              <h3>5. Verpflichtung zur Datenbereitstellung</h3>
              <p>
                Die Bereitstellung personenbezogener Daten ist zur Vertragserfüllung erforderlich. Ohne
                diese Daten ist ein Vertragsabschluss nicht möglich.
              </p>

              <h3>6. Cookies</h3>
              <p>
                Unsere Website verwendet technisch notwendige und funktionale Cookies, um die Darstellung
                zu optimieren und Angriffe abzuwehren. Diese Cookies benötigen keine Einwilligung (Art 6
                Abs 1 lit f DSGVO).
              </p>
              <p>
                Du kannst Cookies über deinen Browser jederzeit deaktivieren. Die Funktionalität der
                Website kann dadurch eingeschränkt sein.
              </p>

              <h3>7. Automatisierte Entscheidungsfindung</h3>
              <p>Wir treffen keine automatisierten Entscheidungen im Sinne von Art 22 DSGVO.</p>

              <h3>8. Deine Rechte</h3>
              <p>Du hast jederzeit das Recht auf:</p>
              <ul>
                <li>Auskunft (Art 15 DSGVO)</li>
                <li>Berichtigung (Art 16 DSGVO)</li>
                <li>Löschung (Art 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art 18 DSGVO)</li>
                <li>Widerspruch (Art 21 DSGVO)</li>
                <li>Datenübertragbarkeit (Art 20 DSGVO)</li>
                <li>Widerruf erteilter Einwilligungen (Art 7 DSGVO)</li>
              </ul>
              <p>
                Wenn du glaubst, dass wir deine Rechte verletzt haben, kannst du dich bei der
                Datenschutzbehörde beschweren:{" "}
                <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer">
                  www.dsb.gv.at
                </a>
              </p>

              <h3>9. Kontakt für Datenschutzanfragen</h3>
              <p>
                Red Rabbit GmbH
                <br />
                Grabnergasse 8/8, 1060 Wien
                <br />
                T: +43 676 9000 955
                <br />
                E: office@redrabbit.media
              </p>
            </section>

            <section>
              <h2>Hinweis zu Demo-Seiten</h2>
              <p>
                Die auf dieser Website gezeigten Beispielseiten und Projekt-Demos befinden sich teilweise
                in Bearbeitung und wurden noch nicht final vom Kunden freigegeben. Sie dienen
                ausschließlich als Designvorschau. Alle dargestellten Marken, Texte und Bilder bleiben
                Eigentum der jeweiligen Rechteinhaber.
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
