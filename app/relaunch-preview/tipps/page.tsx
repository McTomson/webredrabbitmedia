import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog/posts';
import { SITE_URL } from '@/lib/config';
import TippsHeroClient from '@/components/subpages/TippsHeroClient';
import TippsTunnel from '@/components/relaunch/TippsTunnel';
import CornerLogo from '@/components/relaunch/CornerLogo';
import BackToTop from '@/components/relaunch/BackToTop';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import SiteClosing from '@/components/relaunch/SiteClosing';
import ScrollExperience from '@/components/relaunch/ScrollExperience';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
// tipps-preview.css wird hier NICHT mehr importiert: die Uebersicht ist seit
// dem Tunnel-Umbau komplett rrtn-*/Hero-demo; rrt-* lebt nur auf [slug].

// Rohteile des Tipps-Hero (Template = ueber-uns/faq-Hero ohne Skulptur, nur
// Titel-Anschnitt + Malen). WICHTIG: Reads muessen IN der Komponente passieren
// (pro Request), nicht auf Modulebene — Next watched fs-Reads nicht, Edits an
// demo.* waeren im Dev-Server sonst unsichtbar bis zum Neustart (Lesson 14.07.).
const HERO_DIR = path.join(process.cwd(), 'components/subpages/tipps-hero-demo');
const readHero = (f: string) => fs.readFileSync(path.join(HERO_DIR, f), 'utf8');

/**
 * TIPPS-Uebersicht im Relaunch-Look (Preview, noindex) — 3D-Karten-Tunnel
 * (Vorbild ashleybrookecs.com/work): die Blogartikel-Karten fliegen beim
 * Scrollen aus der Tiefe an den Betrachter vorbei (Komponente TippsTunnel).
 * Hero (tipps-hero-demo) bleibt; Filter-/Suchleiste unten rechts. Die alte
 * rrt-Register-/Lead-/CTA-Sektion entfaellt auf der Uebersicht (Artikel-
 * Detailseiten unter [slug] nutzen rrt-* unveraendert weiter).
 */
export const metadata: Metadata = {
  title: 'Tipps (Preview) · Red Rabbit Media',
  description:
    'Ehrliche Antworten auf die Fragen, die dich wirklich Geld kosten: Website-Preise, SEO, KI-Sichtbarkeit.',
  robots: { index: false, follow: false },
};

export default async function TippsPreviewPage() {
  const posts = (await getAllPosts()).filter((p) => p.status === 'published');
  const tunnelPosts = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    readingTime: p.readingTime,
    featuredImage: p.featuredImage,
    excerpt: p.excerpt,
    tags: p.tags,
  }));

  const rrFonts = `rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`;

  // Strukturierte Daten (Blog-Uebersicht): CollectionPage + ItemList aller
  // Artikel + BreadcrumbList. Waehrend der Preview-Phase noindex (Metadata
  // oben) — das Schema ist fuer den Go-Live vorbereitet; dann faellt das
  // /relaunch-preview-Prefix in BASE weg.
  const BASE = `${SITE_URL}/relaunch-preview`;
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Tipps · Red Rabbit Media',
    description: metadata.description,
    url: `${BASE}/tipps`,
    inLanguage: 'de-AT',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE}/tipps/${p.slug}`,
        name: p.title,
      })),
    },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}` },
      { '@type': 'ListItem', position: 2, name: 'Tipps', item: `${BASE}/tipps` },
    ],
  };

  // Hero-Rohteile pro Request lesen (siehe Kommentar oben).
  const heroCss = readHero('demo.css');
  const heroHtml = readHero('demo.body.html');
  const heroJs = readHero('demo.engine.jstext');

  return (
    <>
      {/* Fonts wie die Template-Seiten (global, damit auch der Hero ausserhalb
          .rrt DM Sans / Crimson bekommt). */}
      {/* LCP-Poster mobil frueh laden (Thomas 04.08.), nur Mobile/Tablet. */}
      <link rel="preload" as="image" href="/hero/tipps-hero-poster.jpg" fetchPriority="high" media="(max-width: 1024px)" />

      {/* Ecken-Logo (rote Hasen-Marke oben links) — gemeinsames Bauteil,
          blendet erst nach dem Zerlegen der Hero-Woerter ein. */}
      <CornerLogo />
      <BackToTop />

      {/* Hamburger-Menue der Hauptseite. Bewusst AUSSERHALB von .rrt (dessen
          Universal-Reset wuerde sonst mit den Menue-/Footer-Styles ringen);
          der .rr-Wrapper liefert nur die Font-Variablen. */}
      <div className={rrFonts} style={{ background: 'transparent' }}>
        <RelaunchMenu />
      </div>

      {/* HERO: angeschnittenes "Tipps" + Malen (Template-Hero ohne Skulptur).
          Ersetzt den alten statischen rrt-hero-Textblock. Der Satz lebt als
          reveal-msg unter der Farbe ("Das sagt dir sonst keiner gratis.") und
          als Intro-Zeile im Index weiter. */}
      {/* data-rr-snap-exempt: eigene Scroll-Dramaturgie, kein Soft-Snap darin. */}
      <div data-rr-snap-exempt>
        <TippsHeroClient css={heroCss} html={heroHtml} js={heroJs} />
      </div>

      {/* 3D-Karten-Tunnel: die Artikel-Karten fliegen beim Scrollen aus der
          Tiefe an der Kamera vorbei. Ersetzt das alte rrt-Register. */}
      <div className={rrFonts} data-rr-snap data-rr-snap-exempt style={{ background: 'transparent' }}>
        <TippsTunnel posts={tunnelPosts} />
      </div>

      {/* Abschluss-Block (DESIGN_STANDARD 28.07.): geteiltes SiteClosing, gleicher
          Aufbau wie Homepage, Text aus brand/copy-closing-cta.md. */}
      <div className={rrFonts} style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        <SiteClosing
          lines={['Lesen bringt dich auf Ideen.', 'Umsetzen bringt dir Kunden.', 'Reden wir.']}
        />
      </div>

      {/* Footer der Hauptseite (self-contained Styles, .rr nur fuer Font-Variablen). */}
      <div className={rrFonts} data-rr-snap style={{ background: 'transparent' }}>
        <FooterReassembly />
      </div>

      {/* Site-weites Scroll-Gefuehl: Lenis + Soft-Snap (Thomas 28.07.). */}
      <ScrollExperience />

      {/* Strukturierte Daten (serverseitig im SSR-HTML). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
