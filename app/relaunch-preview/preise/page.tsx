import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import CornerLogo from '@/components/relaunch/CornerLogo';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import TalosCompanionStage from '@/components/relaunch/talos/TalosCompanionStage';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import PreiseDemoClient from '@/components/subpages/PreiseDemoClient';
import ScrollBumper from '@/components/subpages/leistungen/ScrollBumper';
import RisikoBand from '@/components/subpages/preise/RisikoBand';
import PreiseMatrix from '@/components/subpages/preise/PreiseMatrix';
import BetreuungFoerderung from '@/components/subpages/preise/BetreuungFoerderung';
import TalosTalenteFahrt from '@/components/subpages/preise/TalosTalenteFahrt';
import MehrwertRechner from '@/components/subpages/preise/MehrwertRechner';
import PreiseFaq from '@/components/subpages/preise/PreiseFaq';
import PreiseSchlussCta from '@/components/subpages/preise/PreiseSchlussCta';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';
import '@/components/subpages/leistungen/wd-eyebrow.css';

/**
 * Preise, Preview, noindex — Server-Komponente nach docs/UNTERSEITEN_STIL.md,
 * Muster 1:1 aus app/relaunch-preview/leistungen/website/page.tsx. Inhalt/
 * Preise/Reihenfolge sind mit Thomas fixiert (brand/PREISE_SEITE_BRIEF.md) —
 * NICHT umdesignen. Preise NUR 950 / 2.900 / ab 4.900, nie 790.
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
    'Klare Pakete ab 950 Euro. Den Entwurf siehst du zuerst, ganz ohne Vorkasse. Dashboard ab dem Business-Paket gratis, Betreuung ohne Bindung, KMU.DIGITAL-förderbar.',
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
                { '@type': 'Offer', name: 'Starter', priceCurrency: 'EUR', price: '950' },
                { '@type': 'Offer', name: 'Business', priceCurrency: 'EUR', price: '2900' },
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

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
      />

      <CornerLogo />

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
      <PreiseDemoClient css={heroCss} html={heroHtml} js={heroJs} />

      {/* 2-7 · Inhalts-Sektionen, echte rr-*-Bauteile im .rr-Font-Scope. */}
      <div className={rrFonts} style={{ background: '#ffffff', position: 'relative', zIndex: 2 }}>
        {/* Bumper = wiederverwendeter ScrollBumper der Leistungs-Seite (Navy,
            zentrierte Zeilen, ein Satz mittig, der naechste stupst ihn nach
            oben; letzter mit rotem Punkt). Thomas 25.07.: der eigene Bumper war
            kaputt (nichts sichtbar) und sollte "genauso wie auf der Leistungs-
            Seite" zentriert sein -> reuse statt nachbauen. */}
        <ScrollBumper
          statements={[
            { text: 'Wir bauen dir eine ganze Website.' },
            { text: 'Von Grund auf. Nicht von der Stange.' },
            { text: 'Dazu ein Dashboard: Talos, dein persönlicher Helfer.' },
            { text: 'Grundfunktionen immer dabei. Mehr per Abo, wenn du willst.' },
            { text: 'Erst überzeugt, dann bezahlt.', pointe: true },
          ]}
        />
        <RisikoBand />
        <PreiseMatrix />
        <BetreuungFoerderung />
        <TalosTalenteFahrt />
        <MehrwertRechner />
        <PreiseFaq />
        <PreiseSchlussCta />
      </div>

      <div className={rrFonts} style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        <FooterReassembly />
      </div>
    </>
  );
}
