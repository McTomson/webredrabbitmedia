import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog/posts';
import '@/components/subpages/tipps-preview.css';

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

  return (
    <div className="rrt">
      {/* Fonts wie die Template-Seiten */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&family=Instrument+Sans:wght@400;500;600&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
      />

      <div className="rrt-wrap">
        <header className="rrt-top">
          <Link className="rrt-mark" href="/relaunch-preview">red rabbit</Link>
          <Link className="rrt-back" href="/relaunch-preview/kontakt">Projekt anfragen</Link>
        </header>

        <section className="rrt-hero">
          <span className="rrt-label">(Red Rabbit Wissen)</span>
          <h1>
            Lies das, bevor du eine Agentur <em>bezahlst.</em>
          </h1>
          <p>
            Keine Content-M&uuml;llhalde, kein Marketing-Geschw&auml;tz: {posts.length} ehrliche
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
  );
}
