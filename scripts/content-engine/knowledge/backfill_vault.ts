import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { appendFacts, loadVault, VAULT_FILE, type NewFactInput } from '../lib/vault';

// One-time + repeatable backfill: every published article is an own, verified answer.
// Its featuredSnippet (a reviewed 40-60 word direct answer) becomes a citable vault fact,
// sourced to the live article URL. Dedup is handled by appendFacts, so re-running is safe
// and only adds newly published articles. This is the §3 backflow applied to the back catalogue.

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'content/blog');
const BASE_URL = 'https://web.redrabbit.media';

function keywordsFrom(fm: any, slug: string): string[] {
    const tags: string[] = Array.isArray(fm.tags) ? fm.tags : [];
    const slugWords = slug.split('-').filter((w) => w.length >= 4);
    return [...new Set([...tags, ...slugWords])].slice(0, 10);
}

function main() {
    const dry = process.argv.includes('--dry-run');
    const today = new Date().toISOString().slice(0, 10);
    if (!fs.existsSync(BLOG_DIR)) {
        console.log('Kein content/blog gefunden.');
        return;
    }
    const facts: NewFactInput[] = [];
    for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))) {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
        const fm = matter(raw).data as any;
        const slug = (fm.slug || file.replace('.mdx', '')).toString();
        const snippet = (fm.featuredSnippet || '').toString().trim();
        if (!snippet) continue; // no reviewed answer → nothing verified to record
        facts.push({
            cluster: Number(fm.cluster) || 0,
            keywords: keywordsFrom(fm, slug),
            aussage: snippet.replace(/\s+/g, ' '),
            quelle: `${BASE_URL}/tipps/${slug}`,
            quelleName: (fm.title || slug).toString(),
        });
    }

    console.log(`Gefunden: ${facts.length} Artikel mit featuredSnippet.`);
    if (dry) {
        const existing = loadVault();
        console.log(`Vault aktuell: ${existing.length} Fakten. (--dry-run: nichts geschrieben)`);
        for (const f of facts.slice(0, 3)) console.log(`  - [C${f.cluster}] ${f.aussage.slice(0, 90)}...`);
        return;
    }
    const { added, skipped } = appendFacts(facts, today, { idPrefix: 'art', ttlDays: 180 });
    console.log(`Vault-Rueckfluss: ${added} neu, ${skipped} schon vorhanden -> ${VAULT_FILE}`);
}

main();
