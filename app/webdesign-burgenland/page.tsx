import type { Metadata } from 'next';
import RegionHome, { type RegionContent } from '@/components/relaunch/RegionHome';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '../../styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';

/**
 * Bundesland-Landingpage Burgenland, nach dem Steiermark-Rezept
 * (docs/handoffs/NEXT_SESSION_bundesland-landingpages.md). Daten-Basis GSC 11.08.:
 * "homepage erstellen (lassen) burgenland" 141+94 -> Homepage-Sprache; Eisenstadt-
 * Cluster liegt auf eigener Stadt-Seite. Branchen-Anker: Weingueter/Direktvermarkter
 * (Neusiedler See), dazu Praxis + Handel als Streuung.
 *
 * Preview: noindex + Canonical auf Preview-Pfad. GO-LIVE: Canonical auf
 * '/webdesign-burgenland', robots.index true, ersetzt die alte Seite am selben Slug.
 */

const CANONICAL_GOLIVE = 'https://web.redrabbit.media/webdesign-burgenland';

export const metadata: Metadata = {
  title: 'Webdesign Burgenland: Homepage erstellen lassen | Red Rabbit Media',
  description:
    'Homepage erstellen lassen im Burgenland: Websites für Weingüter und Betriebe von Eisenstadt bis ins Südburgenland, sichtbar bei Google und KI. Ohne Vorkasse.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/relaunch-preview/webdesign-burgenland' },
  openGraph: {
    title: 'Webdesign Burgenland: Homepage erstellen lassen | Red Rabbit Media',
    description:
      'Homepage erstellen lassen im Burgenland: Websites für Betriebe von Eisenstadt bis ins Südburgenland, die gefunden werden und Anfragen bringen. Entwurf ohne Vorkasse.',
    type: 'website',
    locale: 'de_AT',
    url: CANONICAL_GOLIVE,
    images: [{ url: '/og/og-image-redrabbit.jpg', width: 1200, height: 630, alt: 'Red Rabbit Media, Webdesign Burgenland aus Österreich' }],
  },
};

const burgenland: RegionContent = {
  name: 'Burgenland',
  kiStatement:
    'Wird die KI gefragt, wer im Burgenland dein Fach am besten beherrscht, soll sie auf dich zeigen.',
  problemBody:
    'Das Burgenland ist lang, deine Kundschaft verstreut. Der eine sitzt in Eisenstadt, die andere kauft am Neusiedler See ein, der dritte sucht vom Südburgenland aus. Was alle verbindet: sie schauen zuerst ins Internet. Eine Homepage, die dort nicht gefunden wird, ist wie ein Hofladen ohne Schild an der Straße. Das beste Angebot nützt nichts, wenn keiner abbiegt. Und die Zeit, das neben dem Betrieb selbst zu lösen, hat im Burgenland genauso wenig jemand wie anderswo. Deshalb gibt es uns.',
  beweisIntro:
    'Ergebnisse, schwarz auf weiß. So messen wir auch, was wir für burgenländische Betriebe bauen.',
  regionalBlock: {
    eyebrow: 'Webdesign im Burgenland',
    heading: 'Das Burgenland ist flach. Die Google-Konkurrenz ist es nicht.',
    paragraphs: [
      'Sobald deine Kunden nach einer Leistung suchen, drängen sich Anbieter aus Wien, Graz und dem halben Land in die Ergebnisse. Wer regional gefunden werden will, braucht eine Homepage, die genau dafür gebaut ist, technisch und sprachlich. Die bauen wir dir.',
      'Homepage erstellen lassen, die zum Betrieb passt: Ein Weingut am Neusiedler See verkauft Stimmung, Jahrgänge und den Ab-Hof-Termin. Eine Physiotherapie-Praxis in Eisenstadt braucht Termine statt Laufkundschaft. Ein Landmaschinenhändler im Südburgenland will über drei Bezirke hinweg gefunden werden. Dieselbe Website wäre für alle drei die falsche. Darum beginnt bei uns jedes Projekt mit deinem Geschäft, nie mit einer Vorlage.',
    ],
    reachLine:
      'Ob von Eisenstadt aus gesucht wird, von Oberwart oder von einer Terrasse am See: deine Homepage ist auffindbar.',
    trustLine:
      'Wer im Burgenland einmal mit uns gebaut hat, ruft beim nächsten Vorhaben wieder an. Genau so soll es sein.',
    availabilityHeading: 'Weinlese, Saisonstart, neue Preise: wir ziehen mit.',
    availabilityText:
      'Deine Homepage soll leben. Neue Jahrgänge, geänderte Zeiten, ein neues Angebot: kurz gemeldet, schnell online. Du erreichst uns direkt, ohne Umweg über ein Formular-Labyrinth.',
  },
  faqEyebrow: 'Häufige Fragen',
  faqHeading: 'Homepage erstellen lassen im Burgenland',
  faq: [
    {
      q: 'Was kostet eine Homepage für meinen Betrieb?',
      a: 'Der Einstieg liegt bei 1.250 Euro für den One-Pager. Die mehrseitige Business-Homepage beginnt bei 2.850 Euro, große Projekte ab 4.900 Euro. Alles Festpreis-Rahmen: du kennst den Betrag, bevor wir starten, nicht erst auf der Rechnung. Entwürfe siehst du vor der Zusage, ohne Vorkasse. Die Paket-Details stehen auf der Preisseite.',
    },
    {
      q: 'Wie lange dauert es bis zur fertigen Homepage?',
      a: 'Die ersten Entwürfe kommen nach wenigen Tagen, live geht eine kompakte Homepage meist binnen zwei bis vier Wochen. Brauchst du sie zu einem fixen Termin, etwa zum Saisonbeginn oder zur nächsten Weinpräsentation, planen wir von dort rückwärts und halten uns dran.',
    },
    {
      q: 'Wie werde ich im Burgenland bei Google gefunden?',
      a: 'Mit einer Homepage, die von Anfang an auf die Suchen deiner Region gebaut ist, von Eisenstadt bis Jennersdorf. Wir kümmern uns um schnelle Ladezeiten, saubere Struktur und Texte, die klingen wie deine Kunden, wenn sie suchen. Genau das macht deine Seite auch für KI-Suchen wie ChatGPT lesbar.',
    },
    {
      q: 'Macht ihr auch Websites für Weingüter und Direktvermarkter?',
      a: 'Sehr gern. Ein Weingut verkauft online vor allem eines: das Gefühl, dort gewesen zu sein. Dazu kommen die praktischen Dinge, aktueller Jahrgang, Ab-Hof-Zeiten, Verkostungstermine, auf Wunsch eine Bestellmöglichkeit. Wir bauen Seiten, die beides können, Stimmung und Verkauf. Und für Hofladen, Imkerei oder Edelbrennerei gilt dasselbe.',
    },
    {
      q: 'Welche Förderungen gibt es für eine neue Homepage?',
      a: 'Österreichweit läuft KMU.DIGITAL, das Digitalisierungsprojekte von Klein- und Mittelbetrieben bezuschusst, auch im Burgenland. Ob dein Vorhaben förderfähig ist, prüfen wir gemeinsam vor dem Start. Lohnt sich der Antrag nicht, hörst du das von uns zuerst.',
    },
  ],
  closingLines: [
    'Du willst, dass man dich im Burgenland findet?',
    'Vom Neusiedler See bis Jennersdorf?',
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
      name: 'Webdesign Burgenland: Homepage erstellen lassen | Red Rabbit Media',
      inLanguage: 'de-AT',
      isPartOf: { '@id': 'https://web.redrabbit.media/#website' },
      about: { '@id': 'https://web.redrabbit.media/#organization' },
    },
    {
      '@type': 'Service',
      '@id': `${CANONICAL_GOLIVE}#service`,
      name: 'Webdesign Burgenland',
      serviceType: 'Webdesign',
      url: CANONICAL_GOLIVE,
      provider: { '@id': 'https://web.redrabbit.media/#organization' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Burgenland' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://web.redrabbit.media/' },
        { '@type': 'ListItem', position: 2, name: 'Webdesign Burgenland', item: CANONICAL_GOLIVE },
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

export default function WebdesignBurgenlandPage() {
  return (
    <div className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
      <JsonLd data={schema} />
      <h1 style={srOnly}>
        Webdesign Burgenland: Homepage erstellen lassen für Betriebe von Eisenstadt bis ins Südburgenland
      </h1>
      {/* Kernantwort-Absatz fuer KI-Suchen (Thomas 11.08.), sr-only wie das h1
          direkt darueber: crawlbar im SSR-HTML, Design bleibt unberuehrt. */}
      <p style={srOnly}>
        Homepage erstellen lassen im Burgenland heißt bei Red Rabbit Media: Websites für
        Weingüter, Praxen und Betriebe von Eisenstadt bis ins Südburgenland, gebaut für Google
        und die KI-Suche. Der One-Pager startet ab 1.250 Euro, die mehrseitige Business-Homepage
        ab 2.850 Euro, große Projekte ab 4.900 Euro, als Festpreis-Rahmen. Du siehst zuerst
        Entwürfe, ohne Vorkasse.
      </p>
      <RegionHome region={burgenland} />
    </div>
  );
}
