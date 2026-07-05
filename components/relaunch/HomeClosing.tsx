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
      {/* Sektion 6: Zahlen-Statement — grosszuegig geluftet, viel Luft vor der Liste */}
      <section
        className="rr-section"
        style={{ paddingTop: "clamp(120px, 16vw, 220px)", paddingBottom: "clamp(56px, 8vh, 104px)" }}
      >
        <div className="rr-wrap">
          <p className="rr-statement" style={{ maxWidth: "14em" }}>
            Websites für Handwerk, Gastronomie, Beauty und Immobilien. Gebaut, betreut und sichtbar gemacht. Unter anderem für:
          </p>
          <p className="rr-meta" style={{ marginTop: 24 }}>
            PLATZHALTER: Jahres- und Projektzahl folgen, sobald belegt (Tomson liefert). Einzeiler der B2B-Namen bitte prüfen.
          </p>
        </div>
      </section>

      {/* Sektion 7: Firmen-Liste, 5 Reihen a 3 — luftige Zeilen wie das
          all-turtles-Portfolio-Raster (grosser vertikaler Rhythmus). */}
      <section
        className="rr-section"
        style={{ paddingTop: "clamp(24px, 4vh, 64px)", paddingBottom: "clamp(120px, 16vw, 220px)" }}
      >
        <div className="rr-wrap" style={{ display: "grid", gap: "clamp(72px, 10vw, 150px)" }}>
          {Array.from({ length: Math.ceil(COMPANIES.length / 3) }, (_, row) => (
            <div className="rr-companyrow" key={row}>
              {COMPANIES.slice(row * 3, row * 3 + 3).map((c) => (
                <div key={c.name}>
                  <p className="rr-company-name">{c.name}</p>
                  <p className="rr-company-line" style={{ marginTop: 10 }}>{c.line}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Sektion 8: Abschluss-CTA — eigener luftiger Block */}
      <section
        className="rr-section"
        style={{ paddingTop: "clamp(80px, 12vw, 180px)", paddingBottom: "clamp(120px, 18vw, 240px)" }}
      >
        <div className="rr-wrap">
          <p className="rr-display-2" style={{ maxWidth: "10em" }}>
            Du willst eine Website, die man findet? Reden wir.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: "clamp(40px, 6vh, 64px)" }}>
            <Link className="rr-btn rr-btn--primary" href="/kontakt">Projekt anfragen</Link>
            <a className="rr-btn rr-btn--secondary" href="tel:+436769000955">+43 676 9000 955</a>
          </div>
        </div>
      </section>
    </>
  );
}
