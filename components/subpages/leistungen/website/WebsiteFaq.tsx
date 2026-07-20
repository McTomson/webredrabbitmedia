import Faq, { type FaqItem } from "@/components/relaunch/Faq";

/**
 * FAQ — zweispaltig: links sticky Ink-Label + Ueberschrift mit rotem
 * Schlusspunkt, rechts das echte rr-faq-Akkordeon (components/relaunch/
 * Faq.tsx, unveraendert importiert, UNTERSEITEN_STIL.md §0/§5). Liefert das
 * FAQPage-JSON-LD automatisch mit. Copy 1:1 aus scratchpad/leistungen-copy.md
 * Abschnitt B, "FAQ".
 */
const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Warum seht ihr den Entwurf ohne Vorkasse, wollt dann aber eine Anzahlung?",
    a: "Weil wir das Risiko tragen, bis du überzeugt bist. Gefällt dir der Entwurf nicht, hat es dich nichts gekostet. Sagst du Ja, arbeiten wir ab da partnerschaftlich, und dann fällt eine faire Anzahlung an. Das ist ehrlicher, als dir vorher Geld abzunehmen und zu hoffen, dass es passt.",
  },
  {
    q: "Ist das ein Baukasten wie Wix?",
    a: "Nein. Beim Baukasten schiebst du selbst Blöcke hin und her und das Ergebnis sieht aus wie bei tausend anderen. Wir bauen deine Seite von Hand, auf deinen Betrieb. Dabei sein ist nicht dasselbe wie sichtbar sein.",
  },
  {
    q: "Wie lange dauert das?",
    a: "Den ersten Entwurf siehst du schnell, meist innerhalb weniger Tage. Danach feilen wir so lange, bis es passt. Ohne endlose Meetings, den großen Teil der Arbeit machen wir, nicht du.",
  },
];

export default function WebsiteFaq() {
  return (
    <section className="rr-section lw-faq">
      <div className="rr-wrap rr-narrow lw-faq__grid">
        <div className="lw-faq__label">
          <p className="rr-eyebrow-lg">Häufige Fragen</p>
          <h2 className="rr-statement lw-faq__heading">
            Häufig gefragt<span className="lw-faq__dot">.</span>
          </h2>
        </div>
        <div className="lw-faq__accordion">
          <Faq items={FAQ_ITEMS} id="faq-website" />
        </div>
      </div>
    </section>
  );
}
