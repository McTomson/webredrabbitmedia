import Faq, { type FaqItem } from '@/components/relaunch/Faq';

/**
 * Talos-FAQ v2 — Muster 1:1 aus components/subpages/leistungen/website/
 * WebsiteFaq.tsx (zweispaltig, sticky Ink-Label links, echtes rr-faq-
 * Akkordeon rechts, liefert FAQPage-JSON-LD automatisch mit). 8 Fragen laut
 * Auftrag, Antworten aus den verbindlichen Fakten (Thomas, 22.07.).
 */
const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Was kostet das und wie funktioniert die Abrechnung?',
    a: 'Jede Fähigkeit von Talos buchst du einzeln, monatlich, und kannst sie jederzeit kündigen. Du entscheidest nicht sofort für alles: Fähigkeiten kannst du auch später noch dazubuchen. Die konkreten Preise stehen auf unserer Preisseite.',
  },
  {
    q: 'Was passiert, wenn ich kündige?',
    a: 'Deine Website und deine Domain bleiben deine, ganz gleich, ob und welche Talos-Fähigkeiten du gebucht hast. Kündigst du eine Fähigkeit, fällt nur diese weg, deine Seite bleibt online.',
  },
  {
    q: 'Klingt das dann überhaupt nach mir?',
    a: 'Genau darum fragt Talos beim Kennenlernen nach Textbeispielen, deiner Sprache und deinem Ton. Alles entsteht in deiner Art, nicht in einer generischen.',
  },
  {
    q: 'Was, wenn Talos einen Fehler macht?',
    a: 'Deswegen gibt es das Freigabe-Prinzip: Im Entwurf-Modus siehst du alles, bevor es rausgeht, und klickst selbst auf Senden. Erst wenn du einer Aufgabe vertraust, stellst du sie auf Selbstlauf, und auch das kannst du jederzeit zurückdrehen.',
  },
  {
    q: 'Wie viel Arbeit habe ich damit?',
    a: 'So wenig wie du willst. Im Entwurf-Modus liest du kurz drüber und klickst, im Selbstlauf gar nichts. Du redest mit Talos per Mail oder Telegram, wann es dir passt.',
  },
  {
    q: 'Warum nicht einfach WordPress oder ein Baukasten?',
    a: 'Weil ein Baukasten dir eine Vorlage gibt und dann aufhört. Talos ist Teil einer echten, für deinen Betrieb gebauten Website und arbeitet ab Tag eins weiter, statt nur dazustehen.',
  },
  {
    q: 'Muss ich mich sofort für Fähigkeiten entscheiden?',
    a: 'Nein. Deine Website kommt mit dem Dashboard, das jede Seite von uns hat. Fähigkeiten für Talos buchst du dazu, wann du willst, auch erst Monate später.',
  },
  {
    q: 'Wie rede ich mit Talos?',
    a: 'Per Mail oder per Telegram, du entscheidest, was dir lieber ist.',
  },
];

export default function TalosFaqV2() {
  return (
    <section className="rr-section tl-section tl-faq">
      <div className="rr-wrap rr-narrow tl-faq__grid">
        <div className="tl-faq__label">
          <p className="wd-eyebrow">Häufige Fragen</p>
          <h2 className="rr-statement tl-faq__heading">
            Bevor du buchst<span className="tl-faq__dot">.</span>
          </h2>
        </div>
        <div className="tl-faq__accordion">
          <Faq items={FAQ_ITEMS} id="faq-talos-v2" />
        </div>
      </div>
    </section>
  );
}
