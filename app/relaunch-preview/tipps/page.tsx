import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog/posts';
import TippsHeroClient from '@/components/subpages/TippsHeroClient';
import TippsTunnel from '@/components/relaunch/TippsTunnel';
import CornerLogo from '@/components/relaunch/CornerLogo';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/subpages/tipps-preview.css';

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

  // Hero-Rohteile pro Request lesen (siehe Kommentar oben).
  const heroCss = readHero('demo.css');
  const heroHtml = readHero('demo.body.html');
  const heroJs = readHero('demo.engine.jstext');

  return (
    <>
      {/* Fonts wie die Template-Seiten (global, damit auch der Hero ausserhalb
          .rrt DM Sans / Crimson bekommt). */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&family=Instrument+Sans:wght@400;500;600&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
      />

      {/* Ecken-Logo (rote Hasen-Marke oben links) — gemeinsames Bauteil,
          blendet erst nach dem Zerlegen der Hero-Woerter ein. */}
      <CornerLogo />

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
      <TippsHeroClient css={heroCss} html={heroHtml} js={heroJs} />

      {/* 3D-Karten-Tunnel: die Artikel-Karten fliegen beim Scrollen aus der
          Tiefe an der Kamera vorbei. Ersetzt das alte rrt-Register. */}
      <div className={rrFonts} style={{ background: 'transparent' }}>
        <TippsTunnel posts={tunnelPosts} />
      </div>

      {/* Footer der Hauptseite (self-contained Styles, .rr nur fuer Font-Variablen). */}
      <div className={rrFonts} style={{ background: 'transparent' }}>
        <FooterReassembly />
      </div>
    </>
  );
}
