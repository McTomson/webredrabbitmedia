import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { scanLinks, loadValidSlugs } from './scanners/links';
import { scanSchema } from './scanners/schema';
import { scanGeo } from './scanners/geo';
import { scanA11y } from './scanners/a11y';
import { summarize, rollUpScannerStatus, type ArticleQuality, type QualityReport, type ScannerStatus } from './types';

// Quality-scan orchestrator (Plan §15 "Punkt 4"). Runs the four scanners over every published,
// non-hardcoded article and writes content-engine/.quality-report.json (gitignored SoT, read by the
// dashboard's Verbesserungen tab). Resilient: a missing tool degrades that scanner, never the run.
//
//   npm run quality:scan                 links (internal+external) + schema, live site
//   npm run quality:scan -- --quick      internal links only, fully offline (fast, no network)
//   npm run quality:scan -- --geo        + foglift GEO score (external, no key needed)
//   npm run quality:scan -- --a11y       + pa11y accessibility (headless Chromium via npx)
//   npm run quality:scan -- --only=<slug> [--limit=N] [--base=https://...]

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'content/blog');
const TIPPS_DIR = path.join(ROOT, 'app/tipps');
const CE = path.join(ROOT, 'content-engine');
const OUT = path.join(CE, '.quality-report.json');
const DEFAULT_BASE = process.env.SITE_URL || 'https://web.redrabbit.media';

interface Flags {
    quick: boolean;
    geo: boolean;
    a11y: boolean;
    only?: string;
    limit?: number;
    base: string;
}

function parseFlags(argv: string[]): Flags {
    const f: Flags = { quick: false, geo: false, a11y: false, base: DEFAULT_BASE };
    for (const a of argv) {
        if (a === '--quick') f.quick = true;
        else if (a === '--geo') f.geo = true;
        else if (a === '--a11y') f.a11y = true;
        else if (a.startsWith('--only=')) f.only = a.slice(7);
        else if (a.startsWith('--limit=')) f.limit = Number(a.slice(8)) || undefined;
        else if (a.startsWith('--base=')) f.base = a.slice(7).replace(/\/$/, '');
    }
    return f;
}

// Published, non-draft, non-hardcoded MDX articles — exactly the set the on-page audit grades.
// Hardcoded app/tipps/{slug}/page.tsx routes are excluded (their MDX body is never rendered).
function articleSlugs(): string[] {
    if (!fs.existsSync(BLOG_DIR)) return [];
    const hardcoded = new Set<string>();
    if (fs.existsSync(TIPPS_DIR)) {
        for (const e of fs.readdirSync(TIPPS_DIR, { withFileTypes: true })) {
            if (e.isDirectory() && e.name !== '[slug]' && fs.existsSync(path.join(TIPPS_DIR, e.name, 'page.tsx'))) hardcoded.add(e.name);
        }
    }
    const out: string[] = [];
    for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))) {
        const parsed = matter(fs.readFileSync(path.join(BLOG_DIR, file), 'utf8'));
        const fm = parsed.data as { slug?: string; status?: string };
        if (fm.status === 'draft') continue;
        const slug = (fm.slug || file.replace('.mdx', '')).toString();
        if (hardcoded.has(slug)) continue;
        out.push(slug);
    }
    return out.sort();
}

function bodyFor(slug: string): string {
    // Find the mdx file whose slug (frontmatter or filename) matches.
    for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))) {
        const parsed = matter(fs.readFileSync(path.join(BLOG_DIR, file), 'utf8'));
        const fm = parsed.data as { slug?: string };
        if ((fm.slug || file.replace('.mdx', '')).toString() === slug) return parsed.content;
    }
    return '';
}

async function main() {
    const flags = parseFlags(process.argv.slice(2));
    const live = !flags.quick;
    const validSlugs = loadValidSlugs(BLOG_DIR, TIPPS_DIR);
    let slugs = articleSlugs();
    if (flags.only) slugs = slugs.filter((s) => s === flags.only);
    if (flags.limit) slugs = slugs.slice(0, flags.limit);

    console.log(`Quality-Scan: ${slugs.length} Artikel, base=${flags.base}, live=${live}, geo=${flags.geo}, a11y=${flags.a11y}`);
    const started = Date.now();
    const articles: ArticleQuality[] = [];

    for (const slug of slugs) {
        const url = `${flags.base}/tipps/${slug}`;
        const links = scanLinks(bodyFor(slug), validSlugs, live);
        const schema = live
            ? await scanSchema(url)
            : ({ status: 'skipped' as ScannerStatus, note: 'offline-Modus', types: [], errors: [], valid: false });
        const geo = flags.geo
            ? scanGeo(url)
            : ({ status: 'skipped' as ScannerStatus, score: null, geoScore: null, subScores: null, issues: [] });
        const a11y = flags.a11y
            ? scanA11y(url)
            : ({ status: 'skipped' as ScannerStatus, violations: null, sample: [] });
        articles.push({ slug, url, links, schema, geo, a11y });
        const ib = links.internalBroken.length, eb = links.externalBroken.length;
        console.log(`  ${slug}: links(int ${ib}/ext ${eb}) schema(${schema.status}${schema.valid ? ' valid' : ''}) geo(${geo.status}${geo.score ?? ''}) a11y(${a11y.status})`);
    }

    const report: QualityReport = {
        scannedAt: new Date().toISOString(),
        baseUrl: flags.base,
        durationMs: Date.now() - started,
        scanners: {
            links: rollUpScannerStatus(articles, (a) => a.links.status),
            schema: rollUpScannerStatus(articles, (a) => a.schema.status),
            geo: rollUpScannerStatus(articles, (a) => a.geo.status),
            a11y: rollUpScannerStatus(articles, (a) => a.a11y.status),
        },
        articles,
        summary: summarize(articles),
    };

    fs.mkdirSync(CE, { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
    console.log(`\nGeschrieben: ${path.relative(ROOT, OUT)} (${report.summary.internalBrokenTotal} interne + ${report.summary.externalBrokenTotal} externe kaputte Links, ${report.summary.schemaInvalid} Schema-Fehler, Ø-GEO ${report.summary.avgGeo ?? 'n/a'})`);
}

main().catch((e) => {
    console.error('Quality-Scan fehlgeschlagen:', e);
    process.exit(1);
});
