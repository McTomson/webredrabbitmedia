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
const STATUS_FILE = path.join(CE, '.indexation.json');

function publishedSlugs(): string[] {
    const dir = path.join(ROOT, 'content/blog');
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('.mdx'))
        .filter((f) => {
            try {
                const fm = matter(fs.readFileSync(path.join(dir, f), 'utf8')).data as { status?: string };
                return fm.status !== 'draft';
            } catch {
                return false;
            }
        })
        .map((f) => f.replace(/\.mdx$/, ''));
}

async function main() {
    const dryRun = process.argv.includes('--dry-run');
    const slugs = publishedSlugs();
    const urls = slugs.map((s) => `${SITE}/tipps/${s}`);
    console.log(`Indexierungs-Check: ${urls.length} veroeffentlichte Artikel, Schwelle ${Math.round(THRESHOLD * 100)}% (min. ${MIN_SAMPLE} fuer Kill-Switch).`);

    const res = await getIndexationStatus(urls);
    if (res.state !== 'ok') {
        console.error(`ABBRUCH (${res.state}): ${res.message}`);
        process.exit(1);
    }
    const { total, indexed, rate, perUrl } = res.data;
    const now = new Date().toISOString();
    console.log(`Ergebnis: ${indexed}/${total} indexiert (${Math.round(rate * 100)}%).`);
    perUrl.filter((u) => !u.indexed).forEach((u) => console.log(`  NICHT indexiert: ${u.url} [${u.state}]`));

    fs.writeFileSync(STATUS_FILE, JSON.stringify({ checkedAt: now, rate, indexed, total, threshold: THRESHOLD, perUrl }, null, 2));

    const shouldTrip = total >= MIN_SAMPLE && rate < THRESHOLD;
    const state: KillSwitchState = shouldTrip
        ? { active: true, reason: `Indexierungsrate ${Math.round(rate * 100)}% < ${Math.round(THRESHOLD * 100)}% (${indexed}/${total})`, rate, indexed, total, since: now }
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
