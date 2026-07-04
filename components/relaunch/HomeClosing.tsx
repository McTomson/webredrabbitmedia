import Link from "next/link";
import { BASE_PROJECTS } from "@/lib/relaunch/projects";

/**
 * Blaupause Sektionen 6-8: Zahlen-Statement (74px) -> Firmen-Liste (5 Reihen a 3,
 * Name 16px akzentfarben + grauer Einzeiler 23px) -> Riesen-CTA (89px).
 * Zahlen ohne Beleg = realistisch gesetzt + KLAR MARKIERT (Platzhalter-Regel 04.07.).
 * B2B-Namen rein typografisch, EINE Farbe/Art (Tomson 04.07.).
 */

// Zusammenarbeiten aus der Immobilien-Zeit (decisions-log 04.07.). Einzeiler
// bewusst neutral gehalten — nur was ohne Recherche-Risiko stimmt (fail-closed).
const B2B: Array<{ name: string; line: string }> = [
  { name: "SIGNA", line: "Immobilien- und Handelsgruppe" },
  { name: "6B47", line: "Immobilienentwicklung" },
  { name: "Tillmann & Kraus", line: "Zusammenarbeit Immobilien" },
  { name: "MBT", line: "Zusammenarbeit Immobilien" },
  { name: "Sans Souci", line: "Zusammenarbeit Immobilien" },
  { name: "Die Vorsorgewohnungs GmbH", line: "Vorsorgewohnungen" },
  { name: "Phils.place", line: "Zusammenarbeit Immobilien" },
];

const COMPANIES: Array<{ name: string; line: string }> = [
  ...BASE_PROJECTS.slice(0, 8).map((p) => ({ name: p.name, line: p.line })),
  ...B2B,
];

export default function HomeClosing() {
  return (
    <>
      {/* Sektion 6: Zahlen-Statement */}
      <section className="rr-section">
        <div className="rr-wrap">
          <p className="rr-statement" style={{ maxWidth: "14em" }}>
            Websites für Handwerk, Gastronomie, Beauty und Immobilien. Gebaut, betreut und sichtbar gemacht. Unter anderem für:
          </p>
          <p className="rr-meta" style={{ marginTop: 18 }}>
            PLATZHALTER: Jahres- und Projektzahl folgen, sobald belegt (Tomson liefert). Einzeiler der B2B-Namen bitte prüfen.
          </p>
        </div>
      </section>

      {/* Sektion 7: Firmen-Liste, 5 Reihen a 3 */}
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap" style={{ display: "grid", gap: "clamp(40px, 6vw, 72px)" }}>
          {Array.from({ length: Math.ceil(COMPANIES.length / 3) }, (_, row) => (
            <div className="rr-companyrow" key={row}>
              {COMPANIES.slice(row * 3, row * 3 + 3).map((c) => (
                <div key={c.name}>
                  <p className="rr-company-name">{c.name}</p>
                  <p className="rr-company-line">{c.line}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Sektion 8: Abschluss-CTA */}
      <section className="rr-section">
        <div className="rr-wrap">
          <p className="rr-display-2" style={{ maxWidth: "10em" }}>
            Du willst eine Website, die man findet? Reden wir.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: "clamp(32px, 5vh, 56px)" }}>
            <Link className="rr-btn rr-btn--primary" href="/kontakt">Projekt anfragen</Link>
            <a className="rr-btn rr-btn--secondary" href="tel:+436769000955">+43 676 9000 955</a>
          </div>
        </div>
      </section>
    </>
  );
}
