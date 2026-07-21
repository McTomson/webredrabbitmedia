import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RabbitMark } from '@/components/relaunch/RabbitMark';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import LeistungenHero2Client from '@/components/subpages/LeistungenHero2Client';
import LeistungenUeberblick from '@/components/subpages/leistungen/LeistungenUeberblick';
import JsonLd from '@/components/JsonLd';
import Scharnierzeile from '@/components/subpages/leistungen/Scharnierzeile';
import TalosSlot from '@/components/subpages/leistungen/TalosSlot';
import KundenSagen from '@/components/subpages/leistungen/KundenSagen';
import LeistungenFaq from '@/components/subpages/leistungen/LeistungenFaq';
import SchlussCta from '@/components/subpages/leistungen/SchlussCta';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';
import '@/components/subpages/leistungen/leistungen.css';

/**
 * Leistungen-Hub (Preview, noindex) — Server-Komponente. Aufbau nach dem
 * Schnitt vom 21.07. (Thomas): Hero (ueber-uns-Klon mit Zahnrad-Figur) ->
 * LeistungenUeberblick (6 Punkte, pixelperfektion-Raster, Kern-Botschaft
 * "Kommandozentrale") -> Scharnierzeile -> TalosSlot (der eine Teal-Moment)
 * -> KundenSagen -> FAQ -> CTA -> Footer.
 * BauMoment/WasDuBekommst/WasSieKann/MehrAlsWebsite sind bewusst RAUS —
 * ihr Inhalt steckt verdichtet in den 6 Punkten (keine Dopplung).
 * Kern-Regel bleibt: erst das Produkt (Website) beweisen, DANN der Helfer
 * als Verb ("Website, die mitarbeitet"), kein zweiter Pfeiler.
 *
 * Chrome (RabbitMark/RelaunchMenu/FooterReassembly, Fonts, styleguide.css)
 * 1:1 aus dem Muster der Tipps-Seite (UNTERSEITEN_STIL.md §1); nur noch
 * DM Sans / Crimson Pro / Instrument Sans.
 */
export const metadata: Metadata = {
  title: 'Leistungen · Red Rabbit Media',
  description:
    'Eine individuell gebaute Website mit Design, Hosting und Kommandozentrale: ein Dashboard, in dem du alles selbst änderst, und Helfer, die im Hintergrund mitarbeiten.',
  robots: { index: false, follow: false },
};

export default function LeistungenPreviewPage() {
  const rrFonts = `rr ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`;

  // Hero = ueber-uns/tipps-Malmechanik (Wort "Leistungen." + Wisch in EINER
  // Szene), der bereits gebaute leistungen-hero-demo. Reads pro Request (Next
  // watched fs auf Modulebene nicht). Ersetzt den abgelehnten SubpageHero.
  const heroDir = path.join(process.cwd(), 'components/subpages/leistungen-hero2-demo');
  const heroCss = fs.readFileSync(path.join(heroDir, 'demo.css'), 'utf8');
  const heroHtml = fs.readFileSync(path.join(heroDir, 'demo.body.html'), 'utf8');
  const heroJs = fs.readFileSync(path.join(heroDir, 'demo.engine.jstext'), 'utf8');

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

      {/* 1 · Hero = die GEKLONTE ueber-uns-Szene (leistungen-hero2-demo), nicht
          nachgebaut: Wort auf weissem Deck -> Wisch-Reveal legt die Botschaft frei
          -> Wort schrumpft und zerfaellt -> ZAHNRAD setzt sich aus roten Fragmenten
          zusammen -> Text scrollt daneben hoch. Alles in EINER Sticky-Szene.
          Die Figur ist MorphSculpture comp={0} (at-shapes-comp1 = Zahnrad), NICHT
          das Engine-SVG: #headSvg ist in demo.css hart ausgeblendet.
          Demo-Inhalt bewusst AUSSERHALB des .rr-Scopes (Muster ueber-uns/kontakt,
          keine Style-Leaks aus demo.css). */}
      <LeistungenHero2Client css={heroCss} html={heroHtml} js={heroJs} comp={0} />

      {/* 2 · Leistungs-Ueberblick — die 6 Punkte im vermessenen pixelperfektion-
          Layout (Paar/Interlude/Paar/Einzel, versetzt), Marke Red Rabbit. Steht
          direkt nach dem Hero als Ueberblick ueber die Gesamtleistung; die
          Detailtiefe liegt auf den Unterseiten (Website, Agenten). */}
      <div className={rrFonts} style={{ background: '#ffffff' }}>
        <LeistungenUeberblick />
      </div>

      {/* Sektionen 3-7 (Schnitt Thomas 21.07.: BauMoment, WasDuBekommst,
          WasSieKann und MehrAlsWebsite sind RAUS, ihr Inhalt steckt verdichtet
          in den 6 Punkten des Ueberblicks. Eine Aussage pro Sektion, gleich-
          maessiger Rhythmus): Scharnierzeile -> Talos (der eine Teal-Moment)
          -> KundenSagen -> FAQ -> CTA. */}
      <div className={rrFonts} style={{ background: '#ffffff' }}>
        {/* 3 · Scharnier-Zeile — Kipp-Punkt vom Bau zur mitarbeitenden Website */}
        <Scharnierzeile />

        {/* 4 · Talos-Auftritt — Talos als Gesicht der Helfer */}
        <TalosSlot />

        {/* 5 · KundenSagen — vermessene finsight.framer.ai-Sektion, Navy-Grund,
            echte Google-Rezensionen (Rafael Danesh, Rene Rohrer), Gold-Sterne */}
        <KundenSagen />

        {/* 6 · FAQ zweispaltig */}
        <LeistungenFaq />

        {/* 7 · Schluss-CTA — produktbezogen, Preise auf /preise */}
        <SchlussCta />
      </div>

      {/* Footer der Hauptseite (opak, deckt die fixe Buehne beim Herunterscrollen). */}
      <div className={rrFonts} style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        <FooterReassembly />
      </div>
    </>
  );
}
