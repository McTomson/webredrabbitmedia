import Faq, { type FaqItem } from "@/components/relaunch/Faq";

/**
 * FAQ — zweispaltig: links sticky Ink-Label + Ueberschrift mit rotem
 * Schlusspunkt, rechts das echte rr-faq-Akkordeon (components/relaunch/
 * Faq.tsx, unveraendert importiert, UNTERSEITEN_STIL.md §0/§5). Liefert das
 * FAQPage-JSON-LD automatisch mit. Copy 1:1 aus scratchpad/website-copy-v2.md
 * Abschnitt 8, "FAQ" (6 Fragen).
 */
const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Was kostet so eine Website ungefähr?",
    a: "Das kommt drauf an, wie viel Seite du brauchst, aber es ist immer ein Fixpreis, kein Stundensatz, bei dem am Ende eine böse Überraschung steht. Die drei Stufen mit den echten Zahlen stehen auf der Preisseite, da schaust du dir in Ruhe an, was zu dir passt. Und den Entwurf siehst du sowieso, bevor du dich festlegst.",
  },
  {
    q: "Wie lange dauert das Ganze?",
    a: "Den ersten Entwurf siehst du schnell, meist in ein paar Tagen. Danach feilen wir so lange, bis es passt. Ohne endlose Meetings, den großen Teil der Arbeit machen wir, nicht du.",
  },
  {
    q: "Gehört mir die Website am Ende wirklich?",
    a: "Ja, ganz. Sobald die Seite live ist, gehört sie dir, mit Domain, Texten, Bildern und allem, was drinsteckt. Wir sitzen nicht auf deinem Zugang und halten dich nicht fest. Willst du irgendwann zu jemand anderem, nimmst du deine Seite einfach mit.",
  },
  {
    q: "Kann ich Texte und Bilder selbst ändern?",
    a: "Ja. Du bekommst einen einfachen Zugang, in dem du Texte und Bilder mit ein paar Klicks selbst tauschst, ganz ohne Technikwissen. Und wenn du lieber willst, dass wir das übernehmen, sagst du kurz Bescheid und wir ziehen es für dich nach.",
  },
  {
    q: "Ist die Seite rechtlich sauber, also Impressum und Datenschutz?",
    a: "Ja. Impressum und Datenschutzerklärung setzen wir nach österreichischem Recht auf, und die Seite ist so gebaut, dass sie die üblichen Vorgaben erfüllt. Du stehst also nicht mit einem Bein im Risiko, nur weil dir eine Pflichtangabe gefehlt hat.",
  },
  {
    q: "Warum seht ihr mir den Entwurf ohne Vorkasse, wollt dann aber eine Anzahlung?",
    a: "Weil wir das Risiko tragen, bis du überzeugt bist. Wir zeigen dir deine Seite zuerst fertig, weil wir ziemlich sicher sind, dass sie sitzt. Gefällt sie dir nicht, hat es dich nichts gekostet. Sagst du Ja, arbeiten wir ab da partnerschaftlich, und dann fällt eine faire Anzahlung an. Das ist ehrlicher, als dir vorher Geld abzunehmen und zu hoffen, dass es passt.",
  },
];

export default function WebsiteFaq() {
  return (
    <section className="rr-section lw-faq">
      <div className="rr-wrap rr-narrow lw-faq__grid">
        <div className="lw-faq__label">
          <p className="rr-eyebrow-lg">Häufige Fragen</p>
          <h2 className="rr-statement lw-faq__heading">
            Bevor du baust<span className="lw-faq__dot">.</span>
          </h2>
        </div>
        <div className="lw-faq__accordion">
          <Faq items={FAQ_ITEMS} id="faq-website" />
        </div>
      </div>
    </section>
  );
}
