import Faq, { type FaqItem } from '@/components/relaunch/Faq';

/**
 * Talos-FAQ v2 — Muster 1:1 aus components/subpages/leistungen/website/
 * WebsiteFaq.tsx (zweispaltig, sticky Ink-Label links, echtes rr-faq-
 * Akkordeon rechts, liefert FAQPage-JSON-LD automatisch mit). 9 Fragen aus
 * docs/specs/TALOS_COPY_V2_2026-07-22_ENTWURF.md Sektion 10, Frage 9 =
 * Variante A.
 */
const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Was kostet das alles?',
    a: 'Die Website selbst kostet einen festen Preis, den du vorher kennst. Alles, was Talos zusätzlich macht, buchst du einzeln pro Monat, jede Fähigkeit für sich. Du zahlst also nur für das, was du wirklich nutzt. Die genauen Preise stehen offen auf der Preisseite.',
  },
  {
    q: 'Und wenn ich kündige, ist dann meine Seite weg?',
    a: 'Nein. Deine Website und deine Domain gehören dir und bleiben dir. Kündigst du eine Fähigkeit, hört einfach dieser eine Kollege auf zu arbeiten. Die Seite läuft weiter. Keine Vertragsfalle, kein Lösegeld für deine eigene Domain.',
  },
  {
    q: 'Klingt das dann auch nach mir und meinem Betrieb?',
    a: 'Ja. Bevor Talos loslegt, fragt er dich nach Textbeispielen, nach deiner Sprache und deinem Ton. Alles, was danach entsteht, ist in deiner Art. Und weil jeder Entwurf zuerst bei dir landet und du ihn freigibst, geht nie etwas raus, hinter dem du nicht stehst.',
  },
  {
    q: 'Was, wenn Talos einen Fehler macht?',
    a: 'Dann fällt er dir auf, bevor ihn ein Kunde sieht, weil nichts ohne deine Freigabe rausgeht. Wo du eine Aufgabe auf Selbstlauf gestellt hast, siehst du im Dashboard mit, was passiert, und hältst sie jederzeit an.',
  },
  {
    q: 'Wie viel Aufwand ist das für mich?',
    a: 'Wenig. Am Anfang gibst du Talos ein paar Beispiele, damit er dich kennenlernt. Danach liest du nur noch drüber und klickst auf Freigeben, oder du stellst eine Aufgabe ganz auf Selbstlauf. Mehr ist es nicht.',
  },
  {
    q: 'Warum nicht einfach WordPress oder ein Baukasten?',
    a: 'Bei WordPress oder einem Baukasten tauschst du Texte und Bilder aus, mehr nicht. Die Seite steht danach still und wartet. Sie arbeitet nicht mit dir und nicht für dich. Genau das ist der Unterschied. Bei uns bekommst du eine Seite, in der ein Kollege sitzt, der Anfragen auffängt, schreibt und dafür sorgt, dass man dich findet.',
  },
  {
    q: 'Muss ich mich jetzt sofort für alles entscheiden?',
    a: 'Nein. Du startest mit deiner Website, das reicht völlig. Jede Fähigkeit kannst du später dazunehmen, wenn du merkst, dass du sie brauchst. Und genauso wieder abbestellen. Nichts davon musst du heute entscheiden.',
  },
  {
    q: 'Wie rede ich eigentlich mit Talos?',
    a: 'Ganz normal, per Mail oder über Telegram. Du schreibst ihm, was du brauchst, so wie du einem Mitarbeiter schreiben würdest. Er antwortet, legt dir Entwürfe hin und wartet auf dein Ja.',
  },
  {
    q: 'Ist das nicht dieses Automatik-Zeug, wo dann irgendein Roboter in meinem Namen Unsinn verschickt?',
    a: 'Verstehen wir, die Frage ist berechtigt. Ehrliche Antwort: Ja, im Hintergrund arbeitet moderne Software für dich, das verschweigen wir nicht. Aber es läuft nichts wild vor sich hin. Nichts verlässt dein Haus ohne deine Freigabe, und alles entsteht in deiner Art, nicht in irgendeiner Fabriksprache. Du bleibst der Chef, Talos ist der Mitarbeiter, der dir zuarbeitet.',
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
