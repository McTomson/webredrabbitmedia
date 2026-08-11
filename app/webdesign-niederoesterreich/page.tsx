import type { Metadata } from 'next';
import RegionHome, { type RegionContent } from '@/components/relaunch/RegionHome';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '../../styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';

/**
 * Bundesland-Landingpage Niederoesterreich, nach dem Steiermark-Rezept
 * (docs/handoffs/NEXT_SESSION_bundesland-landingpages.md). Daten-Basis GSC 11.08.:
 * webdesign/webdesigner noe 613+578, WALDVIERTEL-Cluster 274, "homepage erstellen
 * (lassen) noe" 199 -> erstellen-lassen-Sprache + Waldviertel sichtbar. Echter
 * Kunden-Anker: Fliesenleger-Handwerksbetrieb (anonym, Thomas 11.08.).
 *
 * Preview: noindex + Canonical auf Preview-Pfad. GO-LIVE: Canonical auf
 * '/webdesign-niederoesterreich', robots.index true, ersetzt die alte Seite am selben Slug.
 */

const CANONICAL_GOLIVE = 'https://web.redrabbit.media/webdesign-niederoesterreich';

export const metadata: Metadata = {
  title: 'Webdesign Niederösterreich: Website erstellen lassen | Red Rabbit Media',
  description:
    'Website erstellen lassen in Niederösterreich: Seiten für Betriebe vom Waldviertel bis Wiener Neustadt, gefunden bei Google und in der KI-Suche. Ohne Vorkasse.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/relaunch-preview/webdesign-niederoesterreich' },
  openGraph: {
    title: 'Webdesign Niederösterreich: Website erstellen lassen | Red Rabbit Media',
    description:
      'Website erstellen lassen in Niederösterreich: Seiten für Betriebe vom Waldviertel bis Wiener Neustadt, die gefunden werden und Anfragen bringen. Entwurf zuerst, ohne Vorkasse.',
    type: 'website',
    locale: 'de_AT',
    url: CANONICAL_GOLIVE,
    images: [{ url: '/og/og-image-redrabbit.jpg', width: 1200, height: 630, alt: 'Red Rabbit Media, Webdesign Niederösterreich aus Österreich' }],
  },
};

const niederoesterreich: RegionContent = {
  name: 'Niederoesterreich',
  kiStatement:
    'Fragt jemand die KI nach dem besten Betrieb seiner Branche in Niederösterreich, soll dein Name fallen.',
  problemBody:
    'Niederösterreich ist groß. Vom Waldviertel bis Wiener Neustadt liegen zwei Autostunden, und deine Kunden fahren sie nicht ab, um dich zu finden. Sie tippen ihre Suche ins Handy, nehmen einen der ersten Treffer, fertig. Wenn deine Website dort nicht steht, existierst du für diese Leute nicht, so ehrlich muss man sein. Selber abends an der Seite basteln? Dafür hast du keine Zeit, dein Geschäft läuft ja nebenbei nicht von allein. Eine Website, die niemand findet, ist kein Aushängeschild. Sie ist ein Regalposten, der einmal Geld gekostet hat.',
  beweisIntro:
    'Ergebnisse, schwarz auf weiß. Darunter Betriebe aus Niederösterreich, die mit uns sichtbar geworden sind.',
  regionalBlock: {
    eyebrow: 'Webdesign in Niederösterreich',
    heading: 'Zwischen Waldviertel und Wiener Neustadt sucht gerade jemand genau das, was du kannst.',
    paragraphs: [
      'Und zwar am Handy, zwischen Tür und Angel. Wer dort auftaucht, bekommt den Anruf. Wer nicht, bekommt nicht einmal die Chance auf ein Nein. Wir bauen Websites, die bei diesen Suchen vorne mitspielen und aus dem Klick eine Anfrage machen. Kein Deko-Projekt, ein Werkzeug.',
      'Website erstellen lassen statt ewig selber herumprobieren: dafür sind wir da. Ein Fliesenleger im Mostviertel braucht eine andere Seite als eine Steuerkanzlei in St. Pölten oder ein Hofladen im Weinviertel. Der eine will Baustellenfotos zeigen und Anfragen für die nächste Saison sammeln, die andere Vertrauen aufbauen, der dritte seine Öffnungszeiten selbst ändern können, ohne einen Techniker anzurufen. Genau so verschieden bauen wir.',
    ],
    reachLine:
      'Ob dein Kunde in St. Pölten sucht, in Krems oder irgendwo im Waldviertel, wo das Netz gern einmal schwächelt: deine Seite ist da und wird gefunden.',
    trustLine:
      'Ein Handwerksbetrieb aus Niederösterreich zählt seit seinem ersten Projekt zu unseren Stammkunden. So bauen wir am liebsten: eine Seite, die arbeitet, und ein Draht, der hält.',
    availabilityHeading: 'Nach dem Livegang fangen wir erst an.',
    availabilityText:
      'Website online stellen und abtauchen, das gibt es bei uns nicht. Du erreichst uns direkt, ohne Ticketnummer und ohne Warteschleife. Wenn sich dein Betrieb ändert, ändert sich die Seite mit.',
  },
  faqEyebrow: 'Häufige Fragen',
  faqHeading: 'Website erstellen lassen in Niederösterreich',
  faq: [
    {
      q: 'Was kostet eine professionelle Website?',
      a: 'Der One-Pager startet bei 1.250 Euro, die mehrseitige Business-Website bei 2.850 Euro, größere Projekte beginnen ab 4.900 Euro. Das sind Festpreis-Rahmen, keine offenen Stundenlisten. Und bevor du dich entscheidest, siehst du 1-2 grafische Entwürfe, ohne Vorkasse. Was in welchem Paket steckt, steht offen auf unserer Preisseite.',
    },
    {
      q: 'Wie schnell ist meine neue Website online?',
      a: 'Erste Entwürfe siehst du nach wenigen Tagen. Kompakte Seiten gehen meist innerhalb von zwei bis vier Wochen live. Das Tempo entscheidet sich vor allem bei Texten und Bildern: sind die schnell beisammen, sind wir es auch. Den Fahrplan legen wir vor dem Start gemeinsam fest.',
    },
    {
      q: 'Wie werde ich in Niederösterreich bei Google gefunden?',
      a: 'Indem deine Seite von Anfang an dafür gebaut ist. Wir schreiben die Texte in der Sprache, in der deine Kunden wirklich suchen, ob nach einem Fliesenleger im Bezirk oder einer Kanzlei in St. Pölten, und sorgen für saubere Technik und schnelle Ladezeiten. Auch die KI-Suche liest deine Seite dann richtig.',
    },
    {
      q: 'Baut ihr auch Websites für Handwerker?',
      a: 'Sehr gern sogar. Handwerker haben selten Zeit für Website-Pflege, also bauen wir Seiten, die ohne viel Zutun funktionieren: Leistungen klar benannt, Referenzfotos, die für sich sprechen, und die Anfrage in zwei Klicks vom Handy der Kundschaft. Einer unserer treuesten Kunden ist Fliesenleger. Bist du kein Handwerker, gilt dasselbe Prinzip für deine Branche.',
    },
    {
      q: 'Gibt es Förderungen für die Website-Erstellung?',
      a: 'Mit KMU.DIGITAL fördert der Bund digitale Projekte auch in Niederösterreich. Ob dein Vorhaben durchgeht, hängt vom Betrieb und vom Zeitpunkt ab. Wir schauen uns das gemeinsam an, sagen dir ehrlich, ob sich der Papierkram lohnt, und liefern die Unterlagen dazu.',
    },
  ],
  closingLines: [
    'Du willst, dass man dich in Niederösterreich findet?',
    'Vom Waldviertel bis nach Wiener Neustadt?',
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
      name: 'Webdesign Niederösterreich: Website erstellen lassen | Red Rabbit Media',
      inLanguage: 'de-AT',
      isPartOf: { '@id': 'https://web.redrabbit.media/#website' },
      about: { '@id': 'https://web.redrabbit.media/#organization' },
    },
    {
      '@type': 'Service',
      '@id': `${CANONICAL_GOLIVE}#service`,
      name: 'Webdesign Niederösterreich',
      serviceType: 'Webdesign',
      url: CANONICAL_GOLIVE,
      provider: { '@id': 'https://web.redrabbit.media/#organization' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Niederösterreich' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://web.redrabbit.media/' },
        { '@type': 'ListItem', position: 2, name: 'Webdesign Niederösterreich', item: CANONICAL_GOLIVE },
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

export default function WebdesignNiederoesterreichPage() {
  return (
    <div className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
      <JsonLd data={schema} />
      <h1 style={srOnly}>
        Webdesign Niederösterreich: Website erstellen lassen für Betriebe vom Waldviertel bis Wiener Neustadt
      </h1>
      {/* Kernantwort-Absatz fuer KI-Suchen (Thomas 11.08.), sr-only wie das h1
          direkt darueber: crawlbar im SSR-HTML, Design bleibt unberuehrt. */}
      <p style={srOnly}>
        Website erstellen lassen in Niederösterreich heißt bei Red Rabbit Media: Seiten für
        Handwerksbetriebe, Kanzleien und Höfe vom Waldviertel bis Wiener Neustadt, gebaut für
        Google und die KI-Suche. Der One-Pager startet ab 1.250 Euro, die mehrseitige
        Business-Website ab 2.850 Euro, größere Projekte ab 4.900 Euro, als Festpreis-Rahmen.
        Erst Entwürfe sehen, dann entscheiden, ohne Vorkasse.
      </p>
      <RegionHome region={niederoesterreich} />
    </div>
  );
}
