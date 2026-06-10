import fs from 'fs';
import path from 'path';
import { loadVault, isStale, type VaultFact } from '@/scripts/content-engine/lib/vault';
import { getOverview, CLUSTER_NAMES } from './overview';

// Moat / knowledge data layer (Phase 2). Read-only over the single source of truth:
// the vault markdown (own verified facts), the opinion pool (Thomas' first-hand takes),
// and the per-cluster NotebookLM manifest. Surfaces what the system needs FROM the user
// (interview gaps, facts due for re-check) so Pre-Mortem #5 (the moat starving) stays visible.

const ROOT = process.cwd();
const CE = path.join(ROOT, 'content-engine');

export interface ClusterCount {
    cluster: number;
    name: string;
    count: number;
}

export interface CoverageRow {
    cluster: number;
    name: string;
    opinions: number;
    vaultFacts: number;
    liveArticles: number;
    todoTopics: number;
    needsInterview: boolean; // has content/backlog but no captured opinion → policy + quality risk
}

export interface NotebookRow {
    cluster: number;
    name: string;
    notebookUrl?: string;
    sources: number;
    updatedAt?: string;
}

export interface KnowledgeData {
    today: string;
    vault: {
        total: number;
        fresh: number;
        stale: number;
        perCluster: ClusterCount[];
        staleFacts: Array<{ aussage: string; quelle: string; recheckNach: string; cluster: number }>;
    };
    opinions: {
        total: number;
        perCluster: ClusterCount[];
    };
    coverage: CoverageRow[];
    notebooklm: { configured: boolean; rows: NotebookRow[] } | null;
    tasks: {
        interviewClusters: Array<{ cluster: number; name: string }>;
        staleCount: number;
    };
}

const CLUSTERS = Object.keys(CLUSTER_NAMES).map(Number);

function readText(file: string): string {
    try {
        return fs.readFileSync(file, 'utf8');
    } catch {
        return '';
    }
}

// Parse the opinion pool. Each entry header carries "Cluster <c>" (sometimes "7/1"); an entry
// counts toward every cluster number it names, so a cross-cluster take is not lost.
export function parseOpinionClusters(md: string): number[][] {
    const blocks = md.split(/\n##\s+/).slice(1);
    const out: number[][] = [];
    for (const b of blocks) {
        const header = b.split('\n')[0];
        const m = header.match(/Cluster\s*([0-9/, ]+)/i);
        const nums = m ? (m[1].match(/[1-7]/g) || []).map(Number) : [];
        out.push([...new Set(nums)]);
    }
    return out;
}

function byCluster(getCluster: (i: number) => number[], n: number): Record<number, number> {
    const counts: Record<number, number> = {};
    for (const c of CLUSTERS) counts[c] = 0;
    for (let i = 0; i < n; i++) for (const c of getCluster(i)) if (counts[c] !== undefined) counts[c]++;
    return counts;
}

function readNotebookManifest(): { configured: boolean; rows: NotebookRow[] } | null {
    const file = path.join(CE, 'knowledge/notebooklm-manifest.json');
    try {
        const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as {
            clusters?: Record<string, { notebookUrl?: string; sources?: number; updatedAt?: string }>;
        };
        const rows: NotebookRow[] = CLUSTERS.map((cluster) => {
            const entry = raw.clusters?.[String(cluster)] || {};
            return { cluster, name: CLUSTER_NAMES[cluster], notebookUrl: entry.notebookUrl, sources: entry.sources || 0, updatedAt: entry.updatedAt };
        });
        return { configured: rows.some((r) => r.notebookUrl), rows };
    } catch {
        return null; // no manifest yet → tab shows the "not set up" hint
    }
}

export async function getKnowledge(): Promise<KnowledgeData> {
    const today = new Date().toISOString().slice(0, 10);

    // Vault
    const facts: VaultFact[] = loadVault();
    const vaultPerCluster = byCluster((i) => [facts[i].cluster], facts.length);
    const staleFacts = facts.filter((f) => isStale(f, today));

    // Opinions
    const opinionClusters = parseOpinionClusters(readText(path.join(CE, 'opinions/pool.md')));
    const opPerCluster = byCluster((i) => opinionClusters[i], opinionClusters.length);

    // Cluster topic stats reuse the overview SoT reader (DRY).
    const overview = await getOverview();
    const ov = new Map(overview.perCluster.map((c) => [c.cluster, c]));

    const coverage: CoverageRow[] = CLUSTERS.map((cluster) => {
        const o = ov.get(cluster);
        const opinions = opPerCluster[cluster] || 0;
        const liveArticles = o?.liveArticles || 0;
        const todoTopics = o?.todo || 0;
        return {
            cluster,
            name: CLUSTER_NAMES[cluster],
            opinions,
            vaultFacts: vaultPerCluster[cluster] || 0,
            liveArticles,
            todoTopics,
            needsInterview: opinions === 0 && liveArticles + todoTopics > 0,
        };
    });

    const toClusterCount = (rec: Record<number, number>): ClusterCount[] =>
        CLUSTERS.map((c) => ({ cluster: c, name: CLUSTER_NAMES[c], count: rec[c] || 0 }));

    return {
        today,
        vault: {
            total: facts.length,
            fresh: facts.length - staleFacts.length,
            stale: staleFacts.length,
            perCluster: toClusterCount(vaultPerCluster),
            staleFacts: staleFacts.slice(0, 20).map((f) => ({ aussage: f.aussage, quelle: f.quelle, recheckNach: f.recheckNach, cluster: f.cluster })),
        },
        opinions: {
            total: opinionClusters.length,
            perCluster: toClusterCount(opPerCluster),
        },
        coverage,
        notebooklm: readNotebookManifest(),
        tasks: {
            interviewClusters: coverage.filter((c) => c.needsInterview).map((c) => ({ cluster: c.cluster, name: c.name })),
            staleCount: staleFacts.length,
        },
    };
}
