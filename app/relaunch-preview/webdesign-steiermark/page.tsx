import type { Metadata } from 'next';
import RegionHome, { type RegionContent } from '@/components/relaunch/RegionHome';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '../../styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';

/**
 * Bundesland-Landingpage Steiermark (Thomas 09.08.). BASIS = die echte Home
 * (RegionHome rendert die Home-Komposition mit regionalem Inhalt). Eigenstaendig
 * fuer Google gemacht durch: eigenes H1 (die Home hat keins), eigenen Title/
 * Description/Canonical, eigene index-Steuerung, Service+areaServed=Steiermark-
 * Schema, regionalisierten Haupt-Content (Problem/Beweis/KI-Szene/FAQ mit echten
 * steirischen Kunden) und einen zusaetzlichen FAQ-Block. Spec:
 * docs/BUNDESLAND_SEO_GEO_RESEARCH.md.
 *
 * Preview: noindex + Canonical auf Preview-Pfad. GO-LIVE: Canonical auf
 * '/webdesign-steiermark', robots.index true, ersetzt die alte
 * app/webdesign-steiermark (RegionalLandingPage) am selben Slug.
 */

const CANONICAL_GOLIVE = 'https://web.redrabbit.media/webdesign-steiermark';

export const metadata: Metadata = {
  title: 'Webdesign Steiermark: Website erstellen lassen | Red Rabbit Media',
  description:
    'Website erstellen lassen in der Steiermark: Seiten für Betriebe von Graz bis ins Ennstal, die bei Google und in der KI-Suche gefunden werden. Entwurf zuerst, ohne Vorkasse.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/relaunch-preview/webdesign-steiermark' },
  openGraph: {
    title: 'Webdesign Steiermark: Website erstellen lassen | Red Rabbit Media',
    description:
      'Website erstellen lassen in der Steiermark: Seiten für Betriebe von Graz bis ins Ennstal, die gefunden werden und Anfragen bringen. Entwurf zuerst, ohne Vorkasse.',
    type: 'website',
    locale: 'de_AT',
    url: CANONICAL_GOLIVE,
  },
};

const steiermark: RegionContent = {
  name: 'Steiermark',
  kiStatement:
    'Wenn jemand die KI nach dem besten Webdesigner der Steiermark fragt, soll die Antwort dein Name sein.',
  problemBody:
    'Du hast viel Geld für eine neue Website bezahlt, aber sie arbeitet nicht für dich. Wenn Kunden in der Steiermark nach dir suchen, von Graz bis ins Ennstal, tauchst du nicht auf. Um das zu ändern, müsstest du dich abends nach der Arbeit selbst hinsetzen oder einen teuren Mitarbeiter engagieren, um mühsam SEO-Texte zu schreiben und die Seite aktuell zu halten. Dafür fehlt im Alltag schlichtweg die Zeit. Deine Website ist aktuell ein toter Gegenstand, der dich Geld kostet, statt ein Werkzeug, das dir Arbeit abnimmt. Schön allein zahlt dir keine Rechnung.',
  beweisIntro:
    'Ergebnisse, schwarz auf weiß. Auch aus der Steiermark, von Betrieben, die heute noch zu unseren Stammkunden zählen.',
  regionalBlock: {
    eyebrow: 'Webdesign in der Steiermark',
    heading: 'Dein nächster Kunde in der Steiermark googelt gerade. Sieht er dich?',
    paragraphs: [
      'Die Kaufentscheidung fällt am Handy, oft bevor du überhaupt merkst, dass wer gesucht hat. Wer da nicht auftaucht, ist für den schlicht nicht da. Blöd, aber so läuft es. Wir bauen dir die Seite, die auftaucht. Und die aus dem Klick eine Anfrage macht, nicht bloß ein schaut-nett-aus.',
      'Du willst deine Website erstellen lassen statt abends selber herumzubasteln? Genau dafür gibt es uns. Wirtshaus im Ennstal, Installateur in Kapfenberg, Ordination in Graz: Steirische Betriebe ticken verschieden, und ihre Websites müssen das auch. Eine Seite, die Zimmer füllt, ist anders gebaut als eine, die Serviceanfragen bringt. Wir bauen die, die zu deinem Betrieb passt.',
    ],
    reachLine:
      'Ob dein Kunde in Graz sucht, in Leoben oder irgendwo im Ennstal, wo grad noch ein Balken Empfang ist: gefunden wirst du.',
    trustLine:
      'Ein paar steirische Betriebe haben uns früh ihr Vertrauen geschenkt. Die meisten zählen heute noch zu unseren Stammkunden.',
    availabilityHeading: 'Nach dem Launch sind wir nicht plötzlich weg.',
    availabilityText:
      'Kein Ticket-System, keine Warteschleife. Du schreibst uns, wir kümmern uns. Deine Seite ist bei uns nichts, das man einmal abhakt und vergisst. Die wächst mit, so wie dein Betrieb.',
  },
  faqEyebrow: 'Häufige Fragen',
  faqHeading: 'Website erstellen lassen in der Steiermark',
  faq: [
    {
      q: 'Was kostet es, eine professionelle Website erstellen zu lassen?',
      a: 'Bei uns startet der One-Pager ab 1.250 Euro, die mehrseitige Business-Website ab 2.850 Euro. Als Festpreis-Rahmen, nicht als Stundensatz-Lotterie: Du weißt vorher, was es kostet. Und bevor du dich festlegst, siehst du 1-2 grafische Vorschläge, ohne Vorkasse. Was in welchem Paket steckt, steht offen auf unserer Preisseite.',
    },
    {
      q: 'Wie lange dauert es, eine Website erstellen zu lassen?',
      a: 'Die ersten Vorschläge siehst du nach ein paar Tagen. Eine kompakte Website ist meist in zwei bis vier Wochen online, je nachdem, wie schnell Texte und Bilder beisammen sind. Größere Projekte brauchen länger. Den Zeitplan legen wir vorher gemeinsam fest, damit nichts offen bleibt.',
    },
    {
      q: 'Wie werde ich in der Steiermark bei Google gefunden?',
      a: 'Wir bauen deine Seite von der ersten Zeile an so, dass sie für die Suchbegriffe deiner Region auftaucht, bei Google und in der KI-Suche. Kein nachträgliches SEO-Geflick. Dazu gehören saubere Technik, schnelle Ladezeiten und Texte, die so formuliert sind, wie deine Kunden wirklich suchen.',
    },
    {
      q: 'Macht ihr auch Websites für Gastronomie und Tourismus?',
      a: 'Ja, und gern. Gerade in der Steiermark hängt viel am Tourismus, vom Wirtshaus bis zur Ferienwohnung. Eine Seite, die Tische oder Zimmer füllt, braucht anderes als eine Firmenseite: Speisekarte, die am Handy lesbar ist, Anfrage in zwei Klicks, Fotos, die Appetit machen. Und bist du Installateur statt Wirt, passt das genauso. Wir sind auf keine Branche festgenagelt.',
    },
    {
      q: 'Gibt es Förderungen für eine Website in der Steiermark?',
      a: 'Für digitale Projekte gibt es österreichweit KMU.DIGITAL, das einen Teil der Kosten fördern kann. Ob dein Vorhaben passt, hängt vom Betrieb ab. Wir sagen dir ehrlich, ob sich der Antrag lohnt, und liefern dir die Unterlagen dafür.',
    },
  ],
  closingLines: [
    'Du willst in der Steiermark gefunden werden?',
    'Und dass dich die KI empfiehlt, wenn jemand nach der besten Agentur fragt?',
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
      name: 'Webdesign Steiermark: Website erstellen lassen | Red Rabbit Media',
      inLanguage: 'de-AT',
      isPartOf: { '@id': 'https://web.redrabbit.media/#website' },
      about: { '@id': 'https://web.redrabbit.media/#organization' },
    },
    {
      '@type': 'Service',
      '@id': `${CANONICAL_GOLIVE}#service`,
      name: 'Webdesign Steiermark',
      serviceType: 'Webdesign',
      url: CANONICAL_GOLIVE,
      provider: { '@id': 'https://web.redrabbit.media/#organization' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Steiermark' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://web.redrabbit.media/' },
        { '@type': 'ListItem', position: 2, name: 'Webdesign Steiermark', item: CANONICAL_GOLIVE },
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

export default function WebdesignSteiermarkPage() {
  return (
    <div className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
      <JsonLd data={schema} />
      {/* Eigenes, eindeutiges H1 (die Home hat keins) — der staerkste
          Einzelsignal, dass Google die Seite als eigene Region-Seite wertet. */}
      <h1 style={srOnly}>
        Webdesign Steiermark: Website erstellen lassen für Betriebe von Graz bis ins Ennstal
      </h1>
      <RegionHome region={steiermark} />
    </div>
  );
}
