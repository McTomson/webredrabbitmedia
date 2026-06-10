import fs from 'fs';
import path from 'path';

// Records a completed NotebookLM enrichment into the manifest after the agent added sources
// via the MCP. Idempotent: merges addedUrls, recomputes count, stamps updatedAt.
// Usage: tsx notebooklm_record.ts <cluster> <notebookUrl> <sourceUrl...>

const MANIFEST = path.join(process.cwd(), 'content-engine/knowledge/notebooklm-manifest.json');
const CLUSTER_NAMES: Record<number, string> = {
    1: 'Strategie & Kosten', 2: 'Technik & Performance', 3: 'KI & Automatisierung',
    4: 'SEO & GEO', 5: 'Design & UX', 6: 'Recht & Sicherheit', 7: 'Wartung & Analyse',
};

function main() {
    const [clusterArg, notebookUrl, ...urls] = process.argv.slice(2);
    const cluster = Number(clusterArg);
    if (!cluster || !CLUSTER_NAMES[cluster] || !notebookUrl) {
        console.error('Usage: tsx notebooklm_record.ts <cluster 1-7> <notebookUrl> <sourceUrl...>');
        process.exit(1);
    }
    const today = new Date().toISOString().slice(0, 10);
    let manifest: { updatedAt?: string; clusters: Record<string, any> };
    try {
        manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
    } catch {
        manifest = { clusters: {} };
    }
    const prev = manifest.clusters[String(cluster)] || {};
    const merged = [...new Set([...(prev.addedUrls || []), ...urls])];
    manifest.clusters[String(cluster)] = {
        name: CLUSTER_NAMES[cluster],
        notebookUrl,
        addedUrls: merged,
        sources: merged.length,
        updatedAt: today,
    };
    manifest.updatedAt = today;
    fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
    fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`Cluster ${cluster} (${CLUSTER_NAMES[cluster]}): ${merged.length} Quellen, Notebook ${notebookUrl}`);
}

main();
