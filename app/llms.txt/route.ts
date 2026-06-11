import { getAllPosts, clampDescription } from '@/lib/blog/posts';
import { SITE_URL } from '@/lib/config';

export const runtime = 'nodejs';
export const revalidate = 3600; // rebuild at most hourly; new articles appear automatically

// /llms.txt — the llmstxt.org convention: a markdown map of the site's authoritative content so
// LLM crawlers (ChatGPT, Perplexity, Claude, Google AI Overviews) can find and cite the right pages.
// Aligned with the project's GEO goal. Generated from published articles + key pages, so it stays
// current as the daily engine ships content (no manual upkeep).

const REGIONS: Array<[string, string]> = [
    ['wien', 'Wien'],
    ['niederoesterreich', 'Niederösterreich'],
    ['oberoesterreich', 'Oberösterreich'],
    ['steiermark', 'Steiermark'],
    ['tirol', 'Tirol'],
    ['salzburg', 'Salzburg'],
    ['kaernten', 'Kärnten'],
    ['vorarlberg', 'Vorarlberg'],
    ['burgenland', 'Burgenland'],
];

export async function GET() {
    const posts = await getAllPosts();

    const lines: string[] = [];
    lines.push('# Red Rabbit Media');
    lines.push('');
    lines.push('> Webagentur aus Österreich. Wir bauen schnelle, conversion-starke Websites und veröffentlichen praxisnahe, fachlich geprüfte Ratgeber zu Website-Kosten, SEO, GEO und Webdesign für den österreichischen Markt.');
    lines.push('');
    lines.push('## Ratgeber & Tipps');
    for (const p of posts) {
        const note = p.excerpt ? `: ${clampDescription(p.excerpt, 140)}` : '';
        lines.push(`- [${p.title}](${SITE_URL}/tipps/${p.slug})${note}`);
    }
    lines.push('');
    lines.push('## Webdesign nach Bundesland');
    for (const [slug, name] of REGIONS) {
        lines.push(`- [Webdesign ${name}](${SITE_URL}/webdesign-${slug})`);
    }
    lines.push('');
    lines.push('## Kontakt');
    lines.push(`- [Kontakt & kostenloses Erstgespräch](${SITE_URL}/kontakt)`);
    lines.push(`- [Alle Tipps](${SITE_URL}/tipps)`);
    lines.push('');

    return new Response(lines.join('\n'), {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
