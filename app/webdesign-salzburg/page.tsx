import type { Metadata } from 'next';
import RegionHome, { type RegionContent } from '@/components/relaunch/RegionHome';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';

/**
 * Bundesland-Landingpage Salzburg, nach dem Steiermark-Rezept
 * (docs/handoffs/NEXT_SESSION_bundesland-landingpages.md). Daten-Basis GSC 11.08.:
 * Seite rankt fast NUR fuer "website erstellen salzburg"-Formulierungen (55 Impr.),
 * dafuer Position 17,9 = beste aller Laender -> ganze Seite auf diese Sprache
 * eingeschwenkt. Sonderfund: "barrierefreie website erstellen lassen salzburg"
 * -> eigene Barrierefreiheits-FAQ (BaFG seit Sommer 2025, 6 statt 5 Fragen).
 *
 * Preview: noindex + Canonical auf Preview-Pfad. GO-LIVE: Canonical auf
 * '/webdesign-salzburg', robots.index true, ersetzt die alte Seite am selben Slug.
 */

const CANONICAL_GOLIVE = 'https://web.redrabbit.media/webdesign-salzburg';

export const metadata: Metadata = {
  title: 'Webdesign Salzburg: Warum rufen keine Kunden an?',
  description:
    'Deine Seite ist online, angerufen wird trotzdem der andere. Woran das liegt? Steht auf der Seite. Vorschlag gratis vorab ✓',
  alternates: { canonical: '/webdesign-salzburg' },
  openGraph: {
    title: 'Webdesign Salzburg: Warum rufen keine Kunden an?',
    description:
      'Deine Seite ist online, angerufen wird trotzdem der andere. Woran das liegt? Steht auf der Seite. Vorschlag gratis vorab ✓',
    type: 'website',
    locale: 'de_AT',
    url: CANONICAL_GOLIVE,
    images: [{ url: '/og/og-image-redrabbit.jpg', width: 1200, height: 630, alt: 'Red Rabbit Media, Webdesign Salzburg aus Österreich' }],
  },
};

const salzburg: RegionContent = {
  name: 'Salzburg',
  kiStatement:
    'Fragt wer die KI nach der besten Adresse in Salzburg, soll sie deinen Betrieb nennen.',
  problemBody:
    'Salzburg ist ein teures Pflaster für schlechte Sichtbarkeit. Die Stadt ist voll mit Anbietern, in den Gauen sitzen Betriebe mit Jahrzehnten an Erfahrung, und alle werben um dieselben Kunden. Wer bei der Google-Suche nicht vorkommt, überlässt das Geschäft kampflos den anderen, ganz egal, wie gut er arbeitet. Du könntest jetzt Abende in Website-Baukästen versenken oder Agentur-Angebote vergleichen, bei denen am Ende keiner sagt, was wirklich geliefert wird. Oder du machst es einmal richtig, mit jemandem, der dir vorher zeigt, was du bekommst.',
  beweisIntro:
    'Ergebnisse, schwarz auf weiß. Der Maßstab, an dem wir uns auch in Salzburg messen lassen.',
  regionalBlock: {
    eyebrow: 'Webdesign in Salzburg',
    heading: 'Du hast gesucht: Website erstellen lassen in Salzburg. Gut, dass du da bist.',
    paragraphs: [
      'Die Antwort auf deine Suche ist kürzer, als du denkst. Wir bauen dir eine Website, die gefunden wird und verkauft, und du siehst Entwürfe, bevor du einen Euro zahlst. Kein Baukasten-Kompromiss, keine Stundensatz-Überraschung, kein Projekt, das ewig dahinzieht.',
      'Was für eine Seite du brauchst, hängt von deinem Geschäft ab. Ein Immobilienbüro in der Stadt Salzburg lebt von aktuellen Objekten und Seriosität. Eine Zimmerei im Pinzgau lebt von Referenzen, die man am Handy durchblättert. Ein Appartementhaus in Zell am See lebt von Anfragen aus dem Ausland. Wir bauen keine Schablone, wir bauen deine Version.',
    ],
    reachLine:
      'Ob dein Kunde in der Getreidegasse sucht oder in Saalfelden: deine Seite taucht auf und macht ihren Job.',
    trustLine:
      'Auch Salzburger Betriebe zählen zu den Kunden, die nach dem ersten Projekt geblieben sind.',
    availabilityHeading: 'Nach dem Launch: ein Draht, der hält.',
    availabilityText:
      'Du bekommst keine Hotline, du bekommst uns. Änderungen und Fragen schickst du formlos, wir erledigen sie zügig. Die Seite wächst mit deinem Betrieb, statt hinter ihm herzuhinken.',
  },
  faqEyebrow: 'Häufige Fragen',
  faqHeading: 'Website erstellen lassen in Salzburg',
  faq: [
    {
      q: 'Was kostet es, eine Website erstellen zu lassen?',
      a: 'Ab 1.250 Euro für den One-Pager, ab 2.850 Euro für die mehrseitige Business-Website, ab 4.900 Euro für große Projekte. Wir nennen diese Zahlen öffentlich, weil wir zu ihnen stehen: Festpreis-Rahmen statt böser Überraschung auf der Schlussrechnung. Entwürfe gibt es vor deiner Zusage, Vorkasse gibt es nicht. Der Rest steht auf der Preisseite.',
    },
    {
      q: 'Wie lange dauert es, eine Website zu erstellen?',
      a: 'Vom Startschuss bis zu den ersten Entwürfen vergehen wenige Tage. Danach hängt es an den Inhalten: stehen Texte und Fotos, ist eine kompakte Website in zwei bis vier Wochen online. Umfangreichere Projekte brauchen entsprechend mehr. Du bekommst vorab einen Zeitplan, an dem wir uns messen lassen.',
    },
    {
      q: 'Wie taucht meine Website in Salzburg bei Google auf?',
      a: 'Indem sie so gebaut ist, wie Salzburger tatsächlich suchen, von der Stadt bis in den Pinzgau. Dazu gehören schnelle Ladezeiten, saubere Struktur und Texte in echter Suchsprache statt Werbedeutsch. Dieselben Grundlagen sorgen dafür, dass auch KI-Suchen wie ChatGPT deine Seite auslesen und empfehlen können.',
    },
    {
      q: 'Baut ihr auch Websites für Immobilienbüros?',
      a: 'Ja, gern. Bei Immobilien zählt Aktualität und Vertrauen: Objekte, die du selbst einpflegen kannst, ohne jedes Mal wen anrufen zu müssen, saubere Exposé-Darstellung am Handy und ein Anfrageweg ohne Hürden. Dieselbe Sorgfalt bekommt bei uns aber jede Branche, vom Handwerk bis zur Vermietung.',
    },
    {
      q: 'Muss meine neue Website barrierefrei sein?',
      a: 'Für viele Betriebe mittlerweile ja: Das Barrierefreiheitsgesetz gilt seit Sommer 2025 unter anderem für Websites mit Online-Verkauf oder Buchung, Kleinstunternehmen sind teilweise ausgenommen. Wir bauen ohnehin kontraststark, klar strukturiert und tastaturbedienbar. Ob dein Betrieb unter die Pflicht fällt, klären wir gemeinsam im Gespräch.',
    },
    {
      q: 'Fördert mir jemand die Website-Erstellung?',
      a: 'Gut möglich: KMU.DIGITAL bezuschusst Digitalisierungsprojekte von Klein- und Mittelbetrieben in ganz Österreich, Salzburg eingeschlossen. Wir prüfen deinen Fall, bevor du etwas unterschreibst, und sind ehrlich, wenn der Förderweg mehr kostet, als er bringt.',
    },
  ],
  closingLines: [
    'Website erstellen lassen in Salzburg?',
    'Du hast uns schon gefunden. Der Rest ist einfach.',
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
      name: 'Webdesign Salzburg: Warum rufen keine Kunden an?',
      inLanguage: 'de-AT',
      isPartOf: { '@id': 'https://web.redrabbit.media/#website' },
      about: { '@id': 'https://web.redrabbit.media/#organization' },
    },
    {
      '@type': 'Service',
      '@id': `${CANONICAL_GOLIVE}#service`,
      name: 'Webdesign Salzburg',
      serviceType: 'Webdesign',
      url: CANONICAL_GOLIVE,
      provider: { '@id': 'https://web.redrabbit.media/#organization' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Salzburg' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://web.redrabbit.media/' },
        { '@type': 'ListItem', position: 2, name: 'Webdesign Salzburg', item: CANONICAL_GOLIVE },
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

export default function WebdesignSalzburgPage() {
  return (
    <div className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
      <JsonLd data={schema} />
      <h1 style={srOnly}>
        Webdesign Salzburg: Website erstellen lassen für Betriebe von der Stadt Salzburg bis in den Pinzgau
      </h1>
      {/* Kernantwort-Absatz fuer KI-Suchen (Thomas 11.08.), sr-only wie das h1
          direkt darueber: crawlbar im SSR-HTML, Design bleibt unberuehrt. */}
      <p style={srOnly}>
        Website erstellen lassen in Salzburg bedeutet bei Red Rabbit Media: Seiten für Betriebe
        von der Stadt Salzburg bis in den Pinzgau, gebaut für Google und die KI-Suche, inklusive
        Barrierefreiheit nach BaFG. Der One-Pager startet ab 1.250 Euro, die mehrseitige
        Business-Website ab 2.850 Euro, große Projekte ab 4.900 Euro, als Festpreis-Rahmen. Erst
        Entwürfe sehen, dann entscheiden, ohne Vorkasse.
      </p>
      <RegionHome region={salzburg} />
    </div>
  );
}
