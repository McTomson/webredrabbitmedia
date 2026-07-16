import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog/posts';
import TippsHeroClient from '@/components/subpages/TippsHeroClient';
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
 * TIPPS-Uebersicht im Relaunch-Look (Preview, noindex) — redaktioneller
 * Register-Index statt Karten-Grid: neuester Artikel als Serif-Lead,
 * darunter nummerierte Reihen nach Themen gruppiert (Klammer-Labels wie
 * auf allen Bereichen). Kein Suchfeld, kein A-Z: 26 Artikel scannt man.
 */
export const metadata: Metadata = {
  title: 'Tipps (Preview) · Red Rabbit Media',
  description:
    'Ehrliche Antworten auf die Fragen, die dich wirklich Geld kosten: Website-Preise, SEO, KI-Sichtbarkeit.',
  robots: { index: false, follow: false },
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('de-AT', { day: 'numeric', month: 'long', year: 'numeric' });

export default async function TippsPreviewPage() {
  const posts = (await getAllPosts()).filter((p) => p.status === 'published');
  const [lead, ...rest] = posts;

  // Nach Kategorie gruppieren, Reihenfolge = erste Nennung (posts sind datumssortiert).
  const groups = new Map<string, typeof rest>();
  for (const p of rest) {
    const g = groups.get(p.category) ?? [];
    g.push(p);
    groups.set(p.category, g);
  }

  let n = 0;
  const num = () => String(++n).padStart(2, '0');

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

      <div className="rrt">
      <div className="rrt-wrap">
        {/* Kompakte Intro-Bruecke Hero -> Index (uebernimmt die alte rrt-hero-Zeile). */}
        <section className="rrt-intro">
          <span className="rrt-label">(Red Rabbit Wissen)</span>
          <p>
            Keine Content-Müllhalde, kein Marketing-Geschwätz: {posts.length} ehrliche
            Antworten auf die Fragen, die dich sonst Geld kosten<span className="rrt-dot">.</span>
          </p>
        </section>

        {lead && (
          <Link className="rrt-lead" href={`/relaunch-preview/tipps/${lead.slug}`}>
            <div className="rrt-lead-kicker">
              <span className="rrt-label">(Neu)</span>
              <span className="rrt-meta">
                {lead.category} &nbsp;&middot;&nbsp; {fmtDate(lead.publishedAt)} &nbsp;&middot;&nbsp; {lead.readingTime} Min
              </span>
            </div>
            <h2>{lead.title}</h2>
            <p className="rrt-lead-excerpt">{lead.excerpt}</p>
          </Link>
        )}

        {[...groups.entries()].map(([category, items]) => (
          <section className="rrt-section" key={category}>
            <span className="rrt-label">({category})</span>
            {items.map((p) => (
              <Link className="rrt-row" href={`/relaunch-preview/tipps/${p.slug}`} key={p.slug}>
                <span className="rrt-num">{num()}</span>
                <h3>{p.title}</h3>
                <span className="rrt-meta">{p.readingTime} Min</span>
              </Link>
            ))}
          </section>
        ))}

        <section className="rrt-cta">
          <span className="rrt-label">(Genug gelesen)</span>
          <h2>
            Wissen bringt dich weiter.<br />
            Machen bringt dir Kunden<span>.</span>
          </h2>
          <p>
            Erz&auml;hl uns in zwei Minuten, wo es bei dir hakt. Den Rest lesen dann wir.
          </p>
          <Link className="rrt-btn" href="/relaunch-preview/kontakt">Zum Kontakt</Link>
        </section>
      </div>

      </div>

      {/* Footer der Hauptseite (self-contained Styles, .rr nur fuer Font-Variablen). */}
      <div className={rrFonts} style={{ background: 'transparent' }}>
        <FooterReassembly />
      </div>
    </>
  );
}
