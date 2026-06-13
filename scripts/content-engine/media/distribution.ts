import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// ──────────────────────────────────────────────────────────────────────────
// Distribution kit: turns ONE published article into canonical-safe syndication
// snippets, so manual cross-posting carries zero duplicate-content / cannibalization
// risk (verified rule, 2026):
//   - Only Medium honors an external rel=canonical (via its Import tool) -> full text OK there.
//   - LinkedIn / Substack do NOT honor external canonical -> post a TEASER + link only,
//     never the full body, or the copy can outrank/cannibalize the origin.
//   - Mastodon / Bluesky -> short post + link (no canonical concept, but it's a link, not a dup).
// The origin (/tipps/<slug>) is always the canonical; publish there first and let it index.
//
// This module only PREPARES text (zero side effects) unless postToBluesky() is called
// explicitly with credentials present. Public posting stays the user's deliberate action.
// ──────────────────────────────────────────────────────────────────────────

const SITE_URL = 'https://web.redrabbit.media';

export interface DistributionKit {
    slug: string;
    title: string;
    canonical: string;
    linkedin: string;
    substack: string;
    mediumImportUrl: string;
    bluesky: string;
    mastodon: string;
}

const BLUESKY_MAX = 300;
const MASTODON_MAX = 500;

// Trim to a hard char budget at a word boundary, with an ellipsis. Accounts for a trailing
// " <url>" that must always survive intact (links are never truncated).
function clampWithLink(hook: string, url: string, max: number): string {
    const tail = ` ${url}`;
    const budget = max - tail.length;
    if (budget <= 0) return url; // pathological: link alone exceeds budget
    let h = hook.trim();
    if (h.length > budget) {
        h = h.slice(0, budget - 1).replace(/\s+\S*$/, '').trim() + '…';
    }
    return `${h}${tail}`;
}

export function buildDistributionKit(slug: string, blogDir = path.join(process.cwd(), 'content/blog')): DistributionKit {
    const file = path.join(blogDir, `${slug}.mdx`);
    if (!fs.existsSync(file)) throw new Error(`Artikel nicht gefunden: ${file}`);
    const { data } = matter(fs.readFileSync(file, 'utf8'));
    const title: string = (data.title || slug).toString();
    // featuredSnippet is the curated 40-60 word answer; excerpt is the shorter teaser.
    const hook: string = (data.excerpt || data.featuredSnippet || title).toString().trim();
    const canonical = `${SITE_URL}/tipps/${slug}`;

    // LinkedIn / Substack: TEASER + link only (no external canonical honored -> never full text).
    const linkedin = [
        title,
        '',
        hook,
        '',
        `Ganzer Artikel: ${canonical}`,
    ].join('\n');

    const substack = [
        hook,
        '',
        `Weiterlesen (voller Beitrag): ${canonical}`,
    ].join('\n');

    // Medium: the ONLY platform that sets rel=canonical back to the origin (via Import) ->
    // safe to syndicate the full text. This URL pre-fills Medium's importer.
    const mediumImportUrl = `https://medium.com/p/import?url=${encodeURIComponent(canonical)}`;

    return {
        slug,
        title,
        canonical,
        linkedin,
        substack,
        mediumImportUrl,
        bluesky: clampWithLink(hook, canonical, BLUESKY_MAX),
        mastodon: clampWithLink(hook, canonical, MASTODON_MAX),
    };
}

// Human-readable, paste-ready block for the publish mail / console.
export function renderKitText(kit: DistributionKit): string {
    return [
        `=== Distribution-Kit: ${kit.title} ===`,
        `Canonical (Original, zuerst indexieren lassen): ${kit.canonical}`,
        '',
        'Regel: nur Medium bekommt Volltext (setzt canonical via Import). LinkedIn/Substack',
        'nur Teaser + Link, nie den ganzen Text (sonst Duplicate-Content/Kannibalisierung).',
        '',
        '--- LinkedIn (Teaser + Link, Firmenseite) ---',
        kit.linkedin,
        '',
        '--- Substack (Teaser + Link) ---',
        kit.substack,
        '',
        '--- Medium (Volltext, canonical-sicher): diese URL oeffnen ---',
        kit.mediumImportUrl,
        '',
        `--- Bluesky (<=${BLUESKY_MAX}) ---`,
        kit.bluesky,
        '',
        `--- Mastodon (<=${MASTODON_MAX}) ---`,
        kit.mastodon,
    ].join('\n');
}

// ── Opt-in Bluesky auto-post ────────────────────────────────────────────────
// Posts ONLY when both env creds are set AND this is called explicitly (--post-bluesky).
// Bluesky app-passwords are free (Settings -> App Passwords); ToS sanctions automation.
// Returns the created post URI, or null if creds are absent (no throw -> safe to call blindly).
export async function postToBluesky(text: string): Promise<string | null> {
    const handle = process.env.BLUESKY_HANDLE;
    const appPassword = process.env.BLUESKY_APP_PASSWORD;
    if (!handle || !appPassword) return null;
    const base = process.env.BLUESKY_PDS || 'https://bsky.social';

    const sessRes = await fetch(`${base}/xrpc/com.atproto.server.createSession`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: handle, password: appPassword }),
    });
    if (!sessRes.ok) throw new Error(`Bluesky-Login fehlgeschlagen: ${sessRes.status} ${await sessRes.text()}`);
    const sess = await sessRes.json();

    const postRes = await fetch(`${base}/xrpc/com.atproto.repo.createRecord`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sess.accessJwt}` },
        body: JSON.stringify({
            repo: sess.did,
            collection: 'app.bsky.feed.post',
            record: { $type: 'app.bsky.feed.post', text, createdAt: new Date().toISOString() },
        }),
    });
    if (!postRes.ok) throw new Error(`Bluesky-Post fehlgeschlagen: ${postRes.status} ${await postRes.text()}`);
    return (await postRes.json()).uri ?? null;
}

// ── CLI ─────────────────────────────────────────────────────────────────────
function arg(name: string): string | undefined {
    const i = process.argv.indexOf(`--${name}`);
    return i !== -1 ? process.argv[i + 1] : undefined;
}

async function cli() {
    const slug = arg('slug');
    if (!slug) {
        process.stderr.write('Usage: tsx distribution.ts --slug <slug> [--out] [--post-bluesky]\n');
        process.exit(1);
    }
    const kit = buildDistributionKit(slug);
    const text = renderKitText(kit);
    process.stdout.write(text + '\n');

    if (process.argv.includes('--out')) {
        const dir = path.join(process.cwd(), 'scripts/content-engine/.work', slug);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'distribution.md'), text);
        process.stderr.write(`\n[geschrieben] ${path.join(dir, 'distribution.md')}\n`);
    }

    if (process.argv.includes('--post-bluesky')) {
        const uri = await postToBluesky(kit.bluesky);
        process.stderr.write(uri ? `\n[Bluesky] gepostet: ${uri}\n` : '\n[Bluesky] uebersprungen (keine Creds: BLUESKY_HANDLE/BLUESKY_APP_PASSWORD)\n');
    }
}

// Run as CLI only when invoked directly (not when imported).
if (process.argv[1] && process.argv[1].endsWith('distribution.ts')) {
    cli().catch((e) => {
        process.stderr.write(`FEHLER: ${e.message}\n`);
        process.exit(1);
    });
}
