import fs from 'node:fs';
import nodePath from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug, getRelatedPosts, extractHeadings } from '@/lib/blog/posts';
import { SITE_URL, AUTHORS } from '@/lib/config';
import { SimpleAudioPlayer } from '@/components/blog/content/SimpleAudioPlayer';
import { VideoEmbed } from '@/components/blog/content/VideoEmbed';
import HeroldComparisonTable from '@/components/HeroldComparisonTable';
import RegionComparisonTable from '@/components/RegionComparisonTable';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import CornerLogo from '@/components/relaunch/CornerLogo';
import BackToTop from '@/components/relaunch/BackToTop';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import SiteClosing from '@/components/relaunch/SiteClosing';
import ScrollExperience from '@/components/relaunch/ScrollExperience';
import TippsArticleRail from '@/components/relaunch/TippsArticleRail';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/subpages/tipps-preview.css';

/**
 * Artikel-Template im Relaunch-Look (Preview, noindex).
 * Struktur nach Vorbild der LIVE-Artikelseite (app/tipps/[slug], Thomas
 * 29.07.: "unsere Seite wie sie aufgebaut ist"): Breadcrumbs, E-E-A-T-Kopf
 * (Autor + LinkedIn + Fachlich geprueft + Lesezeit), Schnellantwort,
 * zweispaltig mit STICKY Sidebar rechts (Inhaltsverzeichnis mit Scrollspy,
 * Weiterlesen, Analyse-CTA), Hero-Bild, Takeaways, Quellen, Zahlen, FAQ,
 * Experten-Profil. Serverseitiges JSON-LD (BlogPosting + FAQPage +
 * BreadcrumbList) wie live. Design komplett rrt-* (tipps-preview.css).
 */
interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Statisch vorrendern (wie /tipps/[slug]). WICHTIG: ohne SSG packt Vercels
 * File-Tracing wegen des fs-Checks in ArticleImg den kompletten public/-
 * Ordner (>1 GB Medien) in die Serverless-Funktion -> Deploy-Abbruch
 * (250-MB-Limit, 22.07.). Statisch = fs laeuft zur Build-Zeit, keine Funktion.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
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
function imageExists(src: string): boolean {
  if (!src.startsWith('/')) return true;
  return fs.existsSync(nodePath.join(process.cwd(), 'public', decodeURIComponent(src)));
}

function ArticleImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const src = typeof props.src === 'string' ? props.src : '';
  if (src && !imageExists(src)) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt ?? ''} loading="lazy" decoding="async" />;
}

/**
 * Ueberschriften-Anker: exakt dieselbe id-Logik wie lib/blog/posts.ts
 * extractHeadings (und wie die Live-Seite in mdx-components.tsx), damit
 * TOC-Links und Scrollspy treffen. Nicht-String-Children bekommen wie live
 * keine id (die Rail ueberspringt sie).
 */
const headingId = (children: React.ReactNode): string | undefined =>
  typeof children === 'string'
    ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : undefined;

/**
 * Interne Artikel-Links in den MDX-Quellen zeigen auf die LIVE-Pfade
 * (/tipps/<slug>, 21 von 26 Artikeln) — korrekt fuer den Go-Live, aber auf
 * der Preview wuerde der Leser damit ins alte Design springen. Nur fuers
 * Preview-Prefix umschreiben; beim Go-Live faellt dieses Mapping weg.
 */
const A = ({ href = '', ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a href={href.startsWith('/tipps/') ? `/relaunch-preview${href}` : href} {...props} />
);

const H2 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 id={headingId(children)} {...props}>{children}</h2>
);
const H3 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 id={headingId(children)} {...props}>{children}</h3>
);

export default async function TippsArticlePreview({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
    // Standard-Tags bewusst OHNE altes Tailwind-Mapping (gestylt via .rrt-body).
    // h2/h3 bekommen ids (TOC/Scrollspy). Die vier Custom-Tags aus den MDX-
    // Quellen MUESSEN uebergeben werden, sonst wirft compileMDX zur Laufzeit
    // (13 Artikel nutzen SimpleAudioPlayer, 11 VideoEmbed, je 1 die
    // Vergleichstabellen — Link-Sweep 16.07.).
    components: {
      SimpleAudioPlayer,
      VideoEmbed,
      HeroldComparisonTable,
      RegionComparisonTable,
      img: ArticleImg,
      a: A,
      h2: H2,
      h3: H3,
    },
  });

  const related = (await getRelatedPosts(slug, 3)).map((p) => ({
    slug: p.slug,
    title: p.title,
    readingTime: p.readingTime,
  }));
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // TOC aus den Roh-Headings (gleiche Quelle wie die ids oben).
  const headings = extractHeadings(post.content);

  // Autor wie live: frontmatter-gesteuert, Fallback Thomas. Stabile @ids aus
  // lib/config, damit Google/LLMs die Autorschaft in EINE Entitaet mergen.
  const authorKey = post.author?.toLowerCase().includes('dmitry') ? 'dmitry' : 'thomas';
  const author = AUTHORS[authorKey];
  const authorBio =
    authorKey === 'dmitry'
      ? 'Dmitry Pashlov ist der technische Kopf hinter Red Rabbit. Als Lead Developer sorgt er dafür, dass Websites nicht nur gut aussehen, sondern technisch bei Google gewinnen: sauberer Code und schnelle Ladezeiten.'
      : 'Thomas Uhlir MBA ist Gründer von Red Rabbit. Er verbindet betriebswirtschaftliche Praxis mit technischem Webdesign und baut Websites, die im Netz auch tatsächlich gefunden werden.';

  const showHero = imageExists(post.featuredImage);
  const rrFonts = `rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`;

  // --- Strukturierte Daten (wie Live-Seite; BASE mit Preview-Prefix, faellt
  // beim Go-Live weg). Seite ist waehrend der Preview noindex. ---
  const BASE = `${SITE_URL}/relaunch-preview`;
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: { '@type': 'ImageObject', url: `${SITE_URL}${post.featuredImage}`, width: 1200, height: 630 },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: 'de-AT',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    author: {
      '@type': 'Person',
      '@id': author.entityId,
      name: author.name,
      jobTitle: author.role,
      url: author.linkedin,
      sameAs: [author.linkedin],
      knowsAbout: author.knowsAbout,
      worksFor: { '@id': `${SITE_URL}/#organization` },
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/tipps/${slug}` },
    wordCount,
    timeRequired: `PT${readingTime}M`,
    articleSection: post.category,
    keywords: post.tags.join(', '),
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.rrt-body h2', '.rrt-body p'] },
    ...(post.sources && post.sources.length > 0
      ? { citation: post.sources.map((s) => ({ '@type': 'CreativeWork', name: s.name, url: s.url })) }
      : {}),
  };
  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null;
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Tipps', item: `${BASE}/tipps` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE}/tipps/${slug}` },
    ],
  };

  const tocEntries = headings.filter((h) => h.level === 2 && h.id);

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
      <BackToTop />
      <div className="rrt">

      <div className="rrt-wrap rrt-wrap--article">
        <header className="rrt-top">
          <Link className="rrt-mark" href="/relaunch-preview">red rabbit</Link>
          <Link className="rrt-back" href="/relaunch-preview/tipps">Alle Tipps</Link>
        </header>

        {/* Breadcrumbs (sichtbar, wie live; Schema unten). */}
        <nav className="rrt-crumbs" aria-label="Breadcrumb">
          <Link href="/relaunch-preview">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/relaunch-preview/tipps">Tipps</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{post.title}</span>
        </nav>

        <header className="rrt-article-head">
          <span className="rrt-label">(Tipps &middot; {post.category})</span>
          <h1>
            {post.title}
            <span className="rrt-dot">.</span>
          </h1>
          {/* E-E-A-T-Zeile: Autor + LinkedIn + Pruefstatus + Datum + Lesezeit. */}
          <div className="rrt-byrow">
            <span className="rrt-author">
              <b>{post.author}</b>
              <a href={author.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn-Profil von ${author.name}`}>
                LinkedIn
              </a>
            </span>
            <span className="rrt-meta rrt-checked">Fachlich gepr&uuml;ft</span>
            <span className="rrt-meta">{fmtDate(post.updatedAt || post.publishedAt)}</span>
            <span className="rrt-meta">{readingTime} Min Lesezeit</span>
          </div>
        </header>

        {post.featuredSnippet && (
          <aside className="rrt-snippet">
            <span className="rrt-label">({post.featuredSnippetTitle || 'Die kurze Antwort'})</span>
            <p>{post.featuredSnippet}</p>
          </aside>
        )}

        {/* Zweispaltig ab 1100px: Inhalt links, sticky Rail rechts. */}
        <div className="rrt-grid">
          <div className="rrt-main">
            {/* Hero-Bild (nur wenn die Datei wirklich existiert). */}
            {showHero && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="rrt-hero-img"
                src={post.featuredImage}
                alt={post.title}
                loading="eager"
                decoding="async"
              />
            )}

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

            {/* Mobile: Inhaltsverzeichnis als aufklappbarer Block (Rail ist
                < 1100px ausgeblendet). */}
            {tocEntries.length > 1 && (
              <details className="rrt-toc-mobile">
                <summary>Inhalt</summary>
                <ol>
                  {tocEntries.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`}>{h.text}</a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            <article className="rrt-body">{content}</article>

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

            {/* Experten-Profil (E-E-A-T, wie live). */}
            <section className="rrt-bio">
              <span className="rrt-bio-initials" aria-hidden="true">
                {authorKey === 'dmitry' ? 'DP' : 'TU'}
              </span>
              <div>
                <span className="rrt-label">(Wer hier schreibt)</span>
                <h2>{author.name}</h2>
                <p className="rrt-bio-role">{author.role}</p>
                <p>{authorBio}</p>
                {/* Button-Paar wie Hauptseite: Sweep primaer + Outline sekundaer. */}
                <div className="rrt-bio-actions">
                  <Link className="rrt-btn" href="/relaunch-preview/kontakt">Beratung anfragen</Link>
                  <a className="rrt-btn-outline" href={author.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn-Profil
                  </a>
                </div>
              </div>
            </section>

            {/* Mobile: Weiterlesen + Kontakt (Rail-Ersatz) im Hauptfluss. */}
            <div className="rrt-mobile-extras">
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
            </div>
          </div>

          <TippsArticleRail headings={headings} related={related} />
        </div>
      </div>
      </div>

      {/* Abschluss-Block + ECHTER Footer (DESIGN_STANDARD: SiteClosing in
          voller Bauhoehe auf jeder Inhaltsseite; ersetzt den alten
          zentrierten rrt-cta-Schlussblock). */}
      <div className={rrFonts} style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        <SiteClosing
          lines={['Genug gelesen?', 'Reden wir über deine Website.']}
        />
        <div data-rr-snap>
          <FooterReassembly />
        </div>
      </div>

      {/* Site-weites Scroll-Gefuehl (SITE_LERP=1, nativ-schnell). BEWUSST
          keine Pflicht-Stopps im Lesetext (DESIGN_STANDARD: lange Absaetze
          nie im Snap fangen) — einziges Snap-Ziel ist die Footer-Kante. */}
      <ScrollExperience />

      {/* Strukturierte Daten (serverseitig, wie Live-Seite). */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
