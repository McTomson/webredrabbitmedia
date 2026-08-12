import type { Metadata } from 'next';
import RegionHome, { type RegionContent } from '@/components/relaunch/RegionHome';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';

/**
 * Bundesland-Landingpage Kaernten, nach dem Steiermark-Rezept
 * (docs/handoffs/NEXT_SESSION_bundesland-landingpages.md). Daten-Basis GSC 11.08.:
 * "homepage erstellen (lassen) kaernten" 88+101 bewiesen. Unique-Winkel: zwei
 * Kundenkreise (Region + Sommergaeste). Branchen-Anker: Ordinationen/Gesundheit
 * (Aerzte-Cluster site-weit ~640 Impressions).
 *
 * Preview: noindex + Canonical auf Preview-Pfad. GO-LIVE: Canonical auf
 * '/webdesign-kaernten', robots.index true, ersetzt die alte Seite am selben Slug.
 */

const CANONICAL_GOLIVE = 'https://web.redrabbit.media/webdesign-kaernten';

export const metadata: Metadata = {
  title: 'Webdesign Kärnten: Warum rufen keine Kunden an?',
  description:
    'Deine Seite ist online, angerufen wird trotzdem der andere. Woran das liegt? Steht auf der Seite. Vorschlag gratis vorab ✓',
  alternates: { canonical: '/webdesign-kaernten' },
  openGraph: {
    title: 'Webdesign Kärnten: Warum rufen keine Kunden an?',
    description:
      'Deine Seite ist online, angerufen wird trotzdem der andere. Woran das liegt? Steht auf der Seite. Vorschlag gratis vorab ✓',
    type: 'website',
    locale: 'de_AT',
    url: CANONICAL_GOLIVE,
    images: [{ url: '/og/og-image-redrabbit.jpg', width: 1200, height: 630, alt: 'Red Rabbit Media, Webdesign Kärnten aus Österreich' }],
  },
};

const kaernten: RegionContent = {
  name: 'Kaernten',
  kiStatement:
    'Wenn jemand die KI fragt, wer in Kärnten sein Problem löst, soll deine Seite der Grund für die Antwort sein.',
  problemBody:
    'In Kärnten hat fast jeder Betrieb zwei Sorten Kunden: die aus der Region und die, die nur im Sommer da sind. Beide suchen online, bevor sie anrufen. Eine Homepage, die bei diesen Suchen nicht auftaucht, kostet dich das ganze Jahr über Anfragen, im Juli doppelt. Selbst nachbessern scheitert am Alltag, denn niemand setzt sich nach zehn Stunden Arbeit noch an SEO-Texte. So bleibt die Seite ein hübsches Andenken an den Tag, an dem sie online ging. Arbeiten tut sie nicht.',
  beweisIntro:
    'Schwarz auf weiß statt schöner Versprechen. Ergebnisse, wie wir sie auch für Kärntner Betriebe anlegen.',
  regionalBlock: {
    eyebrow: 'Webdesign in Kärnten',
    heading: 'Zwischen Klagenfurt und dem Wörthersee sucht gerade wer genau dein Angebot.',
    paragraphs: [
      'Vielleicht ein Einheimischer, vielleicht ein Gast, der noch schnell einen Termin oder ein Quartier braucht. Beide vergleichen in Minuten und melden sich bei dem, der online den besten Eindruck macht. Wir bauen dir die Homepage, die diesen Vergleich gewinnt, ohne dass du dafür einen Finger rühren musst.',
      'Homepage erstellen lassen heißt bei uns: zuerst verstehen, dann bauen. Eine Ordination in Klagenfurt braucht Vertrauen und klare Information. Eine Ferienwohnung am Wörthersee braucht volle Kalender. Eine Tierarztpraxis in Villach braucht den kürzesten Weg zur Terminanfrage. Jede dieser Seiten verfolgt ein anderes Ziel, und genau darum bauen wir keine zwei gleichen.',
    ],
    reachLine:
      'Gefunden wirst du, ob die Suche aus Klagenfurt kommt, aus Villach oder von einem Badetuch am Wörthersee.',
    trustLine:
      'Kärntner Betriebe, die mit uns gebaut haben, melden sich beim nächsten Vorhaben wieder. Ein besseres Zeugnis kennen wir nicht.',
    availabilityHeading: 'Auch im August erreichbar. Gerade im August.',
    availabilityText:
      'Wenn bei dir Hochsaison ist, muss die Seite laufen und Änderungen müssen schnell gehen. Du schreibst uns direkt, wir kümmern uns. Kein Ticketsystem, keine Woche Wartezeit.',
  },
  faqEyebrow: 'Häufige Fragen',
  faqHeading: 'Homepage erstellen lassen in Kärnten',
  faq: [
    {
      q: 'Mit welchen Kosten muss ich für eine Homepage rechnen?',
      a: 'Mit klaren: ab 1.250 Euro für den One-Pager, ab 2.850 Euro für die mehrseitige Business-Homepage, ab 4.900 Euro für große Projekte. Das sind Festpreis-Rahmen, keine Schätzungen, die später wachsen. Vor deiner Entscheidung bekommst du Entwürfe zu sehen, bezahlt wird nichts im Voraus. Details findest du auf der Preisseite.',
    },
    {
      q: 'Wann ist meine neue Website fertig?',
      a: 'Realistisch: erste Entwürfe nach ein paar Tagen, online nach zwei bis vier Wochen, wenn Texte und Fotos zügig beisammen sind. Soll die Seite vor der Sommersaison stehen, rechnen wir vom Stichtag zurück und fixieren den Plan schriftlich. Versprochen wird nur, was auch hält.',
    },
    {
      q: 'Wie wird meine Homepage in Kärnten bei Google gefunden?',
      a: 'Weil sie von Grund auf dafür gebaut ist. Wir formulieren deine Inhalte so, wie in Klagenfurt, Villach und rund um die Seen tatsächlich gesucht wird, und halten die Technik schnell und sauber. Das ist auch die Grundlage dafür, dass KI-Suchen deinen Betrieb kennen und nennen.',
    },
    {
      q: 'Baut ihr auch Websites für Ärzte und Ordinationen?',
      a: 'Ja. Ordinationen haben eigene Regeln: Patienten wollen Öffnungszeiten, Kassen-Info und Terminanfrage sofort finden, und der Auftritt muss seriös sein statt marktschreierisch. Wir bauen Ordinations-Seiten bewusst ruhig, klar und mobiltauglich. Für Tierärzte, Therapeuten und andere Gesundheitsberufe gilt dasselbe.',
    },
    {
      q: 'Kann ich mir die Website fördern lassen?',
      a: 'In vielen Fällen ja. KMU.DIGITAL fördert Digitalisierungsprojekte österreichweit, also auch in Kärnten. Ob dein Betrieb die Voraussetzungen erfüllt, klären wir vor dem Angebot, und wenn der Antrag den Aufwand nicht wert ist, sagen wir dir das offen ins Gesicht.',
    },
  ],
  closingLines: [
    'Du willst in Kärnten gefunden werden, das ganze Jahr?',
    'Von Klagenfurt bis zum See?',
    'Reden wir.',
  ],
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${CANONICAL_GOLIVE}#webpage`,
      url: CANONICAL_GOLIVE,
      name: 'Webdesign Kärnten: Warum rufen keine Kunden an?',
      inLanguage: 'de-AT',
      isPartOf: { '@id': 'https://web.redrabbit.media/#website' },
      about: { '@id': 'https://web.redrabbit.media/#organization' },
    },
    {
      '@type': 'Service',
      '@id': `${CANONICAL_GOLIVE}#service`,
      name: 'Webdesign Kärnten',
      serviceType: 'Webdesign',
      url: CANONICAL_GOLIVE,
      provider: { '@id': 'https://web.redrabbit.media/#organization' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Kärnten' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://web.redrabbit.media/' },
        { '@type': 'ListItem', position: 2, name: 'Webdesign Kärnten', item: CANONICAL_GOLIVE },
      ],
    },
  ],
};

const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export default function WebdesignKaerntenPage() {
  return (
    <div className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
      <JsonLd data={schema} />
      <h1 style={srOnly}>
        Webdesign Kärnten: Homepage erstellen lassen für Betriebe von Klagenfurt bis zum Wörthersee
      </h1>
      {/* Kernantwort-Absatz fuer KI-Suchen (Thomas 11.08.), sr-only wie das h1
          direkt darueber: crawlbar im SSR-HTML, Design bleibt unberuehrt. */}
      <p style={srOnly}>
        Homepage erstellen lassen in Kärnten heißt bei Red Rabbit Media: Websites für
        Ordinationen und Betriebe von Klagenfurt bis zum Wörthersee, für Einheimische und
        Sommergäste gleichermaßen, gebaut für Google und die KI-Suche. Der One-Pager startet ab
        1.250 Euro, die mehrseitige Business-Homepage ab 2.850 Euro, große Projekte ab 4.900
        Euro, als Festpreis-Rahmen. Du siehst zuerst Entwürfe, ohne Vorkasse.
      </p>
      <RegionHome region={kaernten} />
    </div>
  );
}
