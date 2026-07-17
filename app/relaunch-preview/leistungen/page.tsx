import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog/posts';
import LeistungenHeroClient from '@/components/subpages/LeistungenHeroClient';
import LeistungenStory from '@/components/relaunch/LeistungenStory';
import { RabbitMark } from '@/components/relaunch/RabbitMark';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';

// Rohteile des Leistungen-Hero (Template = tipps/faq-Hero ohne Skulptur, nur
// Titel-Anschnitt "Leistungen." + Malen). WICHTIG: Reads muessen IN der
// Komponente passieren (pro Request), nicht auf Modulebene — Next watched
// fs-Reads nicht, Edits an demo.* waeren im Dev-Server sonst unsichtbar bis
// zum Neustart (Lesson 14.07., ueber-uns).
const HERO_DIR = path.join(process.cwd(), 'components/subpages/leistungen-hero-demo');
const readHero = (f: string) => fs.readFileSync(path.join(HERO_DIR, f), 'utf8');

/**
 * Leistungs-Hub im Relaunch-Look (Preview, noindex): "Die Website, die ein Team
 * ist." Hero (leistungen-hero-demo) + LeistungenStory (self-contained Scroll-
 * Story mit Weiche/Assistent, Fundament + Zahnraeder-Skulptur, Team-Split-Screen,
 * Massarbeit, Beweis + Start). Chrome wie Tipps-Seite (RabbitMark, RelaunchMenu,
 * FooterReassembly). Alle Texte SSR (SEO/LLM lesen sie).
 */
export const metadata: Metadata = {
  title: 'Leistungen · Red Rabbit Media',
  description:
    'Eine Website, die für dich arbeitet: Fundament mit Hosting, Pflege und Klartext-Zahlen, dazu digitale Kollegen, die schreiben und Anfragen annehmen. Individuell gebaut, kein Baukasten.',
  robots: { index: false, follow: false },
};

export default async function LeistungenPreviewPage() {
  const posts = (await getAllPosts()).filter((p) => p.status === 'published');
  const articleCount = posts.length;

  const rrFonts = `rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`;

  // Hero-Rohteile pro Request lesen (siehe Kommentar oben).
  const heroCss = readHero('demo.css');
  const heroHtml = readHero('demo.body.html');
  const heroJs = readHero('demo.engine.jstext');

  return (
    <>
      {/* Service-Liste (ItemList) als JSON-LD — nur echte, belegbare Leistungen. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
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
        }}
      />

      {/* Fonts wie die Template-Seiten (global, damit auch der Hero ausserhalb
          .rrls DM Sans / Crimson bekommt). */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
      />

      {/* Rote Hasen-Marke oben links auf Weiss, Link zur Startseite (Muster wie
          Tipps-Seite). */}
      <Link
        href="/relaunch-preview"
        aria-label="Zur Startseite"
        style={{
          position: 'absolute',
          top: 'clamp(18px, 2.4vw, 34px)',
          left: 'var(--rr-gutter, clamp(20px, 4vw, 64px))',
          zIndex: 30,
          display: 'block',
          lineHeight: 0,
        }}
      >
        <RabbitMark style={{ display: 'block', width: 'clamp(18px, 1.8vw, 21px)', height: 'auto' }} />
      </Link>

      {/* Hamburger-Menue der Hauptseite. Der .rr-Wrapper liefert nur die
          Font-Variablen. */}
      <div className={rrFonts} style={{ background: 'transparent' }}>
        <RelaunchMenu />
      </div>

      {/* HERO: angeschnittenes "Leistungen." + Malen (Template-Hero ohne Skulptur). */}
      <LeistungenHeroClient css={heroCss} html={heroHtml} js={heroJs} />

      {/* STORY: Weiche + Assistent, Fundament + Skulptur, Team, Massarbeit, Start.
          Im .rr-Wrapper, damit die echten rr-*-Bauteile greifen. */}
      <div className={rrFonts} style={{ background: '#ffffff' }}>
        <LeistungenStory articleCount={articleCount} />
      </div>

      {/* Footer der Hauptseite (self-contained Styles, .rr nur fuer Font-Variablen). */}
      <div className={rrFonts} style={{ background: 'transparent' }}>
        <FooterReassembly />
      </div>
    </>
  );
}
