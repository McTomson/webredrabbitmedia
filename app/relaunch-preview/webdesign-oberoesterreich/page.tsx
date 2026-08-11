import type { Metadata } from 'next';
import RegionHome, { type RegionContent } from '@/components/relaunch/RegionHome';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '../../styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';

/**
 * Bundesland-Landingpage Oberoesterreich, nach dem Steiermark-Rezept
 * (docs/handoffs/NEXT_SESSION_bundesland-landingpages.md). Daten-Basis GSC 11.08.:
 * webdesign oberoesterreich 1.545 + "webdesign ooe" 780 (Kopf-Keyword dominiert,
 * OOe-Kuerzel mitnehmen), Voecklabruck/Salzkammergut-Nische 37+26. Echter
 * Kunden-Anker: Studio im Linzer Raum (anonym).
 *
 * Preview: noindex + Canonical auf Preview-Pfad. GO-LIVE: Canonical auf
 * '/webdesign-oberoesterreich', robots.index true, ersetzt die alte Seite am selben Slug.
 */

const CANONICAL_GOLIVE = 'https://web.redrabbit.media/webdesign-oberoesterreich';

export const metadata: Metadata = {
  title: 'Webdesign Oberösterreich: Websites für Betriebe in OÖ | Red Rabbit Media',
  description:
    'Webdesign in Oberösterreich: Websites für Betriebe von Linz bis ins Salzkammergut, die bei Google und in der KI-Suche auftauchen und Anfragen bringen. Entwurf zuerst, ohne Vorkasse.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/relaunch-preview/webdesign-oberoesterreich' },
  openGraph: {
    title: 'Webdesign Oberösterreich: Websites für Betriebe in OÖ | Red Rabbit Media',
    description:
      'Webdesign in Oberösterreich: Websites für Betriebe von Linz bis ins Salzkammergut, die gefunden werden und Anfragen bringen. Entwurf zuerst, ohne Vorkasse.',
    type: 'website',
    locale: 'de_AT',
    url: CANONICAL_GOLIVE,
    images: [{ url: '/og/og-image-redrabbit.jpg', width: 1200, height: 630, alt: 'Red Rabbit Media, Webdesign Oberösterreich aus Österreich' }],
  },
};

const oberoesterreich: RegionContent = {
  name: 'Oberoesterreich',
  kiStatement:
    'Wird die KI nach dem besten Anbieter Oberösterreichs gefragt, arbeiten wir daran, dass sie deinen Namen nennt.',
  problemBody:
    'Oberösterreich ist voll mit guten Betrieben, und genau das ist dein Problem. Wer in Linz oder Wels nach deiner Leistung sucht, sieht zuerst die Konkurrenz, wenn deine Website technisch müde ist oder Texte hat, nach denen niemand sucht. Dann war die teure Seite ein Schaufenster in einer Gasse, durch die keiner geht. Zeit, das selbst zu richten, hast du zwischen Aufträgen und Alltag nicht, und ein eigener Mitarbeiter nur dafür rechnet sich selten. Also bleibt alles, wie es ist. Bis jetzt.',
  beweisIntro:
    'Zahlen statt Versprechen, schwarz auf weiß. Auch oberösterreichische Betriebe sind darunter.',
  regionalBlock: {
    eyebrow: 'Webdesign in Oberösterreich',
    heading: 'Oberösterreich arbeitet. Die Frage ist, ob deine Website mitarbeitet.',
    paragraphs: [
      'Zwischen Linz, Wels und dem Salzkammergut wird jeden Tag zigfach nach Leistungen gesucht, die es hier längst gibt. Den Auftrag holt, wer im entscheidenden Moment am Handy auftaucht und dort in Sekunden überzeugt. Wir bauen dir genau diese Seite: gefunden werden, überzeugen, Anfrage rein.',
      'Du willst deine Website professionell erstellen lassen, ohne monatelanges Hin und Her? Ein Kosmetikstudio in Linz lebt von Terminbuchungen, ein Maschinenbauer in Wels von Anfragen mit Substanz, ein Ferienhof am Attersee von der Sommersaison. Drei Betriebe, drei völlig verschiedene Websites. Wir haben für jede einen Plan, bevor wir die erste Zeile bauen.',
    ],
    reachLine:
      'Gesucht wird in Linz genauso wie in Vöcklabruck oder irgendwo am Attersee. Deine Seite ist für all diese Suchen gebaut.',
    trustLine:
      'Eines der ersten Studios, das uns in Oberösterreich sein Vertrauen geschenkt hat, ist bis heute Kunde. Genau solche Geschichten wollen wir sammeln.',
    availabilityHeading: 'Wir bleiben dran, auch wenn die Seite längst läuft.',
    availabilityText:
      'Du schreibst uns, wir antworten. So einfach bleibt das auch nach dem Launch. Neue Leistungen, neue Fotos, neue Saison: deine Seite bleibt aktuell, ohne dass du dich durch ein Ticketsystem kämpfen musst.',
  },
  faqEyebrow: 'Häufige Fragen',
  faqHeading: 'Webdesign in Oberösterreich',
  faq: [
    {
      q: 'Welche Kosten kommen bei einer neuen Website auf mich zu?',
      a: 'Planbare. Der One-Pager beginnt bei 1.250 Euro, die Business-Website mit mehreren Seiten bei 2.850 Euro, umfangreiche Projekte ab 4.900 Euro. Festpreis-Rahmen statt Stundensatz-Lotterie: du weißt vor dem Start, wo du landest. Entwürfe siehst du vorher, bezahlt wird nicht im Voraus. Alle Details stehen auf der Preisseite.',
    },
    {
      q: 'Wie lange dauert es bis zur fertigen Website?',
      a: 'Die ersten grafischen Vorschläge liegen nach ein paar Tagen am Tisch. Eine kompakte Website ist danach meist in zwei bis vier Wochen online. Was am längsten dauert, sind erfahrungsgemäß Texte und Bilder aus deinem Betrieb, und dabei helfen wir aktiv mit. Der Zeitplan wird vor Projektstart fixiert.',
    },
    {
      q: 'Wie taucht mein Betrieb in Oberösterreich bei Google auf?',
      a: 'Nicht durch Zufall, sondern durch Bauweise. Deine Seite bekommt von uns schnelle Ladezeiten, saubere Struktur und Texte, die so formuliert sind, wie in Linz, Wels oder im Salzkammergut tatsächlich gesucht wird. Dieselbe Bauweise sorgt dafür, dass auch KI-Suchen wie ChatGPT deine Seite verstehen und nennen können.',
    },
    {
      q: 'Macht ihr auch Websites für Studios und Dienstleister?',
      a: 'Ja, das ist eine unserer Lieblingsdisziplinen. Ob Kosmetik, Wimpern, Physiotherapie oder Friseur: solche Betriebe leben von Terminen, also bauen wir die Buchungsanfrage prominent ein, zeigen Arbeiten in einer Galerie, die am Handy Freude macht, und verbinden die Seite mit deinem Instagram. Ein Studio aus dem Linzer Raum arbeitet seit Jahren so mit uns.',
    },
    {
      q: 'Werden Websites in Österreich gefördert?',
      a: 'Häufig ja. Das Programm KMU.DIGITAL unterstützt Digitalisierungsprojekte kleiner und mittlerer Betriebe, dazu gibt es je nach Zeitpunkt Landesinitiativen. Ob und wie viel für dich drin ist, prüfen wir vor dem Angebot. Wenn sich ein Antrag nicht auszahlt, sagen wir dir das genauso offen.',
    },
  ],
  closingLines: [
    'Du willst in Oberösterreich gefunden werden?',
    'In Linz, in Wels, am Attersee?',
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
      name: 'Webdesign Oberösterreich: Websites für Betriebe in OÖ | Red Rabbit Media',
      inLanguage: 'de-AT',
      isPartOf: { '@id': 'https://web.redrabbit.media/#website' },
      about: { '@id': 'https://web.redrabbit.media/#organization' },
    },
    {
      '@type': 'Service',
      '@id': `${CANONICAL_GOLIVE}#service`,
      name: 'Webdesign Oberösterreich',
      serviceType: 'Webdesign',
      url: CANONICAL_GOLIVE,
      provider: { '@id': 'https://web.redrabbit.media/#organization' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Oberösterreich' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://web.redrabbit.media/' },
        { '@type': 'ListItem', position: 2, name: 'Webdesign Oberösterreich', item: CANONICAL_GOLIVE },
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

export default function WebdesignOberoesterreichPage() {
  return (
    <div className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
      <JsonLd data={schema} />
      <h1 style={srOnly}>
        Webdesign Oberösterreich: Websites für Betriebe in OÖ, von Linz bis ins Salzkammergut
      </h1>
      <RegionHome region={oberoesterreich} />
    </div>
  );
}
