import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import FaqDemoClient from '@/components/subpages/FaqDemoClient';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';

// Rohteile der FAQ-Seite (Template = ueber-uns/kontakt-demo, Inhalte FAQ).
// WICHTIG: Reads muessen IN der Komponente passieren (pro Request), nicht auf
// Modulebene — Next watched fs-Reads nicht, Edits an demo.* waeren im Dev-Server
// sonst unsichtbar bis zum Neustart (Lesson vom 14.07., ueber-uns).
const DEMO_DIR = path.join(process.cwd(), 'components/subpages/faq-demo');
const readDemo = (f: string) => fs.readFileSync(path.join(DEMO_DIR, f), 'utf8');

export const metadata: Metadata = {
  title: 'FAQ · Red Rabbit Media',
  description:
    'Ehrliche Antworten auf die häufigsten Fragen: Preise, Ablauf, Vorkasse, Förderung, Sichtbarkeit bei Google und in KI, Eigentum an der Website und Hosting.',
  robots: { index: false, follow: false },
};

// Die 14 echten FAQ (wortgleich aus app/faq/page.tsx). Quelle fuer das
// FAQPage-JSON-LD; die sichtbaren Antworten im Akkordeon (demo.body.html)
// sind identisch formuliert.
const faq = [
  {
    q: 'Was kostet eine Website bei euch?',
    a: 'Wir arbeiten mit drei klaren Paketen: Starter ab 950 Euro, Business ab 2.900 Euro und Premium ab 4.900 Euro. Was genau du brauchst, besprechen wir vorher und halten es fest, ohne versteckte Kosten.',
  },
  {
    q: 'Muss ich in Vorkasse gehen?',
    a: 'Nein. Du siehst zuerst einen echten Entwurf, ganz ohne Vorkasse. Eine Anzahlung fällt erst an, wenn dir der Vorschlag gefällt und du den Auftrag erteilst. Bis dahin liegt das Risiko bei uns.',
  },
  {
    q: 'Wie lange dauert es, bis meine Website fertig ist?',
    a: 'Einen ersten Entwurf bekommst du in der Regel innerhalb von rund einer Woche. Wie lange die fertige Seite dauert, hängt vom Umfang ab. Wir nennen dir vorher einen realistischen Zeitrahmen.',
  },
  {
    q: 'Wie läuft die Zusammenarbeit ab?',
    a: 'Kurz gesagt: Wir sprechen über deinen Betrieb und dein Ziel, du bekommst einen Entwurf ohne Vorkasse, wir passen ihn an, bis er passt, und gehen dann live. Ein Ansprechpartner begleitet dich durch den ganzen Weg.',
  },
  {
    q: 'Bekomme ich eine individuelle Seite oder einen Baukasten?',
    a: 'Eine individuell gebaute Seite. Wir verwenden keine fertigen Baukasten-Vorlagen, sondern gestalten Aufbau, Text und Design für deinen Betrieb.',
  },
  {
    q: 'Gibt es eine Förderung?',
    a: 'Für österreichische Kleinbetriebe kann die KMU.DIGITAL-Förderung einen Teil der Kosten übernehmen. Wir prüfen mit dir, ob das für dein Projekt in Frage kommt.',
  },
  {
    q: 'Muss ich einen Wartungsvertrag abschließen?',
    a: 'Nein. Unser Wartungs- und Optimierungs-Abo ist freiwillig, ohne Mindestlaufzeit und jederzeit kündbar. Du kannst deine Seite auch selbst pflegen oder die Betreuung uns überlassen.',
  },
  {
    q: 'Wie lange dauert es, bis ich bei Google gefunden werde?',
    a: 'SEO wirkt langfristig. Erste Bewegungen sind oft nach einigen Wochen sichtbar, stabile Rankings brauchen meist mehrere Monate. Wer schnelle Garantien verspricht, ist unseriös.',
  },
  {
    q: 'Könnt ihr Platz 1 bei Google garantieren?',
    a: 'Nein, und das kann niemand seriös. Wir bauen eine starke technische Basis, guten Inhalt und die richtigen Signale. Über die Platzierung entscheidet am Ende Google.',
  },
  {
    q: 'Was bedeutet KI-Sichtbarkeit?',
    a: 'Immer mehr Menschen fragen ChatGPT, Gemini oder Perplexity statt Google. KI-Sichtbarkeit heißt, dass dein Betrieb in diesen Antworten vorkommt. Wir bauen deine Seite so auf, dass sie auch von KI-Systemen gut verstanden wird.',
  },
  {
    q: 'Bekomme ich ein Dashboard?',
    a: 'Ab dem Business-Paket ist ein Dashboard gratis dabei. Es zeigt dir in Klartext, wie sichtbar du bist und wie viele Anfragen über die Seite reinkommen.',
  },
  {
    q: 'Gehört die Website danach mir?',
    a: 'Ja. Deine Inhalte, deine Domain und dein Auftritt gehören dir. Wir binden dich nicht mit künstlichen Hürden an uns, sondern wollen dich mit Leistung halten. Die genauen Punkte hält dein Angebot fest.',
  },
  {
    q: 'Wie ist das mit Hosting und Domain?',
    a: 'Wir kümmern uns um das Hosting und die Domain oder nutzen deine bestehende, ganz wie es für dich passt. Wir klären das vor dem Start und halten die Details im Angebot fest.',
  },
  {
    q: 'Für wen seid ihr NICHT die richtige Wahl?',
    a: 'Wenn du das Billigste vom Billigen suchst und Sichtbarkeit egal ist, passen wir nicht. Wir arbeiten mit Betrieben, die ihren Auftritt ernst nehmen und echte Anfragen wollen, nicht nur eine Seite zum Abhaken.',
  },
];

export default function FaqPreviewPage() {
  const css = readDemo('demo.css');
  const html = readDemo('demo.body.html');
  const js = readDemo('demo.engine.jstext');
  return (
    <>
      {/* FAQPage-Schema (SEO): macht die 14 Fragen fuer Google als Rich Result
          lesbar. Quelle = exakt das faq-Array oben; identisch zur Live-/faq. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />
      {/* Fonts wie in der Demo (DM Sans, Instrument Sans, Crimson Pro). */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
      />
      {/* Hamburger-Menue der Hauptseite. Wrapper liefert NUR die .rr-Font-Variablen
          fuer das styled-jsx-gekapselte Menue; der Demo-Inhalt bleibt bewusst
          AUSSERHALB des .rr-Scopes (keine Style-Leaks in demo.css). */}
      <div
        className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}
        style={{ background: 'transparent' }}
      >
        <RelaunchMenu />
      </div>
      <FaqDemoClient css={css} html={html} js={js} />
    </>
  );
}
