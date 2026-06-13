import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { ROOT, CE } from '../lib/roles';
import { writeKillSwitch, type KillSwitchState } from '../lib/killSwitch';
import { getIndexationStatus } from '../../../lib/dashboard/google';

// Scheduled indexation check + kill-switch toggle. Inspects every published article
// via the GSC URL Inspection API and computes the indexation rate. If the rate falls
// below RR_INDEXATION_MIN (default 0.6), it raises the kill-switch so the daily engine
// stops publishing onto a possibly-penalised/deindexed site. Writes a status file the
// dashboard reads. Run: npx tsx scripts/content-engine/dashboard/check_indexation.ts
//
// Safe by design: needs at least RR_INDEXATION_MIN_SAMPLE (default 5) live articles before
// it will ever raise the switch — a brand-new site with few/unindexed pages won't trip it.

const SITE = process.env.GSC_SITE_URL || 'https://web.redrabbit.media';
const THRESHOLD = Number(process.env.RR_INDEXATION_MIN || '0.6');
const MIN_SAMPLE = Number(process.env.RR_INDEXATION_MIN_SAMPLE || '5');
// Grace period: a freshly published OR freshly renamed URL is not yet expected to be in
// Google's index (crawl/index lag is days-to-weeks, esp. for a low-authority site). Counting
// such URLs as "not indexed" falsely drags the rate down and trips the kill-switch — exactly
// what a bulk slug-rename caused (4 new URLs "unknown to Google" -> 50% -> daily run paused).
// So URLs whose article was published/modified within RR_INDEXATION_GRACE_DAYS are EXCLUDED
// from the rate denominator (still reported, just not counted as a failure yet).
const GRACE_DAYS = Number(process.env.RR_INDEXATION_GRACE_DAYS || '21');
const STATUS_FILE = path.join(CE, '.indexation.json');

function daysSince(iso: string | undefined): number {
    if (!iso) return Number.POSITIVE_INFINITY;
    const t = Date.parse(iso);
    if (Number.isNaN(t)) return Number.POSITIVE_INFINITY;
    return (Date.now() - t) / 86_400_000;
}

// slug -> age in days (the YOUNGER of publishedAt / updatedAt, since a rename bumps updatedAt).
function articleAgeBySlug(): Map<string, number> {
    const dir = path.join(ROOT, 'content/blog');
    const map = new Map<string, number>();
    if (!fs.existsSync(dir)) return map;
    for (const f of fs.readdirSync(dir)) {
        if (!f.endsWith('.mdx')) continue;
        try {
            const fm = matter(fs.readFileSync(path.join(dir, f), 'utf8')).data as {
                status?: string; publishedAt?: string; updatedAt?: string;
            };
            if (fm.status === 'draft') continue;
            map.set(f.replace(/\.mdx$/, ''), Math.min(daysSince(fm.publishedAt), daysSince(fm.updatedAt)));
        } catch {
            // ignore unreadable file
        }
    }
    return map;
}

async function main() {
    const dryRun = process.argv.includes('--dry-run');
    const ageBySlug = articleAgeBySlug();
    const slugs = [...ageBySlug.keys()];
    const urls = slugs.map((s) => `${SITE}/tipps/${s}`);
    console.log(`Indexierungs-Check: ${urls.length} veroeffentlichte Artikel, Schwelle ${Math.round(THRESHOLD * 100)}% (min. ${MIN_SAMPLE}, Schonfrist ${GRACE_DAYS} Tage).`);

    const res = await getIndexationStatus(urls);
    if (res.state !== 'ok') {
        console.error(`ABBRUCH (${res.state}): ${res.message}`);
        process.exit(1);
    }
    const now = new Date().toISOString();
    const ageForUrl = (url: string) => ageBySlug.get(url.replace(/.*\/tipps\//, '')) ?? Number.POSITIVE_INFINITY;

    // Split into "mature" (old enough that Google should have indexed it) vs "grace" (too new).
    const perUrl = res.data.perUrl.map((u) => ({ ...u, ageDays: ageForUrl(u.url), graced: ageForUrl(u.url) < GRACE_DAYS }));
    const mature = perUrl.filter((u) => !u.graced);
    const graced = perUrl.filter((u) => u.graced);
    const total = mature.length;
    const indexed = mature.filter((u) => u.indexed).length;
    const rate = total > 0 ? indexed / total : 1;

    console.log(`Ergebnis (reif, >= ${GRACE_DAYS}T): ${indexed}/${total} indexiert (${Math.round(rate * 100)}%). In Schonfrist: ${graced.length} (zaehlen nicht).`);
    mature.filter((u) => !u.indexed).forEach((u) => console.log(`  NICHT indexiert (reif): ${u.url} [${u.state}]`));
    graced.filter((u) => !u.indexed).forEach((u) => console.log(`  in Schonfrist, noch nicht indexiert (ok): ${u.url} [${u.state}, ~${Math.round(u.ageDays)}T alt]`));

    fs.writeFileSync(STATUS_FILE, JSON.stringify({ checkedAt: now, rate, indexed, total, graced: graced.length, threshold: THRESHOLD, graceDays: GRACE_DAYS, perUrl }, null, 2));

    const shouldTrip = total >= MIN_SAMPLE && rate < THRESHOLD;
    const state: KillSwitchState = shouldTrip
        ? { active: true, reason: `Indexierungsrate ${Math.round(rate * 100)}% < ${Math.round(THRESHOLD * 100)}% (${indexed}/${total} reife Artikel)`, rate, indexed, total, since: now }
        : { active: false, rate, indexed, total, since: now };

    if (dryRun) {
        console.log(`[--dry-run] wuerde Kill-Switch setzen: active=${state.active}${state.reason ? ` (${state.reason})` : ''}`);
        return;
    }
    writeKillSwitch(state);
    console.log(state.active ? `KILL-SWITCH AKTIV: ${state.reason} — Tageslauf pausiert.` : 'Kill-Switch inaktiv (Indexierung ok).');
}

main().catch((e) => {
    console.error('INDEXATION-CHECK-FEHLER:', e instanceof Error ? e.message : e);
    process.exit(1);
});
