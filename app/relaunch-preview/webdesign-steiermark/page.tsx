import type { Metadata } from 'next';
import Link from 'next/link';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import CornerLogo from '@/components/relaunch/CornerLogo';
import BackToTop from '@/components/relaunch/BackToTop';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import Faq from '@/components/relaunch/Faq';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';

/**
 * Bundesland-Landingpage Steiermark im Relaunch-Design (Referenz-Vorlage, Thomas 09.08.).
 * Spec: docs/BUNDESLAND_SEO_GEO_RESEARCH.md.
 * - KEIN Doorway: genuiner, region-eigener Inhalt (echte steirische Kunden, ehrliches
 *   Vor-Ort/remote-Framing, regionale FAQ) statt Home-Kopie-mit-Adjektiven.
 * - Schema: Organization (via @id, echte Wien-Adresse aus app/layout.tsx) + Service mit
 *   areaServed=Steiermark + BreadcrumbList. FAQPage kommt aus der Faq-Komponente.
 *   KEIN Fake-LocalBusiness, KEINE toten geo-Meta.
 * - Preview: noindex + Canonical auf Preview-Pfad. BEIM GO-LIVE: Canonical auf
 *   '/webdesign-steiermark' umstellen, robots.index true, ersetzt die alte
 *   app/webdesign-steiermark (RegionalLandingPage) am selben Slug.
 */

const CANONICAL_GOLIVE = 'https://web.redrabbit.media/webdesign-steiermark';

export const metadata: Metadata = {
  title: 'Webdesign Steiermark | Red Rabbit Media',
  description:
    'Websites für steirische Betriebe, die schnell laden, am Handy sauber sind und Anfragen bringen. Wien-basiert, für dich auch vor Ort. Entwurf zuerst, ohne Vorkasse.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/relaunch-preview/webdesign-steiermark' },
  openGraph: {
    title: 'Webdesign Steiermark | Red Rabbit Media',
    description:
      'Websites für steirische Betriebe von Graz bis ins Ennstal. Wien-basiert, auf Wunsch vor Ort. Entwurf zuerst, ohne Vorkasse.',
    type: 'website',
    locale: 'de_AT',
    url: CANONICAL_GOLIVE,
  },
};

const faq = [
  {
    q: 'Arbeitet ihr auch in der Steiermark, obwohl ihr in Wien sitzt?',
    a: 'Ja. Wir sind in Wien zuhause und bauen Websites für Betriebe in der ganzen Steiermark, von Graz über Leoben bis ins Ennstal. Der Großteil läuft ohnehin remote, per Call und Bildschirmfreigabe. Wo es hilft, kommen wir auch vor Ort.',
  },
  {
    q: 'Kommt ihr für ein Projekt vor Ort nach Graz oder in die Region?',
    a: 'Auf Wunsch ja. Für ein Kennenlernen oder einen Fototermin fahren wir nach Absprache in die Steiermark. Nötig ist es selten, weil wir den ganzen Ablauf sauber remote abwickeln, aber es ist nie ausgeschlossen.',
  },
  {
    q: 'Was kostet eine Website für meinen steirischen Betrieb?',
    a: 'Wir arbeiten mit klaren Fixpreisen, nicht mit Stundenzetteln. Eine solide Website startet ab 1.250 Euro, größere Projekte mehr. Was in welchem Paket steckt, siehst du offen auf unserer Preisseite.',
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
];

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

export default function WebdesignSteiermarkPage() {
  return (
    <>
      <RelaunchMenu />
      <CornerLogo />
      <BackToTop />
      <JsonLd data={schema} />

      <div className={`rr rf ${dmsans.variable} ${crimson.variable} ${grotesk.variable} ${fraunces.variable}`}>
        {/* Seitenkopf */}
        <section className="rr-section rr-pagehead">
          <div className="rr-wrap rr-narrow">
            <p className="rr-eyebrow" style={{ marginBottom: 20 }}>Webdesign · Steiermark</p>
            <h1 className="rr-claim">Websites für steirische Betriebe, die Anfragen bringen.</h1>
            <p className="rr-body-lg" style={{ marginTop: 26, maxWidth: 720, color: 'var(--rr-ink-soft)' }}>
              Von Graz bis ins Ennstal: Wir bauen Seiten, die schnell laden, am Handy sauber sind
              und Besucher zur Anfrage führen. Wien-basiert, für dich auch vor Ort. Den Entwurf
              siehst du zuerst, ganz ohne Vorkasse.
            </p>
          </div>
        </section>

        {/* Answer-first: das ehrliche Vor-Ort/remote-Framing (GEO-zitierfaehig) */}
        <section className="rr-section" style={{ paddingTop: 0 }}>
          <div className="rr-wrap rr-prose">
            <h2 className="rr-sub" style={{ marginBottom: 16 }}>
              Wie arbeitet eine Agentur aus Wien für Betriebe in der Steiermark?
            </h2>
            <p className="rr-body-lg" style={{ color: 'var(--rr-ink-soft)' }}>
              Remote-first, mit persönlichem Kontakt. Den Großteil eines Projekts wickeln wir per
              Call und Bildschirmfreigabe ab, das spart dir Wege und Zeit. Für ein Kennenlernen oder
              einen Fototermin kommen wir nach Absprache auch nach Graz oder in deine Region. Du
              bekommst dieselbe Betreuung wie ein Wiener Kunde, nur ohne dass die Entfernung im Weg
              steht.
            </p>
          </div>
        </section>

        {/* Echte steirische Referenzen (der Uniqueness-Kern, verifiziert) */}
        <section className="rr-section" style={{ paddingTop: 0 }}>
          <div className="rr-wrap rr-narrow">
            <p className="rr-eyebrow" style={{ marginBottom: 20 }}>Aus der Steiermark</p>
            <p className="rr-sub" style={{ marginBottom: 28, maxWidth: 720 }}>
              Betriebe aus der Region, für die wir gebaut haben.
            </p>
            <div className="rr-grid rr-grid-2">
              <div className="rr-card">
                <h3 className="rr-sub" style={{ marginBottom: 8 }}>ReRo Heizsysteme</h3>
                <p className="rr-body" style={{ color: 'var(--rr-ink-soft)', fontSize: 17, marginBottom: 14 }}>
                  Heizungsbau aus Admont im steirischen Ennstal. Wir haben die Website gebaut, mit der
                  aus Besuchern Anfragen werden.
                </p>
                <a className="rr-link" href="https://heating-systems.at" target="_blank" rel="noopener noreferrer">
                  heating-systems.at
                </a>
              </div>
              <div className="rr-card">
                <h3 className="rr-sub" style={{ marginBottom: 8 }}>Global Insights</h3>
                <p className="rr-body" style={{ color: 'var(--rr-ink-soft)', fontSize: 17, marginBottom: 14 }}>
                  Beratung für internationale Mobilität von Michaela Ruderes in Graz. Ein ganz anderes
                  Fach als Heizungsbau, dieselbe klare Handschrift auf der Seite.
                </p>
                <a className="rr-link" href="https://ruderes-insights.at/de" target="_blank" rel="noopener noreferrer">
                  ruderes-insights.at
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Was du bekommst (universelles Angebot, nicht Nische) */}
        <section className="rr-section" style={{ paddingTop: 0 }}>
          <div className="rr-wrap rr-narrow">
            <div className="rr-grid rr-grid-2" style={{ alignItems: 'start' }}>
              <div>
                <p className="rr-eyebrow" style={{ marginBottom: 20 }}>Was du bekommst</p>
                <p className="rr-sub">Kein Baukasten. Eine Seite, die für deinen Betrieb arbeitet.</p>
                <p className="rr-body" style={{ color: 'var(--rr-ink-soft)', fontSize: 17, marginTop: 18 }}>
                  Was genau wir machen, steht bei den{' '}
                  <Link className="rr-link" href="/leistungen">Leistungen</Link>. Die Preise findest du
                  offen auf der <Link className="rr-link" href="/preise">Preisseite</Link>.
                </p>
              </div>
              <ul className="rr-check">
                <li>Individuelles Design, auf deinen Betrieb zugeschnitten</li>
                <li>Sauber auf Handy, Tablet und Desktop</li>
                <li>Schnelle Ladezeiten und moderne Technik</li>
                <li>Auffindbar bei Google und in KI-Suchen für deine Region</li>
                <li>Klare Wege zu Anruf und Kontaktformular</li>
                <li>Den ersten Entwurf ohne Vorkasse</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ (regional, SSR-crawlbar, eigenes FAQPage-Schema) */}
        <section className="rr-section" style={{ paddingTop: 0 }}>
          <div className="rr-wrap rr-narrow">
            <p className="rr-eyebrow" style={{ marginBottom: 12 }}>Häufige Fragen aus der Steiermark</p>
            <Faq items={faq} id="faq-steiermark" />
          </div>
        </section>

        {/* Abschluss-CTA (dunkel) + interne Verlinkung (Hub-and-Spoke) */}
        <section className="rr-section rr-cta-dark">
          <div className="rr-wrap rr-narrow">
            <p className="rr-display-2" style={{ color: '#fff', maxWidth: 900 }}>
              Du willst in der Steiermark gefunden werden? Reden wir.
            </p>
            <div className="rr-cta-actions">
              <Link className="rr-btn rr-btn--ondark" href="/kontakt">Projekt anfragen</Link>
              {/* Regel (Tomson): Nummer nie im Klartext, nur Anruf-Button mit tel:-Link. */}
              <a className="rr-link" href="tel:+436769000955" style={{ color: '#fff' }}>Anrufen</a>
            </div>
            <p className="rr-body" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginTop: 30 }}>
              Mehr dazu:{' '}
              <Link className="rr-link" href="/preise" style={{ color: '#fff' }}>Preise</Link>{' · '}
              <Link className="rr-link" href="/leistungen" style={{ color: '#fff' }}>Leistungen</Link>{' · '}
              <Link className="rr-link" href="/tipps/was-kostet-eine-website" style={{ color: '#fff' }}>
                Was kostet eine Website?
              </Link>
            </p>
          </div>
        </section>

        <FooterReassembly />
      </div>
    </>
  );
}
