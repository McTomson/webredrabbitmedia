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
import BauMoment from '@/components/subpages/leistungen/BauMoment';
import WasDuBekommst from '@/components/subpages/leistungen/WasDuBekommst';
import Scharnierzeile from '@/components/subpages/leistungen/Scharnierzeile';
import TalosSlot from '@/components/subpages/leistungen/TalosSlot';
import Referenzen from '@/components/subpages/leistungen/Referenzen';
import MehrAlsWebsite from '@/components/subpages/leistungen/MehrAlsWebsite';
import LeistungenFaq from '@/components/subpages/leistungen/LeistungenFaq';
import SchlussCta from '@/components/subpages/leistungen/SchlussCta';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';
import '@/components/subpages/leistungen/leistungen.css';

/**
 * Leistungen-Hub (Preview, noindex) — Server-Komponente nach dem autoritativen
 * 9-Sektionen-Fluss aus docs/strategie/LEISTUNGEN_IA_2026-07.md, Abschnitt
 * "KORREKTUR 19.07. (spaet)" (Zeilen 113-153, die verbindliche Fassung).
 * Kern-Regel: erst das Produkt (Website) beweisen, bis kein Zweifel bleibt,
 * DANN den Helfer (Talos) im GLEICHEN Rahmen einfuehren — Talos ist ein Verb
 * ("Website, die mitarbeitet"), kein zweiter Pfeiler.
 *
 * Zwei Sektionen sind bewusste SLOTs (Bau-Moment, Talos-Auftritt) mit
 * statischem SSR-Fallback-Text; Fable verdrahtet dort spaeter die echten
 * Bewegt-Komponenten. Kein Import auf Verdacht — die Komponenten existieren
 * noch nicht, ein Import haette tsc/Build gebrochen.
 *
 * Chrome (RabbitMark/RelaunchMenu/FooterReassembly, Fonts, styleguide.css)
 * 1:1 aus dem bisherigen Muster dieser Seite / der Tipps-Seite uebernommen
 * (UNTERSEITEN_STIL.md §1). Fraunces ist ausgemustert (06.07.), nur noch
 * DM Sans / Crimson Pro / Instrument Sans.
 */
export const metadata: Metadata = {
  title: 'Leistungen · Red Rabbit Media',
  description:
    'Eine individuell gebaute Website mit Design, Hosting, mobiler Optimierung und rechtssicherer Umsetzung – und ein Helfer, der im Hintergrund mitarbeitet.',
  robots: { index: false, follow: false },
};

export default function LeistungenPreviewPage() {
  const rrFonts = `rr ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`;

  // Paint-Hero (Wisch-Reveal) — dasselbe Template wie der Tipps-Hero. Roh-CSS +
  // Engine pro Request lesen (Next watched fs-Reads nicht auf Modulebene); das
  // HTML mit Wort + Botschaft bauen.
  const heroDir = path.join(process.cwd(), 'components/subpages/paint-hero');
  const heroCss = fs.readFileSync(path.join(heroDir, 'demo.css'), 'utf8');
  const heroJs = fs.readFileSync(path.join(heroDir, 'demo.engine.jstext'), 'utf8');
  const heroHtml = buildPaintHeroHtml('Leistungen.', ['Deine Website', 'arbeitet.', 'Auch nachts.']);

  return (
    <>
      {/* Organization + Service-Liste (ItemList) als JSON-LD — nur echte,
          belegbare Leistungen. FAQPage-JSON-LD kommt automatisch aus der
          echten Faq-Komponente in LeistungenFaq (components/relaunch/Faq.tsx). */}
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
              '@type': 'ItemList',
              name: 'Leistungen von Red Rabbit Media',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  item: {
                    '@type': 'Service',
                    name: 'Website',
                    description:
                      'Individuell gebaute Website inklusive Hosting, Pflege, monatlichem Check und Zahlen im Klartext. Kein Baukasten, kein Wartungsvertrag.',
                    provider: { '@type': 'Organization', name: 'Red Rabbit Media' },
                  },
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  item: {
                    '@type': 'Service',
                    name: 'Der Schreiber',
                    description:
                      'Automatisierte Inhalte: Die Website erstellt regelmäßig neue Beiträge zum Handwerk des Betriebs, die per Klick freigegeben werden, für Sichtbarkeit bei Google und in Antwortmaschinen.',
                    provider: { '@type': 'Organization', name: 'Red Rabbit Media' },
                  },
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  item: {
                    '@type': 'Service',
                    name: 'Der Empfang',
                    description:
                      'Termine buchen sich online, Anfragen werden angenommen und beantwortet, wahlweise als Vorschlag zur Freigabe oder im Autopilot.',
                    provider: { '@type': 'Organization', name: 'Red Rabbit Media' },
                  },
                },
                {
                  '@type': 'ListItem',
                  position: 4,
                  item: {
                    '@type': 'Service',
                    name: 'Maßarbeit',
                    description:
                      'Individuell programmierte Shops, Kundenportale, Rechner und Schnittstellen. Kein Baukasten.',
                    provider: { '@type': 'Organization', name: 'Red Rabbit Media' },
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

      {/* Rote Hasen-Marke oben links (Muster aus der bisherigen Leistungen-/
          Tipps-Seite), Link zur Startseite. */}
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

      {/* 1 · Hero — Paint-Hero (Wisch-Reveal + angeschnittenes Wort "Leistungen"),
          dasselbe Template wie der Tipps-Hero. Bewusst AUSSERHALB von .rr (bringt
          eigene, auf .scene-main gescopte Styles mit). Reines Produkt, kein "KI". */}
      <PaintHeroClient css={heroCss} html={heroHtml} js={heroJs} />

      {/* Sektionen 2-9, alles SSR-Text unter echten rr-*-Bauteilen. */}
      <div className={rrFonts} style={{ background: '#ffffff' }}>
        {/* 2 · Bau-Moment */}
        <BauMoment
          headline="Handwerk, kein Baukasten"
          sub="Das bauen wir Stück für Stück für dich zusammen."
        />

        {/* 3 · Was du bekommst */}
        <WasDuBekommst />

        {/* 4 · Scharnier-Zeile — Talos wird konzeptionell eingefuehrt */}
        <Scharnierzeile />

        {/* 5 · SLOT: Talos-Auftritt */}
        <TalosSlot />

        {/* 6 · Referenzen — EIN echter Teal-Quote-Moment, Gold-Sterne */}
        <Referenzen />

        {/* 7 · Mehr als eine normale Website — Zeit statt Geld */}
        <MehrAlsWebsite />

        {/* 8 · FAQ zweispaltig */}
        <LeistungenFaq />

        {/* 9 · Schluss-CTA — produktbezogen, Preise auf /preise */}
        <SchlussCta />
      </div>

      {/* Footer der Hauptseite (opak, deckt die fixe Buehne beim Herunterscrollen). */}
      <div className={rrFonts} style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        <FooterReassembly />
      </div>
    </>
  );
}
