import path from 'path';
import { relinkAll } from '../lib/clusterLinks';

// One-time + repeatable backfill: give every published article a deterministic
// "Das könnte Sie auch interessieren" block linking its most-related cluster-mates
// (/tipps/{slug}). Fixes the on-page-audit finding (19/21 articles had <2 in-content
// internal links) and builds bidirectional topical-authority links. Idempotent — safe
// to re-run; the same step runs automatically per-publish inside run-media.
//
//   npm run cluster:relink            # write
//   npm run cluster:relink -- --dry-run

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'content/blog');

function main() {
    const dryRun = process.argv.includes('--dry-run');
    const results = relinkAll(BLOG_DIR, { dryRun });
    const changed = results.filter((r) => r.changed);
    const empty = results.filter((r) => r.targets.length === 0);

    for (const r of results) {
        const flag = r.changed ? (dryRun ? '[würde ändern]' : '[geändert]') : '[unverändert]';
        console.log(`${flag} ${r.slug} -> ${r.targets.join(', ') || '(keine Cluster-Treffer)'}`);
    }
    console.log(
        `\n${results.length} Artikel geprüft, ${changed.length} ${dryRun ? 'zu ändern' : 'geändert'}` +
        (empty.length ? `, ${empty.length} ohne verwandte Artikel` : '') +
        (dryRun ? ' (Trockenlauf, nichts geschrieben).' : '.'),
    );
}

main();
