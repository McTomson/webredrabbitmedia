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

const SLUG_RE = /^[a-z0-9-]+$/;

// Published, non-draft, non-hardcoded MDX articles — exactly the set the on-page audit grades.
// Hardcoded app/tipps/{slug}/page.tsx routes are excluded (their MDX body is never rendered).
// Reads + parses the blog dir ONCE and returns {slug, body} so the scan loop is O(n), not O(n²).
function articles(): Array<{ slug: string; body: string }> {
    if (!fs.existsSync(BLOG_DIR)) return [];
    const hardcoded = new Set<string>();
    if (fs.existsSync(TIPPS_DIR)) {
        for (const e of fs.readdirSync(TIPPS_DIR, { withFileTypes: true })) {
            if (e.isDirectory() && e.name !== '[slug]' && fs.existsSync(path.join(TIPPS_DIR, e.name, 'page.tsx'))) hardcoded.add(e.name);
        }
    }
    const out: Array<{ slug: string; body: string }> = [];
    for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))) {
        const parsed = matter(fs.readFileSync(path.join(BLOG_DIR, file), 'utf8'));
        const fm = parsed.data as { slug?: string; status?: string };
        if (fm.status === 'draft') continue;
        const slug = (fm.slug || file.replace('.mdx', '')).toString();
        if (hardcoded.has(slug)) continue;
        // The slug becomes part of a URL handed to fetch/foglift (third-party egress). Constrain it
        // to the safe slug charset; a malformed slug is skipped with a warning rather than scanned.
        if (!SLUG_RE.test(slug)) {
            console.warn(`  WARN: Slug "${slug}" verletzt ^[a-z0-9-]+$ — übersprungen.`);
            continue;
        }
        out.push({ slug, body: parsed.content });
    }
    return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function main() {
    const flags = parseFlags(process.argv.slice(2));
    const live = !flags.quick;
    // Guard the base URL: it flows into fetch() and is sent to the third-party foglift.io service.
    // Refuse non-http(s) schemes and warn on private/loopback hosts (defense against pointing the
    // scan — and its egress — at an internal endpoint).
    try {
        const u = new URL(flags.base);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('nur http(s) erlaubt');
        if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.0\.0\.0)/.test(u.hostname) || /^172\.(1[6-9]|2\d|3[01])\./.test(u.hostname)) {
            console.warn(`WARN: --base zeigt auf einen privaten/lokalen Host (${u.hostname}). Externe Scanner (foglift) erhalten diese URL.`);
        }
    } catch {
        console.error(`--base ist keine gültige http(s)-URL: ${flags.base}`);
        process.exit(1);
    }
    const validSlugs = loadValidSlugs(BLOG_DIR, TIPPS_DIR);
    let arts = articles();
    if (flags.only) arts = arts.filter((a) => a.slug === flags.only);
    if (flags.limit) arts = arts.slice(0, flags.limit);

    console.log(`Quality-Scan: ${arts.length} Artikel, base=${flags.base}, live=${live}, geo=${flags.geo}, a11y=${flags.a11y}`);
    if (flags.geo) console.log('  Hinweis: --geo sendet jede Artikel-URL an den externen Dienst foglift.io.');
    const started = Date.now();
    const results: ArticleQuality[] = [];

    for (const { slug, body } of arts) {
        const url = `${flags.base}/tipps/${slug}`;
        const links = scanLinks(body, validSlugs, live);
        const schema = live
            ? await scanSchema(url)
            : ({ status: 'skipped' as ScannerStatus, note: 'offline-Modus', types: [], errors: [], valid: false });
        const geo = flags.geo
            ? scanGeo(url)
            : ({ status: 'skipped' as ScannerStatus, score: null, geoScore: null, issues: [] });
        const a11y = flags.a11y
            ? scanA11y(url)
            : ({ status: 'skipped' as ScannerStatus, violations: null, sample: [] });
        results.push({ slug, url, links, schema, geo, a11y });
        const ib = links.internalBroken.length, eb = links.externalBroken.length;
        console.log(`  ${slug}: links(int ${ib}/ext ${eb}) schema(${schema.status}${schema.valid ? ' valid' : ''}) geo(${geo.status} ${geo.score ?? ''}) a11y(${a11y.status})`);
    }

    const report: QualityReport = {
        scannedAt: new Date().toISOString(),
        baseUrl: flags.base,
        durationMs: Date.now() - started,
        scanners: {
            links: rollUpScannerStatus(results, (a) => a.links.status),
            schema: rollUpScannerStatus(results, (a) => a.schema.status),
            geo: rollUpScannerStatus(results, (a) => a.geo.status),
            a11y: rollUpScannerStatus(results, (a) => a.a11y.status),
        },
        articles: results,
        summary: summarize(results),
    };

    fs.mkdirSync(CE, { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
    console.log(`\nGeschrieben: ${path.relative(ROOT, OUT)} (${report.summary.internalBrokenTotal} interne + ${report.summary.externalBrokenTotal} externe kaputte Links, ${report.summary.schemaInvalid} Schema-Fehler, Ø-GEO ${report.summary.avgGeo ?? 'n/a'})`);
}

main().catch((e) => {
    console.error('Quality-Scan fehlgeschlagen:', e);
    process.exit(1);
});
