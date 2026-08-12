import type { Metadata } from 'next';
import RegionHome, { type RegionContent } from '@/components/relaunch/RegionHome';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';

/**
 * Bundesland-Landingpage Wien (Firmensitz Red Rabbit Media, 1060 Wien). BASIS =
 * die echte Home (RegionHome rendert die Home-Komposition mit regionalem Inhalt).
 * Eigenstaendig fuer Google gemacht durch: eigenes H1 (die Home hat keins),
 * eigenen Title/Description/Canonical, index-Steuerung, Service+areaServed=Wien-
 * Schema und regionalisierten Haupt-Content (Problem/Beweis/KI-Szene/FAQ). Wien-
 * Winkel: Grossstadt-Saettigung + Dienstleister-Dichte (Kanzleien, Ordinationen,
 * Agenturen), Ziel-Suche "website erstellen lassen wien". Rezept:
 * docs/handoffs/NEXT_SESSION_bundesland-landingpages.md.
 *
 * GO-LIVE: Canonical + Service-URL auf '/webdesign-wien', robots.index true,
 * ersetzt am selben Slug den frueheren temporaeren Redirect auf die Startseite.
 */

const CANONICAL_GOLIVE = 'https://web.redrabbit.media/webdesign-wien';

export const metadata: Metadata = {
  title: 'Webdesign Wien: Website erstellen lassen | Red Rabbit Media',
  description:
    'Website erstellen lassen in Wien: Seiten für Kanzleien, Ordinationen und Betriebe, die bei Google und in der KI-Suche vorne stehen. Ohne Vorkasse.',
  alternates: { canonical: '/webdesign-wien' },
  openGraph: {
    title: 'Webdesign Wien: Website erstellen lassen | Red Rabbit Media',
    description:
      'Website erstellen lassen in Wien: Seiten für Kanzleien, Ordinationen und Agenturen, die bei Google und in der KI-Suche gefunden werden und Anfragen bringen. Entwurf zuerst, ohne Vorkasse.',
    type: 'website',
    locale: 'de_AT',
    url: CANONICAL_GOLIVE,
    images: [{ url: '/og/og-image-redrabbit.jpg', width: 1200, height: 630, alt: 'Red Rabbit Media, Webdesign Wien aus Österreich' }],
  },
};

const wien: RegionContent = {
  name: 'Wien',
  kiStatement:
    'Wenn jemand die KI nach dem besten Webdesigner in Wien fragt, soll dein Name die Antwort sein.',
  problemBody:
    'Du hast für deine Website Geld ausgegeben, aber sie bringt dir keine einzige Anfrage. In Wien hat fast jeder Betrieb längst eine Seite, deine geht in der Masse einfach unter. Sucht deine Kundschaft am Handy nach einer Kanzlei im ersten Bezirk oder einer Ordination in Döbling, steht ein anderer oben, nicht du. Um das zu drehen, müsstest du dich abends selbst an die SEO-Texte setzen oder jemanden dafür bezahlen, der die Seite laufend pflegt. Beides frisst Zeit, die du im Alltag nicht hast. So bleibt deine Website ein hübscher Kostenpunkt statt ein Werkzeug, das dir Kundschaft bringt.',
  beweisIntro:
    'Ergebnisse, schwarz auf weiß. Auch aus Wien, von Betrieben, die uns nach dem ersten Projekt treu geblieben sind.',
  regionalBlock: {
    eyebrow: 'Webdesign in Wien',
    heading: 'In Wien hat schon jeder eine Website. Die Frage ist, wessen bei Google oben steht.',
    paragraphs: [
      'Deine Kundschaft entscheidet am Handy, zwischen zwei Terminen, oft in Sekunden. Wer da nicht auf der ersten Seite steht, existiert für sie schlicht nicht, egal wie gut die Arbeit dahinter ist. In einer Stadt mit so viel Konkurrenz reicht schön allein längst nicht. Wir bauen dir die Seite, die auftaucht und aus dem Klick eine echte Anfrage macht.',
      'Du willst deine Website erstellen lassen, statt dich abends selbst durch Baukästen zu quälen? Genau dafür gibt es uns. Eine Kanzlei im ersten Bezirk braucht eine andere Seite als eine Zahnordination in Favoriten oder eine Agentur in Mariahilf: Die einen wollen Seriosität und leicht buchbare Termine, die anderen Persönlichkeit und Projekte zeigen. Wir bauen die Seite, die zu deinem Haus passt, nicht die von der Stange.',
    ],
    reachLine:
      'Ob deine Kundschaft vom ersten Bezirk aus sucht, aus Döbling oder draußen in der Donaustadt: gefunden wirst du.',
    trustLine:
      'Ein paar Wiener Betriebe haben uns früh ihr Vertrauen geschenkt. Die meisten arbeiten heute noch mit uns.',
    availabilityHeading: 'Nach dem Launch sind wir nicht plötzlich verschwunden.',
    availabilityText:
      'Kein Ticket-System, keine Warteschleife. Du schreibst uns, wir kümmern uns. Deine Seite ist bei uns nichts, das man einmal abliefert und vergisst. Die wächst mit, so wie dein Betrieb.',
  },
  faqEyebrow: 'Häufige Fragen',
  faqHeading: 'Website erstellen lassen in Wien',
  faq: [
    {
      q: 'Was kostet es, in Wien eine professionelle Website erstellen zu lassen?',
      a: 'Der One-Pager startet bei uns ab 1.250 Euro, die mehrseitige Business-Website ab 2.850 Euro, größere Projekte ab 4.900 Euro. Als Festpreis-Rahmen, nicht als Stundensatz-Lotterie: Du weißt vorher, was es kostet. Und bevor du dich festlegst, siehst du 1-2 grafische Vorschläge, ohne Vorkasse. Was in welchem Paket steckt, steht offen auf unserer Preisseite.',
    },
    {
      q: 'Wie lange dauert es, bis meine Website online ist?',
      a: 'Die ersten Vorschläge siehst du nach ein paar Tagen. Eine kompakte Website ist meist in zwei bis vier Wochen online, je nachdem, wie schnell Texte und Bilder beisammen sind. Größere Projekte brauchen länger. Den Zeitplan legen wir vorher gemeinsam fest, damit nichts offen bleibt.',
    },
    {
      q: 'Wie werde ich in Wien bei Google gefunden?',
      a: 'Wir bauen deine Seite von der ersten Zeile an so, dass sie für die Suchbegriffe deiner Kundschaft auftaucht, bei Google und in der KI-Suche. Kein nachträgliches SEO-Geflick. In einer Stadt mit dieser Konkurrenz entscheiden saubere Technik, schnelle Ladezeiten und Texte, die genau so formuliert sind, wie in Wien wirklich gesucht wird.',
    },
    {
      q: 'Baut ihr auch Websites für Kanzleien und Agenturen?',
      a: 'Ja, sehr gern. Gerade in Wien sitzen unzählige Kanzleien, Steuerberater und Agenturen, und für die zählt der erste Eindruck doppelt. Eine Anwaltsseite muss Seriosität ausstrahlen und Termine leicht machen, eine Agenturseite darf zeigen, was sie kann. Beides bauen wir. Und passt du in keine der beiden Schubladen, gilt dasselbe Prinzip für deine Branche: Wir sind auf keine festgenagelt.',
    },
    {
      q: 'Gibt es Förderungen für eine Website in Wien?',
      a: 'Für digitale Projekte gibt es österreichweit KMU.DIGITAL, das einen Teil der Kosten fördern kann. Ob dein Vorhaben passt, hängt vom Betrieb ab. Wir sagen dir ehrlich, ob sich der Antrag lohnt, und liefern dir die Unterlagen dafür.',
    },
  ],
  closingLines: [
    'Du willst in Wien gefunden werden?',
    'Und dass dich die KI empfiehlt, wenn jemand nach der besten Agentur in Wien fragt?',
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
      name: 'Webdesign Wien: Website erstellen lassen | Red Rabbit Media',
      inLanguage: 'de-AT',
      isPartOf: { '@id': 'https://web.redrabbit.media/#website' },
      about: { '@id': 'https://web.redrabbit.media/#organization' },
    },
    {
      '@type': 'Service',
      '@id': `${CANONICAL_GOLIVE}#service`,
      name: 'Webdesign Wien',
      serviceType: 'Webdesign',
      url: CANONICAL_GOLIVE,
      provider: { '@id': 'https://web.redrabbit.media/#organization' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Wien' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://web.redrabbit.media/' },
        { '@type': 'ListItem', position: 2, name: 'Webdesign Wien', item: CANONICAL_GOLIVE },
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

export default function WebdesignWienPage() {
  return (
    <div className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
      <JsonLd data={schema} />
      {/* Eigenes, eindeutiges H1 (die Home hat keins) — der staerkste
          Einzelsignal, dass Google die Seite als eigene Region-Seite wertet. */}
      <h1 style={srOnly}>
        Webdesign Wien: Website erstellen lassen für Betriebe vom ersten Bezirk bis in die Donaustadt
      </h1>
      {/* Kernantwort-Absatz fuer KI-Suchen (Thomas 11.08.), sr-only wie das h1
          direkt darueber: crawlbar im SSR-HTML, Design bleibt unberuehrt. */}
      <p style={srOnly}>
        Website erstellen lassen in Wien heißt bei Red Rabbit Media: Seiten für Kanzleien,
        Ordinationen, Agenturen und Betriebe, gebaut für Google und die KI-Suche statt für die
        Schublade. Der One-Pager startet ab 1.250 Euro, die mehrseitige Business-Website ab
        2.850 Euro, größere Projekte ab 4.900 Euro, als Festpreis-Rahmen statt Stundensatz-Lotterie.
        Du siehst zuerst 1-2 grafische Vorschläge, ohne Vorkasse.
      </p>
      <RegionHome region={wien} />
    </div>
  );
}
