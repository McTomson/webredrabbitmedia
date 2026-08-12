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
    lines.push('> Webagentur aus Wien für ganz Österreich. Wir bauen schnelle, conversion-starke Websites, geben Talos als digitalen Mitarbeiter mit und veröffentlichen praxisnahe, fachlich geprüfte Ratgeber zu Website-Kosten, SEO, GEO und Webdesign für den österreichischen Markt.');
    lines.push('');
    lines.push('## Leistungen');
    lines.push(`- [Alle Leistungen](${SITE_URL}/leistungen): Website, Google- und KI-Sichtbarkeit, Talos als digitaler Mitarbeiter, Betreuung.`);
    lines.push(`- [Website](${SITE_URL}/leistungen/webdesign): individuell gebaute Website, kein Baukasten, für Handy zuerst gebaut.`);
    lines.push(`- [Google-Sichtbarkeit / SEO](${SITE_URL}/leistungen/seo): saubere Struktur und Grundlagen, damit Google die Seite findet und versteht.`);
    lines.push(`- [KI-Sichtbarkeit](${SITE_URL}/leistungen/ki-sichtbarkeit): so gebaut, dass ChatGPT, Perplexity und andere KI-Suchen die Seite sauber lesen.`);
    lines.push(`- [Talos, digitaler Mitarbeiter / Kommandozentrale](${SITE_URL}/leistungen/dashboard): ein Ort, an dem du Texte und Bilder selbst änderst und siehst, was auf deiner Seite passiert.`);
    lines.push('');
    lines.push('## Preise');
    lines.push(`- [Preise](${SITE_URL}/preise): drei Pakete, ehrlich kommuniziert.`);
    lines.push('- Starter, ab 1.250 Euro: eine Seite, professionell online.');
    lines.push('- Business, ab 2.850 Euro: mehrere Seiten, damit du bei Leistung und Ort gefunden wirst.');
    lines.push('- Premium, ab 4.900 Euro: die volle Ausbaustufe, wenn die Website ein Vertriebskanal sein soll.');
    lines.push('- Ablauf: erst 1-2 grafische Vorschläge ohne Vorkasse, eine Anzahlung fällt erst an, wenn dir das Ergebnis gefällt und du den Auftrag erteilst.');
    lines.push('');
    lines.push('## Wichtige Seiten');
    lines.push(`- [Über uns](${SITE_URL}/ueber-uns)`);
    lines.push(`- [FAQ](${SITE_URL}/faq)`);
    lines.push(`- [Kontakt](${SITE_URL}/kontakt)`);
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
