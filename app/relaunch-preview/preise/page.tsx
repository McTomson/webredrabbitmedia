import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import CornerLogo from '@/components/relaunch/CornerLogo';
import BackToTop from '@/components/relaunch/BackToTop';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import TalosCompanionStage from '@/components/relaunch/talos/TalosCompanionStageLazy';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import PreiseDemoClient from '@/components/subpages/PreiseDemoClient';
import ScrollBumper from '@/components/subpages/leistungen/ScrollBumper';
import RisikoBand from '@/components/subpages/preise/RisikoBand';
import PreiseMatrix from '@/components/subpages/preise/PreiseMatrix';
import BetreuungFoerderung from '@/components/subpages/preise/BetreuungFoerderung';
import TalosTalenteFahrt from '@/components/subpages/preise/TalosTalenteFahrt';
import MehrwertRechner from '@/components/subpages/preise/MehrwertRechner';
import PreiseFaq from '@/components/subpages/preise/PreiseFaq';
import SiteClosing from '@/components/relaunch/SiteClosing';
import ScrollExperience from '@/components/relaunch/ScrollExperience';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';
import '@/components/subpages/leistungen/wd-eyebrow.css';

/**
 * Preise, Preview, noindex — Server-Komponente nach docs/UNTERSEITEN_STIL.md,
 * Muster 1:1 aus app/relaunch-preview/leistungen/website/page.tsx. Inhalt/
 * Preise/Reihenfolge sind mit Thomas fixiert (brand/PREISE_SEITE_BRIEF.md) —
 * NICHT umdesignen. Preise NUR 1.250 / 2.850 / ab 4.900 (Thomas 30.07.,
 * brand/decisions-log.md) — nie 790, nie die alten 950/2.900.
 *
 * Hero = eigener demo-Ordner-Klon (components/subpages/preise-demo/), analog
 * website-demo: Wort "Preise" + Wisch + MorphSculpture comp={3} (Chart,
 * erste Verwendung) + Story-Spalte mit Headline A + Intro + CTA-Zeile.
 *
 * Chrome (RelaunchMenu/CornerLogo/FooterReassembly, Fonts, styleguide.css)
 * identisch zu den anderen Preview-Seiten uebernommen.
 */
export const metadata: Metadata = {
  title: 'Preise · Red Rabbit Media',
  description:
    'Klare Pakete ab 1.250 Euro. Den Entwurf siehst du zuerst, ganz ohne Vorkasse. Dein Cockpit ist bei jedem Paket dabei, Betreuung ohne Bindung, KMU.DIGITAL-förderbar.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/relaunch-preview/preise' },
};

export default function PreisePreviewPage() {
  const rrFonts = `rr ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`;

  // Reads pro Request (IN der Komponentenfunktion, nicht auf Modulebene) fuer
  // Dev-Hot-Reload — siehe reference_ueber_uns_template_rezept Root Cause 2.
  const heroDir = path.join(process.cwd(), 'components/subpages/preise-demo');
  const heroCss = fs.readFileSync(path.join(heroDir, 'demo.css'), 'utf8');
  const heroHtml = fs.readFileSync(path.join(heroDir, 'demo.body.html'), 'utf8');
  const heroJs = fs.readFileSync(path.join(heroDir, 'demo.engine.jstext'), 'utf8');

  return (
    <>
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
              description: 'Individuell gebaute Website zum Fixpreis, Entwurf ohne Vorkasse.',
              provider: { '@type': 'Organization', name: 'Red Rabbit Media' },
              areaServed: 'AT',
              offers: [
                { '@type': 'Offer', name: 'Starter', priceCurrency: 'EUR', price: '1250' },
                { '@type': 'Offer', name: 'Business', priceCurrency: 'EUR', price: '2850' },
                {
                  '@type': 'Offer',
                  name: 'Premium',
                  priceCurrency: 'EUR',
                  price: '4900',
                  priceSpecification: {
                    '@type': 'PriceSpecification',
                    minPrice: '4900',
                    priceCurrency: 'EUR',
                  },
                },
              ],
            },
          ],
        }}
      />

      {/* LCP-Poster mobil frueh laden (Thomas 04.08.), nur Mobile/Tablet. */}
      <link rel="preload" as="image" href="/hero/preise-hero-poster.jpg" fetchPriority="high" media="(max-width: 1024px)" />

      <CornerLogo />
      <BackToTop />

      {/* Talos-3D-Companion, stationsOnly = ueberspringt den Hero (die Seite hat
          selbst ein #sceneMain/__sculptProgress-Hero mit der Chart-Figur). Er
          erscheint nur an der Station im blauen Talos-Panel (data-talos-station
          am Figur-Slot), rechts, gross, winkend. Fixe Vollbild-Ebene. */}
      <TalosCompanionStage stationsOnly />

      <div className={rrFonts} style={{ background: 'transparent' }}>
        <RelaunchMenu />
      </div>

      {/* 1 · Hero = ueber-uns/website-Malmechanik, hero-only (Wort "Preise" +
          Wisch + Chart-Figur comp={3} + Story-Spalte mit Headline A + Intro +
          CTA-Zeile). Demo-Inhalt bewusst AUSSERHALB des .rr-Font-Scopes. */}
      {/* data-rr-snap-exempt: eigene Scroll-Dramaturgie, kein Soft-Snap darin. */}
      <div data-rr-snap-exempt>
        <PreiseDemoClient css={heroCss} html={heroHtml} js={heroJs} />
      </div>

      {/* 2-7 · Inhalts-Sektionen, echte rr-*-Bauteile im .rr-Font-Scope. */}
      <div className={rrFonts} style={{ background: 'var(--rr-surface, #f4f4f2)', position: 'relative', zIndex: 2 }}>
        {/* Bumper = geteilter ScrollBumper im Site-Standard (hell, Fenster-Stopp,
            rote ( Thema )-Zeile oben; Umbau 28.07., DESIGN_STANDARD.md). Zeilen
            zentriert (Thomas 25.07.), letzter Satz mit rotem Punkt. */}
        <ScrollBumper
          label="Was du bekommst"
          statements={[
            { text: 'Wir bauen dir eine ganze Website.' },
            { text: 'Von Grund auf. Nicht von der Stange.' },
            { text: 'Dazu dein Cockpit: alle wichtigen Infos an einem Ort.' },
            { text: 'Grundfunktionen immer dabei. Mehr per Abo, wenn du willst.' },
            { text: 'Erst überzeugt, dann bezahlt.', pointe: true },
          ]}
        />
        <div data-rr-snap>
          <RisikoBand />
        </div>
        <div data-rr-snap>
          <PreiseMatrix />
        </div>
        <div data-rr-snap>
          <BetreuungFoerderung />
        </div>
        <TalosTalenteFahrt />
        <div data-rr-snap>
          <MehrwertRechner />
        </div>
        <div data-rr-snap>
          <PreiseFaq />
        </div>
        <SiteClosing
          lines={[
            'Du kennst jetzt die Zahlen.',
            'Was dein Projekt wirklich braucht, klären wir gemeinsam.',
            'Reden wir.',
          ]}
        />
      </div>

      <div className={rrFonts} data-rr-snap style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        <FooterReassembly />
      </div>

      {/* Site-weites Scroll-Gefuehl: Lenis + Soft-Snap (Thomas 28.07.). */}
      <ScrollExperience />
    </>
  );
}
