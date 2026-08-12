import type { Metadata } from 'next';
import RegionHome, { type RegionContent } from '@/components/relaunch/RegionHome';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';

/**
 * Bundesland-Landingpage Tirol, nach dem Steiermark-Rezept
 * (docs/handoffs/NEXT_SESSION_bundesland-landingpages.md). Daten-Basis GSC 11.08.:
 * "homepage erstellung tirol" 351 (!) -> Homepage-Sprache Pflicht; webdesigner 461;
 * webseitenprogrammierung 135+86 (nur hier). Branchen-Anker: Hotellerie/Vermieter
 * (Tourismus-Land, Saison-Argument).
 *
 * Preview: noindex + Canonical auf Preview-Pfad. GO-LIVE: Canonical auf
 * '/webdesign-tirol', robots.index true, ersetzt die alte Seite am selben Slug.
 */

const CANONICAL_GOLIVE = 'https://web.redrabbit.media/webdesign-tirol';

export const metadata: Metadata = {
  title: 'Webdesign Tirol: Homepage erstellen lassen | Red Rabbit Media',
  description:
    'Homepage erstellen lassen in Tirol: Websites für Hotels, Vermieter und Betriebe von Innsbruck bis ins Zillertal, sichtbar bei Google und KI. Ohne Vorkasse.',
  alternates: { canonical: '/webdesign-tirol' },
  openGraph: {
    title: 'Webdesign Tirol: Homepage erstellen lassen | Red Rabbit Media',
    description:
      'Homepage erstellen lassen in Tirol: Websites für Hotels, Vermieter und Betriebe, die gefunden werden und buchen lassen. Entwurf zuerst, ohne Vorkasse.',
    type: 'website',
    locale: 'de_AT',
    url: CANONICAL_GOLIVE,
    images: [{ url: '/og/og-image-redrabbit.jpg', width: 1200, height: 630, alt: 'Red Rabbit Media, Webdesign Tirol aus Österreich' }],
  },
};

const tirol: RegionContent = {
  name: 'Tirol',
  kiStatement:
    'Fragt ein Gast die KI nach der besten Adresse in Tirol, soll sie deine nennen.',
  problemBody:
    'Deine Gäste und Kunden entscheiden am Handy, oft von Hamburg oder Amsterdam aus, Wochen bevor sie einen Fuß nach Tirol setzen. Wenn deine Homepage dort langsam lädt, veraltet wirkt oder gar nicht erst gefunden wird, bucht und kauft man eben woanders. Du merkst es nicht einmal, die Anfrage kommt einfach nie an. Selber nachbessern? Zwischen Saison, Personal und Tagesgeschäft bleibt dafür keine Stunde übrig. So bleibt die Website ein Kostenpunkt von damals, statt ein Verkäufer zu sein, der rund um die Uhr arbeitet.',
  beweisIntro:
    'Ergebnisse statt schöner Worte, schwarz auf weiß. So arbeiten wir auch für Tiroler Betriebe.',
  regionalBlock: {
    eyebrow: 'Webdesign in Tirol',
    heading: 'Deine Gäste suchen längst. Von daheim aus, Wochen vor der Anreise.',
    paragraphs: [
      'Tirol lebt vom ersten Eindruck, und der passiert heute auf einem Bildschirm. Zimmer, Skiverleih, Handwerk, Ordination: gesucht wird alles online, gebucht wird bei dem, der überzeugend auftaucht. Wir bauen Homepages, die genau diesen Moment gewinnen.',
      'Eine Homepage erstellen lassen ist hier keine Bequemlichkeit, sondern Betriebswirtschaft. Eine Vermieterin am Achensee braucht eine Seite, die Buchungsanfragen bringt, bevor die Saison beginnt. Ein Hotel in Kitzbühel eine, die auch auf Englisch verkauft. Und der Installateur in Innsbruck will schlicht, dass sein Telefon läutet. Drei Ziele, drei verschiedene Seiten. Wir bauen die, die zu deinem Ziel passt.',
    ],
    reachLine:
      'Ob die Suche aus Innsbruck kommt, aus dem Zillertal oder aus München: gefunden wird, wessen Seite dafür gebaut ist.',
    trustLine:
      'Die Tiroler Betriebe, die mit uns gestartet sind, sind heute noch da. Das sagt mehr als jede Hochglanz-Referenz.',
    availabilityHeading: 'Saisonstart, Preisänderung, neues Angebot: wir sind da.',
    availabilityText:
      'Eine Homepage in Tirol ist nie fertig, es gibt immer eine nächste Saison. Du schreibst uns, was sich ändert, wir setzen es um. Direkt und ohne Warteschleife, auch wenn es schnell gehen muss.',
  },
  faqEyebrow: 'Häufige Fragen',
  faqHeading: 'Homepage erstellen lassen in Tirol',
  faq: [
    {
      q: 'Was kostet es, eine Homepage erstellen zu lassen?',
      a: 'Weniger Rätselraten, als du gewohnt bist: One-Pager ab 1.250 Euro, mehrseitige Business-Homepage ab 2.850 Euro, große Projekte ab 4.900 Euro, jeweils als Festpreis-Rahmen. Du siehst zuerst 1-2 Entwürfe und zahlst nichts im Voraus. Die genauen Pakete stehen offen auf unserer Preisseite.',
    },
    {
      q: 'Wie lange dauert die Erstellung einer Homepage?',
      a: 'Erste Entwürfe gibt es nach wenigen Tagen, online ist eine kompakte Homepage meist nach zwei bis vier Wochen. Wenn bei dir eine Saison ansteht, planen wir rückwärts: erst der Termin, zu dem die Seite verkaufen muss, dann der Fahrplan dorthin. Was wir zusagen, hältst du schriftlich in der Hand.',
    },
    {
      q: 'Wie wird mein Betrieb in Tirol bei Google gefunden?',
      a: 'Deine Homepage wird von der ersten Zeile an auf die Suchen gebaut, die zu deinem Betrieb führen, egal ob sie aus Innsbruck kommen oder aus dem Ausland. Schnelle Ladezeiten, saubere Programmierung und Texte in echter Suchsprache gehören dazu. Damit können auch KI-Suchen wie ChatGPT deine Seite lesen und weiterempfehlen.',
    },
    {
      q: 'Macht ihr auch Websites für Hotels und Vermieter?',
      a: 'Ja, sehr gern. Bei Unterkünften zählt, dass der Gast in Sekunden sieht, wo er landet, und in zwei Klicks anfragen kann: große Fotos, klare Preise, Verfügbarkeits-Anfrage ohne Umwege, auf Wunsch auf Deutsch und Englisch. Eine träge Buchungsstrecke kostet in einer Saison mehr, als die ganze Homepage kostet. Und falls du kein Vermieter bist: dieselbe Sorgfalt bekommt jeder Betrieb.',
    },
    {
      q: 'Fördert der Staat meine neue Homepage?',
      a: 'Oft ja: KMU.DIGITAL bezuschusst Digitalisierungsprojekte von Klein- und Mittelbetrieben, auch in Tirol. Ob dein Projekt hineinfällt und ob sich der Aufwand rechnet, sagen wir dir ehrlich, bevor du unterschreibst. Die nötigen Unterlagen bereiten wir mit vor.',
    },
  ],
  closingLines: [
    'Du willst, dass Tirol dich findet, und deine Gäste auch?',
    'Bevor die nächste Saison startet?',
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
      name: 'Webdesign Tirol: Homepage erstellen lassen | Red Rabbit Media',
      inLanguage: 'de-AT',
      isPartOf: { '@id': 'https://web.redrabbit.media/#website' },
      about: { '@id': 'https://web.redrabbit.media/#organization' },
    },
    {
      '@type': 'Service',
      '@id': `${CANONICAL_GOLIVE}#service`,
      name: 'Webdesign Tirol',
      serviceType: 'Webdesign',
      url: CANONICAL_GOLIVE,
      provider: { '@id': 'https://web.redrabbit.media/#organization' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Tirol' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://web.redrabbit.media/' },
        { '@type': 'ListItem', position: 2, name: 'Webdesign Tirol', item: CANONICAL_GOLIVE },
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

export default function WebdesignTirolPage() {
  return (
    <div className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
      <JsonLd data={schema} />
      <h1 style={srOnly}>
        Webdesign Tirol: Homepage erstellen lassen für Hotels, Vermieter und Betriebe von Innsbruck bis ins Zillertal
      </h1>
      {/* Kernantwort-Absatz fuer KI-Suchen (Thomas 11.08.), sr-only wie das h1
          direkt darueber: crawlbar im SSR-HTML, Design bleibt unberuehrt. */}
      <p style={srOnly}>
        Webdesign in Tirol heißt bei Red Rabbit Media: Homepages für Hotels, Vermieter und
        Handwerksbetriebe von Innsbruck bis ins Zillertal, gebaut für Google und die KI-Suche.
        Der One-Pager startet ab 1.250 Euro, die mehrseitige Business-Website ab 2.850 Euro,
        große Projekte ab 4.900 Euro, immer als Festpreis-Rahmen. Du siehst zuerst 1-2 grafische
        Entwürfe, ohne Vorkasse.
      </p>
      <RegionHome region={tirol} />
    </div>
  );
}
