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
  {
    q: "Gehört mir die Website am Ende wirklich?",
    a: "Ja, ganz. Sobald die Seite live ist, gehört sie dir, mit Domain, Texten, Bildern und allem, was drinsteckt. Wir sitzen nicht auf deinem Zugang und halten dich nicht fest. Willst du irgendwann zu jemand anderem, nimmst du deine Seite einfach mit.",
  },
  {
    q: "Muss ich mich um die Technik kümmern?",
    a: "Nein. Hosting, Updates und Backups laufen bei uns im Hintergrund mit, ohne dass du etwas tun musst. Du sollst dich um deinen Betrieb kümmern, nicht um Server oder Zertifikate. Wenn mal etwas klemmt, meldest du dich und wir kümmern uns.",
  },
  {
    q: "Kann ich selbst Texte und Bilder ändern?",
    a: "Ja. Du bekommst einen einfachen Zugang, in dem du Texte und Bilder mit ein paar Klicks selbst tauschst, ganz ohne Technikwissen. Und wenn du lieber willst, dass wir das übernehmen, sagst du kurz Bescheid und wir ziehen es für dich nach.",
  },
  {
    q: "Ist die Seite rechtlich sauber (Impressum, Datenschutz)?",
    a: "Ja. Impressum und Datenschutzerklärung setzen wir nach österreichischem Recht auf, und die Seite ist so gebaut, dass sie die üblichen Vorgaben erfüllt. Du stehst also nicht mit einem Bein im Risiko, nur weil dir eine Pflichtangabe gefehlt hat.",
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
