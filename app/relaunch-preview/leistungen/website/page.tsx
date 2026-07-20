import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RabbitMark } from '@/components/relaunch/RabbitMark';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import PaintHeroClient from '@/components/subpages/PaintHeroClient';
import { buildPaintHeroHtml } from '@/components/subpages/paintHeroHtml';
import JsonLd from '@/components/JsonLd';
import WasEntsteht from '@/components/subpages/leistungen/website/WasEntsteht';
import WieWirBauen from '@/components/subpages/leistungen/website/WieWirBauen';
import WasInklusive from '@/components/subpages/leistungen/website/WasInklusive';
import FuerWenNicht from '@/components/subpages/leistungen/website/FuerWenNicht';
import WebsiteFaq from '@/components/subpages/leistungen/website/WebsiteFaq';
import SchlussCta from '@/components/subpages/leistungen/website/SchlussCta';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';
import '@/components/subpages/leistungen/website/website.css';

/**
 * Leistungen — Website ("Der Bau"), Preview, noindex — Server-Komponente
 * nach docs/UNTERSEITEN_STIL.md, Muster 1:1 aus dem frisch gebauten Hub
 * (app/relaunch-preview/leistungen/page.tsx). Reines Produkt: Website neu
 * bauen oder relaunchen, Fixpreis, kein Baukasten, gehoert dir. Bewusst KEIN
 * Talos/3D auf dieser Seite (das ist /leistungen/talos vorbehalten) und
 * KEINE Preise (jeder Preis-Bezug verweist auf /preise).
 *
 * Copy 1:1 aus scratchpad/leistungen-copy.md Abschnitt B — Open Loop: der
 * Hero fragt "du hast schon eine Website, warum ruft keiner an", aufgeloest
 * im Schluss-CTA ("eine Website muss mehr sein als schoen").
 *
 * Chrome (RabbitMark/RelaunchMenu/FooterReassembly, Fonts, styleguide.css)
 * identisch zum Hub uebernommen (UNTERSEITEN_STIL.md §1).
 */
export const metadata: Metadata = {
  title: 'Website · Leistungen · Red Rabbit Media',
  description:
    'Individuell gebaute Website, neu erstellt oder von Grund auf erneuert. Fixpreis, kein Baukasten, kein Wartungsvertrag, Entwurf ohne Vorkasse.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/relaunch-preview/leistungen/website' },
};

export default function LeistungenWebsitePreviewPage() {
  const rrFonts = `rr ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`;

  // Paint-Hero (Wisch-Reveal) — dasselbe Template wie der Tipps-Hero.
  const heroDir = path.join(process.cwd(), 'components/subpages/paint-hero');
  const heroCss = fs.readFileSync(path.join(heroDir, 'demo.css'), 'utf8');
  const heroJs = fs.readFileSync(path.join(heroDir, 'demo.engine.jstext'), 'utf8');
  const heroHtml = buildPaintHeroHtml('Website.', ['Sie gehört dir.', 'Nicht uns.']);

  return (
    <>
      {/* Organization + Service (Website) + FAQPage (kommt automatisch aus
          der echten Faq-Komponente in WebsiteFaq) als JSON-LD. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': 'https://web.redrabbit.media/#organization',
              name: 'Red Rabbit Media',
              url: 'https://web.redrabbit.media',
            },
            {
              '@type': 'Service',
              name: 'Website',
              description:
                'Individuell gebaute Website inklusive Design, Hosting, mobiler Optimierung, rechtssicherer Umsetzung, Kontaktformular und Grund-SEO. Neu erstellt oder als Relaunch, zu einem Fixpreis, Entwurf ohne Vorkasse.',
              provider: { '@type': 'Organization', name: 'Red Rabbit Media' },
              areaServed: 'AT',
            },
          ],
        }}
      />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
      />

      {/* Rote Hasen-Marke oben links, Link zur Startseite (Muster aus Hub). */}
      <Link
        href="/relaunch-preview"
        aria-label="Zur Startseite"
        style={{
          position: 'fixed',
          top: 'clamp(18px, 2.4vw, 34px)',
          left: 'var(--rr-gutter, clamp(20px, 4vw, 64px))',
          zIndex: 43,
          display: 'block',
          lineHeight: 0,
        }}
      >
        <RabbitMark style={{ display: 'block', width: 'clamp(18px, 1.8vw, 21px)', height: 'auto' }} />
      </Link>

      {/* Hamburger-Menue der Hauptseite; .rr-Wrapper liefert nur Font-Variablen. */}
      <div className={rrFonts} style={{ background: 'transparent' }}>
        <RelaunchMenu />
      </div>

      {/* Hero — Paint-Hero (Wisch-Reveal + angeschnittenes Wort "Website"),
          dasselbe Template wie der Tipps-Hero. Bewusst AUSSERHALB von .rr. */}
      <PaintHeroClient css={heroCss} html={heroHtml} js={heroJs} />

      <div className={rrFonts} style={{ background: '#ffffff' }}>
        <WasEntsteht />
        <WieWirBauen />
        <WasInklusive />
        <FuerWenNicht />
        <WebsiteFaq />
        <SchlussCta />
      </div>

      <div className={rrFonts} style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        <FooterReassembly />
      </div>
    </>
  );
}
