import type { Metadata } from 'next';
import RegionHome, { type RegionContent } from '@/components/relaunch/RegionHome';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';

/**
 * Bundesland-Landingpage Vorarlberg, nach dem Steiermark-Rezept
 * (docs/handoffs/NEXT_SESSION_bundesland-landingpages.md). Daten-Basis GSC 11.08.:
 * staerkstes erstellen-lassen-Land ("homepage erstellen (lassen) vorarlberg" 225+208),
 * "webdesign arlberg" 226 als eigenes Tourismus-Signal. Unique-Winkel: Dichte/
 * kritische Kundschaft im Laendle + Grenzlage (Schweiz/Liechtenstein, Mehrsprachigkeit).
 *
 * Preview: noindex + Canonical auf Preview-Pfad. GO-LIVE: Canonical auf
 * '/webdesign-vorarlberg', robots.index true, ersetzt die alte Seite am selben Slug.
 */

const CANONICAL_GOLIVE = 'https://web.redrabbit.media/webdesign-vorarlberg';

export const metadata: Metadata = {
  title: 'Webdesign Vorarlberg: Warum rufen keine Kunden an?',
  description:
    'Deine Seite ist online, angerufen wird trotzdem der andere. Woran das liegt? Steht auf der Seite. Vorschlag gratis vorab ✓',
  alternates: { canonical: '/webdesign-vorarlberg' },
  openGraph: {
    title: 'Webdesign Vorarlberg: Warum rufen keine Kunden an?',
    description:
      'Deine Seite ist online, angerufen wird trotzdem der andere. Woran das liegt? Steht auf der Seite. Vorschlag gratis vorab ✓',
    type: 'website',
    locale: 'de_AT',
    url: CANONICAL_GOLIVE,
    images: [{ url: '/og/og-image-redrabbit.jpg', width: 1200, height: 630, alt: 'Red Rabbit Media, Webdesign Vorarlberg aus Österreich' }],
  },
};

const vorarlberg: RegionContent = {
  name: 'Vorarlberg',
  kiStatement:
    'Wird die KI nach dem besten Betrieb im Ländle gefragt, soll dein Name ganz oben stehen.',
  problemBody:
    'Im Ländle kennt man sich, heißt es. Nur nützt dir das nichts, wenn deine Kunden trotzdem googeln, und das tun sie: vom Rheintal bis zum Arlberg wird jede Leistung zuerst online gesucht. Steht deine Homepage dort auf Seite drei, geht der Auftrag an den Nachbarn, der besser auffindbar ist, nicht an den, der besser arbeitet. Um das selbst zu ändern, müsstest du Abende opfern, die du nicht hast. Deine Website soll für dich arbeiten, nicht umgekehrt. Im Moment tut sie vermutlich keines von beidem.',
  beweisIntro:
    'Ergebnisse statt Agentur-Poesie, schwarz auf weiß. Auch für Betriebe aus Vorarlberg.',
  regionalBlock: {
    eyebrow: 'Webdesign in Vorarlberg',
    heading: 'Vorarlberg ist klein auf der Landkarte. Bei Google gilt das nicht.',
    paragraphs: [
      'Auf wenigen Kilometern drängen sich hier mehr gute Betriebe als sonst wo, und alle wollen dieselben Kunden. Sichtbarkeit ist im Ländle kein Bonus, sie entscheidet. Wir bauen Homepages, die in diesem dichten Feld auftauchen und aus Klicks Anfragen machen.',
      'Homepage erstellen lassen, ordentlich und mit Plan: dafür holst du uns. Eine Tischlerei im Bregenzerwald zeigt Handwerk, das man sehen muss. Ein Immobilienbüro in Dornbirn lebt von Vertrauen und aktuellen Objekten. Eine Skischule am Arlberg verkauft an Gäste aus halb Europa. Jede dieser Seiten folgt einer anderen Logik. Wir finden zuerst deine, dann bauen wir.',
    ],
    reachLine:
      'Ob in Bregenz gesucht wird, in Feldkirch oder oben am Arlberg: deine Seite ist dafür gebaut, gefunden zu werden.',
    trustLine:
      'Vorarlberger gelten als kritische Kundschaft. Uns ist das recht: wer hier zufrieden ist, bleibt.',
    availabilityHeading: 'Erreichbar, wenn du uns brauchst. Nicht nur beim Verkaufsgespräch.',
    availabilityText:
      'Nach dem Launch hast du weiter einen direkten Draht zu uns. Änderungen, neue Bilder, neue Angebote: kurz geschrieben, rasch erledigt. Deine Homepage bleibt so lebendig wie dein Betrieb.',
  },
  faqEyebrow: 'Häufige Fragen',
  faqHeading: 'Homepage erstellen lassen in Vorarlberg',
  faq: [
    {
      q: 'Homepage erstellen lassen: was kostet das?',
      a: 'Beim One-Pager geht es ab 1.250 Euro los, die mehrseitige Business-Homepage beginnt bei 2.850 Euro, große Vorhaben ab 4.900 Euro. Wir arbeiten mit Festpreis-Rahmen, damit du kalkulieren kannst wie bei jedem anderen Angebot auch. Entwürfe siehst du, bevor du dich bindest, Vorkasse gibt es keine. Die Pakete stehen im Detail auf der Preisseite.',
    },
    {
      q: 'Wie lange dauert es, eine Homepage erstellen zu lassen?',
      a: 'Nach wenigen Tagen liegen die ersten Entwürfe vor, nach zwei bis vier Wochen ist eine kompakte Homepage üblicherweise online. Der ehrliche Engpass sind fast immer Inhalte aus deinem Betrieb, also Texte und Fotos. Wir sagen dir vorab genau, was wir brauchen, und helfen beim Rest.',
    },
    {
      q: 'Wie werde ich in Vorarlberg bei Google sichtbar?',
      a: 'Sichtbarkeit ist bei uns Teil der Bauweise, kein Zusatzpaket. Deine Homepage bekommt Texte in der Sprache, in der vom Rheintal bis zum Arlberg wirklich gesucht wird, dazu saubere Technik und Ladezeiten, die auch am Berg funktionieren. So verstehen Google und die KI-Suche, wofür dein Betrieb steht.',
    },
    {
      q: 'Könnt ihr auch mehrsprachige Websites bauen?',
      a: 'Ja. Gerade in Vorarlberg enden Kundenbeziehungen nicht an der Grenze: die Schweiz und Liechtenstein liegen vor der Haustür, am Arlberg buchen Gäste aus aller Welt. Eine englische Version deiner Seite ist bei uns kein Sonderprojekt, sondern von Anfang an mitgeplant, mit Texten, die nicht nach Übersetzungsautomat klingen.',
    },
    {
      q: 'Gibt es für Vorarlberger Betriebe Förderungen?',
      a: 'Die Bundesförderung KMU.DIGITAL steht auch Vorarlberger Klein- und Mittelbetrieben offen und kann einen Teil der Kosten abdecken. Wir prüfen vor dem Start, ob dein Vorhaben passt, und sagen dir geradeheraus, ob sich der Antrag lohnt oder nicht.',
    },
  ],
  closingLines: [
    'Du willst im Ländle vorne stehen, wenn gesucht wird?',
    'Vom Rheintal bis zum Arlberg?',
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
      name: 'Webdesign Vorarlberg: Warum rufen keine Kunden an?',
      inLanguage: 'de-AT',
      isPartOf: { '@id': 'https://web.redrabbit.media/#website' },
      about: { '@id': 'https://web.redrabbit.media/#organization' },
    },
    {
      '@type': 'Service',
      '@id': `${CANONICAL_GOLIVE}#service`,
      name: 'Webdesign Vorarlberg',
      serviceType: 'Webdesign',
      url: CANONICAL_GOLIVE,
      provider: { '@id': 'https://web.redrabbit.media/#organization' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Vorarlberg' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://web.redrabbit.media/' },
        { '@type': 'ListItem', position: 2, name: 'Webdesign Vorarlberg', item: CANONICAL_GOLIVE },
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

export default function WebdesignVorarlbergPage() {
  return (
    <div className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
      <JsonLd data={schema} />
      <h1 style={srOnly}>
        Webdesign Vorarlberg: Homepage erstellen lassen für Betriebe vom Rheintal bis zum Arlberg
      </h1>
      {/* Kernantwort-Absatz fuer KI-Suchen (Thomas 11.08.), sr-only wie das h1
          direkt darueber: crawlbar im SSR-HTML, Design bleibt unberuehrt. */}
      <p style={srOnly}>
        Homepage erstellen lassen in Vorarlberg heißt bei Red Rabbit Media: Websites für Betriebe
        vom Rheintal bis zum Arlberg, auf Wunsch mehrsprachig für Kundschaft aus der Schweiz und
        Liechtenstein, gebaut für Google und die KI-Suche. Der One-Pager startet ab 1.250 Euro,
        die mehrseitige Business-Homepage ab 2.850 Euro, große Vorhaben ab 4.900 Euro, als
        Festpreis-Rahmen. Entwürfe siehst du vorab, ohne Vorkasse.
      </p>
      <RegionHome region={vorarlberg} />
    </div>
  );
}
