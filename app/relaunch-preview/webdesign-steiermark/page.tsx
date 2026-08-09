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
  title: 'Webdesign Steiermark | Red Rabbit Media',
  description:
    'Websites für steirische Betriebe von Graz bis ins Ennstal, die bei Google und in der KI-Suche gefunden werden und Anfragen bringen. Entwurf zuerst, ohne Vorkasse.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/relaunch-preview/webdesign-steiermark' },
  openGraph: {
    title: 'Webdesign Steiermark | Red Rabbit Media',
    description:
      'Websites für steirische Betriebe von Graz bis ins Ennstal, die gefunden werden und Anfragen bringen. Entwurf zuerst, ohne Vorkasse.',
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
    ],
    reachLine:
      'Ob dein Kunde in Graz sucht, in Leoben oder irgendwo im Ennstal, wo grad noch ein Balken Empfang ist: gefunden wirst du.',
    trustLine:
      'Ein paar steirische Betriebe haben uns früh vertraut. Die meisten sind heute noch da. Rausgeworfen hat uns keiner.',
    availabilityHeading: 'Nach dem Launch sind wir nicht plötzlich weg.',
    availabilityText:
      'Kein Ticket-System, keine Warteschleife. Du schreibst uns, wir kümmern uns. Deine Seite ist bei uns nichts, das man einmal abhakt und vergisst. Die wächst mit, so wie dein Betrieb.',
  },
  faqEyebrow: 'Häufige Fragen aus der Steiermark',
  faq: [
    {
      q: 'Was kostet eine Website für meinen steirischen Betrieb?',
      a: 'Wir arbeiten mit klaren Fixpreisen, nicht mit Stundenzetteln. Eine solide Website startet ab 1.250 Euro, größere Projekte mehr. Was in welchem Paket steckt, siehst du offen auf unserer Preisseite.',
    },
    {
      q: 'Wie werde ich in der Steiermark bei Google gefunden?',
      a: 'Wir bauen deine Seite von Anfang an so, dass sie für die Suchbegriffe deiner Region auftaucht, bei Google und in der KI-Suche. Kein nachträgliches SEO-Geflick, sondern von der ersten Zeile an mitgedacht.',
    },
    {
      q: 'Gibt es Förderungen für eine Website in der Steiermark?',
      a: 'Für digitale Projekte gibt es österreichweit KMU.DIGITAL, das einen Teil der Kosten fördern kann. Ob dein Vorhaben passt, hängt vom Betrieb ab. Wir sagen dir ehrlich, ob sich der Antrag lohnt, und liefern dir die Unterlagen dafür.',
    },
    {
      q: 'Wie lange dauert es, bis meine Seite online ist?',
      a: 'Eine kompakte Website steht meist in zwei bis vier Wochen, je nachdem wie schnell Texte und Bilder da sind. Größere Projekte dauern länger. Den Zeitplan legen wir vorher gemeinsam fest, keine offenen Enden.',
    },
    {
      q: 'Baut ihr nur für bestimmte Branchen?',
      a: 'Nein. Vom Heizungsbauer bis zur Beratung, unsere Kunden in der Steiermark kommen aus ganz unterschiedlichen Branchen. Was zählt, ist eine Seite, die zu deinem Betrieb passt und Anfragen bringt, nicht eine Vorlage von der Stange.',
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
      name: 'Webdesign Steiermark | Red Rabbit Media',
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
        Webdesign Steiermark: Websites für steirische Betriebe von Graz bis ins Ennstal
      </h1>
      <RegionHome region={steiermark} />
    </div>
  );
}
