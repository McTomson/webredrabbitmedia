/*
 * Local-Rank puller. Scans the Vienna grid for our Local-Finder position across
 * the buyer keywords, computes SoLV/ATRP/ARP, and writes a JSON snapshot the
 * dashboard reads. READ-ONLY: it never touches the live GBP.
 *
 *   npx tsx scripts/content-engine/local-rank/pull.ts          # live (needs DataForSEO creds) or fixture fallback
 *   npx tsx scripts/content-engine/local-rank/pull.ts --demo   # force fixture → writes demo.json
 *   npx tsx scripts/content-engine/local-rank/pull.ts --dry    # print grid + cost estimate, no calls
 *
 * Credentials (server-only, in .env.local or the shell):
 *   DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD   → enables live pulls
 *   RR_GBP_PLACE_ID                         → exact listing match (recommended)
 *
 * Scheduling (later, not auto-enabled): weekly, off-peak, like the blog engine
 * (launchd on the Mac bot-worktree, or the redrabbit-blog systemd timer on the VPS).
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildGrid } from '../../../lib/localrank/geo';
import { computeKpis, computeOverall } from '../../../lib/localrank/kpi';
import { CENTER, GRID_SIZE, SPACING_KM, SCAN_DEPTH, KEYWORDS, BUSINESS, GA_LANGUAGE } from '../../../lib/localrank/config';
import type { LocalRankSnapshot, KeywordGrid, RankCell } from '../../../lib/localrank/types';
import { DataForSeoProvider, FixtureProvider, type RankProvider } from './provider';

const DIR = path.join(process.cwd(), 'content-engine/local-rank');
const COST_PER_SERP = 0.002; // DataForSEO Live Maps, verified 2026-08-16

function loadDotEnvLocal(): void {
    // Self-contained .env.local loader so the CLI works outside Next. Does not override existing env.
    const file = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(file)) return;
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
        if (!m) continue;
        const key = m[1];
        let val = m[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
        if (process.env[key] === undefined) process.env[key] = val;
    }
}

function pickProvider(forceDemo: boolean): { provider: RankProvider; live: boolean } {
    const login = process.env.DATAFORSEO_LOGIN;
    const password = process.env.DATAFORSEO_PASSWORD;
    if (!forceDemo && login && password) {
        return {
            provider: new DataForSeoProvider(login, password, {
                scanDepth: SCAN_DEPTH,
                languageCode: GA_LANGUAGE,
                device: 'desktop',
                placeId: BUSINESS.placeId || undefined,
                nameMatch: BUSINESS.nameMatch,
            }),
            live: true,
        };
    }
    return { provider: new FixtureProvider(CENTER, SCAN_DEPTH), live: false };
}

// Small concurrency pool so a live pull finishes in a couple of minutes without hammering the API.
async function mapPool<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
    const out: R[] = new Array(items.length);
    let next = 0;
    async function worker() {
        while (next < items.length) {
            const i = next++;
            out[i] = await fn(items[i], i);
        }
    }
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
    return out;
}

async function main() {
    loadDotEnvLocal();
    const args = new Set(process.argv.slice(2));
    const forceDemo = args.has('--demo');
    const dry = args.has('--dry');

    const points = buildGrid(CENTER.lat, CENTER.lng, GRID_SIZE, SPACING_KM);
    const totalCalls = points.length * KEYWORDS.length;

    const { provider, live } = pickProvider(forceDemo);
    console.log(`[local-rank] center=${CENTER.lat},${CENTER.lng} grid=${GRID_SIZE}x${GRID_SIZE} points=${points.length} keywords=${KEYWORDS.length}`);
    console.log(`[local-rank] provider=${provider.name} (${live ? 'LIVE' : 'fixture'}) totalCalls=${totalCalls}` + (live ? ` estCost=$${(totalCalls * COST_PER_SERP).toFixed(3)}` : ''));
    if (live && !BUSINESS.placeId) console.warn('[local-rank] WARN: RR_GBP_PLACE_ID not set — matching by name substring, less reliable.');

    if (dry) {
        console.log('[local-rank] --dry: no calls made.');
        return;
    }

    const keywordGrids: KeywordGrid[] = [];
    for (const keyword of KEYWORDS) {
        const cells: RankCell[] = await mapPool(points, live ? 4 : 16, async (p) => {
            let rank: number | null = null;
            try {
                rank = (await provider.fetchRank(keyword, p.lat, p.lng)).rank;
            } catch (e) {
                // One failed point must not abort the whole pull — count it as unranked and log.
                console.warn(`[local-rank] ${keyword} @ ${p.id}: ${e instanceof Error ? e.message : e}`);
                rank = null;
            }
            return { pointId: p.id, row: p.row, col: p.col, rank };
        });
        keywordGrids.push({ keyword, cells, kpis: computeKpis(cells) });
        console.log(`[local-rank] "${keyword}": SoLV ${(computeKpis(cells).solv * 100).toFixed(0)}% ATRP ${computeKpis(cells).atrp}`);
    }

    const snapshot: LocalRankSnapshot = {
        takenAt: new Date().toISOString(),
        source: live ? 'dataforseo' : 'demo',
        center: CENTER,
        gridSize: GRID_SIZE,
        spacingKm: SPACING_KM,
        scanDepth: SCAN_DEPTH,
        keywords: keywordGrids,
        overall: computeOverall(keywordGrids),
    };

    fs.mkdirSync(DIR, { recursive: true });
    const target = live ? 'latest.json' : 'demo.json';
    fs.writeFileSync(path.join(DIR, target), JSON.stringify(snapshot, null, 2));
    if (live) {
        fs.mkdirSync(path.join(DIR, 'history'), { recursive: true });
        fs.writeFileSync(path.join(DIR, 'history', `${snapshot.takenAt.slice(0, 10)}.json`), JSON.stringify(snapshot, null, 2));
    }
    console.log(`[local-rank] wrote ${target} — overall SoLV ${(snapshot.overall.solv * 100).toFixed(0)}% ATRP ${snapshot.overall.atrp} ARP ${snapshot.overall.arp ?? 'n/a'}`);
}

main().catch((e) => {
    console.error('[local-rank] FATAL', e);
    process.exit(1);
});
