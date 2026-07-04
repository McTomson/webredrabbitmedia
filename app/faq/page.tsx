import type { Metadata } from "next";
import PageShell from "@/components/relaunch/PageShell";
import Faq from "@/components/relaunch/Faq";

export const metadata: Metadata = {
  title: "FAQ | Red Rabbit Media",
  description:
    "Antworten auf die häufigsten Fragen: Preise, Dauer, Ablauf, Vorkasse, KMU.DIGITAL-Förderung, Wartung, SEO, KI-Sichtbarkeit, Eigentum an der Website und Hosting.",
  alternates: { canonical: "https://web.redrabbit.media/faq" },
};

const faq = [
  {
    q: "Was kostet eine Website bei euch?",
    a: "Wir arbeiten mit drei klaren Paketen: Starter ab 950 Euro, Business ab 2.900 Euro und Premium ab 4.900 Euro. Was genau du brauchst, besprechen wir vorher und halten es fest, ohne versteckte Kosten.",
  },
  {
    q: "Muss ich in Vorkasse gehen?",
    a: "Nein. Du siehst zuerst einen echten Entwurf, ganz ohne Vorkasse. Eine Anzahlung fällt erst an, wenn dir der Vorschlag gefällt und du den Auftrag erteilst. Bis dahin liegt das Risiko bei uns.",
  },
  {
    q: "Wie lange dauert es, bis meine Website fertig ist?",
    a: "Einen ersten Entwurf bekommst du in der Regel innerhalb von rund einer Woche. Wie lange die fertige Seite dauert, hängt vom Umfang ab. Wir nennen dir vorher einen realistischen Zeitrahmen.",
  },
  {
    q: "Wie läuft die Zusammenarbeit ab?",
    a: "Kurz gesagt: Wir sprechen über deinen Betrieb und dein Ziel, du bekommst einen Entwurf ohne Vorkasse, wir passen ihn an, bis er passt, und gehen dann live. Ein Ansprechpartner begleitet dich durch den ganzen Weg.",
  },
  {
    q: "Bekomme ich eine individuelle Seite oder einen Baukasten?",
    a: "Eine individuell gebaute Seite. Wir verwenden keine fertigen Baukasten-Vorlagen, sondern gestalten Aufbau, Text und Design für deinen Betrieb.",
  },
  {
    q: "Gibt es eine Förderung?",
    a: "Für österreichische Kleinbetriebe kann die KMU.DIGITAL-Förderung einen Teil der Kosten übernehmen. Wir prüfen mit dir, ob das für dein Projekt in Frage kommt.",
  },
  {
    q: "Muss ich einen Wartungsvertrag abschließen?",
    a: "Nein. Unser Wartungs- und Optimierungs-Abo ist freiwillig, ohne Mindestlaufzeit und jederzeit kündbar. Du kannst deine Seite auch selbst pflegen oder die Betreuung uns überlassen.",
  },
  {
    q: "Wie lange dauert es, bis ich bei Google gefunden werde?",
    a: "SEO wirkt langfristig. Erste Bewegungen sind oft nach einigen Wochen sichtbar, stabile Rankings brauchen meist mehrere Monate. Wer schnelle Garantien verspricht, ist unseriös.",
  },
  {
    q: "Könnt ihr Platz 1 bei Google garantieren?",
    a: "Nein, und das kann niemand seriös. Wir bauen eine starke technische Basis, guten Inhalt und die richtigen Signale. Über die Platzierung entscheidet am Ende Google.",
  },
  {
    q: "Was bedeutet KI-Sichtbarkeit?",
    a: "Immer mehr Menschen fragen ChatGPT, Gemini oder Perplexity statt Google. KI-Sichtbarkeit heißt, dass dein Betrieb in diesen Antworten vorkommt. Wir bauen deine Seite so auf, dass sie auch von KI-Systemen gut verstanden wird.",
  },
  {
    q: "Bekomme ich ein Dashboard?",
    a: "Ab dem Business-Paket ist ein Dashboard gratis dabei. Es zeigt dir in Klartext, wie sichtbar du bist und wie viele Anfragen über die Seite reinkommen.",
  },
  {
    q: "Gehört die Website danach mir?",
    a: "Ja. Deine Inhalte, deine Domain und dein Auftritt gehören dir. Wir binden dich nicht mit künstlichen Hürden an uns, sondern wollen dich mit Leistung halten. Die genauen Punkte hält dein Angebot fest.",
  },
  {
    q: "Wie ist das mit Hosting und Domain?",
    a: "Wir kümmern uns um das Hosting und die Domain oder nutzen deine bestehende, ganz wie es für dich passt. Wir klären das vor dem Start und halten die Details im Angebot fest.",
  },
  {
    q: "Für wen seid ihr NICHT die richtige Wahl?",
    a: "Wenn du das Billigste vom Billigen suchst und Sichtbarkeit egal ist, passen wir nicht. Wir arbeiten mit Betrieben, die ihren Auftritt ernst nehmen und echte Anfragen wollen, nicht nur eine Seite zum Abhaken.",
  },
];

export default function FaqPage() {
  return (
    <PageShell
      eyebrow="FAQ"
      title="Fragen? Hier die ehrlichen Antworten."
      intro="Die häufigsten Fragen rund um Preis, Ablauf, Sichtbarkeit und Zusammenarbeit. Wenn deine Frage fehlt, ruf uns einfach an oder schreib uns."
    >
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <Faq items={faq} id="faq-all" />
        </div>
      </section>
    </PageShell>
  );
}
