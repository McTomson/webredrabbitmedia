import Link from "next/link";
import Faq, { type FaqItem } from "@/components/relaunch/Faq";

/**
 * Sektion 8 — rr-faq zweispaltig: links sticky Ink-Label + Ueberschrift mit
 * rotem Schlusspunkt, rechts das echte Faq-Akkordeon (components/relaunch/
 * Faq.tsx, unveraendert importiert — nicht nachgebaut, UNTERSEITEN_STIL.md
 * §0/§5). Die Zweispaltigkeit ist reines Grid-Layout um die echte Komponente.
 */
const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Ist Talos nur so ein Chatbot?",
    a: (
      "Nein. Ein Chatbot beantwortet Fragen und tut sonst nichts. Talos " +
      "erfasst Anfragen, hält den Kontakt warm, fasst nach und legt dir " +
      "alles geordnet vor. Du entscheidest per Klick, was rausgeht. Er " +
      "nimmt dir Arbeit ab, statt nur zu plaudern."
    ),
  },
  {
    q: "Ersetzt Talos meine Website?",
    a: (
      "Andersrum. Talos steckt in deiner Website drin und arbeitet auf " +
      "ihr. Ohne die Seite kein Talos. Du bekommst beides in einem, " +
      "nicht zwei Sachen, um die du dich getrennt kümmern musst."
    ),
  },
  {
    q: "Brauche ich dafür Technik-Wissen?",
    a: (
      "Nein. Wir richten alles ein, du bekommst es fertig. Texte oder " +
      "Bilder änderst du später mit ein paar Klicks, ungefähr so einfach " +
      "wie eine Nachricht tippen. Und wenn du nicht magst, machen wir es " +
      "für dich."
    ),
  },
  {
    q: "Was kostet das?",
    a: (
      "Das hängt davon ab, was du brauchst. Die Website hat einen " +
      "Fixpreis, keine Stundensatz-Lotterie, und die Helfer buchst du " +
      "dazu, wenn du sie willst. Alle Zahlen stehen offen auf der " +
      "Preisseite."
    ),
  },
];

export default function LeistungenFaq() {
  return (
    <section className="rr-section lh-faq">
      <div className="rr-wrap rr-narrow lh-faq__grid">
        <div className="lh-faq__label">
          <p className="wd-eyebrow">Häufige Fragen</p>
          <h2 className="rr-statement lh-faq__heading">
            Häufig gefragt<span className="lh-faq__dot">.</span>
          </h2>
        </div>
        <div className="lh-faq__accordion">
          <Faq items={FAQ_ITEMS} id="faq-leistungen" />
          <p className="rr-body lh-faq__priceLink">
            <Link href="/preise" className="rr-link">
              Preise ansehen
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
