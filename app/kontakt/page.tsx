import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import KontaktDemoClient from '@/components/subpages/KontaktDemoClient';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import CornerLogo from '@/components/relaunch/CornerLogo';
import BackToTop from '@/components/relaunch/BackToTop';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import SiteClosing from '@/components/relaunch/SiteClosing';
import ScrollExperience from '@/components/relaunch/ScrollExperience';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';

// Rohteile der Kontakt-Seite (Template = ueber-uns-demo, Inhalte Kontakt).
// WICHTIG: Reads muessen IN der Komponente passieren (pro Request), nicht auf
// Modulebene — Next watched fs-Reads nicht, Edits an demo.* waeren im Dev-Server
// sonst unsichtbar bis zum Neustart (Lesson vom 14.07., ueber-uns).
const DEMO_DIR = path.join(process.cwd(), 'components/subpages/kontakt-demo');
const readDemo = (f: string) => fs.readFileSync(path.join(DEMO_DIR, f), 'utf8');

export const metadata: Metadata = {
  title: 'Kontakt · Red Rabbit Media',
  description:
    'Erzähl uns kurz, wo es hakt. Kein Verkaufsanruf, kein Newsletter: wir lesen, schauen uns deinen Betrieb an und schreiben dir zurück.',
  alternates: { canonical: '/kontakt' },
};

export default function KontaktPage() {
  const css = readDemo('demo.css');
  const html = readDemo('demo.body.html');
  const js = readDemo('demo.engine.jstext');
  return (
    <>
      {/* Page-Level-Schema (Thomas 09.08.): ContactPage + Breadcrumb, verifizierter NAP
          (office@redrabbit.media, +43 676 9000955). URLs auf Go-Live-Root (/kontakt),
          Org via @id aus dem globalen @graph. Verwandt: reference_relaunch_golive_domain_modell. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'ContactPage',
              '@id': 'https://web.redrabbit.media/kontakt#contactpage',
              url: 'https://web.redrabbit.media/kontakt',
              name: 'Kontakt · Red Rabbit Media',
              description:
                'Erzähl uns kurz, wo es hakt. Kein Verkaufsanruf, kein Newsletter: wir lesen, schauen uns deinen Betrieb an und schreiben dir zurück.',
              inLanguage: 'de-AT',
              isPartOf: { '@id': 'https://web.redrabbit.media/#website' },
              about: { '@id': 'https://web.redrabbit.media/#organization' },
              mainEntity: {
                '@type': 'Organization',
                '@id': 'https://web.redrabbit.media/#organization',
                name: 'Red Rabbit Media',
                url: 'https://web.redrabbit.media',
                email: 'office@redrabbit.media',
                telephone: '+436769000955',
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'customer service',
                  email: 'office@redrabbit.media',
                  telephone: '+436769000955',
                  areaServed: 'AT',
                  availableLanguage: ['de'],
                },
              },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://web.redrabbit.media/' },
                { '@type': 'ListItem', position: 2, name: 'Kontakt', item: 'https://web.redrabbit.media/kontakt' },
              ],
            },
          ],
        }}
      />

      {/* LCP-Poster mobil frueh laden (Thomas 06.08.), nur Mobile/Tablet. */}
      <link rel="preload" as="image" href="/hero/kontakt-hero-poster.jpg" fetchPriority="high" media="(max-width: 1024px)" />
      {/* Fonts wie in der Demo (DM Sans, Instrument Sans, Crimson Pro). */}
      {/* Hamburger-Menue der Hauptseite. Wrapper liefert NUR die .rr-Font-Variablen
          fuer das styled-jsx-gekapselte Menue; der Demo-Inhalt bleibt bewusst
          AUSSERHALB des .rr-Scopes (keine Style-Leaks in demo.css). */}
      <div
        className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}
        style={{ background: 'transparent' }}
      >
        <RelaunchMenu />
      </div>
      {/* Ecken-Logo (rote Hasen-Marke oben links) — gemeinsames Bauteil,
          blendet erst nach dem Zerlegen der Hero-Woerter ein. */}
      <CornerLogo />
      <BackToTop />
      {/* Stopps pro Szene: data-rr-snap/-exempt sitzen seit 29.07. direkt an
          den <section>-Tags im demo.body.html (Sticky-Szenen exempt, normale
          Szenen = Pflicht-Stopp-Ziele). Kein pauschaler Exempt mehr. */}
      <div>
        <KontaktDemoClient css={css} html={html} js={js} />
      </div>

      {/* Abschluss-Block + ECHTER Footer (28.07., Design-Vereinheitlichung):
          der Nachbau-Footer und der zentrierte Schluss-CTA im demo.body.html
          sind raus, hier stehen die gemeinsamen Bauteile. Wrapper liefert nur
          die .rr-Font-Variablen (Muster wie beim Menue oben). */}
      <div className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`} style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        {/* Volle Bauhoehe wie auf der Homepage (Thomas 29.07.: compact war zu klein). */}
        <SiteClosing
          lines={[
            'Du schreibst lieber nicht?',
            'Dann reden wir einfach.',
          ]}
        />
        <div data-rr-snap>
          <FooterReassembly />
        </div>
      </div>

      {/* Site-weites Scroll-Gefuehl: Lenis + Soft-Snap (Thomas 28.07.). */}
      <ScrollExperience />
    </>
  );
}
