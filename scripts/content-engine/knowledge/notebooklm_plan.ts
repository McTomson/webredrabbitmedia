import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Plans the per-cluster NotebookLM enrichment (Phase 2 directive: the system grows with
// knowledge). For each cluster it collects the source URLs to feed the cluster notebook:
// the live article URL plus every verified source cited in that article. It diffs against
// what was already added (manifest.addedUrls) and writes the pending list.
//
// It does NOT call NotebookLM itself — a node script cannot reach the MCP. The agent runs
// this to get the plan, then performs add_source / notebook registration via the NotebookLM
// MCP tools, and records the result back into the manifest. Re-running is safe and idempotent.

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'content/blog');
const MANIFEST = path.join(ROOT, 'content-engine/knowledge/notebooklm-manifest.json');
const BASE_URL = 'https://web.redrabbit.media';

const CLUSTER_NAMES: Record<number, string> = {
    1: 'Strategie & Kosten',
    2: 'Technik & Performance',
    3: 'KI & Automatisierung',
    4: 'SEO & GEO',
    5: 'Design & UX',
    6: 'Recht & Sicherheit',
    7: 'Wartung & Analyse',
};

interface ClusterEntry {
    name: string;
    notebookUrl?: string;
    sources?: number;
    addedUrls?: string[];
    updatedAt?: string;
}
interface Manifest {
    updatedAt?: string;
    clusters: Record<string, ClusterEntry>;
}

function loadManifest(): Manifest {
    try {
        return JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) as Manifest;
    } catch {
        return { clusters: {} };
    }
}

function main() {
    const today = new Date().toISOString().slice(0, 10);
    const onlyCluster = process.argv.find((a) => /^\d$/.test(a));
    const manifest = loadManifest();

    // cluster -> set of candidate source URLs (article URL + its cited sources)
    const wanted: Record<number, Set<string>> = {};
    for (const c of Object.keys(CLUSTER_NAMES).map(Number)) wanted[c] = new Set();

    for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))) {
        const fm = matter(fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')).data as any;
        const cluster = Number(fm.cluster) || 0;
        if (!wanted[cluster]) continue;
        const slug = (fm.slug || file.replace('.mdx', '')).toString();
        wanted[cluster].add(`${BASE_URL}/tipps/${slug}`);
        for (const s of (Array.isArray(fm.sources) ? fm.sources : [])) {
            if (s?.url && /^https?:\/\//.test(s.url)) wanted[cluster].add(s.url);
        }
    }

    console.log('NotebookLM-Anreicherungsplan pro Cluster:\n');
    for (const c of Object.keys(CLUSTER_NAMES).map(Number)) {
        if (onlyCluster && Number(onlyCluster) !== c) continue;
        const entry = manifest.clusters[String(c)] || { name: CLUSTER_NAMES[c] };
        const added = new Set(entry.addedUrls || []);
        const pending = [...wanted[c]].filter((u) => !added.has(u));
        const status = entry.notebookUrl ? `Notebook: ${entry.notebookUrl}` : 'NOTEBOOK FEHLT (anlegen + Share-URL eintragen)';
        console.log(`Cluster ${c} (${CLUSTER_NAMES[c]}): ${status}`);
        console.log(`  bereits hinzugefuegt: ${added.size} | offen: ${pending.length}`);
        for (const u of pending.slice(0, 12)) console.log(`    + ${u}`);
        if (pending.length > 12) console.log(`    ... und ${pending.length - 12} weitere`);
        console.log('');
    }

    console.log('Naechster Schritt (Agent): pro Cluster ein NotebookLM-Notebook registrieren (mcp add_notebook),');
    console.log('die offenen URLs via mcp add_source hinzufuegen, dann record_added() im Manifest nachziehen.');
    console.log(`Manifest: ${MANIFEST}`);
}

main();
