import fs from 'node:fs';
import nodePath from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getPostBySlug, getRelatedPosts } from '@/lib/blog/posts';
import { SimpleAudioPlayer } from '@/components/blog/content/SimpleAudioPlayer';
import { VideoEmbed } from '@/components/blog/content/VideoEmbed';
import HeroldComparisonTable from '@/components/HeroldComparisonTable';
import RegionComparisonTable from '@/components/RegionComparisonTable';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import CornerLogo from '@/components/relaunch/CornerLogo';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/subpages/tipps-preview.css';

/**
 * Artikel-Template im Relaunch-Look (Preview, noindex).
 * Rendert die ECHTEN MDX-Artikel (content/blog) mit eigenem, schlankem
 * Komponenten-Mapping (Typo via tipps-preview.css) statt der alten
 * Tailwind-Blog-Komponenten: Schnellantwort-Kasten, Lesetext in Crimson,
 * nummerierte H2s, Navy-Takeaways, Zahlen-Zeile, FAQ, Quellen, Weiterlesen.
 */
interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Beitrag nicht gefunden' };
  return {
    title: `${post.title} (Preview) · Red Rabbit Media`,
    description: post.excerpt,
    robots: { index: false, follow: false },
  };
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('de-AT', { day: 'numeric', month: 'long', year: 'numeric' });

/**
 * MDX-Bilder nur rendern, wenn die Datei in public/ wirklich existiert.
 * Hintergrund: Artikel referenzieren Bilder, die die Medien-Pipeline erst
 * nach Freigabe produziert (offene Marker in content-engine/.media-requests/)
 * — bis dahin soll kein kaputtes Bild auf der Seite haengen (QA 22.07.).
 */
function ArticleImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const src = typeof props.src === 'string' ? props.src : '';
  if (src.startsWith('/')) {
    const abs = nodePath.join(process.cwd(), 'public', decodeURIComponent(src));
    if (!fs.existsSync(abs)) return null;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt ?? ''} />;
}

export default async function TippsArticlePreview({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
    // Standard-Tags bewusst OHNE altes Tailwind-Mapping (gestylt via .rrt-body).
    // Die vier Custom-Tags aus den MDX-Quellen MUESSEN aber uebergeben werden,
    // sonst wirft compileMDX zur Laufzeit (13 Artikel nutzen SimpleAudioPlayer,
    // 11 VideoEmbed, je 1 die Vergleichstabellen — Link-Sweep 16.07.).
    components: { SimpleAudioPlayer, VideoEmbed, HeroldComparisonTable, RegionComparisonTable, img: ArticleImg },
  });

  const related = await getRelatedPosts(slug, 3);
  const rrFonts = `rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`;

  return (
    <>
      {/* Hamburger-Menue der Hauptseite. Bewusst AUSSERHALB von .rrt (dessen
          Universal-Reset wuerde sonst mit den Menue-/Footer-Styles ringen);
          der .rr-Wrapper liefert nur die Font-Variablen. */}
      <div className={rrFonts} style={{ background: 'transparent' }}>
        <RelaunchMenu />
      </div>
      {/* Ecken-Logo (rote Hasen-Marke oben links) — gemeinsames Bauteil. */}
      <CornerLogo />
      <div className="rrt">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&family=Instrument+Sans:wght@400;500;600&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
      />

      <div className="rrt-wrap">
        <header className="rrt-top">
          <Link className="rrt-mark" href="/relaunch-preview">red rabbit</Link>
          <Link className="rrt-back" href="/relaunch-preview/tipps">Alle Tipps</Link>
        </header>

        <header className="rrt-article-head">
          <span className="rrt-label">(Tipps &middot; {post.category})</span>
          <h1>
            {post.title}
            <span className="rrt-dot">.</span>
          </h1>
          <div className="rrt-byrow">
            <span className="rrt-meta">{post.author}</span>
            <span className="rrt-meta">{fmtDate(post.updatedAt || post.publishedAt)}</span>
            <span className="rrt-meta">{Math.ceil(post.content.split(/\s+/).length / 200)} Min Lesezeit</span>
          </div>
        </header>

        {post.featuredSnippet && (
          <aside className="rrt-snippet">
            <span className="rrt-label">({post.featuredSnippetTitle || 'Die kurze Antwort'})</span>
            <p>{post.featuredSnippet}</p>
          </aside>
        )}

        <article className="rrt-body">{content}</article>

        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <aside className="rrt-takeaways">
            <span className="rrt-label">(Das Wichtigste)</span>
            <ol>
              {post.keyTakeaways.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </aside>
        )}

        {post.conclusionStats && post.conclusionStats.length > 0 && (
          <div className="rrt-stats">
            {post.conclusionStats.map((s) => (
              <div className="rrt-stat" key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {post.faqs && post.faqs.length > 0 && (
          <section className="rrt-faq">
            <span className="rrt-label">(Kurz gefragt)</span>
            {post.faqs.map((f) => (
              <details key={f.question}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </section>
        )}

        {post.sources && post.sources.length > 0 && (
          <section className="rrt-sources">
            <span className="rrt-label">(Quellen)</span>
            {post.sources.map((s) => (
              <a href={s.url} key={s.url} target="_blank" rel="noopener noreferrer">
                {s.name}
              </a>
            ))}
          </section>
        )}

        <div className="rrt-byline">
          <b>{post.author}</b>
          <span>Gr&uuml;nder, Red Rabbit Media</span>
        </div>

        {related.length > 0 && (
          <section className="rrt-related">
            <span className="rrt-label">(Weiterlesen)</span>
            {related.map((p, i) => (
              <Link className="rrt-row" href={`/relaunch-preview/tipps/${p.slug}`} key={p.slug}>
                <span className="rrt-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <span className="rrt-meta">{p.readingTime} Min</span>
              </Link>
            ))}
          </section>
        )}

        <section className="rrt-cta">
          <span className="rrt-label">(Genug gelesen)</span>
          <h2>
            Lesen ist gut. Gefunden werden ist besser<span>.</span>
          </h2>
          <p>Erz&auml;hl uns in zwei Minuten, wo es hakt. Kein Verkaufsanruf, versprochen.</p>
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
