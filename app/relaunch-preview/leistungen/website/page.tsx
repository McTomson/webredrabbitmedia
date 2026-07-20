import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RabbitMark } from '@/components/relaunch/RabbitMark';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import WebsiteDemoClient from '@/components/subpages/WebsiteDemoClient';
import Fundament from '@/components/subpages/leistungen/website/v2/Fundament';
import Diagnose from '@/components/subpages/leistungen/website/v2/Diagnose';
import Ablauf from '@/components/subpages/leistungen/website/v2/Ablauf';
import DreiStufen from '@/components/subpages/leistungen/website/v2/DreiStufen';
import KollegeAnreisser from '@/components/subpages/leistungen/website/v2/KollegeAnreisser';
import Testimonials from '@/components/subpages/leistungen/website/v2/Testimonials';
import WebsiteFaq from '@/components/subpages/leistungen/website/WebsiteFaq';
import SchlussCta from '@/components/subpages/leistungen/website/SchlussCta';
import JsonLd from '@/components/JsonLd';
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

  // Volle geklonte Scroll-Strecke (Hero + Story/Haltung/FAQ/CTA bereits
  // enthalten) aus components/subpages/website-demo/. Reads pro Request
  // (IN der Komponentenfunktion, nicht auf Modulebene) fuer Dev-Hot-Reload.
  const heroDir = path.join(process.cwd(), 'components/subpages/website-demo');
  const heroCss = fs.readFileSync(path.join(heroDir, 'demo.css'), 'utf8');
  const heroHtml = fs.readFileSync(path.join(heroDir, 'demo.body.html'), 'utf8');
  const heroJs = fs.readFileSync(path.join(heroDir, 'demo.engine.jstext'), 'utf8');

  return (
    <>
      {/* Organization + Service (Website) als JSON-LD. */}
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

      {/* 1 · Hero = die ueber-uns-Malmechanik, aber hero-only (Wort "Website" +
          Wisch + Zahnrad-Figur comp={0} + Story-Spalte). Demo-Inhalt bewusst
          AUSSERHALB des .rr-Font-Scopes (kein Style-Leak in demo.css), wie bei
          der ueber-uns-Seite. Story/Haltung/FAQ/CTA sind jetzt echte
          React-Sektionen darunter (rr-*-Bauteile). */}
      <WebsiteDemoClient css={heroCss} html={heroHtml} js={heroJs} />

      {/* 2-9 · Inhalts-Sektionen, echte rr-*-Bauteile im .rr-Font-Scope auf Weiss. */}
      <div className={rrFonts} style={{ background: '#ffffff', position: 'relative', zIndex: 2 }}>
        <Fundament />
        <Diagnose />
        <Ablauf />
        <DreiStufen />
        <KollegeAnreisser />
        <Testimonials />
        <WebsiteFaq />
        <SchlussCta />
      </div>

      <div className={rrFonts} style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        <FooterReassembly />
      </div>
    </>
  );
}
