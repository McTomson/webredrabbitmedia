import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Bidirectional internal cluster linking (§ topical authority, the #1 on-page lever:
// the on-page audit showed 19/21 live articles had <2 in-content internal links). Every
// published article gets a deterministic "Das könnte Sie auch interessieren" block linking
// to its most-related published cluster-mates. The relatedness scoring MIRRORS
// lib/blog/posts.ts getRelatedPosts (category +3, same cluster +2, shared tag +1) so the
// in-body links stay consistent with the runtime sidebar. Links target /tipps/{slug} (the
// real route — NOT /blog/). Drafts are never link targets (would 404). The block is wrapped
// in MDX comment markers so re-running is idempotent (replace, never duplicate). Frontmatter
// is preserved byte-for-byte: we only ever touch the body half of the file.

export const LINK_START = '{/* cluster-links:start */}';
export const LINK_END = '{/* cluster-links:end */}';
const LINK_HEADING = '## Das könnte Sie auch interessieren';
const LINK_INTRO = 'Passend dazu aus unserem Ratgeber:';
const DEFAULT_LIMIT = 3;

export interface PostLite {
    slug: string;
    title: string;
    category: string;
    cluster?: number;
    tags: string[];
    status: 'draft' | 'published';
    filePath: string;
    head: string; // raw frontmatter block incl. closing ---\n, byte-preserved
    body: string; // everything after the frontmatter
}

export interface RelinkResult {
    slug: string;
    targets: string[]; // slugs linked to
    changed: boolean; // file content actually differed
}

// Split a raw .mdx file into its verbatim frontmatter head and the body. We do NOT
// re-serialize the frontmatter (gray-matter stringify would reformat YAML / re-quote dates).
function splitFrontmatter(raw: string): { head: string; body: string } {
    const m = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
    if (!m) return { head: '', body: raw };
    return { head: m[0], body: raw.slice(m[0].length) };
}

// Slugs that have a bespoke hardcoded route (app/tipps/{slug}/page.tsx) take precedence over
// the dynamic [slug] MDX route. Their MDX body is NEVER rendered, so we must not write a dead
// link block into it (and the on-page audit must not grade it). They remain valid link TARGETS
// because the route resolves. Derived from blogDir (ROOT/content/blog -> ROOT/app/tipps).
export function hardcodedSlugs(blogDir: string): Set<string> {
    const out = new Set<string>();
    const tippsDir = path.join(path.resolve(blogDir, '..', '..'), 'app', 'tipps');
    if (!fs.existsSync(tippsDir)) return out;
    for (const entry of fs.readdirSync(tippsDir, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name === '[slug]') continue;
        if (fs.existsSync(path.join(tippsDir, entry.name, 'page.tsx'))) out.add(entry.name);
    }
    return out;
}

export function loadPosts(blogDir: string): PostLite[] {
    if (!fs.existsSync(blogDir)) return [];
    const posts: PostLite[] = [];
    for (const file of fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx'))) {
        const filePath = path.join(blogDir, file);
        const raw = fs.readFileSync(filePath, 'utf8');
        const fm = matter(raw).data as Record<string, unknown>;
        const { head, body } = splitFrontmatter(raw);
        posts.push({
            slug: (fm.slug as string) || file.replace(/\.mdx$/, ''),
            title: (fm.title as string) || file.replace(/\.mdx$/, ''),
            category: (fm.category as string) || '',
            cluster: typeof fm.cluster === 'number' ? (fm.cluster as number) : undefined,
            tags: Array.isArray(fm.tags) ? (fm.tags as string[]) : [],
            // Missing status = legacy article = published (mirrors lib/blog/posts.ts).
            status: fm.status === 'draft' ? 'draft' : 'published',
            filePath,
            head,
            body,
        });
    }
    return posts;
}

// Readable anchor text: drop the bracketed SEO suffix ("... [Echte Preise & ROI]") and
// collapse whitespace. Keeps the keyword-rich question form, which is good anchor text.
export function cleanAnchor(title: string): string {
    return title
        .replace(/\s*\[[^\]]*\]\s*$/, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Deterministic relatedness ranking, mirroring getRelatedPosts. linkable = published OR
// force-included (the just-going-live article, even if its file still reads draft for a
// moment). Tiebreak by slug asc so the output is stable across runs.
export function scoreRelated(
    post: PostLite,
    all: PostLite[],
    limit = DEFAULT_LIMIT,
    forceInclude: Set<string> = new Set(),
): PostLite[] {
    return all
        .filter((p) => p.slug !== post.slug)
        .filter((p) => p.status !== 'draft' || forceInclude.has(p.slug))
        .map((p) => {
            let score = 0;
            if (p.category && p.category === post.category) score += 3;
            if (p.cluster && post.cluster && p.cluster === post.cluster) score += 2;
            score += p.tags.filter((t) => post.tags.includes(t)).length;
            return { p, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => (b.score - a.score) || a.p.slug.localeCompare(b.p.slug))
        .slice(0, limit)
        .map((x) => x.p);
}

export function buildBlock(targets: PostLite[]): string {
    const items = targets.map((t) => `- [${cleanAnchor(t.title)}](/tipps/${t.slug})`).join('\n');
    return `${LINK_START}\n\n${LINK_HEADING}\n\n${LINK_INTRO}\n\n${items}\n\n${LINK_END}`;
}

// Insert or replace the link block in a body. SURGICAL: only the seams around the block are
// touched — unrelated body whitespace is never reformatted (clean diffs). Idempotent in a single
// run: re-injecting yields byte-identical output. If markers exist, replace between them;
// otherwise insert before the trailing author signature footer (---\n**Thomas...), else append.
export function injectBlock(body: string, block: string): string {
    const startIdx = body.indexOf(LINK_START);
    if (startIdx !== -1) {
        const endIdx = body.indexOf(LINK_END, startIdx);
        if (endIdx !== -1) {
            const before = body.slice(0, startIdx).replace(/\s+$/, '');
            const after = body.slice(endIdx + LINK_END.length).replace(/^\s+/, '').replace(/\s+$/, '');
            return after ? `${before}\n\n${block}\n\n${after}\n` : `${before}\n\n${block}\n`;
        }
    }
    // Footer = the trailing "---" separator immediately preceding the author signature.
    const footer = body.match(/\n+---\s*\n+\*\*[^\n]*Uhlir[\s\S]*$/);
    if (footer && footer.index !== undefined) {
        const before = body.slice(0, footer.index).replace(/\s+$/, '');
        const footerBlock = footer[0].replace(/^\s+/, '').replace(/\s+$/, '');
        return `${before}\n\n${block}\n\n${footerBlock}\n`;
    }
    return `${body.replace(/\s+$/, '')}\n\n${block}\n`;
}

// Relink every published article (plus force-included slugs). Returns a per-article report.
export function relinkAll(
    blogDir: string,
    opts: { dryRun?: boolean; forceInclude?: string[]; limit?: number } = {},
): RelinkResult[] {
    const force = new Set(opts.forceInclude || []);
    const limit = opts.limit ?? DEFAULT_LIMIT;
    const posts = loadPosts(blogDir);
    const hardcoded = hardcodedSlugs(blogDir);
    const results: RelinkResult[] = [];

    for (const post of posts) {
        // A bespoke hardcoded route renders instead of the MDX body — never write a dead block.
        if (hardcoded.has(post.slug)) continue;
        // Only published (or force-included) articles get a block — drafts are not served.
        if (post.status === 'draft' && !force.has(post.slug)) continue;
        const targets = scoreRelated(post, posts, limit, force);
        if (targets.length === 0) {
            results.push({ slug: post.slug, targets: [], changed: false });
            continue;
        }
        const block = buildBlock(targets);
        const newBody = injectBlock(post.body, block);
        const newRaw = post.head + newBody;
        const oldRaw = post.head + post.body;
        const changed = newRaw !== oldRaw;
        if (changed && !opts.dryRun) fs.writeFileSync(post.filePath, newRaw);
        results.push({ slug: post.slug, targets: targets.map((t) => t.slug), changed });
    }
    return results;
}
