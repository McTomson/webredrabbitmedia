import Link from "next/link";
import Faq, { type FaqItem } from "@/components/relaunch/Faq";

/**
 * FAQ zweispaltig, gleiches Muster wie components/subpages/leistungen/
 * LeistungenFaq.tsx: links sticky Ink-Label + Ueberschrift mit rotem
 * Schlusspunkt, rechts das echte rr-faq-Akkordeon (components/relaunch/
 * Faq.tsx, unveraendert importiert — liefert automatisch das FAQPage-
 * JSON-LD, siehe Faq.tsx). Drei Fragen 1:1 aus leistungen-copy.md
 * Abschnitt C, FAQ.
 */
const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Läuft das dann alles von allein, ohne dass ich mitrede?",
    a: (
      "Nur wenn du willst. Standardmäßig legt Talos dir alles zur Freigabe " +
      "vor, du entscheidest per Klick, was rausgeht. Erst wenn du einer " +
      "Sache vertraust, kannst du sie auf Autopilot stellen. Du hast immer " +
      "die Hand drauf."
    ),
  },
  {
    q: "Muss ich dafür technisch fit sein?",
    a: (
      "Nein. Wir richten alles ein, du bekommst es fertig. Freigeben ist " +
      "ein Klick, ungefähr so schwer wie eine Nachricht am Handy zu " +
      "beantworten. Und wenn du eine Frage hast, redest du mit einem " +
      "echten Menschen, nicht mit einer Warteschleife."
    ),
  },
  {
    q: "Was, wenn ich später mehr oder weniger will?",
    a: (
      "Kein Problem. Du fängst mit dem an, was du brauchst, und buchst " +
      "Module dazu oder wieder ab. Keine Mindestlaufzeit, kein Abo, das " +
      "dich einsperrt. Du zahlst für die Arbeit, die dir wirklich " +
      "abgenommen wird."
    ),
  },
];

export default function TalosFaq() {
  return (
    <section className="rr-section lt-substance">
      <div className="rr-wrap rr-narrow lt-faq__grid">
        <div className="lt-faq__label">
          <p className="rr-eyebrow-lg">Häufige Fragen</p>
          <h2 className="rr-statement lt-faq__heading">
            Häufig gefragt<span className="lt-faq__dot">.</span>
          </h2>
        </div>
        <div className="lt-faq__accordion">
          <Faq items={FAQ_ITEMS} id="faq-talos" />
          <p className="rr-body" style={{ marginTop: 24 }}>
            <Link href="/preise" className="rr-link">
              Preise ansehen
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
